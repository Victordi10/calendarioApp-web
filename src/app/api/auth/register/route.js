import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { successResponse, errorResponse } from "@/utils/handler";


const prisma = new PrismaClient()

export async function POST(req) {
    try {
        const body = await req.json();
        const { name, email, password } = body;
        
        console.log(name, email, password)

        //validar datos
        if (!name || !email || !password) {
            return errorResponse("Todos los campos son obligatorios", 400)
        }

        //valido existencia de usuario
        const userExist = await prisma.user.findUnique({
            where: { email },
        })

        if (userExist) {
            return errorResponse("El correo ya está registrado", 409)
        }

        // 4️⃣ Encriptar la contraseña con bcrypt (usa `bcrypt.hash`)
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        })

        // 6️⃣ Responder con éxito (devuelve los datos del usuario sin la contraseña)
        return successResponse("Usuario registrado exitosamente", {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
        });

    } catch (error) {
        return errorResponse("Error en el servidor", 500)
    }
}