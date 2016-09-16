import each from '../common/each';
import defer from '../common/defer';
import addClass from '../dom/addClass';
import removeClass from '../dom/removeClass';
import getHeight from '../dom/getHeight';
import getOffset from '../dom/getOffset';
import controllerFactory from '../controllers/controllerFactory';
import addCloseButton from './addCloseButton';
import addResizeHandle from './addResizeHandle';
import isUndefined from '../common/isUndefined';
import makeSelectable from '../dom/makeSelectable';

const CLASS_AUTO_PLACE_CONTAINER = 'ac';
const CLASS_AUTO_PLACE = 'a';
const CLASS_CONTROLLER_ROW = 'cr';
const CLASS_MAIN = 'main';
const CLASS_TOO_TALL = 'taller-than-window';
const TEXT_CLOSED = 'Close Controls';
const TEXT_OPEN = 'Open Controls';
const CLASS_CLOSED = 'closed';

const CSS_NAMESPACE = 'dg';
const CLOSE_BUTTON_HEIGHT = 20;
const DEFAULT_WIDTH = 245;

let auto_place_virgin = true;

// Fixed position div that auto place GUI's go inside.
let auto_place_container: HTMLDivElement;

export interface IController<T> {
    domElement: HTMLDivElement;
    property: string;
    __li: HTMLLIElement;
    __gui: GUI;
    getValue(): T;
    /**
     * Called by the framework after the UI elements have been created.
     */
    complete?(): void;
}

interface GUIParams {
    autoPlace?: boolean;
    closed?: boolean;
    hideable?: boolean;
    parent?: GUI;
    resizable?: boolean;
    scrollable?: boolean;
    width?: number;
}

export default class GUI {
    /**
     * Outermost DOM Element.
     */
    public domElement: HTMLDivElement;
    private __ul: HTMLUListElement;
    private __controllers: IController<any>[] = [];
    private parent: GUI;
    private autoPlace = true;
    private scrollable = false;
    /**
     * FIXME: We currently have to make this public to support the Resizable mixin.
     */
    public __closeButton: any;
    /**
     * FIXME: We currently have to make this public to support the Resizable mixin.
     */
    public __resize_handle: HTMLDivElement;
    private __save_row: any;
    /**
     * FIXME: We currently have to make this public to support the Resizable mixin.
     */
    public width: number;
    private __folders: { [name: string]: GUI } = {};
    private __closed = false;
    constructor(params: GUIParams = {}) {
        // Default parameters.
        params.autoPlace = true;
        params.width = DEFAULT_WIDTH;

        if (isUndefined(params.parent) && params.hideable) {
            // hideable_guis.push(this);
        }

        // Only root level GUI's are resizable.
        params.resizable = isUndefined(params.parent) && params.resizable;

        if (params.autoPlace && isUndefined(params.scrollable)) {
            params.scrollable = true;
        }

        this.domElement = document.createElement('div');
        this.__ul = document.createElement('ul');
        this.domElement.appendChild(this.__ul);

        addClass(this.domElement, CSS_NAMESPACE);

        if (isUndefined(params.parent)) {
            // We want the main level GUI to be open.
            params.closed = false;

            addClass(this.domElement, CLASS_MAIN);
            makeSelectable(this.domElement, false);

            addCloseButton(this);
        }
        else {
            if (params.resizable) {
                addResizeHandle(this);
            }
        }

        if (params.autoPlace) {

            if (isUndefined(params.parent)) {

                if (auto_place_virgin) {
                    auto_place_container = document.createElement('div');
                    addClass(auto_place_container, CSS_NAMESPACE);
                    addClass(auto_place_container, CLASS_AUTO_PLACE_CONTAINER);
                    document.body.appendChild(auto_place_container);
                    auto_place_virgin = false;
                }

                // Put it in the dom for you.
                auto_place_container.appendChild(this.domElement);

                // Apply the auto styles
                addClass(this.domElement, CLASS_AUTO_PLACE);

            }


            // Make it not elastic.
            if (!this.parent) this.setWidth(params.width);

        }
    }
    get closed() {
        return this.__closed;
    }
    set closed(v: boolean) {
        this.__closed = v;
        if (this.__closed) {
            addClass(this.__ul, CLASS_CLOSED);
        }
        else {
            removeClass(this.__ul, CLASS_CLOSED);
        }
        // For browsers that aren't going to respect the CSS transition,
        // Lets just check our height against the window height right off
        // the bat.
        this.onResize();

        if (this.__closeButton) {
            this.__closeButton.innerHTML = v ? TEXT_OPEN : TEXT_CLOSED;
        }
    }

    /**
     * 
     */
    destroy() {
        if (this.autoPlace) {
            auto_place_container.removeChild(this.domElement);
        }
    }

    private addHelper(object: {}, property: string, params: { before?: IController<any>, kind?: 'color' | 'R1' | 'R2' | 'R3', factoryArgs?: any[] }) {

        if (object[property] === undefined) {
            throw new Error("Object " + object + " has no property \"" + property + "\"");
        }

        const controller = controllerFactory(object, property, params);

        // TODO recallSavedValue(gui, controller);

        addClass(controller.domElement, 'c');

        const name = document.createElement('span');
        addClass(name, 'property-name');
        name.innerHTML = controller.property;

        const container = document.createElement('div');
        container.appendChild(name);
        container.appendChild(controller.domElement);

        const before = (!!params.before) ? params.before.__li : void 0;
        const li = this.addRow(container, before);

        addClass(li, CLASS_CONTROLLER_ROW);
        addClass(li, typeof controller.getValue());

        controller.__li = li;
        controller.__gui = this;

        if (controller.complete) {
            controller.complete();
        }
        // FIXME: This is bad coupling.
        // augmentController(this, li, controller);

        this.__controllers.push(controller);

        return controller;

    }

    add(object: {}, property: string, args?: any) {
        return this.addHelper(object, property, { factoryArgs: Array.prototype.slice.call(arguments, 2) });
    }

    addColor(object: {}, property: string) {
        return this.addHelper(object, property, { kind: 'color' });
    }
    addVectorE1(object: {}, property: string) {
        return this.addHelper(object, property, { kind: 'R1' });
    }
    addVectorE2(object: {}, property: string) {
        return this.addHelper(object, property, { kind: 'R2' });
    }
    addVectorE3(object: {}, property: string) {
        return this.addHelper(object, property, { kind: 'R3' });
    }
    addFolder(name: string) {

        // We have to prevent collisions on names in order to have a key
        // by which to remember saved values
        if (this.__folders[name] !== undefined) {
            throw new Error('You already have a folder in this GUI by the' + ' name "' + name + '"');
        }

        // We need to pass down the autoPlace trait so that we can
        // attach event listeners to open/close folder actions to
        // ensure that a scrollbar appears if the window is too short.
        const new_gui_params = { name: name, parent: this, autoPlace: this.autoPlace };

        // Do we have saved appearance data for this folder?
        /*
        if (this.load && // Anything loaded?
            this.load.folders && // Was my parent a dead-end?
            this.load.folders[name]) { // Did daddy remember me?
    
            // Start me closed if I was closed
            new_gui_params.closed = this.load.folders[name].closed;
    
            // Pass down the loaded data
            new_gui_params.load = this.load.folders[name];
    
        }
        */

        const gui = new GUI(new_gui_params);
        this.__folders[name] = gui;

        const li = this.addRow(gui.domElement);
        addClass(li, 'folder');
        return gui;
    }

    private addRow(container: HTMLDivElement, before?: HTMLLIElement): HTMLLIElement {
        var li = document.createElement('li');
        if (container) li.appendChild(container);
        if (before) {
            this.__ul.insertBefore(li, before);
        } else {
            this.__ul.appendChild(li);
        }
        this.onResize();
        return li;
    }

    /**
     * 
     */
    getRoot() {
        let gui: GUI = this;
        while (gui.parent) {
            gui = gui.parent;
        }
        return gui;
    }

    open() {
        this.closed = false;
    }

    close() {
        this.closed = true;
    }

    /**
     * 
     */
    onResize() {

        const root = this.getRoot();

        if (root.scrollable) {

            const top = getOffset(root.__ul).top;
            let h = 0;

            each(root.__ul.childNodes, function (node: Element) {
                if (!(root.autoPlace && node === root.__save_row))
                    h += getHeight(node);
            });

            if (window.innerHeight - top - CLOSE_BUTTON_HEIGHT < h) {
                addClass(root.domElement, CLASS_TOO_TALL);
                root.__ul.style.height = window.innerHeight - top - CLOSE_BUTTON_HEIGHT + 'px';
            } else {
                removeClass(root.domElement, CLASS_TOO_TALL);
                root.__ul.style.height = 'auto';
            }

        }

        if (root.__resize_handle) {
            defer(function () {
                root.__resize_handle.style.height = root.__ul.offsetHeight + 'px';
            });
        }

        if (root.__closeButton) {
            root.__closeButton.style.width = root.width + 'px';
        }
    }

    /**
     * 
     */
    remove(controller: IController<any>) {
        // TODO listening?
        this.__ul.removeChild(controller.__li);
        this.__controllers.splice(this.__controllers.indexOf(controller), 1);
        defer(() => {
            this.onResize();
        });
    }

    setWidth(w: number): void {
        this.domElement.style.width = w + 'px';
        // Auto placed save-rows are position fixed, so we have to
        // set the width manually if we want it to bleed to the edge
        if (this.__save_row && this.autoPlace) {
            this.__save_row.style.width = w + 'px';
        }
        if (this.__closeButton) {
            this.__closeButton.style.width = w + 'px';
        }
    }
}

/*
function augmentController(gui: GUI, li: HTMLLIElement, controller: Controller<any>) {

    controller.__li = li;
    controller.__gui = gui;

    extend(controller, {

        options: function (options) {

            if (arguments.length > 1) {
                controller.remove();

                return add(
                    gui,
                    controller.object,
                    controller.property,
                    {
                        before: controller.__li.nextElementSibling,
                        factoryArgs: [common.toArray(arguments)]
                    }
                );

            }

            if (common.isArray(options) || common.isObject(options)) {
                controller.remove();

                return add(
                    gui,
                    controller.object,
                    controller.property,
                    {
                        before: controller.__li.nextElementSibling,
                        factoryArgs: [options]
                    }
                );

            }

        },

        name: function (v) {
            controller.__li.firstElementChild.firstElementChild.innerHTML = v;
            return controller;
        },

        listen: function () {
            controller.__gui.listen(controller);
            return controller;
        },

        remove: function () {
            controller.__gui.remove(controller);
            return controller;
        }

    });

    // All sliders should be accompanied by a box.
    if (controller instanceof NumberControllerSlider) {

        var box = new NumberControllerBox(controller.object, controller.property,
            { min: controller.__min, max: controller.__max, step: controller.__step });

        common.each(['updateDisplay', 'onChange', 'onFinishChange'], function (method) {
            var pc = controller[method];
            var pb = box[method];
            controller[method] = box[method] = function () {
                var args = Array.prototype.slice.call(arguments);
                pc.apply(controller, args);
                return pb.apply(box, args);
            }
        });

        addClass(li, 'has-slider');
        controller.domElement.insertBefore(box.domElement, controller.domElement.firstElementChild);

    }
    else if (controller instanceof NumberControllerBox) {

        var r = function (returned) {

            // Have we defined both boundaries?
            if (common.isNumber(controller.__min) && common.isNumber(controller.__max)) {

                // Well, then lets just replace this with a slider.
                controller.remove();
                return add(
                    gui,
                    controller.object,
                    controller.property,
                    {
                        before: controller.__li.nextElementSibling,
                        factoryArgs: [controller.__min, controller.__max, controller.__step]
                    });

            }

            return returned;

        };

        controller.min = common.compose(r, controller.min);
        controller.max = common.compose(r, controller.max);

    }
    else if (controller instanceof BooleanController) {

        bind(li, 'click', function () {
            dom.fakeEvent(controller.__checkbox, 'click');
        });

        bind(controller.__checkbox, 'click', function (e) {
            e.stopPropagation(); // Prevents double-toggle
        })

    }
    else if (controller instanceof ColorController) {

        controller.updateDisplay = common.compose(function (r) {
            li.style.borderLeftColor = controller.__color.toString();
            return r;
        }, controller.updateDisplay);

        controller.updateDisplay();

    }

    controller.setValue = common.compose(function (r) {
        if (gui.getRoot().__preset_select && controller.isModified()) {
            markPresetModified(gui.getRoot(), true);
        }
        return r;
    }, controller.setValue);

}
*/
