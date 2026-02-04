import {useNavigate} from "react-router-dom";
import {Box, CardActionArea, CardContent, Container, Grid, Typography} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import GlassCard from "../components/GlassCard.tsx";
import {AnimatedListItem} from "../components/AnimatedList.tsx";
import {gradients, brand} from "../theme/palette";

const links = [
    {to: "/users", label: "Пользователи", desc: "Все участники и мастера"},
    {to: "/adventures", label: "Приключения", desc: "Кампании, ваншоты, мультишоты"},
    {to: "/currency-rates", label: "Курсы валют", desc: "Курс валют к нашем токенам"},
];

export default function Dashboard() {
    const navigate = useNavigate();
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    return (
        <Box sx={{py: {xs: 3, md: 5}}}>
            <Container maxWidth="lg" sx={{py: {xs: 4, md: 6}}}>
                <AnimatedListItem delay={0}>
                    <Typography
                        variant="h3"
                        align="center"
                        sx={{
                            fontWeight: 700,
                            mb: 2,
                            background: gradients.iridescent,
                            backgroundClip: "text",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            letterSpacing: 0.5,
                        }}
                    >
                        Добро пожаловать в Digital Dicebound Admin!
                    </Typography>
                </AnimatedListItem>
                <AnimatedListItem delay={0.1}>
                    <Typography
                        variant="h5"
                        color="text.secondary"
                        align="center"
                        sx={{mb: 5, fontWeight: 400}}
                    >
                        Выбери раздел для управления платформой.
                    </Typography>
                </AnimatedListItem>
                <Grid container spacing={4} justifyContent="center">
                    {links.map((l, index) => (
                        <Grid size={{xs: 12, sm: 12, md: 6, lg: 4}} key={l.to}>
                            <AnimatedListItem delay={0.2 + index * 0.1}>
                                <GlassCard
                                    hoverable
                                    padding={0}
                                    glowColor={isDark
                                        ? `rgba(183, 159, 255, 0.25)`
                                        : `rgba(40, 216, 196, 0.2)`
                                    }
                                    sx={{
                                        height: 140,
                                        cursor: "pointer",
                                    }}
                                >
                                    <CardActionArea
                                        onClick={() => navigate(l.to)}
                                        sx={{
                                            height: "100%",
                                            borderRadius: "24px",
                                            display: "flex",
                                            alignItems: "stretch",
                                        }}
                                    >
                                        <CardContent sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "flex-start",
                                            justifyContent: "center",
                                            px: 3,
                                            py: 3,
                                            width: "100%",
                                        }}>
                                            <Typography
                                                sx={{
                                                    width: "100%",
                                                    fontWeight: 700,
                                                    textTransform: "uppercase",
                                                    minHeight: 32,
                                                    fontSize: 20,
                                                    color: isDark ? brand.teal : "text.primary",
                                                    textAlign: "center"
                                                }}
                                            >
                                                {l.label}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    width: "100%",
                                                    color: "text.secondary",
                                                    fontSize: 14,
                                                    mt: 1,
                                                    textAlign: "center"
                                                }}
                                            >
                                                {l.desc}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </GlassCard>
                            </AnimatedListItem>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}
