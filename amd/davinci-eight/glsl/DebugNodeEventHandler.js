define(["require", "exports"], function (require, exports) {
    /// <reference path='NodeEventHandler.d.ts'/>
    var DebugNodeEventHandler = (function () {
        function DebugNodeEventHandler() {
        }
        DebugNodeEventHandler.prototype.beginStatementList = function () {
            console.log("beginStatementList");
        };
        DebugNodeEventHandler.prototype.endStatementList = function () {
            console.log("endStatementList");
        };
        DebugNodeEventHandler.prototype.beginStatement = function () {
            console.log("beginStatement");
        };
        DebugNodeEventHandler.prototype.endStatement = function () {
            console.log("endStatement");
        };
        DebugNodeEventHandler.prototype.beginDeclaration = function () {
            console.log("beginDeclaration");
        };
        DebugNodeEventHandler.prototype.endDeclaration = function () {
            console.log("endDeclaration");
        };
        DebugNodeEventHandler.prototype.beginDeclarationList = function () {
            console.log("beginDeclarationList");
        };
        DebugNodeEventHandler.prototype.endDeclarationList = function () {
            console.log("endDeclarationList");
        };
        DebugNodeEventHandler.prototype.declaration = function (kind, modifiers, type, names) {
            console.log("declaration " + kind + " " + modifiers + " " + type + " " + names);
        };
        DebugNodeEventHandler.prototype.beginFunction = function () {
            console.log("beginFunction");
        };
        DebugNodeEventHandler.prototype.endFunction = function () {
            console.log("endFunction");
        };
        DebugNodeEventHandler.prototype.beginFunctionArgs = function () {
            console.log("beginFunctionArgs");
        };
        DebugNodeEventHandler.prototype.endFunctionArgs = function () {
            console.log("endFunctionArgs");
        };
        DebugNodeEventHandler.prototype.beginExpression = function () {
            console.log("beginExpression");
        };
        DebugNodeEventHandler.prototype.endExpression = function () {
            console.log("endExpression");
        };
        DebugNodeEventHandler.prototype.beginAssign = function () {
            console.log("beginAssign");
        };
        DebugNodeEventHandler.prototype.endAssign = function () {
            console.log("endAssign");
        };
        DebugNodeEventHandler.prototype.identifier = function (name) {
            console.log("identifier: " + name);
        };
        DebugNodeEventHandler.prototype.keyword = function (word) {
            console.log("word: " + word);
        };
        DebugNodeEventHandler.prototype.builtin = function (name) {
            console.log("builtin: " + name);
        };
        return DebugNodeEventHandler;
    })();
    return DebugNodeEventHandler;
});
