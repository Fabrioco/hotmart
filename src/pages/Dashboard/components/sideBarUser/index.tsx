import React from "react";
import { BiBookAlt } from "react-icons/bi";
import { FaBell } from "react-icons/fa";
import { BsGraphUpArrow } from "react-icons/bs";
import { Graphics } from "./components/Graphics";
import { useUser } from "../../../../contexts/userDataContext";

type SidebarUserProps = {
  isOpenSidebarUser: boolean;
  setIsOpenSidebarUser: React.Dispatch<React.SetStateAction<boolean>>;
};

export const SidebarUser: React.FC<SidebarUserProps> = ({
  isOpenSidebarUser,
  setIsOpenSidebarUser,
}) => {
  const { user } = useUser();

  const day = new Date().toLocaleDateString("pt-BR", { day: "2-digit" });

  const month =
    new Date()
      .toLocaleDateString("pt-BR", { month: "long" })
      .charAt(0)
      .toUpperCase() +
    new Date().toLocaleDateString("pt-BR", { month: "long" }).slice(1);

  const year = new Date().toLocaleDateString("pt-BR", { year: "numeric" });

  const weekday =
    new Date()
      .toLocaleDateString("pt-BR", { weekday: "long" })
      .charAt(0)
      .toUpperCase() +
    new Date().toLocaleDateString("pt-BR", { weekday: "long" }).slice(1);

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
            <img
              src="https://via.placeholder.com/150"
              alt="foto de perfil"
              className="rounded-full w-16 h-16 cursor-pointer"
            />
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
          <div className="border border-gray-400 w-full h-20 rounded-md flex flex-row justify-around items-center cursor-pointer">
            <div className="bg-black w-12 h-12 rounded-full flex items-center justify-center">
              <i>
                <BiBookAlt size={30} color="#fff" />
              </i>
            </div>
            <div>
              <p className="text-xl font-secondary">Pezinho com degrade</p>
            </div>
            <img
              src="https://via.placeholder.com/150"
              alt="foto da aula"
              className="p-2 rounded-2xl h-full w-auto"
            />
          </div>
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
