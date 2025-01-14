import React from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { Course } from "../Dashboard";
import { CardPayment } from "./components/CardPayment";
import { CiCreditCard2 } from "react-icons/ci";
import { useParams } from "react-router";

export default function Payment() {
  const [course, setCourse] = React.useState<Course[]>([]);
  const { title } = useParams();

  const loadCourses = React.useCallback(async () => {
    const docSnap = await getDocs(collection(db, "courses"));
    if (docSnap.docs) {
      const allCourses = docSnap.docs.map((doc) => doc.data()) as Course[];

      const availableCourses = allCourses.filter(
        (course) => course.title === title
      );

      setCourse(availableCourses);
    }
  }, [title]);

  React.useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const value = course.map((item) =>
    item.valueDiscount ? "R$ " + item.valueDiscount : item.value
  );
  const name = course.map((item) => item.title);

  return (
    <div className="flex w-full mx-auto bg-white shadow-md rounded-md overflow-hidden">
      {course.map((item, index) => (
        <div
          key={index}
          className="w-1/3 bg-gray-100 p-8 text-center items-center justify-center relative"
        >
          <h3 className="text-2xl font-primary text-gray-700 mb-4">
            Curso de {item.title}
          </h3>
          <img src={item.thumbnail} alt={item.title} className="h-1/2 w-full" />
          <h1 className="text-3xl font-bold text-gray-900">
            {item.valueDiscount ? "R$ " + item.valueDiscount : item.value}
          </h1>
          <p>{item.desc}</p>
          <p className="text-gray-500 absolute bottom-5">
            <strong>Observação:</strong> o reembolso acontece dentro de 7 dias e
            caso o curso tenha menos de 20% feito, caso contrario, o pagamento
            não será reembolsado
          </p>
        </div>
      ))}

      <div className="flex flex-col items-center justify-center w-2/3">
        <h2 className="font-primary text-3xl mb-5">
          Selecione a forma de pagamento
        </h2>
        <div className="flex items-center justify-center gap-5">
          <div className="w-14 h-14 border-2 border-gray-200 bg-gray-200 rounded-md flex items-center justify-center cursor-pointer">
            <i>
              <CiCreditCard2 size={30} color="#000" />
            </i>
          </div>
        </div>
        <div className="flex items-center justify-center gap-5 w-full">
          <CardPayment
            value={String(value)}
            nameCourse={String(name)}
            setCourse={setCourse} // Passando a função setCourse
          />
        </div>
      </div>
    </div>
  );
}
