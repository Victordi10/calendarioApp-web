"use client"

import { useState, useEffect } from "react"
import Loader from "@/components/ui/loader"
import { cn } from "@/lib/utils"

// Datos de opciones para los selects
const CLASIFICACIONES = [
    { value: "descubrimiento", label: "Descubrimiento" },
    { value: "consideracion", label: "Consideración" },
    { value: "desicion", label: "Decisión" },
]

const REDES_SOCIALES = [
    { value: "facebook", label: "Facebook" },
    { value: "instagram", label: "Instagram" },
    { value: "twitter", label: "Twitter" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "tiktok", label: "TikTok" },
]

const FORMATOS = [
    { value: "imagen", label: "Imagen" },
    { value: "video", label: "Video" },
    { value: "carrusel", label: "Carrusel" },
    { value: "texto", label: "Solo texto" },
    { value: "historia", label: "Historia" },
]

const ESTADOS = [
    { value: "Pendiente", label: "Pendiente" },
    { value: "En proceso", label: "En proceso" },
    { value: "Publicado", label: "Publicado" },
    { value: "Cancelado", label: "Cancelado" },
]

// Componente reutilizable para inputs
const FormInput = ({
    label,
    name,
    type = "text",
    value,
    onChange,
    placeholder,
    required = false,
    options = [],
    className,
}) => {
    const baseInputStyles =
        "w-full px-3 py-2.5 bg-[#F8F9FA] text-[#212529] border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#007AFF] focus:border-transparent transition-all"

    return (
        <div className={cn("col-span-1", className)}>
            <label className="block text-[#6C757D] text-sm font-medium mb-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>

            {type === "select" ? (
                <div className="relative">
                    <select
                        name={name}
                        value={value}
                        onChange={onChange}
                        className={`${baseInputStyles} appearance-none`}
                        required={required}
                    >
                        <option value="">Seleccionar {label.toLowerCase()}</option>
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#6C757D]">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                    </div>
                </div>
            ) : type === "textarea" ? (
                <textarea
                    name={name}
                    value={value}
                    onChange={onChange}
                    className={`${baseInputStyles} min-h-[120px] resize-none`}
                    placeholder={placeholder}
                    required={required}
                />
            ) : (
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    className={baseInputStyles}
                    placeholder={placeholder}
                    required={required}
                />
            )}
        </div>
    )
}

export default function FormEvento({
    eventData,
    setEventData,
    editContent, // ⬅ Se recibe el contenido a editar
    setShowEventForm,
    setContenido,
    userId,
    projectId,
    setError,
    handleInputChange,
}) {
   const [loading, setLoading] = useState(false)

    // ⬇ Rellenar el formulario si hay contenido para editar
    useEffect(() => {
        if (editContent) {
            setEventData({
                clasificacion: editContent.cycle || "",
                nombre: editContent.title || "",
                redSocial: editContent.socialMedia || "",
                categoria: editContent.category || "",
                objetivo: editContent.objective || "",
                formato: editContent.format || "",
                copywriten: editContent.text || "",
                hashtags: editContent.hashtags || "",
                fecha: editContent.time ? editContent.time.split("T")[0] : "",
                hora: editContent.time ? editContent.time.split("T")[1].slice(0, 5) : "",
                estado: editContent.status || "Pendiente",
                eventId: editContent.id || eventId,
                projectId: editContent.projectId || projectId,
            })
        }
    }, [editContent, setEventData, projectId])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            let res
            if (editContent) {
                // Si hay datos para editar, hacemos un PUT en lugar de POST
                res = await fetch(`/api/dashboard/projects/${userId}/${projectId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(eventData),
                })
            } else {
                // Crear nuevo evento
                res = await fetch(`/api/dashboard/projects/${userId}/${projectId}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(eventData),
                })
            }

            console.log('eventData',eventData)

            const data = await res.json()
            if (!res.ok) throw new Error(data.message || "Error al guardar el evento")

            setContenido(data.data)
            setShowEventForm(false)

            // Resetear formulario
            setEventData({
                clasificacion: "",
                nombre: "",
                redSocial: "",
                categoria: "",
                objetivo: "",
                formato: "",
                copywriten: "",
                hashtags: "",
                fecha: "",
                hora: "",
                estado: "Pendiente",
                projectId: projectId,
            })
        } catch (error) {
            console.error("Error al guardar el evento", error)
            setError(error.message || "Ocurrió un error")
        } finally {
            setLoading(false)
        }
    }


    return (
        <form className="p-4 md:p-6 bg-white rounded-lg shadow-sm" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormInput
                    label="Clasificación"
                    name="clasificacion"
                    type="select"
                    value={eventData.clasificacion}
                    onChange={handleInputChange}
                    options={CLASIFICACIONES}
                    required
                />

                <FormInput
                    label="Red Social"
                    name="redSocial"
                    type="select"
                    value={eventData.redSocial}
                    onChange={handleInputChange}
                    options={REDES_SOCIALES}
                    required
                />

                <FormInput
                    label="Nombre del contenido"
                    name="nombre"
                    value={eventData.nombre}
                    onChange={handleInputChange}
                    placeholder="¿Cómo quieres identificar este contenido?"
                    required
                    className="col-span-full"
                />

                <FormInput
                    label="Categoría"
                    name="categoria"
                    value={eventData.categoria}
                    onChange={handleInputChange}
                    placeholder="Ej: Promoción, Informativo..."
                />

                <FormInput
                    label="Objetivo"
                    name="objetivo"
                    value={eventData.objetivo}
                    onChange={handleInputChange}
                    placeholder="¿Qué buscas lograr?"
                />

                <FormInput
                    label="Formato"
                    name="formato"
                    type="select"
                    value={eventData.formato}
                    onChange={handleInputChange}
                    options={FORMATOS}
                />

                <FormInput
                    label="Estado"
                    name="estado"
                    type="select"
                    value={eventData.estado}
                    onChange={handleInputChange}
                    options={ESTADOS}
                />

                <FormInput
                    label="Fecha"
                    name="fecha"
                    type="date"
                    value={eventData.fecha}
                    onChange={handleInputChange}
                    required
                />

                <FormInput label="Hora" name="hora" type="time" value={eventData.hora} onChange={handleInputChange} required />

                <FormInput
                    label="Copywriten"
                    name="copywriten"
                    type="textarea"
                    value={eventData.copywriten}
                    onChange={handleInputChange}
                    placeholder="Escribe el texto que acompañará tu publicación..."
                    className="col-span-full"
                />

                <FormInput
                    label="Hashtags"
                    name="hashtags"
                    value={eventData.hashtags}
                    onChange={handleInputChange}
                    placeholder="#hashtag #ejemplo"
                />
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
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 bg-primary text-white rounded-md hover:bg-blue-600 transition-colors font-medium shadow-sm flex items-center justify-center min-h-[42px]"
                >
                    {loading ? <Loader size={24} color="#fff" /> : "Guardar Contenido"}
                </button>
            </div>
        </form>
    )
}

