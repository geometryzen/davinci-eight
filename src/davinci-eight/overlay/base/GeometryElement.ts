import Shareable from '../../core/Shareable'
export default class GeometryElement extends Shareable {
    constructor(type: string) {
        super(type)
    }
    protected destructor(): void {
        super.destructor()
    }
}
