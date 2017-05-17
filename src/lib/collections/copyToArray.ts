export function copyToArray<T>(source: T[], destination: T[] = [], offset = 0): T[] {
    const length = source.length;
    for (let i = 0; i < length; i++) {
        destination[offset + i] = source[i];
    }
    return destination;
}
