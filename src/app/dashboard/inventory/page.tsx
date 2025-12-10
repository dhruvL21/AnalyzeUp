
'use client';

import Image from 'next/image';
import React, { useState, useMemo, useRef, useCallback } from 'react';
import { PlusCircle, MoreHorizontal, Sparkles, Loader2, Upload, FileCheck2, Wand2, ListChecks } from 'lucide-react';
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
import { useData } from '@/context/data-context';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateProductDescription } from '@/ai/flows/generate-product-description';
import { useTasks } from '@/context/task-context';
import { ProductSchema } from '@/lib/types.zod';
import Papa from 'papaparse';
import { mapProductAttributes, MappingResult } from '@/ai/flows/map-product-attributes';
import { Progress } from '@/components/ui/progress';

type ImportStep = 'upload' | 'mapping' | 'importing' | 'complete';


export default function InventoryPage() {
  const { toast } = useToast();
  const { products, addProduct, updateProduct, deleteProduct, isLoading, categories, suppliers, addCategory, addSupplier } = useData();
  const { tasks, runTask } = useTasks();

  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isSupplierDialogOpen, setIsSupplierDialogOpen] = useState(false);
  
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(undefined);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | undefined>(undefined);

  const productFormRef = useRef<HTMLFormElement>(null);
  const isGeneratingDescription = tasks['generate-description']?.status === 'running';

  // Import state
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importStep, setImportStep] = useState<ImportStep>('upload');
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [fileHeaders, setFileHeaders] = useState<string[]>([]);
  const [mappings, setMappings] = useState<MappingResult[]>([]);
  const [importProgress, setImportProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const isMappingAttributes = tasks['map-attributes']?.status === 'running';


  const handleGenerateDescription = async () => {
    if (!productFormRef.current) return;
    const formData = new FormData(productFormRef.current);
    const productName = formData.get('name') as string;

    if (!productName) {
      toast({
        variant: 'destructive',
        title: 'Product Name Required',
        description: 'Please enter a product name before generating a description.',
      });
      return;
    }

    runTask('generate-description', async () => {
        const result = await generateProductDescription({ productName });
        setDescription(result.description);
    }, 'Generating AI description...');
  };

  const resetFormState = () => {
    setEditingProduct(null);
    setDescription('');
    setImagePreview(null);
    setSelectedCategoryId(undefined);
    setSelectedSupplierId(undefined);
  };
  
  const resetImportState = () => {
    setImportStep('upload');
    setParsedData([]);
    setFileHeaders([]);
    setMappings([]);
    setImportProgress(0);
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    let imageUrl = editingProduct?.imageUrl || `https://picsum.photos/seed/${Date.now()}/400/400`;
    if (imagePreview) {
        imageUrl = imagePreview;
    }

    const productData = {
      name: formData.get('name') as string,
      stock: Number(formData.get('stock')),
      price: Number(formData.get('price')),
      categoryId: selectedCategoryId || formData.get('categoryId') as string,
      supplierId: selectedSupplierId || formData.get('supplierId') as string,
      imageUrl: imageUrl,
      description: description,
      sku: 'SKU-' + Date.now().toString(36),
    };

    if (editingProduct) {
      const updatedProduct = {
        ...editingProduct,
        ...productData,
        description: description,
        updatedAt: new Date().toISOString(),
      };
      updateProduct(updatedProduct);
    } else {
      addProduct(productData);
    }

    setIsFormDialogOpen(false);
  };
  
  const handleCategorySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newCategory = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
    };
    await addCategory(newCategory);
    
    const createdCategory = categories.find(c => c.name === newCategory.name);
    if(createdCategory) {
      setSelectedCategoryId(createdCategory.id);
    }
    
    setIsCategoryDialogOpen(false);
  };

  const handleSupplierSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newSupplier = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      contactName: (formData.get('name') as string).split(' ')[0] || 'Contact',
      phone: 'N/A',
      address: 'N/A',
    };
    await addSupplier(newSupplier);

    const createdSupplier = suppliers.find(s => s.name === newSupplier.name);
    if (createdSupplier) {
      setSelectedSupplierId(createdSupplier.id);
    }

    setIsSupplierDialogOpen(false);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      toast({ variant: 'destructive', title: 'No file selected.' });
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const headers = results.meta.fields || [];
        setFileHeaders(headers);
        setParsedData(results.data);

        await runTask('map-attributes', async () => {
          const schemaString = JSON.stringify(ProductSchema.shape, null, 2);
          const response = await mapProductAttributes({
            sourceAttributes: headers,
            targetSchema: schemaString,
          });
          setMappings(response.mappings);
          setImportStep('mapping');
        }, 'Analyzing CSV attributes with AI...');
      },
      error: (error) => {
        toast({ variant: 'destructive', title: 'Error parsing file', description: error.message });
      }
    });
  };

  const handleMappingChange = (source: string, newTarget: string | null) => {
    setMappings(prev =>
      prev.map(m =>
        m.source_attribute === source ? { ...m, mapped_attribute: newTarget } : m
      )
    );
  };

  const handleStartImport = async () => {
    setImportStep('importing');

    const total = parsedData.length;
    for (let i = 0; i < total; i++) {
        const row = parsedData[i];
        const productData: Partial<Omit<Product, 'id' | 'userId'>> = {};

        mappings.forEach(map => {
            if (map.mapped_attribute && map.source_attribute in row) {
                let value = row[map.source_attribute];
                // Basic type casting
                if (map.mapped_attribute === 'price' || map.mapped_attribute === 'stock') {
                    value = Number(value.replace(/[^0-9.-]+/g,"")) || 0;
                }
                (productData as any)[map.mapped_attribute] = value;
            }
        });

        // Add defaults for required fields if they are missing
        const finalProductData = {
          name: productData.name || 'Unnamed Product',
          description: productData.description || '',
          sku: productData.sku || 'SKU-' + Date.now().toString(36) + i,
          categoryId: productData.categoryId || 'uncategorized',
          stock: productData.stock || 0,
          price: productData.price || 0,
          imageUrl: productData.imageUrl || `https://picsum.photos/seed/${Date.now() + i}/400/400`,
          supplierId: productData.supplierId || '',
        };
        
        await addProduct(finalProductData);

        // Update progress
        setImportProgress(((i + 1) / total) * 100);
    }
    
    setImportStep('complete');
    toast({ title: "Import Complete!", description: `${total} products have been added to your inventory.`})
  };

  const openEditDialog = (product: Product) => {
    resetFormState();
    setEditingProduct(product);
    setDescription(product.description || '');
    setImagePreview(product.imageUrl || null);
    setSelectedCategoryId(product.categoryId);
    setSelectedSupplierId(product.supplierId);
    setIsFormDialogOpen(true);
  };

  const openAddDialog = () => {
    resetFormState();
    setIsFormDialogOpen(true);
  };

  const targetAttributes = useMemo(() => Object.keys(ProductSchema.shape), []);

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl">Inventory</h1>
          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" variant="outline" className="h-8 gap-1" onClick={() => setIsImportDialogOpen(true)}>
              <Upload className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Import
              </span>
            </Button>
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

    {/* Add/Edit Product Dialog */}
    <Dialog open={isFormDialogOpen} onOpenChange={(isOpen) => {
        setIsFormDialogOpen(isOpen);
        if (!isOpen) resetFormState();
    }}>
      <DialogContent className="sm:max-w-lg ios-glass">
        <form
          ref={productFormRef}
          id="product-form"
          onSubmit={handleFormSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4"
        >
            <div className="md:col-span-2 space-y-2">
                <DialogTitle className="text-2xl">
                    {editingProduct ? 'Edit Product' : 'Add Product'}
                </DialogTitle>
                <DialogDescription>
                    {editingProduct
                    ? 'Update the details of your product.'
                    : 'Add a new product to your inventory.'}
                </DialogDescription>
            </div>
            
            <div className="md:col-span-2 space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                id="name"
                name="name"
                defaultValue={editingProduct?.name}
                required
                />
            </div>

            <div className="md:col-span-2 space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                id="description"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                />
                <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGenerateDescription}
                disabled={isGeneratingDescription}
                >
                {isGeneratingDescription ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                )}
                Generate with AI
                </Button>
            </div>
          
            <div className="md:col-span-2 space-y-2">
                <Label htmlFor="image">Image</Label>
                <div className="flex items-center gap-4">
                    {imagePreview && (
                    <Image
                        src={imagePreview}
                        alt="Product preview"
                        width={64}
                        height={64}
                        className="aspect-square rounded-md object-cover"
                    />
                    )}
                    <Input
                    id="image"
                    name="image"
                    type="file"
                    className="file:text-foreground"
                    onChange={handleFileChange}
                    accept="image/*"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                defaultValue={editingProduct?.price}
                required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                id="stock"
                name="stock"
                type="number"
                defaultValue={editingProduct?.stock}
                required
                />
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="categoryId">Category</Label>
                <Select 
                    name="categoryId" 
                    value={selectedCategoryId}
                    onValueChange={(value) => {
                    if (value === 'create-new') {
                        setIsCategoryDialogOpen(true);
                    } else {
                        setSelectedCategoryId(value);
                    }
                    }}
                >
                    <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                    {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                        {category.name}
                        </SelectItem>
                    ))}
                    <SelectItem value="create-new" className='italic text-primary'>
                        Create new category...
                    </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="supplierId">Supplier</Label>
                <Select 
                    name="supplierId" 
                    value={selectedSupplierId}
                    onValueChange={(value) => {
                    if (value === 'create-new-supplier') {
                        setIsSupplierDialogOpen(true);
                    } else {
                        setSelectedSupplierId(value);
                    }
                    }}
                    defaultValue={editingProduct?.supplierId}
                >
                    <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent>
                    {suppliers.map((supplier) => (
                        <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                        </SelectItem>
                    ))}
                    <SelectItem value="create-new-supplier" className='italic text-primary'>
                        Create new supplier...
                    </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <DialogFooter className="md:col-span-2">
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

    {/* Import Products Dialog */}
    <Dialog open={isImportDialogOpen} onOpenChange={(isOpen) => {
        setIsImportDialogOpen(isOpen);
        if(!isOpen) setTimeout(resetImportState, 300);
    }}>
        <DialogContent className="max-w-3xl h-[80vh] flex flex-col ios-glass">
            <DialogHeader>
                <DialogTitle>Import Products</DialogTitle>
                <DialogDescription>
                {importStep === 'upload' && "Upload a CSV file to import products into your inventory."}
                {importStep === 'mapping' && "Confirm the attribute mappings for your data."}
                {importStep === 'importing' && "Your products are being imported. Please wait."}
                {importStep === 'complete' && "Import finished! Review the results."}
                </DialogDescription>
            </DialogHeader>

            {importStep === 'upload' && (
                <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-muted-foreground/30 p-8 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Upload className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold">Drag and drop your file here</h3>
                    <p className="text-muted-foreground">or click to browse</p>
                    <Button asChild variant="outline" className="relative">
                        <label htmlFor="csv-upload">
                            Browse File
                            <input ref={fileInputRef} id="csv-upload" type="file" accept=".csv" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileImport} />
                        </label>
                    </Button>
                    <p className="text-xs text-muted-foreground mt-4">Only .csv files are supported.</p>
                </div>
            )}
            
            {importStep === 'mapping' && (
                <div className='flex-1 overflow-y-auto pr-4 -mr-4'>
                    {isMappingAttributes ? (
                        <div className="flex flex-col items-center justify-center h-full gap-4">
                            <Wand2 className="h-10 w-10 text-primary animate-pulse" />
                            <p className="text-muted-foreground">AI is mapping your attributes...</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {mappings.map((mapping, index) => (
                                <Card key={index} className="bg-muted/30">
                                    <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                        <div className='space-y-1'>
                                            <Label>CSV Column</Label>
                                            <p className='font-mono text-sm p-2 bg-background rounded-md border'>{mapping.source_attribute}</p>
                                        </div>
                                         <div className='space-y-1'>
                                            <Label>Application Field</Label>
                                            <Select value={mapping.mapped_attribute || 'skip'} onValueChange={(val) => handleMappingChange(mapping.source_attribute, val === 'skip' ? null : val)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select field..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="skip" className="italic">Do not import</SelectItem>
                                                    {targetAttributes.map(attr => (
                                                        <SelectItem key={attr} value={attr}>{attr}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-1 md:col-span-3">
                                          <p className="text-xs text-muted-foreground p-2 bg-background/50 rounded-md border border-dashed">
                                            <span className="font-semibold">AI Suggestion (Confidence: {(mapping.confidence * 100).toFixed(0)}%):</span> {mapping.notes}
                                          </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {importStep === 'importing' && (
                <div className="flex flex-1 flex-col items-center justify-center gap-4">
                    <Loader2 className="h-12 w-12 text-primary animate-spin" />
                    <p className="text-muted-foreground">Importing {parsedData.length} products...</p>
                    <Progress value={importProgress} className="w-full" />
                </div>
            )}

            {importStep === 'complete' && (
                <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
                    <FileCheck2 className="h-16 w-16 text-green-500" />
                    <h3 className="text-2xl font-bold">Import Successful</h3>
                    <p className="text-muted-foreground">{parsedData.length} new products have been added to your inventory.</p>
                </div>
            )}

            <DialogFooter>
                {importStep === 'mapping' && (
                    <>
                        <Button variant="outline" onClick={resetImportState}>Cancel</Button>
                        <Button onClick={handleStartImport} disabled={isMappingAttributes}>
                            <ListChecks className="mr-2 h-4 w-4" />
                            Confirm and Import
                        </Button>
                    </>
                )}
                 {(importStep === 'upload' || importStep === 'complete') && (
                     <DialogClose asChild>
                        <Button>{importStep === 'complete' ? 'Done' : 'Close'}</Button>
                    </DialogClose>
                 )}
            </DialogFooter>
        </DialogContent>
    </Dialog>


    {/* Add Category Dialog */}
    <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent className="ios-glass">
            <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
                <DialogDescription>Create a new category for your products.</DialogDescription>
            </DialogHeader>
            <form id="category-form" onSubmit={handleCategorySubmit} className="grid gap-4 py-4">
                 <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Name</Label>
                    <Input id="name" name="name" className="col-span-3" required />
                </div>
                 <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="description" className="text-right pt-2">Description</Label>
                    <Textarea id="description" name="description" className="col-span-3" />
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Save Category</Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>

    {/* Add Supplier Dialog */}
    <Dialog open={isSupplierDialogOpen} onOpenChange={setIsSupplierDialogOpen}>
      <DialogContent className="sm:max-w-[425px] ios-glass">
        <DialogHeader>
          <DialogTitle>Add New Supplier</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSupplierSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="supplier-name" className="text-right">
              Name
            </Label>
            <Input id="name" name="name" className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="supplier-email" className="text-right">
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
