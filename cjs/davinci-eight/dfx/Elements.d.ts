declare class Elements {
    indices: number[];
    attributes: {
        [name: string]: number[];
    };
    constructor(indices: number[], attributes: {
        [name: string]: number[];
    });
}
export = Elements;
