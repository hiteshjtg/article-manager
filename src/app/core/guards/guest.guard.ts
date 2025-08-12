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
    return true;
  }
};



export const guestGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const userToken = localStorage.getItem('userToken');

  const isLoggedIn = userToken && !isTokenExpired(userToken);

  if (isLoggedIn) {
    router.navigate(['/home']);
    return false;
  }

  return true;
};
