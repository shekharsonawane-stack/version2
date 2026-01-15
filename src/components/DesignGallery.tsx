import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Badge } from "./ui/badge";
import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { BeforeAfterSlider } from "./BeforeAfterSlider";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import { ConsultationBooking } from "./ConsultationBooking";
import Autoplay from "embla-carousel-autoplay";

interface DesignStyle {
  id: number;
  name: string;
  description: string;
  image: string;
  beforeImage: string;
  style: string;
  priceRange: string;
}

const livingRoomStyles: DesignStyle[] = [
  {
    id: 1,
    name: "Modern Living Room",
    description: "Clean lines and neutral tones create a sophisticated contemporary space perfect for entertaining.",
    image: "https://images.unsplash.com/photo-1667584523543-d1d9cc828a15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsaXZpbmclMjByb29tJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzU5NjU5MjM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    beforeImage: "https://images.unsplash.com/photo-1589999405517-d19e4c105649?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbXB0eSUyMGxpdmluZyUyMHJvb20lMjBtaW5pbWFsfGVufDF8fHx8MTc1OTcyMDgyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    style: "Modern",
    priceRange: "$3,000 - $5,000",
  },
  {
    id: 2,
    name: "Scandinavian Living Room",
    description: "Light woods, minimalist design, and cozy textures embody hygge and Nordic simplicity.",
    image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2FuZGluYXZpYW4lMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc1OTY1NDE5N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    beforeImage: "https://images.unsplash.com/photo-1589999405517-d19e4c105649?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbXB0eSUyMGxpdmluZyUyMHJvb20lMjBtaW5pbWFsfGVufDF8fHx8MTc1OTcyMDgyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    style: "Scandinavian",
    priceRange: "$2,500 - $4,500",
  },
  {
    id: 3,
    name: "Industrial Living Room",
    description: "Exposed brick, metal accents, and raw materials create an edgy urban aesthetic.",
    image: "https://images.unsplash.com/photo-1505873242700-f289a29e1e0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwbGl2aW5nJTIwcm9vbXxlbnwxfHx8fDE3NTk3MjAxMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    beforeImage: "https://images.unsplash.com/photo-1589999405517-d19e4c105649?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbXB0eSUyMGxpdmluZyUyMHJvb20lMjBtaW5pbWFsfGVufDF8fHx8MTc1OTcyMDgyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    style: "Industrial",
    priceRange: "$3,200 - $5,500",
  },
  {
    id: 4,
    name: "Bohemian Living Room",
    description: "Eclectic patterns, rich colors, and global-inspired pieces create a warm, artistic vibe.",
    image: "https://images.unsplash.com/photo-1600493504546-07f3cab212b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib2hlbWlhbiUyMGxpdmluZyUyMHJvb218ZW58MXx8fHwxNzU5NzIwMTIzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    beforeImage: "https://images.unsplash.com/photo-1589999405517-d19e4c105649?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbXB0eSUyMGxpdmluZyUyMHJvb20lMjBtaW5pbWFsfGVufDF8fHx8MTc1OTcyMDgyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    style: "Bohemian",
    priceRange: "$2,800 - $4,800",
  },
];

const bedroomStyles: DesignStyle[] = [
  {
    id: 5,
    name: "Minimalist Bedroom",
    description: "Serene and clutter-free space designed for ultimate relaxation and peaceful sleep.",
    image: "https://images.unsplash.com/photo-1680210850481-66ee30ca2a48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYmVkcm9vbSUyMGRlc2lnbnxlbnwxfHx8fDE3NTk2ODg4MDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    beforeImage: "https://images.unsplash.com/photo-1646558117994-a345ba8baecd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbXB0eSUyMGJlZHJvb20lMjB3aGl0ZSUyMHdhbGxzfGVufDF8fHx8MTc1OTcyMDgyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    style: "Minimalist",
    priceRange: "$2,800 - $4,200",
  },
  {
    id: 6,
    name: "Japandi Bedroom",
    description: "Japanese minimalism meets Scandinavian functionality for a zen-like retreat.",
    image: "https://images.unsplash.com/photo-1699869653495-fe26f4c70b3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmRpJTIwYmVkcm9vbXxlbnwxfHx8fDE3NTk3MjAxMjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    beforeImage: "https://images.unsplash.com/photo-1646558117994-a345ba8baecd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbXB0eSUyMGJlZHJvb20lMjB3aGl0ZSUyMHdhbGxzfGVufDF8fHx8MTc1OTcyMDgyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    style: "Japandi",
    priceRange: "$3,000 - $4,800",
  },
  {
    id: 7,
    name: "Coastal Bedroom",
    description: "Breezy blues, natural textures, and light-filled spaces evoke seaside tranquility.",
    image: "https://images.unsplash.com/photo-1602810372187-76337cedc513?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2FzdGFsJTIwYmVkcm9vbXxlbnwxfHx8fDE3NTk3MjAxMjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    beforeImage: "https://images.unsplash.com/photo-1646558117994-a345ba8baecd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbXB0eSUyMGJlZHJvb20lMjB3aGl0ZSUyMHdhbGxzfGVufDF8fHx8MTc1OTcyMDgyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    style: "Coastal",
    priceRange: "$2,600 - $4,000",
  },
  {
    id: 8,
    name: "Luxury Bedroom",
    description: "Opulent fabrics, rich finishes, and sophisticated details create a five-star hotel experience.",
    image: "https://images.unsplash.com/photo-1562438668-bcf0ca6578f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBiZWRyb29tfGVufDF8fHx8MTc1OTcyMDEyNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    beforeImage: "https://images.unsplash.com/photo-1646558117994-a345ba8baecd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbXB0eSUyMGJlZHJvb20lMjB3aGl0ZSUyMHdhbGxzfGVufDF8fHx8MTc1OTcyMDgyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    style: "Luxury",
    priceRange: "$4,500 - $7,500",
  },
];

const diningRoomStyles: DesignStyle[] = [
  {
    id: 9,
    name: "Elegant Dining Room",
    description: "Sophisticated setup perfect for hosting memorable dinner parties and gatherings.",
    image: "https://images.unsplash.com/photo-1758448500631-644bb3c1c942?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwZGluaW5nJTIwcm9vbXxlbnwxfHx8fDE3NTk2NDYwNjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    beforeImage: "https://images.unsplash.com/photo-1758405155772-ef0f0077375c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbXB0eSUyMGRpbmluZyUyMHJvb20lMjBzcGFjZXxlbnwxfHx8fDE3NTk3MjA4Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    style: "Elegant",
    priceRange: "$4,000 - $6,500",
  },
  {
    id: 10,
    name: "Farmhouse Dining Room",
    description: "Rustic charm with reclaimed wood and vintage-inspired pieces for family gatherings.",
    image: "https://images.unsplash.com/photo-1600488999806-8efb986d87b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtaG91c2UlMjBkaW5pbmclMjByb29tfGVufDF8fHx8MTc1OTcyMDEyNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    beforeImage: "https://images.unsplash.com/photo-1758405155772-ef0f0077375c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbXB0eSUyMGRpbmluZyUyMHJvb20lMjBzcGFjZXxlbnwxfHx8fDE3NTk3MjA4Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    style: "Farmhouse",
    priceRange: "$3,200 - $5,200",
  },
  {
    id: 11,
    name: "Contemporary Dining Room",
    description: "Sleek design with bold accents creating a stylish space for modern entertaining.",
    image: "https://images.unsplash.com/photo-1685644201646-9e836c398c92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBkaW5pbmclMjByb29tfGVufDF8fHx8MTc1OTY1Mzk3OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    beforeImage: "https://images.unsplash.com/photo-1758405155772-ef0f0077375c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbXB0eSUyMGRpbmluZyUyMHJvb20lMjBzcGFjZXxlbnwxfHx8fDE3NTk3MjA4Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    style: "Contemporary",
    priceRange: "$3,800 - $6,000",
  },
];

const officeStyles: DesignStyle[] = [
  {
    id: 12,
    name: "Home Office Workspace",
    description: "Professional and productive environment optimized for focus and efficiency.",
    image: "https://images.unsplash.com/photo-1669723008642-b00fa9d10b76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwb2ZmaWNlJTIwd29ya3NwYWNlfGVufDF8fHx8MTc1OTY0NDMzMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    beforeImage: "https://images.unsplash.com/photo-1692133226337-55e513450a32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbXB0eSUyMG9mZmljZSUyMHJvb20lMjBtaW5pbWFsfGVufDF8fHx8MTc1OTcyMDgyOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    style: "Modern",
    priceRange: "$2,500 - $4,000",
  },
  {
    id: 13,
    name: "Scandinavian Office",
    description: "Clean, bright workspace with natural materials promoting creativity and calm.",
    image: "https://images.unsplash.com/photo-1529338215083-dfbce6338219?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2FuZGluYXZpYW4lMjBob21lJTIwb2ZmaWNlfGVufDF8fHx8MTc1OTcyMDEyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    beforeImage: "https://images.unsplash.com/photo-1692133226337-55e513450a32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbXB0eSUyMG9mZmljZSUyMHJvb20lMjBtaW5pbWFsfGVufDF8fHx8MTc1OTcyMDgyOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    style: "Scandinavian",
    priceRange: "$2,200 - $3,800",
  },
  {
    id: 14,
    name: "Creative Workspace",
    description: "Inspiring setup with vibrant accents and flexible layout for artistic pursuits.",
    image: "https://images.unsplash.com/photo-1693159682660-c125e71844d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMHdvcmtzcGFjZSUyMG9mZmljZXxlbnwxfHx8fDE3NTk3MTM1MTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    beforeImage: "https://images.unsplash.com/photo-1692133226337-55e513450a32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbXB0eSUyMG9mZmljZSUyMHJvb20lMjBtaW5pbWFsfGVufDF8fHx8MTc1OTcyMDgyOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    style: "Creative",
    priceRange: "$2,800 - $4,500",
  },
];

interface DesignCardProps {
  design: DesignStyle;
  onViewDetails: () => void;
}

function DesignCard({ design, onViewDetails }: DesignCardProps) {
  return (
    <div className="group cursor-pointer">
      <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-stone-100 mb-4 shadow-md">
        <ImageWithFallback
          src={design.image}
          alt={design.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <Button 
            variant="secondary" 
            size="sm" 
            className="rounded-full gap-2"
            onClick={onViewDetails}
          >
            View Details
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <Badge className="absolute top-4 left-4 bg-white/95 text-stone-900 hover:bg-white/95">
          {design.style}
        </Badge>
      </div>
      <div>
        <h3 className="mb-2">{design.name}</h3>
        <p className="text-muted-foreground text-sm mb-3 leading-relaxed">
          {design.description}
        </p>
        <p className="text-sm text-stone-900">{design.priceRange}</p>
      </div>
    </div>
  );
}

interface DesignGalleryProps {
  onShopTheLook?: (designId: number) => void;
}

export function DesignGallery({ onShopTheLook }: DesignGalleryProps) {
  const [activeTab, setActiveTab] = useState("living-room");
  const [selectedDesign, setSelectedDesign] = useState<DesignStyle | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  const handleViewDetails = (design: DesignStyle) => {
    setSelectedDesign(design);
    setIsDialogOpen(true);
  };

  const handleShopThisLook = () => {
    if (selectedDesign && onShopTheLook) {
      onShopTheLook(selectedDesign.id);
      setIsDialogOpen(false);
    }
  };

  return (
    <>
      <section id="design-gallery" className="container mx-auto px-6 lg:px-8 py-24 md:py-32">
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <h1 className="mb-4 text-6xl">Design Ideas & Inspiration</h1>
          <p className="text-muted-foreground text-lg text-[20px]">
            Browse our curated lookbook of room styles and themes. From modern minimalism to cozy bohemian, discover the perfect aesthetic for your space.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 h-auto mb-12 p-1.5 bg-stone-100 rounded-xl">
            <TabsTrigger value="living-room" className="rounded-lg py-3">
              Living Room
            </TabsTrigger>
            <TabsTrigger value="bedroom" className="rounded-lg py-3">
              Bedroom
            </TabsTrigger>
            <TabsTrigger value="dining-room" className="rounded-lg py-3">
              Dining Room
            </TabsTrigger>
            <TabsTrigger value="office" className="rounded-lg py-3">
              Office
            </TabsTrigger>
          </TabsList>

          <TabsContent value="living-room" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
              {livingRoomStyles.map((design) => (
                <DesignCard 
                  key={design.id} 
                  design={design} 
                  onViewDetails={() => handleViewDetails(design)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="bedroom" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
              {bedroomStyles.map((design) => (
                <DesignCard 
                  key={design.id} 
                  design={design} 
                  onViewDetails={() => handleViewDetails(design)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="dining-room" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 max-w-5xl mx-auto">
              {diningRoomStyles.map((design) => (
                <DesignCard 
                  key={design.id} 
                  design={design} 
                  onViewDetails={() => handleViewDetails(design)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="office" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 max-w-5xl mx-auto">
              {officeStyles.map((design) => (
                <DesignCard 
                  key={design.id} 
                  design={design} 
                  onViewDetails={() => handleViewDetails(design)}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Full Screen Custom Design Banner Carousel */}
      <section className="relative w-full h-[600px] md:h-[700px] overflow-hidden">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 5000,
            }),
          ]}
          className="w-full h-full"
        >
          <CarouselContent className="h-[600px] md:h-[700px]">
            <CarouselItem>
              <div className="relative w-full h-full">
                <div className="absolute inset-0">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1758565811145-619f5e20f196?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbGVlayUyMG1vZGVybiUyMGludGVyaW9yfGVufDF8fHx8MTc1OTc1MTIzNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Sleek Modern Interior Design"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-stone-900/75 via-stone-900/65 to-stone-900/75" />
                </div>
                <div className="relative h-full flex items-center justify-center text-center px-6">
                  <div className="max-w-4xl">
                    <p className="text-white mb-8 text-[40px] md:text-[48px] drop-shadow-2xl leading-tight">
                      Can't find the perfect style? Our design team can help create a custom look just for you.
                    </p>
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="rounded-full h-14 px-10 bg-white text-stone-900 hover:bg-white/90 border-white shadow-xl hover:shadow-2xl transition-all"
                      onClick={() => setIsConsultationOpen(true)}
                    >
                      Schedule a Design Consultation
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>

            <CarouselItem>
              <div className="relative w-full h-full">
                <div className="absolute inset-0">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1638799869566-b17fa794c4de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBtb2Rlcm4lMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTk2ODkyMjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Luxury Modern Interior"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-stone-900/75 via-stone-900/65 to-stone-900/75" />
                </div>
                <div className="relative h-full flex items-center justify-center text-center px-6">
                  <div className="max-w-4xl">
                    <p className="text-white mb-8 text-[40px] md:text-[48px] drop-shadow-2xl leading-tight">
                      Experience luxury design tailored to your lifestyle and personal aesthetic.
                    </p>
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="rounded-full h-14 px-10 bg-white text-stone-900 hover:bg-white/90 border-white shadow-xl hover:shadow-2xl transition-all"
                      onClick={() => setIsConsultationOpen(true)}
                    >
                      Schedule a Design Consultation
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>

            <CarouselItem>
              <div className="relative w-full h-full">
                <div className="absolute inset-0">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1758448500631-644bb3c1c942?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwY29udGVtcG9yYXJ5JTIwbGl2aW5nfGVufDF8fHx8MTc1OTc1MTM1Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Elegant Contemporary Living"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-stone-900/75 via-stone-900/65 to-stone-900/75" />
                </div>
                <div className="relative h-full flex items-center justify-center text-center px-6">
                  <div className="max-w-4xl">
                    <p className="text-white mb-8 text-[40px] md:text-[48px] drop-shadow-2xl leading-tight">
                      Transform your space with timeless elegance and contemporary sophistication.
                    </p>
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="rounded-full h-14 px-10 bg-white text-stone-900 hover:bg-white/90 border-white shadow-xl hover:shadow-2xl transition-all"
                      onClick={() => setIsConsultationOpen(true)}
                    >
                      Schedule a Design Consultation
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>

            <CarouselItem>
              <div className="relative w-full h-full">
                <div className="absolute inset-0">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1612358780480-a80cd5b75df3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwZGVzaWduJTIwc3BhY2V8ZW58MXx8fHwxNzU5NzUxMzU2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Minimalist Design Space"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-stone-900/75 via-stone-900/65 to-stone-900/75" />
                </div>
                <div className="relative h-full flex items-center justify-center text-center px-6">
                  <div className="max-w-4xl">
                    <p className="text-white mb-8 text-[40px] md:text-[48px] drop-shadow-2xl leading-tight">
                      Embrace minimalist beauty with clean lines and purposeful design choices.
                    </p>
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="rounded-full h-14 px-10 bg-white text-stone-900 hover:bg-white/90 border-white shadow-xl hover:shadow-2xl transition-all"
                      onClick={() => setIsConsultationOpen(true)}
                    >
                      Schedule a Design Consultation
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>

            <CarouselItem>
              <div className="relative w-full h-full">
                <div className="absolute inset-0">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1758448500688-3ababa93fd67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb3BoaXN0aWNhdGVkJTIwaW50ZXJpb3IlMjBkZXNpZ258ZW58MXx8fHwxNzU5NzUxMzU2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Sophisticated Interior Design"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-stone-900/75 via-stone-900/65 to-stone-900/75" />
                </div>
                <div className="relative h-full flex items-center justify-center text-center px-6">
                  <div className="max-w-4xl">
                    <p className="text-white mb-8 text-[40px] md:text-[48px] drop-shadow-2xl leading-tight">
                      Create a sophisticated sanctuary that reflects your unique vision and style.
                    </p>
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="rounded-full h-14 px-10 bg-white text-stone-900 hover:bg-white/90 border-white shadow-xl hover:shadow-2xl transition-all"
                      onClick={() => setIsConsultationOpen(true)}
                    >
                      Schedule a Design Consultation
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>

          <CarouselPrevious className="left-4 h-12 w-12 bg-white/20 hover:bg-white/30 border-white/40 backdrop-blur-sm text-white" />
          <CarouselNext className="right-4 h-12 w-12 bg-white/20 hover:bg-white/30 border-white/40 backdrop-blur-sm text-white" />
        </Carousel>
      </section>

      {/* Before/After Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[1000px] w-full max-h-[95vh] overflow-y-auto p-8 md:p-10">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-4xl md:text-5xl mb-3">{selectedDesign?.name || "Design Preview"}</DialogTitle>
            <DialogDescription className="text-base md:text-lg">
              Drag the slider to see the dramatic transformation from an empty space to a beautifully furnished room
            </DialogDescription>
          </DialogHeader>
          
          {selectedDesign && (
            <div className="space-y-8">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <BeforeAfterSlider
                  beforeImage={selectedDesign.beforeImage}
                  afterImage={selectedDesign.image}
                  beforeLabel="Before"
                  afterLabel="After"
                />
              </div>

              <div className="bg-stone-50 rounded-2xl p-8 md:p-10 border border-stone-200">
                <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
                  <div className="flex-1">
                    <h2 className="mb-4">{selectedDesign.style} Style</h2>
                    <p className="text-muted-foreground leading-relaxed mb-6 text-lg">
                      {selectedDesign.description}
                    </p>
                    <p className="text-stone-900 text-lg">
                      <span className="text-base text-muted-foreground">Price Range: </span>
                      <span className="text-2xl">{selectedDesign.priceRange}</span>
                    </p>
                  </div>
                  <div className="flex flex-col gap-4 w-full lg:w-auto">
                    <Button size="lg" className="rounded-full gap-2 whitespace-nowrap h-14 px-10 text-base" onClick={handleShopThisLook}>
                      Shop This Look
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                    <Button size="lg" variant="outline" className="rounded-full whitespace-nowrap h-14 px-10 text-base">
                      Save Design
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Consultation Booking Dialog */}
      <ConsultationBooking 
        open={isConsultationOpen} 
        onOpenChange={setIsConsultationOpen}
      />
    </>
  );
}
