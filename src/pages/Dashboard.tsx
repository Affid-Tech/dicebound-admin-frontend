import { useNavigate } from "react-router-dom";
import { Box, Card, CardActionArea, CardContent, Container, Grid, Typography } from "@mui/material";

const links = [
    { to: "/users", label: "Пользователи", desc: "Все участники и мастера" },
    { to: "/adventures", label: "Приключения", desc: "Кампании, ваншоты, мультишоты" },
    { to: "/currency-rates", label: "Курсы валют", desc: "Курс валют к нашем токенам" },
    // { to: "/sessions", label: "Сессии", desc: "Все игровые сессии" },
    // { to: "/signups", label: "Заявки", desc: "Записи на приключения" },
];

export default function Dashboard() {
    const navigate = useNavigate();

    return (
        <Box sx={{ py: { xs: 3, md: 5 } }}>
            <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
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
                <Grid container spacing={4} justifyContent="center">
                    {links.map((l) => (
                        <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }} key={l.to}>
                            <Card
                                elevation={4}
                                sx={{
                                    height: 130,
                                    borderRadius: 3,
                                    boxShadow: "0 2px 8px #0C081511",
                                    background: "linear-gradient(135deg, #F0F6FF 0%, #E3F6F5 100%)",
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                <CardActionArea
                                    onClick={() => navigate(l.to)}
                                    sx={{
                                        height: "100%",
                                        borderRadius: 3,
                                        display: "flex",
                                        alignItems: "stretch",
                                        transition: "box-shadow 0.2s, filter 0.2s",
                                        '&:hover': {
                                            filter: "brightness(0.98)",
                                            boxShadow: "0 4px 12px #0C081522",
                                        }
                                    }}
                                >
                                    <CardContent sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "flex-start",
                                        justifyContent: "center",
                                        px: 2.5, py: 2.5
                                    }}>
                                        <Typography
                                            sx={{
                                                fontWeight: 700,
                                                textTransform: "uppercase",
                                                minHeight: 32,
                                                fontSize: 20,
                                                color: "#272748",
                                            }}
                                        >
                                            {l.label}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: "#7C8799",
                                                fontSize: 14,
                                                mt: 1,
                                            }}
                                        >
                                            {l.desc}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}
