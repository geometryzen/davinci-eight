import Color from '../color/Color';
import Controller from './Controller';
import bind from '../dom/bind';
import unbind from '../dom/unbind';
import addClass from '../dom/addClass';
import removeClass from '../dom/removeClass';
import getHeight from '../dom/getHeight';
import getWidth from '../dom/getWidth';
import getOffset from '../dom/getOffset';
import makeSelectable from '../dom/makeSelectable';
import each from '../common/each';
import extend from '../common/extend';
import isUndefined from '../common/isUndefined';
import interpret from '../color/interpret';

const vendors = ['-moz-', '-o-', '-webkit-', '-ms-', ''];

function linearGradient(elem: HTMLElement, x: string, a: string, b: string) {
    elem.style.background = '';
    each(vendors, function (vendor: string) {
        elem.style.cssText += 'background: ' + vendor + 'linear-gradient(' + x + ', ' + a + ' 0%, ' + b + ' 100%); ';
    });
}

function hueGradient(elem: HTMLElement) {
    elem.style.background = '';
    elem.style.cssText += 'background: -moz-linear-gradient(top,  #ff0000 0%, #ff00ff 17%, #0000ff 34%, #00ffff 50%, #00ff00 67%, #ffff00 84%, #ff0000 100%);';
    elem.style.cssText += 'background: -webkit-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
    elem.style.cssText += 'background: -o-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
    elem.style.cssText += 'background: -ms-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
    elem.style.cssText += 'background: linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
}


export default class ColorController extends Controller<any> {
    private __color: Color;
    private __temp: Color;
    private __selector: HTMLDivElement;
    /**
     * The saturation field is the square with white at top left, black at bottom left and hue on right.
     */
    private __saturation_field: HTMLDivElement;
    private __field_knob: HTMLDivElement;
    private __field_knob_border: string;
    private __hue_knob: HTMLDivElement;
    /**
     * The hue field is the vertical rectangle on the right.
     */
    private __hue_field: HTMLDivElement;
    private __input: HTMLInputElement;
    private __input_textShadow: string;
    private value: string;
    constructor(object: {}, property: string) {
        super(object, property);

        this.__color = new Color(this.getValue());
        this.__temp = new Color(0);

        this.domElement = document.createElement('div');

        makeSelectable(this.domElement, false);

        this.__selector = document.createElement('div');
        // The CSS causes this to be visible when hovered over.
        this.__selector.className = 'selector';

        this.__saturation_field = document.createElement('div');
        this.__saturation_field.className = 'saturation-field';

        this.__field_knob = document.createElement('div');
        this.__field_knob.className = 'field-knob';
        this.__field_knob_border = '2px solid ';

        this.__hue_knob = document.createElement('div');
        this.__hue_knob.className = 'hue-knob';

        this.__hue_field = document.createElement('div');
        this.__hue_field.className = 'hue-field';

        this.__input = document.createElement('input');
        this.__input.type = 'text';
        this.__input_textShadow = '0 1px 1px ';

        const onBlur = () => {
            const i = interpret(this.value);
            if (i !== false) {
                this.__color.__state = i;
                this.setValue(this.__color.toOriginal());
            } else {
                this.value = this.__color.toString();
            }
        };

        bind(this.__input, 'keydown', function (e: KeyboardEvent) {
            if (e.keyCode === 13) { // on enter
                onBlur.call(this);
            }
        });

        bind(this.__input, 'blur', onBlur);

        bind(this.__selector, 'mousedown', (e: MouseEvent) => {
            addClass(this.__selector, 'drag');
            bind(window, 'mouseup', (e: MouseEvent) => {
                removeClass(this.__selector, 'drag');
            });

        });

        var value_field = document.createElement('div');

        extend(this.__selector.style, {
            width: '122px',
            height: '102px',
            padding: '3px',
            backgroundColor: '#222',
            boxShadow: '0px 1px 3px rgba(0,0,0,0.3)'
        });

        extend(this.__field_knob.style, {
            position: 'absolute',
            width: '12px',
            height: '12px',
            border: this.__field_knob_border + (this.__color.v < .5 ? '#fff' : '#000'),
            boxShadow: '0px 1px 3px rgba(0,0,0,0.5)',
            borderRadius: '12px',
            zIndex: 1
        });

        extend(this.__hue_knob.style, {
            position: 'absolute',
            width: '15px',
            height: '2px',
            borderRight: '4px solid #fff',
            zIndex: 1
        });

        extend(this.__saturation_field.style, {
            width: '100px',
            height: '100px',
            border: '1px solid #555',
            marginRight: '3px',
            display: 'inline-block',
            cursor: 'pointer'
        });

        extend(value_field.style, {
            width: '100%',
            height: '100%',
            background: 'none'
        });

        linearGradient(value_field, 'top', 'rgba(0,0,0,0)', '#000');

        extend(this.__hue_field.style, {
            width: '15px',
            height: '100px',
            display: 'inline-block',
            border: '1px solid #555',
            cursor: 'ns-resize'
        });

        hueGradient(this.__hue_field);

        extend(this.__input.style, {
            outline: 'none',
            //      width: '120px',
            textAlign: 'center',
            //      padding: '4px',
            //      marginBottom: '6px',
            color: '#fff',
            border: 0,
            fontWeight: 'bold',
            textShadow: this.__input_textShadow + 'rgba(0,0,0,0.7)'
        });

        const setH = (e: MouseEvent) => {

            e.preventDefault();

            const s = getHeight(this.__hue_field);
            var o = getOffset(this.__hue_field);
            var h = 1 - (e.clientY - o.top + document.body.scrollTop) / s;

            if (h > 1) h = 1;
            else if (h < 0) h = 0;

            this.__color.h = h * 360;

            this.setValue(this.__color.toOriginal());

            return false;
        };

        bind(this.__saturation_field, 'mousedown', fieldDown);
        bind(this.__field_knob, 'mousedown', fieldDown);

        bind(this.__hue_field, 'mousedown', function (e: MouseEvent) {
            setH(e);
            bind(window, 'mousemove', setH);
            bind(window, 'mouseup', unbindH);
        });

        const setSV = (e: MouseEvent) => {

            e.preventDefault();

            var w = getWidth(this.__saturation_field);
            var o = getOffset(this.__saturation_field);
            var s = (e.clientX - o.left + document.body.scrollLeft) / w;
            var v = 1 - (e.clientY - o.top + document.body.scrollTop) / w;

            if (v > 1) v = 1;
            else if (v < 0) v = 0;

            if (s > 1) s = 1;
            else if (s < 0) s = 0;

            this.__color.v = v;
            this.__color.s = s;

            this.setValue(this.__color.toOriginal());


            return false;

        };

        function fieldDown(e: MouseEvent) {
            setSV(e);
            // document.body.style.cursor = 'none';
            bind(window, 'mousemove', setSV);
            bind(window, 'mouseup', unbindSV);
        }

        function unbindSV() {
            unbind(window, 'mousemove', setSV);
            unbind(window, 'mouseup', unbindSV);
            // document.body.style.cursor = 'default';
        }

        function unbindH() {
            unbind(window, 'mousemove', setH);
            unbind(window, 'mouseup', unbindH);
        }

        this.__saturation_field.appendChild(value_field);
        this.__selector.appendChild(this.__field_knob);
        this.__selector.appendChild(this.__saturation_field);
        this.__selector.appendChild(this.__hue_field);
        this.__hue_field.appendChild(this.__hue_knob);

        this.domElement.appendChild(this.__input);
        this.domElement.appendChild(this.__selector);

        this.updateDisplay();
    }
    complete(): void {
        addClass(this.__li, 'color');
        // This only happens if the color is in fact a string type.
        // removeClass(this.__li, 'string');
    }
    updateDisplay() {

        var i = interpret(this.getValue());

        if (i !== false) {

            var mismatch = false;

            // Check for mismatch on the interpreted value.

            each(Color.COMPONENTS, function (component: string) {
                if (!isUndefined(i[component]) &&
                    !isUndefined(this.__color.__state[component]) &&
                    i[component] !== this.__color.__state[component]) {
                    mismatch = true;
                    return {}; // break
                }
            }, this);

            // If nothing diverges, we keep our previous values
            // for statefulness, otherwise we recalculate fresh
            if (mismatch) {
                extend(this.__color.__state, i);
            }

        }

        extend(this.__temp.__state, this.__color.__state);

        this.__temp.a = 1;

        var flip = (this.__color.v < .5 || this.__color.s > .5) ? 255 : 0;
        var _flip = 255 - flip;

        extend(this.__field_knob.style, {
            marginLeft: 100 * this.__color.s - 7 + 'px',
            marginTop: 100 * (1 - this.__color.v) - 7 + 'px',
            backgroundColor: this.__temp.toString(),
            border: this.__field_knob_border + 'rgb(' + flip + ',' + flip + ',' + flip + ')'
        });

        this.__hue_knob.style.marginTop = (1 - this.__color.h / 360) * 100 + 'px';

        this.__temp.s = 1;
        this.__temp.v = 1;

        linearGradient(this.__saturation_field, 'left', '#fff', this.__temp.toString());

        extend(this.__input.style, {
            backgroundColor: this.__input.value = this.__color.toString(),
            color: 'rgb(' + flip + ',' + flip + ',' + flip + ')',
            textShadow: this.__input_textShadow + 'rgba(' + _flip + ',' + _flip + ',' + _flip + ',.7)'
        });

    }

}
