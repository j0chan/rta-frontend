import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StorePageRoutingModule } from './store-routing.module';
import { StorePage } from './pages/store-main/store.page';
import { StoreInfoComponent } from './components/store-info/store-info.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StorePageRoutingModule,
  ],
  declarations: [
    StorePage,
    StoreInfoComponent
  ]
})
export class StorePageModule {}
