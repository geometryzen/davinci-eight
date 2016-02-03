import VisualComponent from './VisualComponent';

/**
 * @class Box
 */
interface Box extends VisualComponent {
    /**
     * @property width
     * @type number
     */
    width: number;

    /**
     * @property height
     * @type number
     */
    height: number;

    /**
     * @property depth
     * @type number
     */
    depth: number;
}

export default Box;
