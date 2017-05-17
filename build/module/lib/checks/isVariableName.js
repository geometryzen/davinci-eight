export function isVariableName(name) {
    if (typeof name === 'string') {
        if (name.length > 0) {
            return true;
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
}
