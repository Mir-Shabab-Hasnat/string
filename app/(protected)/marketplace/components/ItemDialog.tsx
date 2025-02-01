'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/Badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, MessageCircle, ShoppingCart } from "lucide-react";
import { useRouter } from 'next/navigation';

interface ItemDialogProps {
  item: {
    id: string;
    title: string;
    description: string;
    price: number;
    category?: string;
    condition?: string;
    location?: string;
    seller: {
      id: string;
      name: string;
      image: string;
    };
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddToCart?: (itemId: string) => void;
}

export function ItemDialog({ item, open, onOpenChange, onAddToCart }: ItemDialogProps) {
  const router = useRouter();
  
  if (!item) return null;

  const handleContactSeller = async () => {
    try {
      // Create or get conversation with the seller
      const response = await fetch('/api/conversations/ensure-with-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: item.seller.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to create conversation');
      }

      // Close the dialog and navigate to chat
      onOpenChange(false);
      router.push('/chat');
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(item.id);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{item.title}</DialogTitle>
          <DialogDescription className="text-xl font-semibold text-primary">
            ${item.price.toFixed(2)}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {/* Seller Information */}
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={item.seller.image} alt={item.seller.name} />
              <AvatarFallback>{item.seller.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{item.seller.name}</p>
            </div>
          </div>

          {/* Item Details */}
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Description</h4>
              <p className="text-muted-foreground">{item.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {item.category && (
                <div>
                  <h4 className="font-semibold mb-1">Category</h4>
                  <Badge variant="secondary">{item.category}</Badge>
                </div>
              )}
              
              {item.condition && (
                <div>
                  <h4 className="font-semibold mb-1">Condition</h4>
                  <Badge variant="outline">{item.condition}</Badge>
                </div>
              )}
            </div>

            {item.location && (
              <div>
                <h4 className="font-semibold mb-1">Location</h4>
                <p className="text-muted-foreground flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  {item.location}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button className="flex-1" onClick={handleAddToCart}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
            <Button variant="outline" className="flex-1" onClick={handleContactSeller}>
              <MessageCircle className="h-4 w-4 mr-2" />
              Contact Seller
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}