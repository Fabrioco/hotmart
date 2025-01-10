import React from "react";
import ReactPlayer from "react-player";
import "./videoPlayerStyles.css";
import { Course } from "../../Dashboard";
import { useParams } from "react-router";
import { db } from "../../../services/firebaseConnection";
import { doc, getDoc } from "firebase/firestore";

export const VideoPlayer = () => {
  const [courseData, setCourseData] = React.useState<Course | null>(null);
  const { course } = useParams();

  React.useEffect(() => {
    const fetchVideo = async () => {
      try {
        if (!course) {
          console.error("Curso não especificado.");
          return;
        }

        const docRef = doc(db, "courses", course);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setCourseData(docSnap.data() as Course);
        } else {
          console.warn("Nenhum curso encontrado para o ID especificado.");
        }
      } catch (error) {
        console.error("Erro ao buscar dados do curso:", error);
      }
    };

    fetchVideo();
  }, [course]);

  if (!courseData) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <p>Carregando informações do curso...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col overflow-y-auto font-secondary">
      <div className="relative w-full h-auto">
        <ReactPlayer
          url={courseData.link}
          height="700px"
          width="100%"
          onEnded={() => alert("O vídeo terminou")}
          controls={true}
        />
      </div>

      <div className="w-full h-auto flex flex-col">
        <h1 className="font-primary text-3xl p-2 text-center border-b border-gray-400">
          Visão Geral
        </h1>
        <div className="text-2xl mt-2 p-2">
          <h1 className="text-2xl">{courseData.title}</h1>
          <h2 className="text-xl text-gray-600 cursor-pointer">
            Fabrício Oliveira Lopes
          </h2>
        </div>
        <div className="mt-4 p-2">
          <p className="text-xl uppercase">Sobre o curso</p>
          <p className="mt-1 w-10/12">{courseData.desc}</p>
        </div>
      </div>
    </div>
  );
};
