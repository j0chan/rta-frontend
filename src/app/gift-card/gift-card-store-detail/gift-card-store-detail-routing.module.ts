import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { GiftCardStoreDetailPage } from './gift-card-store-detail.page';

const routes: Routes = [{ path: '', component: GiftCardStoreDetailPage }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GiftCardStoreDetailRoutingModule {}
