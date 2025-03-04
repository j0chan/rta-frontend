import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular'

import { ReviewsPageRoutingModule } from './reviews-routing.module'

import { ReviewsPage } from './reviews.page'
import { ReviewsComponent } from 'src/app/components/reviews/reviews.component'
import { RouterModule } from '@angular/router'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReviewsPageRoutingModule,
    ReviewsPage,
    ReviewsComponent,
    RouterModule.forChild([
      { path: '', component: ReviewsPage }
    ]),
  ],
  declarations: []
})
export class ReviewsPageModule {}
