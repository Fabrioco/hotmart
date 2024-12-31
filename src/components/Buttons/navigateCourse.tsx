import { doc, updateDoc } from "firebase/firestore";
import React from "react";
import { db } from "../../services/firebaseConnection";
import { useNavigate } from "react-router";
import { useUser } from "../../hooks/useUser";

type NavigateCourseProps = {
  children: React.ReactNode;
  course: string;
};

export const NavigateCourse = ({ children, course }: NavigateCourseProps) => {
  const navigate = useNavigate();
  const { user } = useUser();
  const handleNavigate = async () => {
    await updateDoc(doc(db, "users", user?.uid as string), {
      lastAccess: course,
    });
    navigate(`/course/${course}`);
  };

  return (
    <button
      className="bg-gray-200 px-4 py-2 rounded-md w-full active:bg-gray-300 transition-all"
      onClick={handleNavigate}
    >
      {children}
    </button>
  );
};
