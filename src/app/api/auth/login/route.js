import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { successResponse, errorResponse } from "@/utils/handler";

const prisma = new PrismaClient();

export async function POST(req) {
    try {
        const { email, password } = await req.json();

        // 1️⃣ Buscar el usuario por email
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return await errorResponse("Usuario no encontrado", 404);
        }

        // 2️⃣ Comparar la contraseña encriptada
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return await errorResponse("Contraseña incorrecta", 401);
        }

        // 3️⃣ Si todo está bien, devolver el usuario (sin la contraseña)

        return successResponse("Login exitoso", {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });

    } catch (error) {
        console.error("Error en /api/auth/login", error);
        return await errorResponse("Error en el servidor", 500);

    }
}
