/**
 * Policy for how a uniform variable name is determined.
 */
declare function getUniformVarName(uniform: {
    name?: string;
}, varName: string): string;
export = getUniformVarName;
