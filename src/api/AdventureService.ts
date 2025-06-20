import {fetchWithAuth} from "./fetchWithAuth";
import type {AdventureCreateDto, AdventureDto, AdventurePatchDto} from "../types/adventure";

export const AdventureService = {
    async list(): Promise<AdventureDto[]> {
        const res = await fetchWithAuth("/api/adventures");
        if (!res.ok) throw new Error("Ошибка загрузки приключений");
        return res.json();
    },
    async get(id: string): Promise<AdventureDto> {
        const res = await fetchWithAuth(`/api/adventures/${id}`);
        if (!res.ok) throw new Error("Приключение не найдено");
        return res.json();
    },
    async create(data: AdventureCreateDto): Promise<AdventureDto> {
        const res = await fetchWithAuth("/api/adventures", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Ошибка создания приключения");
        return res.json();
    },
    async patch(id: string, data: AdventurePatchDto): Promise<AdventureDto> {
        const res = await fetchWithAuth(`/api/adventures/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Ошибка обновления приключения");
        return res.json();
    },

    async remove(id: string): Promise<void> {
        const res = await fetchWithAuth(`/api/adventures/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Ошибка удаления приключения");
    },

    async uploadCover(adventureId: string, file: File): Promise<string> {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetchWithAuth(`/api/adventures/${adventureId}/cover`, {
            method: "POST",
            body: formData,
        });
        if (!res.ok) throw new Error("Ошибка загрузки обложки");
        // Предположим, что backend возвращает { coverUrl: "..." }
        const data = await res.json();
        return data.coverUrl;
    }
};
