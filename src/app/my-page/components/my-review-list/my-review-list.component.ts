import { Component, OnInit } from '@angular/core';
import { ReadReview } from 'src/app/shared/model/reviews/read-review.interface';
import { MyPageService } from 'src/app/shared/services/my-page.service';

@Component({
  selector: 'app-my-review-list',
  templateUrl: './my-review-list.component.html',
  standalone: false,
})
export class MyReviewListComponent implements OnInit {
  // 임시 데이터. 나중에 logginedUser 구현 시 교체 예정
  user_id: number = 1
  reviews: ReadReview[] = []

  constructor(
    private myPageService: MyPageService,
  ) { }

  ngOnInit() {
    this.loadMyReviews()
  }

  loadMyReviews() {
    this.myPageService.readReviewsById(this.user_id).subscribe({
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
