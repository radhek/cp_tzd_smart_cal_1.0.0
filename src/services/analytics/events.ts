export type AnalyticsEventName = 
  | 'app_open'
  | 'calculator_opened'
  | 'calculation_completed'
  | 'calculation_shared'
  | 'calculation_saved'
  | 'calculator_favorited'
  | 'search_performed'
  | 'scan_started'
  | 'scan_completed'
  | 'scan_failed'
  | 'language_changed'
  | 'theme_changed'
  | 'ad_banner_loaded'
  | 'ad_banner_failed';

export interface BaseEventParams {
  [key: string]: string | number | boolean | undefined;
}

export interface AdBannerEventParams extends BaseEventParams {
  placement: 'calculator' | 'home' | 'explore';
  error_code?: string;
  error_message?: string;
}

export interface CalculatorEventParams extends BaseEventParams {
  calculator_id: string;
  category: string;
}

export interface ScanEventParams extends BaseEventParams {
  scan_source?: 'camera' | 'gallery';
}
