import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyGiftCardPage } from './my-gift-card.page';

const routes: Routes = [{ path: '', component: MyGiftCardPage }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MyGiftCardRoutingModule { }