import { useEffect, useState } from "react";
import { GameSessionService } from "../api/GameSessionService";
import type { GameSessionDto } from "../types/gameSession";
import GameSessionForm from "./GameSessionForm";
import {
    Paper,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Box,
    Alert,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Snackbar,
    Button,
    DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";

export default function GameSessionList({ adventureId }: Readonly<{ adventureId: string }>) {
    const [sessions, setSessions] = useState<GameSessionDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Edit session modal control
    const [editingSessionId, setEditingSessionId] = useState<string | null>(null);

    // Delete dialog
    const [deletingSession, setDeletingSession] = useState<GameSessionDto | null>(null);

    // Feedback
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
        open: false,
        message: "",
        severity: "success",
    });

    const fetchSessions = () => {
        setLoading(true);
        GameSessionService.listForAdventure(adventureId)
            .then(list =>
                // Sort descending by startTime (newest first)
                setSessions([...list].sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()))
            )
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

    const handleDelete = async () => {
        if (!deletingSession) return;
        try {
            await GameSessionService.remove(deletingSession.id);
            setDeletingSession(null);
            fetchSessions();
            setSnackbar({ open: true, message: "Сессия удалена", severity: "success" });
        } catch (e: any) {
            setSnackbar({ open: true, message: e.message || "Ошибка удаления", severity: "error" });
        }
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

            <Box sx={{ overflowX: "auto", bgcolor: "background.paper", borderRadius: 2 }}>
                <Table size="small" aria-label="Список сессий">
                    <TableHead>
                        <TableRow sx={{ bgcolor: "grey.100" }}>
                            <TableCell sx={{ fontWeight: 700 }}>Дата и время</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Длительность (ч)</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Foundry</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Заметки</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700 }}></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sessions.length === 0 && !loading && (
                            <TableRow>
                                <TableCell colSpan={5}>
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
                                onClick={e => {
                                    // Prevent row click when clicking delete
                                    if ((e.target as HTMLElement).closest("button")) return;
                                    setEditingSessionId(s.id);
                                }}
                            >
                                <TableCell>{new Date(s.startTime).toLocaleString()}</TableCell>
                                <TableCell>{s.durationHours}</TableCell>
                                <TableCell>
                                    {s.linkFoundry
                                        ? <a href={s.linkFoundry} target="_blank" rel="noopener noreferrer">Foundry</a>
                                        : "-"}
                                </TableCell>
                                <TableCell>{s.notes ?? "-"}</TableCell>
                                <TableCell align="center" sx={{ width: 48 }}>
                                    <IconButton
                                        size="small"
                                        color="error"
                                        aria-label="Удалить сессию"
                                        onClick={() => setDeletingSession(s)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
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

            {/* Delete confirmation */}
            <Dialog open={!!deletingSession} onClose={() => setDeletingSession(null)} maxWidth="xs" fullWidth>
                <DialogTitle>
                    Удалить сессию?
                    <IconButton
                        aria-label="close"
                        onClick={() => setDeletingSession(null)}
                        sx={{ position: "absolute", right: 8, top: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        Дата: {deletingSession && new Date(deletingSession.startTime).toLocaleString()}<br />
                        Заметки: {deletingSession?.notes || "-"}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeletingSession(null)} variant="outlined" color="inherit">
                        Отмена
                    </Button>
                    <Button onClick={handleDelete} variant="contained" color="error" autoFocus>
                        Удалить
                    </Button>
                </DialogActions>
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
