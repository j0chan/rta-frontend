import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { StoreRequestsService } from 'src/app/shared/services/store-requests.service'
import { Location } from '@angular/common'
import { ReadStore } from 'src/app/shared/model/stores/read-store.interface'
import { MapsService } from 'src/app/shared/services/maps.service'

@Component({
  selector: 'app-create-store-request',
  templateUrl: './create-store-request.component.html',
  styleUrls: ['./create-store-request.component.scss'],
  standalone: false
})

export class CreateStoreRequestComponent {
  storeRequest = {
    user_id: 0,
    store_name: '',
    address: '',
    contact_number: '',
    category: ''
  }

  searchResults: ReadStore[] = []
  userLatitude: number | null = null
  userLongitude: number | null = null

  constructor(
    private mapsService: MapsService,
    private storeRequestsService: StoreRequestsService,
    private router: Router,
    private location: Location
  ) {
    this.getUserLocation() // 컴포넌트가 로드될 때 사용자 위치 가져오기
  }

  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.userLatitude = position.coords.latitude
          this.userLongitude = position.coords.longitude
        },
        (error) => {
          console.error('위치 정보를 가져올 수 없습니다:', error)
          this.userLatitude = 37.5665
          this.userLongitude = 126.9780
        }
      )
    } else {
      console.error('이 브라우저에서는 위치 정보를 지원하지 않습니다.')
    }
  }

  searchStore() {
    if (!this.storeRequest.store_name.trim()) {
      alert('검색어를 입력하세요.')
      return
    }
    if (this.userLatitude === null || this.userLongitude === null) {
      alert('위치 정보를 가져올 수 없습니다.')
      return
    }
  
    this.mapsService.readStoresByName(this.userLatitude, this.userLongitude, this.storeRequest.store_name)
      .subscribe(
        (stores: ReadStore[]) => {
          this.searchResults = stores
        },
        (error) => {
          console.error('검색 중 오류 발생:', error)
        }
      )
  }

  selectStore(store: ReadStore) {
    this.storeRequest.store_name = store.store_name
    this.storeRequest.category = store.category.category_name
    this.storeRequest.address = store.address
    this.storeRequest.contact_number  = store.contact_number 
    this.searchResults = []  // 검색 결과 목록 닫기
  }

  async submitRequest() {
    try {
      const userId = 123
      this.storeRequest.user_id = userId

      await this.storeRequestsService.createStoreRequest(this.storeRequest)
      alert('가게 신청이 완료되었습니다.')
      this.router.navigate(['/map'])
    } catch (error) {
      alert('신청 중 오류가 발생했습니다.')
    }
  }

  goBack() {
    this.location.back()
  }
}
