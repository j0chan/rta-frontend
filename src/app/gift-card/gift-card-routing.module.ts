import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { GiftCardCreatePage } from './gift-card-create/gift-card-create.page'
import { GiftCardStorePage } from './gift-card-store/gift-card-store.page'
import { GiftCardStoreDetailPage } from './gift-card-store-detail/gift-card-store-detail.page'
import { GiftCardUsedPage } from './gift-card-used/gift-card-used.page'
import { MyGiftCardPage } from './my-gift-card/my-gift-card.page'

const routes: Routes = [
  {
    path: 'create', component: GiftCardCreatePage
  },
  {
    path: '', component: GiftCardStorePage
  },
  {
    path: 'detail/:id', component: GiftCardStoreDetailPage
  },
  {
    path: 'used', component: GiftCardUsedPage
  },
  {
    path: 'my', component: MyGiftCardPage
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GiftCardRoutingModule { }
