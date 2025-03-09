import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular'

import { AdminPageRoutingModule } from './admin-routing.module'

import { AdminPage } from './admin.page'
import { ManagerRequestListComponent } from './manager-request-list/manager-request-list.component'
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
    ManagerRequestListComponent,
    ManagerRequestComponent
  ],
  exports: [
    ManagerRequestListComponent
  ]
})
export class AdminModule {}
