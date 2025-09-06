import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { GiftCardStoreRoutingModule } from './gift-card-store-routing.module'
import { RouterModule } from '@angular/router'
import { HttpClientModule } from '@angular/common/http'
import { GiftCardStorePage } from './gift-card-store.page'

@NgModule({
    declarations: [
        GiftCardStorePage
    ],
    imports: [
        CommonModule,
        RouterModule,
        HttpClientModule,
        GiftCardStoreRoutingModule
    ],
})
export class GiftCardStoreModule { }
