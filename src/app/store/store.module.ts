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
import { CreateStoreRequestPage } from './pages/create-store-request.page/create-store-request.page'
import { CreateStoreRequestComponent } from './components/store-request/create-store-request.component'


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StorePageRoutingModule,
  ],
  declarations: [
    StorePage,
    StoreInfoComponent,
    MenuPage,
    EventListPage,
    EventComponent,
    ReviewsComponent,
    StoreDetailPage,
    StoreHeaderComponent,
    CreateStoreRequestPage,
    CreateStoreRequestComponent
  ]
})
export class StorePageModule { }
