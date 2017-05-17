const SCALAR_SYMBOL = "1";
const E1_SYMBOL = "<b>e</b><sub>1</sub>";
const E2_SYMBOL = "<b>e</b><sub>2</sub>";
const E3_SYMBOL = "<b>e</b><sub>3</sub>";
const E12_SYMBOL = E1_SYMBOL + E2_SYMBOL;
const E23_SYMBOL = E2_SYMBOL + E3_SYMBOL;
const E31_SYMBOL = E3_SYMBOL + E1_SYMBOL;
const PSEUDO_SYMBOL = E1_SYMBOL + E2_SYMBOL + E3_SYMBOL;

export const BASIS_LABELS_G3_STANDARD_HTML: string[][] = [
    [SCALAR_SYMBOL],
    [E1_SYMBOL],
    [E2_SYMBOL],
    [E3_SYMBOL],
    [E12_SYMBOL],
    [E23_SYMBOL],
    [E31_SYMBOL],
    [PSEUDO_SYMBOL]
];
