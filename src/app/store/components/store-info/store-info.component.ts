import { Component, Input, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { ReadStore } from 'src/app/model/stores/read-store.interface'

@Component({
  selector: 'app-store-info',
  templateUrl: './store-info.component.html',
  styleUrls: ['./store-info.component.scss'],
  standalone: false
})
export class StoreInfoComponent {
  @Input() store!: ReadStore

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  goStoreDetailPage() {
    this.router.navigate(['store-detail'], { relativeTo: this.route })
    console.log('go store-detail page')
  }
}