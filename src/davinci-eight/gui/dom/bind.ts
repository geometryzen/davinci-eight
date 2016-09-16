export default function bind(elem: Element | EventTarget, event: string, func: (e: Event) => any, useCapture = false) {
    if (elem.addEventListener) {
        elem.addEventListener(event, func, useCapture);
    }
    else if (elem['attachEvent']) {
        elem['attachEvent']('on' + event, func);
    }
}
