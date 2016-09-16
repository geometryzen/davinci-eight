export default function removeClass(elem: Element, className: string) {
    if (className) {
        if (elem.className === undefined) {
            // elem.className = className;
        } else if (elem.className === className) {
            elem.removeAttribute('class');
        } else {
            const classes = elem.className.split(/ +/);
            const index = classes.indexOf(className);
            if (index !== -1) {
                classes.splice(index, 1);
                elem.className = classes.join(' ');
            }
        }
    } else {
        elem.className = undefined;
    }
}
