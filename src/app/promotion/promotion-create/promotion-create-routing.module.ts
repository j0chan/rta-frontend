import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PromotionCreatePage } from './promotion-create.page';
import { AdminGuard } from 'src/app/shared/guard/admin.guard';

const routes: Routes = [
    {
        path: '', component: PromotionCreatePage,
        canActivate: [AdminGuard],
        data: { title: '프로모션 작성' },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PromotionCreateRoutingModule { }