import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebaseConnection";
import { onAuthStateChanged } from "firebase/auth";

type PrivateChildrenType = { children: React.ReactNode };

export default function Private({ children }: PrivateChildrenType) {
  const [signed, setSigned] = React.useState<boolean>(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setSigned(true);
      } else {
        navigate("/");
      }
    });
    return () => unsub();
  }, [navigate]);

  if (!signed) {
    return null;
  }

  return <>{children}</>;
}
