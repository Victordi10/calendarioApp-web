import Loader from "./loader";
export default function Boton({ children, onClick, loading = false, estilos }) {
    return (
        <button
            onClick={onClick}
            disabled={loading}
            className={`
            relative inline-flex items-center justify-center 
            px-6 py-3 
            text-sm font-medium 
            rounded-md 
            transition-all duration-200 
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary 
            ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}
            bg-fondo hover:bg-primary/90 
            text-text 
            border border-transparent 
            shadow-sm 
            disabled:opacity-75
            ${estilos}
      `}
        >
            {loading ? (
                <Loader loading={loading}/>
            ) : (
                children
            )}
        </button>
    );
}