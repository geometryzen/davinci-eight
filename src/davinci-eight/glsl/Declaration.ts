export default class Declaration {
  public kind: string;
  public modifiers: string[];
  public type: string;
  public name: string;
  constructor(kind: string, modifiers: string[], type: string, name: string) {
    this.kind = kind;
    this.modifiers = modifiers;
    this.type = type;
    this.name = name;
  }
}
