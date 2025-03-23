import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "clave_secreta_super_segura"; // ⚠️ Verifica que JWT_SECRET esté definido en .env

export function authMiddleware(handler) {
    return async (req, context) => {
        try {
            // 🔹 Verificar los headers correctamente
            const authHeader = req.headers.get("authorization"); // ✅ Acceder a los headers correctamente en Next.js
            //console.log("📥 Headers recibidos en backend:", req.headers);
            //console.log("🔑 Header Authorization recibido:", authHeader);

            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return new Response(
                    JSON.stringify({ message: "No autorizado, falta el token" }),
                    { status: 401 }
                );
            }

            const token = authHeader.split(" ")[1]; // Extraer token
            //console.log("✅ Token recibido en backend:", token);

            const decoded = jwt.verify(token, process.env.JWT_SECRET || "clave_secreta_super_segura");
            req.user = decoded; // Guardar usuario en la request

            return handler(req, context);
        } catch (error) {
            console.error("❌ Error al verificar token:", error);
            return new Response(
                JSON.stringify({ message: "Token inválido o expirado" }),
                { status: 401 }
            );
        }
    };
}
