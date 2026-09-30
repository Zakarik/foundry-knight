# @peggyjs/from-mem

Execute some text in memory as if it was a file with a given name, so that all
of the imports/require's happen out of that directory's associated
node_modules directory or relative to where the file would have been.

This is NOT intended to be a security boundary.  In particular, all files
will be required or imported through the node module cache.

This code was originally a part of [peggy](https://peggyjs.org/), but was
refactored out when it was needed in a related project.  Several ideas in this
code came from the
[module-from-string](https://github.com/exuanbo/module-from-string) and
[eval](https://github.com/pierrec/node-eval) modules -- thanks to those authors.

## Installation

```sh
npm install @peggyjs/from-mem
```

## Usage

```js
import fromMem from "@peggyjs/from-mem"; // or require("@peggyjs/from-mem")
const mod = await fromMem(`
import foo from "../foo.js" // Loads ./test/foo.js
export function bar() {
  return foo() + 2;
}
`, {
  filename: path.join(__dirname, "test", "fixtures", "test.js"),
  format: "es",
});
mod.bar();
```

"filename" is the only required option.

```ts
fromMem(code: string, options: FromMemOptions): Promise<unknown>

export type FromMemOptions = {
    /**
     * What format does the code have?  "guess" means to read the closest
     * package.json file looking for the "type" key.  
     * Default: "commonjs".
     */
    format?: "bare" | "commonjs" | "es" | "globals" | "guess";
    /**
     * What is the fully-qualified synthetic filename for the code?  Most
     * important is the directory, which is used to find modules that the
     * code import's or require's.
     */
    filename: string;
    /**
     * Variables to make availble in the global scope while code is being evaluated.
     */
    context?: object;
    /**
     * Include the typical global properties that node gives to all modules.  
     * (e.g. Buffer, process). Default: true
     */
    includeGlobals?: boolean;
    /**
     * For type "globals", what name is exported from the module?
     */
    globalExport?: string;
    /**
     * Specifies the line number offset that is displayed in stack traces
     * produced by this script.
     */
    lineOffset?: number | undefined;
    /**
     * Specifies the first-line column number ffset that is displayed in stack
     * traces produced by this script.
     */
    columnOffset?: number | undefined;
};
```

## Caveats

- This module has a strong requirement for node 20.8+ at runtime when using
  the es6 format, due to a bug that crashes node in node's vm module that got
  fixed there and in 21.0.  There is a runtime check to prevent the crash.
- This module requires being run with the `--experimental-vm-modules` flag
  for node for the moment.  Hopefully, we will track changes to the API as
  they happen.

[![Tests](https://github.com/peggyjs/from-mem/actions/workflows/node.js.yml/badge.svg)](https://github.com/peggyjs/from-mem/actions/workflows/node.js.yml)
[![codecov](https://codecov.io/gh/peggyjs/from-mem/graph/badge.svg?token=CWQ7GSH0ZI)](https://codecov.io/gh/peggyjs/from-mem)
