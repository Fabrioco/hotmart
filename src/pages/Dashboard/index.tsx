import { useNavigate, useParams } from "react-router-dom";
import { loadDataUser } from "../../hooks/loadDataUser";
import React from "react";
import { FaBell, FaRegStar, FaSearch, FaStar } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { MyCalendar } from "./components/MyCalendar";
import { SidebarUser } from "./components/sideBarUser";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { NavigateCourse } from "../../components/Buttons/navigateCourse";
import { useUser } from "../../hooks/useUser";

export type Course = {
  title: string;
  desc: string;
  value: string;
  link: string;
  thumbnail: string;
  rating?: number;
  quantity?: number;
  valueDiscount?: string;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { uid } = useParams();
  const { setUser } = useUser();

  const [courses, setCourses] = React.useState<Course[]>([]);
  const [isOpenSidebarUser, setIsOpenSidebarUser] =
    React.useState<boolean>(false);

  const { user } = useUser();
  const [myCourses, setMyCourses] = React.useState<Course[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  const fetchCourses = React.useCallback(async () => {
    try {
      const userDocRef = doc(db, "users", `${user?.uid}`);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const rawCourses = userDocSnap.data().courses || [];
        const formattedCourses = rawCourses.map((course: string) => {
          const parts = course.split(", ");
          return { title: parts[0], paiedValue: parts[1], paiedDate: parts[2] };
        });

        const coursesCollectionRef = collection(db, "courses");
        const coursesSnapshot = await getDocs(coursesCollectionRef);

        const courses = coursesSnapshot.docs.map((doc) => ({
          title: doc.id,
          ...doc.data(),
        }));

        const filteredCourses = courses.filter((course) =>
          formattedCourses.some(
            (formattedCourse: Course) => formattedCourse.title === course.title
          )
        );

        setMyCourses(filteredCourses as Course[]);
      } else {
        setMyCourses([]);
      }
    } catch (error) {
      console.error("Erro ao buscar cursos:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  React.useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  React.useEffect(() => {
    const unsubscribe = loadDataUser(uid as string, (data) => setUser(data));

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [setUser, uid]);

  const loadCourses = React.useCallback(async () => {
    const unsubscribe = onSnapshot(collection(db, "courses"), (snapshot) => {
      const allCourses = snapshot.docs.map((doc) => ({
        title: doc.id,
        ...doc.data(),
      })) as Course[];

      const availableCourses = myCourses
        ? allCourses.filter(
            (course) =>
              !myCourses.some((myCourse) => myCourse.title === course.title)
          )
        : allCourses;

      setCourses(availableCourses);
    });
    return () => unsubscribe();
  }, [myCourses]);

  React.useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <h1 className="text-3xl">Carregando...</h1>
      </div>
    );
  }

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
                  src={user?.profilePhoto}
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

            <button onClick={() => navigate(`/mycourses`)}>
              <h2 className="text-xl hover:underline font-secondary text-gray-500">
                Ver Todos
              </h2>
            </button>
          </div>
          <div className="flex flex-row flex-wrap gap-4 px-4 py-2 h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-[#282828">
            {myCourses.map((course) => (
              <div
                key={course.title}
                className="w-1/4 min-w-64 h-40 flex border rounded-lg"
              >
                <img
                  src={course.thumbnail}
                  alt="imagem do curso"
                  className="rounded-lg w-8/12"
                />
                <div className="flex flex-col justify-around items-center px-2 py-1 mx-auto text-center">
                  <p className="font-secondary text-xl">{course.title}</p>
                  <div className="flex flex-row items-center gap-1">
                    <span>{course.quantity}</span>
                    <i>
                      <FaPeopleGroup size={25} />
                    </i>
                  </div>
                  <div className="flex flex-row items-center gap-1">
                    <span>{course.rating}</span>
                    <i>
                      <FaStar size={30} color="#ffcb0c" />
                    </i>
                  </div>
                  <NavigateCourse course={course.title}>Acessar</NavigateCourse>
                </div>
              </div>
            ))}
            {!myCourses.length && (
              <p className="text-xl font-secondary">
                Você ainda não possui nenhum curso
              </p>
            )}
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
                          <div key={star}>
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
                        Comprar{" "}
                        <strong>
                          {course.valueDiscount
                            ? "R$ " + course.valueDiscount
                            : course.value}
                        </strong>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
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
