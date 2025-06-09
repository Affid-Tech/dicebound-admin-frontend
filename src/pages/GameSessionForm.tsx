// src/pages/GameSessionForm.tsx

import React, { useEffect, useState } from "react";
import { GameSessionService } from "../api/GameSessionService";
import type { GameSessionCreateDto, GameSessionDto, GameSessionPatchDto } from "../types/gameSession";

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

    if (loading) return <div>Загрузка...</div>;

    return (
        <form onSubmit={handleSubmit} style={{ margin: "20px 0" }}>
            <h4>{sessionId ? "Редактировать сессию" : "Создать сессию"}</h4>
            <input
                name="startTime"
                type="datetime-local"
                value={form.startTime ? form.startTime.slice(0, 16) : ""}
                onChange={handleChange}
                required
                style={{ marginRight: 10 }}
            />
            <input
                name="durationHours"
                type="number"
                value={form.durationHours}
                min={1}
                max={24}
                onChange={handleChange}
                placeholder="Длительность (ч)"
                required
                style={{ width: 80, marginRight: 10 }}
            />
            <input
                name="linkFoundry"
                type="text"
                value={form.linkFoundry}
                onChange={handleChange}
                placeholder="Ссылка на Foundry"
                style={{ width: 180, marginRight: 10 }}
            />
            <input
                name="notes"
                type="text"
                value={form.notes}
                onChange={handleChange}
                placeholder="Заметки"
                style={{ width: 120, marginRight: 10 }}
            />
            <button type="submit" disabled={saving}>{sessionId ? "Сохранить" : "Добавить"}</button>
            {onCancel && (
                <button type="button" onClick={onCancel} style={{ marginLeft: 10 }}>Отмена</button>
            )}
            {error && <span style={{ color: "red", marginLeft: 10 }}>{error}</span>}
        </form>
    );
}
