import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { ApiResponseDTO } from 'src/app/shared/model/common/api-response.interface'
import { ReadEvent } from 'src/app/shared/model/events/read-event.interface'
import { ReadStore } from 'src/app/shared/model/stores/read-store.interface'
import { UpdateStoreDetail } from 'src/app/shared/model/stores/update-store-detail.interface'
import { EventsService } from 'src/app/shared/services/event.services'
import { StoresService } from 'src/app/shared/services/stores.service'

@Component({
  selector: 'app-edit-my-store',
  templateUrl: './edit-my-store.page.html',
  standalone: false,
})
export class EditMyStorePage implements OnInit {
  private store_id: number | null = null
  store: ReadStore | null = null
  events: ReadEvent[] = []
  editableStore: UpdateStoreDetail = {
    store_name: '',
    owner_name: '',
    category_id: 0,
    contact_number: '',
    description: '',
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storesService: StoresService,
    private eventsService: EventsService,
  ) { }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id') ?? ''
    this.store_id = idParam ? Number(idParam) : 0

    // 가게정보/이벤트 정보 불러오기
    if (this.store_id !== null) {
      this.loadStoreInfo(this.store_id)
      this.loadStoreEvents(this.store_id)
    }
  }

  loadStoreInfo(store_id: number) {
    this.storesService.getStoreById(store_id).subscribe((res: ApiResponseDTO<ReadStore>) => {
      const data = res.data
      if (!data) {
        console.error('Store not found')
        return
      }
      this.store = data
      if (this.store) {
        this.editableStore = {
          store_name: data.store_name,
          owner_name: data.owner_name,
          category_id: data.category.category_id,
          contact_number: data.contact_number,
          description: data.description,
        }
      }
    })
  }

  loadStoreEvents(store_id: number) {
    this.eventsService.getAllEventsByStore(store_id).subscribe({
      next: (res: ApiResponseDTO<ReadEvent[]>) => {
        this.events = res.data ?? []
      },
      error: (err) => {
        console.error('Failed to Retriving Events', err)
      }
    })
  }

  isStoreModified(): boolean {
    if (!this.store) return false
    return (
      this.store.store_name !== this.editableStore.store_name ||
      this.store.owner_name !== this.editableStore.owner_name ||
      this.store.category.category_id !== this.editableStore.category_id ||
      this.store.contact_number !== this.editableStore.contact_number ||
      this.store.description !== this.editableStore.description
    )
  }

  updateStoreInfo() {
    if (!this.store_id) return

    this.storesService.updateStoreDetail(this.store_id, this.editableStore).subscribe({
      next: (res: ApiResponseDTO<void>) => {
        alert('Store Info Updataed Successfully')
        this.router.navigate(['/manager/my-stores'])
      },
      error: (err) => {
        console.error('Store updated failed', err)
        alert('Failed to Update Store Info. Try Again')
      }
    })
  }
}
