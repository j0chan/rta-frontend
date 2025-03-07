import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { NearbyStoresPage } from './nearby-stores.page'


const routes: Routes = [
  {
    path: '',
    component: NearbyStoresPage
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class NearbyStoresPageRoutingModule {}
