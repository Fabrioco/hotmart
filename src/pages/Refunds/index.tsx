import { Course } from "./components/Course";

export default function Refunds() {
  return (
    <div className="flex flex-col bg-white rounded-2xl w-full h-full p-2 items-center">
      <h1 className="text-3xl font-primary">Reembolsos</h1>
      <p className="font-secondary text-gray-500 text-justify">
        Os reembolsos são permitidos durante um prazo de 7 dias e tenha feito
        menos de 20% do curso.
      </p>
      <div className="w-11/12 h-full border-y border-gray-200 mt-5 p-2 overflow-y-auto gap-2">
        <Course />
        <Course />
        <Course />
        <Course />
        <Course />
        <Course />
        <Course />
        <Course />
        <Course />
        <Course />
      </div>
    </div>
  );
}
