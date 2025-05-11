import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { MyPagePage } from './pages/my-page/my-page.page'
import { MyReviewsPage } from './pages/my-reviews-page/my-reviews.page'
import { EditMyInfoPagePage } from './pages/edit-my-info-page/edit-my-info-page.page'

const routes: Routes = [
  {
    path: '',
    component: MyPagePage
  },
  {
    path: 'reviews',
    component: MyReviewsPage
  },
  {
    path: 'edit',
    component: EditMyInfoPagePage
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyPageRoutingModule { }
