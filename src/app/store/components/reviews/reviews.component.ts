import { Component, Input, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { ReadReview } from 'src/app/shared/model/reviews/read-review.interface'
import { ReviewsService } from 'src/app/shared/services/reviews.service'
import { getUserIdFromToken } from 'src/app/shared/utils/token.util'

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss'],
  standalone: false,
})
export class ReviewsComponent implements OnInit {
  @Input() reviews: ReadReview[] = []
  private store_id: number | null = null
  currentUserId: number | null = null

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reviewsService: ReviewsService
  ) { }

  ngOnInit(): void {
    this.currentUserId = getUserIdFromToken()
    this.getStoreId()
  }
  getStoreId() {
    const navigation = this.router.getCurrentNavigation()
    // 라우트 파라미터에서 store_id 가져오기
    this.route.paramMap.subscribe(params => {
      this.store_id = Number(params.get('store_id')) || null
      console.log('store_id from route params: ', this.store_id)
    })
  }

  deleteReview(review_id: number): void {
    const confirmed = confirm('리뷰를 삭제하시겠습니까?')
    if (!confirmed) return

    this.reviewsService.deleteReview(this.store_id!, review_id).subscribe({
      next: () => {
        console.log(`리뷰 id${review_id} 삭제 완료`)
        this.refreshReviews()
      },
      error: err => {
        console.error('리뷰 삭제 실패: ', err)
      }
    })
  }

  refreshReviews(): void {
    if (!this.store_id) {
      console.error('store_id가 없습니다')
      return
    }
    this.reviewsService.getReviewsByStoreId(this.store_id).subscribe({
      next: res => {
        this.reviews = res.data || []
      },
      error: err => {
        console.error('리뷰 새로고침 실패: ', err)
      }
    })
  }
}
