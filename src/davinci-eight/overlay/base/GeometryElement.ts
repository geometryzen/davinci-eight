import incLevel from '../../base/incLevel'
import ShareableBase from '../../core/ShareableBase'

export default class GeometryElement extends ShareableBase {
  constructor() {
    super()
    this.setLoggingName('GeometryElement')
  }
  protected destructor(level: number): void {
    super.destructor(incLevel(level))
  }
}
