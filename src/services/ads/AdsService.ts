import { Platform } from 'react-native';
import { 
  InterstitialAd, 
  AdEventType, 
  MobileAds, 
  AdsConsent, 
  AdsConsentStatus,
  AdsConsentPrivacyOptionsRequirementStatus
} from 'react-native-google-mobile-ads';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import { 
  ADS_ENABLED, 
  ADS_TEST_MODE, 
  adUnits, 
  CALCS_BEFORE_INTERSTITIAL, 
  INTERSTITIAL_COOLDOWN_MS, 
  INTERSTITIAL_RETRY_DELAYS_MS 
} from './adConfig';

class AdsService {
  private isInitialized = false;
  private canRequestAds = false;
  private interstitialAd: InterstitialAd | null = null;
  private isInterstitialLoaded = false;
  private isAdLoading = false;
  private isShowingAd = false;

  private calculationsSinceLastAd = 0;
  private lastAdShowTime = 0; // Timestamp (ms) of the last displayed interstitial

  private retryAttempt = 0;
  private retryTimeout: ReturnType<typeof setTimeout> | null = null;
  private unsubscribeListeners: (() => void)[] = [];
  private readyListeners: (() => void)[] = [];

  /**
   * Returns true if AdMob SDK is initialized and user consent permits requesting ads.
   */
  isReadyToServe(): boolean {
    return this.isInitialized && this.canRequestAds;
  }

  /**
   * Subscribes to readiness changes. If already ready, invokes callback immediately.
   * Returns an unsubscribe cleanup function.
   */
  onReady(callback: () => void): () => void {
    if (this.isReadyToServe()) {
      callback();
      return () => {};
    }
    this.readyListeners.push(callback);
    return () => {
      this.readyListeners = this.readyListeners.filter((cb) => cb !== callback);
    };
  }

  private notifyReady() {
    if (this.isReadyToServe()) {
      const callbacks = [...this.readyListeners];
      this.readyListeners = [];
      callbacks.forEach((cb) => {
        try {
          cb();
        } catch {}
      });
    }
  }

  async initialize() {
    if (!ADS_ENABLED) return;
    if (Platform.OS !== 'android' && Platform.OS !== 'ios') return;
    if (this.isInitialized) return;

    try {
      if (ADS_TEST_MODE) {
        console.log('[Ads] Initializing AdMob with Google UMP consent review...');
      }

      // 1. Google User Messaging Platform (UMP) consent handling for applicable regions (EEA/UK)
      try {
        const consentInfo = await AdsConsent.requestInfoUpdate();
        if (consentInfo.isConsentFormAvailable && consentInfo.status === AdsConsentStatus.REQUIRED) {
          if (ADS_TEST_MODE) {
            console.log('[Ads] UMP consent form required. Presenting form to user...');
          }
          await AdsConsent.loadAndShowConsentFormIfRequired();
        }
      } catch (consentError) {
        console.warn('[Ads] UMP consent request error:', consentError);
      }

      // 2. Request App Tracking Transparency permission (Required by Apple on iOS)
      if (Platform.OS === 'ios') {
        try {
          await requestTrackingPermissionsAsync();
        } catch (attError) {
          console.warn('[Ads] ATT permission request failed', attError);
        }
      }

      // 3. Verify if consent state allows requesting ads
      try {
        const consentInfo = await AdsConsent.getConsentInfo();
        this.canRequestAds = consentInfo.canRequestAds;
      } catch {
        // Fallback if consent inspection is unavailable
        this.canRequestAds = true;
      }

      if (!this.canRequestAds) {
        console.log('[Ads] Ads cannot be requested based on user consent.');
        return;
      }

      // 4. Initialize MobileAds SDK
      await MobileAds().initialize();
      this.isInitialized = true;

      if (ADS_TEST_MODE) {
        console.log('[Ads] AdMob initialized successfully. Preloading interstitial...');
      }

      // 5. Notify any subscribers that the service is ready to request/render ads
      this.notifyReady();

      // 6. Preload initial interstitial
      this.preloadInterstitial();
    } catch (e) {
      console.warn('[Ads] Failed to initialize ads service:', e);
    }
  }

  private clearRetryTimeout() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
      this.retryTimeout = null;
    }
  }

  private cleanUpListeners() {
    this.unsubscribeListeners.forEach((unsub) => {
      try {
        unsub();
      } catch {}
    });
    this.unsubscribeListeners = [];
  }

  private cleanUpCurrentAd() {
    this.cleanUpListeners();
    this.interstitialAd = null;
  }

  private preloadInterstitial() {
    if (!ADS_ENABLED || !this.isInitialized || !this.canRequestAds || !adUnits.interstitial) {
      return;
    }
    // Prevent duplicate load requests or reloads while already loaded / showing
    if (this.isInterstitialLoaded || this.isAdLoading || this.isShowingAd) {
      return;
    }

    this.clearRetryTimeout();
    this.cleanUpCurrentAd();
    this.isAdLoading = true;

    try {
      const ad = InterstitialAd.createForAdRequest(adUnits.interstitial);
      this.interstitialAd = ad;

      const unsubLoaded = ad.addAdEventListener(AdEventType.LOADED, () => {
        if (ADS_TEST_MODE) {
          console.log('[Ads] Interstitial loaded successfully and ready.');
        }
        this.isInterstitialLoaded = true;
        this.isAdLoading = false;
        this.retryAttempt = 0;
        this.clearRetryTimeout();
      });

      // Update cooldown timestamp and reset calculation counter only when the ad actually opens
      const unsubOpened = ad.addAdEventListener(AdEventType.OPENED, () => {
        if (ADS_TEST_MODE) {
          console.log('[Ads] Interstitial opened and visible on screen.');
        }
        this.isShowingAd = true;
        this.lastAdShowTime = Date.now();
        this.calculationsSinceLastAd = 0;
      });

      const unsubClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
        if (ADS_TEST_MODE) {
          console.log('[Ads] Interstitial closed by user.');
        }
        this.isInterstitialLoaded = false;
        this.isShowingAd = false;
        this.retryAttempt = 0;
        this.clearRetryTimeout();
        // Preload next interstitial in background
        this.preloadInterstitial();
      });

      const unsubError = ad.addAdEventListener(AdEventType.ERROR, (error) => {
        console.warn('[Ads] Interstitial failed to load or present:', error);
        this.isInterstitialLoaded = false;
        this.isAdLoading = false;
        this.isShowingAd = false;
        // Notice: calculationsSinceLastAd is retained if OPENED never fired
        this.scheduleRetry();
      });

      this.unsubscribeListeners = [unsubLoaded, unsubOpened, unsubClosed, unsubError];
      ad.load();
    } catch (e) {
      console.warn('[Ads] Error creating/loading interstitial:', e);
      this.isAdLoading = false;
      this.scheduleRetry();
    }
  }

  private scheduleRetry() {
    this.clearRetryTimeout();
    if (this.retryAttempt < INTERSTITIAL_RETRY_DELAYS_MS.length) {
      const delay = INTERSTITIAL_RETRY_DELAYS_MS[this.retryAttempt];
      this.retryAttempt++;
      if (ADS_TEST_MODE) {
        console.log(`[Ads] Scheduling interstitial retry #${this.retryAttempt} in ${delay / 1000}s`);
      }
      this.retryTimeout = setTimeout(() => {
        this.retryTimeout = null;
        this.preloadInterstitial();
      }, delay);
    } else {
      if (ADS_TEST_MODE) {
        console.log('[Ads] Max interstitial load retries reached (10s, 30s, 60s). Awaiting next trigger.');
      }
    }
  }

  /**
   * Called when a calculation completes.
   * Increments the calculation counter WITHOUT interrupting the user with an ad.
   */
  onCalculationCompleted() {
    if (!ADS_ENABLED) return;
    this.calculationsSinceLastAd++;
    if (ADS_TEST_MODE) {
      console.log(
        `[Ads] Calculation completed. Progress: ${this.calculationsSinceLastAd}/${CALCS_BEFORE_INTERSTITIAL}`
      );
    }
  }

  /**
   * Evaluates whether an interstitial is eligible to be presented.
   * Conditions:
   * 1. Ads enabled and initialized
   * 2. Consent granted (`canRequestAds`)
   * 3. No interstitial currently showing
   * 4. At least 3 successful calculations completed
   * 5. Cooldown period (100 seconds) satisfied since last interstitial
   * 6. Interstitial ad is loaded and ready
   */
  isEligibleForInterstitial(): boolean {
    if (!ADS_ENABLED || !this.isInitialized || !this.canRequestAds) {
      return false;
    }
    if (this.isShowingAd) {
      return false;
    }
    if (this.calculationsSinceLastAd < CALCS_BEFORE_INTERSTITIAL) {
      return false;
    }
    if (this.lastAdShowTime > 0) {
      const elapsed = Date.now() - this.lastAdShowTime;
      if (elapsed < INTERSTITIAL_COOLDOWN_MS) {
        if (ADS_TEST_MODE) {
          const remainingSec = Math.round((INTERSTITIAL_COOLDOWN_MS - elapsed) / 1000);
          console.log(`[Ads] Interstitial on cooldown (${remainingSec}s remaining). Skipping.`);
        }
        return false;
      }
    }
    if (!this.interstitialAd || !this.isInterstitialLoaded) {
      // If an ad is needed but not loaded, reset retry counter and kick off preload
      if (!this.isAdLoading) {
        this.retryAttempt = 0;
        this.preloadInterstitial();
      }
      return false;
    }
    return true;
  }

  /**
   * Presents an interstitial only if all eligibility criteria are met.
   * Safe to call on screen transitions; returns true if ad was presented, false otherwise.
   * The calculation counter and cooldown are updated in AdEventType.OPENED.
   */
  showInterstitialIfEligible(): boolean {
    if (!this.isEligibleForInterstitial()) {
      return false;
    }

    try {
      this.isShowingAd = true;
      this.isInterstitialLoaded = false;
      this.interstitialAd!.show();
      if (ADS_TEST_MODE) {
        console.log('[Ads] Interstitial presentation requested at transition.');
      }
      return true;
    } catch (e) {
      console.warn('[Ads] Failed to show interstitial:', e);
      this.isShowingAd = false;
      return false;
    }
  }

  /**
   * Legacy compatibility method. Proxies to showInterstitialIfEligible.
   */
  showInterstitial(): boolean {
    return this.showInterstitialIfEligible();
  }

  getCalculationCount(): number {
    return this.calculationsSinceLastAd;
  }

  getCooldownRemainingMs(): number {
    if (this.lastAdShowTime === 0) return 0;
    const elapsed = Date.now() - this.lastAdShowTime;
    return Math.max(0, INTERSTITIAL_COOLDOWN_MS - elapsed);
  }

  /**
   * Checks whether privacy options are required to be surfaced in settings (e.g. EEA/UK under IAB TCF).
   */
  async getPrivacyOptionsRequired(): Promise<boolean> {
    if (Platform.OS !== 'android' && Platform.OS !== 'ios') return false;
    try {
      const consentInfo = await AdsConsent.getConsentInfo();
      return consentInfo.privacyOptionsRequirementStatus === AdsConsentPrivacyOptionsRequirementStatus.REQUIRED;
    } catch {
      return false;
    }
  }

  /**
   * Presents the Google UMP Privacy Options form to allow users to modify or revoke consent choices.
   * Updates internal consent and ad availability state upon dismissal.
   */
  async showPrivacyOptionsForm(): Promise<boolean> {
    if (Platform.OS !== 'android' && Platform.OS !== 'ios') return false;
    try {
      const consentInfo = await AdsConsent.showPrivacyOptionsForm();
      this.canRequestAds = consentInfo.canRequestAds;
      if (!this.canRequestAds) {
        this.cleanUpCurrentAd();
        this.isInterstitialLoaded = false;
      } else if (!this.interstitialAd && !this.isAdLoading) {
        this.preloadInterstitial();
      }
      this.notifyReady();
      return true;
    } catch (e) {
      console.warn('[Ads] Failed to show privacy options form:', e);
      return false;
    }
  }

  dispose() {
    this.clearRetryTimeout();
    this.cleanUpCurrentAd();
    this.readyListeners = [];
    this.isInitialized = false;
    this.isAdLoading = false;
    this.isShowingAd = false;
    this.isInterstitialLoaded = false;
  }
}

export const adsService = new AdsService();
