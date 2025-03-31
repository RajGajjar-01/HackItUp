"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, ShoppingBag, Utensils, Loader2 } from "lucide-react";

export default function SalesOverview() {
  const [salesData, setSalesData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [avgOrderValue, setAvgOrderValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:3000/api/sales?restaurantId=1814d447-13f8-4b35-b504-b7f2c998be4a");
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API Error (${response.status}): ${errorText}`);
        }

        const data = await response.json();
        console.log(data);

        // Validate response structure
        if (!Array.isArray(data)) {
          throw new Error("Invalid API response format");
        }

        // Calculate metrics
        const revenue = data.reduce((sum, sale) => sum + (sale.revenue || 0), 0);
        const orders = data.length;
        const avgValue = orders > 0 ? revenue / orders : 0;

        setSalesData(data);
        setTotalRevenue(revenue.toFixed(2));
        setTotalOrders(orders);
        setAvgOrderValue(avgValue.toFixed(2));
        setError(null);

      } catch (err) {
        setError(err.message);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <TrendingUp className="mr-2 h-5 w-5" />
            Sales Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <TrendingUp className="mr-2 h-5 w-5" />
            Sales Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center text-destructive p-4">
          <p>Error loading sales data:</p>
          <p className="text-sm mt-2">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <TrendingUp className="mr-2 h-5 w-5" />
          Sales Overview
        </CardTitle>
        <CardDescription>Summary of your restaurant performance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4">
          <MetricCard
            icon={<DollarSign className="h-6 w-6 text-primary" />}
            title="Total Revenue"
            value={`$${totalRevenue}`}
          />
          
          <MetricCard
            icon={<ShoppingBag className="h-6 w-6 text-primary" />}
            title="Total Orders"
            value={totalOrders}
          />
          
          <MetricCard
            icon={<Utensils className="h-6 w-6 text-primary" />}
            title="Avg. Order Value"
            value={`$${avgOrderValue}`}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function MetricCard({ icon, title, value }) {
  return (
    <div className="flex items-center p-4 bg-muted/50 rounded-lg">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mr-4">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <h4 className="text-2xl font-bold">{value}</h4>
      </div>
    </div>
  );
}