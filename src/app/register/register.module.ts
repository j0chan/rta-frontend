import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { IonicModule } from '@ionic/angular'
import { RegisterPage } from './register.page'
import { RegisterRoutingModule } from './register-routing.module'
import { SharedModule } from '../shared/module/shared.module'



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RegisterRoutingModule
  ],
  declarations: [
    RegisterPage
  ],
})
export class RegisterModule { }
