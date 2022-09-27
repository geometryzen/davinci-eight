export function isNegativeZero(value: number): boolean {
    value = +value; // cast to number
    if (value) {
        return false;
    }
    const infValue = 1 / value;
    return infValue < 0;
}
