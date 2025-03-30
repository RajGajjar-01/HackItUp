import CameraFeed from "@/components/inventory/camera-feed"
import StockLevels from "@/components/inventory/stock-levels"
import AiReplenishment from "@/components/inventory/ai-replenishment"
import PurchaseOrders from "@/components/inventory/purchase-orders"
import InventoryAddRemovalForm from "@/components/inventory/add-remove-inventory"

export default function InventoryPage() {
  return (
    <div className="container mx-auto p-4 space-y-4 font-poppins">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        <div className="flex items-center space-x-2">
          <select className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm">
            <option>Today</option>
            <option>Last Week</option>
            <option>Last Month</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Camera Feed - Takes up 2/3 of the top row on large screens */}
        <div className="lg:col-span-2 bg-card rounded-xl shadow-sm border">
          <CameraFeed />
        </div>

        {/* Stock Levels - Takes up 1/3 of the top row on large screens */}
        <div className="bg-card rounded-xl shadow-sm border">
          <StockLevels />
        </div>

        {/* AI Replenishment - Takes up 1/3 of the bottom row on large screens */}
        <div className="bg-card rounded-xl shadow-sm border">
          <AiReplenishment />
        </div>

        {/* Purchase Orders - Takes up 2/3 of the bottom row on large screens */}
        <div className="lg:col-span-2 bg-card rounded-xl shadow-sm border">
          <PurchaseOrders />
        </div>
        <div className="lg:col-span-3 bg-card rounded-xl shadow-sm border">
          <InventoryAddRemovalForm />
        </div>
      </div>
    </div>
  )
}

