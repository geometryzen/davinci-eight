import ContextManager from '../core/ContextManager';
import SpinorE3 from '../math/SpinorE3';
import VectorE3 from '../math/VectorE3';

interface GeometryOptions {

    contextManager?: ContextManager;

    offset?: VectorE3;

    stress?: VectorE3;

    tilt?: SpinorE3;
}

export default GeometryOptions;
