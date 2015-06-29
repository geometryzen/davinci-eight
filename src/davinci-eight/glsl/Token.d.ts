/// <reference path='./LeftDenotation.d.ts'/>
/// <reference path='./NullDenotation.d.ts'/>
interface Token {
  type: string;  // "name", "string", "number" or "operator" etc.
  data: string;  // the value member, might be a string or number?
  lbp?: number;
  led?: LeftDenotation;
  nud?: NullDenotation;
  position?: number;
  preceding?: Token[];
}

