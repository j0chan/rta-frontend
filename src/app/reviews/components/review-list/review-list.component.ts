import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { ReadReview } from 'src/app/shared/model/reviews/read-review.interface'
import { ReviewsService } from 'src/app/shared/services/reviews.service'

@Component({
  selector: 'app-review-list',
  templateUrl: './review-list.component.html',
  standalone: false,
})
export class ReviewListComponent implements OnInit {
  reviews: ReadReview[] = []

  constructor(
    private reviewsService: ReviewsService,
  ) { }

  ngOnInit() {
    this.loadReviews()
  }

  loadReviews() {
    this.reviewsService.readAllReviews().subscribe({
      next: response => {
        if (response.success) {
          this.reviews = response.data || []
        } else {
          console.error(response.message)
        }
      },
      error: err => {
        console.error('Error fetching reviews: ', err)
      },
      complete: () => {
        console.log('Fetching reviews request completed')
      }
    })
  }
}
