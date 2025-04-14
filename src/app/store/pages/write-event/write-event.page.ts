import { Location } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { CreateEvent } from 'src/app/shared/model/events/create-event.interface'
import { EventsService } from 'src/app/shared/services/event.services'

@Component({
  selector: 'app-write-event',
  templateUrl: './write-event.page.html',
  standalone: false,
})
export class WriteEventPage implements OnInit {
  store_id!: number
  title: string = ''
  description: string = ''
  start_date: string = new Date().toISOString().slice(0, 16)
  end_date: string = new Date().toISOString().slice(0, 16)


  constructor(
    private route: ActivatedRoute,
    private eventService: EventsService,
    private location: Location,
  ) { }

  ngOnInit() {
    this.store_id = Number(this.route.snapshot.paramMap.get('store_id'))
  }

  createEvent() {
    const createEvent: CreateEvent = {
      title: this.title,
      description: this.description,
      start_date: new Date(this.start_date),
      end_date: new Date(this.end_date)
    }

    this.eventService.createEvent(this.store_id, createEvent).subscribe({
      next: response => {
        if (response.success) {
          this.location.back()
        } else {
          console.error('create event failed: ', response.message)
        }
      },
      error: err => {
        console.error('create event error: ', err)
        console.error('에러 메시지:', err.error?.message)
      },
      complete: () => {
        console.log('create event completed')
      }
    })
  }
}
