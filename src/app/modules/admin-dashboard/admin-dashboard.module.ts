import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AgGridAngular } from "ag-grid-angular";
import { AgGridModule } from 'ag-grid-angular';
import { SharedModule } from "../../shared/shared.module";
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { ViewArticleComponent } from './view-article/view-article.component';
import { CreateArticleComponent } from './create-article/create-article.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { EditArticleComponent } from './edit-article-drawer/edit-article.component';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChip } from "@angular/material/chips";
import { AdminDashboardRoutingModule } from './admin-dashboard-routing.module';

@NgModule({
  declarations: [
    DashboardComponent,
    ViewArticleComponent,
    CreateArticleComponent,
    EditArticleComponent
  ],
  imports: [
    CommonModule,
    AdminDashboardRoutingModule,
    AgGridAngular,
    AgGridModule,
    SharedModule,
    MatSidenavModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChip
  ]
})
export class AdminDashboardModule { }
