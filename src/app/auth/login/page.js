"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ModernInput from "@/components/modern-input";
import Boton from "@/components/ui/boton";

export default function Login() {
    const router = useRouter();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Error al iniciar sesión");
            }

            if (!data.success) {
                setError(data.message);
                setLoading(false);
                return;
            }

            router.push(`/dashboard/projects?user=${data.data.user.id}`); // Redirige al dashboard después del login
        } catch (err) {
            setError(err.message || "Ocurrió un error durante el inicio de sesión");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
                <div className="text-center">
                    <h1 className="text-3xl font-extrabold text-gray-900">Iniciar sesión</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        ¿No tienes una cuenta?{" "}
                        <Link href="/auth/register" className="font-medium text-primary hover:text-primary/80 transition-colors">
                            Regístrate
                        </Link>
                    </p>
                </div>

                {error && (
                    <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
                        <span className="font-medium">Error:</span> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <ModernInput
                            label="Correo electrónico"
                            name="email"
                            type="email"
                            placeholder="ejemplo@correo.com"
                            onChange={handleChange}
                            value={form.email}
                            required
                        />

                        <ModernInput
                            label="Contraseña"
                            name="password"
                            type="password"
                            placeholder="Ingresa tu contraseña"
                            onChange={handleChange}
                            value={form.password}
                            required
                        />
                    </div>

                    <div className="pt-4">
                        <Boton loading={loading} estilos="w-full bg-primary text-white">
                            Iniciar sesión
                        </Boton>
                    </div>

                    <div className="text-center text-sm text-gray-600">
                        <Link href="/auth/forgot-password" className="font-medium text-primary hover:text-primary/80 transition-colors">
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}