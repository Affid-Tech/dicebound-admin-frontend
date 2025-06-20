import type {UserDto} from "./user";

export type AdventureSignupStatus = "PENDING" | "APPROVED" | "CANCELED";

export interface AdventureSignupDto {
    id: string;
    adventureId: string;
    user: UserDto;
    status: AdventureSignupStatus;
}

export interface AdventureSignupCreateDto {
    adventureId: string;
    userId: string;
}

export interface AdventureSignupPatchDto {
    status?: AdventureSignupStatus;
}
