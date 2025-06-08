export type UserRole = "PLAYER" | "DUNGEON_MASTER" | "ADMIN";

export interface UserDto {
    id: string;
    name: string;
    email?: string;
    bio?: string;
    roles: UserRole[];
}

export interface UserCreateDto {
    name: string;
    email?: string;
    bio?: string;
}

export interface UserPatchDto {
    name?: string;
    email?: string;
    bio?: string;
}
