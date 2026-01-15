import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface TestimonialCardProps {
  name: string;
  rating: number;
  review: string;
  product?: string;
  image?: string;
  roomImage?: string;
}

export function TestimonialCard({ name, rating, review, product, image, roomImage }: TestimonialCardProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border/50 h-full flex flex-col">
      {roomImage && (
        <div className="relative w-full h-56 overflow-hidden">
          <ImageWithFallback 
            src={roomImage} 
            alt={`${name}'s room transformation`}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex gap-1 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < rating
                  ? "fill-amber-400 text-amber-400"
                  : "fill-stone-200 text-stone-200"
              }`}
            />
          ))}
        </div>
        
        <p className="text-muted-foreground mb-6 flex-1 leading-relaxed">"{review}"</p>
        
        <div className="flex items-center gap-3 pt-4 border-t border-border/50">
          <Avatar className="h-10 w-10">
            <AvatarImage src={image} alt={name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">{name}</p>
            {product && (
              <p className="text-muted-foreground text-xs">
                Purchased {product}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
