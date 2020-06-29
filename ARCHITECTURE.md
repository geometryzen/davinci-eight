# Build

The `tsconfig.json` file defines the common build parameters for the TypeScript compiler.

# Testing

For testing purposes, the TypeSript source code is compiled into the `test` subfolder in CommonJS module format. Test scripts are written in TypeScript and have the `spec.ts` extension. Test scripts are normally siblings to a corresponding source code file.

The testing framework used is `Jasmine`. Note that Jasmine uses globally declared functions. The type definitions for Jasmine, `@types\jasmine`, are installed through the `package.json` file.

`karma`