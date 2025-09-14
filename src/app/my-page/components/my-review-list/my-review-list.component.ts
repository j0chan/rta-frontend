import { Component, OnInit } from '@angular/core'
import { ReadReview } from 'src/app/shared/model/reviews/read-review.interface'
import { MyPageService } from 'src/app/shared/services/my-page.service'

@Component({
  selector: 'app-my-review-list',
  templateUrl: './my-review-list.component.html',
  styleUrls: ['./my-review-list.component.scss'],
  standalone: false,
})
export class MyReviewListComponent implements OnInit {
  reviews: ReadReview[] = []

  constructor(
    private myPageService: MyPageService,
  ) { }

  ngOnInit() {
    this.loadMyReviews()
  }

  loadMyReviews() {
    this.myPageService.getMyReviews().subscribe({
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
        console.error('Fetching reviews request completed')
      }
    })
  }
}
