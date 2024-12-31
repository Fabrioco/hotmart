import React from "react";
import { AuthContextType } from "../contexts/authContext";

export const AuthContext = React.createContext<AuthContextType>({} as AuthContextType);


export const useAuth = () => React.useContext(AuthContext);
