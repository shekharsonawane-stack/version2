import { useState } from "react";
import { CRMDashboard } from "./CRMDashboard";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Lock, Shield } from "lucide-react";

interface AdminAccessProps {
  trigger?: React.ReactNode;
}

export function AdminAccess({ trigger }: AdminAccessProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Simple password protection - in production, use proper authentication
  const ADMIN_PASSWORD = "visionstudio2025";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password. Please try again.");
      setPassword("");
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsAuthenticated(false);
    setPassword("");
    setError("");
  };

  if (isAuthenticated) {
    return <CRMDashboard />;
  }

  return (
    <>
      {trigger ? (
        <div onClick={() => setIsOpen(true)}>{trigger}</div>
      ) : (
        <Button 
          onClick={() => setIsOpen(true)}
          variant="outline"
          size="sm"
          className="fixed bottom-4 right-4 z-50"
        >
          <Shield className="w-4 h-4 mr-2" />
          Admin
        </Button>
      )}

      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-stone-100 rounded-lg">
                <Lock className="w-6 h-6 text-stone-900" />
              </div>
              <div>
                <DialogTitle>Admin Access Required</DialogTitle>
                <DialogDescription>
                  Enter password to access CRM Dashboard
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleLogin} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                Access CRM Dashboard
              </Button>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
            </div>
          </form>

          <div className="pt-4 border-t text-sm text-stone-500">
            <p className="font-medium mb-2">Demo Credentials:</p>
            <p className="font-mono text-xs bg-stone-100 p-2 rounded">
              Password: visionstudio2025
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
