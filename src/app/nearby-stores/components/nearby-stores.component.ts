import { Component, OnInit, AfterViewInit } from '@angular/core'
import { ReadStore } from 'src/app/shared/model/stores/read-store.interface'
import { NearbyStoresService } from 'src/app/shared/services/nearby-stores.service'
import { ModalController } from '@ionic/angular'
import { StoreRequestComponent } from 'src/app/admin/components/store-request/store-request.component'

@Component({
  selector: 'app-nearby-stores',
  templateUrl: './nearby-stores.component.html',
  styleUrls: ['./nearby-stores.component.scss'],
  standalone: false
})
export class NearbyStoresComponent implements OnInit, AfterViewInit {
  stores: ReadStore[] = []
  filteredStores: ReadStore[] = []
  searchQuery: string = ''

  constructor(
    private nearbyStoresService: NearbyStoresService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.nearbyStoresService.getAllStores().subscribe(
      (data: ReadStore[]) => {
        this.stores = data
        this.filteredStores = data // 초기에는 모든 가게 표시
        this.sendStoresToMap(false)
      },
      (error) => console.error('가게 데이터 로딩 실패:', error)
    )
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.sendStoresToMap(false)
    }, 1000)
  }

  // 검색
  onSearch(query: string) {
    this.searchQuery = query.trim().toLowerCase() // 검색어 저장 (+ 소문자 변환)
  
    if (!this.searchQuery) {
      this.filteredStores = []
      return
    }
  
    // 가게 이름을 먼저 검색해서 store_id를 찾는다
    const foundStore = this.stores.find(store => 
      store.store_name.toLowerCase().includes(this.searchQuery)
    )
  
    if (!foundStore) {
      this.filteredStores = []
      return
    }
  
    const storeId = foundStore.store_id
  
    // store_id로 상세 정보 조회
    this.nearbyStoresService.getStoreById(storeId).subscribe(
      (data) => {
        this.filteredStores = data ? [data] : []
        this.sendStoresToMap(true)
      },
      () => {
        this.filteredStores = []
      }
    )
  }

  // 가게 등록 폼 모달 열기
  async openStoreRequestForm() {
    const modal = await this.modalController.create({
      component: StoreRequestComponent,
      componentProps: { storeName: this.searchQuery }
    })

    await modal.present()
  }

  // map iframe에 가게 데이터를 전달
  sendStoresToMap(isSearchPerformed: boolean) {
    const iframe = document.getElementById('map-iframe') as HTMLIFrameElement
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({ stores: this.filteredStores, isSearchPerformed }, '*')
    }
  }
}