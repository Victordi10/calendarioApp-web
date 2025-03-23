import { useRouter } from "next/navigation";
import { format } from "date-fns";
import es from "date-fns/locale/es";
import { Calendar, TrendingUp, ChevronRight, BarChart4 } from "lucide-react";

const Project = ({ project, userId }) => {
    const { name, updatedAt, id } = project;
    const router = useRouter();

    // Format date with fallback
    const formattedDate = updatedAt
        ? format(new Date(updatedAt), "dd 'de' MMMM 'de' yyyy", { locale: es })
        : "Fecha no disponible";

    // Marketing-themed gradient backgrounds
    const gradients = [
        "from-blue-400 to-indigo-500",
        "from-green-400 to-emerald-500",
        "from-purple-400 to-violet-500",
        "from-orange-400 to-amber-500",
        "from-rose-400 to-pink-500",
        "from-cyan-400 to-sky-500"
    ];

    // Use hash of ID to consistently select the same gradient for each project
    const gradientIndex = Math.abs(id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % gradients.length;
    const gradientClasses = gradients[gradientIndex];

    // Marketing icons rotation
    const icons = [
        <TrendingUp key="trending-up" className="w-5 h-5 text-white" />,
        <BarChart4 key="bar-chart" className="w-5 h-5 text-white" />,
        <Calendar key="calendar" className="w-5 h-5 text-white" />
    ];
    const iconIndex = Math.abs(id.charCodeAt(0)) % icons.length;

    // Navigate to project detail
    const handleClick = () => {
        router.push(`/dashboard/projects/${userId}/${id}`);
    };

    return (
        <div className="h-full transform transition-all duration-300 hover:-translate-y-2">
            <button
                onClick={handleClick}
                className="w-full h-full text-left bg-white rounded-xl overflow-hidden
                 shadow-md hover:shadow-xl transition-all duration-200 border border-gray-100
                 focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
                <div className="flex flex-col h-full">
                    <div className="p-6 flex flex-col h-full">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`bg-gradient-to-r ${gradientClasses} p-3 rounded-lg`}>
                                {icons[iconIndex]}
                            </div>
                            <div className="bg-gray-50 p-2 rounded-full">
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                            </div>
                        </div>

                        <div className="mt-2 flex-grow">
                            <h2 className="text-xl font-bold text-gray-800 line-clamp-2">{name}</h2>

                            <div className="mt-6 flex items-center justify-between">
                                <div className="flex items-center">
                                    <span className="inline-flex w-3 h-3 rounded-full bg-green-400 mr-2"></span>
                                    <span className="text-sm text-gray-500">Activo</span>
                                </div>
                                <p className="text-xs text-gray-500">
                                    {formattedDate}
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-primary">Ver detalles</span>
                                <div className="h-1 w-12 bg-gradient-to-r from-primary to-primary-light rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </button>
        </div>
    );
};

export default Project;