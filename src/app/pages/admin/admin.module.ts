import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular'

import { AdminPageRoutingModule } from './admin-routing.module'

import { AdminPage } from './admin.page'
import { RequestListComponent } from './request-list/request-list.component'
import { ManagerRequestComponent } from './manager-request/manager-request.component'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminPageRoutingModule
  ],
  declarations: [
    AdminPage,
    RequestListComponent,
    ManagerRequestComponent
  ],
  exports: [
    RequestListComponent
  ]
})
export class AdminModule {}
