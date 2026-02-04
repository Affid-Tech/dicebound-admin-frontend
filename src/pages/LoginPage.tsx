import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {setBasicAuth} from "../api/fetchWithAuth";
import {Alert, Box, Button, CardContent, Stack, TextField, Typography, useMediaQuery} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import GlassCard from "../components/GlassCard.tsx";
import LoadingSpinner from "../components/LoadingSpinner.tsx";
import {AnimatedListItem} from "../components/AnimatedList.tsx";
import {gradients} from "../theme/palette";

interface LoginPageProps {
    onLogin?: () => void;
}

export default function LoginPage({onLogin}: Readonly<LoginPageProps>) {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        setBasicAuth(login, password);

        try {
            const res = await fetch("/api/users", {
                headers: {
                    Authorization: "Basic " + btoa(`${login}:${password}`),
                },
            });
            if (!res.ok) {
                throw new Error("Неверный логин или пароль");
            }
            if (onLogin) onLogin();
            navigate("/");
        } catch (e: unknown) {
            if (e instanceof Error) {
                setError("Ошибка авторизации: " + e.message);
            } else {
                setError("Ошибка авторизации");
            }
        } finally {
            setLoading(false);
        }
    };

    const content = (
        <>
            <AnimatedListItem delay={0}>
                <Typography
                    variant="h4"
                    component="h2"
                    align="center"
                    gutterBottom
                    mb={4}
                    sx={{
                        background: gradients.iridescent,
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        fontWeight: 700,
                    }}
                >
                    Вход администратора
                </Typography>
            </AnimatedListItem>
            <Box component="form" onSubmit={handleSubmit} noValidate>
                <Stack>
                    <AnimatedListItem delay={0.1}>
                        <Stack direction="column" spacing={2} mb={2}>
                            <Typography variant="body1" align="left" gutterBottom>
                                Логин
                            </Typography>
                            <TextField
                                value={login}
                                onChange={e => setLogin(e.target.value)}
                                fullWidth
                                required
                                autoFocus
                                disabled={loading}
                            />
                        </Stack>
                    </AnimatedListItem>
                    <AnimatedListItem delay={0.2}>
                        <Stack direction="column" spacing={2} mb={4}>
                            <Typography variant="body1" align="left" gutterBottom>
                                Пароль
                            </Typography>
                            <TextField
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                fullWidth
                                required
                                disabled={loading}
                            />
                        </Stack>
                    </AnimatedListItem>

                    <AnimatedListItem delay={0.3}>
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={!login || !password || loading}
                            sx={{
                                py: 1.5,
                                fontSize: "1rem",
                            }}
                        >
                            {loading ? "Вход..." : "Войти"}
                        </Button>
                    </AnimatedListItem>

                    {error && (
                        <AnimatedListItem delay={0}>
                            <Alert severity="error" sx={{mt: 2}}>
                                {error}
                            </Alert>
                        </AnimatedListItem>
                    )}
                </Stack>
            </Box>
        </>
    );

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <LoadingSpinner text="Авторизация..." />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: "100%",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                py: 4,
            }}
        >
            {isMobile ? (
                <Box sx={{width: "100%", maxWidth: 360, px: 2}}>
                    {content}
                </Box>
            ) : (
                <GlassCard
                    hoverable={false}
                    sx={{maxWidth: 400, width: "100%"}}
                    padding={4}
                >
                    <CardContent sx={{p: 0}}>
                        {content}
                    </CardContent>
                </GlassCard>
            )}
        </Box>
    );
}
