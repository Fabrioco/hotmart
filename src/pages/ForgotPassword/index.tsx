import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../services/firebaseConnection";
import React from "react";
import { useNotification } from "../../contexts/notificationContext";
import { FirebaseError } from "firebase/app";
import { useNavigate } from "react-router";

export default function ForgotPassword() {
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const [email, setEmail] = React.useState<string>("");

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email).then(() => navigate("/login"));
      showNotification("Email enviado com sucesso", "success");
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        console.error("Erro ao enviar o e-mail:", error.message);
        switch (error.code) {
          case "auth/invalid-email":
            alert("O e-mail fornecido não é válido.");
            break;
          case "auth/user-not-found":
            alert("Usuário não encontrado com este e-mail.");
            break;
          default:
            alert("Erro ao enviar e-mail. Tente novamente mais tarde.");
        }
      }
    }
  };

  return (
    <div className="w-1/2 h-3/4 flex flex-col items-center justify-center m-auto bg-white rounded-md">
      <h1 className="text-4xl font-primary">Esqueci minha senha</h1>
      <p className="text-2xl font-secondary">Insira seu email</p>
      <form
        className="w-11/12 h-auto flex flex-col items-center"
        onSubmit={resetPassword}
      >
        <input
          type="email"
          placeholder="Email"
          className="w-3/4 h-12 border border-gray-300 rounded-md p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          className="w-3/4 h-12 mt-4 bg-gray-200 rounded-md active:bg-gray-300"
          type="submit"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
