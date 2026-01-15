import { Logo } from "./Logo";

interface FooterProps {
  onNavigate?: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const handleNavigation = (page: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate?.(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSmoothScroll = (sectionId: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="border-t border-border/40 bg-background mt-32">
      <div className="container mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <div className="mb-4">
              <Logo variant="default" size="md" />
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Transform your space with our curated collection of modern furniture.
            </p>
          </div>
          
          <div>
            <h4 className="mb-5 text-sm font-semibold">Shop</h4>
            <ul className="space-y-3 text-muted-foreground text-sm">
              <li>
                <a 
                  href="#products" 
                  className="hover:text-foreground transition-colors"
                  onClick={handleSmoothScroll('products')}
                >
                  All Products
                </a>
              </li>
              <li>
                <a 
                  href="#room-ideas" 
                  className="hover:text-foreground transition-colors"
                  onClick={handleSmoothScroll('room-ideas')}
                >
                  Room Packages
                </a>
              </li>
              <li>
                <a 
                  href="#home-staging" 
                  className="hover:text-foreground transition-colors"
                  onClick={handleSmoothScroll('home-staging')}
                >
                  Home Staging
                </a>
              </li>
              <li>
                <a 
                  href="#showcase" 
                  className="hover:text-foreground transition-colors"
                  onClick={handleSmoothScroll('showcase')}
                >
                  Before & After
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="mb-5 text-sm font-semibold">Support</h4>
            <ul className="space-y-3 text-muted-foreground text-sm">
              <li><a href="#" onClick={handleNavigation('contact')} className="hover:text-foreground transition-colors">Contact Us</a></li>
              <li><a href="#" onClick={handleNavigation('services')} className="hover:text-foreground transition-colors">Delivery & Installation</a></li>
              <li><a href="#" onClick={handleNavigation('faq')} className="hover:text-foreground transition-colors">FAQ</a></li>
              <li><a href="#about" className="hover:text-foreground transition-colors">Returns Policy</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="mb-5 text-sm font-semibold">Company</h4>
            <ul className="space-y-3 text-muted-foreground text-sm">
              <li><a href="#" onClick={handleNavigation('about')} className="hover:text-foreground transition-colors">About Us</a></li>
              <li><a href="#" onClick={handleNavigation('services')} className="hover:text-foreground transition-colors">Our Services</a></li>
              <li><a href="#" onClick={handleNavigation('privacy')} className="hover:text-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#" onClick={handleNavigation('terms')} className="hover:text-foreground transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border/40 mt-12 pt-8 text-center text-muted-foreground text-sm">
          <p>&copy; 2025 Vision Studio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
