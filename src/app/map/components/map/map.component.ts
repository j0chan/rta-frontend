import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core'
import { ReadStore } from 'src/app/shared/model/stores/read-store.interface'
import { MapsService } from 'src/app/shared/services/maps.service'
import { ToastController } from '@ionic/angular'
import { OpenaiService } from 'src/app/shared/services/openai.service'
import { NaverPlace } from 'src/app/shared/model/maps/naver-place.interface'

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
  infoWindows: naver.maps.InfoWindow[] = []

  userWeather: string = ''
  recommendedKeywords: string[] = []
  selectedKeyword: string | null = null
  matchedStores: ReadStore[] = []
  externalPlaces: NaverPlace[] = []
  tabMode: 'search' | 'recommend' = 'search'
  isResultVisible: boolean = true

  isFixedLocation: boolean = false
  fixedLat: number = 36.62112673
  fixedLng: number = 127.2861977

  constructor(
    private mapsService: MapsService,
    private toastController: ToastController,
    private openaiService: OpenaiService
  ) {}

  ngOnInit(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => this.handlePositionChange(pos.coords.latitude, pos.coords.longitude, pos.coords.accuracy),
        (err) => console.error('위치 정보 실패:', err),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      )

      // 초기 위치 받은 후에만 실시간 위치 추적 시작
      this.watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const newLat = pos.coords.latitude
          const newLng = pos.coords.longitude

          if (this.previousLat && this.previousLng) {
            const moved = this.calculateDistance(this.previousLat, this.previousLng, newLat, newLng)
            if (moved < 1) return // 1m 미만 이동은 무시
          }

          this.handlePositionChange(newLat, newLng, pos.coords.accuracy)
        },
        (err) => console.error('위치 추적 실패:', err),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      )
    }

    //this.generateKeywordRecommendations() // 추가: 컴포넌트 로드시 AI 키워드 추천 실행
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
        script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${res.clientId}`
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

    // 지도 클릭 시 infoWindow 모두 닫기
    naver.maps.Event.addListener(this.map, 'click', () => {
      this.infoWindows.forEach(win => win.close())
    })
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
        (err) => {
          switch (err.code) {
            case err.PERMISSION_DENIED:
              console.error("위치 권한 거부됨")
              break
            case err.POSITION_UNAVAILABLE:
              console.error("위치 정보를 가져올 수 없음")
              break
            case err.TIMEOUT:
              console.error("위치 정보 가져오기 시간 초과")
              break
            default:
              console.error("알 수 없는 위치 오류:", err)
          }
        },
        { 
          enableHighAccuracy: false,  // 속도 문제로 false 지정 (true일 경우 정확도↑ 속도↓)
          timeout: 20000,             // 20초까지 대기
          maximumAge: 0               // 이전 위치 캐시 금지
        }
      )

      // 기존 watchPosition이 있으면 먼저 해제
      if (this.watchId) {
        navigator.geolocation.clearWatch(this.watchId)
        this.watchId = null
      }

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
        (err) => {
          switch (err.code) {
            case err.PERMISSION_DENIED:
              console.error("실시간 위치 권한 거부됨")
              break
            case err.POSITION_UNAVAILABLE:
              console.error("실시간 위치 정보를 가져올 수 없음")
              break
            case err.TIMEOUT:
              console.error("실시간 위치 가져오기 시간 초과")
              break
            default:
              console.error("알 수 없는 실시간 위치 오류:", err)
          }
        },
        { 
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 0
        }
      )
    }
  }

  async showAccuracyWarning() {
    const toast = await this.toastController.create({
      message: '현재 위치의 정확도가 낮습니다. Wi-Fi 대신 GPS 환경을 권장합니다.',
      duration: 4000,
      position: 'top',
      color: 'primary',
      buttons: [
        {
          text: '닫기',
          role: 'cancel'
        }
      ]
    })
    toast.present()
  }

  handlePositionChange(lat: number, lng: number, accuracy: number): void {

    // 토글(개발모드)이 켜져있으면 항상 fixedLat/Lng 사용
    if (this.isFixedLocation) {
      lat = this.fixedLat
      lng = this.fixedLng
      accuracy = 0
    }
    
    console.log(`[update] lat: ${lat}, lng: ${lng}, accuracy: ${accuracy}m`)
    
    // 정확도 기준 판단 (150m 이상은 경고)
    if (accuracy > 150) {
      // alert('현재 위치의 정확도가 낮습니다. Wi-Fi 대신 GPS 환경을 권장합니다.')
      this.showAccuracyWarning()
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
        icon: {
          content: `
            <div style="
              position: relative;
              width: 48px;
              height: 48px;
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <!-- pulse -->
              <div style="
                position: absolute;
                width: 48px;
                height: 48px;
                background: rgba(255, 100, 100, 0.3);
                border-radius: 50%;
                animation: pulse 1.5s ease-out infinite;
              "></div>
      
              <!-- 중앙 원 -->
              <div style="
                width: 28px;
                height: 28px;
                background: linear-gradient(135deg, #ff6b6b, #ff4d4d);
                border: 4px solid white;
                border-radius: 50%;
                box-shadow: 0 0 8px rgba(0, 0, 0, 0.25);
                z-index: 2;
                position: relative;
              ">
                <div style="
                  content: '';
                  position: absolute;
                  width: 8px;
                  height: 8px;
                  background: white;
                  border-radius: 50%;
                  top: 5px;
                  left: 5px;
                  opacity: 0.5;
                "></div>
              </div>
      
              <!-- pulse animation -->
              <style>
                @keyframes pulse {
                  0% {
                    transform: scale(0.6);
                    opacity: 1;
                  }
                  100% {
                    transform: scale(1.6);
                    opacity: 0;
                  }
                }
              </style>
            </div>
          `,
          anchor: new naver.maps.Point(24, 24) // 중앙 맞추기 (48 / 2)
        }
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
        borderWidth: 0,
        backgroundColor: 'transparent',
        disableAnchor: false,
        disableAutoPan: false
      })
      
      this.infoWindows.push(infoWindow)

      naver.maps.Event.addListener(marker, 'click', () => {
        infoWindow.open(this.map, marker)

        // InfoWindow 내부 닫기 버튼 이벤트 바인딩
        const closeBtn = document.querySelector('.info-close')
        if (closeBtn) {
          closeBtn.addEventListener('click', () => {
            infoWindow.close()
          })
        }
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
  
    // 기존 마커, InfoWindow 정리
    this.markers.forEach(m => m.setMap(null))
    this.infoWindows.forEach(iw => iw.close())
    this.markers = []
    this.infoWindows = []
  
    const marker = new naver.maps.Marker({
      position,
      map: this.map,
      title: store.store_name
    })
  
    const infoWindow = new naver.maps.InfoWindow({
      content: this.createInfoWindowHtml(store),
      borderWidth: 0,
      backgroundColor: 'transparent',
      disableAnchor: false,
      disableAutoPan: false
    })
  
    infoWindow.open(this.map, marker)
    this.markers.push(marker)
    this.infoWindows.push(infoWindow)
  
    // InfoWindow 렌더링 이후 닫기 버튼 이벤트 바인딩
    setTimeout(() => {
      const closeBtn = document.querySelector('.info-close')
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          infoWindow.close()
        })
      }
    }, 0)
  }

  // InfoWindow HTML
  createInfoWindowHtml(store: ReadStore): string {
    return `
      <div style="
        background-color: #fff;
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 20px;
        padding: 16px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        width: 260px;
        font-family: 'Segoe UI', 'Roboto', sans-serif;
        color: #333;
        line-height: 1.5;
        position: relative;
      ">
        <button class="info-close"
          style="
          position: absolute;
          top: 8px;
          right: 8px;
          border: none;
          background: none;
          font-size: 16px;
          cursor: pointer;
        ">❌</button>
  
        <div style="margin-top: 8px;">
          <strong style="font-size: 18px; color: #333;">${store.store_name}</strong><br>
          <hr style="border: none; border-top: 1px solid #eee; margin: 8px 0;">
          <p style="margin: 4px 0; font-size: 14px;">📌 카테고리: ${store.category.category_name || '정보 없음'}</p>
          <p style="margin: 4px 0; font-size: 14px;">🏠 주소: ${store.address}</p>
          <p style="margin: 4px 0; font-size: 14px;">📞 전화번호: ${store.contact_number || '전화번호 없음'}</p>
          <p style="margin: 4px 0; font-size: 14px;">ℹ️ 설명: ${store.description || '설명 없음'}</p>
        </div>
  
        <a href="http://localhost:4200/stores/${store.store_id}" target="_self" style="display: block; margin-top: 12px; text-align: center; text-decoration: none;">
          <button style="
            background-color: #4CAF50;
            color: #fff;
            border: none;
            padding: 8px 12px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
          ">가게 페이지 접속</button>
        </a>
      </div>
    `;
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
    this.tabMode = 'search' // 검색 탭으로 전환
    this.isResultVisible = true // 리스트 펼치기

    if (!this.searchQuery) {
      this.filteredStores = this.stores
      return
    }

    this.mapsService.readStoresByKeyword(this.searchQuery).subscribe(
      (stores) => {
        // 좌표 변환 처리
        const normalized = stores
          .map(store => {
            const lat = this.normalizeCoordinate(store.latitude, true)
            const lng = this.normalizeCoordinate(store.longitude, false)
            if (lat === null || lng === null) return null
            return { ...store, latitude: lat, longitude: lng }
          })
          .filter((s): s is ReadStore => s !== null) // 타입 가드

        this.filteredStores = normalized
        this.drawMarkers(normalized)
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

  // 좌표 변환
  normalizeCoordinate(value: number | string, isLat = true): number | null {
    const num = parseFloat(value.toString())
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

  // OpenAI 키워드 요청
  generateKeywordRecommendations() {
    this.selectedKeyword = ''
    this.recommendedKeywords = []

    this.tabMode = 'recommend'
    this.isResultVisible = true

    const today = new Date()
    const month = today.getMonth() + 1
    
    const prompt = `
      한국 ${month}월 날씨에 맞게 메뉴 3개만 추천해줘. 번호는 붙이지 말고. (예: 냉면, 파스타, 김치찌개)
    `

    this.openaiService.getRecommendedKeywords(prompt).subscribe({
      next: (keywords: string[]) => {
        this.recommendedKeywords = keywords
        // this.selectedKeyword = null // 초기화
        // this.filteredStores = [] // 클릭 전까지 비움
        console.log('추천 키워드:', keywords)
      },
      error: (err) => {
        console.error('추천 키워드 불러오기 실패:', err)
      }
    })
  }

  // 키워드 기반 가게 필터링
  // filterStoresByKeywords(keywords: string[]) {
  //   console.log('키워드 기반 필터링 시작:', keywords)
  //   this.filteredStores = this.stores.filter(store =>
  //     keywords.some(keyword =>
  //       store.store_name.includes(keyword) ||
  //       store.category?.category_name?.includes(keyword)
  //     )
  //   )
  //   console.log(`필터링된 가게 수: ${this.filteredStores.length}`)
  //   this.drawMarkers(this.filteredStores)
  // }

  // 사용자가 선택한 키워드로 가게를 필터링하고 지도에 표시
  onClickKeyword(keyword: string) {
    if (!this.currentLat || !this.currentLng) {
      console.error('현재 위치 정보가 없습니다.')
      return
    }

    this.selectedKeyword = keyword
    this.tabMode = 'recommend'
    this.isResultVisible = true

    this.mapsService.readStoresByKeywordMatch(keyword, this.currentLat, this.currentLng).subscribe({
      next: (res) => {
        if (!res || !res.matchedStores || !res.externalPlaces) {
          console.warn('예상치 못한 응답 형식:', res)
          this.matchedStores = []
          this.externalPlaces = []
          return
        }
        this.matchedStores = res.matchedStores
        this.externalPlaces = res.externalPlaces
        this.filteredStores = [...res.matchedStores] // 리스트에 둘 다 표시하려면 여기도 합쳐도 됨

        this.drawMixedMarkers(this.matchedStores, this.externalPlaces)
      },
      error: (err) => {
        console.error('키워드 검색 실패:', err)
      }
    })
  }

  drawMixedMarkers(matchedStores: ReadStore[], externalPlaces: any[]): void {
    if (!this.map) return

    // 기존 마커 제거
    this.markers.forEach(m => m.setMap(null))
    this.markers = []

    // DB 마커: 초록색
    matchedStores.forEach(store => {
      const lat = store.latitude
      const lng = store.longitude
      if (isNaN(lat) || isNaN(lng)) return

      const pos = new naver.maps.LatLng(lat, lng)
      const marker = new naver.maps.Marker({
        position: pos,
        map: this.map,
        title: store.store_name,
        icon: {
          content: `<div style="width: 14px; height: 14px; background: green; border-radius: 50%;"></div>`,
          anchor: new naver.maps.Point(7, 7)
        }
      })

      this.markers.push(marker)
    })

    // 외부 마커: 회색
    externalPlaces.forEach(place => {
      const lat = parseFloat(place.mapy) / 1e7
      const lng = parseFloat(place.mapx) / 1e7
      if (isNaN(lat) || isNaN(lng)) return

      const pos = new naver.maps.LatLng(lat, lng)
      const marker = new naver.maps.Marker({
        position: pos,
        map: this.map,
        title: place.title.replace(/<[^>]*>/g, ''),
        icon: {
          content: `<div style="width: 14px; height: 14px; background: gray; border-radius: 50%;"></div>`,
          anchor: new naver.maps.Point(7, 7)
        }
      })

      this.markers.push(marker)
    })
  }

  handleSearchTabClick(): void {
    if (!this.searchQuery?.trim()) return
    this.tabMode = 'search'
    this.isResultVisible = true
    this.onSearch(this.searchQuery) // 현재 검색어로 다시 검색 실행
  }

  focusExternalPlaceOnMap(place: NaverPlace): void {
    if (!this.map) return

    const lat = parseFloat(place.mapy) / 1e7 // Naver API는 정수로 제공됨
    const lng = parseFloat(place.mapx) / 1e7
    const position = new naver.maps.LatLng(lat, lng)

    const marker = new naver.maps.Marker({
      position,
      map: this.map,
      title: place.title.replace(/<[^>]*>/g, '') // 태그 제거
    })

    const infoHtml = `
      <div style="
        background: white;
        border-radius: 12px;
        padding: 16px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        max-width: 280px;
        font-family: 'Segoe UI', sans-serif;
        position: relative;
      ">
        <div style="font-size: 16px; font-weight: bold; color: #333; margin-bottom: 4px;">
          ${place.title.replace(/<[^>]*>/g, '')}
        </div>
        <div style="font-size: 13px; color: #666; margin-bottom: 6px;">
          ${place.category || '카테고리 정보 없음'}
        </div>
        <div style="font-size: 13px; color: #444; margin-bottom: 6px;">
          🏠 ${place.roadAddress || place.address}
        </div>
        ${place.telephone ? `<div style="font-size: 13px; color: #444; margin-bottom: 6px;">📞 ${place.telephone}</div>` : ''}
        ${place.link ? `
          <a href="${place.link}" target="_blank" style="
            display: inline-block;
            margin-top: 8px;
            padding: 6px 10px;
            background: #4caf50;
            color: white;
            font-size: 13px;
            border-radius: 8px;
            text-decoration: none;
          ">🔗 더보기</a>
        ` : ''}
      </div>
    `

    const infoWindow = new naver.maps.InfoWindow({
      content: infoHtml,
      backgroundColor: 'transparent',
      borderWidth: 0,
      disableAnchor: true
    })

    infoWindow.open(this.map, marker)

    this.map.setCenter(position)
    this.map.setZoom(17)

    // 기존 마커/창 정리하고 리스트에 넣어 관리해도 됨 (선택)
    this.markers.push(marker)
    this.infoWindows.push(infoWindow)
  }

  // 현위치 재검색
  refreshCurrentLocation(): void {
    if (this.watchId) {
      navigator.geolocation.clearWatch(this.watchId)
      this.watchId = null
    }
    this.requestGeolocation()
  }

  // 개발 모드 토글 버튼 눌렀을 때
  toggleFixedLocation(): void {
    this.isFixedLocation = !this.isFixedLocation

    if (this.isFixedLocation) {
      console.log("개발 모드 ON: 좌표 고정됨")
      // 고정 좌표로 바로 위치 갱신
      this.handlePositionChange(this.fixedLat, this.fixedLng, 0)
    } else {
      console.log("개발 모드 OFF: 실제 위치 추적 재개")
      this.refreshCurrentLocation()
    }
  }

}
