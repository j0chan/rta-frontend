import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { GiftCardStoreRoutingModule } from './gift-card-store-routing.module'
import { RouterModule } from '@angular/router'
import { HttpClientModule } from '@angular/common/http'
import { GiftCardStorePage } from './gift-card-store.page'
import { SharedModule } from 'src/app/shared/module/shared.module'
import { IonicModule } from '@ionic/angular'

@NgModule({
    declarations: [
        GiftCardStorePage
    ],
    imports: [
        CommonModule,
        RouterModule,
        HttpClientModule,
        GiftCardStoreRoutingModule,
        SharedModule,
        IonicModule,
    ],
})
export class GiftCardStoreModule { }
