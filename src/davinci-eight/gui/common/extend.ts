import isUndefined from './isUndefined';

export default function extend(target: any, source: any) {
    for (var key in source) {
        if (!isUndefined(source[key])) {
            target[key] = source[key];
        }
    }
}
