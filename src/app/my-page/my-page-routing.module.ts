import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { MyPagePage } from './pages/my-page/my-page.page'
import { MyReviewsPage } from './pages/my-reviews-page/my-reviews.page'

const routes: Routes = [
  {
    path: '',
    component: MyPagePage
  },
  {
    path: 'reviews',
    component: MyReviewsPage
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyPageRoutingModule { }
