import { FaArrowRight } from "react-icons/fa";

export default function NeedHelp() {
  return (
    <div className="container bg-white rounded-md flex flex-col">
      <div className="w-1/4 h-full flex flex-col items-center border-r border-gray-300">
        <h1 className="font-primary text-2xl py-2 border-b border-gray-300 w-full text-center">
          Perguntas frequentes
        </h1>
        <div className="flex flex-col items-center w-full gap-2 py-2 overflow-auto">
          <div className="border-y border-gray-300 w-full flex items-center justify-between px-2 py-6 cursor-pointer">
            <h1>Titulo da pergunta</h1>
            <FaArrowRight size={20} />
          </div>

          <div className="border-y border-gray-300 w-full flex items-center justify-between px-2 py-6 cursor-pointer">
            <h1>Titulo da pergunta</h1>
            <FaArrowRight size={20} />
          </div>
          
          <div className="border-y border-gray-300 w-full flex items-center justify-between px-2 py-6 cursor-pointer">
            <h1>Titulo da pergunta</h1>
            <FaArrowRight size={20} />
          </div>

          <div className="border-y border-gray-300 w-full flex items-center justify-between px-2 py-6 cursor-pointer">
            <h1>Titulo da pergunta</h1>
            <FaArrowRight size={20} />
          </div>

          <div className="border-y border-gray-300 w-full flex items-center justify-between px-2 py-6 cursor-pointer">
            <h1>Titulo da pergunta</h1>
            <FaArrowRight size={20} />
          </div>
        </div>
      </div>
    </div>
  );
}
