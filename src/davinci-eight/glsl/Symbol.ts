import LeftDenotation from './LeftDenotation'
import NullDenotation from './NullDenotation'
import Token from './Token'

interface Symbol {
    id: string;
    lbp: number;            // Does this really belong here?
    led: LeftDenotation;
    nud: NullDenotation;
    token: Token;
    children: Symbol[];
    type: string;
    data: string;
}

export default Symbol
