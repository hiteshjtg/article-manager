import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthserviceService } from '../../../core/services/auth.service';
import { ArticlesStateService } from '../../../core/state/articles/articles-state.service';
import { Article } from '../../../models/articles';

declare var Quill: any;

@Component({
  selector: 'app-create-article',
  templateUrl: './create-article.component.html',
  styleUrl: './create-article.component.scss'
})
export class CreateArticleComponent implements AfterViewInit, OnInit {

  @Input() closeDrawerFunction!: () => void;

  article: Partial<Article> = {
    title: '',
    description: '',
    shortDescription: '',
    authorName: '',
    articleImageUrl: '',
    tags: [],
  };

  quillEditor: any;
  isSubmitting = false;

  constructor(
    private authService: AuthserviceService,
    private articlesState: ArticlesStateService,
    private router: Router
  ) {}

  ngOnInit() {
    // Initialize tags as empty array
    this.article.tags = [];
  }

  ngAfterViewInit(): void {
    this.initializeQuillEditor();
  }

  private initializeQuillEditor(): void {
    const editorEl = document.getElementById('quill-editor');
    if (!editorEl || typeof Quill === 'undefined') {
      console.error('Quill editor element not found or Quill library not loaded');
      return;
    }

    this.quillEditor = new Quill(editorEl, {
      theme: 'snow',
      placeholder: 'Enter detailed article description...',
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'header': [1, 2, 3, false] }],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          ['blockquote', 'code-block'],
          ['link', 'image'],
          ['clean']
        ]
      }
    });

    this.quillEditor.on('text-change', () => {
      this.article.description = this.quillEditor.root.innerHTML;
    });
  }

  // Handle tags update from chip component
  onTagsChange(newTags: string[]) {
    this.article.tags = newTags;
  }

  // Remove the old addTag and removeTag methods as they're now handled by the chip component

  async submitForm(form: NgForm) {
    if (form.invalid) return;

    try {
      this.isSubmitting = true;

      const uid = await firstValueFrom(this.authService.getUserId$());
      if (!uid) {
        console.error('User not logged in');
        this.isSubmitting = false;
        return;
      }

      const newArticle: Article = {
        id: '',
        uid,
        title: this.article.title || '',
        description: this.article.description || '',
        shortDescription: this.article.shortDescription || '',
        authorName: this.article.authorName || '',
        articleImageUrl: this.article.articleImageUrl || '',
        tags: this.article.tags || [],
        lastModifiedDate: new Date()
      };

      await this.articlesState.addArticle(newArticle);
      await this.articlesState.loadArticles();

      console.log('Article added successfully');
      form.resetForm();
      
      // Reset article object including tags
      this.article = {
        title: '',
        description: '',
        shortDescription: '',
        authorName: '',
        articleImageUrl: '',
        tags: [],
      };

      if (this.quillEditor) {
        try { 
          this.quillEditor.setContents([]); 
        } catch { 
          this.quillEditor.setText(''); 
        }
      }

      if (this.closeDrawerFunction) {
        try { 
          this.closeDrawerFunction(); 
        } catch {}
      }

    } catch (error) {
      console.error('Error adding article:', error);
    } finally {
      this.isSubmitting = false;
    }
  }
}
