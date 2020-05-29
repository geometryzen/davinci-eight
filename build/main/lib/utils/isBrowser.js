"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBrowser = void 0;
function isBrowser() {
    return typeof window === 'object' && typeof document === 'object';
}
exports.isBrowser = isBrowser;
