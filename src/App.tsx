import { Header } from "./components/Header";
import { MobileBottomNav } from "./components/MobileBottomNav";
import { BeforeAfterSlider } from "./components/BeforeAfterSlider";
import { ProductCard } from "./components/ProductCard";
import { TestimonialCard } from "./components/TestimonialCard";
import { RoomIdeaTile } from "./components/RoomIdeaTile";
import { DesignGallery } from "./components/DesignGallery";
import { DesignStyleCard } from "./components/DesignStyleCard";
import { HomeStagingSection } from "./components/HomeStagingSection";
import { ProjectGallery } from "./components/ProjectGallery";
import { Footer } from "./components/Footer";
import { SignInDialog } from "./components/SignInDialog";
import { RoomQuestionnaire, RoomPreferences } from "./components/RoomQuestionnaire";
import { AccountDashboard } from "./components/AccountDashboard";
import { CRMDashboard } from "./components/CRMDashboard";
import { CheckoutFlow, CartItem } from "./components/CheckoutFlow";
import { DesignChatbot } from "./components/DesignChatbot";
import { AboutPage } from "./components/AboutPage";
import { FAQPage } from "./components/FAQPage";
import { ServicesPage } from "./components/ServicesPage";
import { ContactPage } from "./components/ContactPage";
import { TermsPage } from "./components/TermsPage";
import { PrivacyPage } from "./components/PrivacyPage";
import { AdminAccess } from "./components/AdminAccess";
import { SupabaseConnectionStatus } from "./components/SupabaseConnectionStatus";
import { SupabaseDiagnostics } from "./components/SupabaseDiagnostics";
import { CRMDataSyncChecker } from "./components/CRMDataSyncChecker";
import { CampaignPopup } from "./components/CampaignPopup";
import { SurveyDisplay } from "./components/SurveyDisplay";
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { ArrowRight, Sparkles, Edit3, Truck, Play, X, RefreshCw, ChevronDown, Database } from "lucide-react";
import { Button } from "./components/ui/button";
import { Dialog, DialogContent, DialogClose, DialogTitle, DialogDescription } from "./components/ui/dialog";
import { Toaster } from "./components/ui/sonner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./components/ui/accordion";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner@2.0.3";
import { seedCRMData } from "./utils/crm-seed-data";
import { captureAbandonedCartLead } from "./utils/crm-helpers";
import { initJourneyTracking, trackPageView, trackProductView, trackAddToCart, trackRemoveFromCart, trackCartCleared, trackCartAbandoned } from "./utils/journey-tracker";

// Using Unsplash images for feature cards and logo watermark
const logoIcon = "https://images.unsplash.com/photo-1748629761551-37b2a96df328?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXJuaXR1cmUlMjBpY29uJTIwbW9kZXJufGVufDF8fHx8MTc2NzMxNTcwNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const deliveryImage = "https://images.unsplash.com/photo-1762235634111-f1c8a719c9f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXJuaXR1cmUlMjBkZWxpdmVyeSUyMHRydWNrfGVufDF8fHx8MTc2NzI2MjU2N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const returnsImage = "https://images.unsplash.com/photo-1594392173184-75833339a7ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b21lciUyMHJldHVybiUyMHNlcnZpY2V8ZW58MXx8fHwxNzY3MzE1NjY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const designSupportImage = "https://images.unsplash.com/photo-1542904990-579199bba13a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbnRlcmlvciUyMGRlc2lnbiUyMGNvbnN1bHRhdGlvbnxlbnwxfHx8fDE3NjcyODQ0MzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

const roomIdeas = [
  {
    id: 1,
    name: "Modern Living Room",
    description: "Create the perfect entertaining space with this curated collection of contemporary furniture. Featuring clean lines and neutral tones for a sophisticated look.",
    image: "https://images.unsplash.com/photo-1667584523543-d1d9cc828a15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsaXZpbmclMjByb29tJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzU5NjU5MjM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    items: [
      { name: "Modern Velvet Sofa", price: 1299 },
      { name: "Oak Coffee Table", price: 499 },
      { name: "Minimalist Armchair", price: 799 },
      { name: "Arc Floor Lamp", price: 299 },
      { name: "Decorative Rug", price: 399 },
    ],
    totalPrice: 3295,
  },
  {
    id: 2,
    name: "Minimalist Bedroom",
    description: "Transform your bedroom into a serene retreat with this minimalist collection. Designed for comfort and tranquility with a clean aesthetic.",
    image: "https://images.unsplash.com/photo-1680210850481-66ee30ca2a48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYmVkcm9vbSUyMGRlc2lnbnxlbnwxfHx8fDE3NTk2ODg4MDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    items: [
      { name: "Platform Bed Frame", price: 1199 },
      { name: "Nightstand Set (2)", price: 599 },
      { name: "Modern Dresser", price: 899 },
      { name: "Table Lamp Pair", price: 249 },
      { name: "Upholstered Bench", price: 449 },
    ],
    totalPrice: 3395,
  },
  {
    id: 3,
    name: "Elegant Dining Room",
    description: "Host unforgettable gatherings with this elegant dining collection. Combines sophistication with functionality for the perfect dining experience.",
    image: "https://images.unsplash.com/photo-1758448500631-644bb3c1c942?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwZGluaW5nJTIwcm9vbXxlbnwxfHx8fDE3NTk2NDYwNjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    items: [
      { name: "Walnut Dining Table", price: 1599 },
      { name: "Dining Chairs (6)", price: 1794 },
      { name: "Sideboard Cabinet", price: 1299 },
      { name: "Pendant Light Fixture", price: 449 },
      { name: "Wall Mirror", price: 299 },
    ],
    totalPrice: 5440,
  },
  {
    id: 4,
    name: "Home Office Workspace",
    description: "Boost your productivity with this complete home office setup. Thoughtfully designed for comfort and efficiency in your work-from-home space.",
    image: "https://images.unsplash.com/photo-1669723008642-b00fa9d10b76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwb2ZmaWNlJTIwd29ya3NwYWNlfGVufDF8fHx8MTc1OTY0NDMzMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    items: [
      { name: "Executive Desk", price: 999 },
      { name: "Ergonomic Office Chair", price: 699 },
      { name: "Modern Bookshelf", price: 649 },
      { name: "Desk Lamp", price: 149 },
      { name: "File Cabinet", price: 399 },
    ],
    totalPrice: 2895,
  },
  {
    id: 5,
    name: "Cozy Reading Nook",
    description: "Create your personal sanctuary with this cozy reading corner collection. Perfect for unwinding with a good book and a cup of tea.",
    image: "https://images.unsplash.com/photo-1730832970158-152ffa2307e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwcmVhZGluZyUyMG5vb2t8ZW58MXx8fHwxNzU5NzE1ODE4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    items: [
      { name: "Minimalist Armchair", price: 799 },
      { name: "Side Table", price: 249 },
      { name: "Arc Floor Lamp", price: 299 },
      { name: "Bookshelf", price: 549 },
      { name: "Throw Pillows & Blanket", price: 199 },
    ],
    totalPrice: 2095,
  },
  {
    id: 6,
    name: "Contemporary Apartment",
    description: "Complete apartment furniture package designed for modern urban living. Everything you need to furnish your space with style and function.",
    image: "https://images.unsplash.com/photo-1603072845032-7b5bd641a82a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTk2NTYyODF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    items: [
      { name: "Sectional Sofa", price: 2199 },
      { name: "Media Console", price: 899 },
      { name: "Coffee Table", price: 499 },
      { name: "Accent Chairs (2)", price: 1398 },
      { name: "Lighting Package", price: 599 },
    ],
    totalPrice: 5594,
  },
];

const designStyles = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean lines, neutral palettes, and functional design. Embrace simplicity with sleek furniture and uncluttered spaces that exude contemporary elegance.",
    image: "https://images.unsplash.com/photo-1763565909003-46e9dfb68a00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBtaW5pbWFsaXN0JTIwZnVybml0dXJlfGVufDF8fHx8MTc2ODI3MjU3N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    features: ["Minimalist", "Sleek Lines", "Neutral Tones", "Functional"]
  },
  {
    id: "scandinavian",
    name: "Scandinavian",
    description: "Light woods, cozy textiles, and airy spaces. Experience hygge with warm, inviting interiors that balance simplicity and comfort perfectly.",
    image: "https://images.unsplash.com/photo-1693621947607-8de05ee2f544?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2FuZGluYXZpYW4lMjBmdXJuaXR1cmUlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjgyNzI1Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    features: ["Light Wood", "Cozy", "Natural Light", "Hygge"]
  },
  {
    id: "industrial",
    name: "Industrial",
    description: "Exposed materials, metal accents, and raw textures. Channel urban loft vibes with bold, edgy pieces that celebrate authentic craftsmanship.",
    image: "https://images.unsplash.com/photo-1696420691256-b325ec3ec3a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwZnVybml0dXJlJTIwbG9mdHxlbnwxfHx8fDE3NjgyNzI1Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    features: ["Metal & Wood", "Exposed Brick", "Urban Loft", "Raw Materials"]
  },
  {
    id: "bohemian",
    name: "Bohemian",
    description: "Eclectic patterns, vibrant colors, and global influences. Create a free-spirited sanctuary with layered textures and artistic expression.",
    image: "https://images.unsplash.com/photo-1722268994698-b85790171832?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib2hlbWlhbiUyMGZ1cm5pdHVyZSUyMGRlY29yfGVufDF8fHx8MTc2ODI3MjU3OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    features: ["Colorful", "Eclectic", "Layered Textures", "Artistic"]
  }
];

const products = [
  {
    id: 1,
    name: "Modern Velvet Sofa",
    price: 1299,
    image: "https://images.unsplash.com/photo-1603192399946-8bbb0703cfc4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzb2ZhJTIwY291Y2h8ZW58MXx8fHwxNzU5NjkyMjM0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Seating",
    rating: 5,
    reviewCount: 128,
    badge: "Bestseller" as const,
    variants: [
      { color: "Navy Blue", colorHex: "#1e3a8a", material: "Velvet" },
      { color: "Charcoal Gray", colorHex: "#374151", material: "Velvet" },
      { color: "Emerald Green", colorHex: "#059669", material: "Velvet" },
      { color: "Blush Pink", colorHex: "#ec4899", material: "Velvet" },
    ],
    sizes: [
      { label: "2-Seater", dimensions: '72" W × 36" D × 32" H', priceAdjustment: 0 },
      { label: "3-Seater", dimensions: '84" W × 36" D × 32" H', priceAdjustment: 200 },
      { label: "Sectional", dimensions: '108" W × 72" D × 32" H', priceAdjustment: 500 },
    ],
    inStock: true,
  },
  {
    id: 2,
    name: "Oak Coffee Table",
    price: 499,
    image: "https://images.unsplash.com/photo-1658367754793-1200cee7b3d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBjb2ZmZWUlMjB0YWJsZXxlbnwxfHx8fDE3NTk3MTQxMDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Tables",
    rating: 5,
    reviewCount: 89,
    badge: "New" as const,
    variants: [
      { color: "Natural Oak", colorHex: "#d4a373" },
      { color: "Dark Walnut", colorHex: "#3e2723" },
      { color: "White Wash", colorHex: "#f5f5f5" },
    ],
    sizes: [
      { label: "Small", dimensions: '36" × 24"', priceAdjustment: -100 },
      { label: "Medium", dimensions: '48" × 28"', priceAdjustment: 0 },
      { label: "Large", dimensions: '60" × 32"', priceAdjustment: 150 },
    ],
    inStock: true,
  },
  {
    id: 3,
    name: "Minimalist Armchair",
    price: 799,
    image: "https://images.unsplash.com/photo-1713286663271-809d910c0c65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYXJtY2hhaXJ8ZW58MXx8fHwxNzU5NzE0MTA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Seating",
    rating: 4,
    reviewCount: 67,
    discount: 15,
    variants: [
      { color: "Beige", colorHex: "#f5f5dc", material: "Linen" },
      { color: "Light Gray", colorHex: "#d1d5db", material: "Linen" },
      { color: "Camel", colorHex: "#c19a6b", material: "Leather" },
      { color: "Black", colorHex: "#1f2937", material: "Leather" },
    ],
    inStock: true,
  },
  {
    id: 4,
    name: "Modern Bookshelf",
    price: 649,
    image: "https://images.unsplash.com/photo-1650513259622-081281181c32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBib29rc2hlbGZ8ZW58MXx8fHwxNzU5NzE0MTA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Storage",
    rating: 5,
    reviewCount: 94,
    variants: [
      { color: "White", colorHex: "#ffffff" },
      { color: "Black", colorHex: "#000000" },
      { color: "Oak", colorHex: "#c19a6b" },
    ],
    sizes: [
      { label: "3-Shelf", dimensions: '36" W × 72" H', priceAdjustment: -100 },
      { label: "5-Shelf", dimensions: '36" W × 84" H', priceAdjustment: 0 },
      { label: "7-Shelf", dimensions: '48" W × 96" H', priceAdjustment: 200 },
    ],
    inStock: true,
  },
  {
    id: 5,
    name: "Arc Floor Lamp",
    price: 299,
    image: "https://images.unsplash.com/photo-1759647020559-2f91a4290ae4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbG9vciUyMGxhbXAlMjBtb2Rlcm58ZW58MXx8fHwxNzU5NzE0MTA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Lighting",
    rating: 5,
    reviewCount: 156,
    badge: "Sale" as const,
    discount: 20,
    variants: [
      { color: "Brass", colorHex: "#b8860b", material: "Metal" },
      { color: "Matte Black", colorHex: "#000000", material: "Metal" },
      { color: "Brushed Nickel", colorHex: "#c0c0c0", material: "Metal" },
    ],
    inStock: true,
  },
  {
    id: 6,
    name: "Walnut Dining Table",
    price: 1599,
    image: "https://images.unsplash.com/photo-1525427232291-d509af8c67f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaW5pbmclMjB0YWJsZSUyMHdvb2RlbnxlbnwxfHx8fDE3NTk1OTk1MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Tables",
    rating: 5,
    reviewCount: 203,
    badge: "Bestseller" as const,
    variants: [
      { color: "Dark Walnut", colorHex: "#3e2723" },
      { color: "Medium Oak", colorHex: "#8b4513" },
      { color: "Light Ash", colorHex: "#d3d3d3" },
    ],
    sizes: [
      { label: "4-Person", dimensions: '60" × 36"', priceAdjustment: 0 },
      { label: "6-Person", dimensions: '72" × 42"', priceAdjustment: 300 },
      { label: "8-Person", dimensions: '96" × 42"', priceAdjustment: 600 },
    ],
    inStock: true,
  },
];

const testimonials = [
  {
    id: 1,
    name: "Fatima Al-Hassan",
    rating: 5,
    review: "The Modern Velvet Sofa completely transformed our living room! The quality is exceptional and it's incredibly comfortable. Best furniture purchase we've ever made.",
    product: "Modern Velvet Sofa",
    image: "https://images.unsplash.com/photo-1581065178026-390bc4e78dad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc1OTY1MTI3Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    roomImage: "https://images.unsplash.com/photo-1658893136904-63914a6b372c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBmdXJuaXNoZWQlMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc1OTcxNDEwNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: 2,
    name: "Omar Abdullah",
    rating: 5,
    review: "Amazing customer service and the delivery team was professional. The dining table is stunning and fits perfectly in our space. Highly recommend Vision Studio!",
    product: "Walnut Dining Table",
    image: "https://images.unsplash.com/photo-1672685667592-0392f458f46f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTk2NDQ4NTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    roomImage: "https://images.unsplash.com/photo-1698133469198-2459cff8665d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXJuaXNoZWQlMjBkaW5pbmclMjByb29tfGVufDF8fHx8MTc1OTcxNDgyMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: 3,
    name: "Aisha Rahman",
    rating: 5,
    review: "I was skeptical about buying furniture online, but the quality exceeded my expectations. The armchair is beautiful and well-crafted. Will definitely shop here again!",
    product: "Minimalist Armchair",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHdvbWFuJTIwaGVhZHNob3R8ZW58MXx8fHwxNzU5NjI5MTYxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    roomImage: "https://images.unsplash.com/photo-1705304368090-933597b11c55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwYmVkcm9vbSUyMGZ1cm5pdHVyZXxlbnwxfHx8fDE3NTk3MTQ4MjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: 4,
    name: "Yusuf Ahmed",
    rating: 4,
    review: "Great selection and the before/after showcase really helped me visualize the transformation. The oak coffee table is exactly what I needed for my space.",
    product: "Oak Coffee Table",
    image: "https://images.unsplash.com/photo-1611695434398-4f4b330623e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMG1hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc1OTY0ODgyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    roomImage: "https://images.unsplash.com/photo-1519086588705-c935fdedcc14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob21lJTIwb2ZmaWNlfGVufDF8fHx8MTc1OTcxNDgyMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: 5,
    name: "Mariam Khan",
    rating: 5,
    review: "The entire shopping experience was seamless. From browsing to delivery, everything was perfect. The floor lamp adds such a nice touch to our reading nook!",
    product: "Arc Floor Lamp",
    image: "https://images.unsplash.com/photo-1690444963408-9573a17a8058?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWlsaW5nJTIwd29tYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTk3MTQ2NTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    roomImage: "https://images.unsplash.com/photo-1758974835125-83ba4f9d7e25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHlsaXNoJTIwYXBhcnRtZW50JTIwaW50ZXJpb3J8ZW58MXx8fHwxNzU5NzE0ODIyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: 6,
    name: "Ibrahim Malik",
    rating: 5,
    review: "Vision Studio made redecorating our home so easy. The quality of the bookshelf is outstanding and it arrived earlier than expected. Fantastic service!",
    product: "Modern Bookshelf",
    image: "https://images.unsplash.com/photo-1719257751404-1dea075324bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMG1hbnxlbnwxfHx8fDE3NTk2NDA4NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    roomImage: "https://images.unsplash.com/photo-1758924093181-c31e7ad291cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBsaXZpbmclMjBzcGFjZXxlbnwxfHx8fDE3NTk3MTQ4MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
];

function MainApp() {
  const { t } = useLanguage();
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState(false);
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false);
  const [isSyncCheckerOpen, setIsSyncCheckerOpen] = useState(false);
  const [currentView, setCurrentView] = useState<"home" | "account" | "checkout" | "about" | "faq" | "services" | "contact" | "terms" | "privacy" | "crm">("home");
  const [user, setUser] = useState<{ name: string; email: string; userId?: string } | null>(null);
  const [userPreferences, setUserPreferences] = useState<RoomPreferences | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const abandonedCartTrackedRef = useRef(false);

  // Initialize journey tracking
  useEffect(() => {
    initJourneyTracking();
  }, []);

  // Track page view changes
  useEffect(() => {
    trackPageView(currentView);
  }, [currentView]);

  // Track abandoned cart - capture lead when user has items but doesn't complete checkout
  useEffect(() => {
    if (cart.length === 0) {
      abandonedCartTrackedRef.current = false;
      console.log("🛒 Cart is empty, resetting abandoned cart tracker");
      return;
    }

    console.log("🛒 Starting abandoned cart timer... (10 seconds)");
    console.log("🛒 Current cart:", cart.map(item => ({ name: item.name, qty: item.quantity })));
    
    // Set a timer for 10 seconds of inactivity
    const abandonmentTimer = setTimeout(() => {
      if (cart.length > 0 && !abandonedCartTrackedRef.current) {
        const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("🛒💔 ABANDONED CART DETECTED!");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("📦 Cart items:", cart.length);
        console.log("💰 Total value: B$" + cartTotal);
        console.log("🛍️ Items:", cart.map(item => `${item.name} (${item.quantity}x)`));
        
        // Track abandoned cart analytics (always track, even for non-logged-in users)
        trackCartAbandoned(cart.length, cartTotal, cart);
        abandonedCartTrackedRef.current = true;
        console.log("✅ Abandoned cart event tracked in analytics system");
        
        // Capture lead only if user is logged in
        if (user?.email) {
          console.log("👤 User logged in, capturing abandoned cart lead...");
          captureAbandonedCartLead({
            email: user.email,
            name: user.name,
            cartItems: cart,
            cartTotal: cartTotal,
          }).then(result => {
            if (result.success) {
              console.log("✅ Abandoned cart lead captured in CRM system");
              console.log("📧 Lead saved for:", user.email);
            } else {
              console.error("❌ Failed to capture abandoned cart lead:", result);
            }
          });
        } else {
          console.log("ℹ️ User not logged in, skipping CRM lead capture (analytics still tracked)");
        }
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      }
    }, 10 * 1000); // 10 seconds for testing (change to 5 * 60 * 1000 for production)

    return () => {
      console.log("🛒 Clearing abandoned cart timer");
      clearTimeout(abandonmentTimer);
    };
  }, [cart, user]);

  const handleSignIn = (userData: { name: string; email: string; userId?: string }) => {
    setUser(userData);
    setIsSignInOpen(false);
    
    // Show questionnaire only for first-time users who haven't completed it before
    if (userData.userId) {
      const hasCompletedQuestionnaire = localStorage.getItem(`questionnaire_completed_${userData.email}`);
      if (!hasCompletedQuestionnaire) {
        setIsQuestionnaireOpen(true);
      }
    }
    // Don't show duplicate toast since SignInDialog already shows one
  };

  const handleSignOut = () => {
    setUser(null);
    setUserPreferences(null);
    setCurrentView("home");
    toast.success("You've been signed out");
  };

  const handleQuestionnaireComplete = (preferences: RoomPreferences) => {
    setUserPreferences(preferences);
    
    // Mark questionnaire as completed for this user
    if (user?.email) {
      localStorage.setItem(`questionnaire_completed_${user.email}`, 'true');
    }
    
    toast.success("Your preferences have been saved! We'll personalize your experience.");
  };

  const handleViewAccount = () => {
    if (user) {
      setCurrentView("account");
    } else {
      setIsSignInOpen(true);
    }
  };

  const handleViewProducts = () => {
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
    if (currentView !== "home") {
      setCurrentView("home");
      setTimeout(() => {
        const productsSection = document.getElementById('products');
        if (productsSection) {
          productsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleViewCustomize = () => {
    const customizeSection = document.getElementById('customize-room-selection');
    if (customizeSection) {
      customizeSection.scrollIntoView({ behavior: 'smooth' });
    }
    if (currentView !== "home") {
      setCurrentView("home");
      setTimeout(() => {
        const customizeSection = document.getElementById('customize-room-selection');
        if (customizeSection) {
          customizeSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleAddToCart = (
    product: typeof products[0] | { id: number; name: string; price: number; image: string; category: string }, 
    options?: {
      variant?: { color: string; colorHex: string; material?: string };
      size?: { label: string; dimensions?: string; priceAdjustment?: number };
      quantity?: number;
    }
  ) => {
    const quantity = options?.quantity || 1;
    const finalPrice = options?.size?.priceAdjustment
      ? product.price + options.size.priceAdjustment
      : product.price;
    
    const productName = [
      product.name,
      options?.variant?.color,
      options?.size?.label
    ].filter(Boolean).join(" - ");
    
    console.log(`🛒 Adding to cart: ${productName} (ID: ${product.id}, Price: $${finalPrice}, Qty: ${quantity})`);
    
    // Track add to cart event
    trackAddToCart(product.id.toString(), productName, finalPrice, quantity);
    
    const existingItem = cart.find(item => 
      item.id === product.id && 
      item.name === productName
    );
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id && item.name === productName
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
      toast.success(`Added ${quantity} more to cart`);
    } else {
      setCart([...cart, {
        id: product.id,
        name: productName,
        price: finalPrice,
        quantity: quantity,
        image: product.image,
        category: product.category
      }]);
      toast.success(`${productName} added to cart`);
    }
  };

  const handleViewCart = () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    setCurrentView("checkout");
  };

  const handleCheckoutComplete = (orderNumber: string) => {
    setCart([]);
    abandonedCartTrackedRef.current = false; // Reset tracking on successful checkout
    setCurrentView("account");
    toast.success(`Order ${orderNumber} placed successfully!`);
  };

  const handleCheckoutClose = () => {
    // Track abandoned cart when user closes checkout with items still in cart
    if (cart.length > 0 && !abandonedCartTrackedRef.current) {
      const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("🚪 User closed checkout - tracking abandonment");
      console.log("📦 Cart items:", cart.length);
      console.log("💰 Total value: B$" + cartTotal);
      
      // Track abandoned cart analytics (always track, even for non-logged-in users)
      trackCartAbandoned(cart.length, cartTotal, cart);
      abandonedCartTrackedRef.current = true;
      console.log("✅ Abandoned cart tracked immediately (user closed checkout)");
      
      // Capture lead only if user is logged in
      if (user?.email) {
        console.log("👤 User logged in, capturing abandoned cart lead...");
        captureAbandonedCartLead({
          email: user.email,
          name: user.name,
          cartItems: cart,
          cartTotal: cartTotal,
        }).then(result => {
          if (result.success) {
            console.log("✅ Abandoned cart lead captured in CRM");
          } else {
            console.error("❌ Failed to capture lead:", result);
          }
        });
      }
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    }
    setCurrentView("home");
  };

  const handleShopTheLook = () => {
    // Add all items from the Modern Living Room showcase
    const showcaseItems = [
      { id: 1, name: "Modern Velvet Sofa", price: 1299, image: "https://images.unsplash.com/photo-1603192399946-8bbb0703cfc4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzb2ZhJTIwY291Y2h8ZW58MXx8fHwxNzU5NjkyMjM0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", category: "Seating" },
      { id: 2, name: "Oak Coffee Table", price: 499, image: "https://images.unsplash.com/photo-1658367754793-1200cee7b3d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBjb2ZmZWUlMjB0YWJsZXxlbnwxfHx8fDE3NTk3MTQxMDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", category: "Tables" },
      { id: 3, name: "Minimalist Armchair", price: 799, image: "https://images.unsplash.com/photo-1713286663271-809d910c0c65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYXJtY2hhaXJ8ZW58MXx8fHwxNzU5NzE0MTA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", category: "Seating" },
      { id: 5, name: "Arc Floor Lamp", price: 299, image: "https://images.unsplash.com/photo-1759647020559-2f91a4290ae4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbG9vciUyMGxhbXAlMjBtb2Rlcm58ZW58MXx8fHwxNzU5NzE0MTA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", category: "Lighting" },
      { id: 7, name: "Decorative Rug", price: 399, image: "https://images.unsplash.com/photo-1615971677499-5467cbab01c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBydWd8ZW58MXx8fHwxNzU5NzUxOTc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", category: "Decor" },
    ];

    let itemsAdded = 0;
    const updatedCart = [...cart];

    showcaseItems.forEach((item) => {
      const existingItem = updatedCart.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        updatedCart.push({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
          image: item.image,
          category: item.category
        });
        itemsAdded++;
      }
    });

    setCart(updatedCart);
    
    if (itemsAdded === showcaseItems.length) {
      toast.success(`Added complete Modern Living Room set (${showcaseItems.length} items) to cart!`);
    } else if (itemsAdded > 0) {
      toast.success(`Added ${itemsAdded} new items to cart (${showcaseItems.length - itemsAdded} already in cart)`);
    } else {
      toast.success(`Updated quantities for Modern Living Room set`);
    }
  };

  const handleClearCart = () => {
    const itemCount = cart.length;
    const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    // Track cart clearing
    trackCartCleared(itemCount, cartTotal);
    
    setCart([]);
    abandonedCartTrackedRef.current = false; // Reset abandoned cart tracking
    toast.success(`Cleared ${itemCount} ${itemCount === 1 ? 'item' : 'items'} from cart`);
  };

  const handleRemoveFromCart = (itemId: number, itemName: string) => {
    const itemToRemove = cart.find(item => item.id === itemId && item.name === itemName);
    
    if (itemToRemove) {
      // Track removal
      trackRemoveFromCart(
        itemId.toString(), 
        itemName, 
        itemToRemove.price, 
        itemToRemove.quantity
      );
      
      // Remove from cart
      setCart(cart.filter(item => !(item.id === itemId && item.name === itemName)));
      toast.success(`Removed ${itemName} from cart`);
    }
  };

  const handleAddRoomPackage = (roomId: number) => {
    const roomPackage = roomIdeas.find(room => room.id === roomId);
    if (!roomPackage) {
      toast.error("Room package not found");
      return;
    }

    // Add the package as a single bundle item
    const packageItem = {
      id: roomPackage.id + 20000, // Offset ID to avoid conflicts
      name: `${roomPackage.name} - Complete Set`,
      price: roomPackage.totalPrice,
      image: roomPackage.image,
      category: 'Room Package'
    };

    console.log(`🛒 Adding room package to cart: ${packageItem.name} (ID: ${packageItem.id}, Price: B$${packageItem.price})`);

    // Track add to cart event
    trackAddToCart(packageItem.id.toString(), packageItem.name, packageItem.price, 1);

    const existingItem = cart.find(item => item.id === packageItem.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === packageItem.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
      toast.success(`Added another ${packageItem.name} to cart`);
    } else {
      setCart([...cart, {
        id: packageItem.id,
        name: packageItem.name,
        price: packageItem.price,
        quantity: 1,
        image: packageItem.image,
        category: packageItem.category
      }]);
      toast.success(`${packageItem.name} added to cart!`);
    }
  };

  const handleShopDesignStyle = (designId: number) => {
    // Map design styles to furniture packages
    const designPackages: { [key: number]: Array<{ id: number; name: string; price: number; image: string; category: string }> } = {
      // Living Room Styles
      1: [ // Modern Living Room
        { id: 1, name: "Modern Velvet Sofa", price: 1299, image: "https://images.unsplash.com/photo-1603192399946-8bbb0703cfc4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzb2ZhJTIwY291Y2h8ZW58MXx8fHwxNzU5NjkyMjM0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", category: "Seating" },
        { id: 2, name: "Oak Coffee Table", price: 499, image: "https://images.unsplash.com/photo-1658367754793-1200cee7b3d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBjb2ZmZWUlMjB0YWJsZXxlbnwxfHx8fDE3NTk3MTQxMDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", category: "Tables" },
        { id: 3, name: "Minimalist Armchair", price: 799, image: "https://images.unsplash.com/photo-1713286663271-809d910c0c65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYXJtY2hhaXJ8ZW58MXx8fHwxNzU5NzE0MTA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", category: "Seating" },
        { id: 5, name: "Arc Floor Lamp", price: 299, image: "https://images.unsplash.com/photo-1759647020559-2f91a4290ae4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbG9vciUyMGxhbXAlMjBtb2Rlcm58ZW58MXx8fHwxNzU5NzE0MTA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", category: "Lighting" },
        { id: 7, name: "Decorative Rug", price: 399, image: "https://images.unsplash.com/photo-1615971677499-5467cbab01c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBydWd8ZW58MXx8fHwxNzU5NzUxOTc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", category: "Decor" },
      ],
      2: [ // Scandinavian Living Room
        { id: 1, name: "Modern Velvet Sofa", price: 1299, image: "https://images.unsplash.com/photo-1603192399946-8bbb0703cfc4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzb2ZhJTIwY291Y2h8ZW58MXx8fHwxNzU5NjkyMjM0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", category: "Seating" },
        { id: 2, name: "Oak Coffee Table", price: 499, image: "https://images.unsplash.com/photo-1658367754793-1200cee7b3d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBjb2ZmZWUlMjB0YWJsZXxlbnwxfHx8fDE3NTk3MTQxMDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", category: "Tables" },
        { id: 3, name: "Minimalist Armchair", price: 799, image: "https://images.unsplash.com/photo-1713286663271-809d910c0c65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYXJtY2hhaXJ8ZW58MXx8fHwxNzU5NzE0MTA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", category: "Seating" },
        { id: 4, name: "Modern Bookshelf", price: 649, image: "https://images.unsplash.com/photo-1650513259622-081281181c32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBib29rc2hlbGZ8ZW58MXx8fHwxNzU5NzE0MTA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", category: "Storage" },
      ],
      3: [ // Industrial Living Room
        { id: 1, name: "Modern Velvet Sofa", price: 1299, image: "https://images.unsplash.com/photo-1603192399946-8bbb0703cfc4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzb2ZhJTIwY291Y2h8ZW58MXx8fHwxNzU5NjkyMjM0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", category: "Seating" },
        { id: 2, name: "Oak Coffee Table", price: 499, image: "https://images.unsplash.com/photo-1658367754793-1200cee7b3d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBjb2ZmZWUlMjB0YWJsZXxlbnwxfHx8fDE3NTk3MTQxMDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", category: "Tables" },
        { id: 4, name: "Modern Bookshelf", price: 649, image: "https://images.unsplash.com/photo-1650513259622-081281181c32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBib29rc2hlbGZ8ZW58MXx8fHwxNzU5NzE0MTA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", category: "Storage" },
        { id: 5, name: "Arc Floor Lamp", price: 299, image: "https://images.unsplash.com/photo-1759647020559-2f91a4290ae4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbG9vciUyMGxhbXAlMjBtb2Rlcm58ZW58MXx8fHwxNzU5NzE0MTA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", category: "Lighting" },
      ],
      4: [ // Bohemian Living Room
        { id: 1, name: "Modern Velvet Sofa", price: 1299, image: "https://images.unsplash.com/photo-1603192399946-8bbb0703cfc4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzb2ZhJTIwY291Y2h8ZW58MXx8fHwxNzU5NjkyMjM0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", category: "Seating" },
        { id: 3, name: "Minimalist Armchair", price: 799, image: "https://images.unsplash.com/photo-1713286663271-809d910c0c65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYXJtY2hhaXJ8ZW58MXx8fHwxNzU5NzE0MTA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", category: "Seating" },
        { id: 7, name: "Decorative Rug", price: 399, image: "https://images.unsplash.com/photo-1615971677499-5467cbab01c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBydWd8ZW58MXx8fHwxNzU5NzUxOTc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", category: "Decor" },
        { id: 5, name: "Arc Floor Lamp", price: 299, image: "https://images.unsplash.com/photo-1759647020559-2f91a4290ae4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbG9vciUyMGxhbXAlMjBtb2Rlcm58ZW58MXx8fHwxNzU5NzE0MTA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", category: "Lighting" },
      ],
      // Bedroom Styles
      5: [ // Minimalist Bedroom
        { id: 8, name: "Platform Bed Frame", price: 1199, image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiZWQlMjBmcmFtZXxlbnwxfHx8fDE3NTk3NTU1Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080", category: "Bedroom" },
        { id: 9, name: "Nightstand", price: 299, image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBuaWdodHN0YW5kfGVufDF8fHx8MTc1OTc1NTU4MHww&ixlib=rb-4.1.0&q=80&w=1080", category: "Bedroom" },
        { id: 3, name: "Minimalist Armchair", price: 799, image: "https://images.unsplash.com/photo-1713286663271-809d910c0c65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYXJtY2hhaXJ8ZW58MXx8fHwxNzU5NzE0MTA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", category: "Seating" },
      ],
      6: [ // Japandi Bedroom
        { id: 8, name: "Platform Bed Frame", price: 1199, image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiZWQlMjBmcmFtZXxlbnwxfHx8fDE3NTk3NTU1Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080", category: "Bedroom" },
        { id: 9, name: "Nightstand", price: 299, image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBuaWdodHN0YW5kfGVufDF8fHx8MTc1OTc1NTU4MHww&ixlib=rb-4.1.0&q=80&w=1080", category: "Bedroom" },
        { id: 4, name: "Modern Bookshelf", price: 649, image: "https://images.unsplash.com/photo-1650513259622-081281181c32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBib29rc2hlbGZ8ZW58MXx8fHwxNzU5NzE0MTA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", category: "Storage" },
      ],
      7: [ // Coastal Bedroom
        { id: 8, name: "Platform Bed Frame", price: 1199, image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiZWQlMjBmcmFtZXxlbnwxfHx8fDE3NTk3NTU1Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080", category: "Bedroom" },
        { id: 9, name: "Nightstand", price: 299, image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBuaWdodHN0YW5kfGVufDF8fHx8MTc1OTc1NTU4MHww&ixlib=rb-4.1.0&q=80&w=1080", category: "Bedroom" },
        { id: 7, name: "Decorative Rug", price: 399, image: "https://images.unsplash.com/photo-1615971677499-5467cbab01c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBydWd8ZW58MXx8fHwxNzU5NzUxOTc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", category: "Decor" },
      ],
      8: [ // Luxury Bedroom
        { id: 8, name: "Platform Bed Frame", price: 1199, image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiZWQlMjBmcmFtZXxlbnwxfHx8fDE3NTk3NTU1Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080", category: "Bedroom" },
        { id: 9, name: "Nightstand", price: 299, image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBuaWdodHN0YW5kfGVufDF8fHx8MTc1OTc1NTU4MHww&ixlib=rb-4.1.0&q=80&w=1080", category: "Bedroom" },
        { id: 3, name: "Minimalist Armchair", price: 799, image: "https://images.unsplash.com/photo-1713286663271-809d910c0c65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYXJtY2hhaXJ8ZW58MXx8fHwxNzU5NzE0MTA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", category: "Seating" },
        { id: 5, name: "Arc Floor Lamp", price: 299, image: "https://images.unsplash.com/photo-1759647020559-2f91a4290ae4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbG9vciUyMGxhbXAlMjBtb2Rlcm58ZW58MXx8fHwxNzU5NzE0MTA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", category: "Lighting" },
      ],
      // Dining Room Styles
      9: [ // Elegant Dining Room
        { id: 6, name: "Walnut Dining Table", price: 1599, image: "https://images.unsplash.com/photo-1525427232291-d509af8c67f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaW5pbmclMjB0YWJsZSUyMHdvb2RlbnxlbnwxfHx8fDE3NTk1OTk1MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", category: "Tables" },
        { id: 10, name: "Dining Chairs Set", price: 999, image: "https://images.unsplash.com/photo-1604926652539-92e4c77d0e03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkaW5pbmclMjBjaGFpcnN8ZW58MXx8fHwxNzU5NzU1NjExfDA&ixlib=rb-4.1.0&q=80&w=1080", category: "Seating" },
        { id: 5, name: "Arc Floor Lamp", price: 299, image: "https://images.unsplash.com/photo-1759647020559-2f91a4290ae4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbG9vciUyMGxhbXAlMjBtb2Rlcm58ZW58MXx8fHwxNzU5NzE0MTA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", category: "Lighting" },
      ],
      10: [ // Farmhouse Dining Room
        { id: 6, name: "Walnut Dining Table", price: 1599, image: "https://images.unsplash.com/photo-1525427232291-d509af8c67f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaW5pbmclMjB0YWJsZSUyMHdvb2RlbnxlbnwxfHx8fDE3NTk1OTk1MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", category: "Tables" },
        { id: 10, name: "Dining Chairs Set", price: 999, image: "https://images.unsplash.com/photo-1604926652539-92e4c77d0e03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkaW5pbmclMjBjaGFpcnN8ZW58MXx8fHwxNzU5NzU1NjExfDA&ixlib=rb-4.1.0&q=80&w=1080", category: "Seating" },
        { id: 4, name: "Modern Bookshelf", price: 649, image: "https://images.unsplash.com/photo-1650513259622-081281181c32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBib29rc2hlbGZ8ZW58MXx8fHwxNzU5NzE0MTA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", category: "Storage" },
      ],
      11: [ // Contemporary Dining Room
        { id: 6, name: "Walnut Dining Table", price: 1599, image: "https://images.unsplash.com/photo-1525427232291-d509af8c67f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaW5pbmclMjB0YWJsZSUyMHdvb2RlbnxlbnwxfHx8fDE3NTk1OTk1MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", category: "Tables" },
        { id: 10, name: "Dining Chairs Set", price: 999, image: "https://images.unsplash.com/photo-1604926652539-92e4c77d0e03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkaW5pbmclMjBjaGFpcnN8ZW58MXx8fHwxNzU5NzU1NjExfDA&ixlib=rb-4.1.0&q=80&w=1080", category: "Seating" },
        { id: 5, name: "Arc Floor Lamp", price: 299, image: "https://images.unsplash.com/photo-1759647020559-2f91a4290ae4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbG9vciUyMGxhbXAlMjBtb2Rlcm58ZW58MXx8fHwxNzU5NzE0MTA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", category: "Lighting" },
      ],
      // Office Styles
      12: [ // Home Office Workspace
        { id: 11, name: "Executive Desk", price: 999, image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkZXNrfGVufDF8fHx8MTc1OTc1NTY0M3ww&ixlib=rb-4.1.0&q=80&w=1080", category: "Office" },
        { id: 12, name: "Office Chair", price: 699, image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjBjaGFpciUyMG1vZGVybnxlbnwxfHx8fDE3NTk3NTU2NDN8MA&ixlib=rb-4.1.0&q=80&w=1080", category: "Office" },
        { id: 4, name: "Modern Bookshelf", price: 649, image: "https://images.unsplash.com/photo-1650513259622-081281181c32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBib29rc2hlbGZ8ZW58MXx8fHwxNzU5NzE0MTA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", category: "Storage" },
      ],
      13: [ // Scandinavian Office
        { id: 11, name: "Executive Desk", price: 999, image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkZXNrfGVufDF8fHx8MTc1OTc1NTY0M3ww&ixlib=rb-4.1.0&q=80&w=1080", category: "Office" },
        { id: 12, name: "Office Chair", price: 699, image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjBjaGFpciUyMG1vZGVybnxlbnwxfHx8fDE3NTk3NTU2NDN8MA&ixlib=rb-4.1.0&q=80&w=1080", category: "Office" },
        { id: 5, name: "Arc Floor Lamp", price: 299, image: "https://images.unsplash.com/photo-1759647020559-2f91a4290ae4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbG9vciUyMGxhbXAlMjBtb2Rlcm58ZW58MXx8fHwxNzU5NzE0MTA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", category: "Lighting" },
      ],
      14: [ // Creative Workspace
        { id: 11, name: "Executive Desk", price: 999, image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkZXNrfGVufDF8fHx8MTc1OTc1NTY0M3ww&ixlib=rb-4.1.0&q=80&w=1080", category: "Office" },
        { id: 12, name: "Office Chair", price: 699, image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjBjaGFpciUyMG1vZGVybnxlbnwxfHx8fDE3NTk3NTU2NDN8MA&ixlib=rb-4.1.0&q=80&w=1080", category: "Office" },
        { id: 4, name: "Modern Bookshelf", price: 649, image: "https://images.unsplash.com/photo-1650513259622-081281181c32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBib29rc2hlbGZ8ZW58MXx8fHwxNzU5NzE0MTA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", category: "Storage" },
        { id: 5, name: "Arc Floor Lamp", price: 299, image: "https://images.unsplash.com/photo-1759647020559-2f91a4290ae4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbG9vciUyMGxhbXAlMjBtb2Rlcm58ZW58MXx8fHwxNzU5NzE0MTA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", category: "Lighting" },
      ],
    };

    const packageItems = designPackages[designId];
    
    if (!packageItems) {
      toast.error("Design package not available");
      return;
    }

    let itemsAdded = 0;
    const updatedCart = [...cart];

    packageItems.forEach((item) => {
      const existingItem = updatedCart.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        updatedCart.push({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
          image: item.image,
          category: item.category
        });
        itemsAdded++;
      }
    });

    setCart(updatedCart);
    
    if (itemsAdded === packageItems.length) {
      toast.success(`Added complete design package (${packageItems.length} items) to cart!`);
    } else if (itemsAdded > 0) {
      toast.success(`Added ${itemsAdded} new items to cart (${packageItems.length - itemsAdded} already in cart)`);
    } else {
      toast.success(`Updated quantities for design package`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
        <Header 
          user={user} 
          onSignInClick={() => setIsSignInOpen(true)}
          onSignOut={handleSignOut}
          onViewAccount={handleViewAccount}
          onNavigateHome={() => setCurrentView("home")}
          cartItemCount={cart.length}
          onCartClick={handleViewCart}
          onAdminClick={() => setCurrentView("crm")}
        />
      
      {currentView === "checkout" ? (
        <CheckoutFlow
          cartItems={cart}
          onCheckoutComplete={handleCheckoutComplete}
          onClose={handleCheckoutClose}
          user={user}
          onClearCart={handleClearCart}
          onRemoveFromCart={handleRemoveFromCart}
        />
      ) : currentView === "account" && user ? (
        <AccountDashboard user={user} />
      ) : currentView === "crm" ? (
        <CRMDashboard />
      ) : currentView === "about" ? (
        <AboutPage />
      ) : currentView === "faq" ? (
        <FAQPage />
      ) : currentView === "services" ? (
        <ServicesPage />
      ) : currentView === "contact" ? (
        <ContactPage />
      ) : currentView === "terms" ? (
        <TermsPage />
      ) : currentView === "privacy" ? (
        <PrivacyPage />
      ) : (
      <main className="flex-1">
        {/* Hero Section - Full Screen */}
        <section className="relative h-screen min-h-[600px] max-h-[900px]">
          {/* Hero Banner Video - Edge to Edge */}
          <div className="absolute inset-0 overflow-hidden">
            <iframe
              src="https://www.youtube.com/embed/afCtix2-BGI?autoplay=1&mute=1&loop=1&playlist=afCtix2-BGI&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] pointer-events-none"
              allow="autoplay; encrypted-media"
              title="Vision Studio Hero Video"
            />
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-stone-900/40 via-stone-900/20 to-stone-900/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 via-transparent to-transparent" />
          </div>

          {/* Hero Content Overlay */}
          <div className="relative h-full flex flex-col items-start justify-center px-6 lg:px-8">
            <div className="container mx-auto">
              <div className="max-w-4xl">
                <div className="inline-block mb-6 px-4 py-2 rounded-full bg-white/95 border border-white/20 shadow-lg backdrop-blur-sm">
                  <p className="text-sm text-stone-900 font-medium">{t.hero.badge}</p>
                </div>
                <h1 className="mb-6 text-white drop-shadow-2xl text-[70px]">{t.hero.title}</h1>
                <p className="text-white/95 text-lg md:text-xl max-w-2xl leading-relaxed mb-10 drop-shadow-lg">
                  {t.hero.subtitle}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="gap-2 rounded-full h-14 px-10 bg-white text-stone-900 hover:bg-white/90 shadow-xl" asChild>
                    <a href="#room-ideas">
                      {t.hero.cta}
                      <ArrowRight className="h-5 w-5" />
                    </a>
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="gap-2 rounded-full h-14 px-10 bg-transparent text-white border-2 border-white hover:bg-white/10 shadow-xl"
                    onClick={() => setIsVideoOpen(true)}
                  >
                    {t.hero.ctaSecondary}
                    <Play className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 rounded-full border-2 border-white/60 flex items-start justify-center p-2">
              <div className="w-1 h-2 bg-white/60 rounded-full" />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="relative py-24 md:py-32 overflow-hidden">
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.015] pointer-events-none"
            style={{
              backgroundImage: `url(${logoIcon})`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundSize: '70%',
              width: '100%',
              height: '100%',
              filter: 'grayscale(100%)'
            }}
          />
          <div className="container mx-auto px-6 lg:px-8 relative z-10">
            <div className="mb-16 text-center max-w-3xl mx-auto">
              <h1 className="mb-4 text-[60px]">{t.howItWorks.title}</h1>
              <p className="text-muted-foreground text-lg text-[20px]">
                {t.howItWorks.subtitle}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12 lg:gap-16 mb-16">
              <div className="text-center group">
                <div className="relative mb-8">
                  <div className="w-64 h-64 rounded-full overflow-hidden mx-auto border-4 border-stone-200 transition-all group-hover:border-stone-900 group-hover:scale-105 shadow-lg bg-white">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1662059360857-9a46f20c85f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBmdXJuaXR1cmUlMjByb29tfGVufDF8fHx8MTc1OTc0MDYzN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      alt="Choose Your Style"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-stone-900/0 to-stone-900/0 group-hover:from-stone-900/70 transition-all rounded-[346px] bg-[rgba(255,253,253,0)]" />
                  </div>
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-stone-900 text-white flex items-center justify-center shadow-xl z-10">
                    <span className="text-xl">1</span>
                  </div>
                </div>
                <h3 className="mb-4 text-[32px]">{t.howItWorks.step1Title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t.howItWorks.step1Desc}
                </p>
              </div>

              <div className="text-center group">
                <div className="relative mb-8">
                  <div className="w-64 h-64 rounded-full overflow-hidden mx-auto border-4 border-stone-200 transition-all group-hover:border-stone-900 group-hover:scale-105 shadow-lg bg-white">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1759462692354-404b2c995c99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiYW5rJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzU5NzQwNzczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      alt="Customize & Finance"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-stone-900/0 to-stone-900/0 group-hover:from-stone-900/70 transition-all px-[3px] py-[0px] rounded-[243px]" />
                  </div>
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-stone-900 text-white flex items-center justify-center shadow-xl z-10">
                    <span className="text-xl">2</span>
                  </div>
                </div>
                <h3 className="mb-4 text-[32px]">{t.howItWorks.step2Title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t.howItWorks.step2Desc}
                </p>
              </div>

              <div className="text-center group">
                <div className="relative mb-8">
                  <div className="w-64 h-64 rounded-full overflow-hidden mx-auto border-4 border-stone-200 transition-all group-hover:border-stone-900 group-hover:scale-105 shadow-lg bg-white">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1645526816819-f4c8cdaf47fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXJuaXR1cmUlMjBkZWxpdmVyeSUyMGhvbWV8ZW58MXx8fHwxNzU5NzQwMDEyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      alt="Delivery & Setup"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-stone-900/0 to-stone-900/0 group-hover:from-stone-900/70 transition-all rounded-[172px]" />
                  </div>
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-stone-900 text-white flex items-center justify-center shadow-xl z-10">
                    <span className="text-xl">3</span>
                  </div>
                </div>
                <h3 className="mb-4 text-[32px]">{t.howItWorks.step3Title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t.howItWorks.step3Desc}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Design Gallery - Lookbook Style */}
        <DesignGallery onShopTheLook={handleShopDesignStyle} />

        {/* Design & Inspiration Section - Design Styles */}
        <section className="relative bg-stone-50 py-24 md:py-32 overflow-hidden">
          <div 
            className="absolute inset-0 opacity-[0.02] pointer-events-none"
            style={{
              backgroundImage: `url(${logoIcon})`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundSize: '60%',
              filter: 'grayscale(100%)'
            }}
          />
          <div className="container mx-auto px-6 lg:px-8 relative z-10">
            <div className="mb-16 text-center max-w-3xl mx-auto">
              <h1 className="mb-4 text-[48px]">Design & Inspiration</h1>
              <p className="text-muted-foreground text-lg text-[20px]">
                Discover your perfect style. Explore curated design aesthetics that speak to your personality and transform your space.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {designStyles.map((style) => (
                <DesignStyleCard
                  key={style.id}
                  id={style.id}
                  name={style.name}
                  description={style.description}
                  image={style.image}
                  features={style.features}
                  onExplore={() => {
                    toast.success(`Exploring ${style.name} style!`);
                    // Scroll to products section
                    document.getElementById('featured-products')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Room Ideas Section */}
        <section id="room-ideas" className="relative bg-white py-24 md:py-32 overflow-hidden">
          <div 
            className="absolute inset-0 opacity-[0.02] pointer-events-none"
            style={{
              backgroundImage: `url(${logoIcon})`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundSize: '60%',
              filter: 'grayscale(100%)'
            }}
          />
          <div className="container mx-auto px-6 lg:px-8 relative z-10">
            <div className="mb-16 text-center max-w-3xl mx-auto">
              <h1 className="mb-4 text-[48px]">{t.roomIdeas.title}</h1>
              <p className="text-muted-foreground text-lg text-[20px]">
                {t.roomIdeas.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {roomIdeas.map((room) => (
                <RoomIdeaTile
                  key={room.id}
                  name={room.name}
                  description={room.description}
                  image={room.image}
                  items={room.items}
                  totalPrice={room.totalPrice}
                  onAddPackage={() => handleAddRoomPackage(room.id)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Home Staging Section */}
        <HomeStagingSection onAddToCart={handleAddToCart} />

        {/* Before/After Showcase */}
        <section id="showcase" className="relative w-full h-screen min-h-[700px] max-h-[1000px] bg-stone-950">
          <div className="absolute inset-0 flex flex-col">
            {/* Header Content */}
            <div className="flex-shrink-0 text-center pt-12 pb-8 px-6 bg-gradient-to-b from-stone-950/95 to-transparent z-10">
              <h1 className="mb-4 text-[64px] text-white drop-shadow-2xl">{t.showcase.title}</h1>
              <p className="text-white/90 text-lg drop-shadow-lg text-[20px]">
                {t.showcase.subtitle}
              </p>
            </div>
            
            {/* Before/After Slider - Full Screen */}
            <div className="flex-1 relative">
              <BeforeAfterSlider
                beforeImage="https://images.unsplash.com/photo-1722650362357-7cb7d35a45eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbXB0eSUyMG1pbmltYWxpc3QlMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc1OTcxNDEwNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                afterImage="https://images.unsplash.com/photo-1658893136904-63914a6b372c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBmdXJuaXNoZWQlMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc1OTcxNDEwNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                beforeLabel={t.showcase.beforeLabel}
                afterLabel={t.showcase.afterLabel}
              />
            </div>

            {/* CTA Button */}
            <div className="flex-shrink-0 text-center pb-16 pt-8 px-6 bg-gradient-to-t from-stone-950/95 to-transparent z-10">
              <Button size="lg" className="gap-2 rounded-full h-14 px-10 bg-white text-stone-900 hover:bg-white/90 shadow-2xl" onClick={handleShopTheLook}>
                {t.showcase.cta}
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Project Gallery - Our Work */}
        <ProjectGallery />

        {/* Products Section */}
        <section id="products" className="relative bg-white py-24 md:py-32 overflow-hidden">
          <div 
            className="absolute top-1/2 right-0 -translate-y-1/2 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `url(${logoIcon})`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right center',
              backgroundSize: '50%',
              width: '60%',
              height: '80%',
              filter: 'grayscale(100%)'
            }}
          />
          <div className="container mx-auto px-6 lg:px-8 relative z-10">
            <div className="mb-16 text-center max-w-3xl mx-auto">
              <h1 className="mb-4 text-[48px]">{t.products.title}</h1>
              <p className="text-muted-foreground text-lg text-[20px]">
                {t.products.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.image}
                  category={product.category}
                  rating={product.rating}
                  reviewCount={product.reviewCount}
                  badge={product.badge}
                  discount={product.discount}
                  variants={product.variants}
                  sizes={product.sizes}
                  inStock={product.inStock}
                  user={user}
                  onAddToCart={(options) => handleAddToCart(product, options)}
                />
              ))}
            </div>

            <div className="mt-16 text-center">
              <Button variant="outline" size="lg" className="rounded-full h-12 px-8">
                {t.products.viewAllProducts}
              </Button>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="relative container mx-auto px-6 lg:px-8 py-24 md:py-32 overflow-hidden">
          <div 
            className="absolute top-1/2 left-0 -translate-y-1/2 opacity-[0.025] pointer-events-none"
            style={{
              backgroundImage: `url(${logoIcon})`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'left center',
              backgroundSize: '50%',
              width: '60%',
              height: '80%',
              filter: 'grayscale(100%)'
            }}
          />
          <div className="mb-16 text-center max-w-3xl mx-auto">
            <h1 className="mb-4 text-[48px]">{t.testimonials.title}</h1>
            <p className="text-muted-foreground text-lg">
              {t.testimonials.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                name={testimonial.name}
                rating={testimonial.rating}
                review={testimonial.review}
                product={testimonial.product}
                image={testimonial.image}
                roomImage={testimonial.roomImage}
              />
            ))}
          </div>
        </section>

        {/* About Section - Why Choose Vision Studio */}
        <section id="about" className="relative bg-gradient-to-b from-white via-stone-50 to-white py-24 md:py-32 overflow-hidden">
          <div 
            className="absolute bottom-0 right-0 opacity-[0.02] pointer-events-none"
            style={{
              backgroundImage: `url(${logoIcon})`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'bottom right',
              backgroundSize: '40%',
              width: '50%',
              height: '60%',
              filter: 'grayscale(100%)'
            }}
          />
          <div className="container mx-auto px-6 lg:px-8 relative z-10">
            {/* Section Header */}
            <div className="mb-20 text-center max-w-3xl mx-auto">
              <h1 className="mb-6 text-[56px]">{t.whyChoose.title}</h1>
              <p className="text-muted-foreground text-lg text-[20px]">
                {t.whyChoose.subtitle}
              </p>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24 max-w-5xl mx-auto">
              <div className="text-center group">
                <div className="mb-3 transition-transform group-hover:scale-110">
                  <p className="text-[56px] bg-gradient-to-br from-stone-900 to-stone-600 bg-clip-text text-transparent">{t.whyChoose.stat1Value}</p>
                </div>
                <p className="text-sm text-muted-foreground">{t.whyChoose.stat1Label}</p>
              </div>
              <div className="text-center group">
                <div className="mb-3 transition-transform group-hover:scale-110">
                  <p className="text-[56px] bg-gradient-to-br from-stone-900 to-stone-600 bg-clip-text text-transparent">{t.whyChoose.stat2Value}</p>
                </div>
                <p className="text-sm text-muted-foreground">{t.whyChoose.stat2Label}</p>
              </div>
              <div className="text-center group">
                <div className="mb-3 transition-transform group-hover:scale-110">
                  <p className="text-[56px] bg-gradient-to-br from-stone-900 to-stone-600 bg-clip-text text-transparent">{t.whyChoose.stat3Value}</p>
                </div>
                <p className="text-sm text-muted-foreground">{t.whyChoose.stat3Label}</p>
              </div>
              <div className="text-center group">
                <div className="mb-3 transition-transform group-hover:scale-110">
                  <p className="text-[56px] bg-gradient-to-br from-stone-900 to-stone-600 bg-clip-text text-transparent">{t.whyChoose.stat4Value}</p>
                </div>
                <p className="text-sm text-muted-foreground">{t.whyChoose.stat4Label}</p>
              </div>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-7xl mx-auto">
              {/* Quality Craftsmanship Card */}
              <div className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                <div className="relative h-72 overflow-hidden">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1758977404039-6e834be8eca8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxxdWFsaXR5JTIwZnVybml0dXJlJTIwY3JhZnRzbWFuc2hpcHxlbnwxfHx8fDE3NTk5MzMwMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Quality Craftsmanship"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent" />
                  <div className="absolute top-6 left-6">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-xl">
                      <Sparkles className="h-7 w-7 text-white" />
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="mb-3 text-[24px]">{t.whyChoose.feature1Title}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {t.whyChoose.feature1Desc}
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-stone-900 mt-2 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">{t.whyChoose.feature1Point1}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-stone-900 mt-2 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">{t.whyChoose.feature1Point2}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-stone-900 mt-2 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">{t.whyChoose.feature1Point3}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-stone-900 mt-2 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">{t.whyChoose.feature1Point4}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Free Delivery Card */}
              <div className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={deliveryImage}
                    alt="White-Glove Delivery"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent" />
                  <div className="absolute top-6 left-6">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-xl">
                      <Truck className="h-7 w-7 text-white" />
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="mb-3 text-[24px]">{t.whyChoose.feature2Title}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {t.whyChoose.feature2Desc}
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-stone-900 mt-2 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">{t.whyChoose.feature2Point1}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-stone-900 mt-2 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">{t.whyChoose.feature2Point2}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-stone-900 mt-2 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">{t.whyChoose.feature2Point3}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-stone-900 mt-2 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">{t.whyChoose.feature2Point4}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 30-Day Returns Card */}
              <div className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={returnsImage}
                    alt="Hassle-Free Returns"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent" />
                  <div className="absolute top-6 left-6">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-xl">
                      <RefreshCw className="h-7 w-7 text-white" />
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="mb-3 text-[24px]">{t.whyChoose.feature3Title}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {t.whyChoose.feature3Desc}
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-stone-900 mt-2 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">{t.whyChoose.feature3Point1}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-stone-900 mt-2 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">{t.whyChoose.feature3Point2}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-stone-900 mt-2 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">{t.whyChoose.feature3Point3}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-stone-900 mt-2 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">{t.whyChoose.feature3Point4}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expert Design Support Card */}
              <div className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={designSupportImage}
                    alt="Expert Design Support"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent" />
                  <div className="absolute top-6 left-6">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-xl">
                      <Edit3 className="h-7 w-7 text-white" />
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="mb-3 text-[24px]">{t.whyChoose.feature4Title}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {t.whyChoose.feature4Desc}
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-stone-900 mt-2 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">{t.whyChoose.feature4Point1}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-stone-900 mt-2 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">{t.whyChoose.feature4Point2}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-stone-900 mt-2 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">{t.whyChoose.feature4Point3}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-stone-900 mt-2 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">{t.whyChoose.feature4Point4}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="mt-20 text-center">
              <div className="inline-flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="rounded-full h-14 px-10 gap-2" asChild>
                  <a href="#products">
                    {t.whyChoose.ctaStart}
                    <ArrowRight className="h-5 w-5" />
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="rounded-full h-14 px-10" asChild>
                  <a href="#room-ideas">{t.whyChoose.ctaBrowse}</a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      )}

      <Footer onNavigate={(page) => setCurrentView(page as any)} />

      {/* Video Overlay Dialog - Fullscreen */}
      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        <DialogContent className="max-w-none w-screen h-screen p-0 overflow-hidden bg-black border-none m-0">
          <DialogTitle className="sr-only">Vision Studio Video</DialogTitle>
          <DialogDescription className="sr-only">
            Watch our video showcasing furniture transformation and design inspiration
          </DialogDescription>
          <DialogClose className="absolute right-6 top-6 z-50 rounded-full bg-white/20 backdrop-blur-md p-3 text-white hover:bg-white/30 transition-colors shadow-xl">
            <X className="h-6 w-6" />
          </DialogClose>
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="relative w-full max-w-[450px] h-full">
              <iframe
                src="https://www.tiktok.com/embed/v2/7529914173271182647"
                className="absolute inset-0 w-full h-full"
                allowFullScreen
                scrolling="no"
                allow="encrypted-media;"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sign In Dialog */}
      <SignInDialog
        open={isSignInOpen}
        onOpenChange={setIsSignInOpen}
        onSignIn={handleSignIn}
      />

      {/* Room Questionnaire Dialog */}
      <RoomQuestionnaire
        open={isQuestionnaireOpen}
        onOpenChange={setIsQuestionnaireOpen}
        onComplete={handleQuestionnaireComplete}
        userName={user?.name || ""}
      />

      {/* Design Chatbot */}
      <DesignChatbot onAddToCart={handleAddToCart} />

      {/* Admin Access - CRM Dashboard */}
      <AdminAccess />

      {/* Supabase Connection Status Indicator */}
      <SupabaseConnectionStatus />

      {/* Supabase Diagnostics Dialog */}
      <SupabaseDiagnostics open={isDiagnosticsOpen} onClose={() => setIsDiagnosticsOpen(false)} />

      {/* CRM Data Sync Checker Dialog */}
      <Dialog open={isSyncCheckerOpen} onOpenChange={setIsSyncCheckerOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogTitle className="sr-only">CRM Data Sync Checker</DialogTitle>
          <DialogDescription className="sr-only">
            Check if your CRM data is synced with Supabase
          </DialogDescription>
          <CRMDataSyncChecker />
        </DialogContent>
      </Dialog>

      {/* Bottom Left Action Buttons */}
      <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2">
        {/* Test Connection Button */}
        <Button
          onClick={() => setIsDiagnosticsOpen(true)}
          variant="outline"
          size="sm"
        >
          <Database className="w-4 h-4 mr-2" />
          Test Connection
        </Button>

        {/* Check Data Sync Button */}
        <Button
          onClick={() => setIsSyncCheckerOpen(true)}
          variant="outline"
          size="sm"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Check Data Sync
        </Button>

        {/* CRM Seed Data Button (for demo purposes) */}
        <Button
          onClick={async () => {
            toast.loading("Seeding CRM data...");
            const result = await seedCRMData();
            if (result.success) {
              toast.success("CRM data seeded successfully! Check the Admin Dashboard.");
            } else {
              toast.error("Failed to seed CRM data. Check console for errors.");
            }
          }}
          variant="outline"
          size="sm"
        >
          <Database className="w-4 h-4 mr-2" />
          Seed Data
        </Button>
      </div>

      {/* Campaign Popups */}
      <CampaignPopup />

      {/* Survey Display */}
      <SurveyDisplay />

      {/* Mobile Bottom Navigation - shown only below 440px */}
      <MobileBottomNav
        currentView={currentView}
        onNavigateHome={() => setCurrentView("home")}
        onViewProducts={handleViewProducts}
        onViewCart={handleViewCart}
        onViewAccount={handleViewAccount}
        onViewCustomize={handleViewCustomize}
        cartItemCount={cart.length}
        user={user}
        onSignInClick={() => setIsSignInOpen(true)}
      />

      {/* Toast Notifications */}
      <Toaster position="top-center" />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <MainApp />
    </LanguageProvider>
  );
}
