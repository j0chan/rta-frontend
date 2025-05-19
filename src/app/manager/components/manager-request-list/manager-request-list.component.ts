import { Component, OnInit } from '@angular/core'
import { RequestStatus } from 'src/app/shared/model/common/request-status.enum'
import { ReadManagerRequest } from 'src/app/shared/model/manager-requests/read-manager-request.interface'
import { ManagerRequestsService } from 'src/app/shared/services/manager-requests.service'

@Component({
  selector: 'app-manager-request-list',
  templateUrl: './manager-request-list.component.html',
  standalone: false,
})
export class ManagerRequestListComponent implements OnInit {
  requests: ReadManagerRequest[] = []

  constructor(
    private managerRequestsService: ManagerRequestsService,
  ) { }

  ngOnInit() {
    this.loadMyManagerRequests()
  }

  loadMyManagerRequests() {
    this.managerRequestsService.getMyManagerRequests().subscribe({
      next: response => {
        if (response.success) {
          this.requests = (response.data || []).filter(req =>
            req.status === RequestStatus.SUBMITTED ||
            req.status === RequestStatus.REJECTED
          )
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
}
