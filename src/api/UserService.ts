import {fetchWithAuth} from "./fetchWithAuth";
import type {UserCreateDto, UserDto, UserPatchDto, UserRole} from "../types/user";

const roleToApi = (role: UserRole): string => {
    switch (role) {
        case "PLAYER": return "player";
        case "DUNGEON_MASTER": return "dungeon-master";
        case "ADMIN": return "admin";
        default: throw new Error("Unknown role: " + role);
    }
};

export const UserService = {
    async list(): Promise<UserDto[]> {
        const res = await fetchWithAuth("/api/users");
        if (!res.ok) throw new Error("Ошибка загрузки пользователей");
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
