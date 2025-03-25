import { Component, Input, OnInit } from '@angular/core'
import { ReadEvent } from 'src/app/shared/model/events/read-event.interface'
import { ManagerService } from 'src/app/shared/services/manager.services'

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.page.html',
  standalone: false,
})
export class EditEventPage implements OnInit {
  @Input() event!: ReadEvent
  private event_id: number | null = null

  title: string = ''
  description: string = ''
  start_date: Date = new Date()
  end_date: Date = new Date()

  constructor() { }

  ngOnInit() {
    this.event_id = this.event.event_id
    
    
  }

}
