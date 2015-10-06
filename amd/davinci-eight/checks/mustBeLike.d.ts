declare function mustBeLike<T>(name: string, value: T, duck: T, contextBuilder?: () => string): T;
export = mustBeLike;
