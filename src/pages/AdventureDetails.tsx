import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdventureService } from "../api/AdventureService";
import type { AdventureDto } from "../types/adventure";
import GameSessionList from "./GameSessionList";
import AdventureSignupList from "./AdventureSignupList";
import GameSessionForm from "./GameSessionForm";
import AdventureSignupForm from "./AdventureSignupForm";
import {
    Box,
    Typography,
    Button,
    Grid,
    Paper,
} from "@mui/material";

export default function AdventureDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [adventure, setAdventure] = useState<AdventureDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sessionsTick, setSessionsTick] = useState(0);
    const [signupsTick, setSignupsTick] = useState(0);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        AdventureService.get(id)
            .then(setAdventure)
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <Typography>Загрузка...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;
    if (!adventure) return <Typography>Нет данных</Typography>;

    return (
        <Paper elevation={3} sx={{ maxWidth: 700, mx: "auto", my: 4, p: { xs: 2, sm: 4 }, borderRadius: 3 }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
                {adventure.title}
                <Typography variant="subtitle1" component="span" sx={{ ml: 1, fontWeight: 400, opacity: 0.7 }}>
                    ({adventure.type})
                </Typography>
            </Typography>

            <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography>
                        <b>Система:</b> {adventure.gameSystem}
                    </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography>
                        <b>Мастер:</b> {adventure.dungeonMaster?.name || "-"}
                    </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <Typography>
                        <b>Описание:</b> {adventure.description ?? "-"}
                    </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography>
                        <b>Стартовый уровень:</b> {adventure.startLevel ?? "-"}
                    </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography>
                        <b>Игроки:</b> {adventure.minPlayers}–{adventure.maxPlayers}
                    </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography>
                        <b>Стоимость:</b> {adventure.priceUnits ? adventure.priceUnits + " 🪙" : "-"}
                    </Typography>
                </Grid>
            </Grid>

            {/* Session management */}
            <Box sx={{ mt: 5 }}>
                <GameSessionForm
                    adventureId={adventure.id}
                    onCancel={() => setSessionsTick(t => t + 1)}
                    onSaved={() => setSessionsTick(t => t + 1)}
                />
                <GameSessionList adventureId={adventure.id} key={sessionsTick} />
            </Box>

            {/* Signup management */}
            <Box sx={{ mt: 5 }}>
                <AdventureSignupForm
                    adventureId={adventure.id}
                    onCreated={() => setSignupsTick(t => t + 1)}
                />
                <AdventureSignupList adventureId={adventure.id} key={signupsTick} />
            </Box>

            {/* Action buttons */}
            <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate(`/adventures/${adventure.id}/edit`)}
                >
                    Редактировать
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => navigate("/adventures")}
                >
                    Назад к списку
                </Button>
            </Box>
        </Paper>
    );
}
