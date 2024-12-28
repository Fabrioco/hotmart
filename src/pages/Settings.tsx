import React from "react";
import { useRenderContent } from "./Register/hooks/useRenderContent";

export default function Settings() {
  const datas = ["Nome", "Email", "Senha", "Foto de perfil", "Excluir conta"];

  const [selectedItem, setSelectedItem] = React.useState<string>("");

  const renderContentResult = useRenderContent(selectedItem);

  return (
    <div className="container bg-white flex flex-col rounded-md shadow-lg">
      <h1 className="text-center text-3xl font-tertiary uppercase border-b border-gray-300 p-4">
        Configurações
      </h1>
      <div className="w-full h-full flex flex-row">
        <div className="w-1/5 h-full flex flex-col items-center justify-center border-r border-gray-300">
          <h2 className="font-primary text-2xl border-b border-gray-300 w-full text-center py-4">
            Alterar Dados
          </h2>
          <div className="w-full h-full flex flex-col items-center gap-3 py-2">
            {datas.map((item, index) => (
              <p
                key={index}
                className="font-secondary text-xl border-y border-gray-300 w-full text-center py-2 cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                {item}
              </p>
            ))}
          </div>
        </div>
        <div>{renderContentResult}</div>
      </div>
    </div>
  );
}
