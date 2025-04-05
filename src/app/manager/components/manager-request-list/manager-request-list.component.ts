import { Component, OnInit } from '@angular/core'
import { ReadManagerRequest } from 'src/app/shared/model/manager-requests/read-manager-request.interface'
import { ManagerRequestsService } from 'src/app/shared/services/manager-requests.service'
import { MyPageService } from 'src/app/shared/services/my-page.service'

@Component({
  selector: 'app-manager-request-list',
  templateUrl: './manager-request-list.component.html',
  standalone: false,
})
export class ManagerRequestListComponent implements OnInit {
  requests: ReadManagerRequest[] = []

  constructor(
    private myPageService: MyPageService,
  ) { }

  ngOnInit() {
    this.loadMyManagerRequests()
  }

  loadMyManagerRequests() {
    this.myPageService.getMyManagerRequests().subscribe({
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
}
