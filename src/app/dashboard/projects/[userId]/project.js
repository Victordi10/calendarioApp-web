import { useRouter } from "next/navigation"; // ✅ Para la navegación en Next.js
import { format } from "date-fns";
import es from "date-fns/locale/es";

const Project = ({ project, userId }) => {
    const { name, updatedAt, id } = project;
    const router = useRouter(); // 📌 Hook para redirección

    // 📌 Formatear la fecha
    const formattedDate = updatedAt
        ? format(new Date(updatedAt), "dd 'de' MMMM 'de' yyyy", { locale: es })
        : "Fecha no disponible";

    // 📌 Función para manejar la redirección
    const handleClick = () => {
        router.push(`/dashboard/projects/${userId}/${id}`);
    };

    return (
        <button
            onClick={handleClick}
            className="w-full bg-primary text-white font-semibold py-2 px-4 rounded-lg 
                        hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-light 
                        shadow-md hover:shadow-lg transition"
        >
            <div className="bg-white text-black shadow-md p-4 rounded-lg hover:shadow-lg transition">
                <h2 className="text-lg font-semibold hover:text-primary">{name}</h2>
                <p className="text-textTwo text-sm">Última actualización: {formattedDate}</p>
            </div>
        </button>
    );
};

export default Project;
