import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { GiftCardCreateRoutingModule } from './gift-card-create-routing.module';
import { GiftCardCreatePage } from './gift-card-create.page';

@NgModule({
    declarations: [GiftCardCreatePage],
    imports: [
        CommonModule,
        FormsModule,   // ngModel
        RouterModule,
        HttpClientModule,
        GiftCardCreateRoutingModule,
    ],
})
export class GiftCardCreateModule { }
