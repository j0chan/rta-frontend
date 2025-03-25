import { Location } from '@angular/common'
import { Component, Input, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { CreateEvent } from 'src/app/shared/model/events/create-event.interface'
import { ManagerService } from 'src/app/shared/services/manager.services'

@Component({
  selector: 'app-write-event',
  templateUrl: './write-event.page.html',
  standalone: false,
})
export class WriteEventPage implements OnInit {
  @Input() store_id!: number
  title: string = ''
  description: string = ''
  start_date: Date = new Date()
  end_date: Date = new Date()
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private managerService: ManagerService,
    private location: Location,
  ) { }

  ngOnInit() {}

  createEvent() {
    const createEvent: CreateEvent = {
      title: this.title,
      description: this.description,
      start_date: this.start_date,
      end_date: this.end_date
    }

    this.managerService.createEvent(this.store_id, createEvent).subscribe({
      next: response => {
        if (response.success) {
          this.location.back()
        } else {
          console.error('create event failed: ', response.message)
        }
      },
      error: err => {
        console.error('create event error: ', err)
      },
      complete: () => {
        console.log('create event completed')
      }
    })
  }
}
