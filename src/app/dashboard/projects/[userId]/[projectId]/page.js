"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Calendar, Loader2, LogOut, Filter, Search, Settings } from 'lucide-react';
import Loader from "@/components/ui/loader";
import EventDisplay from "./EventDisplay";
import Aside from "./aside";
import Header from "./header";
import { FiHome, FiUsers, FiPlus, FiFileText, FiMenu, FiX, FiLogOut, FiCalendar } from 'react-icons/fi';
import FormEvento from "./FormEvento";
import ContentCard from "./content-card";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";


export default function ProjectDashboard() {
    const { userId, projectId } = useParams(); // ✅ Obtiene los parámetros de la URL
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [contenido, setContenido] = useState(null);
    const [project, setProject] = useState(null);
    const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]); // Fecha actual en formato YYYY-MM-DD


    // Estado para controlar la visualización del menú móvil
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Estado para controlar la visualización del formulario de eventos
    const [showEventForm, setShowEventForm] = useState(false);

    // Estado para los datos del formulario
    const [eventData, setEventData] = useState({
        clasificacion: '',
        nombre: '',
        redSocial: '',
        categoria: '',
        objetivo: '',
        formato: '',
        copywriten: '',
        hashtags: '',
        fecha: '',
        hora: '',
        estado: 'Pendiente',
        projectId
    });

    // Manejar cambios en los inputs del formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEventData({
            ...eventData,
            [name]: value
        });
    };

    const getContenido = useCallback(async (fecha) => {
        setError(null);
        setLoading(true);
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("No hay token, acceso denegado");
                return;
            }

            const res = await fetch(`/api/dashboard/projects/${userId}/${projectId}?fecha=${fecha}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`, // 📌 Enviar token correctamente
                },
            });
            
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Error al obtener los eventos");
            }

            if (data.data.length === 0) {
                setError("No hay eventos disponibles");
            }

            console.log(data.data)

            setContenido(data.data.events[0]);
            setProject(data.data.project[0]);
        } catch (error) {
            console.error("Error al obtener el evento", error);
            setError(error.message || "Ocurrió un error al obtener el evento");
        } finally {
            setLoading(false);
        }
    }, [userId, projectId]);


    // Lista de opciones del menú
    const menuItems = [
        { icon: <FiHome className="mr-3 text-primary" />, label: 'Dashboard', path: `/dashboard/projects/${userId}` },
        { icon: <FiFileText className="mr-3 text-primary" />, label: 'Calendario', path: `/project/${projectId}/documents` },
        { icon: <FiUsers className="mr-3 text-primary" />, label: 'Colaboradores', path: `/project/${projectId}/team` },
        { icon: <FiCalendar className="mr-3 text-primary" />, label: 'Editar', path: `/project/${projectId}/calendar` },
    ];

    // Cierra el menú móvil cuando se cambia el tamaño de la pantalla
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (fecha) {
            getContenido(fecha);
        }
    }, [fecha, getContenido]);


    return (
        <div className="flex h-screen bg-[#F8F9FA]">
            {/* Sidebar para pantallas grandes (md y superiores) */}
            <Aside menuItems={menuItems} />

            {/* Contenido principal */}
            <div className="flex-1 flex flex-col">
                {/* Header con botón de menú para móviles */}
                <Header menuItems={menuItems} mobileMenuOpen={mobileMenuOpen} userId={userId} setMobileMenuOpen={setMobileMenuOpen} project={project} />
                {/* Contenido principal */}
                <main className="flex-1 p-4 bg-[#F8F9FA] overflow-y-auto relative">
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 relative"
                            >
                                <button
                                    onClick={() => setError(null)}
                                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                >
                                    ×
                                </button>
                                <p className="text-sm">{error}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>


                    {/* Aquí va el contenido de tu dashboard */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16 space-y-4">
                            <Loader2 className="w-10 h-10 text-primary animate-spin" />
                            <p className="text-gray-500">Cargando proyectos...</p>
                        </div>
                    ) : (
                        <>
                            <div className="bg-white p-4 mb-4 rounded shadow border border-[#E5E7EB]">
                                <h2 className="text-lg font-medium text-[#212529] mb-4">Resumen del Proyecto</h2>
                                <p className="text-[#6C757D]">Aquí puedes mostrar la información principal de tu proyecto.</p>
                            </div>
                            <ContentCard content={contenido} />
                        </>
                    )}

                    {/* Botón flotante para agregar evento */}
                    <button
                        onClick={() => setShowEventForm(true)}
                        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#007AFF] text-white flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors"
                    >
                        <FiPlus size={24} />
                    </button>

                    {/* Modal de formulario para agregar evento */}
                    {showEventForm && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto">
                                <div className="p-4 border-b border-[#E5E7EB] flex justify-between items-center">

                                    <h2 className="text-xl font-semibold text-[#212529] border-b border-[#E5E7EB] pb-2">
                                        Nuevo Contenido
                                    </h2>
                                    <button
                                        onClick={() => setShowEventForm(false)}
                                        className="text-[#6C757D] hover:text-[#212529]"
                                    >
                                        <FiX size={24} />
                                    </button>
                                </div>

                                <FormEvento projectId={projectId} setContenido={setContenido} userId={userId} handleInputChange={handleInputChange} setEventData={setEventData} setError={setError} eventData={eventData} setShowEventForm={setShowEventForm} />
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}