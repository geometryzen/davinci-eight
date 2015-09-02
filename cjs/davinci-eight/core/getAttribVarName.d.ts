/**
 * Policy for how an attribute variable name is determined.
 */
declare function getAttribVarName(attribute: {
    name?: string;
}, varName: string): string;
export = getAttribVarName;
