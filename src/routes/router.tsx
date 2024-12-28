import { Navigate, Route, Routes, useLocation } from "react-router";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";
import Course from "../pages/Course";
import ForgotPassword from "../pages/ForgotPassword";
import MyCourses from "../pages/MyCourses";
import Refunds from "../pages/Refunds";
import Messages from "../pages/Messages";
import Admin from "../pages/Admin";
import Payment from "../pages/Payment";

import Notification from "../components/notification";
import { SidebarNav } from "../components/sideBarNav";

import { AuthProvider } from "../contexts/authContext";
import { NotificationProvider } from "../contexts/notificationContext";
import { UserDataProvider } from "../contexts/userDataContext";

import Private from "./private";
import { PrivateAdminRoute } from "./privateAdminRoute";
import Settings from "../pages/Settings";

export const RouterApp = () => {
  const location = useLocation();

  const hideSidebarNav: string[] = ["/login", "/register", "/forgot-password"];

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
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
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
              path="/mycourses"
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
            <Route
              path="/payment/:title"
              element={
                <Private>
                  <Payment />
                </Private>
              }
            />
            <Route
              path="/settings"
              element={
                <Private>
                  <Settings />
                </Private>
              }
            />
            <Route
              path="/admin"
              element={
                <PrivateAdminRoute>
                  <Admin />
                </PrivateAdminRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </UserDataProvider>
    </NotificationProvider>
  );
};
