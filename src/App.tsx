import {BrowserRouter, Route, Routes} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import UserList from "./pages/UserList"; // и другие страницы
import AuthGuard from "./components/AuthGuard";
import UserForm from "./pages/UserForm.tsx";
import "./App.css";
import CurrencyRateList from "./pages/CurrencyRateList";
import CurrencyRateForm from "./pages/CurrencyRateForm";
import {useState} from "react";
import AdventureList from "./pages/AdventureList.tsx";
import AdventureDetails from "./pages/AdventureDetails.tsx";
import AdventureForm from "./pages/AdventureForm.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import NavigationBar from "./components/NavigationBar.tsx";

export default function App() {

    const [auth, setAuth] = useState(!!localStorage.getItem("basicAuth"));

    // Используй setAuth после login/logout:
    const handleLogin = () => setAuth(true);
    const handleLogout = () => setAuth(false);

    return (
        <BrowserRouter>
            {auth && (
                <NavigationBar handleLogout={handleLogout}/>
            )}
            <Routes>
                <Route path="/login" element={<LoginPage onLogin={handleLogin}/>}/>
                <Route
                    path="/users"
                    element={
                        <AuthGuard>
                            <UserList/>
                        </AuthGuard>
                    }
                />
                <Route
                    path="/users/new"
                    element={
                        <AuthGuard>
                            <UserForm/>
                        </AuthGuard>
                    }
                />
                <Route
                    path="/users/:id"
                    element={
                        <AuthGuard>
                            <UserForm/>
                        </AuthGuard>
                    }
                />
                <Route
                    path="/currency-rates"
                    element={
                        <AuthGuard>
                            <CurrencyRateList/>
                        </AuthGuard>
                    }
                />
                <Route
                    path="/currency-rates/new"
                    element={
                        <AuthGuard>
                            <CurrencyRateForm/>
                        </AuthGuard>
                    }
                />
                <Route
                    path="/currency-rates/:currency"
                    element={
                        <AuthGuard>
                            <CurrencyRateForm/>
                        </AuthGuard>
                    }
                />
                <Route
                    path="/adventures"
                    element={
                        <AuthGuard>
                            <AdventureList/>
                        </AuthGuard>
                    }
                />
                <Route
                    path="/adventures/new"
                    element={
                        <AuthGuard>
                            <AdventureForm mode="create"/>
                        </AuthGuard>
                    }
                />
                <Route
                    path="/adventures/:id"
                    element={
                        <AuthGuard>
                            <AdventureDetails/>
                        </AuthGuard>
                    }
                />
                <Route
                    path="/adventures/:id/edit"
                    element={
                        <AuthGuard>
                            <AdventureForm mode="edit"/>
                        </AuthGuard>
                    }
                />
                {/* Глобальные страницы списка всех сессий/заявок если нужны: */}
                {/* <Route path="/sessions" element={<GameSessionListGlobal />} /> */}
                {/* <Route path="/signups" element={<AdventureSignupListGlobal />} /> */}
                <Route
                    path="/"
                    element={
                        <AuthGuard>
                            <Dashboard/>
                        </AuthGuard>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}
