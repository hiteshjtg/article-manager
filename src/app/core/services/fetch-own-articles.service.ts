import { Injectable } from '@angular/core';
import { AuthserviceService } from './auth.service';
import { ArticlesStateService } from '../state/articles/articles-state.service';
import { map, Observable } from 'rxjs';
import { Article } from '../../models/articles';

@Injectable({
  providedIn: 'root',
})
export class FetchOwnArticlesService {
  constructor(
    private authService: AuthserviceService,
    private articlesState: ArticlesStateService,
  ) {}

  getArticles$(): Observable<Article[]> {
    return this.authService.getUserId$().pipe(
      map(userId => {
        if (!userId) return [];
        return this.articlesState.getAllArticles().filter(a => a.uid === userId);
      })
    );
  }
}
