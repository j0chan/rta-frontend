import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular'

import { MyPageRoutingModule } from './my-page-routing.module'

import { MyPagePage } from './pages/my-page/my-page.page'
import { MyReviewsPage } from './pages/my-reviews-page/my-reviews.page'
import { ReviewsModule } from '../reviews/reviews.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyPageRoutingModule,
    ReviewsModule,
  ],
  declarations: [
    MyPagePage,
    MyReviewsPage,
  ]
})
export class MyPageModule {}
