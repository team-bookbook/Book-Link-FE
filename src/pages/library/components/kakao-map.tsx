import { useEffect, useRef } from 'react';
import type { MapOptions, MarkerOptions } from '@hooks/use-kakao-map';

interface KakaoMapProps {
  latitude: number;
  longitude: number;
  className?: string;
}

export default function KakaoMap({ latitude, longitude, className = '' }: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const initMap = () => {
      if (!window.kakao?.maps) {
        console.error('Kakao Maps SDK is not loaded');
        return;
      }

      const container = mapRef.current;
      if (!container) return;

      try {
        const center = new window.kakao.maps.LatLng(latitude, longitude);
        const options: MapOptions = {
          center,
          level: 3,
        };

        const map = new window.kakao.maps.Map(container, options);

        const markerOptions: MarkerOptions = {
          position: center,
          map,
        };
        new window.kakao.maps.Marker(markerOptions);

        console.log('Kakao Map initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Kakao Map:', error);
      }
    };

    // SDK 로드 대기 (최대 10초)
    let attempts = 0;
    const maxAttempts = 100;

    const checkKakao = setInterval(() => {
      attempts++;

      if (window.kakao?.maps) {
        clearInterval(checkKakao);
        window.kakao.maps.load(initMap);
      } else if (attempts >= maxAttempts) {
        clearInterval(checkKakao);
        console.error('Kakao Maps SDK load timeout - make sure useKakaoMaps() hook is called in parent component');
      }
    }, 100);

    return () => clearInterval(checkKakao);
  }, [latitude, longitude]);

  return <div ref={mapRef} className={className} />;
}
