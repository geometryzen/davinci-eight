/// <reference path='./LeftDenotation.d.ts'/>
/// <reference path='./NullDenotation.d.ts'/>
/// <reference path='./Token.d.ts'/>
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
