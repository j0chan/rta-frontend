import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { ApiResponseDTO } from 'src/app/shared/model/common/api-response.interface'
import { ReadStore } from 'src/app/shared/model/stores/read-store.interface'
import { MyPageService } from 'src/app/shared/services/my-page.service'

@Component({
  selector: 'app-my-stores',
  templateUrl: './my-stores.component.html',
  styleUrls: ['./my-stores.component.scss'],
  standalone: false,
})
export class MyStoresComponent implements OnInit {
  stores: ReadStore[] = []

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private myPageService: MyPageService,
  ) { }

  ngOnInit() {
    this.loadMyStores()
  }

  loadMyStores() {
    this.myPageService.getMyStores().subscribe({
      next: (response: ApiResponseDTO<ReadStore[]>) => {
        this.stores = response.data ?? []
      },
      error: (err) => {
        console.error('Failed To Retriving Stores', err)
      }
    })
  }

  /* 페이지 이동 */
  goMyManagerRequestsPage() {
    console.log('go my manager requests page')
    this.router.navigate(['my-manager-requests'], { relativeTo: this.route })
  }

  goMyStoresPage() {
    console.log('go my stores page')
    this.router.navigate(['my-stores'], { relativeTo: this.route })
  }

  /* 페이지 이동 */
  goStorePage(store: ReadStore) {
    const store_id = store.store_id

    this.router.navigate([`/stores/${store_id}`])
    console.log(`go store ${store.store_name} page`)
  }

  goEditPage(store: ReadStore) {
    const store_id = store.store_id

    this.router.navigate([store_id, 'edit'], { relativeTo: this.route })
    console.log(`go store ${store.store_name} edit page`)
  }

  goCreateManagerRequestPage() {
    this.router.navigate(['/manager/create-manager-request'])
  }

  goMyManagerRequestPage() {
    this.router.navigate(['/manager/my-manager-requests'])
  }
}