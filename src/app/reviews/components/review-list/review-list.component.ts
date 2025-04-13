import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { ReadReview } from 'src/app/shared/model/reviews/read-review.interface'
import { ReviewsService } from 'src/app/shared/services/reviews.service'

@Component({
  selector: 'app-review-list',
  templateUrl: './review-list.component.html',
  standalone: false,
})
export class ReviewListComponent implements OnInit {
  reviews: ReadReview[] = []
  store_id!: number

  constructor(
    private reviewsService: ReviewsService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('store_id')
      if(id) {
        this.store_id = +id
        this.loadReviews()
      }else{
        console.error('Failed to Retrieve store_id From URL')
      }
    })
  }

  loadReviews() {
    this.reviewsService.getReviewsByStoreId(this.store_id).subscribe({
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
