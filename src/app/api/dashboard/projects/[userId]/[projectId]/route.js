import { successResponse, errorResponse } from "@/utils/handler";
import { prisma } from "@/lib/prisma";
import { authMiddleware } from "@/middleware/authMiddleware";

function formatToDateTime(dateStr, timeStr) {
    console.log('Fecha:', dateStr);
    console.log('Hora:', timeStr);
    const dateTimeString = `${dateStr}T${timeStr}:00.000Z`;
    const dateTime = new Date(dateTimeString);
    console.log('dateTimeString:', dateTimeString);
    console.log('dateTime:', dateTime);

    if (isNaN(dateTime.getTime())) {
        throw new Error("Fecha u hora inválida");
    }

    return dateTime;
}

export async function POST(req, context) {
    try {
        // Esperar los params correctamente
        const params = await context.params;
        const { userId, projectId } = params;


        // Obtener y validar los datos del cuerpo
        const body = await req.json();
        const { clasificacion, nombre, redSocial, categoria, objetivo, formato, copywriten, hashtags, fecha, hora, estado } = body;

        if (!clasificacion || !nombre || !fecha || !hora) {
            return errorResponse("Todos los campos son obligatorios", 400);
        }

        const dateTime = formatToDateTime(fecha, hora);

        // Verificar si ya existe un evento en la misma fecha
        const existingEvent = await prisma.event.findFirst({
            where: {
                projectId, // Filtrar por el proyecto específico
                time: {
                    gte: new Date(`${fecha}T00:00:00.000Z`),
                    lt: new Date(`${fecha}T23:59:59.999Z`)
                }
            }
        });

        if (existingEvent) {
            return errorResponse("Ya hay un evento en esta fecha", 400);
        }

        // Crear evento en la base de datos
        const newEvent = await prisma.event.create({
            data: {
                cycle: clasificacion,
                title: nombre,
                socialMedia: redSocial,
                category: categoria,
                objective: objetivo,
                format: formato,
                text: copywriten,
                hashtags: hashtags,
                time: dateTime,
                status: estado,
                projectId
            }
        });

        return successResponse("Evento creado exitosamente", newEvent);
    } catch (error) {
        console.error("Error en /api/dashboard/projects/[userId]/[projectId]", error);
        return errorResponse("Error en el servidor", 500);
    }
}



async function getContenido(req, context) {
    try {
        // Obtener parámetros correctamente
        const params = await context.params;
        const { userId, projectId } = params;

        console.log("projectId:", projectId);

        if (!userId || !projectId) {
            return errorResponse("El ID del usuario y del proyecto son obligatorios", 400);
        }

        // Obtener la fecha de la query o usar la fecha actual
        const { searchParams } = new URL(req.url);
        let fecha = searchParams.get("fecha") || new Date().toISOString().split("T")[0]; // Formato YYYY-MM-DD o YYYY-MM
        console.log("Fecha recibida:", fecha);

        let events = [];

        if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
            // ✅ Caso 1: Se recibe una fecha con día (YYYY-MM-DD)
            const fechaInicio = new Date(`${fecha}T00:00:00.000Z`);
            const fechaFin = new Date(`${fecha}T23:59:59.999Z`);

            console.log("Buscando eventos del día:", fechaInicio.toISOString());

            events = await prisma.event.findMany({
                where: {
                    projectId,
                    time: {
                        gte: fechaInicio,
                        lt: fechaFin,
                    },
                },
                orderBy: {
                    time: "asc",
                },
            });

            // Si no hay eventos, buscar el próximo evento más cercano
            if (events.length === 0) {
                console.log("No hay eventos en la fecha exacta, buscando el próximo más cercano...");
                events = await prisma.event.findMany({
                    where: {
                        projectId,
                        time: {
                            gt: fechaFin, // Buscar eventos después de la fecha actual
                        },
                    },
                    orderBy: {
                        time: "asc",
                    },
                    take: 1, // Solo obtener el más cercano
                });
            }

        } else if (/^\d{4}-\d{2}$/.test(fecha)) {
            // ✅ Caso 2: Se recibe solo año y mes (YYYY-MM), buscar todo el mes
            const year = parseInt(fecha.split("-")[0], 10);
            const month = parseInt(fecha.split("-")[1], 10) - 1;

            const startOfMonth = new Date(Date.UTC(year, month, 1, 0, 0, 0));
            const endOfMonth = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59));

            console.log("Buscando eventos del mes:", startOfMonth.toISOString(), "hasta", endOfMonth.toISOString());

            events = await prisma.event.findMany({
                where: {
                    projectId,
                    time: {
                        gte: startOfMonth,
                        lt: endOfMonth,
                    },
                },
                orderBy: {
                    time: "asc",
                },
            });

        } else {
            return errorResponse("Formato de fecha inválido. Usa YYYY-MM-DD o YYYY-MM", 400);
        }

        // Obtener datos del proyecto
        const project = await prisma.project.findUnique({
            where: { id: projectId },
        });

        return successResponse("Eventos obtenidos exitosamente", { events, project });

    } catch (error) {
        console.error("Error en /api/dashboard/projects/[userId]/[projectId]", error);
        return errorResponse("Error en el servidor", 500);
    }
}

export const GET = authMiddleware(getContenido);


export async function PUT(req, context) {
    try {
        const params = await context.params;
        const { userId } = params;
        const body = await req.json(); // ✅ Obtener los datos del body
        const { eventId, projectId, fecha, hora, ...eventData } = body;

        // 🔹 Validar que se envían los datos necesarios
        if (!eventId || !projectId || !userId) {
            return errorResponse("El ID del evento, proyecto y usuario son obligatorios", 400);
        }

        // 🔹 Convertimos fecha + hora a DateTime
        const newEventDate = new Date(`${fecha}T${hora}:00.000Z`);

        // 🔹 Verificar si ya existe un evento en la nueva fecha para el mismo proyecto (excepto el que estamos editando)
        const existingEvent = await prisma.event.findFirst({
            where: {
                projectId,
                time: {
                    gte: new Date(`${fecha}T00:00:00.000Z`),
                    lt: new Date(`${fecha}T23:59:59.999Z`)
                },
                NOT: { id: eventId } // ❌ Excluir el evento que estamos editando
            }
        });

        if (existingEvent) {
            return errorResponse("Ya existe un evento programado para esta fecha en este proyecto", 409);
        }

        // ✅ Mapeo de nombres incorrectos a los correctos
        const updateData = {
            cycle: eventData.clasificacion,
            title: eventData.nombre,
            socialMedia: eventData.redSocial,
            category: eventData.categoria,
            objective: eventData.objetivo,
            format: eventData.formato,
            text: eventData.copywriten,
            status: eventData.estado,
            time: newEventDate,
        };

        // 🔹 Verificar que el usuario tenga permisos para editar
        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: { owner: true, members: true }
        });

        if (!project) {
            return errorResponse("Proyecto no encontrado", 404);
        }

        const isOwner = project.owner.id === userId;
        const isMember = project.members.some(member => member.userId === userId);

        if (!isOwner && !isMember) {
            return errorResponse("No tienes permisos para editar este evento", 403);
        }

        // 🔹 Actualizar el evento
        const updatedEvent = await prisma.event.update({
            where: { id: eventId },
            data: updateData
        });

        return successResponse("Evento actualizado exitosamente", updatedEvent);
    } catch (error) {
        console.error("Error en /api/dashboard/projects/event", error);
        return errorResponse("Error en el servidor", 500);
    }
}
