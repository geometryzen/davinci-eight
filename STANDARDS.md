# Coding and Documentation Standards.

These coding and documentation standards are designed to help you!

MUST implies something that is an unbreakable rule.
SHOULD implies something that is a (strong) suggestion.

# braces
SHOULD: Use braces, K.R. style, unless their omission improves readability and maintainability.

## naming interfaces and classes
MUST: Use CamelCase for `interface` and `class` names.

## indenting
MUST: Use use two (2) spaces, no tabs.

## interfaces
MUST: Name interfaces with the prefix `I` if the implementations will be reference counted.
MUST: extend all reference-counted interfaces from `IUnknown`.

## parenthesis
SHOULD: Minimize use of parenthesis to improve readability. Use the precedence rules, Luke!

## semicolons
SHOULD: Omit semicolons in TypeScript code when they are non-functional.
You may find that some syntax coloring tools don't work correctly.
If syntax coloring is broken by omitting semicolons, put them in.
Respect semicolons inserted by others unless you are THE benevolent dictator.

## properties in `class`
MUST: Use underscore (_) prefix for all properties in class(es) that have get/set.

## collisions in function arguments
MUST: Use underscore (_) prefix in function arguments when collisions occur in the implementation.

## readonly properties
MUST: Use the following pattern for coding and documenting readonly properties:

MUST: Define a property set `name`() if the property `name` is readonly and throw an Error.
MUST: Name the unused argument `unused` (TS1049: A 'set' accessor must have exactly one parameter).

/**
 * Description of the property.
 * @property foo
 * @type {Foo}
 * @readonly
 */
get foo(): Foo {
  ...
}
set foo(unused) {
  throw new Error(readOnly('foo').message)
}

SHOULD: Omit the type declaration on the 'set' method.
(TS2380: 'get' and 'set' accessor must have the same type.)
SHOULD: Use the `readOnly` function from the i18n folder.

## Using methods to set properties for method chaining.

MUST: Name the method `setCamelCaseName` if the property is camelCaseName.
MUST: Do not addRef the returned reference if you are returning `this` (class) or the functional constructor instance.

## Functional Constructor Pattern
SHOULD: Use the Douglas Crockford pattern when user tampering with `private` is undesirable.
SHOULD: Define an interface if the object is unwieldy.
MUST: Name the function createFoo if the object being created is reference-counted.

## DRY
SHOULD: Avoid repeating yourself in documentation.

## i18n
MUST: Use i18n functions to construct text.
TODO: Full i18n support will follow. This may involve some refactoring.
TODO: Expect text to be replaced by lazily constructed parameterized messages.
