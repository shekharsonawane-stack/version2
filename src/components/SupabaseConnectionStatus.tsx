import { useEffect, useState } from "react";
import { quickConnectionCheck } from "../utils/test-supabase-connection";
import { Badge } from "./ui/badge";
import { Wifi, WifiOff, Database } from "lucide-react";

export function SupabaseConnectionStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);

  const checkConnection = async () => {
    setIsChecking(true);
    try {
      const connected = await quickConnectionCheck();
      setIsConnected(connected);
      
      // Only show offline message after first failed check
      if (!connected && isConnected === null) {
        setShowOfflineMessage(true);
        // Auto-hide after 5 seconds
        setTimeout(() => setShowOfflineMessage(false), 5000);
      }
    } catch (error) {
      // Silent fail - no console errors
      setIsConnected(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    // Check connection on mount
    checkConnection();

    // Check connection every 60 seconds (less frequent = less noise)
    const interval = setInterval(checkConnection, 60000);

    return () => clearInterval(interval);
  }, []);

  // Don't show anything while initial check is running
  if (isConnected === null && !isChecking) {
    return null;
  }

  // Only show badge if checking or if offline and message should be shown
  const shouldShow = isChecking || isConnected === true || showOfflineMessage;
  
  if (!shouldShow) {
    return null;
  }

  return (
    <div className="fixed top-[216px] right-4 z-50">
      <Badge
        variant={isConnected ? "default" : "secondary"}
        className="flex items-center gap-2 px-3 py-2"
      >
        {isChecking ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : isConnected ? (
          <Wifi className="w-4 h-4" />
        ) : (
          <Database className="w-4 h-4" />
        )}
        <span className="text-xs font-medium">
          {isChecking ? "Checking..." : isConnected ? "Backend Connected" : "Offline Mode (Mock Data)"}
        </span>
      </Badge>
    </div>
  );
}