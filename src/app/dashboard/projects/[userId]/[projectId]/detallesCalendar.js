import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, CalendarIcon } from 'lucide-react';


// Componente EventDetails para mostrar los detalles del evento seleccionado
const EventDetails = ({ eventoSeleccionado, onClose, editarContenido  }) => {
    // Función para determinar el color según el estado
    const colorEstado = (estado) => {
      switch (estado?.toLowerCase()) {
        case 'pendiente':
          return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'completado':
          return 'bg-secondary bg-opacity-10 text-secondary border-secondary border-opacity-20';
        case 'cancelado':
          return 'bg-error bg-opacity-10 text-error border-error border-opacity-20';
        default:
          return 'bg-primary bg-opacity-10 text-primary border-primary border-opacity-20';
      }
    };
  
    // Si no hay evento seleccionado, no mostrar nada
    if (!eventoSeleccionado) return null;
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-30 animate-fadeIn">
        <div className="bg-fondo w-full max-w-md rounded-xl shadow-lg overflow-hidden transform transition-all animate-scaleIn">
          {/* Encabezado con título y estado */}
          <div className="relative p-5 border-b border-border">
            <button 
              onClick={onClose}
              className="absolute right-4 top-4 text-textTwo hover:text-text transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-xl font-semibold text-text pr-8">{eventoSeleccionado.title || 'Sin título'}</h3>
            <div className="mt-2 flex items-center">
              <span className={`px-3 py-1 text-sm rounded-full font-medium ${colorEstado(eventoSeleccionado.status)}`}>
                {eventoSeleccionado.status || 'Pendiente'}
              </span>
            </div>
          </div>
          
          {/* Contenido */}
          <div className="p-5 max-h-[70vh] overflow-y-auto">
            {/* Fecha y hora */}
            <div className="flex items-center mb-4 text-text">
              <div className="bg-primary bg-opacity-10 p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-textTwo">Fecha y hora</p>
                <p className="font-medium">{format(new Date(eventoSeleccionado.time), 'PPP • HH:mm', { locale: es })}</p>
              </div>
            </div>
            
            {/* Información principal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Ciclo */}
              <div className="flex items-center text-text">
                <div className="bg-secondary bg-opacity-10 p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-textTwo">Ciclo</p>
                  <p className="font-medium">{eventoSeleccionado.cycle || 'No especificado'}</p>
                </div>
              </div>
              
              {/* Categoría */}
              <div className="flex items-center text-text">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-textTwo">Categoría</p>
                  <p className="font-medium">{eventoSeleccionado.category || 'No especificada'}</p>
                </div>
              </div>
              
              {/* Red Social */}
              <div className="flex items-center text-text">
                <div className="bg-purple-100 p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-textTwo">Red Social</p>
                  <p className="font-medium">{eventoSeleccionado.socialMedia || 'No especificada'}</p>
                </div>
              </div>
              
              {/* Formato */}
              <div className="flex items-center text-text">
                <div className="bg-indigo-100 p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-textTwo">Formato</p>
                  <p className="font-medium">{eventoSeleccionado.format || 'No especificado'}</p>
                </div>
              </div>
              
              {/* Objetivo */}
              <div className="flex items-center text-text col-span-full">
                <div className="bg-amber-100 p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-textTwo">Objetivo</p>
                  <p className="font-medium">{eventoSeleccionado.objective || 'No especificado'}</p>
                </div>
              </div>
            </div>
            
            {/* Hashtags */}
            {eventoSeleccionado.hashtags && (
              <div className="mb-6">
                <p className="text-sm text-textTwo mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                  Hashtags
                </p>
                <div className="flex flex-wrap gap-2">
                  {eventoSeleccionado.hashtags.split(',').map((tag, index) => (
                    <span key={index} className="bg-primary bg-opacity-10 text-primary px-3 py-1 rounded-full text-sm">
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Contenido del texto */}
            <div className="mt-4">
              <p className="text-sm text-textTwo mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                Contenido
              </p>
              <div className="bg-gray-50 p-4 rounded-lg border border-border">
                <p className="text-text whitespace-pre-line">{eventoSeleccionado.text || 'Sin contenido'}</p>
              </div>
            </div>
          </div>
          
          {/* Pie de ventana con botones de acción */}
          <div className="border-t border-border p-4 bg-gray-50 flex justify-end space-x-3">
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-white text-textTwo border border-border rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cerrar
            </button>
            <button 
              onClick={() => editarContenido(eventoSeleccionado)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Editar
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default EventDetails;