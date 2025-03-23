'use client'
import React, { useState, useEffect } from 'react';
import Project from './project';
import { Plus, Calendar, Loader2, LogOut, Filter, Search, Settings } from 'lucide-react';
import FormProject from './formProject';
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
    const [showForm, setShowForm] = useState(false);
    const { userId } = useParams();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState([]);
    const [newProject, setNewProject] = useState();
    const router = useRouter();

    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
        
                if (!token) {
                    console.error("No hay token, acceso denegado");
                    return;
                }
        
                //console.log("Token enviado:", token); // 👀 Verificar que hay token
        
                const res = await fetch(`/api/dashboard/projects/${userId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`, // 📌 Enviar token correctamente
                    },
                });
        
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.message || "Error al obtener los proyectos");
                }
        
                setProjects(data.data.projects);
            } catch (error) {
                console.error("Error al obtener los proyectos", error);
                setError(error.message || "Ocurrió un error al obtener los proyectos");
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, [userId]);

    useEffect(() => {
        if (newProject) {
            setProjects(prevProjects => [...prevProjects, newProject]);
            setShowForm(false);
        }
    }, [newProject]);

    const dismissError = () => setError("");

    const handleLogout = () => {
        localStorage.removeItem("token");
        console.log("Sesión cerrada");
        router.push('/auth/login');
    };

    return (
        <div className="min-h-screen bg-white text-gray-900">
            {/* Header - Sticky and Elevated with Logout Button */}
            <header className="sticky top-0 z-10 bg-white shadow-md px-4 py-3 sm:px-6">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary rounded-lg p-1.5">
                            <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-xl font-bold text-gray-800">VyCalendar</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="hidden sm:flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md transition-all duration-200 text-sm font-medium"
                        >
                            <Plus className="w-4 h-4" />
                            Nuevo Proyecto
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 border border-gray-300 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-md transition-all duration-200 text-sm font-medium ml-2"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden md:inline">Cerrar Sesión</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Container with Max Width and Auto Margins */}
            <main className="max-w-6xl mx-auto p-4 sm:p-6">

                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 relative"
                        >
                            <button
                                onClick={dismissError}
                                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            >
                                ×
                            </button>
                            <p className="text-sm">{error}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Form in Modal/Dialog for better UX */}
                <AnimatePresence>
                    {showForm && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-20 flex items-center justify-center p-2"
                            onClick={() => setShowForm(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                transition={{ type: "spring", damping: 25 }}
                                className="w-full max-w-lg bg-white rounded-xl shadow-xl overflow-hidden"
                                onClick={e => e.stopPropagation()}
                            >
                                <div className="p-2">
                                    <FormProject
                                        userId={userId}
                                        setNewProject={setNewProject}
                                        setShowForm={setShowForm}
                                        setError={setError}
                                    />
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Projects Section with Title */}
                <div className="mb-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">Mis Proyectos</h2>
                    {projects.length > 0 && (
                        <p className="text-sm text-gray-500">Mostrando {projects.length} proyecto(s)</p>
                    )}
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-16 space-y-4">
                        <Loader2 className="w-10 h-10 text-primary animate-spin" />
                        <p className="text-gray-500">Cargando proyectos...</p>
                    </div>
                ) : (
                    <>
                        {projects.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 space-y-6 text-center border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                                <div className="bg-white rounded-full p-6 shadow-sm">
                                    <Calendar className="w-10 h-10 text-gray-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-medium mb-2">No hay proyectos aún</h2>
                                    <p className="text-gray-500 max-w-md">
                                        Crea tu primer proyecto para comenzar a organizar tus actividades
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md transition-all shadow-sm"
                                >
                                    <Plus className="w-4 h-4" />
                                    Crear Proyecto
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {projects.map(project => (
                                    <motion.div
                                        key={project.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Project project={project} userId={userId} />
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Floating Action Button for Mobile */}
            <AnimatePresence>
                {!showForm && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        onClick={() => setShowForm(true)}
                        className="fixed bottom-6 right-6 bg-primary hover:bg-primary/90 text-white rounded-full shadow-lg p-4 sm:hidden z-10"
                    >
                        <Plus className="w-6 h-6" />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}