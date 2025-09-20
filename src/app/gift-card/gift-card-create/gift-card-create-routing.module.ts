import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GiftCardCreatePage } from './gift-card-create.page';

const routes: Routes = [{ path: '', component: GiftCardCreatePage }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class GiftCardCreateRoutingModule { }