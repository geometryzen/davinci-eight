import Color from '../core/Color';
import IDrawable from '../core/IDrawable';
import G3 from '../math/G3';

/**
 * Intentionally undocumented.
 * These are the common properties of a visual component.
 */
interface VisualComponent extends IDrawable {
    color: Color;
    R: G3;
    X: G3;
}

export default VisualComponent;
