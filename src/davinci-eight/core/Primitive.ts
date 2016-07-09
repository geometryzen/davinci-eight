import Attribute from './Attribute';
import BeginMode from './BeginMode';

interface Primitive {
    /**
     *
     */
    mode: BeginMode;

    /**
     *
     */
    indices?: number[];

    /**
     *
     */
    attributes: { [name: string]: Attribute };
}

export default Primitive;
