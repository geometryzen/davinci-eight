export default function copyToArray<T>(source: T[], destination: T[] = [], offset = 0): T[] {
    let length = source.length
    for (var i = 0; i < length; i++) {
        destination[offset + i] = source[i]
    }
    return destination
}
