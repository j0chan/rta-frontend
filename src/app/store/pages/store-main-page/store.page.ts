import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { filter, Subscription } from 'rxjs'
import { ApiResponseDTO } from 'src/app/shared/model/common/api-response.interface'
import { ReadEvent } from 'src/app/shared/model/events/read-event.interface'
import { ReadReview } from 'src/app/shared/model/reviews/read-review.interface'
import { ReadStore } from 'src/app/shared/model/stores/read-store.interface'
import { StoresService } from 'src/app/shared/services/stores.service'

@Component({
  selector: 'app-store',
  templateUrl: './store.page.html',
  standalone: false,
})
export class StorePage implements OnInit {
  private store_id!: number
  store: ReadStore | null = null
  event: ReadEvent | null = null
  reviews: ReadReview[] = []

  private routerSubscription!: Subscription

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private storesService: StoresService
  ) { }

  ngOnInit() {
    this.store_id = Number(this.route.snapshot.paramMap.get('store_id'))
    if (this.store_id) {
      // 가게 정보 가져오기
      this.loadStoreInfo(this.store_id)

      // 최신 이벤트 가져오기
      this.loadStoreEvents(this.store_id)
    
      // 해당 가게 리뷰 가져오기
      this.loadStoreReviews(this.store_id)
    }

    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd))
      .subscribe(() => { this.loadStoreReviews(this.store_id)
      })
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe()
    }
  }

  loadStoreInfo(store_id: number) {
    this.storesService.getStoreById(store_id).subscribe((response: ApiResponseDTO<ReadStore>) => {
      this.store = response.data ?? null
    })
  }

  loadStoreEvents(store_id: number) {
    this.storesService.getLastestEventByStoreId(store_id).subscribe({
      next: (response: ApiResponseDTO<ReadEvent>) => {
        this.event = response.data ?? null
      },
      error: (err) => {
        console.error('Failed to Retriving Event', err)
      }
    })
  }

  loadStoreReviews(store_id: number) {
    this.storesService.getReviewsByStoreId(store_id).subscribe({
      next: (response: ApiResponseDTO<ReadReview[]>) => {
        this.reviews = response.data ?? []
      },
      error: (err) => {
        console.error('Failed to Retriving Reviews', err)
      }
    })
  }


  goMenuPage() {
    this.router.navigate([`menu`], { relativeTo: this.route })
    console.log('go menu page')
  }

  goEventListPage() {
    this.router.navigate([`event-list`], { relativeTo: this.route })
    console.log('go event-list page')
  }

  goWriteReviewPage() {
    this.router.navigate([`write-review`], { relativeTo: this.route, queryParams: { store_id: this.store?.store_id } })
    console.log('go write-review page')
  }
}