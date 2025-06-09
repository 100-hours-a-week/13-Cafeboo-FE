import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useKakaoLoader } from "react-kakao-maps-sdk";

const defaultLocation = {
  latitude: 37.401234,
  longitude: 127.110987,
  kakaoPlaceUrl: "https://map.kakao.com/link/map/12345678",
};

export default function MapForm() {
  const { state } = useLocation();
  const {
    latitude,
    longitude,
    kakaoPlaceUrl,
  } = state ?? defaultLocation;

  const [loading, error] = useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAO_MAP_KEY,
    libraries: ['services'],
  });

  useEffect(() => {
    if (loading || !window.kakao) return;

    const container = document.getElementById("map");
    if (!container) return;

    const options = {
      center: new window.kakao.maps.LatLng(latitude, longitude),
      level: 3,
    };

    const map = new window.kakao.maps.Map(container, options);

    const marker = new window.kakao.maps.Marker({
      position: new window.kakao.maps.LatLng(latitude, longitude),
    });

    marker.setMap(map);
  }, [loading, latitude, longitude]);

  if (error) return <div>지도를 불러오는 중 오류가 발생했습니다.</div>;
  if (loading) return <div>지도를 불러오는 중입니다...</div>;

  return (
    <div className="relative w-full h-full">
      {/* 지도 영역 */}
      <div id="map" className="w-full h-full" />

      {/* 고정 버튼 영역 */}
      <div className="fixed bottom-0 left-0 w-full p-6 bg-white shadow-md z-100">
        <button
          onClick={() => window.open(kakaoPlaceUrl, "_blank")}
          className="w-full py-3 bg-[#FE9400] text-white rounded-lg cursor-pointer"
        >
          Kakao Navi로 열기
        </button>
      </div>
    </div>
  );
}

