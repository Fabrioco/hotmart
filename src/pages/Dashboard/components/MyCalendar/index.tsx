import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Calendar.css";
import React from "react";

export const MyCalendar = () => {
  const [dateCalendar, setDateCalendar] = React.useState<Date>(new Date());

  return (
    <div className="w-full h-full p-4">
      <Calendar
        locale="pt-BR"
        className="w-full h-full"
        value={dateCalendar}
        onChange={(e) => setDateCalendar(e as Date)}
      />
    </div>
  );
};
