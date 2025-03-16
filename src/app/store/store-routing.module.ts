import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { StorePage } from './pages/store-main-page/store.page'
import { EventListPage } from './pages/event-list-page/event-list.page'
import { MenuPage } from './pages/menu-page/menu.page'
import { StoreDetailPage } from './pages/store-detail-page/store-detail-page'

const routes: Routes = [
  // //이거 하면 http://localhost:8100/store 페이지에 아무것도 안뜸
  // {
  //   path: '/', 
  // },
  {
    path: ':store_id',
    component: StorePage,
  },
  {
    path: ':store_id/menu',
    component: MenuPage
  },
  {
    path: ':store_id/event-list',
    component: EventListPage
  },
  {
    path: ':store_id/store-detail',
    component: StoreDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StorePageRoutingModule { }
