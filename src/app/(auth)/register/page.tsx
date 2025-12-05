'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useState, FormEvent } from 'react';
import { useAuth, useFirestore } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import ClientOnly from '@/components/ClientOnly';
import { signOut, type AuthError, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, writeBatch } from 'firebase/firestore';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();

    try {
      // 1. Create the user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user) {
        throw new Error("User creation failed.");
      }

      // 2. Create the user profile and tenant documents in Firestore within a batch
      const batch = writeBatch(firestore);

      const userRef = doc(firestore, 'users', user.uid);
      const tenantRef = doc(firestore, 'tenants', user.uid); // Using UID as tenantId

      const newUserProfile = {
        id: user.uid,
        tenantId: user.uid, // The user's tenant is themselves
        firstName: firstName,
        lastName: lastName,
        email: user.email,
        role: 'Owner',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const newTenant = {
        id: user.uid,
        name: `${firstName}'s Workspace`,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      batch.set(userRef, newUserProfile);
      batch.set(tenantRef, newTenant);
      
      // 3. Commit the batch
      await batch.commit();

      // 4. Sign the user out and redirect to login page
      await signOut(auth);
      router.push('/login?registered=true');

    } catch (error) {
      const authError = error as AuthError;
      console.error("Signup Error:", authError);
      if (authError.code === 'auth/email-already-in-use') {
        toast({
          variant: "destructive",
          title: "Signup Failed",
          description: "This email is already in use. Please try another.",
        });
      } else {
         toast({
          variant: "destructive",
          title: "Signup Failed",
          description: authError.message || "An unexpected error occurred.",
        });
      }
    }
  };


  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ClientOnly>
          <form onSubmit={handleSignUp} className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first-name">First name</Label>
                <Input
                  id="first-name"
                  placeholder="Max"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last-name">Last name</Label>
                <Input
                  id="last-name"
                  placeholder="Robinson"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              Create an account
            </Button>
          </form>
        </ClientOnly>
        <div className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link href="/login" className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
