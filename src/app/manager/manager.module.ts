import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManagerRoutingModule } from './manager-routing.module';

import { ManagerPage } from './pages/manager/manager.page'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManagerRoutingModule
  ],
  declarations: [ManagerPage]
})
export class ManagerModule {}
