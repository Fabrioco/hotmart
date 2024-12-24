import React from "react";
import { db } from "../services/firebaseConnection";
import { useNavigate } from "react-router";
import { doc, getDoc } from "firebase/firestore";
import { useUser } from "../contexts/userDataContext";

type PrivateAdminRouteProps = {
  children: React.ReactNode;
};

export const PrivateAdminRoute = ({ children }: PrivateAdminRouteProps) => {
  const [signed, setSigned] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(true);
  const navigate = useNavigate();

  const { user } = useUser();

  React.useEffect(() => {
    const fetchAdmin = async () => {
      if (!user?.uid) return;

      try {
        const docRef = doc(db, "users", `${user?.uid}`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          if (docSnap.data().isAdmin === true) {
            setSigned(true);
          } else {
            navigate("/dashboard");
          }
        } else {
          navigate("/dashboard");
        }
      } catch (error) {
        console.log(error);
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchAdmin();
  }, [user?.uid, navigate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-screen">
        <h1 className="text-center text-5xl font-tertiary">Carregando...</h1>
      </div>
    );
  }

  if (!signed) {
    return null;
  }

  return <>{children}</>;
};
