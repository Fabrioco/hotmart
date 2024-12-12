import { CourseCard } from "./components/CourseCard";

export default function MyCourses() {
  return (
    <div className="w-full h-full flex flex-col justify-around">
      <div className="w-full h-52 flex flex-col justify-around bg-[#282828] rounded-md">
        <h1 className="text-4xl font-primary text-white w-9/12 mx-auto">
          Meus cursos
        </h1>
        <div className="flex w-full justify-around text-white text-2xl font-tertiary">
          <button className="underline">Todos Cursos</button>
          <button>Favoritos</button>
          <button>Concluídos</button>
        </div>
      </div>
      <div className="w-full h-full flex gap-5 flex-wrap mx-auto justify-center overflow-y-auto bg-white py-10 rounded-b-md">
        <CourseCard />
      </div>
    </div>
  );
}
