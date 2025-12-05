
import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, WriteBatch } from 'firebase-admin/firestore';

// Ensure the service account key is correctly parsed
const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string
);

// Initialize Firebase Admin SDK if not already initialized
if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
    projectId: serviceAccount.project_id,
  });
}

export async function POST(req: NextRequest) {
  try {
    const { email, password, firstName, lastName } = await req.json();

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
     if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const auth = getAuth();
    const firestore = getFirestore();

    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`,
    });

    const uid = userRecord.uid;
    const tenantId = uid; // For this app, each user is their own tenant

    // Use a batch write to create user and tenant documents atomically
    const batch: WriteBatch = firestore.batch();

    // CORRECTED: User document is now created within the tenant's 'users' subcollection
    const userRef = firestore.collection('tenants').doc(tenantId).collection('users').doc(uid);
    batch.set(userRef, {
      id: uid,
      tenantId: tenantId,
      email,
      firstName,
      lastName,
      role: 'Owner', // Default role for a new user
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const tenantRef = firestore.collection('tenants').doc(tenantId);
    batch.set(tenantRef, {
      id: tenantId,
      name: `${firstName}'s Workspace`,
      domain: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Add placeholder documents to create the subcollections
    const productCollectionRef = firestore.collection('tenants').doc(tenantId).collection('products');
    batch.set(productCollectionRef.doc(), {});
    
    const transactionCollectionRef = firestore.collection('tenants').doc(tenantId).collection('inventoryTransactions');
    batch.set(transactionCollectionRef.doc(), {});

    const suppliersCollectionRef = firestore.collection('tenants').doc(tenantId).collection('suppliers');
    batch.set(suppliersCollectionRef.doc(), {});

    const purchaseOrdersCollectionRef = firestore.collection('tenants').doc(tenantId).collection('purchaseOrders');
    batch.set(purchaseOrdersCollectionRef.doc(), {});


    await batch.commit();

    return NextResponse.json({ uid: userRecord.uid }, { status: 201 });

  } catch (error: any) {
    console.error('User creation failed:', error);
    let errorMessage = 'An unexpected error occurred.';
    if (error.code === 'auth/email-already-exists') {
        errorMessage = 'An account with this email address already exists.';
    } else if (error.code === 'auth/invalid-password') {
        errorMessage = 'Password must be at least 6 characters long.';
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
