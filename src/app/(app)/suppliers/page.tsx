
'use client';

import React, { useState, useMemo } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import type { Supplier, Product } from '@/lib/types';
import { useCollection, useFirebase } from '@/firebase';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection, serverTimestamp } from 'firebase/firestore';

export default function SuppliersPage() {
  const { firestore, user } = useFirebase();
  const tenantId = user?.uid;

  const productsRef = useMemo(() => tenantId && collection(firestore, `tenants/${tenantId}/products`), [firestore, tenantId]);
  const { data: products } = useCollection<Product>(productsRef);
  
  const suppliersRef = useMemo(() => tenantId && collection(firestore, `tenants/${tenantId}/suppliers`), [firestore, tenantId]);
  const { data: suppliers } = useCollection<Supplier>(suppliersRef);

  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const supplierProductCount = useMemo(() => {
    if (!suppliers || !products) return {};
    const count: { [key: string]: number } = {};
    suppliers.forEach(supplier => {
      count[supplier.id] = products.filter(p => p.supplierId === supplier.id).length;
    });
    return count;
  }, [suppliers, products]);


  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!tenantId) return;

    const formData = new FormData(e.currentTarget);
    const newSupplierData = {
      name: formData.get('name') as string,
      contactName: (formData.get('name') as string).split(' ')[0] || 'Contact',
      email: formData.get('email') as string,
      phone: 'N/A',
      address: 'N/A',
      tenantId: tenantId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    if (suppliers?.find((s) => s.name === newSupplierData.name)) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'A supplier with this name already exists.',
      });
      return;
    }
    
    addDocumentNonBlocking(collection(firestore, `tenants/${tenantId}/suppliers`), newSupplierData);

    toast({
      title: 'Supplier Added',
      description: `${newSupplierData.name} has been added to your suppliers list.`,
    });
    setDialogOpen(false);
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl">Suppliers</h1>
          <div className="ml-auto flex items-center gap-2">
            <Button
              size="sm"
              className="h-8 gap-1"
              onClick={() => setDialogOpen(true)}
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Supplier
              </span>
            </Button>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {suppliers?.map((supplier) => (
            <Card key={supplier.id}>
              <CardHeader>
                <CardTitle>{supplier.name}</CardTitle>
                <CardDescription>{supplier.email}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Supplies{' '}
                  <span className="font-semibold">
                    {supplierProductCount[supplier.id] || 0}
                  </span>{' '}
                  product(s).
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Supplier</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" name="name" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Contact Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                className="col-span-3"
                required
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Add Supplier</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

    