"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import ModernInput from "@/components/modern-input"
import Boton from "@/components/ui/boton"

export default function Register() {
    const router = useRouter()
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    })
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        if (!e.target.name) {
            console.error("El input no tiene un name:", e.target);
            return;
        }
        setForm({ ...form, [e.target.name]: e.target.value });
    };


    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            })
            console.log("Datos enviados al backend:", JSON.stringify(form));

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message || "Error al registrarse")
            }

            if (!data.success) {
                setError(data.message)
                setLoading(false)
                return
            }
            console.log("Usuario creado:", data.data);

            router.push(`/dashboard/projects/${data.data.id}`); //// Redirige al dashboard después del login
        } catch (err) {
            setError(err.message || "Ocurrió un error durante el registro")
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
                <div className="text-center">
                    <h1 className="text-3xl font-extrabold text-gray-900">Crear cuenta</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        ¿Ya tienes una cuenta?{" "}
                        <Link href="/auth/login" className="font-medium text-primary hover:text-primary/80 transition-colors">
                            Inicia sesión
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
                            label="Nombre completo"
                            name="name"
                            type="text"
                            placeholder="Ingresa tu nombre"
                            onChange={handleChange}
                            value={form.name}
                            required
                        />

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
                            placeholder="Mínimo 8 caracteres"
                            onChange={handleChange}
                            value={form.password}
                            required
                        />
                    </div>

                    <div className="pt-4">
                        <Boton loading={loading} estilos="w-full bg-primary text-white">
                            Crear cuenta
                        </Boton>
                    </div>

                    {/*  <div className="text-center text-xs text-gray-500 mt-8">
                        Al registrarte, aceptas nuestros{" "}
                        <Link href="/terms" className="text-primary hover:underline">
                            Términos de servicio
                        </Link>{" "}
                        y{" "}
                        <Link href="/privacy" className="text-primary hover:underline">
                            Política de privacidad
                        </Link>
                    </div> */}
                </form>
            </div>
        </div>
    )
}

