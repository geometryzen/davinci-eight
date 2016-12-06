import SpinorE3 from '../math/SpinorE3';
import VectorE3 from '../math/VectorE3';

interface GeometryOptions {
    /**
     * A translation from the canonical position.
     * This is the third and last operation applied to canonical vertex data.
     */
    offset?: VectorE3;

    /**
     * A scaling along the standard basis directions from the canonical unit scaling.
     * This is the first operation applied to canonical vertex data.
     */
    stress?: VectorE3;

    /**
     * A rotation from the canonical attitude.
     * This is the second operation applied to canonical vertex data.
     */
    tilt?: SpinorE3;
}

export default GeometryOptions;
