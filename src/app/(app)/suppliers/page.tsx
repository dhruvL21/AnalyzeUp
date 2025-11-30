"use client";

import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { products as initialProducts } from "@/lib/data";
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

type Supplier = {
  name: string;
  contact: string;
  products: string[];
};

const getSuppliersFromProducts = (products: any[]): Supplier[] => {
  const supplierMap = new Map<string, string[]>();
  products.forEach((p) => {
    if (!supplierMap.has(p.supplier)) {
      supplierMap.set(p.supplier, []);
    }
    supplierMap.get(p.supplier)!.push(p.name);
  });

  return Array.from(supplierMap.entries()).map(([name, products]) => ({
    name,
    contact: `${name.toLowerCase().replace(/\s/g, ".")}@example.com`,
    products,
  }));
};

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(
    getSuppliersFromProducts(initialProducts)
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newSupplier: Supplier = {
      name: formData.get("name") as string,
      contact: formData.get("contact") as string,
      products: [],
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
                <h4 className="text-sm font-medium mb-2">Products Supplied</h4>
                {supplier.products.length > 0 ? (
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {supplier.products.map((product) => (
                      <li key={product}>{product}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No products supplied yet.
                  </p>
                )}
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
                <Button type="button" variant="secondary">Cancel</Button>
              </DialogClose>
              <Button type="submit">Add Supplier</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
