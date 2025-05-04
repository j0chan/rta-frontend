import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { ApiResponseDTO } from 'src/app/shared/model/common/api-response.interface'
import { CreateEvent } from 'src/app/shared/model/events/create-event.interface'
import { ReadEvent } from 'src/app/shared/model/events/read-event.interface'
import { UpdateEvent } from 'src/app/shared/model/events/update-event.interface'
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
  editableStore: UpdateStoreDetail = {
    store_name: '',
    owner_name: '',
    category_id: 0,
    contact_number: '',
    description: '',
  }

  events: ReadEvent[] = []
  editableEvent: UpdateEvent[] = []
  newEvent: Omit<CreateEvent, 'event_id'> = {
    title: '',
    description: '',
    start_date: new Date(),
    end_date: new Date(),
  }

  showCreateEventForm: boolean = false

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storesService: StoresService,
    private eventsService: EventsService,
  ) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id') ?? ''
    this.store_id = idParam ? Number(idParam) : 0

    if (this.store_id !== null) {
      this.loadStoreInfo(this.store_id)
      this.loadStoreEvents(this.store_id)
    }
  }

  loadStoreInfo(store_id: number) {
    this.storesService.getStoreById(store_id).subscribe((res: ApiResponseDTO<ReadStore>) => {
      const data = res.data
      if (!data) {
        alert('가게 정보를 찾을 수 없습니다.')
        return
      }
      this.store = data
      this.editableStore = {
        store_name: data.store_name,
        owner_name: data.owner_name,
        category_id: data.category.category_id,
        contact_number: data.contact_number,
        description: data.description,
      }
    })
  }

  loadStoreEvents(store_id: number) {
    this.eventsService.getAllEventsByStore(store_id).subscribe((res: ApiResponseDTO<ReadEvent[]>) => {
      const data = res.data ?? []
      if (data.length === 0) {
        this.events = []
        this.editableEvent = []
        return
      }
      this.events = data
      this.editableEvent = data.map(event => ({
        title: event.title,
        description: event.description,
        start_date: new Date(event.start_date),
        end_date: new Date(event.end_date),
        is_canceled: event.is_canceled,
      }))
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

  isEventModified(index: number): boolean {
    const original = this.events[index]
    const edited = this.editableEvent[index]
  
    return (
      original.title !== edited.title ||
      original.description !== edited.description ||
      new Date(original.start_date).getTime() !== new Date(edited.start_date).getTime() ||
      new Date(original.end_date).getTime() !== new Date(edited.end_date).getTime() ||
      original.is_canceled !== edited.is_canceled
    )
  }
  

  updateStoreInfo() {
    if (!this.store_id) return

    this.storesService.updateStoreDetail(this.store_id, this.editableStore).subscribe({
      next: () => {
        alert('Store Info Updated Successfully')
        this.router.navigate(['/manager/my-stores'])
      },
      error: (err) => {
        console.error('Store update failed', err)
        alert('Failed to Update Store Info. Try Again')
      }
    })
  }

  updateEvent(index: number) {
    const event = this.editableEvent[index]
    this.eventsService.updateEvent(this.store_id!, this.events[index].event_id, event).subscribe({
      next: () => {
        alert('Event Updated Successfully')
        this.loadStoreEvents(this.store_id!)
      },
      error: (err) => {
        console.error('Failed to Update Event', err)
        alert('Failed to Update Event. Try Again')
      }
    })
  }

  toggleCreateEventForm() {
    this.showCreateEventForm = !this.showCreateEventForm
  }

  createEvent() {
    this.eventsService.createEvent(this.store_id!, this.newEvent).subscribe({
      next: () => {
        alert('Event Created Successfully')
        this.loadStoreEvents(this.store_id!)
      },
      error: (err) => {
        console.error('Failed to Create Event', err)
        alert('Failed to Create Event. Try Again')
      }
    })
  }

  deleteEvent(event_id: number) {
    if (!this.store_id) return
    const confirmDelete = confirm('Are you sure you want to delete this event?')
    if (!confirmDelete) return

    this.eventsService.deleteEvent(this.store_id, event_id).subscribe({
      next: () => {
        alert('Event Deleted Successfully')
        this.loadStoreEvents(this.store_id!)
      },
      error: (err) => {
        console.error('Failed to Delete Event', err)
        alert('Failed to Delete Event. Try Again')
      }
    })
  }
}
