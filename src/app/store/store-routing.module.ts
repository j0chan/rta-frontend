import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StorePage } from './pages/store-main-page/store.page';
import { EventListPage } from './pages/event-list-page/event-list.page';
import { EventDetailPage } from './pages/event-detail-page/event-detail.page';
import { MenuPage } from './pages/menu-page/menu.page';

const routes: Routes = [
  {
    path: ':store_id',
    component: StorePage
  },
  {
    path: 'event-list',
    component: EventListPage
  },
  {
    path: 'event-detail/:event_id',
    component: EventDetailPage
  },
  {
    path: 'menu',
    component: MenuPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StorePageRoutingModule {}
