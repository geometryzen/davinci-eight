/// <reference path="../../../src/davinci-eight/glsl/NodeEventHandler.d.ts" />
declare class DebugNodeEventHandler implements GLSL.NodeEventHandler {
    constructor();
    beginStatementList(): void;
    endStatementList(): void;
    beginStatement(): void;
    endStatement(): void;
    beginDeclaration(): void;
    endDeclaration(): void;
    beginDeclarationList(): void;
    endDeclarationList(): void;
    declaration(kind: string, modifiers: string[], type: string, names: string[]): void;
    beginFunction(): void;
    endFunction(): void;
    beginFunctionArgs(): void;
    endFunctionArgs(): void;
    beginExpression(): void;
    endExpression(): void;
    beginAssign(): void;
    endAssign(): void;
    identifier(name: string): void;
    keyword(word: string): void;
    builtin(name: string): void;
}
export = DebugNodeEventHandler;
