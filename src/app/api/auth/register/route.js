import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";  // 📌 Importamos jsonwebtoken
import { PrismaClient } from "@prisma/client";
import { successResponse, errorResponse } from "@/utils/handler";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "clave_secreta_super_segura"; // 📌 Define una clave secreta
const EPIRESIN = process.env.JWT_EXPIRES_IN || "2h"; // 📌 Define una clave secreta

export async function POST(req) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return errorResponse("Todos los campos son obligatorios", 400);
        }

        // Validar existencia de usuario
        const userExist = await prisma.user.findUnique({
            where: { email },
        });

        if (userExist) {
            return errorResponse("El correo ya está registrado", 409);
        }

        // 1️⃣ Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // 2️⃣ Crear nuevo usuario
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        // 3️⃣ Generar token JWT
        const token = jwt.sign(
            { id: newUser.id, email: newUser.email },
            SECRET_KEY,  // Usa la clave secreta
            { expiresIn: EPIRESIN } // Duración del token
        );

        // 4️⃣ Responder con éxito (devuelve usuario y token)
        return successResponse("Usuario registrado exitosamente", {
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
            },
            token, // 📌 Enviamos el token
        });

    } catch (error) {
        console.error("Error en /api/auth/register", error);
        return errorResponse("Error en el servidor", 500);
    }
}
