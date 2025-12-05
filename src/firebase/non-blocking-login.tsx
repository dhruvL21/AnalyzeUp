
'use client';
import {
  Auth, // Import Auth type for type hinting
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User,
  AuthError,
  // Assume getAuth and app are initialized elsewhere
} from 'firebase/auth';

type AuthCallback = (user: User | null, error?: AuthError) => void;

/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth, callback: AuthCallback): void {
  signInAnonymously(authInstance)
    .then(userCredential => callback(userCredential.user))
    .catch(error => callback(null, error));
}

/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string, callback: AuthCallback): void {
  createUserWithEmailAndPassword(authInstance, email, password)
    .then(userCredential => callback(userCredential.user))
    .catch(error => callback(null, error));
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string, callback: AuthCallback): void {
  signInWithEmailAndPassword(authInstance, email, password)
    .then(userCredential => callback(userCredential.user))
    .catch(error => callback(null, error));
}
