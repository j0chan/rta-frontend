import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { AdminPage } from './pages/admin/admin.page'
import { StoreRequestPage } from './pages/store-request-page/store-request-page.component'
import { ManagerRequestPage } from './pages/manager-request-page/manager-request-page.component'

const routes: Routes = [
  {
    path: '',
    component: AdminPage
  },
  {
    path: 'manager-request-page',
    component: ManagerRequestPage
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
