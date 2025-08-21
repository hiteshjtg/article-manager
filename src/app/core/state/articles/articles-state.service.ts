import { Injectable } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { ArticlesService } from '../../services/article.service';
import { ArticlesStore } from './articles-store';
import { Article } from '../../../models/articles';
import { LoadingService } from '../../services/loading.service';

@Injectable({ providedIn: 'root' })
export class ArticlesStateService {

  constructor(
    private articlesService: ArticlesService,
    private store: ArticlesStore,
    private loadingService: LoadingService
  ) {}

  get articles$() {
    return this.store.articles$;
  }

  getAllArticles(): Article[] {
    let allArticles: Article[] = [];
    this.articles$.subscribe(articles => allArticles = articles).unsubscribe();
    return allArticles;
  }

  async loadArticles() {
    this.loadingService.show();   // ✅ start loading
    try {
      const articles = await firstValueFrom(this.articlesService.getArticles());
      this.store.setArticles(articles);
    } finally {
      this.loadingService.hide(); // ✅ stop loading (even if error happens)
    }
  }

  async addArticle(article: Article) {
    this.loadingService.show();
    try {
      await firstValueFrom(this.articlesService.addArticle(
        article.uid,
        article.title,
        article.description,
        article.shortDescription,
        article.authorName,
        article.articleImageUrl,
        article.tags,
        article.lastModifiedDate.toString()
      ));
      await this.loadArticles();
    } finally {
      this.loadingService.hide();
    }
  }

  async updateArticle(id: string, updatedData: Partial<Article>) {
    this.loadingService.show();
    try {
      await firstValueFrom(this.articlesService.updateArticle(id, updatedData));
      await this.loadArticles();
    } finally {
      this.loadingService.hide();
    }
  }

  async deleteArticle(id: string) {
    this.loadingService.show();
    try {
      await firstValueFrom(this.articlesService.deleteArticle(id));
      await this.loadArticles();
    } finally {
      this.loadingService.hide();
    }
  }

  async getArticleById(id: string): Promise<Article> {
    this.loadingService.show();
    try {
      return await firstValueFrom(this.articlesService.getArticlesById(id));
    } finally {
      this.loadingService.hide();
    }
  }

  // ----------------------
  // Reactive Versions
  // ----------------------

  loadArticlesReactive(): Observable<void> {
    return new Observable(observer => {
      this.loadingService.show();
      this.articlesService.getArticles().subscribe({
        next: (articles) => {
          this.store.setArticles(articles);
          observer.next();
          observer.complete();
          this.loadingService.hide();
        },
        error: (error) => {
          this.loadingService.hide();
          observer.error(error);
        }
      });
    });
  }

  addArticleReactive(article: Article): Observable<void> {
    return new Observable(observer => {
      this.loadingService.show();
      this.articlesService.addArticle(
        article.uid,
        article.title,
        article.description,
        article.shortDescription,
        article.authorName,
        article.articleImageUrl,
        article.tags,
        article.lastModifiedDate.toString()
      ).subscribe({
        next: () => {
          this.loadArticlesReactive().subscribe({
            next: () => {
              observer.next();
              observer.complete();
              this.loadingService.hide();
            },
            error: (error) => {
              this.loadingService.hide();
              observer.error(error);
            }
          });
        },
        error: (error) => {
          this.loadingService.hide();
          observer.error(error);
        }
      });
    });
  }

  updateArticleReactive(id: string, updatedData: Partial<Article>): Observable<void> {
    return new Observable(observer => {
      this.loadingService.show();
      this.articlesService.updateArticle(id, updatedData).subscribe({
        next: () => {
          this.loadArticlesReactive().subscribe({
            next: () => {
              observer.next();
              observer.complete();
              this.loadingService.hide();
            },
            error: (error) => {
              this.loadingService.hide();
              observer.error(error);
            }
          });
        },
        error: (error) => {
          this.loadingService.hide();
          observer.error(error);
        }
      });
    });
  }

  deleteArticleReactive(id: string): Observable<void> {
    return new Observable(observer => {
      this.loadingService.show();
      this.articlesService.deleteArticle(id).subscribe({
        next: () => {
          this.loadArticlesReactive().subscribe({
            next: () => {
              observer.next();
              observer.complete();
              this.loadingService.hide();
            },
            error: (error) => {
              this.loadingService.hide();
              observer.error(error);
            }
          });
        },
        error: (error) => {
          this.loadingService.hide();
          observer.error(error);
        }
      });
    });
  }

  getArticleByIdReactive(id: string): Observable<Article> {
    this.loadingService.show();
    return new Observable(observer => {
      this.articlesService.getArticlesById(id).subscribe({
        next: (article) => {
          observer.next(article);
          observer.complete();
          this.loadingService.hide();
        },
        error: (error) => {
          this.loadingService.hide();
          observer.error(error);
        }
      });
    });
  }
}

