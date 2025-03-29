import { StoresService } from 'src/app/shared/services/stores.service'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { ReadStore } from 'src/app/shared/model/stores/read-store.interface'
import { ApiResponseDTO } from 'src/app/shared/model/common/api-response.interface'
import { ReadEvent } from 'src/app/shared/model/events/read-event.interface'

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.page.html',
  standalone: false
})
export class EventListPage implements OnInit {
  private store_id: number | null = null

  store: ReadStore | undefined
  events: ReadEvent[] = []

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private storesService: StoresService,
  ) { }

  ngOnInit() {
    this.store_id = Number(this.route.snapshot.paramMap.get('store_id'))
    if (this.store_id) {
      // 해당 가게 모든 이벤트 가져오기
      this.storesService.getAllEventsByStore(this.store_id).subscribe({
        next: (response: ApiResponseDTO<ReadEvent[]>) => {
          this.events = response.data ?? []
        },
        error: (err) => {
          console.error('Failed to Retriving Events', err)
        }
      })
    }
  }

  /* 페이지 이동 */
  goWriteEvent() {
    this.router.navigate([`/store/${this.store_id}/write-event`])
    console.log('go write-event page')
  }

  goEditEvent(event_id: number) {
    this.router.navigate([`/store/${this.store_id}/event/${event_id}/edit-event`])
    console.log('go edit-event page')
  }
}
