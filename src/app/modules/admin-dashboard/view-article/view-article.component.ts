import { Component, OnInit, OnDestroy } from '@angular/core';
import { Article } from '../../../models/articles';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthserviceService } from '../../../core/services/auth.service';
import { ArticlesStateService } from '../../../core/state/articles/articles-state.service';
import { Subscription, combineLatest } from 'rxjs';

@Component({
  selector: 'app-view-article',
  templateUrl: './view-article.component.html',
  styleUrls: ['./view-article.component.scss']
})
export class ViewArticleComponent implements OnInit, OnDestroy {
  docId: string | null = null;
  isLoading = true;
  article: Article | null = null;
  currentUserId: string | null = null;

  private subscription!: Subscription;

  constructor(
    private articlesState: ArticlesStateService,
    private authService: AuthserviceService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscription = combineLatest([
      this.route.paramMap,
      this.articlesState.articles$,
      this.authService.getUserId$()
    ]).subscribe(([params, articles, uid]) => {
      this.docId = params.get('id');
      this.currentUserId = uid;

      if (!this.docId) {
        this.router.navigate(['/home']);
        return;
      }

      this.article = articles.find(a => a.id === this.docId) || null;
      this.isLoading = false;

      if (!this.article) {
        console.warn('Article not found in state, redirecting...');
        this.router.navigate(['/home']);
        this.articlesState.loadArticles();
      }
    });
  }



  isOwner(): boolean {
    return !!this.article && this.currentUserId === this.article.uid;
  }

  navigateToEdit(articleId: string): void {
    this.router.navigate(['/article', articleId, 'edit']);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
