import { mustBeString } from '../checks/mustBeString';
import { mustBeObject } from '../checks/mustBeObject';
export function getCanvasElementById(elementId, dom) {
    if (dom === void 0) { dom = window.document; }
    mustBeString('elementId', elementId);
    mustBeObject('document', dom);
    var element = dom.getElementById(elementId);
    if (element instanceof HTMLCanvasElement) {
        return element;
    }
    else {
        throw new Error(elementId + " is not an HTMLCanvasElement.");
    }
}
