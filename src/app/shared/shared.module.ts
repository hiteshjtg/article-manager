import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginatorComponent } from './paginator/paginator.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SpinnerComponent } from './spinner/spinner.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [PaginatorComponent, SpinnerComponent],
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatProgressSpinnerModule
  ],
  exports: [PaginatorComponent, SpinnerComponent]
})

export class SharedModule {}
