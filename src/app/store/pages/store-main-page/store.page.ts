import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiResponseDTO } from 'src/app/model/common/api-response.interface';
import { ReadEvent } from 'src/app/model/events/read-event.interface';
import { ReadStore } from 'src/app/model/stores/read-store.interface';
import { StoreService } from 'src/app/services/stores.service';

@Component({
  selector: 'app-store',
  templateUrl: './store.page.html',
  styleUrls: ['./store.page.scss'],
  standalone: false,
})
export class StorePage implements OnInit {
  store: ReadStore | null = null
  event: ReadEvent | null = null

  constructor(
    private route: ActivatedRoute,
    private storeService: StoreService
  ) {}

  ngOnInit() {
    const store_id = Number(this.route.snapshot.paramMap.get('store_id'))
    if (store_id) {
      // 가게 정보 가져오기
      this.storeService.getStoreById(store_id).subscribe((response: ApiResponseDTO<ReadStore>) => {
        this.store = response.data ?? null
      })

      // 최신 이벤트 가져오기
      this.storeService.getLastestEvent(store_id).subscribe({
        next: (response: ApiResponseDTO<ReadEvent>) => {
          this.event = response.data ?? null
        },
        error: (err) => {
          console.error('Failed to Retriving Event', err)
        }
      })
    }
  }
}
