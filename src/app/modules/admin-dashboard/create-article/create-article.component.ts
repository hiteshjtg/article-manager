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
  currentTags: string[] = [];
  isSubmitting = false;

  constructor(
    private authService: AuthserviceService,
    private articlesState: ArticlesStateService,
    private router: Router
  ) {}

  ngOnInit() {
    this.article.tags = this.currentTags;
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


  addTag(tagInput: HTMLInputElement) {
    const tag = tagInput.value.trim();
    if (tag && !this.currentTags.includes(tag)) {
      this.currentTags.push(tag);
    }
    tagInput.value = '';
    this.article.tags = this.currentTags;
  }

  removeTag(tag: string) {
    this.currentTags = this.currentTags.filter(t => t !== tag);
    this.article.tags = this.currentTags;
  }

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
        tags: this.currentTags,
        lastModifiedDate: new Date()
      };

      await this.articlesState.addArticle(newArticle);
      await this.articlesState.loadArticles();

      console.log('Article added successfully');
      form.resetForm();
      this.currentTags = [];

      if (this.quillEditor) {
        try { this.quillEditor.setContents([]); } catch { this.quillEditor.setText(''); }
      }

      if (this.closeDrawerFunction) {
        try { this.closeDrawerFunction(); } catch {}
      }

    } catch (error) {
      console.error('Error adding article:', error);
    } finally {
      this.isSubmitting = false;
    }
  }
}
