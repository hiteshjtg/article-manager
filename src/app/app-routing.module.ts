import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignUpComponent } from './modules/auth-module/sign-up/sign-up.component';
import { SignInComponent } from './modules/auth-module/sign-in/sign-in.component';
import { HomePageComponent } from './modules/home-module/home-page/home-page.component';
import { authGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: 'signup', component: SignUpComponent },
  { path: 'signin', component: SignInComponent },

  {
    path: 'home',
    component: HomePageComponent,
    canActivate: [authGuard],
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

