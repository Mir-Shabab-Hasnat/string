'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrendingItem {
  id: string;
  title: string;
  price: number;
  description: string;
  seller: {
    name: string;
    image: string;
  };
}

export function TrendingItems() {
  const [items, setItems] = useState<TrendingItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const trackItemInteraction = async (itemId: string, type: 'view' | 'click') => {
    try {
      await fetch(`/api/marketplace/${itemId}/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type })
      });
    } catch (error) {
      console.error(`Error tracking ${type}:`, error);
    }
  };

  // Separate effect for fetching items
  useEffect(() => {
    fetchTrendingItems();
  }, []); // Only run once on mount

  // Separate effect for tracking views and auto-sliding
  useEffect(() => {
    if (items.length === 0) return;

    // Track view for current item
    trackItemInteraction(items[currentIndex].id, 'view');

    // Set up auto-slide
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, items]); // Depend on currentIndex and items

  const fetchTrendingItems = async () => {
    try {
      const response = await fetch('/api/marketplace/trending');
      if (!response.ok) {
        throw new Error('Failed to fetch trending items');
      }
      const data = await response.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching trending items:', error);
      setItems([]);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  if (items.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden bg-accent/50 rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4">Trending Items</h2>
      <div className="relative h-[200px]">
        <div className="absolute inset-y-0 left-0 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        <div className="absolute inset-y-0 right-0 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={nextSlide}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex transition-transform duration-500 h-full" 
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {items.map((item, index) => (
            <div
              key={item.id}
              className={cn(
                "w-full flex-shrink-0 px-12 transition-opacity duration-300",
                index === currentIndex ? "opacity-100" : "opacity-0"
              )}
            >
              <div className="bg-background rounded-lg p-6 shadow-lg max-w-2xl mx-auto">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground line-clamp-2">{item.description}</p>
                  </div>
                  <span className="text-2xl font-bold">${item.price}</span>
                </div>
                <div className="flex items-center mt-4">
                  <img
                    src={item.seller.image}
                    alt={item.seller.name}
                    className="w-6 h-6 rounded-full mr-2"
                  />
                  <span className="text-sm text-muted-foreground">{item.seller.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 pb-2">
          {items.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-colors",
                index === currentIndex ? "bg-primary" : "bg-primary/30"
              )}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 