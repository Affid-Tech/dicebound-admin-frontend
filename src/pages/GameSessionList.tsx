import React, {useState} from "react";
import {GameSessionService} from "../api/GameSessionService";
import type {GameSessionDto} from "../types/gameSession";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
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
    useMediaQuery,
} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";

export default function GameSessionList({
                                            sessions,
                                            loading,
                                            onEdit,
                                            onDeleted,
                                        }: Readonly<{
    sessions: GameSessionDto[];
    loading?: boolean;
    onEdit?: (sessionId: string) => void;
    onDeleted?: () => void;
}>) {
    const [deletingSession, setDeletingSession] = useState<GameSessionDto | null>(null);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
        open: false, message: "", severity: "success"
    });

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const handleDelete = async () => {
        if (!deletingSession) return;
        try {
            await GameSessionService.remove(deletingSession.id);
            setDeletingSession(null);
            onDeleted?.(); // trigger parent refresh
            setSnackbar({ open: true, message: "Сессия удалена", severity: "success" });
        } catch (e: any) {
            setSnackbar({ open: true, message: e.message ?? "Ошибка удаления", severity: "error" });
        }
    };

    if (isMobile) {
        return (
            <Box sx={{ px: 1, pt: 1 }}>
                {loading && (
                    <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
                        <CircularProgress />
                    </Box>
                )}

                {!loading && sessions.length === 0 && (
                    <Alert severity="info" sx={{ my: 2 }}>
                        Нет сессий.<br /> Нажмите "Добавить сессию", чтобы создать первую!
                    </Alert>
                )}

                <Box display="flex" flexDirection="column" gap={1.5}>
                    {sessions.map(s => (
                        <Paper
                            key={s.id}
                            sx={{
                                p: 1.5,
                                borderRadius: 1,
                                display: "flex",
                                flexDirection: "column",
                                cursor: "pointer",
                                boxShadow: 1,
                                "&:hover": { boxShadow: 4, bgcolor: "action.hover" }
                            }}
                            onClick={e => {
                                // Prevent row click when clicking delete
                                if ((e.target as HTMLElement).closest("button,svg")) return;
                                onEdit?.(s.id);
                            }}
                        >
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                        {new Date(s.startTime).toLocaleString()}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                        <b>Длительность:</b> {s.durationHours} ч.
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                        <b>Foundry:</b>{" "}
                                        {s.linkFoundry
                                            ? <a href={s.linkFoundry} target="_blank" rel="noopener noreferrer">Ссылка</a>
                                            : "-"}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        <b>Заметки:</b> {s.notes ?? "-"}
                                    </Typography>
                                </Box>
                                <IconButton
                                    size="small"
                                    onClick={e => {
                                        e.stopPropagation();
                                        setDeletingSession(s);
                                    }}
                                >
                                    <DeleteIcon color="error" />
                                </IconButton>
                            </Box>
                        </Paper>
                    ))}
                </Box>

                {/* Delete dialog */}
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
                            Заметки: {deletingSession?.notes ?? "-"}
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
                {/* Snackbar */}
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
            </Box>
        );
    }

    // --- DESKTOP ---
    return (
        <Paper variant="outlined" sx={{ p: 0, boxShadow: "none", bgcolor: "transparent" }}>
            {loading && (
                <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
                    <CircularProgress />
                </Box>
            )}
            <Box sx={{ overflowX: "auto", bgcolor: "background.paper", borderRadius: 1 }}>
                <Table size="small" aria-label="Список сессий">
                    <TableHead>
                        <TableRow sx={{ bgcolor: theme.palette.mode === 'dark' ? "rgba(183, 159, 255, 0.15)" : "grey.100" }}>
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
                                    if ((e.target as HTMLElement).closest("button")) return;
                                    onEdit?.(s.id);
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
                                    <DeleteIcon
                                        color="error"
                                        aria-label="Удалить сессию"
                                        onClick={(e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
                                            e.stopPropagation();
                                            setDeletingSession(s);
                                        }}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>

            {/* Delete dialog */}
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
                        Заметки: {deletingSession?.notes ?? "-"}
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
            {/* Snackbar */}
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
