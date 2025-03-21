import { Component, Input } from '@angular/core'
import { ReadReview } from 'src/app/shared/model/reviews/read-review.interface'

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  standalone: false,
})
export class ReviewsComponent {
  @Input() reviews: ReadReview[] = []
}
