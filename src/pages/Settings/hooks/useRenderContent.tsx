import React from "react";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../../services/firebaseConnection";
import imageCompression from "browser-image-compression";
import { useNotification } from "../../../contexts/notificationContext";
import {
  deleteUser,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useUser } from "../../../hooks/useUser";
import { EmailAuthProvider } from "firebase/auth/web-extension";

export const useRenderContent = (selectedItem: string) => {
  const { user, setUser } = useUser();
  const { showNotification } = useNotification();

  const [newName, setNewName] = React.useState<string>("");
  const [newEmail, setNewEmail] = React.useState<string>("");
  const [emailToPassword, setEmailToPassword] = React.useState<string>("");
  const [file, setFile] = React.useState<File | null>(null);

  const updateData = async () => {
    const uid: string = user?.uid as string;

    const docRef = doc(db, "users", `${uid}`);

    switch (selectedItem) {
      case "Nome":
        await updateDoc(docRef, { name: newName })
          .then(() => {
            showNotification("Nome alterado com sucesso", "success");
            setNewName("");
          })
          .catch(() => {
            showNotification("Erro ao alterar nome", "error");
          });
        break;
      case "Email":
        await updateDoc(docRef, { email: newEmail })
          .then(() => {
            showNotification("Email alterado com sucesso", "success");
            setNewEmail("");
          })
          .catch(() => {
            showNotification("Erro ao alterar email", "error");
          });
        break;
      case "Senha":
        await sendPasswordResetEmail(auth, emailToPassword)
          .then(() => {
            showNotification(
              "Email de redefinição de senha enviado com sucesso",
              "success"
            );
            setEmailToPassword("");
          })
          .catch(() => {
            showNotification(
              "Erro ao enviar email de redefinição de senha",
              "error"
            );
          });
        break;
      case "Foto de perfil":
        if (file) {
          const base64Image = await compressAndConvertToBase64(file);
          if (!user?.uid) return;
          await updateDoc(doc(db, "users", user?.uid), {
            profilePhoto: base64Image,
          })
            .then(() => {
              showNotification(
                "Foto de perfil alterada com sucesso",
                "success"
              );
              setFile(null);
            })
            .catch(() => {
              showNotification("Erro ao alterar foto de perfil", "error");
            });
        }
        break;
      case "Excluir conta": {
        if (!auth.currentUser) {
          alert("Nenhum usuário está logado.");
          return;
        }

        const userData = auth.currentUser;
        const confirmationEmail: string | null = prompt(
          "Digite seu e-mail para confirmar:"
        );
        const confirmationPassword: string | null = prompt(
          "Digite sua senha para confirmar:"
        );

        try {
          if (!confirmationEmail || !confirmationPassword) return;
          const credential = EmailAuthProvider.credential(
            confirmationEmail,
            confirmationPassword
          );
          await reauthenticateWithCredential(userData, credential);

          const userDocRef = doc(db, "users", userData.uid);
          await deleteDoc(userDocRef);

          await deleteUser(userData);
          setUser(null);
          localStorage.removeItem("user");
          sessionStorage.removeItem("userTemporary");

          showNotification("Conta deletada com sucesso!", "success");
        } catch (error: unknown) {
          console.error("Erro ao deletar conta:", error);
          if (error === "auth/wrong-password") {
            alert("Senha incorreta. Tente novamente.");
          } else if (error === "auth/user-not-found") {
            alert("Usuário não encontrado.");
          } else {
            alert("Ocorreu um erro. Tente novamente.");
          }
        }
        break;
      }
    }
  };

  const compressAndConvertToBase64 = async (file: File) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    const compressedFile = await imageCompression(file, options);

    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onload = () => {
        if (reader.result) {
          resolve(reader.result.toString());
        } else {
          reject("Erro ao converter a imagem para Base64");
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };

  switch (selectedItem) {
    case "Nome":
      return (
        <div className="flex flex-col font-secondary p-4">
          <p className="text-xl">Nome atual: {user?.name}</p>
          <label htmlFor="name" className="mt-4 text-xl">
            Novo nome:
          </label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Digite..."
            className="border border-gray-300 rounded-md p-2"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <button
            className="bg-gray-200 px-4 py-2 mt-4 rounded-md active:bg-gray-300 font-tertiary text-xl"
            onClick={updateData}
          >
            Salvar
          </button>
        </div>
      );
    case "Email":
      return (
        <div className="flex flex-col font-secondary p-4">
          <p className="text-xl">Email atual: {user?.email}</p>
          <label htmlFor="email" className="mt-4 text-xl">
            Novo email:
          </label>
          <input
            type="text"
            name="email"
            id="name"
            placeholder="Digite..."
            className="border border-gray-300 rounded-md p-2"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <button
            className="bg-gray-200 px-4 py-2 mt-4 rounded-md active:bg-gray-300 font-tertiary text-xl"
            onClick={updateData}
          >
            Salvar
          </button>
        </div>
      );
    case "Senha":
      return (
        <div className="flex flex-col font-secondary p-4">
          <p className="text-xl">
            Enviaremos um link para o email para alterar a senha
          </p>
          <label htmlFor="email" className="mt-4 text-xl">
            Digite seu email:
          </label>
          <input
            type="text"
            name="email"
            id="email"
            placeholder="Digite..."
            className="border border-gray-300 rounded-md p-2"
            value={emailToPassword}
            onChange={(e) => setEmailToPassword(e.target.value)}
          />
          <button
            className="bg-gray-200 px-4 py-2 mt-4 rounded-md active:bg-gray-300 font-tertiary text-xl"
            onClick={updateData}
          >
            Enviar
          </button>
        </div>
      );
    case "Foto de perfil":
      return (
        <div className="flex flex-col font-secondary p-4">
          <p className="text-xl">Foto de perfil atual:</p>
          <img src={user?.profilePhoto} alt="Você não definiu uma foto" />
          <label htmlFor="file" className="mt-4 text-xl">
            Selecione sua foto de perfil:
          </label>
          <input
            type="file"
            name="file"
            id="name"
            className="border border-gray-300 rounded-md p-2"
            onChange={(e) => setFile(e.target.files![0])}
            accept="image/*"
          />
          <button
            className="bg-gray-200 px-4 py-2 mt-4 rounded-md active:bg-gray-300 font-tertiary text-xl"
            onClick={updateData}
          >
            Enviar
          </button>
        </div>
      );
    case "Excluir conta":
      return (
        <div className="flex flex-col text-3xl font-secondary p-4">
          <p>Tem certeza que deseja excluir sua conta?</p>
          <button
            className="bg-gray-200 px-4 py-2 mt-4 rounded-md active:bg-gray-300 font-tertiary"
            onClick={updateData}
          >
            Excluir
          </button>
        </div>
      );
    default:
      return <p>Selecione uma opção ao lado para alterar.</p>;
  }
};
