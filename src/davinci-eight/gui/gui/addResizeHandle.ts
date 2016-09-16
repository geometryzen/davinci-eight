import bind from '../dom/bind';
import unbind from '../dom/unbind';
import addClass from '../dom/addClass';
import removeClass from '../dom/removeClass';

const CLASS_DRAG = 'drag';
const PROP_RESIZE_HANDLE = '__resize_handle';

export interface Resizable {
    domElement: HTMLDivElement;
    __resize_handle: HTMLDivElement;
    __closeButton: any;
    width: number;
    onResize(): void;
}

export default function addResizeHandle(gui: Resizable) {

    const resizeHandle = document.createElement('div');
    gui[PROP_RESIZE_HANDLE] = resizeHandle;
    gui.__resize_handle = resizeHandle;

    resizeHandle.style.width = '6px';
    resizeHandle.style.marginLeft = '-3px';
    resizeHandle.style.height = '200px';
    resizeHandle.style.cursor = 'ew-resize';
    resizeHandle.style.position = 'absolite';

    let pmouseX: number;

    bind(resizeHandle, 'mousedown', dragStart);
    if (gui.__closeButton) {
        bind(gui.__closeButton, 'mousedown', dragStart);
    }

    gui.domElement.insertBefore(resizeHandle, gui.domElement.firstElementChild);

    function dragStart(e: MouseEvent) {

        e.preventDefault();

        pmouseX = e.clientX;

        if (gui.__closeButton) {
            addClass(gui.__closeButton, CLASS_DRAG);
        }
        bind(window, 'mousemove', drag);
        bind(window, 'mouseup', dragStop);

        return false;

    }

    function drag(e: MouseEvent) {

        e.preventDefault();

        gui.width += pmouseX - e.clientX;
        gui.onResize();
        pmouseX = e.clientX;

        return false;

    }

    function dragStop() {

        if (gui.__closeButton) {
            removeClass(gui.__closeButton, CLASS_DRAG);
        }
        unbind(window, 'mousemove', drag);
        unbind(window, 'mouseup', dragStop);

    }

}
