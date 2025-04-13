import { Component, Input } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { ReadStore } from 'src/app/shared/model/stores/read-store.interface'

@Component({
  selector: 'app-store-info',
  templateUrl: './store-info.component.html',
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