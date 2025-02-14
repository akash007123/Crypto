import "react-toastify/dist/ReactToastify.css";
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import RtlLayout from "layouts/rtl";
import AdminLayout from "layouts/admin";
import AuthLayout from "layouts/auth";
import { ToastContainer } from "react-toastify";
import ProtectedRoutes from "./components/ProtectedRoutes";
const App = () => {
  return (
    <>
      <Routes>
        <Route path="auth/*" element={<AuthLayout />} />
        <Route
          path="admin/*"
          element={
            <ProtectedRoutes>
              <AdminLayout />
            </ProtectedRoutes>
          }
        />
        <Route
          path="rtl/*"
          element={
            <ProtectedRoutes>
              <RtlLayout />
            </ProtectedRoutes>
          }
        />
        <Route path="/" element={<Navigate to="/admin" replace />} />
      </Routes>
      <ToastContainer
        className={
          "text-16 w-[320px] p-0 !font-poppins font-semibold lg:w-[500px]"
        }
        position="top-center"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        limit={3}
      />
    </>
  );
};

export default App;
