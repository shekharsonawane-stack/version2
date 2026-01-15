import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card } from "./ui/card";
import { Check, ArrowRight, Home, Bed, Utensils, Briefcase, Armchair, Baby, Minus, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner@2.0.3";

interface StagingPackage {
  id: number;
  name: string;
  type: string;
  size: string;
  price: number;
  monthlyPrice: number;
  description: string;
  floorPlanImage: string;
  beforeImage: string;
  afterImage: string;
  features: string[];
  items: Array<{
    name: string;
    quantity: number;
    image: string;
    price: number;
  }>;
  rooms: Array<{
    name: string;
    items: string[];
  }>;
}

// Furniture Item Interface
interface FurnitureItem {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  colors?: string[];
  materials?: string[];
}

// Room Planner Data
const roomTypes = [
  { id: "living", name: "Living Room", icon: Home },
  { id: "master-bedroom", name: "Master Bedroom", icon: Bed },
  { id: "kids-bedroom", name: "Kids' Bedroom", icon: Baby },
  { id: "dining", name: "Dining Room", icon: Utensils },
  { id: "office", name: "Home Office", icon: Briefcase },
];

// Furniture options by room type
const furnitureByRoom: { [key: string]: FurnitureItem[] } = {
  "living": [
    { id: 1, name: "Modern Velvet Sofa", price: 1299, image: "https://images.unsplash.com/photo-1603192399946-8bbb0703cfc4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzb2ZhJTIwY291Y2h8ZW58MXx8fHwxNzU5NjkyMjM0fDA&ixlib=rb-4.1.0&q=80&w=1080", category: "Seating", colors: ["Charcoal", "Navy", "Sage", "Beige"], materials: ["Velvet", "Linen"] },
    { id: 2, name: "Oak Coffee Table", price: 499, image: "https://images.unsplash.com/photo-1658367754793-1200cee7b3d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBjb2ZmZWUlMjB0YWJsZXxlbnwxfHx8fDE3NTk3MTQxMDZ8MA&ixlib=rb-4.1.0&q=80&w=1080", category: "Tables", materials: ["Oak", "Walnut", "White Oak"] },
    { id: 3, name: "Minimalist Armchair", price: 799, image: "https://images.unsplash.com/photo-1713286663271-809d910c0c65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYXJtY2hhaXJ8ZW58MXx8fHwxNzU5NzE0MTA3fDA&ixlib=rb-4.1.0&q=80&w=1080", category: "Seating", colors: ["Gray", "Cream", "Charcoal"], materials: ["Fabric", "Leather"] },
    { id: 5, name: "Arc Floor Lamp", price: 299, image: "https://images.unsplash.com/photo-1759647020559-2f91a4290ae4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbG9vciUyMGxhbXAlMjBtb2Rlcm58ZW58MXx8fHwxNzU5NzE0MTA3fDA&ixlib=rb-4.1.0&q=80&w=1080", category: "Lighting", colors: ["Brass", "Black", "Chrome"] },
    { id: 7, name: "Decorative Rug", price: 399, image: "https://images.unsplash.com/photo-1615971677499-5467cbab01c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBydWd8ZW58MXx8fHwxNzU5NzUxOTc4fDA&ixlib=rb-4.1.0&q=80&w=1080", category: "Decor", colors: ["Gray", "Beige", "Blue", "Terracotta"] },
    { id: 13, name: "TV Console", price: 699, image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkZXNrfGVufDF8fHx8MTc1OTc1NTY0M3ww&ixlib=rb-4.1.0&q=80&w=1080", category: "Storage", materials: ["Oak", "Walnut", "White"] },
  ],
  "master-bedroom": [
    { id: 8, name: "Platform Bed Frame", price: 1199, image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiZWQlMjBmcmFtZXxlbnwxfHx8fDE3NTk3NTU1Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080", category: "Bedroom", colors: ["Natural Wood", "Gray", "White"], materials: ["Oak", "Walnut"] },
    { id: 9, name: "Nightstand", price: 299, image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBuaWdodHN0YW5kfGVufDF8fHx8MTc1OTc1NTU4MHww&ixlib=rb-4.1.0&q=80&w=1080", category: "Bedroom", materials: ["Oak", "Walnut", "White Oak"] },
    { id: 14, name: "Dresser", price: 899, image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkZXNrfGVufDF8fHx8MTc1OTc1NTY0M3ww&ixlib=rb-4.1.0&q=80&w=1080", category: "Storage", materials: ["Oak", "Walnut", "White"] },
    { id: 3, name: "Upholstered Bench", price: 449, image: "https://images.unsplash.com/photo-1713286663271-809d910c0c65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYXJtY2hhaXJ8ZW58MXx8fHwxNzU5NzE0MTA3fDA&ixlib=rb-4.1.0&q=80&w=1080", category: "Seating", colors: ["Gray", "Cream", "Navy"], materials: ["Velvet", "Linen"] },
    { id: 15, name: "Table Lamp", price: 149, image: "https://images.unsplash.com/photo-1759647020559-2f91a4290ae4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbG9vciUyMGxhbXAlMjBtb2Rlcm58ZW58MXx8fHwxNzU5NzE0MTA3fDA&ixlib=rb-4.1.0&q=80&w=1080", category: "Lighting", colors: ["Brass", "Black", "White"] },
  ],
  "kids-bedroom": [
    { id: 16, name: "Kids Bed Frame", price: 799, image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiZWQlMjBmcmFtZXxlbnwxfHx8fDE3NTk3NTU1Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080", category: "Bedroom", colors: ["White", "Natural", "Gray"] },
    { id: 17, name: "Kids Desk", price: 399, image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkZXNrfGVufDF8fHx8MTc1OTc1NTY0M3ww&ixlib=rb-4.1.0&q=80&w=1080", category: "Desk", colors: ["White", "Pink", "Blue"] },
    { id: 4, name: "Bookshelf", price: 549, image: "https://images.unsplash.com/photo-1650513259622-081281181c32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBib29rc2hlbGZ8ZW58MXx8fHwxNzU5NzE0MTA3fDA&ixlib=rb-4.1.0&q=80&w=1080", category: "Storage", colors: ["White", "Natural", "Gray"] },
    { id: 18, name: "Storage Chest", price: 299, image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkZXNrfGVufDF8fHx8MTc1OTc1NTY0M3ww&ixlib=rb-4.1.0&q=80&w=1080", category: "Storage", colors: ["White", "Pink", "Blue", "Gray"] },
  ],
  "dining": [
    { id: 6, name: "Walnut Dining Table", price: 1599, image: "https://images.unsplash.com/photo-1525427232291-d509af8c67f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaW5pbmclMjB0YWJsZSUyMHdvb2RlbnxlbnwxfHx8fDE3NTk1OTk1MTh8MA&ixlib=rb-4.1.0&q=80&w=1080", category: "Tables", materials: ["Walnut", "Oak", "White Oak"] },
    { id: 10, name: "Dining Chairs", price: 299, image: "https://images.unsplash.com/photo-1604926652539-92e4c77d0e03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkaW5pbmclMjBjaGFpcnN8ZW58MXx8fHwxNzU5NzU1NjExfDA&ixlib=rb-4.1.0&q=80&w=1080", category: "Seating", colors: ["Black", "Gray", "Natural", "White"], materials: ["Oak", "Walnut"] },
    { id: 19, name: "Sideboard", price: 1299, image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkZXNrfGVufDF8fHx8MTc1OTc1NTY0M3ww&ixlib=rb-4.1.0&q=80&w=1080", category: "Storage", materials: ["Oak", "Walnut", "White"] },
    { id: 20, name: "Pendant Light", price: 449, image: "https://images.unsplash.com/photo-1759647020559-2f91a4290ae4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbG9vciUyMGxhbXAlMjBtb2Rlcm58ZW58MXx8fHwxNzU5NzE0MTA3fDA&ixlib=rb-4.1.0&q=80&w=1080", category: "Lighting", colors: ["Brass", "Black", "Bronze"] },
  ],
  "office": [
    { id: 11, name: "Executive Desk", price: 999, image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkZXNrfGVufDF8fHx8MTc1OTc1NTY0M3ww&ixlib=rb-4.1.0&q=80&w=1080", category: "Office", materials: ["Oak", "Walnut", "White"] },
    { id: 12, name: "Office Chair", price: 699, image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjBjaGFpciUyMG1vZGVybnxlbnwxfHx8fDE3NTk3NTU2NDN8MA&ixlib=rb-4.1.0&q=80&w=1080", category: "Office", colors: ["Black", "Gray", "Tan"] },
    { id: 4, name: "Modern Bookshelf", price: 649, image: "https://images.unsplash.com/photo-1650513259622-081281181c32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBib29rc2hlbGZ8ZW58MXx8fHwxNzU5NzE0MTA3fDA&ixlib=rb-4.1.0&q=80&w=1080", category: "Storage", materials: ["Oak", "Walnut", "White"] },
    { id: 21, name: "Desk Lamp", price: 149, image: "https://images.unsplash.com/photo-1759647020559-2f91a4290ae4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbG9vciUyMGxhbXAlMjBtb2Rlcm58ZW58MXx8fHwxNzU5NzE0MTA3fDA&ixlib=rb-4.1.0&q=80&w=1080", category: "Lighting", colors: ["Brass", "Black", "White"] },
    { id: 22, name: "File Cabinet", price: 399, image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkZXNrfGVufDF8fHx8MTc1OTc1NTY0M3ww&ixlib=rb-4.1.0&q=80&w=1080", category: "Storage", colors: ["White", "Black", "Gray"] },
  ],
};

const designThemes = [
  {
    id: "zen",
    name: "Minimalist Zen",
    description: "Clean lines, natural materials, and serene spaces",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwemVuJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzU5NzYwMDAwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    rooms: ["Living Room", "Bedroom", "Kitchen", "Family Room"],
    colors: ["#F5F5DC", "#D3D3D3", "#8B7355"]
  },
  {
    id: "industrial",
    name: "Urban Industrial Loft",
    description: "Raw materials, exposed elements, modern edge",
    image: "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwbG9mdCUyMGludGVyaW9yfGVufDF8fHx8MTc1OTc2MDAwMHww&ixlib=rb-4.1.0&q=80&w=1080",
    rooms: ["Living Room", "Bedroom", "Kitchen", "Family Room"],
    colors: ["#2F2F2F", "#C19A6B", "#8B4513"]
  },
  {
    id: "japandi",
    name: "Japandi Retreat",
    description: "Japanese minimalism meets Scandinavian functionality",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmRpJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzU5NzYwMDAwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    rooms: ["Living Room", "Bedroom", "Kitchen", "Family Room"],
    colors: ["#E8DCC4", "#5D5D5D", "#B4A89A"]
  },
  {
    id: "boho",
    name: "Boho Chic",
    description: "Eclectic patterns, vibrant colors, free-spirited vibes",
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib2hvJTIwY2hpYyUyMGludGVyaW9yfGVufDF8fHx8MTc1OTc2MDAwMHww&ixlib=rb-4.1.0&q=80&w=1080",
    rooms: ["Living Room", "Bedroom", "Kitchen", "Family Room"],
    colors: ["#D4A574", "#8B6F47", "#E8C4A0"]
  },
  {
    id: "modern-glam",
    name: "Modern Glam",
    description: "Luxurious touches with contemporary sophistication",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBnbGFtJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzU5NzYwMDAwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    rooms: ["Living Room", "Bedroom", "Kitchen", "Family Room"],
    colors: ["#1C1C1C", "#B8956A", "#FFFFFF"]
  },
  {
    id: "farmhouse",
    name: "Rustic Farmhouse",
    description: "Warm woods, vintage charm, cozy comfort",
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtaG91c2UlMjBpbnRlcmlvciUyMHN0eWxlfGVufDF8fHx8MTc1OTc2MDAwMHww&ixlib=rb-4.1.0&q=80&w=1080",
    rooms: ["Living Room", "Bedroom", "Kitchen", "Family Room"],
    colors: ["#8B7355", "#D4C4B0", "#FFFFFF"]
  },
  {
    id: "scandinavian",
    name: "Scandi Pastel",
    description: "Soft hues, natural light, hygge atmosphere",
    image: "https://images.unsplash.com/photo-1600566753151-384129cf4e3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2FuZGluYXZpYW4lMjBwYXN0ZWwlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTk3NjAwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rooms: ["Living Room", "Bedroom", "Kitchen", "Family Room"],
    colors: ["#F2E8DC", "#B4C8D8", "#D8C8B8"]
  },
  {
    id: "mid-century",
    name: "Mid-Century Mood",
    description: "Retro flair, iconic shapes, timeless appeal",
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWQlMjBjZW50dXJ5JTIwbW9kZXJuJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzU5NzYwMDAwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    rooms: ["Living Room", "Bedroom", "Kitchen", "Family Room"],
    colors: ["#C67D4B", "#2C5F4F", "#E8C4A0"]
  },
  {
    id: "monochrome",
    name: "Monochrome Luxe",
    description: "Black, white, and shades of gray sophistication",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb25vY2hyb21lJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzU5NzYwMDAwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    rooms: ["Living Room", "Bedroom", "Kitchen", "Family Room"],
    colors: ["#000000", "#808080", "#FFFFFF"]
  },
  {
    id: "earthy",
    name: "Earthy Organic",
    description: "Natural textures, earth tones, sustainable materials",
    image: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlYXJ0aHklMjBvcmdhbmljJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzU5NzYwMDAwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    rooms: ["Living Room", "Bedroom", "Kitchen", "Family Room"],
    colors: ["#8B7355", "#A0826D", "#6B5D4F"]
  },
];

const stagingPackages: StagingPackage[] = [
  {
    id: 1,
    name: "Studio Apartment",
    type: "Complete Package",
    size: "450 - 550 sq ft",
    price: 4995,
    monthlyPrice: 208,
    description: "Perfect starter package for studio living. Everything you need to transform your compact space into a stylish, functional home.",
    floorPlanImage: "https://images.unsplash.com/photo-1722859177977-f881f1809d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcGFydG1lbnQlMjBmbG9vciUyMHBsYW58ZW58MXx8fHwxNzU5NzI0NDIxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    beforeImage: "https://images.unsplash.com/photo-1613668816690-546c6fa9ad42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbXB0eSUyMGFwYXJ0bWVudCUyMGludGVyaW9yfGVufDF8fHx8MTc1OTc1NzAzMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    afterImage: "https://images.unsplash.com/photo-1680503146476-abb8c752e1f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXJuaXNoZWQlMjBhcGFydG1lbnR8ZW58MXx8fHwxNzU5NzU3MDMxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    features: [
      "Complete furniture package",
      "Professional delivery & assembly",
      "Free 30-day returns",
      "Flexible financing available",
      "Design consultation included",
      "Lifetime support"
    ],
    items: [
      { name: "Modern Sleeper Sofa", quantity: 1, image: "https://images.unsplash.com/photo-1603192399946-8bbb0703cfc4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzb2ZhJTIwY291Y2h8ZW58MXx8fHwxNzU5NjkyMjM0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", price: 1299 },
      { name: "Coffee Table", quantity: 1, image: "https://images.unsplash.com/photo-1658367754793-1200cee7b3d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBjb2ZmZWUlMjB0YWJsZXxlbnwxfHx8fDE3NTk3MTQxMDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", price: 499 },
      { name: "Dining Table Set", quantity: 1, image: "https://images.unsplash.com/photo-1525427232291-d509af8c67f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaW5pbmclMjB0YWJsZSUyMHdvb2RlbnxlbnwxfHx8fDE3NTk1OTk1MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", price: 899 },
      { name: "Dining Chairs", quantity: 2, image: "https://images.unsplash.com/photo-1604926652539-92e4c77d0e03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkaW5pbmclMjBjaGFpcnN8ZW58MXx8fHwxNzU5NzU1NjExfDA&ixlib=rb-4.1.0&q=80&w=1080", price: 598 },
      { name: "Bookshelf", quantity: 1, image: "https://images.unsplash.com/photo-1650513259622-081281181c32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBib29rc2hlbGZ8ZW58MXx8fHwxNzU5NzE0MTA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", price: 649 },
      { name: "Floor Lamp", quantity: 1, image: "https://images.unsplash.com/photo-1759647020559-2f91a4290ae4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbG9vciUyMGxhbXAlMjBtb2Rlcm58ZW58MXx8fHwxNzU5NzE0MTA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", price: 299 },
      { name: "Area Rug", quantity: 1, image: "https://images.unsplash.com/photo-1615971677499-5467cbab01c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBydWd8ZW58MXx8fHwxNzU5NzUxOTc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", price: 399 },
      { name: "Wall Mirror", quantity: 1, image: "https://images.unsplash.com/photo-1618220179428-22790b461013?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3YWxsJTIwbWlycm9yfGVufDF8fHx8MTc1OTc1NzI2Nnww&ixlib=rb-4.1.0&q=80&w=1080", price: 249 },
      { name: "Throw Pillows", quantity: 3, image: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc1OTc0MzU1Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", price: 104 },
    ],
    rooms: [
      {
        name: "Living Area",
        items: ["Modern Sleeper Sofa", "Coffee Table", "Floor Lamp", "Area Rug", "Throw Pillows"]
      },
      {
        name: "Dining Area",
        items: ["Dining Table Set", "Dining Chairs (2)"]
      },
      {
        name: "Storage & Decor",
        items: ["Bookshelf", "Wall Mirror"]
      }
    ]
  },
  {
    id: 2,
    name: "1-Bedroom Apartment",
    type: "Complete Package",
    size: "650 - 800 sq ft",
    price: 7495,
    monthlyPrice: 312,
    description: "Complete home staging package for one-bedroom apartments. Transform every room with our carefully curated furniture selections.",
    floorPlanImage: "https://images.unsplash.com/photo-1648634158203-199accfd7afc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWRyb29tJTIwZmxvb3IlMjBwbGFufGVufDF8fHx8MTc1OTc1NzAzMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    beforeImage: "https://images.unsplash.com/photo-1722650362357-7cb7d35a45eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbXB0eSUyMG1pbmltYWxpc3QlMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc1OTcxNDEwNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    afterImage: "https://images.unsplash.com/photo-1658893136904-63914a6b372c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBmdXJuaXNoZWQlMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc1OTcxNDEwNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    features: [
      "Complete furniture package",
      "Professional delivery & assembly",
      "Free 30-day returns",
      "Flexible financing available",
      "Design consultation included",
      "Lifetime support"
    ],
    items: [
      { name: "Modern Velvet Sofa", quantity: 1, image: "https://images.unsplash.com/photo-1603192399946-8bbb0703cfc4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzb2ZhJTIwY291Y2h8ZW58MXx8fHwxNzU5NjkyMjM0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", price: 1299 },
      { name: "Coffee Table", quantity: 1, image: "https://images.unsplash.com/photo-1658367754793-1200cee7b3d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBjb2ZmZWUlMjB0YWJsZXxlbnwxfHx8fDE3NTk3MTQxMDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", price: 499 },
      { name: "Armchair", quantity: 1, image: "https://images.unsplash.com/photo-1713286663271-809d910c0c65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYXJtY2hhaXJ8ZW58MXx8fHwxNzU5NzE0MTA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", price: 799 },
      { name: "Platform Bed Frame", quantity: 1, image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiZWQlMjBmcmFtZXxlbnwxfHx8fDE3NTk3NTU1Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080", price: 1199 },
      { name: "Nightstands", quantity: 2, image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBuaWdodHN0YW5kfGVufDF8fHx8MTc1OTc1NTU4MHww&ixlib=rb-4.1.0&q=80&w=1080", price: 598 },
      { name: "Dresser", quantity: 1, image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkZXNrfGVufDF8fHx8MTc1OTc1NTY0M3ww&ixlib=rb-4.1.0&q=80&w=1080", price: 899 },
      { name: "Dining Table", quantity: 1, image: "https://images.unsplash.com/photo-1525427232291-d509af8c67f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaW5pbmclMjB0YWJsZSUyMHdvb2RlbnxlbnwxfHx8fDE3NTk1OTk1MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", price: 1599 },
      { name: "Dining Chairs", quantity: 4, image: "https://images.unsplash.com/photo-1604926652539-92e4c77d0e03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkaW5pbmclMjBjaGFpcnN8ZW58MXx8fHwxNzU5NzU1NjExfDA&ixlib=rb-4.1.0&q=80&w=1080", price: 1196 },
      { name: "TV Stand", quantity: 1, image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkZXNrfGVufDF8fHx8MTc1OTc1NTY0M3ww&ixlib=rb-4.1.0&q=80&w=1080", price: 699 },
      { name: "Floor Lamps", quantity: 2, image: "https://images.unsplash.com/photo-1759647020559-2f91a4290ae4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbG9vciUyMGxhbXAlMjBtb2Rlcm58ZW58MXx8fHwxNzU5NzE0MTA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", price: 598 },
      { name: "Area Rugs", quantity: 2, image: "https://images.unsplash.com/photo-1615971677499-5467cbab01c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBydWd8ZW58MXx8fHwxNzU5NzUxOTc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", price: 798 },
      { name: "Decor Package", quantity: 1, image: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc1OTc0MzU1Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", price: 311 },
    ],
    rooms: [
      {
        name: "Living Room",
        items: ["Modern Velvet Sofa", "Coffee Table", "Armchair", "TV Stand", "Floor Lamp", "Area Rug"]
      },
      {
        name: "Bedroom",
        items: ["Platform Bed Frame", "Nightstands (2)", "Dresser", "Floor Lamp", "Area Rug"]
      },
      {
        name: "Dining Area",
        items: ["Dining Table", "Dining Chairs (4)"]
      },
      {
        name: "Finishing Touches",
        items: ["Decor Package (pillows, artwork, plants)"]
      }
    ]
  }
];

interface HomeStagingSectionProps {
  onAddToCart?: (product: { 
    id: number; 
    name: string; 
    price: number; 
    image: string; 
    category: string;
  }) => void;
}

export function HomeStagingSection({ onAddToCart }: HomeStagingSectionProps) {
  const [selectedPackage, setSelectedPackage] = useState(stagingPackages[0]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [selectedFurniture, setSelectedFurniture] = useState<{
    [key: number]: { 
      quantity: number; 
      color?: string; 
      material?: string;
    }
  }>({});

  const handleContinueToCustomization = () => {
    setIsCustomizing(true);
    // Scroll to customization section
    setTimeout(() => {
      const element = document.getElementById('furniture-customization');
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleStartOver = () => {
    setSelectedRoom(null);
    setSelectedTheme(null);
    setIsCustomizing(false);
    setSelectedFurniture({});
  };

  const handleToggleFurniture = (item: FurnitureItem) => {
    setSelectedFurniture(prev => {
      const newState = { ...prev };
      if (newState[item.id]) {
        delete newState[item.id];
      } else {
        newState[item.id] = {
          quantity: 1,
          color: item.colors?.[0],
          material: item.materials?.[0]
        };
      }
      return newState;
    });
  };

  const handleUpdateQuantity = (itemId: number, delta: number) => {
    setSelectedFurniture(prev => {
      const current = prev[itemId];
      if (!current) return prev;
      const newQuantity = Math.max(1, current.quantity + delta);
      return {
        ...prev,
        [itemId]: { ...current, quantity: newQuantity }
      };
    });
  };

  const handleUpdateOption = (itemId: number, option: 'color' | 'material', value: string) => {
    setSelectedFurniture(prev => ({
      ...prev,
      [itemId]: { ...prev[itemId], [option]: value }
    }));
  };

  const calculateTotal = () => {
    if (!selectedRoom) return 0;
    const furnitureList = furnitureByRoom[selectedRoom] || [];
    return Object.entries(selectedFurniture).reduce((total, [itemId, config]) => {
      const item = furnitureList.find(f => f.id === parseInt(itemId));
      return total + (item ? item.price * config.quantity : 0);
    }, 0);
  };

  const handleAddPackageToCart = () => {
    if (!onAddToCart) return;
    
    // Add the package as a single item with all included furniture listed
    const packageItem = {
      id: selectedPackage.id + 10000, // Offset ID to avoid conflicts with individual furniture
      name: selectedPackage.name,
      price: selectedPackage.price,
      image: selectedPackage.image,
      category: 'Home Staging Package'
    };
    
    onAddToCart(packageItem);
    toast.success(`${selectedPackage.name} added to cart!`);
  };

  const handleAddAllToCart = () => {
    if (!selectedRoom) return;
    const furnitureList = furnitureByRoom[selectedRoom] || [];
    const itemsToAdd = Object.entries(selectedFurniture).map(([itemId, config]) => {
      const item = furnitureList.find(f => f.id === parseInt(itemId));
      return { item, config };
    }).filter(({ item }) => item);

    if (itemsToAdd.length === 0) {
      toast.error("Please select at least one furniture item");
      return;
    }

    // Add each furniture item to cart
    if (onAddToCart) {
      itemsToAdd.forEach(({ item, config }) => {
        if (item) {
          for (let i = 0; i < config.quantity; i++) {
            onAddToCart({
              id: item.id,
              name: item.name,
              price: item.price,
              image: item.image,
              category: selectedRoom || 'Home Staging'
            });
          }
        }
      });
    }

    toast.success(`Added ${itemsToAdd.length} customized ${itemsToAdd.length === 1 ? 'item' : 'items'} to cart!`);
    // Reset and go back to selection
    handleStartOver();
  };

  return (
    <section id="home-staging" className="bg-stone-50 py-24 md:py-32">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <Badge className="mb-4 rounded-full px-4 py-1.5 text-[20px]">Home Staging Packages</Badge>
          <h1 className="mb-4 text-[48px]">Complete Apartment Solutions</h1>
          <p className="text-muted-foreground text-lg text-[20px]">
            Transform your entire space with our professionally curated home staging packages. 
            Everything you need, delivered and installed.
          </p>
        </div>

        {/* Hero Image Section */}
        <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden mb-16 mx-auto max-w-7xl shadow-2xl">
          {/* Background Image */}
          <div className="absolute inset-0">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1680503146476-abb8c752e1f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmdXJuaXNoZWQlMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTk3NTc4NzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Beautifully furnished apartment interior"
              className="w-full h-full object-cover"
            />
            {/* Gradient Overlays for Better Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-stone-900/80 via-stone-900/50 to-stone-900/80" />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 via-transparent to-stone-900/40" />
          </div>

          {/* Hero Content */}
          <div className="relative h-full flex items-center justify-center px-6">
            <div className="text-center max-w-4xl">
              <h2 className="text-white mb-4 drop-shadow-2xl text-[36px] font-bold">Your Complete Home, Delivered</h2>
              <p className="text-white/95 text-lg md:text-xl leading-relaxed drop-shadow-lg max-w-2xl mx-auto">
                From empty apartment to fully furnished sanctuary. Professional staging packages 
                designed by interior experts, delivered and installed by our team.
              </p>
            </div>
          </div>

          {/* Decorative Bottom Fade */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-stone-50 to-transparent pointer-events-none" />
        </div>

        {/* Package Selector */}
        <div className="mb-12">
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {stagingPackages.map((pkg) => (
              <Card
                key={pkg.id}
                className={`p-6 cursor-pointer transition-all border-2 ${
                  selectedPackage.id === pkg.id
                    ? "border-stone-900 shadow-lg"
                    : "border-stone-200 hover:border-stone-400"
                }`}
                onClick={() => setSelectedPackage(pkg)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="mb-1">{pkg.name}</h3>
                    <p className="text-sm text-muted-foreground">{pkg.size}</p>
                  </div>
                  <Badge variant={selectedPackage.id === pkg.id ? "default" : "outline"}>
                    {pkg.type}
                  </Badge>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2">{pkg.description}</p>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-semibold">${pkg.price.toLocaleString()}</span>
                  <span className="text-sm text-muted-foreground">
                    or ${pkg.monthlyPrice}/mo
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Package Details Tabs */}
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8 h-auto p-1 bg-white border border-stone-200">
              <TabsTrigger value="overview" className="data-[state=active]:bg-stone-900 data-[state=active]:text-white py-3">
                Overview
              </TabsTrigger>
              <TabsTrigger value="items" className="data-[state=active]:bg-stone-900 data-[state=active]:text-white py-3">
                What's Included
              </TabsTrigger>
              <TabsTrigger value="layout" className="data-[state=active]:bg-stone-900 data-[state=active]:text-white py-3">
                Floor Plan
              </TabsTrigger>
              <TabsTrigger value="transformation" className="data-[state=active]:bg-stone-900 data-[state=active]:text-white py-3">
                Before & After
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-0">
              <div className="grid lg:grid-cols-2 gap-8">
                <div>
                  <h2 className="mb-6">Package Features</h2>
                  <div className="space-y-4">
                    {selectedPackage.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-stone-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                        <p className="flex-1">{feature}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 p-6 bg-white rounded-2xl border border-stone-200">
                    <h3 className="mb-4">Package Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Items:</span>
                        <span className="font-medium">
                          {selectedPackage.items.reduce((sum, item) => sum + item.quantity, 0)} pieces
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Coverage:</span>
                        <span className="font-medium">{selectedPackage.size}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Rooms:</span>
                        <span className="font-medium">{selectedPackage.rooms.length} areas</span>
                      </div>
                      <div className="border-t border-stone-200 pt-3 mt-3">
                        <div className="flex justify-between items-baseline">
                          <span className="font-medium">Total Package:</span>
                          <div className="text-right">
                            <span className="text-2xl font-semibold">
                              ${selectedPackage.price.toLocaleString()}
                            </span>
                            <p className="text-sm text-muted-foreground">
                              or ${selectedPackage.monthlyPrice}/mo
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="mb-6">Room Breakdown</h2>
                  <div className="space-y-4">
                    {selectedPackage.rooms.map((room, index) => (
                      <Card key={index} className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          {room.name.includes("Living") && <Home className="h-5 w-5 text-stone-700" />}
                          {room.name.includes("Bedroom") && <Bed className="h-5 w-5 text-stone-700" />}
                          {room.name.includes("Dining") && <Utensils className="h-5 w-5 text-stone-700" />}
                          {room.name.includes("Office") && <Briefcase className="h-5 w-5 text-stone-700" />}
                          <h4>{room.name}</h4>
                        </div>
                        <ul className="space-y-2">
                          {room.items.map((item, itemIndex) => (
                            <li key={itemIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <div className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Items Tab */}
            <TabsContent value="items" className="mt-0">
              <div className="mb-6">
                <h2 className="mb-2">Complete Item List</h2>
                <p className="text-muted-foreground">
                  {selectedPackage.items.reduce((sum, item) => sum + item.quantity, 0)} carefully selected furniture pieces
                </p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedPackage.items.map((item, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-square bg-stone-100 relative overflow-hidden">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      {item.quantity > 1 && (
                        <Badge className="absolute top-3 right-3 bg-stone-900">
                          x{item.quantity}
                        </Badge>
                      )}
                    </div>
                    <div className="p-4">
                      <h4 className="mb-2">{item.name}</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground text-sm">
                          ${item.price.toLocaleString()} each
                        </span>
                        {item.quantity > 1 && (
                          <span className="font-medium text-sm">
                            ${(item.price * item.quantity).toLocaleString()} total
                          </span>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Floor Plan Tab */}
            <TabsContent value="layout" className="mt-0">
              <div className="max-w-5xl mx-auto">
                <div className="mb-6 text-center">
                  <h2 className="mb-2">Space Layout</h2>
                  <p className="text-muted-foreground">
                    See how the furniture is arranged in your {selectedPackage.size} space
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-8 border border-stone-200">
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-stone-100">
                    <ImageWithFallback
                      src={selectedPackage.floorPlanImage}
                      alt={`${selectedPackage.name} Floor Plan`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {selectedPackage.rooms.map((room, index) => (
                      <div key={index} className="p-4 bg-stone-50 rounded-lg">
                        <h4 className="text-sm mb-2">{room.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {room.items.length} items
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Before & After Tab */}
            <TabsContent value="transformation" className="mt-0">
              <div className="mb-6 text-center">
                <h2 className="mb-2">See the Transformation</h2>
                <p className="text-muted-foreground">
                  Watch your space go from empty to fully furnished
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <Badge variant="outline" className="mb-3">Before</Badge>
                    <h3>Empty Space</h3>
                  </div>
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 border-2 border-stone-200">
                    <ImageWithFallback
                      src={selectedPackage.beforeImage}
                      alt="Before staging"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-4">
                    <Badge className="mb-3 bg-stone-900">After</Badge>
                    <h3>Fully Furnished</h3>
                  </div>
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 border-2 border-stone-900 shadow-xl">
                    <ImageWithFallback
                      src={selectedPackage.afterImage}
                      alt="After staging"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* CTA Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <Card className="p-8 bg-gradient-to-br from-stone-900 to-stone-700 text-white border-none">
            <div className="text-center">
              <h2 className="mb-3 text-white">Ready to Transform Your Space?</h2>
              <p className="text-white/90 mb-6 text-lg">
                Get the {selectedPackage.name} package delivered and installed in your home
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  size="lg" 
                  className="gap-2 rounded-full h-14 px-10 bg-white text-stone-900 hover:bg-white/90"
                  onClick={handleAddPackageToCart}
                >
                  Add Package to Cart
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="gap-2 rounded-full h-14 px-10 bg-transparent text-white border-2 border-white hover:bg-white/10"
                >
                  Schedule Consultation
                </Button>
              </div>
              <p className="mt-6 text-sm text-white/80">
                <strong>Special Offer:</strong> Free delivery & assembly included • 30-day returns • Flexible financing available
              </p>
            </div>
          </Card>
        </div>

        {/* Customize Room Selection - Room Planner */}
        <div id="customize-room-selection" className="mt-32">
          <div className="mb-16 text-center max-w-3xl mx-auto">
            <Badge className="mb-4 rounded-full px-4 py-1.5 text-[20px]">Start Your Project</Badge>
            <h1 className="mb-4 text-[48px]">Customize Room Selection</h1>
            <p className="text-muted-foreground text-lg text-[20px]">
              Choose the room you want to furnish and select your preferred design theme. 
              Our interactive planner helps you create your perfect space.
            </p>
          </div>

          {/* Step 1: Room Selection */}
          <div className="mb-12">
            <div className="mb-6">
              <h2 className="mb-2">Step 1: Select Your Room</h2>
              <p className="text-muted-foreground">Choose which room you'd like to furnish first</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {roomTypes.map((room) => {
                const Icon = room.icon;
                return (
                  <Card
                    key={room.id}
                    className={`p-6 cursor-pointer transition-all border-2 hover:shadow-lg ${
                      selectedRoom === room.id
                        ? "border-stone-900 bg-stone-50 shadow-md"
                        : "border-stone-200 hover:border-stone-400"
                    }`}
                    onClick={() => {
                      setSelectedRoom(room.id);
                      setSelectedTheme(null); // Reset theme when changing room
                    }}
                  >
                    <div className="text-center">
                      <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-colors ${
                        selectedRoom === room.id
                          ? "bg-stone-900"
                          : "bg-stone-100"
                      }`}>
                        <Icon className={`h-8 w-8 ${
                          selectedRoom === room.id ? "text-white" : "text-stone-700"
                        }`} />
                      </div>
                      <h4 className="text-sm">{room.name}</h4>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Step 2: Theme Selection */}
          {selectedRoom && (
            <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-6">
                <h2 className="mb-2">Step 2: Choose Your Design Theme</h2>
                <p className="text-muted-foreground">
                  Select a style that matches your taste and personality
                </p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {designThemes.map((theme) => (
                  <Card
                    key={theme.id}
                    className={`overflow-hidden cursor-pointer transition-all border-2 hover:shadow-xl ${
                      selectedTheme === theme.id
                        ? "border-stone-900 shadow-lg"
                        : "border-stone-200 hover:border-stone-400"
                    }`}
                    onClick={() => setSelectedTheme(theme.id)}
                  >
                    <div className="aspect-[4/3] bg-stone-100 relative overflow-hidden">
                      <ImageWithFallback
                        src={theme.image}
                        alt={theme.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      />
                      {selectedTheme === theme.id && (
                        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-stone-900 flex items-center justify-center">
                          <Check className="h-5 w-5 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h4 className="mb-2">{theme.name}</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        {theme.description}
                      </p>
                      <div className="flex gap-2">
                        {theme.colors.map((color, index) => (
                          <div
                            key={index}
                            className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Confirmation & CTA */}
          {selectedRoom && selectedTheme && !isCustomizing && (
            <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card className="p-8 bg-gradient-to-br from-stone-900 to-stone-700 text-white border-none">
                <div className="text-center">
                  <h2 className="mb-3 text-white">Your Selection</h2>
                  <div className="mb-6">
                    <p className="text-white/90 text-lg mb-2">
                      <strong>{roomTypes.find(r => r.id === selectedRoom)?.name}</strong>
                      {" • "}
                      <strong>{designThemes.find(t => t.id === selectedTheme)?.name}</strong>
                    </p>
                    <p className="text-white/80 text-sm">
                      {designThemes.find(t => t.id === selectedTheme)?.description}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Button 
                      size="lg" 
                      className="gap-2 rounded-full h-14 px-10 bg-white text-stone-900 hover:bg-white/90"
                      onClick={handleContinueToCustomization}
                    >
                      Continue to Customization
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="gap-2 rounded-full h-14 px-10 bg-transparent text-white border-2 border-white hover:bg-white/10"
                      onClick={handleStartOver}
                    >
                      Start Over
                    </Button>
                  </div>
                  <p className="mt-6 text-sm text-white/80">
                    Next: Select specific furniture pieces and customize your package
                  </p>
                </div>
              </Card>
            </div>
          )}

          {/* Step 4: Furniture Selection & Customization */}
          {selectedRoom && selectedTheme && isCustomizing && (
            <div id="furniture-customization" className="mt-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-8">
                <h2 className="mb-2">Step 3: Select & Customize Furniture</h2>
                <p className="text-muted-foreground">
                  Choose the pieces you need and customize colors, materials, and quantities
                </p>
              </div>

              {/* Selected Room & Theme Summary */}
              <Card className="p-6 mb-8 bg-stone-50 border-stone-200">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Your Selection</p>
                    <h4>
                      {roomTypes.find(r => r.id === selectedRoom)?.name} • {designThemes.find(t => t.id === selectedTheme)?.name}
                    </h4>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleStartOver}
                  >
                    Change Selection
                  </Button>
                </div>
              </Card>

              {/* Furniture Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {(furnitureByRoom[selectedRoom] || []).map((item) => {
                  const isSelected = !!selectedFurniture[item.id];
                  const config = selectedFurniture[item.id];

                  return (
                    <Card
                      key={item.id}
                      className={`overflow-hidden transition-all border-2 ${
                        isSelected
                          ? "border-stone-900 shadow-lg"
                          : "border-stone-200 hover:border-stone-400"
                      }`}
                    >
                      <div className="aspect-square bg-stone-100 relative overflow-hidden">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        {isSelected && (
                          <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-stone-900 flex items-center justify-center">
                            <Check className="h-5 w-5 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="mb-3">
                          <h4 className="mb-1">{item.name}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{item.category}</p>
                          <p className="font-semibold">${item.price.toLocaleString()}</p>
                        </div>

                        <Button
                          onClick={() => handleToggleFurniture(item)}
                          variant={isSelected ? "default" : "outline"}
                          className="w-full mb-3"
                          size="sm"
                        >
                          {isSelected ? "Selected" : "Select Item"}
                        </Button>

                        {isSelected && (
                          <div className="space-y-3 pt-3 border-t border-stone-200 animate-in fade-in slide-in-from-top-2 duration-300">
                            {/* Quantity */}
                            <div>
                              <label className="block text-xs mb-2">Quantity</label>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => handleUpdateQuantity(item.id, -1)}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="flex-1 text-center font-medium">
                                  {config.quantity}
                                </span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => handleUpdateQuantity(item.id, 1)}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            {/* Color Selection */}
                            {item.colors && item.colors.length > 0 && (
                              <div>
                                <label className="block text-xs mb-2">Color</label>
                                <select
                                  value={config.color || item.colors[0]}
                                  onChange={(e) => handleUpdateOption(item.id, 'color', e.target.value)}
                                  className="w-full p-2 border border-stone-200 rounded-lg text-sm bg-white"
                                >
                                  {item.colors.map(color => (
                                    <option key={color} value={color}>{color}</option>
                                  ))}
                                </select>
                              </div>
                            )}

                            {/* Material Selection */}
                            {item.materials && item.materials.length > 0 && (
                              <div>
                                <label className="block text-xs mb-2">Material</label>
                                <select
                                  value={config.material || item.materials[0]}
                                  onChange={(e) => handleUpdateOption(item.id, 'material', e.target.value)}
                                  className="w-full p-2 border border-stone-200 rounded-lg text-sm bg-white"
                                >
                                  {item.materials.map(material => (
                                    <option key={material} value={material}>{material}</option>
                                  ))}
                                </select>
                              </div>
                            )}

                            <p className="text-xs text-muted-foreground pt-2 border-t border-stone-200">
                              Subtotal: ${(item.price * config.quantity).toLocaleString()}
                            </p>
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* Summary & Checkout */}
              <Card className="p-8 bg-gradient-to-br from-stone-900 to-stone-700 text-white border-none sticky bottom-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="text-center md:text-left">
                    <h3 className="text-white mb-2">Your Customized Package</h3>
                    <p className="text-white/80 text-sm mb-1">
                      {Object.keys(selectedFurniture).length} {Object.keys(selectedFurniture).length === 1 ? 'item' : 'items'} selected
                    </p>
                    <p className="text-white text-2xl font-semibold">
                      Total: ${calculateTotal().toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="gap-2 rounded-full h-14 px-8 bg-transparent text-white border-2 border-white hover:bg-white/10"
                      onClick={handleStartOver}
                    >
                      Start Over
                    </Button>
                    <Button 
                      size="lg" 
                      className="gap-2 rounded-full h-14 px-10 bg-white text-stone-900 hover:bg-white/90"
                      onClick={handleAddAllToCart}
                      disabled={Object.keys(selectedFurniture).length === 0}
                    >
                      <ShoppingCart className="h-5 w-5" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
                {Object.keys(selectedFurniture).length === 0 && (
                  <p className="mt-4 text-center text-white/70 text-sm">
                    Select at least one furniture item to continue
                  </p>
                )}
              </Card>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
