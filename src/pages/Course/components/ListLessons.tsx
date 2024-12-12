export const ListLessons = () => {
  return (
    <div className="flex flex-col w-3/12 h-full font-secondary ">
      <h1 className="text-2xl text-center mt-4 border-b border-gray-300">
        Aulas
      </h1>
      <div className="flex flex-col w-full h-full">
        <div className="w-full h-20 border-b border-gray-400 flex items-center px-4 py-2 gap-4 cursor-pointer">
          <input
            type="checkbox"
            name="checkboxLesson"
            id="checkboxLesson1"
            className="w-5 h-5"
          />
          <label htmlFor="checkboxLesson1">Nome da aula 1</label>
        </div>
        <div className="w-full h-20 border-b border-gray-400 flex items-center px-4 py-2 gap-4 cursor-pointer">
          <input
            type="checkbox"
            name="checkboxLesson"
            id="checkboxLesson2"
            className="w-5 h-5"
          />
          <label htmlFor="checkboxLesson2">Nome da aula 2</label>
        </div>
        <div className="w-full h-20 border-b border-gray-400 flex items-center px-4 py-2 gap-4 cursor-pointer">
          <input
            type="checkbox"
            name="checkboxLesson"
            id="checkboxLesson3"
            className="w-5 h-5"
          />
          <label htmlFor="checkboxLesson3">Nome da aula 3</label>
        </div>
        <div className="w-full h-20 border-b border-gray-400 flex items-center px-4 py-2 gap-4 cursor-pointer">
          <input
            type="checkbox"
            name="checkboxLesson"
            id="checkboxLesson4"
            className="w-5 h-5"
          />
          <label htmlFor="checkboxLesson4">Nome da aula 4</label>
        </div>
        <div className="w-full h-20 border-b border-gray-400 flex items-center px-4 py-2 gap-4 cursor-pointer">
          <input
            type="checkbox"
            name="checkboxLesson"
            id="checkboxLesson5"
            className="w-5 h-5"
          />
          <label htmlFor="checkboxLesson5">Nome da aula 5</label>
        </div>
        <div className="w-full h-20 border-b border-gray-400 flex items-center px-4 py-2 gap-4 cursor-pointer">
          <input
            type="checkbox"
            name="checkboxLesson"
            id="checkboxLesson6"
            className="w-5 h-5"
          />
          <label htmlFor="checkboxLesson6">Nome da aula 6</label>
        </div>
      </div>
    </div>
  );
};
