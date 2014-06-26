//
// things.d.ts
//
// This is an example of an external ambient module that we might want to borrow type declarations from.
//

// This is a TypeScript internal module.
// The name of the module appears in the generated d.ts file as a qualifier where Foo occurs.
// For that reason, we give it a meaningful name, x.
declare module x {
    interface Geometry {
        vertices: number[];
    }
}

// This is not a TypeScript internal module.
// We can reference it by the literal string 'eightAPI'.
// e.g. 
declare module 'eightAPI' {
    export = x;
}
