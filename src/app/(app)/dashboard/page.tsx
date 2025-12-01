
'use client';

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
import { Badge } from '@/components/ui/badge';
import {
  DollarSign,
  PackageX,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Shirt,
} from 'lucide-react';
import { LowStockAlertItem } from '@/components/low-stock-alert-item';
import { SalesChart } from '@/components/sales-chart';
import { useMemo } from 'react';
import { useCollection, useFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Product, Transaction } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

function DashboardLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Inventory Value
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-1/2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-1/2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Low Stock Items
            </CardTitle>
            <PackageX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-1/4" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Top Selling Product
            </CardTitle>
            <Shirt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-6 w-3/4" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sales Performance</CardTitle>
            <CardDescription>
              A look at your sales performance over the past 6 months.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Low Stock Alerts</CardTitle>
            <CardDescription>
              Items nearing their reorder point. Use AI to get suggestions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[400px] overflow-y-auto">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            An overview of the latest inventory movements.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-5 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-8" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-5 w-24 ml-auto" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default function DashboardPage() {
  const { firestore, user } = useFirebase();

  const productsRef = useMemo(
    () => user && collection(firestore, `tenants/${user.uid}/products`),
    [firestore, user]
  );
  const { data: products, isLoading: isLoadingProducts } =
    useCollection<Product>(productsRef);

  const transactionsRef = useMemo(
    () => user && collection(firestore, `tenants/${user.uid}/inventoryTransactions`),
    [firestore, user]
  );
  const { data: transactions, isLoading: isLoadingTransactions } =
    useCollection<Transaction>(transactionsRef);

  const lowStockProducts = products?.filter((p) => p.stock < 20);

  const totalInventoryValue =
    products?.reduce((acc, product) => acc + product.stock * product.price, 0) ||
    0;

  const totalSales =
    transactions
      ?.filter((t) => t.type === 'Sale')
      .reduce((acc, t) => {
        const product = products?.find((p) => p.id === t.productId);
        return acc + t.quantity * (product?.price || 0);
      }, 0) || 0;

  const topSellingProduct =
    transactions
      ?.filter((t) => t.type === 'Sale')
      .reduce((acc, t) => {
        const productName =
          products?.find((p) => p.id === t.productId)?.name || 'Unknown';
        acc[productName] = (acc[productName] || 0) + t.quantity;
        return acc;
      }, {} as { [key: string]: number }) || {};

  const topSeller =
    Object.keys(topSellingProduct).length > 0
      ? Object.entries(topSellingProduct).sort((a, b) => b[1] - a[1])[0]
      : ['N/A', 0];

  const recentTransactions = transactions?.slice(-5).reverse();

  if (isLoadingProducts || isLoadingTransactions) {
    return <DashboardLoading />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Inventory Value
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {totalInventoryValue.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              Total value of all products in stock
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              +$
              {totalSales.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              Total revenue from all sales
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Low Stock Items
            </CardTitle>
            <PackageX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockProducts?.length}</div>
            <p className="text-xs text-muted-foreground">
              Items needing reordering
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Top Selling Product
            </CardTitle>
            <Shirt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold truncate">{topSeller[0]}</div>
            <p className="text-xs text-muted-foreground">
              {topSeller[1]} units sold
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sales Performance</CardTitle>
            <CardDescription>
              A look at your sales performance over the past 6 months.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SalesChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Low Stock Alerts</CardTitle>
            <CardDescription>
              Items nearing their reorder point. Use AI to get suggestions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[400px] overflow-y-auto">
            {lowStockProducts && lowStockProducts.length > 0 ? (
              lowStockProducts.map((product) => (
                <LowStockAlertItem key={product.id} product={product} />
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No items with low stock. Well done!
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            An overview of the latest inventory movements.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransactions?.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {products?.find(p => p.id === transaction.productId)?.name || 'Unknown Product'}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        transaction.type === 'Sale'
                          ? 'destructive'
                          : 'secondary'
                      }
                      className="capitalize"
                    >
                      <div className="flex items-center">
                        {transaction.type === 'Sale' ? (
                          <ArrowDownRight className="mr-1 h-3 w-3" />
                        ) : (
                          <ArrowUpRight className="mr-1 h-3 w-3" />
                        )}
                        {transaction.type}
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell>{transaction.quantity}</TableCell>
                  <TableCell className="text-right">
                    {new Date(transaction.transactionDate).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

    