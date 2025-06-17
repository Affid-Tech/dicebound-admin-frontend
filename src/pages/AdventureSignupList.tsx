import {useEffect, useRef, useState} from "react";
import {AdventureSignupService} from "../api/AdventureSignupService";
import type {AdventureSignupDto, AdventureSignupStatus} from "../types/adventureSignup";
import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormHelperText,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const STATUS_OPTIONS: AdventureSignupStatus[] = ["PENDING", "APPROVED", "CANCELED"];
const statusColors: Record<AdventureSignupStatus, "default" | "success" | "warning" | "error"> = {
    PENDING: "warning",
    APPROVED: "success",
    CANCELED: "error",
};

export default function AdventureSignupList({ adventureId }: Readonly<{ adventureId: string }>) {
    const [signups, setSignups] = useState<AdventureSignupDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modal state for editing
    const [editingSignup, setEditingSignup] = useState<AdventureSignupDto | null>(null);
    const [newStatus, setNewStatus] = useState<AdventureSignupStatus | "">( "");
    const [saving, setSaving] = useState(false);
    const [statusError, setStatusError] = useState<string | null>(null);

    // Feedback
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
        open: false,
        message: "",
        severity: "success",
    });

    const fetchSignups = () => {
        setLoading(true);
        AdventureSignupService.listForAdventure(adventureId)
            .then(setSignups)
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchSignups();
        // eslint-disable-next-line
    }, [adventureId]);

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
            fetchSignups();
            setSnackbar({ open: true, message: "Статус обновлён!", severity: "success" });
        } catch (err: unknown) {
            setStatusError(err instanceof Error ? err.message : "Ошибка сохранения");
        } finally {
            setSaving(false);
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
                <Table size="small" aria-label="Список заявок">
                    <TableHead>
                        <TableRow sx={{ bgcolor: "grey.100" }}>
                            <TableCell sx={{ fontWeight: 700 }}>Игрок</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Статус</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {signups.length === 0 && !loading && (
                            <TableRow>
                                <TableCell colSpan={3}>
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
                                onClick={() => openEditModal(s)}
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
