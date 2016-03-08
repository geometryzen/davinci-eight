import GeometryElement from './GeometryElement'
import incLevel from '../../base/incLevel'
export default class Text extends GeometryElement {
  constructor(level = 0) {
    super('Text', incLevel(level))
  }
  protected destructor(level: number): void {
    super.destructor(incLevel(level))
  }
}
