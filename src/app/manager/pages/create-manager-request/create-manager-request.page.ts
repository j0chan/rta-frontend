import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router';
import { CreateManagerRequest } from 'src/app/shared/model/manager-requests/create-manager-request.interface';
import { ManagerRequestsService } from 'src/app/shared/services/manager-requests.service';

@Component({
  selector: 'app-create-manager-request',
  templateUrl: './create-manager-request.page.html',
  standalone: false,
})
export class CreateManagerRequestPage  implements OnInit {
  private user_id!: number
  private store_id!: number

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private managerReqestsService: ManagerRequestsService,
    private location: Location,
  ) { }

  ngOnInit() {}

  submitManagerRequest() {
    const createManagerRequest: CreateManagerRequest = {
      store_id: this.store_id
    }

    this.managerReqestsService.createManagerRequest(createManagerRequest).subscribe({
      next: response => {
        if (response.success) {
          this.location.back()
        } else {
          console.error('create manager request failed: ', response.data)
        }
      },
      error: err => {
        console.error('create review error: ', err)
      },
      complete: () => {
        console.log('create manager request completed')
      }
    })
  }
}
