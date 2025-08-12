import { Component, OnInit } from '@angular/core';
import { Article } from '../../../models/articles';
import { ArticlesService } from '../../../core/services/article.service';

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
  itemsPerPage = 5;
  totalItems = 0;

  constructor(private articlesService: ArticlesService) {}

  async ngOnInit(): Promise<void> {
    try {
      this.articles = await this.articlesService.getArticles();
      this.totalItems = this.articles.length;
      this.updatePaginatedArticles();
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      this.isLoading = false;
    }
  }

  onPageChange(event: { pageIndex: number, pageSize: number }): void {
    this.currentPage = event.pageIndex;
    this.itemsPerPage = event.pageSize;
    this.updatePaginatedArticles();
  }


  private updatePaginatedArticles(): void {
    const start = this.currentPage * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedArticles = this.articles.slice(start, end);
  }
}
