import { useEffect } from "react";
import { useKakaoLoader } from "react-kakao-maps-sdk";
import { extractPlaceId } from "@/utils/parseUtils";

interface LocationData {
  latitude: number;
  longitude: number;
  kakaoPlaceUrl: string;
}

interface Props {
  location: LocationData;
}

export default function MapForm({ location }: Props) {
  const { latitude, longitude, kakaoPlaceUrl } = location;
  const placeId = extractPlaceId(location.kakaoPlaceUrl);

  const [loading, error] = useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAO_MAP_KEY,
    libraries: ['services'],
  });

  const handleOpenKakaoMap = () => {
    const kakaoWebUrl = `https://map.kakao.com/link/to/${placeId}`;
    const kakaoAppUrl = `kakaomap://route?ep=${latitude},${longitude}`;
  
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
    if (isMobile) {
      window.location.href = kakaoAppUrl;
  
      setTimeout(() => {
        window.location.href = kakaoWebUrl;
      }, 1500);
    } else {
      window.open(kakaoWebUrl, "_blank");
    }
  };

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
      <div id="map" className="w-full h-full" />
      <div className="fixed bottom-0 left-0 w-full p-6 bg-white shadow-md z-100">
      <button
        onClick={handleOpenKakaoMap}
        className="w-full py-3 bg-[#FE9400] text-white rounded-lg cursor-pointer"
      >
        Kakao Map으로 길찾기
      </button>
      </div>
    </div>
  );
}


