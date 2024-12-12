import { FaRegStar, FaStar } from "react-icons/fa";

export const Course = () => {
  return (
    <div className="border-y border-gray-100 w-full h-32 px-2 py-1 flex flex-row items-center justify-around">
      <img
        src="https://via.placeholder.com./150"
        alt="Foto de curso"
        className="h-full w-auto rounded-md"
      />
      <div className="flex flex-col">
        <div className="flex flex-col font-secondary">
          <p className="text-xl">O nome do curso</p>
          <p className="text-lg text-gray-500">Quem o fez</p>
        </div>
        <div className="flex">
          <FaStar color="#ffcb0c" size={20} />
          <FaStar color="#ffcb0c" size={20} />
          <FaStar color="#ffcb0c" size={20} />
          <FaStar color="#ffcb0c" size={20} />
          <FaRegStar color="#ffcb0c" size={20} />
        </div>
      </div>
      <div className="font-secondary text-xl">
        <p>
          Valor pago: <strong>R$29,99</strong>
        </p>
      </div>
      <div>
        <button className="px-4 py-2 bg-gray-300 font-tertiary text-xl rounded active:bg-gray-400">
          Reembolsar
        </button>
        <p className="text-xs text-gray-400">Reembolso até: 21/10/2025</p>
      </div>
      {/* <button
        className="px-4 py-2 bg-gray-200 font-tertiary text-xl rounded cursor-not-allowed text-gray-400"
      >
        Reembolsar
      </button> */}
    </div>
  );
};
