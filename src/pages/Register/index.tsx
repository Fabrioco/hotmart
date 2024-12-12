import React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../../contexts/authContext";
import { useNotification } from "../../contexts/notificationContext";

export default function Register() {
  const { signUp } = useAuth();
  const { showNotification } = useNotification();

  const passwordInputRef = React.useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [acceptedTerms, setAcceptedTerms] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);

  const [nameInput, setNameInput] = React.useState<string>("");
  const [emailInput, setEmailInput] = React.useState<string>("");
  const [passwordInput, setPasswordInput] = React.useState<string>("");

  const togglePassword = () => {
    const input = passwordInputRef.current;
    if (input) {
      input.type = input.type === "password" ? "text" : "password";
      setShowPassword(!showPassword);
    }
  };

  const handleAcceptTerms = () => setAcceptedTerms(!acceptedTerms);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
      showNotification("Aceite os termos", "error");
    }
    if (!emailInput || !passwordInput) {
      showNotification("Preencha todos os campos", "error");
      return;
    }
    try {
      setLoading(true);
      signUp(nameInput, emailInput, passwordInput);
    } catch (error) {
      showNotification("Verifique suas credenciais", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex flex-col bg-white w-[600px] h-[700px] items-center justify-around rounded-2xl border border-gray-300 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <h1 className="font-primary text-4xl uppercase">Registrar</h1>
      <form
        onSubmit={handleRegister}
        className="w-6/12 text-xl flex flex-col items-center justify-between font-secondary gap-8"
      >
        <div className="flex flex-col justify-center w-full gap-1">
          <label htmlFor="nameInputRegister">Nome</label>
          <input
            type="text"
            id="nameInputRegister"
            className="w-full bg-gray-200 px-4 py-2 rounded-md outline-none"
            placeholder="Nome aqui"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
          />
        </div>
        <div className="flex flex-col justify-center w-full gap-1">
          <label htmlFor="emailInputRegister">Email</label>
          <input
            type="email"
            id="emailInputRegister"
            placeholder="exemplo@gmail.com"
            className="w-full bg-gray-200 px-4 py-2 rounded-md outline-none"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
          />
        </div>
        <div className="flex flex-col justify-center w-full gap-1">
          <label htmlFor="passwordInputRegister">Senha</label>
          <div className="flex bg-gray-200 rounded-md w-full px-4 py-2 ">
            <input
              className="w-full bg-gray-200 rounded-md outline-none"
              type="password"
              id="passwordInputLogin"
              placeholder="********"
              min={8}
              ref={passwordInputRef}
              autoComplete="off"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
            />
            <i
              className="cursor-pointer text-gray-400"
              onClick={togglePassword}
            >
              {showPassword ? <FaEye size={25} /> : <FaEyeSlash size={25} />}
            </i>
          </div>
        </div>
        <div
          className="flex w-full items-center justify-between"
          onClick={handleAcceptTerms}
        >
          <label htmlFor="keepLoggedCheckbox">Li e aceito os termos.</label>
          <input
            type="checkbox"
            id="keepLoggedCheckbox"
            className="w-8 h-8 appearance-none rounded-full checked:bg-gray-600 border-2 cursor-pointer"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
          />
        </div>
        <button
          className="bg-gray-200 px-8 py-4 font-tertiary uppercase rounded-md shadow-sm shadow-black active:bg-gray-400 active:shadow-md active:shadow-gray-400"
          type="submit"
        >
          {!loading ? "Registrar" : "Registrando..."}
        </button>
      </form>
      <div className="w-1/2 font-secondary text-lg">
        <p>
          Já tem uma conta?{" "}
          <a href="/login" className="hover:underline">
            Clique aqui
          </a>
        </p>
      </div>
    </div>
  );
}
