import each from '../common/each';

const EVENT_MAP = {
    'HTMLEvents': ['change'],
    'MouseEvents': ['click', 'mousemove', 'mousedown', 'mouseup', 'mouseover'],
    'KeyboardEvents': ['keydown']
};

const EVENT_MAP_INV: { [name: string]: string } = {};

each(EVENT_MAP, function (v, k) {
    each(v, function (e) {
        EVENT_MAP_INV[e] = k;
    });
});

export function fakeEvent(elem, eventType: string, params, aux) {
    params = params || {};
    var className = EVENT_MAP_INV[eventType];
    if (!className) {
        throw new Error('Event type ' + eventType + ' not supported.');
    }
    var evt = document.createEvent(className);
    switch (className) {
        case 'MouseEvents':
            var clientX = params.x || params.clientX || 0;
            var clientY = params.y || params.clientY || 0;
            evt.initMouseEvent(eventType, params.bubbles || false,
                params.cancelable || true, window, params.clickCount || 1,
                0, // screen X
                0, // screen Y
                clientX, // client X
                clientY, // client Y
                false, false, false, false, 0, null);
            break;
        case 'KeyboardEvents':
            var init = evt.initKeyboardEvent || evt.initKeyEvent; // webkit || moz
            common.defaults(params, {
                cancelable: true,
                ctrlKey: false,
                altKey: false,
                shiftKey: false,
                metaKey: false,
                keyCode: undefined,
                charCode: undefined
            });
            init(eventType, params.bubbles || false,
                params.cancelable, window,
                params.ctrlKey, params.altKey,
                params.shiftKey, params.metaKey,
                params.keyCode, params.charCode);
            break;
        default:
            evt.initEvent(eventType, params.bubbles || false,
                params.cancelable || true);
            break;
    }
    common.defaults(evt, aux);
    elem.dispatchEvent(evt);
}
