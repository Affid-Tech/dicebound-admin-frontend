import {
    AppBar,
    Button,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Stack,
    Toolbar,
    useMediaQuery,
} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import {Link, useLocation} from "react-router-dom";
import {useState} from "react";
import LogoutButton from "./LogoutButton.tsx";
import ThemeToggle from "./ThemeToggle.tsx";
import {brand, glass} from "../theme/palette";

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

    const isDark = theme.palette.mode === "dark";

    // Glass styling for AppBar
    const glassBackground = isDark
        ? "rgba(27, 16, 51, 0.85)"
        : "rgba(27, 16, 51, 0.95)";

    const glassBorder = isDark
        ? `rgba(183, 159, 255, 0.2)`
        : brand.teal;

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                background: glassBackground,
                backdropFilter: glass.blur,
                WebkitBackdropFilter: glass.blur,
                color: "#fff",
                borderRadius: 0,
                borderBottom: `2px solid ${glassBorder}`,
                boxShadow: isDark
                    ? "0 4px 20px rgba(0, 0, 0, 0.4)"
                    : "0 4px 20px rgba(12, 8, 21, 0.15)",
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
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <ThemeToggle iconColor="#fff" />
                        </Stack>
                        <Drawer
                            anchor="left"
                            open={drawerOpen}
                            onClose={() => setDrawerOpen(false)}
                            PaperProps={{
                                sx: {
                                    background: isDark
                                        ? "rgba(21, 15, 31, 0.95)"
                                        : "rgba(255, 255, 255, 0.95)",
                                    backdropFilter: glass.blur,
                                    WebkitBackdropFilter: glass.blur,
                                },
                            }}
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
                                                sx={{
                                                    "&.Mui-selected": {
                                                        backgroundColor: `${brand.teal}15`,
                                                        borderLeft: `3px solid ${brand.teal}`,
                                                    },
                                                    "&:hover": {
                                                        backgroundColor: `${brand.teal}10`,
                                                    },
                                                }}
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
                                        color: location.pathname === to ? brand.teal : "#fff",
                                        textTransform: "none",
                                        borderBottom: location.pathname === to
                                            ? `2px solid ${brand.teal}`
                                            : "2px solid transparent",
                                        borderRadius: 0,
                                        px: 2,
                                        minWidth: main ? "unset" : 40,
                                        transition: "all 0.2s ease",
                                        "&:hover": {
                                            color: brand.teal,
                                            backgroundColor: "transparent",
                                        },
                                    }}
                                >
                                    {label}
                                </Button>
                            ))}
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <ThemeToggle iconColor="#fff" />
                            <LogoutButton onLogout={handleLogout}/>
                        </Stack>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
}
