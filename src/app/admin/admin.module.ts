import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular'

import { AdminPageRoutingModule } from './admin-routing.module'

import { AdminPage } from './pages/admin/admin.page'
import { RequestListComponent } from './components/request-list/request-list.component'
import { ManagerRequestComponent } from './components/manager-request/manager-request.component'
import { StoreRequestComponent } from './components/store-request/store-request.component'
import { StoreRequestPage } from './pages/store-request-page/store-request-page.component'

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
    ManagerRequestComponent,
    StoreRequestComponent,
    StoreRequestPage,
  ],
  exports: [
    RequestListComponent
  ]
})
export class AdminModule {}
