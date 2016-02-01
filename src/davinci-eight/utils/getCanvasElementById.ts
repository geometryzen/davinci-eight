import mustBeString from '../checks/mustBeString';
import mustBeObject from '../checks/mustBeObject';

/**
 * Convenience function for &lt;HTMLCanvasElement&gt;document.getElementById(elementId).
 */
export default function getCanvasElementById(elementId: string, dom: Document = window.document): HTMLCanvasElement {
    mustBeString('elementId', elementId)
    mustBeObject('document', dom)
    var element = dom.getElementById(elementId)
    if (element instanceof HTMLCanvasElement) {
        return element
    }
    else {
        throw new Error(elementId + " is not an HTMLCanvasElement.")
    }
}
