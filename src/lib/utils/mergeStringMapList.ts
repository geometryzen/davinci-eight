/**
 * @hidden
 */
export function mergeStringMapList<T>(ms: { [name: string]: T }[]): { [name: string]: T } {

    const result: { [name: string]: T } = {};

    ms.forEach(function (m) {
        const keys = Object.keys(m);
        const keysLength = keys.length;
        for (let i = 0; i < keysLength; i++) {
            const key = keys[i];
            const value = m[key];
            result[key] = value;
        }
    });

    return result;
}
