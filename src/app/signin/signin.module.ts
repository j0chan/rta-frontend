import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular'

import { SigninPageRoutingModule } from './signin-routing.module'

import { SigninPage } from './signin.page'
import { SharedModule } from '../shared/module/shared.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    SigninPageRoutingModule,
  ],
  declarations: [SigninPage]
})
export class SigninPageModule {}
