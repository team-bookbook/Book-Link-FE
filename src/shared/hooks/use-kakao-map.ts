import { useEffect } from 'react';

declare global {
  interface Window {
    kakao: KakaoMaps;
  }
}

interface KakaoMaps {
  maps: {
    load: (callback: () => void) => void;
    services: {
      Status: {
        OK: string;
        ZERO_RESULT: string;
        ERROR: string;
      };
      Geocoder: new () => Geocoder;
    };
  };
}

interface Geocoder {
  addressSearch: (address: string, callback: (result: AddressSearchResult[], status: string) => void) => void;
}

interface AddressSearchResult {
  address_name: string;
  address_type: string;
  x: string; // 경도 (longitude)
  y: string; // 위도 (latitude)
  address: {
    address_name: string;
    region_1depth_name: string;
    region_2depth_name: string;
    region_3depth_name: string;
    mountain_yn: string;
    main_address_no: string;
    sub_address_no: string;
    zip_code: string;
  };
  road_address: {
    address_name: string;
    region_1depth_name: string;
    region_2depth_name: string;
    region_3depth_name: string;
    road_name: string;
    underground_yn: string;
    main_building_no: string;
    sub_building_no: string;
    building_name: string;
    zone_no: string;
  } | null;
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

export const useKakaoMaps = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (window.kakao?.maps) {
      return;
    }

    const existingScript = document.querySelector(
      'script[src*="dapi.kakao.com/v2/maps/sdk.js"]'
    ) as HTMLScriptElement | null;

    if (existingScript) {
      console.log('Kakao Map script already exists, waiting for load...');
      const handleLoad = () => {
        if (window.kakao?.maps) {
          window.kakao.maps.load(() => {
            console.log('Kakao Map SDK loaded (from existing script)');
          });
        }
      };

      if (window.kakao?.maps) {
        handleLoad();
      } else {
        existingScript.addEventListener('load', handleLoad);
      }
      return;
    }

    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_API_KEY}&libraries=services&autoload=false`;

    script.onload = () => {
      window.kakao.maps.load(() => {
        console.log('Kakao Map SDK loaded (new script)');
      });
    };

    script.onerror = () => {
      console.error('Failed to load Kakao Map SDK');
    };

    document.head.appendChild(script);
  }, []);

  const convertCoord = (address: string): Promise<Coordinates> => {
    return new Promise((resolve, reject) => {
      if (!window.kakao?.maps) {
        reject(new Error('Kakao Maps SDK is not loaded'));
        return;
      }

      const geocoder = new window.kakao.maps.services.Geocoder();

      geocoder.addressSearch(address, (result: AddressSearchResult[], status: string) => {
        console.log('Geocoding result:', result, 'status:', status);

        if (status === window.kakao.maps.services.Status.OK && result.length > 0) {
          const coords: Coordinates = {
            latitude: parseFloat(result[0].y),
            longitude: parseFloat(result[0].x),
          };
          resolve(coords);
        } else {
          reject(new Error(`Failed to convert address: ${address} (status: ${status})`));
        }
      });
    });
  };

  return { convertCoord };
};
