import SalesOverview from "@/components/dashboard/sales-overview"
import TopSellingItems from "@/components/dashboard/top-selling-items"
import CategoryPerformance from "@/components/dashboard/category-performance"
import RevenueChart from "@/components/dashboard/revenue-chart"
// import AISuggestedMenu from "@/components/dashboard/ai-suggested-menu"
import AISuggestedMenu from "@/components/dashboard/menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ExpiringItems from "@/components/dashboard/expiring-items"

export default function Dashboard() {
  return (
    <div className="container mx-auto p-4 space-y-4 font-poppins">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Restaurant Dashboard</h1>
        <div className="flex items-center space-x-2">
          <select className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm">
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
            <option>Year to Date</option>
            <option>Custom Range</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SalesOverview />
        <div className="md:col-span-2">
          <RevenueChart />
        </div>
      </div>

      <Tabs defaultValue="sales" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="sales">Sales Analysis</TabsTrigger>
          <TabsTrigger value="menu">AI Menu Suggestions</TabsTrigger>
          <TabsTrigger value="items">Expiring items</TabsTrigger>
          {/* <TabsTrigger value="menu"></TabsTrigger> */}
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TopSellingItems />
            <CategoryPerformance />
          </div>
        </TabsContent>

        <TabsContent value="menu">
          <AISuggestedMenu />
        </TabsContent>
        <TabsContent value="items">
          <ExpiringItems />
        </TabsContent>
      </Tabs>
    </div>
  )
}

