import { Component, OnInit } from '@angular/core'
import { ReviewsComponent } from 'src/app/components/reviews/reviews.component'

@Component({
  selector: 'app-reviews-page',
  template: '<app-reviews></app-reviews>',
  styleUrls: ['./reviews.page.scss'],
  standalone: true,
  imports: [ReviewsComponent]
})
export class ReviewsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
