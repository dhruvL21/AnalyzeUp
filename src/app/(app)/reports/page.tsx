import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DollarSign, ShoppingCart, Package } from "lucide-react";
import { SalesChart } from "@/components/sales-chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { products } from "@/lib/data";

export default function ReportsPage() {
  const topSellingProducts = [...products]
    .sort((a, b) => b.averageDailySales * b.price - a.averageDailySales * a.price)
    .slice(0, 5);
    
  const totalRevenue = products.reduce((acc, p) => acc + (p.averageDailySales * 30 * p.price), 0);
  const totalProductsInStock = products.reduce((acc, p) => acc + p.stock, 0);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold md:text-2xl">Reports</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
            <p className="text-xs text-muted-foreground">
              Based on the last 30 days
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">584</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
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
              Your best-performing products by revenue this month.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Monthly Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topSellingProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-right">
                      ${(product.averageDailySales * 30 * product.price).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
