import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HomeModuleModule } from './modules/home-module/home-module.module';
import { LayoutsModule } from './layouts/layouts/layouts.module';
import { AuthModuleModule } from './modules/auth-module/auth-module.module';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { FireModuleModule } from './shared/fire-module/fire-module.module';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { AdminDashboardModule } from './modules/admin-dashboard/admin-dashboard.module';
import { AgGridModule } from 'ag-grid-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from "./shared/shared.module";


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HomeModuleModule,
    LayoutsModule,
    AuthModuleModule,
    FireModuleModule,
    AdminDashboardModule,
    AgGridModule,
    BrowserAnimationsModule,
    SharedModule
],
  providers: [
    provideClientHydration(),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
