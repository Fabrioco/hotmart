import React from "react";
import { BiBookAlt } from "react-icons/bi";
import { FaArrowAltCircleUp, FaBell } from "react-icons/fa";
import { BsGraphUpArrow } from "react-icons/bs";
import { Graphics } from "./components/Graphics";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../services/firebaseConnection";
import { Course } from "../..";
import { useNavigate } from "react-router";
import { useUser } from "../../../../hooks/useUser";
import { compressAndConvertToBase64 } from "../../../../hooks/compressAndConvertToBase64";

type SidebarUserProps = {
  isOpenSidebarUser: boolean;
  setIsOpenSidebarUser: React.Dispatch<React.SetStateAction<boolean>>;
};

export const SidebarUser: React.FC<SidebarUserProps> = ({
  isOpenSidebarUser,
  setIsOpenSidebarUser,
}) => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  const [profilePhoto, setProfilePhoto] = React.useState<string>("");
  const [course, setCourse] = React.useState<Course[] | null>(null);

  React.useEffect(() => {
    if (user?.profilePhoto) {
      setProfilePhoto(user.profilePhoto);
    }
  }, [user]);

  const today = new Date();
  const day = today.toLocaleDateString("pt-BR", { day: "2-digit" });
  const month = today
    .toLocaleDateString("pt-BR", { month: "long" })
    .replace(/^\w/, (c) => c.toUpperCase());
  const year = today.toLocaleDateString("pt-BR", { year: "numeric" });
  const weekday = today
    .toLocaleDateString("pt-BR", { weekday: "long" })
    .replace(/^\w/, (c) => c.toUpperCase());

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      try {
        const base64Image = await compressAndConvertToBase64(selectedFile);
        setProfilePhoto(base64Image);
        if (!user?.uid) return;
        await updateDoc(doc(db, "users", user?.uid), {
          profilePhoto: base64Image,
        });
        setUser({ ...user, profilePhoto: base64Image });
      } catch (error) {
        console.error("Erro ao carregar a imagem:", error);
      }
    }
  };

  const fetchVideo = React.useCallback(async () => {
    if (!user?.lastAccess) return;
    try {
      const docSnap = await getDoc(doc(db, "courses", `${user?.lastAccess}`));
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCourse([data as Course]);
      }
    } catch (error) {
      console.log(error);
    }
  }, [user?.lastAccess]);

  React.useEffect(() => {
    fetchVideo();
  }, [fetchVideo]);

  return (
    <div
      className={`${
        isOpenSidebarUser ? "w-[500px] p-5 border-l" : "w-0 p-0 border-0"
      } h-full bg-white border-gray-400 transition-all  ml-4`}
    >
      <div
        className={` ${
          isOpenSidebarUser ? "block" : " hidden"
        } flex flex-col justify-between h-full`}
      >
        <div className={`flex justify-between`}>
          <div
            className="flex flex-col gap-2 mt-5 ml-5 relative cursor-pointer w-5 h-5"
            onClick={() => setIsOpenSidebarUser(!isOpenSidebarUser)}
          >
            <span className="w-full h-[2px] rotate-45 bg-black absolute"></span>
            <span className="w-full h-[2px] -rotate-45 bg-black absolute"></span>
          </div>
          <div className="flex justify-around gap-1 items-center w-1/2">
            <i className="cursor-pointer">
              <FaBell size={30} color="#a1a1a1" />
            </i>
            <div className="cursor-pointer relative group">
              <img
                src={profilePhoto}
                alt="foto de perfil"
                className="rounded-full w-16 h-16 cursor-pointer"
              />
              <div className="group w-full h-full absolute top-0 left-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <input
                  type="file"
                  id="fileUpload"
                  className="hidden"
                  onChange={handleImageUpload}
                  accept="image/*"
                />
                <label
                  htmlFor="fileUpload"
                  className="w-full h-full cursor-pointer group-hover:bg-black group-hover:bg-opacity-50 rounded-full flex items-center justify-center"
                >
                  <FaArrowAltCircleUp size={30} color="#f2f2f2" />
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col">
            <p className="font-primary text-3xl">
              {"Olá, " + user?.name.split(" ")[0]}
            </p>
            <p className="font-secondary text-2xl">{weekday}</p>
            <p className="font-secondary text-xl text-gray-400">
              {day} de {month} de {year}
            </p>
          </div>
        </div>
        <div className="w-full">
          <h1 className="text-2xl">Ultima Aula</h1>
          {course ? (
            course?.map((item) => (
              <div
                className="border border-gray-400 w-full h-20 rounded-md flex flex-row justify-around items-center cursor-pointer"
                key={item.title}
                onClick={() => navigate(`/course/${item.title}`)}
              >
                <div className="bg-black w-12 h-12 rounded-full flex items-center justify-center">
                  <i>
                    <BiBookAlt size={30} color="#fff" />
                  </i>
                </div>
                <div>
                  <p className="text-xl font-secondary">{item.title}</p>
                </div>
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-16 h-16 rounded-md"
                />
              </div>
            ))
          ) : (
            <p>Você ainda não fez nenhum curso</p>
          )}
          <h2 className="text-xl mt-4">Informações Gerais</h2>
          <div className="border border-gray-400 w-full h-20 rounded-md flex flex-row justify-around items-center">
            <div className="bg-gray-300 w-12 h-12 rounded-full flex items-center justify-center">
              <i>
                <BsGraphUpArrow size={30} color="#0066FF" />
              </i>
            </div>
            <div className="text-xl font-secondary flex gap-4 w-auto">
              <p>5</p>
              <p>Cursos Concluídos</p>
            </div>
          </div>
        </div>
        <div className="border border-gray-300 rounded-md p-1 h-[180px]">
          <Graphics />
        </div>
      </div>
    </div>
  );
};
