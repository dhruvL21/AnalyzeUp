"use client";

import React, { useState, useMemo } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useData } from "@/context/data-context";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/lib/data";

type Supplier = {
  name: string;
  contact: string;
  productCount: number;
};

const getSuppliersFromProducts = (products: Product[]): Supplier[] => {
  const supplierMap = new Map<string, number>();
  products.forEach((p) => {
    if (p.supplier) {
      if (!supplierMap.has(p.supplier)) {
        supplierMap.set(p.supplier, 0);
      }
      supplierMap.set(p.supplier, supplierMap.get(p.supplier)! + 1);
    }
  });

  return Array.from(supplierMap.entries()).map(([name, productCount]) => ({
    name,
    contact: `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
    productCount,
  }));
};

export default function SuppliersPage() {
  const { products } = useData();
  const initialSuppliers = useMemo(() => getSuppliersFromProducts(products), [products]);
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  
  React.useEffect(() => {
    setSuppliers(getSuppliersFromProducts(products));
  }, [products]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newSupplier: Supplier = {
      name: formData.get("name") as string,
      contact: formData.get("contact") as string,
      productCount: 0,
    };

    if (suppliers.find((s) => s.name === newSupplier.name)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "A supplier with this name already exists.",
      });
      return;
    }

    setSuppliers([newSupplier, ...suppliers]);
    toast({
      title: "Supplier Added",
      description: `${newSupplier.name} has been added to your suppliers list.`,
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
          {suppliers.map((supplier) => (
            <Card key={supplier.name}>
              <CardHeader>
                <CardTitle>{supplier.name}</CardTitle>
                <CardDescription>{supplier.contact}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Supplies <span className="font-semibold">{supplier.productCount}</span> product(s).
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
              <Label htmlFor="contact" className="text-right">
                Contact Email
              </Label>
              <Input
                id="contact"
                name="contact"
                type="email"
                className="col-span-3"
                required
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Add Supplier</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
