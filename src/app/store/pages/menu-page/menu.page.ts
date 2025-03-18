import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { ApiResponseDTO } from 'src/app/shared/model/common/api-response.interface'
import { ReadMenu } from 'src/app/shared/model/menus/read-menu.interface'
import { ReadStore } from 'src/app/shared/model/stores/read-store.interface'
import { StoresService } from 'src/app/shared/services/stores.service'

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  standalone: false
})
export class MenuPage implements OnInit {
  store: ReadStore | undefined
  menus: ReadMenu[] = []

  constructor(
    private route: ActivatedRoute,
    private storesService: StoresService,
  ) { }

  ngOnInit() {
    const store_id = Number(this.route.snapshot.paramMap.get('store_id'))
    if (store_id) {
      // 가게 정보 가져오기
      this.storesService.getStoreById(store_id).subscribe((response: ApiResponseDTO<ReadStore>) => {
        this.store = response.data
      })

      // 메뉴 정보 가져오기
      this.storesService.getMenusByStoreId(store_id).subscribe({
        next: (response: ApiResponseDTO<ReadMenu[]>) => {
          this.menus = response.data ?? []
        },
        error: (err) => {
          console.error('Failed to Retriving Menus', err)
        }
      })
    }
  }

}
