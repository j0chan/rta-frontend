import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { ReadStore } from 'src/app/shared/model/stores/read-store.interface'
import { ApiResponseDTO } from 'src/app/shared/model/common/api-response.interface'
import { ReadEvent } from 'src/app/shared/model/events/read-event.interface'
import { filter, Subscription } from 'rxjs'
import { EventsService } from 'src/app/shared/services/event.services'

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.page.html',
  standalone: false
})
export class EventListPage implements OnInit {
  private store_id!: number

  store: ReadStore | undefined
  events: ReadEvent[] = []

  private routerSubscription!: Subscription

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.store_id = Number(this.route.snapshot.paramMap.get('store_id'))

    // 해당 가게 모든 이벤트 가져오기
    this.loadEvents()

    // 이벤트 수정, 삭제하고 다시 이벤트 리스트 페이지로 돌아왔을 때 이벤트 데이터를 다시 불러옵니다
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd))
      .subscribe(() => { this.loadEvents() })
  }

  loadEvents() {
    this.eventsService.getAllEventsByStore(this.store_id).subscribe({
      next: (response: ApiResponseDTO<ReadEvent[]>) => {
        this.events = response.data ?? []
      },
      error: (err) => {
        console.error('Failed to Retriving Events', err)
      }
    })
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
