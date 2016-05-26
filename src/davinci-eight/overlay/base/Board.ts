import AbstractRenderer from '../renderers/AbstractRenderer'
import incLevel from '../../base/incLevel'
import {ShareableBase} from '../../core/ShareableBase'

export default class Board extends ShareableBase {
  private container: string
  private renderer: AbstractRenderer;
  constructor(container: string, renderer: AbstractRenderer) {
    super()
    this.setLoggingName('Board')
    this.container = container
    this.renderer = renderer
  }
  protected destructor(level: number): void {
    super.destructor(incLevel(level))
  }
}
