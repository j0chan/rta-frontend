import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { ApiResponseDTO } from 'src/app/shared/model/common/api-response.interface'
import { ReadStore } from 'src/app/shared/model/stores/read-store.interface'
import { StoresService } from 'src/app/shared/services/stores.service'

@Component({
  selector: 'app-store-detail-page',
  templateUrl: './store-detail-page.html',
  standalone: false
})
export class StoreDetailPage implements OnInit {
  store: ReadStore | null = null
  currentLat: number | null = null
  currentLng: number | null = null

  constructor(
    private route: ActivatedRoute,
    private storesService: StoresService
  ) { }

  ngOnInit() {
    const store_id = Number(this.route.snapshot.paramMap.get('store_id'))

    // 현재 위치 가져오기
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.currentLat = position.coords.latitude
          this.currentLng = position.coords.longitude
          this.sendDataToMap() // 위치 가져온 후 전달
        },
        (error) => {
          console.error('위치 정보 가져오기 실패:', error)
          this.sendDataToMap() // 위치 없더라도 store 정보만 보내기
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      )
    }

    if (store_id) {
      this.storesService.getStoreById(store_id).subscribe((response: ApiResponseDTO<ReadStore>) => {
        this.store = response.data ?? null
        this.sendDataToMap() // 가게 정보 가져온 후 전달
        console.log('store 정보 확인:', this.store)
      })
    }

    // iframe 로드 이벤트 등록
    const iframe = document.getElementById('mini-map-iframe') as HTMLIFrameElement
    if (iframe) {
      iframe.addEventListener('load', () => {
        this.sendDataToMap()
      })
    }
  }

  // iframe에 지도 정보 전달
  sendDataToMap() {
    const iframe = document.getElementById('mini-map-iframe') as HTMLIFrameElement

    if (!iframe || !iframe.contentWindow || !this.store) return

    iframe.contentWindow.postMessage({
      stores: [this.store],
      isSearchPerformed: false,
      // 단일 가게일 경우 현위치를 넘기지 않는다 (현위치가 아닌 가게로 포커스)
      // currentLocation: this.currentLat && this.currentLng
      //   ? { lat: this.currentLat, lng: this.currentLng }
      //   : undefined
    }, '*')
  }
}