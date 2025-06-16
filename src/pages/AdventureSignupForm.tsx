import React, { useState, useEffect } from "react";
import { AdventureSignupService } from "../api/AdventureSignupService";
import { UserService } from "../api/UserService";
import type { UserDto } from "../types/user";
import {
    Box,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    FormHelperText,
} from "@mui/material";

export default function AdventureSignupForm({
                                                adventureId,
                                                onCreated,
                                            }: Readonly<{ adventureId: string; onCreated: () => void }>) {
    const [users, setUsers] = useState<UserDto[]>([]);
    const [userId, setUserId] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        UserService.list()
            .then(setUsers)
            .catch(() => setUsers([]));
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
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ my: 3, display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}
        >
            <Typography variant="subtitle1" sx={{ mr: 2, minWidth: 170 }}>
                Добавить запись на игру
            </Typography>
            <FormControl required sx={{ minWidth: 220 }}>
                <InputLabel id="signup-user-label">Игрок</InputLabel>
                <Select
                    labelId="signup-user-label"
                    value={userId}
                    label="Игрок"
                    onChange={e => setUserId(e.target.value)}
                    size="small"
                >
                    <MenuItem value="">
                        <em>Выберите игрока…</em>
                    </MenuItem>
                    {users.map(u => (
                        <MenuItem key={u.id} value={u.id}>
                            {u.name} ({u.email})
                        </MenuItem>
                    ))}
                </Select>
                {error && <FormHelperText error>{error}</FormHelperText>}
            </FormControl>
            <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={saving}
                sx={{ minWidth: 110 }}
            >
                Добавить
            </Button>
        </Box>
    );
}
