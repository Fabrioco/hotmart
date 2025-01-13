import React from "react";
import { BiPlay } from "react-icons/bi";
import { FaRegStar, FaStar } from "react-icons/fa";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { Course } from "../../Dashboard";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../../services/firebaseConnection";
import { useUser } from "../../../hooks/useUser";
import { useNotification } from "../../../contexts/notificationContext";
import { UserDataProps } from "../../../contexts/userDataContext";

export const CourseCard = ({ course }: { course: Course }) => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const { showNotification } = useNotification();

  const [rating, setRating] = React.useState<number>(0);

  const handleRating = (star: number) => {
    setRating(star);
  };

  const handleNavigate = async () => {
    await updateDoc(doc(db, "users", user?.uid as string), {
      lastAccess: course.title as string,
    });
    navigate(`/course/${course.title}`);
  };

  const favoriteCourse = async () => {
    try {
      const userDocRef = doc(db, "users", auth.currentUser!.uid);
      const favorites = user?.favorite || [];

      let updatedFavorites;
      if (favorites.includes(course.title)) {
        updatedFavorites = favorites.filter((fav) => fav !== course.title);
        showNotification("Curso removido dos favoritos.", "success");
      } else {
        updatedFavorites = [...favorites, course.title];
        showNotification("Curso favoritado com sucesso!", "success");
      }

      setUser({
        ...user,
        favorite: updatedFavorites,
      } as UserDataProps);

      await updateDoc(userDocRef, {
        favorite: updatedFavorites,
      });
    } catch (error) {
      console.error("Erro ao favoritar o curso:", error);
      showNotification("Ocorreu um erro ao tentar favoritar o curso.", "error");
    }
  };

  return (
    <div className="w-72 h-[300px] border border-gray-300 rounded-lg p-2 relative ">
      <div className="h-1/2 w-full ">
        <div className="h-full w-full group-hover:bg-black  cursor-pointer group relative">
          <div
            className="bg-black opacity-25 hidden w-full h-full group-hover:flex items-center justify-center absolute top-0 left-0 z-[2]"
            onClick={handleNavigate}
          >
            <BiPlay size={50} color="#fff" />
          </div>
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full absolute top-0 left-0"
          />
          <i className="absolute top-2 right-2 bg-white p-1 rounded z-10 hover:bg-gray-200">
            <button
              className="w-full h-14 flex justify-center items-center gap-3"
              onClick={favoriteCourse}
            >
              {user?.favorite?.includes(course.title) ? (
                <i>
                  <MdFavorite size={25} color="red" />
                </i>
              ) : (
                <MdFavoriteBorder size={25} color="red" />
              )}
            </button>
          </i>
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
