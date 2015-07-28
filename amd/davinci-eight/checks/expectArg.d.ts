declare function expectArg<T>(name: string, value: T): {
    toSatisfy(condition: boolean, message: string): any;
    toBeDefined(): any;
    toBeNumber(): any;
    toBeObject(): any;
    toBeString(): any;
    toBeUndefined(): any;
    toNotBeNull(): any;
    value: T;
};
export = expectArg;
