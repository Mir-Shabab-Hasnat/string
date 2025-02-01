'use client';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface CartItem {
  id: string;
  quantity: number;
  marketplaceItem: {
    title: string;
    price: number;
  };
}

interface CartDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDialog({ isOpen, onClose }: CartDialogProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchCartItems();
    }
  }, [isOpen]);

  const fetchCartItems = async () => {
    try {
      const response = await fetch('/api/cart');
      const data = await response.json();
      setCartItems(data?.items || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckout = () => {
    toast.info("Checkout functionality is not implemented");
  };

  const total = cartItems.reduce(
    (sum, item) => sum + (item.marketplaceItem.price * item.quantity),
    0
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Shopping Cart</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {isLoading ? (
            <p>Loading...</p>
          ) : cartItems.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.marketplaceItem.title}</p>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-medium">${item.marketplaceItem.price * item.quantity}</p>
                </div>
              ))}
              <div className="pt-4 border-t">
                <div className="flex justify-between mb-4">
                  <span className="font-semibold">Total:</span>
                  <span className="font-semibold">${total}</span>
                </div>
                <Button className="w-full" onClick={handleCheckout}>
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 