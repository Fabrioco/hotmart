import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebaseConnection";
import { UserDataProps } from "../contexts/userDataContext";

export const loadDataUser = (
  uid: string,
  onUpdate: (data: UserDataProps | null) => void
): (() => void) | null => {
  if (!uid) return null;

  const docRef = doc(db, "users", uid);

  const unsubscribe = onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as UserDataProps;
        onUpdate(data);
      } else {
        console.log("Documento não encontrado.");
        onUpdate(null);
      }
    },
    (error) => {
      console.error("Erro ao observar o documento:", error);
      onUpdate(null);
    }
  );

  return unsubscribe;
};
