import { Component, Input, OnInit } from '@angular/core'
import { ReadReview } from '../../model/reviews/read-review.interface'
import { getUserIdFromToken } from '../../utils/token.util'
import { ReviewsService } from '../../services/reviews.service'
import { ActivatedRoute, Router } from '@angular/router'

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
  standalone: false,
})
export class ReviewComponent implements OnInit {
  @Input() review!: ReadReview
  private store_id: number | null = null
  currentUserId: number | null = null

  constructor(
    private reviewsService: ReviewsService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
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
        if (res.data && res.data.length > 0) {
          this.review = res.data[0]
        } else {
          console.warn('리뷰가 없습니다.')
        }
      },
      error: err => {
        console.error('리뷰 새로고침 실패: ', err)
      }
    })
  }

  toggleHelpful(review: ReadReview): void {
    if (!this.store_id) {
      console.error('store_id가 없습니다.')
      return
    }

    this.reviewsService.toggleHelpful(this.store_id, review.review_id).subscribe({
      next: (res) => {
        // helpful_count 즉시 반영
        if (review.isHelpful) {
          review.helpful_count -= 1
        } else {
          review.helpful_count += 1
        }
        review.isHelpful = !review.isHelpful
      },
      error: (err) => {
        console.error('도움돼요 토글 실패:', err)
      },
    })
  }

}
