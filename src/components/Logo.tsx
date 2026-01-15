import logoIcon from "figma:asset/b34558d3dc7165ceafa245f85eb88fb484004405.png";

interface LogoProps {
  variant?: "default" | "light" | "dark" | "icon-only";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Logo({ variant = "default", size = "md", className = "" }: LogoProps) {
  const iconSize = {
    sm: "h-7 w-7",
    md: "h-9 w-9",
    lg: "h-11 w-11",
  };

  const textSize = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
  };

  const textColorClasses = {
    default: "text-stone-900",
    light: "text-white",
    dark: "text-stone-900",
    "icon-only": "text-stone-900",
  };

  if (variant === "icon-only") {
    return (
      <div className={`flex items-center ${className}`}>
        <img
          src={logoIcon}
          alt="Vision Studio"
          className={iconSize[size]}
        />
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img
        src={logoIcon}
        alt="Vision Studio Logo"
        className={iconSize[size]}
      />
      <div className="flex flex-col -space-y-0.5">
        <span className={`font-semibold tracking-tight leading-none ${textColorClasses[variant]} ${textSize[size]}`}>
          Vision Studio
        </span>
        {size !== "sm" && (
          <span className={`text-[10px] tracking-wide uppercase ${
            variant === "light" ? "text-white/70" : "text-stone-500"
          }`}>
            Furniture Made Simple
          </span>
        )}
      </div>
    </div>
  );
}