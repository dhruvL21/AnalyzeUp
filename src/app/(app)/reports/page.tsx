
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DollarSign,
  ShoppingCart,
  Package,
  Download,
} from 'lucide-react';
import { SalesChart } from '@/components/sales-chart';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Papa from 'papaparse';
import { useCollection, useFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Product, Transaction } from '@/lib/types';
import { useMemo } from 'react';

export default function ReportsPage() {
  const { firestore, user } = useFirebase();

  const productsRef = useMemo(
    () => user && collection(firestore, `tenants/${user.uid}/products`),
    [firestore, user]
  );
  const { data: products } = useCollection<Product>(productsRef);

  const transactionsRef = useMemo(
    () => user && collection(firestore, `tenants/${user.uid}/inventoryTransactions`),
    [firestore, user]
  );
  const { data: transactions } = useCollection<Transaction>(transactionsRef);

  const totalRevenue =
    transactions
      ?.filter((t) => t.type === 'Sale')
      .reduce((acc, t) => {
        const product = products?.find((p) => p.id === t.productId);
        return acc + t.quantity * (product?.price || 0);
      }, 0) || 0;

  const topSellingProducts = products
    ? [...products]
        .sort((a, b) => {
          const salesA =
            transactions
              ?.filter((t) => t.productId === a.id && t.type === 'Sale')
              .reduce((acc, t) => acc + t.quantity, 0) || 0;
          const salesB =
            transactions
              ?.filter((t) => t.productId === b.id && t.type === 'Sale')
              .reduce((acc, t) => acc + t.quantity, 0) || 0;
          const revenueA = salesA * a.price;
          const revenueB = salesB * b.price;
          return revenueB - revenueA;
        })
        .slice(0, 5)
    : [];

  const totalProductsInStock =
    products?.reduce((acc, p) => acc + p.stock, 0) || 0;
  const totalOrders = transactions?.filter((t) => t.type === 'Sale').length || 0;

  const handleDownloadCsv = () => {
    if (!products || !transactions) return;
    const reportData = products.map((p) => {
      const sales =
        transactions
          .filter((t) => t.productId === p.id && t.type === 'Sale')
          .reduce((acc, t) => acc + t.quantity, 0) || 0;
      const revenue = sales * p.price;
      return {
        ...p,
        totalSalesUnits: sales,
        totalRevenue: revenue.toFixed(2),
      };
    });

    const csv = Papa.unparse(reportData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'inventory_report.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Reports</h1>
        <div className="ml-auto">
          <Button size="sm" onClick={handleDownloadCsv}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {totalRevenue.toLocaleString('en-US', {
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
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              Total number of sales transactions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Products in Stock
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalProductsInStock.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Across all products</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>
              Your sales trend over the last 6 months.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SalesChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>
              Your best-performing products by revenue.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Total Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topSellingProducts.map((product) => {
                  const sales =
                    transactions
                      ?.filter((t) => t.productId === product.id && t.type === 'Sale')
                      .reduce((acc, t) => acc + t.quantity, 0) || 0;
                  const revenue = sales * product.price;
                  return (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        {product.name}
                      </TableCell>
                      <TableCell className="text-right">
                        $
                        {revenue.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

    