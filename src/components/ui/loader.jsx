import { ClipLoader } from "react-spinners";

const Loader = ({ loading, size = 30, color = '#fff' }) => {
    return (
        <div className="flex justify-center items-center">
            <ClipLoader color={color} loading={loading} size={size} />
        </div>
    );
};

export default Loader;
