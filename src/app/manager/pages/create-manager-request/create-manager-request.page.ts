import { Location } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { CreateManagerRequest } from 'src/app/shared/model/manager-requests/create-manager-request.interface'
import { ReadStore } from 'src/app/shared/model/stores/read-store.interface'
import { ManagerRequestsService } from 'src/app/shared/services/manager-requests.service'

@Component({
  selector: 'app-create-manager-request',
  templateUrl: './create-manager-request.page.html',
  standalone: false,
})
export class CreateManagerRequestPage  implements OnInit {
  private store_id!: number

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private managerRequestsService: ManagerRequestsService,
    private location: Location,
  ) { }

  ngOnInit() {}

  onStoreSelected(store: ReadStore) {
    console.log('Store selected in parent: ', store)
    this.store_id = store.store_id
  }

  submitManagerRequest() {
    const createManagerRequest: CreateManagerRequest = {
      store_id: this.store_id
    }

    this.managerRequestsService.createManagerRequest(createManagerRequest).subscribe({
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
