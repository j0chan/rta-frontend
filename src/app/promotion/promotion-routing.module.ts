import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PromotionCreatePage } from './promotion-create/promotion-create.page';
import { AdminGuard } from '../shared/guard/admin.guard';
import { PromotionListPage } from './promotion-list/promotion-list.page';

const routes: Routes = [
    {
        path: 'create', component: PromotionCreatePage,
        canActivate: [AdminGuard],
        data: { title: '프로모션 작성' },
    },
    {
        path: '', component: PromotionListPage,
        canActivate: [AdminGuard],
        data: { title: '프로모션 관리' },
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PromotionRoutingModule { }