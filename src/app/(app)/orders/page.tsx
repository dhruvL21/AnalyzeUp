"use client";

import React, { useState } from "react";
import { PlusCircle, MoreHorizontal } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type OrderStatus = "Pending" | "Fulfilled" | "Cancelled";

type Order = {
  id: string;
  customer: string;
  date: string;
  status: OrderStatus;
  total: number;
};

const initialOrders: Order[] = [
  {
    id: "ORD001",
    customer: "Liam Johnson",
    date: "2023-10-23",
    status: "Fulfilled",
    total: 250.0,
  },
  {
    id: "ORD002",
    customer: "Olivia Smith",
    date: "2023-10-24",
    status: "Pending",
    total: 150.75,
  },
  {
    id: "ORD003",
    customer: "Noah Williams",
    date: "2023-10-25",
    status: "Fulfilled",
    total: 350.0,
  },
  {
    id: "ORD004",
    customer: "Emma Brown",
    date: "2023-10-26",
    status: "Cancelled",
    total: 75.5,
  },
  {
    id: "ORD005",
    customer: "James Jones",
    date: "2023-10-27",
    status: "Fulfilled",
    total: 220.0,
  },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const { toast } = useToast();

  const handleMarkAsFulfilled = (orderId: string) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: "Fulfilled" } : order
      )
    );
    toast({
      title: "Order Status Updated",
      description: `Order ${orderId} has been marked as Fulfilled.`,
    });
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newOrder: Order = {
      id: `ORD${(Math.random() * 1000).toFixed(0).padStart(3, "0")}`,
      customer: formData.get("customer") as string,
      total: Number(formData.get("total")),
      date: new Date().toISOString().split("T")[0],
      status: "Pending",
    };

    setOrders([newOrder, ...orders]);
    toast({
      title: "Order Created",
      description: `New order for ${newOrder.customer} has been created.`,
    });
    setDialogOpen(false);
  };

  const getStatusVariant = (status: OrderStatus) => {
    switch (status) {
      case "Fulfilled":
        return "secondary";
      case "Pending":
        return "outline";
      case "Cancelled":
        return "destructive";
      default:
        return "default";
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
              A list of recent orders from your customers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {order.date}
                    </TableCell>
                    <TableCell className="text-right">
                      ${order.total.toFixed(2)}
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
                          <DropdownMenuItem onClick={() => setViewingOrder(order)}>
                            View Details
                          </DropdownMenuItem>
                          {order.status === "Pending" && (
                            <DropdownMenuItem
                              onClick={() => handleMarkAsFulfilled(order.id)}
                            >
                              Mark as Fulfilled
                            </DropdownMenuItem>
                          )}
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
              <Label htmlFor="customer" className="text-right">
                Customer
              </Label>
              <Input
                id="customer"
                name="customer"
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="total" className="text-right">
                Total
              </Label>
              <Input
                id="total"
                name="total"
                type="number"
                step="0.01"
                className="col-span-3"
                required
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">Cancel</Button>
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
            <CardDescription>Order ID: {viewingOrder?.id}</CardDescription>
          </DialogHeader>
          {viewingOrder && (
            <div className="space-y-4">
              <div>
                <Label>Customer</Label>
                <p>{viewingOrder.customer}</p>
              </div>
              <div>
                <Label>Date</Label>
                <p>{viewingOrder.date}</p>
              </div>
              <div>
                <Label>Status</Label>
                <p>
                  <Badge variant={getStatusVariant(viewingOrder.status)}>
                    {viewingOrder.status}
                  </Badge>
                </p>
              </div>
              <div>
                <Label>Total</Label>
                <p>${viewingOrder.total.toFixed(2)}</p>
              </div>
            </div>
          )}
           <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">Close</Button>
              </DialogClose>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
