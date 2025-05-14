import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { ManagerPage } from './pages/manager/manager.page'
import { MyManagerRequestsPage } from './pages/my-manager-request/my-manager-requests.page'
import { CreateManagerRequestPage } from './pages/create-manager-request/create-manager-request.page'
import { EditMyStorePage } from './pages/edit-my-store/edit-my-store.page'

const routes: Routes = [
  {
    path: '',
    component: ManagerPage
  },
  {
    path: 'my-manager-requests',
    component: MyManagerRequestsPage
  },
  {
    path: 'create-manager-request',
    component: CreateManagerRequestPage
  },
  {
    path: 'my-stores/:id/edit',
    component: EditMyStorePage
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagerRoutingModule { }
