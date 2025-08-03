import { Component, Input } from '@angular/core';
import { Article } from '../../../models/articles';

@Component({
  selector: 'app-article-card',
  templateUrl: './article-card.component.html',
  styleUrl: './article-card.component.css',
})
export class ArticleCardComponent {
  @Input() article!: Article;
}
