import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular'

import { ReviewsPageRoutingModule } from './reviews-routing.module'

import { ReviewListComponent } from 'src/app/reviews/components/review-list/review-list.component'
import { WriteReviewPage } from './pages/write-review/write-review.page'
import { RouterModule } from '@angular/router'
import { SharedModule } from '../shared/module/shared.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule,
    ReviewsPageRoutingModule,
    SharedModule,
  ],
  declarations: [
    ReviewListComponent,
    WriteReviewPage,
  ],
  exports: [
    ReviewListComponent,
  ]
})
export class ReviewsModule { }
