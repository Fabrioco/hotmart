
export default function Messages() {
  return (
    <div className="w-full h-full flex flex-row  bg-white rounded-2xl overflow-x-hidden">
      <div className="w-9/12 h-full rounded-br-2xl overflow-y-hidden">
        <div className="w-full h-32 bg-white rounded-tr-2xl flex items-center border-b border-gray-300">
          <img
            src="https://via.placeholder.com/150"
            alt="foto do professor"
            className="p-4 rounded-full h-full w-auto"
          />
          <p className="text-2xl font-secondary">Nome do professor</p>
        </div>
        <div className="w-full h-full bg-gray-50 p-4">
          <div className="bg-white w-8/12 h-auto rounded-md border border-gray-400 shadow-2xl px-4 py-2">
            <p className="font-secondary">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
              expedita dignissimos mollitia nemo, pariatur fugiat assumenda
              molestias iusto nihil excepturi labore eos beatae nam laboriosam,
              quasi, rem quas modi? Iusto?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
