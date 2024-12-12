import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebaseConnection";
import { UserDataProps } from "../contexts/userDataContext";

export const loadDataUser = async (
  uid: string
): Promise<UserDataProps | null> => {
  if (!uid) return null;
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data: UserDataProps = {
      uid: docSnap.data().uid,
      name: docSnap.data().name,
      email: docSnap.data().email,
      password: docSnap.data().password,
      isTeacher: docSnap.data().isTeacher,
    };
    return data;
  }
  return null;
};
