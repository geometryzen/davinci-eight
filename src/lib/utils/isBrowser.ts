export function isBrowser(): boolean {
    return typeof window === 'object' && typeof document === 'object';
}
