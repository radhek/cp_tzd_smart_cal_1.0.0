import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { ADS_ENABLED, BannerPlacement, getBannerUnitId } from './adConfig';
import { adsService } from './AdsService';
import { analyticsService } from '../analytics/AnalyticsService';

interface GlobalBannerAdProps {
  placement?: BannerPlacement;
  style?: StyleProp<ViewStyle>;
}

export function GlobalBannerAd({ placement = 'calculator', style }: GlobalBannerAdProps) {
  const unitId = getBannerUnitId(placement);
  const [isReady, setIsReady] = useState(() => adsService.isReadyToServe());
  const [hasFailed, setHasFailed] = useState(false);

  useEffect(() => {
    if (!isReady) {
      const unsubscribe = adsService.onReady(() => {
        setIsReady(true);
      });
      return unsubscribe;
    }
  }, [isReady]);

  // If ads are disabled, unit ID is unconfigured/empty, consent/SDK is not ready, or load failed, render nothing
  if (!ADS_ENABLED || !unitId || !isReady || hasFailed) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <BannerAd
        unitId={unitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        onAdLoaded={() => {
          analyticsService.trackEvent('ad_banner_loaded', { placement });
        }}
        onAdFailedToLoad={(error) => {
          console.warn(`[Ads] Banner (${placement}) failed to load:`, error?.code, error?.message);
          analyticsService.trackEvent('ad_banner_failed', {
            placement,
            error_code: error?.code,
            error_message: error?.message,
          });
          setHasFailed(true);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    minHeight: 52,
    marginVertical: 12,
  }
});
