import mustBeNumber from '../checks/mustBeNumber';
import visualCache from './visualCache';
import RigidBody from './RigidBody'

export default class Arrow extends RigidBody {
    constructor() {
        super(visualCache.arrow(), visualCache.program(), 'Arrow')
        this._buffers.release()
        this._program.release()
    }
    protected destructor(): void {
        super.destructor()
    }
    get length() {
        return this.getScaleY()
    }
    set length(length: number) {
        mustBeNumber('length', length)
        this.setScaleX(length)
        this.setScaleY(length)
        this.setScaleZ(length)
    }
}
