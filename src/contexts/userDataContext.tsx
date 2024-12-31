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
  const [uid, setUid] = React.useState<string | null>(
    localStorage.getItem("user")
      ? localStorage.getItem("user")
      : sessionStorage.getItem("userTemporary")
  );

  const pullDataUser = React.useCallback(async () => {
    if (uid) {
      const uidUser = JSON.parse(uid);
      const docSnap = await getDoc(doc(db, "users", uidUser));

      if (docSnap.exists()) setUser(docSnap.data() as UserDataProps);
    }
  }, [uid]);

  React.useEffect(() => {
    if (!user) {
      pullDataUser();
    }
    if (!uid) setUid(localStorage.getItem("user"));
  }, [pullDataUser, user, uid]);

  return (
    <UserDataContext.Provider value={{ user, setUser }}>
      {children}
    </UserDataContext.Provider>
  );
};


