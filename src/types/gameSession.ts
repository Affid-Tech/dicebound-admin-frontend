export interface GameSessionDto {
    id: string;
    adventureId: string;
    startTime: string; // ISO-8601
    durationHours: number;
    linkFoundry?: string;
    notes?: string;
}

export interface GameSessionCreateDto {
    adventureId: string;
    startTime: string; // ISO-8601
    durationHours: number;
    linkFoundry?: string;
    notes?: string;
}

export interface GameSessionPatchDto {
    startTime?: string;
    durationHours?: number;
    linkFoundry?: string;
    notes?: string;
}
