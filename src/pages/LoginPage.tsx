import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {setBasicAuth} from "../api/fetchWithAuth";

interface LoginPageProps {
    onLogin?: () => void
}

export default function LoginPage({onLogin}: Readonly<LoginPageProps>) {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        setBasicAuth(login, password);

        try {
            // Проверочный запрос — любой защищённый, напр. /api/users
            const res = await fetch("/api/users", {
                headers: {
                    Authorization: "Basic " + btoa(`${login}:${password}`),
                },
            });
            if (!res.ok) {
                throw new Error("Неверный логин или пароль");
            }
            if (onLogin) onLogin();
            navigate("/users");
        } catch (e: unknown) {
            if (e instanceof Error) {
                setError("Ошибка авторизации: " + e.message);
            } else {
                setError("Ошибка авторизации");
            }
        }
    };

    return (
        <div style={{padding: 32, maxWidth: 360, margin: "40px auto"}}>
            <h2>Вход администратора</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Логин"
                    value={login}
                    onChange={e => setLogin(e.target.value)}
                    style={{width: "100%", marginBottom: 12, padding: 8}}
                />
                <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    style={{width: "100%", marginBottom: 12, padding: 8}}
                />
                <button type="submit" style={{width: "100%"}}>Войти</button>
                {error && <div style={{color: "red", marginTop: 10}}>{error}</div>}
            </form>
        </div>
    );
}
