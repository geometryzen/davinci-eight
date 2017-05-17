export function isDefined<T>(arg: T): arg is T {
    return (typeof arg !== 'undefined');
}
