
'use client';

import React, { useState } from 'react';
import { PlusCircle, MoreHorizontal } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from '@/components/ui/dialog';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import type { PurchaseOrder, Supplier, Product } from '@/lib/types';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { collection, doc, serverTimestamp, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';


type OrderStatus = "Pending" | "Fulfilled" | "Cancelled";

export default function OrdersPage() {
  const { user, firestore } = useFirebase();
  const { toast } = useToast();
  
  const ordersQuery = useMemoFirebase(() => 
    user ? collection(firestore, 'tenants', user.uid, 'purchaseOrders') : null
  , [firestore, user]);
  const { data: orders, isLoading: ordersLoading } = useCollection<PurchaseOrder>(ordersQuery);

  const suppliersQuery = useMemoFirebase(() =>
    user ? collection(firestore, 'tenants', user.uid, 'suppliers') : null
  , [firestore, user]);
  const { data: suppliers, isLoading: suppliersLoading } = useCollection<Supplier>(suppliersQuery);

  const productsQuery = useMemoFirebase(() =>
    user ? collection(firestore, 'tenants', user.uid, 'products') : null
  , [firestore, user]);
  const { data: products, isLoading: productsLoading } = useCollection<Product>(productsQuery);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewingOrder, setViewingOrder] = useState<PurchaseOrder | null>(null);
  
  const handleMarkAsFulfilled = (orderId: string) => {
    if(!user) return;
    const docRef = doc(firestore, 'tenants', user.uid, 'purchaseOrders', orderId);
    updateDoc(docRef, { status: "Fulfilled", updatedAt: serverTimestamp() });
    toast({
      title: 'Order Status Updated',
      description: `Order has been marked as Fulfilled.`,
    });
  };

  const handleDeleteOrder = (orderId: string) => {
     if(!user) return;
    const docRef = doc(firestore, 'tenants', user.uid, 'purchaseOrders', orderId);
    deleteDoc(docRef);
    toast({
      title: 'Order Deleted',
      description: 'The purchase order has been successfully removed.',
    });
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!user) return;

    const formData = new FormData(e.currentTarget);
    const newOrderData = {
      supplierId: formData.get('supplierId') as string,
      status: 'Pending',
      orderDate: new Date().toISOString(),
      expectedDeliveryDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
      quantity: Number(formData.get('quantity')),
      productId: formData.get('productId') as string,
      tenantId: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    const docRef = doc(collection(firestore, 'tenants', user.uid, 'purchaseOrders'));
    setDoc(docRef, newOrderData);

    toast({
      title: 'Order Created',
      description: `New purchase order has been created.`,
    });
    setDialogOpen(false);
  };

  const getStatusVariant = (status: OrderStatus): "secondary" | "outline" | "destructive" | "default" => {
    switch (status) {
      case 'Fulfilled':
        return 'secondary';
      case 'Pending':
        return 'outline';
      case 'Cancelled':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl">Orders</h1>
          <div className="ml-auto flex items-center gap-2">
            <Button
              size="sm"
              className="h-8 gap-1"
              onClick={() => setDialogOpen(true)}
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Create Order
              </span>
            </Button>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              A list of recent purchase orders from your suppliers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders?.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id.slice(0, 8)}...</TableCell>
                    <TableCell>{suppliers?.find(s => s.id === order.supplierId)?.name || order.supplierId}</TableCell> 
                    <TableCell>
                      <Badge variant={getStatusVariant(order.status as OrderStatus)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {order.quantity}
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
                            onClick={() => setViewingOrder(order)}
                          >
                            View Details
                          </DropdownMenuItem>
                          {order.status === 'Pending' && (
                            <DropdownMenuItem
                              onClick={() => handleMarkAsFulfilled(order.id)}
                            >
                              Mark as Fulfilled
                            </DropdownMenuItem>
                          )}
                           <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                className="text-destructive"
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
                                  permanently delete the purchase order.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteOrder(order.id)}
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

      {/* Create Order Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Order</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="supplierId" className="text-right">
                Supplier
              </Label>
              <Select name="supplierId" required>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers?.map((sup) => (
                    <SelectItem key={sup.id} value={sup.id}>
                      {sup.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="productId" className="text-right">
                Product
              </Label>
              <Select name="productId" required>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {products?.map((prod) => (
                    <SelectItem key={prod.id} value={prod.id}>
                      {prod.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantity
              </Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                step="1"
                className="col-span-3"
                required
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Create Order</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Order Details Dialog */}
      <Dialog open={!!viewingOrder} onOpenChange={() => setViewingOrder(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>Order ID: {viewingOrder?.id.slice(0,8)}...</DialogDescription>
          </DialogHeader>
          {viewingOrder && (
            <div className="space-y-4">
              <div>
                <Label>Supplier</Label>
                <p>{suppliers?.find(s => s.id === viewingOrder.supplierId)?.name || viewingOrder.supplierId}</p>
              </div>
               <div>
                <Label>Product</Label>
                <p>{products?.find(p => p.id === viewingOrder.productId)?.name || viewingOrder.productId}</p>
              </div>
              <div>
                <Label>Date</Label>
                <p>{new Date(viewingOrder.orderDate).toLocaleDateString()}</p>
              </div>
              <div>
                <Label>Status</Label>
                <div>
                  <Badge variant={getStatusVariant(viewingOrder.status as OrderStatus)}>
                    {viewingOrder.status}
                  </Badge>
                </div>
              </div>
              <div>
                <Label>Quantity</Label>
                <p>{viewingOrder.quantity}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
