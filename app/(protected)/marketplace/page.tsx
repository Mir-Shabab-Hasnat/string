'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ShoppingCart } from "lucide-react";
import { CartDialog } from "./components/CartDialog";
import { TrendingItems } from "./components/TrendingItems";
import { ItemDialog } from "./components/ItemDialog";

interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  condition?: string;
  location?: string;
  seller: {
    id: string;
    name: string;
    image: string;
  };
}



export default function Marketplace() {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);
  const [itemDialogOpen, setItemDialogOpen] = useState(false);

  const fetchItems = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      
      const response = await fetch(`/api/marketplace?${params}`);
      const data = await response.json();
      
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching items:', error);
      setItems([]); 
    } finally {
      setIsLoading(false);
    }
  }, [search, category, setItems, setIsLoading]);

  const fetchCartCount = async () => {
    try {
      const response = await fetch('/api/cart');
      const data = await response.json();
      setCartCount(data?.items?.length || 0);
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  const addToCart = async (itemId: string) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId }),
      });

      if (response.ok) {
        toast.success("Item has been added to your cart");
        fetchCartCount();
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error("Failed to add item to cart");
    }
  };

  const handleItemClick = (item: MarketplaceItem) => {
    const dialogItem = {
      ...item,
      seller: {
        id: item.seller.id,
        name: item.seller.name,
        image: item.seller.image
      }
    };
    setSelectedItem(dialogItem);
    setItemDialogOpen(true);
  };

  useEffect(() => {
    fetchItems();
    fetchCartCount();
  }, [fetchItems]);

  return (
    <div className="container mx-auto py-8">
      <TrendingItems />
      <div className="flex items-center gap-4 mb-8">
        <Input
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Categories</SelectItem>
            <SelectItem value="TICKETS">Tickets</SelectItem>
            <SelectItem value="BOOKS">Books</SelectItem>
            <SelectItem value="MAGAZINES">Magazines</SelectItem>
            <SelectItem value="MERCHANDISE">Merchandise</SelectItem>
            <SelectItem value="OTHER">Other</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2">
          <Button onClick={() => window.location.href = '/marketplace/sell'}>
            Sell Item
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="relative"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingCart className="h-4 w-4" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div 
              key={item.id} 
              className="border rounded-lg p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleItemClick(item)}
            >
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-gray-600 mt-2 line-clamp-2">{item.description}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-xl font-bold">${item.price}</span>
                <span className="text-sm text-gray-500">{item.seller.name}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <ItemDialog 
        item={selectedItem}
        open={itemDialogOpen}
        onOpenChange={setItemDialogOpen}
        onAddToCart={addToCart}
      />

      <CartDialog 
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
      />
    </div>
  );
} 