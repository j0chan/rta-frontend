import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { SearchBarComponent } from '../components/search-bar/search-bar.component'
import { FooterMenuComponent } from '../components/footer-menu/footer-menu.component'
import { IonicModule } from '@ionic/angular'
import { EventStatusPipe } from '../pipes/event-status.pipe'
import { CategoryPipe } from '../pipes/category.pipe'
import { RequestStatusPipe } from '../pipes/request-status.pipe'
import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { AuthInterceptor } from '../interceptors/auth.interceptor'
import { LogginedComponent } from 'src/app/shared/components/loggined/loggined.component'
import { HeaderBarComponent } from '../components/header-bar/header-bar.component'
import { RelativeTimePipe } from '../pipes/relativeTime.pipe'
import { DateFormatPipe } from '../pipes/dateFormat.pipe'

@NgModule({
  declarations: [
    SearchBarComponent,
    FooterMenuComponent,
    LogginedComponent,
    EventStatusPipe,
    CategoryPipe,
    DateFormatPipe,
    RequestStatusPipe,
    HeaderBarComponent,
    RelativeTimePipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  exports: [
    SearchBarComponent,
    FooterMenuComponent,
    EventStatusPipe,
    CategoryPipe,
    DateFormatPipe,
    RequestStatusPipe,
    HeaderBarComponent,
    RelativeTimePipe,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
})
export class SharedModule { }