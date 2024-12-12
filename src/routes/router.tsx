import { Navigate, Route, Routes, useLocation } from "react-router";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";
import Course from "../pages/Course";

import Notification from "../components/notification";

import { AuthProvider } from "../contexts/authContext";
import { NotificationProvider } from "../contexts/notificationContext";
import { UserDataProvider } from "../contexts/userDataContext";
import MyCourses from "../pages/MyCourses";
import Refunds from "../pages/Refunds";
import { SidebarNav } from "../components/sideBarNav";
import Messages from "../pages/Messages";
import Private from "./private";

export const RouterApp = () => {
  const location = useLocation();

  const hideSidebarNav: string[] = ["/login", "/register"];

  const showSidebar = !hideSidebarNav.includes(location.pathname);

  return (
    <NotificationProvider>
      <UserDataProvider>
        <AuthProvider>
          <Notification />
          {showSidebar && <SidebarNav />}
          <Routes>
            <Route path="/" element={<Navigate to={"/login"} replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard/:uid"
              element={
                <Private>
                  <Dashboard />
                </Private>
              }
            />
            <Route
              path="course/:course"
              element={
                <Private>
                  <Course />
                </Private>
              }
            />
            <Route
              path="/mycourses/:uid"
              element={
                <Private>
                  <MyCourses />
                </Private>
              }
            />
            <Route
              path="/refunds"
              element={
                <Private>
                  <Refunds />
                </Private>
              }
            />
            <Route
              path="/messages"
              element={
                <Private>
                  <Messages />
                </Private>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </UserDataProvider>
    </NotificationProvider>
  );
};
