import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRole } from '../shared/model/users/user-role.enum';
import { NoticeWritePage } from './notice-write/notice-write.page';
import { NoticeListPage } from './notice-list/notice-list.page';
import { NoticeDetailPage } from './notice-detail/notice-detail.page';

const routes: Routes = [
    {
        path: '', component: NoticeListPage
    },
    {
        path: 'detail/:id', component: NoticeDetailPage
    },
    {
        path: 'write', component: NoticeWritePage,
        data: { roles: [UserRole.ADMIN] }
    },
    {
        path: 'edit/:id', component: NoticeWritePage,
        data: { roles: [UserRole.ADMIN] }
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class NoticeRoutingModule { }