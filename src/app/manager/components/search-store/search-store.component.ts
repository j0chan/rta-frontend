import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { ReadStore } from 'src/app/shared/model/stores/read-store.interface'
import { SearchService } from 'src/app/shared/services/search.service'

@Component({
  selector: 'app-search-store',
  templateUrl: './search-store.component.html',
  standalone: false,
})
export class SearchStoreComponent  implements OnInit {
  keyword: string = ''
  searchedStores: ReadStore[] = []
  @Output() selectedStore = new EventEmitter<ReadStore>()

  constructor(private searchService: SearchService) { }

  ngOnInit() {}

  searchByKeyword() {
    console.log(`search by keyword ${this.keyword}`)
    
    this.searchService.searchStoresByKeyword(this.keyword).subscribe({
      next: response => {
        if (response.success) {
          this.searchedStores = response.data ?? []
        }
      },
      error: (err) => {
        console.error('Failed to Retriving Events', err)
      }
    })
  }

  selectStore(store: ReadStore) {
    console.log("selectedStore: ", store.store_name, store.store_id)
    this.selectedStore.emit(store)
  }
}
