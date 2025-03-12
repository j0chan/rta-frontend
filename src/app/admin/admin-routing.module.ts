import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { AdminPage } from './pages/admin/admin.page'
import { ManagerRequestComponent } from './components/manager-request/manager-request.component'
import { StoreRequestPage } from './pages/store-request-page/store-request-page.component'

const routes: Routes = [
  {
    path: '',
    component: AdminPage
  },
  {
    path: 'manage-request',
    component: ManagerRequestComponent
  },
  {
    path: 'store-request-page',
    component: StoreRequestPage
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPageRoutingModule {}
