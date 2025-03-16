let scriptLoaded = false // 네이버 지도 API 로드 여부

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

    fetch("http://localhost:3000/api/maps/client-id")
        .then((response) => response.json())
        .then((data) => {

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
    // 현위치 가져오기
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                let lat = position.coords.latitude // 위도
                let lng = position.coords.longitude // 경도
                let currentLocation = new naver.maps.LatLng(lat, lng)

                // 지도 객체 생성 (현위치를 중심으로)
                mapConfig.map = new naver.maps.Map("map", {
                    center: currentLocation,
                    zoom: 15
                })

                // 지도 클릭 시 모든 InfoWindow 닫기
                naver.maps.Event.addListener(mapConfig.map, "click", function () {
                    if (mapConfig.activeInfoWindow) {
                        mapConfig.activeInfoWindow.close()
                        mapConfig.activeInfoWindow = null
                    }
                })

                // 현재 위치에 마커 추가
                new naver.maps.Marker({
                    position: currentLocation,
                    map: mapConfig.map,
                    title: "현재 위치"
                })
            },
            function (error) {
                console.error("위치 정보를 가져올 수 없습니다: ", error)
                // 위치 정보를 가져오지 못한 경우, 기본 위치(서울)로 설정
                mapConfig.map = new naver.maps.Map("map", {
                    center: new naver.maps.LatLng(37.5665, 126.9780),
                    zoom: 15
                })
            }
        )
    } else {
        alert("위치 정보를 지원하지 않는 브라우저입니다.")
    }
}

// 부모 창에서 가게 데이터 수신 및 지도에 표시
window.addEventListener("message", function (event) {
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
        </div>`;
}

// 지도에 가게 마커 추가
function addStoreMarkers(stores) {
    if (!mapConfig.map) return

    // 기존 마커 제거
    clearMarkers()

    stores.forEach(store => {
        const lat = parseFloat(store.latitude) / 1e7
        const lng = parseFloat(store.longitude) / 1e7

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

        // 마커 클릭 시 정보창 표시
        naver.maps.Event.addListener(marker, "click", function () {
            if (mapConfig.activeInfoWindow) {
                mapConfig.activeInfoWindow.close()
            }
            infoWindow.open(mapConfig.map, marker)
            mapConfig.activeInfoWindow = infoWindow
        })

        mapConfig.markers.push(marker)
        mapConfig.infoWindows.push(infoWindow)
        mapConfig.map.setCenter(position)
        mapConfig.map.setZoom(17)
    })
}

// 마커 초기화
function clearMarkers() {
    mapConfig.markers.forEach(marker => marker.setMap(null))
    mapConfig.infoWindows.forEach(infoWindow => infoWindow.setMap(null))
    mapConfig.markers = []
    mapConfig.infoWindows = []
}

// 닫기 버튼 클릭 시 InfoWindow 닫기
window.closeInfoWindow = function (button) {
    if (mapConfig.activeInfoWindow) {
        mapConfig.activeInfoWindow.close()
        mapConfig.activeInfoWindow = null
    }
}