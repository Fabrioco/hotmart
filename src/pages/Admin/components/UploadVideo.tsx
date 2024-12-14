import React from "react";
import { useNotification } from "../../../contexts/notificationContext";
import imageCompression from "browser-image-compression";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../services/firebaseConnection";

export const UploadVideo = () => {
  const [title, setTitle] = React.useState<string>("");
  const [value, setValue] = React.useState<string>("");
  const [link, setLink] = React.useState<string>("");
  const [desc, setDesc] = React.useState<string>("");
  const [file, setFile] = React.useState<File | null>(null);
  const [isUploading, setIsUploading] = React.useState<boolean>(false);

  const { showNotification } = useNotification();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleButtonClick = async () => {
    if (!file) {
      showNotification("Selecione uma imagem", "error");
      return;
    }

    try {
      if (!validateFields()) {
        showNotification("Preencha todos os campos antes de enviar", "error");
        return;
      }

      setIsUploading(true);

      const base64String = await compressAndConvertToBase64(file);

      const docRef = doc(db, "courses", title);
      await setDoc(docRef, {
        title,
        value,
        link,
        desc,
        thumbnail: base64String,
      });

      showNotification("Curso postado com sucesso", "success");

      resetForm();
    } catch (error) {
      console.error("Erro ao enviar a imagem:", error);
      showNotification("Erro ao enviar o curso", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const validateFields = () => {
    return title.trim() !== "" && link.trim() !== "" && desc.trim() !== "";
  };

  const compressAndConvertToBase64 = async (file: File) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    const compressedFile = await imageCompression(file, options);

    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onload = () => {
        if (reader.result) {
          resolve(reader.result.toString());
        } else {
          reject("Erro ao converter a imagem para Base64");
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const resetForm = () => {
    setTitle("");
    setLink("");
    setDesc("");
    setFile(null);
  };

  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;

    inputValue = inputValue.replace(/[^0-9,]/g, "").replace(",", ".");

    if (inputValue) {
      setValue("R$ " + parseFloat(inputValue));
    } else {
      setValue("");
    }
  };

  return (
    <div className="bg-white w-6/12 h-auto rounded-md p-5 shadow-md">
      <h1 className="font-primary text-3xl text-center mb-5">
        Postar novo curso
      </h1>
      <div className="w-full flex flex-col gap-4">
        <input
          type="text"
          placeholder="Digite o nome do curso"
          id="nomeCurso"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          disabled={isUploading}
        />
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          placeholder="Digite o valor do curso"
          id="valorCurso"
          onChange={handleChangeValue}
          value={value}
          disabled={isUploading}
        />
        <input
          type="text"
          placeholder="Digite o link do curso"
          id="linkCurso"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          onChange={(e) => setLink(e.target.value)}
          value={link}
          disabled={isUploading}
        />
        <textarea
          placeholder="Digite a descrição do curso"
          id="descCurso"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 resize-none"
          rows={4}
          onChange={(e) => setDesc(e.target.value)}
          value={desc}
          disabled={isUploading}
        />
        <input
          type="file"
          accept="image/*"
          id="thumbCurso"
          className="w-full p-2 border border-gray-300 rounded-md"
          onChange={handleImageUpload}
          disabled={isUploading}
        />
        <button
          onClick={handleButtonClick}
          className={`w-full py-2 px-4 rounded-md text-white transition-all ${
            isUploading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-gray-500 hover:bg-gray-600"
          }`}
          disabled={isUploading}
        >
          {isUploading ? "Enviando..." : "Postar"}
        </button>
      </div>
    </div>
  );
};
