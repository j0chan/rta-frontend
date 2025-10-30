import { Component, Input, Output, EventEmitter } from '@angular/core'
import { ReadStore } from '../../shared/model/stores/read-store.interface'

@Component({
  selector: 'app-recommended-stores-list',
  templateUrl: './recommended-stores-list.component.html',
  styleUrls: ['./recommended-stores-list.component.scss'],
  standalone: false,
})
export class RecommendedStoresListComponent {
  @Input() userNickname: string | null = null
  @Input() isLoading: boolean = true
  @Input() errorMessage: string = ''
  @Input() recommendedStores: ReadStore[] = []
  @Output() storeClick = new EventEmitter<number>()

  constructor() { }

  onStoreClick(storeId: number) {
    this.storeClick.emit(storeId)
  }
}
