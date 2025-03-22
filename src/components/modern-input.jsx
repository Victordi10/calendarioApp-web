"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

const ModernInput = ({
    label,
    type,
    placeholder,
    onChange,
    inputClass,
    containerClass,
    labelClass,
    required = false,
    name,
}) => {
    const [isFocused, setIsFocused] = useState(false)
    const [hasValue, setHasValue] = useState(false)

    const handleFocus = () => setIsFocused(true)
    const handleBlur = (e) => {
        setIsFocused(false)
        setHasValue(e.target.value.length > 0)
    }

    const handleChange = (e) => {
        setHasValue(e.target.value.length > 0)
        onChange && onChange(e)
    }

    return (
        <div className={cn("relative flex flex-col space-y-2 mb-4", containerClass)}>
            <label
                className={cn(
                    "block text-sm text-textTwo font-medium transition-all duration-200 ease-in-out",
                    isFocused ? "text-text" : "text-textTwo font",
                    hasValue && !isFocused && "text-fondo",
                    labelClass,
                )}
                htmlFor={label.toLowerCase().replace(/\s+/g, "-")}
            >
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
            </label>

            <div className="relative">
                <input
                    id={label.toLowerCase().replace(/\s+/g, "-")}
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    className={cn(
                        "w-full px-4 py-3 bg-fondo text-text border-2 rounded-lg transition-all duration-200",
                        "placeholder:text-textTwo placeholder:text-sm",
                        "focus:outline-none ",
                        isFocused ? "shadow-sm" : "border-border",
                        hasValue && !isFocused && "border-boder/80",
                        inputClass,
                    )}
                    required={required}
                />

                {/* Animated bottom border effect */}
                <div
                    className={cn(
                        "absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ease-out",
                        isFocused ? "w-full" : "w-0",
                    )}
                />
            </div>
        </div>
    )
}

export default ModernInput

