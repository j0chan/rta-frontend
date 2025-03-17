import { Component, Input, OnInit } from '@angular/core'
import { ReadManagerRequest } from 'src/app/shared/model/manager-requests/read-manager-request.interface'

@Component({
  selector: 'app-manager-request',
  templateUrl: './manager-request.component.html',
  standalone: false,
})
export class ManagerRequestComponent  implements OnInit {
  @Input() request!: ReadManagerRequest
  
  constructor() { }

  ngOnInit() {}

}
