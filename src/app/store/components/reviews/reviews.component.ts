import { Component, Input } from '@angular/core';
import { ReadReview } from 'src/app/model/reviews/read-review.interface';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss'],
  standalone: false,
})
export class ReviewsComponent {
  @Input() reviews: ReadReview[] = []
}
