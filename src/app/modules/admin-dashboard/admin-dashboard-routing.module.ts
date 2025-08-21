import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ViewArticleComponent } from './view-article/view-article.component';
import { EditArticleComponent } from './edit-article-drawer/edit-article.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: 'article/:id',
    component: ViewArticleComponent
  },
  {
    path: 'article/:id/edit',
    component: EditArticleComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminDashboardRoutingModule { }
