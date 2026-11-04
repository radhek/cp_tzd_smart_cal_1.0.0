import { Platform } from 'react-native';
import { TestIds } from 'react-native-google-mobile-ads';

export const ADS_ENABLED = true;
// Force test mode during development
export const ADS_TEST_MODE = __DEV__;

export type BannerPlacement = 'calculator' | 'home' | 'explore';

// Existing production calculator banner IDs (strictly preserved)
const ANDROID_CALCULATOR_BANNER = ADS_TEST_MODE ? TestIds.BANNER : 'ca-app-pub-2857481165308245/9980221319';
const IOS_CALCULATOR_BANNER = ADS_TEST_MODE ? TestIds.BANNER : 'ca-app-pub-2857481165308245/1174384748';

// Dedicated Home banner IDs: Google Test ID in dev; dedicated production ID in release
const ANDROID_HOME_BANNER = ADS_TEST_MODE ? TestIds.BANNER : 'ca-app-pub-2857481165308245/8815292343';
const IOS_HOME_BANNER = ADS_TEST_MODE ? TestIds.BANNER : '';

// Dedicated Explore banner IDs: Google Test ID in dev; dedicated production ID in release
const ANDROID_EXPLORE_BANNER = ADS_TEST_MODE ? TestIds.BANNER : 'ca-app-pub-2857481165308245/7574362866';
const IOS_EXPLORE_BANNER = ADS_TEST_MODE ? TestIds.BANNER : '';

const ANDROID_INTERSTITIAL = ADS_TEST_MODE ? TestIds.INTERSTITIAL : 'ca-app-pub-2857481165308245/7139183980';
const IOS_INTERSTITIAL = ADS_TEST_MODE ? TestIds.INTERSTITIAL : 'ca-app-pub-2857481165308245/3970929313';

export const adUnits = {
  // Existing calculator banner unit ID (strictly preserved)
  banner: Platform.select({
    android: ANDROID_CALCULATOR_BANNER,
    ios: IOS_CALCULATOR_BANNER,
  }) || '',
  homeBanner: Platform.select({
    android: ANDROID_HOME_BANNER,
    ios: IOS_HOME_BANNER,
  }) || '',
  exploreBanner: Platform.select({
    android: ANDROID_EXPLORE_BANNER,
    ios: IOS_EXPLORE_BANNER,
  }) || '',
  interstitial: Platform.select({
    android: ANDROID_INTERSTITIAL,
    ios: IOS_INTERSTITIAL,
  }) || ''
};

/**
 * Returns the ad unit ID for a specific banner placement.
 * Returns empty string if the placement is unconfigured or disabled.
 */
export function getBannerUnitId(placement: BannerPlacement = 'calculator'): string {
  switch (placement) {
    case 'home':
      return adUnits.homeBanner;
    case 'explore':
      return adUnits.exploreBanner;
    case 'calculator':
    default:
      return adUnits.banner;
  }
}

// Phase 1 Optimization Settings
export const CALCS_BEFORE_INTERSTITIAL = 3;
export const INTERSTITIAL_COOLDOWN_MS = 100 * 1000; // 100 seconds
export const INTERSTITIAL_RETRY_DELAYS_MS = [10000, 30000, 60000]; // 10s, 30s, 60s

