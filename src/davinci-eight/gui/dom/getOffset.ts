export default function getOffset(elem: HTMLElement) {
    const offset = { left: 0, top: 0 };
    if (elem.offsetParent) {
        do {
            offset.left += elem.offsetLeft;
            offset.top += elem.offsetTop;
        } while (elem = <HTMLElement>elem.offsetParent);
    }
    return offset;
}
