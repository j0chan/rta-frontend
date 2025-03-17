import { Component, Input, OnInit } from '@angular/core'
import { ReadStore } from 'src/app/model/stores/read-store.interface'

@Component({
  selector: 'app-store-header',
  templateUrl: './store-header.component.html',
  styleUrls: ['./store-header.component.scss'],
  standalone: false
})
export class StoreHeaderComponent {
  @Input() store: ReadStore | null = null
}
