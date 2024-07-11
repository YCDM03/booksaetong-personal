// components/Detail/KakaoMapWithCenter.tsx

import React, { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

interface KakaoMapWithCenterProps {
  center: {
    lat: number;
    lng: number;
  };
  markerPosition?: {
    lat: number;
    lng: number;
  };
}

const KakaoMapWithCenter: React.FC<KakaoMapWithCenterProps> = ({ center, markerPosition }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<any>(null); // Ref to hold marker object

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false`;
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(() => {
        setIsLoaded(true);
      });
    };
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (isLoaded && mapRef.current) {
      const options = {
        center: new window.kakao.maps.LatLng(center.lat, center.lng),
        level: 3
      };

      const map = new window.kakao.maps.Map(mapRef.current, options);

      // Add marker if markerPosition is provided
      if (markerPosition) {
        const markerOptions = {
          position: new window.kakao.maps.LatLng(markerPosition.lat, markerPosition.lng)
        };

        const marker = new window.kakao.maps.Marker(markerOptions);
        marker.setMap(map);

        // Save marker to the ref for future reference
        markerRef.current = marker;
      }
    }
  }, [isLoaded, center, markerPosition]);

  return (
    <>
      <Script
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false`}
        strategy="beforeInteractive"
      />
      <div ref={mapRef} style={{ width: '100%', height: '400px' }}></div>
    </>
  );
};

export default KakaoMapWithCenter;
