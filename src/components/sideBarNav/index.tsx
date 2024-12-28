import React from "react";
import {
  IoChatbubbleOutline,
  IoHomeOutline,
  IoLogOutOutline,
  IoSettingsOutline,
} from "react-icons/io5";
import { BiBookAlt } from "react-icons/bi";
import { PiMoney } from "react-icons/pi";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import { RiAdminLine } from "react-icons/ri";
import { useUser } from "../../contexts/userDataContext";

export const SidebarNav = () => {
  const location = useLocation();
  const [isOpenSidebar, setIsOpenSidebar] = React.useState<boolean>(false);

  const isActiveRoute = (route: string) => location.pathname === route;

  const isDashboard = isActiveRoute("/dashboard");
  const isMyCourses = isActiveRoute("/mycourses");
  const isRefunds = isActiveRoute("/refunds");
  const isMessages = isActiveRoute("/messages");
  const isSettings = isActiveRoute("/settings");
  const isAdmin = isActiveRoute("/admin");

  const navigate = useNavigate();

  const { logOut } = useAuth();
  const { user } = useUser();

  const handleLogout = () => {
    logOut();
  };

  return (
    <div
      className={`${
        isOpenSidebar ? "w-[220px]" : "w-28"
      } h-full bg-[#282828] flex flex-col  p-4 rounded-2xl gap-4 items-center justify-between transition-all shadow shadow-black relative `}
    >
      <div className="h-1/2 flex flex-col justify-between ">
        <div
          className="flex flex-col items-center justify-center cursor-pointer gap-2 self-end"
          onClick={() => setIsOpenSidebar(!isOpenSidebar)}
        >
          <span
            className={`w-[25px] h-[3px] bg-white rounded transition-all duration-300 ${
              isOpenSidebar ? "rotate-45 translate-y-[6px]" : "rotate-0"
            }`}
          ></span>
          <span
            className={`w-[25px] h-[3px] bg-white rounded transition-all duration-300 ${
              isOpenSidebar ? "opacity-0" : "opacity-100"
            }`}
          ></span>
          <span
            className={`w-[25px] h-[3px] bg-white rounded transition-all duration-300 ${
              isOpenSidebar ? "-rotate-45 -translate-y-[16px]" : "rotate-0"
            }`}
          ></span>
        </div>

        <h1 className="font-primary text-4xl text-white text-center">BC</h1>
        <div
          className={`flex flex-col gap-3 items-start ${
            isOpenSidebar ? "items-start" : "items-center"
          } transition-all`}
        >
          <div
            className={`flex flex-row items-center gap-3 cursor-pointer px-4 py-2 w-full ${
              isDashboard && "bg-gray-600 bg-opacity-40 rounded-md"
            }`}
            onClick={() => navigate(`/dashboard`)}
          >
            <i>
              <IoHomeOutline size={25} color="#fff" />
            </i>
            <p
              className={`text-xl text-white font-secondary ${
                isOpenSidebar ? "block" : "hidden"
              }`}
            >
              Inicio
            </p>
          </div>
          <div
            className={`flex flex-row items-center gap-3 px-4 py-2 cursor-pointer w-full ${
              isMyCourses && "bg-gray-600 bg-opacity-40 rounded-md"
            }`}
            onClick={() => navigate(`/mycourses`)}
          >
            <i>
              <BiBookAlt size={25} color="#fff" />
            </i>
            <p
              className={`text-xl text-white font-secondary ${
                isOpenSidebar ? "block" : "hidden"
              }`}
            >
              Meus Cursos
            </p>
          </div>
          <div
            className={`flex flex-row items-center gap-3 px-4 py-2 cursor-pointer w-full ${
              isRefunds && "bg-gray-600 bg-opacity-40 rounded-md"
            }`}
            onClick={() => navigate("/refunds")}
          >
            <i>
              <PiMoney size={25} color="#fff" />
            </i>
            <p
              className={`text-xl text-white font-secondary ${
                isOpenSidebar ? "block" : "hidden"
              }`}
            >
              Reembolso
            </p>
          </div>
          <div
            className={`flex flex-row items-center gap-3 px-4 py-2 cursor-pointer w-full ${
              isMessages && "bg-gray-600 bg-opacity-40 rounded-md"
            }`}
            onClick={() => navigate("/messages")}
          >
            <i>
              <IoChatbubbleOutline size={25} color="#fff" />
            </i>
            <p
              className={`text-xl text-white font-secondary ${
                isOpenSidebar ? "block" : "hidden"
              }`}
            >
              Mensagens
            </p>
          </div>
        </div>
        <div className="w-full h-[2px] bg-white rounded-lg relative">
          <span className="w-[15px] h-[2px] bg-white rounded-lg absolute left-1/2 -rotate-45 -translate-x-1/2"></span>
          <span className="w-[15px] h-[2px] bg-white rounded-lg absolute rotate-45 left-1/2 -translate-x-1/2"></span>
        </div>
      </div>
      <div
        className={`flex flex-col gap-3 items-start h-1/2 ${
          isOpenSidebar ? "items-start" : "items-center"
        } `}
      >
        <div
          className={`flex flex-row items-center gap-3 px-4 py-2 cursor-pointer ${
            isSettings && "bg-gray-600 bg-opacity-40 rounded-md"
          }`}
          onClick={() => navigate("/settings")}
        >
          <i className={`active:rotate-180 transition-all`}>
            <IoSettingsOutline size={25} color="#fff" />
          </i>
          <p
            className={`text-xl text-white font-secondary ${
              isOpenSidebar ? "block" : "hidden"
            }`}
          >
            Configurações
          </p>
        </div>
        {user?.isAdmin && (
          <div
            className={`flex flex-row items-center gap-3 px-4 py-2 cursor-pointer ${
              isAdmin && "bg-gray-600 bg-opacity-40 rounded-md"
            }`}
            onClick={() => navigate("/admin")}
          >
            <i>
              <RiAdminLine size={25} color="#fff" />
            </i>
            <p
              className={`text-xl text-white font-secondary ${
                isOpenSidebar ? "block" : "hidden"
              }`}
            >
              Administrador
            </p>
          </div>
        )}
        <div
          className={`flex flex-row items-center gap-3 px-4 py-2 cursor-pointer absolute bottom-0`}
          onClick={handleLogout}
        >
          <i>
            <IoLogOutOutline size={25} color="#fff" />
          </i>
          <p
            className={`text-xl text-white font-secondary ${
              isOpenSidebar ? "block" : "hidden"
            }`}
          >
            Desconectar
          </p>
        </div>
      </div>
    </div>
  );
};
