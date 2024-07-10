import Script from 'next/script';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import { useState, useEffect } from 'react';

const KAKAO_SDK_URL = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&libraries=services&autoload=false`;

const KakaoMap = () => {
  const [info, setInfo] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [map, setMap] = useState(null);
  const [center, setCenter] = useState({ lat: 33.5563, lng: 126.79581 });

  useEffect(() => {
    const script = document.createElement('script');
    script.src = KAKAO_SDK_URL;
    script.async = true;
    script.onload = () => {
      kakao.maps.load(() => {
        if (!map) return;
        const ps = new kakao.maps.services.Places();

        ps.keywordSearch('이태원 맛집', (data, status, _pagination) => {
          if (status === kakao.maps.services.Status.OK) {
            // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
            // LatLngBounds 객체에 좌표를 추가합니다
            const bounds = new kakao.maps.LatLngBounds();
            let markers = [];

            for (var i = 0; i < data.length; i++) {
              markers.push({
                position: {
                  lat: parseFloat(data[i].y),
                  lng: parseFloat(data[i].x)
                },
                content: data[i].place_name
              });
              bounds.extend(new kakao.maps.LatLng(parseFloat(data[i].y), parseFloat(data[i].x)));
            }
            setMarkers(markers);

            // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
            map.setBounds(bounds);
            setCenter({
              lat: parseFloat(data[0].y),
              lng: parseFloat(data[0].x)
            });
          }
        });
      });
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [map]);

  return (
    <>
      <Script src={KAKAO_SDK_URL} strategy="beforeInteractive" />
      <Map center={center} style={{ width: '534px', height: '253px' }} level={3} onCreate={setMap}>
        {markers.map((marker, index) => (
          <MapMarker
            key={`marker-${marker.content}-${marker.position.lat},${marker.position.lng}`}
            position={marker.position}
            onClick={() => setInfo(marker)}
          >
            {info && info.content === marker.content && <div style={{ color: '#000' }}>{marker.content}</div>}
          </MapMarker>
        ))}
      </Map>
    </>
  );
};

export default KakaoMap;
