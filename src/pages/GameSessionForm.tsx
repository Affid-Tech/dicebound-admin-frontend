import React, {useEffect, useRef, useState} from "react";
import {GameSessionService} from "../api/GameSessionService";
import type {GameSessionCreateDto, GameSessionDto, GameSessionPatchDto} from "../types/gameSession";
import {Box, Button, CircularProgress, FormHelperText, TextField,} from "@mui/material";

function toOffsetDateTime(localDateTime: string) {
    // localDateTime: "2025-06-09T18:00"
    const tzOffset = -new Date().getTimezoneOffset();
    const abs = Math.abs(tzOffset);
    const sign = tzOffset >= 0 ? "+" : "-";
    const h = String(Math.floor(abs / 60)).padStart(2, "0");
    const m = String(abs % 60).padStart(2, "0");
    return `${localDateTime}:00${sign}${h}:${m}`;
}

export default function GameSessionForm({
                                            adventureId,
                                            sessionId,
                                            onSaved,
                                            onCancel,
                                            autoFocusRef, // optional: forward ref from parent dialog for autofocus
                                        }: Readonly<{
    adventureId: string;
    sessionId?: string;
    onSaved: () => void;
    onCancel?: () => void;
    autoFocusRef: React.RefObject<HTMLInputElement | undefined>;
}>) {
    const [form, setForm] = useState<GameSessionCreateDto>({
        adventureId,
        startTime: "",
        durationHours: 3,
        linkFoundry: "",
        notes: "",
    });
    const [loading, setLoading] = useState(!!sessionId);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // For autofocus on first field in modal (add/edit)
    const startTimeRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (sessionId) {
            setLoading(true);
            GameSessionService.get(sessionId)
                .then((data: GameSessionDto) => {
                    const utcStartTime = new Date(data.startTime);
                    utcStartTime.setMinutes(utcStartTime.getMinutes() - utcStartTime.getTimezoneOffset());

                    setForm({
                        adventureId: data.adventureId,
                        startTime: utcStartTime.toISOString().slice(0, 16),
                        durationHours: data.durationHours,
                        linkFoundry: data.linkFoundry ?? "",
                        notes: data.notes ?? "",
                    });
                })
                .catch(e => setError(e.message))
                .finally(() => setLoading(false));
        } else {
            // On open "add" modal: clear the form
            setForm({
                adventureId,
                startTime: "",
                durationHours: 3,
                linkFoundry: "",
                notes: "",
            });
        }
    }, [sessionId, adventureId]);

    useEffect(() => {
        // Autofocus logic: prefer parent's ref, fallback to internal
        const ref = autoFocusRef?.current ?? startTimeRef.current;
        if (ref) ref.focus();
    }, [loading, autoFocusRef]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm(prev => ({
            ...prev,
            [e.target.name]: e.target.name === "durationHours" ? Number(e.target.value) : e.target.value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        try {
            const formToSend = {
                ...form,
                startTime: toOffsetDateTime(form.startTime),
            };

            if (sessionId) {
                await GameSessionService.patch(sessionId, formToSend as GameSessionPatchDto);
            } else {
                await GameSessionService.create(formToSend);
                // Clear the form for a fresh "add" modal
                setForm({
                    adventureId,
                    startTime: "",
                    durationHours: 3,
                    linkFoundry: "",
                    notes: "",
                });
            }
            onSaved();
        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message);
            else setError("Ошибка сохранения");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ py: 3, display: "flex", justifyContent: "center" }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ my: 1, display: "flex", flexDirection: "column", gap: 2, width: "100%" }}
        >
            <TextField
                name="startTime"
                type="datetime-local"
                value={form.startTime ? form.startTime.slice(0, 16) : ""}
                onChange={handleChange}
                required
                size="small"
                label="Дата и время"
                inputRef={autoFocusRef ?? startTimeRef}
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 210 }}
            />
            <TextField
                name="durationHours"
                type="number"
                value={form.durationHours}
                onChange={handleChange}
                inputProps={{ min: 1, max: 24 }}
                required
                size="small"
                label="Длительность (ч)"
                sx={{ width: 160 }}
            />
            <TextField
                name="linkFoundry"
                type="text"
                value={form.linkFoundry}
                onChange={handleChange}
                size="small"
                label="Ссылка на Foundry"
                sx={{ minWidth: 180 }}
            />
            <TextField
                name="notes"
                type="text"
                value={form.notes}
                onChange={handleChange}
                size="small"
                label="Заметки"
                sx={{ minWidth: 120 }}
            />
            <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                <Button type="submit" variant="contained" color="primary" disabled={saving}>
                    {saving ? <CircularProgress size={20} color="inherit" /> : sessionId ? "Сохранить" : "Добавить"}
                </Button>
                {onCancel && (
                    <Button type="button" variant="outlined" color="inherit" onClick={onCancel} disabled={saving}>
                        Отмена
                    </Button>
                )}
            </Box>
            {error && (
                <FormHelperText error sx={{ mt: 1 }}>
                    {error}
                </FormHelperText>
            )}
        </Box>
    );
}
