import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const withAuthentication = (WrappedComponent, allowedRoles) => {
  return (props) => {
    // Sử dụng useSelector để lấy role từ Redux store
    const userInfo = useSelector((state) => state.user.userInfo);

    if (!userInfo || (allowedRoles && !allowedRoles.includes(userInfo.role))) {
      // Nếu người dùng không có thông tin hoặc role của họ không trong danh sách được phép, redirect họ
      return <Navigate to="/login" />;
    }

    // Nếu người dùng có role hợp lệ, render component
    return <WrappedComponent {...props} />;
  };
};

export default withAuthentication;
