import ContextManager from '../core/ContextManager';
import ContextProvider from '../core/ContextProvider';
import isString from '../checks/isString';
import mustBeArray from '../checks/mustBeArray';
import mustBeObject from '../checks/mustBeObject';
import mustBeString from '../checks/mustBeString';
import mustSatisfy from '../checks/mustSatisfy';
import {ShaderMaterial} from './ShaderMaterial';

function getHTMLElementById(elementId: string, dom: Document): HTMLElement {
    const element = dom.getElementById(mustBeString('elementId', elementId))
    if (element) {
        return element;
    }
    else {
        throw new Error(`'${elementId}' is not a valid element identifier.`);
    }
}

function vertexShaderSrc(vsId: string, dom: Document): string {
    mustBeString('vsId', vsId)
    mustBeObject('dom', dom)
    return getHTMLElementById(vsId, dom).textContent
}

function fragmentShaderSrc(fsId: string, dom: Document): string {
    mustBeString('fsId', fsId)
    mustBeObject('dom', dom)
    return getHTMLElementById(fsId, dom).textContent
}

function assign(elementId: string, dom: Document, result: string[]): void {
    const htmlElement = dom.getElementById(elementId)
    if (htmlElement instanceof HTMLScriptElement) {
        const script = <HTMLScriptElement>htmlElement
        if (isString(script.type)) {
            if (script.type.indexOf('vertex') >= 0) {
                result[0] = elementId
            }
            else if (script.type.indexOf('fragment') >= 0) {
                result[1] = elementId
            }
            else {
                // Do nothing
            }
        }
        if (isString(script.textContent)) {
            if (script.textContent.indexOf('gl_Position') >= 0) {
                result[0] = elementId
            }
            else if (script.textContent.indexOf('gl_FragColor') >= 0) {
                result[1] = elementId
            }
            else {
                // Do nothing
            }
        }
    }
}

function detectShaderType(scriptIds: string[], dom: Document): string[] {
    const result = [scriptIds[0], scriptIds[1]]
    assign(scriptIds[0], dom, result)
    assign(scriptIds[1], dom, result)
    return result
}

/**
 * <p>
 * A shareable WebGL program based upon shader source code in HTML script elements.
 * </p>
 * <p>
 * This class provides a convenient way of creating custom GLSL programs.
 * The scripts are lazily loaded so that the constructor may be called before
 * the DOM has finished loading.
 * </p>
 *
 * @example
 *     // Replace the material in the drawable with our own custom shaders.
 *     const material = new EIGHT.HTMLScriptsMaterial(['vs', 'fs'], document, [], engine)
 *     drawable.material = material
 *     material.release()
 */
export default class HTMLScriptsMaterial extends ShaderMaterial {
    private scriptIds: string[];
    private dom: Document;
    private loaded: boolean = false;

    /**
     * @param scriptIds The element identifiers for the vertex and fragment shader respectively.
     * @param dom The document object model that owns the script elements.
     * @param attribs An array of strings containing the order of attributes.
     * @param manager
     * @param levelUp
     */
    constructor(scriptIds: string[], dom: Document, attribs: string[], manager: ContextManager, levelUp = 0) {
        super(void 0, void 0, attribs, manager, levelUp + 1);
        this.setLoggingName('HTMLScriptsMaterial');
        mustBeArray('scriptIds', scriptIds);
        mustSatisfy('scriptIds', scriptIds.length === 2, () => { return 'have two script element identifiers.' });
        this.scriptIds = [scriptIds[0], scriptIds[1]];
        this.dom = dom;
        if (levelUp === 0) {
            this.synchUp();
        }
    }

    protected destructor(levelUp: number): void {
        if (levelUp === 0) {
            this.cleanUp();
        }
        super.destructor(levelUp + 1);
    }

    /**
     * Overridden to provide lazy loading of the script contents.
     * This allows the <code>HTMLScriptsMaterial</code> to be constructed
     * before the DOM has completed loading.
     */
    contextGain(contextProvider: ContextProvider): void {
        if (!this.loaded) {
            const scriptIds = detectShaderType(this.scriptIds, this.dom)
            this.vertexShaderSrc = vertexShaderSrc(scriptIds[0], this.dom)
            this.fragmentShaderSrc = fragmentShaderSrc(scriptIds[1], this.dom)
            this.loaded = true
        }
        super.contextGain(contextProvider)
    }
}
