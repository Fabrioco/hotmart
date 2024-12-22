import React from "react";
import { auth, db } from "../services/firebaseConnection";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { useNavigate } from "react-router-dom";
import { useNotification } from "./notificationContext";
import { UserDataProps, useUser } from "./userDataContext";

type AuthContextType = {
  signUp: (name: string, email: string, password: string) => Promise<void>;

  signIn: (
    email: string,
    password: string,
    keepLogin: boolean
  ) => Promise<void>;

  KeepUserLog: (nameUser: string) => void;

  logOut: () => void;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = React.createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { setUser } = useUser();

  const signUp = async (
    name: string,
    email: string,
    password: string
  ): Promise<void> => {
    try {
      const authResponse = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = authResponse.user.uid;
      await setDoc(doc(db, "users", uid), {
        uid,
        name,
        email,
        password,
        isTeacher: false,
      });
      const data: UserDataProps = {
        uid,
        name,
        email,
        password,
        isTeacher: false,
      };
      navigate(`/dashboard`);
      setUser(data);
      showNotification("Seja bem-vindo", "success");
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error.code === "auth/email-already-in-use") {
          alert("email ja em uso");
        }
      } else {
        console.error("error desconhecido:", error);
      }
    }
  };

  const signIn = async (
    email: string,
    password: string,
    keepLogin: boolean
  ): Promise<void> => {
    try {
      const authResponse = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = authResponse.user.uid;

      const userDocRef = doc(db, "users", uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const userData: UserDataProps = {
          uid: uid,
          name: docSnap.data()?.name || "Usuário",
          email: docSnap.data()?.email || email,
          password: docSnap.data()?.password || "",
          isTeacher: docSnap.data()?.isTeacher,
        };
        setUser(userData);

        showNotification("Bem-vindo de volta!", "success");
        navigate(`/dashboard`);
        if (keepLogin) {
          KeepUserLog(userData.uid);
        } else {
          userTemporary(userData.uid);
        }
      } else {
        showNotification("Usuário não encontrado.", "error");
      }
    } catch (error) {
      showNotification(
        "Erro ao fazer login. Verifique suas credenciais.",
        "error"
      );
      console.log(error);
    }
  };

  const logOut = async () => {
    setUser(null);
    window.location.reload();
    await signOut(auth);
    if (localStorage.getItem("user")) {
      localStorage.removeItem("user");
    } else {
      sessionStorage.removeItem("userTemporary");
    }
  };

  const KeepUserLog = (uidUser: string) => {
    const uidUserJson = JSON.stringify(uidUser);
    localStorage.setItem("user", uidUserJson);
  };

  const userTemporary = (uidUser: string) => {
    const uidUserJson = JSON.stringify(uidUser);
    sessionStorage.setItem("userTemporary", uidUserJson);
  };

  return (
    <AuthContext.Provider value={{ signUp, signIn, KeepUserLog, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
