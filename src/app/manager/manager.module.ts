import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular'

import { ManagerRoutingModule } from './manager-routing.module'

import { ManagerPage } from './pages/manager/manager.page'
import { MyManagerRequestsPage } from './pages/my-manager-request/my-manager-requests.page'
import { ManagerRequestComponent } from './components/manager-request/manager-request.component'
import { ManagerRequestListComponent } from './components/manager-request-list/manager-request-list.component'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManagerRoutingModule
  ],
  declarations: [
    ManagerPage,
    MyManagerRequestsPage,
    ManagerRequestComponent,
    ManagerRequestListComponent,
  ]
})
export class ManagerModule { }
