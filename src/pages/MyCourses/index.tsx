import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { CourseCard } from "./components/CourseCard";
import { db } from "../../services/firebaseConnection";
import React from "react";
import { Course } from "../Dashboard";
import { useUser } from "../../hooks/useUser";

export default function MyCourses() {
  const { user } = useUser();

  const [myCourses, setMyCourses] = React.useState<Course[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selected, setSelected] = React.useState<string>("Todos Cursos");

  const fetchCourses = React.useCallback(async () => {
    try {
      const userDocRef = doc(db, "users", `${user?.uid}`);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const rawCourses: string[] = userDocSnap.data().courses || [];

        const formattedCourses = rawCourses.map((course) => {
          const [title, paiedValue, paiedDate] = course.split(", ");
          return { title, paiedValue, paiedDate };
        });

        const coursesCollectionRef = collection(db, "courses");
        const coursesSnapshot = await getDocs(coursesCollectionRef);

        const allCourses = coursesSnapshot.docs.map((doc) => ({
          title: doc.id,
          ...doc.data(),
        })) as Course[];

        const filteredCourses = allCourses.filter((course) =>
          formattedCourses.some((formatted) => formatted.title === course.title)
        );

        setMyCourses(filteredCourses);
      }
    } catch (err) {
      console.error("Erro ao buscar cursos:", err);
      setError("Erro ao buscar cursos. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  React.useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const selectNav = (selected: string) => {
    switch (selected) {
      case "Todos Cursos":
        setSelected("Todos Cursos");
        break;
      case "Favoritos":
        setSelected("Favoritos");
        break;
      case "Concluídos":
        setSelected("Concluídos");
        break;
      default:
        break;
    }
  };

  if (loading) {
    return <div className="text-center text-white">Carregando...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="w-full h-full flex flex-col justify-around">
      <div className="w-full h-52 flex flex-col justify-around bg-[#282828] rounded-md">
        <h1 className="text-4xl font-primary text-white w-9/12 mx-auto">
          Meus cursos
        </h1>
        <div className="flex w-full justify-around text-white text-2xl font-tertiary">
          {["Todos Cursos", "Favoritos", "Concluídos"].map((item, index) => (
            <button
              key={index}
              className={
                selected === item
                  ? "border-b-2 border-white"
                  : "border-b-2 border-transparent"
              }
              onClick={() => selectNav(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="w-full h-full flex gap-5 flex-wrap mx-auto justify-center overflow-y-auto bg-white py-10 rounded-b-md">
        {myCourses.length > 0 ? (
          myCourses.map((course) => (
            <CourseCard key={course.title} course={course} />
          ))
        ) : (
          <div className="text-center text-gray-500">
            Nenhum curso encontrado.
          </div>
        )}
      </div>
    </div>
  );
}
