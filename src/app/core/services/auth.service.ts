import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})

export class AuthserviceService {
  constructor(
    private auth: AngularFireAuth,
    private firestore: Firestore,
  ) {}

  public registerUser(
    name: string,
    email: string,
    password: string,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      this.auth
        .createUserWithEmailAndPassword(email, password)
        .then(async (userCred) => {
          const user = userCred.user;

          if (!user) {
            reject('User creation failed, please try again.');
            return;
          }

          try {
            const userProfile = { id: user.uid, name, email };
            const userRef = doc(this.firestore, `users/${user.uid}`);
            await setDoc(userRef, userProfile);

            const token = await user.getIdToken();
            localStorage.setItem('userToken', token);

            resolve('Registration successful! You are now logged in.');
          } catch (error) {
            reject(
              'Registration successful, but failed to save profile or start a session. Please try logging in.',
            );
          }
        })
        .catch((authError) => {
          let errorMessage = 'Registration failed. Please try again.';
          if (authError.code === 'auth/email-already-in-use') {
            errorMessage =
              'This email address is already in use by another account.';
          } else if (authError.code === 'auth/weak-password') {
            errorMessage =
              'The password is too weak. Please choose a stronger password.';
          }
          reject(errorMessage);
        });
    });
  }

  public loginUser(email: string, password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.auth
        .signInWithEmailAndPassword(email, password)
        .then(async (userCred) => {
          const user = userCred.user;

          if (!user) {
            reject('User object not available after sign-in.');
            return;
          }

          try {
            const token = await user.getIdToken();
            localStorage.setItem('userToken', token);
            resolve('Login Success!');
          } catch (error) {
            reject(
              'Successfully logged in, but failed to retrieve session token.',
            );
          }
        })
        .catch((error) => {
          let errorMessage = 'Unable to login, something went wrong';
          if (error.code === 'auth/invalid-credential') {
            errorMessage = 'Invalid email or password. Please try again.';
          }
          reject(errorMessage);
        });
    });
  }

  public getUserIdFromToken(): string | null {
    const token = localStorage.getItem('userToken');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.user_id || payload.userId || payload.uid || null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
}
