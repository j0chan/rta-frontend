import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular'

import { MyPageRoutingModule } from './my-page-routing.module'

import { MyPagePage } from './pages/my-page/my-page.page'
import { MyReviewsPage } from './pages/my-reviews-page/my-reviews.page'
import { ReviewsModule } from '../reviews/reviews.module'
import { MyInfoComponent } from './components/my-info/my-info.component'
import { MyReviewListComponent } from './components/my-review-list/my-review-list.component'
import { SharedModule } from '../shared/module/shared.module'
import { EditMyInfoPagePage } from './pages/edit-my-info-page/edit-my-info-page.page'
import { EditMyInfoComponent } from './components/edit-my-info/edit-my-info.component'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    IonicModule,
    MyPageRoutingModule,
    ReviewsModule,
  ],
  declarations: [
    MyPagePage,
    MyReviewsPage,
    EditMyInfoPagePage,
    MyInfoComponent,
    MyReviewListComponent,
    EditMyInfoComponent,
  ]
})
export class MyPageModule { }
