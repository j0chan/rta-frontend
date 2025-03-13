import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StorePageRoutingModule } from './store-routing.module';
import { StorePage } from './pages/store-main-page/store.page';
import { StoreInfoComponent } from './components/store-info/store-info.component';
import { MenuPage } from './pages/menu-page/menu.page';
import { EventDetailPage } from './pages/event-detail-page/event-detail.page';
import { EventListPage } from './pages/event-list-page/event-list.page';


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
    EventDetailPage,
    EventListPage,
  ]
})
export class StorePageModule {}
