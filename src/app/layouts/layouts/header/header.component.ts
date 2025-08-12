import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})

export class HeaderComponent {
  constructor(@Inject(PLATFORM_ID) private platformId: object,
  private router: Router
  ) {}

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  isUserLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
    return !!localStorage.getItem('userToken'); //true if id is available.
    }
    return false;
  }
}
