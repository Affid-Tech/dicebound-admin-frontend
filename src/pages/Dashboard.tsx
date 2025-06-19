import { useNavigate } from "react-router-dom";
import { Box, Button, Grid, Typography, Container } from "@mui/material";

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
        <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
            <Typography
                variant="h3"
                align="center"
                sx={{
                    fontWeight: 700,
                    mb: 2,
                    color: "primary.main",
                    letterSpacing: 0.5,
                }}
            >
                Добро пожаловать в Digital Dicebound Admin!
            </Typography>
            <Typography
                variant="h5"
                color="text.secondary"
                align="center"
                sx={{ mb: 5, fontWeight: 400 }}
            >
                Выбери раздел для управления платформой.
            </Typography>
            <Grid container spacing={4} justifyContent="center" sx={{ maxWidth: 600, mx: "auto" }}>
                {links.map((l) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={l.to}>
                        <Button
                            onClick={() => navigate(l.to)}
                            fullWidth
                            sx={{
                                height: 130,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                background: "linear-gradient(135deg, #F0F6FF 0%, #E3F6F5 100%)",
                                color: "#272748",
                                borderRadius: 3,
                                fontWeight: 600,
                                boxShadow: "0 2px 8px #0C081511",
                                padding: "24px 16px",
                                fontSize: 20,
                                textAlign: "left",
                                transition: "filter 0.2s, box-shadow 0.2s",
                                '&:hover': {
                                    filter: "brightness(0.98)",
                                    boxShadow: "0 4px 12px #0C081522",
                                    background: "linear-gradient(135deg, #E3F6F5 0%, #F0F6FF 100%)",
                                }
                            }}
                        >
                            <Typography
                                sx={{
                                    fontWeight: 700,
                                    textTransform: "uppercase",
                                    minHeight: 32,
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                {l.label}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "#7C8799",
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
            <Box sx={{ mt: 8, opacity: 0.5, fontSize: 13, textAlign: "center" }}>
                Digital Dicebound — {new Date().getFullYear()}
            </Box>
        </Container>
    );
}
