'use client'
import { useState } from "react";

import ModernInput from "@/components/modern-input";
import Boton from "@/components/ui/boton";
export default function FormProject({ userId, setError, setNewProject, setShowForm }) {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const form = e.target.form; // ✅ Accede al formulario a través del botón
        const formData = new FormData(form);
        const name = formData.get("name");

        if (!name.trim()) {
            setError("El nombre del proyecto es obligatorio");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/dashboard/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, userId }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Error al crear el proyecto");
            }

            if (!data.success) {
                setError(data.message);
                setLoading(false);
                return;
            }

            setShowForm(false); // Cierra el formulario después de crear el proyecto
            setNewProject(data.data);
            console.log("Proyecto creado:", data.data);
        } catch (err) {
            console.error("Error al crear el proyecto", err);
            setError(err.message || "Ocurrió un error al crear el proyecto");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 border rounded-lg shadow-lg bg-white">
            <h2 className="text-xl font-semibold mb-4">Crear Proyecto</h2>
            <form className="space-y-4">
                <ModernInput label="Nombre del Proyecto" name="name" type="text" />
                {/* ✅ `onClick` llama a `handleSubmit`, y este usa `e.target.form` */}
                <Boton estilos="w-full bg-primary text-white" loading={loading} onClick={handleSubmit}>
                    Crear Proyecto
                </Boton>
            </form>
        </div>
    );
}
