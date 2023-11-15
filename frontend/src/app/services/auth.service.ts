import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { User } from '../modules/authentication/shared/models/user.model';
import { GoogleAuthProvider } from 'firebase/auth';
import { UtilsService } from './utils.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: User = {};

  constructor(
    public afAuth: AngularFireAuth,
    public afs: AngularFirestore,
    public ngZone: NgZone,
    public router: Router,
    private utilsService: UtilsService
  ) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }

  getToken(): Observable<string | null> {
    return this.afAuth.idToken;
  }

  getUser() {
    return this.afAuth.authState;
  }

  async signIn(email: string, password: string): Promise<void> {
    try {
      const result = await this.afAuth.signInWithEmailAndPassword(
        email,
        password
      );
      this.setUserData(result.user);
      this.afAuth.authState.subscribe((user) => {
        if (user) {
          if (user.emailVerified) {
            this.router.navigateByUrl('/app');
            return;
          }
          this.utilsService.showInfoMessage(
            'Um email foi enviado para seu inbox\nConfirme seu email para fazer login'
          );
        }
      });
    } catch (error: any) {
      this.utilsService.showErrorMessage(
        this.utilsService.getErrorMessage(error.code)
      );
    }
  }

  async signUp(email: string, password: string) {
    try {
      const result = await this.afAuth.createUserWithEmailAndPassword(
        email,
        password
      );
      this.utilsService.showSuccessMessage('Usuário cadastrado com sucesso');
      this.sendVerificationMail();
      this.setUserData(result.user);
    } catch (error: any) {
      this.utilsService.showErrorMessage(
        this.utilsService.getErrorMessage(error.code)
      );
    }
  }

  async sendVerificationMail(): Promise<void> {
    return this.afAuth.currentUser
      .then((u: any) => u.sendEmailVerification())
      .then(() => {
        this.utilsService.showInfoMessage(
          'Um email foi enviado para seu inbox\nConfirme seu email para fazer login'
        );
      });
  }

  async forgotPassword(passwordResetEmail: string) {
    try {
      await this.afAuth.sendPasswordResetEmail(passwordResetEmail);
      this.utilsService.showSuccessMessage(
        'Email de redefinição de senha enviado\nVerifique seu email'
      );
    } catch (error) {
      this.utilsService.showErrorMessage('Email inválido ou não cadastrado');
    }
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null && user.emailVerified !== false ? true : false;
  }

  async googleAuth() {
    await this.authLogin(new GoogleAuthProvider());
    this.router.navigateByUrl('/app');
  }

  async authLogin(provider: any) {
    try {
      const result = await this.afAuth.signInWithPopup(provider);
      this.setUserData(result.user);
      this.router.navigateByUrl('/app');
    } catch (error) {
      this.utilsService.showErrorMessage(error as string);
    }
  }

  setUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );

    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };

    return userRef.set(userData, {
      merge: true,
    });
  }

  async signOut() {
    await this.afAuth.signOut();
    localStorage.removeItem('user');
    this.router.navigate(['auth', 'login']);
  }
}
