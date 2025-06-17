import {useEffect, useState} from "react";
import {GameSessionService} from "../api/GameSessionService";
import type {GameSessionDto} from "../types/gameSession";
import GameSessionForm from "./GameSessionForm";
import {
    Alert,
    Box,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function GameSessionList({ adventureId }: Readonly<{ adventureId: string }>) {
    const [sessions, setSessions] = useState<GameSessionDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // New: edit session modal control
    const [editingSessionId, setEditingSessionId] = useState<string | null>(null);

    // Feedback
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
        open: false,
        message: "",
        severity: "success",
    });

    const fetchSessions = () => {
        setLoading(true);
        GameSessionService.listForAdventure(adventureId)
            .then(setSessions)
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchSessions();
        // eslint-disable-next-line
    }, [adventureId]);

    const handleEditSaved = () => {
        setEditingSessionId(null);
        fetchSessions();
        setSnackbar({ open: true, message: "Сессия сохранена!", severity: "success" });
    };

    return (
        <Paper variant="outlined" sx={{ p: 0, boxShadow: "none", bgcolor: "transparent" }}>
            {loading && (
                <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
                    <CircularProgress />
                </Box>
            )}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
            )}

            {/* Responsive table scroll */}
            <Box sx={{ overflowX: "auto", bgcolor: "background.paper", borderRadius: 2 }}>
                <Table size="small" aria-label="Список сессий">
                    <TableHead>
                        <TableRow sx={{ bgcolor: "grey.100" }}>
                            <TableCell sx={{ fontWeight: 700 }}>Дата и время</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Длительность (ч)</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Foundry</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Заметки</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sessions.length === 0 && !loading && (
                            <TableRow>
                                <TableCell colSpan={4}>
                                    <Typography align="center" color="text.secondary" sx={{ py: 3 }}>
                                        Нет сессий. <br /> Нажмите "Добавить сессию", чтобы создать первую!
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                        {sessions.map(s => (
                            <TableRow
                                key={s.id}
                                hover
                                sx={{
                                    cursor: "pointer",
                                    "&:hover": { bgcolor: "action.hover" }
                                }}
                                aria-label={`Редактировать сессию ${new Date(s.startTime).toLocaleString()}`}
                                onClick={() => setEditingSessionId(s.id)}
                            >
                                <TableCell>{new Date(s.startTime).toLocaleString()}</TableCell>
                                <TableCell>{s.durationHours}</TableCell>
                                <TableCell>
                                    {s.linkFoundry
                                        ? <a href={s.linkFoundry} target="_blank" rel="noopener noreferrer">Foundry</a>
                                        : "-"}
                                </TableCell>
                                <TableCell>{s.notes ?? "-"}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>

            {/* Edit form in a modal dialog */}
            <Dialog
                open={!!editingSessionId}
                onClose={() => setEditingSessionId(null)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    Редактировать сессию
                    <IconButton
                        aria-label="close"
                        onClick={() => setEditingSessionId(null)}
                        sx={{ position: "absolute", right: 8, top: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {editingSessionId && (
                        <GameSessionForm
                            adventureId={adventureId}
                            sessionId={editingSessionId}
                            onSaved={handleEditSaved}
                            onCancel={() => setEditingSessionId(null)}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Snackbar for feedback */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={2000}
                onClose={() => setSnackbar(s => ({ ...s, open: false }))}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Paper>
    );
}
