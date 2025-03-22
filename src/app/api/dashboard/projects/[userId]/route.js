import { successResponse, errorResponse } from "@/utils/handler";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
    try {
        const body = await req.json(); // ✅ Obtiene los datos correctamente
        const { name, userId } = body;

        if (!name || !userId) {
            return errorResponse("El nombre y el ID de usuario son obligatorios", 400);
        }
        const newProject = await prisma.project.create({
            data: {
                name: name,
                owner: {
                    connect: { id: userId } // 🔹 Asignar el creador como propietario
                },
                members: {  // 🔹 Aquí es "members", no "users"
                    create: {
                        user: { connect: { id: userId } },
                    }
                }
            },
            include: {
                members: true // 🔹 Cargar los miembros en la respuesta
            }
        });
        return successResponse("Proyecto creado exitosamente", newProject);
    } catch (error) {
        console.error("Error en /api/dashboard/projects", error);
        return errorResponse("Error en el servidor", 500);
    }
}


export async function GET(req, { params }) {
    try {
        const { userId } = params; // ✅ Obtiene el parámetro correctamente

        if (!userId) {
            return errorResponse("El ID del usuario es obligatorio", 400);
        }

        const projects = await prisma.project.findMany({
            where: { ownerId: userId }, // ✅ Usar ownerId en su lugar
        })

        if (projects.length === 0) {
            return errorResponse("No se encontraron proyectos", 404);
        }

        return successResponse("Proyectos obtenidos exitosamente", { projects });
    } catch (error) {
        console.error("Error en /api/dashboard/projects", error);
        return errorResponse("Error en el servidor", 500);
    }
}
