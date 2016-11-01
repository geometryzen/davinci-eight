export default function isString(s: any): s is string {
    return (typeof s === 'string');
}
