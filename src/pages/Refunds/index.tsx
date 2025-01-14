import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { CourseInfo } from "./components/Course";
import React from "react";
import { useUser } from "../../hooks/useUser";

export default function Refunds() {
  const { user } = useUser();

  const [courses, setCourses] = React.useState<
    {
      title: string;
      paiedValue: string;
      paiedDate: string;
    }[]
  >([]);

  const fetchData = async () => {
    try {
      const docRef = doc(db, "users", `${user?.uid}`);
      const unsubscribe = onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
          const rawCourses = doc.data().courses || [];
          const formattedCourses = rawCourses.map((course: string) => {
            const [title, paiedValue, paiedDate] = course.split(", ");
            return { title, paiedValue, paiedDate };
          });
          setCourses(formattedCourses);
        }
        return () => unsubscribe();
      });
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const rawCourses = docSnap.data().courses || [];
        const formattedCourses = rawCourses.map((course: string) => {
          const [title, paiedValue, paiedDate] = course.split(", ");
          return { title, paiedValue, paiedDate };
        });
        setCourses(formattedCourses);
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, [user]);

  return (
    <div className="flex flex-col bg-white rounded-2xl w-full h-full p-2 items-center">
      <h1 className="text-3xl font-primary">Reembolsos</h1>
      <p className="font-secondary text-gray-500 text-justify">
        Os reembolsos são permitidos durante um prazo de 7 dias e tenha feito
        menos de 20% do curso.
      </p>
      <p className="font-secondary text-gray-500 text-justify">
        <strong>Observação:</strong> Se você já fez o reembolso do curso, ele
        não pode ser reembolsado novamente.
      </p>
      <div className="w-11/12 h-full border-y border-gray-200 mt-5 p-2 overflow-y-auto gap-2">
        {courses.map((courseData, index) => (
          <CourseInfo
            key={index}
            title={courseData.title}
            paiedValue={courseData.paiedValue}
            paiedDate={courseData.paiedDate}
          />
        ))}
      </div>
    </div>
  );
}
