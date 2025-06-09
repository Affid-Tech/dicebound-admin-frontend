import { useNavigate } from "react-router-dom";

const links = [
    { to: "/users", label: "Пользователи", desc: "Все участники и мастера" },
    { to: "/adventures", label: "Приключения", desc: "Кампания, oneshot'ы, статусы" },
    { to: "/currency-rates", label: "Курсы валют", desc: "Валюта, настройка оплаты" },
    // Можно добавить: { to: "/sessions", label: "Сессии", desc: "Все игровые сессии" },
    // { to: "/signups", label: "Заявки", desc: "Записи на приключения" },
];

export default function Dashboard() {
    const navigate = useNavigate();
    return (
        <div className="card" style={{ maxWidth: 700, textAlign: "center" }}>
            <h1 style={{ marginBottom: 12 }}>Добро пожаловать в Digital Dicebound Admin!</h1>
            <div style={{ opacity: 0.7, marginBottom: 32, fontSize: 18 }}>
                Выбери раздел для управления платформой.
            </div>
            <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 24,
                margin: "0 auto",
                maxWidth: 520,
            }}>
                {links.map(l => (
                    <button
                        key={l.to}
                        onClick={() => navigate(l.to)}
                        style={{
                            background: "linear-gradient(135deg, #28D8C4 0%, #B79FFF 100%)",
                            color: "#1B1033",
                            borderRadius: 20,
                            fontWeight: 600,
                            boxShadow: "0 2px 8px #0C081522",
                            cursor: "pointer",
                            padding: "32px 12px",
                            transition: "filter 0.2s, box-shadow 0.2s",
                            fontSize: 20,
                            border: "none",
                            width: "100%",
                            textAlign: "left",
                        }}
                    >
                        <div>{l.label}</div>
                        <div style={{ fontSize: 14, marginTop: 10, opacity: 0.8 }}>{l.desc}</div>
                    </button>
                ))}

            </div>
            <div style={{ marginTop: 40, opacity: 0.55, fontSize: 13 }}>
                Digital Dicebound — {new Date().getFullYear()}
            </div>
        </div>
    );
}
