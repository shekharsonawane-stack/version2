import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { X, MessageCircle, Send, Sparkles, ArrowRight, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner@2.0.3";

interface Message {
  id: string;
  type: "bot" | "user" | "options" | "product";
  content: string;
  timestamp: Date;
  options?: string[];
  products?: Array<{
    id: number;
    name: string;
    price: number;
    image: string;
    category: string;
  }>;
}

interface DesignChatbotProps {
  onAddToCart?: (product: { id: number; name: string; price: number; image: string; category: string }) => void;
}

// Conversation flow data
const conversationFlow = {
  greeting: {
    message: "Hi! I'm your Vision Studio design assistant. I'm here to help you find the perfect furniture for your space. What room are you looking to furnish?",
    options: ["Living Room", "Bedroom", "Dining Room", "Home Office", "Just Browsing"],
    nextStep: "style"
  },
  style: {
    message: "Great choice! What design style resonates with you?",
    options: ["Modern Minimalist", "Scandinavian", "Industrial", "Bohemian", "Luxury Glam", "Farmhouse"],
    nextStep: "budget"
  },
  budget: {
    message: "Perfect! What's your budget range for this project?",
    options: ["Under $2,000", "$2,000 - $5,000", "$5,000 - $10,000", "Over $10,000"],
    nextStep: "recommendations"
  },
  recommendations: {
    message: "Excellent! Based on your preferences, here are some personalized recommendations:",
    nextStep: "followup"
  },
  followup: {
    message: "Would you like to see more options or need help with anything else?",
    options: ["Show More Products", "Different Style", "Talk to Designer", "I'm All Set"],
    nextStep: "end"
  }
};

// Product recommendations by room and style
const productRecommendations: { [key: string]: { [key: string]: Array<any> } } = {
  "Living Room": {
    "Modern Minimalist": [
      { id: 1, name: "Modern Velvet Sofa", price: 1299, image: "https://images.unsplash.com/photo-1603192399946-8bbb0703cfc4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzb2ZhJTIwY291Y2h8ZW58MXx8fHwxNzU5NjkyMjM0fDA&ixlib=rb-4.1.0&q=80&w=1080", category: "Seating" },
      { id: 2, name: "Oak Coffee Table", price: 499, image: "https://images.unsplash.com/photo-1658367754793-1200cee7b3d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBjb2ZmZWUlMjB0YWJsZXxlbnwxfHx8fDE3NTk3MTQxMDZ8MA&ixlib=rb-4.1.0&q=80&w=1080", category: "Tables" },
      { id: 3, name: "Minimalist Armchair", price: 799, image: "https://images.unsplash.com/photo-1713286663271-809d910c0c65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYXJtY2hhaXJ8ZW58MXx8fHwxNzU5NzE0MTA3fDA&ixlib=rb-4.1.0&q=80&w=1080", category: "Seating" },
    ],
    "Scandinavian": [
      { id: 1, name: "Modern Velvet Sofa", price: 1299, image: "https://images.unsplash.com/photo-1603192399946-8bbb0703cfc4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzb2ZhJTIwY291Y2h8ZW58MXx8fHwxNzU5NjkyMjM0fDA&ixlib=rb-4.1.0&q=80&w=1080", category: "Seating" },
      { id: 2, name: "Oak Coffee Table", price: 499, image: "https://images.unsplash.com/photo-1658367754793-1200cee7b3d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBjb2ZmZWUlMjB0YWJsZXxlbnwxfHx8fDE3NTk3MTQxMDZ8MA&ixlib=rb-4.1.0&q=80&w=1080", category: "Tables" },
      { id: 4, name: "Modern Bookshelf", price: 649, image: "https://images.unsplash.com/photo-1650513259622-081281181c32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBib29rc2hlbGZ8ZW58MXx8fHwxNzU5NzE0MTA3fDA&ixlib=rb-4.1.0&q=80&w=1080", category: "Storage" },
    ],
    "Industrial": [
      { id: 1, name: "Modern Velvet Sofa", price: 1299, image: "https://images.unsplash.com/photo-1603192399946-8bbb0703cfc4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzb2ZhJTIwY291Y2h8ZW58MXx8fHwxNzU5NjkyMjM0fDA&ixlib=rb-4.1.0&q=80&w=1080", category: "Seating" },
      { id: 2, name: "Oak Coffee Table", price: 499, image: "https://images.unsplash.com/photo-1658367754793-1200cee7b3d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBjb2ZmZWUlMjB0YWJsZXxlbnwxfHx8fDE3NTk3MTQxMDZ8MA&ixlib=rb-4.1.0&q=80&w=1080", category: "Tables" },
      { id: 5, name: "Arc Floor Lamp", price: 299, image: "https://images.unsplash.com/photo-1759647020559-2f91a4290ae4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbG9vciUyMGxhbXAlMjBtb2Rlcm58ZW58MXx8fHwxNzU5NzE0MTA3fDA&ixlib=rb-4.1.0&q=80&w=1080", category: "Lighting" },
    ],
    "Bohemian": [
      { id: 1, name: "Modern Velvet Sofa", price: 1299, image: "https://images.unsplash.com/photo-1603192399946-8bbb0703cfc4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzb2ZhJTIwY291Y2h8ZW58MXx8fHwxNzU5NjkyMjM0fDA&ixlib=rb-4.1.0&q=80&w=1080", category: "Seating" },
      { id: 3, name: "Minimalist Armchair", price: 799, image: "https://images.unsplash.com/photo-1713286663271-809d910c0c65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYXJtY2hhaXJ8ZW58MXx8fHwxNzU5NzE0MTA3fDA&ixlib=rb-4.1.0&q=80&w=1080", category: "Seating" },
      { id: 5, name: "Arc Floor Lamp", price: 299, image: "https://images.unsplash.com/photo-1759647020559-2f91a4290ae4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbG9vciUyMGxhbXAlMjBtb2Rlcm58ZW58MXx8fHwxNzU5NzE0MTA3fDA&ixlib=rb-4.1.0&q=80&w=1080", category: "Lighting" },
    ],
    "Luxury Glam": [
      { id: 1, name: "Modern Velvet Sofa", price: 1299, image: "https://images.unsplash.com/photo-1603192399946-8bbb0703cfc4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzb2ZhJTIwY291Y2h8ZW58MXx8fHwxNzU5NjkyMjM0fDA&ixlib=rb-4.1.0&q=80&w=1080", category: "Seating" },
      { id: 3, name: "Minimalist Armchair", price: 799, image: "https://images.unsplash.com/photo-1713286663271-809d910c0c65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYXJtY2hhaXJ8ZW58MXx8fHwxNzU5NzE0MTA3fDA&ixlib=rb-4.1.0&q=80&w=1080", category: "Seating" },
      { id: 5, name: "Arc Floor Lamp", price: 299, image: "https://images.unsplash.com/photo-1759647020559-2f91a4290ae4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbG9vciUyMGxhbXAlMjBtb2Rlcm58ZW58MXx8fHwxNzU5NzE0MTA3fDA&ixlib=rb-4.1.0&q=80&w=1080", category: "Lighting" },
    ],
    "Farmhouse": [
      { id: 2, name: "Oak Coffee Table", price: 499, image: "https://images.unsplash.com/photo-1658367754793-1200cee7b3d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBjb2ZmZWUlMjB0YWJsZXxlbnwxfHx8fDE3NTk3MTQxMDZ8MA&ixlib=rb-4.1.0&q=80&w=1080", category: "Tables" },
      { id: 4, name: "Modern Bookshelf", price: 649, image: "https://images.unsplash.com/photo-1650513259622-081281181c32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBib29rc2hlbGZ8ZW58MXx8fHwxNzU5NzE0MTA3fDA&ixlib=rb-4.1.0&q=80&w=1080", category: "Storage" },
    ],
  },
  "Bedroom": {
    "Modern Minimalist": [
      { id: 8, name: "Platform Bed Frame", price: 1199, image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiZWQlMjBmcmFtZXxlbnwxfHx8fDE3NTk3NTU1Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080", category: "Bedroom" },
      { id: 9, name: "Nightstand", price: 299, image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBuaWdodHN0YW5kfGVufDF8fHx8MTc1OTc1NTU4MHww&ixlib=rb-4.1.0&q=80&w=1080", category: "Bedroom" },
      { id: 3, name: "Minimalist Armchair", price: 799, image: "https://images.unsplash.com/photo-1713286663271-809d910c0c65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYXJtY2hhaXJ8ZW58MXx8fHwxNzU5NzE0MTA3fDA&ixlib=rb-4.1.0&q=80&w=1080", category: "Seating" },
    ],
    "Scandinavian": [
      { id: 8, name: "Platform Bed Frame", price: 1199, image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiZWQlMjBmcmFtZXxlbnwxfHx8fDE3NTk3NTU1Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080", category: "Bedroom" },
      { id: 9, name: "Nightstand", price: 299, image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBuaWdodHN0YW5kfGVufDF8fHx8MTc1OTc1NTU4MHww&ixlib=rb-4.1.0&q=80&w=1080", category: "Bedroom" },
    ],
    "Industrial": [
      { id: 8, name: "Platform Bed Frame", price: 1199, image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiZWQlMjBmcmFtZXxlbnwxfHx8fDE3NTk3NTU1Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080", category: "Bedroom" },
      { id: 9, name: "Nightstand", price: 299, image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBuaWdodHN0YW5kfGVufDF8fHx8MTc1OTc1NTU4MHww&ixlib=rb-4.1.0&q=80&w=1080", category: "Bedroom" },
    ],
    "Bohemian": [
      { id: 8, name: "Platform Bed Frame", price: 1199, image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiZWQlMjBmcmFtZXxlbnwxfHx8fDE3NTk3NTU1Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080", category: "Bedroom" },
      { id: 9, name: "Nightstand", price: 299, image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBuaWdodHN0YW5kfGVufDF8fHx8MTc1OTc1NTU4MHww&ixlib=rb-4.1.0&q=80&w=1080", category: "Bedroom" },
    ],
    "Luxury Glam": [
      { id: 8, name: "Platform Bed Frame", price: 1199, image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiZWQlMjBmcmFtZXxlbnwxfHx8fDE3NTk3NTU1Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080", category: "Bedroom" },
      { id: 9, name: "Nightstand", price: 299, image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBuaWdodHN0YW5kfGVufDF8fHx8MTc1OTc1NTU4MHww&ixlib=rb-4.1.0&q=80&w=1080", category: "Bedroom" },
      { id: 3, name: "Minimalist Armchair", price: 799, image: "https://images.unsplash.com/photo-1713286663271-809d910c0c65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYXJtY2hhaXJ8ZW58MXx8fHwxNzU5NzE0MTA3fDA&ixlib=rb-4.1.0&q=80&w=1080", category: "Seating" },
    ],
    "Farmhouse": [
      { id: 8, name: "Platform Bed Frame", price: 1199, image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiZWQlMjBmcmFtZXxlbnwxfHx8fDE3NTk3NTU1Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080", category: "Bedroom" },
      { id: 9, name: "Nightstand", price: 299, image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBuaWdodHN0YW5kfGVufDF8fHx8MTc1OTc1NTU4MHww&ixlib=rb-4.1.0&q=80&w=1080", category: "Bedroom" },
    ],
  },
  "Dining Room": {
    "Modern Minimalist": [
      { id: 6, name: "Walnut Dining Table", price: 1599, image: "https://images.unsplash.com/photo-1525427232291-d509af8c67f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaW5pbmclMjB0YWJsZSUyMHdvb2RlbnxlbnwxfHx8fDE3NTk1OTk1MTh8MA&ixlib=rb-4.1.0&q=80&w=1080", category: "Tables" },
      { id: 10, name: "Dining Chairs Set", price: 999, image: "https://images.unsplash.com/photo-1604926652539-92e4c77d0e03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkaW5pbmclMjBjaGFpcnN8ZW58MXx8fHwxNzU5NzU1NjExfDA&ixlib=rb-4.1.0&q=80&w=1080", category: "Seating" },
    ],
    "Scandinavian": [
      { id: 6, name: "Walnut Dining Table", price: 1599, image: "https://images.unsplash.com/photo-1525427232291-d509af8c67f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaW5pbmclMjB0YWJsZSUyMHdvb2RlbnxlbnwxfHx8fDE3NTk1OTk1MTh8MA&ixlib=rb-4.1.0&q=80&w=1080", category: "Tables" },
      { id: 10, name: "Dining Chairs Set", price: 999, image: "https://images.unsplash.com/photo-1604926652539-92e4c77d0e03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkaW5pbmclMjBjaGFpcnN8ZW58MXx8fHwxNzU5NzU1NjExfDA&ixlib=rb-4.1.0&q=80&w=1080", category: "Seating" },
      { id: 5, name: "Arc Floor Lamp", price: 299, image: "https://images.unsplash.com/photo-1759647020559-2f91a4290ae4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbG9vciUyMGxhbXAlMjBtb2Rlcm58ZW58MXx8fHwxNzU5NzE0MTA3fDA&ixlib=rb-4.1.0&q=80&w=1080", category: "Lighting" },
    ],
    "Industrial": [
      { id: 6, name: "Walnut Dining Table", price: 1599, image: "https://images.unsplash.com/photo-1525427232291-d509af8c67f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaW5pbmclMjB0YWJsZSUyMHdvb2RlbnxlbnwxfHx8fDE3NTk1OTk1MTh8MA&ixlib=rb-4.1.0&q=80&w=1080", category: "Tables" },
      { id: 10, name: "Dining Chairs Set", price: 999, image: "https://images.unsplash.com/photo-1604926652539-92e4c77d0e03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkaW5pbmclMjBjaGFpcnN8ZW58MXx8fHwxNzU5NzU1NjExfDA&ixlib=rb-4.1.0&q=80&w=1080", category: "Seating" },
    ],
    "Bohemian": [
      { id: 6, name: "Walnut Dining Table", price: 1599, image: "https://images.unsplash.com/photo-1525427232291-d509af8c67f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaW5pbmclMjB0YWJsZSUyMHdvb2RlbnxlbnwxfHx8fDE3NTk1OTk1MTh8MA&ixlib=rb-4.1.0&q=80&w=1080", category: "Tables" },
      { id: 10, name: "Dining Chairs Set", price: 999, image: "https://images.unsplash.com/photo-1604926652539-92e4c77d0e03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkaW5pbmclMjBjaGFpcnN8ZW58MXx8fHwxNzU5NzU1NjExfDA&ixlib=rb-4.1.0&q=80&w=1080", category: "Seating" },
    ],
    "Luxury Glam": [
      { id: 6, name: "Walnut Dining Table", price: 1599, image: "https://images.unsplash.com/photo-1525427232291-d509af8c67f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaW5pbmclMjB0YWJsZSUyMHdvb2RlbnxlbnwxfHx8fDE3NTk1OTk1MTh8MA&ixlib=rb-4.1.0&q=80&w=1080", category: "Tables" },
      { id: 10, name: "Dining Chairs Set", price: 999, image: "https://images.unsplash.com/photo-1604926652539-92e4c77d0e03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkaW5pbmclMjBjaGFpcnN8ZW58MXx8fHwxNzU5NzU1NjExfDA&ixlib=rb-4.1.0&q=80&w=1080", category: "Seating" },
      { id: 5, name: "Arc Floor Lamp", price: 299, image: "https://images.unsplash.com/photo-1759647020559-2f91a4290ae4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbG9vciUyMGxhbXAlMjBtb2Rlcm58ZW58MXx8fHwxNzU5NzE0MTA3fDA&ixlib=rb-4.1.0&q=80&w=1080", category: "Lighting" },
    ],
    "Farmhouse": [
      { id: 6, name: "Walnut Dining Table", price: 1599, image: "https://images.unsplash.com/photo-1525427232291-d509af8c67f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaW5pbmclMjB0YWJsZSUyMHdvb2RlbnxlbnwxfHx8fDE3NTk1OTk1MTh8MA&ixlib=rb-4.1.0&q=80&w=1080", category: "Tables" },
      { id: 10, name: "Dining Chairs Set", price: 999, image: "https://images.unsplash.com/photo-1604926652539-92e4c77d0e03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkaW5pbmclMjBjaGFpcnN8ZW58MXx8fHwxNzU5NzU1NjExfDA&ixlib=rb-4.1.0&q=80&w=1080", category: "Seating" },
    ],
  },
  "Home Office": {
    "Modern Minimalist": [
      { id: 11, name: "Executive Desk", price: 999, image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkZXNrfGVufDF8fHx8MTc1OTc1NTY0M3ww&ixlib=rb-4.1.0&q=80&w=1080", category: "Office" },
      { id: 12, name: "Office Chair", price: 699, image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjBjaGFpciUyMG1vZGVybnxlbnwxfHx8fDE3NTk3NTU2NDN8MA&ixlib=rb-4.1.0&q=80&w=1080", category: "Office" },
      { id: 4, name: "Modern Bookshelf", price: 649, image: "https://images.unsplash.com/photo-1650513259622-081281181c32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBib29rc2hlbGZ8ZW58MXx8fHwxNzU5NzE0MTA3fDA&ixlib=rb-4.1.0&q=80&w=1080", category: "Storage" },
    ],
    "Scandinavian": [
      { id: 11, name: "Executive Desk", price: 999, image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkZXNrfGVufDF8fHx8MTc1OTc1NTY0M3ww&ixlib=rb-4.1.0&q=80&w=1080", category: "Office" },
      { id: 12, name: "Office Chair", price: 699, image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjBjaGFpciUyMG1vZGVybnxlbnwxfHx8fDE3NTk3NTU2NDN8MA&ixlib=rb-4.1.0&q=80&w=1080", category: "Office" },
    ],
    "Industrial": [
      { id: 11, name: "Executive Desk", price: 999, image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkZXNrfGVufDF8fHx8MTc1OTc1NTY0M3ww&ixlib=rb-4.1.0&q=80&w=1080", category: "Office" },
      { id: 12, name: "Office Chair", price: 699, image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjBjaGFpciUyMG1vZGVybnxlbnwxfHx8fDE3NTk3NTU2NDN8MA&ixlib=rb-4.1.0&q=80&w=1080", category: "Office" },
      { id: 4, name: "Modern Bookshelf", price: 649, image: "https://images.unsplash.com/photo-1650513259622-081281181c32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBib29rc2hlbGZ8ZW58MXx8fHwxNzU5NzE0MTA3fDA&ixlib=rb-4.1.0&q=80&w=1080", category: "Storage" },
    ],
    "Bohemian": [
      { id: 11, name: "Executive Desk", price: 999, image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkZXNrfGVufDF8fHx8MTc1OTc1NTY0M3ww&ixlib=rb-4.1.0&q=80&w=1080", category: "Office" },
      { id: 12, name: "Office Chair", price: 699, image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjBjaGFpciUyMG1vZGVybnxlbnwxfHx8fDE3NTk3NTU2NDN8MA&ixlib=rb-4.1.0&q=80&w=1080", category: "Office" },
    ],
    "Luxury Glam": [
      { id: 11, name: "Executive Desk", price: 999, image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkZXNrfGVufDF8fHx8MTc1OTc1NTY0M3ww&ixlib=rb-4.1.0&q=80&w=1080", category: "Office" },
      { id: 12, name: "Office Chair", price: 699, image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjBjaGFpciUyMG1vZGVybnxlbnwxfHx8fDE3NTk3NTU2NDN8MA&ixlib=rb-4.1.0&q=80&w=1080", category: "Office" },
      { id: 4, name: "Modern Bookshelf", price: 649, image: "https://images.unsplash.com/photo-1650513259622-081281181c32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBib29rc2hlbGZ8ZW58MXx8fHwxNzU5NzE0MTA3fDA&ixlib=rb-4.1.0&q=80&w=1080", category: "Storage" },
    ],
    "Farmhouse": [
      { id: 11, name: "Executive Desk", price: 999, image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkZXNrfGVufDF8fHx8MTc1OTc1NTY0M3ww&ixlib=rb-4.1.0&q=80&w=1080", category: "Office" },
      { id: 12, name: "Office Chair", price: 699, image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjBjaGFpciUyMG1vZGVybnxlbnwxfHx8fDE3NTk3NTU2NDN8MA&ixlib=rb-4.1.0&q=80&w=1080", category: "Office" },
    ],
  },
};

export function DesignChatbot({ onAddToCart }: DesignChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState<"greeting" | "style" | "budget" | "recommendations" | "followup" | "end">("greeting");
  const [userPreferences, setUserPreferences] = useState({
    room: "",
    style: "",
    budget: ""
  });
  const [itemsAddedThisSession, setItemsAddedThisSession] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initial greeting
      setTimeout(() => {
        addBotMessage(conversationFlow.greeting.message, conversationFlow.greeting.options);
      }, 500);
    }
  }, [isOpen]);

  const addBotMessage = (content: string, options?: string[], products?: any[]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type: products ? "product" : options ? "options" : "bot",
      content,
      timestamp: new Date(),
      options,
      products
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addUserMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleOptionClick = (option: string) => {
    addUserMessage(option);

    // Handle different conversation flows
    setTimeout(() => {
      if (currentStep === "greeting") {
        if (option === "Just Browsing") {
          addBotMessage("No problem! Feel free to explore our collections. I'm here if you need any help. 😊");
          setCurrentStep("end");
        } else {
          setUserPreferences(prev => ({ ...prev, room: option }));
          addBotMessage(conversationFlow.style.message, conversationFlow.style.options);
          setCurrentStep("style");
        }
      } else if (currentStep === "style") {
        setUserPreferences(prev => ({ ...prev, style: option }));
        addBotMessage(conversationFlow.budget.message, conversationFlow.budget.options);
        setCurrentStep("budget");
      } else if (currentStep === "budget") {
        setUserPreferences(prev => ({ ...prev, budget: option }));
        
        // Generate recommendations
        setTimeout(() => {
          const room = userPreferences.room;
          const style = userPreferences.style;
          const products = productRecommendations[room]?.[style] || [];
          
          if (products.length > 0) {
            addBotMessage(conversationFlow.recommendations.message);
            setTimeout(() => {
              addBotMessage("", undefined, products);
              setTimeout(() => {
                addBotMessage(conversationFlow.followup.message, conversationFlow.followup.options);
                setCurrentStep("followup");
              }, 500);
            }, 500);
          } else {
            addBotMessage("I'm currently updating recommendations for this combination. Would you like to explore our complete catalog instead?");
            setCurrentStep("followup");
          }
        }, 500);
      } else if (currentStep === "followup") {
        if (option === "Show More Products") {
          addBotMessage("Let me show you more options from our collection...");
          setTimeout(() => {
            const room = userPreferences.room;
            const style = userPreferences.style;
            const products = productRecommendations[room]?.[style] || [];
            addBotMessage("", undefined, products);
          }, 800);
        } else if (option === "Different Style") {
          setCurrentStep("style");
          setUserPreferences(prev => ({ ...prev, style: "", budget: "" }));
          addBotMessage(conversationFlow.style.message, conversationFlow.style.options);
        } else if (option === "Talk to Designer") {
          addBotMessage("That's great! Our design experts are available Mon-Fri, 9AM-6PM. You can also schedule a virtual consultation by calling (555) 123-4567 or emailing design@visionstudio.com.");
          setCurrentStep("end");
        } else {
          addBotMessage("Wonderful! Thanks for chatting with me. Happy shopping! 🎉");
          setCurrentStep("end");
        }
      }
    }, 600);
  };

  const handleStartOver = () => {
    setMessages([]);
    setCurrentStep("greeting");
    setUserPreferences({ room: "", style: "", budget: "" });
    setItemsAddedThisSession(0);
    setTimeout(() => {
      addBotMessage(conversationFlow.greeting.message, conversationFlow.greeting.options);
    }, 500);
  };

  const handleProductAddToCart = (product: any) => {
    if (onAddToCart) {
      onAddToCart(product);
      setItemsAddedThisSession(prev => prev + 1);
      toast.success(`${product.name} added to cart!`);
    }
  };

  const handleAddAllToCart = (products: any[]) => {
    if (onAddToCart) {
      products.forEach(product => {
        onAddToCart(product);
      });
      setItemsAddedThisSession(prev => prev + products.length);
      toast.success(`Added ${products.length} items to cart!`);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              size="lg"
              onClick={() => setIsOpen(true)}
              className="h-16 w-16 rounded-full shadow-2xl bg-stone-900 hover:bg-stone-800 group relative"
            >
              <MessageCircle className="h-7 w-7 text-white" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
              
              {/* Tooltip */}
              <div className="absolute bottom-full right-0 mb-2 px-4 py-2 bg-stone-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Chat with Design Assistant
                <div className="absolute top-full right-6 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-stone-900" />
              </div>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-3rem)]"
          >
            <Card className="shadow-2xl border-stone-200 overflow-hidden flex flex-col h-[600px] max-h-[calc(100vh-3rem)]">
              {/* Header */}
              <div className="bg-gradient-to-r from-stone-900 to-stone-700 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-white">Design Assistant</h3>
                    <p className="text-xs text-white/80">Online • Ready to help</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Cart Badge */}
                  {itemsAddedThisSession > 0 && (
                    <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md rounded-full px-3 py-1">
                      <ShoppingCart className="h-3 w-3 text-white" />
                      <span className="text-xs text-white">{itemsAddedThisSession}</span>
                    </div>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleStartOver}
                    className="h-8 w-8 p-0 text-white hover:bg-white/10"
                  >
                    <ArrowRight className="h-4 w-4 rotate-180" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8 p-0 text-white hover:bg-white/10"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.type === "user" ? (
                      <div className="bg-stone-900 text-white rounded-2xl rounded-br-sm px-4 py-2 max-w-[80%]">
                        <p className="text-sm">{message.content}</p>
                      </div>
                    ) : message.type === "product" && message.products ? (
                      <div className="w-full space-y-3">
                        {/* Add All Button */}
                        {message.products.length > 1 && (
                          <div className="flex justify-between items-center bg-white rounded-lg p-3 border border-stone-200">
                            <div>
                              <p className="text-sm">
                                {message.products.length} items • B${message.products.reduce((sum, p) => sum + p.price, 0).toLocaleString()}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handleAddAllToCart(message.products!)}
                              className="rounded-full gap-1 bg-stone-900 hover:bg-stone-800"
                            >
                              <Sparkles className="h-3 w-3" />
                              Add All to Cart
                            </Button>
                          </div>
                        )}
                        
                        {/* Individual Product Cards */}
                        {message.products.map((product) => (
                          <Card key={product.id} className="p-3 hover:shadow-md transition-shadow bg-white">
                            <div className="flex gap-3">
                              <div className="w-20 h-20 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm mb-1 truncate">{product.name}</h4>
                                <Badge variant="outline" className="text-xs mb-2">{product.category}</Badge>
                                <p className="font-semibold text-sm">B${product.price.toLocaleString()}</p>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => handleProductAddToCart(product)}
                                className="h-8 px-3 flex-shrink-0 rounded-full"
                              >
                                Add
                              </Button>
                            </div>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="max-w-[80%]">
                        <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-2 shadow-sm border border-stone-200">
                          <p className="text-sm text-stone-700">{message.content}</p>
                        </div>
                        {message.options && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {message.options.map((option) => (
                              <Button
                                key={option}
                                size="sm"
                                variant="outline"
                                onClick={() => handleOptionClick(option)}
                                className="rounded-full text-xs h-8 hover:bg-stone-900 hover:text-white transition-colors"
                              >
                                {option}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Footer */}
              <div className="p-3 bg-white border-t border-stone-200">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    Powered by Vision Studio AI
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}