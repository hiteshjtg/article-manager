import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './modules/home-module/home-page/home-page.component';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';


const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth-module/auth-module.module').then(m => m.AuthModuleModule),
    canActivate: [guestGuard]
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./modules/admin-dashboard/admin-dashboard.module').then(m => m.AdminDashboardModule),
    canActivate: [authGuard]
  },
  {
    path: 'home',
    component: HomePageComponent,
    canActivate: [authGuard],
  },
  { 
    path: '', 
    redirectTo: '/home', 
    pathMatch: 'full' 
  },
  {
    path: 'signin',
    redirectTo: '/auth/signin'
  },
  {
    path: 'signup',
    redirectTo: '/auth/signup'
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
