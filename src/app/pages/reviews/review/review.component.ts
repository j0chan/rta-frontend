import { Component, Input, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { ReviewsService } from 'src/app/services/reviews.service'

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
  standalone: false,
})
export class ReviewComponent implements OnInit {
  @Input() review!: { user_id: number; content: string }

  constructor(
    private reviewsService: ReviewsService,
    private activedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    
  }

  loadReview() {
    
  }

}
