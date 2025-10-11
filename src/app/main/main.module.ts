import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MainRoutingModule } from './main.routing-module';
import { SharedModule } from '../shared/module/shared.module';
import { IonicModule } from '@ionic/angular';
import { MainPage } from './main.page';
import { HomeNoticeListComponent } from '../shared/components/home-notice-list/home-notice-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MainRoutingModule,
    SharedModule,
    IonicModule,
  ],
  declarations: [
    MainPage,
    HomeNoticeListComponent,
  ],
})
export class MainModule { }
