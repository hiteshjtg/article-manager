import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthserviceService } from '../../core/services/auth.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  isUserLoggedIn$: Observable<boolean> = of(false);

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private router: Router,
    private authService: AuthserviceService
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.isUserLoggedIn$ = this.authService.getUserId$().pipe(
        map((uid: string | null) => !!uid)
      );
    }
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

  logout(): void {
    this.authService.logoutUser().subscribe({
      next: (msg) => {
        console.log(msg);
        this.router.navigate(['/signin']);
      },
      error: (err) => {
        console.error(err.message);
      }
    });
  }

}
