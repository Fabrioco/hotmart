import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { CourseCard } from "./components/CourseCard";
import { db } from "../../services/firebaseConnection";
import { useUser } from "../../contexts/userDataContext";
import React from "react";
import { Course } from "../Dashboard";

export default function MyCourses() {
  const { user } = useUser();
  const [myCourses, setMyCourses] = React.useState<Course[]>([]);

  const fetchCourses = async () => {
    if (!user?.uid) return;

    try {
      const userDocRef = doc(db, "users", `${user.uid}`);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userCourses = userDocSnap.data().courses;

        const coursesCollectionRef = collection(db, "courses");
        const coursesSnapshot = await getDocs(coursesCollectionRef);

        const courses = coursesSnapshot.docs.map((doc) => ({
          title: doc.id,
          ...doc.data(),
        })) as Course[];

        const filteredCourses = courses.filter((course) =>
          userCourses.includes(course.title)
        );

        setMyCourses(filteredCourses);
      } else {
        console.warn("Usuário não encontrado.");
      }
    } catch (error) {
      console.error("Erro ao buscar cursos:", error);
    }
  };

  React.useEffect(() => {
    fetchCourses();
  });

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
        {myCourses.map((course) => (
          <CourseCard key={course.title} course={course} />
        ))}
      </div>
    </div>
  );
}
