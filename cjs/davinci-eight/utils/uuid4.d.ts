declare function uuid4(): {
    generate: () => string;
    validate: (uuid: string) => boolean;
};
export = uuid4;
