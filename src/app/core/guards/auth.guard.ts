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
  const userToken = localStorage.getItem('userToken');

  if (!userToken) {
    console.log('No token found, redirecting to login.');
    router.navigate(['/signin']);
    return false;
  }

  if (isTokenExpired(userToken)) {
    console.log('Token expired, redirecting to login.');
    localStorage.removeItem('userToken');
    router.navigate(['/signin']);
    return false;
  }

  return true;
};
