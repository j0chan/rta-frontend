import { Component, OnInit } from '@angular/core'
import { RequestPage } from 'src/app/shared/model/common/request-page.enum'

@Component({
  selector: 'app-manager-request-page',
  templateUrl: './manager-request-page.html',
  standalone: false
})
export class ManagerRequestPage implements OnInit {
  public RequestPage = RequestPage

  constructor() { }

  ngOnInit() {}

}
