export default function unbind(elem: Element | EventTarget, event: string, func: (e: Event) => any, useCapture = false) {
    if (elem.removeEventListener)
        elem.removeEventListener(event, func, useCapture);
    else if (elem['detachEvent'])
        elem['detachEvent']('on' + event, func);
}
