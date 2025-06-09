import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CurrencyRateService } from "../api/CurrencyRateService";
import type { CurrencyRateCreateDto, CurrencyRatePatchDto } from "../types/currencyRate";

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
            // Получить текущий курс (через list + find, так как GET /currency-rates/{currency} нет)
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
                await CurrencyRateService.patch(currency, currency as CurrencyRatePatchDto);
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

    if (loading) return <div>Загрузка...</div>;

    return (
        <div className="card card--narrow">
            <h2>{isEdit ? `Редактирование курса: ${currency}` : "Добавить курс"}</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 12 }}>
                    <label>
                        Валюта:<br />
                        <input
                            name="currency"
                            type="text"
                            value={form.currency}
                            onChange={handleChange}
                            required
                            disabled={isEdit}
                            style={{ width: "100%", padding: 8 }}
                        />
                    </label>
                </div>
                <div style={{ marginBottom: 12 }}>
                    <label>
                        Курс:<br />
                        <input
                            name="ratio"
                            type="number"
                            value={form.ratio}
                            onChange={handleChange}
                            min={1}
                            step={1}
                            required
                            style={{ width: "100%", padding: 8 }}
                        />
                    </label>
                </div>
                <div>
                    <button type="submit" disabled={saving} style={{ marginRight: 10 }}>
                        {isEdit ? "Сохранить" : "Добавить"}
                    </button>
                    <button type="button" onClick={() => navigate("/currency-rates")}>
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
