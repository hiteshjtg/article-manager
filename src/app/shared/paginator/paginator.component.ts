import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent {

  @Input() totalItems = 0;
  @Input() currentPage = 0;

  @Output() pageChange = new EventEmitter<{ pageIndex: number; pageSize: number }>();

  readonly pageSizeOptions: number[] = [5, 10, 25, 50];
  readonly defaultPageSize = this.pageSizeOptions[0];

  onPageChange(event: PageEvent): void {
    this.pageChange.emit({
      pageIndex: event.pageIndex,
      pageSize: event.pageSize
    });
  }
}
