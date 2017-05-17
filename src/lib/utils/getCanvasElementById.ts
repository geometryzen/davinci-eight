import { mustBeString } from '../checks/mustBeString';
import { mustBeObject } from '../checks/mustBeObject';

export function getCanvasElementById(elementId: string, dom: Document = window.document): HTMLCanvasElement {
    mustBeString('elementId', elementId);
    mustBeObject('document', dom);
    const element = dom.getElementById(elementId);
    if (element instanceof HTMLCanvasElement) {
        return element;
    }
    else {
        throw new Error(elementId + " is not an HTMLCanvasElement.");
    }
}
