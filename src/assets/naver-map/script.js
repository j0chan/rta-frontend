let scriptLoaded = false // 네이버 지도 API 로드 여부
let pendingStoreData = null // 지도(mapConfig.map)가 초기화되기 전에 postMessage로 받은 데이터를 임시로 저장
let currentLocationMarker = null // 현재 위치 마커 저장용

document.addEventListener("DOMContentLoaded", function () {
    // iframe이 동적으로 추가될 때까지 기다리기
    let observer = new MutationObserver(() => {
        const iframe = document.getElementById("map-iframe")
        const mapElement = document.getElementById("map")

        if (iframe && mapElement && !scriptLoaded) { // 이미 로드된 경우 실행 방지
            observer.disconnect() // iframe과 map 요소를 찾았으면 MutationObserver 해제
            loadMapScript() // 네이버 지도 API 로드
        }
    })

    // body에 MutationObserver 적용
    observer.observe(document.body, { childList: true, subtree: true })

    // 처음부터 #map이 존재하는 경우 즉시 실행
    if (document.getElementById("map") && !scriptLoaded) {
        loadMapScript()
    }
})

// 네이버 지도 API 로드 및 initMap 실행
function loadMapScript() {
    if (scriptLoaded) {
        return // 중복 요청 방지
    }

    scriptLoaded = true // 중복 실행 방지

    fetch("http://localhost:3000/api/maps/client-id") // 헤더 없이 호출
        .then((response) => {
            if (!response.ok) {
                throw new Error(`서버 응답 오류: ${response.status}`)
            }
            return response.json()
        })
        .then((data) => {
            if (!data.clientId) {
                throw new Error("clientId가 undefined.")
            }

            // 네이버 지도 API 동적 로드
            const script = document.createElement("script")
            script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${data.clientId}`
            script.onload = function () {
                initMap()
            }
            document.body.appendChild(script)
        })
        .catch((error) => console.error("Error fetching client ID:", error))
}

const mapConfig = {
    map: null,
    markers: [],
    infoWindows: [],
    activeInfoWindow: null
}

function initMap() {
    // 기본 지도 생성 (서울 기준)
    mapConfig.map = new naver.maps.Map("map", {
        center: new naver.maps.LatLng(37.5665, 126.9780),
        zoom: 15
    })

    // 지도 클릭 시 모든 InfoWindow 닫기
    naver.maps.Event.addListener(mapConfig.map, "click", function () {
        if (mapConfig.activeInfoWindow) {
            mapConfig.activeInfoWindow.close()
            mapConfig.activeInfoWindow = null
        }
    })

    if (pendingStoreData) {
        addStoreMarkers(pendingStoreData)
        pendingStoreData = null
    }
}

// 부모 창에서 가게 데이터 수신 및 지도에 표시
window.addEventListener("message", function (event) {
    if (!mapConfig.map) {
        console.warn("지도 객체가 아직 없음. 메시지를 저장합니다.")
        pendingStoreData = event.data
        return
    }
    addStoreMarkers(event.data)
})

// InfoWindow HTML
function createInfoWindowContent(store) {
    return `
        <div class="custom-infowindow">
            <button onclick="closeInfoWindow()">❌</button>
            <strong style="font-size: 18px; color: #333;">${store.store_name}</strong><br>
            <hr>
            <p>📌 카테고리: ${store.category || '정보 없음'}</p>
            <p>🏢 주소: ${store.address}</p>
            <p>📞 전화번호: ${store.contact_number || '전화번호 없음'}</p>
            <p>ℹ️ 설명: ${store.description || '설명 없음'}</p>
            <a href="http://localhost:8100/stores/${store.store_id}" target="_self">
                <button style="margin-top: 8px; background-color: #2dd36f; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
                    가게 페이지 접속
                </button>
            </a>
        </div>`
}

// 지도에 가게 마커 추가
function addStoreMarkers(data) {
    if (!mapConfig.map) {
        console.warn("지도가 아직 초기화되지 않았습니다.")
        return
    }

    // 기존 마커 제거
    clearMarkers()

    // 현재 위치 마커 갱신
    if (data.currentLocation) {
        const lat = parseFloat(data.currentLocation.lat)
        const lng = parseFloat(data.currentLocation.lng)
        const currentPosition = new naver.maps.LatLng(lat, lng)

        // 이전 마커가 있으면 제거
        if (currentLocationMarker) {
            currentLocationMarker.setMap(null)
        }

        // 새 마커 생성 및 저장
        currentLocationMarker = new naver.maps.Marker({
            position: currentPosition,
            map: mapConfig.map,
            title: "현재 위치",
            icon: {
                content: `<div class="pulse-marker"></div>`,
                anchor: new naver.maps.Point(12, 12)
            }
        })

        mapConfig.map.setCenter(currentPosition)
    }

    data.stores.forEach(store => {
        const rawLat = store.lat ?? store.latitude
        const rawLng = store.lng ?? store.longitude
    
        let lat = parseFloat(rawLat)
        let lng = parseFloat(rawLng)
    
        // 검색된 가게이면 좌표 보정
        const isTarget =
            data.isSearchPerformed &&
            data.targetStoreId &&
            store.store_id == data.targetStoreId
    
        if (isTarget) {
            const correctedLat = normalizeCoordinate(rawLat, true)
            const correctedLng = normalizeCoordinate(rawLng, false)
    
            if (correctedLat == null || correctedLng == null || isNaN(correctedLat) || isNaN(correctedLng)) {
                console.warn('유효하지 않은 보정 좌표:', rawLat, rawLng)
                return
            }
    
            lat = correctedLat
            lng = correctedLng
        }
    
        // NaN 방지
        if (isNaN(lat) || isNaN(lng)) {
            console.warn("유효하지 않은 좌표 (마커 생성 생략):", rawLat, rawLng)
            return
        }
    
        const position = new naver.maps.LatLng(lat, lng)
        const marker = new naver.maps.Marker({
            position: position,
            map: mapConfig.map,
            title: store.store_name
        })
    
        const infoWindow = new naver.maps.InfoWindow({
            content: createInfoWindowContent(store),
            disableAutoPan: false,
            borderWidth: 0,
            backgroundColor: "rgba(0,0,0,0)"
        })
    
        naver.maps.Event.addListener(marker, "click", function () {
            if (mapConfig.activeInfoWindow) {
                mapConfig.activeInfoWindow.close()
            }
            infoWindow.open(mapConfig.map, marker)
            mapConfig.activeInfoWindow = infoWindow
        })
    
        mapConfig.markers.push(marker)
        mapConfig.infoWindows.push(infoWindow)
    
        // InfoWindow 열기 및 지도 이동
        if (isTarget) {
            infoWindow.open(mapConfig.map, marker)
            mapConfig.map.setCenter(position)
            mapConfig.map.setZoom(20)
            mapConfig.activeInfoWindow = infoWindow
        }
    })
}

// 마커 초기화
function clearMarkers() {
    mapConfig.markers.forEach(marker => marker.setMap(null))
    mapConfig.infoWindows.forEach(infoWindow => infoWindow.setMap(null))
    mapConfig.markers = []
    mapConfig.infoWindows = []
}

// 자릿수별 위도, 경도 변환
function normalizeCoordinate(value, isLat = true) {
    const num = parseFloat(value)
    const length = Math.floor(Math.log10(num)) + 1

    if (isLat) {
        if (length === 7) return num / 1e5
        if (length === 8) return num / 1e6
        if (length === 9) return num / 1e7
        if (length === 10) return num / 1e8
    } else {
        if (length === 7) return num / 1e4
        if (length === 8) return num / 1e5
        if (length === 9) return num / 1e6
        if (length === 10) return num / 1e7
    }

    return null
}

function focusIfSearchTarget(store, rawLat, rawLng, data, marker, infoWindow) {
    if (data.isSearchPerformed && data.targetStoreId && store.store_id == data.targetStoreId) {
        const correctedLat = normalizeCoordinate(rawLat, true)
        const correctedLng = normalizeCoordinate(rawLng, false)

        if (correctedLat == null || correctedLng == null || isNaN(correctedLat) || isNaN(correctedLng)) {
            console.warn('유효하지 않은 좌표:', rawLat, rawLng)
            return
        }

        const correctedPosition = new naver.maps.LatLng(correctedLat, correctedLng)

        console.log("보정된 좌표:", correctedLat, correctedLng)

        infoWindow.open(mapConfig.map, marker)
        mapConfig.map.setCenter(correctedPosition)
        mapConfig.map.setZoom(17)
        mapConfig.activeInfoWindow = infoWindow
    }
}

// 닫기 버튼 클릭 시 InfoWindow 닫기
window.closeInfoWindow = function (button) {
    if (mapConfig.activeInfoWindow) {
        mapConfig.activeInfoWindow.close()
        mapConfig.activeInfoWindow = null
    }
}