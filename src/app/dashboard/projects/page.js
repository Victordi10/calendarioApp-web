'use client'
import React, { useState, useEffect } from 'react';
import Project from './project';
import Link from 'next/link';
import FormProject from './form';
import { Plus } from 'lucide-react';
import { useSearchParams } from "next/navigation";
import Loader from '@/components/ui/loader';

export default function Dashboard() {
    const [showForm, setShowForm] = useState(false);
    const searchParams = useSearchParams();
    const userId = searchParams.get("user"); // Obtiene el ID del usuario
    const [error, setError] = useState("");
    const [loading, setLoadings] = useState(false);
    const [projects, setProjects] = useState([]);
    const [newProject, setNewProject] = useState();


    useEffect(() => {
        const fetchProjects = async () => {
            setLoadings(true);
            try {
                const res = await fetch(`/api/dashboard/projects?userId=${userId}`);
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.message || "Error al obtener los proyectos");
                }
                console.log("Proyectos obtenidos:", data.data.projects);
                setProjects(data.data.projects);
            } catch (error) {
                console.error("Error al obtener los proyectos", error);
                setError(error.message || "Ocurrió un error al obtener los proyectos");
            } finally {
                setLoadings(false);
            }
        }
        fetchProjects()
    }, [userId])

    useEffect(() => {
        if (newProject) {
            setProjects(prevProjects => [...prevProjects, newProject]);
        }
    }, [newProject]);


    return (
        <div className="min-h-screen bg-fondo p-6 text-text">
            {/* Header */}
            <header className="flex justify-between items-center bg-white shadow-md p-4 rounded-lg">
                <h1 className="text-2xl font-bold">📌 VyCalendar</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition"
                >
                    + Nuevo Proyecto
                </button>
            </header>

            {/* Contenedor principal */}
            <main className="mt-6">
                {loading ? (
                    <div className="flex bg-fondo flex-col items-center space-y-4">
                        <Loader size={50} color='#007AFF' />
                        <p className="text-center">Cargando proyectos...</p>
                    </div>
                ) : (
                    <>
                        {/* Formulario */}
                        {showForm && (
                            <div className="bg-white p-4 shadow-md rounded-lg mb-6">
                                <FormProject userId={userId} setNewProject={setNewProject} setShowForm={setShowForm} setError={setError} />
                            </div>
                        )}

                        {error && (
                            <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
                                <span className="font-medium">Error:</span> {error}
                            </div>
                        )}

                        {/* Lista de proyectos */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {projects.map(project => {
                                return <Project key={project.id} project={project} />
                            })}
                        </div>
                    </>
                )}
            </main>

            {/* Botón flotante en móviles */}
            <button
                onClick={() => setShowForm(!showForm)}
                className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-lg sm:hidden"
            >
                <Plus className="w-6 h-6" />
            </button>
        </div>
    );
}
