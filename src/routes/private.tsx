import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebaseConnection";
import { onAuthStateChanged } from "firebase/auth";
import { useUser } from "../hooks/useUser";

type PrivateChildrenType = { children: React.ReactNode };

export default function Private({ children }: PrivateChildrenType) {
  const [signed, setSigned] = React.useState<boolean>(false);
  const navigate = useNavigate();
  const { user } = useUser();

  React.useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setSigned(true);
      } else {
        navigate("/");
      }
    });
    return () => unsub();
  }, [navigate, user]);

  if (!signed) {
    return null;
  }

  return <>{children}</>;
}
