export default function isActive(elem: Element): boolean {
    return elem === document.activeElement && (elem['type'] || elem['href']);
}
