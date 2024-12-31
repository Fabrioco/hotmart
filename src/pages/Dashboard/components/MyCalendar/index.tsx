import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Calendar.css";
import { FaX } from "react-icons/fa6";
import { useNotification } from "../../../../contexts/notificationContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../services/firebaseConnection";
import { useUser } from "../../../../hooks/useUser";

type EventProps = {
  date: string;
  title: string;
  description: string;
  hour: string;
};

export const MyCalendar = () => {
  const { showNotification } = useNotification();
  const { user } = useUser();

  const [dateCalendar, setDateCalendar] = React.useState<Date>(new Date());
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [titleEvent, setTitleEvent] = React.useState<string>("");
  const [descEvent, setDescEvent] = React.useState<string>("");
  const [hourEvent, setHourEvent] = React.useState<string>("");
  const [events, setEvents] = React.useState<EventProps[]>([]);
  const [selectedEvent, setSelectedEvent] = React.useState<EventProps | null>(
    null
  );

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/\D/g, "");
    if (input.length >= 3) input = input.replace(/^(\d{2})(\d{0,2})/, "$1:$2");
    if (input.length > 5) input = input.slice(0, 5);
    setHourEvent(input);
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const openModal = () => {
    const eventOnDate = events.find(
      (event) => event.date === formatDate(dateCalendar)
    );

    setSelectedEvent(null);

    if (eventOnDate) {
      setSelectedEvent(eventOnDate);
    } else if (
      new Date(formatDate(dateCalendar)) < new Date(formatDate(new Date()))
    ) {
      showNotification(
        "Não é possível agendar eventos em datas passadas",
        "error"
      );
    } else if (!user?.isAdmin) {
      showNotification(
        "Somente administradores podem registrar novos eventos.",
        "error"
      );
    } else {
      setIsModalOpen(true);
    }
  };

  const handleRegisterEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.isAdmin) {
      showNotification(
        "Apenas administradores podem registrar eventos.",
        "error"
      );
      return;
    }

    if (!titleEvent || !descEvent || !hourEvent) {
      showNotification(
        "Preencha todos os campos para registrar o evento.",
        "error"
      );
      return;
    }

    const newEvent = {
      id: events.length + 1,
      title: titleEvent,
      description: descEvent,
      hour: hourEvent,
      date: formatDate(dateCalendar),
    };

    setEvents((prevEvents) => [...prevEvents, newEvent]);
    setTitleEvent("");
    setDescEvent("");
    setHourEvent("");
    setIsModalOpen(false);
    showNotification("Evento registrado com sucesso!", "success");
  };

  const fetchEvents = async () => {
    try {
      const eventsCollection = await getDocs(collection(db, "events"));
      const eventsArray: EventProps[] = [];
      eventsCollection.forEach((doc) => {
        eventsArray.push(doc.data() as EventProps);
      });
      setEvents(eventsArray);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    fetchEvents();
  }, []);

  const getTileContent = ({ date }: { date: Date }) => {
    const formattedDate = formatDate(date);
    const dayEvents = events.filter((event) => event.date === formattedDate);

    return dayEvents.length > 0 ? (
      <div
        style={{
          textAlign: "center",
          color: "white",
          background: "blue",
          borderRadius: "50%",
          width: "20px",
          height: "20px",
          lineHeight: "20px",
          fontSize: "10px",
          margin: "auto",
        }}
      >
        {dayEvents.length}
      </div>
    ) : null;
  };

  return (
    <>
      <div className="w-full h-full p-4">
        <Calendar
          locale="pt-BR"
          className="w-full h-full"
          value={dateCalendar}
          onChange={(e) => setDateCalendar(e as Date)}
          onClickDay={openModal}
          tileContent={getTileContent}
        />
      </div>
      {/* MODAL */}
      <div
        className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity ${
          isModalOpen || selectedEvent
            ? "opacity-100 visible"
            : "opacity-0 invisible"
        }`}
      >
        <div className="w-1/2 h-1/2 rounded-md bg-white flex flex-col items-center justify-center shadow-xl relative">
          <i
            className="cursor-pointer absolute top-2 right-2"
            onClick={() => {
              setIsModalOpen(false);
              setSelectedEvent(null);
            }}
          >
            <FaX size={30} color="#000" />
          </i>
          {selectedEvent ? (
            <>
              <h1 className="text-2xl font-primary">{selectedEvent.title}</h1>
              <p className="text-lg text-gray-500 font-secondary">
                {selectedEvent.description}
              </p>
              <p className="text-lg font-secondary">
                Horário: {selectedEvent.hour}
              </p>
              <p className="text-lg font-secondary">
                Data: {selectedEvent.date}
              </p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-primary">
                Agendar lançamento de curso
              </h1>
              <p className="text-lg text-gray-500 font-secondary">
                O evento será marcado para o dia: {formatDate(dateCalendar)}
              </p>
              <form
                className="flex flex-col w-11/12 gap-2 mt-3"
                onSubmit={handleRegisterEvent}
              >
                <input
                  type="text"
                  placeholder="Titulo"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  value={titleEvent}
                  onChange={(e) => setTitleEvent(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Descricão"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  value={descEvent}
                  onChange={(e) => setDescEvent(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Horário"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  value={hourEvent}
                  onChange={handleHourChange}
                />
                <button
                  className="w-full p-2 bg-gray-200 rounded-md hover:bg-gray-300 active:bg-gray-400"
                  type="submit"
                >
                  Agendar
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
};
