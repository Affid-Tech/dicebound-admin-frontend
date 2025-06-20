import {AppBar, Button, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText, Stack, Toolbar, useMediaQuery, useTheme} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import {Link, useLocation} from "react-router-dom";
import {useState} from "react";
import LogoutButton from "./LogoutButton.tsx";

interface NavigationBarProps {
    handleLogout?: () => void;
}

const navLinks = [
    {to: "/", label: "🏠 Главная", main: true},
    {to: "/users", label: "Пользователи"},
    {to: "/adventures", label: "Приключения"},
    {to: "/currency-rates", label: "Курсы валют"},
];

export default function NavigationBar({handleLogout}: Readonly<NavigationBarProps>) {
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [drawerOpen, setDrawerOpen] = useState(false);

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
            <Toolbar sx={{py: 1, px: 3, display: "flex", justifyContent: "space-between"}}>
                {isMobile ? (
                    <>
                        <IconButton
                            color="inherit"
                            onClick={() => setDrawerOpen(true)}
                            edge="start"
                            sx={{mr: 2}}
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Drawer
                            anchor="left"
                            open={drawerOpen}
                            onClose={() => setDrawerOpen(false)}
                        >
                            <Stack direction="column" justifyContent="space-between" height="100%">
                                <List sx={{minWidth: 220, pt: 2}}>
                                    {navLinks.map(({to, label}) => (
                                        <ListItem key={to} disablePadding>
                                            <ListItemButton
                                                component={Link}
                                                to={to}
                                                selected={location.pathname === to}
                                                onClick={() => setDrawerOpen(false)}
                                            >
                                                <ListItemText primary={label}/>
                                            </ListItemButton>
                                        </ListItem>
                                    ))}
                                </List>

                                <LogoutButton onLogout={handleLogout}/>
                            </Stack>
                        </Drawer>
                    </>
                ) : (
                    <>
                        <Stack direction="row" spacing={2} alignItems="center">
                            {navLinks.map(({to, label, main}) => (
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
                                        borderBottom: "none",
                                        px: 2,
                                        minWidth: main ? "unset" : 40,
                                    }}
                                >
                                    {label}
                                </Button>
                            ))}
                        </Stack>
                        <div>
                            <LogoutButton onLogout={handleLogout}/>
                        </div>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
}
