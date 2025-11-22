import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { IonicModule } from '@ionic/angular'
import { SharedModule } from '../shared/module/shared.module'
import { GiftCardRoutingModule } from './gift-card-routing.module'
import { GiftCardCreatePage } from './gift-card-create/gift-card-create.page'
import { GiftCardStorePage } from './gift-card-store/gift-card-store.page'
import { GiftCardStoreDetailPage } from './gift-card-store-detail/gift-card-store-detail.page'
import { GiftCardUsedPage } from './gift-card-used/gift-card-used.page'
import { MyGiftCardPage } from './my-gift-card/my-gift-card.page'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    GiftCardRoutingModule
  ],
  declarations: [
    GiftCardCreatePage,
    GiftCardStorePage,
    GiftCardStoreDetailPage,
    GiftCardUsedPage,
    MyGiftCardPage
  ],
})
export class GiftCardModule { }
