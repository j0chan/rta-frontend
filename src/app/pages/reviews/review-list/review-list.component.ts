import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { ReadAllReviews } from 'src/app/model/reviews/read-all-reviews.interface'
import { ReviewsService } from 'src/app/services/reviews.service'

@Component({
  selector: 'app-review-list',
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.scss'],
  standalone: false,
})
export class ReviewListComponent implements OnInit {
  reviews: ReadAllReviews[] = []

  constructor(
    private reviewsService: ReviewsService,
    private router: Router,
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
