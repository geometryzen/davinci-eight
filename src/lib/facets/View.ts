import { Facet } from '../core/Facet';
import { Geometric3 } from '../math/Geometric3';
import { Matrix4 } from '../math/Matrix4';
import { VectorE3 } from '../math/VectorE3';

/**
 * <p>
 * A <code>View</code> is an object that sets its attitude according to
 * the state variables eye, look, and up.
 * </p>
 * <p>
 * The attitude may be undefined when the vector eye - look is parallel to the up vector.
 * </p>
 * @hidden
 */
export interface View extends Facet {

    /**
     * <p>
     * The point from which the view is constructed, a vector.
     * </p>
     */
    eye: Geometric3;

    /**
     * <p>
     * The point of interest, a position vector.
     * </p>
     */
    look: Geometric3;

    /**
     * <p>
     * The direction considered to be up, a vector.
     * <p>
     */
    up: Geometric3;

    /**
     * Updates the viewMatrix property based upon the eye, look, and up properties. 
     */
    updateViewMatrix(): void;

    /**
     * 
     */
    viewMatrix: Matrix4;

    /**
     * Convenience method for setting the <code>eye</code> property allowing chainable method calls.
     */
    setEye(eye: VectorE3): View;

    /**
     * Convenience method for setting the <code>look</code> property allowing chainable method calls.
     */
    setLook(look: VectorE3): View;

    /**
     * Convenience method for setting the <code>up</code> property allowing chainable method calls.
     */
    setUp(up: VectorE3): View;
}
