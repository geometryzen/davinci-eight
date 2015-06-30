declare class Declaration {
    kind: string;
    modifiers: string[];
    type: string;
    name: string;
    constructor(kind: string, modifiers: string[], type: string, name: string);
}
export = Declaration;
