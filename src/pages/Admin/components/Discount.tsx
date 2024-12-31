import React from "react";
import { db } from "../../../services/firebaseConnection";
import {
  collection,
  deleteField,
  doc,
  getDocs,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useNotification } from "../../../contexts/notificationContext";
import { Course } from "../../Dashboard";

export const Discount = () => {
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = React.useState<Course | null>(
    null
  );
  const [loading, setLoading] = React.useState(false);

  const { showNotification } = useNotification();

  const loadCourses = React.useCallback(async () => {
    try {
      const snapshot = await getDocs(collection(db, "courses"));
      const courseList = snapshot.docs.map((doc) => doc.data()) as Course[];
      setCourses(courseList);
    } catch (error) {
      showNotification("Erro ao carregar os cursos", "error");
      console.error(error);
    }
  }, [showNotification]);

  const handleSelectCourse = async (title: string) => {
    if (!title) {
      setSelectedCourse(null);
      return;
    }
    setLoading(true);
    try {
      const docSnap = await getDoc(doc(db, "courses", title));
      if (docSnap.exists()) {
        setSelectedCourse(docSnap.data() as Course);
      }
    } catch (error) {
      showNotification("Erro ao carregar o curso", "error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyDiscount = async () => {
    if (!selectedCourse) {
      showNotification("Selecione um curso", "error");
      return;
    }

    setLoading(true);
    try {
      await updateDoc(doc(db, "courses", selectedCourse.title), {
        valueDiscount: selectedCourse.valueDiscount || "",
      });
      showNotification("Desconto aplicado com sucesso", "success");
    } catch {
      showNotification("Erro ao aplicar desconto", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveDiscount = async () => {
    if (!selectedCourse) {
      showNotification("Selecione um curso", "error");
      return;
    }

    setLoading(true);
    try {
      await updateDoc(doc(db, "courses", selectedCourse.title), {
        valueDiscount: deleteField(),
      });
      showNotification("Desconto removido com sucesso", "success");
      setSelectedCourse(null);
    } catch {
      showNotification("Erro ao remover desconto", "error");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  return (
    <div className="w-6/12 h-auto rounded-md p-5 shadow-md bg-white">
      <h1 className="font-primary text-3xl text-center mb-5">
        Aplicar/Remover desconto
      </h1>
      <div className="w-full h-auto flex flex-col gap-2">
        <select
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          value={selectedCourse?.title || ""}
          onChange={(e) => handleSelectCourse(e.target.value)}
        >
          <option value="">Selecione um curso</option>
          {courses.map((course) => (
            <option value={course.title} key={course.title}>
              {course.title}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={selectedCourse?.value || ""}
          placeholder="Original"
          disabled
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <input
          type="text"
          value={selectedCourse?.valueDiscount || ""}
          placeholder="Desconto"
          onChange={(e) =>
            setSelectedCourse((prev) =>
              prev ? { ...prev, valueDiscount: e.target.value } : null
            )
          }
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
      </div>
      <div className="flex gap-2">
        <button
          className={`w-1/2 px-4 py-2 font-tertiary text-xl rounded mt-4 text-white ${
            loading ? "bg-gray-400" : "bg-gray-500 hover:bg-gray-600"
          }`}
          onClick={handleApplyDiscount}
          disabled={loading}
        >
          {loading ? "Carregando..." : "Aplicar"}
        </button>
        <button
          className={`w-1/2 px-4 py-2 font-tertiary text-xl rounded mt-4 text-white ${
            loading ? "bg-red-400" : "bg-red-500 hover:bg-red-600"
          }`}
          onClick={handleRemoveDiscount}
          disabled={loading}
        >
          {loading ? "Carregando..." : "Remover"}
        </button>
      </div>
    </div>
  );
};
