import { FiddleData } from "./fiddle-data";

export interface ApiResponseDto{
    result: FiddleData|null;
    message: string;
    total: number;
}