import { Component, Input, OnInit } from '@angular/core'
import { RequestPage } from 'src/app/model/common/request-page.enum'
import { ReadManagerRequest } from 'src/app/model/manager-requests/read-manager-request.interface'
import { ReadStoreRequest } from 'src/app/model/store-requests/read-store-request.interface'
import { ManagerRequestsService } from 'src/app/services/manager-requests.service'
import { StoreRequestsService } from 'src/app/services/store-requests.service'

@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.scss'],
  standalone: false,
})
export class RequestListComponent implements OnInit {
  @Input() requestPage!: RequestPage
  requests: ReadManagerRequest[] | ReadStoreRequest[] = []

  constructor(
    private managerRequestsService: ManagerRequestsService,
    private storeRequestsService: StoreRequestsService,
  ) { }

  ngOnInit() {
    switch (this.requestPage) {
      case RequestPage.MANAGER_REQUEST:
        this.loadManagerRequests()
        break
      case RequestPage.STORE_REQUEST:
        this.loadStoreRequests()
        break
      default:
        console.warn("Unknown requestPage: ", this.requestPage)
    }
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

  loadStoreRequests() {
    this.storeRequestsService.readAllStoreRequests().subscribe({
      next: response => {
        if (response.success) {
          this.requests = response.data || []
        } else {
          console.error(response.message)
        }
      },
      error: err => {
        console.error('Error fetching store requests: ', err)
      },
      complete: () => {
        console.log('Fetching store requests completed')
      }
    })
  }

  getPageTitle(): string {
    return (this.requestPage == RequestPage.MANAGER_REQUEST) ? "Manager Requests" : "Store Requests"
  }
}
