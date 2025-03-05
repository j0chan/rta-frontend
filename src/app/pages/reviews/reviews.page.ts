import { Component, OnInit } from '@angular/core'
import { ReviewListComponent } from 'src/app/pages/reviews/review-list/review-list.component'

@Component({
  selector: 'app-reviews-page',
  templateUrl: './reviews.page.html',
  styleUrls: ['./reviews.page.scss'],
  standalone: false,
  // imports: [ReviewsComponent]
})
export class ReviewsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
