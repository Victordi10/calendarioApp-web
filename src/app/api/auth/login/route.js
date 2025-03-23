import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";  // 📌 Importamos jsonwebtoken
import { PrismaClient } from "@prisma/client";
import { successResponse, errorResponse } from "@/utils/handler";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "clave_secreta_super_segura"; // 📌 Define una clave secreta
const EPIRESIN = process.env.JWT_EXPIRES_IN || "2h"; // 📌 Define una clave secreta

export async function POST(req) {
    try {
        const { email, password } = await req.json();

        // 1️⃣ Buscar usuario por email
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return errorResponse("Usuario no encontrado", 404);
        }

        // 2️⃣ Comparar la contraseña encriptada
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return errorResponse("Contraseña incorrecta", 401);
        }

        // 3️⃣ Generar token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email },
            SECRET_KEY,  // Usa la clave secreta
            { expiresIn: EPIRESIN } // Duración del token
        );

        // 4️⃣ Responder con el usuario y el token
        return successResponse("Login exitoso", {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            token,  // 📌 Enviamos el token al cliente
        });

    } catch (error) {
        console.error("Error en /api/auth/login", error);
        return errorResponse("Error en el servidor", 500);
    }
}
