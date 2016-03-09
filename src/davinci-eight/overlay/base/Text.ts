import GeometryElement from './GeometryElement'
import incLevel from '../../base/incLevel'
export default class Text extends GeometryElement {
  constructor() {
    super()
    this.setLoggingName('Text')
  }
  protected destructor(level: number): void {
    super.destructor(incLevel(level))
  }
}
