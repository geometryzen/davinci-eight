declare function expectArg<T>(name: string, value: T): {
    toSatisfy(condition: boolean, message: string): any;
    toBeBoolean(): any;
    toBeDefined(): any;
    toBeInClosedInterval(lower: any, upper: any): any;
    toBeFunction(): any;
    toBeNumber(): any;
    toBeObject(): any;
    toBeString(): any;
    toBeUndefined(): any;
    toNotBeNull(): any;
    value: T;
};
export = expectArg;
