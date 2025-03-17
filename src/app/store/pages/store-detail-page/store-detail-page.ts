import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { ApiResponseDTO } from 'src/app/model/common/api-response.interface'
import { ReadStore } from 'src/app/model/stores/read-store.interface'
import { StoresService } from 'src/app/services/stores.service'

@Component({
  selector: 'app-store-detail-page',
  templateUrl: './store-detail-page.html',
  styleUrls: ['./store-detail-page.scss'],
  standalone: false
})
export class StoreDetailPage implements OnInit {
  store: ReadStore | null = null

  constructor(
    private route: ActivatedRoute,
    private storesService: StoresService

  ) { }

  ngOnInit() {
    const store_id = Number(this.route.snapshot.paramMap.get('store_id'))
    if (store_id) {
      // 가게 정보 가져오기
      this.storesService.getStoreById(store_id).subscribe((response: ApiResponseDTO<ReadStore>) => {
        this.store = response.data ?? null
      })
    }
  }

}
