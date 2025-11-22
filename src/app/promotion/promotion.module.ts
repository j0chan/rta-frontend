import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../shared/module/shared.module';
import { PromotionRoutingModule } from './promotion-routing.module';
import { PromotionListPage } from './promotion-list/promotion-list.page';
import { PromotionCreatePage } from './promotion-create/promotion-create.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        SharedModule,
        PromotionRoutingModule
    ],
    declarations: [
        PromotionListPage,
        PromotionCreatePage,
    ],
})
export class PromotionModule { }