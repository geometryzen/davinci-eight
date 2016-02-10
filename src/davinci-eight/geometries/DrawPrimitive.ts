import Attribute from '../core/Attribute';
import DrawMode from '../core/DrawMode';
import mustBeArray from '../checks/mustBeArray';
import mustBeInteger from '../checks/mustBeInteger';
import mustBeObject from '../checks/mustBeObject';
import Primitive from '../core/Primitive';

/**
 * A convenience class for implementing the Primitive interface.
 */
export default class DrawPrimitive implements Primitive {
    public mode: DrawMode;
    public indices: number[];
    public attributes: { [name: string]: Attribute } = {};
    constructor(mode: DrawMode, indices: number[], attributes: { [name: string]: Attribute }) {
        this.mode = mustBeInteger('mode', mode)
        this.indices = mustBeArray('indices', indices)
        this.attributes = mustBeObject('attributes', attributes)
    }
}
