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
  const [title, setTitle] = React.useState<string>("");
  const [description, setDescription] = React.useState<string>("");
  const [value, setValue] = React.useState<string>("");
  const [link, setLink] = React.useState<string>("");
  const [selectedCourse, setSelectedCourse] = React.useState<string>("");

  const { showNotification } = useNotification();

  const loadCourses = async () => {
    await getDocs(collection(db, "courses")).then((snapshot) => {
      setCourses(snapshot.docs.map((doc) => doc.data().title));
    });
  };

  React.useEffect(() => {
    loadCourses();
  }, []);

  React.useEffect(() => {
    loadData();
  }, [selectedCourse]);

  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;

    inputValue = inputValue.replace(/[^0-9,]/g, "").replace(",", ".");

    if (inputValue) {
      setValue("R$ " + parseFloat(inputValue));
    } else {
      setValue("");
    }
  };

  const loadData = async () => {
    if (!selectedCourse) {
      setTitle("");
      setDescription("");
      setValue("");
      setLink("");
    }

    try {
      if (!selectedCourse) return;
      const docRef = doc(db, "courses", selectedCourse);

      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data: Course = {
          title: docSnap.data().title,
          desc: docSnap.data().desc,
          value: docSnap.data().value,
          link: docSnap.data().link,
        };
        setTitle(data.title);
        setDescription(data.desc);
        setValue(data.value);
        setLink(data.link);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    if (!selectedCourse) return;
    try {
      const docRef = doc(db, "courses", selectedCourse);
      await deleteDoc(docRef);
      showNotification("Curso excluído com sucesso", "success");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-6/12 h-auto rounded-md p-5 shadow-md bg-white">
      <h1 className="font-primary text-3xl text-center mb-5">Excluir curso</h1>
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
        <input
          type="text"
          placeholder="Título"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled
        />
        <input
          type="text"
          placeholder="Valor"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          onChange={handleChangeValue}
          value={value}
          disabled
        />
        <input
          type="text"
          placeholder="Link"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          disabled
        />
        <textarea
          placeholder="Descrição"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 resize-none"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled
        />
        <input
          type="file"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          disabled
        />
      </div>
      <div className="flex gap-5 w-full">
        <button
          className="w-full px-4 py-2 bg-red-500 font-tertiary text-xl rounded hover:bg-red-600 text-white mt-4"
          onClick={handleDelete}
        >
          Excluir
        </button>
      </div>
    </div>
  );
};
