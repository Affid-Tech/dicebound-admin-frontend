import React, { useEffect, useState } from "react";
import { GameSessionService } from "../api/GameSessionService";
import type { GameSessionCreateDto, GameSessionDto, GameSessionPatchDto } from "../types/gameSession";
import {
    Box,
    Typography,
    TextField,
    Button,
    FormHelperText,
    CircularProgress,
} from "@mui/material";

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
                                        }: Readonly<{
    adventureId: string;
    sessionId?: string;
    onSaved: () => void;
    onCancel?: () => void;
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
        }
    }, [sessionId]);

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
            sx={{ my: 3, display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}
        >
            <Typography variant="subtitle1" sx={{ minWidth: 170 }}>
                {sessionId ? "Редактировать сессию" : "Создать сессию"}
            </Typography>
            <TextField
                name="startTime"
                type="datetime-local"
                value={form.startTime ? form.startTime.slice(0, 16) : ""}
                onChange={handleChange}
                required
                size="small"
                label="Дата и время"
                sx={{ minWidth: 210 }}
                slotProps={{ inputLabel: { shrink: true }}}
            />
            <TextField
                name="durationHours"
                type="number"
                value={form.durationHours}
                onChange={handleChange}
                slotProps={{ htmlInput: { min: 1, max: 24}}}
                required
                size="small"
                label="Длительность (ч)"
                sx={{ width: 120 }}
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
            <Button type="submit" variant="contained" color="primary" disabled={saving}>
                {sessionId ? "Сохранить" : "Добавить"}
            </Button>
            {onCancel && (
                <Button type="button" variant="outlined" color="inherit" onClick={onCancel}>
                    Отмена
                </Button>
            )}
            {error && (
                <FormHelperText error sx={{ ml: 2 }}>
                    {error}
                </FormHelperText>
            )}
        </Box>
    );
}
