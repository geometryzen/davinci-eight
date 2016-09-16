export default function addClass(elem: HTMLElement, className: string): void {
    if (elem.className === undefined) {
        elem.className = className;
    } else if (elem.className !== className) {
        const classes = elem.className.split(/ +/);
        if (classes.indexOf(className) === -1) {
            classes.push(className);
            elem.className = classes.join(' ').replace(/^\s+/, '').replace(/\s+$/, '');
        }
    }
}
