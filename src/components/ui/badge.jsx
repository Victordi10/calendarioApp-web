export function Badge({ variant = "default", className, children, ...props }) {
  const variantClasses = {
    default: "bg-[#007AFF] text-white hover:bg-[#007AFF]/80",
    secondary: "bg-[#22C55E] text-white hover:bg-[#22C55E]/80",
    destructive: "bg-[#EF4444] text-white hover:bg-[#EF4444]/80",
    outline: "bg-transparent border border-[#E5E7EB] text-[#212529] hover:bg-[#F8F9FA] hover:text-[#212529]",
  }

  return (
    <div
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#007AFF] focus:ring-offset-2 ${variantClasses[variant] || ""} ${className || ""}`}
      {...props}
    >
      {children}
    </div>
  )
}

