import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Calendar } from "./ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { createOrder } from "../utils/crm-helpers";
import { toast } from "sonner@2.0.3";
import { trackCheckoutStart, trackCheckoutComplete } from "../utils/journey-tracker";
import { 
  ShoppingBag, 
  Truck, 
  CreditCard, 
  CheckCircle2, 
  Calendar as CalendarIcon,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Package,
  Info,
  Building2,
  Trash2
} from "lucide-react";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

interface CheckoutFlowProps {
  cartItems: CartItem[];
  onCheckoutComplete: (orderNumber: string) => void;
  onClose: () => void;
  user: { name: string; email: string; userId?: string } | null;
  onClearCart?: () => void;
  onRemoveFromCart?: (itemId: number, itemName: string) => void;
}

export function CheckoutFlow({ cartItems, onCheckoutComplete, onClose, user, onClearCart, onRemoveFromCart }: CheckoutFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [paymentMethod, setPaymentMethod] = useState<"card" | "bank-transfer" | "fpx" | "financing">("");
  const [deliveryDetails, setDeliveryDetails] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    district: "",
    notes: ""
  });
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: ""
  });
  const [selectedBank, setSelectedBank] = useState("");

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 0; // Free white glove delivery
  const total = subtotal + deliveryFee;

  // Track checkout start when component mounts
  useEffect(() => {
    trackCheckoutStart(total, cartItems.length);
  }, []);

  // Available delivery dates (next 4 weeks, excluding past dates and Sundays)
  const getAvailableDates = () => {
    const today = new Date();
    const fourWeeksFromNow = new Date(today);
    fourWeeksFromNow.setDate(today.getDate() + 28);
    
    return (date: Date) => {
      const day = date.getDay();
      return date >= today && date <= fourWeeksFromNow && day !== 0; // Exclude Sundays
    };
  };

  const handleNextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePlaceOrder = async () => {
    // If user has a userId, create the order in the CRM backend
    if (user?.userId) {
      try {
        console.log("=== ORDER CREATION STARTED ===");
        console.log("User ID:", user.userId);
        console.log("Cart items:", cartItems.length);
        console.log("Total amount:", total);
        
        const orderResult = await createOrder({
          userId: user.userId,
          items: cartItems.map(item => ({
            productId: String(item.id),
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            image: item.image,
          })),
          subtotal: subtotal,
          tax: 0,
          shipping: deliveryFee,
          discount: 0,
          total: total,
          shippingAddress: {
            name: deliveryDetails.fullName,
            street: deliveryDetails.address,
            city: deliveryDetails.district,
            state: deliveryDetails.district,
            postalCode: "",
            country: "Brunei",
            phone: deliveryDetails.phone,
          },
          paymentMethod: paymentMethod,
          notes: deliveryDetails.notes,
        });

        console.log("Order creation result:", orderResult);

        if (orderResult.success && orderResult.orderNumber) {
          // Track checkout complete
          trackCheckoutComplete(orderResult.orderNumber, total, paymentMethod);
          
          // Show confirmation step
          setCurrentStep(5);
          
          // Call completion handler after showing confirmation
          setTimeout(() => {
            onCheckoutComplete(orderResult.orderNumber!);
          }, 3000);
          
          console.log("✅ Order created in CRM successfully!");
          console.log("Order ID:", orderResult.orderId);
          console.log("Order Number:", orderResult.orderNumber);
          toast.success("Order created successfully!");
        } else {
          console.error("❌ Order creation failed:", orderResult.error);
          toast.error(orderResult.error || "Failed to create order. Please try again.");
        }
      } catch (error) {
        console.error("❌ Error creating order:", error);
        toast.error("An error occurred while creating your order.");
      }
    } else {
      // Fallback for users without userId (demo mode)
      console.log("⚠️ No userId found - running in demo mode");
      const orderNumber = `VS-2025-${Math.floor(100000 + Math.random() * 900000)}`;
      setCurrentStep(5);
      
      setTimeout(() => {
        onCheckoutComplete(orderNumber);
      }, 3000);
      
      toast.info("Demo order created (not saved to database)");
    }
  };

  const canProceedToStep2 = cartItems.length > 0;
  const canProceedToStep3 = deliveryDetails.fullName && deliveryDetails.email && 
                            deliveryDetails.phone && deliveryDetails.address && 
                            deliveryDetails.district && selectedDate;
  const canProceedToStep4 = paymentMethod !== "";
  const canPlaceOrder = () => {
    if (paymentMethod === "card") {
      return cardDetails.cardNumber && cardDetails.cardName && cardDetails.expiryDate && cardDetails.cvv;
    } else if (paymentMethod === "fpx") {
      return selectedBank !== "";
    }
    return true; // Bank transfer and financing don't need additional validation
  };

  const districts = [
    "Brunei-Muara",
    "Tutong",
    "Belait",
    "Temburong"
  ];

  const banks = [
    "BIBD",
    "Baiduri Bank",
    "Bank Islam Brunei Darussalam",
    "Standard Chartered Bank",
    "Maybank"
  ];

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, "");
    const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
    return formatted.substring(0, 19); // Max 16 digits + 3 spaces
  };

  // Format expiry date as MM/YY
  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + "/" + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  return (
    <div className="min-h-screen bg-stone-50 pt-32 pb-12">
      <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-2 md:gap-4 overflow-x-auto pb-4">
            {[
              { num: 1, label: "Cart", icon: ShoppingBag },
              { num: 2, label: "Delivery", icon: Truck },
              { num: 3, label: "Method", icon: CreditCard },
              { num: 4, label: "Payment", icon: Package },
              { num: 5, label: "Done", icon: CheckCircle2 }
            ].map((step, idx) => {
              const StepIcon = step.icon;
              const isActive = currentStep === step.num;
              const isCompleted = currentStep > step.num;
              
              return (
                <div key={step.num} className="flex items-center flex-shrink-0">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all ${
                      isCompleted 
                        ? "bg-green-500 text-white" 
                        : isActive 
                          ? "bg-stone-900 text-white" 
                          : "bg-stone-200 text-stone-400"
                    }`}>
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6" />
                      ) : (
                        <StepIcon className="h-4 w-4 md:h-5 md:w-5" />
                      )}
                    </div>
                    <span className={`mt-2 text-xs md:text-sm font-medium ${
                      isActive ? "text-stone-900" : "text-stone-500"
                    }`}>
                      {step.label}
                    </span>
                  </div>
                  {idx < 4 && (
                    <div className={`w-8 md:w-12 h-0.5 mx-1 md:mx-2 ${
                      isCompleted ? "bg-green-500" : "bg-stone-200"
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Cart Review */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5" />
                        Your Cart ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
                      </CardTitle>
                      <CardDescription>Review your items before checkout</CardDescription>
                    </div>
                    {onClearCart && cartItems.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onClearCart}
                        className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                        Clear Cart
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={`${item.id}-${item.name}`} className="flex gap-4 p-4 rounded-lg border group relative">
                      <div className="w-24 h-24 rounded-lg overflow-hidden bg-stone-100">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="mb-1">{item.name}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{item.category}</p>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground">Qty: {item.quantity}</span>
                          <span className="font-medium">B${item.price.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end justify-between">
                        <p className="font-semibold">B${(item.price * item.quantity).toLocaleString()}</p>
                        {onRemoveFromCart && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemoveFromCart(item.id, item.name)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity h-8 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Step 2: Delivery Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Delivery Address
                    </CardTitle>
                    <CardDescription>Where should we deliver your furniture?</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          value={deliveryDetails.fullName}
                          onChange={(e) => setDeliveryDetails({ ...deliveryDetails, fullName: e.target.value })}
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={deliveryDetails.phone}
                          onChange={(e) => setDeliveryDetails({ ...deliveryDetails, phone: e.target.value })}
                          placeholder="+673 XXX XXXX"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={deliveryDetails.email}
                        onChange={(e) => setDeliveryDetails({ ...deliveryDetails, email: e.target.value })}
                        placeholder="john@example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Street Address *</Label>
                      <Input
                        id="address"
                        value={deliveryDetails.address}
                        onChange={(e) => setDeliveryDetails({ ...deliveryDetails, address: e.target.value })}
                        placeholder="House/Building No., Street Name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="district">District *</Label>
                      <select
                        id="district"
                        value={deliveryDetails.district}
                        onChange={(e) => setDeliveryDetails({ ...deliveryDetails, district: e.target.value })}
                        className="flex h-10 w-full rounded-md border border-input bg-input-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Select district</option>
                        {districts.map((district) => (
                          <option key={district} value={district}>{district}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Delivery Notes (Optional)</Label>
                      <Input
                        id="notes"
                        value={deliveryDetails.notes}
                        onChange={(e) => setDeliveryDetails({ ...deliveryDetails, notes: e.target.value })}
                        placeholder="Any special instructions for delivery"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5" />
                      Preferred Delivery Date
                    </CardTitle>
                    <CardDescription>
                      Select your preferred delivery week. Our team will contact you to confirm the exact date and time.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Alert className="mb-4">
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        White Glove Delivery includes professional installation and setup at no extra charge. Available Monday-Saturday.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="flex justify-center">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={getAvailableDates()}
                        className="rounded-md border"
                      />
                    </div>
                    
                    {selectedDate && (
                      <p className="text-sm text-center mt-4 text-muted-foreground">
                        Selected: {selectedDate.toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 3: Payment */}
            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Method
                  </CardTitle>
                  <CardDescription>Choose how you'd like to pay</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <RadioGroup value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                    {/* Financing Option */}
                    <div className="space-y-4">
                      <div className={`relative flex items-start space-x-3 rounded-lg border-2 p-4 cursor-pointer transition-all ${
                        paymentMethod === "financing" ? "border-stone-900 bg-stone-50" : "border-stone-200"
                      }`}>
                        <RadioGroupItem value="financing" id="financing" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="financing" className="cursor-pointer flex items-center gap-2">
                            <Building2 className="h-5 w-5" />
                            <span>BIBD Easy Payment Plan</span>
                            <Badge variant="secondary">Recommended</Badge>
                          </Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            Flexible financing with 0% interest for 12 months. Quick approval process.
                          </p>
                          {paymentMethod === "financing" && (
                            <Alert className="mt-4 bg-blue-50 border-blue-200">
                              <Info className="h-4 w-4 text-blue-600" />
                              <AlertDescription className="text-blue-900">
                                Monthly payment: <strong>B${Math.ceil(total / 12)}/month</strong> for 12 months. 
                                You'll be redirected to BIBD's secure portal to complete your application.
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>
                      </div>

                      {/* Credit/Debit Card - TEMPORARILY DISABLED */}
                      {/* Uncomment after adding STRIPE_SECRET_KEY to Supabase secrets */}
                      {/*
                      <div className={`relative flex items-start space-x-3 rounded-lg border-2 p-4 cursor-pointer transition-all ${
                        paymentMethod === "card" ? "border-stone-900 bg-stone-50" : "border-stone-200"
                      }`}>
                        <RadioGroupItem value="card" id="card" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="card" className="cursor-pointer flex items-center gap-2">
                            <CreditCard className="h-5 w-5" />
                            Credit / Debit Card
                          </Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            Pay securely with Visa, Mastercard, or local debit cards
                          </p>
                        </div>
                      </div>
                      */}

                      {/* FPX */}
                      <div className={`relative flex items-start space-x-3 rounded-lg border-2 p-4 cursor-pointer transition-all ${
                        paymentMethod === "fpx" ? "border-stone-900 bg-stone-50" : "border-stone-200"
                      }`}>
                        <RadioGroupItem value="fpx" id="fpx" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="fpx" className="cursor-pointer flex items-center gap-2">
                            <Building2 className="h-5 w-5" />
                            Online Banking (FPX)
                          </Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            Real-time bank transfer via FPX - instant confirmation
                          </p>
                        </div>
                      </div>

                      {/* Bank Transfer */}
                      <div className={`relative flex items-start space-x-3 rounded-lg border-2 p-4 cursor-pointer transition-all ${
                        paymentMethod === "bank-transfer" ? "border-stone-900 bg-stone-50" : "border-stone-200"
                      }`}>
                        <RadioGroupItem value="bank-transfer" id="bank-transfer" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="bank-transfer" className="cursor-pointer flex items-center gap-2">
                            <Building2 className="h-5 w-5" />
                            Bank Transfer
                          </Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            Direct bank transfer - payment details will be provided after order
                          </p>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Payment Details */}
            {currentStep === 4 && (
              <div className="space-y-6">
                {/* Bank Transfer */}
                {paymentMethod === "bank-transfer" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        Bank Transfer Details
                      </CardTitle>
                      <CardDescription>Please transfer to the following account</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <Alert className="bg-blue-50 border-blue-200">
                        <Info className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-blue-900">
                          Please complete the transfer within 24 hours to secure your order. Upload proof of payment in My Account after transfer.
                        </AlertDescription>
                      </Alert>

                      <div className="bg-stone-50 rounded-lg p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Bank Name</p>
                            <p className="font-semibold">BIBD</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Account Name</p>
                            <p className="font-semibold">Vision Studio Sdn Bhd</p>
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Account Number</p>
                          <div className="flex items-center gap-2">
                            <p className="font-mono text-xl font-semibold">0012345678901</p>
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Transfer Amount</p>
                          <p className="text-2xl font-semibold text-green-600">B${total.toLocaleString()}</p>
                        </div>

                        <Separator />

                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Reference Number</p>
                          <p className="font-mono font-semibold">VS-{Math.floor(100000 + Math.random() * 900000)}</p>
                          <p className="text-xs text-muted-foreground mt-1">Please include this reference in your transfer notes</p>
                        </div>
                      </div>

                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                          After completing the transfer, please upload your payment receipt in the My Account section. Your order will be processed once payment is verified (usually within 1-2 business days).
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>
                )}

                {/* FPX Online Banking */}
                {paymentMethod === "fpx" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        FPX Online Banking
                      </CardTitle>
                      <CardDescription>Select your bank to proceed with payment</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="bank">Select Your Bank *</Label>
                        <select
                          id="bank"
                          value={selectedBank}
                          onChange={(e) => setSelectedBank(e.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-input-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="">Choose your bank</option>
                          {banks.map((bank) => (
                            <option key={bank} value={bank}>{bank}</option>
                          ))}
                        </select>
                      </div>

                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                          You will be redirected to your bank's secure login page to authorize the payment. The payment amount is <strong>B${total.toLocaleString()}</strong>
                        </AlertDescription>
                      </Alert>

                      {selectedBank && (
                        <Alert className="bg-green-50 border-green-200">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <AlertDescription className="text-green-900">
                            Ready to proceed with {selectedBank}. Click "Complete Payment" to continue.
                          </AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* BIBD Financing */}
                {paymentMethod === "financing" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        BIBD Easy Payment Plan
                      </CardTitle>
                      <CardDescription>Apply for 0% interest financing</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <Alert className="bg-blue-50 border-blue-200">
                        <Info className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-blue-900">
                          <div className="space-y-2">
                            <p className="font-semibold">Your Financing Details:</p>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>Total Amount:</div>
                              <div className="font-semibold">B${total.toLocaleString()}</div>
                              <div>Monthly Payment:</div>
                              <div className="font-semibold">B${Math.ceil(total / 12)}/month</div>
                              <div>Period:</div>
                              <div className="font-semibold">12 months</div>
                              <div>Interest Rate:</div>
                              <div className="font-semibold text-green-600">0%</div>
                            </div>
                          </div>
                        </AlertDescription>
                      </Alert>

                      <div className="bg-stone-50 rounded-lg p-6 space-y-4">
                        <h4 className="font-semibold">What happens next:</h4>
                        <ol className="space-y-3 text-sm">
                          <li className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs">1</span>
                            <span>Click "Complete Payment" to proceed to BIBD's secure application portal</span>
                          </li>
                          <li className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs">2</span>
                            <span>Fill in your details and submit required documents</span>
                          </li>
                          <li className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs">3</span>
                            <span>Receive instant approval decision (usually within 5 minutes)</span>
                          </li>
                          <li className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs">4</span>
                            <span>Once approved, your order will be confirmed and scheduled for delivery</span>
                          </li>
                        </ol>
                      </div>

                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                          Subject to approval. Valid ID and proof of income required. Terms and conditions apply.
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>
                )}

                <Button
                  className="w-full"
                  onClick={handlePlaceOrder}
                  disabled={!canPlaceOrder()}
                  style={{ display: paymentMethod === "card" ? "none" : "block" }}
                >
                  <Package className="h-4 w-4 mr-2" />
                  Complete Payment
                </Button>
              </div>
            )}

            {/* Step 5: Confirmation */}
            {currentStep === 5 && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="pt-6 text-center space-y-6">
                  <div className="flex justify-center">
                    <div className="w-20 h-20 rounded-full bg-green-500 text-white flex items-center justify-center">
                      <CheckCircle2 className="h-10 w-10" />
                    </div>
                  </div>
                  <div>
                    <h2 className="mb-2">Order Confirmed!</h2>
                    <p className="text-muted-foreground">
                      Your order has been successfully placed
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-6 text-left">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-muted-foreground">Order Number</span>
                      <span className="font-mono font-semibold">VS-2025-{Math.floor(100000 + Math.random() * 900000)}</span>
                    </div>
                    <Separator className="my-4" />
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Items</span>
                        <span>{cartItems.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Delivery Date</span>
                        <span>
                          {selectedDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Amount</span>
                        <span className="font-semibold">B${total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      A confirmation email has been sent to <strong>{deliveryDetails.email}</strong>. 
                      You can track your order in the My Account section.
                    </AlertDescription>
                  </Alert>

                  <div className="flex flex-col gap-3">
                    <Button onClick={onClose} size="lg" className="w-full">
                      View Order in My Account
                    </Button>
                    <Button onClick={onClose} variant="outline" size="lg" className="w-full">
                      Continue Shopping
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {cartItems.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-stone-100">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                  {cartItems.length > 3 && (
                    <p className="text-sm text-muted-foreground">
                      +{cartItems.length - 3} more {cartItems.length - 3 === 1 ? 'item' : 'items'}
                    </p>
                  )}
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>B${subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">White Glove Delivery</span>
                    <Badge variant="secondary">Free</Badge>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-xl">B${total.toLocaleString()}</span>
                  </div>
                </div>

                {currentStep < 5 && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      {currentStep > 1 && (
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={handlePreviousStep}
                        >
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Back
                        </Button>
                      )}
                      
                      {currentStep === 1 && (
                        <Button
                          className="w-full"
                          onClick={handleNextStep}
                          disabled={!canProceedToStep2}
                        >
                          Proceed to Delivery
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      )}
                      
                      {currentStep === 2 && (
                        <Button
                          className="w-full"
                          onClick={handleNextStep}
                          disabled={!canProceedToStep3}
                        >
                          Proceed to Payment
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      )}
                      
                      {currentStep === 3 && (
                        <Button
                          className="w-full"
                          onClick={handleNextStep}
                          disabled={!canProceedToStep4}
                        >
                          Continue to Payment Details
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      )}

                      {currentStep === 4 && (
                        <Button
                          className="w-full"
                          onClick={handlePlaceOrder}
                          disabled={!canPlaceOrder()}
                          style={{ display: paymentMethod === "card" ? "none" : "block" }}
                        >
                          <Package className="h-4 w-4 mr-2" />
                          Complete Payment
                        </Button>
                      )}
                    </div>
                  </>
                )}

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    All orders include free white glove delivery with professional installation throughout Brunei.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}