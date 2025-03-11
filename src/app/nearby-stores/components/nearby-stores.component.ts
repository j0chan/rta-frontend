import { Component, OnInit, AfterViewInit } from '@angular/core'
import { Store } from 'src/app/model/stores/read-store.interface'
import { NearbyStoresService } from 'src/app/services/nearby-stores.service'

@Component({
  selector: 'app-nearby-stores',
  templateUrl: './nearby-stores.component.html',
  styleUrls: ['./nearby-stores.component.scss'],
  standalone: false
})
export class NearbyStoresComponent implements OnInit, AfterViewInit {
  stores: Store[] = []
  filteredStores: Store[] = []

  constructor(private storesService: NearbyStoresService) {}

  ngOnInit() {
    this.storesService.getAllStores().subscribe(
      (data: Store[]) => {
        this.stores = data
        this.filteredStores = data // 초기에는 모든 가게 표시
        this.sendStoresToMap()
      },
      (error) => console.error('가게 데이터 로딩 실패:', error)
    )
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.sendStoresToMap()
    }, 1000)
  }

  // 검색
  onSearch(query: string) {
    if (!query.trim()) {
      this.filteredStores = this.stores // 검색어 없으면 전체 목록 표시
    } else {
      this.filteredStores = this.stores.filter(store =>
        store.store_name.toLowerCase().includes(query.toLowerCase())
      )
    }
    this.sendStoresToMap() // 필터링된 데이터를 지도에 update
  }

  // map iframe에 가게 데이터를 전달
  sendStoresToMap() {
    const iframe = document.getElementById('map-iframe') as HTMLIFrameElement
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(this.filteredStores, '*')
    }
  }
}