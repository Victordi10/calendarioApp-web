"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Plus, Edit, Trash } from "lucide-react";
import Loader from "@/components/ui/loader";
import Aside from "./aside";
import Header from "./header";
import { FiHome, FiUsers, FiPlus, FiFileText, FiMenu, FiX, FiLogOut, FiCalendar } from 'react-icons/fi';
import FormEvento from "./FormEvento";
export default function ProjectDashboard() {
    const { userId, projectId } = useParams(); // ✅ Obtiene los parámetros de la URL
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [newCollaborator, setNewCollaborator] = useState("");
    const [editingName, setEditingName] = useState("");
    const [showEdit, setShowEdit] = useState(false);

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
        menciones: '',
        fecha: '',
        hora: '',
        estado: 'Pendiente'
    });

    // Manejar cambios en los inputs del formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEventData({
            ...eventData,
            [name]: value
        });
    };

    // Manejar envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí iría la lógica para guardar el evento
        console.log('Datos del evento:', eventData);
        setShowEventForm(false);
        // Resetear formulario
        setEventData({
            clasificacion: '',
            nombre: '',
            redSocial: '',
            categoria: '',
            objetivo: '',
            formato: '',
            copywriten: '',
            hashtags: '',
            menciones: '',
            fecha: '',
            hora: '',
            estado: 'Pendiente'
        });
    };
    // Lista de opciones del menú
    const menuItems = [
        { icon: <FiHome className="mr-3 text-primary" />, label: 'Dashboard', path: `/project/${userId}` },
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

    return (
        <div className="flex h-screen bg-[#F8F9FA]">
            {/* Sidebar para pantallas grandes (md y superiores) */}
            <Aside menuItems={menuItems} />

            {/* Contenido principal */}
            <div className="flex-1 flex flex-col">
                {/* Header con botón de menú para móviles */}
                <Header menuItems={menuItems} mobileMenuOpen={mobileMenuOpen} userId={userId} setMobileMenuOpen={setMobileMenuOpen} />
                {/* Contenido principal */}
                <main className="flex-1 p-4 bg-[#F8F9FA] overflow-y-auto relative">
                    {/* Aquí va el contenido de tu dashboard */}
                    <div className="bg-white p-4 rounded shadow border border-[#E5E7EB]">
                        <h2 className="text-lg font-medium text-[#212529] mb-4">Resumen del Proyecto</h2>
                        <p className="text-[#6C757D]">Aquí puedes mostrar la información principal de tu proyecto.</p>
                    </div>

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

                                <FormEvento handleInputChange={handleInputChange} handleSubmit={handleSubmit} eventData={eventData} setShowEventForm={setShowEventForm}/>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}