import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { ApiResponseDTO } from 'src/app/shared/model/common/api-response.interface'
import { ReadStore } from 'src/app/shared/model/stores/read-store.interface'
import { MyPageService } from 'src/app/shared/services/my-page.service'
import { StoresService } from 'src/app/shared/services/stores.service'

@Component({
  selector: 'app-my-stores',
  templateUrl: './my-stores.page.html',
  standalone: false,
})
export class MyStoresPage implements OnInit {
  stores: ReadStore[] = []

  constructor(
    private router: Router,
    private myPageService: MyPageService,
  ) { }

  ngOnInit() {
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
  goStorePage(store: ReadStore) {
    const store_id = store.store_id

    this.router.navigate([`/stores/${store_id}`])
    console.log(`go store ${store.store_name} page`)
  }

}
