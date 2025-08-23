import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { firstValueFrom, map } from 'rxjs';
import { AuthserviceService } from '../services/auth.service';

export const guestGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthserviceService);

  try {
    const userId = await firstValueFrom(authService.getUserId$().pipe(
      map(id => id)
    ));

    if (userId) {
      router.navigate(['/home']);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error checking guest access:', error);
    return true;
  }
};
