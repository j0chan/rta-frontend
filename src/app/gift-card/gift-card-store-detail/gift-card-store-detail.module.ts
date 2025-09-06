import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { HttpClientModule } from '@angular/common/http'
import { GiftCardStoreDetailRoutingModule } from './gift-card-store-detail-routing.module'
import { GiftCardStoreDetailPage } from './gift-card-store-detail.page'

@NgModule({
    declarations: [
        GiftCardStoreDetailPage
    ],
    imports: [
        CommonModule,
        RouterModule,
        HttpClientModule,
        GiftCardStoreDetailRoutingModule
    ],
})
export class GiftCardStoreDetailModule { }
