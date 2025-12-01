
"use client";

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
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  PackageX,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { products as initialProducts, transactions as initialTransactions, Product } from "@/lib/data";
import { LowStockAlertItem } from "@/components/low-stock-alert-item";
import { SalesChart } from "@/components/sales-chart";
import { useState, useEffect } from "react";

export default function DashboardPage() {
  // Although we are using state, we are not modifying it on this page.
  // This is to prepare for a future where this data is fetched from a shared context or API.
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [transactions, setTransactions] = useState(initialTransactions);

  const lowStockProducts = products.filter((p) => p.stock < 20);

  const totalInventoryValue = products.reduce(
    (acc, product) => acc + product.stock * product.price,
    0
  );

  // We take only the 5 most recent transactions for the dashboard
  const recentTransactions = transactions.slice(0, 5);


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
            <div className="text-2xl font-bold">${totalInventoryValue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
            <p className="text-xs text-muted-foreground">
              Total value of all products in stock
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sales This Month
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+$12,234.50</div>
            <p className="text-xs text-muted-foreground">
              +19% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <PackageX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockProducts.length}</div>
            <p className="text-xs text-muted-foreground">
              Items needing attention
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Top Selling Product
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">Organic Bananas</div>
            <p className="text-xs text-muted-foreground">
              +250 sold this month
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
          <CardContent className="space-y-4">
            {lowStockProducts.map((product) => (
              <LowStockAlertItem key={product.id} product={product} />
            ))}
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
              {recentTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {transaction.productName}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        transaction.type === "Sale" ? "destructive" : "secondary"
                      }
                      className="capitalize"
                    >
                      <div className="flex items-center">
                        {transaction.type === "Sale" ? (
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
                    {transaction.date}
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
