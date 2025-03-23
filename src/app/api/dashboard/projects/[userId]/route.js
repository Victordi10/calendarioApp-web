import { successResponse, errorResponse } from "@/utils/handler";
import { prisma } from "@/lib/prisma";
import { authMiddleware } from "@/middleware/authMiddleware"; // 📌 Importamos el middleware

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
                members: true
            }
        });
        return successResponse("Proyecto creado exitosamente", newProject);
    } catch (error) {
        console.error("Error en /api/dashboard/projects", error);
        return errorResponse("Error en el servidor", 500);
    }
}



async function getProject(req, { params }) {
    try {
        const { userId } = params; // ✅ Obtiene el parámetro correctamente

        if (!userId) {
            return errorResponse("El ID del usuario es obligatorio", 400);
        }

        // 📌 Verificar que el usuario autenticado es el mismo que solicita los proyectos
        if (req.user.id !== userId) {
            return errorResponse("No tienes permisos para ver estos proyectos", 403);
        }

        const projects = await prisma.project.findMany({
            where: { ownerId: userId },
        });

        if (projects.length === 0) {
            return errorResponse("No se encontraron proyectos", 404);
        }

        return successResponse("Proyectos obtenidos exitosamente", { projects });
    } catch (error) {
        console.error("Error en /api/dashboard/projects", error);
        return errorResponse("Error en el servidor", 500);
    }
}

// 📌 Proteger la ruta con el middleware
export const GET = authMiddleware(getProject);


