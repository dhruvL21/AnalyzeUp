
'use client';

import Image from 'next/image';
import React, { useState, useMemo } from 'react';
import { PlusCircle, MoreHorizontal, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import type { Product, Supplier, Category } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
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
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { generateDescription } from '@/ai/flows/generate-product-description';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from '@/components/ui/select';
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import {
  addDocumentNonBlocking,
  deleteDocumentNonBlocking,
  setDocumentNonBlocking,
} from '@/firebase/non-blocking-updates';
import { collection, doc, serverTimestamp } from 'firebase/firestore';

const defaultCategories = [
  { id: 'tops', name: 'Tops' },
  { id: 'bottoms', name: 'Bottoms' },
  { id: 'essentials', name: 'Essentials' },
  { id: 'accessories', name: 'Accessories' },
];

export default function InventoryPage() {
  const { firestore, user } = useFirebase();
  const tenantId = user?.uid;

  const productsRef = useMemoFirebase(
    () => (tenantId && firestore ? collection(firestore, `tenants/${tenantId}/products`) : null),
    [firestore, tenantId]
  );
  const { data: products } = useCollection<Product>(productsRef);

  const suppliersRef = useMemoFirebase(
    () => (tenantId && firestore ? collection(firestore, `tenants/${tenantId}/suppliers`) : null),
    [firestore, tenantId]
  );
  const { data: suppliers } = useCollection<Supplier>(suppliersRef);
  
  const categoriesRef = useMemoFirebase(
    () => (tenantId && firestore ? collection(firestore, `tenants/${tenantId}/categories`) : null),
    [firestore, tenantId]
  );
  const { data: fetchedCategories } = useCollection<Category>(categoriesRef);

  const categories = useMemo(() => {
    if (!fetchedCategories) {
      return defaultCategories;
    }
    // Simple de-duplication based on name
    const categoryNames = new Set(fetchedCategories.map(c => c.name.toLowerCase()));
    const uniqueDefaults = defaultCategories.filter(dc => !categoryNames.has(dc.name.toLowerCase()));
    return [...fetchedCategories, ...uniqueDefaults];
  }, [fetchedCategories]);


  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [selectedSupplier, setSelectedSupplier] = useState<string | undefined>(undefined);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSupplierName, setNewSupplierName] = useState('');


  const handleDelete = (productId: string) => {
    if (!tenantId || !firestore) return;
    deleteDocumentNonBlocking(doc(firestore, `tenants/${tenantId}/products`, productId));
    toast({
      title: 'Product Deleted',
      description: 'The product has been successfully removed.',
    });
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!tenantId || !firestore) return;

    const formData = new FormData(e.currentTarget);
    
    let categoryId = selectedCategory;
    let supplierId = selectedSupplier;
    
    const categoriesCollection = collection(firestore, `tenants/${tenantId}/categories`);
    const suppliersCollection = collection(firestore, `tenants/${tenantId}/suppliers`);

    // Handle new category creation
    if (categoryId === 'new') {
        if (!newCategoryName.trim()) {
            toast({ variant: 'destructive', title: 'Category name is required.' });
            return;
        }
        const newCategoryRef = doc(categoriesCollection);
        await setDocumentNonBlocking(newCategoryRef, {
            id: newCategoryRef.id,
            name: newCategoryName,
            tenantId: tenantId,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        }, {});
        categoryId = newCategoryRef.id;
    }

    // Handle new supplier creation
    if (supplierId === 'new') {
        if (!newSupplierName.trim()) {
            toast({ variant: 'destructive', title: 'Supplier name is required.' });
            return;
        }
        const newSupplierRef = doc(suppliersCollection);
        await setDocumentNonBlocking(newSupplierRef, {
            id: newSupplierRef.id,
            name: newSupplierName,
            contactName: newSupplierName,
            email: 'N/A',
            phone: 'N/A',
            address: 'N/A',
            tenantId: tenantId,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        }, {});
        supplierId = newSupplierRef.id;
    }
    
    // Handle default category creation if not in firestore
    const isDefaultCategory = defaultCategories.some(dc => dc.id === categoryId);
    const categoryExistsInFirestore = fetchedCategories?.some(fc => fc.id === categoryId);
    if (isDefaultCategory && !categoryExistsInFirestore) {
      const categoryDoc = defaultCategories.find(dc => dc.id === categoryId);
      if (categoryDoc) {
        const newCategoryRef = doc(categoriesCollection, categoryDoc.id);
        await setDocumentNonBlocking(newCategoryRef, { 
            id: newCategoryRef.id,
            name: categoryDoc.name,
            tenantId: tenantId,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        }, {});
        categoryId = newCategoryRef.id;
      }
    }


    const productData = {
      name: formData.get('name') as string,
      stock: Number(formData.get('stock')),
      price: Number(formData.get('price')),
      categoryId: categoryId,
      supplierId: supplierId,
      imageUrl: formData.get('imageUrl') as string,
      description: description,
      tenantId: tenantId,
    };

    if (editingProduct) {
      const docRef = doc(firestore, `tenants/${tenantId}/products`, editingProduct.id);
      setDocumentNonBlocking(docRef, { ...productData, updatedAt: serverTimestamp() }, { merge: true });
      toast({
        title: 'Product Updated',
        description: `${productData.name} has been updated.`,
      });
    } else {
      const newProductRef = doc(productsRef);
      setDocumentNonBlocking(newProductRef, {
        id: newProductRef.id,
        ...productData,
        averageDailySales: Math.floor(Math.random() * 10) + 1,
        leadTimeDays: Math.floor(Math.random() * 10) + 5,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }, {});
      toast({
        title: 'Product Added',
        description: `${productData.name} has been added to your inventory.`,
      });
    }

    setEditingProduct(null);
    setDialogOpen(false);
    resetFormStates();
  };
  
  const resetFormStates = () => {
    setEditingProduct(null);
    setDescription('');
    setSelectedCategory(undefined);
    setSelectedSupplier(undefined);
    setNewCategoryName('');
    setNewSupplierName('');
  }

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setDescription(product.description || '');
    setSelectedCategory(product.categoryId);
    setSelectedSupplier(product.supplierId);
    setDialogOpen(true);
  };

  const openAddDialog = () => {
    resetFormStates();
    setDialogOpen(true);
  };

  const handleGenerateDescription = async () => {
    const form = document.getElementById('product-form') as HTMLFormElement;
    if (!form) return;

    const formData = new FormData(form);
    const productName = formData.get('name') as string;
    const categoryName = categories?.find(c => c.id === selectedCategory)?.name || newCategoryName || '';

    if (!productName || !categoryName) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description:
          'Please enter a product name and select or enter a category first.',
      });
      return;
    }

    setIsGenerating(true);
    try {
        const result = await generateDescription({
            productName,
            category: categoryName,
        });
        setDescription(result.description);
    } catch (error) {
        console.error(error);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to get AI description. Please try again.',
        });
    }
    setIsGenerating(false);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <div className="flex flex-col gap-6">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl">Inventory</h1>
          <div className="ml-auto flex items-center gap-2">
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
                  <TableHead className="hidden md:table-cell">Stock</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products?.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="hidden sm:table-cell">
                      <Image
                        alt={product.name}
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        src={product.imageUrl || 'https://placehold.co/64x64'}
                        width="64"
                        unoptimized
                      />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          product.stock > 20
                            ? 'outline'
                            : product.stock > 0
                            ? 'secondary'
                            : 'destructive'
                        }
                      >
                        {product.stock > 20
                          ? 'In Stock'
                          : product.stock > 0
                          ? 'Low Stock'
                          : 'Out of Stock'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      ${typeof product.price === 'number' ? product.price.toFixed(2) : 'N/A'}
                    </TableCell>
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
                          <DropdownMenuItem
                            onClick={() => openEditDialog(product)}
                          >
                            Edit
                          </DropdownMenuItem>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                              >
                                Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will
                                  permanently delete the product.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(product.id)}
                                >
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
            {editingProduct ? 'Edit Product' : 'Add Product'}
          </DialogTitle>
          <DialogDescription>
            {editingProduct
              ? 'Update the details of your product.'
              : 'Add a new product to your inventory.'}
          </DialogDescription>
        </DialogHeader>
        <form
          id="product-form"
          onSubmit={handleFormSubmit}
          className="grid gap-4 py-4"
        >
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

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right pt-2">
              Description
            </Label>
            <div className="col-span-3 space-y-2">
              <Textarea
                id="description"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
                required
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGenerateDescription}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Suggest Description
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="imageUrl" className="text-right">
              Image URL
            </Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              defaultValue={editingProduct?.imageUrl}
              className="col-span-3"
              placeholder="https://your-image-url.com/image.png"
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

          <div className="grid grid-cols-2 gap-4 items-start">
             <div className="space-y-2">
                <div className="grid grid-cols-2 items-center gap-4">
                    <Label htmlFor="category" className="text-right">
                        Category
                    </Label>
                    <Select name="category" value={selectedCategory} onValueChange={setSelectedCategory} required>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                        {categories?.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                            </SelectItem>
                        ))}
                        <SelectSeparator />
                        <SelectItem value="new">Add New...</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                {selectedCategory === 'new' && (
                <div className="grid grid-cols-2 items-center gap-4 pl-1">
                    <div/>
                    <Input
                        name="newCategory"
                        placeholder="New category name"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        className="col-span-1"
                    />
                </div>
                )}
            </div>

            <div className="space-y-2">
                 <div className="grid grid-cols-2 items-center gap-4">
                    <Label htmlFor="supplier" className="text-right">
                        Supplier
                    </Label>
                     <Select name="supplier" value={selectedSupplier} onValueChange={setSelectedSupplier} required>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a supplier" />
                        </SelectTrigger>
                        <SelectContent>
                        {suppliers?.map((sup) => (
                            <SelectItem key={sup.id} value={sup.id}>
                            {sup.name}
                            </SelectItem>
                        ))}
                        <SelectSeparator />
                        <SelectItem value="new">Add New...</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                {selectedSupplier === 'new' && (
                    <div className="grid grid-cols-2 items-center gap-4 pl-1">
                        <div/>
                        <Input
                            name="newSupplier"
                            placeholder="New supplier name"
                            value={newSupplierName}
                            onChange={(e) => setNewSupplierName(e.target.value)}
                            className="col-span-1"
                        />
                    </div>
                )}
            </div>

          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
