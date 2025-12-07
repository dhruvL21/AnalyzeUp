
'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
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
import type { Product } from '@/lib/types';
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
} from '@/components/ui/select';
import { useData } from '@/context/data-context';
import { useTasks } from '@/context/task-context';


export default function InventoryPage() {
  const { toast } = useToast();
  const { products, suppliers, categories, addProduct, updateProduct, deleteProduct, addCategory, addSupplier, isLoading } = useData();
  const { runTask, tasks } = useTasks();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [description, setDescription] = useState('');
  
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [selectedSupplier, setSelectedSupplier] = useState<string | undefined>();

  const [showAddCategoryDialog, setShowAddCategoryDialog] = useState(false);
  const [showAddSupplierDialog, setShowAddSupplierDialog] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSupplierName, setNewSupplierName] = useState('');
  const [newSupplierEmail, setNewSupplierEmail] = useState('');

  const descriptionGenerationTaskId = `gen-desc-${editingProduct?.id || 'new'}`;
  const descriptionGenerationTask = tasks[descriptionGenerationTaskId];

  useEffect(() => {
    if (descriptionGenerationTask?.status === 'success') {
      setDescription(descriptionGenerationTask.result.description);
    }
  }, [descriptionGenerationTask]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const productData = {
      name: formData.get('name') as string,
      stock: Number(formData.get('stock')),
      price: Number(formData.get('price')),
      categoryId: selectedCategory || '',
      supplierId: selectedSupplier || '',
      imageUrl: formData.get('imageUrl') as string || `https://picsum.photos/seed/${Date.now()}/400/400`,
      description: description,
      sku: 'SKU-' + Date.now().toString(36),
    };

    if (!productData.categoryId || !productData.supplierId) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please select a category and a supplier.',
      });
      return;
    }


    if (editingProduct) {
      const updatedProduct = {
        ...editingProduct,
        ...productData,
        description: description, // ensure description from state is used
        updatedAt: new Date().toISOString(),
      };
      updateProduct(updatedProduct);
    } else {
      addProduct(productData);
    }

    setEditingProduct(null);
    setDialogOpen(false);
    setDescription('');
    setSelectedCategory(undefined);
    setSelectedSupplier(undefined);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setDescription(product.description || '');
    setSelectedCategory(product.categoryId);
    setSelectedSupplier(product.supplierId);
    setDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingProduct(null);
    setDescription('');
    setSelectedCategory(undefined);
    setSelectedSupplier(undefined);
    setDialogOpen(true);
  };

  const handleGenerateDescription = async () => {
    const form = document.getElementById('product-form') as HTMLFormElement;
    if (!form) return;

    const formData = new FormData(form);
    const productName = formData.get('name') as string;
    const categoryName = categories.find((c) => c.id === selectedCategory)?.name || 'Default';

    if (!productName) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description:
          'Please enter a product name first.',
      });
      return;
    }

    runTask(
        descriptionGenerationTaskId,
        () => generateDescription({ productName, category: categoryName }),
        'Generating description...'
    );
  };

  const handleAddCategory = async () => {
    if (!newCategoryName) return;
    await addCategory({ name: newCategoryName, description: '' });
    // The useCollection hook will update the categories list. We can find the new one.
    // This is a bit of a hack, assumes names are unique for now.
    const newCat = categories.find(c => c.name === newCategoryName) || { id: newCategoryName };
    setSelectedCategory(newCat.id);
    setShowAddCategoryDialog(false);
    setNewCategoryName('');
  };

  const handleAddSupplier = async () => {
    if (!newSupplierName || !newSupplierEmail) return;
    await addSupplier({
      name: newSupplierName,
      email: newSupplierEmail,
      contactName: newSupplierName,
      phone: '',
      address: '',
    });
    // This is a bit of a hack, assumes names are unique for now.
    const newSup = suppliers.find(s => s.name === newSupplierName) || { id: newSupplierName };
    setSelectedSupplier(newSup.id);
    setShowAddSupplierDialog(false);
    setNewSupplierName('');
    setNewSupplierEmail('');
  };

  return (
    <>
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
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell className="hidden sm:table-cell">
                        <div className="aspect-square rounded-md bg-muted w-16 h-16 animate-pulse" />
                      </TableCell>
                      <TableCell><div className='h-5 w-32 bg-muted rounded animate-pulse'/></TableCell>
                      <TableCell><div className='h-6 w-20 bg-muted rounded-full animate-pulse'/></TableCell>
                      <TableCell><div className='h-5 w-16 bg-muted rounded animate-pulse'/></TableCell>
                      <TableCell className="hidden md:table-cell"><div className='h-5 w-10 bg-muted rounded animate-pulse'/></TableCell>
                      <TableCell><div className='h-8 w-8 bg-muted rounded-md animate-pulse'/></TableCell>
                    </TableRow>
                  ))
                ) : (
                products.map((product) => (
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
                                  onClick={() => deleteProduct(product.id)}
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
                )))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
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
                disabled={descriptionGenerationTask?.status === 'running'}
              >
                {descriptionGenerationTask?.status === 'running' ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Suggest Description
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select
                value={selectedCategory}
                onValueChange={(value) => {
                  if (value === 'create-new') {
                    setShowAddCategoryDialog(true);
                  } else {
                    setSelectedCategory(value);
                  }
                }}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="create-new" className="text-primary font-semibold">
                    + Create new category...
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="supplier" className="text-right">
                Supplier
              </Label>
              <Select
                value={selectedSupplier}
                onValueChange={(value) => {
                  if (value === 'create-new') {
                    setShowAddSupplierDialog(true);
                  } else {
                    setSelectedSupplier(value);
                  }
                }}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((sup) => (
                    <SelectItem key={sup.id} value={sup.id}>
                      {sup.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="create-new" className="text-primary font-semibold">
                    + Create new supplier...
                  </SelectItem>
                </SelectContent>
              </Select>
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

    {/* Add Category Dialog */}
    <Dialog open={showAddCategoryDialog} onOpenChange={setShowAddCategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-category-name" className="text-right">
                Name
              </Label>
              <Input
                id="new-category-name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleAddCategory}>Create</Button>
          </DialogFooter>
        </DialogContent>
    </Dialog>

    {/* Add Supplier Dialog */}
    <Dialog open={showAddSupplierDialog} onOpenChange={setShowAddSupplierDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Supplier</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="new-supplier-name" className="text-right">
              Name
            </Label>
            <Input
              id="new-supplier-name"
              value={newSupplierName}
              onChange={(e) => setNewSupplierName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="new-supplier-email" className="text-right">
              Email
            </Label>
            <Input
              id="new-supplier-email"
              type="email"
              value={newSupplierEmail}
              onChange={(e) => setNewSupplierEmail(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleAddSupplier}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}
