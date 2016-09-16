import bind from './bind';
import unbind from './unbind';
import Bindable from './Bindable';

export default function binding(elem: Element | EventTarget, event: string, func: (e: Event) => any, useCapture = false): Bindable {
    const that: Bindable = {
        bind() {
            bind(elem, event, func, useCapture);
            return that;
        },
        unbind() {
            unbind(elem, event, func, useCapture);
            return that;
        }
    };
    return that;
}
