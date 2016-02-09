import NodeEventHandler from './NodeEventHandler'

export default class DebugNodeEventHandler implements NodeEventHandler {
  constructor() {

  }
  beginStatementList() {
    console.log("beginStatementList");
  }
  endStatementList() {
    console.log("endStatementList");
  }
  beginStatement() {
    console.log("beginStatement");
  }
  endStatement() {
    console.log("endStatement");
  }
  beginDeclaration() {
    console.log("beginDeclaration");
  }
  endDeclaration() {
    console.log("endDeclaration");
  }
  beginDeclarationList() {
    console.log("beginDeclarationList");
  }
  endDeclarationList() {
    console.log("endDeclarationList");
  }
  declaration(kind: string, modifiers: string[], type: string, names: string[]) {
    console.log("declaration " + kind + " " + modifiers + " " + type + " " + names);
  }
  beginFunction() {
    console.log("beginFunction");
  }
  endFunction() {
    console.log("endFunction");
  }
  beginFunctionArgs() {
    console.log("beginFunctionArgs");
  }
  endFunctionArgs() {
    console.log("endFunctionArgs");
  }
  beginExpression() {
    console.log("beginExpression");
  }
  endExpression() {
    console.log("endExpression");
  }
  beginAssign() {
    console.log("beginAssign");
  }
  endAssign() {
    console.log("endAssign");
  }
  identifier(name: string): void {
    console.log("identifier: " + name);
  }
  keyword(word: string): void {
    console.log("word: " + word);
  }
  builtin(name: string): void {
    console.log("builtin: " + name);
  }
}
