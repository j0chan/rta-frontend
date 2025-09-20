import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GiftCardUsedPage } from './gift-card-used.page';

const routes: Routes = [
    { path: '', component: GiftCardUsedPage }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class GiftCardUsedRoutingModule { }
