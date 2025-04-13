import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular'

import { SharedModule } from '../shared/module/shared.module'
import { MapPage } from './pages/map.page'
import { MapComponent } from './components/map.component'
import { MapRoutingModule } from './map-routing.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapRoutingModule,
    SharedModule
  ],
  declarations: [
    MapPage,
    // MapComponent
  ]
})
export class MapPageModule { }
