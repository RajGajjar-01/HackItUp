"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, ClipboardList } from "lucide-react";
import { Toaster, toast } from 'sonner';

const units = [
  'pieces',
  'grams',
  'kilograms',
  'liters',
  'milliliters',
  'ounces',
  'pounds',
  'gallons',
  'units'
];

export default function InventoryAddRemovalForm() {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    minQuantity: '',
    unit: 'pieces',
    expiryDate: '',
    cost: '',
    restaurantId: '1'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Convert numeric fields to numbers
      const payload = {
        ...formData,
        quantity: Number(formData.quantity),
        minQuantity: Number(formData.minQuantity),
        cost: Number(formData.cost)
      };

      const response = await fetch('http://localhost:3000/api/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      toast({
        title: "Success",
        description: "Inventory item updated successfully",
        variant: "default",
      });

      // Reset form after successful submission
      setFormData({
        name: '',
        category: '',
        quantity: '',
        minQuantity: '',
        unit: 'pieces',
        expiryDate: '',
        cost: '',
        restaurantId: '1'
      });

    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "Failed to update inventory item",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };    

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Package className="mr-2 h-5 w-5" />
          Add Inventory
        </CardTitle>
        <CardDescription>Update or remove inventory items</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Item Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 bg-muted/50 rounded-md"
                required
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-2 bg-muted/50 rounded-md"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full p-2 bg-muted/50 rounded-md"
                min="0"
                required
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium">Min Quantity</label>
              <input
                type="number"
                name="minQuantity"
                value={formData.minQuantity}
                onChange={handleChange}
                className="w-full p-2 bg-muted/50 rounded-md"
                min="0"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Unit</label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="w-full p-2 bg-muted/50 rounded-md"
                required
              >
                {units.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium">Expiry Date</label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                className="w-full p-2 bg-muted/50 rounded-md"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Cost</label>
              <input
                type="number"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                className="w-full p-2 bg-muted/50 rounded-md"
                min="0"
                step="0.01"
                required
              />
            </div>  
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" type="button">
              Cancel
            </Button>
            <Button type="submit">
              <ClipboardList className="mr-2 h-4 w-4" />
              Add Inventory
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}