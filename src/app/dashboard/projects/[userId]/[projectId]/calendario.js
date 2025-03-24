import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, CalendarIcon } from 'lucide-react';
import EventDetails from './detallesCalendar';

function Calendario({ userId, projectId, setError, setEdit, setShowEventForm }) {
    const [date, setDate] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const [eventos, setEventos] = useState([]);
    const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
    const [eventosDia, setEventosDia] = useState([]);
    const [eventosPorDia, setEventosPorDia] = useState({});

    const [showDetails, setShowDetails] = useState(false);


    // Función para formatear la fecha (YYYY-MM para mes)
    const formatearMes = (fecha) => {
        return fecha.toISOString().split("T")[0].slice(0, 7);
    }

    // Función para formatear la fecha (YYYY-MM-DD para día)
    const formatearDia = (fecha) => {
        return fecha.toISOString().split("T")[0];
    }

    // Cambiar al mes anterior
    const mesAnterior = () => {
        const nuevaFecha = new Date(date);
        nuevaFecha.setMonth(nuevaFecha.getMonth() - 1);
        setDate(nuevaFecha);
    };

    // Cambiar al mes siguiente
    const mesSiguiente = () => {
        const nuevaFecha = new Date(date);
        nuevaFecha.setMonth(nuevaFecha.getMonth() + 1);
        setDate(nuevaFecha);
    };

    // Obtener eventos del mes actual
    useEffect(() => {
        const obtenerEventos = async () => {
            const mesFormateado = formatearMes(date);
            setError(null);
            setLoading(true);

            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    setError("No hay token, acceso denegado");
                    return;
                }

                const res = await fetch(`/api/dashboard/projects/${userId}/${projectId}?fecha=${mesFormateado}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || "Error al obtener los eventos");
                }

                // Actualizar eventos
                const eventosRecibidos = data.data.events || [];
                setEventos(eventosRecibidos);

                // Agrupar eventos por día
                const eventosPorDiaObj = {};
                eventosRecibidos.forEach(evento => {
                    const fechaEvento = new Date(evento.time).toISOString().split("T")[0];
                    if (!eventosPorDiaObj[fechaEvento]) {
                        eventosPorDiaObj[fechaEvento] = [];
                    }
                    eventosPorDiaObj[fechaEvento].push(evento);
                });
                setEventosPorDia(eventosPorDiaObj);

                // Limpiar selección
                setEventoSeleccionado(null);
                setEventosDia([]);
            } catch (error) {
                console.error("Error al obtener los eventos:", error);
                setError(error.message || "Ocurrió un error al obtener los eventos");
            } finally {
                setLoading(false);
            }
        };

        obtenerEventos();
    }, [date, userId, projectId, setError]);

    // Manejar clic en un día
    const manejarClicDia = (dia) => {
        const fechaFormateada = formatearDia(dia);
        const eventosDelDia = eventosPorDia[fechaFormateada] || [];
        setEventosDia(eventosDelDia);
        setEventoSeleccionado(null);
    };

    // Manejar clic en un evento
    const manejarClicEvento = (evento) => {
        setEventoSeleccionado(evento);
        setShowDetails(true);
    };

    useEffect(() => {
        console.log('setEventoSeleccionado', eventoSeleccionado)
    }, [eventoSeleccionado])

    // Generar días del mes
    const diasDelMes = () => {
        const inicio = startOfMonth(date);
        const fin = endOfMonth(date);
        return eachDayOfInterval({ start: inicio, end: fin });
    };

    // Obtener el nombre del mes actual
    const nombreMes = format(date, 'MMMM yyyy', { locale: es });

    // Obtener días de la semana en español
    const diasSemana = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

    // Color según estado del evento
    const colorEstado = (estado) => {
        switch (estado?.toLowerCase()) {
            case 'pendiente':
                return 'bg-yellow-100 text-yellow-800';
            case 'completado':
                return 'bg-green-100 text-green-800';
            case 'cancelado':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-blue-100 text-blue-800';
        }
    };

    const editarContenido = (contenido)=>{
        setEdit(contenido)
        setShowEventForm(true)
    }

    return (
        <div className="bg-white rounded-lg shadow p-4">
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            )}

            {/* Cabecera del calendario */}
            <div className="flex items-center justify-between text-text mb-4">
                <h2 className="text-xl  font-semibold capitalize">{nombreMes}</h2>
                <div className="flex space-x-2">
                    <button
                        onClick={mesAnterior}
                        className="p-2 rounded hover:bg-gray-100"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={mesSiguiente}
                        className="p-2 rounded hover:bg-gray-100"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* Calendario */}
            <div className="grid grid-cols-7 text-text gap-1">
                {/* Días de la semana */}
                {diasSemana.map((dia, index) => (
                    <div key={index} className="text-center text-text font-medium py-2">
                        {dia}
                    </div>
                ))}

                {/* Relleno para alinear el primer día */}
                {Array.from({ length: new Date(startOfMonth(date)).getDay() }).map((_, index) => (
                    <div key={`empty-${index}`} className="h-20 p-1 bg-gray-50"></div>
                ))}

                {/* Días del mes */}
                {diasDelMes().map((dia) => {
                    const fechaDia = formatearDia(dia);
                    const eventosHoy = eventosPorDia[fechaDia] || [];
                    const hayEventos = eventosHoy.length > 0;

                    return (
                        <div
                            key={fechaDia}
                            onClick={() => manejarClicDia(dia)}
                            className={`h-20 p-1 overflow-hidden border border-gray-200 transition-colors cursor-pointer hover:bg-gray-50 ${isToday(dia) ? 'bg-blue-50' : ''
                                }`}
                        >
                            <div className="flex justify-between">
                                <span className={`font-semibold ${isToday(dia) ? 'text-blue-600' : 'text-text'}`}>
                                    {format(dia, 'd')}
                                </span>
                                {hayEventos && (
                                    <CalendarIcon size={16} className="text-blue-500" />
                                )}
                            </div>

                            {/* Mostrar hasta 2 eventos */}
                            <div className="mt-1 space-y-1 text-xs">
                                {eventosHoy.slice(0, 2).map(evento => (
                                    <div
                                        key={evento.id}
                                        className={`${colorEstado(evento.status)} px-1 py-0.5 rounded truncate`}
                                    >
                                        {evento.title || 'Sin título'}
                                    </div>
                                ))}
                                {eventosHoy.length > 2 && (
                                    <div className="text-xs text-gray-500">
                                        +{eventosHoy.length - 2} más
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            {eventosDia.length > 0 && (
                <div className="mt-6 border-t border-border pt-4">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-lg text-text">
                            Contenido: {format(new Date(eventosDia[0].time), 'dd/MM/yyyy')}
                        </h3>
                        <span className="text-xs text-textTwo bg-gray-100 px-2 py-1 rounded-full">
                            {eventosDia.length} evento{eventosDia.length !== 1 ? 's' : ''}
                        </span>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2">
                        {eventosDia.map(evento => (
                            <div
                                key={evento.id}
                                onClick={() => manejarClicEvento(evento)}
                                className={`p-4 rounded-lg cursor-pointer border transition-all duration-200 hover:shadow-md ${eventoSeleccionado?.id === evento.id
                                    ? 'border-primary ring-2 ring-primary ring-opacity-20'
                                    : 'border-border hover:border-primary hover:border-opacity-50'
                                    }`}
                            >
                                {/* Encabezado con título y estado */}
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-medium text-text">{evento.title || 'Sin título'}</h4>
                                    <span className={`px-2 py-0.5 text-xs rounded-full ${colorEstado(evento.status)}`}>
                                        {evento.status || 'Pendiente'}
                                    </span>
                                </div>

                                {/* Hora y ciclo */}
                                <div className="flex items-center gap-3 text-sm text-textTwo mb-3">
                                    <div className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {format(new Date(evento.time), 'HH:mm')}
                                    </div>
                                    {evento.type && (
                                        <div className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                            {evento.type}
                                        </div>
                                    )}
                                </div>

                                {/* Categoría, Red Social y Formato */}
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {evento.category && (
                                        <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-md">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                            </svg>
                                            {evento.category}
                                        </span>
                                    )}
                                    {evento.socialMedia && (
                                        <span className="inline-flex items-center px-2 py-1 bg-purple-50 text-purple-600 text-xs rounded-md">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                            {evento.socialMedia}
                                        </span>
                                    )}
                                    {evento.format && (
                                        <span className="inline-flex items-center px-2 py-1 bg-indigo-50 text-indigo-600 text-xs rounded-md">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                                            </svg>
                                            {evento.format}
                                        </span>
                                    )}
                                </div>

                                {/* Extracto del texto */}
                                {evento.text && (
                                    <div className="mt-2">
                                        <p className="text-sm text-text line-clamp-2 bg-gray-50 p-2 rounded border border-border">
                                            {evento.text}
                                        </p>
                                    </div>
                                )}

                                {/* Ver más link */}
                                <div className="flex justify-end mt-2">
                                    <span className="text-xs text-primary font-medium cursor-pointer hover:underline">
                                        {eventoSeleccionado?.id === evento.id ? 'Ver menos' : 'Ver más'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Detalles del evento seleccionado */}
                    {eventoSeleccionado && (
                        <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-border animate-fadeIn">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="font-semibold text-lg text-text">Detalles completos</h3>
                                <button
                                    onClick={() => setEventoSeleccionado(null)}
                                    className="text-textTwo hover:text-text transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                                {/* Detalles básicos en la primera columna */}
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-xs text-textTwo">Título</span>
                                        <p className="font-medium text-text">{eventoSeleccionado.title || 'Sin título'}</p>
                                    </div>

                                    <div>
                                        <span className="text-xs text-textTwo">Fecha y hora</span>
                                        <p className="font-medium text-text">
                                            {format(new Date(eventoSeleccionado.time), 'PPP • HH:mm', { locale: es })}
                                        </p>
                                    </div>

                                    <div>
                                        <span className="text-xs text-textTwo">Estado</span>
                                        <p className={`inline-block px-2 py-0.5 text-xs rounded-full mt-1 ${colorEstado(eventoSeleccionado.status)}`}>
                                            {eventoSeleccionado.status || 'Pendiente'}
                                        </p>
                                    </div>

                                    <div>
                                        <span className="text-xs text-textTwo">Tipo</span>
                                        <p className="font-medium text-text">{eventoSeleccionado.type || 'No especificado'}</p>
                                    </div>

                                    <div>
                                        <span className="text-xs text-textTwo">Categoría</span>
                                        <p className="font-medium text-text">{eventoSeleccionado.category || 'No especificada'}</p>
                                    </div>
                                </div>

                                {/* Detalles adicionales en la segunda columna */}
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-xs text-textTwo">Red Social</span>
                                        <p className="font-medium text-text">{eventoSeleccionado.socialMedia || 'No especificada'}</p>
                                    </div>

                                    <div>
                                        <span className="text-xs text-textTwo">Formato</span>
                                        <p className="font-medium text-text">{eventoSeleccionado.format || 'No especificado'}</p>
                                    </div>

                                    <div>
                                        <span className="text-xs text-textTwo">Objetivo</span>
                                        <p className="font-medium text-text">{eventoSeleccionado.objective || 'No especificado'}</p>
                                    </div>

                                    {eventoSeleccionado.hashtags && (
                                        <div>
                                            <span className="text-xs text-textTwo">Hashtags</span>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {eventoSeleccionado.hashtags.split(',').map((tag, index) => (
                                                    <span key={index} className="bg-primary bg-opacity-10 text-primary px-2 py-0.5 rounded-full text-xs">
                                                        #{tag.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Contenido completo */}
                            <div className="mt-4">
                                <span className="text-xs text-textTwo">Contenido</span>
                                <div className="bg-white p-3 rounded border border-border mt-1 max-h-64 overflow-y-auto">
                                    <p className="text-text whitespace-pre-line">{eventoSeleccionado.text || 'Sin contenido'}</p>
                                </div>
                            </div>

                            {/* Botones de acción */}
                            <div className="flex justify-end mt-4 space-x-2">
                                <button
                                    onClick={() => editarContenido(eventoSeleccionado)}
                                    className="px-3 py-1.5 bg-primary text-white text-sm rounded hover:bg-blue-600 transition-colors">
                                    Editar
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Detalles del evento seleccionado */}
            {showDetails && eventoSeleccionado && (
                <EventDetails
                    eventoSeleccionado={eventoSeleccionado}
                    onClose={() => setShowDetails(false)}
                    editarContenido={editarContenido}
                />
            )}

        </div>
    );
}

export default Calendario;