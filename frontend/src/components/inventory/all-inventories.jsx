import { rest_id } from "@/constants";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart3, AlertTriangle, Clock } from "lucide-react";
import { useEffect, useState } from "react";

export default function AllInventories() {
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/inventory?restaurantId=${rest_id}`
        );
        console.log(rest_id);

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`API Error (${response.status}): ${text}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Invalid API response format");
        }

        const data = await response.json();
        setInventoryData(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  // Check for expiring items
  const today = new Date();
  const oneWeekFromNow = new Date();
  oneWeekFromNow.setDate(today.getDate() + 7);

  const getStatus = (quantity, minQuantity) => {
    if (quantity <= minQuantity * 0.5) return "emergency"; // New emergency level
    if (quantity <= minQuantity) return "critical";
    if (quantity <= minQuantity * 2) return "warning";
    return "normal";
  };

  // Check if an item is expiring soon
  const isItemExpiringSoon = (item) => {
    if (!item.expiryDate) return false;
    const expiryDate = new Date(item.expiryDate);
    return expiryDate <= oneWeekFromNow && expiryDate >= today;
  };

  // Get combined priority for sorting (stock status + expiry)
  const getItemPriority = (item) => {
    const stockStatus = getStatus(item.quantity, item.minQuantity);
    const isExpiring = isItemExpiringSoon(item);

    // Stock status priorities
    const stockPriority = {
      emergency: 0,
      critical: 1,
      warning: 2,
      normal: 3,
    };

    // If item is both low in stock and expiring, give it highest priority
    if (stockStatus === "emergency" && isExpiring) return 0;
    if (stockStatus === "critical" && isExpiring) return 0.5;

    // Next priority is stock level
    if (stockStatus === "emergency") return 1;
    if (stockStatus === "critical") return 2;

    // Then expiring items
    if (isExpiring) return 3;

    // Then warnings
    if (stockStatus === "warning") return 4;

    // Normal items last
    return 5;
  };

  // Sort inventory data by priority
  const sortedInventoryData = [...inventoryData].sort((a, b) => {
    // First sort by combined priority (stock + expiry)
    const priorityA = getItemPriority(a);
    const priorityB = getItemPriority(b);

    if (priorityA !== priorityB) return priorityA - priorityB;

    // Secondary sort by quantity to minimum ratio for items with same priority
    const ratioA = a.quantity / (a.minQuantity || 1);
    const ratioB = b.quantity / (b.minQuantity || 1);
    return ratioA - ratioB;
  });

  // Flag items that are expiring soon
  const hasExpiringItems = inventoryData.some((item) =>
    isItemExpiringSoon(item)
  );

  const statusCounts = sortedInventoryData.reduce(
    (acc, item) => {
      const status = getStatus(item.quantity, item.minQuantity);
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    { emergency: 0, critical: 0, warning: 0, normal: 0 }
  );

  // Count expiring items
  const expiringCount = sortedInventoryData.filter((item) =>
    isItemExpiringSoon(item)
  ).length;

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
            Inventory Error
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-64 text-destructive">
          <AlertTriangle className="h-8 w-8 mb-4" />
          <p className="text-center">{error}</p>
          <p className="text-sm mt-2">Check API endpoint /api/inventory</p>
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
        <CardDescription className="flex justify-between items-center">
          <span>{inventoryData.length} items in inventory</span>
          {hasExpiringItems && (
            <span className="flex items-center text-amber-500">
              <Clock className="h-4 w-4 mr-1" /> {expiringCount} items expiring
              soon
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Status legend at the top */}
        <div className="mb-4 pb-2 border-b">
          <div className="flex flex-wrap items-center justify-between text-sm">
            <div className="flex items-center mr-2 mb-1">
              <div className="w-3 h-3 rounded-full bg-red-600    mr-2"></div>
              <span>Emergency ({statusCounts.emergency || 0})</span>
            </div>
            <div className="flex items-center mr-2 mb-1">
              <div className="w-3 h-3 rounded-full bg-destructive mr-2"></div>
              <span>Critical ({statusCounts.critical || 0})</span>
            </div>
            <div className="flex items-center mr-2 mb-1">
              <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
              <span>Warning ({statusCounts.warning || 0})</span>
            </div>
            <div className="flex items-center mr-2 mb-1">
              <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
              <span>Expiring Soon ({expiringCount})</span>
            </div>
            <div className="flex items-center mb-1">
              <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
              <span>Normal ({statusCounts.normal || 0})</span>
            </div>
          </div>
        </div>

        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
          {sortedInventoryData.map((item) => {
            const status = getStatus(item.quantity, item.minQuantity);
            const percentage = (item.quantity / (item.minQuantity || 1)) * 100;
            const isExpiringSoon = isItemExpiringSoon(item);

            // Determine item priority for visual treatment
            const priority = getItemPriority(item);
            const isPriority = priority <= 3; // High priority items (emergency, critical, expiring)

            return (
              <div
                key={item.id}
                className={`space-y-1 p-2 rounded-md ${
                  status === "emergency"
                    ? "bg-red-50"
                    : status === "critical"
                    ? "bg-destructive/10"
                    : status === "warning"
                    ? "bg-amber-50"
                    : isExpiringSoon
                    ? "bg-yellow-50"
                    : ""
                } ${isPriority ? "border-l-4 border-l-red-500" : ""}`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span
                      className={`font-medium text-sm ${
                        status === "emergency"
                          ? "text-red-600"
                          : status === "critical"
                          ? "text-destructive"
                          : isExpiringSoon
                          ? "text-yellow-600"
                          : ""
                      }`}
                    >
                      {item.name}
                    </span>
                    {status === "emergency" && (
                      <AlertTriangle className="h-4 w-4 ml-2 text-red-600" />
                    )}
                    {status === "critical" && (
                      <AlertTriangle className="h-4 w-4 ml-2 text-destructive" />
                    )}
                    {isExpiringSoon && (
                      <Clock className="h-4 w-4 ml-2 text-amber-500" />
                    )}
                  </div>
                  <span
                    className={`text-sm ${
                      status === "emergency"
                        ? "text-red-600 font-medium"
                        : status === "critical"
                        ? "text-destructive font-medium"
                        : "text-muted-foreground"
                    }`}
                  >
                    {item.quantity} {item.unit}
                  </span>
                </div>
                <Progress
                  value={Math.min(percentage, 100)}
                  className={`h-2.5 ${
                    status === "emergency"
                      ? "bg-red-200"
                      : status === "critical"
                      ? "bg-destructive/20"
                      : status === "warning"
                      ? "bg-amber-200"
                      : isExpiringSoon
                      ? "bg-yellow-200"
                      : "bg-muted"
                  }`}
                  indicatorClassName={
                    status === "emergency"
                      ? "bg-red-600"
                      : status === "critical"
                      ? "bg-destructive"
                      : status === "warning"
                      ? "bg-amber-500"
                      : isExpiringSoon
                      ? "bg-yellow-500"
                      : undefined
                  }
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    Min: {item.minQuantity} {item.unit}
                  </span>
                  <span>Category: {item.category}</span>
                </div>
                {item.expiryDate && (
                  <div
                    className={`text-xs ${
                      isExpiringSoon
                        ? "text-amber-600 font-medium"
                        : "text-muted-foreground"
                    }`}
                  >
                    Expires: {new Date(item.expiryDate).toLocaleDateString()}
                    {isExpiringSoon && (
                      <span className="ml-1 text-red-500 font-medium">
                        (Soon)
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
