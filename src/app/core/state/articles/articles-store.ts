import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Article } from '../../../models/articles';

@Injectable({ providedIn: 'root' })

export class ArticlesStore {

  private articlesSubject = new BehaviorSubject<Article[]>([]);
  articles$ = this.articlesSubject.asObservable();

  setArticles(articles: Article[]) {
    this.articlesSubject.next(articles);
  }

  getArticlesSnapshot(): Article[] {
    return this.articlesSubject.getValue();
  }

  clearArticles() {
    this.articlesSubject.next([]);
  }
}
