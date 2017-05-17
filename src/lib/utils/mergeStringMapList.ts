export function mergeStringMapList<T>(ms: { [name: string]: T }[]): { [name: string]: T } {

    let result: { [name: string]: T } = {};

    ms.forEach(function (m) {
        let keys = Object.keys(m);
        let keysLength = keys.length;
        for (var i = 0; i < keysLength; i++) {
            let key = keys[i];
            let value = m[key];
            result[key] = value;
        }
    });

    return result;
}
