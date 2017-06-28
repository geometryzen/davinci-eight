import { ContextManager } from '../core/ContextManager';
import { isString } from '../checks/isString';
import { mustBeArray } from '../checks/mustBeArray';
import { mustBeObject } from '../checks/mustBeObject';
import { mustBeString } from '../checks/mustBeString';
import { mustSatisfy } from '../checks/mustSatisfy';
import { ShaderMaterial } from './ShaderMaterial';

function getHTMLElementById(elementId: string, dom: Document): HTMLElement {
    const element = dom.getElementById(mustBeString('elementId', elementId));
    if (element) {
        return element;
    }
    else {
        throw new Error(`'${elementId}' is not a valid element identifier.`);
    }
}

function vertexShaderSrc(vsId: string, dom: Document): string {
    mustBeString('vsId', vsId);
    mustBeObject('dom', dom);
    return getHTMLElementById(vsId, dom).textContent;
}

function fragmentShaderSrc(fsId: string, dom: Document): string {
    mustBeString('fsId', fsId);
    mustBeObject('dom', dom);
    return getHTMLElementById(fsId, dom).textContent;
}

function assign(elementId: string, dom: Document, result: string[]): void {
    const htmlElement = dom.getElementById(elementId);
    if (htmlElement instanceof HTMLScriptElement) {
        const script = <HTMLScriptElement>htmlElement;
        if (isString(script.type)) {
            if (script.type.indexOf('vertex') >= 0) {
                result[0] = elementId;
            }
            else if (script.type.indexOf('fragment') >= 0) {
                result[1] = elementId;
            }
            else {
                // Do nothing
            }
        }
        if (isString(script.textContent)) {
            if (script.textContent.indexOf('gl_Position') >= 0) {
                result[0] = elementId;
            }
            else if (script.textContent.indexOf('gl_FragColor') >= 0) {
                result[1] = elementId;
            }
            else {
                // Do nothing
            }
        }
    }
}

function detectShaderType(scriptIds: string[], dom: Document): string[] {
    mustBeArray('scriptIds', scriptIds);
    mustSatisfy('scriptIds', scriptIds.length === 2, () => { return 'have two script element identifiers.'; });
    const result = [scriptIds[0], scriptIds[1]];
    assign(scriptIds[0], dom, result);
    assign(scriptIds[1], dom, result);
    return result;
}

/**
 * A shareable WebGL program based upon shader source code in HTML script elements.
 *
 * This class provides a convenient way of creating custom GLSL programs.
 * The scripts are lazily loaded so that the constructor may be called before
 * the DOM has finished loading.
 */
export class HTMLScriptsMaterial extends ShaderMaterial {
    /**
     * @param contextManager
     * @param scriptIds The element identifiers for the vertex and fragment shader respectively.
     * @param attribs An array of strings containing the order of attributes.
     * @param dom The document object model that owns the script elements.
     * @param levelUp
     */
    constructor(contextManager: ContextManager, scriptIds: string[], attribs: string[] = [], dom: Document = window.document, levelUp = 0) {
        super(vertexShaderSrc(detectShaderType(scriptIds, dom)[0], dom), fragmentShaderSrc(detectShaderType(scriptIds, dom)[1], dom), attribs, contextManager, levelUp + 1);
        this.setLoggingName('HTMLScriptsMaterial');
        if (levelUp === 0) {
            this.synchUp();
        }
    }

    /**
     * 
     */
    protected resurrector(levelUp: number): void {
        super.resurrector(levelUp + 1);
        this.setLoggingName('HTMLScriptsMaterial');
        if (levelUp === 0) {
            this.synchUp();
        }
    }

    /**
     * 
     */
    protected destructor(levelUp: number): void {
        if (levelUp === 0) {
            this.cleanUp();
        }
        super.destructor(levelUp + 1);
    }
}
