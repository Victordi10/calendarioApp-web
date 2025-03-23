export function Button({ variant = "default", size = "default", className, children, ...props }) {
  const variantClasses = {
    default: "bg-[#007AFF] text-white hover:bg-[#007AFF]/90",
    destructive: "bg-[#EF4444] text-white hover:bg-[#EF4444]/90",
    outline: "border border-[#E5E7EB] bg-transparent hover:bg-[#F8F9FA] text-[#212529]",
    secondary: "bg-[#22C55E] text-white hover:bg-[#22C55E]/90",
    ghost: "hover:bg-[#F8F9FA] hover:text-[#212529]",
    link: "text-[#007AFF] underline-offset-4 hover:underline",
  }

  const sizeClasses = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  }

  return (
    <button
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${variantClasses[variant] || ""} ${sizeClasses[size] || ""} ${className || ""}`}
      {...props}
    >
      {children}
    </button>
  )
}

