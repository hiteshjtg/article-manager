import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Article } from '../../../models/articles';
import { ArticlesService } from '../../../core/services/article.service';
import { FetchOwnArticlesService } from '../../../core/services/fetch-own-articles.service';

@Component({
  selector: 'app-edit-article',
  templateUrl: './edit-article.component.html',
  styleUrls: ['./edit-article.component.scss']
})
export class EditArticleComponent implements OnInit {
  editForm: FormGroup;
  isSubmitting = false;
  isLoading = true;
  articleToEdit: Article | null = null;
  articleId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private articlesService: ArticlesService,
    private fetchArticlesService: FetchOwnArticlesService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.editForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      shortDescription: ['', [Validators.required, Validators.minLength(5)]],
      authorName: ['', [Validators.required]],
      articleImageUrl: [''],
      tags: [''],
    });
  }

  async ngOnInit() {
    this.articleId = this.route.snapshot.paramMap.get('id');
    
    if (this.articleId) {
      await this.loadArticle();
    } else {
      console.error('No article ID provided');
      this.router.navigate(['/dashboard']);
    }
  }

  async loadArticle() {
    try {
      this.isLoading = true;
      const articles = await this.fetchArticlesService.getArticles();
      this.articleToEdit = articles.find(article => article.id === this.articleId) || null;
      
      if (this.articleToEdit) {
        this.prefillForm();
      } else {
        console.error('Article not found');
        this.router.navigate(['/dashboard']);
      }
    } catch (error) {
      console.error('Error loading article:', error);
      this.router.navigate(['/dashboard']);
    } finally {
      this.isLoading = false;
    }
  }

  private prefillForm() {
    if (this.articleToEdit) {
      this.editForm.patchValue({
        title: this.articleToEdit.title || '',
        description: this.articleToEdit.description || '',
        shortDescription: this.articleToEdit.shortDescription || '',
        authorName: this.articleToEdit.authorName || '',
        articleImageUrl: this.articleToEdit.articleImageUrl || '',
        tags: this.articleToEdit.tags?.join(', ') || '',
      });
    }
  }

  async onSubmit() {
    if (this.editForm.valid && this.articleToEdit) {
      this.isSubmitting = true;
      try {
        const formData = this.editForm.value;
        
        const updatedData = {
          title: formData.title,
          description: formData.description,
          shortDescription: formData.shortDescription,
          authorName: formData.authorName,
          articleImageUrl: formData.articleImageUrl || '',
          tags: formData.tags ? formData.tags.split(',').map((tag: string) => tag.trim()) : [],
          lastModifiedDate: new Date().toISOString(),
        };

        await this.articlesService.updateArticle(this.articleToEdit.id, updatedData);
        
        this.router.navigate(['/dashboard']);
        
      } catch (error) {
        console.error('Error updating article:', error);
        alert('Failed to update article. Please try again.');
      } finally {
        this.isSubmitting = false;
      }
    }
  }

  onCancel() {
    this.router.navigate(['/dashboard']);
  }


  get title() { return this.editForm.get('title'); }
  get description() { return this.editForm.get('description'); }
  get shortDescription() { return this.editForm.get('shortDescription'); }
  get authorName() { return this.editForm.get('authorName'); }
  get articleImageUrl() { return this.editForm.get('articleImageUrl'); }
  get tags() { return this.editForm.get('tags'); }
}
