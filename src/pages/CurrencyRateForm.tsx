import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Alert, Box, Button, Card, CardContent, CircularProgress, Stack, TextField, Typography} from "@mui/material";
import {CurrencyRateService} from "../api/CurrencyRateService";
import type {CurrencyRateCreateDto, CurrencyRatePatchDto} from "../types/currencyRate";

export default function CurrencyRateForm() {
    const { currency } = useParams<{ currency: string }>();
    const isEdit = Boolean(currency);

    const [form, setForm] = useState<CurrencyRateCreateDto>({ currency: "", ratio: 1 });
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (isEdit && currency) {
            setLoading(true);
            CurrencyRateService.list()
                .then(rates => {
                    const rate = rates.find(r => r.currency === currency);
                    if (rate) setForm({ currency: rate.currency, ratio: rate.ratio });
                    else setError("Курс не найден");
                })
                .catch(e => setError(e.message))
                .finally(() => setLoading(false));
        }
    }, [isEdit, currency]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({
            ...prev,
            [e.target.name]: e.target.name === "ratio" ? Number(e.target.value) : e.target.value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        try {
            if (isEdit && currency) {
                await CurrencyRateService.patch(currency, form as CurrencyRatePatchDto);
            } else {
                await CurrencyRateService.create(form);
            }
            navigate("/currency-rates");
        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message);
            else setError("Ошибка сохранения");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (isEdit && currency && window.confirm("Удалить курс?")) {
            try {
                await CurrencyRateService.remove(currency);
                navigate("/currency-rates");
            } catch (err: unknown) {
                if (err instanceof Error) setError(err.message);
                else setError("Ошибка удаления");
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
                <Typography variant="h6" gutterBottom>
                    {isEdit ? `Редактирование курса: ${currency}` : "Добавить курс"}
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Stack spacing={2}>
                        {!isEdit && (<TextField
                            label="Валюта"
                            name="currency"
                            value={form.currency}
                            onChange={handleChange}
                            required
                            disabled={isEdit}
                            fullWidth
                        />)}
                        <TextField
                            label="Курс"
                            name="ratio"
                            type="number"
                            value={form.ratio}
                            onChange={handleChange}
                            inputProps={{
                                min: 1,
                                step: 1,
                            }}
                            required
                            fullWidth
                        />

                        {error && <Alert severity="error">{error}</Alert>}

                        <Box display="flex" gap={1} mt={2}>
                            <Button
                                variant="contained"
                                type="submit"
                                disabled={saving}
                            >
                                {isEdit ? "Сохранить" : "Добавить"}
                            </Button>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => navigate("/currency-rates")}
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
