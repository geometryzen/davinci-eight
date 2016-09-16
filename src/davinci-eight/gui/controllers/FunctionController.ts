import Controller from './Controller';
import addClass from '../dom/addClass';
import removeClass from '../dom/removeClass';
import bind from '../dom/bind';

export default class FunctionController extends Controller<() => any> {
    __button: HTMLDivElement;
    constructor(object: {}, property: string, text: string) {
        super(object, property);
        this.__button = document.createElement('div');
        this.__button.innerHTML = (text === undefined) ? 'Fire' : text;
        bind(this.__button, 'click', (e: MouseEvent) => {
            e.preventDefault();
            this.fire();
            // return false;
        });

        addClass(this.__button, 'button');

        this.domElement.appendChild(this.__button);
    }
    complete(): void {
        /*
        bind(this.__li, 'click', () => {
            dom.fakeEvent(this.__button, 'click');
        });
        */

        bind(this.__li, 'mouseover', () => {
            addClass(this.__button, 'hover');
        });

        bind(this.__li, 'mouseout', () => {
            removeClass(this.__button, 'hover');
        });
    }
    fire() {
        if (this.__onChange) {
            this.__onChange.call(this);
        }
        this.getValue().call(this.object);
        if (this.__onFinishChange) {
            this.__onFinishChange.call(this, this.getValue());
        }
    }
}
