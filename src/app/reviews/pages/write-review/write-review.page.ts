import { Location } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { ApiResponseDTO } from 'src/app/shared/model/common/api-response.interface'
import { CreateReview } from 'src/app/shared/model/reviews/create-review.interface'
import { ReadStore } from 'src/app/shared/model/stores/read-store.interface'
import { StoresService } from 'src/app/shared/services/stores.service'

@Component({
  selector: 'app-write-review',
  templateUrl: './write-review.page.html',
  standalone: false,
})
export class WriteReviewPage implements OnInit {
  private store_id!: number
  store_name: string = 'No store'
  content: string = ''

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private storesService: StoresService,
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


  getStoreId() {
    const navigation = this.router.getCurrentNavigation()
    // `queryParams`에서 store_id 가져오기
    this.route.queryParams.subscribe(params => {
      if (params['store_id']) {
        this.store_id = +params['store_id'] // 문자열을 숫자로 변환
        console.log('store_id from queryParams:', this.store_id)
      }
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
      user_id: 1, // 임시 아이디
      content: this.content
    }

    this.storesService.createReview(this.store_id, createReview).subscribe({
      next: response => {
        if (response.success) {
          this.location.back()
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
