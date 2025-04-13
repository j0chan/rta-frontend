import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { AdminPage } from './pages/admin/admin.page'
import { ManagerRequestPage } from './pages/manager-request-page/manager-request-page'

const routes: Routes = [
  {
    path: '',
    component: AdminPage
  },
  {
    path: 'manager-request-page',
    component: ManagerRequestPage
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule { }
