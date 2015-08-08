import Composite = require('../core/Composite');
interface Blade<M> extends Composite<M> {
    setMagnitude(magnitude: number): Blade<M>;
}
export = Blade;
