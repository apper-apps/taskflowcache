import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Textarea = forwardRef(({ 
  className, 
  error = false,
  rows = 3,
  ...props 
}, ref) => {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(
        "flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 resize-none",
        error && "border-red-500 focus:ring-red-500",
        className
      )}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export default Textarea;