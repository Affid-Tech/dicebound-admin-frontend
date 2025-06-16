import React, {type SyntheticEvent, useEffect, useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdventureService } from "../api/AdventureService";
import { UserService } from "../api/UserService";
import type {
    AdventureDto,
    AdventureCreateDto,
    AdventurePatchDto,
    AdventureType,
} from "../types/adventure";
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
    FormHelperText,
    Paper,
    CircularProgress,
    Alert,
    Autocomplete, type SelectChangeEvent,
} from "@mui/material";

const adventureTypes: { value: AdventureType; label: string }[] = [
    { value: "ONESHOT", label: "Oneshot" },
    { value: "MULTISHOT", label: "Multishot" },
    { value: "CAMPAIGN", label: "Campaign" },
];

type Validation = {
    title?: string;
    dungeonMasterId?: string;
    minPlayers?: string;
    maxPlayers?: string;
};

export default function AdventureForm({
                                          mode,
                                      }: Readonly<{ mode?: "create" | "edit" }>) {
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
    const [validation, setValidation] = useState<Validation>({});
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        UserService.list()
            .then((all) => setUsers(all.filter((u) => u.roles.includes("DUNGEON_MASTER"))))
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
                .catch((e) => setError(e.message))
                .finally(() => setLoading(false));
        }
    }, [isEdit, id]);

    // ---- Validation
    useEffect(() => {
        const newValidation: Validation = {};
        if (!form.title?.trim()) newValidation.title = "Укажите название приключения";
        if (!form.dungeonMasterId) newValidation.dungeonMasterId = "Выберите мастера";
        if (
            form.minPlayers !== undefined &&
            form.maxPlayers !== undefined &&
            form.minPlayers > form.maxPlayers
        ) {
            newValidation.minPlayers = "Мин. игроков не может быть больше макс.";
            newValidation.maxPlayers = "Макс. игроков не может быть меньше мин.";
        }
        setValidation(newValidation);
    }, [form.title, form.dungeonMasterId, form.minPlayers, form.maxPlayers]);

    // ---- Handlers
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({
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

    const handleSelectChange = (_e: SyntheticEvent<Element, Event>, newValue: UserDto | null) => {
        setForm((prev) => ({
            ...prev,
            dungeonMasterId: newValue?.id ?? "",
        }));
    };

    const handleTypeChange = (event: SelectChangeEvent<AdventureType>) => {
        setForm(prev => ({
            ...prev,
            type: event.target.value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(false);

        // Client validation before send
        if (Object.keys(validation).length > 0) {
            setSaving(false);
            return;
        }

        try {
            if (isEdit && id) {
                await AdventureService.patch(id, form as AdventurePatchDto);
            } else {
                await AdventureService.create(form as AdventureCreateDto);
            }
            setSuccess(true);
            setTimeout(() => navigate("/adventures"), 1200);
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

    if (loading)
        return (
            <Box sx={{ py: 6, textAlign: "center" }}>
                <CircularProgress />
            </Box>
        );

    return (
        <Paper elevation={3} sx={{ maxWidth: 650, mx: "auto", mt: 4, p: { xs: 2, sm: 4 } }}>
            <Typography variant="h5" mb={2}>
                {isEdit ? "Редактировать приключение" : "Создать приключение"}
            </Typography>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    Успешно сохранено!
                </Alert>
            )}

            <form onSubmit={handleSubmit} autoComplete="off">
                {/* Основная информация */}
                <Typography variant="subtitle1" sx={{ mb: 1, mt: 2 }}>
                    Основная информация
                </Typography>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="Название"
                            name="title"
                            value={form.title ?? ""}
                            onChange={handleInputChange}
                            required
                            helperText={validation.title ?? "Придумайте запоминающееся название для игры"}
                            inputProps={{ maxLength: 70 }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth required>
                            <InputLabel id="type-label">Тип</InputLabel>
                            <Select
                                labelId="type-label"
                                name="type"
                                value={form.type ?? "ONESHOT"}
                                onChange={handleTypeChange}
                                label="Тип"
                            >
                                {adventureTypes.map((t) => (
                                    <MenuItem key={t.value} value={t.value}>
                                        {t.label}
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>Выберите формат: Oneshot, Multishot или Campaign</FormHelperText>
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
                            helperText="Например: D&D 5e, Pathfinder 2, Fate, и т.д."
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <Autocomplete
                            options={users}
                            getOptionLabel={(option) => option.name + (option.email ? ` (${option.email})` : "")}
                            value={users.find((u) => u.id === form.dungeonMasterId) || null}
                            onChange={handleSelectChange}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Мастер"
                                    required
                                    helperText={validation.dungeonMasterId ?? "Кто будет вести приключение"}
                                />
                            )}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            clearOnBlur
                        />
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
                            helperText="Опишите сюжет, жанр или пожелания к участникам"
                        />
                    </Grid>
                </Grid>

                {/* Ограничения */}
                <Typography variant="subtitle1" sx={{ mb: 1, mt: 4 }}>
                    Ограничения и параметры
                </Typography>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 6, sm: 3 }}>
                        <TextField
                            fullWidth
                            label="Стартовый уровень"
                            name="startLevel"
                            type="number"
                            value={form.startLevel ?? ""}
                            onChange={handleInputChange}
                            inputProps={{ min: 1, max: 20 }}
                            helperText="1-20"
                        />
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                        <TextField
                            fullWidth
                            label="Мин. игроков *"
                            name="minPlayers"
                            type="number"
                            value={form.minPlayers ?? ""}
                            onChange={handleInputChange}
                            inputProps={{ min: 1, max: 12 }}
                            required
                            error={!!validation.minPlayers}
                            helperText={validation.minPlayers ?? "Минимальное число участников"}
                        />
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                        <TextField
                            fullWidth
                            label="Макс. игроков *"
                            name="maxPlayers"
                            type="number"
                            value={form.maxPlayers ?? ""}
                            onChange={handleInputChange}
                            inputProps={{ min: form.minPlayers ?? 1, max: 16 }}
                            required
                            error={!!validation.maxPlayers}
                            helperText={validation.maxPlayers ?? "Максимальное число участников"}
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
                            inputProps={{
                                min: 0,
                                endAdornment: <span style={{ opacity: 0.7, marginLeft: 4 }}>🪙</span>,
                            }}
                            helperText="Оставьте пустым, если игра бесплатная"
                        />
                    </Grid>
                </Grid>

                {/* Actions */}
                <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid size={{ xs: 12 }}>
                        <Box sx={{ display: "flex", gap: 2 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={saving || Object.keys(validation).length > 0}
                            >
                                {saving ? <CircularProgress size={20} color="inherit" /> : isEdit ? "Сохранить" : "Создать"}
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => navigate("/adventures")}
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
                    </Grid>
                </Grid>
            </form>
        </Paper>
    );
}
