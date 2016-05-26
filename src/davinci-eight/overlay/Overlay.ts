import AbstractRenderer from './renderers/AbstractRenderer'
import Board from './base/Board'
import CanvasRenderer from './renderers/CanvasRenderer'
import getDimensions from '../utils/getDimensions'
import incLevel from '../base/incLevel'
import mustBeString from '../checks/mustBeString'
import mustBeObject from '../checks/mustBeObject'
import NoRenderer from './renderers/NoRenderer'
import {ShareableBase} from '../core/ShareableBase'
import SVGRenderer from './renderers/SVGRenderer'
import Text from './base/Text'
import VMLRenderer from './renderers/VMLRenderer'
import WidthAndHeight from '../utils/WidthAndHeight'

function initRenderer(elementId: string, dimensions: WidthAndHeight, doc: Document, rendererKind: string): AbstractRenderer {
  mustBeString('elementId', elementId)
  mustBeObject('dimensions', dimensions)
  mustBeObject('doc', doc)
  mustBeString('rendererKin', rendererKind)

  const domElement = doc.getElementById(elementId);

  // Remove everything from the container before initializing the renderer and the board
  while (domElement.firstChild) {
    domElement.removeChild(domElement.firstChild);
  }

  if (rendererKind === 'svg') {
    return new SVGRenderer(domElement, dimensions);
  }
  else if (rendererKind === 'vml') {
    return new VMLRenderer(domElement);
  }
  else if (rendererKind === 'canvas') {
    return new CanvasRenderer(domElement, dimensions);
  }
  else {
    return new NoRenderer();
  }
}

export default class Overlay extends ShareableBase {
  private renderer: AbstractRenderer
  private board: Board
  constructor(elementId: string, options: {} = {}) {
    super()
    this.setLoggingName('Overlay')
    const dimensions = getDimensions(elementId, document)
    this.renderer = initRenderer(elementId, dimensions, document, 'svg')
    this.board = new Board(elementId, this.renderer)
  }
  protected destructor(level: number): void {
    this.board.release()
    super.destructor(incLevel(level))
  }
  public createText(): Text {
    const text = new Text()
    return text
  }
}
