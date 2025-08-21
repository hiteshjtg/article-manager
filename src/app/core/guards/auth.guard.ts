import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';

export const authGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const auth = inject(AngularFireAuth);

  const user = await auth.currentUser;

  if (!user) {
    router.navigate(['/signin']);
    return false;
  }
  
  return true;
};
