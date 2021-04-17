import { CartComponent } from './pageUser/cart/cart.component';
import { UserInfoComponent } from './pageUser/user-info/user-info.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';
import { HomeComponent } from './client/home/home.component';
import { LoginComponent } from './login/login.component';
import { HomeClientComponent } from './client/home-client/home-client.component';
import { AuthGuard } from './service/auth.guard';
import { ErrorNetworkComponent } from './shared/error-network/error-network.component';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { RegisterComponent } from './register/register.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeClientComponent,
    children: [
      { path: '', component: HomeComponent },
      {
        path: 'category',
        loadChildren: () =>
          import('./client/category/category.module').then(
            (m) => m.CategoryModule
          ),
      },
      { path: 'user-info', component: UserInfoComponent },
      { path: 'cart', component: CartComponent },
    ],
  },

  { path: 'admin/login', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin/register', component: RegisterComponent },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
    // canActivate: [AuthGuard],
  },

  { path: 'network-err', component: ErrorNetworkComponent },
  { path: 'not-found', component: NotFoundComponent },
  {
    path: '**',
    component: NotFoundComponent,
  },
];

const routerOptions: ExtraOptions = {
  anchorScrolling: 'enabled',
  scrollPositionRestoration: 'enabled',
};

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
