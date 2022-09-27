import { isNegativeZero } from "./isNegativeZero";

export function ignoreNegativeZero(value: number): number {
    if (isNegativeZero(value)) {
        return 0;
    }
    else {
        return value;
    }
}
