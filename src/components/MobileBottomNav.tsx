import { Home, ShoppingBag, User, Sparkles, ShoppingCart } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

interface MobileBottomNavProps {
  currentView: "home" | "account" | "checkout" | "about" | "faq" | "services" | "contact" | "terms" | "privacy" | "crm";
  onNavigateHome: () => void;
  onViewProducts: () => void;
  onViewCart: () => void;
  onViewAccount: () => void;
  onViewCustomize: () => void;
  cartItemCount?: number;
  user: { name: string; email: string } | null;
  onSignInClick: () => void;
}

export function MobileBottomNav({
  currentView,
  onNavigateHome,
  onViewProducts,
  onViewCart,
  onViewAccount,
  onViewCustomize,
  cartItemCount = 0,
  user,
  onSignInClick,
}: MobileBottomNavProps) {
  const { t } = useLanguage();

  const handleAccountClick = () => {
    if (user) {
      onViewAccount();
    } else {
      onSignInClick();
    }
  };

  const navItems = [
    {
      id: "home",
      icon: Home,
      label: t.mobileNav?.home || "Home",
      onClick: onNavigateHome,
      isActive: currentView === "home",
    },
    {
      id: "products",
      icon: ShoppingBag,
      label: t.mobileNav?.products || "Products",
      onClick: onViewProducts,
      isActive: false,
    },
    {
      id: "customize",
      icon: Sparkles,
      label: t.mobileNav?.customize || "Customize",
      onClick: onViewCustomize,
      isActive: false,
    },
    {
      id: "cart",
      icon: ShoppingCart,
      label: t.mobileNav?.cart || "Cart",
      onClick: onViewCart,
      isActive: currentView === "checkout",
      badge: cartItemCount > 0 ? cartItemCount : undefined,
    },
    {
      id: "account",
      icon: User,
      label: t.mobileNav?.account || "Account",
      onClick: handleAccountClick,
      isActive: currentView === "account",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border shadow-lg mobile-bottom-nav safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={item.onClick}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full relative transition-all duration-200 active:scale-95 ${
                item.isActive
                  ? "text-primary"
                  : "text-muted-foreground active:text-foreground"
              }`}
            >
              {/* Active indicator bar */}
              {item.isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-primary rounded-b-full" />
              )}
              
              {/* Icon container with subtle background on active */}
              <div className={`relative p-1 rounded-full transition-colors ${
                item.isActive ? "bg-primary/10" : ""
              }`}>
                <Icon 
                  className={`h-6 w-6 transition-all ${
                    item.isActive ? "stroke-[2.5]" : "stroke-[2]"
                  }`} 
                  strokeWidth={item.isActive ? 2.5 : 2}
                />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 h-4 min-w-[1rem] px-1 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] font-bold shadow-sm">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              
              {/* Label */}
              <span
                className={`text-[10px] font-medium leading-tight transition-all ${
                  item.isActive ? "text-primary scale-105" : ""
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
