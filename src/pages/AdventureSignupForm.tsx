import React, { useState, useEffect } from "react";
import { AdventureSignupService } from "../api/AdventureSignupService";
import { UserService } from "../api/UserService";
import type { UserDto } from "../types/user";

export default function AdventureSignupForm({ adventureId, onCreated }: Readonly<{ adventureId: string, onCreated: () => void }>) {
    const [users, setUsers] = useState<UserDto[]>([]);
    const [userId, setUserId] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        UserService.list().then(setUsers).catch(() => setUsers([]));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) {
            setError("Выберите пользователя");
            return;
        }
        setSaving(true);
        setError(null);
        try {
            await AdventureSignupService.create({ adventureId, userId });
            setUserId("");
            onCreated();
        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message);
            else setError("Ошибка сохранения");
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ margin: "20px 0" }}>
            <h4>Добавить запись на игру</h4>
            <select value={userId} onChange={e => setUserId(e.target.value)} required>
                <option value="">Выберите игрока…</option>
                {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                ))}
            </select>
            <button type="submit" disabled={saving} style={{ marginLeft: 10 }}>Добавить</button>
            {error && <span style={{ color: "red", marginLeft: 10 }}>{error}</span>}
        </form>
    );
}
