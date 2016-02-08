import mustBeNumber from '../checks/mustBeNumber';
import visualCache from './visualCache';
import RigidBody from './RigidBody'

export default class Rod extends RigidBody {
    constructor() {
        super(visualCache.cylinder(), visualCache.program(), 'Rod')
        this._buffers.release()
        this._program.release()
    }
    protected destructor(): void {
        super.destructor()
    }
    get radius() {
        return this.getScaleX()
    }
    set radius(radius: number) {
        mustBeNumber('radius', radius)
        this.setScaleX(radius)
        this.setScaleZ(radius)
    }
    get length() {
        return this.getScaleY();
    }
    set length(length: number) {
        mustBeNumber('length', length)
        this.setScaleY(length)
    }
}
