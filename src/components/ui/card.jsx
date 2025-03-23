export function Card({ className, children, ...props }) {
  return (
    <div className={`rounded-lg border border-[#E5E7EB] bg-white shadow-sm ${className || ""}`} {...props}>
      {children}
    </div>
  )
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={`flex flex-col space-y-1.5 p-6 ${className || ""}`} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className || ""}`} {...props}>
      {children}
    </h3>
  )
}

export function CardDescription({ className, children, ...props }) {
  return (
    <p className={`text-sm text-[#6C757D] ${className || ""}`} {...props}>
      {children}
    </p>
  )
}

export function CardContent({ className, children, ...props }) {
  return (
    <div className={`p-6 pt-0 ${className || ""}`} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ className, children, ...props }) {
  return (
    <div className={`flex items-center p-6 pt-0 ${className || ""}`} {...props}>
      {children}
    </div>
  )
}

