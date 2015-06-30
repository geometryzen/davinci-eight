/// <reference path='NodeEventHandler.d.ts'/>
import DebugNodeEventHandler = require('./DebugNodeEventHandler');
import DefaultNodeEventHandler = require('./DefaultNodeEventHandler');
class ProgramArgs extends DefaultNodeEventHandler {
  constructor() {
    super();
  }
  declaration(kind: string, modifiers: string[], type: string, names: string[]) {
    console.log("" + kind + " " + modifiers.join(" ") + " " + type + " " + names.join(", "));
  }
}
export = ProgramArgs;