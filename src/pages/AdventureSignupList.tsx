import React, { useEffect, useState, useRef } from "react";
import { AdventureSignupService } from "../api/AdventureSignupService";
import type { AdventureSignupDto, AdventureSignupStatus } from "../types/adventureSignup";
import {
    Paper,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Chip,
    Box,
    CircularProgress,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    FormHelperText,
    Snackbar,
    IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";

const STATUS_OPTIONS: AdventureSignupStatus[] = ["PENDING", "APPROVED", "CANCELED"];
const statusColors: Record<AdventureSignupStatus, "default" | "success" | "warning" | "error"> = {
    PENDING: "warning",
    APPROVED: "success",
    CANCELED: "error",
};

export default function AdventureSignupList({
                                                signups,
                                                loading,
                                                onAnyChange, // call this prop after delete or edit to update parent
                                            }: Readonly<{
    adventureId: string;
    signups: AdventureSignupDto[];
    loading?: boolean;
    onAnyChange?: () => void;
}>) {
    // Modal state for editing
    const [editingSignup, setEditingSignup] = useState<AdventureSignupDto | null>(null);
    const [newStatus, setNewStatus] = useState<AdventureSignupStatus | "">("");
    const [saving, setSaving] = useState(false);
    const [statusError, setStatusError] = useState<string | null>(null);

    // Delete dialog
    const [deletingSignup, setDeletingSignup] = useState<AdventureSignupDto | null>(null);

    // Feedback
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
        open: false,
        message: "",
        severity: "success",
    });

    // Autofocus for modal
    const selectRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (editingSignup && selectRef.current) {
            setTimeout(() => selectRef.current?.focus(), 100);
        }
    }, [editingSignup]);

    const openEditModal = (signup: AdventureSignupDto) => {
        setEditingSignup(signup);
        setNewStatus(signup.status);
        setStatusError(null);
    };

    const closeEditModal = () => {
        setEditingSignup(null);
        setStatusError(null);
    };

    const handleSave = async () => {
        if (!editingSignup || !newStatus) {
            setStatusError("Выберите новый статус");
            return;
        }
        setSaving(true);
        setStatusError(null);
        try {
            await AdventureSignupService.patch(editingSignup.id, { status: newStatus });
            closeEditModal();
            if (onAnyChange) onAnyChange();
            setSnackbar({ open: true, message: "Статус обновлён!", severity: "success" });
        } catch (err: unknown) {
            setStatusError(err instanceof Error ? err.message : "Ошибка сохранения");
        } finally {
            setSaving(false);
        }
    };

    // DELETE logic
    const handleDelete = async () => {
        if (!deletingSignup) return;
        try {
            await AdventureSignupService.remove(deletingSignup.id);
            setDeletingSignup(null);
            if (onAnyChange) onAnyChange();
            setSnackbar({ open: true, message: "Заявка удалена", severity: "success" });
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
                <Table size="small" aria-label="Список заявок">
                    <TableHead>
                        <TableRow sx={{ bgcolor: "grey.100" }}>
                            <TableCell sx={{ fontWeight: 700 }}>Игрок</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Статус</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700 }}></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {signups.length === 0 && !loading && (
                            <TableRow>
                                <TableCell colSpan={4}>
                                    <Typography align="center" color="text.secondary" sx={{ py: 3 }}>
                                        Нет заявок.<br /> Нажмите "Добавить заявку", чтобы записать первого игрока!
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                        {signups.map(s => (
                            <TableRow
                                key={s.id}
                                hover
                                sx={{
                                    cursor: "pointer",
                                    "&:hover": { bgcolor: "action.hover" }
                                }}
                                aria-label={`Статус заявки игрока ${s.user.name}`}
                                onClick={e => {
                                    // Prevent row click when clicking delete
                                    if ((e.target as HTMLElement).closest("button")) return;
                                    openEditModal(s);
                                }}
                            >
                                <TableCell>{s.user.name}</TableCell>
                                <TableCell>{s.user.email}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={
                                            s.status === "APPROVED"
                                                ? "Одобрено"
                                                : s.status === "PENDING"
                                                    ? "В ожидании"
                                                    : "Отклонено"
                                        }
                                        color={statusColors[s.status]}
                                        variant="outlined"
                                        size="small"
                                        sx={{
                                            fontWeight: 500,
                                            letterSpacing: 0.5,
                                            minWidth: 90,
                                            justifyContent: "center"
                                        }}
                                    />
                                </TableCell>
                                <TableCell align="center" sx={{ width: 48 }}>
                                    <DeleteIcon
                                        color="error"
                                        aria-label="Удалить заявку"
                                        onClick={(e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
                                            e.stopPropagation();
                                            setDeletingSignup(s);
                                        }}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>

            {/* Status edit modal */}
            <Dialog open={!!editingSignup} onClose={closeEditModal} maxWidth="xs" fullWidth>
                <DialogTitle>
                    Изменить статус заявки
                    <IconButton
                        aria-label="close"
                        onClick={closeEditModal}
                        sx={{ position: "absolute", right: 8, top: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ mt: 1 }}>
                    <Typography sx={{ mb: 2 }}>
                        <b>Игрок:</b> {editingSignup?.user.name} <br />
                        <b>Email:</b> {editingSignup?.user.email}
                    </Typography>
                    <FormControl required fullWidth error={!!statusError}>
                        <InputLabel id="status-select-label">Статус</InputLabel>
                        <Select
                            labelId="status-select-label"
                            value={newStatus}
                            label="Статус"
                            inputRef={selectRef}
                            onChange={e => setNewStatus(e.target.value as AdventureSignupStatus)}
                            size="small"
                        >
                            {STATUS_OPTIONS.map(opt => (
                                <MenuItem key={opt} value={opt}>
                                    {opt === "APPROVED" ? "Одобрено" : opt === "PENDING" ? "В ожидании" : "Отклонено"}
                                </MenuItem>
                            ))}
                        </Select>
                        {statusError && <FormHelperText>{statusError}</FormHelperText>}
                    </FormControl>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={closeEditModal} variant="outlined" color="inherit" disabled={saving}>
                        Отмена
                    </Button>
                    <Button onClick={handleSave} variant="contained" color="primary" disabled={saving}>
                        {saving ? <CircularProgress size={20} color="inherit" /> : "Сохранить"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete confirmation dialog */}
            <Dialog open={!!deletingSignup} onClose={() => setDeletingSignup(null)} maxWidth="xs" fullWidth>
                <DialogTitle>
                    Удалить заявку?
                    <IconButton
                        aria-label="close"
                        onClick={() => setDeletingSignup(null)}
                        sx={{ position: "absolute", right: 8, top: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        Игрок: {deletingSignup?.user.name}<br />
                        Email: {deletingSignup?.user.email}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeletingSignup(null)} variant="outlined" color="inherit">
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
