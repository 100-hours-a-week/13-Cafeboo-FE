import { useEffect, useState, useRef, useCallback } from 'react';
import {
  Map,
  MapMarker,
  useKakaoLoader,
  CustomOverlayMap,
} from 'react-kakao-maps-sdk';
import debounce from 'lodash.debounce';

export interface LocationData {
  detailAddress: string;
  latitude: number;
  longitude: number;
  kakaoPlaceUrl: string;
  placeName: string;
}

interface Props {
  value: LocationData | null;
  onChange: (loc: LocationData) => void;
}

export default function LocationSelector({ value, onChange }: Props) {
  const [keyword, setKeyword] = useState('');
  const [places, setPlaces] = useState<any[]>([]);
  const [mapCenter, setMapCenter] = useState({ lat: 37.5665, lng: 126.978 });
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [showList, setShowList] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);
  const lastSelectedKeyword = useRef('');
  const hasInitialized = useRef(false);
  const [finalSelectedPlace, setFinalSelectedPlace] = useState<any>(null);

  const isLoaded = useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAO_MAP_KEY!,
    libraries: ['services'],
  });

  const getDynamicRadius = (map: kakao.maps.Map) => {
    const level = map.getLevel();
    return Math.min(Math.max(5 * level, 5), 200);
  };

  const searchPlaces = (query: string) => {
    if (!query.trim()) return;
    const ps = new kakao.maps.services.Places();
    ps.keywordSearch(query, (data, status) => {
      if (status === kakao.maps.services.Status.OK) {
        setPlaces(data);
        setShowList(true);
      } else {
        setPlaces([]);
        setShowList(false);
      }
    });
  };

  const debounceSearch = useCallback(debounce(searchPlaces, 300), []);

  const CATEGORIES = [
    'MT1',
    'CS2',
    'PS3',
    'SC4',
    'AC5',
    'PK6',
    'OL7',
    'SW8',
    'BK9',
    'CT1',
    'AG2',
    'PO3',
    'AT4',
    'AD5',
    'FD6',
    'CE7',
    'HP8',
    'PM9',
  ] as const;

  type CategoryCode = (typeof CATEGORIES)[number];

  function getPlaceByCoords(
    lat: number,
    lng: number,
    callback: (place: any | null) => void,
    radius: number
  ) {
    const ps = new kakao.maps.services.Places();
    let foundPlace: any = null;
    let checked = 0;

    for (const code of CATEGORIES) {
      ps.categorySearch(
        code as CategoryCode,
        (data: any[], status: any) => {
          checked++;
          if (
            !foundPlace &&
            status === kakao.maps.services.Status.OK &&
            data.length > 0
          ) {
            foundPlace = data[0];
            callback(foundPlace);
          }
          if (checked === CATEGORIES.length && !foundPlace) {
            callback(null);
          }
        },
        {
          location: new kakao.maps.LatLng(lat, lng),
          radius,
          sort: kakao.maps.services.SortBy.DISTANCE,
        }
      );
    }
  }

  const updateSelectedPlace = (lat: number, lng: number, place: any) => {
    const address = place.address_name?.split(' ').slice(2, 4).join(' ') || '';
    setMapCenter({ lat, lng });
    setSelectedPlace({ ...place, address });
    setFinalSelectedPlace({ ...place, address });
    setTimeout(() => setShowList(false), 0);
  };

  useEffect(() => {
    if (!isLoaded || hasInitialized.current) return;
    hasInitialized.current = true;

    if (value) {
      const place = {
        ...value,
        y: value.latitude.toString(),
        x: value.longitude.toString(),
        place_name: value.placeName,
        address_name: value.detailAddress,
      };
      setSelectedPlace(place);
      setFinalSelectedPlace(place);
      setMapCenter({ lat: value.latitude, lng: value.longitude });
      return;
    }

    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const radius = map ? getDynamicRadius(map) : 30;

        getPlaceByCoords(
          lat,
          lng,
          (place) => {
            if (place) {
              updateSelectedPlace(lat, lng, place);
            }
          },
          radius
        );
      },
      () => console.error('위치 정보를 가져올 수 없습니다.')
    );
  }, [isLoaded, map]);

  const handleMapClick = (_t: any, mouseEvent: kakao.maps.event.MouseEvent) => {
    if (!map) return;
    const latLng = mouseEvent.latLng;
    const lat = latLng.getLat();
    const lng = latLng.getLng();
    const radius = getDynamicRadius(map);

    getPlaceByCoords(
      lat,
      lng,
      (place) => {
        if (place) {
          updateSelectedPlace(lat, lng, place);
        } else {
          setSelectedPlace(null);
          setFinalSelectedPlace(null);
        }
      },
      radius
    );
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeyword(value);
    debounceSearch(value);
  };

  const handleSelectPlace = (place: any) => {
    const lat = parseFloat(place.y);
    const lng = parseFloat(place.x);
    lastSelectedKeyword.current = place.place_name;
    setKeyword(place.place_name);
    setPlaces([]);
    updateSelectedPlace(lat, lng, place);
  };

  const handleSearchClick = () => {
    searchPlaces(keyword);
  };

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (listRef.current && !listRef.current.contains(event.target as Node)) {
        setShowList(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  if (!isLoaded) return <div>지도 로딩 중...</div>;

  return (
    <div className="relative h-[400px] rounded overflow-hidden">
      <div className="absolute top-4 left-4 right-4 z-10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearchClick();
          }}
          className="relative w-full max-w-xs"
        >
          <input
            type="search"
            value={keyword}
            onChange={handleSearchInputChange}
            placeholder="장소 검색"
            className="w-full pl-3 pr-14 py-2 text-sm rounded shadow bg-white outline-none"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-[#FE9400] font-semibold text-sm min-w-[40px]"
          >
            검색
          </button>
        </form>

        {showList && places.length > 0 && (
          <ul
            ref={listRef}
            className="mt-2 bg-white rounded shadow divide-y max-h-48 overflow-auto text-sm"
          >
            {places.map((place, i) => (
              <li
                key={i}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelectPlace(place)}
              >
                <p className="font-semibold">{place.place_name}</p>
                <p className="text-gray-500 text-xs">
                  {place.road_address_name || place.address_name}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Map
        center={mapCenter}
        level={3}
        style={{ width: '100%', height: '100%' }}
        onCreate={setMap}
        onClick={handleMapClick}
      >
        {selectedPlace && (
          <>
            <MapMarker
              position={{
                lat: parseFloat(selectedPlace.y),
                lng: parseFloat(selectedPlace.x),
              }}
              clickable={false}
            />
            <CustomOverlayMap
              position={{
                lat: parseFloat(selectedPlace.y),
                lng: parseFloat(selectedPlace.x),
              }}
              yAnchor={3}
            >
              <div className="bg-gradient-to-r from-[#4A5B71] to-[#5E6F89] text-white text-xs font-semibold px-3 py-1 rounded shadow-md text-center whitespace-nowrap">
                {selectedPlace.place_name || selectedPlace.placeName}
              </div>
            </CustomOverlayMap>
          </>
        )}
      </Map>

      {selectedPlace && (
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-10">
          <button
            className="px-6 py-2 bg-[#FE9400] text-white font-bold rounded shadow cursor-pointer"
            onClick={() => {
              const lat = parseFloat(selectedPlace.y);
              const lng = parseFloat(selectedPlace.x);
              const address =
                selectedPlace.address_name?.split(' ').slice(2, 4).join(' ') ||
                '';

              onChange({
                detailAddress: selectedPlace.address_name || '',
                latitude: lat,
                longitude: lng,
                kakaoPlaceUrl: selectedPlace.place_url || '',
                placeName: selectedPlace.place_name || selectedPlace.placeName,
              });
              setFinalSelectedPlace(selectedPlace);
            }}
          >
            장소 선택
          </button>
        </div>
      )}
    </div>
  );
}
