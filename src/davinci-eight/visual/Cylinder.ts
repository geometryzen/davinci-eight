import VisualComponent from './VisualComponent';
import G3 from '../math/G3';

/**
 * @class Cylinder
 */
interface Cylinder extends VisualComponent {

    /**
     * The axis, a unit vector.
     *
     * @property axis
     * @type G3
     */
    axis: G3;
}

export default Cylinder;
