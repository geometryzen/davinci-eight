import bind from '../dom/bind';
// import unbind from '../dom/unbind';
import addClass from '../dom/addClass';
// import removeClass from '../dom/removeClass';

const TEXT_CLOSED = 'Close Controls';
// const TEXT_OPEN = 'Open Controls';
// const CLASS_CLOSED = 'closed';
const CLASS_CLOSE_BUTTON = 'close-button';

interface Closable {
    domElement: HTMLDivElement;
    __closeButton: HTMLDivElement;
    closed: boolean;
}

export default function addCloseButton(gui: Closable) {
    gui.__closeButton = document.createElement('div');
    gui.__closeButton.innerHTML = TEXT_CLOSED;
    addClass(gui.__closeButton, CLASS_CLOSE_BUTTON);
    gui.domElement.appendChild(gui.__closeButton);

    bind(gui.__closeButton, 'click', () => {
        gui.closed = !gui.closed;
    });
}
