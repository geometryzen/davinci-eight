declare class Scope {
    private state;
    private scopes;
    private current;
    constructor(state: any);
    enter(s: any): void;
    exit(): void;
    define(str: any): void;
    find(name: string, fail: any): any;
}
export = Scope;
