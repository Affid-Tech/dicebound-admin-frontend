import {useNavigate} from "react-router-dom";
import {Box, Button, Card, CardContent, Grid, Typography} from "@mui/material";

const links = [
    { to: "/users", label: "Пользователи", desc: "Все участники и мастера" },
    { to: "/adventures", label: "Приключения", desc: "Кампания, oneshot'ы, статусы" },
    { to: "/currency-rates", label: "Курсы валют", desc: "Валюта, настройка оплаты" },
    // { to: "/sessions", label: "Сессии", desc: "Все игровые сессии" },
    // { to: "/signups", label: "Заявки", desc: "Записи на приключения" },
];

export default function Dashboard() {
    const navigate = useNavigate();

    return (
        <Card sx={{ maxWidth: 700, mx: "auto", mt: 6, p: 3 }}>
            <CardContent>
                <Typography variant="h4" gutterBottom align="center" sx={{ mb: 1 }}>
                    Добро пожаловать в Digital Dicebound Admin!
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" align="center" sx={{ mb: 4 }}>
                    Выбери раздел для управления платформой.
                </Typography>

                <Grid container spacing={3} justifyContent="center" sx={{ maxWidth: 520, mx: "auto" }}>
                    {links.map(l => (
                        <Grid size={{ xs: 12, sm: 6 }} key={l.to}>
                            <Button
                                onClick={() => navigate(l.to)}
                                fullWidth
                                sx={{
                                    height: 130,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "flex-start", // важно!
                                    alignItems: "flex-start",
                                    background: "linear-gradient(135deg, #28D8C4 0%, #B79FFF 100%)",
                                    color: "#f5f5f5",
                                    borderRadius: 3,
                                    fontWeight: 600,
                                    boxShadow: "0 2px 8px #0C081522",
                                    padding: "24px 12px",
                                    fontSize: 20,
                                    textAlign: "left",
                                    transition: "filter 0.2s, box-shadow 0.2s",
                                    '&:hover': {
                                        filter: "brightness(0.98)",
                                        boxShadow: "0 4px 12px #0C081533",
                                        background: "linear-gradient(135deg, #2ae8e4 0%, #a07fff 100%)",
                                    }
                                }}
                            >
                                {/* Заголовок */}
                                <Typography
                                    sx={{
                                        fontWeight: 700,
                                        textTransform: "uppercase",
                                        minHeight: 32, // выстави под нужный тебе размер!
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    {l.label}
                                </Typography>
                                {/* Описание */}
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: "#eeebf3",
                                        fontSize: 14,
                                        mt: 1
                                    }}
                                >
                                    {l.desc}
                                </Typography>
                            </Button>


                        </Grid>
                    ))}
                </Grid>

                <Box sx={{ mt: 5, opacity: 0.55, fontSize: 13, textAlign: "center" }}>
                    Digital Dicebound — {new Date().getFullYear()}
                </Box>
            </CardContent>
        </Card>
    );
}
