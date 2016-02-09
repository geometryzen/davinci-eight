import LeftDenotation from './LeftDenotation'
import NullDenotation from './NullDenotation'

/**
 * Every token inherits from a symbol (Pratt).
 */
interface Token {
  type: string;  // "name", "string", "number" or "operator" etc.
  data: string;  // the value member, might be a string or number?
  lbp?: number;
  led?: LeftDenotation;
  nud?: NullDenotation;
  position?: number;
  line?: number;
  column?: number;
  preceding?: Token[];
}

export default Token;
