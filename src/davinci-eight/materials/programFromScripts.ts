import mustBeObject from '../checks/mustBeObject';
import mustBeString from '../checks/mustBeString';
import MaterialBase from './MaterialBase';

/**
 * Helper function for creating a <code>MaterialBase</code> from HTML script element content.
 * Parameters:
 * vsId The vertex shader script element identifier.
 * fsId The fragment shader script element identifier.
 * dom The DOM document containing the script elements.
 * [attribs = []] The attribute indices (implied by order of the name in the array).
 */
export default function programFromScripts(vsId: string, fsId: string, dom: Document, attribs: string[] = []): MaterialBase {
  mustBeString('vsId', vsId)
  mustBeString('fsId', fsId)
  mustBeObject('dom', dom)

  // shortcut function for getElementById, capturing the dom parameter value (argument value).
  function $(elementId: string): HTMLElement {
    const element = dom.getElementById(mustBeString('elementId', elementId))
    if (element) {
      return element
    }
    else {
      throw new Error(`${elementId} is not a valid DOM element identifier.`)
    }
  }

  const vertexShaderSrc: string = $(vsId).textContent
  const fragmentShaderSrc: string = $(fsId).textContent
  return new MaterialBase(vertexShaderSrc, fragmentShaderSrc, attribs, 'programFromScripts')
}
