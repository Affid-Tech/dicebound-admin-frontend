import { AppBar, Button, Stack, Toolbar } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import LogoutButton from "./LogoutButton.tsx";

interface NavigationBarProps {
    handleLogout?: () => void;
}

const navLinks = [
    { to: "/", label: "🏠 Главная", main: true },
    { to: "/users", label: "Пользователи" },
    { to: "/adventures", label: "Приключения" },
    { to: "/currency-rates", label: "Курсы валют" },
];

export default function NavigationBar({ handleLogout }: Readonly<NavigationBarProps>) {
    const location = useLocation();

    return (
        <AppBar
            position="sticky"
            elevation={2}
            sx={{
                background: "#1B1033",
                color: "#fff",
                borderRadius: 0,
                borderBottom: "3px solid #28D8C4",
                boxShadow: "0 2px 12px 0 #0C081522",
            }}
        >
            <Toolbar sx={{ py: 1, px: 3, display: "flex", justifyContent: "space-between" }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    {navLinks.map(({ to, label, main }) => (
                        <Button
                            key={to}
                            component={Link}
                            to={to}
                            color="inherit"
                            sx={{
                                fontWeight: main ? 700 : 600,
                                fontSize: main ? 22 : "inherit",
                                color: location.pathname === to ? "#28D8C4" : "#fff",
                                textTransform: "none",
                                borderBottom:   "none",
                                px: 2,
                                minWidth: main ? "unset" : 40,
                            }}
                        >
                            {label}
                        </Button>
                    ))}
                </Stack>
                <div>
                    <LogoutButton onLogout={handleLogout} />
                </div>
            </Toolbar>
        </AppBar>
    );
}
