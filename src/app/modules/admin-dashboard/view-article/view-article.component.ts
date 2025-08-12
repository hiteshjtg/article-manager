import { Component, OnInit } from '@angular/core';
import { Article } from '../../../models/articles';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticlesService } from '../../../core/services/article.service';
import { AuthserviceService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-view-article',
  templateUrl: './view-article.component.html',
  styleUrls: ['./view-article.component.scss']
})

export class ViewArticleComponent implements OnInit {
  
  docId: string | null = null;
  isLoading = false;
  article: Article | null = null;

  constructor(
    private articlesService: ArticlesService,
    private authService: AuthserviceService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.docId = params.get('id');

      if (!this.docId) {
        this.router.navigate(['/home']);
        return;
      }

      this.loadArticle(this.docId);
    });
  }
  
  async loadArticle(id: string): Promise<void> {
    this.isLoading = true;
    try {
      this.article = await this.articlesService.getArticlesById(id);
    } catch (error) {
      console.error('Error loading article:', error);
      this.article = null;
    } finally {
      this.isLoading = false;
    }
  }


  getCurrentUserId(): string | null {
    return this.authService.getUserIdFromToken();
  }


  isOwner(): boolean {
    if (!this.article) {
      return false;
    }
    const currentUserId = this.getCurrentUserId();
    return currentUserId === this.article.uid;
  }

  navigateToEdit(articleId: String): void{
    this.router.navigate(['/article', articleId, 'edit'])
  }
}
