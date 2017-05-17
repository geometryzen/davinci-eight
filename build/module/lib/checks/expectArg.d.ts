export declare function expectArg<T>(name: string, value: T): {
    toSatisfy(condition: boolean, message: string): any;
    toBeBoolean(override?: () => string): any;
    toBeDefined(): any;
    toBeInClosedInterval(lower: number, upper: number): any;
    toBeFunction(): any;
    toBeNumber(override?: () => string): any;
    toBeObject(override?: () => string): any;
    toBeString(): any;
    toBeUndefined(): any;
    toNotBeNull(): any;
    readonly value: T;
};
