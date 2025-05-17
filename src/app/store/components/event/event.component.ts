import { Component, Input } from '@angular/core'
import { EventStatus } from 'src/app/shared/model/events/event-status.enum'
import { ReadEvent } from 'src/app/shared/model/events/read-event.interface'

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
  standalone: false,
})
export class EventComponent {
  @Input() event!: ReadEvent
  EventStatus = EventStatus

  getEventStatusClass(status: EventStatus): string {
    switch (status) {
      case EventStatus.ONGOING:
        return 'status-ongoing'
      case EventStatus.COMPLETED:
        return 'status-completed'
      case EventStatus.UPCOMING:
        return 'status-upcoming'
      case EventStatus.CANCELED:
        return 'status-canceled'
      default:
        return ''
    }
  }
}
