import { Component, OnInit } from '@angular/core'
import { RequestPage } from 'src/app/model/common/request-page.enum'

@Component({
  selector: 'app-manager-request-page',
  templateUrl: './manager-request-page.html',
  styleUrls: ['./manager-request-page.scss'],
  standalone: false
})
export class ManagerRequestPage implements OnInit {
  public RequestPage = RequestPage

  constructor() { }

  ngOnInit() {}

}
