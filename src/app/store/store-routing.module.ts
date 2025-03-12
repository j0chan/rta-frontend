import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StorePage } from './pages/store-main/store.page';

const routes: Routes = [
  {
    path: '',
    component: StorePage
  },
  {
    path: ':id',
    component: StorePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StorePageRoutingModule {}
