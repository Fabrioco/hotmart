import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import React from "react";
import { db } from "../../../services/firebaseConnection";
import { useNotification } from "../../../contexts/notificationContext";

type Course = {
  title: string;
  desc: string;
  value: string;
  link: string;
};

export const SettingsCourse = () => {
  const [courses, setCourses] = React.useState<string[]>([]);
  const [selectedCourse, setSelectedCourse] = React.useState<string>("");
  const [courseDetails, setCourseDetails] = React.useState<Course | null>(null);

  const { showNotification } = useNotification();

  const loadCourses = React.useCallback(async () => {
    try {
      const snapshot = await getDocs(collection(db, "courses"));
      const courseTitles = snapshot.docs.map((doc) => doc.data().title);
      setCourses(courseTitles);
    } catch (error) {
      console.error("Erro ao carregar cursos:", error);
    }
  }, []);

  const loadCourseDetails = React.useCallback(async () => {
    if (!selectedCourse) {
      setCourseDetails(null);
      return;
    }

    try {
      const docRef = doc(db, "courses", selectedCourse);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as Course;
        setCourseDetails(data);
      }
    } catch (error) {
      console.error("Erro ao carregar detalhes do curso:", error);
    }
  }, [selectedCourse]);

  // Exclui o curso selecionado
  const handleDelete = async () => {
    if (!selectedCourse) return;

    try {
      const docRef = doc(db, "courses", selectedCourse);
      await deleteDoc(docRef);
      showNotification("Curso excluído com sucesso", "success");
      setSelectedCourse("");
      setCourseDetails(null);
      loadCourses();
    } catch (error) {
      console.error("Erro ao excluir curso:", error);
    }
  };

  React.useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  React.useEffect(() => {
    loadCourseDetails();
  }, [selectedCourse, loadCourseDetails]);

  return (
    <div className="w-6/12 h-auto rounded-md p-5 shadow-md bg-white">
      <h1 className="font-primary text-3xl text-center mb-5">
        Gerenciar Curso
      </h1>
      <div className="w-full flex flex-col gap-5">
        <select
          id="selectCourse"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          <option value="">Selecione o curso</option>
          {courses.map((course) => (
            <option key={course} value={course}>
              {course}
            </option>
          ))}
        </select>

        {courseDetails ? (
          <>
            <input
              type="text"
              placeholder="Título"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={courseDetails.title}
              disabled
            />
            <input
              type="text"
              placeholder="Valor"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={courseDetails.value}
              disabled
            />
            <input
              type="text"
              placeholder="Link"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={courseDetails.link}
              disabled
            />
            <textarea
              placeholder="Descrição"
              className="w-full p-2 border border-gray-300 rounded-md resize-none"
              value={courseDetails.desc}
              disabled
            />
          </>
        ) : (
          <p className="text-center text-gray-500">Nenhum curso selecionado.</p>
        )}
      </div>

      <button
        className={`w-full px-4 py-2 font-tertiary text-xl rounded text-white mt-4 ${
          selectedCourse
            ? "bg-red-500 hover:bg-red-600"
            : "bg-gray-300 cursor-not-allowed"
        }`}
        onClick={handleDelete}
        disabled={!selectedCourse}
      >
        Excluir
      </button>
    </div>
  );
};
