'use client'
import React, { useState } from 'react';
import Loader from '@/components/ui/loader';

export default function FormEvento({ eventData, userId, setContenido, projectId, setError, setEventData, handleInputChange, setShowEventForm }) {
    const [loading, setLoading] = useState(false);
    // Manejar envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`/api/dashboard/projects/${userId}/${projectId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(eventData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Error al publicar el evento");
            }
            console.log(data.data);

            setContenido(data.data);
        } catch (error) {
            console.error("Error al publicar el evento", error);
            setError(error.message || "Ocurrió un Error al publicar el evento");
        } finally {
            setLoading(false);
        }



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
            fecha: '',
            hora: '',
            estado: 'Pendiente',
            projectId: projectId
        });
    };
    return (
        <form onSubmit={handleSubmit} className="p-4 md:p-6 bg-white rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Clasificación */}
                <div className="col-span-1">
                    <label className="block text-[#6C757D] text-sm font-medium mb-1">
                        Clasificación
                    </label>
                    <div className="relative">
                        <select
                            name="clasificacion"
                            value={eventData.clasificacion}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2.5 bg-[#F8F9FA] text-[#212529] border border-[#E5E7EB] rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-[#007AFF] focus:border-transparent transition-all"
                            required
                        >
                            <option value="">Seleccionar clasificación</option>
                            <option value="descubrimiento">Descubrimiento</option>
                            <option value="consideracion">Consideración</option>
                            <option value="desicion">Decisión</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#6C757D]">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Red Social */}
                <div className="col-span-1">
                    <label className="block text-[#6C757D] text-sm font-medium mb-1">
                        Red Social
                    </label>
                    <div className="relative">
                        <select
                            name="redSocial"
                            value={eventData.redSocial}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2.5 bg-[#F8F9FA] text-[#212529] border border-[#E5E7EB] rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-[#007AFF] focus:border-transparent transition-all"
                            required
                        >
                            <option value="">Seleccionar red social</option>
                            <option value="facebook">Facebook</option>
                            <option value="instagram">Instagram</option>
                            <option value="twitter">Twitter</option>
                            <option value="linkedin">LinkedIn</option>
                            <option value="tiktok">TikTok</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#6C757D]">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Nombre - span completo */}
                <div className="col-span-full">
                    <label className="block text-[#6C757D] text-sm font-medium mb-1">
                        Nombre del contenido
                    </label>
                    <input
                        type="text"
                        name="nombre"
                        value={eventData.nombre}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 bg-[#F8F9FA] text-[#212529] border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#007AFF] focus:border-transparent transition-all"
                        placeholder="¿Cómo quieres identificar este contenido?"
                        required
                    />
                </div>

                {/* Categoría */}
                <div className="col-span-1">
                    <label className="block text-[#6C757D] text-sm font-medium mb-1">
                        Categoría
                    </label>
                    <input
                        type="text"
                        name="categoria"
                        value={eventData.categoria}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 bg-[#F8F9FA] text-[#212529] border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#007AFF] focus:border-transparent transition-all"
                        placeholder="Ej: Promoción, Informativo..."
                    />
                </div>

                {/* Objetivo */}
                <div className="col-span-1">
                    <label className="block text-[#6C757D] text-sm font-medium mb-1">
                        Objetivo
                    </label>
                    <input
                        type="text"
                        name="objetivo"
                        value={eventData.objetivo}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 bg-[#F8F9FA] text-[#212529] border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#007AFF] focus:border-transparent transition-all"
                        placeholder="¿Qué buscas lograr?"
                    />
                </div>

                {/* Formato */}
                <div className="col-span-1">
                    <label className="block text-[#6C757D] text-sm font-medium mb-1">
                        Formato
                    </label>
                    <div className="relative">
                        <select
                            name="formato"
                            value={eventData.formato}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2.5 bg-[#F8F9FA] text-[#212529] border border-[#E5E7EB] rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-[#007AFF] focus:border-transparent transition-all"
                        >
                            <option value="">Seleccionar formato</option>
                            <option value="imagen">Imagen</option>
                            <option value="video">Video</option>
                            <option value="carrusel">Carrusel</option>
                            <option value="texto">Solo texto</option>
                            <option value="historia">Historia</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#6C757D]">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Estado */}
                <div className="col-span-1">
                    <label className="block text-[#6C757D] text-sm font-medium mb-1">
                        Estado
                    </label>
                    <div className="relative">
                        <select
                            name="estado"
                            value={eventData.estado}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2.5 bg-[#F8F9FA] text-[#212529] border border-[#E5E7EB] rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-[#007AFF] focus:border-transparent transition-all"
                        >
                            <option value="Pendiente">Pendiente</option>
                            <option value="En proceso">En proceso</option>
                            <option value="Publicado">Publicado</option>
                            <option value="Cancelado">Cancelado</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#6C757D]">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Fecha y Hora en la misma línea en escritorio */}
                <div className="col-span-1">
                    <label className="block text-[#6C757D] text-sm font-medium mb-1">
                        Fecha
                    </label>
                    <input
                        type="date"
                        name="fecha"
                        value={eventData.fecha}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 bg-[#F8F9FA] text-[#212529] border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#007AFF] focus:border-transparent transition-all"
                        required
                    />
                </div>

                <div className="col-span-1">
                    <label className="block text-[#6C757D] text-sm font-medium mb-1">
                        Hora
                    </label>
                    <input
                        type="time"
                        name="hora"
                        value={eventData.hora}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 bg-[#F8F9FA] text-[#212529] border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#007AFF] focus:border-transparent transition-all"
                        required
                    />
                </div>

                {/* Copywriten - span completo */}
                <div className="col-span-full">
                    <label className="block text-[#6C757D] text-sm font-medium mb-1">
                        Copywriten
                    </label>
                    <textarea
                        name="copywriten"
                        value={eventData.copywriten}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 bg-[#F8F9FA] text-[#212529] border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#007AFF] focus:border-transparent transition-all min-h-[120px] resize-none"
                        placeholder="Escribe el texto que acompañará tu publicación..."
                    />
                </div>

                {/* Hashtags */}
                <div className="col-span-1">
                    <label className="block text-[#6C757D] text-sm font-medium mb-1">
                        Hashtags
                    </label>
                    <input
                        type="text"
                        name="hashtags"
                        value={eventData.hashtags}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 bg-[#F8F9FA] text-[#212529] border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#007AFF] focus:border-transparent transition-all"
                        placeholder="#hashtag #ejemplo"
                    />
                </div>

            </div>

            {/* Botones de acción */}
            <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                <button
                    type="button"
                    onClick={() => setShowEventForm(false)}
                    className="px-5 py-2.5 bg-white text-[#6C757D] border border-[#E5E7EB] rounded-md hover:bg-[#F8F9FA] transition-colors font-medium"
                >
                    Cancelar
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    type="submit"
                    className="px-5 py-2.5 bg-primary text-white rounded-md hover:bg-blue-600 transition-colors font-medium shadow-sm"
                >
                    {loading ? <Loader size={40} color='#fff'/> : "Guardar Contenido"}
                </button>
            </div>
        </form>
    );
}