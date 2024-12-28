import { useUser } from "../../../contexts/userDataContext";

export const useRenderContent = (selectedItem: string) => {

    const { user } = useUser();

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
            />
            <button className="bg-gray-200 px-4 py-2 mt-4 rounded-md active:bg-gray-300 font-tertiary text-xl">
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
            />
            <button className="bg-gray-200 px-4 py-2 mt-4 rounded-md active:bg-gray-300 font-tertiary text-xl">
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
              id="name"
              placeholder="Digite..."
              className="border border-gray-300 rounded-md p-2"
            />
            <button className="bg-gray-200 px-4 py-2 mt-4 rounded-md active:bg-gray-300 font-tertiary text-xl">
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
            />
            <button className="bg-gray-200 px-4 py-2 mt-4 rounded-md active:bg-gray-300 font-tertiary text-xl">
              Enviar
            </button>
          </div>
        );
      case "Excluir conta":
        return (
          <div className="flex flex-col text-3xl font-secondary p-4">
            <p>Tem certeza que deseja excluir sua conta?</p>
            <button className="bg-gray-200 px-4 py-2 mt-4 rounded-md active:bg-gray-300 font-tertiary">
              Excluir
            </button>
          </div>
        );
      default:
        return <p>Selecione uma opção ao lado para alterar.</p>;
    }
  };
