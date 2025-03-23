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
        let fecha = searchParams.get("fecha") || new Date().toISOString().split("T")[0]; // Fecha en formato YYYY-MM-DD

        if (!fecha) {
            // Si no hay fecha en la query, usar la fecha actual en formato YYYY-MM-DD
            const now = new Date();
            fecha = now.toISOString().split("T")[0];
        }

        console.log("Fecha utilizada:", fecha);

        const project = await prisma.project.findMany({
            where: { id: projectId }, // ✅ Usar ownerId en su lugar
        })

        // Buscar eventos para la fecha específica
        let events = await prisma.event.findMany({
            where: {
                projectId,
                time: {
                    gte: new Date(`${fecha}T00:00:00.000Z`),
                    lt: new Date(`${fecha}T23:59:59.999Z`),
                },
            },
            orderBy: {
                time: "asc",
            },
        });

        // Si no hay eventos en la fecha dada, buscar el próximo evento más cercano
        if (events.length === 0) {
            events = await prisma.event.findMany({
                where: {
                    projectId,
                    time: {
                        gt: new Date(`${fecha}T23:59:59.999Z`), // Buscar eventos después de la fecha actual
                    },
                },
                orderBy: {
                    time: "asc",
                },
                take: 1, // Solo obtener el más cercano
            });
        }

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
        const body = await req.json() // ✅ Obtener los datos del body
        const { eventId, projectId, fecha, hora, ...eventData } = body

        // 🔹 Validar que se envían los datos necesarios
        if (!eventId || !projectId || !userId) {
            return errorResponse("El ID del evento, proyecto y usuario son obligatorios", 400)
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
            time: new Date(`${fecha}T${hora}:00.000Z`), // 🔹 Convertimos fecha + hora a DateTime
        };

        // 🔹 Verificar que el usuario tenga permisos para editar
        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: { owner: true, members: true }
        })

        if (!project) {
            return errorResponse("Proyecto no encontrado", 404)
        }

        const isOwner = project.owner.id === userId
        const isMember = project.members.some(member => member.userId === userId)

        if (!isOwner && !isMember) {
            return errorResponse("No tienes permisos para editar este evento", 403)
        }

        // 🔹 Actualizar el evento
        const updatedEvent = await prisma.event.update({
            where: { id: eventId },
            data: updateData
        })

        return successResponse("Evento actualizado exitosamente", updatedEvent)
    } catch (error) {
        console.error("Error en /api/dashboard/projects/event", error)
        return errorResponse("Error en el servidor", 500)
    }
}