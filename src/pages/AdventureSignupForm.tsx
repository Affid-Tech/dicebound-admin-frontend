import React, {useEffect, useRef, useState} from "react";
import {AdventureSignupService} from "../api/AdventureSignupService";
import {UserService} from "../api/UserService";
import type {UserDto} from "../types/user";
import {Box, Button, CircularProgress, FormControl, FormHelperText, InputLabel, MenuItem, Select,} from "@mui/material";

export default function AdventureSignupForm({
                                                adventureId,
                                                onCreated,
                                                autoFocusRef,
                                            }: Readonly<{
    adventureId: string;
    onCreated: () => void;
    autoFocusRef?: React.RefObject<HTMLInputElement | undefined>;
}>) {
    const [users, setUsers] = useState<UserDto[]>([]);
    const [userId, setUserId] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // For internal autofocus fallback
    const selectRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        UserService.list()
            .then(setUsers)
            .catch(() => setUsers([]));
    }, []);

    useEffect(() => {
        // Autofocus for dialog: prefer parent ref, fallback to internal
        const ref = autoFocusRef?.current ?? selectRef.current;
        if (ref) ref.focus();
    }, [autoFocusRef]);

    // Reset form on open
    useEffect(() => {
        setUserId("");
        setError(null);
    }, [adventureId]);

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
            sx={{ my: 1, display: "flex", flexDirection: "column", gap: 2, width: "100%" }}
        >
            <FormControl required fullWidth>
                <InputLabel id="signup-user-label">Игрок</InputLabel>
                <Select
                    labelId="signup-user-label"
                    value={userId}
                    label="Игрок"
                    onChange={e => setUserId(e.target.value)}
                    size="small"
                    inputRef={autoFocusRef ?? selectRef}
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
            <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={saving}
                    sx={{ minWidth: 110 }}
                >
                    {saving ? <CircularProgress size={20} color="inherit" /> : "Добавить"}
                </Button>
            </Box>
        </Box>
    );
}
