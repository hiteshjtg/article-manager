import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { from, map, Observable, of, switchMap, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthserviceService {
  constructor(
    private auth: AngularFireAuth,
    private firestore: Firestore,
  ) {}

  public registerUser(name: string, email: string, password: string): Observable<string> {
    return from(this.auth.createUserWithEmailAndPassword(email, password)).pipe(
      switchMap(userCred => {
        const user = userCred.user;
        if (!user) {
          return throwError(() => new Error('User creation failed, please try again.'));
        }

        const userProfile = { id: user.uid, name, email };
        const userRef = doc(this.firestore, `users/${user.uid}`);

        return from(setDoc(userRef, userProfile)).pipe(
          map(() => 'Registration successful! You are now logged in.'),
          catchError(() =>
            throwError(() =>
              new Error('Registration successful, but failed to save profile. Please try logging in.')
            )
          )
        );
      }),
      catchError((authError: any) => {
        let errorMessage = 'Registration failed. Please try again.';
        if (authError.code === 'auth/email-already-in-use') {
          errorMessage = 'This email address is already in use by another account.';
        } else if (authError.code === 'auth/weak-password') {
          errorMessage = 'The password is too weak. Please choose a stronger password.';
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  public loginUser(email: string, password: string): Observable<string> {
    return from(this.auth.signInWithEmailAndPassword(email, password)).pipe(
      map(() => 'Login Success!'),
      catchError((error: any) => {
        let errorMessage = 'Unable to login, something went wrong';
        if (error.code === 'auth/invalid-credential') {
          errorMessage = 'Invalid email or password. Please try again.';
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  public logoutUser(): Observable<string> {
    return from(this.auth.signOut()).pipe(
      map(() => 'Logout successful.'),
      catchError((error: any) =>
        throwError(() => new Error('Logout failed: ' + error.message))
      )
    );
  }

  public getUserId$(): Observable<string | null> {
    return this.auth.authState.pipe(map(user => (user ? user.uid : null)));
  }

  public getUserToken$(): Observable<string | null> {
    return this.auth.authState.pipe(
      switchMap(user => (user ? from(user.getIdToken()) : of(null)))
    );
  }
}
