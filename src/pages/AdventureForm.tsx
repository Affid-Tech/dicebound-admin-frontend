import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdventureService } from "../api/AdventureService";
import { UserService } from "../api/UserService";
import type { AdventureDto, AdventureCreateDto, AdventurePatchDto, AdventureType } from "../types/adventure";
import type { UserDto } from "../types/user";

const adventureTypes: { value: AdventureType; label: string }[] = [
    { value: "ONESHOT", label: "Oneshot" },
    { value: "MULTISHOT", label: "Multishot" },
    { value: "CAMPAIGN", label: "Campaign" },
];

export default function AdventureForm({ mode }: Readonly<{ mode?: "create" | "edit" }>) {
    const { id } = useParams<{ id: string }>();
    const isEdit = mode === "edit";
    const navigate = useNavigate();

    const [users, setUsers] = useState<UserDto[]>([]);
    const [form, setForm] = useState<AdventureCreateDto | AdventurePatchDto>({
        type: "ONESHOT",
        gameSystem: "",
        title: "",
        dungeonMasterId: "",
        description: "",
        startLevel: undefined,
        minPlayers: 3,
        maxPlayers: 6,
        priceUnits: undefined,
    });
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Загружаем мастеров
    useEffect(() => {
        UserService.list()
            .then(all => setUsers(all.filter(u => u.roles.includes("DUNGEON_MASTER"))))
            .catch(() => setUsers([]));
    }, []);

    // Если edit — грузим adventure и заполняем форму
    useEffect(() => {
        if (isEdit && id) {
            setLoading(true);
            AdventureService.get(id)
                .then((data: AdventureDto) =>
                    setForm({
                        type: data.type,
                        gameSystem: data.gameSystem,
                        title: data.title,
                        dungeonMasterId: data.dungeonMaster?.id || "",
                        description: data.description ?? "",
                        startLevel: data.startLevel,
                        minPlayers: data.minPlayers,
                        maxPlayers: data.maxPlayers,
                        priceUnits: data.priceUnits,
                    })
                )
                .catch(e => setError(e.message))
                .finally(() => setLoading(false));
        }
    }, [isEdit, id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]:
                name === "minPlayers" || name === "maxPlayers" || name === "priceUnits" || name === "startLevel"
                    ? value === "" ? undefined : Number(value)
                    : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        try {
            if (isEdit && id) {
                await AdventureService.patch(id, form as AdventurePatchDto);
            } else {
                await AdventureService.create(form as AdventureCreateDto);
            }
            navigate("/adventures");
        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message);
            else setError("Ошибка сохранения");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (isEdit && id && window.confirm("Удалить приключение?")) {
            try {
                await AdventureService.remove(id);
                navigate("/adventures");
            } catch (err: unknown) {
                if (err instanceof Error) setError(err.message);
                else setError("Ошибка удаления");
            }
        }
    };

    if (loading) return <div>Загрузка...</div>;

    return (
        <div className="card card--narrow">
            <h2>{isEdit ? "Редактировать приключение" : "Создать приключение"}</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 12 }}>
                    <label>
                        Название:<br />
                        <input
                            name="title"
                            type="text"
                            value={form.title ?? ""}
                            onChange={handleChange}
                            required
                            style={{ width: "100%", padding: 8 }}
                        />
                    </label>
                </div>
                <div style={{ marginBottom: 12 }}>
                    <label>
                        Тип:<br />
                        <select
                            name="type"
                            value={form.type ?? "ONESHOT"}
                            onChange={handleChange}
                            required
                            style={{ width: "100%", padding: 8 }}
                        >
                            {adventureTypes.map(t => (
                                <option key={t.value} value={t.value}>{t.label}</option>
                            ))}
                        </select>
                    </label>
                </div>
                <div style={{ marginBottom: 12 }}>
                    <label>
                        Система:<br />
                        <input
                            name="gameSystem"
                            type="text"
                            value={form.gameSystem ?? ""}
                            onChange={handleChange}
                            required
                            style={{ width: "100%", padding: 8 }}
                        />
                    </label>
                </div>
                <div style={{ marginBottom: 12 }}>
                    <label>
                        Мастер:<br />
                        <select
                            name="dungeonMasterId"
                            value={form.dungeonMasterId ?? ""}
                            onChange={handleChange}
                            required
                            style={{ width: "100%", padding: 8 }}
                        >
                            <option value="" disabled>Выберите...</option>
                            {users.map(u => (
                                <option key={u.id} value={u.id}>
                                    {u.name} ({u.email})
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
                <div style={{ marginBottom: 12 }}>
                    <label>
                        Описание:<br />
                        <textarea
                            name="description"
                            value={form.description ?? ""}
                            onChange={handleChange}
                            rows={3}
                            style={{ width: "100%", padding: 8 }}
                        />
                    </label>
                </div>
                <div style={{ marginBottom: 12 }}>
                    <label>
                        Стартовый уровень:<br />
                        <input
                            name="startLevel"
                            type="number"
                            value={form.startLevel ?? ""}
                            onChange={handleChange}
                            min={1}
                            max={20}
                            style={{ width: "100%", padding: 8 }}
                        />
                    </label>
                </div>
                <div style={{ marginBottom: 12 }}>
                    <label>
                        Минимум игроков:<br />
                        <input
                            name="minPlayers"
                            type="number"
                            value={form.minPlayers ?? ""}
                            onChange={handleChange}
                            min={1}
                            max={12}
                            required
                            style={{ width: "100%", padding: 8 }}
                        />
                    </label>
                </div>
                <div style={{ marginBottom: 12 }}>
                    <label>
                        Максимум игроков:<br />
                        <input
                            name="maxPlayers"
                            type="number"
                            value={form.maxPlayers ?? ""}
                            onChange={handleChange}
                            min={form.minPlayers ?? 1}
                            max={16}
                            required
                            style={{ width: "100%", padding: 8 }}
                        />
                    </label>
                </div>
                <div style={{ marginBottom: 12 }}>
                    <label>
                        Цена (единиц):<br />
                        <input
                            name="priceUnits"
                            type="number"
                            value={form.priceUnits ?? ""}
                            onChange={handleChange}
                            min={0}
                            style={{ width: "100%", padding: 8 }}
                        />
                    </label>
                </div>
                <div>
                    <button type="submit" disabled={saving} style={{ marginRight: 10 }}>
                        {isEdit ? "Сохранить" : "Создать"}
                    </button>
                    <button type="button" onClick={() => navigate("/adventures")}>
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
