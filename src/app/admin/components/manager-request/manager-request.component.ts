import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RequestStatus } from 'src/app/shared/model/common/request-status.enum';
import { ReadManagerRequest } from 'src/app/shared/model/manager-requests/read-manager-request.interface';
import { UpdateManagerRequest } from 'src/app/shared/model/manager-requests/update-manager-request.interface';
import { ManagerRequestsService } from 'src/app/shared/services/manager-requests.service';

@Component({
  selector: 'app-manager-request',
  templateUrl: './manager-request.component.html',
  styleUrls: ['./manager-request.component.scss'],
  standalone: false,
})
export class ManagerRequestComponent implements OnInit {
  @Input() request!: ReadManagerRequest;
  request_id: number | undefined;
  status: RequestStatus | undefined;
  remark: string = '';

  public RequestStatus = RequestStatus;

  constructor(
    private managerRequestsService: ManagerRequestsService,
    private router: Router,
  ) {}

  ngOnInit() {
    if (this.request) {
      this.request_id = this.request.request_id;
    }
  }

  selectedStatus: RequestStatus | null = null;

  toggleStatus(status: RequestStatus) {
    this.selectedStatus = status;
  }

  async updateManagerRequest() {
    if (!this.request_id || !this.status) return;

    const updateData: UpdateManagerRequest = {
      status: this.status,
      remark: this.remark
    };

    this.managerRequestsService.updateManagerRequest(this.request_id, updateData).subscribe({
      next: response => {
        if (response.success) {
          console.log('confirm manager request successfully');
        } else {
          console.error('confirm manager request failed: ', response.message);
        }
      },
      error: err => {
        console.error('confirm manager request error: ', err);
      },
      complete: () => {
        console.log('confirm manager request completed');
      }
    });
  }
  
}
