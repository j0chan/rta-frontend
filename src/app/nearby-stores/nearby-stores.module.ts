import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular'

import { NearbyStoresPageRoutingModule } from './nearby-stores-routing.module'
import { NearbyStoresPage } from './pages/nearby-stores.page'
import { NearbyStoresComponent } from './components/nearby-stores.component'
import { SharedModule } from '../shared/module/shared.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NearbyStoresPageRoutingModule,
    SharedModule
  ],
  declarations: [
    NearbyStoresPage,
    NearbyStoresComponent
  ]
})
export class NearbyStoresPageModule {}
