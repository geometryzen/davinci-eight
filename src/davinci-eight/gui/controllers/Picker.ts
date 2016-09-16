import Controller from './Controller';
import getDevicePixelRatio from '../common/getDevicePixelRatio';
import binding from '../dom/binding';
import Bindable from '../dom/Bindable';
import addClass from '../dom/addClass';
import removeClass from '../dom/removeClass';

/**
 * This should be renamed CanvasPicker to reflect the services that it provides.
 */
export default class Picker<T> extends Controller<T> {
    CSS_PREFIX: string;
    bgColor: string;
    dimColor: string;
    fnColor: string;
    selColor: string;
    renderer: { frame: number; drawFrame: () => any; start: () => any; stop: () => any };
    private __input: HTMLInputElement;
    protected __selector: HTMLDivElement;
    canvas: HTMLCanvasElement;
    isVisible: boolean;
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
    private __mouseDownBinding: Bindable;
    private __mouseMoveBinding: Bindable;
    private __mouseUpBinding: Bindable;
    private __clickBinding: Bindable;
    private __keyDownBinder: Bindable;
    constructor(object: {}, property: string, CSS_PREFIX: string, properties = {}) {
        super(object, property);
        this.CSS_PREFIX = CSS_PREFIX;

        this.bgColor = 'rgb(46, 46, 46)';
        this.dimColor = 'rgb(100, 100, 100)';
        this.fnColor = 'rgb(230, 230, 230)';
        this.selColor = 'rgb(255, 255, 255)';

        for (let prop in properties) {
            if (properties.hasOwnProperty(prop)) {
                this[prop] = properties[prop];
            }
        }

        /**
         *  This initializes the renderer. It uses requestAnimationFrame() to
         *  smoothly render changes in the color picker as user interacts with it.
         */
        this.renderer = {
            // Stores a reference to the animation rendering loop.
            frame: null,

            drawFrame: () => {
                // console.log("drawFrame called");
                if (!this.__selector) {
                    return;
                }
                this.updateDisplay();
            },

            // Starts animation rendering loop
            start: () => {
                this.renderer.drawFrame();
                this.renderer.frame = window.requestAnimationFrame(this.renderer.start);
            },

            // Stops animation rendering loop
            stop: () => {
                window.cancelAnimationFrame(this.renderer.frame);
            }
        };
        this.isVisible = false;

        this.__input = document.createElement('input');
        this.__input.type = 'text';

        const onChange = () => {
            // TODO: The input (string) will need to be parsed.
            // this.setValue(this.__input.value);
        };

        const onBlur = () => {
            if (this.__onFinishChange) {
                this.__onFinishChange.call(this, this.getValue());
            }
        };
        binding(this.__input, 'keyup', onChange).bind();
        binding(this.__input, 'change', onChange).bind();
        binding(this.__input, 'blur', onBlur).bind();
        // Hitting the Enter key while in the field should trigger the same action as losing focus.
        binding(this.__input, 'keydown', (e: KeyboardEvent) => {
            if (e.keyCode === 13) {
                // We could use the this keyword directly  with a normal function to refer to the control,
                // but this is more type-safe.
                this.__input.blur();
            }
        }).bind();

        this.__selector = document.createElement('div');
        this.__selector.className = this.CSS_PREFIX + 'modal ge_picker_modal';
        this.__selector.className = 'selector';
        this.__selector.style.backgroundColor = this.bgColor;

        binding(this.__selector, 'mousedown', (mouseDownEvent: MouseEvent) => {
            addClass(this.__selector, 'drag');
            this.onMouseDown(mouseDownEvent);
            let mouseUp = binding(window, 'mouseup', (e: MouseEvent) => {
                removeClass(this.__selector, 'drag');
                mouseUp.unbind();
                mouseUp = void 0;
            }).bind();

        }).bind();

        this.width = 122;
        this.height = 102;
        this.__selector.style.width = '122px';
        this.__selector.style.height = '102px';
        this.__selector.style.padding = '3px';
        this.__selector.style.backgroundColor = '#222';
        this.__selector.style.boxShadow = '0px 1px 3px rgba(0,0,0,0.3)';

        this.__input.style.outline = 'none';
        this.__input.style.textAlign = 'left';
        this.__input.style.color = '#FFFFFF';
        this.__input.style.border = '0';
        this.__input.setAttribute('readonly', '1');
        // this.__input.style.fontWeight = 'bold';

        this.canvas = document.createElement('canvas');
        this.canvas.className = this.CSS_PREFIX + 'canvas ge_picker_canvas';
        this.canvas.style.backgroundColor = this.bgColor;

        this.__selector.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');

        // console.log(`width, height => ${this.width}, ${this.height}`);
        const ratio = getDevicePixelRatio(this.ctx);
        // console.log(`ratio => ${ratio}`);
        this.canvas.width = this.width * ratio;
        this.canvas.height = this.height * ratio;
        this.ctx.scale(ratio, ratio);

        this.domElement.appendChild(this.__input);
        this.domElement.appendChild(this.__selector);
    }

    close() {
        this.destroyEvents();
        this.__mouseDownBinding.unbind();
        this.__mouseDownBinding = void 0;
    }

    /**
     *
     */
    protected destroyEvents() {
        this.__mouseMoveBinding.unbind();
        this.__mouseMoveBinding = void 0;

        this.__mouseUpBinding.unbind();
        this.__mouseUpBinding = void 0;
    }

    protected onMouseDown(mouseDownEvent: MouseEvent) {
        mouseDownEvent.preventDefault();

        const mouseMoveHandler = (mouseMoveEvent: MouseEvent) => {
            this.onMouseMove(mouseMoveEvent);
        };

        // Starts listening for mousemove and mouseup events
        this.__mouseMoveBinding = binding(this.__selector, 'mousemove', mouseMoveHandler).bind();

        this.__mouseUpBinding = binding(window, 'mouseup', (e: MouseEvent) => {
            this.renderer.stop();
            this.destroyEvents();
        }).bind();

        // mouseDown triggers mouseMove
        mouseMoveHandler(mouseDownEvent);

        this.renderer.start();
    }

    protected onMouseMove(event: MouseEvent) {
        // Expecting derived classes to override.
    }

    /*
    showAt(cm) {
        let cursor = cm.cursorCoords(true, 'page');
        let x = cursor.left;
        let y = cursor.top;

        x -= this.width * 0.5;
        y += 30;

        // // Check if desired x, y will be outside the viewport.
        // // Do not allow the modal to disappear off the edge of the window.
        // x = (x + this.width < window.innerWidth) ? x : (window.innerWidth - 20 - this.width);
        // y = (y + this.height < window.innerHeight) ? y : (window.innerHeight - 20 - this.height);

        this.presentModal(x, y);
    }
    */

    presentModal(x: number, y: number): void {
        // Listen for interaction outside of the modal
        window.setTimeout(() => {
            this.__clickBinding = binding(document.body, 'click', (event: MouseEvent) => {
                // HACKY!!
                // A click event fires on the body after mousedown - mousemove, simultaneously with
                // mouseup. So if someone started a mouse action inside the modal and then
                // mouseup'd outside of it, it fires a click event on the body, thus, causing the
                // modal to disappear when the user does not expect it to, since the mouse down event
                // did not start outside the modal.
                // There might be (or should be) a better way to track this, but right now, just cancel
                // the event if the target ends up being on the body directly rather than on one of the
                // other child elements.
                if (event.target === document.body) {
                    return;
                }
                // end this specific hacky part

                let target = <HTMLElement>event.target;

                while (target !== document.documentElement && !target.classList.contains(this.CSS_PREFIX + 'modal')) {
                    target = <HTMLElement>target.parentNode;
                }

                if (!target.classList.contains(this.CSS_PREFIX + 'modal')) {
                    this.removeModal();
                }
            }).bind();
            this.__keyDownBinder = binding(window, 'keydown', () => { this.removeModal(); }).bind();
        }, 0);

        this.isVisible = true;

        this.__selector.style.left = x + 'px';
        this.__selector.style.top = y + 'px';
        this.__selector.style.width = this.width + 'px';
        this.__selector.style.height = this.height + 'px';
        // document.body.appendChild(this.__selector);

        // Add a handler for mousedown, which will start the animation loop.
        this.__mouseDownBinding = binding(this.__selector, 'mousedown', (event: MouseEvent) => {
            this.onMouseDown(event);
        }).bind();

        // We draw a SINGLE frame. We only animate when the mousedown event is received.
        this.renderer.drawFrame();
    }

    /**
     *  Removes modal from DOM and destroys related event listeners
     */
    removeModal() {
        if (this.__selector && this.__selector.parentNode) {
            this.__selector.parentNode.removeChild(this.__selector);
        }

        this.__clickBinding.unbind();
        this.__clickBinding = void 0;

        this.__keyDownBinder.unbind();
        this.__keyDownBinder = void 0;

        this.close();
        this.isVisible = false;
    }
}
