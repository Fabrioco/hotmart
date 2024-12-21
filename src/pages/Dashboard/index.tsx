import { useNavigate, useParams } from "react-router-dom";
import { loadDataUser } from "../../hooks/loadDataUser";
import React from "react";
import { UserDataProps, useUser } from "../../contexts/userDataContext";
import { FaBell, FaRegStar, FaSearch, FaStar } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { MyCalendar } from "./components/MyCalendar";
import { SidebarUser } from "./components/sideBarUser";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";

export type Course = {
  title: string;
  desc: string;
  value: string;
  link: string;
  thumbnail: string;
  rating?: number;
  quantity?: number;
};

export default function Dashboard() {
  const [courses, setCourses] = React.useState<Course[]>([]);
  const navigate = useNavigate();
  const { uid } = useParams();
  const { setUser } = useUser();

  const [isOpenSidebarUser, setIsOpenSidebarUser] =
    React.useState<boolean>(false);

  React.useEffect(() => {
    const loadData = async () => {
      if (uid) {
        const data = await loadDataUser(uid);
        setUser(data as UserDataProps);
      }
    };
    loadData();
  }, [setUser, uid]);

  const loadCourses = async () => {
    const unsubscribe = onSnapshot(collection(db, "courses"), (snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data()) as Course[];
      setCourses(data);
      console.log(data);
    });
    return () => unsubscribe();
  };

  React.useEffect(() => {
    loadCourses();
  }, []);

  const fetchStar = async (course: string) => {
    const docSnap = onSnapshot(doc(db, "courses", course), (doc) => {
      if (doc.exists()) {
        const data = doc.data() as Course;
        console.log(data.rating);
      }
    });
    return () => docSnap();
  };

  React.useEffect(() => {
    fetchStar("teste");
  }, []);

  return (
    <div className="w-full h-full flex flex-row justify-between">
      <div className="flex flex-col w-full">
        <div className="w-full h-14 mx-auto flex justify-between gap-2">
          <div
            className={`${
              isOpenSidebarUser ? "w-full" : "w-10/12"
            } flex bg-white px-4 py-2 rounded-md h-14 gap-2 items-center`}
          >
            <FaSearch size={25} color="#a1a1a1" />
            <input
              type="text"
              placeholder="Pesquisar"
              className="w-full outline-none"
            />
          </div>
          {!isOpenSidebarUser && (
            <div className="flex gap-5 items-center">
              <i className="cursor-pointer">
                <FaBell size={30} color="#a1a1a1" />
              </i>
              <div
                className="bg-gray-400 w-14 h-14 rounded-2xl cursor-pointer group relative"
                onClick={() => setIsOpenSidebarUser(!isOpenSidebarUser)}
              >
                <img
                  src="https://via.placeholder.com/150"
                  alt="foto"
                  className="w-full h-full rounded-2xl"
                />
              </div>
            </div>
          )}
        </div>
        <div className="w-full h-1/2 max-h-[380px] bg-white mt-5 rounded-xl px-2 py-1 flex flex-col">
          <div className="flex justify-between">
            <h1 className="text-xl font-secondary">Meus Cursos</h1>

            <button onClick={() => navigate(`/mycourses/${uid}`)}>
              <h2 className="text-xl hover:underline font-secondary text-gray-500">
                Ver Todos
              </h2>
            </button>
          </div>
          <div className="flex flex-row flex-wrap gap-4 px-4 py-2 h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-[#282828">
            <div className="w-1/4 min-w-64 h-2/4 flex border rounded-lg">
              <img
                src="https://via.placeholder.com/150"
                alt="imagem do curso"
                className="rounded-lg"
              />
              <div className="flex flex-col justify-around items-center px-2 py-1 text-center">
                <p className="font-secondary text-xl">Pezinho com degrade</p>
                <div className="flex flex-row items-center gap-1">
                  <span>220</span>
                  <i>
                    <FaPeopleGroup size={25} />
                  </i>
                </div>
                <div className="flex flex-row items-center gap-1">
                  <span>4/5</span>
                  <i>
                    <FaStar size={30} color="#ffcb0c" />
                  </i>
                </div>
                <button className="text-gray-400 cursor-pointer">
                  <span>Acessar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full h-1/2 mt-5 flex justify-between">
          <div
            className={`${
              isOpenSidebarUser ? "w-full" : "w-8/12"
            } h-full bg-white rounded-xl px-2 py-1`}
          >
            <button className="hover:underline">
              <span className="text-xl font-secondary">Mais Cursos</span>
            </button>
            <div className="flex flex-row h-[350px] flex-wrap gap-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-[#282828] pr-2">
              {courses.map((course) => (
                <div
                  key={course.title}
                  className="xl:w-1/5 xl:min-w-72 xl:h-2/4 h-auto flex xl:flex-row flex-col border rounded-lg"
                >
                  <img
                    src={course.thumbnail}
                    alt="Erro ao carregar imagem"
                    className="rounded-lg w-1/2"
                  />
                  <div className="flex flex-col justify-around items-center px-2 py-1 w-1/2">
                    <p className="text-xl font-secondary">{course.title}</p>
                    <div className="flex flex-row items-center gap-1">
                      <p className="font-secondary">{course.quantity}</p>
                      <i>
                        <FaPeopleGroup size={25} />
                      </i>
                    </div>
                    <div className="flex flex-row items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div
                          key={star}
                          onClick={() => navigate(`/course/${course.title}`)}
                        >
                          <input
                            type="radio"
                            name="rating"
                            id={`star${star}`}
                            value={star}
                            className="hidden"
                          />
                          <label
                            htmlFor={`star${star}`}
                            className={`star cursor-pointer transition-colors text-yellow-500 text-5xl`}
                          >
                            {star <= Number(course.rating) ? (
                              <FaStar size={20} color="#ffcb0c" />
                            ) : (
                              <FaRegStar size={20} color="#ffcb0c" />
                            )}
                          </label>
                        </div>
                      ))}
                    </div>
                    <button
                      className="bg-gray-300 hover:bg-gray-400 hover:text-white text-black px-2 py-1 rounded flex flex-col font-tertiary"
                      onClick={() => navigate(`/payment/${course.title}`)}
                    >
                      Comprar <strong>{course.value}</strong>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {!isOpenSidebarUser && (
            <div className="w-3/12 h-full bg-white rounded-xl flex items-center justify-center">
              <MyCalendar />
            </div>
          )}
        </div>
      </div>
      <SidebarUser
        isOpenSidebarUser={isOpenSidebarUser}
        setIsOpenSidebarUser={setIsOpenSidebarUser}
      />
    </div>
  );
}
