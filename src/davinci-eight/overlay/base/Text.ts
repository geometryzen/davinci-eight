import GeometryElement from './GeometryElement'

export default class Text extends GeometryElement {
    constructor() {
        super('Text')
    }
    protected destructor(): void {
      super.destructor()
    }
}
