import { Component, Input } from '@angular/core';
import { ReadStore } from 'src/app/model/stores/read-store.interface';

@Component({
  selector: 'app-store-info',
  templateUrl: './store-info.component.html',
  styleUrls: ['./store-info.component.scss'],
  standalone: false
})
export class StoreInfoComponent {
  @Input() store!: ReadStore;
}