import Controller from './Controller';
// import bind from '../dom/bind';

function numDecimals(input: number) {
    const x = input.toString();
    if (x.indexOf('.') > -1) {
        return x.length - x.indexOf('.') - 1;
    }
    else {
        return 0;
    }
}

/**
 * A base class for NumberControllerBox or NumberControllerSlider
 */
export default class NumberController extends Controller<number> {
    private __min: number;
    private __max: number;
    private __step: number;
    protected __impliedStep: number;
    protected __precision: number;
    constructor(object: {}, property: string, params: { min?: number; max?: number; step?: number } = {}) {
        super(object, property);
        this.__min = params.min;
        this.__max = params.max;
        this.__step = params.step;

        if (typeof this.__step === 'undefined') {

            if (this.initialValue === 0) {
                this.__impliedStep = 1; // What are we, psychics?
            }
            else {
                // Hey Doug, check this out.
                this.__impliedStep = Math.pow(10, Math.floor(Math.log(Math.abs(this.initialValue)) / Math.LN10)) / 10;
            }

        } else {

            this.__impliedStep = this.__step;

        }

        this.__precision = numDecimals(this.__impliedStep);

    }
    setValue(v: number) {

        if (this.__min !== undefined && v < this.__min) {
            v = this.__min;
        } else if (this.__max !== undefined && v > this.__max) {
            v = this.__max;
        }

        if (this.__step !== undefined && v % this.__step !== 0) {
            v = Math.round(v / this.__step) * this.__step;
        }

        super.setValue(v);
    }

    /**
     * Specify a minimum value for <code>object[property]</code>.
     *
     * @param {Number} minValue The minimum value for
     * <code>object[property]</code>
     * @returns {dat.controllers.NumberController} this
     */
    min(v: number) {
        this.__min = v;
        return this;
    }

    /**
     * Specify a maximum value for <code>object[property]</code>.
     *
     * @param {Number} maxValue The maximum value for
     * <code>object[property]</code>
     * @returns {dat.controllers.NumberController} this
     */
    max(v: number) {
        this.__max = v;
        return this;
    }

    /**
     * Specify a step value that dat.controllers.NumberController
     * increments by.
     *
     * @param {Number} stepValue The step value for
     * dat.controllers.NumberController
     * @default if minimum and maximum specified increment is 1% of the
     * difference otherwise stepValue is 1
     * @returns {dat.controllers.NumberController} this
     */
    step(v: number) {
        this.__step = v;
        this.__impliedStep = v;
        this.__precision = numDecimals(v);
        return this;
    }
}
