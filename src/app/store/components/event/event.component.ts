import { Component, Input } from '@angular/core';
import { ReadEvent } from 'src/app/model/events/read-event.interface';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
  standalone: false,
})
export class EventComponent {
  @Input() event!: ReadEvent
}
