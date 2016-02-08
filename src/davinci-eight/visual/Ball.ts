import mustBeNumber from '../checks/mustBeNumber';
import visualCache from './visualCache';
import RigidBody from './RigidBody'

export default class Ball extends RigidBody {
    constructor() {
        super(visualCache.sphere(), visualCache.program(), 'Ball')
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
        this.setScaleY(radius)
        this.setScaleZ(radius)
    }
}
