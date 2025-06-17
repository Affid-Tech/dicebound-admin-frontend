import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {setBasicAuth} from "../api/fetchWithAuth";
import {Alert, Box, Button, Card, CardContent, Stack, TextField, Typography} from "@mui/material";

interface LoginPageProps {
    onLogin?: () => void;
}

export default function LoginPage({ onLogin }: Readonly<LoginPageProps>) {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

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

    return (
        <Card sx={{ maxWidth: 360, mx: "auto", mt: 7, p: 2 }}>
            <CardContent>
                <Typography variant="h6" component="h2" align="center" gutterBottom>
                    Вход администратора
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Stack spacing={2}>
                        <TextField
                            label="Логин"
                            value={login}
                            onChange={e => setLogin(e.target.value)}
                            fullWidth
                            required
                            autoFocus
                        />
                        <TextField
                            label="Пароль"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            fullWidth
                            required
                        />
                        <Button type="submit" variant="contained" fullWidth>
                            Войти
                        </Button>
                        {error && <Alert severity="error">{error}</Alert>}
                    </Stack>
                </Box>
            </CardContent>
        </Card>
    );
}
