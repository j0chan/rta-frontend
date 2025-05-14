import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular'

import { ManagerRoutingModule } from './manager-routing.module'

import { ManagerPage } from './pages/manager/manager.page'
import { MyManagerRequestsPage } from './pages/my-manager-request/my-manager-requests.page'
import { ManagerRequestComponent } from './components/manager-request/manager-request.component'
import { ManagerRequestListComponent } from './components/manager-request-list/manager-request-list.component'
import { CreateManagerRequestPage } from './pages/create-manager-request/create-manager-request.page'
import { SearchStoreComponent } from './components/search-store/search-store.component'
import { SharedModule } from '../shared/module/shared.module'
import { EditMyStorePage } from './pages/edit-my-store/edit-my-store.page'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManagerRoutingModule,
    SharedModule
  ],
  declarations: [
    ManagerPage,
    MyManagerRequestsPage,
    ManagerRequestComponent,
    ManagerRequestListComponent,
    CreateManagerRequestPage,
    SearchStoreComponent,
    EditMyStorePage
  ]
})
export class ManagerModule { }
