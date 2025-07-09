import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  className, 
  variant = "default", 
  size = "default",
  ...props 
}, ref) => {
  const variants = {
    default: "bg-gray-100 text-gray-900",
    primary: "bg-gradient-to-r from-primary to-secondary text-white",
    success: "bg-gradient-to-r from-accent to-green-500 text-white",
    warning: "bg-gradient-to-r from-warning to-yellow-500 text-white",
    danger: "bg-gradient-to-r from-red-500 to-red-600 text-white",
    outline: "border border-gray-300 text-gray-700",
  };

  const sizes = {
    sm: "px-2 py-1 text-xs",
    default: "px-2.5 py-1.5 text-sm",
    lg: "px-3 py-2 text-base",
  };

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center font-medium rounded-full transition-all duration-200",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
});

Badge.displayName = "Badge";

export default Badge;