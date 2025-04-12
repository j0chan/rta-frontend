import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core'
import { Router } from '@angular/router'
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
  alertVisible: boolean = true
  currentLat: number | null = null
  currentLng: number | null = null
  previousLat: number | null = null
  previousLng: number | null = null
  watchId: number | null = null
  // isTracking: boolean = false // 실시간 추적 상태

  constructor(
    private mapsService: MapsService,
    private router: Router
  ) {}

  ngOnInit() {
    if (navigator.geolocation) {
      // 최초 1회 위치 요청
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.handlePositionChange(
            position.coords.latitude,
            position.coords.longitude,
            position.coords.accuracy // 정확도 값 (미터 단위)
          )

        },
        (error) => {
          console.error('위치 정보 가져오기 실패:', error)
        },
        {
          enableHighAccuracy: true, // 고정밀 위치 요청
          timeout: 10000, // 10초 안에 위치 못 받으면 실패 처리
          maximumAge: 0 // 이전 위치 캐시 사용 금지 (항상 새 위치 요청)
        }
      )

      // 실시간 위치 추적 (토글 없이 항상 활성화)
      this.watchId = navigator.geolocation.watchPosition(
        (position) => {
          const newLat = position.coords.latitude
          const newLng = position.coords.longitude
          const accuracy = position.coords.accuracy

          console.log(`[실시간 위치] lat: ${newLat}, lng: ${newLng}, accuracy: ${accuracy}m`) // 지우지 말것

          if (this.previousLat !== null && this.previousLng !== null) {
            const movedDistance = this.calculateDistance(this.previousLat, this.previousLng, newLat, newLng)
            if (movedDistance < 1) return // 1m 이상 이동한 경우에 다시 요청
          }

          this.handlePositionChange(newLat, newLng, accuracy)
        },
        (error) => {
          console.error('위치 추적 실패:', error)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      )
    } else {
      console.error('브라우저가 위치 정보를 지원하지 않습니다.')
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.currentLat !== null && this.currentLng !== null) {
        this.sendStoresToMap(false, {
          lat: this.currentLat,
          lng: this.currentLng
        })
      }
    }, 1000)
  }

  ngOnDestroy() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId)
    }
  }

  // 위치 추적 시작
  // startTracking() {
  //   if (!navigator.geolocation) return
  //   this.watchId = navigator.geolocation.watchPosition(
  //     (position) => {
  //       const newLat = position.coords.latitude
  //       const newLng = position.coords.longitude
  //       const accuracy = position.coords.accuracy

  //       console.log(`[실시간 위치] lat: ${newLat}, lng: ${newLng}, accuracy: ${accuracy}m`)

  //       if (this.previousLat !== null && this.previousLng !== null) {
  //         const movedDistance = this.calculateDistance(this.previousLat, this.previousLng, newLat, newLng)
  //         if (movedDistance < 1) return // 1m 이상 이동한 경우에만 요청
  //       }

  //       this.handlePositionChange(newLat, newLng, accuracy)
  //     },
  //     (error) => {
  //       console.error('위치 추적 실패:', error)
  //     },
  //     {
  //       enableHighAccuracy: true,
  //       timeout: 10000,
  //       maximumAge: 0
  //     }
  //   )
  // }

  // 위치 추적 중지
  // stopTracking() {
  //   if (this.watchId !== null) {
  //     navigator.geolocation.clearWatch(this.watchId)
  //     this.watchId = null
  //   }
  // }

  // 토글 버튼에서 호출
  // toggleTracking() {
  //   this.isTracking = !this.isTracking
  //   if (this.isTracking) {
  //     this.startTracking()
  //   } else {
  //     this.stopTracking()
  //   }
  // }
  
  handlePositionChange(lat: number, lng: number, accuracy: number) {
    // 정확도 기준 판단 (150m 이상은 경고)
    if (accuracy > 150) {
      alert('현재 위치의 정확도가 낮습니다. Wi-Fi 대신 GPS 환경을 권장합니다.')
    }

    this.currentLat = lat
    this.currentLng = lng
    this.previousLat = lat
    this.previousLng = lng

    this.mapsService.readStoreByCurrentLocation(lat, lng).subscribe(
      (stores) => {
        this.stores = stores
        this.filteredStores = stores
        this.sendStoresToMap(false, { lat, lng })
      },
      (error) => {
        console.error('위치 기반 가게 불러오기 실패:', error)
      }
    )
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
  
    // 1. 키워드로 서버 검색
    this.mapsService.readStoresByKeyword(this.searchQuery).subscribe(
      (stores) => {
        if (!stores || stores.length === 0) {
          this.alertVisible = true
          this.filteredStores = []
          return
        }
  
        // 검색 결과가 있을 경우 → 마커 + 리스트 출력
        this.filteredStores = stores
  
        this.sendStoresToMap(true, {
          lat: this.currentLat ?? 37.5665,
          lng: this.currentLng ?? 126.9780
        })
      },
      (error) => {
        console.error('키워드 검색 실패:', error)
        this.filteredStores = []
        this.alertVisible = true // 오류 시에도 팝업 표시
      }
    )
  }

  // 가게 등록 페이지로 이동
  openStoreRequestForm() {
    // 현재 활성화된 요소를 HTMLElement로 변환 후 blur() 실행
    const activeElement = document.activeElement as HTMLElement
    if (activeElement) {
      activeElement.blur() // focus 해제 후 페이지 이동
    }
    this.alertVisible = false // alert 숨기기
    this.router.navigate(['/stores/create-store-request'])
  }

  // map iframe에 가게 데이터를 전달
  sendStoresToMap(isSearchPerformed: boolean, currentLocation?: { lat: number, lng: number }, targetStoreId?: number) {
    const iframe = document.getElementById('map-iframe') as HTMLIFrameElement

    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({
        stores: this.filteredStores,
        isSearchPerformed,
        currentLocation,
        targetStoreId
      }, '*')
    }
  }

  focusStoreOnMap(store: ReadStore) {
    this.sendStoresToMap(
      true,
      {
        lat: this.currentLat ?? 37.5665,
        lng: this.currentLng ?? 126.9780
      },
      store.store_id
    )
  }

  onClearSearch() {
    this.searchQuery = ''
    this.filteredStores = []
    this.alertVisible = false
  }
  
}