import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Article } from '../../../models/articles';
import { ArticlesStateService } from '../../../core/state/articles/articles-state.service';
import { Subscription, from } from 'rxjs';

declare var Quill: any;

@Component({
  selector: 'app-edit-article',
  templateUrl: './edit-article.component.html',
  styleUrls: ['./edit-article.component.scss']
})
export class EditArticleComponent implements OnInit, AfterViewInit, OnDestroy {

  editForm: FormGroup;
  isSubmitting = false;
  isLoading = true;
  articleToEdit: Article | null = null;
  articleId: string | null = null;
  quillEditor: any;

  private subscription: Subscription | null = null;

  constructor(
    private fb: FormBuilder,
    private articlesState: ArticlesStateService,
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

  ngOnInit() {
    this.articleId = this.route.snapshot.paramMap.get('id');

    if (!this.articleId) {
      console.error('No article ID provided');
      this.router.navigate(['/dashboard']);
      return;
    }

    this.isLoading = true;

   
    this.subscription = from(this.articlesState.getArticleById(this.articleId)).subscribe((article: Article | undefined) => {
      this.articleToEdit = article || null;
      this.isLoading = false;

      if (this.articleToEdit) {
        this.prefillForm();
        setTimeout(() => this.initializeQuillEditor(), 100);
      } else {
        console.warn('Article not found in state yet');
        this.articlesState.loadArticles();
      }
    });
  }

  private prefillForm() {
    if (!this.articleToEdit) return;

    this.editForm.patchValue({
      title: this.articleToEdit.title || '',
      description: this.articleToEdit.description || '',
      shortDescription: this.articleToEdit.shortDescription || '',
      authorName: this.articleToEdit.authorName || '',
      articleImageUrl: this.articleToEdit.articleImageUrl || '',
      tags: this.articleToEdit.tags || [],
    });
  }

  ngAfterViewInit(): void {
    if (!this.quillEditor) {
      this.initializeQuillEditor();
    }
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

    const initialContent = this.editForm.get('description')?.value || '';
    this.quillEditor.root.innerHTML = initialContent;

    this.quillEditor.on('text-change', () => {
      const html = this.quillEditor.root.innerHTML;
      this.editForm.get('description')?.setValue(html);
      this.editForm.get('description')?.markAsTouched();
    });
  }
  

  async onSubmit() {
    if (!this.articleToEdit || this.editForm.invalid) return;

    this.isSubmitting = true;

    const formData = this.editForm.value;
    const updatedData: Partial<Article> = {
      title: formData.title,
      description: formData.description,
      shortDescription: formData.shortDescription,
      authorName: formData.authorName,
      articleImageUrl: formData.articleImageUrl || '',
      tags: formData.tags || [],
      lastModifiedDate: new Date(),
    };

    try {
      this.articlesState.updateArticle(this.articleToEdit.id, updatedData);
      this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error('Error updating article:', error);
      alert('Failed to update article. Please try again.');
    } finally {
      this.isSubmitting = false;
    }
  }

  onCancel() {
    this.router.navigate(['/dashboard']);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  get title() { return this.editForm.get('title'); }
  get description() { return this.editForm.get('description'); }
  get shortDescription() { return this.editForm.get('shortDescription'); }
  get authorName() { return this.editForm.get('authorName'); }
  get articleImageUrl() { return this.editForm.get('articleImageUrl'); }
  get tags() { return this.editForm.get('tags'); }
}
