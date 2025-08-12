import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './modules/home-module/home-page/home-page.component';
import { authGuard } from './core/guards/auth.guard';
import { DashboardComponent } from './modules/admin-dashboard/dashboard/dashboard.component';
import { EditArticleComponent } from './modules/admin-dashboard/edit-article-drawer/edit-article.component';
import { ViewArticleComponent } from './modules/admin-dashboard/view-article/view-article.component';
import { guestGuard } from './core/guards/guest.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth-module/auth-module.module').then(m => m.AuthModuleModule),
    canActivate: [guestGuard]
  },
  {
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [authGuard]
  },
  {
    path: 'article/:id', 
    component: ViewArticleComponent, 
    canActivate: [authGuard]
  },
  {
    path: 'article/:id/edit',
    component: EditArticleComponent,
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
