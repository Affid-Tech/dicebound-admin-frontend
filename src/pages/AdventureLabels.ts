import type {AdventureStatus, AdventureType} from "../types/adventure.ts";

export const adventureTypes: { value: AdventureType; label: string }[] = [
    {value: "ONESHOT", label: "Oneshot"},
    {value: "MULTISHOT", label: "Multishot"},
    {value: "CAMPAIGN", label: "Campaign"},
];

export const adventureStatuses: { value: AdventureStatus; label: string }[] = [
    { value: "PLANNED", label: "Запланировано" },
    { value: "RECRUITING", label: "Идет набор" },
    { value: "IN_PROGRESS", label: "Идет игра" },
    { value: "CANCELLED", label: "Отменено" },
    { value: "COMPLETED", label: "Завершено" },
];