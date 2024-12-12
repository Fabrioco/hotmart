import React from "react";
import {
  IoChatbubbleOutline,
  IoHomeOutline,
  IoInformationCircleOutline,
  IoSettingsOutline,
} from "react-icons/io5";
import { BiBookAlt } from "react-icons/bi";
import { PiMoney } from "react-icons/pi";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/userDataContext";

export const SidebarNav = () => {
  const location = useLocation();
  const [isOpenSidebar, setIsOpenSidebar] = React.useState<boolean>(false);

  const isDashboard = /^\/dashboard\/[^/]+$/.test(location.pathname);
  const isMyCourses = /^\/mycourses\/[^/]+$/.test(location.pathname);
  const isRefunds = location.pathname === "/refunds" ? true : false;
  const isMessages = location.pathname === "/messages" ? true : false;
  const isNeedHelp = location.pathname === "/needhelp" ? true : false;
  const isSettings = /^\/setting\/[^/]+$/.test(location.pathname);

  const navigate = useNavigate();

  const { user } = useUser();

  return (
    <div
      className={`${
        isOpenSidebar ? "w-[220px]" : "w-28"
      } h-full bg-[#282828] flex flex-col  p-4 rounded-2xl gap-4 items-center justify-between transition-all shadow shadow-black `}
    >
      <div className="h-1/2 flex flex-col justify-between">
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
            onClick={() => navigate(`/dashboard/${user?.uid}`)}
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
            onClick={() => navigate(`/mycourses/${user?.uid}`)}
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
            isNeedHelp && "bg-gray-600 bg-opacity-40 rounded-md"
          }`}
        >
          <i>
            <IoInformationCircleOutline size={25} color="#fff" />
          </i>
          <p
            className={`text-xl text-white font-secondary ${
              isOpenSidebar ? "block" : "hidden"
            }`}
          >
            Precisa de ajuda?
          </p>
        </div>
        <div
          className={`flex flex-row items-center gap-3 px-4 py-2 cursor-pointer ${
            isSettings && "bg-gray-600 bg-opacity-40 rounded-md"
          }`}
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
      </div>
    </div>
  );
};
