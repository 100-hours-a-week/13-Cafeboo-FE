import { useEffect, useState, useRef, useCallback } from 'react'
import {
  Map,
  MapMarker,
  useKakaoLoader,
  CustomOverlayMap,
} from 'react-kakao-maps-sdk'
import debounce from 'lodash.debounce'

export interface LocationData {
  address: string
  detailAddress: string
  latitude: number
  longitude: number
  kakaoPlaceUrl: string
  placeName: string
}

interface Props {
  value: LocationData | null
  onChange: (loc: LocationData) => void
}

export default function LocationSelector({ value, onChange }: Props) {
  const [keyword, setKeyword] = useState('')
  const [places, setPlaces] = useState<any[]>([])
  const [mapCenter, setMapCenter] = useState({ lat: 37.5665, lng: 126.978 })
  const [selectedPlace, setSelectedPlace] = useState<any>(null)
  const [map, setMap] = useState<kakao.maps.Map | null>(null)
  const [showList, setShowList] = useState(false)
  const listRef = useRef<HTMLUListElement>(null)
  const lastSelectedKeyword = useRef('')
  const hasInitialized = useRef(false)
  const [finalSelectedPlace, setFinalSelectedPlace] = useState<any>(null)

  const isLoaded = useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAO_MAP_KEY!,
    libraries: ['services'],
  })

  const searchPlaces = (query: string) => {
    if (!query.trim()) return
    const ps = new kakao.maps.services.Places()
    ps.keywordSearch(query, (data, status) => {
      if (status === kakao.maps.services.Status.OK) {
        setPlaces(data)
        setShowList(true)
      } else {
        setPlaces([])
        setShowList(false)
      }
    })
  }

  const debounceSearch = useCallback(debounce(searchPlaces, 300), [])

  const getPlaceByCoords = (lat: number, lng: number, callback: (matched: any) => void) => {
    const ps = new kakao.maps.services.Places()
    ps.categorySearch('', (data: any[], status: any) => {
      if (status === kakao.maps.services.Status.OK && data.length > 0) {
        callback(data[0])
      } else {
        const geocoder = new kakao.maps.services.Geocoder()
        geocoder.coord2Address(lng, lat, (result: any[], status: any) => {
          if (status === kakao.maps.services.Status.OK && result[0]) {
            const addr = result[0].address
            callback({
              place_name: addr.address_name,
              address_name: addr.address_name,
              road_address_name: result[0].road_address?.address_name || '',
              y: lat.toString(),
              x: lng.toString(),
              place_url: `https://map.kakao.com/link/map/${lat},${lng}`
            })
          } else {
            callback(null)
          }
        })
      }
    }, {
      location: new kakao.maps.LatLng(lat, lng),
      radius: 50,
      sort: kakao.maps.services.SortBy.DISTANCE,
    })
  }

  const updateSelectedPlace = (lat: number, lng: number, place: any) => {
    const address = place.address_name?.split(' ').slice(2, 4).join(' ') || ''
    setMapCenter({ lat, lng })
    setSelectedPlace({ ...place, address })
    setFinalSelectedPlace({ ...place, address })
    setTimeout(() => setShowList(false), 0)
  }

  useEffect(() => {
    if (!isLoaded || hasInitialized.current) return
    hasInitialized.current = true

    if (value) {
      const place = {
        ...value,
        y: value.latitude.toString(),
        x: value.longitude.toString(),
        place_name: value.placeName,
        address_name: value.detailAddress,
        road_address_name: value.detailAddress,
      }
      setSelectedPlace(place)
      setFinalSelectedPlace(place)
      setMapCenter({ lat: value.latitude, lng: value.longitude })
      return
    }

    if (!navigator.geolocation) return

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        getPlaceByCoords(lat, lng, (place) => {
          if (place) {
            updateSelectedPlace(lat, lng, place)
          }
        })
      },
      () => console.warn('위치 정보를 가져올 수 없습니다.')
    )
  }, [isLoaded])

  const handleMapClick = (_t: any, mouseEvent: kakao.maps.event.MouseEvent) => {
    const latLng = mouseEvent.latLng
    const lat = latLng.getLat()
    const lng = latLng.getLng()

    getPlaceByCoords(lat, lng, (place) => {
      if (place) {
        updateSelectedPlace(lat, lng, place)
      }
    })
  }

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setKeyword(value)
    debounceSearch(value)
  }

  const handleSelectPlace = (place: any) => {
    const lat = parseFloat(place.y)
    const lng = parseFloat(place.x)
    lastSelectedKeyword.current = place.place_name
    setKeyword(place.place_name)
    setPlaces([])
    updateSelectedPlace(lat, lng, place)
  }

  const handleSearchClick = () => {
    searchPlaces(keyword)
  }

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (listRef.current && !listRef.current.contains(event.target as Node)) {
        setShowList(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [])

  if (!isLoaded) return <div>지도 로딩 중...</div>

  return (
    <div className="relative h-[400px] rounded overflow-hidden">
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="flex gap-2 bg-white rounded shadow-lg px-3 py-2">
          <input
            value={keyword}
            onChange={handleSearchInputChange}
            placeholder="장소 검색"
            className="flex-1 outline-none text-sm"
          />
          <button
            onClick={handleSearchClick}
            className="text-[#FE9400] font-semibold text-sm cursor-pointer"
          >
            검색
          </button>
        </div>

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
        key={`${mapCenter.lat}-${mapCenter.lng}`}
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
              const lat = parseFloat(selectedPlace.y)
              const lng = parseFloat(selectedPlace.x)
              const address = selectedPlace.address_name?.split(' ').slice(2, 4).join(' ') || ''

              onChange({
                address,
                detailAddress: selectedPlace.road_address_name || selectedPlace.address_name || '',
                latitude: lat,
                longitude: lng,
                kakaoPlaceUrl: selectedPlace.place_url || '',
                placeName: selectedPlace.place_name || selectedPlace.placeName,
              })
              setFinalSelectedPlace(selectedPlace)
            }}
          >
            장소 선택
          </button>
        </div>
      )}
    </div>
  )
}

















