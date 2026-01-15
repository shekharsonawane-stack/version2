import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Calendar } from "./ui/calendar";
import { Progress } from "./ui/progress";
import { Calendar as CalendarIcon, Clock, Home, Video, MapPin, CheckCircle2, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface ConsultationBookingProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ConsultationType = "in-home" | "virtual" | "showroom" | "";
type RoomType = "living-room" | "bedroom" | "dining-room" | "office" | "full-home" | "";
type Timeline = "asap" | "1-3-months" | "3-6-months" | "flexible" | "";

interface FormData {
  // Step 1: Personal Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Step 2: Consultation Type
  consultationType: ConsultationType;
  
  // Step 3: Project Details
  roomType: RoomType;
  stylePreference: string;
  timeline: Timeline;
  projectDescription: string;
  
  // Step 4: Date & Time
  preferredDate: Date | undefined;
  preferredTime: string;
  alternateDate: Date | undefined;
  
  // Step 5: Budget
  budgetRange: string;
  flexibleBudget: boolean;
}

const TOTAL_STEPS = 5;

export function ConsultationBooking({ open, onOpenChange }: ConsultationBookingProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [confirmationNumber, setConfirmationNumber] = useState("");
  
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    consultationType: "",
    roomType: "",
    stylePreference: "",
    timeline: "",
    projectDescription: "",
    preferredDate: undefined,
    preferredTime: "",
    alternateDate: undefined,
    budgetRange: "",
    flexibleBudget: false,
  });

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
          toast.error("Please fill in all required fields");
          return false;
        }
        if (!formData.email.includes("@")) {
          toast.error("Please enter a valid email address");
          return false;
        }
        return true;
      case 2:
        if (!formData.consultationType) {
          toast.error("Please select a consultation type");
          return false;
        }
        return true;
      case 3:
        if (!formData.roomType || !formData.timeline) {
          toast.error("Please fill in all required fields");
          return false;
        }
        return true;
      case 4:
        if (!formData.preferredDate || !formData.preferredTime) {
          toast.error("Please select your preferred date and time");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, TOTAL_STEPS));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      // Generate confirmation number
      const confNum = `VS-${Date.now().toString().slice(-8)}`;
      setConfirmationNumber(confNum);
      setIsSubmitted(true);
      toast.success("Consultation request submitted successfully!");
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset form after a delay to allow dialog close animation
    setTimeout(() => {
      setCurrentStep(1);
      setIsSubmitted(false);
      setConfirmationNumber("");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        consultationType: "",
        roomType: "",
        stylePreference: "",
        timeline: "",
        projectDescription: "",
        preferredDate: undefined,
        preferredTime: "",
        alternateDate: undefined,
        budgetRange: "",
        flexibleBudget: false,
      });
    }, 300);
  };

  const progress = (currentStep / TOTAL_STEPS) * 100;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {!isSubmitted ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-3xl mb-2">Schedule Your Design Consultation</DialogTitle>
              <DialogDescription className="text-base">
                Step {currentStep} of {TOTAL_STEPS}: Tell us about your project
              </DialogDescription>
            </DialogHeader>

            {/* Progress Bar */}
            <div className="mb-6">
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span className={currentStep >= 1 ? "text-stone-900" : ""}>Personal Info</span>
                <span className={currentStep >= 2 ? "text-stone-900" : ""}>Consultation Type</span>
                <span className={currentStep >= 3 ? "text-stone-900" : ""}>Project Details</span>
                <span className={currentStep >= 4 ? "text-stone-900" : ""}>Date & Time</span>
                <span className={currentStep >= 5 ? "text-stone-900" : ""}>Budget</span>
              </div>
            </div>

            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={(e) => updateFormData("firstName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) => updateFormData("lastName", e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => updateFormData("phone", e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Consultation Type */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label>How would you like to consult with our designers? *</Label>
                  <RadioGroup
                    value={formData.consultationType}
                    onValueChange={(value) => updateFormData("consultationType", value as ConsultationType)}
                  >
                    <div className="flex items-start space-x-3 rounded-xl border-2 border-stone-200 p-5 hover:border-stone-900 transition-colors cursor-pointer">
                      <RadioGroupItem value="in-home" id="in-home" className="mt-1" />
                      <label htmlFor="in-home" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-3 mb-2">
                          <Home className="h-5 w-5 text-stone-700" />
                          <span className="font-medium">In-Home Consultation</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Our designer visits your space to take measurements, understand your needs, and provide personalized recommendations.
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">Duration: 60-90 minutes • Free for projects over $2,000</p>
                      </label>
                    </div>

                    <div className="flex items-start space-x-3 rounded-xl border-2 border-stone-200 p-5 hover:border-stone-900 transition-colors cursor-pointer">
                      <RadioGroupItem value="virtual" id="virtual" className="mt-1" />
                      <label htmlFor="virtual" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-3 mb-2">
                          <Video className="h-5 w-5 text-stone-700" />
                          <span className="font-medium">Virtual Consultation</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Connect with our designer via video call to discuss your project, share photos, and get expert advice from home.
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">Duration: 45 minutes • Complimentary</p>
                      </label>
                    </div>

                    <div className="flex items-start space-x-3 rounded-xl border-2 border-stone-200 p-5 hover:border-stone-900 transition-colors cursor-pointer">
                      <RadioGroupItem value="showroom" id="showroom" className="mt-1" />
                      <label htmlFor="showroom" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-3 mb-2">
                          <MapPin className="h-5 w-5 text-stone-700" />
                          <span className="font-medium">Showroom Visit</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Visit our showroom to see furniture in person, test comfort, and work with our designers to create your perfect space.
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">Duration: 60-120 minutes • Walk-ins welcome</p>
                      </label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {/* Step 3: Project Details */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="roomType">Which room(s) are you furnishing? *</Label>
                  <Select value={formData.roomType} onValueChange={(value) => updateFormData("roomType", value as RoomType)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select room type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="living-room">Living Room</SelectItem>
                      <SelectItem value="bedroom">Bedroom</SelectItem>
                      <SelectItem value="dining-room">Dining Room</SelectItem>
                      <SelectItem value="office">Home Office</SelectItem>
                      <SelectItem value="full-home">Full Home Furnishing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stylePreference">Design Style Preference (Optional)</Label>
                  <Input
                    id="stylePreference"
                    placeholder="e.g., Modern, Scandinavian, Bohemian, Industrial"
                    value={formData.stylePreference}
                    onChange={(e) => updateFormData("stylePreference", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeline">Project Timeline *</Label>
                  <Select value={formData.timeline} onValueChange={(value) => updateFormData("timeline", value as Timeline)}>
                    <SelectTrigger>
                      <SelectValue placeholder="When do you need the furniture?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asap">As soon as possible</SelectItem>
                      <SelectItem value="1-3-months">Within 1-3 months</SelectItem>
                      <SelectItem value="3-6-months">Within 3-6 months</SelectItem>
                      <SelectItem value="flexible">Flexible / Just exploring</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectDescription">Tell us about your project (Optional)</Label>
                  <Textarea
                    id="projectDescription"
                    placeholder="Share any specific needs, challenges, or ideas you have for your space..."
                    rows={4}
                    value={formData.projectDescription}
                    onChange={(e) => updateFormData("projectDescription", e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Step 4: Date & Time */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    Preferred Date *
                  </Label>
                  <Calendar
                    mode="single"
                    selected={formData.preferredDate}
                    onSelect={(date) => updateFormData("preferredDate", date)}
                    disabled={(date) => date < new Date() || date < new Date(new Date().setHours(0, 0, 0, 0))}
                    className="rounded-xl border shadow-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferredTime" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Preferred Time *
                  </Label>
                  <Select value={formData.preferredTime} onValueChange={(value) => updateFormData("preferredTime", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="9:00 AM">9:00 AM - 10:00 AM</SelectItem>
                      <SelectItem value="10:00 AM">10:00 AM - 11:00 AM</SelectItem>
                      <SelectItem value="11:00 AM">11:00 AM - 12:00 PM</SelectItem>
                      <SelectItem value="12:00 PM">12:00 PM - 1:00 PM</SelectItem>
                      <SelectItem value="1:00 PM">1:00 PM - 2:00 PM</SelectItem>
                      <SelectItem value="2:00 PM">2:00 PM - 3:00 PM</SelectItem>
                      <SelectItem value="3:00 PM">3:00 PM - 4:00 PM</SelectItem>
                      <SelectItem value="4:00 PM">4:00 PM - 5:00 PM</SelectItem>
                      <SelectItem value="5:00 PM">5:00 PM - 6:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    Alternate Date (Optional)
                  </Label>
                  <Calendar
                    mode="single"
                    selected={formData.alternateDate}
                    onSelect={(date) => updateFormData("alternateDate", date)}
                    disabled={(date) => date < new Date() || date < new Date(new Date().setHours(0, 0, 0, 0))}
                    className="rounded-xl border shadow-sm"
                  />
                  <p className="text-xs text-muted-foreground">In case your preferred time is unavailable</p>
                </div>
              </div>
            )}

            {/* Step 5: Budget */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="budgetRange">Estimated Budget (Optional)</Label>
                  <Select value={formData.budgetRange} onValueChange={(value) => updateFormData("budgetRange", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-2000">Under $2,000</SelectItem>
                      <SelectItem value="2000-5000">$2,000 - $5,000</SelectItem>
                      <SelectItem value="5000-10000">$5,000 - $10,000</SelectItem>
                      <SelectItem value="10000-20000">$10,000 - $20,000</SelectItem>
                      <SelectItem value="20000-plus">$20,000+</SelectItem>
                      <SelectItem value="not-sure">Not sure yet</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    This helps us recommend options that fit your investment level
                  </p>
                </div>

                <div className="bg-stone-50 rounded-xl p-6 border border-stone-200">
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-stone-700 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="mb-2">What to Expect</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="text-stone-900 mt-0.5">•</span>
                          <span>Our designer will contact you within 24 hours to confirm your appointment</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-stone-900 mt-0.5">•</span>
                          <span>You'll receive a confirmation email with meeting details and preparation tips</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-stone-900 mt-0.5">•</span>
                          <span>After the consultation, you'll get a personalized design proposal</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-stone-900 mt-0.5">•</span>
                          <span>No obligation to purchase - consultations are completely complimentary</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              
              {currentStep < TOTAL_STEPS ? (
                <Button onClick={handleNext} className="gap-2">
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} className="gap-2 bg-stone-900 hover:bg-stone-800">
                  Submit Request
                  <CheckCircle2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </>
        ) : (
          // Confirmation Screen
          <div className="py-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <DialogTitle className="text-3xl mb-3">Consultation Request Received!</DialogTitle>
              <DialogDescription className="text-base">
                We're excited to help you create your dream space
              </DialogDescription>
            </div>

            <div className="bg-stone-50 rounded-2xl p-8 border border-stone-200 mb-8">
              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-1">Confirmation Number</p>
                <p className="text-2xl tracking-wider">{confirmationNumber}</p>
              </div>
              
              <div className="space-y-4 text-sm">
                <div className="flex justify-between py-2 border-b border-stone-200">
                  <span className="text-muted-foreground">Name</span>
                  <span>{formData.firstName} {formData.lastName}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-stone-200">
                  <span className="text-muted-foreground">Email</span>
                  <span>{formData.email}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-stone-200">
                  <span className="text-muted-foreground">Consultation Type</span>
                  <span className="capitalize">{formData.consultationType.replace("-", " ")}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-stone-200">
                  <span className="text-muted-foreground">Preferred Date</span>
                  <span>{formData.preferredDate?.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Preferred Time</span>
                  <span>{formData.preferredTime}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <h3 className="text-xl">Next Steps</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-stone-200">
                  <div className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="font-medium mb-1">Check Your Email</p>
                    <p className="text-sm text-muted-foreground">You'll receive a confirmation email at {formData.email} within the next few minutes.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-stone-200">
                  <div className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="font-medium mb-1">Confirmation Call</p>
                    <p className="text-sm text-muted-foreground">Our team will contact you within 24 hours to confirm your appointment and answer any questions.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-stone-200">
                  <div className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <p className="font-medium mb-1">Prepare for Your Consultation</p>
                    <p className="text-sm text-muted-foreground">We'll send you tips on how to prepare, including room measurements and inspiration photos to share.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-stone-200">
                  <div className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    4
                  </div>
                  <div>
                    <p className="font-medium mb-1">Meet Your Designer</p>
                    <p className="text-sm text-muted-foreground">Your personalized consultation will help bring your vision to life with expert guidance.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Close
              </Button>
              <Button onClick={handleClose} className="flex-1 gap-2">
                Continue Shopping
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
