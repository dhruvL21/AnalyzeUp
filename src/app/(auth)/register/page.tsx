
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
import { useAuth, initiateEmailSignUp, useFirestore } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import ClientOnly from '@/components/ClientOnly';
import { signOut } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const handleSignUp = (e: FormEvent) => {
    e.preventDefault();
    initiateEmailSignUp(auth, email, password, (user, error) => {
       if (error) {
        if (error.code === 'auth/email-already-in-use') {
          toast({
            variant: "destructive",
            title: "Signup Failed",
            description: "This email is already in use. Please try another.",
          });
        } else {
           toast({
            variant: "destructive",
            title: "Signup Failed",
            description: error.message,
          });
        }
      } else if (user) {
        // Create user profile and tenant in Firestore
        const userRef = doc(firestore, 'users', user.uid);
        const tenantRef = doc(firestore, 'tenants', user.uid); // Using UID as tenantId for simplicity

        const newUserProfile = {
            id: user.uid,
            tenantId: user.uid,
            firstName: firstName,
            lastName: lastName,
            email: user.email,
            role: 'Owner', // Assign a default role
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        const newTenant = {
            id: user.uid,
            name: `${firstName}'s Workspace`,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        Promise.all([
            setDoc(userRef, newUserProfile),
            setDoc(tenantRef, newTenant)
        ]).then(() => {
             // User created successfully, now sign them out and redirect.
            signOut(auth).then(() => {
                router.push('/login?registered=true');
            }).catch((signOutError) => {
                console.error("Error signing out after registration:", signOutError);
                // Still redirect, the user can log in manually.
                router.push('/login?registered=true');
            });
        }).catch((firestoreError) => {
            console.error("Error creating user profile in Firestore:", firestoreError);
            toast({
                variant: "destructive",
                title: "Signup Error",
                description: "Could not create user profile. Please contact support.",
            });
            // Optional: delete the auth user if firestore setup fails
            user.delete();
        });
      }
    });
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
