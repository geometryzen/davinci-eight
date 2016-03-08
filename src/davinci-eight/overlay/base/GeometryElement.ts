import incLevel from '../../base/incLevel'
import ShareableBase from '../../core/ShareableBase'

export default class GeometryElement extends ShareableBase {
  constructor(type: string, level: number) {
    super(type, incLevel(level))
  }
  protected destructor(level: number): void {
    super.destructor(incLevel(level))
  }
}
