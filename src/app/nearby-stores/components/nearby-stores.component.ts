import { Component, OnInit, AfterViewInit } from '@angular/core'
import { Router } from '@angular/router'
import { ReadStore } from 'src/app/shared/model/stores/read-store.interface'
import { StoresService } from 'src/app/shared/services/stores.service'

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
  alertVisible: boolean = true

  constructor(
    private storesService: StoresService,
    private router: Router
  ) {}

  ngOnInit() {
    this.storesService.getAllStores().subscribe(
      (response) => {
        const data = response.data ?? []
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
    this.storesService.getStoreById(storeId).subscribe(
      (response) => {
        const storeData = response.data
        this.filteredStores = storeData ? [storeData] : []
        this.sendStoresToMap(true)
      },
      (error) => {
        console.error('가게 상세정보 로딩 실패:', error)
        this.filteredStores = []
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
    this.router.navigate(['/store/create-store-request'])
  }

  // map iframe에 가게 데이터를 전달
  sendStoresToMap(isSearchPerformed: boolean) {
    const iframe = document.getElementById('map-iframe') as HTMLIFrameElement
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({ stores: this.filteredStores, isSearchPerformed }, '*')
    }
  }
}