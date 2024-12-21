import React from "react";
import ReactPlayer from "react-player";
import "./videoPlayerStyles.css";
import { Course } from "../../Dashboard";
import { useParams } from "react-router";
import { db } from "../../../services/firebaseConnection";
import { doc, getDoc } from "firebase/firestore";

export const VideoPlayer = () => {
  const [courseData, setCourseData] = React.useState<Course[]>([]);

  const { course } = useParams();

  React.useEffect(() => {
    const fetchVideo = async () => {
      try {
        const docSnap = await getDoc(doc(db, "courses", course as string));

        if (docSnap.exists()) {
          setCourseData([docSnap.data() as Course]);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchVideo();
  }, []);

  return (
    <div className="w-full h-full flex flex-col overflow-y-auto font-secondary">
      <div className="relative w-full h-auto">
        <ReactPlayer
          url={courseData[0]?.link}
          height="700px"
          width="100%"
          onEnded={() => alert("O vídeo terminou")}
          config={{
            youtube: {
              playerVars: {
                autoplay: 0,
                controls: 1,
                modestbranding: 1,
                rel: 0,
                showinfo: 0,
                fs: 1,
                iv_load_policy: 3,
              },
            },
          }}
        />
      </div>

      <div className="w-full h-auto flex flex-col">
        <h1 className="font-primary text-3xl p-2 text-center border-b border-gray-400">
          Visão Geral
        </h1>
        <div className="text-2xl mt-2 p-2">
          <h1 className="text-2xl">{courseData[0]?.title}</h1>
          <h2 className="text-xl text-gray-600 cursor-pointer">
            Fabrício Oliveira Lopes
          </h2>
        </div>
        <div className="mt-4 p-2">
          <p className="text-xl uppercase">Sobre o curso</p>
          <p className="mt-1 w-10/12">{courseData[0]?.desc}</p>
        </div>
      </div>
    </div>
  );
};
