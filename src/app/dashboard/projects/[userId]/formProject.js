'use client'
import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Loader2, X } from "lucide-react";
import ModernInput from "@/components/modern-input";
import Boton from "@/components/ui/boton";

export default function FormProject({ userId, setError, setNewProject, setShowForm }) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const { name } = formData;

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

            // Mostrar animación de éxito antes de cerrar
            setSuccess(true);
            
            setTimeout(() => {
                setShowForm(false);
                setNewProject(data.data);
                console.log("Proyecto creado:", data.data);
            }, 1000);
            
        } catch (err) {
            console.error("Error al crear el proyecto", err);
            setError(err.message || "Ocurrió un error al crear el proyecto");
        } finally {
            setLoading(false);
        }
    };

    const closeForm = () => {
        setShowForm(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md mx-auto p-4 border border-gray-100 rounded-xl shadow-lg bg-white"
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Nuevo Proyecto</h2>
                <button 
                    onClick={closeForm}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <X className="w-5 h-5 text-gray-500" />
                </button>
            </div>

            {success ? (
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="py-10 flex flex-col items-center"
                >
                    <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                    <h3 className="text-xl font-medium text-gray-800">¡Proyecto creado!</h3>
                    <p className="text-gray-500 mt-2 text-center">
                        Tu nuevo proyecto ha sido creado exitosamente
                    </p>
                </motion.div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <ModernInput 
                            label="Nombre del Proyecto" 
                            name="name" 
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Ej: Campaña Q2 2025"
                            required
                        />
                        
                        <div className="pt-2">
                            <Boton 
                                type="submit"
                                estilos="w-full bg-primary text-white font-medium py-3 rounded-lg hover:bg-primary/90 transition-colors" 
                                loading={loading}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Creando...
                                    </span>
                                ) : "Crear Proyecto"}
                            </Boton>
                        </div>
                    </div>
                    
                    <div className="text-center">
                        <button
                            type="button"
                            onClick={closeForm}
                            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            )}
        </motion.div>
    );
}