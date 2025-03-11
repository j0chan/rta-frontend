import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-nearby-stores',
  templateUrl: './nearby-stores.component.html',
  styleUrls: ['./nearby-stores.component.scss'],
  standalone: false
})
export class NearbyStoresComponent implements OnInit {

  constructor() {}

  ngOnInit() {}

  onSearch(query: string) {
    console.log('검색어:', query);
    // 검색 결과를 필터링 or API 호출
  }
}
