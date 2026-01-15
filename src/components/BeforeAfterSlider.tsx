import { useState, useRef } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = "Before",
  afterLabel = "After",
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    
    setSliderPosition(Math.min(Math.max(percentage, 0), 100));
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleStart = () => {
    setIsDragging(true);
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="flex justify-center w-full">
      <div
        ref={containerRef}
        className="relative w-full max-w-[1000px] h-[500px] md:h-[650px] overflow-hidden select-none cursor-ew-resize rounded-2xl shadow-2xl"
        onMouseMove={handleMouseMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleEnd}
      >
        {/* After Image (Background) */}
        <div className="absolute inset-0">
          <ImageWithFallback
            src={afterImage}
            alt={afterLabel}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm text-foreground px-4 py-2 rounded-full font-medium text-sm shadow-lg">
            {afterLabel}
          </div>
        </div>

        {/* Before Image (Clipped) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <ImageWithFallback
            src={beforeImage}
            alt={beforeLabel}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm text-foreground px-4 py-2 rounded-full font-medium text-sm shadow-lg">
            {beforeLabel}
          </div>
        </div>

        {/* Slider Line */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-lg"
          style={{ left: `${sliderPosition}%` }}
          onMouseDown={handleStart}
          onTouchStart={handleStart}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center border-2 border-stone-200">
            <div className="flex gap-1">
              <div className="w-0.5 h-5 bg-stone-600 rounded-full"></div>
              <div className="w-0.5 h-5 bg-stone-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
