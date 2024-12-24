import React from "react";
import { db } from "../../../services/firebaseConnection";
import {
  collection,
  deleteField,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { useNotification } from "../../../contexts/notificationContext";
import { Course } from "../../Dashboard";

export const Discount = () => {
  const [title, setTitle] = React.useState<string>("");
  const [value, setValue] = React.useState<string>("");
  const [valueDiscout, setValueDiscount] = React.useState<string>("");
  const [courses, setCourses] = React.useState<Course[]>([]);

  const { showNotification } = useNotification();

  const handleChangeValueDiscount = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let inputValue = e.target.value;

    inputValue = inputValue.replace(/[^0-9,]/g, "").replace(",", ".");

    if (inputValue) {
      setValueDiscount("R$ " + parseFloat(inputValue));
    } else {
      setValueDiscount("");
    }
  };

  const loadCourses = async () => {
    await getDocs(collection(db, "courses")).then((snapshot) => {
      const courses = snapshot.docs.map((doc) => doc.data()) as Course[];
      setCourses(courses);
    });
  };

  React.useEffect(() => {
    loadCourses();
  }, []);

  React.useEffect(() => {
    if (!title) {
      setValue("");
    }
  }, [title]);

  React.useEffect(() => {
    const fetchCourse = async () => {
      if (!title) return;
      const docRef = doc(db, "courses", title);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setValue(docSnap.data().value);
        setValueDiscount(docSnap.data().valueDiscount);
      }
    };
    fetchCourse();
  }, [title]);

  const handleApplyDiscount = async () => {
    if (!title || !value) {
      showNotification("Preencha todos os campos", "error");
      return;
    }
    await updateDoc(doc(db, "courses", title), {
      valueDiscount: value,
    })
      .then(() => {
        showNotification("Desconto aplicado com sucesso", "success");
      })
      .catch(() => {
        showNotification("Erro ao aplicar desconto", "error");
      });
  };

  const handleRemoveDiscount = async () => {
    if (!title) {
      showNotification("Selecione um curso", "error");
      return;
    }
    await updateDoc(doc(db, "courses", title), {
      valueDiscount: deleteField(),
    })
      .then(() => {
        showNotification("Desconto removido com sucesso", "success");
        setTitle("");
      })
      .catch(() => {
        showNotification("Erro ao remover desconto", "error");
      });
  };

  return (
    <div className="w-6/12 h-auto rounded-md p-5 shadow-md bg-white">
      <h1 className="font-primary text-3xl text-center mb-5">
        Aplicar/Remover desconto
      </h1>
      <div className="w-full h-auto flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <select
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          >
            <option value="">Selecione um curso</option>
            {courses.map((course) => (
              <option value={course.title} key={course.title}>
                {course.title}
              </option>
            ))}
          </select>
        </div>
        <input
          type="text"
          value={value}
          placeholder="Original"
          disabled
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <input
          type="text"
          value={valueDiscout}
          placeholder="Desconto"
          onChange={handleChangeValueDiscount}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
      </div>
      <div className="flex gap-2">
        <button
          className="w-1/2 px-4 py-2 bg-gray-500 font-tertiary text-xl rounded hover:bg-gray-600 text-white mt-4"
          onClick={handleApplyDiscount}
        >
          Aplicar
        </button>
        <button
          className="w-1/2 px-4 py-2 bg-red-500 font-tertiary text-xl rounded hover:bg-red-600 text-white mt-4"
          onClick={handleRemoveDiscount}
        >
          Remover
        </button>
      </div>
    </div>
  );
};
