import {BrowserRouter, Route, Routes, useLocation} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import UserList from "./pages/UserList";
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
import PageTransition from "./components/PageTransition.tsx";
import {Box} from "@mui/material";

function AppRoutes({ auth, handleLogin, handleLogout }: {
    auth: boolean;
    handleLogin: () => void;
    handleLogout: () => void;
}) {
    const location = useLocation();

    return (
        <Box sx={{display: "flex", flexDirection: "column", minHeight: "100vh"}}>
            {auth && (
                <NavigationBar handleLogout={handleLogout}/>
            )}
            <Box sx={{flex: 1}}>
                <PageTransition key={location.pathname}>
                    <Routes location={location}>
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
                        <Route
                            path="/"
                            element={
                                <AuthGuard>
                                    <Dashboard/>
                                </AuthGuard>
                            }
                        />
                    </Routes>
                </PageTransition>
            </Box>
            <Box
                component="footer"
                sx={{
                    py: 2,
                    opacity: 0.5,
                    fontSize: 13,
                    textAlign: "center",
                    mt: 8,
                }}
            >
                © Digital Dicebound — {new Date().getFullYear()}
            </Box>
        </Box>
    );
}

export default function App() {
    const [auth, setAuth] = useState(!!localStorage.getItem("basicAuth"));

    const handleLogin = () => setAuth(true);
    const handleLogout = () => setAuth(false);

    return (
        <BrowserRouter>
            <AppRoutes auth={auth} handleLogin={handleLogin} handleLogout={handleLogout} />
        </BrowserRouter>
    );
}
