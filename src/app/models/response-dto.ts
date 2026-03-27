import { FiddleData } from "./fiddle-data";

export interface ApiResponseDto{
    result: Array<FiddleData>|FiddleData|null;
    message: string;
    total: number;
}