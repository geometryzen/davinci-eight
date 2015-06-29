/// <reference path='./Token.d.ts'/>
declare module GLSL {
  interface Node {
    mode: number;
    token: Token;
    children: Node[];
    type: string;
    id: string;
    expecting?: string;
  }  
}
