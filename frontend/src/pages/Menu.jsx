"use client";

import { useEffect } from 'react';
import { rest_id } from '@/constants';

export default function Menu() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/suggestions/expiring-recipes?restaurantId=${rest_id}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data);
        
      } catch (error) {
        console.error('Fetch Error:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4 text-sm text-muted-foreground">
      Check browser console for API data
    </div>
  );
}