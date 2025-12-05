// IMPORTANT: This file should not be used in a production environment without proper security measures.
// It is intended for demonstration purposes in a controlled development environment.
// In a real-world application, you would secure this endpoint, for example, by requiring an admin-only API key.

import { NextRequest, NextResponse } from 'next/server';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
// This requires a service account key file. Ensure the GOOGLE_APPLICATION_CREDENTIALS
// environment variable is set to the path of your service account file.
// You can download this file from your Firebase project settings.
// See: https://firebase.google.com/docs/admin/setup
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`
  });
}

const firestore = admin.firestore();
const auth = admin.auth();

export async function POST(req: NextRequest) {
  try {
    const { email, password, firstName, lastName } = await req.json();

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Create the user in Firebase Authentication
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`,
    });

    const { uid } = userRecord;

    // 2. Use a Firestore batch to create user profile and tenant atomically
    const batch = firestore.batch();

    // Create the User document
    const userRef = firestore.collection('users').doc(uid);
    batch.set(userRef, {
      id: uid,
      tenantId: uid, // User's own UID acts as their initial tenantId
      firstName,
      lastName,
      email,
      role: 'Owner', // The first user is the owner of their tenant
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Create the Tenant document
    const tenantRef = firestore.collection('tenants').doc(uid);
    batch.set(tenantRef, {
      id: uid,
      name: `${firstName}'s Workspace`,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // 3. Commit the batch
    await batch.commit();

    return NextResponse.json({ uid }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating user:', error);
    // Provide a more user-friendly error message
    let errorMessage = 'An unexpected error occurred during signup.';
    if (error.code === 'auth/email-already-exists') {
      errorMessage = 'This email address is already in use by another account.';
    } else if (error.code === 'auth/invalid-password') {
        errorMessage = 'The password must be a string with at least six characters.';
    }
    
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
