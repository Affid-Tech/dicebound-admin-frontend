import {fetchWithAuth} from "./fetchWithAuth";
import type {CurrencyRateCreateDto, CurrencyRateDto, CurrencyRatePatchDto} from "../types/currencyRate";

export const CurrencyRateService = {
    async list(): Promise<CurrencyRateDto[]> {
        const res = await fetchWithAuth("/api/currency");
        if (!res.ok) throw new Error("Ошибка загрузки курсов");
        return res.json();
    },
    async create(data: CurrencyRateCreateDto): Promise<CurrencyRateDto> {
        const res = await fetchWithAuth("/api/currency", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Ошибка создания курса");
        return res.json();
    },
    async patch(currency: string, data: CurrencyRatePatchDto): Promise<CurrencyRateDto> {
        const res = await fetchWithAuth(`/api/currency/${currency}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Ошибка обновления курса");
        return res.json();
    },
    async remove(currency: string): Promise<void> {
        const res = await fetchWithAuth(`/api/currency/${currency}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Ошибка удаления курса");
    },
};
