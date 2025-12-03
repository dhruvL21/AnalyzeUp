
'use client';
import {
  Auth, // Import Auth type for type hinting
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  FirebaseError,
  User,
  // Assume getAuth and app are initialized elsewhere
} from 'firebase/auth';

type AuthErrorCallback = (user: User | null, error: FirebaseError | null) => void;


/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth, callback?: AuthErrorCallback): void {
  signInAnonymously(authInstance)
  .then((userCredential) => {
    if (callback) {
      callback(userCredential.user, null);
    }
  })
  .catch((error: FirebaseError) => {
    if (callback) {
      callback(null, error);
    }
  });
}

/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string, callback?: AuthErrorCallback): void {
  createUserWithEmailAndPassword(authInstance, email, password)
    .then((userCredential) => {
        if(callback) callback(userCredential.user, null);
    })
    .catch((error: FirebaseError) => {
    if (callback) {
      callback(null, error);
    }
  });
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string, callback?: (error: FirebaseError | null) => void): void {
  signInWithEmailAndPassword(authInstance, email, password)
   .then(() => {
        if(callback) callback(null);
    })
  .catch((error: FirebaseError) => {
    if (callback) {
      callback(error);
    }
  });
}
