import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './home-page/home-page.component';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ArticleCardComponent } from './article-card/article-card.component';

@NgModule({
  declarations: [HomePageComponent, ArticleCardComponent],
  imports: [CommonModule, MatCardModule, MatButtonModule],
  exports: [HomePageComponent],
})
export class HomeModuleModule {}
