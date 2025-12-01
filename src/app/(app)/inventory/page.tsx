
"use client";

import Image from "next/image";
import React, { useState } from "react";
import { PlusCircle, MoreHorizontal, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Product, Transaction } from "@/lib/data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import Papa from "papaparse";
import { useData } from "@/context/data-context";

export default function InventoryPage() {
  const { products, setProducts, addTransactions } = useData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [csvDialogOpen, setCsvDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleDelete = (productId: string) => {
    setProducts(products.filter((p) => p.id !== productId));
    toast({
      title: "Product Deleted",
      description: "The product has been successfully removed.",
    });
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newProductData = {
      name: formData.get("name") as string,
      stock: Number(formData.get("stock")),
      price: Number(formData.get("price")),
      category: formData.get("category") as string,
      supplier: formData.get("supplier") as string,
      description: formData.get("description") as string,
    };

    if (editingProduct) {
      const updatedProduct: Product = {
        ...editingProduct,
        ...newProductData,
      };
      setProducts(
        products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
      );
      toast({
        title: "Product Updated",
        description: `${updatedProduct.name} has been updated.`,
      });
    } else {
      const newProduct: Product = {
        id: `PROD${(Math.random() * 1000).toFixed(0).padStart(3, "0")}`,
        imageUrl: `https://picsum.photos/seed/${Math.random()}/400/400`,
        averageDailySales: Math.floor(Math.random() * 10) + 1,
        leadTimeDays: Math.floor(Math.random() * 10) + 5,
        ...newProductData,
      };
      setProducts([newProduct, ...products]);
      toast({
        title: "Product Added",
        description: `${newProduct.name} has been added to your inventory.`,
      });
    }

    setEditingProduct(null);
    setDialogOpen(false);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingProduct(null);
    setDialogOpen(true);
  };

  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse<Product>(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          const newProducts = results.data.map(p => ({
            ...p,
            id: p.id || `PROD${(Math.random() * 1000).toFixed(0).padStart(3, "0")}`,
            imageUrl: p.imageUrl || `https://picsum.photos/seed/${Math.random()}/400/400`,
            stock: typeof p.stock === 'number' ? p.stock : 0,
            price: typeof p.price === 'number' ? p.price : 0,
            averageDailySales: typeof p.averageDailySales === 'number' ? p.averageDailySales : 0,
            leadTimeDays: typeof p.leadTimeDays === 'number' ? p.leadTimeDays : 0,
          }));

          setProducts(newProducts);

          const newTransactions = newProducts.flatMap(p => {
              const numSales = Math.floor(Math.random() * 5);
              return Array.from({length: numSales}, (_, i) => ({
                  id: `TRN${(Math.random() * 10000).toFixed(0).padStart(4, "0")}`,
                  productName: p.name,
                  type: 'Sale' as const,
                  quantity: Math.floor(Math.random() * 3) + 1,
                  date: new Date(new Date().setDate(new Date().getDate() - Math.floor(Math.random() * 30))).toISOString().split('T')[0]
              }));
          });
          addTransactions(newTransactions);

          toast({
            title: "CSV Imported Successfully",
            description: `${results.data.length} products have been added or updated.`,
          });
          setCsvDialogOpen(false);
        },
        error: (error) => {
          toast({
            variant: "destructive",
            title: "CSV Import Error",
            description: error.message,
          });
        },
      });
    }
  };


  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <div className="flex flex-col gap-6">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl">Inventory</h1>
          <div className="ml-auto flex items-center gap-2">
            <Dialog open={csvDialogOpen} onOpenChange={setCsvDialogOpen}>
              <DialogTrigger asChild>
                 <Button size="sm" variant="outline" className="h-8 gap-1">
                  <Upload className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Import
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Import Products via CSV</DialogTitle>
                  <DialogDescription>
                    Upload a CSV file with product data. Make sure the headers match the product fields (id, name, description, stock, price, averageDailySales, leadTimeDays, category, supplier, imageUrl).
                  </DialogDescription>
                </DialogHeader>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="csv-file">CSV File</Label>
                  <Input id="csv-file" type="file" accept=".csv" onChange={handleCsvUpload} />
                </div>
              </DialogContent>
            </Dialog>

            <Button size="sm" className="h-8 gap-1" onClick={openAddDialog}>
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Product
              </span>
            </Button>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
            <CardDescription>
              Manage your products and view their inventory levels.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden w-[100px] sm:table-cell">
                    <span className="sr-only">Image</span>
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Stock
                  </TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="hidden sm:table-cell">
                      <Image
                        alt={product.name}
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        src={product.imageUrl || 'https://placehold.co/64x64'}
                        width="64"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>
                       <Badge
                        variant={product.stock > 20 ? "outline" : product.stock > 0 ? "secondary" : "destructive"}
                      >
                        {product.stock > 20 ? "In Stock" : product.stock > 0 ? "Low Stock" : "Out of Stock"}
                      </Badge>
                    </TableCell>
                    <TableCell>${typeof product.price === 'number' ? product.price.toFixed(2) : 'N/A'}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {product.stock}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => openEditDialog(product)}>
                            Edit
                          </DropdownMenuItem>
                           <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Delete</DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the product.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(product.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>
            {editingProduct ? "Edit Product" : "Add Product"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleFormSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              defaultValue={editingProduct?.name}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={editingProduct?.description}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid grid-cols-2 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                defaultValue={editingProduct?.price}
                required
              />
            </div>
            <div className="grid grid-cols-2 items-center gap-4">
              <Label htmlFor="stock" className="text-right">
                Stock
              </Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                defaultValue={editingProduct?.stock}
                required
              />
            </div>
          </div>
           <div className="grid grid-cols-2 gap-4">
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Input
                  id="category"
                  name="category"
                  defaultValue={editingProduct?.category}
                  required
                />
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="supplier" className="text-right">
                  Supplier
                </Label>
                <Input
                  id="supplier"
                  name="supplier"
                  defaultValue={editingProduct?.supplier}
                  required
                />
              </div>
            </div>
          <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

    