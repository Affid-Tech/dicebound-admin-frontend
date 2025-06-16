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
    Divider,
    Chip,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import PeopleIcon from "@mui/icons-material/People";
import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoin";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

const adventureTypeColors: Record<string, "primary" | "secondary" | "success"> = {
    ONESHOT: "primary",
    MULTISHOT: "secondary",
    CAMPAIGN: "success",
};

export default function AdventureDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [adventure, setAdventure] = useState<AdventureDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sessionsTick, setSessionsTick] = useState(0);
    const [signupsTick, setSignupsTick] = useState(0);

    // Modal controls
    const [openSessionModal, setOpenSessionModal] = useState(false);
    const [openSignupModal, setOpenSignupModal] = useState(false);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        AdventureService.get(id)
            .then(setAdventure)
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading)
        return (
            <Box sx={{ py: 6, textAlign: "center" }}>
                <Typography variant="h6">Загрузка...</Typography>
            </Box>
        );
    if (error)
        return (
            <Box sx={{ py: 6, textAlign: "center" }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    if (!adventure)
        return (
            <Box sx={{ py: 6, textAlign: "center" }}>
                <Typography>Нет данных</Typography>
            </Box>
        );

    return (
        <Paper elevation={3} sx={{ maxWidth: 700, mx: "auto", my: 4, p: { xs: 2, sm: 4 }, borderRadius: 3 }}>
            {/* Adventure Info */}
            <Typography variant="h4" sx={{ mb: 1, display: "flex", alignItems: "center" }}>
                {adventure.title}
                <Tooltip title="Тип приключения" arrow>
                    <Chip
                        label={adventure.type}
                        color={adventureTypeColors[adventure.type] || "default"}
                        size="small"
                        sx={{ ml: 2, fontWeight: 500, letterSpacing: 1, textTransform: "uppercase" }}
                    />
                </Tooltip>
            </Typography>

            <Typography variant="subtitle2" sx={{ color: "text.secondary", mb: 1, display: "flex", alignItems: "center" }}>
                <InfoOutlinedIcon sx={{ mr: 1, fontSize: 20, color: "info.main" }} />
                Информация о приключении
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Tooltip title="Игровая система" arrow>
                        <Typography sx={{ display: "flex", alignItems: "center" }}>
                            <SportsEsportsIcon sx={{ mr: 1, fontSize: 20, color: "primary.main" }} />
                            <b>Система:</b>&nbsp;{adventure.gameSystem}
                        </Typography>
                    </Tooltip>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Tooltip title="Ведущий мастер" arrow>
                        <Typography sx={{ display: "flex", alignItems: "center" }}>
                            <PersonIcon sx={{ mr: 1, fontSize: 20, color: "secondary.main" }} />
                            <b>Мастер:</b>&nbsp;{adventure.dungeonMaster?.name || "-"}
                        </Typography>
                    </Tooltip>
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <Typography sx={{ display: "flex", alignItems: "center" }}>
                        <InfoOutlinedIcon sx={{ mr: 1, fontSize: 20, color: "info.main" }} />
                        <b>Описание:</b><br />
                    </Typography>
                    <Typography sx={{ textAlign: "left", whiteSpace: 'pre-line' }}>
                        {adventure.description ?? "-"}
                    </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ display: "flex", alignItems: "center" }}>
                        <SignalCellularAltIcon sx={{ mr: 1, fontSize: 20, color: "info.main" }} />
                        <b>Стартовый уровень:</b>&nbsp;{adventure.startLevel ?? "-"}
                    </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Tooltip title="Количество игроков" arrow>
                        <Typography sx={{ display: "flex", alignItems: "center" }}>
                            <PeopleIcon sx={{ mr: 1, fontSize: 20, color: "success.main" }} />
                            <b>Игроки:</b>&nbsp;{adventure.minPlayers}–{adventure.maxPlayers}
                        </Typography>
                    </Tooltip>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Tooltip title="Стоимость участия" arrow>
                        <Typography sx={{ display: "flex", alignItems: "center" }}>
                            <CurrencyBitcoinIcon sx={{ mr: 1, fontSize: 20, color: "warning.main" }} />
                            <b>Стоимость:</b>&nbsp;
                            {adventure.priceUnits ? adventure.priceUnits + " 🪙" : "-"}
                        </Typography>
                    </Tooltip>
                </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Sessions */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Сессии
                </Typography>
                <Button
                    startIcon={<AddIcon />}
                    variant="contained"
                    size="small"
                    onClick={() => setOpenSessionModal(true)}
                >
                    Добавить сессию
                </Button>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Здесь можно добавить или отредактировать игровые сессии для этого приключения.
            </Typography>
            <Box sx={{ mb: 5 }}>
                <GameSessionList adventureId={adventure.id} key={sessionsTick} />
            </Box>
            <Dialog open={openSessionModal} onClose={() => setOpenSessionModal(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    Новая сессия
                    <IconButton
                        aria-label="close"
                        onClick={() => setOpenSessionModal(false)}
                        sx={{ position: "absolute", right: 8, top: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <GameSessionForm
                        adventureId={adventure.id}
                        onSaved={() => {
                            setOpenSessionModal(false);
                            setSessionsTick(t => t + 1);
                        }}
                        onCancel={() => setOpenSessionModal(false)}
                    />
                </DialogContent>
            </Dialog>

            <Divider sx={{ my: 3 }} />

            {/* Signups */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Заявки на игру
                </Typography>
                <Button
                    startIcon={<AddIcon />}
                    variant="contained"
                    size="small"
                    onClick={() => setOpenSignupModal(true)}
                >
                    Добавить заявку
                </Button>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Добавляйте или управляйте заявками игроков на участие в этом приключении.
            </Typography>
            <Box sx={{ mb: 5 }}>
                <AdventureSignupList adventureId={adventure.id} key={signupsTick} />
            </Box>
            <Dialog open={openSignupModal} onClose={() => setOpenSignupModal(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    Новая заявка
                    <IconButton
                        aria-label="close"
                        onClick={() => setOpenSignupModal(false)}
                        sx={{ position: "absolute", right: 8, top: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <AdventureSignupForm
                        adventureId={adventure.id}
                        onCreated={() => {
                            setOpenSignupModal(false);
                            setSignupsTick(t => t + 1);
                        }}
                    />
                </DialogContent>
            </Dialog>

            <Divider sx={{ my: 3 }} />

            {/* Action buttons */}
            <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate(`/adventures/${adventure.id}/edit`)}
                    sx={{
                        "&:hover": { backgroundColor: "primary.dark" },
                        fontWeight: 500,
                    }}
                    aria-label="Редактировать приключение"
                >
                    Редактировать
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => navigate("/adventures")}
                    sx={{
                        "&:hover": { backgroundColor: "action.hover" },
                        fontWeight: 500,
                    }}
                    aria-label="Назад к списку"
                >
                    Назад к списку
                </Button>
            </Box>
        </Paper>
    );
}
