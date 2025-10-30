import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular'

import { RecommendedStoresRoutingModule } from './recommended-stores-routing.module'

import { RecommendedStoresPage } from './pages/recommended-stores.page'
import { RecommendedStoresListComponent } from './components/recommended-stores-list.component'
import { SharedModule } from '../shared/module/shared.module'

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SharedModule,
        RecommendedStoresRoutingModule
    ],
    declarations: [RecommendedStoresPage, RecommendedStoresListComponent]
})
export class RecommendedStoresModule { }
