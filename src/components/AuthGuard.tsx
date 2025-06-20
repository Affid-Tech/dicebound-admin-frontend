import React from "react";
import {Navigate} from "react-router-dom";

export default function AuthGuard({ children }: Readonly<{ children: React.ReactNode }>) {
    const hasAuth = !!localStorage.getItem("basicAuth");
    if (!hasAuth) return <Navigate to="/login" replace />;
    return <>{children}</>;
}
