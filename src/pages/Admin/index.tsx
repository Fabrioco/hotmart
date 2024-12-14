export default function Admin() {
  return (
    <div className="w-full h-full rounded-md flex justify-between items-center flex-wrap gap-5">
      <div className="bg-white w-6/12 h-2/5 rounded-md p-3">
        <h1 className="font-primary text-3xl text-center">Postar novo curso</h1>
        <div className="w-11/12 h-auto flex flex-col border border-gray-500">
          <input
            type="text"
            placeholder="Digite o nome do curso"
            id="nomeCurso"
            className="w-full"
          />
          <input
            type="text"
            placeholder="Digite o link do curso"
            className="w-full"
            id="linkCurso"
          />
          <input
            type="text"
            placeholder="Digite a descricão do curso"
            className="w-full"
            id="descCurso"
          />
          <input
            type="file"
            accept="image/*"
            className="w-full"
            id="thumbCurso"
          />
        </div>
      </div>
      <div className="bg-white w-5/12 h-2/5 rounded-md"></div>
      <div className="bg-white w-5/12 h-2/5 rounded-md"></div>
      <div className="bg-white w-6/12 h-2/5 rounded-md"></div>
    </div>
  );
}
