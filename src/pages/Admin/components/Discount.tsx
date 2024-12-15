import React from "react";
import { db } from "../../../services/firebaseConnection";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { useNotification } from "../../../contexts/notificationContext";

export const Discount = () => {
  const [title, setTitle] = React.useState<string>("");
  const [value, setValue] = React.useState<string>("");
  const [courses, setCourses] = React.useState<string[]>([]);

  const { showNotification } = useNotification();

  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;

    inputValue = inputValue.replace(/[^0-9,]/g, "").replace(",", ".");

    if (inputValue) {
      setValue("R$ " + parseFloat(inputValue));
    } else {
      setValue("");
    }
  };

  const loadCourses = async () => {
    await getDocs(collection(db, "courses")).then((snapshot) => {
      setCourses(snapshot.docs.map((doc) => doc.data().title));
    });
  };

  React.useEffect(() => {
    loadCourses();
  }, []);

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

  return (
    <div className="w-6/12 h-auto rounded-md p-5 shadow-md bg-white">
      <h1 className="font-primary text-3xl text-center mb-5">
        Aplicar desconto
      </h1>
      <div className="w-full h-auto flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <select
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          >
            <option value="">Selecione um curso</option>
            {courses.map((title) => (
              <option value={title} key={title}>
                {title}
              </option>
            ))}
          </select>
        </div>
        <input
          type="text"
          value={value}
          onChange={handleChangeValue}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
      </div>
      <button
        className="w-full px-4 py-2 bg-gray-500 font-tertiary text-xl rounded hover:bg-gray-600 text-white mt-4"
        onClick={handleApplyDiscount}
      >
        Aplicar
      </button>
    </div>
  );
};
