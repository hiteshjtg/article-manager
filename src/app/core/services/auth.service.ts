import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { from, map, Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthserviceService {
  constructor(
    private auth: AngularFireAuth,
    private firestore: Firestore,
  ) {}

  public async registerUser(
    name: string,
    email: string,
    password: string,
  ): Promise<string> {
    try {
      const userCred = await this.auth.createUserWithEmailAndPassword(email, password);
      const user = userCred.user;

      if (!user) {
        throw new Error('User creation failed, please try again.');
      }

      try {
        const userProfile = { id: user.uid, name, email };
        const userRef = doc(this.firestore, `users/${user.uid}`);
        await setDoc(userRef, userProfile);

        return 'Registration successful! You are now logged in.';
      } catch (error) {
        throw new Error('Registration successful, but failed to save profile. Please try logging in.');
      }
    } catch (authError: any) {
      let errorMessage = 'Registration failed. Please try again.';
      if (authError.code === 'auth/email-already-in-use') {
        errorMessage = 'This email address is already in use by another account.';
      } else if (authError.code === 'auth/weak-password') {
        errorMessage = 'The password is too weak. Please choose a stronger password.';
      }
      throw new Error(errorMessage);
    }
  }

  public async loginUser(email: string, password: string): Promise<string> {
    try {
      await this.auth.signInWithEmailAndPassword(email, password);
      return 'Login Success!';
    } catch (error: any) {
      let errorMessage = 'Unable to login, something went wrong';
      if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid email or password. Please try again.';
      }
      throw new Error(errorMessage);
    }
  }

  public async logoutUser(): Promise<string> {
    try {
      await this.auth.signOut();
      return 'Logout successful.';
    } catch (error: any) {
      throw new Error('Logout failed: ' + error.message);
    }
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
