import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { GiftCardStorePage } from './gift-card-store.page';

const routes: Routes = [{ path: '', component: GiftCardStorePage }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class GiftCardStoreRoutingModule { }
