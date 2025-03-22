"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return null; // Evita errores de hidratación en Next.js

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded bg-primary text-white"
        >
            {theme === "dark" ? "☀️ Modo Claro" : "🌙 Modo Oscuro"}
        </button>
    );
}
