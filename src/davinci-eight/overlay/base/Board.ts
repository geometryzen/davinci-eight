import AbstractRenderer from '../renderers/AbstractRenderer'
import Shareable from '../../core/Shareable'

export default class Board extends Shareable {
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
