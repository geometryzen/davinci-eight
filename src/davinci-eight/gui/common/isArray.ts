export default function isArray(obj: any): boolean {
    if (obj) {
        return obj.constructor === Array;
    }
    else {
        return false;
    }
}
