declare function expectArg<T>(name: string, value: T): {
    toSatisfy(condition: boolean, message: string): any;
    toBeBoolean(override?: () => string): any;
    toBeDefined(): any;
    toBeInClosedInterval(lower: any, upper: any): any;
    toBeFunction(): any;
    toBeNumber(override?: () => string): any;
    toBeObject(override?: () => string): any;
    toBeString(): any;
    toBeUndefined(): any;
    toNotBeNull(): any;
    value: T;
};
export = expectArg;
