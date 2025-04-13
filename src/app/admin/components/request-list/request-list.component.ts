import { Component, Input, OnInit } from '@angular/core'
import { ReadManagerRequest } from 'src/app/shared/model/manager-requests/read-manager-request.interface'
import { ManagerRequestsService } from 'src/app/shared/services/manager-requests.service'

@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  standalone: false,
})
export class RequestListComponent implements OnInit {
  requests: ReadManagerRequest[] = []

  constructor(
    private managerRequestsService: ManagerRequestsService,
  ) { }

  ngOnInit() {
    this.loadManagerRequests()
  }

  loadManagerRequests() {
    this.managerRequestsService.readAllManagerRequests().subscribe({
      next: response => {
        if (response.success) {
          this.requests = response.data || []
        } else {
          console.error(response.message)
        }
      },
      error: err => {
        console.error('Error fetching manager requests: ', err)
      },
      complete: () => {
        console.log('Fetching manager requests completed')
      }
    })
  }

  getConfirmedRequests(): ReadManagerRequest[] {
    return this.requests.filter(request => request.status !== 'SUBMITTED')
  }
  
  getNotConfirmedRequests(): ReadManagerRequest[] {
    return this.requests.filter(request => request.status === 'SUBMITTED')
  }
}
