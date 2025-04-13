import { Component, Input } from '@angular/core'
import { ReadStore } from 'src/app/shared/model/stores/read-store.interface'

@Component({
  selector: 'app-store-header',
  templateUrl: './store-header.component.html',
  standalone: false
})
export class StoreHeaderComponent {
  @Input() store: ReadStore | null = null
}
