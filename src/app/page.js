'use client'
import Link from "next/link";
import { ArrowRight, Sparkles, Check } from "lucide-react";
import Boton from "@/components/ui/boton";
import { motion } from "framer-motion";

export default function Home() {
  const features = [
    "Organiza tu contenido sin esfuerzo",
    "Planifica tu calendario editorial",
    "Colabora con tu equipo en tiempo real",
    "Analiza el rendimiento de tu contenido"
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50 overflow-hidden relative">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-secondary/5 rounded-full" />

        {/* Patrones geométricos sutiles */}
        <div className="hidden md:block absolute top-20 right-20">
          <div className="grid grid-cols-3 gap-2">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-primary/20"
              />
            ))}
          </div>
        </div>

        {/* Líneas decorativas */}
        <div className="absolute bottom-40 left-20 w-32 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent rotate-45" />
        <div className="absolute top-40 right-20 w-32 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent -rotate-45" />
      </div>

      <main className="flex-1 flex items-center justify-center relative z-10 px-4">
        <div className="container py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center space-y-12"
          >
            {/* Badge del producto */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 backdrop-blur-sm shadow-sm border border-gray-100 px-4 py-2 rounded-full flex items-center"
            >
              <Sparkles className="h-4 w-4 text-primary mr-2" />
              <span className="text-sm font-medium text-gray-800">La plataforma preferida por creadores de contenido</span>
            </motion.div>

            <div className="space-y-6 max-w-4xl">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7 }}
                className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 leading-tight"
              >
                Tu contenido, <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">tu ritmo</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mt-6"
              >
                Organiza, planifica y crea sin esfuerzo. Todo tu contenido en un solo lugar, a tu manera.
              </motion.p>
            </div>

            {/* Lista de características */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto mb-4"
            >
              {features.map((feature, index) => (
                <div key={index} className="flex items-center text-left">
                  <div className="flex-shrink-0 mr-2 bg-primary/10 p-1 rounded-full">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </motion.div>

            {/* Botones de acción */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 w-full max-w-md"
            >
              <Link href="/auth/login" className="w-full">
                <Boton
                  estilos="w-full bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 shadow-sm font-medium py-3 rounded-xl transition-all duration-200"
                >
                  Iniciar Sesión
                </Boton>
              </Link>
              <Link href="/auth/register" className="w-full">
                <Boton estilos="w-full bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20 font-medium py-3 rounded-xl transition-all duration-200">
                  Registrarse
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Boton>
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="pt-8 text-sm text-gray-500"
            >
              <p>Más de 10,000 creadores de contenido confían en nosotros</p>
              <div className="flex justify-center gap-8 mt-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-16 h-8 bg-gray-200 rounded-md animate-pulse"></div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>

      {/* Footer minimalista */}
      <footer className="py-6 border-t border-gray-100 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">© 2025 Tu Plataforma. Todos los derechos reservados.</p>
            <div className="flex gap-6">
              <Link href="#" className="text-sm text-gray-500 hover:text-primary transition-colors">Términos</Link>
              <Link href="#" className="text-sm text-gray-500 hover:text-primary transition-colors">Privacidad</Link>
              <Link href="#" className="text-sm text-gray-500 hover:text-primary transition-colors">Contacto</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}