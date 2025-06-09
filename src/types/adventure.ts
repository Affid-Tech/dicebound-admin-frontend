import type { UserDto } from "./user";
import type { GameSessionDto } from "./gameSession.ts";
import type { AdventureSignupDto } from "./adventureSignup";

export type AdventureType = "ONESHOT" | "MULTISHOT" | "CAMPAIGN";

export interface AdventureDto {
    id: string;
    type: AdventureType;
    gameSystem: string;
    title: string;
    dungeonMaster: UserDto;
    description?: string;
    startLevel?: number;
    minPlayers: number;
    maxPlayers: number;
    priceUnits?: number;
    sessions: GameSessionDto[];
    signups: AdventureSignupDto[];
}

export interface AdventureCreateDto {
    type: AdventureType;
    gameSystem: string;
    title: string;
    dungeonMasterId: string;
    description?: string;
    startLevel?: number;
    minPlayers: number;
    maxPlayers: number;
    priceUnits?: number;
}

export interface AdventurePatchDto {
    type?: AdventureType;
    gameSystem?: string;
    title?: string;
    dungeonMasterId?: string;
    description?: string;
    startLevel?: number;
    minPlayers?: number;
    maxPlayers?: number;
    priceUnits?: number;
}
