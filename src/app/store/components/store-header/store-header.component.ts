import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiResponseDTO } from 'src/app/model/common/api-response.interface';
import { ReadStore } from 'src/app/model/stores/read-store.interface';
import { StoresService } from 'src/app/services/stores.service';

@Component({
  selector: 'app-store-header',
  templateUrl: './store-header.component.html',
  styleUrls: ['./store-header.component.scss'],
  standalone: false
})
export class StoreHeaderComponent {
  @Input() store: ReadStore | null = null


}
