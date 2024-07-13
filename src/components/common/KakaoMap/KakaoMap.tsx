import { useEffect, useState } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import { useUserStore } from '@/zustand/userStore';
import Script from 'next/script';

type MarkerInfo = {
  lat: number;
  lng: number;
  address: string;
};

type KakaoMapProps = {
  onMarkerAddressChange: (markerInfo: MarkerInfo) => void;
};

const KAKAO_SDK_URL = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&libraries=services&autoload=false`;

const KakaoMap: React.FC<KakaoMapProps> = ({ onMarkerAddressChange }) => {
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [center, setCenter] = useState({ lat: 37.566826, lng: 126.9786567 });
  const [markerPosition, setMarkerPosition] = useState({ lat: 37.566826, lng: 126.9786567 });
  const [infoWindow, setInfoWindow] = useState<kakao.maps.InfoWindow | null>(null);
  const [markerAddress, setMarkerAddress] = useState<string>('');
  const { address } = useUserStore((state) => ({
    address: state.address
  }));

  useEffect(() => {
    const kakaoScript = document.createElement('script');
    kakaoScript.src = KAKAO_SDK_URL;
    kakaoScript.async = true;
    kakaoScript.onload = () => {
      const ps = new kakao.maps.services.Places();
      if (!map || !address) return;

      ps.keywordSearch(address, (data, status, _pagination) => {
        if (status === kakao.maps.services.Status.OK) {
          const bounds = new kakao.maps.LatLngBounds();
          data.forEach((place) => bounds.extend(new kakao.maps.LatLng(Number(place.y), Number(place.x))));
          map.setBounds(bounds);

          const sw = bounds.getSouthWest();
          const ne = bounds.getNorthEast();
          const newCenter = {
            lat: (sw.getLat() + ne.getLat()) / 2,
            lng: (sw.getLng() + ne.getLng()) / 2
          };
          setCenter(newCenter);
          setMarkerPosition(newCenter);

          geocodeAndSetMarkerAddress(newCenter.lat, newCenter.lng);

          map.setLevel(3);
        }
      });
    };

    document.head.appendChild(kakaoScript);

    return () => {
      document.head.removeChild(kakaoScript);
    };
  }, [map, address]);

  useEffect(() => {
    if (!map) return;

    const infoWindow = new kakao.maps.InfoWindow({
      content: '',
      removable: false
    });

    setInfoWindow(infoWindow);

    return () => {
      infoWindow.close();
    };
  }, [map]);

  const geocodeAndSetMarkerAddress = (lat: number, lng: number) => {
    const geocoder = new kakao.maps.services.Geocoder();
    geocoder.coord2Address(lng, lat, (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        if (result[0]) {
          const address = result[0].address.address_name;
          setMarkerPosition({ lat, lng });
          setMarkerAddress(address);

          infoWindow?.setContent(address);

          if (map && infoWindow) {
            const markerPosition = new kakao.maps.LatLng(lat, lng);
            infoWindow.setContent(`
              <div style="padding: 3px; min-width: 100px; max-width: 300px; white-space: nowrap;">
                ${address}
              </div>
            `);
            infoWindow.setPosition(markerPosition);
            infoWindow.open(map, new kakao.maps.Marker({ position: markerPosition }));
          }
        }
      }
    });
  };

  const handleMarkerDragEnd = (target: kakao.maps.Marker) => {
    const position = target.getPosition();
    setMarkerPosition({
      lat: position.getLat(),
      lng: position.getLng()
    });

    geocodeAndSetMarkerAddress(position.getLat(), position.getLng());

    onMarkerAddressChange({ lat: position.getLat(), lng: position.getLng(), address: markerAddress });
  };

  return (
    <>
      <Script src={KAKAO_SDK_URL} strategy="beforeInteractive" />
      <Map center={center} style={{ width: '100%', height: '0', paddingBottom: '39.53%' }} level={3} onCreate={setMap}>
        {map && (
          <MapMarker position={markerPosition} draggable={true} onDragEnd={(target) => handleMarkerDragEnd(target)} />
        )}
      </Map>
    </>
  );
};

export default KakaoMap;
