import { Location } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { AlertController } from '@ionic/angular'
import { CreateManagerRequest } from 'src/app/shared/model/manager-requests/create-manager-request.interface'
import { ReadStore } from 'src/app/shared/model/stores/read-store.interface'
import { ManagerRequestsService } from 'src/app/shared/services/manager-requests.service'

@Component({
  selector: 'app-create-manager-request',
  templateUrl: './create-manager-request.page.html',
  standalone: false,
})
export class CreateManagerRequestPage implements OnInit {
  constructor(
    private managerRequestsService: ManagerRequestsService,
    private location: Location,
    private alertController: AlertController,
  ) {}

  ngOnInit() {}

  async onStoreSelected(store: ReadStore) {
    const alert = await this.alertController.create({
      header: '신청 확인',
      message: `'${store.store_name}' 가게에 대한 매니저 권한을 신청하시겠습니까?`,
      buttons: [
        {
          text: '취소',
          role: 'cancel',
        },
        {
          text: '확인',
          handler: () => {
            this.createRequest(store.store_id)
          },
        },
      ],
    })

    await alert.present()
  }

  createRequest(store_id: number) {
    const createManagerRequest: CreateManagerRequest = {
      store_id: store_id,
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
      },
    })
  }
}
