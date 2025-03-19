import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { StoreRequestsService } from 'src/app/shared/services/store-requests.service'
import { Location } from '@angular/common'

@Component({
  selector: 'app-create-store-request',
  templateUrl: './create-store-request.component.html',
  styleUrls: ['./create-store-request.component.scss'],
  standalone: false
})

export class CreateStoreRequestComponent {
  storeRequest = {
    user_id: 0,
    store_name: '',
    address: '',
    phone: '',
    category: ''
  }

  constructor(
    private storeRequestsService: StoreRequestsService,
    private router: Router,
    private location: Location
  ) {}

  async submitRequest() {
    try {
      const userId = 123
      this.storeRequest.user_id = userId

      await this.storeRequestsService.createStoreRequest(this.storeRequest)
      alert('가게 신청이 완료되었습니다.')
      this.router.navigate(['/nearby-store'])
    } catch (error) {
      alert('신청 중 오류가 발생했습니다.')
    }
  }

  goBack() {
    this.location.back()
  }
}
