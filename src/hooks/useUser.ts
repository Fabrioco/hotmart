import React from "react";
import { UserDataContextType } from "../contexts/userDataContext";

export const UserDataContext = React.createContext<
  UserDataContextType | undefined
>(undefined);

export const useUser = (): UserDataContextType => {
  const context = React.useContext(UserDataContext);
  if (!context) {
    throw new Error("useUser deve ser usado dentro do UserDataProvider");
  }
  return context;
};
