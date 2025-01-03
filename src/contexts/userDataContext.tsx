import { doc, getDoc } from "firebase/firestore";
import React from "react";
import { db } from "../services/firebaseConnection";
import { UserDataContext } from "../hooks/useUser";

export interface UserDataContextType {
  user: UserDataProps | null;
  setUser: React.Dispatch<React.SetStateAction<UserDataProps | null>>;
}

export interface UserDataProps {
  uid: string;
  name: string;
  email: string;
  isAdmin?: boolean;
  profilePhoto?: string;
  lastAccess: string;
}

export const UserDataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = React.useState<UserDataProps | null>(null);
  const [uid, setUid] = React.useState<string | null>(null);

  const retrieveUid = (): string | null => {
    return (
      localStorage.getItem("user") ||
      sessionStorage.getItem("userTemporary") ||
      null
    );
  };

  const pullDataUser = async (uid: string): Promise<void> => {
    try {
      const docSnap = await getDoc(doc(db, "users", uid));
      if (docSnap.exists()) {
        setUser(docSnap.data() as UserDataProps);
      } else {
        console.warn(`Nenhum documento encontrado para o UID: ${uid}`);
      }
    } catch (error) {
      console.error("Erro ao buscar os dados do usuário:", error);
    }
  };

  React.useEffect(() => {
    const storedUid = retrieveUid();
    if (storedUid) {
      setUid(storedUid);
    }
  }, []);

  React.useEffect(() => {
    if (uid && !user) {
      pullDataUser(uid);
    }
  }, [uid, user]);

  return (
    <UserDataContext.Provider value={{ user, setUser }}>
      {children}
    </UserDataContext.Provider>
  );
};
