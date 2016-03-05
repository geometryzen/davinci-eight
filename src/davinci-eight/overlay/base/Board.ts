import AbstractRenderer from '../renderers/AbstractRenderer'
import ShareableBase from '../../core/ShareableBase'

export default class Board extends ShareableBase {
    private container: string
    private renderer: AbstractRenderer;
    constructor(container: string, renderer: AbstractRenderer) {
        super('Board')
        this.container = container
        this.renderer = renderer
    }
    protected destructor(): void {
        super.destructor()
    }
}
