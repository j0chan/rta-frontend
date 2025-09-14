import { Component, Input, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { AlertController, ToastController } from '@ionic/angular'
import { RequestStatus } from 'src/app/shared/model/common/request-status.enum'
import { ReadManagerRequest } from 'src/app/shared/model/manager-requests/read-manager-request.interface'
import { UpdateManagerRequest } from 'src/app/shared/model/manager-requests/update-manager-request.interface'
import { ManagerRequestsService } from 'src/app/shared/services/manager-requests.service'

@Component({
  selector: 'app-manager-request',
  templateUrl: './manager-request.component.html',
  styleUrls: ['./manager-request.component.scss'],
  standalone: false,
})
export class ManagerRequestComponent implements OnInit {
  @Input() request!: ReadManagerRequest
  request_id: number | undefined
  status: RequestStatus | undefined
  remark: string = ''
  selectedStatus: RequestStatus | null = null

  public RequestStatus = RequestStatus

  constructor(
    private managerRequestsService: ManagerRequestsService,
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    if (this.request) {
      this.request_id = this.request.request_id
    }
  }

  async confirmAndUpdate(status: RequestStatus) {
    this.selectedStatus = status
    if (!this.request_id || !this.selectedStatus) return

    // 알림창 띄우기
    const alert = await this.alertController.create({
      header: '확인',
      message: '승인하시겠습니까?',
      buttons: [
        {
          text: '취소',
          role: 'cancel',
        },
        {
          text: '확인',
          handler: async () => {
            await this.updateManagerRequest()
          },
        },
      ],
    })

    await alert.present()
  }

  async updateManagerRequest() {
    if (!this.request_id || !this.selectedStatus) return

    const updateData: UpdateManagerRequest = {
      status: this.selectedStatus,
      remark: this.request.remark,
    }

    this.managerRequestsService.updateManagerRequest(this.request_id, updateData).subscribe({
      next: async (response) => {
        if (this.selectedStatus !== null) {
          //this.request.status = this.selectedStatus // 토스트 사용 시 UI 갱신
          //this.request.remark = this.remark // 토스트 사용 시 UI 갱신
          //await this.showToast('저장되었습니다') // 성공 알림
          window.location.reload()
          console.log('confirm manager request successfully')
        } else {
          await this.showToast('저장에 실패했습니다')
          console.error('confirm manager request failed: ', response.message)
        }
      },
      error: err => {
        console.error('confirm manager request error: ', err)
      },
      complete: () => {
        console.log('confirm manager request completed')
      }
    })
  }

  // 토스트 표시 메소드
  private async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000, // 2초간 표시
      position: 'bottom',
      color: 'warning' // primary, secondary, tertiary, success, warning, danger, light, medium, dark
    })
    toast.present()
  }
}