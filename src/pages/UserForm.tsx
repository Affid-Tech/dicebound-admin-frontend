import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {UserService} from "../api/UserService";
import type {UserCreateDto, UserPatchDto, UserRole} from "../types/user";
import D20 from "../components/D20.tsx";
import {Alert, Box, Button, Card, CardContent, Checkbox, CircularProgress, FormControlLabel, FormGroup, Stack, TextField, Typography} from "@mui/material";

const allRoles: UserRole[] = ["PLAYER", "DUNGEON_MASTER", "ADMIN"];

type UserFormData = {
    name: string;
    email?: string;
    bio?: string;
    roles: UserRole[];
};

export default function UserForm() {
    const { id } = useParams<{ id: string }>();
    const isEdit = Boolean(id);

    const [form, setForm] = useState<UserFormData>({
        name: "",
        email: "",
        bio: "",
        roles: [],
    });
    const [loading, setLoading] = useState(isEdit);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [roleLoading, setRoleLoading] = useState<UserRole | null>(null);

    const navigate = useNavigate();

    // Загрузка данных пользователя при редактировании
    useEffect(() => {
        if (isEdit && id) {
            setLoading(true);
            UserService.get(id)
                .then((data) =>
                    setForm({
                        name: data.name,
                        email: data.email ?? "",
                        bio: data.bio ?? "",
                        roles: data.roles ?? [],
                    })
                )
                .catch((e) => setError(e.message))
                .finally(() => setLoading(false));
        }
    }, [isEdit, id]);

    // Универсальный хендлер для полей
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    // Отдельный хендлер для чекбоксов ролей (для EDIT)
    const handleRoleToggle = async (role: UserRole, checked: boolean) => {
        if (!id) return; // роли можно назначать только после создания пользователя
        setRoleLoading(role);

        try {
            if (checked) {
                await UserService.addRole(id, role);
            } else {
                await UserService.removeRole(id, role);
            }
            // После успешного запроса обновить user.roles
            setForm((prev) => ({
                ...prev,
                roles: checked
                    ? [...(prev.roles ?? []), role]
                    : (prev.roles ?? []).filter((r) => r !== role),
            }));
        } catch (e: unknown) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError("Ошибка при обновлении ролей");
            }
        } finally {
            setRoleLoading(null);
        }
    };

    // Submit: создание или сохранение пользователя
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        try {
            if (!isEdit) {
                // Создать пользователя
                const user = await UserService.create(form as UserCreateDto);
                const userId = user.id;
                // После создания назначить роли
                for (const role of form.roles ?? []) {
                    await UserService.addRole(userId, role);
                }
                navigate(`/users/${userId}`);
                return;
            } else if (id) {
                // Сохраняем остальные поля (но не роли!)
                await UserService.patch(id, form as UserPatchDto);
                navigate("/users");
            }
        } catch (e: unknown) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError("Ошибка сохранения");
            }
        } finally {
            setSaving(false);
        }
    };

    // Удаление пользователя
    const handleDelete = async () => {
        if (isEdit && id && window.confirm("Удалить пользователя?")) {
            try {
                await UserService.remove(id);
                navigate("/users");
            } catch (e: unknown) {
                if (e instanceof Error) {
                    setError(e.message);
                } else {
                    setError("Ошибка удаления");
                }
            }
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height={200}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Card sx={{ maxWidth: 480, mx: "auto", mt: 4, p: 2 }}>
            <CardContent>
                <Box textAlign="center" mb={2}>
                    <D20 style={{ width: 60, height: 60 }} />
                </Box>
                <Typography variant="h6" gutterBottom align="center">
                    {isEdit ? "Редактирование пользователя" : "Создать пользователя"}
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Stack spacing={2}>
                        <TextField
                            label="Имя"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            fullWidth
                        />
                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            label="Bio"
                            name="bio"
                            value={form.bio}
                            onChange={handleChange}
                            fullWidth
                            multiline
                            minRows={3}
                        />
                        <Box>
                            <Typography variant="subtitle2" mb={0.5}>
                                Роли:
                            </Typography>
                            <FormGroup row>
                                {allRoles.map((role) => (
                                    <FormControlLabel
                                        key={role}
                                        control={
                                            <Checkbox
                                                checked={form.roles?.includes(role)}
                                                onChange={e =>
                                                    isEdit
                                                        ? handleRoleToggle(role, e.target.checked)
                                                        : setForm((prev) => ({
                                                            ...prev,
                                                            roles: e.target.checked
                                                                ? [...(prev.roles ?? []), role]
                                                                : (prev.roles ?? []).filter((r) => r !== role),
                                                        }))
                                                }
                                                disabled={isEdit && (!id || roleLoading === role)}
                                            />
                                        }
                                        label={role}
                                    />
                                ))}
                            </FormGroup>
                            {!isEdit && (
                                <Typography variant="caption" color="text.secondary">
                                    Роли можно назначить сразу, либо после создания пользователя.
                                </Typography>
                            )}
                        </Box>
                        {error && <Alert severity="error">{error}</Alert>}
                        <Box display="flex" gap={1} mt={1}>
                            <Button
                                variant="contained"
                                type="submit"
                                disabled={saving}
                            >
                                {isEdit ? "Сохранить" : "Создать"}
                            </Button>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => navigate("/users")}
                                disabled={saving}
                            >
                                Назад
                            </Button>
                            {isEdit && (
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={handleDelete}
                                    disabled={saving}
                                    sx={{ marginLeft: "auto" }}
                                >
                                    Удалить
                                </Button>
                            )}
                        </Box>
                    </Stack>
                </Box>
            </CardContent>
        </Card>
    );
}
