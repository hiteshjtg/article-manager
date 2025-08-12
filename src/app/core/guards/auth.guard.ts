import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';


const isTokenExpired = (token: string): boolean => {
  try {
    const payloadBase64 = token.split('.')[1];

    if (!payloadBase64) {
      return true;
    }

    const decodedPayload = JSON.parse(atob(payloadBase64));

    const expirationTimeInSeconds = decodedPayload.exp;
    if (!expirationTimeInSeconds) {
      return true;
    }

    return expirationTimeInSeconds * 1000 < Date.now();
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
};


export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
 
  if (typeof window === 'undefined') { //for fixing local storage not defined error during SSR
    router.navigate(['/signin']);
    return false;
  }

  const userToken = localStorage.getItem('userToken');

  if (!userToken) {
    router.navigate(['/signin']);
    return false;
  }

  if (isTokenExpired(userToken)) {
    localStorage.removeItem('userToken');
    router.navigate(['/signin']);
    return false;
  }

  return true;
};
