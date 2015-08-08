import Drawable = require('../core/Drawable');
interface Composite<M> extends Drawable {
    model: M;
}
export = Composite;
