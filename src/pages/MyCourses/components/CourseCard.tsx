import React from "react";
import { BiPlay } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaRegStar, FaShare, FaStar } from "react-icons/fa";
import { IoArchive } from "react-icons/io5";
import { MdFavorite } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { Course } from "../../Dashboard";

export const CourseCard = ({ course }: { course: Course }) => {
  const navigate = useNavigate();

  const [isOpenToolbar, setIsOpenToolbar] = React.useState<boolean>(false);
  const [rating, setRating] = React.useState<number>(0);

  const handleRating = (star: number) => {
    setRating(star);
  };

  return (
    <div className="w-72 h-[300px] border border-gray-300 rounded-lg p-2 relative ">
      <div className="h-1/2 w-full ">
        <div className="h-full w-full group-hover:bg-black  cursor-pointer group relative">
          <div
            className="bg-black opacity-25 hidden w-full h-full group-hover:flex items-center justify-center absolute top-0 left-0 z-[2]"
            onClick={() => navigate(`/course/${course.title}`)}
          >
            <BiPlay size={50} color="#fff" />
          </div>
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full absolute top-0 left-0"
          />
          <i
            className="absolute top-2 right-2 bg-white p-1 rounded z-10 hover:bg-gray-200"
            onClick={() => setIsOpenToolbar((prev) => !prev)}
          >
            <BsThreeDotsVertical size={25} color="#000" />
          </i>
        </div>

        <div>
          <div
            className={`${
              isOpenToolbar ? "block" : "hidden"
            } w-80 h-40 bg-white  absolute top-2 right-14 z-10 border border-gray-200 shadow-2xl rounded-lg flex flex-col text-xl font-tertiary justify-between`}
          >
            <button className="w-full h-14 flex justify-center items-center gap-3">
              Arquivar
              <i>
                <IoArchive size={25} />
              </i>
            </button>
            <button className="w-full h-14 flex justify-center items-center gap-3 border-y border-black">
              Compartilhar
              <i>
                <FaShare size={25} />
              </i>
            </button>
            <button className="w-full h-14 flex justify-center items-center gap-3">
              Favoritar
              <i>
                <MdFavorite size={25} />
              </i>
            </button>
          </div>
        </div>
      </div>
      <p className="text-2xl font-secondary">{course.title}</p>
      <button
        onClick={() => navigate(`/teacher`)}
        className="text-xl font-secondary text-gray-500"
      >
        Fabrício Oliveira Lopes
      </button>
      <div className="w-full relative bg-gray-300 h-1 flex  flex-col items-end">
        <div className="w-1/2 bg-gray-800 absolute top-0 left-0 h-full"></div>
        <p>50%</p>
        <div className="flex place-self-end">
          {[1, 2, 3, 4, 5].map((star) => (
            <div key={star}>
              <input
                type="radio"
                name="rating"
                id={`star${star}`}
                value={star}
                className="hidden"
                onClick={() => handleRating(star)}
              />
              <label
                htmlFor={`star${star}`}
                className={`star cursor-pointer transition-colors text-yellow-500 text-5xl`}
              >
                {star <= rating ? (
                  <FaStar size={30} color="#ffcb0c" />
                ) : (
                  <FaRegStar size={30} color="#ffcb0c" />
                )}
              </label>
            </div>
          ))}
        </div>
        <p className="font-tertiary">Deixar uma classificação</p>
      </div>
    </div>
  );
};
