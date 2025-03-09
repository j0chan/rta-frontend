import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { AdminPage } from './admin.page'
import { ManagerRequestComponent } from './manager-request/manager-request.component';

const routes: Routes = [
  {
    path: '',
    component: AdminPage
  },
  {
    path: 'manage-request',
    component: ManagerRequestComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPageRoutingModule {}
