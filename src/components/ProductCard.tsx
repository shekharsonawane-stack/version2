import { Heart, Loader2, Eye, Star, Check, ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./ui/dialog";
import { useState, useEffect } from "react";
import { toast } from "sonner@2.0.3";
import { API_BASE, publicAnonKey } from "../utils/supabase/client";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { trackProductView } from "../utils/journey-tracker";

interface ProductVariant {
  color: string;
  colorHex: string;
  material?: string;
}

interface ProductSize {
  label: string;
  dimensions?: string;
  priceAdjustment?: number;
}

interface ProductCardProps {
  id?: number;
  name: string;
  price: number;
  image: string;
  category: string;
  rating?: number;
  reviewCount?: number;
  badge?: "New" | "Sale" | "Bestseller";
  discount?: number;
  variants?: ProductVariant[];
  sizes?: ProductSize[];
  inStock?: boolean;
  user?: { name: string; email: string; userId?: string } | null;
  onAddToCart?: (options: {
    variant?: ProductVariant;
    size?: ProductSize;
    quantity: number;
  }) => void;
}

export function ProductCard({
  id,
  name,
  price,
  image,
  category,
  rating = 5,
  reviewCount = 0,
  badge,
  discount,
  variants = [],
  sizes = [],
  inStock = true,
  user,
  onAddToCart,
}: ProductCardProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    variants.length > 0 ? variants[0] : undefined
  );
  const [selectedSize, setSelectedSize] = useState<ProductSize | undefined>(
    sizes.length > 0 ? sizes[0] : undefined
  );
  const [quantity, setQuantity] = useState(1);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);

  const finalPrice = selectedSize?.priceAdjustment
    ? price + selectedSize.priceAdjustment
    : price;
  const discountedPrice = discount ? finalPrice * (1 - discount / 100) : finalPrice;

  // Check if product is already favorited on mount
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!user?.userId || !id) {
        console.log('⏭️ Skipping favorite check:', { hasUser: !!user, userId: user?.userId, productId: id });
        return;
      }
      
      console.log('🔍 Checking favorite status for product:', { userId: user.userId, productId: id, productName: name });
      
      try {
        const response = await fetch(`${API_BASE}/favorites/${user.userId}`, {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`
          }
        });
        
        console.log('📥 Favorites check response:', { 
          ok: response.ok, 
          status: response.status 
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('📦 User favorites data:', { 
            favoritesCount: data.favorites?.length || 0,
            favoriteIds: data.favorites?.map((f: any) => f.productId) || []
          });
          
          const isFav = data.favorites?.some((fav: any) => fav.productId === String(id));
          console.log(`${isFav ? '❤️' : '🤍'} Product ${id} is ${isFav ? 'FAVORITED' : 'NOT favorited'}`);
          setIsFavorite(isFav);
        }
      } catch (error) {
        console.error('❌ Error checking favorite status:', error);
      }
    };
    
    checkFavoriteStatus();
  }, [user?.userId, id]);

  const handleAddToCart = () => {
    if (!inStock) {
      toast.error("This item is currently out of stock");
      return;
    }
    
    onAddToCart?.({
      variant: selectedVariant,
      size: selectedSize,
      quantity,
    });
  };

  const toggleFavorite = async () => {
    // If user is not logged in, prompt them to sign in
    if (!user?.userId || !id) {
      console.log('❌ Favorites error - Missing data:', { 
        hasUser: !!user, 
        userId: user?.userId, 
        productId: id 
      });
      toast.error("Please sign in to save favorites");
      return;
    }
    
    console.log('🔄 Toggling favorite:', { 
      userId: user.userId, 
      productId: id, 
      productName: name,
      currentState: isFavorite ? 'REMOVING' : 'ADDING'
    });
    
    setIsLoadingFavorite(true);
    
    try {
      const endpoint = `${API_BASE}/favorites`;
      const method = isFavorite ? 'DELETE' : 'POST';
      const body = isFavorite 
        ? { userId: user.userId, productId: String(id) }
        : { 
            userId: user.userId, 
            productId: String(id),
            productName: name,
            price,
            image,
            category
          };
      
      console.log('📤 Sending request:', { endpoint, method, body });
      
      const response = await fetch(endpoint, {
        method,
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      
      const responseData = await response.json();
      console.log('📥 Response:', { ok: response.ok, status: response.status, data: responseData });
      
      if (response.ok) {
        setIsFavorite(!isFavorite);
        toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
        console.log(isFavorite ? '💔 Removed from favorites:' : '❤️ Added to favorites:', name);
      } else {
        throw new Error(responseData.error || 'Failed to update favorites');
      }
    } catch (error) {
      console.error('❌ Error updating favorite status:', error);
      toast.error("Failed to update favorite status");
    } finally {
      setIsLoadingFavorite(false);
    }
  };

  useEffect(() => {
    if (isQuickViewOpen && id) {
      trackProductView(String(id), name, price);
    }
  }, [isQuickViewOpen, id, name, price]);

  return (
    <>
      <div className="group">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted mb-4">
          <ImageWithFallback
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <span className="bg-white/90 backdrop-blur-sm text-foreground px-3 py-1.5 rounded-full text-xs">
              {category}
            </span>
            {badge && (
              <Badge
                className={`
                  ${badge === "New" ? "bg-blue-500" : ""}
                  ${badge === "Sale" ? "bg-red-500" : ""}
                  ${badge === "Bestseller" ? "bg-amber-500" : ""}
                  text-white rounded-full px-3 py-1.5 text-xs
                `}
              >
                {badge}
              </Badge>
            )}
            {discount && discount > 0 && (
              <Badge className="bg-red-500 text-white rounded-full px-3 py-1.5 text-xs">
                -{discount}%
              </Badge>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 transition-opacity">
            <Button
              size="icon"
              variant="secondary"
              className={`h-10 w-10 rounded-full shadow-lg transition-all ${
                isFavorite ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}
              onClick={toggleFavorite}
              disabled={isLoadingFavorite}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="h-10 w-10 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => setIsQuickViewOpen(true)}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>

          {/* Stock Status Overlay */}
          {!inStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white px-4 py-2 bg-black/80 rounded-lg">
                Out of Stock
              </span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        <div className="space-y-3">
          {/* Rating */}
          {reviewCount > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < rating ? "fill-amber-400 text-amber-400" : "text-stone-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">({reviewCount})</span>
            </div>
          )}

          {/* Product Info */}
          <div>
            <h3 className="mb-1.5">{name}</h3>
            <div className="flex items-baseline gap-2">
              {discount && discount > 0 ? (
                <>
                  <p className="text-lg">
                    B${discountedPrice.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground line-through">
                    B${finalPrice.toLocaleString()}
                  </p>
                </>
              ) : (
                <p className="text-muted-foreground text-lg">
                  B${finalPrice.toLocaleString()}
                </p>
              )}
            </div>
          </div>

          {/* Color Variants */}
          {variants.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">
                Color: {selectedVariant?.color}
              </p>
              <div className="flex gap-2">
                {variants.map((variant) => (
                  <button
                    key={variant.color}
                    onClick={() => setSelectedVariant(variant)}
                    className={`
                      w-8 h-8 rounded-full border-2 transition-all
                      ${
                        selectedVariant?.color === variant.color
                          ? "border-stone-900 scale-110"
                          : "border-stone-300 hover:border-stone-400"
                      }
                    `}
                    style={{ backgroundColor: variant.colorHex }}
                    title={variant.color}
                  >
                    {selectedVariant?.color === variant.color && (
                      <Check className="h-4 w-4 text-white mx-auto drop-shadow" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Options */}
          {sizes.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">Size</p>
              <div className="flex gap-2 flex-wrap">
                {sizes.map((size) => (
                  <button
                    key={size.label}
                    onClick={() => setSelectedSize(size)}
                    className={`
                      px-3 py-1.5 rounded-lg border text-xs transition-all
                      ${
                        selectedSize?.label === size.label
                          ? "border-stone-900 bg-stone-900 text-white"
                          : "border-stone-300 hover:border-stone-400"
                      }
                    `}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <Button
            className="w-full gap-2 rounded-full h-11"
            size="lg"
            onClick={handleAddToCart}
            disabled={!inStock}
          >
            <ShoppingCart className="h-4 w-4" />
            {inStock ? "Add to Cart" : "Out of Stock"}
          </Button>
        </div>
      </div>

      {/* Quick View Dialog */}
      <Dialog open={isQuickViewOpen} onOpenChange={setIsQuickViewOpen}>
        <DialogContent className="max-w-4xl">
          <DialogTitle>{name}</DialogTitle>
          <DialogDescription className="sr-only">
            Quick view of {name} with detailed options
          </DialogDescription>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Image */}
            <div className="aspect-square rounded-2xl overflow-hidden bg-muted">
              <ImageWithFallback
                src={image}
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Details */}
            <div className="space-y-6">
              {/* Category & Rating */}
              <div className="flex items-center justify-between">
                <Badge variant="outline">{category}</Badge>
                {reviewCount > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < rating ? "fill-amber-400 text-amber-400" : "text-stone-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({reviewCount} reviews)
                    </span>
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                {discount && discount > 0 ? (
                  <>
                    <p className="text-3xl">B${discountedPrice.toLocaleString()}</p>
                    <p className="text-xl text-muted-foreground line-through">
                      B${finalPrice.toLocaleString()}
                    </p>
                    <Badge className="bg-red-500 text-white">-{discount}%</Badge>
                  </>
                ) : (
                  <p className="text-3xl">B${finalPrice.toLocaleString()}</p>
                )}
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">
                Premium quality furniture crafted with attention to detail. Perfect for
                modern living spaces seeking both style and comfort.
              </p>

              {/* Variants */}
              {variants.length > 0 && (
                <div>
                  <p className="mb-3">
                    Color: <span className="font-medium">{selectedVariant?.color}</span>
                    {selectedVariant?.material && (
                      <span className="text-muted-foreground">
                        {" "}
                        • {selectedVariant.material}
                      </span>
                    )}
                  </p>
                  <div className="flex gap-3">
                    {variants.map((variant) => (
                      <button
                        key={variant.color}
                        onClick={() => setSelectedVariant(variant)}
                        className={`
                          w-12 h-12 rounded-lg border-2 transition-all flex items-center justify-center
                          ${
                            selectedVariant?.color === variant.color
                              ? "border-stone-900 scale-105"
                              : "border-stone-300 hover:border-stone-400"
                          }
                        `}
                        style={{ backgroundColor: variant.colorHex }}
                        title={`${variant.color}${variant.material ? ` - ${variant.material}` : ""}`}
                      >
                        {selectedVariant?.color === variant.color && (
                          <Check className="h-5 w-5 text-white drop-shadow" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {sizes.length > 0 && (
                <div>
                  <p className="mb-3">Size</p>
                  <div className="grid grid-cols-2 gap-3">
                    {sizes.map((size) => (
                      <button
                        key={size.label}
                        onClick={() => setSelectedSize(size)}
                        className={`
                          p-4 rounded-xl border text-left transition-all
                          ${
                            selectedSize?.label === size.label
                              ? "border-stone-900 bg-stone-50"
                              : "border-stone-300 hover:border-stone-400"
                          }
                        `}
                      >
                        <p className="font-medium text-sm">{size.label}</p>
                        {size.dimensions && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {size.dimensions}
                          </p>
                        )}
                        {size.priceAdjustment && size.priceAdjustment !== 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {size.priceAdjustment > 0 ? "+" : ""}$
                            {size.priceAdjustment}
                          </p>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <p className="mb-3">Quantity</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-stone-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 hover:bg-stone-100 transition-colors"
                    >
                      −
                    </button>
                    <span className="px-6 py-2 border-x border-stone-300 min-w-[60px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 hover:bg-stone-100 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  {inStock ? (
                    <span className="text-sm text-green-600 flex items-center gap-1">
                      <Check className="h-4 w-4" />
                      In Stock
                    </span>
                  ) : (
                    <span className="text-sm text-red-600">Out of Stock</span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  className="flex-1 gap-2 rounded-full h-12"
                  onClick={() => {
                    handleAddToCart();
                    setIsQuickViewOpen(false);
                  }}
                  disabled={!inStock}
                >
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-12 w-12 rounded-full"
                  onClick={toggleFavorite}
                  disabled={isLoadingFavorite}
                >
                  <Heart
                    className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`}
                  />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}