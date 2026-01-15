import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ArrowRight, Eye } from "lucide-react";
import { trackProductView } from "../utils/journey-tracker";

interface DesignStyleCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
  features: string[];
  onExplore: () => void;
}

export function DesignStyleCard({
  id,
  name,
  description,
  image,
  features,
  onExplore
}: DesignStyleCardProps) {
  const [hasTracked, setHasTracked] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hasTracked) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTracked) {
            // Track when card becomes visible
            console.log(`👁️ Design style card viewed: ${name}`);
            trackProductView(id, `Design Style: ${name}`, 0);
            setHasTracked(true);
          }
        });
      },
      {
        threshold: 0.5, // Trigger when 50% of card is visible
        rootMargin: "0px"
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [id, name, hasTracked]);

  const handleExplore = () => {
    console.log(`🔍 Design style explored: ${name}`);
    // Track again when they actively click
    trackProductView(id, `Design Style Explored: ${name}`, 0);
    onExplore();
  };

  return (
    <div
      ref={cardRef}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* View count badge */}
        <Badge className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-stone-900 border-0">
          <Eye className="h-3 w-3 mr-1" />
          Design Style
        </Badge>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-2xl font-bold mb-2">{name}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {description}
          </p>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-2">
          {features.map((feature, idx) => (
            <Badge
              key={idx}
              variant="outline"
              className="text-xs"
            >
              {feature}
            </Badge>
          ))}
        </div>

        {/* CTA Button */}
        <Button
          onClick={handleExplore}
          className="w-full gap-2 group/btn"
          variant="outline"
        >
          Explore {name}
          <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
}
