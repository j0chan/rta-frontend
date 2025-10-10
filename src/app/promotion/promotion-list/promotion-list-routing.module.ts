import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PromotionListPage } from './promotion-list.page';
import { AdminGuard } from '../../shared/guard/admin.guard';
// 프로젝트의 AdminGuard/RoleGuard를 쓰는 경우 아래 주석을 풀어 연결
// import { AdminGuard } from 'src/app/shared/guards/admin.guard';

const routes: Routes = [
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
export class PromotionListRoutingModule { }