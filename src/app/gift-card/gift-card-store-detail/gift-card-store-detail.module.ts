import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { HttpClientModule } from '@angular/common/http'
import { GiftCardStoreDetailRoutingModule } from './gift-card-store-detail-routing.module'
import { GiftCardStoreDetailPage } from './gift-card-store-detail.page'
import { SharedModule } from 'src/app/shared/module/shared.module'
import { IonicModule } from '@ionic/angular'

@NgModule({
    declarations: [
        GiftCardStoreDetailPage
    ],
    imports: [
        CommonModule,
        RouterModule,
        HttpClientModule,
        GiftCardStoreDetailRoutingModule,
        SharedModule,
        IonicModule,
    ],
})
export class GiftCardStoreDetailModule { }
