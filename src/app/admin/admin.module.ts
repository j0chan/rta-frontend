import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular'

import { AdminRoutingModule } from './admin-routing.module'

import { AdminPage } from './pages/admin/admin.page'
import { RequestListComponent } from './components/request-list/request-list.component'
import { ManagerRequestComponent } from './components/manager-request/manager-request.component'
import { ManagerRequestPage } from './pages/manager-request-page/manager-request-page'
import { SharedModule } from '../shared/module/shared.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminRoutingModule,
    SharedModule
  ],
  declarations: [
    AdminPage,
    RequestListComponent,
    ManagerRequestComponent,
    ManagerRequestPage,
  ],
  exports: [
    RequestListComponent
  ]
})
export class AdminModule { }
