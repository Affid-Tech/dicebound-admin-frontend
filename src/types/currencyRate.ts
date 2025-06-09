export interface CurrencyRateDto {
    currency: string;
    ratio: number;
    updatedAt: string; // ISO string
}

export interface CurrencyRateCreateDto {
    currency: string;
    ratio: number;
}

export interface CurrencyRatePatchDto {
    ratio?: number;
}
