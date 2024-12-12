import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col h-[500px] w-[500px] justify-center items-center bg-white rounded-3xl border border-gray-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <h1 className="text-5xl font-primary">ERROR 404</h1>
      <h2 className="text-4xl font-secondary">NOT FOUND</h2>
      <button
        className="bg-gray-200 px-4 py-2 mt-4 rounded-md active:bg-gray-300"
        onClick={() => navigate(-1)}
      >
        <p className="text-2xl font-tertiary">Voltar</p>
      </button>
    </div>
  );
}
