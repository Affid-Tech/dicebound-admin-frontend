import {fetchWithAuth} from "./fetchWithAuth";
import type {UserCreateDto, UserDto, UserPatchDto, UserRole} from "../types/user";
import type {PageResponse} from "../types/commons.ts";

const roleToApi = (role: UserRole): string => {
    switch (role) {
        case "PLAYER": return "player";
        case "DUNGEON_MASTER": return "dungeon-master";
        case "ADMIN": return "admin";
        default: throw new Error("Unknown role: " + role);
    }
};

export const UserService = {

    async list(params: {
        page?: number;
        size?: number;
        role?: string;
        sort?: string[];
    }) {
        const sp = new URLSearchParams();
        if (params.page !== undefined) sp.set("page", params.page.toString());
        if (params.size !== undefined) sp.set("size", params.size.toString());
        if (params.role) sp.set("role", params.role);
        params.sort?.forEach(s => sp.append("sort", s));

        const res = await fetchWithAuth(`/api/users?${sp.toString()}`);
        if (!res.ok) {
            throw new Error("Ошибка загрузки пользователей");
        }

        return res.json(); // PageResponse<UserDto>
    },

    async listDungeonMasters(): Promise<PageResponse<UserDto>> {
        const res = await fetchWithAuth("/api/users?role=DUNGEON_MASTER&size=1000");
        if (!res.ok) {
            throw new Error("Не удалось загрузить мастеров");
        }
        return res.json();
    },

    async listPlayers(params?: { q?: string; page?: number; size?: number }): Promise<PageResponse<UserDto>> {
        const sp = new URLSearchParams();
        sp.set("role", "PLAYER");
        sp.set("page", String(params?.page ?? 0));
        sp.set("size", String(params?.size ?? 20));
        if (params?.q?.trim()) {
            sp.set("q", params.q.trim());
        }

        const res = await fetchWithAuth(`/api/users?${sp.toString()}`);
        if (!res.ok) throw new Error("Не удалось загрузить игроков");
        return res.json();
    },

    async createPlayer(data: { name: string; email?: string; bio?: string }): Promise<UserDto> {
        const res = await fetchWithAuth("/api/users/players", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Не удалось создать игрока");
        return res.json();
    },

    async get(id: string): Promise<UserDto> {
        const res = await fetchWithAuth(`/api/users/${id}`);
        if (!res.ok) throw new Error("Пользователь не найден");
        return res.json();
    },
    async create(data: UserCreateDto): Promise<UserDto> {
        const res = await fetchWithAuth("/api/users", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Ошибка создания пользователя");
        return res.json();
    },
    async patch(id: string, data: UserPatchDto): Promise<UserDto> {
        const res = await fetchWithAuth(`/api/users/${id}`, {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Ошибка обновления пользователя");
        return res.json();
    },
    async remove(id: string): Promise<void> {
        const res = await fetchWithAuth(`/api/users/${id}`, {method: "DELETE"});
        if (!res.ok) throw new Error("Ошибка удаления пользователя");
    },

    async addRole(userId: string, role: UserRole): Promise<void> {
        const res = await fetchWithAuth(`/api/users/${userId}/roles/${roleToApi(role)}`, { method: "POST" });
        if (!res.ok) throw new Error("Ошибка добавления роли");
    },
    async removeRole(userId: string, role: UserRole): Promise<void> {
        const res = await fetchWithAuth(`/api/users/${userId}/roles/${roleToApi(role)}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Ошибка удаления роли");
    },
};
