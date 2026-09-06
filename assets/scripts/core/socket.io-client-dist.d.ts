/**
 * Type shim for the explicit browser-bundle import path used in
 * SocketService.ts (see the comment there for why). The dist bundle has no
 * .d.ts of its own, so this maps that import path to the same types the
 * main 'socket.io-client' package already ships - the runtime code loaded
 * is still the dependency-free bundle, only the *types* come from here.
 */
declare module 'socket.io-client/dist/socket.io.js' {
    export * from 'socket.io-client';
}
