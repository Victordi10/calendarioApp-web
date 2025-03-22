import { NextResponse } from "next/server";

//muestro en la consola donde estuvo el error
export const mostrarError = (donde, err) => {
    console.error(`Ocurrió un error en ${donde}: ${err.message}`);
};

export function errorResponse(message, statusCode = 500) {
    return NextResponse.json({ success: false, message }, { status: statusCode });
}

export function successResponse(message = "Operación exitosa", data = {}) {
    return NextResponse.json({ success: true, message, data }, { status: 200 });
}

// Función para formatear números con puntos
export function formatNumberWithDots(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
// Función para quitar puntos o comas de un número
export function removeDotsOrCommas(number) {
    return number.toString().replace(/[.,]/g, "");
}

export const obtenerPublicId = (url) => {
    return url.split('/').slice(-2).join('/').replace(/\.[^/.]+$/, "");
};

export const normalizarFecha = (fecha) => {
    const partes = fecha.split("/");
    const dia = partes[0].padStart(2, "0");
    const mes = partes[1].padStart(2, "0");
    const año = partes[2];
    return `${año}-${mes}-${dia}`; // Formato YYYY-MM-DD
};
