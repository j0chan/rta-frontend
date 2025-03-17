import { StoresService } from 'src/app/shared/services/stores.service'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { ReadStore } from 'src/app/shared/model/stores/read-store.interface'
import { ApiResponseDTO } from 'src/app/shared/model/common/api-response.interface'
import { ReadEvent } from 'src/app/shared/model/events/read-event.interface'

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.page.html',
  styleUrls: ['./event-list.page.scss'],
  standalone: false
})
export class EventListPage implements OnInit {
  store: ReadStore | undefined
  events: ReadEvent[] = []

  constructor(
    private route: ActivatedRoute,
    private storesService: StoresService,
  ) { }

  ngOnInit() {
    const store_id = Number(this.route.snapshot.paramMap.get('store_id'))
    if (store_id) {
      // 해당 가게 모든 이벤트 가져오기
      this.storesService.getAllEventsByStore(store_id).subscribe({
        next: (response: ApiResponseDTO<ReadEvent[]>) => {
          this.events = response.data ?? []
        },
        error: (err) => {
          console.error('Failed to Retriving Events', err)
        }
      })
    }
  }

}
