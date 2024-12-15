import { doc, setDoc } from "firebase/firestore";
import React from "react";
import { db } from "../../../services/firebaseConnection";
import { useNotification } from "../../../contexts/notificationContext";

export const SendNotification = () => {
  const [title, setTitle] = React.useState<string>("");
  const [description, setDescription] = React.useState<string>("");

  const { showNotification } = useNotification();

  const sendNotification = async () => {
    try {
      await setDoc(doc(db, "notifications", title), {
        title,
        description,
        hour: new Date().toLocaleTimeString("pt-BR"),
        date: new Date().toLocaleDateString("pt-BR"),
      });
      showNotification("Notificação enviada com sucesso", "success");
    } catch (error) {
      console.log(error);
    } finally {
      setTitle("");
      setDescription("");
    }
  };

  return (
    <div className="w-5/12 h-auto rounded-md p-5 shadow-md bg-white">
      <h1 className="font-primary text-3xl text-center mb-5">
        Mandar notificação
      </h1>
      <div className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Titulo"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <textarea
          placeholder="Mensagem"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 resize-none"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
        />
      </div>
      <button
        className="bg-gray-500 px-4 py-2 mt-4 rounded-md hover:bg-gray-600 text-white"
        onClick={sendNotification}
      >
        Enviar
      </button>
    </div>
  );
};
