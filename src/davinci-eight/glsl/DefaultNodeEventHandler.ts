import NodeEventHandler from './NodeEventHandler'

export default class DefaultNodeEventHandler implements NodeEventHandler {
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
