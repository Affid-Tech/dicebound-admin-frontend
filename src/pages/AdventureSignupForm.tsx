import React, { useEffect, useRef, useState } from "react";
import { AdventureSignupService } from "../api/AdventureSignupService";
import { UserService } from "../api/UserService";
import type { AdventureSignupDto } from "../types/adventureSignup";
import type { UserDto } from "../types/user";
import {
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    FormHelperText,
    CircularProgress,
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
    const [users, setUsers] = useState<UserDto[]>([]);
    const [userId, setUserId] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const selectRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        UserService.list()
            .then(setUsers)
            .catch(() => setUsers([]));
    }, []);

    useEffect(() => {
        const ref = autoFocusRef?.current ?? selectRef.current;
        if (ref) ref.focus();
    }, [autoFocusRef]);

    useEffect(() => {
        setUserId("");
        setError(null);
    }, [adventureId]);

    // Filter users: not already signed up, not DM
    const signupUserIds = new Set(existingSignups.map(su => su.user.id));
    const filteredUsers = users.filter(
        u => u.id !== dungeonMasterId && !signupUserIds.has(u.id)
    );

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
                    {filteredUsers.map(u => (
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
