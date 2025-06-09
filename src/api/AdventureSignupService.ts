import { fetchWithAuth } from "./fetchWithAuth";
import type { AdventureSignupDto, AdventureSignupCreateDto, AdventureSignupPatchDto } from "../types/adventureSignup";

export const AdventureSignupService = {
    async listForAdventure(adventureId: string): Promise<AdventureSignupDto[]> {
        const res = await fetchWithAuth(`/api/adventures/${adventureId}/signups`);
        if (!res.ok) throw new Error("Ошибка загрузки заявок");
        return res.json();
    },
    async create(data: AdventureSignupCreateDto): Promise<AdventureSignupDto> {
        const res = await fetchWithAuth(`/api/signups`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Ошибка создания заявки");
        return res.json();
    },
    async patch(signupId: string, data: AdventureSignupPatchDto): Promise<AdventureSignupDto> {
        const res = await fetchWithAuth(`/api/signups/${signupId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Ошибка обновления заявки");
        return res.json();
    },
    async remove(signupId: string): Promise<void> {
        const res = await fetchWithAuth(`/api/signups/${signupId}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Ошибка удаления заявки");
    },
};
