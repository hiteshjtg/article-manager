import { Component, Input } from '@angular/core';
import { Article } from '../../../models/articles';
import { Router } from '@angular/router';

@Component({
  selector: 'app-article-card',
  templateUrl: './article-card.component.html',
  styleUrl: './article-card.component.scss',
})

export class ArticleCardComponent {
  constructor(
    private router: Router
  ){}

  @Input() article!: Article;

  navigateToView(docId: string){
    this.router.navigate([`/article/${docId}`])
  }
}
