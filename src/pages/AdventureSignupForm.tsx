import React, {useEffect, useRef, useState} from "react";
import {AdventureSignupService} from "../api/AdventureSignupService";
import {UserService} from "../api/UserService";
import type {AdventureSignupDto} from "../types/adventureSignup";
import type {UserDto} from "../types/user";
import {
    Autocomplete,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    FormHelperText,
    TextField,
    Typography,
} from "@mui/material";

export default function AdventureSignupForm({
                                                adventureId,
                                                onCreated,
                                                existingSignups,
                                                dungeonMasterId,
                                                autoFocusRef,
                                            }: Readonly<{
    adventureId: string;
    onCreated: () => void;
    existingSignups: AdventureSignupDto[];
    dungeonMasterId?: string;
    autoFocusRef?: React.RefObject<HTMLInputElement | null>;
}>) {
    const [options, setOptions] = useState<UserDto[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);
    const [loadingUsers, setLoadingUsers] = useState(false);

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [createOpen, setCreateOpen] = useState(false);
    const [newPlayerName, setNewPlayerName] = useState("");
    const [newPlayerEmail, setNewPlayerEmail] = useState("");
    const [creatingPlayer, setCreatingPlayer] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);


    const fallbackRef = useRef<HTMLInputElement>(null);

    // автофокус
    useEffect(() => {
        const ref = autoFocusRef?.current ?? fallbackRef.current;
        if (ref) ref.focus();
    }, [autoFocusRef]);

    // сброс при смене приключения
    useEffect(() => {
        setSelectedUser(null);
        setInputValue("");
        setError(null);
    }, [adventureId]);

    // ids уже записанных игроков + ведущего
    const signupUserIds = new Set(existingSignups.map(su => su.user.id));

    // загрузка игроков по вводу
    useEffect(() => {
        let active = true;

        const q = inputValue.trim();
        if (q.length < 2) {
            // чтобы не спамить запросами, требуем хотя бы 2 символа
            setOptions([]);
            setLoadingUsers(false);
            return;
        }

        setLoadingUsers(true);
        const timeoutId = setTimeout(() => {
            UserService.listPlayers({ q, page: 0, size: 20 })
                .then((response) => {
                    if (!active) return;
                    const all = response.content ?? [];
                    const filtered = all.filter(
                        u => u.id !== dungeonMasterId && !signupUserIds.has(u.id)
                    );
                    setOptions(filtered);
                })
                .catch(() => {
                    if (!active) return;
                    setOptions([]);
                })
                .finally(() => {
                    if (!active) return;
                    setLoadingUsers(false);
                });
        }, 300); // debounce 300 мс

        return () => {
            active = false;
            clearTimeout(timeoutId);
        };
    }, [inputValue, dungeonMasterId, existingSignups]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) {
            setError("Выберите игрока");
            return;
        }
        setSaving(true);
        setError(null);
        try {
            await AdventureSignupService.create({ adventureId, userId: selectedUser.id });
            setSelectedUser(null);
            setInputValue("");
            onCreated();
        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message);
            else setError("Ошибка сохранения");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                my: 1,
                display: "flex",
                flexDirection: "column",
                gap: { xs: 1.5, sm: 2 },
                width: "100%",
            }}
        >
            <FormControl required fullWidth variant="outlined">
                <Typography variant="body1" color="text.primary" sx={{ mb: 1 }}>
                    Игрок
                </Typography>

                <Autocomplete<UserDto>
                    value={selectedUser}
                    onChange={(_, newValue) => {
                        setSelectedUser(newValue);
                        setError(null);
                    }}
                    inputValue={inputValue}
                    onInputChange={(_, newInput) => setInputValue(newInput)}
                    options={options}
                    loading={loadingUsers}
                    getOptionLabel={(option) =>
                        option.email ? `${option.name} (${option.email})` : option.name
                    }
                    noOptionsText={inputValue.trim().length < 2
                        ? "Введите минимум 2 символа"
                        : "Игроки не найдены"}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            inputRef={autoFocusRef ?? fallbackRef}
                            size="small"
                            placeholder="Начните вводить имя или email…"
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <>
                                        {loadingUsers ? <CircularProgress color="inherit" size={18} /> : null}
                                        {params.InputProps.endAdornment}
                                    </>
                                ),
                            }}
                        />
                    )}
                />
                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                    <Button
                        variant="text"
                        size="small"
                        onClick={() => {
                            setCreateError(null);
                            // предварительно заполним имя из текущего ввода, если похоже на имя
                            const trimmed = inputValue.trim();
                            if (trimmed && !trimmed.includes("@")) {
                                setNewPlayerName(trimmed);
                                setNewPlayerEmail("");
                            } else {
                                setNewPlayerName("");
                                setNewPlayerEmail(trimmed.includes("@") ? trimmed : "");
                            }
                            setCreateOpen(true);
                        }}
                    >
                        Новый игрок
                    </Button>
                </Box>


                {error && <FormHelperText error>{error}</FormHelperText>}
            </FormControl>

            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={saving}
                    sx={{ minWidth: 110 }}
                    fullWidth
                >
                    {saving ? <CircularProgress size={20} color="inherit" /> : "Добавить"}
                </Button>
                <Dialog open={createOpen} onClose={() => !creatingPlayer && setCreateOpen(false)} fullWidth maxWidth="sm">
                    <DialogTitle>Новый игрок</DialogTitle>
                    <DialogContent sx={{ pt: 1 }}>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Имя"
                            fullWidth
                            required
                            value={newPlayerName}
                            onChange={e => setNewPlayerName(e.target.value)}
                        />
                        <TextField
                            margin="dense"
                            label="Email (опционально)"
                            type="email"
                            fullWidth
                            value={newPlayerEmail}
                            onChange={e => setNewPlayerEmail(e.target.value)}
                        />
                        {createError && (
                            <FormHelperText error sx={{ mt: 1 }}>
                                {createError}
                            </FormHelperText>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setCreateOpen(false)} disabled={creatingPlayer}>
                            Отмена
                        </Button>
                        <Button
                            onClick={async () => {
                                if (!newPlayerName.trim()) {
                                    setCreateError("Введите имя");
                                    return;
                                }
                                setCreatingPlayer(true);
                                setCreateError(null);
                                try {
                                    const player = await UserService.createPlayer({
                                        name: newPlayerName.trim(),
                                        email: newPlayerEmail.trim() || undefined,
                                    });

                                    // чтобы он сразу стал выбраным в форме
                                    setSelectedUser(player);
                                    setInputValue(
                                        player.email ? `${player.name} (${player.email})` : player.name
                                    );
                                    // добавим в options, чтобы Autocomplete не ругался
                                    setOptions(prev => {
                                        // если уже есть — не дублируем
                                        if (prev.some(u => u.id === player.id)) return prev;
                                        return [player, ...prev];
                                    });

                                    setCreateOpen(false);
                                } catch (e: any) {
                                    setCreateError(e?.message ?? "Ошибка создания игрока");
                                } finally {
                                    setCreatingPlayer(false);
                                }
                            }}
                            variant="contained"
                            disabled={creatingPlayer}
                        >
                            {creatingPlayer ? <CircularProgress size={18} color="inherit" /> : "Создать"}
                        </Button>
                    </DialogActions>
                </Dialog>

            </Box>
        </Box>
    );
}
