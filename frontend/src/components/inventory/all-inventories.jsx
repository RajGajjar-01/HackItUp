"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart3, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";


export default function AllInventories() {
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch('/api/inventory?re');
        if (!response.ok) throw new Error('Failed to fetch inventory');
        const data = await response.json();
        console.log(data);
        setInventoryData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load inventory');
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const getStatus = (quantity, minQuantity) => {
    const percentage = (quantity / minQuantity) * 100;
    if (quantity <= minQuantity || percentage <= 30) return 'critical';
    if (percentage <= 70) return 'warning';
    return 'normal';
  };

  const statusCounts = inventoryData.reduce((acc, item) => {
    const status = getStatus(item.quantity, item.minQuantity);
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, { critical: 0, warning: 0, normal: 0 });

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <BarChart3 className="mr-2 h-5 w-5" />
            Inventory Overview
          </CardTitle>
          <CardDescription>Loading inventory data...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <BarChart3 className="mr-2 h-5 w-5" />
            Inventory Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-64 text-destructive">
          <AlertTriangle className="h-8 w-8 mb-4" />
          <p className="text-center">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <BarChart3 className="mr-2 h-5 w-5" />
          Inventory Overview
        </CardTitle>
        <CardDescription>Current stock levels and status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {inventoryData.map((item) => {
            const status = getStatus(item.quantity, item.minQuantity);
            const percentage = (item.quantity / item.minQuantity) * 100;

            return (
              <div key={item.id} className="space-y-1">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="font-medium text-sm">{item.name}</span>
                    {status === 'critical' && <AlertTriangle className="h-4 w-4 ml-2 text-destructive" />}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {item.quantity.toFixed(2)} {item.unit}
                  </span>
                </div>
                <Progress
                  value={percentage > 100 ? 100 : percentage}
                  className={`h-2 ${
                    status === 'critical'
                      ? 'bg-destructive/20'
                      : status === 'warning'
                      ? 'bg-amber-200'
                      : 'bg-muted'
                  }`}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Min: {item.minQuantity.toFixed(2)} {item.unit}</span>
                  <span>Category: {item.category}</span>
                </div>
                {item.expiryDate && (
                  <div className="text-xs text-muted-foreground">
                    Expires: {new Date(item.expiryDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-destructive mr-2"></div>
              <span>Critical ({statusCounts.critical})</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
              <span>Warning ({statusCounts.warning})</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
              <span>Normal ({statusCounts.normal})</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}