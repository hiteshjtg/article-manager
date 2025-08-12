import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ArticlesService } from '../../../core/services/article.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-article',
  templateUrl: './create-article.component.html',
  styleUrl: './create-article.component.scss'
})


export class CreateArticleComponent {

  @Input() closeDrawerFunction !: () => void

  article = {
    title: '',
    description: '',
    shortDescription: '',
    authorName: '',
    articleImageUrl: '',
    tags: [] as string[],
  };

  constructor(
    private articleService: ArticlesService,
    private router: Router,
  ) {}

  private getUserIdFromToken(): string | null {
    const token = localStorage.getItem('userToken');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.user_id || payload.userId || payload.uid || null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }



  async submitForm(form: NgForm) {
    if (form.invalid) return;

    const uid = this.getUserIdFromToken();
    
    if (!uid) {
      console.error('User ID not found in token');
      return;
    }

    try {
      await this.articleService.addArticle(
        uid,
        this.article.title,
        this.article.description,
        this.article.shortDescription,
        this.article.authorName,
        this.article.articleImageUrl,
        this.article.tags,
        new Date().toISOString()
      );
      console.log('Article added successfully');
      form.resetForm();


      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => { //FR
        this.router.navigate(['/dashboard']);
      });

    } catch (error) {
      console.error('Error adding article:', error);
    }
  }




  onTagsInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.article.tags = value
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
  }

}
