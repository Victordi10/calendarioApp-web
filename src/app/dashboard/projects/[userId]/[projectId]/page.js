"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Plus, Edit, Trash } from "lucide-react";
import Loader from "@/components/ui/loader";

export default function ProjectDashboard() {
    const { userId, projectId } = useParams(); // ✅ Obtiene los parámetros de la URL
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [newCollaborator, setNewCollaborator] = useState("");
    const [editingName, setEditingName] = useState("");
    const [showEdit, setShowEdit] = useState(false);



    // ✅ Agregar un colaborador
    const handleAddCollaborator = async (e) => {
        e.preventDefault();
        if (!newCollaborator) return alert("Introduce un email");

        try {
            const res = await fetch(`/api/dashboard/projects/${projectId}/collaborators`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: newCollaborator }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Error al agregar colaborador");

            alert("Colaborador agregado con éxito");
            setNewCollaborator("");
        } catch (error) {
            console.error("Error al agregar colaborador:", error);
            alert(error.message);
        }
    };

    // ✅ Editar nombre del proyecto
    const handleEditProject = async () => {
        if (!editingName) return alert("Introduce un nuevo nombre");

        try {
            const res = await fetch(`/api/dashboard/projects/${projectId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: editingName }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Error al actualizar el nombre");

            alert("Nombre actualizado con éxito");
            setShowEdit(false);
            setEditingName("");
        } catch (error) {
            console.error("Error al editar proyecto:", error);
            alert(error.message);
        }
    };

    // ✅ Eliminar proyecto
    const handleDeleteProject = async () => {
        const confirmDelete = confirm("¿Seguro que deseas eliminar este proyecto?");
        if (!confirmDelete) return;

        try {
            const res = await fetch(`/api/dashboard/projects/${projectId}`, {
                method: "DELETE",
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Error al eliminar proyecto");

            alert("Proyecto eliminado con éxito");
            router.push("/dashboard"); // 🔹 Redirigir al dashboard principal
        } catch (error) {
            console.error("Error al eliminar proyecto:", error);
            alert(error.message);
        }
    };

    if (loading) return <Loader />;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="p-4 bg-fondo flex-1">
            <h1 className="text-2xl font-semibold mb-4 text-text">Mis Proyectos</h1>


            {/* 📌 FORMULARIO PARA AGREGAR COLABORADOR */}
            <div className="mt-6 p-4 bg-white shadow-md rounded-lg">
                <h2 className="text-lg font-semibold mb-2">Agregar Colaborador</h2>
                <form onSubmit={handleAddCollaborator} className="flex gap-2">
                    <input
                        type="email"
                        value={newCollaborator}
                        onChange={(e) => setNewCollaborator(e.target.value)}
                        placeholder="Email del colaborador"
                        className="border p-2 rounded flex-1"
                    />
                    <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-1">
                        <Plus size={16} /> Agregar
                    </button>
                </form>
            </div>

            {/* 📌 FORMULARIO PARA EDITAR PROYECTO */}
            {showEdit && (
                <div className="mt-6 p-4 bg-white shadow-md rounded-lg">
                    <h2 className="text-lg font-semibold mb-2">Editar Proyecto</h2>
                    <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        placeholder="Nuevo nombre"
                        className="border p-2 rounded w-full mb-2"
                    />
                    <button onClick={handleEditProject} className="bg-blue-500 text-white px-4 py-2 rounded">
                        Guardar Cambios
                    </button>
                </div>
            )}
        </div>
    );
}
