import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core'
import { ReadStore } from 'src/app/shared/model/stores/read-store.interface'
import { MapsService } from 'src/app/shared/services/maps.service'

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  standalone: false
})

export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  stores: ReadStore[] = []
  filteredStores: ReadStore[] = []
  searchQuery: string = ''
  currentLat: number | null = null
  currentLng: number | null = null
  previousLat: number | null = null
  previousLng: number | null = null
  watchId: number | null = null
  currentLocationMarker: naver.maps.Marker | null = null

  map!: naver.maps.Map
  markers: naver.maps.Marker[] = []

  constructor(private mapsService: MapsService) {}

  ngOnInit(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => this.handlePositionChange(pos.coords.latitude, pos.coords.longitude, pos.coords.accuracy),
        (err) => console.error('위치 정보 실패:', err),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      )

      this.watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const newLat = pos.coords.latitude
          const newLng = pos.coords.longitude

          if (this.previousLat && this.previousLng) {
            const moved = this.calculateDistance(this.previousLat, this.previousLng, newLat, newLng)
            if (moved < 1) return
          }

          this.handlePositionChange(newLat, newLng, pos.coords.accuracy)
        },
        (err) => console.error('위치 추적 실패:', err),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      )
    }
  }

  ngAfterViewInit(): void {
    this.loadMapScript()
  }

  ngOnDestroy(): void {
    if (this.watchId) navigator.geolocation.clearWatch(this.watchId)
  }

  loadMapScript(): void {
    if (document.getElementById('naver-map-script')) {
      this.initMap()
      return
    }
  
    this.mapsService.getClientId().subscribe({
      next: (res) => {
        const script = document.createElement('script')
        script.id = 'naver-map-script'
        script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${res.clientId}`
        script.onload = () => this.initMap()
        document.body.appendChild(script)
      },
      error: (err) => {
        console.error('Client ID 요청 실패:', err)
      }
    })
  }

  initMap(): void {
    const mapContainer = document.getElementById('map')
    if (!mapContainer) return

    // 기본 지도 생성 (서울 기준)
    this.map = new naver.maps.Map(mapContainer, {
      center: new naver.maps.LatLng(37.5665, 126.9780),
      zoom: 15
    })

    // 지도 초기화 후 위치 요청 실행
    this.requestGeolocation()
  }

  private requestGeolocation(): void {
    if (navigator.geolocation) {
      // 최초 1회 위치 요청
      navigator.geolocation.getCurrentPosition(
        (pos) => this.handlePositionChange(
          pos.coords.latitude, 
          pos.coords.longitude, 
          pos.coords.accuracy // 정확도 값 (미터 단위)
        ),
        (err) => console.error('위치 정보 실패:', err),
        { 
          enableHighAccuracy: true, // 고정밀 위치 요청
          timeout: 10000, // 10초 안에 위치 못 찾으면 실패 처리
          maximumAge: 0 // 이전 위치 캐시 사용 금지 (항상 새 위치 요청)
        }
      )

      // 실시간 위치 추적 (토글 없이 항상 활성화)
      this.watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const newLat = pos.coords.latitude
          const newLng = pos.coords.longitude

          console.log(`[실시간 위치] lat: ${newLat}, lng: ${newLng}, accuracy: ${pos.coords.accuracy}m`) // 지우지 말것

          if (this.previousLat && this.previousLng) {
            const moved = this.calculateDistance(this.previousLat, this.previousLng, newLat, newLng)
            if (moved < 1) return // 1m 이상 이동한 경우에 다시 요청
          }

          this.handlePositionChange(newLat, newLng, pos.coords.accuracy)
        },
        (err) => console.error('위치 추적 실패:', err),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      )
    }
  }

  handlePositionChange(lat: number, lng: number, accuracy: number): void {
    // 정확도 기준 판단 (150m 이상은 경고)
    if (accuracy > 150) {
      alert('현재 위치의 정확도가 낮습니다. Wi-Fi 대신 GPS 환경을 권장합니다.')
    }

    this.currentLat = lat
    this.currentLng = lng
    this.previousLat = lat
    this.previousLng = lng

    if (this.map) {
      const position = new naver.maps.LatLng(lat, lng)
    
      // 기존 마커 제거
      if (this.currentLocationMarker) {
        this.currentLocationMarker.setMap(null)
      }
    
      // 새 마커 생성
      this.currentLocationMarker = new naver.maps.Marker({
        position,
        map: this.map,
        title: '현재 위치',
        // icon: {
        //   content: `<div class="pulse-marker"></div>`,
        //   anchor: new naver.maps.Point(12, 12)
        // }
      })
    
      this.map.setCenter(position) // 초기 이동
    }

    this.mapsService.readStoreByCurrentLocation(lat, lng).subscribe(
      (stores) => {
        this.stores = stores
        this.filteredStores = stores
        this.drawMarkers(stores)
      },
      (err) => console.error('가게 로딩 실패:', err)
    )
  }
  
  drawMarkers(stores: ReadStore[]): void {
    if (!this.map) return

    this.markers.forEach(m => m.setMap(null))
    this.markers = []

    stores.forEach(store => {
      const lat = store.latitude
      const lng = store.longitude
    
      if (isNaN(lat) || isNaN(lng)) return
    
      const pos = new naver.maps.LatLng(lat, lng)
      const marker = new naver.maps.Marker({ position: pos, map: this.map, title: store.store_name })
    
      const infoWindow = new naver.maps.InfoWindow({
        content: this.createInfoWindowHtml(store),
        disableAutoPan: false
      })
    
      naver.maps.Event.addListener(marker, 'click', () => {
        infoWindow.open(this.map, marker)
      })
    
      this.markers.push(marker)
    })
  }

  focusStoreOnMap(store: ReadStore): void {
    const lat = store.latitude
    const lng = store.longitude
    if (!this.map || isNaN(lat) || isNaN(lng)) return
  
    const position = new naver.maps.LatLng(lat, lng)
    this.map.setCenter(position)
    this.map.setZoom(18)
  
    const marker = new naver.maps.Marker({ position, map: this.map })
    const infoWindow = new naver.maps.InfoWindow({
      content: this.createInfoWindowHtml(store),
      disableAutoPan: false
    })
    infoWindow.open(this.map, marker)
    this.markers.push(marker)
  }  

  // InfoWindow HTML
  createInfoWindowHtml(store: ReadStore): string {
    return `
      <div class="custom-infowindow">
        <button onclick="this.parentElement.style.display='none'">❌</button>
        <div class="info-content">
          <strong style="font-size: 18px; color: #333;">${store.store_name}</strong><br>
          <hr>
          <p>📌 카테고리: ${store.category?.category_name || '정보 없음'}</p>
          <p>🏢 주소: ${store.address}</p>
          <p>📞 전화번호: ${store.contact_number || '전화번호 없음'}</p>
          <p>ℹ️ 설명: ${store.description || '설명 없음'}</p>
        </div>
      </div>`;
  }

  // Haversine 거리 계산 (단위: 미터)
  calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371e3 // 지구 반지름

    // 위도 경도 라디안 변환
    const φ1 = lat1 * Math.PI / 180
    const φ2 = lat2 * Math.PI / 180
    const Δφ = (lat2 - lat1) * Math.PI / 180
    const Δλ = (lng2 - lng1) * Math.PI / 180

    // Haversine 공식 계산
    const a = Math.sin(Δφ / 2) ** 2 +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) ** 2
              
    // 최종 거리 계산
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c
  }

  // 검색
  onSearch(query: string) {
    this.searchQuery = query.trim()
    if (!this.searchQuery) {
      this.filteredStores = this.stores
      return
    }

    this.mapsService.readStoresByKeyword(this.searchQuery).subscribe(
      (stores) => {
        this.filteredStores = stores
        this.drawMarkers(stores)
      },
      (err) => console.error('검색 실패:', err)
    )
  }

  // 검색창 지우기
  onClearSearch(): void {
    this.searchQuery = ''
    this.filteredStores = []
    this.markers.forEach(m => m.setMap(null))
    this.markers = []
  }

}
