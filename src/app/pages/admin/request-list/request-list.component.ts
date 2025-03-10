import { Component, OnInit } from '@angular/core'
import { ReadManagerRequest } from 'src/app/model/manager-requests/read-manager-request.interface'
import { ManagerRequestsService } from 'src/app/services/manager-requests.service'

@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.scss'],
  standalone: false,
})
export class RequestListComponent implements OnInit {
  requests: ReadManagerRequest[] | ReadManagerRequest[] = []

  constructor(
    private managerRequestsService: ManagerRequestsService,
  ) { }

  ngOnInit() {
    this.loadRequests()
  }

  loadRequests() {
    this.managerRequestsService.readAllManagerRequests().subscribe({
      next: response => {
        if (response.success) {
          this.requests = response.data || []
        } else {
          console.error(response.message)
        }
      },
      error: err => {
        console.error('Error fetching reviews: ', err)
      },
      complete: () => {
        console.log('Fetching reviews request completed')
      }
    })
  }

}
