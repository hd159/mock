import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { KinveyModule } from 'kinvey-angular-sdk';
import { AppRoutingModule } from './app-routing.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from './shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { SubCategoryComponent } from './client/home/home-post-item/home-post-item';
import { HomeComponent } from './client/home/home.component';
import { CarouselComponent } from './client/home/carousel/carousel.component';
import { IvyCarouselModule } from 'angular-responsive-carousel';
import { RegisterComponent } from './register/register.component';
import { NavComponent } from './client/header/nav/nav.component';
import { HeaderComponent } from './client/header/header.component';
import { FooterComponent } from './client/footer/footer.component';
import { LoginComponent } from './login/login.component';
import { HomeClientComponent } from './client/home-client/home-client.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { RequestInterceptor } from './service/interceptor';
import { UserInfoComponent } from './pageUser/user-info/user-info.component';

@NgModule({
  declarations: [
    AppComponent,
    SubCategoryComponent,
    HomeComponent,
    CarouselComponent,
    RegisterComponent,
    NavComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    HomeClientComponent,
    UserInfoComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    SharedModule,
    IvyCarouselModule,
    SweetAlert2Module.forRoot(),
    KinveyModule.init({
      appKey: 'kid_rJvDFm84u',
      appSecret: 'a3c84d5e164d416ba042ee073fa826e6',
    }),
  ],

  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
