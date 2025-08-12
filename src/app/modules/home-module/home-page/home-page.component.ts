import { Component, OnInit } from '@angular/core';
import { ArticlesFetchServiceService } from '../../../core/services/articles-fetch.service';
import { Article } from '../../../models/articles';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent implements OnInit {
  articles: Article[] = [];
  isLoading = true;

  constructor(private articleFetchService: ArticlesFetchServiceService) {}

  async ngOnInit(): Promise<void> {
    this.articles = await this.articleFetchService.getArticles();
    this.isLoading = false;
  }
}
