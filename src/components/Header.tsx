import { ShoppingCart, Menu, User, LogOut, Settings, Heart, X, ChevronDown, ArrowRight, Play, Globe, Shield } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "./ui/sheet";
import { Separator } from "./ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Logo } from "./Logo";
import { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";

interface HeaderProps {
  user: { name: string; email: string } | null;
  onSignInClick: () => void;
  onSignOut: () => void;
  onViewAccount?: () => void;
  onNavigateHome?: () => void;
  cartItemCount?: number;
  onCartClick?: () => void;
  onAdminClick?: () => void;
}

export function Header({ user, onSignInClick, onSignOut, onViewAccount, onNavigateHome, cartItemCount = 0, onCartClick, onAdminClick }: HeaderProps) {
  const { language, setLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRoomIdeasOpen, setIsRoomIdeasOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isDemoVideoOpen, setIsDemoVideoOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMobileSignOut = () => {
    setIsMobileMenuOpen(false);
    onSignOut();
  };

  return (
    <header 
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? "border-b border-border/40 bg-background/95 backdrop-blur-xl shadow-sm" 
          : "border-b border-white/10 bg-transparent backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-6 lg:px-8">
        <div className="flex items-center gap-12">
          <div onClick={onNavigateHome} className="cursor-pointer">
            <Logo 
              variant={isScrolled ? "default" : "light"} 
              size="md"
            />
          </div>
          <nav className="hidden lg:flex gap-8">
            {/* How It Works Dropdown */}
            <div className="relative group">
              <a
                href="#how-it-works"
                className={`text-sm transition-colors inline-flex items-center gap-1 ${
                  isScrolled 
                    ? "text-muted-foreground hover:text-foreground" 
                    : "text-white/90 hover:text-white"
                }`}
              >
                {t.header.howItWorks}
                <ChevronDown className="h-3 w-3 transition-transform group-hover:rotate-180" />
              </a>
              
              {/* Dropdown Menu */}
              <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="bg-white rounded-xl shadow-xl border border-stone-200 py-2 w-48">
                  <button
                    onClick={() => setIsDemoVideoOpen(true)}
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-stone-50 transition-colors flex items-center gap-2 group/item"
                  >
                    <Play className="h-4 w-4 text-stone-500 group-hover/item:text-stone-900" />
                    <span>{t.header.demo}</span>
                  </button>
                  <a
                    href="#how-it-works"
                    onClick={(e) => {
                      e.preventDefault();
                      setTimeout(() => {
                        const element = document.getElementById('how-it-works');
                        if (element) element.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                    className="block px-4 py-2.5 text-sm hover:bg-stone-50 transition-colors"
                  >
                    {t.header.theProcess}
                  </a>
                </div>
              </div>
            </div>
            
            {/* Room Ideas Mega Menu */}
            <div className="relative group">
              <a
                href="#room-ideas"
                className={`text-sm transition-colors inline-flex items-center gap-1 ${
                  isScrolled 
                    ? "text-muted-foreground hover:text-foreground" 
                    : "text-white/90 hover:text-white"
                }`}
              >
                {t.header.roomIdeas}
                <ChevronDown className="h-3 w-3 transition-transform group-hover:rotate-180" />
              </a>
              
              {/* Mega Menu Dropdown */}
              <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 p-8 w-[720px]">
                  {/* Header */}
                  <div className="mb-6">
                    <h3 className="mb-1">{t.header.roomPackages}</h3>
                    <p className="text-sm text-muted-foreground">{t.header.roomPackagesDesc}</p>
                  </div>
                  
                  {/* Grid Layout */}
                  <div className="grid grid-cols-3 gap-6 mb-6">
                    {/* Living Rooms */}
                    <a href="#room-ideas" className="group/item" onClick={(e) => {
                      e.preventDefault();
                      setTimeout(() => {
                        const element = document.getElementById('room-ideas');
                        if (element) element.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}>
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-stone-100">
                        <ImageWithFallback
                          src="https://images.unsplash.com/photo-1631679706909-1844bbd07221?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc1OTc0MzU1Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                          alt="Living Rooms"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent" />
                        <div className="absolute bottom-2 left-2 right-2">
                          <p className="text-white text-sm font-medium drop-shadow-lg">{t.header.livingRooms}</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">{t.header.modernCozy}</p>
                    </a>

                    {/* Bedrooms */}
                    <a href="#room-ideas" className="group/item" onClick={(e) => {
                      e.preventDefault();
                      setTimeout(() => {
                        const element = document.getElementById('room-ideas');
                        if (element) element.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}>
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-stone-100">
                        <ImageWithFallback
                          src="https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYmVkcm9vbXxlbnwxfHx8fDE3NTk2ODU2NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                          alt="Bedrooms"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent" />
                        <div className="absolute bottom-2 left-2 right-2">
                          <p className="text-white text-sm font-medium drop-shadow-lg">{t.header.bedrooms}</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">{t.header.peacefulRetreats}</p>
                    </a>

                    {/* Dining Rooms */}
                    <a href="#room-ideas" className="group/item" onClick={(e) => {
                      e.preventDefault();
                      setTimeout(() => {
                        const element = document.getElementById('room-ideas');
                        if (element) element.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}>
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-stone-100">
                        <ImageWithFallback
                          src="https://images.unsplash.com/photo-1616486886892-ff366aa67ba4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaW5pbmclMjByb29tfGVufDF8fHx8MTc1OTczOTU0OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                          alt="Dining Rooms"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent" />
                        <div className="absolute bottom-2 left-2 right-2">
                          <p className="text-white text-sm font-medium drop-shadow-lg">{t.header.diningRooms}</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">{t.header.gatheringSpaces}</p>
                    </a>

                    {/* Office Spaces */}
                    <a href="#room-ideas" className="group/item" onClick={(e) => {
                      e.preventDefault();
                      setTimeout(() => {
                        const element = document.getElementById('room-ideas');
                        if (element) element.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}>
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-stone-100">
                        <ImageWithFallback
                          src="https://images.unsplash.com/photo-1600494603989-9650cf6ddd3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwb2ZmaWNlfGVufDF8fHx8MTc1OTczOTU1MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                          alt="Office Spaces"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent" />
                        <div className="absolute bottom-2 left-2 right-2">
                          <p className="text-white text-sm font-medium drop-shadow-lg">{t.header.homeOffices}</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">{t.header.productiveWork}</p>
                    </a>

                    {/* Reading Nooks */}
                    <a href="#room-ideas" className="group/item" onClick={(e) => {
                      e.preventDefault();
                      setTimeout(() => {
                        const element = document.getElementById('room-ideas');
                        if (element) element.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}>
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-stone-100">
                        <ImageWithFallback
                          src="https://images.unsplash.com/photo-1533327325824-76bc4e62d560?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWFkaW5nJTIwbm9va3xlbnwxfHx8fDE3NTk3NTYzNzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                          alt="Reading Nooks"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent" />
                        <div className="absolute bottom-2 left-2 right-2">
                          <p className="text-white text-sm font-medium drop-shadow-lg">{t.header.readingNooks}</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">{t.header.cozyCorners}</p>
                    </a>

                    {/* Full Apartments */}
                    <a href="#room-ideas" className="group/item" onClick={(e) => {
                      e.preventDefault();
                      setTimeout(() => {
                        const element = document.getElementById('room-ideas');
                        if (element) element.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}>
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-stone-100">
                        <ImageWithFallback
                          src="https://images.unsplash.com/photo-1603072845032-7b5bd641a82a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTk2NTYyODF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                          alt="Full Apartments"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent" />
                        <div className="absolute bottom-2 left-2 right-2">
                          <p className="text-white text-sm font-medium drop-shadow-lg">{t.header.fullPackages}</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">{t.header.completeHomes}</p>
                    </a>
                  </div>

                  {/* Footer CTA */}
                  <div className="pt-6 border-t border-stone-200 space-y-3">
                    <a 
                      href="#home-staging" 
                      className="flex items-center justify-between p-4 rounded-xl bg-stone-50 hover:bg-stone-100 transition-colors group/cta"
                      onClick={(e) => {
                        e.preventDefault();
                        setTimeout(() => {
                          const element = document.getElementById('home-staging');
                          if (element) element.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                      }}
                    >
                      <div>
                        <p className="font-medium mb-0.5">{t.header.completeApartments}</p>
                        <p className="text-xs text-muted-foreground">{t.header.fullHomeStagingPackages}</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-stone-400 transition-transform group-hover/cta:translate-x-1" />
                    </a>
                    <a 
                      href="#customize-room-selection" 
                      className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-stone-900 to-stone-700 hover:from-stone-800 hover:to-stone-600 transition-colors group/cta text-white"
                      onClick={(e) => {
                        e.preventDefault();
                        setTimeout(() => {
                          const element = document.getElementById('customize-room-selection');
                          if (element) element.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                      }}
                    >
                      <div>
                        <p className="font-medium mb-0.5 text-white">{t.header.customizeRoomSelection}</p>
                        <p className="text-xs text-white/80">{t.header.buildYourPerfectSpace}</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-white/80 transition-transform group-hover/cta:translate-x-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Showcase Dropdown */}
            <div className="relative group">
              <a
                href="#showcase"
                className={`text-sm transition-colors inline-flex items-center gap-1 ${
                  isScrolled 
                    ? "text-muted-foreground hover:text-foreground" 
                    : "text-white/90 hover:text-white"
                }`}
              >
                {t.header.showcase}
                <ChevronDown className="h-3 w-3 transition-transform group-hover:rotate-180" />
              </a>
              
              {/* Dropdown Menu with Images */}
              <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="bg-white rounded-xl shadow-xl border border-stone-200 p-4 w-80">
                  <a 
                    href="#showcase" 
                    className="group/item block mb-3"
                    onClick={(e) => {
                      e.preventDefault();
                      setTimeout(() => {
                        const element = document.getElementById('showcase');
                        if (element) element.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                  >
                    <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-2 bg-stone-100">
                      <ImageWithFallback
                        src="https://images.unsplash.com/photo-1651092678180-f60845bb85b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWZvcmUlMjBhZnRlciUyMHJvb20lMjB0cmFuc2Zvcm1hdGlvbnxlbnwxfHx8fDE3NTk5Mjc4Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                        alt="Before & After"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 via-transparent to-transparent" />
                      <div className="absolute bottom-2 left-2 right-2">
                        <p className="text-white font-medium drop-shadow-lg">{t.header.beforeAfter}</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground px-1">{t.header.seeDramaticTransformations}</p>
                  </a>
                  
                  <div className="h-px bg-stone-200 my-3" />
                  
                  <a 
                    href="#our-work" 
                    className="group/item block"
                    onClick={(e) => {
                      e.preventDefault();
                      setTimeout(() => {
                        const element = document.getElementById('our-work');
                        if (element) element.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                  >
                    <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-2 bg-stone-100">
                      <ImageWithFallback
                        src="https://images.unsplash.com/photo-1639664701039-f747268e2243?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbnRlcmlvciUyMGRlc2lnbiUyMHByb2plY3QlMjBwb3J0Zm9saW98ZW58MXx8fHwxNzU5OTI3ODM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                        alt="Our Work"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 via-transparent to-transparent" />
                      <div className="absolute bottom-2 left-2 right-2">
                        <p className="text-white font-medium drop-shadow-lg">{t.header.ourWork}</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground px-1">{t.header.exploreOurPortfolio}</p>
                  </a>
                </div>
              </div>
            </div>
            <a 
              href="#products" 
              className={`text-sm transition-colors ${
                isScrolled 
                  ? "text-muted-foreground hover:text-foreground" 
                  : "text-white/90 hover:text-white"
              }`}
            >
              {t.header.products}
            </a>
            <a 
              href="#testimonials" 
              className={`text-sm transition-colors ${
                isScrolled 
                  ? "text-muted-foreground hover:text-foreground" 
                  : "text-white/90 hover:text-white"
              }`}
            >
              {t.header.reviews}
            </a>
          </nav>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger className={`inline-flex items-center justify-center rounded-full h-10 w-10 transition-colors hover:bg-accent hover:text-accent-foreground ${
              isScrolled ? "" : "text-white hover:bg-white/10"
            }`}>
              <Globe className="h-5 w-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage('en')}>
                <span className={language === 'en' ? 'font-semibold' : ''}>English</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('ms')}>
                <span className={language === 'ms' ? 'font-semibold' : ''}>Bahasa Melayu</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button 
            variant="ghost" 
            size="icon" 
            className={`relative ${
              isScrolled ? "" : "text-white hover:bg-white/10"
            }`}
            onClick={onCartClick}
          >
            <ShoppingCart className="h-5 w-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                {cartItemCount}
              </span>
            )}
          </Button>

          {/* Admin Login Button */}
          {onAdminClick && (
            <Button 
              variant="ghost" 
              size="icon" 
              className={`${
                isScrolled ? "" : "text-white hover:bg-white/10"
              }`}
              onClick={onAdminClick}
              title="Admin Dashboard"
            >
              <Shield className="h-5 w-5" />
            </Button>
          )}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className={`hidden lg:inline-flex items-center justify-center rounded-full h-10 w-10 transition-colors hover:bg-accent hover:text-accent-foreground ${
                isScrolled ? "" : "text-white hover:bg-white/10"
              }`}>
                <User className="h-5 w-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onViewAccount}>
                  <User className="mr-2 h-4 w-4" />
                  <span>{t.header.myAccount}</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Heart className="mr-2 h-4 w-4" />
                  <span>{t.header.savedDesigns}</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>{t.header.preferences}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t.header.signOut}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant={isScrolled ? "default" : "secondary"}
              size="sm"
              onClick={onSignInClick}
              className="hidden lg:flex rounded-full h-9 px-5"
            >
              {t.header.signIn}
            </Button>
          )}

          <Button 
            variant="ghost" 
            size="icon" 
            className={`lg:hidden ${
              isScrolled ? "" : "text-white hover:bg-white/10"
            }`}
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu Sheet */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
          <SheetHeader>
            <SheetTitle>{t.header.menu}</SheetTitle>
          </SheetHeader>

          <div className="flex flex-col gap-6 mt-8">
            {/* User Info Section */}
            {user ? (
              <div className="pb-6 border-b">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center">
                    <User className="h-6 w-6 text-stone-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{user.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onViewAccount?.();
                    }}
                  >
                    <User className="h-4 w-4" />
                    {t.header.myAccount}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Heart className="h-4 w-4" />
                    {t.header.savedDesigns}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Settings className="h-4 w-4" />
                    {t.header.preferences}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="pb-6 border-b">
                <Button 
                  className="w-full rounded-full h-12"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onSignInClick();
                  }}
                >
                  {t.header.signInCreateAccount}
                </Button>
              </div>
            )}

            {/* Navigation Links */}
            <nav className="flex flex-col gap-3">
              {/* How It Works Collapsible */}
              <Collapsible open={isHowItWorksOpen} onOpenChange={setIsHowItWorksOpen}>
                <CollapsibleTrigger className="w-full py-3 text-base hover:text-primary transition-colors flex items-center justify-between">
                  <span>{t.header.howItWorks}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isHowItWorksOpen ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-4 space-y-3 py-3">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsHowItWorksOpen(false);
                      setIsDemoVideoOpen(true);
                    }}
                    className="w-full flex items-center gap-3 py-2 hover:text-primary transition-colors text-left"
                  >
                    <Play className="h-4 w-4" />
                    <span className="text-sm">{t.header.demo}</span>
                  </button>
                  <a
                    href="#how-it-works"
                    className="flex items-center gap-3 py-2 hover:text-primary transition-colors"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsHowItWorksOpen(false);
                    }}
                  >
                    <span className="text-sm">{t.header.theProcess}</span>
                  </a>
                </CollapsibleContent>
              </Collapsible>
              <Separator />
              
              {/* Room Ideas Collapsible */}
              <Collapsible open={isRoomIdeasOpen} onOpenChange={setIsRoomIdeasOpen}>
                <CollapsibleTrigger className="w-full py-3 text-base hover:text-primary transition-colors flex items-center justify-between">
                  <span>{t.header.roomIdeas}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isRoomIdeasOpen ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-4 space-y-3 py-3">
                  <a
                    href="#home-staging"
                    className="flex items-center gap-3 py-2 hover:text-primary transition-colors bg-stone-50 -ml-4 pl-4 pr-4 rounded-lg"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsRoomIdeasOpen(false);
                    }}
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                      <ImageWithFallback
                        src="https://images.unsplash.com/photo-1758977404510-6ab7e07ff1fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcGFydG1lbnQlMjBzdGFnaW5nJTIwZnVybml0dXJlfGVufDF8fHx8MTc1OTc1ODE1Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                        alt="Complete Apartment Solutions"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Complete Apartments</p>
                      <p className="text-xs text-muted-foreground">Full staging packages</p>
                    </div>
                  </a>
                  <a
                    href="#room-ideas"
                    className="flex items-center gap-3 py-2 hover:text-primary transition-colors"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsRoomIdeasOpen(false);
                    }}
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                      <ImageWithFallback
                        src="https://images.unsplash.com/photo-1631679706909-1844bbd07221?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc1OTc0MzU1Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                        alt="Living Rooms"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Living Rooms</p>
                      <p className="text-xs text-muted-foreground">Modern & elegant</p>
                    </div>
                  </a>
                  <a
                    href="#room-ideas"
                    className="flex items-center gap-3 py-2 hover:text-primary transition-colors"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsRoomIdeasOpen(false);
                    }}
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                      <ImageWithFallback
                        src="https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYmVkcm9vbXxlbnwxfHx8fDE3NTk2ODU2NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                        alt="Bedrooms"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Bedrooms</p>
                      <p className="text-xs text-muted-foreground">Peaceful retreats</p>
                    </div>
                  </a>
                  <a
                    href="#room-ideas"
                    className="flex items-center gap-3 py-2 hover:text-primary transition-colors"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsRoomIdeasOpen(false);
                    }}
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                      <ImageWithFallback
                        src="https://images.unsplash.com/photo-1616486886892-ff366aa67ba4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaW5pbmclMjByb29tfGVufDF8fHx8MTc1OTczOTU0OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                        alt="Dining Rooms"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Dining Rooms</p>
                      <p className="text-xs text-muted-foreground">Gathering spaces</p>
                    </div>
                  </a>
                  <a
                    href="#room-ideas"
                    className="flex items-center gap-3 py-2 hover:text-primary transition-colors"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsRoomIdeasOpen(false);
                    }}
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                      <ImageWithFallback
                        src="https://images.unsplash.com/photo-1600494603989-9650cf6ddd3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwb2ZmaWNlfGVufDF8fHx8MTc1OTczOTU1MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                        alt="Office Spaces"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Office Spaces</p>
                      <p className="text-xs text-muted-foreground">Productive work</p>
                    </div>
                  </a>
                  <a
                    href="#room-ideas"
                    className="flex items-center gap-3 py-2 hover:text-primary transition-colors"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsRoomIdeasOpen(false);
                    }}
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                      <ImageWithFallback
                        src="https://images.unsplash.com/photo-1533327325824-76bc4e62d560?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWFkaW5nJTIwbm9va3xlbnwxfHx8fDE3NTk3NTYzNzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                        alt="Reading Nooks"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Reading Nooks</p>
                      <p className="text-xs text-muted-foreground">Cozy corners</p>
                    </div>
                  </a>
                  <Separator className="my-2" />
                  <a
                    href="#customize-room-selection"
                    className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-stone-900 to-stone-700 hover:from-stone-800 hover:to-stone-600 transition-colors text-white -ml-4"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsMobileMenuOpen(false);
                      setIsRoomIdeasOpen(false);
                      setTimeout(() => {
                        const element = document.getElementById('customize-room-selection');
                        if (element) element.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                  >
                    <div>
                      <p className="text-sm font-medium text-white">Customize Room Selection</p>
                      <p className="text-xs text-white/80">Build your perfect space</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-white/80" />
                  </a>
                </CollapsibleContent>
              </Collapsible>
              
              <Separator />
              <a
                href="#showcase"
                className="py-3 text-base hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t.header.showcase}
              </a>
              <Separator />
              <a
                href="#products"
                className="py-3 text-base hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t.header.products}
              </a>
              <Separator />
              <a
                href="#testimonials"
                className="py-3 text-base hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t.header.reviews}
              </a>
            </nav>

            {/* Sign Out Button for logged in users */}
            {user && (
              <div className="mt-auto pt-6 border-t">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                  onClick={handleMobileSignOut}
                >
                  <LogOut className="h-4 w-4" />
                  {t.header.signOut}
                </Button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Demo Video Dialog */}
      <Dialog open={isDemoVideoOpen} onOpenChange={setIsDemoVideoOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Vision Studio Demo</DialogTitle>
          </DialogHeader>
          <div className="aspect-video w-full">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/pB9bnxuvoko"
              title="Vision Studio Demo"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg"
            />
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}