import { Component, OnInit } from '@angular/core'
import { ReadStore } from 'src/app/shared/model/stores/read-store.interface'
import { SearchService } from 'src/app/shared/services/search.service'

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  standalone: false,
})
export class SearchPage implements OnInit {
  keyword: string = ''
  searchedStores: ReadStore[] = []
  constructor(private searchService: SearchService) { }

  ngOnInit() {
  }

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
}
