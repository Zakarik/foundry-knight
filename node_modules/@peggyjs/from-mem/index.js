"use strict";

// Import or require module text from memory, rather than disk.  Runs
// in a node vm, very similar to how node loads modules.
//
// Ideas taken from the "module-from-string" and "eval" modules, neither of
// which were situated correctly to be used as-is.

const { Module } = require("node:module");
const fs = require("node:fs/promises");
const path = require("node:path");
const semver = require("semver");
const url = require("node:url");
const vm = require("node:vm");

// These already exist in a new, blank VM.  Date, JSON, NaN, etc.
// Things from the core language.
const vmGlobals = new Set(new vm
  .Script("Object.getOwnPropertyNames(globalThis)")
  .runInNewContext());
vmGlobals.add("global");
vmGlobals.add("globalThis");
vmGlobals.add("sys");

// These are the things that are normally in the environment, that vm doesn't
// make available.  This that you expect to be available in a node environment
// that aren't in the laguage itself.  There are a lot more things in this list
// than you expect, like setTimeout and structuredClone.
const neededKeys = Object
  .getOwnPropertyNames(global)
  .filter(k => !vmGlobals.has(k))
  .sort();
const globalContext = Object.fromEntries(
  neededKeys.map(k => [k, global[
    /** @type {keyof typeof global} */ (k)
  ]])
);

globalContext.console = console;

/**
 * @typedef {"amd"
 * | "bare"
 * | "cjs"
 * | "commonjs"
 * | "es"
 * | "es6"
 * | "esm"
 * | "globals"
 * | "guess"
 * | "mjs"
 * | "module"
 * | "umd" } SourceFormat
 */

/**
 * Options for how to process code.
 *
 * @typedef {object} FromMemOptions
 * @property {SourceFormat} [format="commonjs"] What format does the code
 *   have?  "guess" means to read the closest package.json file looking for
 *   the "type" key.  "globals", "amd", and "bare" are not actually supported.
 * @property {Record<string, any>} [env] If specified, use this instead of the
 *   current values in process.env.  Works if includeGlobals is false by
 *   creating an otherwise-empty process instance.
 * @property {string} filename What is the fully-qualified synthetic filename
 *   for the code?  Most important is the directory, which is used to find
 *   modules that the code import's or require's.
 * @property {Record<string, any>} [context={}] Variables to make availble in
 *   the global scope while code is being evaluated.
 * @property {boolean} [includeGlobals=true] Include the typical global
 *   properties that node gives to all modules.  (e.g. Buffer, process).
 * @property {number} [lineOffset=0] Specifies the line number offset that is
 *   displayed in stack traces produced by this script.
 * @property {number} [columnOffset=0] Specifies the first-line column number
 *   offset that is displayed in stack traces produced by this script.
 */

/**
 * Treat the given code as a node module as if require() had been called
 * on a file containing the code.
 *
 * @param {string} code Source code in commonjs format.
 * @param {string} dirname Used for __dirname.
 * @param {FromMemOptions} options
 * @returns {object} The module exports from code
 */
function requireString(code, dirname, options) {
  // @ts-expect-error This isn't correct.
  const m = new Module(options.filename, module); // Current module is parent.
  // This is the function that will be called by `require()` in the parser.
  m.require = Module.createRequire(options.filename);
  const script = new vm.Script(code, {
    filename: options.filename,
    lineOffset: options.lineOffset,
    columnOffset: options.columnOffset,
  });
  return script.runInNewContext({
    module: m,
    exports: m.exports,
    require: m.require,
    __dirname: dirname,
    __filename: options.filename,
    ...options.context,
  });
}

/**
 * If the given specifier starts with a ".", path.resolve it to the given
 * directory.  Otherwise, it's a fully-qualified path, a node internal
 * module name, an npm-provided module name, or a URL.
 *
 * @param {string} dirname Owning directory
 * @param {string} specifier String from the rightmost side of an import statement
 * @returns {string} Resolved path name or original string
 */
function resolveIfNeeded(dirname, specifier) {
  if (specifier.startsWith(".")) {
    specifier = new URL(specifier, dirname).toString();
  }
  return specifier;
}

/**
 * Treat the given code as a node module as if import had been called
 * on a file containing the code.
 *
 * @param {string} code Source code in es6 format.
 * @param {string} dirname Where the synthetic file would have lived.
 * @param {FromMemOptions} options
 * @returns {Promise<unknown>} The module exports from code
 */
async function importString(code, dirname, options) {
  if (!vm.SourceTextModule) {
    throw new Error("Start node with --experimental-vm-modules for this to work");
  }

  if (!semver.satisfies(process.version, ">=20.8")) {
    throw new Error("Requires node.js 20.8+ or 21.");
  }

  const fileUrl = options.filename.startsWith("file:")
    ? options.filename
    : url.pathToFileURL(options.filename).toString();
  const dirUrl = dirname.startsWith("file:")
    ? dirname + "/"
    : url.pathToFileURL(dirname).toString() + "/";

  const mod = new vm.SourceTextModule(code, {
    identifier: fileUrl,
    lineOffset: options.lineOffset,
    columnOffset: options.columnOffset,
    context: vm.createContext(options.context),
    initializeImportMeta(meta) {
      meta.url = fileUrl;
    },
    // @ts-expect-error Types in @types/node are wrong.
    importModuleDynamically(specifier) {
      return import(resolveIfNeeded(dirUrl, specifier));
    },
  });

  await mod.link(async(specifier, referencingModule) => {
    const resolvedSpecifier = resolveIfNeeded(dirUrl, specifier);
    const targetModule = await import(resolvedSpecifier);
    const exports = Object.keys(targetModule);

    // DO NOT change function to () =>, or `this` will be wrong.
    return new vm.SyntheticModule(exports, function() {
      for (const e of exports) {
        this.setExport(e, targetModule[e]);
      }
    }, {
      context: referencingModule.context,
    });
  });
  await mod.evaluate();
  return mod.namespace;
}

/**
 * @typedef {"commonjs"|"es"} ModuleType
 */

/**
 * @type Record<string, ModuleType>
 */
let cache = {};

/**
 * Figure out the module type for the given file.  If no package.json is
 * found, default to "commonjs".
 *
 * @param {string} filename Fully-qualified filename to start from.
 * @returns {Promise<ModuleType>}
 * @throws On invalid package.json
 */
async function guessModuleType(filename) {
  const fp = path.parse(filename);
  switch (fp.ext) {
    case ".cjs": return "commonjs";
    case ".mjs": return "es";
    default:
      // Fall-through
  }

  /** @type {ModuleType} */
  let res = "commonjs";
  let dir = fp.dir;
  let prev = undefined;
  const pending = [];
  while (dir !== prev) {
    const cached = cache[dir];
    if (cached) {
      return cached;
    }
    pending.push(dir);
    try {
      const pkg = await fs.readFile(path.join(dir, "package.json"), "utf8");
      const pkgj = JSON.parse(pkg);
      res = (pkgj.type === "module") ? "es" : "commonjs";
      break;
    } catch (err) {
      // If the file just didn't exist, keep going.
      if (/** @type {NodeJS.ErrnoException} */ (err).code !== "ENOENT") {
        throw err;
      }
    }
    prev = dir;
    dir = path.dirname(dir);
  }
  for (const p of pending) {
    cache[p] = res;
  }
  return res;
}

guessModuleType.clearCache = function clearCache() {
  cache = {};
};

/**
 * Import or require the given code from memory.  Knows about the different
 * Peggy output formats.  Returns the exports of the module.
 *
 * @param {string} code Code to import
 * @param {FromMemOptions} options Options.  Most important is filename.
 * @returns {Promise<unknown>} The evaluated code.
 */
async function fromMem(code, options) {
  options = {
    format: "commonjs",
    env: undefined,
    includeGlobals: true,
    lineOffset: 0,
    columnOffset: 0,
    ...options,
  };

  if (options.includeGlobals) {
    options.context = {
      ...globalContext,
      ...options.context,
    };
  } else {
    // Put this here instead of in the defaults above so that typescript
    // can see it.
    options.context = options.context || {};
  }

  // Make sure env changes don't stick.  This isn't a security measure, it's
  // to prevent mistakes.  There are probably a few other places where
  // mistakes are likely, and the same treatment should be given.
  if (options.context.process) {
    if (options.context.process === process) {
      options.context.process = { ...process };
    }
    options.context.process.env = options.env || {
      ...options.context.process.env,
    };
  } else if (options.env) {
    options.context.process = {
      version: process.version,
      env: { ...options.env },
    };
  }

  options.context.global = options.context;
  options.context.globalThis = options.context;

  if (!options.filename) {
    throw new TypeError("filename is required");
  }
  if (!options.filename.startsWith("file:")) {
    // File URLs must be already resolved.
    options.filename = path.resolve(options.filename);
  }
  const dirname = path.dirname(options.filename);

  if (options.format === "guess") {
    options.format = await guessModuleType(options.filename);
  }
  switch (options.format) {
    case "bare":
    case "cjs":
    case "commonjs":
    case "umd":
      return requireString(code, dirname, options);
    case "es":
    case "es6":
    case "esm":
    case "module":
    case "mjs":
      // Returns promise
      return importString(code, dirname, options);
    // I don't care enough about amd and globals to figure out how to load them.
    default:
      throw new Error(`Unsupported output format: "${options.format}"`);
  }
}

fromMem.guessModuleType = guessModuleType;

module.exports = fromMem;
