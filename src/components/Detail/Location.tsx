// components/Detail/Location.tsx

import React from 'react';
import KakaoMapWithCenter from './KakaoMapWithCenter';

interface LocationProps {
  latitude: number;
  longitude: number;
  address: string;
}

const Location: React.FC<LocationProps> = ({ latitude, longitude, address }) => {
  const center = { lat: latitude, lng: longitude };
  const markerPosition = { lat: latitude, lng: longitude };

  return (
    <div className="w-full lg:w-[1000px] py-8">
      <h6 className="text-2xl font-bold mb-2">거래 희망장소</h6>
      <p>{address}</p>
      <div className="rounded-md mt-4 overflow-hidden">
        <KakaoMapWithCenter center={center} markerPosition={markerPosition} />
      </div>
    </div>
  );
};

export default Location;
