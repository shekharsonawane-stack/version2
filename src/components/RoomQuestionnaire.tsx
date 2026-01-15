import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Progress } from "./ui/progress";

interface RoomQuestionnaireProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (preferences: RoomPreferences) => void;
  userName: string;
}

export interface RoomPreferences {
  roomType: string;
  stylePreference: string;
  roomLength: string;
  roomWidth: string;
  budget: string;
  additionalNotes: string;
}

export function RoomQuestionnaire({ open, onOpenChange, onComplete, userName }: RoomQuestionnaireProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [preferences, setPreferences] = useState<RoomPreferences>({
    roomType: "",
    stylePreference: "",
    roomLength: "",
    roomWidth: "",
    budget: "",
    additionalNotes: "",
  });

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    onComplete(preferences);
    onOpenChange(false);
    // Reset for next time
    setStep(1);
    setPreferences({
      roomType: "",
      stylePreference: "",
      roomLength: "",
      roomWidth: "",
      budget: "",
      additionalNotes: "",
    });
  };

  const updatePreference = (key: keyof RoomPreferences, value: string) => {
    setPreferences({ ...preferences, [key]: value });
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return preferences.roomType !== "";
      case 2:
        return preferences.stylePreference !== "";
      case 3:
        return true; // Room dimensions are optional
      case 4:
        return true; // Budget and notes are optional
      default:
        return false;
    }
  };

  const progressPercentage = (step / totalSteps) * 100;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl">Welcome, {userName}! 👋</DialogTitle>
          <DialogDescription>
            Let's personalize your furniture shopping experience. Tell us about your space.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                Step {step} of {totalSteps}
              </span>
              <span className="text-sm">{Math.round(progressPercentage)}% Complete</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Step 1: Room Type */}
          {step === 1 && (
            <div className="space-y-6 py-4">
              <div>
                <h3 className="mb-4">Which room are you furnishing?</h3>
                <p className="text-muted-foreground mb-6">
                  This helps us show you the most relevant furniture and design ideas
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "living-room", label: "Living Room", emoji: "🛋️" },
                  { value: "bedroom", label: "Bedroom", emoji: "🛏️" },
                  { value: "dining-room", label: "Dining Room", emoji: "🍽️" },
                  { value: "office", label: "Home Office", emoji: "💼" },
                  { value: "kitchen", label: "Kitchen", emoji: "🍳" },
                  { value: "outdoor", label: "Outdoor/Patio", emoji: "🌿" },
                ].map((room) => (
                  <button
                    key={room.value}
                    type="button"
                    onClick={() => updatePreference("roomType", room.value)}
                    className={`p-6 rounded-xl border-2 transition-all text-left hover:border-stone-400 ${
                      preferences.roomType === room.value
                        ? "border-stone-900 bg-stone-50"
                        : "border-stone-200"
                    }`}
                  >
                    <div className="text-3xl mb-2">{room.emoji}</div>
                    <div className="font-medium">{room.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Style Preference */}
          {step === 2 && (
            <div className="space-y-6 py-4">
              <div>
                <h3 className="mb-4">What's your style preference?</h3>
                <p className="text-muted-foreground mb-6">
                  Choose the aesthetic that resonates with you most
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { value: "modern", label: "Modern", description: "Clean lines, minimal décor" },
                  { value: "scandinavian", label: "Scandinavian", description: "Light wood, cozy textures" },
                  { value: "industrial", label: "Industrial", description: "Metal, exposed brick" },
                  { value: "bohemian", label: "Bohemian", description: "Eclectic, colorful patterns" },
                  { value: "minimalist", label: "Minimalist", description: "Simple, clutter-free" },
                  { value: "traditional", label: "Traditional", description: "Classic, timeless elegance" },
                  { value: "coastal", label: "Coastal", description: "Light, breezy beach vibes" },
                  { value: "luxury", label: "Luxury", description: "Opulent, sophisticated" },
                ].map((style) => (
                  <button
                    key={style.value}
                    type="button"
                    onClick={() => updatePreference("stylePreference", style.value)}
                    className={`p-5 rounded-xl border-2 transition-all text-left hover:border-stone-400 ${
                      preferences.stylePreference === style.value
                        ? "border-stone-900 bg-stone-50"
                        : "border-stone-200"
                    }`}
                  >
                    <div className="font-medium mb-1">{style.label}</div>
                    <div className="text-sm text-muted-foreground">{style.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Room Dimensions */}
          {step === 3 && (
            <div className="space-y-6 py-4">
              <div>
                <h3 className="mb-4">Room Dimensions (Optional)</h3>
                <p className="text-muted-foreground mb-6">
                  Help us recommend furniture that fits your space perfectly
                </p>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="room-length">Room Length (feet)</Label>
                    <Input
                      id="room-length"
                      type="number"
                      placeholder="e.g., 15"
                      value={preferences.roomLength}
                      onChange={(e) => updatePreference("roomLength", e.target.value)}
                      className="h-12"
                      min="1"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="room-width">Room Width (feet)</Label>
                    <Input
                      id="room-width"
                      type="number"
                      placeholder="e.g., 12"
                      value={preferences.roomWidth}
                      onChange={(e) => updatePreference("roomWidth", e.target.value)}
                      className="h-12"
                      min="1"
                    />
                  </div>
                </div>

                <div className="bg-stone-50 border border-stone-200 rounded-xl p-5">
                  <p className="text-sm text-muted-foreground">
                    💡 <span className="font-medium text-foreground">Pro tip:</span> If you don't know your exact dimensions, you can skip this step. 
                    In the future, we'll offer room scanning via your phone camera!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Budget & Additional Notes */}
          {step === 4 && (
            <div className="space-y-6 py-4">
              <div>
                <h3 className="mb-4">Budget & Preferences</h3>
                <p className="text-muted-foreground mb-6">
                  Help us tailor recommendations to your needs
                </p>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="budget">Approximate Budget (Optional)</Label>
                  <Select
                    value={preferences.budget}
                    onValueChange={(value) => updatePreference("budget", value)}
                  >
                    <SelectTrigger id="budget" className="h-12">
                      <SelectValue placeholder="Select a budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-1000">Under $1,000</SelectItem>
                      <SelectItem value="1000-2500">$1,000 - $2,500</SelectItem>
                      <SelectItem value="2500-5000">$2,500 - $5,000</SelectItem>
                      <SelectItem value="5000-10000">$5,000 - $10,000</SelectItem>
                      <SelectItem value="over-10000">Over $10,000</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additional-notes">
                    Any specific requests or requirements? (Optional)
                  </Label>
                  <Textarea
                    id="additional-notes"
                    placeholder="E.g., pet-friendly materials, need storage solutions, prefer sustainable furniture..."
                    value={preferences.additionalNotes}
                    onChange={(e) => updatePreference("additionalNotes", e.target.value)}
                    className="min-h-[120px] resize-none"
                  />
                </div>

                <div className="bg-stone-50 border border-stone-200 rounded-xl p-5">
                  <div className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="space-y-2">
                      <p className="font-medium">You're all set!</p>
                      <p className="text-sm text-muted-foreground">
                        Based on your preferences, we'll personalize your browsing experience and recommend 
                        furniture that perfectly matches your style and space.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between gap-4 pt-6 border-t mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
              className="rounded-full gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={() => {
                  onOpenChange(false);
                  setStep(1);
                }}
                className="rounded-full"
              >
                Skip for now
              </Button>

              {step < totalSteps ? (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="rounded-full gap-2"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleComplete} className="rounded-full gap-2">
                  Complete Setup
                  <CheckCircle2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
