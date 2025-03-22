import Link from "next/link"
import { ArrowRight } from "lucide-react"
import Boton from "@/components/ui/boton"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-fondo">
      <main className="flex-1 flex items-center justify-center">
        <div className="container px-4 md:px-6 py-10 md:py-0">
          <div className="flex flex-col items-center text-center space-y-10 md:space-y-12">
            <div className="space-y-6 max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-text leading-tight">
                Tu contenido, tu ritmo
              </h1>
              <p className="text-lg md:text-xl text-textTwo max-w-2xl mx-auto mt-4">
                Organiza, planifica y crea sin esfuerzo. Todo tu contenido en un solo lugar, a tu manera.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <Link href="/auth/login" className="w-full">
                <Boton
                  estilos=""
                >
                  Iniciar Sesión
                </Boton>
              </Link>
              <Link href="/auth/register" className="w-full">
                <Boton estilos=" bg-primary/80 text-white">
                  Registrarse
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Boton>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[40%] -right-[30%] w-[80%] h-[80%] rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute -bottom-[40%] -left-[30%] w-[80%] h-[80%] rounded-full bg-primary/5 blur-3xl"></div>
      </div>
    </div>
  )
}


