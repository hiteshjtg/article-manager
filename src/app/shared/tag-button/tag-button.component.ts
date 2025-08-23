import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tag-button',
  templateUrl: './tag-button.component.html',
  styleUrl: './tag-button.component.scss'
})

export class TagButtonComponent {
  @Input() btnName!: string;
}
