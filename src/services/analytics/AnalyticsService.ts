// @ts-ignore
import analytics from '@react-native-firebase/analytics';
import { AnalyticsEventName, BaseEventParams } from './events';

class AnalyticsService {
  private isInitialized = false;

  async initialize() {
    try {
      if (__DEV__) {
        console.log('[Analytics] Initialized in DEV mode');
      }
      // Firebase Analytics auto-initializes, but we can configure settings here
      await analytics().setAnalyticsCollectionEnabled(true);
      this.isInitialized = true;
    } catch (e) {
      console.warn('[Analytics] Failed to initialize', e);
    }
  }

  async trackEvent<T extends BaseEventParams>(name: AnalyticsEventName, params?: T) {
    if (!this.isInitialized) return;

    try {
      // Filter out any undefined values just in case
      const cleanParams: { [key: string]: any } = {};
      if (params) {
        for (const key in params) {
          if (params[key] !== undefined) {
            cleanParams[key] = params[key];
          }
        }
      }

      if (__DEV__) {
        console.log(`[Analytics] Event: ${name}`, cleanParams);
      }
      
      await analytics().logEvent(name, cleanParams);
    } catch (e) {
      console.warn(`[Analytics] Failed to track event ${name}`, e);
    }
  }
}

export const analyticsService = new AnalyticsService();
