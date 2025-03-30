import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { StorePage } from './pages/store-main-page/store.page'
import { EventListPage } from './pages/event-list-page/event-list.page'
import { MenuPage } from './pages/menu-page/menu.page'
import { StoreDetailPage } from './pages/store-detail-page/store-detail-page'
import { CreateStoreRequestPage } from './pages/create-store-request.page/create-store-request.page'
import { WriteReviewPage } from '../reviews/pages/write-review/write-review.page'
import { WriteEventPage } from './pages/write-event/write-event.page'
import { EditEventPage } from './pages/edit-event/edit-event.page'

const routes: Routes = [
  // //이거 하면 http://localhost:8100/store 페이지에 아무것도 안뜸
  // {
  //   path: '/', 
  // },

  // * 라우트 경로 매칭 문제
  // 라우팅은 위에서 아래로 차례대로 검사하기 때문에
  
  // 고정 경로를 먼저 선언하고
  {
    path: 'create-store-request', 
    component: CreateStoreRequestPage 
  },
  // 그 후 동적 경로를 선언한다.
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
  },
  {
    path: ':store_id/write-review',
    component: WriteReviewPage
  },
  {
    path: ':store_id/write-event',
    component: WriteEventPage
  },
  {
    path: ':store_id/event/:event_id/edit-event',
    component: EditEventPage
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StorePageRoutingModule { }
