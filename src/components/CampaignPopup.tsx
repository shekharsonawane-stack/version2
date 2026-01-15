import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { API_BASE, publicAnonKey } from '../utils/supabase/client';

interface PopupCampaign {
  id: string;
  name: string;
  title: string;
  message: string;
  buttonText?: string;
  buttonLink?: string;
  image?: string;
  backgroundColor?: string;
  textColor?: string;
  position?: 'center' | 'bottom-right' | 'bottom-left';
  delay?: number;
  showOnce?: boolean;
}

export function CampaignPopup() {
  const [activeCampaign, setActiveCampaign] = useState<PopupCampaign | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    loadActivePopups();
  }, []);

  const loadActivePopups = async () => {
    try {
      const res = await fetch(`${API_BASE}/campaigns/active-popups`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` }
      });
      
      const data = await res.json();
      if (data.success && data.campaigns.length > 0) {
        const campaign = data.campaigns[0]; // Show first active campaign
        
        // Check if already shown
        const shownKey = `popup-shown-${campaign.id}`;
        if (campaign.showOnce && localStorage.getItem(shownKey)) {
          return;
        }
        
        // Show after delay
        const delay = campaign.delay || 3000;
        setTimeout(() => {
          setActiveCampaign(campaign);
          setIsVisible(true);
        }, delay);
      }
    } catch (error) {
      console.error('Failed to load popup campaigns:', error);
    }
  };

  const handleClose = () => {
    if (activeCampaign) {
      if (activeCampaign.showOnce) {
        localStorage.setItem(`popup-shown-${activeCampaign.id}`, 'true');
      }
      setIsVisible(false);
      setTimeout(() => setActiveCampaign(null), 300);
    }
  };

  const handleButtonClick = () => {
    if (activeCampaign?.buttonLink) {
      window.location.href = activeCampaign.buttonLink;
    }
    handleClose();
  };

  if (!activeCampaign || !isVisible) return null;

  const getPositionClasses = () => {
    switch (activeCampaign.position) {
      case 'bottom-right':
        return 'bottom-8 right-8';
      case 'bottom-left':
        return 'bottom-8 left-8';
      default:
        return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
    }
  };

  const isCentered = activeCampaign.position === 'center' || !activeCampaign.position;

  return (
    <>
      {/* Backdrop for centered popups */}
      {isCentered && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300"
          style={{ opacity: isVisible ? 1 : 0 }}
          onClick={handleClose}
        />
      )}
      
      {/* Popup */}
      <div 
        className={`fixed ${getPositionClasses()} z-50 transition-all duration-300 transform ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        style={{
          maxWidth: isCentered ? '500px' : '400px',
          width: isCentered ? '90%' : 'auto'
        }}
      >
        <div 
          className="rounded-lg shadow-2xl p-6 relative"
          style={{
            backgroundColor: activeCampaign.backgroundColor || '#ffffff',
            color: activeCampaign.textColor || '#000000'
          }}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-black/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Image */}
          {activeCampaign.image && (
            <img 
              src={activeCampaign.image} 
              alt={activeCampaign.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
          )}

          {/* Content */}
          <h3 className="text-2xl font-bold mb-3 pr-8">{activeCampaign.title}</h3>
          <p className="text-sm mb-6 opacity-90">{activeCampaign.message}</p>

          {/* Button */}
          {activeCampaign.buttonText && (
            <button
              onClick={handleButtonClick}
              className="w-full bg-stone-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-stone-800 transition-colors"
            >
              {activeCampaign.buttonText}
            </button>
          )}
        </div>
      </div>
    </>
  );
}
