import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserService } from "../api/UserService";
import type { UserRole, UserCreateDto, UserPatchDto } from "../types/user";
import D20 from "../components/D20.tsx";

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

    if (loading) return <div>Загрузка...</div>;

    return (
        <div className="card card--narrow">
            <div style={{ textAlign: "center" }}>
                <D20 style={{ width: 60, height: 60 }} />
            </div>
            <h2>{isEdit ? "Редактирование пользователя" : "Создать пользователя"}</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 12 }}>
                    <label>
                        Имя:<br />
                        <input
                            name="name"
                            type="text"
                            value={form.name}
                            onChange={handleChange}
                            required
                            style={{ width: "100%", padding: 8 }}
                        />
                    </label>
                </div>
                <div style={{ marginBottom: 12 }}>
                    <label>
                        Email:<br />
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            style={{ width: "100%", padding: 8 }}
                        />
                    </label>
                </div>
                <div style={{ marginBottom: 12 }}>
                    <label>
                        Bio:<br />
                        <textarea
                            name="bio"
                            value={form.bio}
                            onChange={handleChange}
                            rows={3}
                            style={{ width: "100%", padding: 8 }}
                        />
                    </label>
                </div>
                {/* Роли */}
                <div style={{ marginBottom: 12 }}>
                    <span>Роли:</span>
                    <div>
                        {allRoles.map((role) => (
                            <label key={role} style={{ marginRight: 12 }}>
                                <input
                                    type="checkbox"
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
                                {role}
                            </label>
                        ))}
                        {!isEdit && (
                            <div style={{ fontSize: 12, color: "#888" }}>
                                Роли можно назначить сразу, либо после создания пользователя.
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <button type="submit" disabled={saving} style={{ marginRight: 10 }}>
                        {isEdit ? "Сохранить" : "Создать"}
                    </button>
                    <button type="button" onClick={() => navigate("/users")}>
                        Назад
                    </button>
                    {isEdit && (
                        <button
                            type="button"
                            style={{ float: "right", color: "red" }}
                            onClick={handleDelete}
                            disabled={saving}
                        >
                            Удалить
                        </button>
                    )}
                </div>
                {error && <div style={{ color: "red", marginTop: 10 }}>{error}</div>}
            </form>
        </div>
    );
}
