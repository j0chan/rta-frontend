import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular'

import { StorePageRoutingModule } from './store-routing.module'
import { StorePage } from './pages/store-main-page/store.page'
import { StoreInfoComponent } from './components/store-info/store-info.component'
import { MenuPage } from './pages/menu-page/menu.page'
import { EventListPage } from './pages/event-list-page/event-list.page'
import { EventComponent } from './components/event/event.component'
import { ReviewsComponent } from './components/reviews/reviews.component'
import { StoreDetailPage } from './pages/store-detail-page/store-detail-page'
import { StoreHeaderComponent } from './components/store-header/store-header.component'
import { SharedModule } from '../shared/module/shared.module'


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StorePageRoutingModule,
    SharedModule
  ],
  declarations: [
    StorePage,
    StoreInfoComponent,
    MenuPage,
    EventListPage,
    EventComponent,
    ReviewsComponent,
    StoreDetailPage,
    StoreHeaderComponent
  ]
})
export class StorePageModule { }
