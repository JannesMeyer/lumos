/// <reference path="react/react.d.ts" />
/// <reference path="node/node.d.ts" />
/// <reference path="bluebird/bluebird.d.ts" />
/// <reference path="react/react-dom.d.ts" />
/// <reference path="minimist/minimist.d.ts" />
/// <reference path="debug/debug.d.ts" />
/// <reference path="express/express.d.ts" />
/// <reference path="mime/mime.d.ts" />
/// <reference path="morgan/morgan.d.ts" />
/// <reference path="serve-static/serve-static.d.ts" />
/// <reference path="socket.io-client/socket.io-client.d.ts" />
/// <reference path="socket.io/socket.io.d.ts" />
/// <reference path="marked/marked.d.ts" />
/// <reference path="highlightjs/highlightjs.d.ts" />

declare module 'iconv-lite' {
   export function decode(input: Buffer, encoding: string): string;
   export function encode(input: string, encoding: string): Buffer;
}


