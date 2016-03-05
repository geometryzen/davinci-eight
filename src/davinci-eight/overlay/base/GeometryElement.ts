import ShareableBase from '../../core/ShareableBase'
export default class GeometryElement extends ShareableBase {
    constructor(type: string) {
        super(type)
    }
    protected destructor(): void {
        super.destructor()
    }
}
