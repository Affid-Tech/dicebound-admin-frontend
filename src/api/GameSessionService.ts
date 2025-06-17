import {fetchWithAuth} from "./fetchWithAuth";
import type {GameSessionCreateDto, GameSessionDto, GameSessionPatchDto} from "../types/gameSession";

export const GameSessionService = {
    async listForAdventure(adventureId: string): Promise<GameSessionDto[]> {
        const res = await fetchWithAuth(`/api/adventures/${adventureId}/sessions`);
        if (!res.ok) throw new Error("Ошибка загрузки сессий");
        return res.json();
    },

    async get(id: string): Promise<GameSessionDto> {
        const res = await fetchWithAuth(`/api/sessions/${id}`);
        if (!res.ok) throw new Error("Сессия не найдена");
        return res.json();
    },

    async create(data: GameSessionCreateDto): Promise<GameSessionDto> {
        const res = await fetchWithAuth(`/api/sessions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Ошибка создания сессии");
        return res.json();
    },
    async patch(sessionId: string, data: GameSessionPatchDto): Promise<GameSessionDto> {
        const res = await fetchWithAuth(`/api/sessions/${sessionId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Ошибка обновления сессии");
        return res.json();
    },
    async remove(sessionId: string): Promise<void> {
        const res = await fetchWithAuth(`/api/sessions/${sessionId}`, {
            method: "DELETE",
        });
        if (!res.ok) throw new Error("Ошибка удаления сессии");
    },
};
