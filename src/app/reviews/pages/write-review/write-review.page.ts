import { Location } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { ApiResponseDTO } from 'src/app/shared/model/common/api-response.interface'
import { CreateReview } from 'src/app/shared/model/reviews/create-review.interface'
import { ReadStore } from 'src/app/shared/model/stores/read-store.interface'
import { ReviewsService } from 'src/app/shared/services/reviews.service'
import { StoresService } from 'src/app/shared/services/stores.service'

@Component({
  selector: 'app-write-review',
  templateUrl: './write-review.page.html',
  standalone: false,
})
export class WriteReviewPage implements OnInit {
  private store_id: number | null = null
  store_name: string = 'No store'
  content: string = ''
  selectedFiles: File[] = []
  previewUrls: string[] = []

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private storesService: StoresService,
    private reviewsService: ReviewsService,
    private location: Location,
  ) { }

  ngOnInit() {
    this.getStoreId()
    this.getStoreName()
  }

  submit() {
    this.createReview()
    console.log('입력한 리뷰: ', this.content)
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement
    if (target.files) {
      this.selectedFiles = Array.from(target.files)

      this.previewUrls = this.selectedFiles.map(file =>
        URL.createObjectURL(file)
      )
    }
  }

  getStoreId() {
    const navigation = this.router.getCurrentNavigation()
    // 라우트 파라미터에서 store_id 가져오기
    this.route.paramMap.subscribe(params => {
      this.store_id = Number(params.get('store_id')) || null
      console.log('store_id from route params: ', this.store_id)
    })
  }

  getStoreName() {
    if (!this.store_id) { return }

    this.storesService.getStoreById(this.store_id).subscribe((response: ApiResponseDTO<ReadStore>) => {
      const store = response.data ?? null
      if (store) {
        this.store_name = store.store_name
      }
    })
  }

  createReview() {
    if (!this.store_id) { return }

    const createReview: CreateReview = {
      content: this.content
    }

    this.reviewsService.createReview(this.store_id, createReview).subscribe({
      next: (response) => {
        if (response.success && response.data?.review_id) {
          const review_id = response.data.review_id

          if (this.selectedFiles.length > 0) {
            this.selectedFiles.forEach(file => {
              this.reviewsService.uploadReviewImage(review_id, file).subscribe({
                next: () => console.log('이미지 업로드 완료'),
                error: err => console.error('이미지 업로드 실패: ', err)
              })
            })
          }

          this.router.navigate(['/store', this.store_id], {
            state: { refresh: true },
          })
        } else {
          console.error('create review failed: ', response.message)
        }
      },
      error: err => {
        console.error('create review error: ', err)
      },
      complete: () => {
        console.log('create review completed')
      }
    })
  }
}
