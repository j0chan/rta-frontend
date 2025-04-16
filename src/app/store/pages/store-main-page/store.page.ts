import { ToastController } from '@ionic/angular'
import { EventsService } from 'src/app/shared/services/event.services'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { filter, Subscription } from 'rxjs'
import { ApiResponseDTO } from 'src/app/shared/model/common/api-response.interface'
import { ReadEvent } from 'src/app/shared/model/events/read-event.interface'
import { ReadReview } from 'src/app/shared/model/reviews/read-review.interface'
import { ReadStore } from 'src/app/shared/model/stores/read-store.interface'
import { ReviewsService } from 'src/app/shared/services/reviews.service'
import { StoresService } from 'src/app/shared/services/stores.service'
import { AuthService } from 'src/app/shared/services/auth.service'

@Component({
  selector: 'app-store',
  templateUrl: './store.page.html',
  standalone: false,
})
export class StorePage implements OnInit {
  isLoggedIn = false

  private store_id: number | null = null
  store: ReadStore | null = null
  event: ReadEvent | null = null
  reviews: ReadReview[] = []

  private routerSubscription!: Subscription

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private storesService: StoresService,
    private reviewsService: ReviewsService,
    private eventsService: EventsService,
    private authService: AuthService,
    private toastController: ToastController,
  ) { }

  ngOnInit() {
    this.store_id = Number(this.route.snapshot.paramMap.get('store_id'))
    if (this.store_id) {
      // 가게 정보, 최신 이벤트, 가게 리뷰 가져오기
      this.loadStoreInfo(this.store_id)
      this.loadStoreEvents(this.store_id)
      this.loadStoreReviews(this.store_id)
    }

    // 리뷰 작성하고 다시 스토어 페이지로 돌아왔을 때 리뷰 데이터를 다시 불러와줍니다
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.store_id) { this.loadStoreReviews(this.store_id) }
      })
  }

  // routerSubscription 사용 시 데이터 누수 때문에 구독 해지해줘야 함
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe()
    }
  }

  /* 데이터 불러오기 */

  loadStoreInfo(store_id: number) {
    this.storesService.getStoreById(store_id).subscribe((response: ApiResponseDTO<ReadStore>) => {
      this.store = response.data ?? null
    })
  }

  loadStoreEvents(store_id: number) {
    this.eventsService.getLastestEventByStoreId(store_id).subscribe({
      next: (response: ApiResponseDTO<ReadEvent>) => {
        this.event = response.data ?? null
      },
      error: (err) => {
        console.error('Failed to Retriving Event', err)
      }
    })
  }

  loadStoreReviews(store_id: number) {
    this.reviewsService.getReviewsByStoreId(store_id).subscribe({
      next: (response: ApiResponseDTO<ReadReview[]>) => {
        this.reviews = response.data ?? []
      },
      error: (err) => {
        console.error('Failed to Retriving Reviews', err)
      }
    })
  }

  /* 페이지 이동 */

  goMenuPage() {
    this.router.navigate([`menu`], { relativeTo: this.route })
    console.log('go menu page')
  }

  goEventListPage() {
    this.router.navigate([`event-list`], { relativeTo: this.route })
    console.log('go event-list page')
  }

  async goWriteReviewPage() {
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status
    })
    if (!this.isLoggedIn) {
      const toast = await this.toastController.create({
        message: '로그인이 필요합니다.',
        duration: 2000,
        position: 'top',
        color: 'warning'
      })
      await toast.present()

      this.router.navigate(['/signin'])
    }
    else {
      this.router.navigate([`write-review`], { relativeTo: this.route })
      console.log('go write-review page')
    }
  }
}