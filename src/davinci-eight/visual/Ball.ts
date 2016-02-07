import GraphicsBuffers from '../scene/GraphicsBuffers'
import ShareableWebGLProgram from '../core/ShareableWebGLProgram'
import ModelFacet from '../facets/ModelFacet';
import mustBeNumber from '../checks/mustBeNumber';
import visualCache from './visualCache';
import RigidBody from './RigidBody'
import Sphere from './Sphere'

const MODEL_FACET_NAME = 'model';

let currentSphere: GraphicsBuffers = void 0;
let currentProgram: ShareableWebGLProgram = void 0;

function sphere(): GraphicsBuffers {
    currentSphere = visualCache.sphere()
    return currentSphere;
}

function program(): ShareableWebGLProgram {
    currentProgram = visualCache.program()
    return currentProgram;
}

export default class Ball extends RigidBody implements Sphere {
    constructor() {
        super(sphere(), program(), 'Ball')
        currentSphere.release()
        currentSphere = void 0
        currentProgram.release()
        currentProgram = void 0
    }
    protected destructor(): void {
        super.destructor()
    }
    get radius() {
        const model = <ModelFacet>this.getFacet(MODEL_FACET_NAME);
        const radius = model.scaleXYZ.x;
        model.release();
        return radius;
    }
    set radius(radius: number) {
        mustBeNumber('radius', radius);
        const model = <ModelFacet>this.getFacet(MODEL_FACET_NAME);
        model.scaleXYZ.x = radius;
        model.scaleXYZ.y = radius;
        model.scaleXYZ.z = radius;
        model.release();
    }
}
