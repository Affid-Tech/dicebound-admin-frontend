import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {AdventureService} from "../api/AdventureService";
import type {AdventureDto} from "../types/adventure";
import {Alert, Box, Button, CircularProgress, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography, useMediaQuery,} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import {adventureStatuses, adventureTypes} from "./AdventureLabels.ts";

export default function AdventureList() {
    const [adventures, setAdventures] = useState<AdventureDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        AdventureService.list()
            .then(setAdventures)
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    // Header and create button (shared)
    const headerBlock = (
        <Box sx={{ mb: 3, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant={isMobile ? "h5" : "h4"}>
                Приключения
            </Typography>
            <Button
                variant="contained"
                color="primary"
                size={isMobile ? "small" : "medium"}
                onClick={() => navigate("/adventures/new")}
                sx={{ minWidth: 0, px: isMobile ? 1.5 : 2, boxShadow: isMobile ? 1 : undefined }}
            >
                Создать
            </Button>
        </Box>
    );

    // Loading/error/empty feedback (shared)
    const feedbackBlock = (
        <>
            {loading && (
                <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                    <CircularProgress />
                </Box>
            )}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
            )}
            {!loading && !error && (adventures.length === 0) && (
                <Alert severity="info" sx={{ mt: 3 }}>
                    Пока нет приключений.
                </Alert>
            )}
        </>
    );

    // Mobile: no Paper root
    if (isMobile) {
        return (
            <Box sx={{ px: 2, pt: 4, pb: 2 }}>
                {headerBlock}
                {feedbackBlock}
                {!loading && !error && adventures.length > 0 && (
                    <Box>
                        {adventures.map(a => (
                            <Paper
                                key={a.id}
                                sx={{
                                    mb: 2, p: 2, borderRadius: 2,
                                    cursor: "pointer",
                                    '&:hover': { boxShadow: 6, background: "#F8F9FB" },
                                }}
                                onClick={() => navigate(`/adventures/${a.id}`)}
                                elevation={2}
                            >
                                <Typography variant="h6" sx={{ mb: 1 }}>{a.title}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    <b>Тип:</b> {adventureTypes.find(it => it.value == a.type)?.label}<br />
                                    <b>Статус:</b> {adventureStatuses.find(it => it.value == a.status)?.label}<br />
                                    <b>Система:</b> {a.gameSystem}<br />
                                    <b>Мастер:</b> {a.dungeonMaster?.name || "-"}<br />
                                    <b>Игроки:</b> {a.minPlayers !== a.maxPlayers ? `${a.minPlayers}–${a.maxPlayers}` : a.minPlayers}
                                </Typography>
                            </Paper>
                        ))}
                    </Box>
                )}
            </Box>
        );
    }

    // Desktop: root Paper as before
    return (
        <Paper elevation={3} sx={{ maxWidth: 900, mx: "auto", my: 4, p: 4, borderRadius: 3 }}>
            {headerBlock}
            {feedbackBlock}
            {!loading && !error && adventures.length > 0 && (
                <Box sx={{ width: "100%", overflowX: "auto" }}>
                    <Table sx={{ minWidth: 600, mt: 2, cursor: "pointer" }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Название</TableCell>
                                <TableCell>Тип</TableCell>
                                <TableCell>Статус</TableCell>
                                <TableCell>Система</TableCell>
                                <TableCell>Мастер</TableCell>
                                <TableCell>Игроки</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {adventures.map(a => (
                                <TableRow
                                    key={a.id}
                                    hover
                                    onClick={() => navigate(`/adventures/${a.id}`)}
                                    sx={{ cursor: "pointer" }}
                                >
                                    <TableCell>{a.title}</TableCell>
                                    <TableCell>{adventureTypes.find(it => it.value == a.type)?.label}</TableCell>
                                    <TableCell>{adventureStatuses.find(it => it.value == a.status)?.label}</TableCell>
                                    <TableCell>{a.gameSystem}</TableCell>
                                    <TableCell>{a.dungeonMaster?.name || "-"}</TableCell>
                                    <TableCell>{a.minPlayers !== a.maxPlayers ? `${a.minPlayers}–${a.maxPlayers}` : a.minPlayers}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            )}
        </Paper>
    );
}
