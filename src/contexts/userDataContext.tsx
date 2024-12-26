import { doc, getDoc } from "firebase/firestore";
import React from "react";
import { db } from "../services/firebaseConnection";
interface UserDataContextType {
  user: UserDataProps | null;
  setUser: React.Dispatch<React.SetStateAction<UserDataProps | null>>;
}

export interface UserDataProps {
  uid: string;
  name: string;
  email: string;
  password: string;
  isAdmin?: boolean;
  profilePhoto?: string;
  lastAccess: string;
}

const UserDataContext = React.createContext<UserDataContextType | undefined>(
  undefined
);

export const UserDataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = React.useState<UserDataProps | null>(null);
  const [uid, setUid] = React.useState<string | null>(
    localStorage.getItem("user")
      ? localStorage.getItem("user")
      : sessionStorage.getItem("userTemporary")
  );

  React.useEffect(() => {
    if (!user) {
      pullDataUser();
    }
    if (!uid) setUid(localStorage.getItem("user"));
  }, [uid, user]);

  const pullDataUser = async () => {
    if (uid) {
      const uidUser = JSON.parse(uid);
      const docSnap = await getDoc(doc(db, "users", uidUser));

      if (docSnap.exists()) setUser(docSnap.data() as UserDataProps);
    }
  };

  return (
    <UserDataContext.Provider value={{ user, setUser }}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUser = (): UserDataContextType => {
  const context = React.useContext(UserDataContext);
  if (!context) {
    throw new Error("useUser deve ser usado dentro do UserDataProvider");
  }
  return context;
};
