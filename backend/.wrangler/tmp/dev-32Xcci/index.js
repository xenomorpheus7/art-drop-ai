var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// .wrangler/tmp/bundle-uagYGm/strip-cf-connecting-ip-header.js
function stripCfConnectingIPHeader(input, init2) {
  const request = new Request(input, init2);
  request.headers.delete("CF-Connecting-IP");
  return request;
}
var init_strip_cf_connecting_ip_header = __esm({
  ".wrangler/tmp/bundle-uagYGm/strip-cf-connecting-ip-header.js"() {
    __name(stripCfConnectingIPHeader, "stripCfConnectingIPHeader");
    globalThis.fetch = new Proxy(globalThis.fetch, {
      apply(target, thisArg, argArray) {
        return Reflect.apply(target, thisArg, [
          stripCfConnectingIPHeader.apply(null, argArray)
        ]);
      }
    });
  }
});

// wrangler-modules-watch:wrangler:modules-watch
var init_wrangler_modules_watch = __esm({
  "wrangler-modules-watch:wrangler:modules-watch"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
  }
});

// node_modules/wrangler/templates/modules-watch-stub.js
var init_modules_watch_stub = __esm({
  "node_modules/wrangler/templates/modules-watch-stub.js"() {
    init_wrangler_modules_watch();
  }
});

// node_modules/replicate/lib/error.js
var require_error = __commonJS({
  "node_modules/replicate/lib/error.js"(exports, module) {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    var ApiError = class extends Error {
      /**
       * Creates a representation of an API error.
       *
       * @param {string} message - Error message
       * @param {Request} request - HTTP request
       * @param {Response} response - HTTP response
       * @returns {ApiError} - An instance of ApiError
       */
      constructor(message, request, response) {
        super(message);
        this.name = "ApiError";
        this.request = request;
        this.response = response;
      }
    };
    __name(ApiError, "ApiError");
    module.exports = ApiError;
  }
});

// node_modules/replicate/lib/identifier.js
var require_identifier = __commonJS({
  "node_modules/replicate/lib/identifier.js"(exports, module) {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    var ModelVersionIdentifier = class {
      /*
       * @param {string} Required. The model owner.
       * @param {string} Required. The model name.
       * @param {string} The model version.
       */
      constructor(owner, name, version = null) {
        this.owner = owner;
        this.name = name;
        this.version = version;
      }
      /*
       * Parse a reference to a model version
       *
       * @param {string}
       * @returns {ModelVersionIdentifier}
       * @throws {Error} If the reference is invalid.
       */
      static parse(ref) {
        const match = ref.match(
          /^(?<owner>[^/]+)\/(?<name>[^/:]+)(:(?<version>.+))?$/
        );
        if (!match) {
          throw new Error(
            `Invalid reference to model version: ${ref}. Expected format: owner/name or owner/name:version`
          );
        }
        const { owner, name, version } = match.groups;
        return new ModelVersionIdentifier(owner, name, version);
      }
    };
    __name(ModelVersionIdentifier, "ModelVersionIdentifier");
    module.exports = ModelVersionIdentifier;
  }
});

// node_modules/replicate/lib/files.js
var require_files = __commonJS({
  "node_modules/replicate/lib/files.js"(exports, module) {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    async function createFile(file, metadata = {}, { signal } = {}) {
      const form = new FormData();
      let filename;
      let blob;
      if (file instanceof Blob) {
        filename = file.name || `blob_${Date.now()}`;
        blob = file;
      } else if (Buffer.isBuffer(file)) {
        filename = `buffer_${Date.now()}`;
        const bytes = new Uint8Array(file);
        blob = new Blob([bytes], {
          type: "application/octet-stream",
          name: filename
        });
      } else {
        throw new Error("Invalid file argument, must be a Blob, File or Buffer");
      }
      form.append("content", blob, filename);
      form.append(
        "metadata",
        new Blob([JSON.stringify(metadata)], { type: "application/json" })
      );
      const response = await this.request("/files", {
        method: "POST",
        data: form,
        headers: {
          "Content-Type": "multipart/form-data"
        },
        signal
      });
      return response.json();
    }
    __name(createFile, "createFile");
    async function listFiles({ signal } = {}) {
      const response = await this.request("/files", {
        method: "GET",
        signal
      });
      return response.json();
    }
    __name(listFiles, "listFiles");
    async function getFile(file_id, { signal } = {}) {
      const response = await this.request(`/files/${file_id}`, {
        method: "GET",
        signal
      });
      return response.json();
    }
    __name(getFile, "getFile");
    async function deleteFile(file_id, { signal } = {}) {
      const response = await this.request(`/files/${file_id}`, {
        method: "DELETE",
        signal
      });
      return response.status === 204;
    }
    __name(deleteFile, "deleteFile");
    module.exports = {
      create: createFile,
      list: listFiles,
      get: getFile,
      delete: deleteFile
    };
  }
});

// node_modules/replicate/lib/util.js
var require_util = __commonJS({
  "node_modules/replicate/lib/util.js"(exports, module) {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    var ApiError = require_error();
    var { create: createFile } = require_files();
    async function validateWebhook(requestData, secretOrCrypto, customCrypto) {
      let id;
      let body;
      let timestamp;
      let signature;
      let secret;
      let crypto2 = globalThis.crypto;
      if (requestData && requestData.headers && requestData.body) {
        if (typeof requestData.headers.get === "function") {
          id = requestData.headers.get("webhook-id");
          timestamp = requestData.headers.get("webhook-timestamp");
          signature = requestData.headers.get("webhook-signature");
        } else {
          id = requestData.headers["webhook-id"];
          timestamp = requestData.headers["webhook-timestamp"];
          signature = requestData.headers["webhook-signature"];
        }
        body = requestData.body;
        if (typeof secretOrCrypto !== "string") {
          throw new Error(
            "Unexpected value for secret passed to validateWebhook, expected a string"
          );
        }
        secret = secretOrCrypto;
        if (customCrypto) {
          crypto2 = customCrypto;
        }
      } else {
        id = requestData.id;
        body = requestData.body;
        timestamp = requestData.timestamp;
        signature = requestData.signature;
        secret = requestData.secret;
        if (secretOrCrypto) {
          crypto2 = secretOrCrypto;
        }
      }
      if (body instanceof ReadableStream || body.readable) {
        try {
          body = await new Response(body).text();
        } catch (err) {
          throw new Error(`Error reading body: ${err.message}`);
        }
      } else if (isTypedArray(body)) {
        body = await new Blob([body]).text();
      } else if (typeof body === "object") {
        body = JSON.stringify(body);
      } else if (typeof body !== "string") {
        throw new Error("Invalid body type");
      }
      if (!id || !timestamp || !signature) {
        throw new Error("Missing required webhook headers");
      }
      if (!body) {
        throw new Error("Missing required body");
      }
      if (!secret) {
        throw new Error("Missing required secret");
      }
      if (!crypto2) {
        throw new Error(
          'Missing `crypto` implementation. If using Node 18 pass in require("node:crypto").webcrypto'
        );
      }
      const signedContent = `${id}.${timestamp}.${body}`;
      const computedSignature = await createHMACSHA256(
        secret.split("_").pop(),
        signedContent,
        crypto2
      );
      const expectedSignatures = signature.split(" ").map((sig) => sig.split(",")[1]);
      return expectedSignatures.some(
        (expectedSignature) => expectedSignature === computedSignature
      );
    }
    __name(validateWebhook, "validateWebhook");
    async function createHMACSHA256(secret, data, crypto2) {
      const encoder = new TextEncoder();
      const key = await crypto2.subtle.importKey(
        "raw",
        base64ToBytes(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );
      const signature = await crypto2.subtle.sign("HMAC", key, encoder.encode(data));
      return bytesToBase64(signature);
    }
    __name(createHMACSHA256, "createHMACSHA256");
    function base64ToBytes(base64) {
      return Uint8Array.from(atob(base64), (m) => m.codePointAt(0));
    }
    __name(base64ToBytes, "base64ToBytes");
    function bytesToBase64(bytes) {
      return btoa(String.fromCharCode.apply(null, new Uint8Array(bytes)));
    }
    __name(bytesToBase64, "bytesToBase64");
    async function withAutomaticRetries(request, options = {}) {
      const shouldRetry = options.shouldRetry || (() => false);
      const maxRetries = options.maxRetries || 5;
      const interval = options.interval || 500;
      const jitter = options.jitter || 100;
      const sleep = /* @__PURE__ */ __name((ms) => new Promise((resolve) => setTimeout(resolve, ms)), "sleep");
      let attempts = 0;
      do {
        let delay = interval * 2 ** attempts + Math.random() * jitter;
        try {
          const response = await request();
          if (response.ok || !shouldRetry(response)) {
            return response;
          }
        } catch (error) {
          if (error instanceof ApiError) {
            const retryAfter = error.response.headers.get("Retry-After");
            if (retryAfter) {
              if (!Number.isInteger(retryAfter)) {
                const date = new Date(retryAfter);
                if (!Number.isNaN(date.getTime())) {
                  delay = date.getTime() - (/* @__PURE__ */ new Date()).getTime();
                }
              } else {
                delay = retryAfter * 1e3;
              }
            }
          }
        }
        if (Number.isInteger(maxRetries) && maxRetries > 0) {
          if (Number.isInteger(delay) && delay > 0) {
            await sleep(interval * 2 ** (options.maxRetries - maxRetries));
          }
          attempts += 1;
        }
      } while (attempts < maxRetries);
      return request();
    }
    __name(withAutomaticRetries, "withAutomaticRetries");
    async function transformFileInputs(client, inputs, strategy) {
      switch (strategy) {
        case "data-uri":
          return await transformFileInputsToBase64EncodedDataURIs(client, inputs);
        case "upload":
          return await transformFileInputsToReplicateFileURLs(client, inputs);
        case "default":
          try {
            return await transformFileInputsToReplicateFileURLs(client, inputs);
          } catch (error) {
            if (error instanceof ApiError && error.response.status >= 400 && error.response.status < 500) {
              throw error;
            }
            return await transformFileInputsToBase64EncodedDataURIs(inputs);
          }
        default:
          throw new Error(`Unexpected file upload strategy: ${strategy}`);
      }
    }
    __name(transformFileInputs, "transformFileInputs");
    async function transformFileInputsToReplicateFileURLs(client, inputs) {
      return await transform(inputs, async (value) => {
        if (value instanceof Blob || value instanceof Buffer) {
          const file = await createFile.call(client, value);
          return file.urls.get;
        }
        return value;
      });
    }
    __name(transformFileInputsToReplicateFileURLs, "transformFileInputsToReplicateFileURLs");
    var MAX_DATA_URI_SIZE = 1e7;
    async function transformFileInputsToBase64EncodedDataURIs(inputs) {
      let totalBytes = 0;
      return await transform(inputs, async (value) => {
        let buffer;
        let mime;
        if (value instanceof Blob) {
          buffer = await value.arrayBuffer();
          mime = value.type;
        } else if (isTypedArray(value)) {
          buffer = value;
        } else {
          return value;
        }
        totalBytes += buffer.byteLength;
        if (totalBytes > MAX_DATA_URI_SIZE) {
          throw new Error(
            `Combined filesize of prediction ${totalBytes} bytes exceeds 10mb limit for inline encoding, please provide URLs instead`
          );
        }
        const data = bytesToBase64(buffer);
        mime = mime || "application/octet-stream";
        return `data:${mime};base64,${data}`;
      });
    }
    __name(transformFileInputsToBase64EncodedDataURIs, "transformFileInputsToBase64EncodedDataURIs");
    async function transform(value, mapper) {
      if (Array.isArray(value)) {
        const copy = [];
        for (const val of value) {
          const transformed = await transform(val, mapper);
          copy.push(transformed);
        }
        return copy;
      }
      if (isPlainObject(value)) {
        const copy = {};
        for (const key of Object.keys(value)) {
          copy[key] = await transform(value[key], mapper);
        }
        return copy;
      }
      return await mapper(value);
    }
    __name(transform, "transform");
    function isTypedArray(arr) {
      return arr instanceof Int8Array || arr instanceof Int16Array || arr instanceof Int32Array || arr instanceof Uint8Array || arr instanceof Uint8ClampedArray || arr instanceof Uint16Array || arr instanceof Uint32Array || arr instanceof Float32Array || arr instanceof Float64Array;
    }
    __name(isTypedArray, "isTypedArray");
    function isPlainObject(value) {
      const isObjectLike = typeof value === "object" && value !== null;
      if (!isObjectLike || String(value) !== "[object Object]") {
        return false;
      }
      const proto = Object.getPrototypeOf(value);
      if (proto === null) {
        return true;
      }
      const Ctor = Object.prototype.hasOwnProperty.call(proto, "constructor") && proto.constructor;
      return typeof Ctor === "function" && Ctor instanceof Ctor && Function.prototype.toString.call(Ctor) === Function.prototype.toString.call(Object);
    }
    __name(isPlainObject, "isPlainObject");
    function parseProgressFromLogs(input) {
      const logs = typeof input === "object" && input.logs ? input.logs : input;
      if (!logs || typeof logs !== "string") {
        return null;
      }
      const pattern = /^\s*(\d+)%\s*\|.+?\|\s*(\d+)\/(\d+)/;
      const lines = logs.split("\n").reverse();
      for (const line of lines) {
        const matches = line.match(pattern);
        if (matches && matches.length === 4) {
          return {
            percentage: parseInt(matches[1], 10) / 100,
            current: parseInt(matches[2], 10),
            total: parseInt(matches[3], 10)
          };
        }
      }
      return null;
    }
    __name(parseProgressFromLogs, "parseProgressFromLogs");
    async function* streamAsyncIterator(stream) {
      const reader = stream.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done)
            return;
          yield value;
        }
      } finally {
        reader.releaseLock();
      }
    }
    __name(streamAsyncIterator, "streamAsyncIterator");
    module.exports = {
      transform,
      transformFileInputs,
      validateWebhook,
      withAutomaticRetries,
      parseProgressFromLogs,
      streamAsyncIterator
    };
  }
});

// node_modules/replicate/vendor/eventsource-parser/stream.js
var require_stream = __commonJS({
  "node_modules/replicate/vendor/eventsource-parser/stream.js"(exports, module) {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, {
              get: () => from[key],
              enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable
            });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var input_exports = {};
    __export2(input_exports, {
      EventSourceParserStream: () => EventSourceParserStream
    });
    module.exports = __toCommonJS(input_exports);
    function createParser(onParse) {
      let isFirstChunk;
      let buffer;
      let startingPosition;
      let startingFieldLength;
      let eventId;
      let eventName;
      let data;
      reset();
      return {
        feed,
        reset
      };
      function reset() {
        isFirstChunk = true;
        buffer = "";
        startingPosition = 0;
        startingFieldLength = -1;
        eventId = void 0;
        eventName = void 0;
        data = "";
      }
      __name(reset, "reset");
      function feed(chunk) {
        buffer = buffer ? buffer + chunk : chunk;
        if (isFirstChunk && hasBom(buffer)) {
          buffer = buffer.slice(BOM.length);
        }
        isFirstChunk = false;
        const length = buffer.length;
        let position = 0;
        let discardTrailingNewline = false;
        while (position < length) {
          if (discardTrailingNewline) {
            if (buffer[position] === "\n") {
              ++position;
            }
            discardTrailingNewline = false;
          }
          let lineLength = -1;
          let fieldLength = startingFieldLength;
          let character;
          for (let index = startingPosition; lineLength < 0 && index < length; ++index) {
            character = buffer[index];
            if (character === ":" && fieldLength < 0) {
              fieldLength = index - position;
            } else if (character === "\r") {
              discardTrailingNewline = true;
              lineLength = index - position;
            } else if (character === "\n") {
              lineLength = index - position;
            }
          }
          if (lineLength < 0) {
            startingPosition = length - position;
            startingFieldLength = fieldLength;
            break;
          } else {
            startingPosition = 0;
            startingFieldLength = -1;
          }
          parseEventStreamLine(buffer, position, fieldLength, lineLength);
          position += lineLength + 1;
        }
        if (position === length) {
          buffer = "";
        } else if (position > 0) {
          buffer = buffer.slice(position);
        }
      }
      __name(feed, "feed");
      function parseEventStreamLine(lineBuffer, index, fieldLength, lineLength) {
        if (lineLength === 0) {
          if (data.length > 0) {
            onParse({
              type: "event",
              id: eventId,
              event: eventName || void 0,
              data: data.slice(0, -1)
              // remove trailing newline
            });
            data = "";
            eventId = void 0;
          }
          eventName = void 0;
          return;
        }
        const noValue = fieldLength < 0;
        const field = lineBuffer.slice(
          index,
          index + (noValue ? lineLength : fieldLength)
        );
        let step = 0;
        if (noValue) {
          step = lineLength;
        } else if (lineBuffer[index + fieldLength + 1] === " ") {
          step = fieldLength + 2;
        } else {
          step = fieldLength + 1;
        }
        const position = index + step;
        const valueLength = lineLength - step;
        const value = lineBuffer.slice(position, position + valueLength).toString();
        if (field === "data") {
          data += value ? "".concat(value, "\n") : "\n";
        } else if (field === "event") {
          eventName = value;
        } else if (field === "id" && !value.includes("\0")) {
          eventId = value;
        } else if (field === "retry") {
          const retry = parseInt(value, 10);
          if (!Number.isNaN(retry)) {
            onParse({
              type: "reconnect-interval",
              value: retry
            });
          }
        }
      }
      __name(parseEventStreamLine, "parseEventStreamLine");
    }
    __name(createParser, "createParser");
    var BOM = [239, 187, 191];
    function hasBom(buffer) {
      return BOM.every((charCode, index) => buffer.charCodeAt(index) === charCode);
    }
    __name(hasBom, "hasBom");
    var EventSourceParserStream = /* @__PURE__ */ __name(class extends TransformStream {
      constructor() {
        let parser;
        super({
          start(controller) {
            parser = createParser((event) => {
              if (event.type === "event") {
                controller.enqueue(event);
              }
            });
          },
          transform(chunk) {
            parser.feed(chunk);
          }
        });
      }
    }, "EventSourceParserStream");
  }
});

// node_modules/replicate/vendor/streams-text-encoding/text-decoder-stream.js
var require_text_decoder_stream = __commonJS({
  "node_modules/replicate/vendor/streams-text-encoding/text-decoder-stream.js"(exports, module) {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var input_exports = {};
    __export2(input_exports, {
      TextDecoderStream: () => TextDecoderStream
    });
    module.exports = __toCommonJS(input_exports);
    var decDecoder = Symbol("decDecoder");
    var decTransform = Symbol("decTransform");
    var TextDecodeTransformer = /* @__PURE__ */ __name(class {
      constructor(decoder) {
        this.decoder_ = decoder;
      }
      transform(chunk, controller) {
        if (!(chunk instanceof ArrayBuffer || ArrayBuffer.isView(chunk))) {
          throw new TypeError("Input data must be a BufferSource");
        }
        const text = this.decoder_.decode(chunk, { stream: true });
        if (text.length !== 0) {
          controller.enqueue(text);
        }
      }
      flush(controller) {
        const text = this.decoder_.decode();
        if (text.length !== 0) {
          controller.enqueue(text);
        }
      }
    }, "TextDecodeTransformer");
    var TextDecoderStream = /* @__PURE__ */ __name(class {
      constructor(label, options) {
        const decoder = new TextDecoder(label || "utf-8", options || {});
        this[decDecoder] = decoder;
        this[decTransform] = new TransformStream(new TextDecodeTransformer(decoder));
      }
      get encoding() {
        return this[decDecoder].encoding;
      }
      get fatal() {
        return this[decDecoder].fatal;
      }
      get ignoreBOM() {
        return this[decDecoder].ignoreBOM;
      }
      get readable() {
        return this[decTransform].readable;
      }
      get writable() {
        return this[decTransform].writable;
      }
    }, "TextDecoderStream");
    var encEncoder = Symbol("encEncoder");
    var encTransform = Symbol("encTransform");
  }
});

// node_modules/replicate/lib/stream.js
var require_stream2 = __commonJS({
  "node_modules/replicate/lib/stream.js"(exports, module) {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    var ApiError = require_error();
    var { streamAsyncIterator } = require_util();
    var {
      EventSourceParserStream
    } = require_stream();
    var { TextDecoderStream } = typeof globalThis.TextDecoderStream === "undefined" ? require_text_decoder_stream() : globalThis;
    var ServerSentEvent = class {
      /**
       * Create a new server-sent event.
       *
       * @param {string} event The event name.
       * @param {string} data The event data.
       * @param {string} id The event ID.
       * @param {number} retry The retry time.
       */
      constructor(event, data, id, retry) {
        this.event = event;
        this.data = data;
        this.id = id;
        this.retry = retry;
      }
      /**
       * Convert the event to a string.
       */
      toString() {
        if (this.event === "output") {
          return this.data;
        }
        return "";
      }
    };
    __name(ServerSentEvent, "ServerSentEvent");
    function createReadableStream({ url, fetch, options = {} }) {
      const { useFileOutput = true, headers = {}, ...initOptions } = options;
      const shouldProcessFileOutput = useFileOutput && isFileStream(url);
      return new ReadableStream({
        async start(controller) {
          const init2 = {
            ...initOptions,
            headers: {
              ...headers,
              Accept: "text/event-stream"
            }
          };
          const response = await fetch(url, init2);
          if (!response.ok) {
            const text = await response.text();
            const request = new Request(url, init2);
            controller.error(
              new ApiError(
                `Request to ${url} failed with status ${response.status}: ${text}`,
                request,
                response
              )
            );
          }
          const stream = response.body.pipeThrough(new TextDecoderStream()).pipeThrough(new EventSourceParserStream());
          for await (const event of streamAsyncIterator(stream)) {
            if (event.event === "error") {
              controller.error(new Error(event.data));
              break;
            }
            let data = event.data;
            if (event.event === "output" && shouldProcessFileOutput && typeof data === "string") {
              data = createFileOutput({ url: data, fetch });
            }
            controller.enqueue(new ServerSentEvent(event.event, data, event.id));
            if (event.event === "done") {
              break;
            }
          }
          controller.close();
        }
      });
    }
    __name(createReadableStream, "createReadableStream");
    function createFileOutput({ url, fetch }) {
      let type = "application/octet-stream";
      class FileOutput extends ReadableStream {
        async blob() {
          const chunks = [];
          for await (const chunk of this) {
            chunks.push(chunk);
          }
          return new Blob(chunks, { type });
        }
        url() {
          return new URL(url);
        }
        toString() {
          return url;
        }
      }
      __name(FileOutput, "FileOutput");
      return new FileOutput({
        async start(controller) {
          const response = await fetch(url);
          if (!response.ok) {
            const text = await response.text();
            const request = new Request(url, init);
            controller.error(
              new ApiError(
                `Request to ${url} failed with status ${response.status}: ${text}`,
                request,
                response
              )
            );
          }
          if (response.headers.get("Content-Type")) {
            type = response.headers.get("Content-Type");
          }
          try {
            for await (const chunk of streamAsyncIterator(response.body)) {
              controller.enqueue(chunk);
            }
            controller.close();
          } catch (err) {
            controller.error(err);
          }
        }
      });
    }
    __name(createFileOutput, "createFileOutput");
    function isFileStream(url) {
      try {
        return new URL(url).pathname.startsWith("/v1/files/");
      } catch {
      }
      return false;
    }
    __name(isFileStream, "isFileStream");
    module.exports = {
      createFileOutput,
      createReadableStream,
      ServerSentEvent
    };
  }
});

// node_modules/replicate/lib/accounts.js
var require_accounts = __commonJS({
  "node_modules/replicate/lib/accounts.js"(exports, module) {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    async function getCurrentAccount({ signal } = {}) {
      const response = await this.request("/account", {
        method: "GET",
        signal
      });
      return response.json();
    }
    __name(getCurrentAccount, "getCurrentAccount");
    module.exports = {
      current: getCurrentAccount
    };
  }
});

// node_modules/replicate/lib/collections.js
var require_collections = __commonJS({
  "node_modules/replicate/lib/collections.js"(exports, module) {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    async function getCollection(collection_slug, { signal } = {}) {
      const response = await this.request(`/collections/${collection_slug}`, {
        method: "GET",
        signal
      });
      return response.json();
    }
    __name(getCollection, "getCollection");
    async function listCollections({ signal } = {}) {
      const response = await this.request("/collections", {
        method: "GET",
        signal
      });
      return response.json();
    }
    __name(listCollections, "listCollections");
    module.exports = { get: getCollection, list: listCollections };
  }
});

// node_modules/replicate/lib/deployments.js
var require_deployments = __commonJS({
  "node_modules/replicate/lib/deployments.js"(exports, module) {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    var { transformFileInputs } = require_util();
    async function createPrediction(deployment_owner, deployment_name, options) {
      const { input, wait, signal, ...data } = options;
      if (data.webhook) {
        try {
          new URL(data.webhook);
        } catch (err) {
          throw new Error("Invalid webhook URL");
        }
      }
      const headers = {};
      if (wait) {
        if (typeof wait === "number") {
          const n = Math.max(1, Math.ceil(Number(wait)) || 1);
          headers["Prefer"] = `wait=${n}`;
        } else {
          headers["Prefer"] = "wait";
        }
      }
      const response = await this.request(
        `/deployments/${deployment_owner}/${deployment_name}/predictions`,
        {
          method: "POST",
          headers,
          data: {
            ...data,
            input: await transformFileInputs(
              this,
              input,
              this.fileEncodingStrategy
            )
          },
          signal
        }
      );
      return response.json();
    }
    __name(createPrediction, "createPrediction");
    async function getDeployment(deployment_owner, deployment_name, { signal } = {}) {
      const response = await this.request(
        `/deployments/${deployment_owner}/${deployment_name}`,
        {
          method: "GET",
          signal
        }
      );
      return response.json();
    }
    __name(getDeployment, "getDeployment");
    async function createDeployment(deployment_config, { signal } = {}) {
      const response = await this.request("/deployments", {
        method: "POST",
        data: deployment_config,
        signal
      });
      return response.json();
    }
    __name(createDeployment, "createDeployment");
    async function updateDeployment(deployment_owner, deployment_name, deployment_config, { signal } = {}) {
      const response = await this.request(
        `/deployments/${deployment_owner}/${deployment_name}`,
        {
          method: "PATCH",
          data: deployment_config,
          signal
        }
      );
      return response.json();
    }
    __name(updateDeployment, "updateDeployment");
    async function deleteDeployment(deployment_owner, deployment_name, { signal } = {}) {
      const response = await this.request(
        `/deployments/${deployment_owner}/${deployment_name}`,
        {
          method: "DELETE",
          signal
        }
      );
      return response.status === 204;
    }
    __name(deleteDeployment, "deleteDeployment");
    async function listDeployments({ signal } = {}) {
      const response = await this.request("/deployments", {
        method: "GET",
        signal
      });
      return response.json();
    }
    __name(listDeployments, "listDeployments");
    module.exports = {
      predictions: {
        create: createPrediction
      },
      get: getDeployment,
      create: createDeployment,
      update: updateDeployment,
      list: listDeployments,
      delete: deleteDeployment
    };
  }
});

// node_modules/replicate/lib/hardware.js
var require_hardware = __commonJS({
  "node_modules/replicate/lib/hardware.js"(exports, module) {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    async function listHardware({ signal } = {}) {
      const response = await this.request("/hardware", {
        method: "GET",
        signal
      });
      return response.json();
    }
    __name(listHardware, "listHardware");
    module.exports = {
      list: listHardware
    };
  }
});

// node_modules/replicate/lib/models.js
var require_models = __commonJS({
  "node_modules/replicate/lib/models.js"(exports, module) {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    async function getModel(model_owner, model_name, { signal } = {}) {
      const response = await this.request(`/models/${model_owner}/${model_name}`, {
        method: "GET",
        signal
      });
      return response.json();
    }
    __name(getModel, "getModel");
    async function listModelVersions(model_owner, model_name, { signal } = {}) {
      const response = await this.request(
        `/models/${model_owner}/${model_name}/versions`,
        {
          method: "GET",
          signal
        }
      );
      return response.json();
    }
    __name(listModelVersions, "listModelVersions");
    async function getModelVersion(model_owner, model_name, version_id, { signal } = {}) {
      const response = await this.request(
        `/models/${model_owner}/${model_name}/versions/${version_id}`,
        {
          method: "GET",
          signal
        }
      );
      return response.json();
    }
    __name(getModelVersion, "getModelVersion");
    async function listModels({ signal } = {}) {
      const response = await this.request("/models", {
        method: "GET",
        signal
      });
      return response.json();
    }
    __name(listModels, "listModels");
    async function createModel(model_owner, model_name, options) {
      const { signal, ...rest } = options;
      const data = { owner: model_owner, name: model_name, ...rest };
      const response = await this.request("/models", {
        method: "POST",
        data,
        signal
      });
      return response.json();
    }
    __name(createModel, "createModel");
    async function search(query, { signal } = {}) {
      const response = await this.request("/models", {
        method: "QUERY",
        headers: {
          "Content-Type": "text/plain"
        },
        data: query,
        signal
      });
      return response.json();
    }
    __name(search, "search");
    module.exports = {
      get: getModel,
      list: listModels,
      create: createModel,
      versions: { list: listModelVersions, get: getModelVersion },
      search
    };
  }
});

// node_modules/replicate/lib/predictions.js
var require_predictions = __commonJS({
  "node_modules/replicate/lib/predictions.js"(exports, module) {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    var { transformFileInputs } = require_util();
    async function createPrediction(options) {
      const { model, version, input, wait, signal, ...data } = options;
      if (data.webhook) {
        try {
          new URL(data.webhook);
        } catch (err) {
          throw new Error("Invalid webhook URL");
        }
      }
      const headers = {};
      if (wait) {
        if (typeof wait === "number") {
          const n = Math.max(1, Math.ceil(Number(wait)) || 1);
          headers["Prefer"] = `wait=${n}`;
        } else {
          headers["Prefer"] = "wait";
        }
      }
      let response;
      if (version) {
        response = await this.request("/predictions", {
          method: "POST",
          headers,
          data: {
            ...data,
            input: await transformFileInputs(
              this,
              input,
              this.fileEncodingStrategy
            ),
            version
          },
          signal
        });
      } else if (model) {
        response = await this.request(`/models/${model}/predictions`, {
          method: "POST",
          headers,
          data: {
            ...data,
            input: await transformFileInputs(
              this,
              input,
              this.fileEncodingStrategy
            )
          },
          signal
        });
      } else {
        throw new Error("Either model or version must be specified");
      }
      return response.json();
    }
    __name(createPrediction, "createPrediction");
    async function getPrediction(prediction_id, { signal } = {}) {
      const response = await this.request(`/predictions/${prediction_id}`, {
        method: "GET",
        signal
      });
      return response.json();
    }
    __name(getPrediction, "getPrediction");
    async function cancelPrediction(prediction_id, { signal } = {}) {
      const response = await this.request(`/predictions/${prediction_id}/cancel`, {
        method: "POST",
        signal
      });
      return response.json();
    }
    __name(cancelPrediction, "cancelPrediction");
    async function listPredictions({ signal } = {}) {
      const response = await this.request("/predictions", {
        method: "GET",
        signal
      });
      return response.json();
    }
    __name(listPredictions, "listPredictions");
    module.exports = {
      create: createPrediction,
      get: getPrediction,
      cancel: cancelPrediction,
      list: listPredictions
    };
  }
});

// node_modules/replicate/lib/trainings.js
var require_trainings = __commonJS({
  "node_modules/replicate/lib/trainings.js"(exports, module) {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    async function createTraining(model_owner, model_name, version_id, options) {
      const { signal, ...data } = options;
      if (data.webhook) {
        try {
          new URL(data.webhook);
        } catch (err) {
          throw new Error("Invalid webhook URL");
        }
      }
      const response = await this.request(
        `/models/${model_owner}/${model_name}/versions/${version_id}/trainings`,
        {
          method: "POST",
          data,
          signal
        }
      );
      return response.json();
    }
    __name(createTraining, "createTraining");
    async function getTraining(training_id, { signal } = {}) {
      const response = await this.request(`/trainings/${training_id}`, {
        method: "GET",
        signal
      });
      return response.json();
    }
    __name(getTraining, "getTraining");
    async function cancelTraining(training_id, { signal } = {}) {
      const response = await this.request(`/trainings/${training_id}/cancel`, {
        method: "POST",
        signal
      });
      return response.json();
    }
    __name(cancelTraining, "cancelTraining");
    async function listTrainings({ signal } = {}) {
      const response = await this.request("/trainings", {
        method: "GET",
        signal
      });
      return response.json();
    }
    __name(listTrainings, "listTrainings");
    module.exports = {
      create: createTraining,
      get: getTraining,
      cancel: cancelTraining,
      list: listTrainings
    };
  }
});

// node_modules/replicate/lib/webhooks.js
var require_webhooks = __commonJS({
  "node_modules/replicate/lib/webhooks.js"(exports, module) {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    async function getDefaultWebhookSecret({ signal } = {}) {
      const response = await this.request("/webhooks/default/secret", {
        method: "GET",
        signal
      });
      return response.json();
    }
    __name(getDefaultWebhookSecret, "getDefaultWebhookSecret");
    module.exports = {
      default: {
        secret: {
          get: getDefaultWebhookSecret
        }
      }
    };
  }
});

// node_modules/replicate/package.json
var require_package = __commonJS({
  "node_modules/replicate/package.json"(exports, module) {
    module.exports = {
      name: "replicate",
      version: "1.4.0",
      description: "JavaScript client for Replicate",
      repository: "github:replicate/replicate-javascript",
      homepage: "https://github.com/replicate/replicate-javascript#readme",
      bugs: "https://github.com/replicate/replicate-javascript/issues",
      license: "Apache-2.0",
      main: "index.js",
      type: "commonjs",
      types: "index.d.ts",
      files: [
        "CONTRIBUTING.md",
        "LICENSE",
        "README.md",
        "index.d.ts",
        "index.js",
        "lib/**/*.js",
        "vendor/**/*",
        "package.json"
      ],
      engines: {
        node: ">=18.0.0",
        npm: ">=7.19.0",
        git: ">=2.11.0",
        yarn: ">=1.7.0"
      },
      scripts: {
        check: "tsc",
        format: "biome format . --write",
        "lint-biome": "biome lint .",
        "lint-publint": "publint",
        lint: "npm run lint-biome && npm run lint-publint",
        test: "jest"
      },
      optionalDependencies: {
        "readable-stream": ">=4.0.0"
      },
      devDependencies: {
        "@biomejs/biome": "^1.4.1",
        "@types/jest": "^29.5.3",
        "@typescript-eslint/eslint-plugin": "^5.56.0",
        "cross-fetch": "^3.1.5",
        jest: "^29.7.0",
        nock: "^14.0.0-beta.6",
        publint: "^0.2.7",
        "ts-jest": "^29.1.0",
        typescript: "^5.0.2"
      }
    };
  }
});

// node_modules/replicate/index.js
var require_replicate = __commonJS({
  "node_modules/replicate/index.js"(exports, module) {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    var ApiError = require_error();
    var ModelVersionIdentifier = require_identifier();
    var { createReadableStream, createFileOutput } = require_stream2();
    var {
      transform,
      withAutomaticRetries,
      validateWebhook,
      parseProgressFromLogs,
      streamAsyncIterator
    } = require_util();
    var accounts = require_accounts();
    var collections = require_collections();
    var deployments = require_deployments();
    var files = require_files();
    var hardware = require_hardware();
    var models = require_models();
    var predictions = require_predictions();
    var trainings = require_trainings();
    var webhooks = require_webhooks();
    var packageJSON = require_package();
    var Replicate2 = class {
      /**
       * Create a new Replicate API client instance.
       *
       * @param {object} options - Configuration options for the client
       * @param {string} options.auth - API access token. Defaults to the `REPLICATE_API_TOKEN` environment variable.
       * @param {string} options.userAgent - Identifier of your app
       * @param {string} [options.baseUrl] - Defaults to https://api.replicate.com/v1
       * @param {Function} [options.fetch] - Fetch function to use. Defaults to `globalThis.fetch`
       * @param {boolean} [options.useFileOutput] - Set to `false` to disable `FileOutput` objects from `run` instead of URLs, defaults to true.
       * @param {"default" | "upload" | "data-uri"} [options.fileEncodingStrategy] - Determines the file encoding strategy to use
       */
      constructor(options = {}) {
        this.auth = options.auth || (typeof process !== "undefined" ? process.env.REPLICATE_API_TOKEN : null);
        this.userAgent = options.userAgent || `replicate-javascript/${packageJSON.version}`;
        this.baseUrl = options.baseUrl || "https://api.replicate.com/v1";
        this.fetch = options.fetch || globalThis.fetch;
        this.fileEncodingStrategy = options.fileEncodingStrategy || "default";
        this.useFileOutput = options.useFileOutput === false ? false : true;
        this.accounts = {
          current: accounts.current.bind(this)
        };
        this.collections = {
          list: collections.list.bind(this),
          get: collections.get.bind(this)
        };
        this.deployments = {
          get: deployments.get.bind(this),
          create: deployments.create.bind(this),
          update: deployments.update.bind(this),
          delete: deployments.delete.bind(this),
          list: deployments.list.bind(this),
          predictions: {
            create: deployments.predictions.create.bind(this)
          }
        };
        this.files = {
          create: files.create.bind(this),
          get: files.get.bind(this),
          list: files.list.bind(this),
          delete: files.delete.bind(this)
        };
        this.hardware = {
          list: hardware.list.bind(this)
        };
        this.models = {
          get: models.get.bind(this),
          list: models.list.bind(this),
          create: models.create.bind(this),
          versions: {
            list: models.versions.list.bind(this),
            get: models.versions.get.bind(this)
          },
          search: models.search.bind(this)
        };
        this.predictions = {
          create: predictions.create.bind(this),
          get: predictions.get.bind(this),
          cancel: predictions.cancel.bind(this),
          list: predictions.list.bind(this)
        };
        this.trainings = {
          create: trainings.create.bind(this),
          get: trainings.get.bind(this),
          cancel: trainings.cancel.bind(this),
          list: trainings.list.bind(this)
        };
        this.webhooks = {
          default: {
            secret: {
              get: webhooks.default.secret.get.bind(this)
            }
          }
        };
      }
      /**
       * Run a model and wait for its output.
       *
       * @param {string} ref - Required. The model version identifier in the format "owner/name" or "owner/name:version"
       * @param {object} options
       * @param {object} options.input - Required. An object with the model inputs
       * @param {{mode: "block", timeout?: number, interval?: number} | {mode: "poll", interval?: number }} [options.wait] - Options for waiting for the prediction to finish. If `wait` is explicitly true, the function will block and wait for the prediction to finish.
       * @param {string} [options.webhook] - An HTTPS URL for receiving a webhook when the prediction has new output
       * @param {string[]} [options.webhook_events_filter] - You can change which events trigger webhook requests by specifying webhook events (`start`|`output`|`logs`|`completed`)
       * @param {AbortSignal} [options.signal] - AbortSignal to cancel the prediction
       * @param {Function} [progress] - Callback function that receives the prediction object as it's updated. The function is called when the prediction is created, each time its updated while polling for completion, and when it's completed.
       * @throws {Error} If the reference is invalid
       * @throws {Error} If the prediction failed
       * @returns {Promise<object>} - Resolves with the output of running the model
       */
      async run(ref, options, progress) {
        const { wait = { mode: "block" }, signal, ...data } = options;
        const identifier = ModelVersionIdentifier.parse(ref);
        let prediction;
        if (identifier.version) {
          prediction = await this.predictions.create({
            ...data,
            version: identifier.version,
            wait: wait.mode === "block" ? wait.timeout ?? true : false
          });
        } else if (identifier.owner && identifier.name) {
          prediction = await this.predictions.create({
            ...data,
            model: `${identifier.owner}/${identifier.name}`,
            wait: wait.mode === "block" ? wait.timeout ?? true : false
          });
        } else {
          throw new Error("Invalid model version identifier");
        }
        if (progress) {
          progress(prediction);
        }
        const isDone = wait.mode === "block" && prediction.status !== "starting";
        if (!isDone) {
          prediction = await this.wait(
            prediction,
            { interval: wait.mode === "poll" ? wait.interval : void 0 },
            async (updatedPrediction) => {
              if (progress) {
                progress(updatedPrediction);
              }
              if (signal && signal.aborted) {
                return true;
              }
              return false;
            }
          );
        }
        if (signal && signal.aborted) {
          prediction = await this.predictions.cancel(prediction.id);
        }
        if (progress) {
          progress(prediction);
        }
        if (prediction.status === "failed") {
          throw new Error(`Prediction failed: ${prediction.error}`);
        }
        return transform(prediction.output, (value) => {
          if (typeof value === "string" && (value.startsWith("https:") || value.startsWith("data:"))) {
            return this.useFileOutput ? createFileOutput({ url: value, fetch: this.fetch }) : value;
          }
          return value;
        });
      }
      /**
       * Make a request to the Replicate API.
       *
       * @param {string} route - REST API endpoint path
       * @param {object} options - Request parameters
       * @param {string} [options.method] - HTTP method. Defaults to GET
       * @param {object} [options.params] - Query parameters
       * @param {object|Headers} [options.headers] - HTTP headers
       * @param {object} [options.data] - Body parameters
       * @param {AbortSignal} [options.signal] - AbortSignal to cancel the request
       * @returns {Promise<Response>} - Resolves with the response object
       * @throws {ApiError} If the request failed
       */
      async request(route, options) {
        const { auth, baseUrl, userAgent } = this;
        let url;
        if (route instanceof URL) {
          url = route;
        } else {
          url = new URL(
            route.startsWith("/") ? route.slice(1) : route,
            baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
          );
        }
        const { method = "GET", params = {}, data, signal } = options;
        for (const [key, value] of Object.entries(params)) {
          url.searchParams.append(key, value);
        }
        const headers = {
          "Content-Type": "application/json",
          "User-Agent": userAgent
        };
        if (auth) {
          headers["Authorization"] = `Bearer ${auth}`;
        }
        if (options.headers) {
          for (const [key, value] of Object.entries(options.headers)) {
            headers[key] = value;
          }
        }
        let body = void 0;
        if (data instanceof FormData) {
          body = data;
          delete headers["Content-Type"];
        } else if (data) {
          body = JSON.stringify(data);
        }
        const init2 = {
          method,
          headers,
          body,
          signal
        };
        const shouldRetry = method === "GET" ? (response2) => response2.status === 429 || response2.status >= 500 : (response2) => response2.status === 429;
        const _fetch = this.fetch;
        const response = await withAutomaticRetries(async () => _fetch(url, init2), {
          shouldRetry
        });
        if (!response.ok) {
          const request = new Request(url, init2);
          const responseText = await response.text();
          throw new ApiError(
            `Request to ${url} failed with status ${response.status} ${response.statusText}: ${responseText}.`,
            request,
            response
          );
        }
        return response;
      }
      /**
       * Stream a model and wait for its output.
       *
       * @param {string} identifier - Required. The model version identifier in the format "{owner}/{name}:{version}"
       * @param {object} options
       * @param {object} options.input - Required. An object with the model inputs
       * @param {string} [options.webhook] - An HTTPS URL for receiving a webhook when the prediction has new output
       * @param {string[]} [options.webhook_events_filter] - You can change which events trigger webhook requests by specifying webhook events (`start`|`output`|`logs`|`completed`)
       * @param {AbortSignal} [options.signal] - AbortSignal to cancel the prediction
       * @throws {Error} If the prediction failed
       * @yields {ServerSentEvent} Each streamed event from the prediction
       */
      async *stream(ref, options) {
        const {
          wait,
          signal,
          useFileOutput = this.useFileOutput,
          ...data
        } = options;
        const identifier = ModelVersionIdentifier.parse(ref);
        let prediction;
        if (identifier.version) {
          prediction = await this.predictions.create({
            ...data,
            version: identifier.version
          });
        } else if (identifier.owner && identifier.name) {
          prediction = await this.predictions.create({
            ...data,
            model: `${identifier.owner}/${identifier.name}`
          });
        } else {
          throw new Error("Invalid model version identifier");
        }
        if (prediction.urls && prediction.urls.stream) {
          const stream = createReadableStream({
            url: prediction.urls.stream,
            fetch: this.fetch,
            options: {
              useFileOutput,
              ...signal ? { signal } : {}
            }
          });
          yield* streamAsyncIterator(stream);
        } else {
          throw new Error("Prediction does not support streaming");
        }
      }
      /**
       * Paginate through a list of results.
       *
       * @generator
       * @example
       * for await (const page of replicate.paginate(replicate.predictions.list) {
       *    console.log(page);
       * }
       * @param {Function} endpoint - Function that returns a promise for the next page of results
       * @param {object} [options]
       * @param {AbortSignal} [options.signal] - AbortSignal to cancel the request.
       * @yields {object[]} Each page of results
       */
      async *paginate(endpoint, options = {}) {
        const response = await endpoint();
        yield response.results;
        if (response.next && !(options.signal && options.signal.aborted)) {
          const nextPage = /* @__PURE__ */ __name(() => this.request(response.next, {
            method: "GET",
            signal: options.signal
          }).then((r) => r.json()), "nextPage");
          yield* this.paginate(nextPage, options);
        }
      }
      /**
       * Wait for a prediction to finish.
       *
       * If the prediction has already finished,
       * this function returns immediately.
       * Otherwise, it polls the API until the prediction finishes.
       *
       * @async
       * @param {object} prediction - Prediction object
       * @param {object} options - Options
       * @param {number} [options.interval] - Polling interval in milliseconds. Defaults to 500
       * @param {Function} [stop] - Async callback function that is called after each polling attempt. Receives the prediction object as an argument. Return false to cancel polling.
       * @throws {Error} If the prediction doesn't complete within the maximum number of attempts
       * @throws {Error} If the prediction failed
       * @returns {Promise<object>} Resolves with the completed prediction object
       */
      async wait(prediction, options, stop) {
        const { id } = prediction;
        if (!id) {
          throw new Error("Invalid prediction");
        }
        if (prediction.status === "succeeded" || prediction.status === "failed" || prediction.status === "canceled") {
          return prediction;
        }
        const sleep = /* @__PURE__ */ __name((ms) => new Promise((resolve) => setTimeout(resolve, ms)), "sleep");
        const interval = options && options.interval || 500;
        let updatedPrediction = await this.predictions.get(id);
        while (updatedPrediction.status !== "succeeded" && updatedPrediction.status !== "failed" && updatedPrediction.status !== "canceled") {
          if (stop && await stop(updatedPrediction) === true) {
            break;
          }
          await sleep(interval);
          updatedPrediction = await this.predictions.get(prediction.id);
        }
        if (updatedPrediction.status === "failed") {
          throw new Error(`Prediction failed: ${updatedPrediction.error}`);
        }
        return updatedPrediction;
      }
    };
    __name(Replicate2, "Replicate");
    module.exports = Replicate2;
    module.exports.validateWebhook = validateWebhook;
    module.exports.parseProgressFromLogs = parseProgressFromLogs;
  }
});

// .wrangler/tmp/bundle-uagYGm/middleware-loader.entry.ts
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();

// .wrangler/tmp/bundle-uagYGm/middleware-insertion-facade.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();

// src/index.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var import_replicate = __toESM(require_replicate(), 1);

// node_modules/stripe/esm/stripe.esm.worker.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();

// node_modules/stripe/esm/platform/WebPlatformFunctions.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();

// node_modules/stripe/esm/platform/PlatformFunctions.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();

// node_modules/stripe/esm/net/FetchHttpClient.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();

// node_modules/stripe/esm/utils.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var OPTIONS_KEYS = [
  "apiKey",
  "idempotencyKey",
  "stripeAccount",
  "apiVersion",
  "maxNetworkRetries",
  "timeout",
  "host",
  "authenticator",
  "stripeContext",
  "additionalHeaders",
  "streaming"
];
function isOptionsHash(o) {
  return o && typeof o === "object" && OPTIONS_KEYS.some((prop) => Object.prototype.hasOwnProperty.call(o, prop));
}
__name(isOptionsHash, "isOptionsHash");
function queryStringifyRequestData(data, _apiMode) {
  return stringifyRequestData(data);
}
__name(queryStringifyRequestData, "queryStringifyRequestData");
function encodeQueryValue(value) {
  return encodeURIComponent(value).replace(/!/g, "%21").replace(/\*/g, "%2A").replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/'/g, "%27").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
__name(encodeQueryValue, "encodeQueryValue");
function valueToString(value) {
  if (value instanceof Date) {
    return Math.floor(value.getTime() / 1e3).toString();
  }
  if (value === null) {
    return "";
  }
  return String(value);
}
__name(valueToString, "valueToString");
function stringifyRequestData(data) {
  const pairs = [];
  function encode(key, value) {
    if (value === void 0) {
      return;
    }
    if (value === null || typeof value !== "object" || value instanceof Date) {
      pairs.push(encodeQueryValue(key) + "=" + encodeQueryValue(valueToString(value)));
      return;
    }
    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        if (value[i] !== void 0) {
          encode(key + "[" + i + "]", value[i]);
        }
      }
      return;
    }
    for (const k of Object.keys(value)) {
      encode(key + "[" + k + "]", value[k]);
    }
  }
  __name(encode, "encode");
  if (typeof data === "object" && data !== null) {
    for (const key of Object.keys(data)) {
      encode(key, data[key]);
    }
  }
  return pairs.join("&");
}
__name(stringifyRequestData, "stringifyRequestData");
var makeURLInterpolator = (() => {
  const rc = {
    "\n": "\\n",
    '"': '\\"',
    "\u2028": "\\u2028",
    "\u2029": "\\u2029"
  };
  return (str) => {
    const cleanString = str.replace(/["\n\r\u2028\u2029]/g, ($0) => rc[$0]);
    return (outputs) => {
      return cleanString.replace(/\{([\s\S]+?)\}/g, ($0, $1) => {
        const output = outputs[$1];
        if (isValidEncodeUriComponentType(output))
          return encodeURIComponent(output);
        return "";
      });
    };
  };
})();
function isValidEncodeUriComponentType(value) {
  return ["number", "string", "boolean"].includes(typeof value);
}
__name(isValidEncodeUriComponentType, "isValidEncodeUriComponentType");
function extractUrlParams(path) {
  const params = path.match(/\{\w+\}/g);
  if (!params) {
    return [];
  }
  return params.map((param) => param.replace(/[{}]/g, ""));
}
__name(extractUrlParams, "extractUrlParams");
function getDataFromArgs(args) {
  if (!Array.isArray(args) || !args[0] || typeof args[0] !== "object") {
    return {};
  }
  if (!isOptionsHash(args[0])) {
    return args.shift();
  }
  const argKeys = Object.keys(args[0]);
  const optionKeysInArgs = argKeys.filter((key) => OPTIONS_KEYS.includes(key));
  if (optionKeysInArgs.length > 0 && optionKeysInArgs.length !== argKeys.length) {
    emitWarning(`Options found in arguments (${optionKeysInArgs.join(", ")}). Did you mean to pass an options object? See https://github.com/stripe/stripe-node/wiki/Passing-Options.`);
  }
  return {};
}
__name(getDataFromArgs, "getDataFromArgs");
function getOptionsFromArgs(args) {
  const opts = {
    host: null,
    headers: {},
    settings: {},
    streaming: false
  };
  if (args.length > 0) {
    const arg = args[args.length - 1];
    if (typeof arg === "string") {
      opts.authenticator = createApiKeyAuthenticator(args.pop());
    } else if (isOptionsHash(arg)) {
      const params = Object.assign({}, args.pop());
      const extraKeys = Object.keys(params).filter((key) => !OPTIONS_KEYS.includes(key));
      if (extraKeys.length) {
        emitWarning(`Invalid options found (${extraKeys.join(", ")}); ignoring.`);
      }
      if (params.apiKey) {
        opts.authenticator = createApiKeyAuthenticator(params.apiKey);
      }
      if (params.idempotencyKey) {
        opts.headers["Idempotency-Key"] = params.idempotencyKey;
      }
      if (params.stripeAccount) {
        opts.headers["Stripe-Account"] = params.stripeAccount;
      }
      if (params.stripeContext) {
        if (opts.headers["Stripe-Account"]) {
          throw new Error("Can't specify both stripeAccount and stripeContext.");
        }
        opts.headers["Stripe-Context"] = params.stripeContext;
      }
      if (params.apiVersion) {
        opts.headers["Stripe-Version"] = params.apiVersion;
      }
      if (Number.isInteger(params.maxNetworkRetries)) {
        opts.settings.maxNetworkRetries = params.maxNetworkRetries;
      }
      if (Number.isInteger(params.timeout)) {
        opts.settings.timeout = params.timeout;
      }
      if (params.host) {
        opts.host = params.host;
      }
      if (params.authenticator) {
        if (params.apiKey) {
          throw new Error("Can't specify both apiKey and authenticator.");
        }
        if (typeof params.authenticator !== "function") {
          throw new Error("The authenticator must be a function receiving a request as the first parameter.");
        }
        opts.authenticator = params.authenticator;
      }
      if (params.additionalHeaders) {
        opts.headers = params.additionalHeaders;
      }
      if (params.streaming) {
        opts.streaming = true;
      }
    }
  }
  return opts;
}
__name(getOptionsFromArgs, "getOptionsFromArgs");
function protoExtend(sub) {
  const Super = this;
  const Constructor = Object.prototype.hasOwnProperty.call(sub, "constructor") ? sub.constructor : function(...args) {
    Super.apply(this, args);
  };
  Object.assign(Constructor, Super);
  Constructor.prototype = Object.create(Super.prototype);
  Object.assign(Constructor.prototype, sub);
  return Constructor;
}
__name(protoExtend, "protoExtend");
function removeNullish(obj) {
  if (typeof obj !== "object") {
    throw new Error("Argument must be an object");
  }
  return Object.keys(obj).reduce((result, key) => {
    if (obj[key] != null) {
      result[key] = obj[key];
    }
    return result;
  }, {});
}
__name(removeNullish, "removeNullish");
function normalizeHeaders(obj) {
  if (!(obj && typeof obj === "object")) {
    return obj;
  }
  return Object.keys(obj).reduce((result, header) => {
    result[normalizeHeader(header)] = obj[header];
    return result;
  }, {});
}
__name(normalizeHeaders, "normalizeHeaders");
function normalizeHeader(header) {
  return header.split("-").map((text) => text.charAt(0).toUpperCase() + text.substr(1).toLowerCase()).join("-");
}
__name(normalizeHeader, "normalizeHeader");
function callbackifyPromiseWithTimeout(promise, callback) {
  if (callback) {
    return promise.then((res) => {
      setTimeout(() => {
        callback(null, res);
      }, 0);
    }, (err) => {
      setTimeout(() => {
        callback(err, null);
      }, 0);
    });
  }
  return promise;
}
__name(callbackifyPromiseWithTimeout, "callbackifyPromiseWithTimeout");
function pascalToCamelCase(name) {
  if (name === "OAuth") {
    return "oauth";
  } else {
    return name[0].toLowerCase() + name.substring(1);
  }
}
__name(pascalToCamelCase, "pascalToCamelCase");
function emitWarning(warning) {
  if (typeof process.emitWarning !== "function") {
    return console.warn(`Stripe: ${warning}`);
  }
  return process.emitWarning(warning, "Stripe");
}
__name(emitWarning, "emitWarning");
function isObject(obj) {
  const type = typeof obj;
  return (type === "function" || type === "object") && !!obj;
}
__name(isObject, "isObject");
function flattenAndStringify(data) {
  const result = {};
  const step = /* @__PURE__ */ __name((obj, prevKey) => {
    Object.entries(obj).forEach(([key, value]) => {
      const newKey = prevKey ? `${prevKey}[${key}]` : key;
      if (isObject(value)) {
        if (!(value instanceof Uint8Array) && !Object.prototype.hasOwnProperty.call(value, "data")) {
          return step(value, newKey);
        } else {
          result[newKey] = value;
        }
      } else {
        result[newKey] = String(value);
      }
    });
  }, "step");
  step(data, null);
  return result;
}
__name(flattenAndStringify, "flattenAndStringify");
function validateInteger(name, n, defaultVal) {
  if (!Number.isInteger(n)) {
    if (defaultVal !== void 0) {
      return defaultVal;
    } else {
      throw new Error(`${name} must be an integer`);
    }
  }
  return n;
}
__name(validateInteger, "validateInteger");
function determineProcessUserAgentProperties() {
  return typeof process === "undefined" ? {} : {
    lang_version: process.version,
    platform: process.platform
  };
}
__name(determineProcessUserAgentProperties, "determineProcessUserAgentProperties");
function createApiKeyAuthenticator(apiKey) {
  const authenticator = /* @__PURE__ */ __name((request) => {
    request.headers.Authorization = "Bearer " + apiKey;
    return Promise.resolve();
  }, "authenticator");
  authenticator._apiKey = apiKey;
  return authenticator;
}
__name(createApiKeyAuthenticator, "createApiKeyAuthenticator");
function dateTimeReplacer(key, value) {
  if (this[key] instanceof Date) {
    return Math.floor(this[key].getTime() / 1e3).toString();
  }
  return value;
}
__name(dateTimeReplacer, "dateTimeReplacer");
function jsonStringifyRequestData(data) {
  return JSON.stringify(data, dateTimeReplacer);
}
__name(jsonStringifyRequestData, "jsonStringifyRequestData");
function getAPIMode(path) {
  if (!path) {
    return "v1";
  }
  return path.startsWith("/v2") ? "v2" : "v1";
}
__name(getAPIMode, "getAPIMode");
function parseHttpHeaderAsString(header) {
  if (Array.isArray(header)) {
    return header.join(", ");
  }
  return String(header);
}
__name(parseHttpHeaderAsString, "parseHttpHeaderAsString");
function parseHttpHeaderAsNumber(header) {
  const number = Array.isArray(header) ? header[0] : header;
  return Number(number);
}
__name(parseHttpHeaderAsNumber, "parseHttpHeaderAsNumber");
function parseHeadersForFetch(headers) {
  return Object.entries(headers).map(([key, value]) => {
    return [key, parseHttpHeaderAsString(value)];
  });
}
__name(parseHeadersForFetch, "parseHeadersForFetch");

// node_modules/stripe/esm/net/HttpClient.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var HttpClient = class {
  /** The client name used for diagnostics. */
  getClientName() {
    throw new Error("getClientName not implemented.");
  }
  makeRequest(host, port, path, method, headers, requestData, protocol, timeout) {
    throw new Error("makeRequest not implemented.");
  }
  /** Helper to make a consistent timeout error across implementations. */
  static makeTimeoutError() {
    const timeoutErr = new TypeError(HttpClient.TIMEOUT_ERROR_CODE);
    timeoutErr.code = HttpClient.TIMEOUT_ERROR_CODE;
    return timeoutErr;
  }
};
__name(HttpClient, "HttpClient");
HttpClient.CONNECTION_CLOSED_ERROR_CODES = ["ECONNRESET", "EPIPE"];
HttpClient.TIMEOUT_ERROR_CODE = "ETIMEDOUT";
var HttpClientResponse = class {
  constructor(statusCode, headers) {
    this._statusCode = statusCode;
    this._headers = headers;
  }
  getStatusCode() {
    return this._statusCode;
  }
  getHeaders() {
    return this._headers;
  }
  getRawResponse() {
    throw new Error("getRawResponse not implemented.");
  }
  toStream(streamCompleteCallback) {
    throw new Error("toStream not implemented.");
  }
  toJSON() {
    throw new Error("toJSON not implemented.");
  }
};
__name(HttpClientResponse, "HttpClientResponse");

// node_modules/stripe/esm/net/FetchHttpClient.js
var FetchHttpClient = class extends HttpClient {
  constructor(fetchFn) {
    super();
    if (!fetchFn) {
      if (!globalThis.fetch) {
        throw new Error("fetch() function not provided and is not defined in the global scope. You must provide a fetch implementation.");
      }
      fetchFn = globalThis.fetch;
    }
    if (globalThis.AbortController) {
      this._fetchFn = FetchHttpClient.makeFetchWithAbortTimeout(fetchFn);
    } else {
      this._fetchFn = FetchHttpClient.makeFetchWithRaceTimeout(fetchFn);
    }
  }
  static makeFetchWithRaceTimeout(fetchFn) {
    return (url, init2, timeout) => {
      let pendingTimeoutId;
      const timeoutPromise = new Promise((_, reject) => {
        pendingTimeoutId = setTimeout(() => {
          pendingTimeoutId = null;
          reject(HttpClient.makeTimeoutError());
        }, timeout);
      });
      const fetchPromise = fetchFn(url, init2);
      return Promise.race([fetchPromise, timeoutPromise]).finally(() => {
        if (pendingTimeoutId) {
          clearTimeout(pendingTimeoutId);
        }
      });
    };
  }
  static makeFetchWithAbortTimeout(fetchFn) {
    return async (url, init2, timeout) => {
      const abort = new AbortController();
      let timeoutId = setTimeout(() => {
        timeoutId = null;
        abort.abort(HttpClient.makeTimeoutError());
      }, timeout);
      try {
        return await fetchFn(url, Object.assign(Object.assign({}, init2), { signal: abort.signal }));
      } catch (err) {
        if (err.name === "AbortError") {
          throw HttpClient.makeTimeoutError();
        } else {
          throw err;
        }
      } finally {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      }
    };
  }
  /** @override. */
  getClientName() {
    return "fetch";
  }
  async makeRequest(host, port, path, method, headers, requestData, protocol, timeout) {
    const isInsecureConnection = protocol === "http";
    const url = new URL(path, `${isInsecureConnection ? "http" : "https"}://${host}`);
    url.port = port;
    const methodHasPayload = method == "POST" || method == "PUT" || method == "PATCH";
    const body = requestData || (methodHasPayload ? "" : void 0);
    const res = await this._fetchFn(url.toString(), {
      method,
      headers: parseHeadersForFetch(headers),
      body
    }, timeout);
    return new FetchHttpClientResponse(res);
  }
};
__name(FetchHttpClient, "FetchHttpClient");
var FetchHttpClientResponse = class extends HttpClientResponse {
  constructor(res) {
    super(res.status, FetchHttpClientResponse._transformHeadersToObject(res.headers));
    this._res = res;
  }
  getRawResponse() {
    return this._res;
  }
  toStream(streamCompleteCallback) {
    streamCompleteCallback();
    return this._res.body;
  }
  toJSON() {
    return this._res.json();
  }
  static _transformHeadersToObject(headers) {
    const headersObj = {};
    for (const entry of headers) {
      if (!Array.isArray(entry) || entry.length != 2) {
        throw new Error("Response objects produced by the fetch function given to FetchHttpClient do not have an iterable headers map. Response#headers should be an iterable object.");
      }
      headersObj[entry[0]] = entry[1];
    }
    return headersObj;
  }
};
__name(FetchHttpClientResponse, "FetchHttpClientResponse");

// node_modules/stripe/esm/crypto/SubtleCryptoProvider.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();

// node_modules/stripe/esm/crypto/CryptoProvider.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var CryptoProvider = class {
  /**
   * Computes a SHA-256 HMAC given a secret and a payload (encoded in UTF-8).
   * The output HMAC should be encoded in hexadecimal.
   *
   * Sample values for implementations:
   * - computeHMACSignature('', 'test_secret') => 'f7f9bd47fb987337b5796fdc1fdb9ba221d0d5396814bfcaf9521f43fd8927fd'
   * - computeHMACSignature('\ud83d\ude00', 'test_secret') => '837da296d05c4fe31f61d5d7ead035099d9585a5bcde87de952012a78f0b0c43
   */
  computeHMACSignature(payload, secret) {
    throw new Error("computeHMACSignature not implemented.");
  }
  /**
   * Asynchronous version of `computeHMACSignature`. Some implementations may
   * only allow support async signature computation.
   *
   * Computes a SHA-256 HMAC given a secret and a payload (encoded in UTF-8).
   * The output HMAC should be encoded in hexadecimal.
   *
   * Sample values for implementations:
   * - computeHMACSignature('', 'test_secret') => 'f7f9bd47fb987337b5796fdc1fdb9ba221d0d5396814bfcaf9521f43fd8927fd'
   * - computeHMACSignature('\ud83d\ude00', 'test_secret') => '837da296d05c4fe31f61d5d7ead035099d9585a5bcde87de952012a78f0b0c43
   */
  computeHMACSignatureAsync(payload, secret) {
    throw new Error("computeHMACSignatureAsync not implemented.");
  }
  /**
   * Computes a SHA-256 hash of the data.
   */
  computeSHA256Async(data) {
    throw new Error("computeSHA256 not implemented.");
  }
};
__name(CryptoProvider, "CryptoProvider");
var CryptoProviderOnlySupportsAsyncError = class extends Error {
};
__name(CryptoProviderOnlySupportsAsyncError, "CryptoProviderOnlySupportsAsyncError");

// node_modules/stripe/esm/crypto/SubtleCryptoProvider.js
var SubtleCryptoProvider = class extends CryptoProvider {
  constructor(subtleCrypto) {
    super();
    this.subtleCrypto = subtleCrypto || crypto.subtle;
  }
  /** @override */
  computeHMACSignature(payload, secret) {
    throw new CryptoProviderOnlySupportsAsyncError("SubtleCryptoProvider cannot be used in a synchronous context.");
  }
  /** @override */
  async computeHMACSignatureAsync(payload, secret) {
    const encoder = new TextEncoder();
    const key = await this.subtleCrypto.importKey("raw", encoder.encode(secret), {
      name: "HMAC",
      hash: { name: "SHA-256" }
    }, false, ["sign"]);
    const signatureBuffer = await this.subtleCrypto.sign("hmac", key, encoder.encode(payload));
    const signatureBytes = new Uint8Array(signatureBuffer);
    const signatureHexCodes = new Array(signatureBytes.length);
    for (let i = 0; i < signatureBytes.length; i++) {
      signatureHexCodes[i] = byteHexMapping[signatureBytes[i]];
    }
    return signatureHexCodes.join("");
  }
  /** @override */
  async computeSHA256Async(data) {
    return new Uint8Array(await this.subtleCrypto.digest("SHA-256", data));
  }
};
__name(SubtleCryptoProvider, "SubtleCryptoProvider");
var byteHexMapping = new Array(256);
for (let i = 0; i < byteHexMapping.length; i++) {
  byteHexMapping[i] = i.toString(16).padStart(2, "0");
}

// node_modules/stripe/esm/platform/PlatformFunctions.js
var PlatformFunctions = class {
  constructor() {
    this._fetchFn = null;
    this._agent = null;
  }
  /**
   * Gets uname with Node's built-in `exec` function, if available.
   */
  getUname() {
    throw new Error("getUname not implemented.");
  }
  /**
   * Generates a v4 UUID. See https://stackoverflow.com/a/2117523
   */
  uuid4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === "x" ? r : r & 3 | 8;
      return v.toString(16);
    });
  }
  /**
   * Compares strings in constant time.
   */
  secureCompare(a, b) {
    if (a.length !== b.length) {
      return false;
    }
    const len = a.length;
    let result = 0;
    for (let i = 0; i < len; ++i) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return result === 0;
  }
  /**
   * Creates an event emitter.
   */
  createEmitter() {
    throw new Error("createEmitter not implemented.");
  }
  /**
   * Checks if the request data is a stream. If so, read the entire stream
   * to a buffer and return the buffer.
   */
  tryBufferData(data) {
    throw new Error("tryBufferData not implemented.");
  }
  /**
   * Creates an HTTP client which uses the Node `http` and `https` packages
   * to issue requests.
   */
  createNodeHttpClient(agent) {
    throw new Error("createNodeHttpClient not implemented.");
  }
  /**
   * Creates an HTTP client for issuing Stripe API requests which uses the Web
   * Fetch API.
   *
   * A fetch function can optionally be passed in as a parameter. If none is
   * passed, will default to the default `fetch` function in the global scope.
   */
  createFetchHttpClient(fetchFn) {
    return new FetchHttpClient(fetchFn);
  }
  /**
   * Creates an HTTP client using runtime-specific APIs.
   */
  createDefaultHttpClient() {
    throw new Error("createDefaultHttpClient not implemented.");
  }
  /**
   * Creates a CryptoProvider which uses the Node `crypto` package for its computations.
   */
  createNodeCryptoProvider() {
    throw new Error("createNodeCryptoProvider not implemented.");
  }
  /**
   * Creates a CryptoProvider which uses the SubtleCrypto interface of the Web Crypto API.
   */
  createSubtleCryptoProvider(subtleCrypto) {
    return new SubtleCryptoProvider(subtleCrypto);
  }
  createDefaultCryptoProvider() {
    throw new Error("createDefaultCryptoProvider not implemented.");
  }
};
__name(PlatformFunctions, "PlatformFunctions");

// node_modules/stripe/esm/StripeEmitter.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var _StripeEvent = class extends Event {
  constructor(eventName, data) {
    super(eventName);
    this.data = data;
  }
};
__name(_StripeEvent, "_StripeEvent");
var StripeEmitter = class {
  constructor() {
    this.eventTarget = new EventTarget();
    this.listenerMapping = /* @__PURE__ */ new Map();
  }
  on(eventName, listener) {
    const listenerWrapper = /* @__PURE__ */ __name((event) => {
      listener(event.data);
    }, "listenerWrapper");
    this.listenerMapping.set(listener, listenerWrapper);
    return this.eventTarget.addEventListener(eventName, listenerWrapper);
  }
  removeListener(eventName, listener) {
    const listenerWrapper = this.listenerMapping.get(listener);
    this.listenerMapping.delete(listener);
    return this.eventTarget.removeEventListener(eventName, listenerWrapper);
  }
  once(eventName, listener) {
    const listenerWrapper = /* @__PURE__ */ __name((event) => {
      listener(event.data);
    }, "listenerWrapper");
    this.listenerMapping.set(listener, listenerWrapper);
    return this.eventTarget.addEventListener(eventName, listenerWrapper, {
      once: true
    });
  }
  emit(eventName, data) {
    return this.eventTarget.dispatchEvent(new _StripeEvent(eventName, data));
  }
};
__name(StripeEmitter, "StripeEmitter");

// node_modules/stripe/esm/platform/WebPlatformFunctions.js
var WebPlatformFunctions = class extends PlatformFunctions {
  /** @override */
  getUname() {
    return Promise.resolve(null);
  }
  /** @override */
  createEmitter() {
    return new StripeEmitter();
  }
  /** @override */
  tryBufferData(data) {
    if (data.file.data instanceof ReadableStream) {
      throw new Error("Uploading a file as a stream is not supported in non-Node environments. Please open or upvote an issue at github.com/stripe/stripe-node if you use this, detailing your use-case.");
    }
    return Promise.resolve(data);
  }
  /** @override */
  createNodeHttpClient() {
    throw new Error("Stripe: `createNodeHttpClient()` is not available in non-Node environments. Please use `createFetchHttpClient()` instead.");
  }
  /** @override */
  createDefaultHttpClient() {
    return super.createFetchHttpClient();
  }
  /** @override */
  createNodeCryptoProvider() {
    throw new Error("Stripe: `createNodeCryptoProvider()` is not available in non-Node environments. Please use `createSubtleCryptoProvider()` instead.");
  }
  /** @override */
  createDefaultCryptoProvider() {
    return this.createSubtleCryptoProvider();
  }
};
__name(WebPlatformFunctions, "WebPlatformFunctions");

// node_modules/stripe/esm/stripe.core.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();

// node_modules/stripe/esm/Error.js
var Error_exports = {};
__export(Error_exports, {
  StripeAPIError: () => StripeAPIError,
  StripeAuthenticationError: () => StripeAuthenticationError,
  StripeCardError: () => StripeCardError,
  StripeConnectionError: () => StripeConnectionError,
  StripeError: () => StripeError,
  StripeIdempotencyError: () => StripeIdempotencyError,
  StripeInvalidGrantError: () => StripeInvalidGrantError,
  StripeInvalidRequestError: () => StripeInvalidRequestError,
  StripePermissionError: () => StripePermissionError,
  StripeRateLimitError: () => StripeRateLimitError,
  StripeSignatureVerificationError: () => StripeSignatureVerificationError,
  StripeUnknownError: () => StripeUnknownError,
  TemporarySessionExpiredError: () => TemporarySessionExpiredError,
  generateV1Error: () => generateV1Error,
  generateV2Error: () => generateV2Error
});
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var generateV1Error = /* @__PURE__ */ __name((rawStripeError) => {
  switch (rawStripeError.type) {
    case "card_error":
      return new StripeCardError(rawStripeError);
    case "invalid_request_error":
      return new StripeInvalidRequestError(rawStripeError);
    case "api_error":
      return new StripeAPIError(rawStripeError);
    case "authentication_error":
      return new StripeAuthenticationError(rawStripeError);
    case "rate_limit_error":
      return new StripeRateLimitError(rawStripeError);
    case "idempotency_error":
      return new StripeIdempotencyError(rawStripeError);
    case "invalid_grant":
      return new StripeInvalidGrantError(rawStripeError);
    default:
      return new StripeUnknownError(rawStripeError);
  }
}, "generateV1Error");
var generateV2Error = /* @__PURE__ */ __name((rawStripeError) => {
  switch (rawStripeError.type) {
    case "temporary_session_expired":
      return new TemporarySessionExpiredError(rawStripeError);
  }
  switch (rawStripeError.code) {
    case "invalid_fields":
      return new StripeInvalidRequestError(rawStripeError);
  }
  return generateV1Error(rawStripeError);
}, "generateV2Error");
var StripeError = class extends Error {
  constructor(raw = {}, type = null) {
    var _a;
    super(raw.message);
    this.type = type || this.constructor.name;
    this.raw = raw;
    this.rawType = raw.type;
    this.code = raw.code;
    this.doc_url = raw.doc_url;
    this.param = raw.param;
    this.detail = raw.detail;
    this.headers = raw.headers;
    this.requestId = raw.requestId;
    this.statusCode = raw.statusCode;
    this.message = (_a = raw.message) !== null && _a !== void 0 ? _a : "";
    this.userMessage = raw.user_message;
    this.charge = raw.charge;
    this.decline_code = raw.decline_code;
    this.payment_intent = raw.payment_intent;
    this.payment_method = raw.payment_method;
    this.payment_method_type = raw.payment_method_type;
    this.setup_intent = raw.setup_intent;
    this.source = raw.source;
  }
};
__name(StripeError, "StripeError");
StripeError.generate = generateV1Error;
var StripeCardError = class extends StripeError {
  constructor(raw = {}) {
    super(raw, "StripeCardError");
  }
};
__name(StripeCardError, "StripeCardError");
var StripeInvalidRequestError = class extends StripeError {
  constructor(raw = {}) {
    super(raw, "StripeInvalidRequestError");
  }
};
__name(StripeInvalidRequestError, "StripeInvalidRequestError");
var StripeAPIError = class extends StripeError {
  constructor(raw = {}) {
    super(raw, "StripeAPIError");
  }
};
__name(StripeAPIError, "StripeAPIError");
var StripeAuthenticationError = class extends StripeError {
  constructor(raw = {}) {
    super(raw, "StripeAuthenticationError");
  }
};
__name(StripeAuthenticationError, "StripeAuthenticationError");
var StripePermissionError = class extends StripeError {
  constructor(raw = {}) {
    super(raw, "StripePermissionError");
  }
};
__name(StripePermissionError, "StripePermissionError");
var StripeRateLimitError = class extends StripeError {
  constructor(raw = {}) {
    super(raw, "StripeRateLimitError");
  }
};
__name(StripeRateLimitError, "StripeRateLimitError");
var StripeConnectionError = class extends StripeError {
  constructor(raw = {}) {
    super(raw, "StripeConnectionError");
  }
};
__name(StripeConnectionError, "StripeConnectionError");
var StripeSignatureVerificationError = class extends StripeError {
  constructor(header, payload, raw = {}) {
    super(raw, "StripeSignatureVerificationError");
    this.header = header;
    this.payload = payload;
  }
};
__name(StripeSignatureVerificationError, "StripeSignatureVerificationError");
var StripeIdempotencyError = class extends StripeError {
  constructor(raw = {}) {
    super(raw, "StripeIdempotencyError");
  }
};
__name(StripeIdempotencyError, "StripeIdempotencyError");
var StripeInvalidGrantError = class extends StripeError {
  constructor(raw = {}) {
    super(raw, "StripeInvalidGrantError");
  }
};
__name(StripeInvalidGrantError, "StripeInvalidGrantError");
var StripeUnknownError = class extends StripeError {
  constructor(raw = {}) {
    super(raw, "StripeUnknownError");
  }
};
__name(StripeUnknownError, "StripeUnknownError");
var TemporarySessionExpiredError = class extends StripeError {
  constructor(rawStripeError = {}) {
    super(rawStripeError, "TemporarySessionExpiredError");
  }
};
__name(TemporarySessionExpiredError, "TemporarySessionExpiredError");

// node_modules/stripe/esm/RequestSender.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var MAX_RETRY_AFTER_WAIT = 60;
var RequestSender = class {
  constructor(stripe2, maxBufferedRequestMetric) {
    this._stripe = stripe2;
    this._maxBufferedRequestMetric = maxBufferedRequestMetric;
  }
  _normalizeStripeContext(optsContext, clientContext) {
    if (optsContext) {
      return optsContext.toString() || null;
    }
    return (clientContext === null || clientContext === void 0 ? void 0 : clientContext.toString()) || null;
  }
  _addHeadersDirectlyToObject(obj, headers) {
    obj.requestId = headers["request-id"];
    obj.stripeAccount = obj.stripeAccount || headers["stripe-account"];
    obj.apiVersion = obj.apiVersion || headers["stripe-version"];
    obj.idempotencyKey = obj.idempotencyKey || headers["idempotency-key"];
  }
  _makeResponseEvent(requestEvent, statusCode, headers) {
    const requestEndTime = Date.now();
    const requestDurationMs = requestEndTime - requestEvent.request_start_time;
    return removeNullish({
      api_version: headers["stripe-version"],
      account: headers["stripe-account"],
      idempotency_key: headers["idempotency-key"],
      method: requestEvent.method,
      path: requestEvent.path,
      status: statusCode,
      request_id: this._getRequestId(headers),
      elapsed: requestDurationMs,
      request_start_time: requestEvent.request_start_time,
      request_end_time: requestEndTime
    });
  }
  _getRequestId(headers) {
    return headers["request-id"];
  }
  /**
   * Used by methods with spec.streaming === true. For these methods, we do not
   * buffer successful responses into memory or do parse them into stripe
   * objects, we delegate that all of that to the user and pass back the raw
   * http.Response object to the callback.
   *
   * (Unsuccessful responses shouldn't make it here, they should
   * still be buffered/parsed and handled by _jsonResponseHandler -- see
   * makeRequest)
   */
  _streamingResponseHandler(requestEvent, usage, callback) {
    return (res) => {
      const headers = res.getHeaders();
      const streamCompleteCallback = /* @__PURE__ */ __name(() => {
        const responseEvent = this._makeResponseEvent(requestEvent, res.getStatusCode(), headers);
        this._stripe._emitter.emit("response", responseEvent);
        this._recordRequestMetrics(this._getRequestId(headers), responseEvent.elapsed, usage);
      }, "streamCompleteCallback");
      const stream = res.toStream(streamCompleteCallback);
      this._addHeadersDirectlyToObject(stream, headers);
      return callback(null, stream);
    };
  }
  /**
   * Default handler for Stripe responses. Buffers the response into memory,
   * parses the JSON and returns it (i.e. passes it to the callback) if there
   * is no "error" field. Otherwise constructs/passes an appropriate Error.
   */
  _jsonResponseHandler(requestEvent, apiMode, usage, callback) {
    return (res) => {
      const headers = res.getHeaders();
      const requestId = this._getRequestId(headers);
      const statusCode = res.getStatusCode();
      const responseEvent = this._makeResponseEvent(requestEvent, statusCode, headers);
      this._stripe._emitter.emit("response", responseEvent);
      res.toJSON().then((jsonResponse) => {
        if (jsonResponse.error) {
          let err;
          if (typeof jsonResponse.error === "string") {
            jsonResponse.error = {
              type: jsonResponse.error,
              message: jsonResponse.error_description
            };
          }
          jsonResponse.error.headers = headers;
          jsonResponse.error.statusCode = statusCode;
          jsonResponse.error.requestId = requestId;
          if (statusCode === 401) {
            err = new StripeAuthenticationError(jsonResponse.error);
          } else if (statusCode === 403) {
            err = new StripePermissionError(jsonResponse.error);
          } else if (statusCode === 429) {
            err = new StripeRateLimitError(jsonResponse.error);
          } else if (apiMode === "v2") {
            err = generateV2Error(jsonResponse.error);
          } else {
            err = generateV1Error(jsonResponse.error);
          }
          throw err;
        }
        return jsonResponse;
      }, (e) => {
        throw new StripeAPIError({
          message: "Invalid JSON received from the Stripe API",
          exception: e,
          requestId: headers["request-id"]
        });
      }).then((jsonResponse) => {
        this._recordRequestMetrics(requestId, responseEvent.elapsed, usage);
        const rawResponse = res.getRawResponse();
        this._addHeadersDirectlyToObject(rawResponse, headers);
        Object.defineProperty(jsonResponse, "lastResponse", {
          enumerable: false,
          writable: false,
          value: rawResponse
        });
        callback(null, jsonResponse);
      }, (e) => callback(e, null));
    };
  }
  static _generateConnectionErrorMessage(requestRetries) {
    return `An error occurred with our connection to Stripe.${requestRetries > 0 ? ` Request was retried ${requestRetries} times.` : ""}`;
  }
  // For more on when and how to retry API requests, see https://stripe.com/docs/error-handling#safely-retrying-requests-with-idempotency
  static _shouldRetry(res, numRetries, maxRetries, error) {
    if (error && numRetries === 0 && HttpClient.CONNECTION_CLOSED_ERROR_CODES.includes(error.code)) {
      return true;
    }
    if (numRetries >= maxRetries) {
      return false;
    }
    if (!res) {
      return true;
    }
    if (res.getHeaders()["stripe-should-retry"] === "false") {
      return false;
    }
    if (res.getHeaders()["stripe-should-retry"] === "true") {
      return true;
    }
    if (res.getStatusCode() === 409) {
      return true;
    }
    if (res.getStatusCode() >= 500) {
      return true;
    }
    return false;
  }
  _getSleepTimeInMS(numRetries, retryAfter = null) {
    const initialNetworkRetryDelay = this._stripe.getInitialNetworkRetryDelay();
    const maxNetworkRetryDelay = this._stripe.getMaxNetworkRetryDelay();
    let sleepSeconds = Math.min(initialNetworkRetryDelay * Math.pow(2, numRetries - 1), maxNetworkRetryDelay);
    sleepSeconds *= 0.5 * (1 + Math.random());
    sleepSeconds = Math.max(initialNetworkRetryDelay, sleepSeconds);
    if (Number.isInteger(retryAfter) && retryAfter <= MAX_RETRY_AFTER_WAIT) {
      sleepSeconds = Math.max(sleepSeconds, retryAfter);
    }
    return sleepSeconds * 1e3;
  }
  // Max retries can be set on a per request basis. Favor those over the global setting
  _getMaxNetworkRetries(settings = {}) {
    return settings.maxNetworkRetries !== void 0 && Number.isInteger(settings.maxNetworkRetries) ? settings.maxNetworkRetries : this._stripe.getMaxNetworkRetries();
  }
  _defaultIdempotencyKey(method, settings, apiMode) {
    const maxRetries = this._getMaxNetworkRetries(settings);
    const genKey = /* @__PURE__ */ __name(() => `stripe-node-retry-${this._stripe._platformFunctions.uuid4()}`, "genKey");
    if (apiMode === "v2") {
      if (method === "POST" || method === "DELETE") {
        return genKey();
      }
    } else if (apiMode === "v1") {
      if (method === "POST" && maxRetries > 0) {
        return genKey();
      }
    }
    return null;
  }
  _makeHeaders({ contentType, contentLength, apiVersion, clientUserAgent, method, userSuppliedHeaders, userSuppliedSettings, stripeAccount, stripeContext, apiMode }) {
    const defaultHeaders = {
      Accept: "application/json",
      "Content-Type": contentType,
      "User-Agent": this._getUserAgentString(apiMode),
      "X-Stripe-Client-User-Agent": clientUserAgent,
      "X-Stripe-Client-Telemetry": this._getTelemetryHeader(),
      "Stripe-Version": apiVersion,
      "Stripe-Account": stripeAccount,
      "Stripe-Context": stripeContext,
      "Idempotency-Key": this._defaultIdempotencyKey(method, userSuppliedSettings, apiMode)
    };
    const methodHasPayload = method == "POST" || method == "PUT" || method == "PATCH";
    if (methodHasPayload || contentLength) {
      if (!methodHasPayload) {
        emitWarning(`${method} method had non-zero contentLength but no payload is expected for this verb`);
      }
      defaultHeaders["Content-Length"] = contentLength;
    }
    return Object.assign(
      removeNullish(defaultHeaders),
      // If the user supplied, say 'idempotency-key', override instead of appending by ensuring caps are the same.
      normalizeHeaders(userSuppliedHeaders)
    );
  }
  _getUserAgentString(apiMode) {
    const packageVersion = this._stripe.getConstant("PACKAGE_VERSION");
    const appInfo = this._stripe._appInfo ? this._stripe.getAppInfoAsString() : "";
    return `Stripe/${apiMode} NodeBindings/${packageVersion} ${appInfo}`.trim();
  }
  _getTelemetryHeader() {
    if (this._stripe.getTelemetryEnabled() && this._stripe._prevRequestMetrics.length > 0) {
      const metrics = this._stripe._prevRequestMetrics.shift();
      return JSON.stringify({
        last_request_metrics: metrics
      });
    }
  }
  _recordRequestMetrics(requestId, requestDurationMs, usage) {
    if (this._stripe.getTelemetryEnabled() && requestId) {
      if (this._stripe._prevRequestMetrics.length > this._maxBufferedRequestMetric) {
        emitWarning("Request metrics buffer is full, dropping telemetry message.");
      } else {
        const m = {
          request_id: requestId,
          request_duration_ms: requestDurationMs
        };
        if (usage && usage.length > 0) {
          m.usage = usage;
        }
        this._stripe._prevRequestMetrics.push(m);
      }
    }
  }
  _rawRequest(method, path, params, options, usage) {
    const requestPromise = new Promise((resolve, reject) => {
      let opts;
      try {
        const requestMethod = method.toUpperCase();
        if (requestMethod !== "POST" && params && Object.keys(params).length !== 0) {
          throw new Error("rawRequest only supports params on POST requests. Please pass null and add your parameters to path.");
        }
        const args = [].slice.call([params, options]);
        const dataFromArgs = getDataFromArgs(args);
        const data = requestMethod === "POST" ? Object.assign({}, dataFromArgs) : null;
        const calculatedOptions = getOptionsFromArgs(args);
        const headers2 = calculatedOptions.headers;
        const authenticator2 = calculatedOptions.authenticator;
        opts = {
          requestMethod,
          requestPath: path,
          bodyData: data,
          queryData: {},
          authenticator: authenticator2,
          headers: headers2,
          host: calculatedOptions.host,
          streaming: !!calculatedOptions.streaming,
          settings: {},
          // We use this for thin event internals, so we should record the more specific `usage`, when available
          usage: usage || ["raw_request"]
        };
      } catch (err) {
        reject(err);
        return;
      }
      function requestCallback(err, response) {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      }
      __name(requestCallback, "requestCallback");
      const { headers, settings } = opts;
      const authenticator = opts.authenticator;
      this._request(opts.requestMethod, opts.host, path, opts.bodyData, authenticator, { headers, settings, streaming: opts.streaming }, opts.usage, requestCallback);
    });
    return requestPromise;
  }
  _getContentLength(data) {
    return typeof data === "string" ? new TextEncoder().encode(data).length : data.length;
  }
  _request(method, host, path, data, authenticator, options, usage = [], callback, requestDataProcessor = null) {
    var _a;
    let requestData;
    authenticator = (_a = authenticator !== null && authenticator !== void 0 ? authenticator : this._stripe._authenticator) !== null && _a !== void 0 ? _a : null;
    const apiMode = getAPIMode(path);
    const retryRequest = /* @__PURE__ */ __name((requestFn, apiVersion, headers, requestRetries, retryAfter) => {
      return setTimeout(requestFn, this._getSleepTimeInMS(requestRetries, retryAfter), apiVersion, headers, requestRetries + 1);
    }, "retryRequest");
    const makeRequest = /* @__PURE__ */ __name((apiVersion, headers, numRetries) => {
      const timeout = options.settings && options.settings.timeout && Number.isInteger(options.settings.timeout) && options.settings.timeout >= 0 ? options.settings.timeout : this._stripe.getApiField("timeout");
      const request = {
        host: host || this._stripe.getApiField("host"),
        port: this._stripe.getApiField("port"),
        path,
        method,
        headers: Object.assign({}, headers),
        body: requestData,
        protocol: this._stripe.getApiField("protocol")
      };
      authenticator(request).then(() => {
        const req = this._stripe.getApiField("httpClient").makeRequest(request.host, request.port, request.path, request.method, request.headers, request.body, request.protocol, timeout);
        const requestStartTime = Date.now();
        const requestEvent = removeNullish({
          api_version: apiVersion,
          account: parseHttpHeaderAsString(headers["Stripe-Account"]),
          idempotency_key: parseHttpHeaderAsString(headers["Idempotency-Key"]),
          method,
          path,
          request_start_time: requestStartTime
        });
        const requestRetries = numRetries || 0;
        const maxRetries = this._getMaxNetworkRetries(options.settings || {});
        this._stripe._emitter.emit("request", requestEvent);
        req.then((res) => {
          if (RequestSender._shouldRetry(res, requestRetries, maxRetries)) {
            return retryRequest(makeRequest, apiVersion, headers, requestRetries, parseHttpHeaderAsNumber(res.getHeaders()["retry-after"]));
          } else if (options.streaming && res.getStatusCode() < 400) {
            return this._streamingResponseHandler(requestEvent, usage, callback)(res);
          } else {
            return this._jsonResponseHandler(requestEvent, apiMode, usage, callback)(res);
          }
        }).catch((error) => {
          if (RequestSender._shouldRetry(null, requestRetries, maxRetries, error)) {
            return retryRequest(makeRequest, apiVersion, headers, requestRetries, null);
          } else {
            const isTimeoutError = error.code && error.code === HttpClient.TIMEOUT_ERROR_CODE;
            return callback(new StripeConnectionError({
              message: isTimeoutError ? `Request aborted due to timeout being reached (${timeout}ms)` : RequestSender._generateConnectionErrorMessage(requestRetries),
              detail: error
            }));
          }
        });
      }).catch((e) => {
        throw new StripeError({
          message: "Unable to authenticate the request",
          exception: e
        });
      });
    }, "makeRequest");
    const prepareAndMakeRequest = /* @__PURE__ */ __name((error, data2) => {
      if (error) {
        return callback(error);
      }
      requestData = data2;
      this._stripe.getClientUserAgent((clientUserAgent) => {
        var _a2, _b, _c;
        const apiVersion = this._stripe.getApiField("version");
        const headers = this._makeHeaders({
          contentType: apiMode == "v2" ? "application/json" : "application/x-www-form-urlencoded",
          contentLength: this._getContentLength(data2),
          apiVersion,
          clientUserAgent,
          method,
          // other callers expect null, but .headers being optional means it's undefined if not supplied. So we normalize to null.
          userSuppliedHeaders: (_a2 = options.headers) !== null && _a2 !== void 0 ? _a2 : null,
          userSuppliedSettings: (_b = options.settings) !== null && _b !== void 0 ? _b : {},
          stripeAccount: (_c = options.stripeAccount) !== null && _c !== void 0 ? _c : this._stripe.getApiField("stripeAccount"),
          stripeContext: this._normalizeStripeContext(options.stripeContext, this._stripe.getApiField("stripeContext")),
          apiMode
        });
        makeRequest(apiVersion, headers, 0);
      });
    }, "prepareAndMakeRequest");
    if (requestDataProcessor) {
      requestDataProcessor(method, data, options.headers, prepareAndMakeRequest);
    } else {
      let stringifiedData;
      if (apiMode == "v2") {
        stringifiedData = data ? jsonStringifyRequestData(data) : "";
      } else {
        stringifiedData = queryStringifyRequestData(data || {});
      }
      prepareAndMakeRequest(null, stringifiedData);
    }
  }
};
__name(RequestSender, "RequestSender");

// node_modules/stripe/esm/StripeResource.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();

// node_modules/stripe/esm/StripeMethod.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();

// node_modules/stripe/esm/autoPagination.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var V1Iterator = class {
  constructor(firstPagePromise, requestArgs, spec, stripeResource) {
    this.index = 0;
    this.pagePromise = firstPagePromise;
    this.promiseCache = { currentPromise: null };
    this.requestArgs = requestArgs;
    this.spec = spec;
    this.stripeResource = stripeResource;
  }
  async iterate(pageResult) {
    if (!(pageResult && pageResult.data && typeof pageResult.data.length === "number")) {
      throw Error("Unexpected: Stripe API response does not have a well-formed `data` array.");
    }
    const reverseIteration = isReverseIteration(this.requestArgs);
    if (this.index < pageResult.data.length) {
      const idx = reverseIteration ? pageResult.data.length - 1 - this.index : this.index;
      const value = pageResult.data[idx];
      this.index += 1;
      return { value, done: false };
    } else if (pageResult.has_more) {
      this.index = 0;
      this.pagePromise = this.getNextPage(pageResult);
      const nextPageResult = await this.pagePromise;
      return this.iterate(nextPageResult);
    }
    return { done: true, value: void 0 };
  }
  /** @abstract */
  getNextPage(_pageResult) {
    throw new Error("Unimplemented");
  }
  async _next() {
    return this.iterate(await this.pagePromise);
  }
  next() {
    if (this.promiseCache.currentPromise) {
      return this.promiseCache.currentPromise;
    }
    const nextPromise = (async () => {
      const ret = await this._next();
      this.promiseCache.currentPromise = null;
      return ret;
    })();
    this.promiseCache.currentPromise = nextPromise;
    return nextPromise;
  }
};
__name(V1Iterator, "V1Iterator");
var V1ListIterator = class extends V1Iterator {
  getNextPage(pageResult) {
    const reverseIteration = isReverseIteration(this.requestArgs);
    const lastId = getLastId(pageResult, reverseIteration);
    return this.stripeResource._makeRequest(this.requestArgs, this.spec, {
      [reverseIteration ? "ending_before" : "starting_after"]: lastId
    });
  }
};
__name(V1ListIterator, "V1ListIterator");
var V1SearchIterator = class extends V1Iterator {
  getNextPage(pageResult) {
    if (!pageResult.next_page) {
      throw Error("Unexpected: Stripe API response does not have a well-formed `next_page` field, but `has_more` was true.");
    }
    return this.stripeResource._makeRequest(this.requestArgs, this.spec, {
      page: pageResult.next_page
    });
  }
};
__name(V1SearchIterator, "V1SearchIterator");
var V2ListIterator = class {
  constructor(firstPagePromise, requestArgs, spec, stripeResource) {
    this.currentPageIterator = (async () => {
      const page = await firstPagePromise;
      return page.data[Symbol.iterator]();
    })();
    this.nextPageUrl = (async () => {
      const page = await firstPagePromise;
      return page.next_page_url || null;
    })();
    this.requestArgs = requestArgs;
    this.spec = spec;
    this.stripeResource = stripeResource;
  }
  async turnPage() {
    const nextPageUrl = await this.nextPageUrl;
    if (!nextPageUrl)
      return null;
    this.spec.fullPath = nextPageUrl;
    const page = await this.stripeResource._makeRequest([], this.spec, {});
    this.nextPageUrl = Promise.resolve(page.next_page_url);
    this.currentPageIterator = Promise.resolve(page.data[Symbol.iterator]());
    return this.currentPageIterator;
  }
  async next() {
    {
      const result2 = (await this.currentPageIterator).next();
      if (!result2.done)
        return { done: false, value: result2.value };
    }
    const nextPageIterator = await this.turnPage();
    if (!nextPageIterator) {
      return { done: true, value: void 0 };
    }
    const result = nextPageIterator.next();
    if (!result.done)
      return { done: false, value: result.value };
    return { done: true, value: void 0 };
  }
};
__name(V2ListIterator, "V2ListIterator");
var makeAutoPaginationMethods = /* @__PURE__ */ __name((stripeResource, requestArgs, spec, firstPagePromise) => {
  const apiMode = getAPIMode(spec.fullPath || spec.path);
  if (apiMode !== "v2" && spec.methodType === "search") {
    return makeAutoPaginationMethodsFromIterator(new V1SearchIterator(firstPagePromise, requestArgs, spec, stripeResource));
  }
  if (apiMode !== "v2" && spec.methodType === "list") {
    return makeAutoPaginationMethodsFromIterator(new V1ListIterator(firstPagePromise, requestArgs, spec, stripeResource));
  }
  if (apiMode === "v2" && spec.methodType === "list") {
    return makeAutoPaginationMethodsFromIterator(new V2ListIterator(firstPagePromise, requestArgs, spec, stripeResource));
  }
  return null;
}, "makeAutoPaginationMethods");
var makeAutoPaginationMethodsFromIterator = /* @__PURE__ */ __name((iterator) => {
  const autoPagingEach = makeAutoPagingEach((...args) => iterator.next(...args));
  const autoPagingToArray = makeAutoPagingToArray(autoPagingEach);
  const autoPaginationMethods = {
    autoPagingEach,
    autoPagingToArray,
    // Async iterator functions:
    next: () => iterator.next(),
    return: () => {
      return {};
    },
    [getAsyncIteratorSymbol()]: () => {
      return autoPaginationMethods;
    }
  };
  return autoPaginationMethods;
}, "makeAutoPaginationMethodsFromIterator");
function getAsyncIteratorSymbol() {
  if (typeof Symbol !== "undefined" && Symbol.asyncIterator) {
    return Symbol.asyncIterator;
  }
  return "@@asyncIterator";
}
__name(getAsyncIteratorSymbol, "getAsyncIteratorSymbol");
function getDoneCallback(args) {
  if (args.length < 2) {
    return null;
  }
  const onDone = args[1];
  if (typeof onDone !== "function") {
    throw Error(`The second argument to autoPagingEach, if present, must be a callback function; received ${typeof onDone}`);
  }
  return onDone;
}
__name(getDoneCallback, "getDoneCallback");
function getItemCallback(args) {
  if (args.length === 0) {
    return void 0;
  }
  const onItem = args[0];
  if (typeof onItem !== "function") {
    throw Error(`The first argument to autoPagingEach, if present, must be a callback function; received ${typeof onItem}`);
  }
  if (onItem.length === 2) {
    return onItem;
  }
  if (onItem.length > 2) {
    throw Error(`The \`onItem\` callback function passed to autoPagingEach must accept at most two arguments; got ${onItem}`);
  }
  return /* @__PURE__ */ __name(function _onItem(item, next) {
    const shouldContinue = onItem(item);
    next(shouldContinue);
  }, "_onItem");
}
__name(getItemCallback, "getItemCallback");
function getLastId(listResult, reverseIteration) {
  const lastIdx = reverseIteration ? 0 : listResult.data.length - 1;
  const lastItem = listResult.data[lastIdx];
  const lastId = lastItem && lastItem.id;
  if (!lastId) {
    throw Error("Unexpected: No `id` found on the last item while auto-paging a list.");
  }
  return lastId;
}
__name(getLastId, "getLastId");
function makeAutoPagingEach(asyncIteratorNext) {
  return /* @__PURE__ */ __name(function autoPagingEach() {
    const args = [].slice.call(arguments);
    const onItem = getItemCallback(args);
    const onDone = getDoneCallback(args);
    if (args.length > 2) {
      throw Error(`autoPagingEach takes up to two arguments; received ${args}`);
    }
    const autoPagePromise = wrapAsyncIteratorWithCallback(
      asyncIteratorNext,
      // @ts-ignore we might need a null check
      onItem
    );
    return callbackifyPromiseWithTimeout(autoPagePromise, onDone);
  }, "autoPagingEach");
}
__name(makeAutoPagingEach, "makeAutoPagingEach");
function makeAutoPagingToArray(autoPagingEach) {
  return /* @__PURE__ */ __name(function autoPagingToArray(opts, onDone) {
    const limit = opts && opts.limit;
    if (!limit) {
      throw Error("You must pass a `limit` option to autoPagingToArray, e.g., `autoPagingToArray({limit: 1000});`.");
    }
    if (limit > 1e4) {
      throw Error("You cannot specify a limit of more than 10,000 items to fetch in `autoPagingToArray`; use `autoPagingEach` to iterate through longer lists.");
    }
    const promise = new Promise((resolve, reject) => {
      const items = [];
      autoPagingEach((item) => {
        items.push(item);
        if (items.length >= limit) {
          return false;
        }
      }).then(() => {
        resolve(items);
      }).catch(reject);
    });
    return callbackifyPromiseWithTimeout(promise, onDone);
  }, "autoPagingToArray");
}
__name(makeAutoPagingToArray, "makeAutoPagingToArray");
function wrapAsyncIteratorWithCallback(asyncIteratorNext, onItem) {
  return new Promise((resolve, reject) => {
    function handleIteration(iterResult) {
      if (iterResult.done) {
        resolve();
        return;
      }
      const item = iterResult.value;
      return new Promise((next) => {
        onItem(item, next);
      }).then((shouldContinue) => {
        if (shouldContinue === false) {
          return handleIteration({ done: true, value: void 0 });
        } else {
          return asyncIteratorNext().then(handleIteration);
        }
      });
    }
    __name(handleIteration, "handleIteration");
    asyncIteratorNext().then(handleIteration).catch(reject);
  });
}
__name(wrapAsyncIteratorWithCallback, "wrapAsyncIteratorWithCallback");
function isReverseIteration(requestArgs) {
  const args = [].slice.call(requestArgs);
  const dataFromArgs = getDataFromArgs(args);
  return !!dataFromArgs.ending_before;
}
__name(isReverseIteration, "isReverseIteration");

// node_modules/stripe/esm/StripeMethod.js
function stripeMethod(spec) {
  if (spec.path !== void 0 && spec.fullPath !== void 0) {
    throw new Error(`Method spec specified both a 'path' (${spec.path}) and a 'fullPath' (${spec.fullPath}).`);
  }
  return function(...args) {
    const callback = typeof args[args.length - 1] == "function" && args.pop();
    spec.urlParams = extractUrlParams(spec.fullPath || this.createResourcePathWithSymbols(spec.path || ""));
    const requestPromise = callbackifyPromiseWithTimeout(this._makeRequest(args, spec, {}), callback);
    Object.assign(requestPromise, makeAutoPaginationMethods(this, args, spec, requestPromise));
    return requestPromise;
  };
}
__name(stripeMethod, "stripeMethod");

// node_modules/stripe/esm/StripeResource.js
StripeResource.extend = protoExtend;
StripeResource.method = stripeMethod;
StripeResource.MAX_BUFFERED_REQUEST_METRICS = 100;
function StripeResource(stripe2, deprecatedUrlData) {
  this._stripe = stripe2;
  if (deprecatedUrlData) {
    throw new Error("Support for curried url params was dropped in stripe-node v7.0.0. Instead, pass two ids.");
  }
  this.basePath = makeURLInterpolator(
    // @ts-ignore changing type of basePath
    this.basePath || stripe2.getApiField("basePath")
  );
  this.resourcePath = this.path;
  this.path = makeURLInterpolator(this.path);
  this.initialize(...arguments);
}
__name(StripeResource, "StripeResource");
StripeResource.prototype = {
  _stripe: null,
  // @ts-ignore the type of path changes in ctor
  path: "",
  resourcePath: "",
  // Methods that don't use the API's default '/v1' path can override it with this setting.
  basePath: null,
  initialize() {
  },
  // Function to override the default data processor. This allows full control
  // over how a StripeResource's request data will get converted into an HTTP
  // body. This is useful for non-standard HTTP requests. The function should
  // take method name, data, and headers as arguments.
  requestDataProcessor: null,
  // Function to add a validation checks before sending the request, errors should
  // be thrown, and they will be passed to the callback/promise.
  validateRequest: null,
  createFullPath(commandPath, urlData) {
    const urlParts = [this.basePath(urlData), this.path(urlData)];
    if (typeof commandPath === "function") {
      const computedCommandPath = commandPath(urlData);
      if (computedCommandPath) {
        urlParts.push(computedCommandPath);
      }
    } else {
      urlParts.push(commandPath);
    }
    return this._joinUrlParts(urlParts);
  },
  // Creates a relative resource path with symbols left in (unlike
  // createFullPath which takes some data to replace them with). For example it
  // might produce: /invoices/{id}
  createResourcePathWithSymbols(pathWithSymbols) {
    if (pathWithSymbols) {
      return `/${this._joinUrlParts([this.resourcePath, pathWithSymbols])}`;
    } else {
      return `/${this.resourcePath}`;
    }
  },
  _joinUrlParts(parts) {
    return parts.join("/").replace(/\/{2,}/g, "/");
  },
  _getRequestOpts(requestArgs, spec, overrideData) {
    var _a;
    const requestMethod = (spec.method || "GET").toUpperCase();
    const usage = spec.usage || [];
    const urlParams = spec.urlParams || [];
    const encode = spec.encode || ((data2) => data2);
    const isUsingFullPath = !!spec.fullPath;
    const commandPath = makeURLInterpolator(isUsingFullPath ? spec.fullPath : spec.path || "");
    const path = isUsingFullPath ? spec.fullPath : this.createResourcePathWithSymbols(spec.path);
    const args = [].slice.call(requestArgs);
    const urlData = urlParams.reduce((urlData2, param) => {
      const arg = args.shift();
      if (typeof arg !== "string") {
        throw new Error(`Stripe: Argument "${param}" must be a string, but got: ${arg} (on API request to \`${requestMethod} ${path}\`)`);
      }
      urlData2[param] = arg;
      return urlData2;
    }, {});
    const dataFromArgs = getDataFromArgs(args);
    const data = encode(Object.assign({}, dataFromArgs, overrideData));
    const options = getOptionsFromArgs(args);
    const host = options.host || spec.host;
    const streaming = !!spec.streaming || !!options.streaming;
    if (args.filter((x) => x != null).length) {
      throw new Error(`Stripe: Unknown arguments (${args}). Did you mean to pass an options object? See https://github.com/stripe/stripe-node/wiki/Passing-Options. (on API request to ${requestMethod} \`${path}\`)`);
    }
    const requestPath = isUsingFullPath ? commandPath(urlData) : this.createFullPath(commandPath, urlData);
    const headers = Object.assign(options.headers, spec.headers);
    if (spec.validator) {
      spec.validator(data, { headers });
    }
    const dataInQuery = spec.method === "GET" || spec.method === "DELETE";
    const bodyData = dataInQuery ? null : data;
    const queryData = dataInQuery ? data : {};
    return {
      requestMethod,
      requestPath,
      bodyData,
      queryData,
      authenticator: (_a = options.authenticator) !== null && _a !== void 0 ? _a : null,
      headers,
      host: host !== null && host !== void 0 ? host : null,
      streaming,
      settings: options.settings,
      usage
    };
  },
  _makeRequest(requestArgs, spec, overrideData) {
    return new Promise((resolve, reject) => {
      var _a;
      let opts;
      try {
        opts = this._getRequestOpts(requestArgs, spec, overrideData);
      } catch (err) {
        reject(err);
        return;
      }
      function requestCallback(err, response) {
        if (err) {
          reject(err);
        } else {
          resolve(spec.transformResponseData ? spec.transformResponseData(response) : response);
        }
      }
      __name(requestCallback, "requestCallback");
      const emptyQuery = Object.keys(opts.queryData).length === 0;
      const path = [
        opts.requestPath,
        emptyQuery ? "" : "?",
        queryStringifyRequestData(opts.queryData)
      ].join("");
      const { headers, settings } = opts;
      this._stripe._requestSender._request(opts.requestMethod, opts.host, path, opts.bodyData, opts.authenticator, {
        headers,
        settings,
        streaming: opts.streaming
      }, opts.usage, requestCallback, (_a = this.requestDataProcessor) === null || _a === void 0 ? void 0 : _a.bind(this));
    });
  }
};

// node_modules/stripe/esm/StripeContext.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var StripeContext = class {
  /**
   * Creates a new StripeContext with the given segments.
   */
  constructor(segments = []) {
    this._segments = [...segments];
  }
  /**
   * Gets a copy of the segments of this Context.
   */
  get segments() {
    return [...this._segments];
  }
  /**
   * Creates a new StripeContext with an additional segment appended.
   */
  push(segment) {
    if (!segment) {
      throw new Error("Segment cannot be null or undefined");
    }
    return new StripeContext([...this._segments, segment]);
  }
  /**
   * Creates a new StripeContext with the last segment removed.
   * If there are no segments, throws an error.
   */
  pop() {
    if (this._segments.length === 0) {
      throw new Error("Cannot pop from an empty context");
    }
    return new StripeContext(this._segments.slice(0, -1));
  }
  /**
   * Converts this context to its string representation.
   */
  toString() {
    return this._segments.join("/");
  }
  /**
   * Parses a context string into a StripeContext instance.
   */
  static parse(contextStr) {
    if (!contextStr) {
      return new StripeContext([]);
    }
    return new StripeContext(contextStr.split("/"));
  }
};
__name(StripeContext, "StripeContext");

// node_modules/stripe/esm/Webhooks.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
function createWebhooks(platformFunctions) {
  const Webhook = {
    DEFAULT_TOLERANCE: 300,
    signature: null,
    constructEvent(payload, header, secret, tolerance, cryptoProvider, receivedAt) {
      try {
        if (!this.signature) {
          throw new Error("ERR: missing signature helper, unable to verify");
        }
        this.signature.verifyHeader(payload, header, secret, tolerance || Webhook.DEFAULT_TOLERANCE, cryptoProvider, receivedAt);
      } catch (e) {
        if (e instanceof CryptoProviderOnlySupportsAsyncError) {
          e.message += "\nUse `await constructEventAsync(...)` instead of `constructEvent(...)`";
        }
        throw e;
      }
      const jsonPayload = payload instanceof Uint8Array ? JSON.parse(new TextDecoder("utf8").decode(payload)) : JSON.parse(payload);
      return jsonPayload;
    },
    async constructEventAsync(payload, header, secret, tolerance, cryptoProvider, receivedAt) {
      if (!this.signature) {
        throw new Error("ERR: missing signature helper, unable to verify");
      }
      await this.signature.verifyHeaderAsync(payload, header, secret, tolerance || Webhook.DEFAULT_TOLERANCE, cryptoProvider, receivedAt);
      const jsonPayload = payload instanceof Uint8Array ? JSON.parse(new TextDecoder("utf8").decode(payload)) : JSON.parse(payload);
      return jsonPayload;
    },
    /**
     * Generates a header to be used for webhook mocking
     *
     * @typedef {object} opts
     * @property {number} timestamp - Timestamp of the header. Defaults to Date.now()
     * @property {string} payload - JSON stringified payload object, containing the 'id' and 'object' parameters
     * @property {string} secret - Stripe webhook secret 'whsec_...'
     * @property {string} scheme - Version of API to hit. Defaults to 'v1'.
     * @property {string} signature - Computed webhook signature
     * @property {CryptoProvider} cryptoProvider - Crypto provider to use for computing the signature if none was provided. Defaults to NodeCryptoProvider.
     */
    generateTestHeaderString: function(opts) {
      const preparedOpts = prepareOptions(opts);
      const signature2 = preparedOpts.signature || preparedOpts.cryptoProvider.computeHMACSignature(preparedOpts.payloadString, preparedOpts.secret);
      return preparedOpts.generateHeaderString(signature2);
    },
    generateTestHeaderStringAsync: async function(opts) {
      const preparedOpts = prepareOptions(opts);
      const signature2 = preparedOpts.signature || await preparedOpts.cryptoProvider.computeHMACSignatureAsync(preparedOpts.payloadString, preparedOpts.secret);
      return preparedOpts.generateHeaderString(signature2);
    }
  };
  const signature = {
    EXPECTED_SCHEME: "v1",
    verifyHeader(encodedPayload, encodedHeader, secret, tolerance, cryptoProvider, receivedAt) {
      const { decodedHeader: header, decodedPayload: payload, details, suspectPayloadType } = parseEventDetails(encodedPayload, encodedHeader, this.EXPECTED_SCHEME);
      const secretContainsWhitespace = /\s/.test(secret);
      cryptoProvider = cryptoProvider || getCryptoProvider();
      const expectedSignature = cryptoProvider.computeHMACSignature(makeHMACContent(payload, details), secret);
      validateComputedSignature(payload, header, details, expectedSignature, tolerance, suspectPayloadType, secretContainsWhitespace, receivedAt);
      return true;
    },
    async verifyHeaderAsync(encodedPayload, encodedHeader, secret, tolerance, cryptoProvider, receivedAt) {
      const { decodedHeader: header, decodedPayload: payload, details, suspectPayloadType } = parseEventDetails(encodedPayload, encodedHeader, this.EXPECTED_SCHEME);
      const secretContainsWhitespace = /\s/.test(secret);
      cryptoProvider = cryptoProvider || getCryptoProvider();
      const expectedSignature = await cryptoProvider.computeHMACSignatureAsync(makeHMACContent(payload, details), secret);
      return validateComputedSignature(payload, header, details, expectedSignature, tolerance, suspectPayloadType, secretContainsWhitespace, receivedAt);
    }
  };
  function makeHMACContent(payload, details) {
    return `${details.timestamp}.${payload}`;
  }
  __name(makeHMACContent, "makeHMACContent");
  function parseEventDetails(encodedPayload, encodedHeader, expectedScheme) {
    if (!encodedPayload) {
      throw new StripeSignatureVerificationError(encodedHeader, encodedPayload, {
        message: "No webhook payload was provided."
      });
    }
    const suspectPayloadType = typeof encodedPayload != "string" && !(encodedPayload instanceof Uint8Array);
    const textDecoder = new TextDecoder("utf8");
    const decodedPayload = encodedPayload instanceof Uint8Array ? textDecoder.decode(encodedPayload) : encodedPayload;
    if (Array.isArray(encodedHeader)) {
      throw new Error("Unexpected: An array was passed as a header, which should not be possible for the stripe-signature header.");
    }
    if (encodedHeader == null || encodedHeader == "") {
      throw new StripeSignatureVerificationError(encodedHeader, encodedPayload, {
        message: "No stripe-signature header value was provided."
      });
    }
    const decodedHeader = encodedHeader instanceof Uint8Array ? textDecoder.decode(encodedHeader) : encodedHeader;
    const details = parseHeader(decodedHeader, expectedScheme);
    if (!details || details.timestamp === -1) {
      throw new StripeSignatureVerificationError(decodedHeader, decodedPayload, {
        message: "Unable to extract timestamp and signatures from header"
      });
    }
    if (!details.signatures.length) {
      throw new StripeSignatureVerificationError(decodedHeader, decodedPayload, {
        message: "No signatures found with expected scheme"
      });
    }
    return {
      decodedPayload,
      decodedHeader,
      details,
      suspectPayloadType
    };
  }
  __name(parseEventDetails, "parseEventDetails");
  function validateComputedSignature(payload, header, details, expectedSignature, tolerance, suspectPayloadType, secretContainsWhitespace, receivedAt) {
    const signatureFound = !!details.signatures.filter(platformFunctions.secureCompare.bind(platformFunctions, expectedSignature)).length;
    const docsLocation = "\nLearn more about webhook signing and explore webhook integration examples for various frameworks at https://docs.stripe.com/webhooks/signature";
    const whitespaceMessage = secretContainsWhitespace ? "\n\nNote: The provided signing secret contains whitespace. This often indicates an extra newline or space is in the value" : "";
    if (!signatureFound) {
      if (suspectPayloadType) {
        throw new StripeSignatureVerificationError(header, payload, {
          message: "Webhook payload must be provided as a string or a Buffer (https://nodejs.org/api/buffer.html) instance representing the _raw_ request body.Payload was provided as a parsed JavaScript object instead. \nSignature verification is impossible without access to the original signed material. \n" + docsLocation + "\n" + whitespaceMessage
        });
      }
      throw new StripeSignatureVerificationError(header, payload, {
        message: "No signatures found matching the expected signature for payload. Are you passing the raw request body you received from Stripe? \n If a webhook request is being forwarded by a third-party tool, ensure that the exact request body, including JSON formatting and new line style, is preserved.\n" + docsLocation + "\n" + whitespaceMessage
      });
    }
    const timestampAge = Math.floor((typeof receivedAt === "number" ? receivedAt : Date.now()) / 1e3) - details.timestamp;
    if (tolerance > 0 && timestampAge > tolerance) {
      throw new StripeSignatureVerificationError(header, payload, {
        message: "Timestamp outside the tolerance zone"
      });
    }
    return true;
  }
  __name(validateComputedSignature, "validateComputedSignature");
  function parseHeader(header, scheme) {
    if (typeof header !== "string") {
      return null;
    }
    return header.split(",").reduce((accum, item) => {
      const kv = item.split("=");
      if (kv[0] === "t") {
        accum.timestamp = parseInt(kv[1], 10);
      }
      if (kv[0] === scheme) {
        accum.signatures.push(kv[1]);
      }
      return accum;
    }, {
      timestamp: -1,
      signatures: []
    });
  }
  __name(parseHeader, "parseHeader");
  let webhooksCryptoProviderInstance = null;
  function getCryptoProvider() {
    if (!webhooksCryptoProviderInstance) {
      webhooksCryptoProviderInstance = platformFunctions.createDefaultCryptoProvider();
    }
    return webhooksCryptoProviderInstance;
  }
  __name(getCryptoProvider, "getCryptoProvider");
  function prepareOptions(opts) {
    if (!opts) {
      throw new StripeError({
        message: "Options are required"
      });
    }
    const timestamp = Math.floor(opts.timestamp) || Math.floor(Date.now() / 1e3);
    const scheme = opts.scheme || signature.EXPECTED_SCHEME;
    const cryptoProvider = opts.cryptoProvider || getCryptoProvider();
    const payloadString = `${timestamp}.${opts.payload}`;
    const generateHeaderString = /* @__PURE__ */ __name((signature2) => {
      return `t=${timestamp},${scheme}=${signature2}`;
    }, "generateHeaderString");
    return Object.assign(Object.assign({}, opts), {
      timestamp,
      scheme,
      cryptoProvider,
      payloadString,
      generateHeaderString
    });
  }
  __name(prepareOptions, "prepareOptions");
  Webhook.signature = signature;
  return Webhook;
}
__name(createWebhooks, "createWebhooks");

// node_modules/stripe/esm/apiVersion.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var ApiVersion = "2026-01-28.clover";

// node_modules/stripe/esm/resources.js
var resources_exports = {};
__export(resources_exports, {
  Account: () => Accounts3,
  AccountLinks: () => AccountLinks2,
  AccountSessions: () => AccountSessions,
  Accounts: () => Accounts3,
  ApplePayDomains: () => ApplePayDomains,
  ApplicationFees: () => ApplicationFees,
  Apps: () => Apps,
  Balance: () => Balance,
  BalanceSettings: () => BalanceSettings,
  BalanceTransactions: () => BalanceTransactions,
  Billing: () => Billing,
  BillingPortal: () => BillingPortal,
  Charges: () => Charges,
  Checkout: () => Checkout,
  Climate: () => Climate,
  ConfirmationTokens: () => ConfirmationTokens2,
  CountrySpecs: () => CountrySpecs,
  Coupons: () => Coupons,
  CreditNotes: () => CreditNotes,
  CustomerSessions: () => CustomerSessions,
  Customers: () => Customers2,
  Disputes: () => Disputes2,
  Entitlements: () => Entitlements,
  EphemeralKeys: () => EphemeralKeys,
  Events: () => Events2,
  ExchangeRates: () => ExchangeRates,
  FileLinks: () => FileLinks,
  Files: () => Files,
  FinancialConnections: () => FinancialConnections,
  Forwarding: () => Forwarding,
  Identity: () => Identity,
  InvoiceItems: () => InvoiceItems,
  InvoicePayments: () => InvoicePayments,
  InvoiceRenderingTemplates: () => InvoiceRenderingTemplates,
  Invoices: () => Invoices,
  Issuing: () => Issuing,
  Mandates: () => Mandates,
  OAuth: () => OAuth,
  PaymentAttemptRecords: () => PaymentAttemptRecords,
  PaymentIntents: () => PaymentIntents,
  PaymentLinks: () => PaymentLinks,
  PaymentMethodConfigurations: () => PaymentMethodConfigurations,
  PaymentMethodDomains: () => PaymentMethodDomains,
  PaymentMethods: () => PaymentMethods,
  PaymentRecords: () => PaymentRecords,
  Payouts: () => Payouts,
  Plans: () => Plans,
  Prices: () => Prices,
  Products: () => Products2,
  PromotionCodes: () => PromotionCodes,
  Quotes: () => Quotes,
  Radar: () => Radar,
  Refunds: () => Refunds2,
  Reporting: () => Reporting,
  Reviews: () => Reviews,
  SetupAttempts: () => SetupAttempts,
  SetupIntents: () => SetupIntents,
  ShippingRates: () => ShippingRates,
  Sigma: () => Sigma,
  Sources: () => Sources,
  SubscriptionItems: () => SubscriptionItems,
  SubscriptionSchedules: () => SubscriptionSchedules,
  Subscriptions: () => Subscriptions,
  Tax: () => Tax,
  TaxCodes: () => TaxCodes,
  TaxIds: () => TaxIds,
  TaxRates: () => TaxRates,
  Terminal: () => Terminal,
  TestHelpers: () => TestHelpers,
  Tokens: () => Tokens2,
  Topups: () => Topups,
  Transfers: () => Transfers,
  Treasury: () => Treasury,
  V2: () => V2,
  WebhookEndpoints: () => WebhookEndpoints
});
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();

// node_modules/stripe/esm/ResourceNamespace.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
function ResourceNamespace(stripe2, resources) {
  for (const name in resources) {
    if (!Object.prototype.hasOwnProperty.call(resources, name)) {
      continue;
    }
    const camelCaseName = name[0].toLowerCase() + name.substring(1);
    const resource = new resources[name](stripe2);
    this[camelCaseName] = resource;
  }
}
__name(ResourceNamespace, "ResourceNamespace");
function resourceNamespace(namespace, resources) {
  return function(stripe2) {
    return new ResourceNamespace(stripe2, resources);
  };
}
__name(resourceNamespace, "resourceNamespace");

// node_modules/stripe/esm/resources/V2/Core/AccountLinks.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod2 = StripeResource.method;
var AccountLinks = StripeResource.extend({
  create: stripeMethod2({ method: "POST", fullPath: "/v2/core/account_links" })
});

// node_modules/stripe/esm/resources/V2/Core/AccountTokens.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod3 = StripeResource.method;
var AccountTokens = StripeResource.extend({
  create: stripeMethod3({ method: "POST", fullPath: "/v2/core/account_tokens" }),
  retrieve: stripeMethod3({
    method: "GET",
    fullPath: "/v2/core/account_tokens/{id}"
  })
});

// node_modules/stripe/esm/resources/FinancialConnections/Accounts.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod4 = StripeResource.method;
var Accounts = StripeResource.extend({
  retrieve: stripeMethod4({
    method: "GET",
    fullPath: "/v1/financial_connections/accounts/{account}"
  }),
  list: stripeMethod4({
    method: "GET",
    fullPath: "/v1/financial_connections/accounts",
    methodType: "list"
  }),
  disconnect: stripeMethod4({
    method: "POST",
    fullPath: "/v1/financial_connections/accounts/{account}/disconnect"
  }),
  listOwners: stripeMethod4({
    method: "GET",
    fullPath: "/v1/financial_connections/accounts/{account}/owners",
    methodType: "list"
  }),
  refresh: stripeMethod4({
    method: "POST",
    fullPath: "/v1/financial_connections/accounts/{account}/refresh"
  }),
  subscribe: stripeMethod4({
    method: "POST",
    fullPath: "/v1/financial_connections/accounts/{account}/subscribe"
  }),
  unsubscribe: stripeMethod4({
    method: "POST",
    fullPath: "/v1/financial_connections/accounts/{account}/unsubscribe"
  })
});

// node_modules/stripe/esm/resources/V2/Core/Accounts.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();

// node_modules/stripe/esm/resources/V2/Core/Accounts/Persons.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod5 = StripeResource.method;
var Persons = StripeResource.extend({
  create: stripeMethod5({
    method: "POST",
    fullPath: "/v2/core/accounts/{account_id}/persons"
  }),
  retrieve: stripeMethod5({
    method: "GET",
    fullPath: "/v2/core/accounts/{account_id}/persons/{id}"
  }),
  update: stripeMethod5({
    method: "POST",
    fullPath: "/v2/core/accounts/{account_id}/persons/{id}"
  }),
  list: stripeMethod5({
    method: "GET",
    fullPath: "/v2/core/accounts/{account_id}/persons",
    methodType: "list"
  }),
  del: stripeMethod5({
    method: "DELETE",
    fullPath: "/v2/core/accounts/{account_id}/persons/{id}"
  })
});

// node_modules/stripe/esm/resources/V2/Core/Accounts/PersonTokens.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod6 = StripeResource.method;
var PersonTokens = StripeResource.extend({
  create: stripeMethod6({
    method: "POST",
    fullPath: "/v2/core/accounts/{account_id}/person_tokens"
  }),
  retrieve: stripeMethod6({
    method: "GET",
    fullPath: "/v2/core/accounts/{account_id}/person_tokens/{id}"
  })
});

// node_modules/stripe/esm/resources/V2/Core/Accounts.js
var stripeMethod7 = StripeResource.method;
var Accounts2 = StripeResource.extend({
  constructor: function(...args) {
    StripeResource.apply(this, args);
    this.persons = new Persons(...args);
    this.personTokens = new PersonTokens(...args);
  },
  create: stripeMethod7({ method: "POST", fullPath: "/v2/core/accounts" }),
  retrieve: stripeMethod7({ method: "GET", fullPath: "/v2/core/accounts/{id}" }),
  update: stripeMethod7({ method: "POST", fullPath: "/v2/core/accounts/{id}" }),
  list: stripeMethod7({
    method: "GET",
    fullPath: "/v2/core/accounts",
    methodType: "list"
  }),
  close: stripeMethod7({
    method: "POST",
    fullPath: "/v2/core/accounts/{id}/close"
  })
});

// node_modules/stripe/esm/resources/Entitlements/ActiveEntitlements.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod8 = StripeResource.method;
var ActiveEntitlements = StripeResource.extend({
  retrieve: stripeMethod8({
    method: "GET",
    fullPath: "/v1/entitlements/active_entitlements/{id}"
  }),
  list: stripeMethod8({
    method: "GET",
    fullPath: "/v1/entitlements/active_entitlements",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/Billing/Alerts.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod9 = StripeResource.method;
var Alerts = StripeResource.extend({
  create: stripeMethod9({ method: "POST", fullPath: "/v1/billing/alerts" }),
  retrieve: stripeMethod9({ method: "GET", fullPath: "/v1/billing/alerts/{id}" }),
  list: stripeMethod9({
    method: "GET",
    fullPath: "/v1/billing/alerts",
    methodType: "list"
  }),
  activate: stripeMethod9({
    method: "POST",
    fullPath: "/v1/billing/alerts/{id}/activate"
  }),
  archive: stripeMethod9({
    method: "POST",
    fullPath: "/v1/billing/alerts/{id}/archive"
  }),
  deactivate: stripeMethod9({
    method: "POST",
    fullPath: "/v1/billing/alerts/{id}/deactivate"
  })
});

// node_modules/stripe/esm/resources/Tax/Associations.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod10 = StripeResource.method;
var Associations = StripeResource.extend({
  find: stripeMethod10({ method: "GET", fullPath: "/v1/tax/associations/find" })
});

// node_modules/stripe/esm/resources/Issuing/Authorizations.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod11 = StripeResource.method;
var Authorizations = StripeResource.extend({
  retrieve: stripeMethod11({
    method: "GET",
    fullPath: "/v1/issuing/authorizations/{authorization}"
  }),
  update: stripeMethod11({
    method: "POST",
    fullPath: "/v1/issuing/authorizations/{authorization}"
  }),
  list: stripeMethod11({
    method: "GET",
    fullPath: "/v1/issuing/authorizations",
    methodType: "list"
  }),
  approve: stripeMethod11({
    method: "POST",
    fullPath: "/v1/issuing/authorizations/{authorization}/approve"
  }),
  decline: stripeMethod11({
    method: "POST",
    fullPath: "/v1/issuing/authorizations/{authorization}/decline"
  })
});

// node_modules/stripe/esm/resources/TestHelpers/Issuing/Authorizations.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod12 = StripeResource.method;
var Authorizations2 = StripeResource.extend({
  create: stripeMethod12({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/authorizations"
  }),
  capture: stripeMethod12({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/authorizations/{authorization}/capture"
  }),
  expire: stripeMethod12({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/authorizations/{authorization}/expire"
  }),
  finalizeAmount: stripeMethod12({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/authorizations/{authorization}/finalize_amount"
  }),
  increment: stripeMethod12({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/authorizations/{authorization}/increment"
  }),
  respond: stripeMethod12({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/authorizations/{authorization}/fraud_challenges/respond"
  }),
  reverse: stripeMethod12({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/authorizations/{authorization}/reverse"
  })
});

// node_modules/stripe/esm/resources/Tax/Calculations.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod13 = StripeResource.method;
var Calculations = StripeResource.extend({
  create: stripeMethod13({ method: "POST", fullPath: "/v1/tax/calculations" }),
  retrieve: stripeMethod13({
    method: "GET",
    fullPath: "/v1/tax/calculations/{calculation}"
  }),
  listLineItems: stripeMethod13({
    method: "GET",
    fullPath: "/v1/tax/calculations/{calculation}/line_items",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/Issuing/Cardholders.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod14 = StripeResource.method;
var Cardholders = StripeResource.extend({
  create: stripeMethod14({ method: "POST", fullPath: "/v1/issuing/cardholders" }),
  retrieve: stripeMethod14({
    method: "GET",
    fullPath: "/v1/issuing/cardholders/{cardholder}"
  }),
  update: stripeMethod14({
    method: "POST",
    fullPath: "/v1/issuing/cardholders/{cardholder}"
  }),
  list: stripeMethod14({
    method: "GET",
    fullPath: "/v1/issuing/cardholders",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/Issuing/Cards.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod15 = StripeResource.method;
var Cards = StripeResource.extend({
  create: stripeMethod15({ method: "POST", fullPath: "/v1/issuing/cards" }),
  retrieve: stripeMethod15({ method: "GET", fullPath: "/v1/issuing/cards/{card}" }),
  update: stripeMethod15({ method: "POST", fullPath: "/v1/issuing/cards/{card}" }),
  list: stripeMethod15({
    method: "GET",
    fullPath: "/v1/issuing/cards",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/TestHelpers/Issuing/Cards.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod16 = StripeResource.method;
var Cards2 = StripeResource.extend({
  deliverCard: stripeMethod16({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/cards/{card}/shipping/deliver"
  }),
  failCard: stripeMethod16({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/cards/{card}/shipping/fail"
  }),
  returnCard: stripeMethod16({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/cards/{card}/shipping/return"
  }),
  shipCard: stripeMethod16({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/cards/{card}/shipping/ship"
  }),
  submitCard: stripeMethod16({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/cards/{card}/shipping/submit"
  })
});

// node_modules/stripe/esm/resources/BillingPortal/Configurations.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod17 = StripeResource.method;
var Configurations = StripeResource.extend({
  create: stripeMethod17({
    method: "POST",
    fullPath: "/v1/billing_portal/configurations"
  }),
  retrieve: stripeMethod17({
    method: "GET",
    fullPath: "/v1/billing_portal/configurations/{configuration}"
  }),
  update: stripeMethod17({
    method: "POST",
    fullPath: "/v1/billing_portal/configurations/{configuration}"
  }),
  list: stripeMethod17({
    method: "GET",
    fullPath: "/v1/billing_portal/configurations",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/Terminal/Configurations.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod18 = StripeResource.method;
var Configurations2 = StripeResource.extend({
  create: stripeMethod18({
    method: "POST",
    fullPath: "/v1/terminal/configurations"
  }),
  retrieve: stripeMethod18({
    method: "GET",
    fullPath: "/v1/terminal/configurations/{configuration}"
  }),
  update: stripeMethod18({
    method: "POST",
    fullPath: "/v1/terminal/configurations/{configuration}"
  }),
  list: stripeMethod18({
    method: "GET",
    fullPath: "/v1/terminal/configurations",
    methodType: "list"
  }),
  del: stripeMethod18({
    method: "DELETE",
    fullPath: "/v1/terminal/configurations/{configuration}"
  })
});

// node_modules/stripe/esm/resources/TestHelpers/ConfirmationTokens.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod19 = StripeResource.method;
var ConfirmationTokens = StripeResource.extend({
  create: stripeMethod19({
    method: "POST",
    fullPath: "/v1/test_helpers/confirmation_tokens"
  })
});

// node_modules/stripe/esm/resources/Terminal/ConnectionTokens.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod20 = StripeResource.method;
var ConnectionTokens = StripeResource.extend({
  create: stripeMethod20({
    method: "POST",
    fullPath: "/v1/terminal/connection_tokens"
  })
});

// node_modules/stripe/esm/resources/Billing/CreditBalanceSummary.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod21 = StripeResource.method;
var CreditBalanceSummary = StripeResource.extend({
  retrieve: stripeMethod21({
    method: "GET",
    fullPath: "/v1/billing/credit_balance_summary"
  })
});

// node_modules/stripe/esm/resources/Billing/CreditBalanceTransactions.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod22 = StripeResource.method;
var CreditBalanceTransactions = StripeResource.extend({
  retrieve: stripeMethod22({
    method: "GET",
    fullPath: "/v1/billing/credit_balance_transactions/{id}"
  }),
  list: stripeMethod22({
    method: "GET",
    fullPath: "/v1/billing/credit_balance_transactions",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/Billing/CreditGrants.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod23 = StripeResource.method;
var CreditGrants = StripeResource.extend({
  create: stripeMethod23({ method: "POST", fullPath: "/v1/billing/credit_grants" }),
  retrieve: stripeMethod23({
    method: "GET",
    fullPath: "/v1/billing/credit_grants/{id}"
  }),
  update: stripeMethod23({
    method: "POST",
    fullPath: "/v1/billing/credit_grants/{id}"
  }),
  list: stripeMethod23({
    method: "GET",
    fullPath: "/v1/billing/credit_grants",
    methodType: "list"
  }),
  expire: stripeMethod23({
    method: "POST",
    fullPath: "/v1/billing/credit_grants/{id}/expire"
  }),
  voidGrant: stripeMethod23({
    method: "POST",
    fullPath: "/v1/billing/credit_grants/{id}/void"
  })
});

// node_modules/stripe/esm/resources/Treasury/CreditReversals.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod24 = StripeResource.method;
var CreditReversals = StripeResource.extend({
  create: stripeMethod24({
    method: "POST",
    fullPath: "/v1/treasury/credit_reversals"
  }),
  retrieve: stripeMethod24({
    method: "GET",
    fullPath: "/v1/treasury/credit_reversals/{credit_reversal}"
  }),
  list: stripeMethod24({
    method: "GET",
    fullPath: "/v1/treasury/credit_reversals",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/TestHelpers/Customers.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod25 = StripeResource.method;
var Customers = StripeResource.extend({
  fundCashBalance: stripeMethod25({
    method: "POST",
    fullPath: "/v1/test_helpers/customers/{customer}/fund_cash_balance"
  })
});

// node_modules/stripe/esm/resources/Treasury/DebitReversals.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod26 = StripeResource.method;
var DebitReversals = StripeResource.extend({
  create: stripeMethod26({
    method: "POST",
    fullPath: "/v1/treasury/debit_reversals"
  }),
  retrieve: stripeMethod26({
    method: "GET",
    fullPath: "/v1/treasury/debit_reversals/{debit_reversal}"
  }),
  list: stripeMethod26({
    method: "GET",
    fullPath: "/v1/treasury/debit_reversals",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/Issuing/Disputes.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod27 = StripeResource.method;
var Disputes = StripeResource.extend({
  create: stripeMethod27({ method: "POST", fullPath: "/v1/issuing/disputes" }),
  retrieve: stripeMethod27({
    method: "GET",
    fullPath: "/v1/issuing/disputes/{dispute}"
  }),
  update: stripeMethod27({
    method: "POST",
    fullPath: "/v1/issuing/disputes/{dispute}"
  }),
  list: stripeMethod27({
    method: "GET",
    fullPath: "/v1/issuing/disputes",
    methodType: "list"
  }),
  submit: stripeMethod27({
    method: "POST",
    fullPath: "/v1/issuing/disputes/{dispute}/submit"
  })
});

// node_modules/stripe/esm/resources/Radar/EarlyFraudWarnings.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod28 = StripeResource.method;
var EarlyFraudWarnings = StripeResource.extend({
  retrieve: stripeMethod28({
    method: "GET",
    fullPath: "/v1/radar/early_fraud_warnings/{early_fraud_warning}"
  }),
  list: stripeMethod28({
    method: "GET",
    fullPath: "/v1/radar/early_fraud_warnings",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/V2/Core/EventDestinations.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod29 = StripeResource.method;
var EventDestinations = StripeResource.extend({
  create: stripeMethod29({
    method: "POST",
    fullPath: "/v2/core/event_destinations"
  }),
  retrieve: stripeMethod29({
    method: "GET",
    fullPath: "/v2/core/event_destinations/{id}"
  }),
  update: stripeMethod29({
    method: "POST",
    fullPath: "/v2/core/event_destinations/{id}"
  }),
  list: stripeMethod29({
    method: "GET",
    fullPath: "/v2/core/event_destinations",
    methodType: "list"
  }),
  del: stripeMethod29({
    method: "DELETE",
    fullPath: "/v2/core/event_destinations/{id}"
  }),
  disable: stripeMethod29({
    method: "POST",
    fullPath: "/v2/core/event_destinations/{id}/disable"
  }),
  enable: stripeMethod29({
    method: "POST",
    fullPath: "/v2/core/event_destinations/{id}/enable"
  }),
  ping: stripeMethod29({
    method: "POST",
    fullPath: "/v2/core/event_destinations/{id}/ping"
  })
});

// node_modules/stripe/esm/resources/V2/Core/Events.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod30 = StripeResource.method;
var Events = StripeResource.extend({
  retrieve(...args) {
    const transformResponseData = /* @__PURE__ */ __name((response) => {
      return this.addFetchRelatedObjectIfNeeded(response);
    }, "transformResponseData");
    return stripeMethod30({
      method: "GET",
      fullPath: "/v2/core/events/{id}",
      transformResponseData
    }).apply(this, args);
  },
  list(...args) {
    const transformResponseData = /* @__PURE__ */ __name((response) => {
      return Object.assign(Object.assign({}, response), { data: response.data.map(this.addFetchRelatedObjectIfNeeded.bind(this)) });
    }, "transformResponseData");
    return stripeMethod30({
      method: "GET",
      fullPath: "/v2/core/events",
      methodType: "list",
      transformResponseData
    }).apply(this, args);
  },
  /**
   * @private
   *
   * For internal use in stripe-node.
   *
   * @param pulledEvent The retrieved event object
   * @returns The retrieved event object with a fetchRelatedObject method,
   * if pulledEvent.related_object is valid (non-null and has a url)
   */
  addFetchRelatedObjectIfNeeded(pulledEvent) {
    if (!pulledEvent.related_object || !pulledEvent.related_object.url) {
      return pulledEvent;
    }
    return Object.assign(Object.assign({}, pulledEvent), { fetchRelatedObject: () => (
      // call stripeMethod with 'this' resource to fetch
      // the related object. 'this' is needed to construct
      // and send the request, but the method spec controls
      // the url endpoint and method, so it doesn't matter
      // that 'this' is an Events resource object here
      stripeMethod30({
        method: "GET",
        fullPath: pulledEvent.related_object.url
      }).apply(this, [
        {
          stripeContext: pulledEvent.context
        }
      ])
    ) });
  }
});

// node_modules/stripe/esm/resources/Entitlements/Features.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod31 = StripeResource.method;
var Features = StripeResource.extend({
  create: stripeMethod31({ method: "POST", fullPath: "/v1/entitlements/features" }),
  retrieve: stripeMethod31({
    method: "GET",
    fullPath: "/v1/entitlements/features/{id}"
  }),
  update: stripeMethod31({
    method: "POST",
    fullPath: "/v1/entitlements/features/{id}"
  }),
  list: stripeMethod31({
    method: "GET",
    fullPath: "/v1/entitlements/features",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/Treasury/FinancialAccounts.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod32 = StripeResource.method;
var FinancialAccounts = StripeResource.extend({
  create: stripeMethod32({
    method: "POST",
    fullPath: "/v1/treasury/financial_accounts"
  }),
  retrieve: stripeMethod32({
    method: "GET",
    fullPath: "/v1/treasury/financial_accounts/{financial_account}"
  }),
  update: stripeMethod32({
    method: "POST",
    fullPath: "/v1/treasury/financial_accounts/{financial_account}"
  }),
  list: stripeMethod32({
    method: "GET",
    fullPath: "/v1/treasury/financial_accounts",
    methodType: "list"
  }),
  close: stripeMethod32({
    method: "POST",
    fullPath: "/v1/treasury/financial_accounts/{financial_account}/close"
  }),
  retrieveFeatures: stripeMethod32({
    method: "GET",
    fullPath: "/v1/treasury/financial_accounts/{financial_account}/features"
  }),
  updateFeatures: stripeMethod32({
    method: "POST",
    fullPath: "/v1/treasury/financial_accounts/{financial_account}/features"
  })
});

// node_modules/stripe/esm/resources/TestHelpers/Treasury/InboundTransfers.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod33 = StripeResource.method;
var InboundTransfers = StripeResource.extend({
  fail: stripeMethod33({
    method: "POST",
    fullPath: "/v1/test_helpers/treasury/inbound_transfers/{id}/fail"
  }),
  returnInboundTransfer: stripeMethod33({
    method: "POST",
    fullPath: "/v1/test_helpers/treasury/inbound_transfers/{id}/return"
  }),
  succeed: stripeMethod33({
    method: "POST",
    fullPath: "/v1/test_helpers/treasury/inbound_transfers/{id}/succeed"
  })
});

// node_modules/stripe/esm/resources/Treasury/InboundTransfers.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod34 = StripeResource.method;
var InboundTransfers2 = StripeResource.extend({
  create: stripeMethod34({
    method: "POST",
    fullPath: "/v1/treasury/inbound_transfers"
  }),
  retrieve: stripeMethod34({
    method: "GET",
    fullPath: "/v1/treasury/inbound_transfers/{id}"
  }),
  list: stripeMethod34({
    method: "GET",
    fullPath: "/v1/treasury/inbound_transfers",
    methodType: "list"
  }),
  cancel: stripeMethod34({
    method: "POST",
    fullPath: "/v1/treasury/inbound_transfers/{inbound_transfer}/cancel"
  })
});

// node_modules/stripe/esm/resources/Terminal/Locations.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod35 = StripeResource.method;
var Locations = StripeResource.extend({
  create: stripeMethod35({ method: "POST", fullPath: "/v1/terminal/locations" }),
  retrieve: stripeMethod35({
    method: "GET",
    fullPath: "/v1/terminal/locations/{location}"
  }),
  update: stripeMethod35({
    method: "POST",
    fullPath: "/v1/terminal/locations/{location}"
  }),
  list: stripeMethod35({
    method: "GET",
    fullPath: "/v1/terminal/locations",
    methodType: "list"
  }),
  del: stripeMethod35({
    method: "DELETE",
    fullPath: "/v1/terminal/locations/{location}"
  })
});

// node_modules/stripe/esm/resources/Billing/MeterEventAdjustments.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod36 = StripeResource.method;
var MeterEventAdjustments = StripeResource.extend({
  create: stripeMethod36({
    method: "POST",
    fullPath: "/v1/billing/meter_event_adjustments"
  })
});

// node_modules/stripe/esm/resources/V2/Billing/MeterEventAdjustments.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod37 = StripeResource.method;
var MeterEventAdjustments2 = StripeResource.extend({
  create: stripeMethod37({
    method: "POST",
    fullPath: "/v2/billing/meter_event_adjustments"
  })
});

// node_modules/stripe/esm/resources/V2/Billing/MeterEventSession.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod38 = StripeResource.method;
var MeterEventSession = StripeResource.extend({
  create: stripeMethod38({
    method: "POST",
    fullPath: "/v2/billing/meter_event_session"
  })
});

// node_modules/stripe/esm/resources/V2/Billing/MeterEventStream.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod39 = StripeResource.method;
var MeterEventStream = StripeResource.extend({
  create: stripeMethod39({
    method: "POST",
    fullPath: "/v2/billing/meter_event_stream",
    host: "meter-events.stripe.com"
  })
});

// node_modules/stripe/esm/resources/Billing/MeterEvents.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod40 = StripeResource.method;
var MeterEvents = StripeResource.extend({
  create: stripeMethod40({ method: "POST", fullPath: "/v1/billing/meter_events" })
});

// node_modules/stripe/esm/resources/V2/Billing/MeterEvents.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod41 = StripeResource.method;
var MeterEvents2 = StripeResource.extend({
  create: stripeMethod41({ method: "POST", fullPath: "/v2/billing/meter_events" })
});

// node_modules/stripe/esm/resources/Billing/Meters.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod42 = StripeResource.method;
var Meters = StripeResource.extend({
  create: stripeMethod42({ method: "POST", fullPath: "/v1/billing/meters" }),
  retrieve: stripeMethod42({ method: "GET", fullPath: "/v1/billing/meters/{id}" }),
  update: stripeMethod42({ method: "POST", fullPath: "/v1/billing/meters/{id}" }),
  list: stripeMethod42({
    method: "GET",
    fullPath: "/v1/billing/meters",
    methodType: "list"
  }),
  deactivate: stripeMethod42({
    method: "POST",
    fullPath: "/v1/billing/meters/{id}/deactivate"
  }),
  listEventSummaries: stripeMethod42({
    method: "GET",
    fullPath: "/v1/billing/meters/{id}/event_summaries",
    methodType: "list"
  }),
  reactivate: stripeMethod42({
    method: "POST",
    fullPath: "/v1/billing/meters/{id}/reactivate"
  })
});

// node_modules/stripe/esm/resources/Terminal/OnboardingLinks.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod43 = StripeResource.method;
var OnboardingLinks = StripeResource.extend({
  create: stripeMethod43({
    method: "POST",
    fullPath: "/v1/terminal/onboarding_links"
  })
});

// node_modules/stripe/esm/resources/Climate/Orders.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod44 = StripeResource.method;
var Orders = StripeResource.extend({
  create: stripeMethod44({ method: "POST", fullPath: "/v1/climate/orders" }),
  retrieve: stripeMethod44({
    method: "GET",
    fullPath: "/v1/climate/orders/{order}"
  }),
  update: stripeMethod44({
    method: "POST",
    fullPath: "/v1/climate/orders/{order}"
  }),
  list: stripeMethod44({
    method: "GET",
    fullPath: "/v1/climate/orders",
    methodType: "list"
  }),
  cancel: stripeMethod44({
    method: "POST",
    fullPath: "/v1/climate/orders/{order}/cancel"
  })
});

// node_modules/stripe/esm/resources/TestHelpers/Treasury/OutboundPayments.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod45 = StripeResource.method;
var OutboundPayments = StripeResource.extend({
  update: stripeMethod45({
    method: "POST",
    fullPath: "/v1/test_helpers/treasury/outbound_payments/{id}"
  }),
  fail: stripeMethod45({
    method: "POST",
    fullPath: "/v1/test_helpers/treasury/outbound_payments/{id}/fail"
  }),
  post: stripeMethod45({
    method: "POST",
    fullPath: "/v1/test_helpers/treasury/outbound_payments/{id}/post"
  }),
  returnOutboundPayment: stripeMethod45({
    method: "POST",
    fullPath: "/v1/test_helpers/treasury/outbound_payments/{id}/return"
  })
});

// node_modules/stripe/esm/resources/Treasury/OutboundPayments.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod46 = StripeResource.method;
var OutboundPayments2 = StripeResource.extend({
  create: stripeMethod46({
    method: "POST",
    fullPath: "/v1/treasury/outbound_payments"
  }),
  retrieve: stripeMethod46({
    method: "GET",
    fullPath: "/v1/treasury/outbound_payments/{id}"
  }),
  list: stripeMethod46({
    method: "GET",
    fullPath: "/v1/treasury/outbound_payments",
    methodType: "list"
  }),
  cancel: stripeMethod46({
    method: "POST",
    fullPath: "/v1/treasury/outbound_payments/{id}/cancel"
  })
});

// node_modules/stripe/esm/resources/TestHelpers/Treasury/OutboundTransfers.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod47 = StripeResource.method;
var OutboundTransfers = StripeResource.extend({
  update: stripeMethod47({
    method: "POST",
    fullPath: "/v1/test_helpers/treasury/outbound_transfers/{outbound_transfer}"
  }),
  fail: stripeMethod47({
    method: "POST",
    fullPath: "/v1/test_helpers/treasury/outbound_transfers/{outbound_transfer}/fail"
  }),
  post: stripeMethod47({
    method: "POST",
    fullPath: "/v1/test_helpers/treasury/outbound_transfers/{outbound_transfer}/post"
  }),
  returnOutboundTransfer: stripeMethod47({
    method: "POST",
    fullPath: "/v1/test_helpers/treasury/outbound_transfers/{outbound_transfer}/return"
  })
});

// node_modules/stripe/esm/resources/Treasury/OutboundTransfers.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod48 = StripeResource.method;
var OutboundTransfers2 = StripeResource.extend({
  create: stripeMethod48({
    method: "POST",
    fullPath: "/v1/treasury/outbound_transfers"
  }),
  retrieve: stripeMethod48({
    method: "GET",
    fullPath: "/v1/treasury/outbound_transfers/{outbound_transfer}"
  }),
  list: stripeMethod48({
    method: "GET",
    fullPath: "/v1/treasury/outbound_transfers",
    methodType: "list"
  }),
  cancel: stripeMethod48({
    method: "POST",
    fullPath: "/v1/treasury/outbound_transfers/{outbound_transfer}/cancel"
  })
});

// node_modules/stripe/esm/resources/Radar/PaymentEvaluations.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod49 = StripeResource.method;
var PaymentEvaluations = StripeResource.extend({
  create: stripeMethod49({
    method: "POST",
    fullPath: "/v1/radar/payment_evaluations"
  })
});

// node_modules/stripe/esm/resources/Issuing/PersonalizationDesigns.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod50 = StripeResource.method;
var PersonalizationDesigns = StripeResource.extend({
  create: stripeMethod50({
    method: "POST",
    fullPath: "/v1/issuing/personalization_designs"
  }),
  retrieve: stripeMethod50({
    method: "GET",
    fullPath: "/v1/issuing/personalization_designs/{personalization_design}"
  }),
  update: stripeMethod50({
    method: "POST",
    fullPath: "/v1/issuing/personalization_designs/{personalization_design}"
  }),
  list: stripeMethod50({
    method: "GET",
    fullPath: "/v1/issuing/personalization_designs",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/TestHelpers/Issuing/PersonalizationDesigns.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod51 = StripeResource.method;
var PersonalizationDesigns2 = StripeResource.extend({
  activate: stripeMethod51({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/personalization_designs/{personalization_design}/activate"
  }),
  deactivate: stripeMethod51({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/personalization_designs/{personalization_design}/deactivate"
  }),
  reject: stripeMethod51({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/personalization_designs/{personalization_design}/reject"
  })
});

// node_modules/stripe/esm/resources/Issuing/PhysicalBundles.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod52 = StripeResource.method;
var PhysicalBundles = StripeResource.extend({
  retrieve: stripeMethod52({
    method: "GET",
    fullPath: "/v1/issuing/physical_bundles/{physical_bundle}"
  }),
  list: stripeMethod52({
    method: "GET",
    fullPath: "/v1/issuing/physical_bundles",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/Climate/Products.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod53 = StripeResource.method;
var Products = StripeResource.extend({
  retrieve: stripeMethod53({
    method: "GET",
    fullPath: "/v1/climate/products/{product}"
  }),
  list: stripeMethod53({
    method: "GET",
    fullPath: "/v1/climate/products",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/Terminal/Readers.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod54 = StripeResource.method;
var Readers = StripeResource.extend({
  create: stripeMethod54({ method: "POST", fullPath: "/v1/terminal/readers" }),
  retrieve: stripeMethod54({
    method: "GET",
    fullPath: "/v1/terminal/readers/{reader}"
  }),
  update: stripeMethod54({
    method: "POST",
    fullPath: "/v1/terminal/readers/{reader}"
  }),
  list: stripeMethod54({
    method: "GET",
    fullPath: "/v1/terminal/readers",
    methodType: "list"
  }),
  del: stripeMethod54({
    method: "DELETE",
    fullPath: "/v1/terminal/readers/{reader}"
  }),
  cancelAction: stripeMethod54({
    method: "POST",
    fullPath: "/v1/terminal/readers/{reader}/cancel_action"
  }),
  collectInputs: stripeMethod54({
    method: "POST",
    fullPath: "/v1/terminal/readers/{reader}/collect_inputs"
  }),
  collectPaymentMethod: stripeMethod54({
    method: "POST",
    fullPath: "/v1/terminal/readers/{reader}/collect_payment_method"
  }),
  confirmPaymentIntent: stripeMethod54({
    method: "POST",
    fullPath: "/v1/terminal/readers/{reader}/confirm_payment_intent"
  }),
  processPaymentIntent: stripeMethod54({
    method: "POST",
    fullPath: "/v1/terminal/readers/{reader}/process_payment_intent"
  }),
  processSetupIntent: stripeMethod54({
    method: "POST",
    fullPath: "/v1/terminal/readers/{reader}/process_setup_intent"
  }),
  refundPayment: stripeMethod54({
    method: "POST",
    fullPath: "/v1/terminal/readers/{reader}/refund_payment"
  }),
  setReaderDisplay: stripeMethod54({
    method: "POST",
    fullPath: "/v1/terminal/readers/{reader}/set_reader_display"
  })
});

// node_modules/stripe/esm/resources/TestHelpers/Terminal/Readers.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod55 = StripeResource.method;
var Readers2 = StripeResource.extend({
  presentPaymentMethod: stripeMethod55({
    method: "POST",
    fullPath: "/v1/test_helpers/terminal/readers/{reader}/present_payment_method"
  }),
  succeedInputCollection: stripeMethod55({
    method: "POST",
    fullPath: "/v1/test_helpers/terminal/readers/{reader}/succeed_input_collection"
  }),
  timeoutInputCollection: stripeMethod55({
    method: "POST",
    fullPath: "/v1/test_helpers/terminal/readers/{reader}/timeout_input_collection"
  })
});

// node_modules/stripe/esm/resources/TestHelpers/Treasury/ReceivedCredits.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod56 = StripeResource.method;
var ReceivedCredits = StripeResource.extend({
  create: stripeMethod56({
    method: "POST",
    fullPath: "/v1/test_helpers/treasury/received_credits"
  })
});

// node_modules/stripe/esm/resources/Treasury/ReceivedCredits.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod57 = StripeResource.method;
var ReceivedCredits2 = StripeResource.extend({
  retrieve: stripeMethod57({
    method: "GET",
    fullPath: "/v1/treasury/received_credits/{id}"
  }),
  list: stripeMethod57({
    method: "GET",
    fullPath: "/v1/treasury/received_credits",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/TestHelpers/Treasury/ReceivedDebits.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod58 = StripeResource.method;
var ReceivedDebits = StripeResource.extend({
  create: stripeMethod58({
    method: "POST",
    fullPath: "/v1/test_helpers/treasury/received_debits"
  })
});

// node_modules/stripe/esm/resources/Treasury/ReceivedDebits.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod59 = StripeResource.method;
var ReceivedDebits2 = StripeResource.extend({
  retrieve: stripeMethod59({
    method: "GET",
    fullPath: "/v1/treasury/received_debits/{id}"
  }),
  list: stripeMethod59({
    method: "GET",
    fullPath: "/v1/treasury/received_debits",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/TestHelpers/Refunds.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod60 = StripeResource.method;
var Refunds = StripeResource.extend({
  expire: stripeMethod60({
    method: "POST",
    fullPath: "/v1/test_helpers/refunds/{refund}/expire"
  })
});

// node_modules/stripe/esm/resources/Tax/Registrations.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod61 = StripeResource.method;
var Registrations = StripeResource.extend({
  create: stripeMethod61({ method: "POST", fullPath: "/v1/tax/registrations" }),
  retrieve: stripeMethod61({
    method: "GET",
    fullPath: "/v1/tax/registrations/{id}"
  }),
  update: stripeMethod61({
    method: "POST",
    fullPath: "/v1/tax/registrations/{id}"
  }),
  list: stripeMethod61({
    method: "GET",
    fullPath: "/v1/tax/registrations",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/Reporting/ReportRuns.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod62 = StripeResource.method;
var ReportRuns = StripeResource.extend({
  create: stripeMethod62({ method: "POST", fullPath: "/v1/reporting/report_runs" }),
  retrieve: stripeMethod62({
    method: "GET",
    fullPath: "/v1/reporting/report_runs/{report_run}"
  }),
  list: stripeMethod62({
    method: "GET",
    fullPath: "/v1/reporting/report_runs",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/Reporting/ReportTypes.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod63 = StripeResource.method;
var ReportTypes = StripeResource.extend({
  retrieve: stripeMethod63({
    method: "GET",
    fullPath: "/v1/reporting/report_types/{report_type}"
  }),
  list: stripeMethod63({
    method: "GET",
    fullPath: "/v1/reporting/report_types",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/Forwarding/Requests.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod64 = StripeResource.method;
var Requests = StripeResource.extend({
  create: stripeMethod64({ method: "POST", fullPath: "/v1/forwarding/requests" }),
  retrieve: stripeMethod64({
    method: "GET",
    fullPath: "/v1/forwarding/requests/{id}"
  }),
  list: stripeMethod64({
    method: "GET",
    fullPath: "/v1/forwarding/requests",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/Sigma/ScheduledQueryRuns.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod65 = StripeResource.method;
var ScheduledQueryRuns = StripeResource.extend({
  retrieve: stripeMethod65({
    method: "GET",
    fullPath: "/v1/sigma/scheduled_query_runs/{scheduled_query_run}"
  }),
  list: stripeMethod65({
    method: "GET",
    fullPath: "/v1/sigma/scheduled_query_runs",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/Apps/Secrets.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod66 = StripeResource.method;
var Secrets = StripeResource.extend({
  create: stripeMethod66({ method: "POST", fullPath: "/v1/apps/secrets" }),
  list: stripeMethod66({
    method: "GET",
    fullPath: "/v1/apps/secrets",
    methodType: "list"
  }),
  deleteWhere: stripeMethod66({
    method: "POST",
    fullPath: "/v1/apps/secrets/delete"
  }),
  find: stripeMethod66({ method: "GET", fullPath: "/v1/apps/secrets/find" })
});

// node_modules/stripe/esm/resources/BillingPortal/Sessions.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod67 = StripeResource.method;
var Sessions = StripeResource.extend({
  create: stripeMethod67({
    method: "POST",
    fullPath: "/v1/billing_portal/sessions"
  })
});

// node_modules/stripe/esm/resources/Checkout/Sessions.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod68 = StripeResource.method;
var Sessions2 = StripeResource.extend({
  create: stripeMethod68({ method: "POST", fullPath: "/v1/checkout/sessions" }),
  retrieve: stripeMethod68({
    method: "GET",
    fullPath: "/v1/checkout/sessions/{session}"
  }),
  update: stripeMethod68({
    method: "POST",
    fullPath: "/v1/checkout/sessions/{session}"
  }),
  list: stripeMethod68({
    method: "GET",
    fullPath: "/v1/checkout/sessions",
    methodType: "list"
  }),
  expire: stripeMethod68({
    method: "POST",
    fullPath: "/v1/checkout/sessions/{session}/expire"
  }),
  listLineItems: stripeMethod68({
    method: "GET",
    fullPath: "/v1/checkout/sessions/{session}/line_items",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/FinancialConnections/Sessions.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod69 = StripeResource.method;
var Sessions3 = StripeResource.extend({
  create: stripeMethod69({
    method: "POST",
    fullPath: "/v1/financial_connections/sessions"
  }),
  retrieve: stripeMethod69({
    method: "GET",
    fullPath: "/v1/financial_connections/sessions/{session}"
  })
});

// node_modules/stripe/esm/resources/Tax/Settings.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod70 = StripeResource.method;
var Settings = StripeResource.extend({
  retrieve: stripeMethod70({ method: "GET", fullPath: "/v1/tax/settings" }),
  update: stripeMethod70({ method: "POST", fullPath: "/v1/tax/settings" })
});

// node_modules/stripe/esm/resources/Climate/Suppliers.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod71 = StripeResource.method;
var Suppliers = StripeResource.extend({
  retrieve: stripeMethod71({
    method: "GET",
    fullPath: "/v1/climate/suppliers/{supplier}"
  }),
  list: stripeMethod71({
    method: "GET",
    fullPath: "/v1/climate/suppliers",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/TestHelpers/TestClocks.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod72 = StripeResource.method;
var TestClocks = StripeResource.extend({
  create: stripeMethod72({
    method: "POST",
    fullPath: "/v1/test_helpers/test_clocks"
  }),
  retrieve: stripeMethod72({
    method: "GET",
    fullPath: "/v1/test_helpers/test_clocks/{test_clock}"
  }),
  list: stripeMethod72({
    method: "GET",
    fullPath: "/v1/test_helpers/test_clocks",
    methodType: "list"
  }),
  del: stripeMethod72({
    method: "DELETE",
    fullPath: "/v1/test_helpers/test_clocks/{test_clock}"
  }),
  advance: stripeMethod72({
    method: "POST",
    fullPath: "/v1/test_helpers/test_clocks/{test_clock}/advance"
  })
});

// node_modules/stripe/esm/resources/Issuing/Tokens.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod73 = StripeResource.method;
var Tokens = StripeResource.extend({
  retrieve: stripeMethod73({
    method: "GET",
    fullPath: "/v1/issuing/tokens/{token}"
  }),
  update: stripeMethod73({
    method: "POST",
    fullPath: "/v1/issuing/tokens/{token}"
  }),
  list: stripeMethod73({
    method: "GET",
    fullPath: "/v1/issuing/tokens",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/Treasury/TransactionEntries.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod74 = StripeResource.method;
var TransactionEntries = StripeResource.extend({
  retrieve: stripeMethod74({
    method: "GET",
    fullPath: "/v1/treasury/transaction_entries/{id}"
  }),
  list: stripeMethod74({
    method: "GET",
    fullPath: "/v1/treasury/transaction_entries",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/FinancialConnections/Transactions.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod75 = StripeResource.method;
var Transactions = StripeResource.extend({
  retrieve: stripeMethod75({
    method: "GET",
    fullPath: "/v1/financial_connections/transactions/{transaction}"
  }),
  list: stripeMethod75({
    method: "GET",
    fullPath: "/v1/financial_connections/transactions",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/Issuing/Transactions.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod76 = StripeResource.method;
var Transactions2 = StripeResource.extend({
  retrieve: stripeMethod76({
    method: "GET",
    fullPath: "/v1/issuing/transactions/{transaction}"
  }),
  update: stripeMethod76({
    method: "POST",
    fullPath: "/v1/issuing/transactions/{transaction}"
  }),
  list: stripeMethod76({
    method: "GET",
    fullPath: "/v1/issuing/transactions",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/Tax/Transactions.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod77 = StripeResource.method;
var Transactions3 = StripeResource.extend({
  retrieve: stripeMethod77({
    method: "GET",
    fullPath: "/v1/tax/transactions/{transaction}"
  }),
  createFromCalculation: stripeMethod77({
    method: "POST",
    fullPath: "/v1/tax/transactions/create_from_calculation"
  }),
  createReversal: stripeMethod77({
    method: "POST",
    fullPath: "/v1/tax/transactions/create_reversal"
  }),
  listLineItems: stripeMethod77({
    method: "GET",
    fullPath: "/v1/tax/transactions/{transaction}/line_items",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/TestHelpers/Issuing/Transactions.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod78 = StripeResource.method;
var Transactions4 = StripeResource.extend({
  createForceCapture: stripeMethod78({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/transactions/create_force_capture"
  }),
  createUnlinkedRefund: stripeMethod78({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/transactions/create_unlinked_refund"
  }),
  refund: stripeMethod78({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/transactions/{transaction}/refund"
  })
});

// node_modules/stripe/esm/resources/Treasury/Transactions.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod79 = StripeResource.method;
var Transactions5 = StripeResource.extend({
  retrieve: stripeMethod79({
    method: "GET",
    fullPath: "/v1/treasury/transactions/{id}"
  }),
  list: stripeMethod79({
    method: "GET",
    fullPath: "/v1/treasury/transactions",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/Radar/ValueListItems.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod80 = StripeResource.method;
var ValueListItems = StripeResource.extend({
  create: stripeMethod80({
    method: "POST",
    fullPath: "/v1/radar/value_list_items"
  }),
  retrieve: stripeMethod80({
    method: "GET",
    fullPath: "/v1/radar/value_list_items/{item}"
  }),
  list: stripeMethod80({
    method: "GET",
    fullPath: "/v1/radar/value_list_items",
    methodType: "list"
  }),
  del: stripeMethod80({
    method: "DELETE",
    fullPath: "/v1/radar/value_list_items/{item}"
  })
});

// node_modules/stripe/esm/resources/Radar/ValueLists.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod81 = StripeResource.method;
var ValueLists = StripeResource.extend({
  create: stripeMethod81({ method: "POST", fullPath: "/v1/radar/value_lists" }),
  retrieve: stripeMethod81({
    method: "GET",
    fullPath: "/v1/radar/value_lists/{value_list}"
  }),
  update: stripeMethod81({
    method: "POST",
    fullPath: "/v1/radar/value_lists/{value_list}"
  }),
  list: stripeMethod81({
    method: "GET",
    fullPath: "/v1/radar/value_lists",
    methodType: "list"
  }),
  del: stripeMethod81({
    method: "DELETE",
    fullPath: "/v1/radar/value_lists/{value_list}"
  })
});

// node_modules/stripe/esm/resources/Identity/VerificationReports.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod82 = StripeResource.method;
var VerificationReports = StripeResource.extend({
  retrieve: stripeMethod82({
    method: "GET",
    fullPath: "/v1/identity/verification_reports/{report}"
  }),
  list: stripeMethod82({
    method: "GET",
    fullPath: "/v1/identity/verification_reports",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/Identity/VerificationSessions.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod83 = StripeResource.method;
var VerificationSessions = StripeResource.extend({
  create: stripeMethod83({
    method: "POST",
    fullPath: "/v1/identity/verification_sessions"
  }),
  retrieve: stripeMethod83({
    method: "GET",
    fullPath: "/v1/identity/verification_sessions/{session}"
  }),
  update: stripeMethod83({
    method: "POST",
    fullPath: "/v1/identity/verification_sessions/{session}"
  }),
  list: stripeMethod83({
    method: "GET",
    fullPath: "/v1/identity/verification_sessions",
    methodType: "list"
  }),
  cancel: stripeMethod83({
    method: "POST",
    fullPath: "/v1/identity/verification_sessions/{session}/cancel"
  }),
  redact: stripeMethod83({
    method: "POST",
    fullPath: "/v1/identity/verification_sessions/{session}/redact"
  })
});

// node_modules/stripe/esm/resources/Accounts.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod84 = StripeResource.method;
var Accounts3 = StripeResource.extend({
  create: stripeMethod84({ method: "POST", fullPath: "/v1/accounts" }),
  retrieve(id, ...args) {
    if (typeof id === "string") {
      return stripeMethod84({
        method: "GET",
        fullPath: "/v1/accounts/{id}"
      }).apply(this, [id, ...args]);
    } else {
      if (id === null || id === void 0) {
        [].shift.apply([id, ...args]);
      }
      return stripeMethod84({
        method: "GET",
        fullPath: "/v1/account"
      }).apply(this, [id, ...args]);
    }
  },
  update: stripeMethod84({ method: "POST", fullPath: "/v1/accounts/{account}" }),
  list: stripeMethod84({
    method: "GET",
    fullPath: "/v1/accounts",
    methodType: "list"
  }),
  del: stripeMethod84({ method: "DELETE", fullPath: "/v1/accounts/{account}" }),
  createExternalAccount: stripeMethod84({
    method: "POST",
    fullPath: "/v1/accounts/{account}/external_accounts"
  }),
  createLoginLink: stripeMethod84({
    method: "POST",
    fullPath: "/v1/accounts/{account}/login_links"
  }),
  createPerson: stripeMethod84({
    method: "POST",
    fullPath: "/v1/accounts/{account}/persons"
  }),
  deleteExternalAccount: stripeMethod84({
    method: "DELETE",
    fullPath: "/v1/accounts/{account}/external_accounts/{id}"
  }),
  deletePerson: stripeMethod84({
    method: "DELETE",
    fullPath: "/v1/accounts/{account}/persons/{person}"
  }),
  listCapabilities: stripeMethod84({
    method: "GET",
    fullPath: "/v1/accounts/{account}/capabilities",
    methodType: "list"
  }),
  listExternalAccounts: stripeMethod84({
    method: "GET",
    fullPath: "/v1/accounts/{account}/external_accounts",
    methodType: "list"
  }),
  listPersons: stripeMethod84({
    method: "GET",
    fullPath: "/v1/accounts/{account}/persons",
    methodType: "list"
  }),
  reject: stripeMethod84({
    method: "POST",
    fullPath: "/v1/accounts/{account}/reject"
  }),
  retrieveCurrent: stripeMethod84({ method: "GET", fullPath: "/v1/account" }),
  retrieveCapability: stripeMethod84({
    method: "GET",
    fullPath: "/v1/accounts/{account}/capabilities/{capability}"
  }),
  retrieveExternalAccount: stripeMethod84({
    method: "GET",
    fullPath: "/v1/accounts/{account}/external_accounts/{id}"
  }),
  retrievePerson: stripeMethod84({
    method: "GET",
    fullPath: "/v1/accounts/{account}/persons/{person}"
  }),
  updateCapability: stripeMethod84({
    method: "POST",
    fullPath: "/v1/accounts/{account}/capabilities/{capability}"
  }),
  updateExternalAccount: stripeMethod84({
    method: "POST",
    fullPath: "/v1/accounts/{account}/external_accounts/{id}"
  }),
  updatePerson: stripeMethod84({
    method: "POST",
    fullPath: "/v1/accounts/{account}/persons/{person}"
  })
});

// node_modules/stripe/esm/resources/AccountLinks.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod85 = StripeResource.method;
var AccountLinks2 = StripeResource.extend({
  create: stripeMethod85({ method: "POST", fullPath: "/v1/account_links" })
});

// node_modules/stripe/esm/resources/AccountSessions.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod86 = StripeResource.method;
var AccountSessions = StripeResource.extend({
  create: stripeMethod86({ method: "POST", fullPath: "/v1/account_sessions" })
});

// node_modules/stripe/esm/resources/ApplePayDomains.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod87 = StripeResource.method;
var ApplePayDomains = StripeResource.extend({
  create: stripeMethod87({ method: "POST", fullPath: "/v1/apple_pay/domains" }),
  retrieve: stripeMethod87({
    method: "GET",
    fullPath: "/v1/apple_pay/domains/{domain}"
  }),
  list: stripeMethod87({
    method: "GET",
    fullPath: "/v1/apple_pay/domains",
    methodType: "list"
  }),
  del: stripeMethod87({
    method: "DELETE",
    fullPath: "/v1/apple_pay/domains/{domain}"
  })
});

// node_modules/stripe/esm/resources/ApplicationFees.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod88 = StripeResource.method;
var ApplicationFees = StripeResource.extend({
  retrieve: stripeMethod88({
    method: "GET",
    fullPath: "/v1/application_fees/{id}"
  }),
  list: stripeMethod88({
    method: "GET",
    fullPath: "/v1/application_fees",
    methodType: "list"
  }),
  createRefund: stripeMethod88({
    method: "POST",
    fullPath: "/v1/application_fees/{id}/refunds"
  }),
  listRefunds: stripeMethod88({
    method: "GET",
    fullPath: "/v1/application_fees/{id}/refunds",
    methodType: "list"
  }),
  retrieveRefund: stripeMethod88({
    method: "GET",
    fullPath: "/v1/application_fees/{fee}/refunds/{id}"
  }),
  updateRefund: stripeMethod88({
    method: "POST",
    fullPath: "/v1/application_fees/{fee}/refunds/{id}"
  })
});

// node_modules/stripe/esm/resources/Balance.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod89 = StripeResource.method;
var Balance = StripeResource.extend({
  retrieve: stripeMethod89({ method: "GET", fullPath: "/v1/balance" })
});

// node_modules/stripe/esm/resources/BalanceSettings.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod90 = StripeResource.method;
var BalanceSettings = StripeResource.extend({
  retrieve: stripeMethod90({ method: "GET", fullPath: "/v1/balance_settings" }),
  update: stripeMethod90({ method: "POST", fullPath: "/v1/balance_settings" })
});

// node_modules/stripe/esm/resources/BalanceTransactions.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod91 = StripeResource.method;
var BalanceTransactions = StripeResource.extend({
  retrieve: stripeMethod91({
    method: "GET",
    fullPath: "/v1/balance_transactions/{id}"
  }),
  list: stripeMethod91({
    method: "GET",
    fullPath: "/v1/balance_transactions",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/Charges.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod92 = StripeResource.method;
var Charges = StripeResource.extend({
  create: stripeMethod92({ method: "POST", fullPath: "/v1/charges" }),
  retrieve: stripeMethod92({ method: "GET", fullPath: "/v1/charges/{charge}" }),
  update: stripeMethod92({ method: "POST", fullPath: "/v1/charges/{charge}" }),
  list: stripeMethod92({
    method: "GET",
    fullPath: "/v1/charges",
    methodType: "list"
  }),
  capture: stripeMethod92({
    method: "POST",
    fullPath: "/v1/charges/{charge}/capture"
  }),
  search: stripeMethod92({
    method: "GET",
    fullPath: "/v1/charges/search",
    methodType: "search"
  })
});

// node_modules/stripe/esm/resources/ConfirmationTokens.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod93 = StripeResource.method;
var ConfirmationTokens2 = StripeResource.extend({
  retrieve: stripeMethod93({
    method: "GET",
    fullPath: "/v1/confirmation_tokens/{confirmation_token}"
  })
});

// node_modules/stripe/esm/resources/CountrySpecs.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod94 = StripeResource.method;
var CountrySpecs = StripeResource.extend({
  retrieve: stripeMethod94({
    method: "GET",
    fullPath: "/v1/country_specs/{country}"
  }),
  list: stripeMethod94({
    method: "GET",
    fullPath: "/v1/country_specs",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/Coupons.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod95 = StripeResource.method;
var Coupons = StripeResource.extend({
  create: stripeMethod95({ method: "POST", fullPath: "/v1/coupons" }),
  retrieve: stripeMethod95({ method: "GET", fullPath: "/v1/coupons/{coupon}" }),
  update: stripeMethod95({ method: "POST", fullPath: "/v1/coupons/{coupon}" }),
  list: stripeMethod95({
    method: "GET",
    fullPath: "/v1/coupons",
    methodType: "list"
  }),
  del: stripeMethod95({ method: "DELETE", fullPath: "/v1/coupons/{coupon}" })
});

// node_modules/stripe/esm/resources/CreditNotes.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod96 = StripeResource.method;
var CreditNotes = StripeResource.extend({
  create: stripeMethod96({ method: "POST", fullPath: "/v1/credit_notes" }),
  retrieve: stripeMethod96({ method: "GET", fullPath: "/v1/credit_notes/{id}" }),
  update: stripeMethod96({ method: "POST", fullPath: "/v1/credit_notes/{id}" }),
  list: stripeMethod96({
    method: "GET",
    fullPath: "/v1/credit_notes",
    methodType: "list"
  }),
  listLineItems: stripeMethod96({
    method: "GET",
    fullPath: "/v1/credit_notes/{credit_note}/lines",
    methodType: "list"
  }),
  listPreviewLineItems: stripeMethod96({
    method: "GET",
    fullPath: "/v1/credit_notes/preview/lines",
    methodType: "list"
  }),
  preview: stripeMethod96({ method: "GET", fullPath: "/v1/credit_notes/preview" }),
  voidCreditNote: stripeMethod96({
    method: "POST",
    fullPath: "/v1/credit_notes/{id}/void"
  })
});

// node_modules/stripe/esm/resources/CustomerSessions.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod97 = StripeResource.method;
var CustomerSessions = StripeResource.extend({
  create: stripeMethod97({ method: "POST", fullPath: "/v1/customer_sessions" })
});

// node_modules/stripe/esm/resources/Customers.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod98 = StripeResource.method;
var Customers2 = StripeResource.extend({
  create: stripeMethod98({ method: "POST", fullPath: "/v1/customers" }),
  retrieve: stripeMethod98({ method: "GET", fullPath: "/v1/customers/{customer}" }),
  update: stripeMethod98({ method: "POST", fullPath: "/v1/customers/{customer}" }),
  list: stripeMethod98({
    method: "GET",
    fullPath: "/v1/customers",
    methodType: "list"
  }),
  del: stripeMethod98({ method: "DELETE", fullPath: "/v1/customers/{customer}" }),
  createBalanceTransaction: stripeMethod98({
    method: "POST",
    fullPath: "/v1/customers/{customer}/balance_transactions"
  }),
  createFundingInstructions: stripeMethod98({
    method: "POST",
    fullPath: "/v1/customers/{customer}/funding_instructions"
  }),
  createSource: stripeMethod98({
    method: "POST",
    fullPath: "/v1/customers/{customer}/sources"
  }),
  createTaxId: stripeMethod98({
    method: "POST",
    fullPath: "/v1/customers/{customer}/tax_ids"
  }),
  deleteDiscount: stripeMethod98({
    method: "DELETE",
    fullPath: "/v1/customers/{customer}/discount"
  }),
  deleteSource: stripeMethod98({
    method: "DELETE",
    fullPath: "/v1/customers/{customer}/sources/{id}"
  }),
  deleteTaxId: stripeMethod98({
    method: "DELETE",
    fullPath: "/v1/customers/{customer}/tax_ids/{id}"
  }),
  listBalanceTransactions: stripeMethod98({
    method: "GET",
    fullPath: "/v1/customers/{customer}/balance_transactions",
    methodType: "list"
  }),
  listCashBalanceTransactions: stripeMethod98({
    method: "GET",
    fullPath: "/v1/customers/{customer}/cash_balance_transactions",
    methodType: "list"
  }),
  listPaymentMethods: stripeMethod98({
    method: "GET",
    fullPath: "/v1/customers/{customer}/payment_methods",
    methodType: "list"
  }),
  listSources: stripeMethod98({
    method: "GET",
    fullPath: "/v1/customers/{customer}/sources",
    methodType: "list"
  }),
  listTaxIds: stripeMethod98({
    method: "GET",
    fullPath: "/v1/customers/{customer}/tax_ids",
    methodType: "list"
  }),
  retrieveBalanceTransaction: stripeMethod98({
    method: "GET",
    fullPath: "/v1/customers/{customer}/balance_transactions/{transaction}"
  }),
  retrieveCashBalance: stripeMethod98({
    method: "GET",
    fullPath: "/v1/customers/{customer}/cash_balance"
  }),
  retrieveCashBalanceTransaction: stripeMethod98({
    method: "GET",
    fullPath: "/v1/customers/{customer}/cash_balance_transactions/{transaction}"
  }),
  retrievePaymentMethod: stripeMethod98({
    method: "GET",
    fullPath: "/v1/customers/{customer}/payment_methods/{payment_method}"
  }),
  retrieveSource: stripeMethod98({
    method: "GET",
    fullPath: "/v1/customers/{customer}/sources/{id}"
  }),
  retrieveTaxId: stripeMethod98({
    method: "GET",
    fullPath: "/v1/customers/{customer}/tax_ids/{id}"
  }),
  search: stripeMethod98({
    method: "GET",
    fullPath: "/v1/customers/search",
    methodType: "search"
  }),
  updateBalanceTransaction: stripeMethod98({
    method: "POST",
    fullPath: "/v1/customers/{customer}/balance_transactions/{transaction}"
  }),
  updateCashBalance: stripeMethod98({
    method: "POST",
    fullPath: "/v1/customers/{customer}/cash_balance"
  }),
  updateSource: stripeMethod98({
    method: "POST",
    fullPath: "/v1/customers/{customer}/sources/{id}"
  }),
  verifySource: stripeMethod98({
    method: "POST",
    fullPath: "/v1/customers/{customer}/sources/{id}/verify"
  })
});

// node_modules/stripe/esm/resources/Disputes.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod99 = StripeResource.method;
var Disputes2 = StripeResource.extend({
  retrieve: stripeMethod99({ method: "GET", fullPath: "/v1/disputes/{dispute}" }),
  update: stripeMethod99({ method: "POST", fullPath: "/v1/disputes/{dispute}" }),
  list: stripeMethod99({
    method: "GET",
    fullPath: "/v1/disputes",
    methodType: "list"
  }),
  close: stripeMethod99({
    method: "POST",
    fullPath: "/v1/disputes/{dispute}/close"
  })
});

// node_modules/stripe/esm/resources/EphemeralKeys.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod100 = StripeResource.method;
var EphemeralKeys = StripeResource.extend({
  create: stripeMethod100({
    method: "POST",
    fullPath: "/v1/ephemeral_keys",
    validator: (data, options) => {
      if (!options.headers || !options.headers["Stripe-Version"]) {
        throw new Error("Passing apiVersion in a separate options hash is required to create an ephemeral key. See https://stripe.com/docs/api/versioning?lang=node");
      }
    }
  }),
  del: stripeMethod100({ method: "DELETE", fullPath: "/v1/ephemeral_keys/{key}" })
});

// node_modules/stripe/esm/resources/Events.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod101 = StripeResource.method;
var Events2 = StripeResource.extend({
  retrieve: stripeMethod101({ method: "GET", fullPath: "/v1/events/{id}" }),
  list: stripeMethod101({
    method: "GET",
    fullPath: "/v1/events",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/ExchangeRates.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod102 = StripeResource.method;
var ExchangeRates = StripeResource.extend({
  retrieve: stripeMethod102({
    method: "GET",
    fullPath: "/v1/exchange_rates/{rate_id}"
  }),
  list: stripeMethod102({
    method: "GET",
    fullPath: "/v1/exchange_rates",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/FileLinks.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod103 = StripeResource.method;
var FileLinks = StripeResource.extend({
  create: stripeMethod103({ method: "POST", fullPath: "/v1/file_links" }),
  retrieve: stripeMethod103({ method: "GET", fullPath: "/v1/file_links/{link}" }),
  update: stripeMethod103({ method: "POST", fullPath: "/v1/file_links/{link}" }),
  list: stripeMethod103({
    method: "GET",
    fullPath: "/v1/file_links",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/Files.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();

// node_modules/stripe/esm/multipart.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var multipartDataGenerator = /* @__PURE__ */ __name((method, data, headers) => {
  const segno = (Math.round(Math.random() * 1e16) + Math.round(Math.random() * 1e16)).toString();
  headers["Content-Type"] = `multipart/form-data; boundary=${segno}`;
  const textEncoder = new TextEncoder();
  let buffer = new Uint8Array(0);
  const endBuffer = textEncoder.encode("\r\n");
  function push(l) {
    const prevBuffer = buffer;
    const newBuffer = l instanceof Uint8Array ? l : new Uint8Array(textEncoder.encode(l));
    buffer = new Uint8Array(prevBuffer.length + newBuffer.length + 2);
    buffer.set(prevBuffer);
    buffer.set(newBuffer, prevBuffer.length);
    buffer.set(endBuffer, buffer.length - 2);
  }
  __name(push, "push");
  function q(s) {
    return `"${s.replace(/"|"/g, "%22").replace(/\r\n|\r|\n/g, " ")}"`;
  }
  __name(q, "q");
  const flattenedData = flattenAndStringify(data);
  for (const k in flattenedData) {
    if (!Object.prototype.hasOwnProperty.call(flattenedData, k)) {
      continue;
    }
    const v = flattenedData[k];
    push(`--${segno}`);
    if (Object.prototype.hasOwnProperty.call(v, "data")) {
      const typedEntry = v;
      push(`Content-Disposition: form-data; name=${q(k)}; filename=${q(typedEntry.name || "blob")}`);
      push(`Content-Type: ${typedEntry.type || "application/octet-stream"}`);
      push("");
      push(typedEntry.data);
    } else {
      push(`Content-Disposition: form-data; name=${q(k)}`);
      push("");
      push(v);
    }
  }
  push(`--${segno}--`);
  return buffer;
}, "multipartDataGenerator");
function multipartRequestDataProcessor(method, data, headers, callback) {
  data = data || {};
  if (method !== "POST") {
    return callback(null, queryStringifyRequestData(data));
  }
  this._stripe._platformFunctions.tryBufferData(data).then((bufferedData) => {
    const buffer = multipartDataGenerator(method, bufferedData, headers);
    return callback(null, buffer);
  }).catch((err) => callback(err, null));
}
__name(multipartRequestDataProcessor, "multipartRequestDataProcessor");

// node_modules/stripe/esm/resources/Files.js
var stripeMethod104 = StripeResource.method;
var Files = StripeResource.extend({
  create: stripeMethod104({
    method: "POST",
    fullPath: "/v1/files",
    headers: {
      "Content-Type": "multipart/form-data"
    },
    host: "files.stripe.com"
  }),
  retrieve: stripeMethod104({ method: "GET", fullPath: "/v1/files/{file}" }),
  list: stripeMethod104({
    method: "GET",
    fullPath: "/v1/files",
    methodType: "list"
  }),
  requestDataProcessor: multipartRequestDataProcessor
});

// node_modules/stripe/esm/resources/InvoiceItems.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod105 = StripeResource.method;
var InvoiceItems = StripeResource.extend({
  create: stripeMethod105({ method: "POST", fullPath: "/v1/invoiceitems" }),
  retrieve: stripeMethod105({
    method: "GET",
    fullPath: "/v1/invoiceitems/{invoiceitem}"
  }),
  update: stripeMethod105({
    method: "POST",
    fullPath: "/v1/invoiceitems/{invoiceitem}"
  }),
  list: stripeMethod105({
    method: "GET",
    fullPath: "/v1/invoiceitems",
    methodType: "list"
  }),
  del: stripeMethod105({
    method: "DELETE",
    fullPath: "/v1/invoiceitems/{invoiceitem}"
  })
});

// node_modules/stripe/esm/resources/InvoicePayments.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod106 = StripeResource.method;
var InvoicePayments = StripeResource.extend({
  retrieve: stripeMethod106({
    method: "GET",
    fullPath: "/v1/invoice_payments/{invoice_payment}"
  }),
  list: stripeMethod106({
    method: "GET",
    fullPath: "/v1/invoice_payments",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/InvoiceRenderingTemplates.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod107 = StripeResource.method;
var InvoiceRenderingTemplates = StripeResource.extend({
  retrieve: stripeMethod107({
    method: "GET",
    fullPath: "/v1/invoice_rendering_templates/{template}"
  }),
  list: stripeMethod107({
    method: "GET",
    fullPath: "/v1/invoice_rendering_templates",
    methodType: "list"
  }),
  archive: stripeMethod107({
    method: "POST",
    fullPath: "/v1/invoice_rendering_templates/{template}/archive"
  }),
  unarchive: stripeMethod107({
    method: "POST",
    fullPath: "/v1/invoice_rendering_templates/{template}/unarchive"
  })
});

// node_modules/stripe/esm/resources/Invoices.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod108 = StripeResource.method;
var Invoices = StripeResource.extend({
  create: stripeMethod108({ method: "POST", fullPath: "/v1/invoices" }),
  retrieve: stripeMethod108({ method: "GET", fullPath: "/v1/invoices/{invoice}" }),
  update: stripeMethod108({ method: "POST", fullPath: "/v1/invoices/{invoice}" }),
  list: stripeMethod108({
    method: "GET",
    fullPath: "/v1/invoices",
    methodType: "list"
  }),
  del: stripeMethod108({ method: "DELETE", fullPath: "/v1/invoices/{invoice}" }),
  addLines: stripeMethod108({
    method: "POST",
    fullPath: "/v1/invoices/{invoice}/add_lines"
  }),
  attachPayment: stripeMethod108({
    method: "POST",
    fullPath: "/v1/invoices/{invoice}/attach_payment"
  }),
  createPreview: stripeMethod108({
    method: "POST",
    fullPath: "/v1/invoices/create_preview"
  }),
  finalizeInvoice: stripeMethod108({
    method: "POST",
    fullPath: "/v1/invoices/{invoice}/finalize"
  }),
  listLineItems: stripeMethod108({
    method: "GET",
    fullPath: "/v1/invoices/{invoice}/lines",
    methodType: "list"
  }),
  markUncollectible: stripeMethod108({
    method: "POST",
    fullPath: "/v1/invoices/{invoice}/mark_uncollectible"
  }),
  pay: stripeMethod108({ method: "POST", fullPath: "/v1/invoices/{invoice}/pay" }),
  removeLines: stripeMethod108({
    method: "POST",
    fullPath: "/v1/invoices/{invoice}/remove_lines"
  }),
  search: stripeMethod108({
    method: "GET",
    fullPath: "/v1/invoices/search",
    methodType: "search"
  }),
  sendInvoice: stripeMethod108({
    method: "POST",
    fullPath: "/v1/invoices/{invoice}/send"
  }),
  updateLines: stripeMethod108({
    method: "POST",
    fullPath: "/v1/invoices/{invoice}/update_lines"
  }),
  updateLineItem: stripeMethod108({
    method: "POST",
    fullPath: "/v1/invoices/{invoice}/lines/{line_item_id}"
  }),
  voidInvoice: stripeMethod108({
    method: "POST",
    fullPath: "/v1/invoices/{invoice}/void"
  })
});

// node_modules/stripe/esm/resources/Mandates.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod109 = StripeResource.method;
var Mandates = StripeResource.extend({
  retrieve: stripeMethod109({ method: "GET", fullPath: "/v1/mandates/{mandate}" })
});

// node_modules/stripe/esm/resources/OAuth.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod110 = StripeResource.method;
var oAuthHost = "connect.stripe.com";
var OAuth = StripeResource.extend({
  basePath: "/",
  authorizeUrl(params, options) {
    params = params || {};
    options = options || {};
    let path = "oauth/authorize";
    if (options.express) {
      path = `express/${path}`;
    }
    if (!params.response_type) {
      params.response_type = "code";
    }
    if (!params.client_id) {
      params.client_id = this._stripe.getClientId();
    }
    if (!params.scope) {
      params.scope = "read_write";
    }
    return `https://${oAuthHost}/${path}?${queryStringifyRequestData(params)}`;
  },
  token: stripeMethod110({
    method: "POST",
    path: "oauth/token",
    host: oAuthHost
  }),
  deauthorize(spec, ...args) {
    if (!spec.client_id) {
      spec.client_id = this._stripe.getClientId();
    }
    return stripeMethod110({
      method: "POST",
      path: "oauth/deauthorize",
      host: oAuthHost
    }).apply(this, [spec, ...args]);
  }
});

// node_modules/stripe/esm/resources/PaymentAttemptRecords.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod111 = StripeResource.method;
var PaymentAttemptRecords = StripeResource.extend({
  retrieve: stripeMethod111({
    method: "GET",
    fullPath: "/v1/payment_attempt_records/{id}"
  }),
  list: stripeMethod111({
    method: "GET",
    fullPath: "/v1/payment_attempt_records",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/PaymentIntents.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod112 = StripeResource.method;
var PaymentIntents = StripeResource.extend({
  create: stripeMethod112({ method: "POST", fullPath: "/v1/payment_intents" }),
  retrieve: stripeMethod112({
    method: "GET",
    fullPath: "/v1/payment_intents/{intent}"
  }),
  update: stripeMethod112({
    method: "POST",
    fullPath: "/v1/payment_intents/{intent}"
  }),
  list: stripeMethod112({
    method: "GET",
    fullPath: "/v1/payment_intents",
    methodType: "list"
  }),
  applyCustomerBalance: stripeMethod112({
    method: "POST",
    fullPath: "/v1/payment_intents/{intent}/apply_customer_balance"
  }),
  cancel: stripeMethod112({
    method: "POST",
    fullPath: "/v1/payment_intents/{intent}/cancel"
  }),
  capture: stripeMethod112({
    method: "POST",
    fullPath: "/v1/payment_intents/{intent}/capture"
  }),
  confirm: stripeMethod112({
    method: "POST",
    fullPath: "/v1/payment_intents/{intent}/confirm"
  }),
  incrementAuthorization: stripeMethod112({
    method: "POST",
    fullPath: "/v1/payment_intents/{intent}/increment_authorization"
  }),
  listAmountDetailsLineItems: stripeMethod112({
    method: "GET",
    fullPath: "/v1/payment_intents/{intent}/amount_details_line_items",
    methodType: "list"
  }),
  search: stripeMethod112({
    method: "GET",
    fullPath: "/v1/payment_intents/search",
    methodType: "search"
  }),
  verifyMicrodeposits: stripeMethod112({
    method: "POST",
    fullPath: "/v1/payment_intents/{intent}/verify_microdeposits"
  })
});

// node_modules/stripe/esm/resources/PaymentLinks.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod113 = StripeResource.method;
var PaymentLinks = StripeResource.extend({
  create: stripeMethod113({ method: "POST", fullPath: "/v1/payment_links" }),
  retrieve: stripeMethod113({
    method: "GET",
    fullPath: "/v1/payment_links/{payment_link}"
  }),
  update: stripeMethod113({
    method: "POST",
    fullPath: "/v1/payment_links/{payment_link}"
  }),
  list: stripeMethod113({
    method: "GET",
    fullPath: "/v1/payment_links",
    methodType: "list"
  }),
  listLineItems: stripeMethod113({
    method: "GET",
    fullPath: "/v1/payment_links/{payment_link}/line_items",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/PaymentMethodConfigurations.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod114 = StripeResource.method;
var PaymentMethodConfigurations = StripeResource.extend({
  create: stripeMethod114({
    method: "POST",
    fullPath: "/v1/payment_method_configurations"
  }),
  retrieve: stripeMethod114({
    method: "GET",
    fullPath: "/v1/payment_method_configurations/{configuration}"
  }),
  update: stripeMethod114({
    method: "POST",
    fullPath: "/v1/payment_method_configurations/{configuration}"
  }),
  list: stripeMethod114({
    method: "GET",
    fullPath: "/v1/payment_method_configurations",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/PaymentMethodDomains.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod115 = StripeResource.method;
var PaymentMethodDomains = StripeResource.extend({
  create: stripeMethod115({
    method: "POST",
    fullPath: "/v1/payment_method_domains"
  }),
  retrieve: stripeMethod115({
    method: "GET",
    fullPath: "/v1/payment_method_domains/{payment_method_domain}"
  }),
  update: stripeMethod115({
    method: "POST",
    fullPath: "/v1/payment_method_domains/{payment_method_domain}"
  }),
  list: stripeMethod115({
    method: "GET",
    fullPath: "/v1/payment_method_domains",
    methodType: "list"
  }),
  validate: stripeMethod115({
    method: "POST",
    fullPath: "/v1/payment_method_domains/{payment_method_domain}/validate"
  })
});

// node_modules/stripe/esm/resources/PaymentMethods.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod116 = StripeResource.method;
var PaymentMethods = StripeResource.extend({
  create: stripeMethod116({ method: "POST", fullPath: "/v1/payment_methods" }),
  retrieve: stripeMethod116({
    method: "GET",
    fullPath: "/v1/payment_methods/{payment_method}"
  }),
  update: stripeMethod116({
    method: "POST",
    fullPath: "/v1/payment_methods/{payment_method}"
  }),
  list: stripeMethod116({
    method: "GET",
    fullPath: "/v1/payment_methods",
    methodType: "list"
  }),
  attach: stripeMethod116({
    method: "POST",
    fullPath: "/v1/payment_methods/{payment_method}/attach"
  }),
  detach: stripeMethod116({
    method: "POST",
    fullPath: "/v1/payment_methods/{payment_method}/detach"
  })
});

// node_modules/stripe/esm/resources/PaymentRecords.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod117 = StripeResource.method;
var PaymentRecords = StripeResource.extend({
  retrieve: stripeMethod117({ method: "GET", fullPath: "/v1/payment_records/{id}" }),
  reportPayment: stripeMethod117({
    method: "POST",
    fullPath: "/v1/payment_records/report_payment"
  }),
  reportPaymentAttempt: stripeMethod117({
    method: "POST",
    fullPath: "/v1/payment_records/{id}/report_payment_attempt"
  }),
  reportPaymentAttemptCanceled: stripeMethod117({
    method: "POST",
    fullPath: "/v1/payment_records/{id}/report_payment_attempt_canceled"
  }),
  reportPaymentAttemptFailed: stripeMethod117({
    method: "POST",
    fullPath: "/v1/payment_records/{id}/report_payment_attempt_failed"
  }),
  reportPaymentAttemptGuaranteed: stripeMethod117({
    method: "POST",
    fullPath: "/v1/payment_records/{id}/report_payment_attempt_guaranteed"
  }),
  reportPaymentAttemptInformational: stripeMethod117({
    method: "POST",
    fullPath: "/v1/payment_records/{id}/report_payment_attempt_informational"
  }),
  reportRefund: stripeMethod117({
    method: "POST",
    fullPath: "/v1/payment_records/{id}/report_refund"
  })
});

// node_modules/stripe/esm/resources/Payouts.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod118 = StripeResource.method;
var Payouts = StripeResource.extend({
  create: stripeMethod118({ method: "POST", fullPath: "/v1/payouts" }),
  retrieve: stripeMethod118({ method: "GET", fullPath: "/v1/payouts/{payout}" }),
  update: stripeMethod118({ method: "POST", fullPath: "/v1/payouts/{payout}" }),
  list: stripeMethod118({
    method: "GET",
    fullPath: "/v1/payouts",
    methodType: "list"
  }),
  cancel: stripeMethod118({
    method: "POST",
    fullPath: "/v1/payouts/{payout}/cancel"
  }),
  reverse: stripeMethod118({
    method: "POST",
    fullPath: "/v1/payouts/{payout}/reverse"
  })
});

// node_modules/stripe/esm/resources/Plans.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod119 = StripeResource.method;
var Plans = StripeResource.extend({
  create: stripeMethod119({ method: "POST", fullPath: "/v1/plans" }),
  retrieve: stripeMethod119({ method: "GET", fullPath: "/v1/plans/{plan}" }),
  update: stripeMethod119({ method: "POST", fullPath: "/v1/plans/{plan}" }),
  list: stripeMethod119({
    method: "GET",
    fullPath: "/v1/plans",
    methodType: "list"
  }),
  del: stripeMethod119({ method: "DELETE", fullPath: "/v1/plans/{plan}" })
});

// node_modules/stripe/esm/resources/Prices.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod120 = StripeResource.method;
var Prices = StripeResource.extend({
  create: stripeMethod120({ method: "POST", fullPath: "/v1/prices" }),
  retrieve: stripeMethod120({ method: "GET", fullPath: "/v1/prices/{price}" }),
  update: stripeMethod120({ method: "POST", fullPath: "/v1/prices/{price}" }),
  list: stripeMethod120({
    method: "GET",
    fullPath: "/v1/prices",
    methodType: "list"
  }),
  search: stripeMethod120({
    method: "GET",
    fullPath: "/v1/prices/search",
    methodType: "search"
  })
});

// node_modules/stripe/esm/resources/Products.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod121 = StripeResource.method;
var Products2 = StripeResource.extend({
  create: stripeMethod121({ method: "POST", fullPath: "/v1/products" }),
  retrieve: stripeMethod121({ method: "GET", fullPath: "/v1/products/{id}" }),
  update: stripeMethod121({ method: "POST", fullPath: "/v1/products/{id}" }),
  list: stripeMethod121({
    method: "GET",
    fullPath: "/v1/products",
    methodType: "list"
  }),
  del: stripeMethod121({ method: "DELETE", fullPath: "/v1/products/{id}" }),
  createFeature: stripeMethod121({
    method: "POST",
    fullPath: "/v1/products/{product}/features"
  }),
  deleteFeature: stripeMethod121({
    method: "DELETE",
    fullPath: "/v1/products/{product}/features/{id}"
  }),
  listFeatures: stripeMethod121({
    method: "GET",
    fullPath: "/v1/products/{product}/features",
    methodType: "list"
  }),
  retrieveFeature: stripeMethod121({
    method: "GET",
    fullPath: "/v1/products/{product}/features/{id}"
  }),
  search: stripeMethod121({
    method: "GET",
    fullPath: "/v1/products/search",
    methodType: "search"
  })
});

// node_modules/stripe/esm/resources/PromotionCodes.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod122 = StripeResource.method;
var PromotionCodes = StripeResource.extend({
  create: stripeMethod122({ method: "POST", fullPath: "/v1/promotion_codes" }),
  retrieve: stripeMethod122({
    method: "GET",
    fullPath: "/v1/promotion_codes/{promotion_code}"
  }),
  update: stripeMethod122({
    method: "POST",
    fullPath: "/v1/promotion_codes/{promotion_code}"
  }),
  list: stripeMethod122({
    method: "GET",
    fullPath: "/v1/promotion_codes",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/Quotes.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod123 = StripeResource.method;
var Quotes = StripeResource.extend({
  create: stripeMethod123({ method: "POST", fullPath: "/v1/quotes" }),
  retrieve: stripeMethod123({ method: "GET", fullPath: "/v1/quotes/{quote}" }),
  update: stripeMethod123({ method: "POST", fullPath: "/v1/quotes/{quote}" }),
  list: stripeMethod123({
    method: "GET",
    fullPath: "/v1/quotes",
    methodType: "list"
  }),
  accept: stripeMethod123({ method: "POST", fullPath: "/v1/quotes/{quote}/accept" }),
  cancel: stripeMethod123({ method: "POST", fullPath: "/v1/quotes/{quote}/cancel" }),
  finalizeQuote: stripeMethod123({
    method: "POST",
    fullPath: "/v1/quotes/{quote}/finalize"
  }),
  listComputedUpfrontLineItems: stripeMethod123({
    method: "GET",
    fullPath: "/v1/quotes/{quote}/computed_upfront_line_items",
    methodType: "list"
  }),
  listLineItems: stripeMethod123({
    method: "GET",
    fullPath: "/v1/quotes/{quote}/line_items",
    methodType: "list"
  }),
  pdf: stripeMethod123({
    method: "GET",
    fullPath: "/v1/quotes/{quote}/pdf",
    host: "files.stripe.com",
    streaming: true
  })
});

// node_modules/stripe/esm/resources/Refunds.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod124 = StripeResource.method;
var Refunds2 = StripeResource.extend({
  create: stripeMethod124({ method: "POST", fullPath: "/v1/refunds" }),
  retrieve: stripeMethod124({ method: "GET", fullPath: "/v1/refunds/{refund}" }),
  update: stripeMethod124({ method: "POST", fullPath: "/v1/refunds/{refund}" }),
  list: stripeMethod124({
    method: "GET",
    fullPath: "/v1/refunds",
    methodType: "list"
  }),
  cancel: stripeMethod124({
    method: "POST",
    fullPath: "/v1/refunds/{refund}/cancel"
  })
});

// node_modules/stripe/esm/resources/Reviews.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod125 = StripeResource.method;
var Reviews = StripeResource.extend({
  retrieve: stripeMethod125({ method: "GET", fullPath: "/v1/reviews/{review}" }),
  list: stripeMethod125({
    method: "GET",
    fullPath: "/v1/reviews",
    methodType: "list"
  }),
  approve: stripeMethod125({
    method: "POST",
    fullPath: "/v1/reviews/{review}/approve"
  })
});

// node_modules/stripe/esm/resources/SetupAttempts.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod126 = StripeResource.method;
var SetupAttempts = StripeResource.extend({
  list: stripeMethod126({
    method: "GET",
    fullPath: "/v1/setup_attempts",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/SetupIntents.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod127 = StripeResource.method;
var SetupIntents = StripeResource.extend({
  create: stripeMethod127({ method: "POST", fullPath: "/v1/setup_intents" }),
  retrieve: stripeMethod127({
    method: "GET",
    fullPath: "/v1/setup_intents/{intent}"
  }),
  update: stripeMethod127({
    method: "POST",
    fullPath: "/v1/setup_intents/{intent}"
  }),
  list: stripeMethod127({
    method: "GET",
    fullPath: "/v1/setup_intents",
    methodType: "list"
  }),
  cancel: stripeMethod127({
    method: "POST",
    fullPath: "/v1/setup_intents/{intent}/cancel"
  }),
  confirm: stripeMethod127({
    method: "POST",
    fullPath: "/v1/setup_intents/{intent}/confirm"
  }),
  verifyMicrodeposits: stripeMethod127({
    method: "POST",
    fullPath: "/v1/setup_intents/{intent}/verify_microdeposits"
  })
});

// node_modules/stripe/esm/resources/ShippingRates.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod128 = StripeResource.method;
var ShippingRates = StripeResource.extend({
  create: stripeMethod128({ method: "POST", fullPath: "/v1/shipping_rates" }),
  retrieve: stripeMethod128({
    method: "GET",
    fullPath: "/v1/shipping_rates/{shipping_rate_token}"
  }),
  update: stripeMethod128({
    method: "POST",
    fullPath: "/v1/shipping_rates/{shipping_rate_token}"
  }),
  list: stripeMethod128({
    method: "GET",
    fullPath: "/v1/shipping_rates",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/Sources.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod129 = StripeResource.method;
var Sources = StripeResource.extend({
  create: stripeMethod129({ method: "POST", fullPath: "/v1/sources" }),
  retrieve: stripeMethod129({ method: "GET", fullPath: "/v1/sources/{source}" }),
  update: stripeMethod129({ method: "POST", fullPath: "/v1/sources/{source}" }),
  listSourceTransactions: stripeMethod129({
    method: "GET",
    fullPath: "/v1/sources/{source}/source_transactions",
    methodType: "list"
  }),
  verify: stripeMethod129({
    method: "POST",
    fullPath: "/v1/sources/{source}/verify"
  })
});

// node_modules/stripe/esm/resources/SubscriptionItems.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod130 = StripeResource.method;
var SubscriptionItems = StripeResource.extend({
  create: stripeMethod130({ method: "POST", fullPath: "/v1/subscription_items" }),
  retrieve: stripeMethod130({
    method: "GET",
    fullPath: "/v1/subscription_items/{item}"
  }),
  update: stripeMethod130({
    method: "POST",
    fullPath: "/v1/subscription_items/{item}"
  }),
  list: stripeMethod130({
    method: "GET",
    fullPath: "/v1/subscription_items",
    methodType: "list"
  }),
  del: stripeMethod130({
    method: "DELETE",
    fullPath: "/v1/subscription_items/{item}"
  })
});

// node_modules/stripe/esm/resources/SubscriptionSchedules.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod131 = StripeResource.method;
var SubscriptionSchedules = StripeResource.extend({
  create: stripeMethod131({
    method: "POST",
    fullPath: "/v1/subscription_schedules"
  }),
  retrieve: stripeMethod131({
    method: "GET",
    fullPath: "/v1/subscription_schedules/{schedule}"
  }),
  update: stripeMethod131({
    method: "POST",
    fullPath: "/v1/subscription_schedules/{schedule}"
  }),
  list: stripeMethod131({
    method: "GET",
    fullPath: "/v1/subscription_schedules",
    methodType: "list"
  }),
  cancel: stripeMethod131({
    method: "POST",
    fullPath: "/v1/subscription_schedules/{schedule}/cancel"
  }),
  release: stripeMethod131({
    method: "POST",
    fullPath: "/v1/subscription_schedules/{schedule}/release"
  })
});

// node_modules/stripe/esm/resources/Subscriptions.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod132 = StripeResource.method;
var Subscriptions = StripeResource.extend({
  create: stripeMethod132({ method: "POST", fullPath: "/v1/subscriptions" }),
  retrieve: stripeMethod132({
    method: "GET",
    fullPath: "/v1/subscriptions/{subscription_exposed_id}"
  }),
  update: stripeMethod132({
    method: "POST",
    fullPath: "/v1/subscriptions/{subscription_exposed_id}"
  }),
  list: stripeMethod132({
    method: "GET",
    fullPath: "/v1/subscriptions",
    methodType: "list"
  }),
  cancel: stripeMethod132({
    method: "DELETE",
    fullPath: "/v1/subscriptions/{subscription_exposed_id}"
  }),
  deleteDiscount: stripeMethod132({
    method: "DELETE",
    fullPath: "/v1/subscriptions/{subscription_exposed_id}/discount"
  }),
  migrate: stripeMethod132({
    method: "POST",
    fullPath: "/v1/subscriptions/{subscription}/migrate"
  }),
  resume: stripeMethod132({
    method: "POST",
    fullPath: "/v1/subscriptions/{subscription}/resume"
  }),
  search: stripeMethod132({
    method: "GET",
    fullPath: "/v1/subscriptions/search",
    methodType: "search"
  })
});

// node_modules/stripe/esm/resources/TaxCodes.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod133 = StripeResource.method;
var TaxCodes = StripeResource.extend({
  retrieve: stripeMethod133({ method: "GET", fullPath: "/v1/tax_codes/{id}" }),
  list: stripeMethod133({
    method: "GET",
    fullPath: "/v1/tax_codes",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/TaxIds.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod134 = StripeResource.method;
var TaxIds = StripeResource.extend({
  create: stripeMethod134({ method: "POST", fullPath: "/v1/tax_ids" }),
  retrieve: stripeMethod134({ method: "GET", fullPath: "/v1/tax_ids/{id}" }),
  list: stripeMethod134({
    method: "GET",
    fullPath: "/v1/tax_ids",
    methodType: "list"
  }),
  del: stripeMethod134({ method: "DELETE", fullPath: "/v1/tax_ids/{id}" })
});

// node_modules/stripe/esm/resources/TaxRates.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod135 = StripeResource.method;
var TaxRates = StripeResource.extend({
  create: stripeMethod135({ method: "POST", fullPath: "/v1/tax_rates" }),
  retrieve: stripeMethod135({ method: "GET", fullPath: "/v1/tax_rates/{tax_rate}" }),
  update: stripeMethod135({ method: "POST", fullPath: "/v1/tax_rates/{tax_rate}" }),
  list: stripeMethod135({
    method: "GET",
    fullPath: "/v1/tax_rates",
    methodType: "list"
  })
});

// node_modules/stripe/esm/resources/Tokens.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod136 = StripeResource.method;
var Tokens2 = StripeResource.extend({
  create: stripeMethod136({ method: "POST", fullPath: "/v1/tokens" }),
  retrieve: stripeMethod136({ method: "GET", fullPath: "/v1/tokens/{token}" })
});

// node_modules/stripe/esm/resources/Topups.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod137 = StripeResource.method;
var Topups = StripeResource.extend({
  create: stripeMethod137({ method: "POST", fullPath: "/v1/topups" }),
  retrieve: stripeMethod137({ method: "GET", fullPath: "/v1/topups/{topup}" }),
  update: stripeMethod137({ method: "POST", fullPath: "/v1/topups/{topup}" }),
  list: stripeMethod137({
    method: "GET",
    fullPath: "/v1/topups",
    methodType: "list"
  }),
  cancel: stripeMethod137({ method: "POST", fullPath: "/v1/topups/{topup}/cancel" })
});

// node_modules/stripe/esm/resources/Transfers.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod138 = StripeResource.method;
var Transfers = StripeResource.extend({
  create: stripeMethod138({ method: "POST", fullPath: "/v1/transfers" }),
  retrieve: stripeMethod138({ method: "GET", fullPath: "/v1/transfers/{transfer}" }),
  update: stripeMethod138({ method: "POST", fullPath: "/v1/transfers/{transfer}" }),
  list: stripeMethod138({
    method: "GET",
    fullPath: "/v1/transfers",
    methodType: "list"
  }),
  createReversal: stripeMethod138({
    method: "POST",
    fullPath: "/v1/transfers/{id}/reversals"
  }),
  listReversals: stripeMethod138({
    method: "GET",
    fullPath: "/v1/transfers/{id}/reversals",
    methodType: "list"
  }),
  retrieveReversal: stripeMethod138({
    method: "GET",
    fullPath: "/v1/transfers/{transfer}/reversals/{id}"
  }),
  updateReversal: stripeMethod138({
    method: "POST",
    fullPath: "/v1/transfers/{transfer}/reversals/{id}"
  })
});

// node_modules/stripe/esm/resources/WebhookEndpoints.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var stripeMethod139 = StripeResource.method;
var WebhookEndpoints = StripeResource.extend({
  create: stripeMethod139({ method: "POST", fullPath: "/v1/webhook_endpoints" }),
  retrieve: stripeMethod139({
    method: "GET",
    fullPath: "/v1/webhook_endpoints/{webhook_endpoint}"
  }),
  update: stripeMethod139({
    method: "POST",
    fullPath: "/v1/webhook_endpoints/{webhook_endpoint}"
  }),
  list: stripeMethod139({
    method: "GET",
    fullPath: "/v1/webhook_endpoints",
    methodType: "list"
  }),
  del: stripeMethod139({
    method: "DELETE",
    fullPath: "/v1/webhook_endpoints/{webhook_endpoint}"
  })
});

// node_modules/stripe/esm/resources.js
var Apps = resourceNamespace("apps", { Secrets });
var Billing = resourceNamespace("billing", {
  Alerts,
  CreditBalanceSummary,
  CreditBalanceTransactions,
  CreditGrants,
  MeterEventAdjustments,
  MeterEvents,
  Meters
});
var BillingPortal = resourceNamespace("billingPortal", {
  Configurations,
  Sessions
});
var Checkout = resourceNamespace("checkout", {
  Sessions: Sessions2
});
var Climate = resourceNamespace("climate", {
  Orders,
  Products,
  Suppliers
});
var Entitlements = resourceNamespace("entitlements", {
  ActiveEntitlements,
  Features
});
var FinancialConnections = resourceNamespace("financialConnections", {
  Accounts,
  Sessions: Sessions3,
  Transactions
});
var Forwarding = resourceNamespace("forwarding", {
  Requests
});
var Identity = resourceNamespace("identity", {
  VerificationReports,
  VerificationSessions
});
var Issuing = resourceNamespace("issuing", {
  Authorizations,
  Cardholders,
  Cards,
  Disputes,
  PersonalizationDesigns,
  PhysicalBundles,
  Tokens,
  Transactions: Transactions2
});
var Radar = resourceNamespace("radar", {
  EarlyFraudWarnings,
  PaymentEvaluations,
  ValueListItems,
  ValueLists
});
var Reporting = resourceNamespace("reporting", {
  ReportRuns,
  ReportTypes
});
var Sigma = resourceNamespace("sigma", {
  ScheduledQueryRuns
});
var Tax = resourceNamespace("tax", {
  Associations,
  Calculations,
  Registrations,
  Settings,
  Transactions: Transactions3
});
var Terminal = resourceNamespace("terminal", {
  Configurations: Configurations2,
  ConnectionTokens,
  Locations,
  OnboardingLinks,
  Readers
});
var TestHelpers = resourceNamespace("testHelpers", {
  ConfirmationTokens,
  Customers,
  Refunds,
  TestClocks,
  Issuing: resourceNamespace("issuing", {
    Authorizations: Authorizations2,
    Cards: Cards2,
    PersonalizationDesigns: PersonalizationDesigns2,
    Transactions: Transactions4
  }),
  Terminal: resourceNamespace("terminal", {
    Readers: Readers2
  }),
  Treasury: resourceNamespace("treasury", {
    InboundTransfers,
    OutboundPayments,
    OutboundTransfers,
    ReceivedCredits,
    ReceivedDebits
  })
});
var Treasury = resourceNamespace("treasury", {
  CreditReversals,
  DebitReversals,
  FinancialAccounts,
  InboundTransfers: InboundTransfers2,
  OutboundPayments: OutboundPayments2,
  OutboundTransfers: OutboundTransfers2,
  ReceivedCredits: ReceivedCredits2,
  ReceivedDebits: ReceivedDebits2,
  TransactionEntries,
  Transactions: Transactions5
});
var V2 = resourceNamespace("v2", {
  Billing: resourceNamespace("billing", {
    MeterEventAdjustments: MeterEventAdjustments2,
    MeterEventSession,
    MeterEventStream,
    MeterEvents: MeterEvents2
  }),
  Core: resourceNamespace("core", {
    AccountLinks,
    AccountTokens,
    Accounts: Accounts2,
    EventDestinations,
    Events
  })
});

// node_modules/stripe/esm/stripe.core.js
var DEFAULT_HOST = "api.stripe.com";
var DEFAULT_PORT = "443";
var DEFAULT_BASE_PATH = "/v1/";
var DEFAULT_API_VERSION = ApiVersion;
var DEFAULT_TIMEOUT = 8e4;
var MAX_NETWORK_RETRY_DELAY_SEC = 5;
var INITIAL_NETWORK_RETRY_DELAY_SEC = 0.5;
var APP_INFO_PROPERTIES = ["name", "version", "url", "partner_id"];
var ALLOWED_CONFIG_PROPERTIES = [
  "authenticator",
  "apiVersion",
  "typescript",
  "maxNetworkRetries",
  "httpAgent",
  "httpClient",
  "timeout",
  "host",
  "port",
  "protocol",
  "telemetry",
  "appInfo",
  "stripeAccount",
  "stripeContext"
];
var defaultRequestSenderFactory = /* @__PURE__ */ __name((stripe2) => new RequestSender(stripe2, StripeResource.MAX_BUFFERED_REQUEST_METRICS), "defaultRequestSenderFactory");
function createStripe(platformFunctions, requestSender = defaultRequestSenderFactory) {
  Stripe2.PACKAGE_VERSION = "20.3.0";
  Stripe2.API_VERSION = ApiVersion;
  Stripe2.USER_AGENT = Object.assign({ bindings_version: Stripe2.PACKAGE_VERSION, lang: "node", publisher: "stripe", uname: null, typescript: false }, determineProcessUserAgentProperties());
  Stripe2.StripeResource = StripeResource;
  Stripe2.StripeContext = StripeContext;
  Stripe2.resources = resources_exports;
  Stripe2.HttpClient = HttpClient;
  Stripe2.HttpClientResponse = HttpClientResponse;
  Stripe2.CryptoProvider = CryptoProvider;
  Stripe2.webhooks = createWebhooks(platformFunctions);
  function Stripe2(key, config = {}) {
    if (!(this instanceof Stripe2)) {
      return new Stripe2(key, config);
    }
    const props = this._getPropsFromConfig(config);
    this._platformFunctions = platformFunctions;
    Object.defineProperty(this, "_emitter", {
      value: this._platformFunctions.createEmitter(),
      enumerable: false,
      configurable: false,
      writable: false
    });
    this.VERSION = Stripe2.PACKAGE_VERSION;
    this.on = this._emitter.on.bind(this._emitter);
    this.once = this._emitter.once.bind(this._emitter);
    this.off = this._emitter.removeListener.bind(this._emitter);
    const agent = props.httpAgent || null;
    this._api = {
      host: props.host || DEFAULT_HOST,
      port: props.port || DEFAULT_PORT,
      protocol: props.protocol || "https",
      basePath: DEFAULT_BASE_PATH,
      version: props.apiVersion || DEFAULT_API_VERSION,
      timeout: validateInteger("timeout", props.timeout, DEFAULT_TIMEOUT),
      maxNetworkRetries: validateInteger("maxNetworkRetries", props.maxNetworkRetries, 2),
      agent,
      httpClient: props.httpClient || (agent ? this._platformFunctions.createNodeHttpClient(agent) : this._platformFunctions.createDefaultHttpClient()),
      dev: false,
      stripeAccount: props.stripeAccount || null,
      stripeContext: props.stripeContext || null
    };
    const typescript = props.typescript || false;
    if (typescript !== Stripe2.USER_AGENT.typescript) {
      Stripe2.USER_AGENT.typescript = typescript;
    }
    if (props.appInfo) {
      this._setAppInfo(props.appInfo);
    }
    this._prepResources();
    this._setAuthenticator(key, props.authenticator);
    this.errors = Error_exports;
    this.webhooks = Stripe2.webhooks;
    this._prevRequestMetrics = [];
    this._enableTelemetry = props.telemetry !== false;
    this._requestSender = requestSender(this);
    this.StripeResource = Stripe2.StripeResource;
  }
  __name(Stripe2, "Stripe");
  Stripe2.errors = Error_exports;
  Stripe2.createNodeHttpClient = platformFunctions.createNodeHttpClient;
  Stripe2.createFetchHttpClient = platformFunctions.createFetchHttpClient;
  Stripe2.createNodeCryptoProvider = platformFunctions.createNodeCryptoProvider;
  Stripe2.createSubtleCryptoProvider = platformFunctions.createSubtleCryptoProvider;
  Stripe2.prototype = {
    // Properties are set in the constructor above
    _appInfo: void 0,
    on: null,
    off: null,
    once: null,
    VERSION: null,
    StripeResource: null,
    webhooks: null,
    errors: null,
    _api: null,
    _prevRequestMetrics: null,
    _emitter: null,
    _enableTelemetry: null,
    _requestSender: null,
    _platformFunctions: null,
    rawRequest(method, path, params, options) {
      return this._requestSender._rawRequest(method, path, params, options);
    },
    /**
     * @private
     */
    _setAuthenticator(key, authenticator) {
      if (key && authenticator) {
        throw new Error("Can't specify both apiKey and authenticator");
      }
      if (!key && !authenticator) {
        throw new Error("Neither apiKey nor config.authenticator provided");
      }
      this._authenticator = key ? createApiKeyAuthenticator(key) : authenticator;
    },
    /**
     * @private
     * This may be removed in the future.
     */
    _setAppInfo(info) {
      if (info && typeof info !== "object") {
        throw new Error("AppInfo must be an object.");
      }
      if (info && !info.name) {
        throw new Error("AppInfo.name is required");
      }
      info = info || {};
      this._appInfo = APP_INFO_PROPERTIES.reduce((accum, prop) => {
        if (typeof info[prop] == "string") {
          accum = accum || {};
          accum[prop] = info[prop];
        }
        return accum;
      }, {});
    },
    /**
     * @private
     * This may be removed in the future.
     */
    _setApiField(key, value) {
      this._api[key] = value;
    },
    /**
     * @private
     * Please open or upvote an issue at github.com/stripe/stripe-node
     * if you use this, detailing your use-case.
     *
     * It may be deprecated and removed in the future.
     */
    getApiField(key) {
      return this._api[key];
    },
    setClientId(clientId) {
      this._clientId = clientId;
    },
    getClientId() {
      return this._clientId;
    },
    /**
     * @private
     * Please open or upvote an issue at github.com/stripe/stripe-node
     * if you use this, detailing your use-case.
     *
     * It may be deprecated and removed in the future.
     */
    getConstant: (c) => {
      switch (c) {
        case "DEFAULT_HOST":
          return DEFAULT_HOST;
        case "DEFAULT_PORT":
          return DEFAULT_PORT;
        case "DEFAULT_BASE_PATH":
          return DEFAULT_BASE_PATH;
        case "DEFAULT_API_VERSION":
          return DEFAULT_API_VERSION;
        case "DEFAULT_TIMEOUT":
          return DEFAULT_TIMEOUT;
        case "MAX_NETWORK_RETRY_DELAY_SEC":
          return MAX_NETWORK_RETRY_DELAY_SEC;
        case "INITIAL_NETWORK_RETRY_DELAY_SEC":
          return INITIAL_NETWORK_RETRY_DELAY_SEC;
      }
      return Stripe2[c];
    },
    getMaxNetworkRetries() {
      return this.getApiField("maxNetworkRetries");
    },
    /**
     * @private
     * This may be removed in the future.
     */
    _setApiNumberField(prop, n, defaultVal) {
      const val = validateInteger(prop, n, defaultVal);
      this._setApiField(prop, val);
    },
    getMaxNetworkRetryDelay() {
      return MAX_NETWORK_RETRY_DELAY_SEC;
    },
    getInitialNetworkRetryDelay() {
      return INITIAL_NETWORK_RETRY_DELAY_SEC;
    },
    /**
     * @private
     * Please open or upvote an issue at github.com/stripe/stripe-node
     * if you use this, detailing your use-case.
     *
     * It may be deprecated and removed in the future.
     *
     * Gets a JSON version of a User-Agent and uses a cached version for a slight
     * speed advantage.
     */
    getClientUserAgent(cb) {
      return this.getClientUserAgentSeeded(Stripe2.USER_AGENT, cb);
    },
    /**
     * @private
     * Please open or upvote an issue at github.com/stripe/stripe-node
     * if you use this, detailing your use-case.
     *
     * It may be deprecated and removed in the future.
     *
     * Gets a JSON version of a User-Agent by encoding a seeded object and
     * fetching a uname from the system.
     */
    getClientUserAgentSeeded(seed, cb) {
      this._platformFunctions.getUname().then((uname) => {
        var _a;
        const userAgent = {};
        for (const field in seed) {
          if (!Object.prototype.hasOwnProperty.call(seed, field)) {
            continue;
          }
          userAgent[field] = encodeURIComponent((_a = seed[field]) !== null && _a !== void 0 ? _a : "null");
        }
        userAgent.uname = encodeURIComponent(uname || "UNKNOWN");
        const client = this.getApiField("httpClient");
        if (client) {
          userAgent.httplib = encodeURIComponent(client.getClientName());
        }
        if (this._appInfo) {
          userAgent.application = this._appInfo;
        }
        cb(JSON.stringify(userAgent));
      });
    },
    /**
     * @private
     * Please open or upvote an issue at github.com/stripe/stripe-node
     * if you use this, detailing your use-case.
     *
     * It may be deprecated and removed in the future.
     */
    getAppInfoAsString() {
      if (!this._appInfo) {
        return "";
      }
      let formatted = this._appInfo.name;
      if (this._appInfo.version) {
        formatted += `/${this._appInfo.version}`;
      }
      if (this._appInfo.url) {
        formatted += ` (${this._appInfo.url})`;
      }
      return formatted;
    },
    getTelemetryEnabled() {
      return this._enableTelemetry;
    },
    /**
     * @private
     * This may be removed in the future.
     */
    _prepResources() {
      for (const name in resources_exports) {
        if (!Object.prototype.hasOwnProperty.call(resources_exports, name)) {
          continue;
        }
        this[pascalToCamelCase(name)] = new resources_exports[name](this);
      }
    },
    /**
     * @private
     * This may be removed in the future.
     */
    _getPropsFromConfig(config) {
      if (!config) {
        return {};
      }
      const isString = typeof config === "string";
      const isObject2 = config === Object(config) && !Array.isArray(config);
      if (!isObject2 && !isString) {
        throw new Error("Config must either be an object or a string");
      }
      if (isString) {
        return {
          apiVersion: config
        };
      }
      const values = Object.keys(config).filter((value) => !ALLOWED_CONFIG_PROPERTIES.includes(value));
      if (values.length > 0) {
        throw new Error(`Config object may only contain the following: ${ALLOWED_CONFIG_PROPERTIES.join(", ")}`);
      }
      return config;
    },
    parseEventNotification(payload, header, secret, tolerance, cryptoProvider, receivedAt) {
      const eventNotification = this.webhooks.constructEvent(payload, header, secret, tolerance, cryptoProvider, receivedAt);
      if (eventNotification.context) {
        eventNotification.context = StripeContext.parse(eventNotification.context);
      }
      eventNotification.fetchEvent = () => {
        return this._requestSender._rawRequest("GET", `/v2/core/events/${eventNotification.id}`, void 0, {
          stripeContext: eventNotification.context
        }, ["fetch_event"]);
      };
      eventNotification.fetchRelatedObject = () => {
        if (!eventNotification.related_object) {
          return Promise.resolve(null);
        }
        return this._requestSender._rawRequest("GET", eventNotification.related_object.url, void 0, {
          stripeContext: eventNotification.context
        }, ["fetch_related_object"]);
      };
      return eventNotification;
    }
  };
  return Stripe2;
}
__name(createStripe, "createStripe");

// node_modules/stripe/esm/stripe.esm.worker.js
var Stripe = createStripe(new WebPlatformFunctions());
var stripe_esm_worker_default = Stripe;

// src/database.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var pool = null;
function initializeDatabase() {
  if (!pool && globalThis.DATABASE_URL) {
    console.log("Database connection would be initialized here");
  }
}
__name(initializeDatabase, "initializeDatabase");
async function storePaymentData(paymentData) {
  initializeDatabase();
  console.log("Storing payment data:", paymentData.checkout_session_id);
  const orderId = "order_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
  console.log("\u2705 Payment data stored successfully for order:", orderId);
  return orderId;
}
__name(storePaymentData, "storePaymentData");
async function storeWebhookEvent(event) {
  initializeDatabase();
  console.log("\u{1F4DD} Webhook event stored:", event.type);
  return true;
}
__name(storeWebhookEvent, "storeWebhookEvent");
async function storePaymentAttempt(attemptData) {
  initializeDatabase();
  console.log("\u{1F4B3} Payment attempt stored:", attemptData.event_type);
  return true;
}
__name(storePaymentAttempt, "storePaymentAttempt");
async function updateOrderStatus(orderId, status, metadata = null) {
  initializeDatabase();
  console.log("\u{1F4CB} Order status updated:", orderId, "->", status);
  return { id: orderId, status, metadata };
}
__name(updateOrderStatus, "updateOrderStatus");

// src/index.js
var replicate = null;
var stripe = null;
function initializeServices() {
  if (!replicate && globalThis.REPLICATE_API_TOKEN) {
    replicate = new import_replicate.default({
      auth: globalThis.REPLICATE_API_TOKEN
    });
  }
  if (!stripe && globalThis.STRIPE_SECRET_KEY) {
    stripe = new stripe_esm_worker_default(globalThis.STRIPE_SECRET_KEY);
  }
}
__name(initializeServices, "initializeServices");
var corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};
function handleCORS(request) {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders
    });
  }
  return null;
}
__name(handleCORS, "handleCORS");
async function parseMultipartFormData(request) {
  const formData = await request.formData();
  const file = formData.get("image");
  const style = formData.get("style");
  if (!file) {
    throw new Error("No image provided");
  }
  return { file, style };
}
__name(parseMultipartFormData, "parseMultipartFormData");
async function handleGenerate(request) {
  try {
    initializeServices();
    if (!replicate) {
      throw new Error("Replicate service not initialized");
    }
    const { file, style } = await parseMultipartFormData(request);
    console.log("\u{1F3A8} Starting Replicate InstantID generation with style:", style);
    const arrayBuffer = await file.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    const imageDataUrl = `data:${file.type};base64,${base64}`;
    let prompt = "professional portrait, high quality, detailed";
    switch (style) {
      case "futuristic":
        prompt = "futuristic sci-fi portrait, holographic elements, sleek metallic surfaces, advanced technology, glowing accents, space age aesthetic, high-tech environment, 8k, ultra detailed";
        break;
      case "cyberpunk":
        prompt = "cyberpunk style portrait, neon lights, dystopian city background, rain-soaked streets, vibrant pink and blue neon, high tech low life, detailed face, cinematic lighting, 8k";
        break;
      case "cowboy":
        prompt = "wild west cowboy portrait, western frontier style, leather and denim, desert landscape, vintage sepia tones, rugged aesthetic, old west atmosphere, detailed, cinematic";
        break;
      case "anime":
        prompt = "anime style portrait, Japanese animation aesthetic, vibrant colors, expressive eyes, clean linework, studio quality, detailed shading, professional anime art";
        break;
      case "renaissance":
        prompt = "renaissance oil painting portrait, classical art style, rich colors, dramatic chiaroscuro lighting, textured brushstrokes, museum quality, old master technique, baroque elegance";
        break;
      case "noir":
        prompt = "film noir style portrait, black and white, dramatic shadows, high contrast lighting, 1940s detective aesthetic, moody atmosphere, cinematic composition";
        break;
      default:
        prompt = "professional portrait, highly detailed, 8k, photorealistic";
    }
    console.log("\u{1F4E4} Sending to Replicate InstantID...");
    const prediction = await replicate.predictions.create({
      version: "2e4785a4d80dadf580077b2244c8d7c05d8e3faac04a04c02d8e099dd2876789",
      input: {
        image: imageDataUrl,
        prompt,
        negative_prompt: "low quality, bad anatomy, worst quality, blurry, distorted face, wrong gender",
        ip_adapter_scale: 0.8,
        controlnet_conditioning_scale: 0.8,
        num_inference_steps: 30,
        guidance_scale: 5
      }
    });
    console.log("\u23F3 Waiting for prediction...");
    const finalPrediction = await replicate.wait(prediction);
    console.log("\u2705 Replicate generation complete!");
    console.log("Prediction status:", finalPrediction.status);
    console.log("Prediction output:", finalPrediction.output);
    let imageUrl;
    if (Array.isArray(finalPrediction.output)) {
      imageUrl = finalPrediction.output[0];
    } else {
      imageUrl = finalPrediction.output;
    }
    console.log("Final image URL:", imageUrl);
    if (!imageUrl || typeof imageUrl !== "string") {
      throw new Error("Invalid output from Replicate: " + JSON.stringify(finalPrediction.output));
    }
    return new Response(JSON.stringify({ url: imageUrl }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error("\u274C Generation error:", error);
    return new Response(JSON.stringify({
      error: "Failed to generate image",
      details: error.message
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }
}
__name(handleGenerate, "handleGenerate");
async function handleCheckout(request) {
  try {
    initializeServices();
    if (!stripe) {
      throw new Error("Stripe service not initialized");
    }
    const { items, customerEmail } = await request.json();
    if (!items || !Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ error: "No items provided" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }
    const lineItems = items.map((item) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name,
          description: item.description || "",
          images: item.images || []
        },
        unit_amount: Math.round(item.amount * 100)
        // Convert to cents
      },
      quantity: item.quantity || 1
    }));
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `${new URL(request.url).origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${new URL(request.url).origin}/cancel`,
      customer_email: customerEmail,
      billing_address_collection: "auto",
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "DE", "FR", "ES", "IT", "NL", "BE", "AT", "CH", "SE", "NO", "DK", "FI", "PL", "CZ", "GR", "PT", "IE", "LU", "SK", "HU", "RO", "BG", "HR", "SI", "EE", "LV", "LT", "MT", "CY"]
      },
      payment_intent_data: {
        capture_method: "automatic"
      },
      automatic_tax: {
        enabled: true
      },
      allow_promotion_codes: true,
      phone_number_collection: {
        enabled: true
      }
    });
    return new Response(JSON.stringify({
      sessionId: session.id,
      url: session.url
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error("\u274C Stripe checkout session error:", error);
    return new Response(JSON.stringify({
      error: "Failed to create checkout session",
      details: error.message
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }
}
__name(handleCheckout, "handleCheckout");
async function handleVerifySession(request) {
  try {
    initializeServices();
    if (!stripe) {
      throw new Error("Stripe service not initialized");
    }
    const url = new URL(request.url);
    const sessionId = url.pathname.split("/").pop();
    if (!sessionId) {
      return new Response(JSON.stringify({ error: "Session ID is required" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "customer_details"]
    });
    const response = {
      session_id: session.id,
      payment_status: session.payment_status,
      customer_email: session.customer_details?.email || session.customer_email,
      amount_total: session.amount_total,
      currency: session.currency,
      created: session.created,
      metadata: session.metadata
    };
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error("\u274C Session verification error:", error);
    return new Response(JSON.stringify({
      error: "Failed to verify session",
      details: error.message
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }
}
__name(handleVerifySession, "handleVerifySession");
async function handleWebhook(request) {
  initializeServices();
  if (!stripe) {
    throw new Error("Stripe service not initialized");
  }
  const sig = request.headers.get("stripe-signature");
  const body = await request.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, globalThis.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.log(`\u274C Webhook signature verification failed.`, err.message);
    return new Response(`Webhook Error: ${err.message}`, {
      status: 400
    });
  }
  try {
    await storeWebhookEvent(event);
  } catch (error) {
    console.error("\u274C Error storing webhook event:", error);
  }
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      console.log("\u2705 Checkout session completed:", session.id);
      const paymentData = {
        checkout_session_id: session.id,
        payment_intent_id: session.payment_intent,
        customer_email: session.customer_details?.email || session.customer_email,
        customer_id: session.customer,
        amount_total: session.amount_total,
        currency: session.currency,
        payment_status: session.payment_status,
        billing_address: session.customer_details?.address || null,
        shipping_address: session.shipping?.address || null,
        metadata: session.metadata,
        items: session.line_items?.data?.map((item) => ({
          name: item.description,
          quantity: item.quantity,
          unit_amount: item.amount_total / item.quantity,
          total_amount: item.amount_total
        })) || []
      };
      try {
        const orderId = await storePaymentData(paymentData);
        await updateOrderStatus(orderId, "processing", {
          webhook_processed: true,
          processed_at: (/* @__PURE__ */ new Date()).toISOString()
        });
        console.log("\u{1F680} Order created and fulfillment triggered for order:", orderId);
      } catch (error) {
        console.error("\u274C Error processing completed checkout:", error);
        await storePaymentAttempt({
          checkout_session_id: session.id,
          payment_intent_id: session.payment_intent,
          event_type: event.type,
          status: "failed",
          amount: session.amount_total,
          currency: session.currency,
          error_message: error.message,
          raw_event: event
        });
      }
      break;
    case "payment_intent.succeeded":
      console.log("\u2705 PaymentIntent succeeded:", event.data.object.id);
      await storePaymentAttempt({
        checkout_session_id: null,
        payment_intent_id: event.data.object.id,
        event_type: event.type,
        status: "succeeded",
        amount: event.data.object.amount,
        currency: event.data.object.currency,
        error_message: null,
        raw_event: event
      });
      break;
    case "payment_intent.payment_failed":
      console.log("\u274C PaymentIntent failed:", event.data.object.id);
      await storePaymentAttempt({
        checkout_session_id: null,
        payment_intent_id: event.data.object.id,
        event_type: event.type,
        status: "failed",
        amount: event.data.object.amount,
        currency: event.data.object.currency,
        error_message: event.data.object.last_payment_error?.message,
        raw_event: event
      });
      break;
    case "checkout.session.expired":
      console.log("\u23F0 Checkout session expired:", event.data.object.id);
      await storePaymentAttempt({
        checkout_session_id: event.data.object.id,
        payment_intent_id: event.data.object.payment_intent,
        event_type: event.type,
        status: "expired",
        amount: event.data.object.amount_total,
        currency: event.data.object.currency,
        error_message: null,
        raw_event: event
      });
      break;
    default:
      console.log(`\u{1F50D} Unhandled event type: ${event.type}`);
  }
  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
}
__name(handleWebhook, "handleWebhook");
var src_default = {
  async fetch(request, env, ctx) {
    globalThis.REPLICATE_API_TOKEN = env.REPLICATE_API_TOKEN;
    globalThis.STRIPE_SECRET_KEY = env.STRIPE_SECRET_KEY;
    globalThis.STRIPE_WEBHOOK_SECRET = env.STRIPE_WEBHOOK_SECRET;
    globalThis.DATABASE_URL = env.DATABASE_URL;
    const url = new URL(request.url);
    const corsResponse = handleCORS(request);
    if (corsResponse)
      return corsResponse;
    if (url.pathname === "/api/generate" && request.method === "POST") {
      return await handleGenerate(request);
    }
    if (url.pathname === "/api/checkout" && request.method === "POST") {
      return await handleCheckout(request);
    }
    if (url.pathname.startsWith("/api/verify-session/") && request.method === "GET") {
      return await handleVerifySession(request);
    }
    if (url.pathname === "/api/stripe-webhook" && request.method === "POST") {
      return await handleWebhook(request);
    }
    return new Response("Not Found", {
      status: 404,
      headers: corsHeaders
    });
  }
};

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-uagYGm/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// node_modules/wrangler/templates/middleware/common.ts
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-uagYGm/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof __Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
__name(__Facade_ScheduledController__, "__Facade_ScheduledController__");
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init2) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init2.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = (request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    };
    #dispatcher = (type, init2) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init2.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    };
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
