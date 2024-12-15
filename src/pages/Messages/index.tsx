import { collection, getDocs } from "firebase/firestore";
import React from "react";
import { db } from "../../services/firebaseConnection";

type Message = {
  title: string;
  description: string;
  date: string;
  hour: string;
};

export default function Messages() {
  const [messages, setMessages] = React.useState<Message[]>([]);

  const loadMessages = async () => {
    await getDocs(collection(db, "notifications")).then((snapshot) => {
      setMessages(snapshot.docs.map((doc) => doc.data()) as Message[]);
    });
  };

  React.useEffect(() => {
    loadMessages();
  }, []);

  return (
    <div className="w-full h-full flex flex-row  bg-white rounded-2xl overflow-x-hidden">
      <div className="w-full h-full rounded-br-2xl overflow-y-hidden">
        <div className="w-full h-32 bg-white rounded-tr-2xl flex items-center border-b border-gray-300">
          <img
            src="https://via.placeholder.com/150"
            alt="foto do professor"
            className="p-4 rounded-full h-full w-auto"
          />
          <p className="text-2xl font-secondary">Nome do professor</p>
        </div>
        <div className="w-full h-full bg-gray-50 p-4">
          {messages.map((message) => (
            <div className="bg-white w-8/12 h-auto rounded-md border border-gray-400 shadow-2xl px-4 py-2 mt-4 flex justify-between">
              <p className="font-secondary text-2xl">{message.description}</p>
              <div>
                <p className="font-tertiary text-xl">{message.date}</p>
                <p className="font-tertiary text-xl">{message.hour}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
