import { Component, OnInit } from '@angular/core';
import { Article } from '../../../models/articles';
import { ArticlesStateService } from '../../../core/state/articles/articles-state.service';
import { Subscription } from 'rxjs';
import { APP_CONSTANTS } from '../../../constants';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})

export class HomePageComponent implements OnInit {
  articles: Article[] = [];
  paginatedArticles: Article[] = [];
  isLoading = true;

  currentPage = 0;
  itemsPerPage = APP_CONSTANTS.itemsPerPage; //is the correct way to use, instead directly use variable which is exported
  totalItems = 0;

  private subscription!: Subscription;

  constructor(private articlesState: ArticlesStateService) {}

  ngOnInit(): void {
    this.subscription = this.articlesState.articles$.subscribe({
      next: (articles) => {
        this.articles = articles;
        this.totalItems = articles.length;
        this.updatePaginatedArticles();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching articles:', err);
        this.isLoading = false;
      },
    });

    this.articlesState.loadArticles();
  }

  onPageChange(event: { pageIndex: number; pageSize: number }): void {
    this.currentPage = event.pageIndex;
    this.itemsPerPage = event.pageSize;
    this.updatePaginatedArticles();
  }

  private updatePaginatedArticles(): void {
    const start = this.currentPage * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedArticles = this.articles.slice(start, end);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
