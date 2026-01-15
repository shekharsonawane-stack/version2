import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { toast } from "sonner@2.0.3";
import { createUserAccount, trackUserLogin, createLeadFromSignup } from "../utils/crm-helpers";
import { API_BASE, publicAnonKey } from "../utils/supabase/client";

interface SignInDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSignIn: (userData: { name: string; email: string; userId?: string }) => void;
}

export function SignInDialog({ open, onOpenChange, onSignIn }: SignInDialogProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Forgot password states
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState<"email" | "code" | "success">("email");
  const [resetEmail, setResetEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSocialSignIn = (provider: string) => {
    // Simulate social sign-in
    onSignIn({
      name: `User from ${provider}`,
      email: `user@${provider.toLowerCase()}.com`,
    });
    onOpenChange(false);
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      setIsLoading(true);
      
      try {
        console.log("🔐 Attempting login for:", email);
        
        // Authenticate with password verification
        const response = await fetch(`${API_BASE}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ email, password }),
        });
        
        const result = await response.json();
        
        if (result.success && result.user) {
          // Login successful
          console.log("✅ Login successful for:", email);
          onSignIn({
            name: result.user.name,
            email: result.user.email,
            userId: result.user.id,
          });
          onOpenChange(false);
          toast.success(`Welcome back, ${result.user.name}!`);
        } else {
          // Login failed
          console.log("❌ Login failed:", result.error);
          toast.error(result.error || "Invalid email or password");
        }
      } catch (error) {
        console.error("❌ Sign-in error:", error);
        toast.error("Sign-in failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name && signUpEmail && signUpPassword) {
      setIsLoading(true);
      
      try {
        console.log("=== SIGNUP STARTED ===");
        console.log("Creating user:", { name, email: signUpEmail });
        
        // Create user account in CRM backend with password
        const result = await createUserAccount({
          email: signUpEmail,
          name: name,
          password: signUpPassword,
          accountStatus: "active",
        });
        
        console.log("Signup result:", result);
        
        if (result.success && result.userId) {
          // Create a lead entry for this signup
          console.log("Creating lead entry for new user...");
          createLeadFromSignup({
            email: signUpEmail,
            name: name,
            userId: result.userId,
          }).then(leadResult => {
            if (leadResult.success) {
              console.log("✅ Lead created with ID:", leadResult.leadId);
            }
          });

          // Sign in with the new user data
          onSignIn({
            name: name,
            email: signUpEmail,
            userId: result.userId,
          });
          onOpenChange(false);
          toast.success(`Welcome to Vision Studio, ${name}!`);
          console.log("✅ New user created successfully with ID:", result.userId);
          console.log("User is now signed in with userId:", result.userId);
        } else {
          // Handle error (e.g., user already exists)
          console.error("❌ Signup failed:", result.error);
          if (result.error?.includes("already exists")) {
            toast.error("An account with this email already exists. Please sign in instead.");
          } else {
            toast.error(result.error || "Failed to create account. Please try again.");
          }
        }
      } catch (error) {
        console.error("❌ Sign-up error:", error);
        toast.error("Sign-up failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    
    setIsLoading(true);
    
    try {
      console.log("🔑 Requesting password reset for:", resetEmail);
      
      const response = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ email: resetEmail }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Store the generated code for demo purposes
        setGeneratedCode(result.resetCode || "");
        setForgotPasswordStep("code");
        toast.success("Reset code generated! (Check below)");
        console.log("✅ Reset code:", result.resetCode);
      } else {
        toast.error(result.error || "Failed to request password reset");
      }
    } catch (error) {
      console.error("❌ Reset request error:", error);
      toast.error("Failed to request password reset");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetEmail || !resetCode || !newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("🔄 Resetting password for:", resetEmail);
      
      const response = await fetch(`${API_BASE}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          email: resetEmail,
          code: resetCode,
          newPassword: newPassword,
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setForgotPasswordStep("success");
        toast.success("Password reset successfully!");
        console.log("✅ Password reset successful");
        
        // Reset form and close dialog after 2 seconds
        setTimeout(() => {
          setShowForgotPassword(false);
          setForgotPasswordStep("email");
          setResetEmail("");
          setResetCode("");
          setGeneratedCode("");
          setNewPassword("");
          setConfirmPassword("");
        }, 2000);
      } else {
        toast.error(result.error || "Failed to reset password");
      }
    } catch (error) {
      console.error("❌ Password reset error:", error);
      toast.error("Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-3xl">Welcome to Vision Studio</DialogTitle>
            <DialogDescription>
              Sign in to save your designs, track orders, and get personalized recommendations
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="signin" className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-4 mt-6">
              {/* Social Sign In Buttons */}
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full h-12 gap-3"
                  onClick={() => handleSocialSignIn("Google")}
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>

                <Button
                  variant="outline"
                  className="w-full h-12 gap-3"
                  onClick={() => handleSocialSignIn("Facebook")}
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Continue with Facebook
                </Button>

                <Button
                  variant="outline"
                  className="w-full h-12 gap-3"
                  onClick={() => handleSocialSignIn("Apple")}
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                  </svg>
                  Continue with Apple
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
                </div>
              </div>

              {/* Email Sign In Form */}
              <form onSubmit={handleEmailSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12"
                  />
                </div>

                <Button type="submit" className="w-full h-12 rounded-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setShowForgotPassword(true)}
                  >
                    Forgot password?
                  </button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4 mt-6">
              {/* Social Sign Up Buttons */}
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full h-12 gap-3"
                  onClick={() => handleSocialSignIn("Google")}
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Sign up with Google
                </Button>

                <Button
                  variant="outline"
                  className="w-full h-12 gap-3"
                  onClick={() => handleSocialSignIn("Facebook")}
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Sign up with Facebook
                </Button>

                <Button
                  variant="outline"
                  className="w-full h-12 gap-3"
                  onClick={() => handleSocialSignIn("Apple")}
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                  </svg>
                  Sign up with Apple
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or sign up with email</span>
                </div>
              </div>

              {/* Email Sign Up Form */}
              <form onSubmit={handleEmailSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your@email.com"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    required
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password"
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    required
                    className="h-12"
                  />
                </div>

                <Button type="submit" className="w-full h-12 rounded-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By signing up, you agree to our{" "}
                  <a href="#" className="underline hover:text-foreground">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="underline hover:text-foreground">
                    Privacy Policy
                  </a>
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Forgot Password Dialog */}
      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {forgotPasswordStep === "email" && "Reset Your Password"}
              {forgotPasswordStep === "code" && "Enter Reset Code"}
              {forgotPasswordStep === "success" && "Password Reset!"}
            </DialogTitle>
            <DialogDescription>
              {forgotPasswordStep === "email" && "Enter your email to receive a reset code"}
              {forgotPasswordStep === "code" && "Enter the 6-digit code and your new password"}
              {forgotPasswordStep === "success" && "Your password has been successfully reset"}
            </DialogDescription>
          </DialogHeader>

          {forgotPasswordStep === "email" && (
            <form onSubmit={handleRequestReset} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email Address</Label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="your@email.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              <Button type="submit" className="w-full h-12 rounded-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Reset Code"
                )}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowForgotPassword(false)}
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          )}

          {forgotPasswordStep === "code" && (
            <form onSubmit={handleResetPassword} className="space-y-4 mt-4">
              {generatedCode && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-yellow-800 mb-1">
                    <strong>Demo Mode:</strong> Your reset code is:
                  </p>
                  <p className="text-2xl font-bold text-yellow-900 tracking-wider text-center">
                    {generatedCode}
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    In production, this would be sent to your email
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="reset-code">Reset Code</Label>
                <Input
                  id="reset-code"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  required
                  maxLength={6}
                  className="h-12 text-center text-2xl tracking-wider"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Create new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="h-12"
                />
              </div>

              <Button type="submit" className="w-full h-12 rounded-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => {
                    setForgotPasswordStep("email");
                    setResetCode("");
                    setGeneratedCode("");
                  }}
                >
                  Request a new code
                </button>
              </div>
            </form>
          )}

          {forgotPasswordStep === "success" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-lg text-muted-foreground mb-4">
                You can now sign in with your new password
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}