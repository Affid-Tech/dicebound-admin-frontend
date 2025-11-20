import {fetchWithAuth} from "./fetchWithAuth";
import type {
    AdventureCreateDto,
    AdventureDto,
    AdventurePatchDto,
    AdventureStatus,
    AdventureType,
    AdventurePage
} from "../types/adventure";

interface AdventureListParams {
    page?: number;                 // 0-based
    size?: number;
    statuses?: AdventureStatus[];
    types?: AdventureType[];
    dungeonMasterIds?: string[];
    sort?: string[];               // например ["title,asc"]
}

export const AdventureService = {
    async list(params?: AdventureListParams): Promise<AdventurePage> {
        const searchParams = new URLSearchParams();

        if (params?.page !== undefined) searchParams.set("page", String(params.page));
        if (params?.size !== undefined) searchParams.set("size", String(params.size));

        params?.statuses?.forEach(s => searchParams.append("statuses", s));
        params?.types?.forEach(t => searchParams.append("types", t));
        params?.dungeonMasterIds?.forEach(id => searchParams.append("dungeonMasterIds", id));
        params?.sort?.forEach(s => searchParams.append("sort", s));

        const qs = searchParams.toString();
        const res = await fetchWithAuth(`/api/adventures${qs ? `?${qs}` : ""}`);
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
        const data = await res.json();
        return data.coverUrl;
    }
};
