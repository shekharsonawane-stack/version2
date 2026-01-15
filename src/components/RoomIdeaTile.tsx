import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Check, ShoppingCart } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface RoomItem {
  name: string;
  price: number;
}

interface RoomIdeaTileProps {
  name: string;
  description: string;
  image: string;
  items: RoomItem[];
  totalPrice: number;
  onAddPackage?: () => void;
}

export function RoomIdeaTile({ name, description, image, items, totalPrice, onAddPackage }: RoomIdeaTileProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleAddPackage = () => {
    if (onAddPackage) {
      onAddPackage();
      setIsOpen(false);
    }
  };

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="group cursor-pointer rounded-2xl overflow-hidden bg-card border border-border/60 hover:border-border transition-all hover:shadow-lg"
      >
        <div className="aspect-[4/3] overflow-hidden">
          <ImageWithFallback
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="p-6">
          <h3 className="mb-2">{name}</h3>
          <p className="text-muted-foreground text-sm mb-4">{description}</p>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">{items.length} items</span>
            <span className="font-semibold">Starting at B${totalPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[1000px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{name}</DialogTitle>
            <DialogDescription>
              View the complete furniture collection with all included items and pricing details
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="rounded-xl overflow-hidden border border-border/60">
              <ImageWithFallback
                src={image}
                alt={name}
                className="w-full aspect-[16/10] object-cover"
              />
            </div>

            <div>
              <p className="text-muted-foreground leading-relaxed">{description}</p>
            </div>

            <div>
              <h4 className="mb-4">Included Items</h4>
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 px-4 rounded-lg bg-muted/30 border border-border/40"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      <span>{item.name}</span>
                    </div>
                    <span className="font-medium">B${item.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-border/60 pt-6 mt-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Complete Set Total</p>
                  <p className="text-3xl font-semibold">B${totalPrice.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Save 15% when you buy the set</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button className="flex-1 gap-2" size="lg" onClick={handleAddPackage}>
                  <ShoppingCart className="h-4 w-4" />
                  Add Complete Set
                </Button>
                <Button variant="outline" size="lg" className="flex-1">
                  Customize Selection
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}