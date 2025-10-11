import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PromotionListPage } from './promotion-list.page';
import { SharedModule } from '../../shared/module/shared.module';
import { PromotionListRoutingModule } from './promotion-list-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@NgModule({
    declarations: [PromotionListPage],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        SharedModule,
        RouterModule,
        PromotionListRoutingModule,
    ],
})
export class PromotionListModule { }
