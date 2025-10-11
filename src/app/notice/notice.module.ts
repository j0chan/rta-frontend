import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoticeRoutingModule } from './notice-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NoticeListPage } from './notice-list/notice-list.page';
import { NoticeDetailPage } from './notice-detail/notice-detail.page';
import { NoticeWritePage } from './notice-write/notice-write.page';
import { SharedModule } from '../shared/module/shared.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        NoticeRoutingModule,
        SharedModule,
    ],
    declarations: [
        NoticeListPage,
        NoticeDetailPage,
        NoticeWritePage,
    ],
})
export class NoticeModule { }