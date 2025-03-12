import { Component, OnInit } from '@angular/core'
import { RequestPage } from 'src/app/model/common/request-page.enum'

@Component({
  selector: 'app-store-request-page',
  templateUrl: './store-request-page.component.html',
  styleUrls: ['./store-request-page.component.scss'],
  standalone: false
})
export class StoreRequestPage implements OnInit {
  public RequestPage = RequestPage

  constructor() { }

  ngOnInit() {}

}
