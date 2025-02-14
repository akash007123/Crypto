import Cookies from "js-cookie";
import React from "react";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

const ProtectedRoutes = ({ children }) => {
  if (!Cookies.get("__admin__isLoggedIn")) {
    return <Navigate to="/auth/sign-in" />;
  }
  return children;
};

ProtectedRoutes.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoutes;
