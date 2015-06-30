/// <reference path='NodeEventHandler.d.ts'/>
class DefaultNodeEventHandler implements GLSL.NodeEventHandler {
  constructor() {

  }
  beginStatementList() {
  }
  endStatementList() {
  }
  beginStatement() {
  }
  endStatement() {
  }
  beginDeclaration() {
  }
  endDeclaration() {
  }
  declaration(kind: string, modifiers: string[], type: string, names: string[]) {
  }
  beginDeclarationList() {
  }
  endDeclarationList() {
  }
  beginFunction() {
  }
  endFunction() {
  }
  beginFunctionArgs() {
  }
  endFunctionArgs() {
  }
  beginExpression() {
  }
  endExpression() {
  }
  beginAssign() {
  }
  endAssign() {
  }
  identifier(name: string): void {
  }
  keyword(word: string): void {
  }
  builtin(name: string): void {
  }
}
export = DefaultNodeEventHandler;