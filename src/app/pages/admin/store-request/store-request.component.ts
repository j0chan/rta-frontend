import { Component, Input, OnInit } from '@angular/core'
import { ReadStoreRequest } from 'src/app/model/store-requests/read-manager-request.interface'

@Component({
  selector: 'app-store-request',
  templateUrl: './store-request.component.html',
  styleUrls: ['./store-request.component.scss'],
  standalone: false,
})
export class StoreRequestComponent implements OnInit {
  @Input() request!: ReadStoreRequest

  constructor() { }

  ngOnInit() {}

}
