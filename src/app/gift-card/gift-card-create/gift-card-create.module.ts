import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { GiftCardCreateRoutingModule } from './gift-card-create-routing.module';
import { GiftCardCreatePage } from './gift-card-create.page';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { IonicModule } from '@ionic/angular';

@NgModule({
    declarations: [GiftCardCreatePage],
    imports: [
        CommonModule,
        FormsModule,   // ngModel
        RouterModule,
        HttpClientModule,
        GiftCardCreateRoutingModule,
        SharedModule,
        IonicModule,
    ],
})
export class GiftCardCreateModule { }
