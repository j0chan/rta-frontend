import { Component, OnInit } from '@angular/core'
import { ApiResponseDTO } from 'src/app/shared/model/common/api-response.interface'
import { ReadStore } from 'src/app/shared/model/stores/read-store.interface'
import { StoresService } from 'src/app/shared/services/stores.service'

@Component({
  selector: 'app-my-stores',
  templateUrl: './my-stores.page.html',
  standalone: false,
})
export class MyStoresPage implements OnInit {
  stores: ReadStore[] = []
  // 임시 user_id
  user_id: number = 1

  constructor(
    private storesService: StoresService
  ) { }

  ngOnInit() {
    this.storesService.getAllStoresByUserId(this.user_id).subscribe({
      next: (response: ApiResponseDTO<ReadStore[]>) => {
        this.stores = response.data ?? []
      },
      error: (err) => {
        console.error('Failed To Retriving Stores', err)
      }
    })
  }

}
