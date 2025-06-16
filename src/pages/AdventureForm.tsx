import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdventureService } from "../api/AdventureService";
import { UserService } from "../api/UserService";
import type { AdventureDto, AdventureCreateDto, AdventurePatchDto, AdventureType } from "../types/adventure";
import type { UserDto } from "../types/user";
import {
    Grid,
    Box,
    Typography,
    TextField,
    Select,
    MenuItem,
    Button,
    InputLabel,
    FormControl,
    FormHelperText, type SelectChangeEvent,
} from "@mui/material";

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

    useEffect(() => {
        UserService.list()
            .then(all => setUsers(all.filter(u => u.roles.includes("DUNGEON_MASTER"))))
            .catch(() => setUsers([]));
    }, []);

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

    const handleSelectChange = (e: SelectChangeEvent<string>) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]:
                name === "minPlayers" ||
                name === "maxPlayers" ||
                name === "priceUnits" ||
                name === "startLevel"
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

    if (loading) return <Typography>Загрузка...</Typography>;

    return (
        <Box sx={{ maxWidth: 600, mx: "auto", mt: 3, p: 3, bgcolor: "background.paper", borderRadius: 3, boxShadow: 3 }}>
            <Typography variant="h5" mb={2}>
                {isEdit ? "Редактировать приключение" : "Создать приключение"}
            </Typography>
            <form onSubmit={handleSubmit} autoComplete="off">
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="Название"
                            name="title"
                            value={form.title ?? ""}
                            onChange={handleInputChange}
                            required
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth required>
                            <InputLabel id="type-label">Тип</InputLabel>
                            <Select
                                labelId="type-label"
                                name="type"
                                value={form.type ?? "ONESHOT"}
                                onChange={handleSelectChange}
                                label="Тип"
                            >
                                {adventureTypes.map(t => (
                                    <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Система"
                            name="gameSystem"
                            value={form.gameSystem ?? ""}
                            onChange={handleInputChange}
                            required
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <FormControl fullWidth required>
                            <InputLabel id="dungeonMasterId-label">Мастер</InputLabel>
                            <Select
                                labelId="dungeonMasterId-label"
                                name="dungeonMasterId"
                                value={form.dungeonMasterId ?? ""}
                                onChange={handleSelectChange}
                                label="Мастер"
                            >
                                <MenuItem value="" disabled>Выберите...</MenuItem>
                                {users.map(u => (
                                    <MenuItem key={u.id} value={u.id}>
                                        {u.name} ({u.email})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="Описание"
                            name="description"
                            value={form.description ?? ""}
                            onChange={handleInputChange}
                            multiline
                            minRows={3}
                        />
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                        <TextField
                            fullWidth
                            label="Стартовый уровень"
                            name="startLevel"
                            type="number"
                            value={form.startLevel ?? ""}
                            onChange={handleInputChange}
                            slotProps={{ htmlInput: { min: 1, max: 20}}}
                        />
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                        <TextField
                            fullWidth
                            label="Мин. игроков"
                            name="minPlayers"
                            type="number"
                            value={form.minPlayers ?? ""}
                            onChange={handleInputChange}
                            slotProps={{ htmlInput: { min: 1, max: 12}}}
                            required
                        />
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                        <TextField
                            fullWidth
                            label="Макс. игроков"
                            name="maxPlayers"
                            type="number"
                            value={form.maxPlayers ?? ""}
                            onChange={handleInputChange}
                            slotProps={{ htmlInput: { min: form.minPlayers ?? 1, max: 16}}}
                            required
                        />
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                        <TextField
                            fullWidth
                            label="Цена (единиц)"
                            name="priceUnits"
                            type="number"
                            value={form.priceUnits ?? ""}
                            onChange={handleInputChange}
                            slotProps={{ htmlInput: { min: 0}}}
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }} mt={2}>
                        <Box sx={{ display: "flex", gap: 2 }}>
                            <Button type="submit" variant="contained" color="primary" disabled={saving}>
                                {isEdit ? "Сохранить" : "Создать"}
                            </Button>
                            <Button variant="outlined" onClick={() => navigate("/adventures")}>
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
                        {error && (
                            <FormHelperText error sx={{ mt: 2 }}>
                                {error}
                            </FormHelperText>
                        )}
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
}
