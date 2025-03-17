import { Component, OnInit } from '@angular/core'
import { ReadManagerRequest } from 'src/app/model/manager-requests/read-manager-request.interface'
import { UsersService } from 'src/app/services/users.service'

@Component({
  selector: 'app-manager-request-list',
  templateUrl: './manager-request-list.component.html',
  standalone: false,
})
export class ManagerRequestListComponent implements OnInit {
  requests: ReadManagerRequest[] = []

  // 임시 사용자 아이디
  user_id: number = 1

  constructor(
    private usersService: UsersService,
  ) { }

  ngOnInit() {
    this.loadMyManagerRequests()
  }

  loadMyManagerRequests() {
    this.usersService.readMyManagerRequests(this.user_id).subscribe({
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
