import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { ModuleRegistry } from 'ag-grid-community';
import { AllCommunityModule } from 'ag-grid-community';
import { Article } from '../../../models/articles';
import { FetchOwnArticlesService } from '../../../core/services/fetch-own-articles.service';
import { Router } from '@angular/router';
import { ArticlesService } from '../../../core/services/article.service';
import { firstValueFrom } from 'rxjs';


ModuleRegistry.registerModules([AllCommunityModule]);


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class DashboardComponent implements OnInit {
  articles: Article[] = [];
  isLoading: boolean = false;
  isDrawerOpen: boolean = false;

  openDrawer() {
    this.isDrawerOpen = true;
  }

  closeDrawer = () => {
    this.isDrawerOpen = false;
  };


  constructor(
    private articlesFetchService: FetchOwnArticlesService,
    private articlesService: ArticlesService,
    private router: Router,
  ) {}


  async ngOnInit(): Promise<void> {
      this.articles = await firstValueFrom(this.articlesFetchService.getArticles$());
  }

  navigateToEdit(articleId: string) {
    this.router.navigate(['/article', articleId, 'edit']);
  }

  colDefs: ColDef[] = [
    { field: 'title' },
    { field: 'lastModifiedDate', headerName: 'Last Modified' },
    { field: 'description' },
    { field: 'authorName', headerName: 'Author' },
    {
      headerName: 'View',
      cellRenderer: (params: any) => {
        const button = document.createElement('button');
        button.className = 'grid-action-btn view-btn';
        button.title = 'View';
        button.setAttribute('aria-label', 'view article');

        button.innerHTML = '<span class="material-symbols-outlined">visibility</span>';
        button.style.cursor = 'pointer';

        button.addEventListener('click', () => {
          this.router.navigate(['/article', params.data.id]);
        });

        return button;
      }
    },
    {
      headerName: 'Delete',
      cellRenderer: (params: any) => {
        const button = document.createElement('button');
        button.className = 'grid-action-btn delete-btn';
        button.title = 'Delete';
        button.setAttribute('aria-label', 'delete article');
        button.innerHTML = '<span class="material-symbols-outlined">delete</span>';
        button.style.cursor = 'pointer';

        button.addEventListener('click', async () => {
          const confirmed = confirm('Are you sure?');
          if (!confirmed) return;
          try {
            await this.articlesService.deleteArticle(params.data.id);
            this.articles = this.articles.filter(article => article.id !== params.data.id);
            this.router.navigate(['/dashboard']);
          } catch (error) {
            console.error('Failed to delete:', error);
          }
        });

        return button;
      }
    },
    {
      headerName: 'Edit',
      cellRenderer: (params: any) => {
        const button = document.createElement('button');
        button.className = 'grid-action-btn edit-btn';
        button.title = 'Edit';
        button.setAttribute('aria-label', 'edit article');
        button.innerHTML = '<span class="material-symbols-outlined">edit</span>';
        button.style.cursor = 'pointer';

        button.addEventListener('click', () => {
          this.navigateToEdit(params.data.id);
        });

        return button;
      }
    }
  ];
}
