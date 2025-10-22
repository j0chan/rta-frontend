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
import { MapComponent } from 'src/app/map/components/map/map.component'
import { ButtonComponent } from '../components/button/button.component'
import { InputComponent } from '../components/input/input.component'
import { ReviewComponent } from '../components/review/review.component'
import { StripHtmlPipe } from '../pipes/stripHtml.pipe'
import { DividerComponent } from '../components/divider/divider.component'
import { ContainerComponent } from '../components/container/container.component'
import { UserRolePipe } from '../pipes/user-role.pipe'
import { MapPreviewComponent } from 'src/app/map/components/map-preview/map-preview.component'
import { FavoriteButtonComponent } from 'src/app/favorite/components/favorite-button.component'

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
    ButtonComponent,
    RelativeTimePipe,
    MapComponent,
    InputComponent,
    ReviewComponent,
    StripHtmlPipe,
    DividerComponent,
    ContainerComponent,
    UserRolePipe,
    MapPreviewComponent,
    FavoriteButtonComponent,
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
    UserRolePipe,
    HeaderBarComponent,
    ButtonComponent,
    RelativeTimePipe,
    MapComponent,
    InputComponent,
    ReviewComponent,
    StripHtmlPipe,
    DividerComponent,
    ContainerComponent,
    UserRolePipe,
    MapPreviewComponent,
    FavoriteButtonComponent
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