import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {setBasicAuth} from "../api/fetchWithAuth";
import {Alert, Box, Button, Card, CardContent, Stack, TextField, Typography, useMediaQuery} from "@mui/material";
import {useTheme} from "@mui/material/styles";

interface LoginPageProps {
    onLogin?: () => void;
}

export default function LoginPage({ onLogin }: Readonly<LoginPageProps>) {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

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
        }
    };

    const content = (
        <>
            <Typography variant="h4" component="h2" align="center" gutterBottom mb={4}>
                Вход администратора
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate>
                <Stack>
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
                        />
                    </Stack>
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
                        />
                    </Stack>

                    <Button type="submit" variant="contained" fullWidth disabled={!login || !password}>
                        Войти
                    </Button>
                    {error && <Alert severity="error">{error}</Alert>}
                </Stack>
            </Box>
        </>
    );

    return (
        <Box
            sx={{
                minHeight: "100%",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            {isMobile ? (
                <Box sx={{ width: "100%", maxWidth: 360, px: 2 }}>
                    {content}
                </Box>
            ) : (
                <Card sx={{ maxWidth: 360, width: "100%", p: 2 }}>
                    <CardContent>
                        {content}
                    </CardContent>
                </Card>
            )}
        </Box>
    );
}
