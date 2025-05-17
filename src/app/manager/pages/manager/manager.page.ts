import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { ApiResponseDTO } from 'src/app/shared/model/common/api-response.interface'
import { ReadStore } from 'src/app/shared/model/stores/read-store.interface'
import { MyPageService } from 'src/app/shared/services/my-page.service'

@Component({
  selector: 'app-manager',
  templateUrl: './manager.page.html',
  standalone: false,
})
export class ManagerPage implements OnInit {

  constructor() { }

  ngOnInit() { }

}