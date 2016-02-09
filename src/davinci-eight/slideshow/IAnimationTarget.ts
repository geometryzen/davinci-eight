interface IAnimationTarget {
    uuid: string;
    getProperty(name: string): number[];
    setProperty(name: string, value: number[]): IAnimationTarget;
}

export default IAnimationTarget;
