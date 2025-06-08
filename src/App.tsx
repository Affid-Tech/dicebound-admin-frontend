import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import UserList from "./pages/UserList"; // и другие страницы
import AuthGuard from "./components/AuthGuard";
import LogoutButton from "./components/LogoutButton";
import UserForm from "./pages/UserForm.tsx";
import "./App.css";

export default function App() {
    return (
        <BrowserRouter>
            <div>
                {localStorage.getItem("basicAuth") && <LogoutButton />}
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                        path="/users"
                        element={
                            <AuthGuard>
                                <UserList />
                            </AuthGuard>
                        }
                    />
                    <Route
                        path="/users/new"
                        element={
                            <AuthGuard>
                                <UserForm />
                            </AuthGuard>
                        }
                    />
                    <Route
                        path="/users/:id"
                        element={
                            <AuthGuard>
                                <UserForm />
                            </AuthGuard>
                        }
                    />
                    <Route path="/" element={<Navigate to="/users" replace />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}
