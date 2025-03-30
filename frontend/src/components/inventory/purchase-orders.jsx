import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Plus, FileText, Filter } from "lucide-react"

// Sample purchase orders
const purchaseOrders = [
  {
    id: "PO-2023-001",
    supplier: "Fresh Foods Inc.",
    items: ["Tomatoes", "Lettuce", "Onions"],
    total: "$245.50",
    status: "pending",
    date: "2025-03-28",
  },
  {
    id: "PO-2023-002",
    supplier: "Meat Suppliers Co.",
    items: ["Chicken", "Beef"],
    total: "$520.75",
    status: "approved",
    date: "2025-03-29",
  },
  {
    id: "PO-2023-003",
    supplier: "Grocery Wholesale",
    items: ["Rice", "Flour", "Oil"],
    total: "$187.25",
    status: "delivered",
    date: "2025-03-25",
  },
]

export default function PurchaseOrders() {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex flex-col space-y-1.5">
          <CardTitle className="text-lg flex items-center">
            <ShoppingCart className="mr-2 h-5 w-5" />
            Purchase Orders
          </CardTitle>
          <CardDescription>Manage inventory orders</CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Order
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead className="hidden md:table-cell">Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchaseOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.supplier}</TableCell>
                <TableCell className="hidden md:table-cell">{order.items.join(", ")}</TableCell>
                <TableCell>{order.total}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      order.status === "delivered" ? "default" : order.status === "approved" ? "outline" : "secondary"
                    }
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon">
                    <FileText className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Showing 3 of 3 orders</div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

