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
} from "@mui/material";
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

    // Delete dialog
    const [deletingSession, setDeletingSession] = useState<GameSessionDto | null>(null);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
        open: false, message: "", severity: "success"
    });

    const handleDelete = async () => {
        if (!deletingSession) return;
        try {
            await GameSessionService.remove(deletingSession.id);
            setDeletingSession(null);
            onDeleted?.(); // trigger parent refresh
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
