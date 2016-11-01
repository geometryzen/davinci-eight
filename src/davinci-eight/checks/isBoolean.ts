export default function isBoolean(x: any): x is boolean {
    return (typeof x === 'boolean');
}
