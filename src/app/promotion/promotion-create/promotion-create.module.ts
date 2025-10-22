import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PromotionCreatePage } from './promotion-create.page';
import { PromotionCreateRoutingModule } from './promotion-create-routing.module';
import { SharedModule } from 'src/app/shared/module/shared.module';

@NgModule({
    declarations: [PromotionCreatePage],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        SharedModule,
        PromotionCreateRoutingModule,
    ],
})
export class PromotionCreateModule { }