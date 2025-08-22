import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginatorComponent } from './paginator/paginator.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SpinnerComponent } from './spinner/spinner.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ChipInputComponent } from './chip-input/chip-input.component';

import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Component, inject} from '@angular/core';
import {MatChipEditedEvent, MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import { TagButtonComponent } from './tag-button/tag-button.component';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';


@NgModule({
  declarations: [PaginatorComponent, SpinnerComponent, ChipInputComponent, TagButtonComponent, HeaderComponent, FooterComponent], //'HeaderComponent' does not appear to be an NgModule, Component, Directive, or Pipe class.(-996003)
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatFormFieldModule,
    MatChipsModule,
    MatDividerModule,
    MatButtonModule
  ],
  exports: [PaginatorComponent, SpinnerComponent, ChipInputComponent, TagButtonComponent, HeaderComponent, FooterComponent] //'HeaderComponent' does not appear to be an NgModule, Component, Directive, or Pipe class.(-996003)

})


export class SharedModule {}
