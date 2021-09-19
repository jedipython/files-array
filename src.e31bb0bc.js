// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/regenerator-runtime/runtime.js":[function(require,module,exports) {
var define;
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = GeneratorFunctionPrototype;
  define(Gp, "constructor", GeneratorFunctionPrototype);
  define(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  });
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  define(Gp, iteratorSymbol, function() {
    return this;
  });

  define(Gp, "toString", function() {
    return "[object Generator]";
  });

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  typeof module === "object" ? module.exports : {}
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, in modern engines
  // we can explicitly access globalThis. In older engines we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}

},{}],"../node_modules/near-api-js/lib/key_stores/keystore.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyStore = void 0;
/**
 * KeyStores are passed to {@link Near} via {@link NearConfig}
 * and are used by the {@link InMemorySigner} to sign transactions.
 *
 * @example {@link connect}
 */
class KeyStore {
}
exports.KeyStore = KeyStore;

},{}],"../node_modules/parcel-bundler/src/builtins/_empty.js":[function(require,module,exports) {

},{}],"../node_modules/tweetnacl/nacl-fast.js":[function(require,module,exports) {
(function(nacl) {
'use strict';

// Ported in 2014 by Dmitry Chestnykh and Devi Mandiri.
// Public domain.
//
// Implementation derived from TweetNaCl version 20140427.
// See for details: http://tweetnacl.cr.yp.to/

var gf = function(init) {
  var i, r = new Float64Array(16);
  if (init) for (i = 0; i < init.length; i++) r[i] = init[i];
  return r;
};

//  Pluggable, initialized in high-level API below.
var randombytes = function(/* x, n */) { throw new Error('no PRNG'); };

var _0 = new Uint8Array(16);
var _9 = new Uint8Array(32); _9[0] = 9;

var gf0 = gf(),
    gf1 = gf([1]),
    _121665 = gf([0xdb41, 1]),
    D = gf([0x78a3, 0x1359, 0x4dca, 0x75eb, 0xd8ab, 0x4141, 0x0a4d, 0x0070, 0xe898, 0x7779, 0x4079, 0x8cc7, 0xfe73, 0x2b6f, 0x6cee, 0x5203]),
    D2 = gf([0xf159, 0x26b2, 0x9b94, 0xebd6, 0xb156, 0x8283, 0x149a, 0x00e0, 0xd130, 0xeef3, 0x80f2, 0x198e, 0xfce7, 0x56df, 0xd9dc, 0x2406]),
    X = gf([0xd51a, 0x8f25, 0x2d60, 0xc956, 0xa7b2, 0x9525, 0xc760, 0x692c, 0xdc5c, 0xfdd6, 0xe231, 0xc0a4, 0x53fe, 0xcd6e, 0x36d3, 0x2169]),
    Y = gf([0x6658, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666]),
    I = gf([0xa0b0, 0x4a0e, 0x1b27, 0xc4ee, 0xe478, 0xad2f, 0x1806, 0x2f43, 0xd7a7, 0x3dfb, 0x0099, 0x2b4d, 0xdf0b, 0x4fc1, 0x2480, 0x2b83]);

function ts64(x, i, h, l) {
  x[i]   = (h >> 24) & 0xff;
  x[i+1] = (h >> 16) & 0xff;
  x[i+2] = (h >>  8) & 0xff;
  x[i+3] = h & 0xff;
  x[i+4] = (l >> 24)  & 0xff;
  x[i+5] = (l >> 16)  & 0xff;
  x[i+6] = (l >>  8)  & 0xff;
  x[i+7] = l & 0xff;
}

function vn(x, xi, y, yi, n) {
  var i,d = 0;
  for (i = 0; i < n; i++) d |= x[xi+i]^y[yi+i];
  return (1 & ((d - 1) >>> 8)) - 1;
}

function crypto_verify_16(x, xi, y, yi) {
  return vn(x,xi,y,yi,16);
}

function crypto_verify_32(x, xi, y, yi) {
  return vn(x,xi,y,yi,32);
}

function core_salsa20(o, p, k, c) {
  var j0  = c[ 0] & 0xff | (c[ 1] & 0xff)<<8 | (c[ 2] & 0xff)<<16 | (c[ 3] & 0xff)<<24,
      j1  = k[ 0] & 0xff | (k[ 1] & 0xff)<<8 | (k[ 2] & 0xff)<<16 | (k[ 3] & 0xff)<<24,
      j2  = k[ 4] & 0xff | (k[ 5] & 0xff)<<8 | (k[ 6] & 0xff)<<16 | (k[ 7] & 0xff)<<24,
      j3  = k[ 8] & 0xff | (k[ 9] & 0xff)<<8 | (k[10] & 0xff)<<16 | (k[11] & 0xff)<<24,
      j4  = k[12] & 0xff | (k[13] & 0xff)<<8 | (k[14] & 0xff)<<16 | (k[15] & 0xff)<<24,
      j5  = c[ 4] & 0xff | (c[ 5] & 0xff)<<8 | (c[ 6] & 0xff)<<16 | (c[ 7] & 0xff)<<24,
      j6  = p[ 0] & 0xff | (p[ 1] & 0xff)<<8 | (p[ 2] & 0xff)<<16 | (p[ 3] & 0xff)<<24,
      j7  = p[ 4] & 0xff | (p[ 5] & 0xff)<<8 | (p[ 6] & 0xff)<<16 | (p[ 7] & 0xff)<<24,
      j8  = p[ 8] & 0xff | (p[ 9] & 0xff)<<8 | (p[10] & 0xff)<<16 | (p[11] & 0xff)<<24,
      j9  = p[12] & 0xff | (p[13] & 0xff)<<8 | (p[14] & 0xff)<<16 | (p[15] & 0xff)<<24,
      j10 = c[ 8] & 0xff | (c[ 9] & 0xff)<<8 | (c[10] & 0xff)<<16 | (c[11] & 0xff)<<24,
      j11 = k[16] & 0xff | (k[17] & 0xff)<<8 | (k[18] & 0xff)<<16 | (k[19] & 0xff)<<24,
      j12 = k[20] & 0xff | (k[21] & 0xff)<<8 | (k[22] & 0xff)<<16 | (k[23] & 0xff)<<24,
      j13 = k[24] & 0xff | (k[25] & 0xff)<<8 | (k[26] & 0xff)<<16 | (k[27] & 0xff)<<24,
      j14 = k[28] & 0xff | (k[29] & 0xff)<<8 | (k[30] & 0xff)<<16 | (k[31] & 0xff)<<24,
      j15 = c[12] & 0xff | (c[13] & 0xff)<<8 | (c[14] & 0xff)<<16 | (c[15] & 0xff)<<24;

  var x0 = j0, x1 = j1, x2 = j2, x3 = j3, x4 = j4, x5 = j5, x6 = j6, x7 = j7,
      x8 = j8, x9 = j9, x10 = j10, x11 = j11, x12 = j12, x13 = j13, x14 = j14,
      x15 = j15, u;

  for (var i = 0; i < 20; i += 2) {
    u = x0 + x12 | 0;
    x4 ^= u<<7 | u>>>(32-7);
    u = x4 + x0 | 0;
    x8 ^= u<<9 | u>>>(32-9);
    u = x8 + x4 | 0;
    x12 ^= u<<13 | u>>>(32-13);
    u = x12 + x8 | 0;
    x0 ^= u<<18 | u>>>(32-18);

    u = x5 + x1 | 0;
    x9 ^= u<<7 | u>>>(32-7);
    u = x9 + x5 | 0;
    x13 ^= u<<9 | u>>>(32-9);
    u = x13 + x9 | 0;
    x1 ^= u<<13 | u>>>(32-13);
    u = x1 + x13 | 0;
    x5 ^= u<<18 | u>>>(32-18);

    u = x10 + x6 | 0;
    x14 ^= u<<7 | u>>>(32-7);
    u = x14 + x10 | 0;
    x2 ^= u<<9 | u>>>(32-9);
    u = x2 + x14 | 0;
    x6 ^= u<<13 | u>>>(32-13);
    u = x6 + x2 | 0;
    x10 ^= u<<18 | u>>>(32-18);

    u = x15 + x11 | 0;
    x3 ^= u<<7 | u>>>(32-7);
    u = x3 + x15 | 0;
    x7 ^= u<<9 | u>>>(32-9);
    u = x7 + x3 | 0;
    x11 ^= u<<13 | u>>>(32-13);
    u = x11 + x7 | 0;
    x15 ^= u<<18 | u>>>(32-18);

    u = x0 + x3 | 0;
    x1 ^= u<<7 | u>>>(32-7);
    u = x1 + x0 | 0;
    x2 ^= u<<9 | u>>>(32-9);
    u = x2 + x1 | 0;
    x3 ^= u<<13 | u>>>(32-13);
    u = x3 + x2 | 0;
    x0 ^= u<<18 | u>>>(32-18);

    u = x5 + x4 | 0;
    x6 ^= u<<7 | u>>>(32-7);
    u = x6 + x5 | 0;
    x7 ^= u<<9 | u>>>(32-9);
    u = x7 + x6 | 0;
    x4 ^= u<<13 | u>>>(32-13);
    u = x4 + x7 | 0;
    x5 ^= u<<18 | u>>>(32-18);

    u = x10 + x9 | 0;
    x11 ^= u<<7 | u>>>(32-7);
    u = x11 + x10 | 0;
    x8 ^= u<<9 | u>>>(32-9);
    u = x8 + x11 | 0;
    x9 ^= u<<13 | u>>>(32-13);
    u = x9 + x8 | 0;
    x10 ^= u<<18 | u>>>(32-18);

    u = x15 + x14 | 0;
    x12 ^= u<<7 | u>>>(32-7);
    u = x12 + x15 | 0;
    x13 ^= u<<9 | u>>>(32-9);
    u = x13 + x12 | 0;
    x14 ^= u<<13 | u>>>(32-13);
    u = x14 + x13 | 0;
    x15 ^= u<<18 | u>>>(32-18);
  }
   x0 =  x0 +  j0 | 0;
   x1 =  x1 +  j1 | 0;
   x2 =  x2 +  j2 | 0;
   x3 =  x3 +  j3 | 0;
   x4 =  x4 +  j4 | 0;
   x5 =  x5 +  j5 | 0;
   x6 =  x6 +  j6 | 0;
   x7 =  x7 +  j7 | 0;
   x8 =  x8 +  j8 | 0;
   x9 =  x9 +  j9 | 0;
  x10 = x10 + j10 | 0;
  x11 = x11 + j11 | 0;
  x12 = x12 + j12 | 0;
  x13 = x13 + j13 | 0;
  x14 = x14 + j14 | 0;
  x15 = x15 + j15 | 0;

  o[ 0] = x0 >>>  0 & 0xff;
  o[ 1] = x0 >>>  8 & 0xff;
  o[ 2] = x0 >>> 16 & 0xff;
  o[ 3] = x0 >>> 24 & 0xff;

  o[ 4] = x1 >>>  0 & 0xff;
  o[ 5] = x1 >>>  8 & 0xff;
  o[ 6] = x1 >>> 16 & 0xff;
  o[ 7] = x1 >>> 24 & 0xff;

  o[ 8] = x2 >>>  0 & 0xff;
  o[ 9] = x2 >>>  8 & 0xff;
  o[10] = x2 >>> 16 & 0xff;
  o[11] = x2 >>> 24 & 0xff;

  o[12] = x3 >>>  0 & 0xff;
  o[13] = x3 >>>  8 & 0xff;
  o[14] = x3 >>> 16 & 0xff;
  o[15] = x3 >>> 24 & 0xff;

  o[16] = x4 >>>  0 & 0xff;
  o[17] = x4 >>>  8 & 0xff;
  o[18] = x4 >>> 16 & 0xff;
  o[19] = x4 >>> 24 & 0xff;

  o[20] = x5 >>>  0 & 0xff;
  o[21] = x5 >>>  8 & 0xff;
  o[22] = x5 >>> 16 & 0xff;
  o[23] = x5 >>> 24 & 0xff;

  o[24] = x6 >>>  0 & 0xff;
  o[25] = x6 >>>  8 & 0xff;
  o[26] = x6 >>> 16 & 0xff;
  o[27] = x6 >>> 24 & 0xff;

  o[28] = x7 >>>  0 & 0xff;
  o[29] = x7 >>>  8 & 0xff;
  o[30] = x7 >>> 16 & 0xff;
  o[31] = x7 >>> 24 & 0xff;

  o[32] = x8 >>>  0 & 0xff;
  o[33] = x8 >>>  8 & 0xff;
  o[34] = x8 >>> 16 & 0xff;
  o[35] = x8 >>> 24 & 0xff;

  o[36] = x9 >>>  0 & 0xff;
  o[37] = x9 >>>  8 & 0xff;
  o[38] = x9 >>> 16 & 0xff;
  o[39] = x9 >>> 24 & 0xff;

  o[40] = x10 >>>  0 & 0xff;
  o[41] = x10 >>>  8 & 0xff;
  o[42] = x10 >>> 16 & 0xff;
  o[43] = x10 >>> 24 & 0xff;

  o[44] = x11 >>>  0 & 0xff;
  o[45] = x11 >>>  8 & 0xff;
  o[46] = x11 >>> 16 & 0xff;
  o[47] = x11 >>> 24 & 0xff;

  o[48] = x12 >>>  0 & 0xff;
  o[49] = x12 >>>  8 & 0xff;
  o[50] = x12 >>> 16 & 0xff;
  o[51] = x12 >>> 24 & 0xff;

  o[52] = x13 >>>  0 & 0xff;
  o[53] = x13 >>>  8 & 0xff;
  o[54] = x13 >>> 16 & 0xff;
  o[55] = x13 >>> 24 & 0xff;

  o[56] = x14 >>>  0 & 0xff;
  o[57] = x14 >>>  8 & 0xff;
  o[58] = x14 >>> 16 & 0xff;
  o[59] = x14 >>> 24 & 0xff;

  o[60] = x15 >>>  0 & 0xff;
  o[61] = x15 >>>  8 & 0xff;
  o[62] = x15 >>> 16 & 0xff;
  o[63] = x15 >>> 24 & 0xff;
}

function core_hsalsa20(o,p,k,c) {
  var j0  = c[ 0] & 0xff | (c[ 1] & 0xff)<<8 | (c[ 2] & 0xff)<<16 | (c[ 3] & 0xff)<<24,
      j1  = k[ 0] & 0xff | (k[ 1] & 0xff)<<8 | (k[ 2] & 0xff)<<16 | (k[ 3] & 0xff)<<24,
      j2  = k[ 4] & 0xff | (k[ 5] & 0xff)<<8 | (k[ 6] & 0xff)<<16 | (k[ 7] & 0xff)<<24,
      j3  = k[ 8] & 0xff | (k[ 9] & 0xff)<<8 | (k[10] & 0xff)<<16 | (k[11] & 0xff)<<24,
      j4  = k[12] & 0xff | (k[13] & 0xff)<<8 | (k[14] & 0xff)<<16 | (k[15] & 0xff)<<24,
      j5  = c[ 4] & 0xff | (c[ 5] & 0xff)<<8 | (c[ 6] & 0xff)<<16 | (c[ 7] & 0xff)<<24,
      j6  = p[ 0] & 0xff | (p[ 1] & 0xff)<<8 | (p[ 2] & 0xff)<<16 | (p[ 3] & 0xff)<<24,
      j7  = p[ 4] & 0xff | (p[ 5] & 0xff)<<8 | (p[ 6] & 0xff)<<16 | (p[ 7] & 0xff)<<24,
      j8  = p[ 8] & 0xff | (p[ 9] & 0xff)<<8 | (p[10] & 0xff)<<16 | (p[11] & 0xff)<<24,
      j9  = p[12] & 0xff | (p[13] & 0xff)<<8 | (p[14] & 0xff)<<16 | (p[15] & 0xff)<<24,
      j10 = c[ 8] & 0xff | (c[ 9] & 0xff)<<8 | (c[10] & 0xff)<<16 | (c[11] & 0xff)<<24,
      j11 = k[16] & 0xff | (k[17] & 0xff)<<8 | (k[18] & 0xff)<<16 | (k[19] & 0xff)<<24,
      j12 = k[20] & 0xff | (k[21] & 0xff)<<8 | (k[22] & 0xff)<<16 | (k[23] & 0xff)<<24,
      j13 = k[24] & 0xff | (k[25] & 0xff)<<8 | (k[26] & 0xff)<<16 | (k[27] & 0xff)<<24,
      j14 = k[28] & 0xff | (k[29] & 0xff)<<8 | (k[30] & 0xff)<<16 | (k[31] & 0xff)<<24,
      j15 = c[12] & 0xff | (c[13] & 0xff)<<8 | (c[14] & 0xff)<<16 | (c[15] & 0xff)<<24;

  var x0 = j0, x1 = j1, x2 = j2, x3 = j3, x4 = j4, x5 = j5, x6 = j6, x7 = j7,
      x8 = j8, x9 = j9, x10 = j10, x11 = j11, x12 = j12, x13 = j13, x14 = j14,
      x15 = j15, u;

  for (var i = 0; i < 20; i += 2) {
    u = x0 + x12 | 0;
    x4 ^= u<<7 | u>>>(32-7);
    u = x4 + x0 | 0;
    x8 ^= u<<9 | u>>>(32-9);
    u = x8 + x4 | 0;
    x12 ^= u<<13 | u>>>(32-13);
    u = x12 + x8 | 0;
    x0 ^= u<<18 | u>>>(32-18);

    u = x5 + x1 | 0;
    x9 ^= u<<7 | u>>>(32-7);
    u = x9 + x5 | 0;
    x13 ^= u<<9 | u>>>(32-9);
    u = x13 + x9 | 0;
    x1 ^= u<<13 | u>>>(32-13);
    u = x1 + x13 | 0;
    x5 ^= u<<18 | u>>>(32-18);

    u = x10 + x6 | 0;
    x14 ^= u<<7 | u>>>(32-7);
    u = x14 + x10 | 0;
    x2 ^= u<<9 | u>>>(32-9);
    u = x2 + x14 | 0;
    x6 ^= u<<13 | u>>>(32-13);
    u = x6 + x2 | 0;
    x10 ^= u<<18 | u>>>(32-18);

    u = x15 + x11 | 0;
    x3 ^= u<<7 | u>>>(32-7);
    u = x3 + x15 | 0;
    x7 ^= u<<9 | u>>>(32-9);
    u = x7 + x3 | 0;
    x11 ^= u<<13 | u>>>(32-13);
    u = x11 + x7 | 0;
    x15 ^= u<<18 | u>>>(32-18);

    u = x0 + x3 | 0;
    x1 ^= u<<7 | u>>>(32-7);
    u = x1 + x0 | 0;
    x2 ^= u<<9 | u>>>(32-9);
    u = x2 + x1 | 0;
    x3 ^= u<<13 | u>>>(32-13);
    u = x3 + x2 | 0;
    x0 ^= u<<18 | u>>>(32-18);

    u = x5 + x4 | 0;
    x6 ^= u<<7 | u>>>(32-7);
    u = x6 + x5 | 0;
    x7 ^= u<<9 | u>>>(32-9);
    u = x7 + x6 | 0;
    x4 ^= u<<13 | u>>>(32-13);
    u = x4 + x7 | 0;
    x5 ^= u<<18 | u>>>(32-18);

    u = x10 + x9 | 0;
    x11 ^= u<<7 | u>>>(32-7);
    u = x11 + x10 | 0;
    x8 ^= u<<9 | u>>>(32-9);
    u = x8 + x11 | 0;
    x9 ^= u<<13 | u>>>(32-13);
    u = x9 + x8 | 0;
    x10 ^= u<<18 | u>>>(32-18);

    u = x15 + x14 | 0;
    x12 ^= u<<7 | u>>>(32-7);
    u = x12 + x15 | 0;
    x13 ^= u<<9 | u>>>(32-9);
    u = x13 + x12 | 0;
    x14 ^= u<<13 | u>>>(32-13);
    u = x14 + x13 | 0;
    x15 ^= u<<18 | u>>>(32-18);
  }

  o[ 0] = x0 >>>  0 & 0xff;
  o[ 1] = x0 >>>  8 & 0xff;
  o[ 2] = x0 >>> 16 & 0xff;
  o[ 3] = x0 >>> 24 & 0xff;

  o[ 4] = x5 >>>  0 & 0xff;
  o[ 5] = x5 >>>  8 & 0xff;
  o[ 6] = x5 >>> 16 & 0xff;
  o[ 7] = x5 >>> 24 & 0xff;

  o[ 8] = x10 >>>  0 & 0xff;
  o[ 9] = x10 >>>  8 & 0xff;
  o[10] = x10 >>> 16 & 0xff;
  o[11] = x10 >>> 24 & 0xff;

  o[12] = x15 >>>  0 & 0xff;
  o[13] = x15 >>>  8 & 0xff;
  o[14] = x15 >>> 16 & 0xff;
  o[15] = x15 >>> 24 & 0xff;

  o[16] = x6 >>>  0 & 0xff;
  o[17] = x6 >>>  8 & 0xff;
  o[18] = x6 >>> 16 & 0xff;
  o[19] = x6 >>> 24 & 0xff;

  o[20] = x7 >>>  0 & 0xff;
  o[21] = x7 >>>  8 & 0xff;
  o[22] = x7 >>> 16 & 0xff;
  o[23] = x7 >>> 24 & 0xff;

  o[24] = x8 >>>  0 & 0xff;
  o[25] = x8 >>>  8 & 0xff;
  o[26] = x8 >>> 16 & 0xff;
  o[27] = x8 >>> 24 & 0xff;

  o[28] = x9 >>>  0 & 0xff;
  o[29] = x9 >>>  8 & 0xff;
  o[30] = x9 >>> 16 & 0xff;
  o[31] = x9 >>> 24 & 0xff;
}

function crypto_core_salsa20(out,inp,k,c) {
  core_salsa20(out,inp,k,c);
}

function crypto_core_hsalsa20(out,inp,k,c) {
  core_hsalsa20(out,inp,k,c);
}

var sigma = new Uint8Array([101, 120, 112, 97, 110, 100, 32, 51, 50, 45, 98, 121, 116, 101, 32, 107]);
            // "expand 32-byte k"

function crypto_stream_salsa20_xor(c,cpos,m,mpos,b,n,k) {
  var z = new Uint8Array(16), x = new Uint8Array(64);
  var u, i;
  for (i = 0; i < 16; i++) z[i] = 0;
  for (i = 0; i < 8; i++) z[i] = n[i];
  while (b >= 64) {
    crypto_core_salsa20(x,z,k,sigma);
    for (i = 0; i < 64; i++) c[cpos+i] = m[mpos+i] ^ x[i];
    u = 1;
    for (i = 8; i < 16; i++) {
      u = u + (z[i] & 0xff) | 0;
      z[i] = u & 0xff;
      u >>>= 8;
    }
    b -= 64;
    cpos += 64;
    mpos += 64;
  }
  if (b > 0) {
    crypto_core_salsa20(x,z,k,sigma);
    for (i = 0; i < b; i++) c[cpos+i] = m[mpos+i] ^ x[i];
  }
  return 0;
}

function crypto_stream_salsa20(c,cpos,b,n,k) {
  var z = new Uint8Array(16), x = new Uint8Array(64);
  var u, i;
  for (i = 0; i < 16; i++) z[i] = 0;
  for (i = 0; i < 8; i++) z[i] = n[i];
  while (b >= 64) {
    crypto_core_salsa20(x,z,k,sigma);
    for (i = 0; i < 64; i++) c[cpos+i] = x[i];
    u = 1;
    for (i = 8; i < 16; i++) {
      u = u + (z[i] & 0xff) | 0;
      z[i] = u & 0xff;
      u >>>= 8;
    }
    b -= 64;
    cpos += 64;
  }
  if (b > 0) {
    crypto_core_salsa20(x,z,k,sigma);
    for (i = 0; i < b; i++) c[cpos+i] = x[i];
  }
  return 0;
}

function crypto_stream(c,cpos,d,n,k) {
  var s = new Uint8Array(32);
  crypto_core_hsalsa20(s,n,k,sigma);
  var sn = new Uint8Array(8);
  for (var i = 0; i < 8; i++) sn[i] = n[i+16];
  return crypto_stream_salsa20(c,cpos,d,sn,s);
}

function crypto_stream_xor(c,cpos,m,mpos,d,n,k) {
  var s = new Uint8Array(32);
  crypto_core_hsalsa20(s,n,k,sigma);
  var sn = new Uint8Array(8);
  for (var i = 0; i < 8; i++) sn[i] = n[i+16];
  return crypto_stream_salsa20_xor(c,cpos,m,mpos,d,sn,s);
}

/*
* Port of Andrew Moon's Poly1305-donna-16. Public domain.
* https://github.com/floodyberry/poly1305-donna
*/

var poly1305 = function(key) {
  this.buffer = new Uint8Array(16);
  this.r = new Uint16Array(10);
  this.h = new Uint16Array(10);
  this.pad = new Uint16Array(8);
  this.leftover = 0;
  this.fin = 0;

  var t0, t1, t2, t3, t4, t5, t6, t7;

  t0 = key[ 0] & 0xff | (key[ 1] & 0xff) << 8; this.r[0] = ( t0                     ) & 0x1fff;
  t1 = key[ 2] & 0xff | (key[ 3] & 0xff) << 8; this.r[1] = ((t0 >>> 13) | (t1 <<  3)) & 0x1fff;
  t2 = key[ 4] & 0xff | (key[ 5] & 0xff) << 8; this.r[2] = ((t1 >>> 10) | (t2 <<  6)) & 0x1f03;
  t3 = key[ 6] & 0xff | (key[ 7] & 0xff) << 8; this.r[3] = ((t2 >>>  7) | (t3 <<  9)) & 0x1fff;
  t4 = key[ 8] & 0xff | (key[ 9] & 0xff) << 8; this.r[4] = ((t3 >>>  4) | (t4 << 12)) & 0x00ff;
  this.r[5] = ((t4 >>>  1)) & 0x1ffe;
  t5 = key[10] & 0xff | (key[11] & 0xff) << 8; this.r[6] = ((t4 >>> 14) | (t5 <<  2)) & 0x1fff;
  t6 = key[12] & 0xff | (key[13] & 0xff) << 8; this.r[7] = ((t5 >>> 11) | (t6 <<  5)) & 0x1f81;
  t7 = key[14] & 0xff | (key[15] & 0xff) << 8; this.r[8] = ((t6 >>>  8) | (t7 <<  8)) & 0x1fff;
  this.r[9] = ((t7 >>>  5)) & 0x007f;

  this.pad[0] = key[16] & 0xff | (key[17] & 0xff) << 8;
  this.pad[1] = key[18] & 0xff | (key[19] & 0xff) << 8;
  this.pad[2] = key[20] & 0xff | (key[21] & 0xff) << 8;
  this.pad[3] = key[22] & 0xff | (key[23] & 0xff) << 8;
  this.pad[4] = key[24] & 0xff | (key[25] & 0xff) << 8;
  this.pad[5] = key[26] & 0xff | (key[27] & 0xff) << 8;
  this.pad[6] = key[28] & 0xff | (key[29] & 0xff) << 8;
  this.pad[7] = key[30] & 0xff | (key[31] & 0xff) << 8;
};

poly1305.prototype.blocks = function(m, mpos, bytes) {
  var hibit = this.fin ? 0 : (1 << 11);
  var t0, t1, t2, t3, t4, t5, t6, t7, c;
  var d0, d1, d2, d3, d4, d5, d6, d7, d8, d9;

  var h0 = this.h[0],
      h1 = this.h[1],
      h2 = this.h[2],
      h3 = this.h[3],
      h4 = this.h[4],
      h5 = this.h[5],
      h6 = this.h[6],
      h7 = this.h[7],
      h8 = this.h[8],
      h9 = this.h[9];

  var r0 = this.r[0],
      r1 = this.r[1],
      r2 = this.r[2],
      r3 = this.r[3],
      r4 = this.r[4],
      r5 = this.r[5],
      r6 = this.r[6],
      r7 = this.r[7],
      r8 = this.r[8],
      r9 = this.r[9];

  while (bytes >= 16) {
    t0 = m[mpos+ 0] & 0xff | (m[mpos+ 1] & 0xff) << 8; h0 += ( t0                     ) & 0x1fff;
    t1 = m[mpos+ 2] & 0xff | (m[mpos+ 3] & 0xff) << 8; h1 += ((t0 >>> 13) | (t1 <<  3)) & 0x1fff;
    t2 = m[mpos+ 4] & 0xff | (m[mpos+ 5] & 0xff) << 8; h2 += ((t1 >>> 10) | (t2 <<  6)) & 0x1fff;
    t3 = m[mpos+ 6] & 0xff | (m[mpos+ 7] & 0xff) << 8; h3 += ((t2 >>>  7) | (t3 <<  9)) & 0x1fff;
    t4 = m[mpos+ 8] & 0xff | (m[mpos+ 9] & 0xff) << 8; h4 += ((t3 >>>  4) | (t4 << 12)) & 0x1fff;
    h5 += ((t4 >>>  1)) & 0x1fff;
    t5 = m[mpos+10] & 0xff | (m[mpos+11] & 0xff) << 8; h6 += ((t4 >>> 14) | (t5 <<  2)) & 0x1fff;
    t6 = m[mpos+12] & 0xff | (m[mpos+13] & 0xff) << 8; h7 += ((t5 >>> 11) | (t6 <<  5)) & 0x1fff;
    t7 = m[mpos+14] & 0xff | (m[mpos+15] & 0xff) << 8; h8 += ((t6 >>>  8) | (t7 <<  8)) & 0x1fff;
    h9 += ((t7 >>> 5)) | hibit;

    c = 0;

    d0 = c;
    d0 += h0 * r0;
    d0 += h1 * (5 * r9);
    d0 += h2 * (5 * r8);
    d0 += h3 * (5 * r7);
    d0 += h4 * (5 * r6);
    c = (d0 >>> 13); d0 &= 0x1fff;
    d0 += h5 * (5 * r5);
    d0 += h6 * (5 * r4);
    d0 += h7 * (5 * r3);
    d0 += h8 * (5 * r2);
    d0 += h9 * (5 * r1);
    c += (d0 >>> 13); d0 &= 0x1fff;

    d1 = c;
    d1 += h0 * r1;
    d1 += h1 * r0;
    d1 += h2 * (5 * r9);
    d1 += h3 * (5 * r8);
    d1 += h4 * (5 * r7);
    c = (d1 >>> 13); d1 &= 0x1fff;
    d1 += h5 * (5 * r6);
    d1 += h6 * (5 * r5);
    d1 += h7 * (5 * r4);
    d1 += h8 * (5 * r3);
    d1 += h9 * (5 * r2);
    c += (d1 >>> 13); d1 &= 0x1fff;

    d2 = c;
    d2 += h0 * r2;
    d2 += h1 * r1;
    d2 += h2 * r0;
    d2 += h3 * (5 * r9);
    d2 += h4 * (5 * r8);
    c = (d2 >>> 13); d2 &= 0x1fff;
    d2 += h5 * (5 * r7);
    d2 += h6 * (5 * r6);
    d2 += h7 * (5 * r5);
    d2 += h8 * (5 * r4);
    d2 += h9 * (5 * r3);
    c += (d2 >>> 13); d2 &= 0x1fff;

    d3 = c;
    d3 += h0 * r3;
    d3 += h1 * r2;
    d3 += h2 * r1;
    d3 += h3 * r0;
    d3 += h4 * (5 * r9);
    c = (d3 >>> 13); d3 &= 0x1fff;
    d3 += h5 * (5 * r8);
    d3 += h6 * (5 * r7);
    d3 += h7 * (5 * r6);
    d3 += h8 * (5 * r5);
    d3 += h9 * (5 * r4);
    c += (d3 >>> 13); d3 &= 0x1fff;

    d4 = c;
    d4 += h0 * r4;
    d4 += h1 * r3;
    d4 += h2 * r2;
    d4 += h3 * r1;
    d4 += h4 * r0;
    c = (d4 >>> 13); d4 &= 0x1fff;
    d4 += h5 * (5 * r9);
    d4 += h6 * (5 * r8);
    d4 += h7 * (5 * r7);
    d4 += h8 * (5 * r6);
    d4 += h9 * (5 * r5);
    c += (d4 >>> 13); d4 &= 0x1fff;

    d5 = c;
    d5 += h0 * r5;
    d5 += h1 * r4;
    d5 += h2 * r3;
    d5 += h3 * r2;
    d5 += h4 * r1;
    c = (d5 >>> 13); d5 &= 0x1fff;
    d5 += h5 * r0;
    d5 += h6 * (5 * r9);
    d5 += h7 * (5 * r8);
    d5 += h8 * (5 * r7);
    d5 += h9 * (5 * r6);
    c += (d5 >>> 13); d5 &= 0x1fff;

    d6 = c;
    d6 += h0 * r6;
    d6 += h1 * r5;
    d6 += h2 * r4;
    d6 += h3 * r3;
    d6 += h4 * r2;
    c = (d6 >>> 13); d6 &= 0x1fff;
    d6 += h5 * r1;
    d6 += h6 * r0;
    d6 += h7 * (5 * r9);
    d6 += h8 * (5 * r8);
    d6 += h9 * (5 * r7);
    c += (d6 >>> 13); d6 &= 0x1fff;

    d7 = c;
    d7 += h0 * r7;
    d7 += h1 * r6;
    d7 += h2 * r5;
    d7 += h3 * r4;
    d7 += h4 * r3;
    c = (d7 >>> 13); d7 &= 0x1fff;
    d7 += h5 * r2;
    d7 += h6 * r1;
    d7 += h7 * r0;
    d7 += h8 * (5 * r9);
    d7 += h9 * (5 * r8);
    c += (d7 >>> 13); d7 &= 0x1fff;

    d8 = c;
    d8 += h0 * r8;
    d8 += h1 * r7;
    d8 += h2 * r6;
    d8 += h3 * r5;
    d8 += h4 * r4;
    c = (d8 >>> 13); d8 &= 0x1fff;
    d8 += h5 * r3;
    d8 += h6 * r2;
    d8 += h7 * r1;
    d8 += h8 * r0;
    d8 += h9 * (5 * r9);
    c += (d8 >>> 13); d8 &= 0x1fff;

    d9 = c;
    d9 += h0 * r9;
    d9 += h1 * r8;
    d9 += h2 * r7;
    d9 += h3 * r6;
    d9 += h4 * r5;
    c = (d9 >>> 13); d9 &= 0x1fff;
    d9 += h5 * r4;
    d9 += h6 * r3;
    d9 += h7 * r2;
    d9 += h8 * r1;
    d9 += h9 * r0;
    c += (d9 >>> 13); d9 &= 0x1fff;

    c = (((c << 2) + c)) | 0;
    c = (c + d0) | 0;
    d0 = c & 0x1fff;
    c = (c >>> 13);
    d1 += c;

    h0 = d0;
    h1 = d1;
    h2 = d2;
    h3 = d3;
    h4 = d4;
    h5 = d5;
    h6 = d6;
    h7 = d7;
    h8 = d8;
    h9 = d9;

    mpos += 16;
    bytes -= 16;
  }
  this.h[0] = h0;
  this.h[1] = h1;
  this.h[2] = h2;
  this.h[3] = h3;
  this.h[4] = h4;
  this.h[5] = h5;
  this.h[6] = h6;
  this.h[7] = h7;
  this.h[8] = h8;
  this.h[9] = h9;
};

poly1305.prototype.finish = function(mac, macpos) {
  var g = new Uint16Array(10);
  var c, mask, f, i;

  if (this.leftover) {
    i = this.leftover;
    this.buffer[i++] = 1;
    for (; i < 16; i++) this.buffer[i] = 0;
    this.fin = 1;
    this.blocks(this.buffer, 0, 16);
  }

  c = this.h[1] >>> 13;
  this.h[1] &= 0x1fff;
  for (i = 2; i < 10; i++) {
    this.h[i] += c;
    c = this.h[i] >>> 13;
    this.h[i] &= 0x1fff;
  }
  this.h[0] += (c * 5);
  c = this.h[0] >>> 13;
  this.h[0] &= 0x1fff;
  this.h[1] += c;
  c = this.h[1] >>> 13;
  this.h[1] &= 0x1fff;
  this.h[2] += c;

  g[0] = this.h[0] + 5;
  c = g[0] >>> 13;
  g[0] &= 0x1fff;
  for (i = 1; i < 10; i++) {
    g[i] = this.h[i] + c;
    c = g[i] >>> 13;
    g[i] &= 0x1fff;
  }
  g[9] -= (1 << 13);

  mask = (c ^ 1) - 1;
  for (i = 0; i < 10; i++) g[i] &= mask;
  mask = ~mask;
  for (i = 0; i < 10; i++) this.h[i] = (this.h[i] & mask) | g[i];

  this.h[0] = ((this.h[0]       ) | (this.h[1] << 13)                    ) & 0xffff;
  this.h[1] = ((this.h[1] >>>  3) | (this.h[2] << 10)                    ) & 0xffff;
  this.h[2] = ((this.h[2] >>>  6) | (this.h[3] <<  7)                    ) & 0xffff;
  this.h[3] = ((this.h[3] >>>  9) | (this.h[4] <<  4)                    ) & 0xffff;
  this.h[4] = ((this.h[4] >>> 12) | (this.h[5] <<  1) | (this.h[6] << 14)) & 0xffff;
  this.h[5] = ((this.h[6] >>>  2) | (this.h[7] << 11)                    ) & 0xffff;
  this.h[6] = ((this.h[7] >>>  5) | (this.h[8] <<  8)                    ) & 0xffff;
  this.h[7] = ((this.h[8] >>>  8) | (this.h[9] <<  5)                    ) & 0xffff;

  f = this.h[0] + this.pad[0];
  this.h[0] = f & 0xffff;
  for (i = 1; i < 8; i++) {
    f = (((this.h[i] + this.pad[i]) | 0) + (f >>> 16)) | 0;
    this.h[i] = f & 0xffff;
  }

  mac[macpos+ 0] = (this.h[0] >>> 0) & 0xff;
  mac[macpos+ 1] = (this.h[0] >>> 8) & 0xff;
  mac[macpos+ 2] = (this.h[1] >>> 0) & 0xff;
  mac[macpos+ 3] = (this.h[1] >>> 8) & 0xff;
  mac[macpos+ 4] = (this.h[2] >>> 0) & 0xff;
  mac[macpos+ 5] = (this.h[2] >>> 8) & 0xff;
  mac[macpos+ 6] = (this.h[3] >>> 0) & 0xff;
  mac[macpos+ 7] = (this.h[3] >>> 8) & 0xff;
  mac[macpos+ 8] = (this.h[4] >>> 0) & 0xff;
  mac[macpos+ 9] = (this.h[4] >>> 8) & 0xff;
  mac[macpos+10] = (this.h[5] >>> 0) & 0xff;
  mac[macpos+11] = (this.h[5] >>> 8) & 0xff;
  mac[macpos+12] = (this.h[6] >>> 0) & 0xff;
  mac[macpos+13] = (this.h[6] >>> 8) & 0xff;
  mac[macpos+14] = (this.h[7] >>> 0) & 0xff;
  mac[macpos+15] = (this.h[7] >>> 8) & 0xff;
};

poly1305.prototype.update = function(m, mpos, bytes) {
  var i, want;

  if (this.leftover) {
    want = (16 - this.leftover);
    if (want > bytes)
      want = bytes;
    for (i = 0; i < want; i++)
      this.buffer[this.leftover + i] = m[mpos+i];
    bytes -= want;
    mpos += want;
    this.leftover += want;
    if (this.leftover < 16)
      return;
    this.blocks(this.buffer, 0, 16);
    this.leftover = 0;
  }

  if (bytes >= 16) {
    want = bytes - (bytes % 16);
    this.blocks(m, mpos, want);
    mpos += want;
    bytes -= want;
  }

  if (bytes) {
    for (i = 0; i < bytes; i++)
      this.buffer[this.leftover + i] = m[mpos+i];
    this.leftover += bytes;
  }
};

function crypto_onetimeauth(out, outpos, m, mpos, n, k) {
  var s = new poly1305(k);
  s.update(m, mpos, n);
  s.finish(out, outpos);
  return 0;
}

function crypto_onetimeauth_verify(h, hpos, m, mpos, n, k) {
  var x = new Uint8Array(16);
  crypto_onetimeauth(x,0,m,mpos,n,k);
  return crypto_verify_16(h,hpos,x,0);
}

function crypto_secretbox(c,m,d,n,k) {
  var i;
  if (d < 32) return -1;
  crypto_stream_xor(c,0,m,0,d,n,k);
  crypto_onetimeauth(c, 16, c, 32, d - 32, c);
  for (i = 0; i < 16; i++) c[i] = 0;
  return 0;
}

function crypto_secretbox_open(m,c,d,n,k) {
  var i;
  var x = new Uint8Array(32);
  if (d < 32) return -1;
  crypto_stream(x,0,32,n,k);
  if (crypto_onetimeauth_verify(c, 16,c, 32,d - 32,x) !== 0) return -1;
  crypto_stream_xor(m,0,c,0,d,n,k);
  for (i = 0; i < 32; i++) m[i] = 0;
  return 0;
}

function set25519(r, a) {
  var i;
  for (i = 0; i < 16; i++) r[i] = a[i]|0;
}

function car25519(o) {
  var i, v, c = 1;
  for (i = 0; i < 16; i++) {
    v = o[i] + c + 65535;
    c = Math.floor(v / 65536);
    o[i] = v - c * 65536;
  }
  o[0] += c-1 + 37 * (c-1);
}

function sel25519(p, q, b) {
  var t, c = ~(b-1);
  for (var i = 0; i < 16; i++) {
    t = c & (p[i] ^ q[i]);
    p[i] ^= t;
    q[i] ^= t;
  }
}

function pack25519(o, n) {
  var i, j, b;
  var m = gf(), t = gf();
  for (i = 0; i < 16; i++) t[i] = n[i];
  car25519(t);
  car25519(t);
  car25519(t);
  for (j = 0; j < 2; j++) {
    m[0] = t[0] - 0xffed;
    for (i = 1; i < 15; i++) {
      m[i] = t[i] - 0xffff - ((m[i-1]>>16) & 1);
      m[i-1] &= 0xffff;
    }
    m[15] = t[15] - 0x7fff - ((m[14]>>16) & 1);
    b = (m[15]>>16) & 1;
    m[14] &= 0xffff;
    sel25519(t, m, 1-b);
  }
  for (i = 0; i < 16; i++) {
    o[2*i] = t[i] & 0xff;
    o[2*i+1] = t[i]>>8;
  }
}

function neq25519(a, b) {
  var c = new Uint8Array(32), d = new Uint8Array(32);
  pack25519(c, a);
  pack25519(d, b);
  return crypto_verify_32(c, 0, d, 0);
}

function par25519(a) {
  var d = new Uint8Array(32);
  pack25519(d, a);
  return d[0] & 1;
}

function unpack25519(o, n) {
  var i;
  for (i = 0; i < 16; i++) o[i] = n[2*i] + (n[2*i+1] << 8);
  o[15] &= 0x7fff;
}

function A(o, a, b) {
  for (var i = 0; i < 16; i++) o[i] = a[i] + b[i];
}

function Z(o, a, b) {
  for (var i = 0; i < 16; i++) o[i] = a[i] - b[i];
}

function M(o, a, b) {
  var v, c,
     t0 = 0,  t1 = 0,  t2 = 0,  t3 = 0,  t4 = 0,  t5 = 0,  t6 = 0,  t7 = 0,
     t8 = 0,  t9 = 0, t10 = 0, t11 = 0, t12 = 0, t13 = 0, t14 = 0, t15 = 0,
    t16 = 0, t17 = 0, t18 = 0, t19 = 0, t20 = 0, t21 = 0, t22 = 0, t23 = 0,
    t24 = 0, t25 = 0, t26 = 0, t27 = 0, t28 = 0, t29 = 0, t30 = 0,
    b0 = b[0],
    b1 = b[1],
    b2 = b[2],
    b3 = b[3],
    b4 = b[4],
    b5 = b[5],
    b6 = b[6],
    b7 = b[7],
    b8 = b[8],
    b9 = b[9],
    b10 = b[10],
    b11 = b[11],
    b12 = b[12],
    b13 = b[13],
    b14 = b[14],
    b15 = b[15];

  v = a[0];
  t0 += v * b0;
  t1 += v * b1;
  t2 += v * b2;
  t3 += v * b3;
  t4 += v * b4;
  t5 += v * b5;
  t6 += v * b6;
  t7 += v * b7;
  t8 += v * b8;
  t9 += v * b9;
  t10 += v * b10;
  t11 += v * b11;
  t12 += v * b12;
  t13 += v * b13;
  t14 += v * b14;
  t15 += v * b15;
  v = a[1];
  t1 += v * b0;
  t2 += v * b1;
  t3 += v * b2;
  t4 += v * b3;
  t5 += v * b4;
  t6 += v * b5;
  t7 += v * b6;
  t8 += v * b7;
  t9 += v * b8;
  t10 += v * b9;
  t11 += v * b10;
  t12 += v * b11;
  t13 += v * b12;
  t14 += v * b13;
  t15 += v * b14;
  t16 += v * b15;
  v = a[2];
  t2 += v * b0;
  t3 += v * b1;
  t4 += v * b2;
  t5 += v * b3;
  t6 += v * b4;
  t7 += v * b5;
  t8 += v * b6;
  t9 += v * b7;
  t10 += v * b8;
  t11 += v * b9;
  t12 += v * b10;
  t13 += v * b11;
  t14 += v * b12;
  t15 += v * b13;
  t16 += v * b14;
  t17 += v * b15;
  v = a[3];
  t3 += v * b0;
  t4 += v * b1;
  t5 += v * b2;
  t6 += v * b3;
  t7 += v * b4;
  t8 += v * b5;
  t9 += v * b6;
  t10 += v * b7;
  t11 += v * b8;
  t12 += v * b9;
  t13 += v * b10;
  t14 += v * b11;
  t15 += v * b12;
  t16 += v * b13;
  t17 += v * b14;
  t18 += v * b15;
  v = a[4];
  t4 += v * b0;
  t5 += v * b1;
  t6 += v * b2;
  t7 += v * b3;
  t8 += v * b4;
  t9 += v * b5;
  t10 += v * b6;
  t11 += v * b7;
  t12 += v * b8;
  t13 += v * b9;
  t14 += v * b10;
  t15 += v * b11;
  t16 += v * b12;
  t17 += v * b13;
  t18 += v * b14;
  t19 += v * b15;
  v = a[5];
  t5 += v * b0;
  t6 += v * b1;
  t7 += v * b2;
  t8 += v * b3;
  t9 += v * b4;
  t10 += v * b5;
  t11 += v * b6;
  t12 += v * b7;
  t13 += v * b8;
  t14 += v * b9;
  t15 += v * b10;
  t16 += v * b11;
  t17 += v * b12;
  t18 += v * b13;
  t19 += v * b14;
  t20 += v * b15;
  v = a[6];
  t6 += v * b0;
  t7 += v * b1;
  t8 += v * b2;
  t9 += v * b3;
  t10 += v * b4;
  t11 += v * b5;
  t12 += v * b6;
  t13 += v * b7;
  t14 += v * b8;
  t15 += v * b9;
  t16 += v * b10;
  t17 += v * b11;
  t18 += v * b12;
  t19 += v * b13;
  t20 += v * b14;
  t21 += v * b15;
  v = a[7];
  t7 += v * b0;
  t8 += v * b1;
  t9 += v * b2;
  t10 += v * b3;
  t11 += v * b4;
  t12 += v * b5;
  t13 += v * b6;
  t14 += v * b7;
  t15 += v * b8;
  t16 += v * b9;
  t17 += v * b10;
  t18 += v * b11;
  t19 += v * b12;
  t20 += v * b13;
  t21 += v * b14;
  t22 += v * b15;
  v = a[8];
  t8 += v * b0;
  t9 += v * b1;
  t10 += v * b2;
  t11 += v * b3;
  t12 += v * b4;
  t13 += v * b5;
  t14 += v * b6;
  t15 += v * b7;
  t16 += v * b8;
  t17 += v * b9;
  t18 += v * b10;
  t19 += v * b11;
  t20 += v * b12;
  t21 += v * b13;
  t22 += v * b14;
  t23 += v * b15;
  v = a[9];
  t9 += v * b0;
  t10 += v * b1;
  t11 += v * b2;
  t12 += v * b3;
  t13 += v * b4;
  t14 += v * b5;
  t15 += v * b6;
  t16 += v * b7;
  t17 += v * b8;
  t18 += v * b9;
  t19 += v * b10;
  t20 += v * b11;
  t21 += v * b12;
  t22 += v * b13;
  t23 += v * b14;
  t24 += v * b15;
  v = a[10];
  t10 += v * b0;
  t11 += v * b1;
  t12 += v * b2;
  t13 += v * b3;
  t14 += v * b4;
  t15 += v * b5;
  t16 += v * b6;
  t17 += v * b7;
  t18 += v * b8;
  t19 += v * b9;
  t20 += v * b10;
  t21 += v * b11;
  t22 += v * b12;
  t23 += v * b13;
  t24 += v * b14;
  t25 += v * b15;
  v = a[11];
  t11 += v * b0;
  t12 += v * b1;
  t13 += v * b2;
  t14 += v * b3;
  t15 += v * b4;
  t16 += v * b5;
  t17 += v * b6;
  t18 += v * b7;
  t19 += v * b8;
  t20 += v * b9;
  t21 += v * b10;
  t22 += v * b11;
  t23 += v * b12;
  t24 += v * b13;
  t25 += v * b14;
  t26 += v * b15;
  v = a[12];
  t12 += v * b0;
  t13 += v * b1;
  t14 += v * b2;
  t15 += v * b3;
  t16 += v * b4;
  t17 += v * b5;
  t18 += v * b6;
  t19 += v * b7;
  t20 += v * b8;
  t21 += v * b9;
  t22 += v * b10;
  t23 += v * b11;
  t24 += v * b12;
  t25 += v * b13;
  t26 += v * b14;
  t27 += v * b15;
  v = a[13];
  t13 += v * b0;
  t14 += v * b1;
  t15 += v * b2;
  t16 += v * b3;
  t17 += v * b4;
  t18 += v * b5;
  t19 += v * b6;
  t20 += v * b7;
  t21 += v * b8;
  t22 += v * b9;
  t23 += v * b10;
  t24 += v * b11;
  t25 += v * b12;
  t26 += v * b13;
  t27 += v * b14;
  t28 += v * b15;
  v = a[14];
  t14 += v * b0;
  t15 += v * b1;
  t16 += v * b2;
  t17 += v * b3;
  t18 += v * b4;
  t19 += v * b5;
  t20 += v * b6;
  t21 += v * b7;
  t22 += v * b8;
  t23 += v * b9;
  t24 += v * b10;
  t25 += v * b11;
  t26 += v * b12;
  t27 += v * b13;
  t28 += v * b14;
  t29 += v * b15;
  v = a[15];
  t15 += v * b0;
  t16 += v * b1;
  t17 += v * b2;
  t18 += v * b3;
  t19 += v * b4;
  t20 += v * b5;
  t21 += v * b6;
  t22 += v * b7;
  t23 += v * b8;
  t24 += v * b9;
  t25 += v * b10;
  t26 += v * b11;
  t27 += v * b12;
  t28 += v * b13;
  t29 += v * b14;
  t30 += v * b15;

  t0  += 38 * t16;
  t1  += 38 * t17;
  t2  += 38 * t18;
  t3  += 38 * t19;
  t4  += 38 * t20;
  t5  += 38 * t21;
  t6  += 38 * t22;
  t7  += 38 * t23;
  t8  += 38 * t24;
  t9  += 38 * t25;
  t10 += 38 * t26;
  t11 += 38 * t27;
  t12 += 38 * t28;
  t13 += 38 * t29;
  t14 += 38 * t30;
  // t15 left as is

  // first car
  c = 1;
  v =  t0 + c + 65535; c = Math.floor(v / 65536);  t0 = v - c * 65536;
  v =  t1 + c + 65535; c = Math.floor(v / 65536);  t1 = v - c * 65536;
  v =  t2 + c + 65535; c = Math.floor(v / 65536);  t2 = v - c * 65536;
  v =  t3 + c + 65535; c = Math.floor(v / 65536);  t3 = v - c * 65536;
  v =  t4 + c + 65535; c = Math.floor(v / 65536);  t4 = v - c * 65536;
  v =  t5 + c + 65535; c = Math.floor(v / 65536);  t5 = v - c * 65536;
  v =  t6 + c + 65535; c = Math.floor(v / 65536);  t6 = v - c * 65536;
  v =  t7 + c + 65535; c = Math.floor(v / 65536);  t7 = v - c * 65536;
  v =  t8 + c + 65535; c = Math.floor(v / 65536);  t8 = v - c * 65536;
  v =  t9 + c + 65535; c = Math.floor(v / 65536);  t9 = v - c * 65536;
  v = t10 + c + 65535; c = Math.floor(v / 65536); t10 = v - c * 65536;
  v = t11 + c + 65535; c = Math.floor(v / 65536); t11 = v - c * 65536;
  v = t12 + c + 65535; c = Math.floor(v / 65536); t12 = v - c * 65536;
  v = t13 + c + 65535; c = Math.floor(v / 65536); t13 = v - c * 65536;
  v = t14 + c + 65535; c = Math.floor(v / 65536); t14 = v - c * 65536;
  v = t15 + c + 65535; c = Math.floor(v / 65536); t15 = v - c * 65536;
  t0 += c-1 + 37 * (c-1);

  // second car
  c = 1;
  v =  t0 + c + 65535; c = Math.floor(v / 65536);  t0 = v - c * 65536;
  v =  t1 + c + 65535; c = Math.floor(v / 65536);  t1 = v - c * 65536;
  v =  t2 + c + 65535; c = Math.floor(v / 65536);  t2 = v - c * 65536;
  v =  t3 + c + 65535; c = Math.floor(v / 65536);  t3 = v - c * 65536;
  v =  t4 + c + 65535; c = Math.floor(v / 65536);  t4 = v - c * 65536;
  v =  t5 + c + 65535; c = Math.floor(v / 65536);  t5 = v - c * 65536;
  v =  t6 + c + 65535; c = Math.floor(v / 65536);  t6 = v - c * 65536;
  v =  t7 + c + 65535; c = Math.floor(v / 65536);  t7 = v - c * 65536;
  v =  t8 + c + 65535; c = Math.floor(v / 65536);  t8 = v - c * 65536;
  v =  t9 + c + 65535; c = Math.floor(v / 65536);  t9 = v - c * 65536;
  v = t10 + c + 65535; c = Math.floor(v / 65536); t10 = v - c * 65536;
  v = t11 + c + 65535; c = Math.floor(v / 65536); t11 = v - c * 65536;
  v = t12 + c + 65535; c = Math.floor(v / 65536); t12 = v - c * 65536;
  v = t13 + c + 65535; c = Math.floor(v / 65536); t13 = v - c * 65536;
  v = t14 + c + 65535; c = Math.floor(v / 65536); t14 = v - c * 65536;
  v = t15 + c + 65535; c = Math.floor(v / 65536); t15 = v - c * 65536;
  t0 += c-1 + 37 * (c-1);

  o[ 0] = t0;
  o[ 1] = t1;
  o[ 2] = t2;
  o[ 3] = t3;
  o[ 4] = t4;
  o[ 5] = t5;
  o[ 6] = t6;
  o[ 7] = t7;
  o[ 8] = t8;
  o[ 9] = t9;
  o[10] = t10;
  o[11] = t11;
  o[12] = t12;
  o[13] = t13;
  o[14] = t14;
  o[15] = t15;
}

function S(o, a) {
  M(o, a, a);
}

function inv25519(o, i) {
  var c = gf();
  var a;
  for (a = 0; a < 16; a++) c[a] = i[a];
  for (a = 253; a >= 0; a--) {
    S(c, c);
    if(a !== 2 && a !== 4) M(c, c, i);
  }
  for (a = 0; a < 16; a++) o[a] = c[a];
}

function pow2523(o, i) {
  var c = gf();
  var a;
  for (a = 0; a < 16; a++) c[a] = i[a];
  for (a = 250; a >= 0; a--) {
      S(c, c);
      if(a !== 1) M(c, c, i);
  }
  for (a = 0; a < 16; a++) o[a] = c[a];
}

function crypto_scalarmult(q, n, p) {
  var z = new Uint8Array(32);
  var x = new Float64Array(80), r, i;
  var a = gf(), b = gf(), c = gf(),
      d = gf(), e = gf(), f = gf();
  for (i = 0; i < 31; i++) z[i] = n[i];
  z[31]=(n[31]&127)|64;
  z[0]&=248;
  unpack25519(x,p);
  for (i = 0; i < 16; i++) {
    b[i]=x[i];
    d[i]=a[i]=c[i]=0;
  }
  a[0]=d[0]=1;
  for (i=254; i>=0; --i) {
    r=(z[i>>>3]>>>(i&7))&1;
    sel25519(a,b,r);
    sel25519(c,d,r);
    A(e,a,c);
    Z(a,a,c);
    A(c,b,d);
    Z(b,b,d);
    S(d,e);
    S(f,a);
    M(a,c,a);
    M(c,b,e);
    A(e,a,c);
    Z(a,a,c);
    S(b,a);
    Z(c,d,f);
    M(a,c,_121665);
    A(a,a,d);
    M(c,c,a);
    M(a,d,f);
    M(d,b,x);
    S(b,e);
    sel25519(a,b,r);
    sel25519(c,d,r);
  }
  for (i = 0; i < 16; i++) {
    x[i+16]=a[i];
    x[i+32]=c[i];
    x[i+48]=b[i];
    x[i+64]=d[i];
  }
  var x32 = x.subarray(32);
  var x16 = x.subarray(16);
  inv25519(x32,x32);
  M(x16,x16,x32);
  pack25519(q,x16);
  return 0;
}

function crypto_scalarmult_base(q, n) {
  return crypto_scalarmult(q, n, _9);
}

function crypto_box_keypair(y, x) {
  randombytes(x, 32);
  return crypto_scalarmult_base(y, x);
}

function crypto_box_beforenm(k, y, x) {
  var s = new Uint8Array(32);
  crypto_scalarmult(s, x, y);
  return crypto_core_hsalsa20(k, _0, s, sigma);
}

var crypto_box_afternm = crypto_secretbox;
var crypto_box_open_afternm = crypto_secretbox_open;

function crypto_box(c, m, d, n, y, x) {
  var k = new Uint8Array(32);
  crypto_box_beforenm(k, y, x);
  return crypto_box_afternm(c, m, d, n, k);
}

function crypto_box_open(m, c, d, n, y, x) {
  var k = new Uint8Array(32);
  crypto_box_beforenm(k, y, x);
  return crypto_box_open_afternm(m, c, d, n, k);
}

var K = [
  0x428a2f98, 0xd728ae22, 0x71374491, 0x23ef65cd,
  0xb5c0fbcf, 0xec4d3b2f, 0xe9b5dba5, 0x8189dbbc,
  0x3956c25b, 0xf348b538, 0x59f111f1, 0xb605d019,
  0x923f82a4, 0xaf194f9b, 0xab1c5ed5, 0xda6d8118,
  0xd807aa98, 0xa3030242, 0x12835b01, 0x45706fbe,
  0x243185be, 0x4ee4b28c, 0x550c7dc3, 0xd5ffb4e2,
  0x72be5d74, 0xf27b896f, 0x80deb1fe, 0x3b1696b1,
  0x9bdc06a7, 0x25c71235, 0xc19bf174, 0xcf692694,
  0xe49b69c1, 0x9ef14ad2, 0xefbe4786, 0x384f25e3,
  0x0fc19dc6, 0x8b8cd5b5, 0x240ca1cc, 0x77ac9c65,
  0x2de92c6f, 0x592b0275, 0x4a7484aa, 0x6ea6e483,
  0x5cb0a9dc, 0xbd41fbd4, 0x76f988da, 0x831153b5,
  0x983e5152, 0xee66dfab, 0xa831c66d, 0x2db43210,
  0xb00327c8, 0x98fb213f, 0xbf597fc7, 0xbeef0ee4,
  0xc6e00bf3, 0x3da88fc2, 0xd5a79147, 0x930aa725,
  0x06ca6351, 0xe003826f, 0x14292967, 0x0a0e6e70,
  0x27b70a85, 0x46d22ffc, 0x2e1b2138, 0x5c26c926,
  0x4d2c6dfc, 0x5ac42aed, 0x53380d13, 0x9d95b3df,
  0x650a7354, 0x8baf63de, 0x766a0abb, 0x3c77b2a8,
  0x81c2c92e, 0x47edaee6, 0x92722c85, 0x1482353b,
  0xa2bfe8a1, 0x4cf10364, 0xa81a664b, 0xbc423001,
  0xc24b8b70, 0xd0f89791, 0xc76c51a3, 0x0654be30,
  0xd192e819, 0xd6ef5218, 0xd6990624, 0x5565a910,
  0xf40e3585, 0x5771202a, 0x106aa070, 0x32bbd1b8,
  0x19a4c116, 0xb8d2d0c8, 0x1e376c08, 0x5141ab53,
  0x2748774c, 0xdf8eeb99, 0x34b0bcb5, 0xe19b48a8,
  0x391c0cb3, 0xc5c95a63, 0x4ed8aa4a, 0xe3418acb,
  0x5b9cca4f, 0x7763e373, 0x682e6ff3, 0xd6b2b8a3,
  0x748f82ee, 0x5defb2fc, 0x78a5636f, 0x43172f60,
  0x84c87814, 0xa1f0ab72, 0x8cc70208, 0x1a6439ec,
  0x90befffa, 0x23631e28, 0xa4506ceb, 0xde82bde9,
  0xbef9a3f7, 0xb2c67915, 0xc67178f2, 0xe372532b,
  0xca273ece, 0xea26619c, 0xd186b8c7, 0x21c0c207,
  0xeada7dd6, 0xcde0eb1e, 0xf57d4f7f, 0xee6ed178,
  0x06f067aa, 0x72176fba, 0x0a637dc5, 0xa2c898a6,
  0x113f9804, 0xbef90dae, 0x1b710b35, 0x131c471b,
  0x28db77f5, 0x23047d84, 0x32caab7b, 0x40c72493,
  0x3c9ebe0a, 0x15c9bebc, 0x431d67c4, 0x9c100d4c,
  0x4cc5d4be, 0xcb3e42b6, 0x597f299c, 0xfc657e2a,
  0x5fcb6fab, 0x3ad6faec, 0x6c44198c, 0x4a475817
];

function crypto_hashblocks_hl(hh, hl, m, n) {
  var wh = new Int32Array(16), wl = new Int32Array(16),
      bh0, bh1, bh2, bh3, bh4, bh5, bh6, bh7,
      bl0, bl1, bl2, bl3, bl4, bl5, bl6, bl7,
      th, tl, i, j, h, l, a, b, c, d;

  var ah0 = hh[0],
      ah1 = hh[1],
      ah2 = hh[2],
      ah3 = hh[3],
      ah4 = hh[4],
      ah5 = hh[5],
      ah6 = hh[6],
      ah7 = hh[7],

      al0 = hl[0],
      al1 = hl[1],
      al2 = hl[2],
      al3 = hl[3],
      al4 = hl[4],
      al5 = hl[5],
      al6 = hl[6],
      al7 = hl[7];

  var pos = 0;
  while (n >= 128) {
    for (i = 0; i < 16; i++) {
      j = 8 * i + pos;
      wh[i] = (m[j+0] << 24) | (m[j+1] << 16) | (m[j+2] << 8) | m[j+3];
      wl[i] = (m[j+4] << 24) | (m[j+5] << 16) | (m[j+6] << 8) | m[j+7];
    }
    for (i = 0; i < 80; i++) {
      bh0 = ah0;
      bh1 = ah1;
      bh2 = ah2;
      bh3 = ah3;
      bh4 = ah4;
      bh5 = ah5;
      bh6 = ah6;
      bh7 = ah7;

      bl0 = al0;
      bl1 = al1;
      bl2 = al2;
      bl3 = al3;
      bl4 = al4;
      bl5 = al5;
      bl6 = al6;
      bl7 = al7;

      // add
      h = ah7;
      l = al7;

      a = l & 0xffff; b = l >>> 16;
      c = h & 0xffff; d = h >>> 16;

      // Sigma1
      h = ((ah4 >>> 14) | (al4 << (32-14))) ^ ((ah4 >>> 18) | (al4 << (32-18))) ^ ((al4 >>> (41-32)) | (ah4 << (32-(41-32))));
      l = ((al4 >>> 14) | (ah4 << (32-14))) ^ ((al4 >>> 18) | (ah4 << (32-18))) ^ ((ah4 >>> (41-32)) | (al4 << (32-(41-32))));

      a += l & 0xffff; b += l >>> 16;
      c += h & 0xffff; d += h >>> 16;

      // Ch
      h = (ah4 & ah5) ^ (~ah4 & ah6);
      l = (al4 & al5) ^ (~al4 & al6);

      a += l & 0xffff; b += l >>> 16;
      c += h & 0xffff; d += h >>> 16;

      // K
      h = K[i*2];
      l = K[i*2+1];

      a += l & 0xffff; b += l >>> 16;
      c += h & 0xffff; d += h >>> 16;

      // w
      h = wh[i%16];
      l = wl[i%16];

      a += l & 0xffff; b += l >>> 16;
      c += h & 0xffff; d += h >>> 16;

      b += a >>> 16;
      c += b >>> 16;
      d += c >>> 16;

      th = c & 0xffff | d << 16;
      tl = a & 0xffff | b << 16;

      // add
      h = th;
      l = tl;

      a = l & 0xffff; b = l >>> 16;
      c = h & 0xffff; d = h >>> 16;

      // Sigma0
      h = ((ah0 >>> 28) | (al0 << (32-28))) ^ ((al0 >>> (34-32)) | (ah0 << (32-(34-32)))) ^ ((al0 >>> (39-32)) | (ah0 << (32-(39-32))));
      l = ((al0 >>> 28) | (ah0 << (32-28))) ^ ((ah0 >>> (34-32)) | (al0 << (32-(34-32)))) ^ ((ah0 >>> (39-32)) | (al0 << (32-(39-32))));

      a += l & 0xffff; b += l >>> 16;
      c += h & 0xffff; d += h >>> 16;

      // Maj
      h = (ah0 & ah1) ^ (ah0 & ah2) ^ (ah1 & ah2);
      l = (al0 & al1) ^ (al0 & al2) ^ (al1 & al2);

      a += l & 0xffff; b += l >>> 16;
      c += h & 0xffff; d += h >>> 16;

      b += a >>> 16;
      c += b >>> 16;
      d += c >>> 16;

      bh7 = (c & 0xffff) | (d << 16);
      bl7 = (a & 0xffff) | (b << 16);

      // add
      h = bh3;
      l = bl3;

      a = l & 0xffff; b = l >>> 16;
      c = h & 0xffff; d = h >>> 16;

      h = th;
      l = tl;

      a += l & 0xffff; b += l >>> 16;
      c += h & 0xffff; d += h >>> 16;

      b += a >>> 16;
      c += b >>> 16;
      d += c >>> 16;

      bh3 = (c & 0xffff) | (d << 16);
      bl3 = (a & 0xffff) | (b << 16);

      ah1 = bh0;
      ah2 = bh1;
      ah3 = bh2;
      ah4 = bh3;
      ah5 = bh4;
      ah6 = bh5;
      ah7 = bh6;
      ah0 = bh7;

      al1 = bl0;
      al2 = bl1;
      al3 = bl2;
      al4 = bl3;
      al5 = bl4;
      al6 = bl5;
      al7 = bl6;
      al0 = bl7;

      if (i%16 === 15) {
        for (j = 0; j < 16; j++) {
          // add
          h = wh[j];
          l = wl[j];

          a = l & 0xffff; b = l >>> 16;
          c = h & 0xffff; d = h >>> 16;

          h = wh[(j+9)%16];
          l = wl[(j+9)%16];

          a += l & 0xffff; b += l >>> 16;
          c += h & 0xffff; d += h >>> 16;

          // sigma0
          th = wh[(j+1)%16];
          tl = wl[(j+1)%16];
          h = ((th >>> 1) | (tl << (32-1))) ^ ((th >>> 8) | (tl << (32-8))) ^ (th >>> 7);
          l = ((tl >>> 1) | (th << (32-1))) ^ ((tl >>> 8) | (th << (32-8))) ^ ((tl >>> 7) | (th << (32-7)));

          a += l & 0xffff; b += l >>> 16;
          c += h & 0xffff; d += h >>> 16;

          // sigma1
          th = wh[(j+14)%16];
          tl = wl[(j+14)%16];
          h = ((th >>> 19) | (tl << (32-19))) ^ ((tl >>> (61-32)) | (th << (32-(61-32)))) ^ (th >>> 6);
          l = ((tl >>> 19) | (th << (32-19))) ^ ((th >>> (61-32)) | (tl << (32-(61-32)))) ^ ((tl >>> 6) | (th << (32-6)));

          a += l & 0xffff; b += l >>> 16;
          c += h & 0xffff; d += h >>> 16;

          b += a >>> 16;
          c += b >>> 16;
          d += c >>> 16;

          wh[j] = (c & 0xffff) | (d << 16);
          wl[j] = (a & 0xffff) | (b << 16);
        }
      }
    }

    // add
    h = ah0;
    l = al0;

    a = l & 0xffff; b = l >>> 16;
    c = h & 0xffff; d = h >>> 16;

    h = hh[0];
    l = hl[0];

    a += l & 0xffff; b += l >>> 16;
    c += h & 0xffff; d += h >>> 16;

    b += a >>> 16;
    c += b >>> 16;
    d += c >>> 16;

    hh[0] = ah0 = (c & 0xffff) | (d << 16);
    hl[0] = al0 = (a & 0xffff) | (b << 16);

    h = ah1;
    l = al1;

    a = l & 0xffff; b = l >>> 16;
    c = h & 0xffff; d = h >>> 16;

    h = hh[1];
    l = hl[1];

    a += l & 0xffff; b += l >>> 16;
    c += h & 0xffff; d += h >>> 16;

    b += a >>> 16;
    c += b >>> 16;
    d += c >>> 16;

    hh[1] = ah1 = (c & 0xffff) | (d << 16);
    hl[1] = al1 = (a & 0xffff) | (b << 16);

    h = ah2;
    l = al2;

    a = l & 0xffff; b = l >>> 16;
    c = h & 0xffff; d = h >>> 16;

    h = hh[2];
    l = hl[2];

    a += l & 0xffff; b += l >>> 16;
    c += h & 0xffff; d += h >>> 16;

    b += a >>> 16;
    c += b >>> 16;
    d += c >>> 16;

    hh[2] = ah2 = (c & 0xffff) | (d << 16);
    hl[2] = al2 = (a & 0xffff) | (b << 16);

    h = ah3;
    l = al3;

    a = l & 0xffff; b = l >>> 16;
    c = h & 0xffff; d = h >>> 16;

    h = hh[3];
    l = hl[3];

    a += l & 0xffff; b += l >>> 16;
    c += h & 0xffff; d += h >>> 16;

    b += a >>> 16;
    c += b >>> 16;
    d += c >>> 16;

    hh[3] = ah3 = (c & 0xffff) | (d << 16);
    hl[3] = al3 = (a & 0xffff) | (b << 16);

    h = ah4;
    l = al4;

    a = l & 0xffff; b = l >>> 16;
    c = h & 0xffff; d = h >>> 16;

    h = hh[4];
    l = hl[4];

    a += l & 0xffff; b += l >>> 16;
    c += h & 0xffff; d += h >>> 16;

    b += a >>> 16;
    c += b >>> 16;
    d += c >>> 16;

    hh[4] = ah4 = (c & 0xffff) | (d << 16);
    hl[4] = al4 = (a & 0xffff) | (b << 16);

    h = ah5;
    l = al5;

    a = l & 0xffff; b = l >>> 16;
    c = h & 0xffff; d = h >>> 16;

    h = hh[5];
    l = hl[5];

    a += l & 0xffff; b += l >>> 16;
    c += h & 0xffff; d += h >>> 16;

    b += a >>> 16;
    c += b >>> 16;
    d += c >>> 16;

    hh[5] = ah5 = (c & 0xffff) | (d << 16);
    hl[5] = al5 = (a & 0xffff) | (b << 16);

    h = ah6;
    l = al6;

    a = l & 0xffff; b = l >>> 16;
    c = h & 0xffff; d = h >>> 16;

    h = hh[6];
    l = hl[6];

    a += l & 0xffff; b += l >>> 16;
    c += h & 0xffff; d += h >>> 16;

    b += a >>> 16;
    c += b >>> 16;
    d += c >>> 16;

    hh[6] = ah6 = (c & 0xffff) | (d << 16);
    hl[6] = al6 = (a & 0xffff) | (b << 16);

    h = ah7;
    l = al7;

    a = l & 0xffff; b = l >>> 16;
    c = h & 0xffff; d = h >>> 16;

    h = hh[7];
    l = hl[7];

    a += l & 0xffff; b += l >>> 16;
    c += h & 0xffff; d += h >>> 16;

    b += a >>> 16;
    c += b >>> 16;
    d += c >>> 16;

    hh[7] = ah7 = (c & 0xffff) | (d << 16);
    hl[7] = al7 = (a & 0xffff) | (b << 16);

    pos += 128;
    n -= 128;
  }

  return n;
}

function crypto_hash(out, m, n) {
  var hh = new Int32Array(8),
      hl = new Int32Array(8),
      x = new Uint8Array(256),
      i, b = n;

  hh[0] = 0x6a09e667;
  hh[1] = 0xbb67ae85;
  hh[2] = 0x3c6ef372;
  hh[3] = 0xa54ff53a;
  hh[4] = 0x510e527f;
  hh[5] = 0x9b05688c;
  hh[6] = 0x1f83d9ab;
  hh[7] = 0x5be0cd19;

  hl[0] = 0xf3bcc908;
  hl[1] = 0x84caa73b;
  hl[2] = 0xfe94f82b;
  hl[3] = 0x5f1d36f1;
  hl[4] = 0xade682d1;
  hl[5] = 0x2b3e6c1f;
  hl[6] = 0xfb41bd6b;
  hl[7] = 0x137e2179;

  crypto_hashblocks_hl(hh, hl, m, n);
  n %= 128;

  for (i = 0; i < n; i++) x[i] = m[b-n+i];
  x[n] = 128;

  n = 256-128*(n<112?1:0);
  x[n-9] = 0;
  ts64(x, n-8,  (b / 0x20000000) | 0, b << 3);
  crypto_hashblocks_hl(hh, hl, x, n);

  for (i = 0; i < 8; i++) ts64(out, 8*i, hh[i], hl[i]);

  return 0;
}

function add(p, q) {
  var a = gf(), b = gf(), c = gf(),
      d = gf(), e = gf(), f = gf(),
      g = gf(), h = gf(), t = gf();

  Z(a, p[1], p[0]);
  Z(t, q[1], q[0]);
  M(a, a, t);
  A(b, p[0], p[1]);
  A(t, q[0], q[1]);
  M(b, b, t);
  M(c, p[3], q[3]);
  M(c, c, D2);
  M(d, p[2], q[2]);
  A(d, d, d);
  Z(e, b, a);
  Z(f, d, c);
  A(g, d, c);
  A(h, b, a);

  M(p[0], e, f);
  M(p[1], h, g);
  M(p[2], g, f);
  M(p[3], e, h);
}

function cswap(p, q, b) {
  var i;
  for (i = 0; i < 4; i++) {
    sel25519(p[i], q[i], b);
  }
}

function pack(r, p) {
  var tx = gf(), ty = gf(), zi = gf();
  inv25519(zi, p[2]);
  M(tx, p[0], zi);
  M(ty, p[1], zi);
  pack25519(r, ty);
  r[31] ^= par25519(tx) << 7;
}

function scalarmult(p, q, s) {
  var b, i;
  set25519(p[0], gf0);
  set25519(p[1], gf1);
  set25519(p[2], gf1);
  set25519(p[3], gf0);
  for (i = 255; i >= 0; --i) {
    b = (s[(i/8)|0] >> (i&7)) & 1;
    cswap(p, q, b);
    add(q, p);
    add(p, p);
    cswap(p, q, b);
  }
}

function scalarbase(p, s) {
  var q = [gf(), gf(), gf(), gf()];
  set25519(q[0], X);
  set25519(q[1], Y);
  set25519(q[2], gf1);
  M(q[3], X, Y);
  scalarmult(p, q, s);
}

function crypto_sign_keypair(pk, sk, seeded) {
  var d = new Uint8Array(64);
  var p = [gf(), gf(), gf(), gf()];
  var i;

  if (!seeded) randombytes(sk, 32);
  crypto_hash(d, sk, 32);
  d[0] &= 248;
  d[31] &= 127;
  d[31] |= 64;

  scalarbase(p, d);
  pack(pk, p);

  for (i = 0; i < 32; i++) sk[i+32] = pk[i];
  return 0;
}

var L = new Float64Array([0xed, 0xd3, 0xf5, 0x5c, 0x1a, 0x63, 0x12, 0x58, 0xd6, 0x9c, 0xf7, 0xa2, 0xde, 0xf9, 0xde, 0x14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x10]);

function modL(r, x) {
  var carry, i, j, k;
  for (i = 63; i >= 32; --i) {
    carry = 0;
    for (j = i - 32, k = i - 12; j < k; ++j) {
      x[j] += carry - 16 * x[i] * L[j - (i - 32)];
      carry = Math.floor((x[j] + 128) / 256);
      x[j] -= carry * 256;
    }
    x[j] += carry;
    x[i] = 0;
  }
  carry = 0;
  for (j = 0; j < 32; j++) {
    x[j] += carry - (x[31] >> 4) * L[j];
    carry = x[j] >> 8;
    x[j] &= 255;
  }
  for (j = 0; j < 32; j++) x[j] -= carry * L[j];
  for (i = 0; i < 32; i++) {
    x[i+1] += x[i] >> 8;
    r[i] = x[i] & 255;
  }
}

function reduce(r) {
  var x = new Float64Array(64), i;
  for (i = 0; i < 64; i++) x[i] = r[i];
  for (i = 0; i < 64; i++) r[i] = 0;
  modL(r, x);
}

// Note: difference from C - smlen returned, not passed as argument.
function crypto_sign(sm, m, n, sk) {
  var d = new Uint8Array(64), h = new Uint8Array(64), r = new Uint8Array(64);
  var i, j, x = new Float64Array(64);
  var p = [gf(), gf(), gf(), gf()];

  crypto_hash(d, sk, 32);
  d[0] &= 248;
  d[31] &= 127;
  d[31] |= 64;

  var smlen = n + 64;
  for (i = 0; i < n; i++) sm[64 + i] = m[i];
  for (i = 0; i < 32; i++) sm[32 + i] = d[32 + i];

  crypto_hash(r, sm.subarray(32), n+32);
  reduce(r);
  scalarbase(p, r);
  pack(sm, p);

  for (i = 32; i < 64; i++) sm[i] = sk[i];
  crypto_hash(h, sm, n + 64);
  reduce(h);

  for (i = 0; i < 64; i++) x[i] = 0;
  for (i = 0; i < 32; i++) x[i] = r[i];
  for (i = 0; i < 32; i++) {
    for (j = 0; j < 32; j++) {
      x[i+j] += h[i] * d[j];
    }
  }

  modL(sm.subarray(32), x);
  return smlen;
}

function unpackneg(r, p) {
  var t = gf(), chk = gf(), num = gf(),
      den = gf(), den2 = gf(), den4 = gf(),
      den6 = gf();

  set25519(r[2], gf1);
  unpack25519(r[1], p);
  S(num, r[1]);
  M(den, num, D);
  Z(num, num, r[2]);
  A(den, r[2], den);

  S(den2, den);
  S(den4, den2);
  M(den6, den4, den2);
  M(t, den6, num);
  M(t, t, den);

  pow2523(t, t);
  M(t, t, num);
  M(t, t, den);
  M(t, t, den);
  M(r[0], t, den);

  S(chk, r[0]);
  M(chk, chk, den);
  if (neq25519(chk, num)) M(r[0], r[0], I);

  S(chk, r[0]);
  M(chk, chk, den);
  if (neq25519(chk, num)) return -1;

  if (par25519(r[0]) === (p[31]>>7)) Z(r[0], gf0, r[0]);

  M(r[3], r[0], r[1]);
  return 0;
}

function crypto_sign_open(m, sm, n, pk) {
  var i;
  var t = new Uint8Array(32), h = new Uint8Array(64);
  var p = [gf(), gf(), gf(), gf()],
      q = [gf(), gf(), gf(), gf()];

  if (n < 64) return -1;

  if (unpackneg(q, pk)) return -1;

  for (i = 0; i < n; i++) m[i] = sm[i];
  for (i = 0; i < 32; i++) m[i+32] = pk[i];
  crypto_hash(h, m, n);
  reduce(h);
  scalarmult(p, q, h);

  scalarbase(q, sm.subarray(32));
  add(p, q);
  pack(t, p);

  n -= 64;
  if (crypto_verify_32(sm, 0, t, 0)) {
    for (i = 0; i < n; i++) m[i] = 0;
    return -1;
  }

  for (i = 0; i < n; i++) m[i] = sm[i + 64];
  return n;
}

var crypto_secretbox_KEYBYTES = 32,
    crypto_secretbox_NONCEBYTES = 24,
    crypto_secretbox_ZEROBYTES = 32,
    crypto_secretbox_BOXZEROBYTES = 16,
    crypto_scalarmult_BYTES = 32,
    crypto_scalarmult_SCALARBYTES = 32,
    crypto_box_PUBLICKEYBYTES = 32,
    crypto_box_SECRETKEYBYTES = 32,
    crypto_box_BEFORENMBYTES = 32,
    crypto_box_NONCEBYTES = crypto_secretbox_NONCEBYTES,
    crypto_box_ZEROBYTES = crypto_secretbox_ZEROBYTES,
    crypto_box_BOXZEROBYTES = crypto_secretbox_BOXZEROBYTES,
    crypto_sign_BYTES = 64,
    crypto_sign_PUBLICKEYBYTES = 32,
    crypto_sign_SECRETKEYBYTES = 64,
    crypto_sign_SEEDBYTES = 32,
    crypto_hash_BYTES = 64;

nacl.lowlevel = {
  crypto_core_hsalsa20: crypto_core_hsalsa20,
  crypto_stream_xor: crypto_stream_xor,
  crypto_stream: crypto_stream,
  crypto_stream_salsa20_xor: crypto_stream_salsa20_xor,
  crypto_stream_salsa20: crypto_stream_salsa20,
  crypto_onetimeauth: crypto_onetimeauth,
  crypto_onetimeauth_verify: crypto_onetimeauth_verify,
  crypto_verify_16: crypto_verify_16,
  crypto_verify_32: crypto_verify_32,
  crypto_secretbox: crypto_secretbox,
  crypto_secretbox_open: crypto_secretbox_open,
  crypto_scalarmult: crypto_scalarmult,
  crypto_scalarmult_base: crypto_scalarmult_base,
  crypto_box_beforenm: crypto_box_beforenm,
  crypto_box_afternm: crypto_box_afternm,
  crypto_box: crypto_box,
  crypto_box_open: crypto_box_open,
  crypto_box_keypair: crypto_box_keypair,
  crypto_hash: crypto_hash,
  crypto_sign: crypto_sign,
  crypto_sign_keypair: crypto_sign_keypair,
  crypto_sign_open: crypto_sign_open,

  crypto_secretbox_KEYBYTES: crypto_secretbox_KEYBYTES,
  crypto_secretbox_NONCEBYTES: crypto_secretbox_NONCEBYTES,
  crypto_secretbox_ZEROBYTES: crypto_secretbox_ZEROBYTES,
  crypto_secretbox_BOXZEROBYTES: crypto_secretbox_BOXZEROBYTES,
  crypto_scalarmult_BYTES: crypto_scalarmult_BYTES,
  crypto_scalarmult_SCALARBYTES: crypto_scalarmult_SCALARBYTES,
  crypto_box_PUBLICKEYBYTES: crypto_box_PUBLICKEYBYTES,
  crypto_box_SECRETKEYBYTES: crypto_box_SECRETKEYBYTES,
  crypto_box_BEFORENMBYTES: crypto_box_BEFORENMBYTES,
  crypto_box_NONCEBYTES: crypto_box_NONCEBYTES,
  crypto_box_ZEROBYTES: crypto_box_ZEROBYTES,
  crypto_box_BOXZEROBYTES: crypto_box_BOXZEROBYTES,
  crypto_sign_BYTES: crypto_sign_BYTES,
  crypto_sign_PUBLICKEYBYTES: crypto_sign_PUBLICKEYBYTES,
  crypto_sign_SECRETKEYBYTES: crypto_sign_SECRETKEYBYTES,
  crypto_sign_SEEDBYTES: crypto_sign_SEEDBYTES,
  crypto_hash_BYTES: crypto_hash_BYTES,

  gf: gf,
  D: D,
  L: L,
  pack25519: pack25519,
  unpack25519: unpack25519,
  M: M,
  A: A,
  S: S,
  Z: Z,
  pow2523: pow2523,
  add: add,
  set25519: set25519,
  modL: modL,
  scalarmult: scalarmult,
  scalarbase: scalarbase,
};

/* High-level API */

function checkLengths(k, n) {
  if (k.length !== crypto_secretbox_KEYBYTES) throw new Error('bad key size');
  if (n.length !== crypto_secretbox_NONCEBYTES) throw new Error('bad nonce size');
}

function checkBoxLengths(pk, sk) {
  if (pk.length !== crypto_box_PUBLICKEYBYTES) throw new Error('bad public key size');
  if (sk.length !== crypto_box_SECRETKEYBYTES) throw new Error('bad secret key size');
}

function checkArrayTypes() {
  for (var i = 0; i < arguments.length; i++) {
    if (!(arguments[i] instanceof Uint8Array))
      throw new TypeError('unexpected type, use Uint8Array');
  }
}

function cleanup(arr) {
  for (var i = 0; i < arr.length; i++) arr[i] = 0;
}

nacl.randomBytes = function(n) {
  var b = new Uint8Array(n);
  randombytes(b, n);
  return b;
};

nacl.secretbox = function(msg, nonce, key) {
  checkArrayTypes(msg, nonce, key);
  checkLengths(key, nonce);
  var m = new Uint8Array(crypto_secretbox_ZEROBYTES + msg.length);
  var c = new Uint8Array(m.length);
  for (var i = 0; i < msg.length; i++) m[i+crypto_secretbox_ZEROBYTES] = msg[i];
  crypto_secretbox(c, m, m.length, nonce, key);
  return c.subarray(crypto_secretbox_BOXZEROBYTES);
};

nacl.secretbox.open = function(box, nonce, key) {
  checkArrayTypes(box, nonce, key);
  checkLengths(key, nonce);
  var c = new Uint8Array(crypto_secretbox_BOXZEROBYTES + box.length);
  var m = new Uint8Array(c.length);
  for (var i = 0; i < box.length; i++) c[i+crypto_secretbox_BOXZEROBYTES] = box[i];
  if (c.length < 32) return null;
  if (crypto_secretbox_open(m, c, c.length, nonce, key) !== 0) return null;
  return m.subarray(crypto_secretbox_ZEROBYTES);
};

nacl.secretbox.keyLength = crypto_secretbox_KEYBYTES;
nacl.secretbox.nonceLength = crypto_secretbox_NONCEBYTES;
nacl.secretbox.overheadLength = crypto_secretbox_BOXZEROBYTES;

nacl.scalarMult = function(n, p) {
  checkArrayTypes(n, p);
  if (n.length !== crypto_scalarmult_SCALARBYTES) throw new Error('bad n size');
  if (p.length !== crypto_scalarmult_BYTES) throw new Error('bad p size');
  var q = new Uint8Array(crypto_scalarmult_BYTES);
  crypto_scalarmult(q, n, p);
  return q;
};

nacl.scalarMult.base = function(n) {
  checkArrayTypes(n);
  if (n.length !== crypto_scalarmult_SCALARBYTES) throw new Error('bad n size');
  var q = new Uint8Array(crypto_scalarmult_BYTES);
  crypto_scalarmult_base(q, n);
  return q;
};

nacl.scalarMult.scalarLength = crypto_scalarmult_SCALARBYTES;
nacl.scalarMult.groupElementLength = crypto_scalarmult_BYTES;

nacl.box = function(msg, nonce, publicKey, secretKey) {
  var k = nacl.box.before(publicKey, secretKey);
  return nacl.secretbox(msg, nonce, k);
};

nacl.box.before = function(publicKey, secretKey) {
  checkArrayTypes(publicKey, secretKey);
  checkBoxLengths(publicKey, secretKey);
  var k = new Uint8Array(crypto_box_BEFORENMBYTES);
  crypto_box_beforenm(k, publicKey, secretKey);
  return k;
};

nacl.box.after = nacl.secretbox;

nacl.box.open = function(msg, nonce, publicKey, secretKey) {
  var k = nacl.box.before(publicKey, secretKey);
  return nacl.secretbox.open(msg, nonce, k);
};

nacl.box.open.after = nacl.secretbox.open;

nacl.box.keyPair = function() {
  var pk = new Uint8Array(crypto_box_PUBLICKEYBYTES);
  var sk = new Uint8Array(crypto_box_SECRETKEYBYTES);
  crypto_box_keypair(pk, sk);
  return {publicKey: pk, secretKey: sk};
};

nacl.box.keyPair.fromSecretKey = function(secretKey) {
  checkArrayTypes(secretKey);
  if (secretKey.length !== crypto_box_SECRETKEYBYTES)
    throw new Error('bad secret key size');
  var pk = new Uint8Array(crypto_box_PUBLICKEYBYTES);
  crypto_scalarmult_base(pk, secretKey);
  return {publicKey: pk, secretKey: new Uint8Array(secretKey)};
};

nacl.box.publicKeyLength = crypto_box_PUBLICKEYBYTES;
nacl.box.secretKeyLength = crypto_box_SECRETKEYBYTES;
nacl.box.sharedKeyLength = crypto_box_BEFORENMBYTES;
nacl.box.nonceLength = crypto_box_NONCEBYTES;
nacl.box.overheadLength = nacl.secretbox.overheadLength;

nacl.sign = function(msg, secretKey) {
  checkArrayTypes(msg, secretKey);
  if (secretKey.length !== crypto_sign_SECRETKEYBYTES)
    throw new Error('bad secret key size');
  var signedMsg = new Uint8Array(crypto_sign_BYTES+msg.length);
  crypto_sign(signedMsg, msg, msg.length, secretKey);
  return signedMsg;
};

nacl.sign.open = function(signedMsg, publicKey) {
  checkArrayTypes(signedMsg, publicKey);
  if (publicKey.length !== crypto_sign_PUBLICKEYBYTES)
    throw new Error('bad public key size');
  var tmp = new Uint8Array(signedMsg.length);
  var mlen = crypto_sign_open(tmp, signedMsg, signedMsg.length, publicKey);
  if (mlen < 0) return null;
  var m = new Uint8Array(mlen);
  for (var i = 0; i < m.length; i++) m[i] = tmp[i];
  return m;
};

nacl.sign.detached = function(msg, secretKey) {
  var signedMsg = nacl.sign(msg, secretKey);
  var sig = new Uint8Array(crypto_sign_BYTES);
  for (var i = 0; i < sig.length; i++) sig[i] = signedMsg[i];
  return sig;
};

nacl.sign.detached.verify = function(msg, sig, publicKey) {
  checkArrayTypes(msg, sig, publicKey);
  if (sig.length !== crypto_sign_BYTES)
    throw new Error('bad signature size');
  if (publicKey.length !== crypto_sign_PUBLICKEYBYTES)
    throw new Error('bad public key size');
  var sm = new Uint8Array(crypto_sign_BYTES + msg.length);
  var m = new Uint8Array(crypto_sign_BYTES + msg.length);
  var i;
  for (i = 0; i < crypto_sign_BYTES; i++) sm[i] = sig[i];
  for (i = 0; i < msg.length; i++) sm[i+crypto_sign_BYTES] = msg[i];
  return (crypto_sign_open(m, sm, sm.length, publicKey) >= 0);
};

nacl.sign.keyPair = function() {
  var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
  var sk = new Uint8Array(crypto_sign_SECRETKEYBYTES);
  crypto_sign_keypair(pk, sk);
  return {publicKey: pk, secretKey: sk};
};

nacl.sign.keyPair.fromSecretKey = function(secretKey) {
  checkArrayTypes(secretKey);
  if (secretKey.length !== crypto_sign_SECRETKEYBYTES)
    throw new Error('bad secret key size');
  var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
  for (var i = 0; i < pk.length; i++) pk[i] = secretKey[32+i];
  return {publicKey: pk, secretKey: new Uint8Array(secretKey)};
};

nacl.sign.keyPair.fromSeed = function(seed) {
  checkArrayTypes(seed);
  if (seed.length !== crypto_sign_SEEDBYTES)
    throw new Error('bad seed size');
  var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
  var sk = new Uint8Array(crypto_sign_SECRETKEYBYTES);
  for (var i = 0; i < 32; i++) sk[i] = seed[i];
  crypto_sign_keypair(pk, sk, true);
  return {publicKey: pk, secretKey: sk};
};

nacl.sign.publicKeyLength = crypto_sign_PUBLICKEYBYTES;
nacl.sign.secretKeyLength = crypto_sign_SECRETKEYBYTES;
nacl.sign.seedLength = crypto_sign_SEEDBYTES;
nacl.sign.signatureLength = crypto_sign_BYTES;

nacl.hash = function(msg) {
  checkArrayTypes(msg);
  var h = new Uint8Array(crypto_hash_BYTES);
  crypto_hash(h, msg, msg.length);
  return h;
};

nacl.hash.hashLength = crypto_hash_BYTES;

nacl.verify = function(x, y) {
  checkArrayTypes(x, y);
  // Zero length arguments are considered not equal.
  if (x.length === 0 || y.length === 0) return false;
  if (x.length !== y.length) return false;
  return (vn(x, 0, y, 0, x.length) === 0) ? true : false;
};

nacl.setPRNG = function(fn) {
  randombytes = fn;
};

(function() {
  // Initialize PRNG if environment provides CSPRNG.
  // If not, methods calling randombytes will throw.
  var crypto = typeof self !== 'undefined' ? (self.crypto || self.msCrypto) : null;
  if (crypto && crypto.getRandomValues) {
    // Browsers.
    var QUOTA = 65536;
    nacl.setPRNG(function(x, n) {
      var i, v = new Uint8Array(n);
      for (i = 0; i < n; i += QUOTA) {
        crypto.getRandomValues(v.subarray(i, i + Math.min(n - i, QUOTA)));
      }
      for (i = 0; i < n; i++) x[i] = v[i];
      cleanup(v);
    });
  } else if (typeof require !== 'undefined') {
    // Node.js.
    crypto = require('crypto');
    if (crypto && crypto.randomBytes) {
      nacl.setPRNG(function(x, n) {
        var i, v = crypto.randomBytes(n);
        for (i = 0; i < n; i++) x[i] = v[i];
        cleanup(v);
      });
    }
  }
})();

})(typeof module !== 'undefined' && module.exports ? module.exports : (self.nacl = self.nacl || {}));

},{"crypto":"../node_modules/parcel-bundler/src/builtins/_empty.js"}],"../node_modules/near-api-js/node_modules/bn.js/lib/bn.js":[function(require,module,exports) {
var Buffer = require("buffer").Buffer;
(function (module, exports) {
  'use strict';

  // Utils
  function assert (val, msg) {
    if (!val) throw new Error(msg || 'Assertion failed');
  }

  // Could use `inherits` module, but don't want to move from single file
  // architecture yet.
  function inherits (ctor, superCtor) {
    ctor.super_ = superCtor;
    var TempCtor = function () {};
    TempCtor.prototype = superCtor.prototype;
    ctor.prototype = new TempCtor();
    ctor.prototype.constructor = ctor;
  }

  // BN

  function BN (number, base, endian) {
    if (BN.isBN(number)) {
      return number;
    }

    this.negative = 0;
    this.words = null;
    this.length = 0;

    // Reduction context
    this.red = null;

    if (number !== null) {
      if (base === 'le' || base === 'be') {
        endian = base;
        base = 10;
      }

      this._init(number || 0, base || 10, endian || 'be');
    }
  }
  if (typeof module === 'object') {
    module.exports = BN;
  } else {
    exports.BN = BN;
  }

  BN.BN = BN;
  BN.wordSize = 26;

  var Buffer;
  try {
    if (typeof window !== 'undefined' && typeof window.Buffer !== 'undefined') {
      Buffer = window.Buffer;
    } else {
      Buffer = require('buffer').Buffer;
    }
  } catch (e) {
  }

  BN.isBN = function isBN (num) {
    if (num instanceof BN) {
      return true;
    }

    return num !== null && typeof num === 'object' &&
      num.constructor.wordSize === BN.wordSize && Array.isArray(num.words);
  };

  BN.max = function max (left, right) {
    if (left.cmp(right) > 0) return left;
    return right;
  };

  BN.min = function min (left, right) {
    if (left.cmp(right) < 0) return left;
    return right;
  };

  BN.prototype._init = function init (number, base, endian) {
    if (typeof number === 'number') {
      return this._initNumber(number, base, endian);
    }

    if (typeof number === 'object') {
      return this._initArray(number, base, endian);
    }

    if (base === 'hex') {
      base = 16;
    }
    assert(base === (base | 0) && base >= 2 && base <= 36);

    number = number.toString().replace(/\s+/g, '');
    var start = 0;
    if (number[0] === '-') {
      start++;
      this.negative = 1;
    }

    if (start < number.length) {
      if (base === 16) {
        this._parseHex(number, start, endian);
      } else {
        this._parseBase(number, base, start);
        if (endian === 'le') {
          this._initArray(this.toArray(), base, endian);
        }
      }
    }
  };

  BN.prototype._initNumber = function _initNumber (number, base, endian) {
    if (number < 0) {
      this.negative = 1;
      number = -number;
    }
    if (number < 0x4000000) {
      this.words = [number & 0x3ffffff];
      this.length = 1;
    } else if (number < 0x10000000000000) {
      this.words = [
        number & 0x3ffffff,
        (number / 0x4000000) & 0x3ffffff
      ];
      this.length = 2;
    } else {
      assert(number < 0x20000000000000); // 2 ^ 53 (unsafe)
      this.words = [
        number & 0x3ffffff,
        (number / 0x4000000) & 0x3ffffff,
        1
      ];
      this.length = 3;
    }

    if (endian !== 'le') return;

    // Reverse the bytes
    this._initArray(this.toArray(), base, endian);
  };

  BN.prototype._initArray = function _initArray (number, base, endian) {
    // Perhaps a Uint8Array
    assert(typeof number.length === 'number');
    if (number.length <= 0) {
      this.words = [0];
      this.length = 1;
      return this;
    }

    this.length = Math.ceil(number.length / 3);
    this.words = new Array(this.length);
    for (var i = 0; i < this.length; i++) {
      this.words[i] = 0;
    }

    var j, w;
    var off = 0;
    if (endian === 'be') {
      for (i = number.length - 1, j = 0; i >= 0; i -= 3) {
        w = number[i] | (number[i - 1] << 8) | (number[i - 2] << 16);
        this.words[j] |= (w << off) & 0x3ffffff;
        this.words[j + 1] = (w >>> (26 - off)) & 0x3ffffff;
        off += 24;
        if (off >= 26) {
          off -= 26;
          j++;
        }
      }
    } else if (endian === 'le') {
      for (i = 0, j = 0; i < number.length; i += 3) {
        w = number[i] | (number[i + 1] << 8) | (number[i + 2] << 16);
        this.words[j] |= (w << off) & 0x3ffffff;
        this.words[j + 1] = (w >>> (26 - off)) & 0x3ffffff;
        off += 24;
        if (off >= 26) {
          off -= 26;
          j++;
        }
      }
    }
    return this._strip();
  };

  function parseHex4Bits (string, index) {
    var c = string.charCodeAt(index);
    // '0' - '9'
    if (c >= 48 && c <= 57) {
      return c - 48;
    // 'A' - 'F'
    } else if (c >= 65 && c <= 70) {
      return c - 55;
    // 'a' - 'f'
    } else if (c >= 97 && c <= 102) {
      return c - 87;
    } else {
      assert(false, 'Invalid character in ' + string);
    }
  }

  function parseHexByte (string, lowerBound, index) {
    var r = parseHex4Bits(string, index);
    if (index - 1 >= lowerBound) {
      r |= parseHex4Bits(string, index - 1) << 4;
    }
    return r;
  }

  BN.prototype._parseHex = function _parseHex (number, start, endian) {
    // Create possibly bigger array to ensure that it fits the number
    this.length = Math.ceil((number.length - start) / 6);
    this.words = new Array(this.length);
    for (var i = 0; i < this.length; i++) {
      this.words[i] = 0;
    }

    // 24-bits chunks
    var off = 0;
    var j = 0;

    var w;
    if (endian === 'be') {
      for (i = number.length - 1; i >= start; i -= 2) {
        w = parseHexByte(number, start, i) << off;
        this.words[j] |= w & 0x3ffffff;
        if (off >= 18) {
          off -= 18;
          j += 1;
          this.words[j] |= w >>> 26;
        } else {
          off += 8;
        }
      }
    } else {
      var parseLength = number.length - start;
      for (i = parseLength % 2 === 0 ? start + 1 : start; i < number.length; i += 2) {
        w = parseHexByte(number, start, i) << off;
        this.words[j] |= w & 0x3ffffff;
        if (off >= 18) {
          off -= 18;
          j += 1;
          this.words[j] |= w >>> 26;
        } else {
          off += 8;
        }
      }
    }

    this._strip();
  };

  function parseBase (str, start, end, mul) {
    var r = 0;
    var b = 0;
    var len = Math.min(str.length, end);
    for (var i = start; i < len; i++) {
      var c = str.charCodeAt(i) - 48;

      r *= mul;

      // 'a'
      if (c >= 49) {
        b = c - 49 + 0xa;

      // 'A'
      } else if (c >= 17) {
        b = c - 17 + 0xa;

      // '0' - '9'
      } else {
        b = c;
      }
      assert(c >= 0 && b < mul, 'Invalid character');
      r += b;
    }
    return r;
  }

  BN.prototype._parseBase = function _parseBase (number, base, start) {
    // Initialize as zero
    this.words = [0];
    this.length = 1;

    // Find length of limb in base
    for (var limbLen = 0, limbPow = 1; limbPow <= 0x3ffffff; limbPow *= base) {
      limbLen++;
    }
    limbLen--;
    limbPow = (limbPow / base) | 0;

    var total = number.length - start;
    var mod = total % limbLen;
    var end = Math.min(total, total - mod) + start;

    var word = 0;
    for (var i = start; i < end; i += limbLen) {
      word = parseBase(number, i, i + limbLen, base);

      this.imuln(limbPow);
      if (this.words[0] + word < 0x4000000) {
        this.words[0] += word;
      } else {
        this._iaddn(word);
      }
    }

    if (mod !== 0) {
      var pow = 1;
      word = parseBase(number, i, number.length, base);

      for (i = 0; i < mod; i++) {
        pow *= base;
      }

      this.imuln(pow);
      if (this.words[0] + word < 0x4000000) {
        this.words[0] += word;
      } else {
        this._iaddn(word);
      }
    }

    this._strip();
  };

  BN.prototype.copy = function copy (dest) {
    dest.words = new Array(this.length);
    for (var i = 0; i < this.length; i++) {
      dest.words[i] = this.words[i];
    }
    dest.length = this.length;
    dest.negative = this.negative;
    dest.red = this.red;
  };

  function move (dest, src) {
    dest.words = src.words;
    dest.length = src.length;
    dest.negative = src.negative;
    dest.red = src.red;
  }

  BN.prototype._move = function _move (dest) {
    move(dest, this);
  };

  BN.prototype.clone = function clone () {
    var r = new BN(null);
    this.copy(r);
    return r;
  };

  BN.prototype._expand = function _expand (size) {
    while (this.length < size) {
      this.words[this.length++] = 0;
    }
    return this;
  };

  // Remove leading `0` from `this`
  BN.prototype._strip = function strip () {
    while (this.length > 1 && this.words[this.length - 1] === 0) {
      this.length--;
    }
    return this._normSign();
  };

  BN.prototype._normSign = function _normSign () {
    // -0 = 0
    if (this.length === 1 && this.words[0] === 0) {
      this.negative = 0;
    }
    return this;
  };

  // Check Symbol.for because not everywhere where Symbol defined
  // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol#Browser_compatibility
  if (typeof Symbol !== 'undefined' && typeof Symbol.for === 'function') {
    try {
      BN.prototype[Symbol.for('nodejs.util.inspect.custom')] = inspect;
    } catch (e) {
      BN.prototype.inspect = inspect;
    }
  } else {
    BN.prototype.inspect = inspect;
  }

  function inspect () {
    return (this.red ? '<BN-R: ' : '<BN: ') + this.toString(16) + '>';
  }

  /*

  var zeros = [];
  var groupSizes = [];
  var groupBases = [];

  var s = '';
  var i = -1;
  while (++i < BN.wordSize) {
    zeros[i] = s;
    s += '0';
  }
  groupSizes[0] = 0;
  groupSizes[1] = 0;
  groupBases[0] = 0;
  groupBases[1] = 0;
  var base = 2 - 1;
  while (++base < 36 + 1) {
    var groupSize = 0;
    var groupBase = 1;
    while (groupBase < (1 << BN.wordSize) / base) {
      groupBase *= base;
      groupSize += 1;
    }
    groupSizes[base] = groupSize;
    groupBases[base] = groupBase;
  }

  */

  var zeros = [
    '',
    '0',
    '00',
    '000',
    '0000',
    '00000',
    '000000',
    '0000000',
    '00000000',
    '000000000',
    '0000000000',
    '00000000000',
    '000000000000',
    '0000000000000',
    '00000000000000',
    '000000000000000',
    '0000000000000000',
    '00000000000000000',
    '000000000000000000',
    '0000000000000000000',
    '00000000000000000000',
    '000000000000000000000',
    '0000000000000000000000',
    '00000000000000000000000',
    '000000000000000000000000',
    '0000000000000000000000000'
  ];

  var groupSizes = [
    0, 0,
    25, 16, 12, 11, 10, 9, 8,
    8, 7, 7, 7, 7, 6, 6,
    6, 6, 6, 6, 6, 5, 5,
    5, 5, 5, 5, 5, 5, 5,
    5, 5, 5, 5, 5, 5, 5
  ];

  var groupBases = [
    0, 0,
    33554432, 43046721, 16777216, 48828125, 60466176, 40353607, 16777216,
    43046721, 10000000, 19487171, 35831808, 62748517, 7529536, 11390625,
    16777216, 24137569, 34012224, 47045881, 64000000, 4084101, 5153632,
    6436343, 7962624, 9765625, 11881376, 14348907, 17210368, 20511149,
    24300000, 28629151, 33554432, 39135393, 45435424, 52521875, 60466176
  ];

  BN.prototype.toString = function toString (base, padding) {
    base = base || 10;
    padding = padding | 0 || 1;

    var out;
    if (base === 16 || base === 'hex') {
      out = '';
      var off = 0;
      var carry = 0;
      for (var i = 0; i < this.length; i++) {
        var w = this.words[i];
        var word = (((w << off) | carry) & 0xffffff).toString(16);
        carry = (w >>> (24 - off)) & 0xffffff;
        if (carry !== 0 || i !== this.length - 1) {
          out = zeros[6 - word.length] + word + out;
        } else {
          out = word + out;
        }
        off += 2;
        if (off >= 26) {
          off -= 26;
          i--;
        }
      }
      if (carry !== 0) {
        out = carry.toString(16) + out;
      }
      while (out.length % padding !== 0) {
        out = '0' + out;
      }
      if (this.negative !== 0) {
        out = '-' + out;
      }
      return out;
    }

    if (base === (base | 0) && base >= 2 && base <= 36) {
      // var groupSize = Math.floor(BN.wordSize * Math.LN2 / Math.log(base));
      var groupSize = groupSizes[base];
      // var groupBase = Math.pow(base, groupSize);
      var groupBase = groupBases[base];
      out = '';
      var c = this.clone();
      c.negative = 0;
      while (!c.isZero()) {
        var r = c.modrn(groupBase).toString(base);
        c = c.idivn(groupBase);

        if (!c.isZero()) {
          out = zeros[groupSize - r.length] + r + out;
        } else {
          out = r + out;
        }
      }
      if (this.isZero()) {
        out = '0' + out;
      }
      while (out.length % padding !== 0) {
        out = '0' + out;
      }
      if (this.negative !== 0) {
        out = '-' + out;
      }
      return out;
    }

    assert(false, 'Base should be between 2 and 36');
  };

  BN.prototype.toNumber = function toNumber () {
    var ret = this.words[0];
    if (this.length === 2) {
      ret += this.words[1] * 0x4000000;
    } else if (this.length === 3 && this.words[2] === 0x01) {
      // NOTE: at this stage it is known that the top bit is set
      ret += 0x10000000000000 + (this.words[1] * 0x4000000);
    } else if (this.length > 2) {
      assert(false, 'Number can only safely store up to 53 bits');
    }
    return (this.negative !== 0) ? -ret : ret;
  };

  BN.prototype.toJSON = function toJSON () {
    return this.toString(16, 2);
  };

  if (Buffer) {
    BN.prototype.toBuffer = function toBuffer (endian, length) {
      return this.toArrayLike(Buffer, endian, length);
    };
  }

  BN.prototype.toArray = function toArray (endian, length) {
    return this.toArrayLike(Array, endian, length);
  };

  var allocate = function allocate (ArrayType, size) {
    if (ArrayType.allocUnsafe) {
      return ArrayType.allocUnsafe(size);
    }
    return new ArrayType(size);
  };

  BN.prototype.toArrayLike = function toArrayLike (ArrayType, endian, length) {
    this._strip();

    var byteLength = this.byteLength();
    var reqLength = length || Math.max(1, byteLength);
    assert(byteLength <= reqLength, 'byte array longer than desired length');
    assert(reqLength > 0, 'Requested array length <= 0');

    var res = allocate(ArrayType, reqLength);
    var postfix = endian === 'le' ? 'LE' : 'BE';
    this['_toArrayLike' + postfix](res, byteLength);
    return res;
  };

  BN.prototype._toArrayLikeLE = function _toArrayLikeLE (res, byteLength) {
    var position = 0;
    var carry = 0;

    for (var i = 0, shift = 0; i < this.length; i++) {
      var word = (this.words[i] << shift) | carry;

      res[position++] = word & 0xff;
      if (position < res.length) {
        res[position++] = (word >> 8) & 0xff;
      }
      if (position < res.length) {
        res[position++] = (word >> 16) & 0xff;
      }

      if (shift === 6) {
        if (position < res.length) {
          res[position++] = (word >> 24) & 0xff;
        }
        carry = 0;
        shift = 0;
      } else {
        carry = word >>> 24;
        shift += 2;
      }
    }

    if (position < res.length) {
      res[position++] = carry;

      while (position < res.length) {
        res[position++] = 0;
      }
    }
  };

  BN.prototype._toArrayLikeBE = function _toArrayLikeBE (res, byteLength) {
    var position = res.length - 1;
    var carry = 0;

    for (var i = 0, shift = 0; i < this.length; i++) {
      var word = (this.words[i] << shift) | carry;

      res[position--] = word & 0xff;
      if (position >= 0) {
        res[position--] = (word >> 8) & 0xff;
      }
      if (position >= 0) {
        res[position--] = (word >> 16) & 0xff;
      }

      if (shift === 6) {
        if (position >= 0) {
          res[position--] = (word >> 24) & 0xff;
        }
        carry = 0;
        shift = 0;
      } else {
        carry = word >>> 24;
        shift += 2;
      }
    }

    if (position >= 0) {
      res[position--] = carry;

      while (position >= 0) {
        res[position--] = 0;
      }
    }
  };

  if (Math.clz32) {
    BN.prototype._countBits = function _countBits (w) {
      return 32 - Math.clz32(w);
    };
  } else {
    BN.prototype._countBits = function _countBits (w) {
      var t = w;
      var r = 0;
      if (t >= 0x1000) {
        r += 13;
        t >>>= 13;
      }
      if (t >= 0x40) {
        r += 7;
        t >>>= 7;
      }
      if (t >= 0x8) {
        r += 4;
        t >>>= 4;
      }
      if (t >= 0x02) {
        r += 2;
        t >>>= 2;
      }
      return r + t;
    };
  }

  BN.prototype._zeroBits = function _zeroBits (w) {
    // Short-cut
    if (w === 0) return 26;

    var t = w;
    var r = 0;
    if ((t & 0x1fff) === 0) {
      r += 13;
      t >>>= 13;
    }
    if ((t & 0x7f) === 0) {
      r += 7;
      t >>>= 7;
    }
    if ((t & 0xf) === 0) {
      r += 4;
      t >>>= 4;
    }
    if ((t & 0x3) === 0) {
      r += 2;
      t >>>= 2;
    }
    if ((t & 0x1) === 0) {
      r++;
    }
    return r;
  };

  // Return number of used bits in a BN
  BN.prototype.bitLength = function bitLength () {
    var w = this.words[this.length - 1];
    var hi = this._countBits(w);
    return (this.length - 1) * 26 + hi;
  };

  function toBitArray (num) {
    var w = new Array(num.bitLength());

    for (var bit = 0; bit < w.length; bit++) {
      var off = (bit / 26) | 0;
      var wbit = bit % 26;

      w[bit] = (num.words[off] >>> wbit) & 0x01;
    }

    return w;
  }

  // Number of trailing zero bits
  BN.prototype.zeroBits = function zeroBits () {
    if (this.isZero()) return 0;

    var r = 0;
    for (var i = 0; i < this.length; i++) {
      var b = this._zeroBits(this.words[i]);
      r += b;
      if (b !== 26) break;
    }
    return r;
  };

  BN.prototype.byteLength = function byteLength () {
    return Math.ceil(this.bitLength() / 8);
  };

  BN.prototype.toTwos = function toTwos (width) {
    if (this.negative !== 0) {
      return this.abs().inotn(width).iaddn(1);
    }
    return this.clone();
  };

  BN.prototype.fromTwos = function fromTwos (width) {
    if (this.testn(width - 1)) {
      return this.notn(width).iaddn(1).ineg();
    }
    return this.clone();
  };

  BN.prototype.isNeg = function isNeg () {
    return this.negative !== 0;
  };

  // Return negative clone of `this`
  BN.prototype.neg = function neg () {
    return this.clone().ineg();
  };

  BN.prototype.ineg = function ineg () {
    if (!this.isZero()) {
      this.negative ^= 1;
    }

    return this;
  };

  // Or `num` with `this` in-place
  BN.prototype.iuor = function iuor (num) {
    while (this.length < num.length) {
      this.words[this.length++] = 0;
    }

    for (var i = 0; i < num.length; i++) {
      this.words[i] = this.words[i] | num.words[i];
    }

    return this._strip();
  };

  BN.prototype.ior = function ior (num) {
    assert((this.negative | num.negative) === 0);
    return this.iuor(num);
  };

  // Or `num` with `this`
  BN.prototype.or = function or (num) {
    if (this.length > num.length) return this.clone().ior(num);
    return num.clone().ior(this);
  };

  BN.prototype.uor = function uor (num) {
    if (this.length > num.length) return this.clone().iuor(num);
    return num.clone().iuor(this);
  };

  // And `num` with `this` in-place
  BN.prototype.iuand = function iuand (num) {
    // b = min-length(num, this)
    var b;
    if (this.length > num.length) {
      b = num;
    } else {
      b = this;
    }

    for (var i = 0; i < b.length; i++) {
      this.words[i] = this.words[i] & num.words[i];
    }

    this.length = b.length;

    return this._strip();
  };

  BN.prototype.iand = function iand (num) {
    assert((this.negative | num.negative) === 0);
    return this.iuand(num);
  };

  // And `num` with `this`
  BN.prototype.and = function and (num) {
    if (this.length > num.length) return this.clone().iand(num);
    return num.clone().iand(this);
  };

  BN.prototype.uand = function uand (num) {
    if (this.length > num.length) return this.clone().iuand(num);
    return num.clone().iuand(this);
  };

  // Xor `num` with `this` in-place
  BN.prototype.iuxor = function iuxor (num) {
    // a.length > b.length
    var a;
    var b;
    if (this.length > num.length) {
      a = this;
      b = num;
    } else {
      a = num;
      b = this;
    }

    for (var i = 0; i < b.length; i++) {
      this.words[i] = a.words[i] ^ b.words[i];
    }

    if (this !== a) {
      for (; i < a.length; i++) {
        this.words[i] = a.words[i];
      }
    }

    this.length = a.length;

    return this._strip();
  };

  BN.prototype.ixor = function ixor (num) {
    assert((this.negative | num.negative) === 0);
    return this.iuxor(num);
  };

  // Xor `num` with `this`
  BN.prototype.xor = function xor (num) {
    if (this.length > num.length) return this.clone().ixor(num);
    return num.clone().ixor(this);
  };

  BN.prototype.uxor = function uxor (num) {
    if (this.length > num.length) return this.clone().iuxor(num);
    return num.clone().iuxor(this);
  };

  // Not ``this`` with ``width`` bitwidth
  BN.prototype.inotn = function inotn (width) {
    assert(typeof width === 'number' && width >= 0);

    var bytesNeeded = Math.ceil(width / 26) | 0;
    var bitsLeft = width % 26;

    // Extend the buffer with leading zeroes
    this._expand(bytesNeeded);

    if (bitsLeft > 0) {
      bytesNeeded--;
    }

    // Handle complete words
    for (var i = 0; i < bytesNeeded; i++) {
      this.words[i] = ~this.words[i] & 0x3ffffff;
    }

    // Handle the residue
    if (bitsLeft > 0) {
      this.words[i] = ~this.words[i] & (0x3ffffff >> (26 - bitsLeft));
    }

    // And remove leading zeroes
    return this._strip();
  };

  BN.prototype.notn = function notn (width) {
    return this.clone().inotn(width);
  };

  // Set `bit` of `this`
  BN.prototype.setn = function setn (bit, val) {
    assert(typeof bit === 'number' && bit >= 0);

    var off = (bit / 26) | 0;
    var wbit = bit % 26;

    this._expand(off + 1);

    if (val) {
      this.words[off] = this.words[off] | (1 << wbit);
    } else {
      this.words[off] = this.words[off] & ~(1 << wbit);
    }

    return this._strip();
  };

  // Add `num` to `this` in-place
  BN.prototype.iadd = function iadd (num) {
    var r;

    // negative + positive
    if (this.negative !== 0 && num.negative === 0) {
      this.negative = 0;
      r = this.isub(num);
      this.negative ^= 1;
      return this._normSign();

    // positive + negative
    } else if (this.negative === 0 && num.negative !== 0) {
      num.negative = 0;
      r = this.isub(num);
      num.negative = 1;
      return r._normSign();
    }

    // a.length > b.length
    var a, b;
    if (this.length > num.length) {
      a = this;
      b = num;
    } else {
      a = num;
      b = this;
    }

    var carry = 0;
    for (var i = 0; i < b.length; i++) {
      r = (a.words[i] | 0) + (b.words[i] | 0) + carry;
      this.words[i] = r & 0x3ffffff;
      carry = r >>> 26;
    }
    for (; carry !== 0 && i < a.length; i++) {
      r = (a.words[i] | 0) + carry;
      this.words[i] = r & 0x3ffffff;
      carry = r >>> 26;
    }

    this.length = a.length;
    if (carry !== 0) {
      this.words[this.length] = carry;
      this.length++;
    // Copy the rest of the words
    } else if (a !== this) {
      for (; i < a.length; i++) {
        this.words[i] = a.words[i];
      }
    }

    return this;
  };

  // Add `num` to `this`
  BN.prototype.add = function add (num) {
    var res;
    if (num.negative !== 0 && this.negative === 0) {
      num.negative = 0;
      res = this.sub(num);
      num.negative ^= 1;
      return res;
    } else if (num.negative === 0 && this.negative !== 0) {
      this.negative = 0;
      res = num.sub(this);
      this.negative = 1;
      return res;
    }

    if (this.length > num.length) return this.clone().iadd(num);

    return num.clone().iadd(this);
  };

  // Subtract `num` from `this` in-place
  BN.prototype.isub = function isub (num) {
    // this - (-num) = this + num
    if (num.negative !== 0) {
      num.negative = 0;
      var r = this.iadd(num);
      num.negative = 1;
      return r._normSign();

    // -this - num = -(this + num)
    } else if (this.negative !== 0) {
      this.negative = 0;
      this.iadd(num);
      this.negative = 1;
      return this._normSign();
    }

    // At this point both numbers are positive
    var cmp = this.cmp(num);

    // Optimization - zeroify
    if (cmp === 0) {
      this.negative = 0;
      this.length = 1;
      this.words[0] = 0;
      return this;
    }

    // a > b
    var a, b;
    if (cmp > 0) {
      a = this;
      b = num;
    } else {
      a = num;
      b = this;
    }

    var carry = 0;
    for (var i = 0; i < b.length; i++) {
      r = (a.words[i] | 0) - (b.words[i] | 0) + carry;
      carry = r >> 26;
      this.words[i] = r & 0x3ffffff;
    }
    for (; carry !== 0 && i < a.length; i++) {
      r = (a.words[i] | 0) + carry;
      carry = r >> 26;
      this.words[i] = r & 0x3ffffff;
    }

    // Copy rest of the words
    if (carry === 0 && i < a.length && a !== this) {
      for (; i < a.length; i++) {
        this.words[i] = a.words[i];
      }
    }

    this.length = Math.max(this.length, i);

    if (a !== this) {
      this.negative = 1;
    }

    return this._strip();
  };

  // Subtract `num` from `this`
  BN.prototype.sub = function sub (num) {
    return this.clone().isub(num);
  };

  function smallMulTo (self, num, out) {
    out.negative = num.negative ^ self.negative;
    var len = (self.length + num.length) | 0;
    out.length = len;
    len = (len - 1) | 0;

    // Peel one iteration (compiler can't do it, because of code complexity)
    var a = self.words[0] | 0;
    var b = num.words[0] | 0;
    var r = a * b;

    var lo = r & 0x3ffffff;
    var carry = (r / 0x4000000) | 0;
    out.words[0] = lo;

    for (var k = 1; k < len; k++) {
      // Sum all words with the same `i + j = k` and accumulate `ncarry`,
      // note that ncarry could be >= 0x3ffffff
      var ncarry = carry >>> 26;
      var rword = carry & 0x3ffffff;
      var maxJ = Math.min(k, num.length - 1);
      for (var j = Math.max(0, k - self.length + 1); j <= maxJ; j++) {
        var i = (k - j) | 0;
        a = self.words[i] | 0;
        b = num.words[j] | 0;
        r = a * b + rword;
        ncarry += (r / 0x4000000) | 0;
        rword = r & 0x3ffffff;
      }
      out.words[k] = rword | 0;
      carry = ncarry | 0;
    }
    if (carry !== 0) {
      out.words[k] = carry | 0;
    } else {
      out.length--;
    }

    return out._strip();
  }

  // TODO(indutny): it may be reasonable to omit it for users who don't need
  // to work with 256-bit numbers, otherwise it gives 20% improvement for 256-bit
  // multiplication (like elliptic secp256k1).
  var comb10MulTo = function comb10MulTo (self, num, out) {
    var a = self.words;
    var b = num.words;
    var o = out.words;
    var c = 0;
    var lo;
    var mid;
    var hi;
    var a0 = a[0] | 0;
    var al0 = a0 & 0x1fff;
    var ah0 = a0 >>> 13;
    var a1 = a[1] | 0;
    var al1 = a1 & 0x1fff;
    var ah1 = a1 >>> 13;
    var a2 = a[2] | 0;
    var al2 = a2 & 0x1fff;
    var ah2 = a2 >>> 13;
    var a3 = a[3] | 0;
    var al3 = a3 & 0x1fff;
    var ah3 = a3 >>> 13;
    var a4 = a[4] | 0;
    var al4 = a4 & 0x1fff;
    var ah4 = a4 >>> 13;
    var a5 = a[5] | 0;
    var al5 = a5 & 0x1fff;
    var ah5 = a5 >>> 13;
    var a6 = a[6] | 0;
    var al6 = a6 & 0x1fff;
    var ah6 = a6 >>> 13;
    var a7 = a[7] | 0;
    var al7 = a7 & 0x1fff;
    var ah7 = a7 >>> 13;
    var a8 = a[8] | 0;
    var al8 = a8 & 0x1fff;
    var ah8 = a8 >>> 13;
    var a9 = a[9] | 0;
    var al9 = a9 & 0x1fff;
    var ah9 = a9 >>> 13;
    var b0 = b[0] | 0;
    var bl0 = b0 & 0x1fff;
    var bh0 = b0 >>> 13;
    var b1 = b[1] | 0;
    var bl1 = b1 & 0x1fff;
    var bh1 = b1 >>> 13;
    var b2 = b[2] | 0;
    var bl2 = b2 & 0x1fff;
    var bh2 = b2 >>> 13;
    var b3 = b[3] | 0;
    var bl3 = b3 & 0x1fff;
    var bh3 = b3 >>> 13;
    var b4 = b[4] | 0;
    var bl4 = b4 & 0x1fff;
    var bh4 = b4 >>> 13;
    var b5 = b[5] | 0;
    var bl5 = b5 & 0x1fff;
    var bh5 = b5 >>> 13;
    var b6 = b[6] | 0;
    var bl6 = b6 & 0x1fff;
    var bh6 = b6 >>> 13;
    var b7 = b[7] | 0;
    var bl7 = b7 & 0x1fff;
    var bh7 = b7 >>> 13;
    var b8 = b[8] | 0;
    var bl8 = b8 & 0x1fff;
    var bh8 = b8 >>> 13;
    var b9 = b[9] | 0;
    var bl9 = b9 & 0x1fff;
    var bh9 = b9 >>> 13;

    out.negative = self.negative ^ num.negative;
    out.length = 19;
    /* k = 0 */
    lo = Math.imul(al0, bl0);
    mid = Math.imul(al0, bh0);
    mid = (mid + Math.imul(ah0, bl0)) | 0;
    hi = Math.imul(ah0, bh0);
    var w0 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w0 >>> 26)) | 0;
    w0 &= 0x3ffffff;
    /* k = 1 */
    lo = Math.imul(al1, bl0);
    mid = Math.imul(al1, bh0);
    mid = (mid + Math.imul(ah1, bl0)) | 0;
    hi = Math.imul(ah1, bh0);
    lo = (lo + Math.imul(al0, bl1)) | 0;
    mid = (mid + Math.imul(al0, bh1)) | 0;
    mid = (mid + Math.imul(ah0, bl1)) | 0;
    hi = (hi + Math.imul(ah0, bh1)) | 0;
    var w1 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w1 >>> 26)) | 0;
    w1 &= 0x3ffffff;
    /* k = 2 */
    lo = Math.imul(al2, bl0);
    mid = Math.imul(al2, bh0);
    mid = (mid + Math.imul(ah2, bl0)) | 0;
    hi = Math.imul(ah2, bh0);
    lo = (lo + Math.imul(al1, bl1)) | 0;
    mid = (mid + Math.imul(al1, bh1)) | 0;
    mid = (mid + Math.imul(ah1, bl1)) | 0;
    hi = (hi + Math.imul(ah1, bh1)) | 0;
    lo = (lo + Math.imul(al0, bl2)) | 0;
    mid = (mid + Math.imul(al0, bh2)) | 0;
    mid = (mid + Math.imul(ah0, bl2)) | 0;
    hi = (hi + Math.imul(ah0, bh2)) | 0;
    var w2 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w2 >>> 26)) | 0;
    w2 &= 0x3ffffff;
    /* k = 3 */
    lo = Math.imul(al3, bl0);
    mid = Math.imul(al3, bh0);
    mid = (mid + Math.imul(ah3, bl0)) | 0;
    hi = Math.imul(ah3, bh0);
    lo = (lo + Math.imul(al2, bl1)) | 0;
    mid = (mid + Math.imul(al2, bh1)) | 0;
    mid = (mid + Math.imul(ah2, bl1)) | 0;
    hi = (hi + Math.imul(ah2, bh1)) | 0;
    lo = (lo + Math.imul(al1, bl2)) | 0;
    mid = (mid + Math.imul(al1, bh2)) | 0;
    mid = (mid + Math.imul(ah1, bl2)) | 0;
    hi = (hi + Math.imul(ah1, bh2)) | 0;
    lo = (lo + Math.imul(al0, bl3)) | 0;
    mid = (mid + Math.imul(al0, bh3)) | 0;
    mid = (mid + Math.imul(ah0, bl3)) | 0;
    hi = (hi + Math.imul(ah0, bh3)) | 0;
    var w3 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w3 >>> 26)) | 0;
    w3 &= 0x3ffffff;
    /* k = 4 */
    lo = Math.imul(al4, bl0);
    mid = Math.imul(al4, bh0);
    mid = (mid + Math.imul(ah4, bl0)) | 0;
    hi = Math.imul(ah4, bh0);
    lo = (lo + Math.imul(al3, bl1)) | 0;
    mid = (mid + Math.imul(al3, bh1)) | 0;
    mid = (mid + Math.imul(ah3, bl1)) | 0;
    hi = (hi + Math.imul(ah3, bh1)) | 0;
    lo = (lo + Math.imul(al2, bl2)) | 0;
    mid = (mid + Math.imul(al2, bh2)) | 0;
    mid = (mid + Math.imul(ah2, bl2)) | 0;
    hi = (hi + Math.imul(ah2, bh2)) | 0;
    lo = (lo + Math.imul(al1, bl3)) | 0;
    mid = (mid + Math.imul(al1, bh3)) | 0;
    mid = (mid + Math.imul(ah1, bl3)) | 0;
    hi = (hi + Math.imul(ah1, bh3)) | 0;
    lo = (lo + Math.imul(al0, bl4)) | 0;
    mid = (mid + Math.imul(al0, bh4)) | 0;
    mid = (mid + Math.imul(ah0, bl4)) | 0;
    hi = (hi + Math.imul(ah0, bh4)) | 0;
    var w4 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w4 >>> 26)) | 0;
    w4 &= 0x3ffffff;
    /* k = 5 */
    lo = Math.imul(al5, bl0);
    mid = Math.imul(al5, bh0);
    mid = (mid + Math.imul(ah5, bl0)) | 0;
    hi = Math.imul(ah5, bh0);
    lo = (lo + Math.imul(al4, bl1)) | 0;
    mid = (mid + Math.imul(al4, bh1)) | 0;
    mid = (mid + Math.imul(ah4, bl1)) | 0;
    hi = (hi + Math.imul(ah4, bh1)) | 0;
    lo = (lo + Math.imul(al3, bl2)) | 0;
    mid = (mid + Math.imul(al3, bh2)) | 0;
    mid = (mid + Math.imul(ah3, bl2)) | 0;
    hi = (hi + Math.imul(ah3, bh2)) | 0;
    lo = (lo + Math.imul(al2, bl3)) | 0;
    mid = (mid + Math.imul(al2, bh3)) | 0;
    mid = (mid + Math.imul(ah2, bl3)) | 0;
    hi = (hi + Math.imul(ah2, bh3)) | 0;
    lo = (lo + Math.imul(al1, bl4)) | 0;
    mid = (mid + Math.imul(al1, bh4)) | 0;
    mid = (mid + Math.imul(ah1, bl4)) | 0;
    hi = (hi + Math.imul(ah1, bh4)) | 0;
    lo = (lo + Math.imul(al0, bl5)) | 0;
    mid = (mid + Math.imul(al0, bh5)) | 0;
    mid = (mid + Math.imul(ah0, bl5)) | 0;
    hi = (hi + Math.imul(ah0, bh5)) | 0;
    var w5 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w5 >>> 26)) | 0;
    w5 &= 0x3ffffff;
    /* k = 6 */
    lo = Math.imul(al6, bl0);
    mid = Math.imul(al6, bh0);
    mid = (mid + Math.imul(ah6, bl0)) | 0;
    hi = Math.imul(ah6, bh0);
    lo = (lo + Math.imul(al5, bl1)) | 0;
    mid = (mid + Math.imul(al5, bh1)) | 0;
    mid = (mid + Math.imul(ah5, bl1)) | 0;
    hi = (hi + Math.imul(ah5, bh1)) | 0;
    lo = (lo + Math.imul(al4, bl2)) | 0;
    mid = (mid + Math.imul(al4, bh2)) | 0;
    mid = (mid + Math.imul(ah4, bl2)) | 0;
    hi = (hi + Math.imul(ah4, bh2)) | 0;
    lo = (lo + Math.imul(al3, bl3)) | 0;
    mid = (mid + Math.imul(al3, bh3)) | 0;
    mid = (mid + Math.imul(ah3, bl3)) | 0;
    hi = (hi + Math.imul(ah3, bh3)) | 0;
    lo = (lo + Math.imul(al2, bl4)) | 0;
    mid = (mid + Math.imul(al2, bh4)) | 0;
    mid = (mid + Math.imul(ah2, bl4)) | 0;
    hi = (hi + Math.imul(ah2, bh4)) | 0;
    lo = (lo + Math.imul(al1, bl5)) | 0;
    mid = (mid + Math.imul(al1, bh5)) | 0;
    mid = (mid + Math.imul(ah1, bl5)) | 0;
    hi = (hi + Math.imul(ah1, bh5)) | 0;
    lo = (lo + Math.imul(al0, bl6)) | 0;
    mid = (mid + Math.imul(al0, bh6)) | 0;
    mid = (mid + Math.imul(ah0, bl6)) | 0;
    hi = (hi + Math.imul(ah0, bh6)) | 0;
    var w6 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w6 >>> 26)) | 0;
    w6 &= 0x3ffffff;
    /* k = 7 */
    lo = Math.imul(al7, bl0);
    mid = Math.imul(al7, bh0);
    mid = (mid + Math.imul(ah7, bl0)) | 0;
    hi = Math.imul(ah7, bh0);
    lo = (lo + Math.imul(al6, bl1)) | 0;
    mid = (mid + Math.imul(al6, bh1)) | 0;
    mid = (mid + Math.imul(ah6, bl1)) | 0;
    hi = (hi + Math.imul(ah6, bh1)) | 0;
    lo = (lo + Math.imul(al5, bl2)) | 0;
    mid = (mid + Math.imul(al5, bh2)) | 0;
    mid = (mid + Math.imul(ah5, bl2)) | 0;
    hi = (hi + Math.imul(ah5, bh2)) | 0;
    lo = (lo + Math.imul(al4, bl3)) | 0;
    mid = (mid + Math.imul(al4, bh3)) | 0;
    mid = (mid + Math.imul(ah4, bl3)) | 0;
    hi = (hi + Math.imul(ah4, bh3)) | 0;
    lo = (lo + Math.imul(al3, bl4)) | 0;
    mid = (mid + Math.imul(al3, bh4)) | 0;
    mid = (mid + Math.imul(ah3, bl4)) | 0;
    hi = (hi + Math.imul(ah3, bh4)) | 0;
    lo = (lo + Math.imul(al2, bl5)) | 0;
    mid = (mid + Math.imul(al2, bh5)) | 0;
    mid = (mid + Math.imul(ah2, bl5)) | 0;
    hi = (hi + Math.imul(ah2, bh5)) | 0;
    lo = (lo + Math.imul(al1, bl6)) | 0;
    mid = (mid + Math.imul(al1, bh6)) | 0;
    mid = (mid + Math.imul(ah1, bl6)) | 0;
    hi = (hi + Math.imul(ah1, bh6)) | 0;
    lo = (lo + Math.imul(al0, bl7)) | 0;
    mid = (mid + Math.imul(al0, bh7)) | 0;
    mid = (mid + Math.imul(ah0, bl7)) | 0;
    hi = (hi + Math.imul(ah0, bh7)) | 0;
    var w7 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w7 >>> 26)) | 0;
    w7 &= 0x3ffffff;
    /* k = 8 */
    lo = Math.imul(al8, bl0);
    mid = Math.imul(al8, bh0);
    mid = (mid + Math.imul(ah8, bl0)) | 0;
    hi = Math.imul(ah8, bh0);
    lo = (lo + Math.imul(al7, bl1)) | 0;
    mid = (mid + Math.imul(al7, bh1)) | 0;
    mid = (mid + Math.imul(ah7, bl1)) | 0;
    hi = (hi + Math.imul(ah7, bh1)) | 0;
    lo = (lo + Math.imul(al6, bl2)) | 0;
    mid = (mid + Math.imul(al6, bh2)) | 0;
    mid = (mid + Math.imul(ah6, bl2)) | 0;
    hi = (hi + Math.imul(ah6, bh2)) | 0;
    lo = (lo + Math.imul(al5, bl3)) | 0;
    mid = (mid + Math.imul(al5, bh3)) | 0;
    mid = (mid + Math.imul(ah5, bl3)) | 0;
    hi = (hi + Math.imul(ah5, bh3)) | 0;
    lo = (lo + Math.imul(al4, bl4)) | 0;
    mid = (mid + Math.imul(al4, bh4)) | 0;
    mid = (mid + Math.imul(ah4, bl4)) | 0;
    hi = (hi + Math.imul(ah4, bh4)) | 0;
    lo = (lo + Math.imul(al3, bl5)) | 0;
    mid = (mid + Math.imul(al3, bh5)) | 0;
    mid = (mid + Math.imul(ah3, bl5)) | 0;
    hi = (hi + Math.imul(ah3, bh5)) | 0;
    lo = (lo + Math.imul(al2, bl6)) | 0;
    mid = (mid + Math.imul(al2, bh6)) | 0;
    mid = (mid + Math.imul(ah2, bl6)) | 0;
    hi = (hi + Math.imul(ah2, bh6)) | 0;
    lo = (lo + Math.imul(al1, bl7)) | 0;
    mid = (mid + Math.imul(al1, bh7)) | 0;
    mid = (mid + Math.imul(ah1, bl7)) | 0;
    hi = (hi + Math.imul(ah1, bh7)) | 0;
    lo = (lo + Math.imul(al0, bl8)) | 0;
    mid = (mid + Math.imul(al0, bh8)) | 0;
    mid = (mid + Math.imul(ah0, bl8)) | 0;
    hi = (hi + Math.imul(ah0, bh8)) | 0;
    var w8 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w8 >>> 26)) | 0;
    w8 &= 0x3ffffff;
    /* k = 9 */
    lo = Math.imul(al9, bl0);
    mid = Math.imul(al9, bh0);
    mid = (mid + Math.imul(ah9, bl0)) | 0;
    hi = Math.imul(ah9, bh0);
    lo = (lo + Math.imul(al8, bl1)) | 0;
    mid = (mid + Math.imul(al8, bh1)) | 0;
    mid = (mid + Math.imul(ah8, bl1)) | 0;
    hi = (hi + Math.imul(ah8, bh1)) | 0;
    lo = (lo + Math.imul(al7, bl2)) | 0;
    mid = (mid + Math.imul(al7, bh2)) | 0;
    mid = (mid + Math.imul(ah7, bl2)) | 0;
    hi = (hi + Math.imul(ah7, bh2)) | 0;
    lo = (lo + Math.imul(al6, bl3)) | 0;
    mid = (mid + Math.imul(al6, bh3)) | 0;
    mid = (mid + Math.imul(ah6, bl3)) | 0;
    hi = (hi + Math.imul(ah6, bh3)) | 0;
    lo = (lo + Math.imul(al5, bl4)) | 0;
    mid = (mid + Math.imul(al5, bh4)) | 0;
    mid = (mid + Math.imul(ah5, bl4)) | 0;
    hi = (hi + Math.imul(ah5, bh4)) | 0;
    lo = (lo + Math.imul(al4, bl5)) | 0;
    mid = (mid + Math.imul(al4, bh5)) | 0;
    mid = (mid + Math.imul(ah4, bl5)) | 0;
    hi = (hi + Math.imul(ah4, bh5)) | 0;
    lo = (lo + Math.imul(al3, bl6)) | 0;
    mid = (mid + Math.imul(al3, bh6)) | 0;
    mid = (mid + Math.imul(ah3, bl6)) | 0;
    hi = (hi + Math.imul(ah3, bh6)) | 0;
    lo = (lo + Math.imul(al2, bl7)) | 0;
    mid = (mid + Math.imul(al2, bh7)) | 0;
    mid = (mid + Math.imul(ah2, bl7)) | 0;
    hi = (hi + Math.imul(ah2, bh7)) | 0;
    lo = (lo + Math.imul(al1, bl8)) | 0;
    mid = (mid + Math.imul(al1, bh8)) | 0;
    mid = (mid + Math.imul(ah1, bl8)) | 0;
    hi = (hi + Math.imul(ah1, bh8)) | 0;
    lo = (lo + Math.imul(al0, bl9)) | 0;
    mid = (mid + Math.imul(al0, bh9)) | 0;
    mid = (mid + Math.imul(ah0, bl9)) | 0;
    hi = (hi + Math.imul(ah0, bh9)) | 0;
    var w9 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w9 >>> 26)) | 0;
    w9 &= 0x3ffffff;
    /* k = 10 */
    lo = Math.imul(al9, bl1);
    mid = Math.imul(al9, bh1);
    mid = (mid + Math.imul(ah9, bl1)) | 0;
    hi = Math.imul(ah9, bh1);
    lo = (lo + Math.imul(al8, bl2)) | 0;
    mid = (mid + Math.imul(al8, bh2)) | 0;
    mid = (mid + Math.imul(ah8, bl2)) | 0;
    hi = (hi + Math.imul(ah8, bh2)) | 0;
    lo = (lo + Math.imul(al7, bl3)) | 0;
    mid = (mid + Math.imul(al7, bh3)) | 0;
    mid = (mid + Math.imul(ah7, bl3)) | 0;
    hi = (hi + Math.imul(ah7, bh3)) | 0;
    lo = (lo + Math.imul(al6, bl4)) | 0;
    mid = (mid + Math.imul(al6, bh4)) | 0;
    mid = (mid + Math.imul(ah6, bl4)) | 0;
    hi = (hi + Math.imul(ah6, bh4)) | 0;
    lo = (lo + Math.imul(al5, bl5)) | 0;
    mid = (mid + Math.imul(al5, bh5)) | 0;
    mid = (mid + Math.imul(ah5, bl5)) | 0;
    hi = (hi + Math.imul(ah5, bh5)) | 0;
    lo = (lo + Math.imul(al4, bl6)) | 0;
    mid = (mid + Math.imul(al4, bh6)) | 0;
    mid = (mid + Math.imul(ah4, bl6)) | 0;
    hi = (hi + Math.imul(ah4, bh6)) | 0;
    lo = (lo + Math.imul(al3, bl7)) | 0;
    mid = (mid + Math.imul(al3, bh7)) | 0;
    mid = (mid + Math.imul(ah3, bl7)) | 0;
    hi = (hi + Math.imul(ah3, bh7)) | 0;
    lo = (lo + Math.imul(al2, bl8)) | 0;
    mid = (mid + Math.imul(al2, bh8)) | 0;
    mid = (mid + Math.imul(ah2, bl8)) | 0;
    hi = (hi + Math.imul(ah2, bh8)) | 0;
    lo = (lo + Math.imul(al1, bl9)) | 0;
    mid = (mid + Math.imul(al1, bh9)) | 0;
    mid = (mid + Math.imul(ah1, bl9)) | 0;
    hi = (hi + Math.imul(ah1, bh9)) | 0;
    var w10 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w10 >>> 26)) | 0;
    w10 &= 0x3ffffff;
    /* k = 11 */
    lo = Math.imul(al9, bl2);
    mid = Math.imul(al9, bh2);
    mid = (mid + Math.imul(ah9, bl2)) | 0;
    hi = Math.imul(ah9, bh2);
    lo = (lo + Math.imul(al8, bl3)) | 0;
    mid = (mid + Math.imul(al8, bh3)) | 0;
    mid = (mid + Math.imul(ah8, bl3)) | 0;
    hi = (hi + Math.imul(ah8, bh3)) | 0;
    lo = (lo + Math.imul(al7, bl4)) | 0;
    mid = (mid + Math.imul(al7, bh4)) | 0;
    mid = (mid + Math.imul(ah7, bl4)) | 0;
    hi = (hi + Math.imul(ah7, bh4)) | 0;
    lo = (lo + Math.imul(al6, bl5)) | 0;
    mid = (mid + Math.imul(al6, bh5)) | 0;
    mid = (mid + Math.imul(ah6, bl5)) | 0;
    hi = (hi + Math.imul(ah6, bh5)) | 0;
    lo = (lo + Math.imul(al5, bl6)) | 0;
    mid = (mid + Math.imul(al5, bh6)) | 0;
    mid = (mid + Math.imul(ah5, bl6)) | 0;
    hi = (hi + Math.imul(ah5, bh6)) | 0;
    lo = (lo + Math.imul(al4, bl7)) | 0;
    mid = (mid + Math.imul(al4, bh7)) | 0;
    mid = (mid + Math.imul(ah4, bl7)) | 0;
    hi = (hi + Math.imul(ah4, bh7)) | 0;
    lo = (lo + Math.imul(al3, bl8)) | 0;
    mid = (mid + Math.imul(al3, bh8)) | 0;
    mid = (mid + Math.imul(ah3, bl8)) | 0;
    hi = (hi + Math.imul(ah3, bh8)) | 0;
    lo = (lo + Math.imul(al2, bl9)) | 0;
    mid = (mid + Math.imul(al2, bh9)) | 0;
    mid = (mid + Math.imul(ah2, bl9)) | 0;
    hi = (hi + Math.imul(ah2, bh9)) | 0;
    var w11 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w11 >>> 26)) | 0;
    w11 &= 0x3ffffff;
    /* k = 12 */
    lo = Math.imul(al9, bl3);
    mid = Math.imul(al9, bh3);
    mid = (mid + Math.imul(ah9, bl3)) | 0;
    hi = Math.imul(ah9, bh3);
    lo = (lo + Math.imul(al8, bl4)) | 0;
    mid = (mid + Math.imul(al8, bh4)) | 0;
    mid = (mid + Math.imul(ah8, bl4)) | 0;
    hi = (hi + Math.imul(ah8, bh4)) | 0;
    lo = (lo + Math.imul(al7, bl5)) | 0;
    mid = (mid + Math.imul(al7, bh5)) | 0;
    mid = (mid + Math.imul(ah7, bl5)) | 0;
    hi = (hi + Math.imul(ah7, bh5)) | 0;
    lo = (lo + Math.imul(al6, bl6)) | 0;
    mid = (mid + Math.imul(al6, bh6)) | 0;
    mid = (mid + Math.imul(ah6, bl6)) | 0;
    hi = (hi + Math.imul(ah6, bh6)) | 0;
    lo = (lo + Math.imul(al5, bl7)) | 0;
    mid = (mid + Math.imul(al5, bh7)) | 0;
    mid = (mid + Math.imul(ah5, bl7)) | 0;
    hi = (hi + Math.imul(ah5, bh7)) | 0;
    lo = (lo + Math.imul(al4, bl8)) | 0;
    mid = (mid + Math.imul(al4, bh8)) | 0;
    mid = (mid + Math.imul(ah4, bl8)) | 0;
    hi = (hi + Math.imul(ah4, bh8)) | 0;
    lo = (lo + Math.imul(al3, bl9)) | 0;
    mid = (mid + Math.imul(al3, bh9)) | 0;
    mid = (mid + Math.imul(ah3, bl9)) | 0;
    hi = (hi + Math.imul(ah3, bh9)) | 0;
    var w12 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w12 >>> 26)) | 0;
    w12 &= 0x3ffffff;
    /* k = 13 */
    lo = Math.imul(al9, bl4);
    mid = Math.imul(al9, bh4);
    mid = (mid + Math.imul(ah9, bl4)) | 0;
    hi = Math.imul(ah9, bh4);
    lo = (lo + Math.imul(al8, bl5)) | 0;
    mid = (mid + Math.imul(al8, bh5)) | 0;
    mid = (mid + Math.imul(ah8, bl5)) | 0;
    hi = (hi + Math.imul(ah8, bh5)) | 0;
    lo = (lo + Math.imul(al7, bl6)) | 0;
    mid = (mid + Math.imul(al7, bh6)) | 0;
    mid = (mid + Math.imul(ah7, bl6)) | 0;
    hi = (hi + Math.imul(ah7, bh6)) | 0;
    lo = (lo + Math.imul(al6, bl7)) | 0;
    mid = (mid + Math.imul(al6, bh7)) | 0;
    mid = (mid + Math.imul(ah6, bl7)) | 0;
    hi = (hi + Math.imul(ah6, bh7)) | 0;
    lo = (lo + Math.imul(al5, bl8)) | 0;
    mid = (mid + Math.imul(al5, bh8)) | 0;
    mid = (mid + Math.imul(ah5, bl8)) | 0;
    hi = (hi + Math.imul(ah5, bh8)) | 0;
    lo = (lo + Math.imul(al4, bl9)) | 0;
    mid = (mid + Math.imul(al4, bh9)) | 0;
    mid = (mid + Math.imul(ah4, bl9)) | 0;
    hi = (hi + Math.imul(ah4, bh9)) | 0;
    var w13 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w13 >>> 26)) | 0;
    w13 &= 0x3ffffff;
    /* k = 14 */
    lo = Math.imul(al9, bl5);
    mid = Math.imul(al9, bh5);
    mid = (mid + Math.imul(ah9, bl5)) | 0;
    hi = Math.imul(ah9, bh5);
    lo = (lo + Math.imul(al8, bl6)) | 0;
    mid = (mid + Math.imul(al8, bh6)) | 0;
    mid = (mid + Math.imul(ah8, bl6)) | 0;
    hi = (hi + Math.imul(ah8, bh6)) | 0;
    lo = (lo + Math.imul(al7, bl7)) | 0;
    mid = (mid + Math.imul(al7, bh7)) | 0;
    mid = (mid + Math.imul(ah7, bl7)) | 0;
    hi = (hi + Math.imul(ah7, bh7)) | 0;
    lo = (lo + Math.imul(al6, bl8)) | 0;
    mid = (mid + Math.imul(al6, bh8)) | 0;
    mid = (mid + Math.imul(ah6, bl8)) | 0;
    hi = (hi + Math.imul(ah6, bh8)) | 0;
    lo = (lo + Math.imul(al5, bl9)) | 0;
    mid = (mid + Math.imul(al5, bh9)) | 0;
    mid = (mid + Math.imul(ah5, bl9)) | 0;
    hi = (hi + Math.imul(ah5, bh9)) | 0;
    var w14 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w14 >>> 26)) | 0;
    w14 &= 0x3ffffff;
    /* k = 15 */
    lo = Math.imul(al9, bl6);
    mid = Math.imul(al9, bh6);
    mid = (mid + Math.imul(ah9, bl6)) | 0;
    hi = Math.imul(ah9, bh6);
    lo = (lo + Math.imul(al8, bl7)) | 0;
    mid = (mid + Math.imul(al8, bh7)) | 0;
    mid = (mid + Math.imul(ah8, bl7)) | 0;
    hi = (hi + Math.imul(ah8, bh7)) | 0;
    lo = (lo + Math.imul(al7, bl8)) | 0;
    mid = (mid + Math.imul(al7, bh8)) | 0;
    mid = (mid + Math.imul(ah7, bl8)) | 0;
    hi = (hi + Math.imul(ah7, bh8)) | 0;
    lo = (lo + Math.imul(al6, bl9)) | 0;
    mid = (mid + Math.imul(al6, bh9)) | 0;
    mid = (mid + Math.imul(ah6, bl9)) | 0;
    hi = (hi + Math.imul(ah6, bh9)) | 0;
    var w15 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w15 >>> 26)) | 0;
    w15 &= 0x3ffffff;
    /* k = 16 */
    lo = Math.imul(al9, bl7);
    mid = Math.imul(al9, bh7);
    mid = (mid + Math.imul(ah9, bl7)) | 0;
    hi = Math.imul(ah9, bh7);
    lo = (lo + Math.imul(al8, bl8)) | 0;
    mid = (mid + Math.imul(al8, bh8)) | 0;
    mid = (mid + Math.imul(ah8, bl8)) | 0;
    hi = (hi + Math.imul(ah8, bh8)) | 0;
    lo = (lo + Math.imul(al7, bl9)) | 0;
    mid = (mid + Math.imul(al7, bh9)) | 0;
    mid = (mid + Math.imul(ah7, bl9)) | 0;
    hi = (hi + Math.imul(ah7, bh9)) | 0;
    var w16 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w16 >>> 26)) | 0;
    w16 &= 0x3ffffff;
    /* k = 17 */
    lo = Math.imul(al9, bl8);
    mid = Math.imul(al9, bh8);
    mid = (mid + Math.imul(ah9, bl8)) | 0;
    hi = Math.imul(ah9, bh8);
    lo = (lo + Math.imul(al8, bl9)) | 0;
    mid = (mid + Math.imul(al8, bh9)) | 0;
    mid = (mid + Math.imul(ah8, bl9)) | 0;
    hi = (hi + Math.imul(ah8, bh9)) | 0;
    var w17 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w17 >>> 26)) | 0;
    w17 &= 0x3ffffff;
    /* k = 18 */
    lo = Math.imul(al9, bl9);
    mid = Math.imul(al9, bh9);
    mid = (mid + Math.imul(ah9, bl9)) | 0;
    hi = Math.imul(ah9, bh9);
    var w18 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w18 >>> 26)) | 0;
    w18 &= 0x3ffffff;
    o[0] = w0;
    o[1] = w1;
    o[2] = w2;
    o[3] = w3;
    o[4] = w4;
    o[5] = w5;
    o[6] = w6;
    o[7] = w7;
    o[8] = w8;
    o[9] = w9;
    o[10] = w10;
    o[11] = w11;
    o[12] = w12;
    o[13] = w13;
    o[14] = w14;
    o[15] = w15;
    o[16] = w16;
    o[17] = w17;
    o[18] = w18;
    if (c !== 0) {
      o[19] = c;
      out.length++;
    }
    return out;
  };

  // Polyfill comb
  if (!Math.imul) {
    comb10MulTo = smallMulTo;
  }

  function bigMulTo (self, num, out) {
    out.negative = num.negative ^ self.negative;
    out.length = self.length + num.length;

    var carry = 0;
    var hncarry = 0;
    for (var k = 0; k < out.length - 1; k++) {
      // Sum all words with the same `i + j = k` and accumulate `ncarry`,
      // note that ncarry could be >= 0x3ffffff
      var ncarry = hncarry;
      hncarry = 0;
      var rword = carry & 0x3ffffff;
      var maxJ = Math.min(k, num.length - 1);
      for (var j = Math.max(0, k - self.length + 1); j <= maxJ; j++) {
        var i = k - j;
        var a = self.words[i] | 0;
        var b = num.words[j] | 0;
        var r = a * b;

        var lo = r & 0x3ffffff;
        ncarry = (ncarry + ((r / 0x4000000) | 0)) | 0;
        lo = (lo + rword) | 0;
        rword = lo & 0x3ffffff;
        ncarry = (ncarry + (lo >>> 26)) | 0;

        hncarry += ncarry >>> 26;
        ncarry &= 0x3ffffff;
      }
      out.words[k] = rword;
      carry = ncarry;
      ncarry = hncarry;
    }
    if (carry !== 0) {
      out.words[k] = carry;
    } else {
      out.length--;
    }

    return out._strip();
  }

  function jumboMulTo (self, num, out) {
    // Temporary disable, see https://github.com/indutny/bn.js/issues/211
    // var fftm = new FFTM();
    // return fftm.mulp(self, num, out);
    return bigMulTo(self, num, out);
  }

  BN.prototype.mulTo = function mulTo (num, out) {
    var res;
    var len = this.length + num.length;
    if (this.length === 10 && num.length === 10) {
      res = comb10MulTo(this, num, out);
    } else if (len < 63) {
      res = smallMulTo(this, num, out);
    } else if (len < 1024) {
      res = bigMulTo(this, num, out);
    } else {
      res = jumboMulTo(this, num, out);
    }

    return res;
  };

  // Cooley-Tukey algorithm for FFT
  // slightly revisited to rely on looping instead of recursion

  function FFTM (x, y) {
    this.x = x;
    this.y = y;
  }

  FFTM.prototype.makeRBT = function makeRBT (N) {
    var t = new Array(N);
    var l = BN.prototype._countBits(N) - 1;
    for (var i = 0; i < N; i++) {
      t[i] = this.revBin(i, l, N);
    }

    return t;
  };

  // Returns binary-reversed representation of `x`
  FFTM.prototype.revBin = function revBin (x, l, N) {
    if (x === 0 || x === N - 1) return x;

    var rb = 0;
    for (var i = 0; i < l; i++) {
      rb |= (x & 1) << (l - i - 1);
      x >>= 1;
    }

    return rb;
  };

  // Performs "tweedling" phase, therefore 'emulating'
  // behaviour of the recursive algorithm
  FFTM.prototype.permute = function permute (rbt, rws, iws, rtws, itws, N) {
    for (var i = 0; i < N; i++) {
      rtws[i] = rws[rbt[i]];
      itws[i] = iws[rbt[i]];
    }
  };

  FFTM.prototype.transform = function transform (rws, iws, rtws, itws, N, rbt) {
    this.permute(rbt, rws, iws, rtws, itws, N);

    for (var s = 1; s < N; s <<= 1) {
      var l = s << 1;

      var rtwdf = Math.cos(2 * Math.PI / l);
      var itwdf = Math.sin(2 * Math.PI / l);

      for (var p = 0; p < N; p += l) {
        var rtwdf_ = rtwdf;
        var itwdf_ = itwdf;

        for (var j = 0; j < s; j++) {
          var re = rtws[p + j];
          var ie = itws[p + j];

          var ro = rtws[p + j + s];
          var io = itws[p + j + s];

          var rx = rtwdf_ * ro - itwdf_ * io;

          io = rtwdf_ * io + itwdf_ * ro;
          ro = rx;

          rtws[p + j] = re + ro;
          itws[p + j] = ie + io;

          rtws[p + j + s] = re - ro;
          itws[p + j + s] = ie - io;

          /* jshint maxdepth : false */
          if (j !== l) {
            rx = rtwdf * rtwdf_ - itwdf * itwdf_;

            itwdf_ = rtwdf * itwdf_ + itwdf * rtwdf_;
            rtwdf_ = rx;
          }
        }
      }
    }
  };

  FFTM.prototype.guessLen13b = function guessLen13b (n, m) {
    var N = Math.max(m, n) | 1;
    var odd = N & 1;
    var i = 0;
    for (N = N / 2 | 0; N; N = N >>> 1) {
      i++;
    }

    return 1 << i + 1 + odd;
  };

  FFTM.prototype.conjugate = function conjugate (rws, iws, N) {
    if (N <= 1) return;

    for (var i = 0; i < N / 2; i++) {
      var t = rws[i];

      rws[i] = rws[N - i - 1];
      rws[N - i - 1] = t;

      t = iws[i];

      iws[i] = -iws[N - i - 1];
      iws[N - i - 1] = -t;
    }
  };

  FFTM.prototype.normalize13b = function normalize13b (ws, N) {
    var carry = 0;
    for (var i = 0; i < N / 2; i++) {
      var w = Math.round(ws[2 * i + 1] / N) * 0x2000 +
        Math.round(ws[2 * i] / N) +
        carry;

      ws[i] = w & 0x3ffffff;

      if (w < 0x4000000) {
        carry = 0;
      } else {
        carry = w / 0x4000000 | 0;
      }
    }

    return ws;
  };

  FFTM.prototype.convert13b = function convert13b (ws, len, rws, N) {
    var carry = 0;
    for (var i = 0; i < len; i++) {
      carry = carry + (ws[i] | 0);

      rws[2 * i] = carry & 0x1fff; carry = carry >>> 13;
      rws[2 * i + 1] = carry & 0x1fff; carry = carry >>> 13;
    }

    // Pad with zeroes
    for (i = 2 * len; i < N; ++i) {
      rws[i] = 0;
    }

    assert(carry === 0);
    assert((carry & ~0x1fff) === 0);
  };

  FFTM.prototype.stub = function stub (N) {
    var ph = new Array(N);
    for (var i = 0; i < N; i++) {
      ph[i] = 0;
    }

    return ph;
  };

  FFTM.prototype.mulp = function mulp (x, y, out) {
    var N = 2 * this.guessLen13b(x.length, y.length);

    var rbt = this.makeRBT(N);

    var _ = this.stub(N);

    var rws = new Array(N);
    var rwst = new Array(N);
    var iwst = new Array(N);

    var nrws = new Array(N);
    var nrwst = new Array(N);
    var niwst = new Array(N);

    var rmws = out.words;
    rmws.length = N;

    this.convert13b(x.words, x.length, rws, N);
    this.convert13b(y.words, y.length, nrws, N);

    this.transform(rws, _, rwst, iwst, N, rbt);
    this.transform(nrws, _, nrwst, niwst, N, rbt);

    for (var i = 0; i < N; i++) {
      var rx = rwst[i] * nrwst[i] - iwst[i] * niwst[i];
      iwst[i] = rwst[i] * niwst[i] + iwst[i] * nrwst[i];
      rwst[i] = rx;
    }

    this.conjugate(rwst, iwst, N);
    this.transform(rwst, iwst, rmws, _, N, rbt);
    this.conjugate(rmws, _, N);
    this.normalize13b(rmws, N);

    out.negative = x.negative ^ y.negative;
    out.length = x.length + y.length;
    return out._strip();
  };

  // Multiply `this` by `num`
  BN.prototype.mul = function mul (num) {
    var out = new BN(null);
    out.words = new Array(this.length + num.length);
    return this.mulTo(num, out);
  };

  // Multiply employing FFT
  BN.prototype.mulf = function mulf (num) {
    var out = new BN(null);
    out.words = new Array(this.length + num.length);
    return jumboMulTo(this, num, out);
  };

  // In-place Multiplication
  BN.prototype.imul = function imul (num) {
    return this.clone().mulTo(num, this);
  };

  BN.prototype.imuln = function imuln (num) {
    var isNegNum = num < 0;
    if (isNegNum) num = -num;

    assert(typeof num === 'number');
    assert(num < 0x4000000);

    // Carry
    var carry = 0;
    for (var i = 0; i < this.length; i++) {
      var w = (this.words[i] | 0) * num;
      var lo = (w & 0x3ffffff) + (carry & 0x3ffffff);
      carry >>= 26;
      carry += (w / 0x4000000) | 0;
      // NOTE: lo is 27bit maximum
      carry += lo >>> 26;
      this.words[i] = lo & 0x3ffffff;
    }

    if (carry !== 0) {
      this.words[i] = carry;
      this.length++;
    }

    return isNegNum ? this.ineg() : this;
  };

  BN.prototype.muln = function muln (num) {
    return this.clone().imuln(num);
  };

  // `this` * `this`
  BN.prototype.sqr = function sqr () {
    return this.mul(this);
  };

  // `this` * `this` in-place
  BN.prototype.isqr = function isqr () {
    return this.imul(this.clone());
  };

  // Math.pow(`this`, `num`)
  BN.prototype.pow = function pow (num) {
    var w = toBitArray(num);
    if (w.length === 0) return new BN(1);

    // Skip leading zeroes
    var res = this;
    for (var i = 0; i < w.length; i++, res = res.sqr()) {
      if (w[i] !== 0) break;
    }

    if (++i < w.length) {
      for (var q = res.sqr(); i < w.length; i++, q = q.sqr()) {
        if (w[i] === 0) continue;

        res = res.mul(q);
      }
    }

    return res;
  };

  // Shift-left in-place
  BN.prototype.iushln = function iushln (bits) {
    assert(typeof bits === 'number' && bits >= 0);
    var r = bits % 26;
    var s = (bits - r) / 26;
    var carryMask = (0x3ffffff >>> (26 - r)) << (26 - r);
    var i;

    if (r !== 0) {
      var carry = 0;

      for (i = 0; i < this.length; i++) {
        var newCarry = this.words[i] & carryMask;
        var c = ((this.words[i] | 0) - newCarry) << r;
        this.words[i] = c | carry;
        carry = newCarry >>> (26 - r);
      }

      if (carry) {
        this.words[i] = carry;
        this.length++;
      }
    }

    if (s !== 0) {
      for (i = this.length - 1; i >= 0; i--) {
        this.words[i + s] = this.words[i];
      }

      for (i = 0; i < s; i++) {
        this.words[i] = 0;
      }

      this.length += s;
    }

    return this._strip();
  };

  BN.prototype.ishln = function ishln (bits) {
    // TODO(indutny): implement me
    assert(this.negative === 0);
    return this.iushln(bits);
  };

  // Shift-right in-place
  // NOTE: `hint` is a lowest bit before trailing zeroes
  // NOTE: if `extended` is present - it will be filled with destroyed bits
  BN.prototype.iushrn = function iushrn (bits, hint, extended) {
    assert(typeof bits === 'number' && bits >= 0);
    var h;
    if (hint) {
      h = (hint - (hint % 26)) / 26;
    } else {
      h = 0;
    }

    var r = bits % 26;
    var s = Math.min((bits - r) / 26, this.length);
    var mask = 0x3ffffff ^ ((0x3ffffff >>> r) << r);
    var maskedWords = extended;

    h -= s;
    h = Math.max(0, h);

    // Extended mode, copy masked part
    if (maskedWords) {
      for (var i = 0; i < s; i++) {
        maskedWords.words[i] = this.words[i];
      }
      maskedWords.length = s;
    }

    if (s === 0) {
      // No-op, we should not move anything at all
    } else if (this.length > s) {
      this.length -= s;
      for (i = 0; i < this.length; i++) {
        this.words[i] = this.words[i + s];
      }
    } else {
      this.words[0] = 0;
      this.length = 1;
    }

    var carry = 0;
    for (i = this.length - 1; i >= 0 && (carry !== 0 || i >= h); i--) {
      var word = this.words[i] | 0;
      this.words[i] = (carry << (26 - r)) | (word >>> r);
      carry = word & mask;
    }

    // Push carried bits as a mask
    if (maskedWords && carry !== 0) {
      maskedWords.words[maskedWords.length++] = carry;
    }

    if (this.length === 0) {
      this.words[0] = 0;
      this.length = 1;
    }

    return this._strip();
  };

  BN.prototype.ishrn = function ishrn (bits, hint, extended) {
    // TODO(indutny): implement me
    assert(this.negative === 0);
    return this.iushrn(bits, hint, extended);
  };

  // Shift-left
  BN.prototype.shln = function shln (bits) {
    return this.clone().ishln(bits);
  };

  BN.prototype.ushln = function ushln (bits) {
    return this.clone().iushln(bits);
  };

  // Shift-right
  BN.prototype.shrn = function shrn (bits) {
    return this.clone().ishrn(bits);
  };

  BN.prototype.ushrn = function ushrn (bits) {
    return this.clone().iushrn(bits);
  };

  // Test if n bit is set
  BN.prototype.testn = function testn (bit) {
    assert(typeof bit === 'number' && bit >= 0);
    var r = bit % 26;
    var s = (bit - r) / 26;
    var q = 1 << r;

    // Fast case: bit is much higher than all existing words
    if (this.length <= s) return false;

    // Check bit and return
    var w = this.words[s];

    return !!(w & q);
  };

  // Return only lowers bits of number (in-place)
  BN.prototype.imaskn = function imaskn (bits) {
    assert(typeof bits === 'number' && bits >= 0);
    var r = bits % 26;
    var s = (bits - r) / 26;

    assert(this.negative === 0, 'imaskn works only with positive numbers');

    if (this.length <= s) {
      return this;
    }

    if (r !== 0) {
      s++;
    }
    this.length = Math.min(s, this.length);

    if (r !== 0) {
      var mask = 0x3ffffff ^ ((0x3ffffff >>> r) << r);
      this.words[this.length - 1] &= mask;
    }

    return this._strip();
  };

  // Return only lowers bits of number
  BN.prototype.maskn = function maskn (bits) {
    return this.clone().imaskn(bits);
  };

  // Add plain number `num` to `this`
  BN.prototype.iaddn = function iaddn (num) {
    assert(typeof num === 'number');
    assert(num < 0x4000000);
    if (num < 0) return this.isubn(-num);

    // Possible sign change
    if (this.negative !== 0) {
      if (this.length === 1 && (this.words[0] | 0) <= num) {
        this.words[0] = num - (this.words[0] | 0);
        this.negative = 0;
        return this;
      }

      this.negative = 0;
      this.isubn(num);
      this.negative = 1;
      return this;
    }

    // Add without checks
    return this._iaddn(num);
  };

  BN.prototype._iaddn = function _iaddn (num) {
    this.words[0] += num;

    // Carry
    for (var i = 0; i < this.length && this.words[i] >= 0x4000000; i++) {
      this.words[i] -= 0x4000000;
      if (i === this.length - 1) {
        this.words[i + 1] = 1;
      } else {
        this.words[i + 1]++;
      }
    }
    this.length = Math.max(this.length, i + 1);

    return this;
  };

  // Subtract plain number `num` from `this`
  BN.prototype.isubn = function isubn (num) {
    assert(typeof num === 'number');
    assert(num < 0x4000000);
    if (num < 0) return this.iaddn(-num);

    if (this.negative !== 0) {
      this.negative = 0;
      this.iaddn(num);
      this.negative = 1;
      return this;
    }

    this.words[0] -= num;

    if (this.length === 1 && this.words[0] < 0) {
      this.words[0] = -this.words[0];
      this.negative = 1;
    } else {
      // Carry
      for (var i = 0; i < this.length && this.words[i] < 0; i++) {
        this.words[i] += 0x4000000;
        this.words[i + 1] -= 1;
      }
    }

    return this._strip();
  };

  BN.prototype.addn = function addn (num) {
    return this.clone().iaddn(num);
  };

  BN.prototype.subn = function subn (num) {
    return this.clone().isubn(num);
  };

  BN.prototype.iabs = function iabs () {
    this.negative = 0;

    return this;
  };

  BN.prototype.abs = function abs () {
    return this.clone().iabs();
  };

  BN.prototype._ishlnsubmul = function _ishlnsubmul (num, mul, shift) {
    var len = num.length + shift;
    var i;

    this._expand(len);

    var w;
    var carry = 0;
    for (i = 0; i < num.length; i++) {
      w = (this.words[i + shift] | 0) + carry;
      var right = (num.words[i] | 0) * mul;
      w -= right & 0x3ffffff;
      carry = (w >> 26) - ((right / 0x4000000) | 0);
      this.words[i + shift] = w & 0x3ffffff;
    }
    for (; i < this.length - shift; i++) {
      w = (this.words[i + shift] | 0) + carry;
      carry = w >> 26;
      this.words[i + shift] = w & 0x3ffffff;
    }

    if (carry === 0) return this._strip();

    // Subtraction overflow
    assert(carry === -1);
    carry = 0;
    for (i = 0; i < this.length; i++) {
      w = -(this.words[i] | 0) + carry;
      carry = w >> 26;
      this.words[i] = w & 0x3ffffff;
    }
    this.negative = 1;

    return this._strip();
  };

  BN.prototype._wordDiv = function _wordDiv (num, mode) {
    var shift = this.length - num.length;

    var a = this.clone();
    var b = num;

    // Normalize
    var bhi = b.words[b.length - 1] | 0;
    var bhiBits = this._countBits(bhi);
    shift = 26 - bhiBits;
    if (shift !== 0) {
      b = b.ushln(shift);
      a.iushln(shift);
      bhi = b.words[b.length - 1] | 0;
    }

    // Initialize quotient
    var m = a.length - b.length;
    var q;

    if (mode !== 'mod') {
      q = new BN(null);
      q.length = m + 1;
      q.words = new Array(q.length);
      for (var i = 0; i < q.length; i++) {
        q.words[i] = 0;
      }
    }

    var diff = a.clone()._ishlnsubmul(b, 1, m);
    if (diff.negative === 0) {
      a = diff;
      if (q) {
        q.words[m] = 1;
      }
    }

    for (var j = m - 1; j >= 0; j--) {
      var qj = (a.words[b.length + j] | 0) * 0x4000000 +
        (a.words[b.length + j - 1] | 0);

      // NOTE: (qj / bhi) is (0x3ffffff * 0x4000000 + 0x3ffffff) / 0x2000000 max
      // (0x7ffffff)
      qj = Math.min((qj / bhi) | 0, 0x3ffffff);

      a._ishlnsubmul(b, qj, j);
      while (a.negative !== 0) {
        qj--;
        a.negative = 0;
        a._ishlnsubmul(b, 1, j);
        if (!a.isZero()) {
          a.negative ^= 1;
        }
      }
      if (q) {
        q.words[j] = qj;
      }
    }
    if (q) {
      q._strip();
    }
    a._strip();

    // Denormalize
    if (mode !== 'div' && shift !== 0) {
      a.iushrn(shift);
    }

    return {
      div: q || null,
      mod: a
    };
  };

  // NOTE: 1) `mode` can be set to `mod` to request mod only,
  //       to `div` to request div only, or be absent to
  //       request both div & mod
  //       2) `positive` is true if unsigned mod is requested
  BN.prototype.divmod = function divmod (num, mode, positive) {
    assert(!num.isZero());

    if (this.isZero()) {
      return {
        div: new BN(0),
        mod: new BN(0)
      };
    }

    var div, mod, res;
    if (this.negative !== 0 && num.negative === 0) {
      res = this.neg().divmod(num, mode);

      if (mode !== 'mod') {
        div = res.div.neg();
      }

      if (mode !== 'div') {
        mod = res.mod.neg();
        if (positive && mod.negative !== 0) {
          mod.iadd(num);
        }
      }

      return {
        div: div,
        mod: mod
      };
    }

    if (this.negative === 0 && num.negative !== 0) {
      res = this.divmod(num.neg(), mode);

      if (mode !== 'mod') {
        div = res.div.neg();
      }

      return {
        div: div,
        mod: res.mod
      };
    }

    if ((this.negative & num.negative) !== 0) {
      res = this.neg().divmod(num.neg(), mode);

      if (mode !== 'div') {
        mod = res.mod.neg();
        if (positive && mod.negative !== 0) {
          mod.isub(num);
        }
      }

      return {
        div: res.div,
        mod: mod
      };
    }

    // Both numbers are positive at this point

    // Strip both numbers to approximate shift value
    if (num.length > this.length || this.cmp(num) < 0) {
      return {
        div: new BN(0),
        mod: this
      };
    }

    // Very short reduction
    if (num.length === 1) {
      if (mode === 'div') {
        return {
          div: this.divn(num.words[0]),
          mod: null
        };
      }

      if (mode === 'mod') {
        return {
          div: null,
          mod: new BN(this.modrn(num.words[0]))
        };
      }

      return {
        div: this.divn(num.words[0]),
        mod: new BN(this.modrn(num.words[0]))
      };
    }

    return this._wordDiv(num, mode);
  };

  // Find `this` / `num`
  BN.prototype.div = function div (num) {
    return this.divmod(num, 'div', false).div;
  };

  // Find `this` % `num`
  BN.prototype.mod = function mod (num) {
    return this.divmod(num, 'mod', false).mod;
  };

  BN.prototype.umod = function umod (num) {
    return this.divmod(num, 'mod', true).mod;
  };

  // Find Round(`this` / `num`)
  BN.prototype.divRound = function divRound (num) {
    var dm = this.divmod(num);

    // Fast case - exact division
    if (dm.mod.isZero()) return dm.div;

    var mod = dm.div.negative !== 0 ? dm.mod.isub(num) : dm.mod;

    var half = num.ushrn(1);
    var r2 = num.andln(1);
    var cmp = mod.cmp(half);

    // Round down
    if (cmp < 0 || (r2 === 1 && cmp === 0)) return dm.div;

    // Round up
    return dm.div.negative !== 0 ? dm.div.isubn(1) : dm.div.iaddn(1);
  };

  BN.prototype.modrn = function modrn (num) {
    var isNegNum = num < 0;
    if (isNegNum) num = -num;

    assert(num <= 0x3ffffff);
    var p = (1 << 26) % num;

    var acc = 0;
    for (var i = this.length - 1; i >= 0; i--) {
      acc = (p * acc + (this.words[i] | 0)) % num;
    }

    return isNegNum ? -acc : acc;
  };

  // WARNING: DEPRECATED
  BN.prototype.modn = function modn (num) {
    return this.modrn(num);
  };

  // In-place division by number
  BN.prototype.idivn = function idivn (num) {
    var isNegNum = num < 0;
    if (isNegNum) num = -num;

    assert(num <= 0x3ffffff);

    var carry = 0;
    for (var i = this.length - 1; i >= 0; i--) {
      var w = (this.words[i] | 0) + carry * 0x4000000;
      this.words[i] = (w / num) | 0;
      carry = w % num;
    }

    this._strip();
    return isNegNum ? this.ineg() : this;
  };

  BN.prototype.divn = function divn (num) {
    return this.clone().idivn(num);
  };

  BN.prototype.egcd = function egcd (p) {
    assert(p.negative === 0);
    assert(!p.isZero());

    var x = this;
    var y = p.clone();

    if (x.negative !== 0) {
      x = x.umod(p);
    } else {
      x = x.clone();
    }

    // A * x + B * y = x
    var A = new BN(1);
    var B = new BN(0);

    // C * x + D * y = y
    var C = new BN(0);
    var D = new BN(1);

    var g = 0;

    while (x.isEven() && y.isEven()) {
      x.iushrn(1);
      y.iushrn(1);
      ++g;
    }

    var yp = y.clone();
    var xp = x.clone();

    while (!x.isZero()) {
      for (var i = 0, im = 1; (x.words[0] & im) === 0 && i < 26; ++i, im <<= 1);
      if (i > 0) {
        x.iushrn(i);
        while (i-- > 0) {
          if (A.isOdd() || B.isOdd()) {
            A.iadd(yp);
            B.isub(xp);
          }

          A.iushrn(1);
          B.iushrn(1);
        }
      }

      for (var j = 0, jm = 1; (y.words[0] & jm) === 0 && j < 26; ++j, jm <<= 1);
      if (j > 0) {
        y.iushrn(j);
        while (j-- > 0) {
          if (C.isOdd() || D.isOdd()) {
            C.iadd(yp);
            D.isub(xp);
          }

          C.iushrn(1);
          D.iushrn(1);
        }
      }

      if (x.cmp(y) >= 0) {
        x.isub(y);
        A.isub(C);
        B.isub(D);
      } else {
        y.isub(x);
        C.isub(A);
        D.isub(B);
      }
    }

    return {
      a: C,
      b: D,
      gcd: y.iushln(g)
    };
  };

  // This is reduced incarnation of the binary EEA
  // above, designated to invert members of the
  // _prime_ fields F(p) at a maximal speed
  BN.prototype._invmp = function _invmp (p) {
    assert(p.negative === 0);
    assert(!p.isZero());

    var a = this;
    var b = p.clone();

    if (a.negative !== 0) {
      a = a.umod(p);
    } else {
      a = a.clone();
    }

    var x1 = new BN(1);
    var x2 = new BN(0);

    var delta = b.clone();

    while (a.cmpn(1) > 0 && b.cmpn(1) > 0) {
      for (var i = 0, im = 1; (a.words[0] & im) === 0 && i < 26; ++i, im <<= 1);
      if (i > 0) {
        a.iushrn(i);
        while (i-- > 0) {
          if (x1.isOdd()) {
            x1.iadd(delta);
          }

          x1.iushrn(1);
        }
      }

      for (var j = 0, jm = 1; (b.words[0] & jm) === 0 && j < 26; ++j, jm <<= 1);
      if (j > 0) {
        b.iushrn(j);
        while (j-- > 0) {
          if (x2.isOdd()) {
            x2.iadd(delta);
          }

          x2.iushrn(1);
        }
      }

      if (a.cmp(b) >= 0) {
        a.isub(b);
        x1.isub(x2);
      } else {
        b.isub(a);
        x2.isub(x1);
      }
    }

    var res;
    if (a.cmpn(1) === 0) {
      res = x1;
    } else {
      res = x2;
    }

    if (res.cmpn(0) < 0) {
      res.iadd(p);
    }

    return res;
  };

  BN.prototype.gcd = function gcd (num) {
    if (this.isZero()) return num.abs();
    if (num.isZero()) return this.abs();

    var a = this.clone();
    var b = num.clone();
    a.negative = 0;
    b.negative = 0;

    // Remove common factor of two
    for (var shift = 0; a.isEven() && b.isEven(); shift++) {
      a.iushrn(1);
      b.iushrn(1);
    }

    do {
      while (a.isEven()) {
        a.iushrn(1);
      }
      while (b.isEven()) {
        b.iushrn(1);
      }

      var r = a.cmp(b);
      if (r < 0) {
        // Swap `a` and `b` to make `a` always bigger than `b`
        var t = a;
        a = b;
        b = t;
      } else if (r === 0 || b.cmpn(1) === 0) {
        break;
      }

      a.isub(b);
    } while (true);

    return b.iushln(shift);
  };

  // Invert number in the field F(num)
  BN.prototype.invm = function invm (num) {
    return this.egcd(num).a.umod(num);
  };

  BN.prototype.isEven = function isEven () {
    return (this.words[0] & 1) === 0;
  };

  BN.prototype.isOdd = function isOdd () {
    return (this.words[0] & 1) === 1;
  };

  // And first word and num
  BN.prototype.andln = function andln (num) {
    return this.words[0] & num;
  };

  // Increment at the bit position in-line
  BN.prototype.bincn = function bincn (bit) {
    assert(typeof bit === 'number');
    var r = bit % 26;
    var s = (bit - r) / 26;
    var q = 1 << r;

    // Fast case: bit is much higher than all existing words
    if (this.length <= s) {
      this._expand(s + 1);
      this.words[s] |= q;
      return this;
    }

    // Add bit and propagate, if needed
    var carry = q;
    for (var i = s; carry !== 0 && i < this.length; i++) {
      var w = this.words[i] | 0;
      w += carry;
      carry = w >>> 26;
      w &= 0x3ffffff;
      this.words[i] = w;
    }
    if (carry !== 0) {
      this.words[i] = carry;
      this.length++;
    }
    return this;
  };

  BN.prototype.isZero = function isZero () {
    return this.length === 1 && this.words[0] === 0;
  };

  BN.prototype.cmpn = function cmpn (num) {
    var negative = num < 0;

    if (this.negative !== 0 && !negative) return -1;
    if (this.negative === 0 && negative) return 1;

    this._strip();

    var res;
    if (this.length > 1) {
      res = 1;
    } else {
      if (negative) {
        num = -num;
      }

      assert(num <= 0x3ffffff, 'Number is too big');

      var w = this.words[0] | 0;
      res = w === num ? 0 : w < num ? -1 : 1;
    }
    if (this.negative !== 0) return -res | 0;
    return res;
  };

  // Compare two numbers and return:
  // 1 - if `this` > `num`
  // 0 - if `this` == `num`
  // -1 - if `this` < `num`
  BN.prototype.cmp = function cmp (num) {
    if (this.negative !== 0 && num.negative === 0) return -1;
    if (this.negative === 0 && num.negative !== 0) return 1;

    var res = this.ucmp(num);
    if (this.negative !== 0) return -res | 0;
    return res;
  };

  // Unsigned comparison
  BN.prototype.ucmp = function ucmp (num) {
    // At this point both numbers have the same sign
    if (this.length > num.length) return 1;
    if (this.length < num.length) return -1;

    var res = 0;
    for (var i = this.length - 1; i >= 0; i--) {
      var a = this.words[i] | 0;
      var b = num.words[i] | 0;

      if (a === b) continue;
      if (a < b) {
        res = -1;
      } else if (a > b) {
        res = 1;
      }
      break;
    }
    return res;
  };

  BN.prototype.gtn = function gtn (num) {
    return this.cmpn(num) === 1;
  };

  BN.prototype.gt = function gt (num) {
    return this.cmp(num) === 1;
  };

  BN.prototype.gten = function gten (num) {
    return this.cmpn(num) >= 0;
  };

  BN.prototype.gte = function gte (num) {
    return this.cmp(num) >= 0;
  };

  BN.prototype.ltn = function ltn (num) {
    return this.cmpn(num) === -1;
  };

  BN.prototype.lt = function lt (num) {
    return this.cmp(num) === -1;
  };

  BN.prototype.lten = function lten (num) {
    return this.cmpn(num) <= 0;
  };

  BN.prototype.lte = function lte (num) {
    return this.cmp(num) <= 0;
  };

  BN.prototype.eqn = function eqn (num) {
    return this.cmpn(num) === 0;
  };

  BN.prototype.eq = function eq (num) {
    return this.cmp(num) === 0;
  };

  //
  // A reduce context, could be using montgomery or something better, depending
  // on the `m` itself.
  //
  BN.red = function red (num) {
    return new Red(num);
  };

  BN.prototype.toRed = function toRed (ctx) {
    assert(!this.red, 'Already a number in reduction context');
    assert(this.negative === 0, 'red works only with positives');
    return ctx.convertTo(this)._forceRed(ctx);
  };

  BN.prototype.fromRed = function fromRed () {
    assert(this.red, 'fromRed works only with numbers in reduction context');
    return this.red.convertFrom(this);
  };

  BN.prototype._forceRed = function _forceRed (ctx) {
    this.red = ctx;
    return this;
  };

  BN.prototype.forceRed = function forceRed (ctx) {
    assert(!this.red, 'Already a number in reduction context');
    return this._forceRed(ctx);
  };

  BN.prototype.redAdd = function redAdd (num) {
    assert(this.red, 'redAdd works only with red numbers');
    return this.red.add(this, num);
  };

  BN.prototype.redIAdd = function redIAdd (num) {
    assert(this.red, 'redIAdd works only with red numbers');
    return this.red.iadd(this, num);
  };

  BN.prototype.redSub = function redSub (num) {
    assert(this.red, 'redSub works only with red numbers');
    return this.red.sub(this, num);
  };

  BN.prototype.redISub = function redISub (num) {
    assert(this.red, 'redISub works only with red numbers');
    return this.red.isub(this, num);
  };

  BN.prototype.redShl = function redShl (num) {
    assert(this.red, 'redShl works only with red numbers');
    return this.red.shl(this, num);
  };

  BN.prototype.redMul = function redMul (num) {
    assert(this.red, 'redMul works only with red numbers');
    this.red._verify2(this, num);
    return this.red.mul(this, num);
  };

  BN.prototype.redIMul = function redIMul (num) {
    assert(this.red, 'redMul works only with red numbers');
    this.red._verify2(this, num);
    return this.red.imul(this, num);
  };

  BN.prototype.redSqr = function redSqr () {
    assert(this.red, 'redSqr works only with red numbers');
    this.red._verify1(this);
    return this.red.sqr(this);
  };

  BN.prototype.redISqr = function redISqr () {
    assert(this.red, 'redISqr works only with red numbers');
    this.red._verify1(this);
    return this.red.isqr(this);
  };

  // Square root over p
  BN.prototype.redSqrt = function redSqrt () {
    assert(this.red, 'redSqrt works only with red numbers');
    this.red._verify1(this);
    return this.red.sqrt(this);
  };

  BN.prototype.redInvm = function redInvm () {
    assert(this.red, 'redInvm works only with red numbers');
    this.red._verify1(this);
    return this.red.invm(this);
  };

  // Return negative clone of `this` % `red modulo`
  BN.prototype.redNeg = function redNeg () {
    assert(this.red, 'redNeg works only with red numbers');
    this.red._verify1(this);
    return this.red.neg(this);
  };

  BN.prototype.redPow = function redPow (num) {
    assert(this.red && !num.red, 'redPow(normalNum)');
    this.red._verify1(this);
    return this.red.pow(this, num);
  };

  // Prime numbers with efficient reduction
  var primes = {
    k256: null,
    p224: null,
    p192: null,
    p25519: null
  };

  // Pseudo-Mersenne prime
  function MPrime (name, p) {
    // P = 2 ^ N - K
    this.name = name;
    this.p = new BN(p, 16);
    this.n = this.p.bitLength();
    this.k = new BN(1).iushln(this.n).isub(this.p);

    this.tmp = this._tmp();
  }

  MPrime.prototype._tmp = function _tmp () {
    var tmp = new BN(null);
    tmp.words = new Array(Math.ceil(this.n / 13));
    return tmp;
  };

  MPrime.prototype.ireduce = function ireduce (num) {
    // Assumes that `num` is less than `P^2`
    // num = HI * (2 ^ N - K) + HI * K + LO = HI * K + LO (mod P)
    var r = num;
    var rlen;

    do {
      this.split(r, this.tmp);
      r = this.imulK(r);
      r = r.iadd(this.tmp);
      rlen = r.bitLength();
    } while (rlen > this.n);

    var cmp = rlen < this.n ? -1 : r.ucmp(this.p);
    if (cmp === 0) {
      r.words[0] = 0;
      r.length = 1;
    } else if (cmp > 0) {
      r.isub(this.p);
    } else {
      if (r.strip !== undefined) {
        // r is a BN v4 instance
        r.strip();
      } else {
        // r is a BN v5 instance
        r._strip();
      }
    }

    return r;
  };

  MPrime.prototype.split = function split (input, out) {
    input.iushrn(this.n, 0, out);
  };

  MPrime.prototype.imulK = function imulK (num) {
    return num.imul(this.k);
  };

  function K256 () {
    MPrime.call(
      this,
      'k256',
      'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f');
  }
  inherits(K256, MPrime);

  K256.prototype.split = function split (input, output) {
    // 256 = 9 * 26 + 22
    var mask = 0x3fffff;

    var outLen = Math.min(input.length, 9);
    for (var i = 0; i < outLen; i++) {
      output.words[i] = input.words[i];
    }
    output.length = outLen;

    if (input.length <= 9) {
      input.words[0] = 0;
      input.length = 1;
      return;
    }

    // Shift by 9 limbs
    var prev = input.words[9];
    output.words[output.length++] = prev & mask;

    for (i = 10; i < input.length; i++) {
      var next = input.words[i] | 0;
      input.words[i - 10] = ((next & mask) << 4) | (prev >>> 22);
      prev = next;
    }
    prev >>>= 22;
    input.words[i - 10] = prev;
    if (prev === 0 && input.length > 10) {
      input.length -= 10;
    } else {
      input.length -= 9;
    }
  };

  K256.prototype.imulK = function imulK (num) {
    // K = 0x1000003d1 = [ 0x40, 0x3d1 ]
    num.words[num.length] = 0;
    num.words[num.length + 1] = 0;
    num.length += 2;

    // bounded at: 0x40 * 0x3ffffff + 0x3d0 = 0x100000390
    var lo = 0;
    for (var i = 0; i < num.length; i++) {
      var w = num.words[i] | 0;
      lo += w * 0x3d1;
      num.words[i] = lo & 0x3ffffff;
      lo = w * 0x40 + ((lo / 0x4000000) | 0);
    }

    // Fast length reduction
    if (num.words[num.length - 1] === 0) {
      num.length--;
      if (num.words[num.length - 1] === 0) {
        num.length--;
      }
    }
    return num;
  };

  function P224 () {
    MPrime.call(
      this,
      'p224',
      'ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001');
  }
  inherits(P224, MPrime);

  function P192 () {
    MPrime.call(
      this,
      'p192',
      'ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff');
  }
  inherits(P192, MPrime);

  function P25519 () {
    // 2 ^ 255 - 19
    MPrime.call(
      this,
      '25519',
      '7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed');
  }
  inherits(P25519, MPrime);

  P25519.prototype.imulK = function imulK (num) {
    // K = 0x13
    var carry = 0;
    for (var i = 0; i < num.length; i++) {
      var hi = (num.words[i] | 0) * 0x13 + carry;
      var lo = hi & 0x3ffffff;
      hi >>>= 26;

      num.words[i] = lo;
      carry = hi;
    }
    if (carry !== 0) {
      num.words[num.length++] = carry;
    }
    return num;
  };

  // Exported mostly for testing purposes, use plain name instead
  BN._prime = function prime (name) {
    // Cached version of prime
    if (primes[name]) return primes[name];

    var prime;
    if (name === 'k256') {
      prime = new K256();
    } else if (name === 'p224') {
      prime = new P224();
    } else if (name === 'p192') {
      prime = new P192();
    } else if (name === 'p25519') {
      prime = new P25519();
    } else {
      throw new Error('Unknown prime ' + name);
    }
    primes[name] = prime;

    return prime;
  };

  //
  // Base reduction engine
  //
  function Red (m) {
    if (typeof m === 'string') {
      var prime = BN._prime(m);
      this.m = prime.p;
      this.prime = prime;
    } else {
      assert(m.gtn(1), 'modulus must be greater than 1');
      this.m = m;
      this.prime = null;
    }
  }

  Red.prototype._verify1 = function _verify1 (a) {
    assert(a.negative === 0, 'red works only with positives');
    assert(a.red, 'red works only with red numbers');
  };

  Red.prototype._verify2 = function _verify2 (a, b) {
    assert((a.negative | b.negative) === 0, 'red works only with positives');
    assert(a.red && a.red === b.red,
      'red works only with red numbers');
  };

  Red.prototype.imod = function imod (a) {
    if (this.prime) return this.prime.ireduce(a)._forceRed(this);

    move(a, a.umod(this.m)._forceRed(this));
    return a;
  };

  Red.prototype.neg = function neg (a) {
    if (a.isZero()) {
      return a.clone();
    }

    return this.m.sub(a)._forceRed(this);
  };

  Red.prototype.add = function add (a, b) {
    this._verify2(a, b);

    var res = a.add(b);
    if (res.cmp(this.m) >= 0) {
      res.isub(this.m);
    }
    return res._forceRed(this);
  };

  Red.prototype.iadd = function iadd (a, b) {
    this._verify2(a, b);

    var res = a.iadd(b);
    if (res.cmp(this.m) >= 0) {
      res.isub(this.m);
    }
    return res;
  };

  Red.prototype.sub = function sub (a, b) {
    this._verify2(a, b);

    var res = a.sub(b);
    if (res.cmpn(0) < 0) {
      res.iadd(this.m);
    }
    return res._forceRed(this);
  };

  Red.prototype.isub = function isub (a, b) {
    this._verify2(a, b);

    var res = a.isub(b);
    if (res.cmpn(0) < 0) {
      res.iadd(this.m);
    }
    return res;
  };

  Red.prototype.shl = function shl (a, num) {
    this._verify1(a);
    return this.imod(a.ushln(num));
  };

  Red.prototype.imul = function imul (a, b) {
    this._verify2(a, b);
    return this.imod(a.imul(b));
  };

  Red.prototype.mul = function mul (a, b) {
    this._verify2(a, b);
    return this.imod(a.mul(b));
  };

  Red.prototype.isqr = function isqr (a) {
    return this.imul(a, a.clone());
  };

  Red.prototype.sqr = function sqr (a) {
    return this.mul(a, a);
  };

  Red.prototype.sqrt = function sqrt (a) {
    if (a.isZero()) return a.clone();

    var mod3 = this.m.andln(3);
    assert(mod3 % 2 === 1);

    // Fast case
    if (mod3 === 3) {
      var pow = this.m.add(new BN(1)).iushrn(2);
      return this.pow(a, pow);
    }

    // Tonelli-Shanks algorithm (Totally unoptimized and slow)
    //
    // Find Q and S, that Q * 2 ^ S = (P - 1)
    var q = this.m.subn(1);
    var s = 0;
    while (!q.isZero() && q.andln(1) === 0) {
      s++;
      q.iushrn(1);
    }
    assert(!q.isZero());

    var one = new BN(1).toRed(this);
    var nOne = one.redNeg();

    // Find quadratic non-residue
    // NOTE: Max is such because of generalized Riemann hypothesis.
    var lpow = this.m.subn(1).iushrn(1);
    var z = this.m.bitLength();
    z = new BN(2 * z * z).toRed(this);

    while (this.pow(z, lpow).cmp(nOne) !== 0) {
      z.redIAdd(nOne);
    }

    var c = this.pow(z, q);
    var r = this.pow(a, q.addn(1).iushrn(1));
    var t = this.pow(a, q);
    var m = s;
    while (t.cmp(one) !== 0) {
      var tmp = t;
      for (var i = 0; tmp.cmp(one) !== 0; i++) {
        tmp = tmp.redSqr();
      }
      assert(i < m);
      var b = this.pow(c, new BN(1).iushln(m - i - 1));

      r = r.redMul(b);
      c = b.redSqr();
      t = t.redMul(c);
      m = i;
    }

    return r;
  };

  Red.prototype.invm = function invm (a) {
    var inv = a._invmp(this.m);
    if (inv.negative !== 0) {
      inv.negative = 0;
      return this.imod(inv).redNeg();
    } else {
      return this.imod(inv);
    }
  };

  Red.prototype.pow = function pow (a, num) {
    if (num.isZero()) return new BN(1).toRed(this);
    if (num.cmpn(1) === 0) return a.clone();

    var windowSize = 4;
    var wnd = new Array(1 << windowSize);
    wnd[0] = new BN(1).toRed(this);
    wnd[1] = a;
    for (var i = 2; i < wnd.length; i++) {
      wnd[i] = this.mul(wnd[i - 1], a);
    }

    var res = wnd[0];
    var current = 0;
    var currentLen = 0;
    var start = num.bitLength() % 26;
    if (start === 0) {
      start = 26;
    }

    for (i = num.length - 1; i >= 0; i--) {
      var word = num.words[i];
      for (var j = start - 1; j >= 0; j--) {
        var bit = (word >> j) & 1;
        if (res !== wnd[0]) {
          res = this.sqr(res);
        }

        if (bit === 0 && current === 0) {
          currentLen = 0;
          continue;
        }

        current <<= 1;
        current |= bit;
        currentLen++;
        if (currentLen !== windowSize && (i !== 0 || j !== 0)) continue;

        res = this.mul(res, wnd[current]);
        currentLen = 0;
        current = 0;
      }
      start = 26;
    }

    return res;
  };

  Red.prototype.convertTo = function convertTo (num) {
    var r = num.umod(this.m);

    return r === num ? r.clone() : r;
  };

  Red.prototype.convertFrom = function convertFrom (num) {
    var res = num.clone();
    res.red = null;
    return res;
  };

  //
  // Montgomery method engine
  //

  BN.mont = function mont (num) {
    return new Mont(num);
  };

  function Mont (m) {
    Red.call(this, m);

    this.shift = this.m.bitLength();
    if (this.shift % 26 !== 0) {
      this.shift += 26 - (this.shift % 26);
    }

    this.r = new BN(1).iushln(this.shift);
    this.r2 = this.imod(this.r.sqr());
    this.rinv = this.r._invmp(this.m);

    this.minv = this.rinv.mul(this.r).isubn(1).div(this.m);
    this.minv = this.minv.umod(this.r);
    this.minv = this.r.sub(this.minv);
  }
  inherits(Mont, Red);

  Mont.prototype.convertTo = function convertTo (num) {
    return this.imod(num.ushln(this.shift));
  };

  Mont.prototype.convertFrom = function convertFrom (num) {
    var r = this.imod(num.mul(this.rinv));
    r.red = null;
    return r;
  };

  Mont.prototype.imul = function imul (a, b) {
    if (a.isZero() || b.isZero()) {
      a.words[0] = 0;
      a.length = 1;
      return a;
    }

    var t = a.imul(b);
    var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
    var u = t.isub(c).iushrn(this.shift);
    var res = u;

    if (u.cmp(this.m) >= 0) {
      res = u.isub(this.m);
    } else if (u.cmpn(0) < 0) {
      res = u.iadd(this.m);
    }

    return res._forceRed(this);
  };

  Mont.prototype.mul = function mul (a, b) {
    if (a.isZero() || b.isZero()) return new BN(0)._forceRed(this);

    var t = a.mul(b);
    var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
    var u = t.isub(c).iushrn(this.shift);
    var res = u;
    if (u.cmp(this.m) >= 0) {
      res = u.isub(this.m);
    } else if (u.cmpn(0) < 0) {
      res = u.iadd(this.m);
    }

    return res._forceRed(this);
  };

  Mont.prototype.invm = function invm (a) {
    // (AR)^-1 * R^2 = (A^-1 * R^-1) * R^2 = A^-1 * R
    var res = this.imod(a._invmp(this.m).mul(this.r2));
    return res._forceRed(this);
  };
})(typeof module === 'undefined' || module, this);

},{"buffer":"../node_modules/parcel-bundler/src/builtins/_empty.js"}],"../node_modules/base64-js/index.js":[function(require,module,exports) {
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],"../node_modules/ieee754/index.js":[function(require,module,exports) {
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],"../node_modules/isarray/index.js":[function(require,module,exports) {
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],"../node_modules/node-libs-browser/node_modules/buffer/index.js":[function(require,module,exports) {

var global = arguments[3];
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('isarray')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

},{"base64-js":"../node_modules/base64-js/index.js","ieee754":"../node_modules/ieee754/index.js","isarray":"../node_modules/isarray/index.js","buffer":"../node_modules/node-libs-browser/node_modules/buffer/index.js"}],"../node_modules/safe-buffer/index.js":[function(require,module,exports) {

/*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
/* eslint-disable node/no-deprecated-api */
var buffer = require('buffer')
var Buffer = buffer.Buffer

// alternative to using Object.keys for old browsers
function copyProps (src, dst) {
  for (var key in src) {
    dst[key] = src[key]
  }
}
if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
  module.exports = buffer
} else {
  // Copy properties from require('buffer')
  copyProps(buffer, exports)
  exports.Buffer = SafeBuffer
}

function SafeBuffer (arg, encodingOrOffset, length) {
  return Buffer(arg, encodingOrOffset, length)
}

SafeBuffer.prototype = Object.create(Buffer.prototype)

// Copy static methods from Buffer
copyProps(Buffer, SafeBuffer)

SafeBuffer.from = function (arg, encodingOrOffset, length) {
  if (typeof arg === 'number') {
    throw new TypeError('Argument must not be a number')
  }
  return Buffer(arg, encodingOrOffset, length)
}

SafeBuffer.alloc = function (size, fill, encoding) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  var buf = Buffer(size)
  if (fill !== undefined) {
    if (typeof encoding === 'string') {
      buf.fill(fill, encoding)
    } else {
      buf.fill(fill)
    }
  } else {
    buf.fill(0)
  }
  return buf
}

SafeBuffer.allocUnsafe = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return Buffer(size)
}

SafeBuffer.allocUnsafeSlow = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return buffer.SlowBuffer(size)
}

},{"buffer":"../node_modules/node-libs-browser/node_modules/buffer/index.js"}],"../node_modules/base-x/src/index.js":[function(require,module,exports) {
'use strict'
// base-x encoding / decoding
// Copyright (c) 2018 base-x contributors
// Copyright (c) 2014-2018 The Bitcoin Core developers (base58.cpp)
// Distributed under the MIT software license, see the accompanying
// file LICENSE or http://www.opensource.org/licenses/mit-license.php.
// @ts-ignore
var _Buffer = require('safe-buffer').Buffer
function base (ALPHABET) {
  if (ALPHABET.length >= 255) { throw new TypeError('Alphabet too long') }
  var BASE_MAP = new Uint8Array(256)
  for (var j = 0; j < BASE_MAP.length; j++) {
    BASE_MAP[j] = 255
  }
  for (var i = 0; i < ALPHABET.length; i++) {
    var x = ALPHABET.charAt(i)
    var xc = x.charCodeAt(0)
    if (BASE_MAP[xc] !== 255) { throw new TypeError(x + ' is ambiguous') }
    BASE_MAP[xc] = i
  }
  var BASE = ALPHABET.length
  var LEADER = ALPHABET.charAt(0)
  var FACTOR = Math.log(BASE) / Math.log(256) // log(BASE) / log(256), rounded up
  var iFACTOR = Math.log(256) / Math.log(BASE) // log(256) / log(BASE), rounded up
  function encode (source) {
    if (Array.isArray(source) || source instanceof Uint8Array) { source = _Buffer.from(source) }
    if (!_Buffer.isBuffer(source)) { throw new TypeError('Expected Buffer') }
    if (source.length === 0) { return '' }
        // Skip & count leading zeroes.
    var zeroes = 0
    var length = 0
    var pbegin = 0
    var pend = source.length
    while (pbegin !== pend && source[pbegin] === 0) {
      pbegin++
      zeroes++
    }
        // Allocate enough space in big-endian base58 representation.
    var size = ((pend - pbegin) * iFACTOR + 1) >>> 0
    var b58 = new Uint8Array(size)
        // Process the bytes.
    while (pbegin !== pend) {
      var carry = source[pbegin]
            // Apply "b58 = b58 * 256 + ch".
      var i = 0
      for (var it1 = size - 1; (carry !== 0 || i < length) && (it1 !== -1); it1--, i++) {
        carry += (256 * b58[it1]) >>> 0
        b58[it1] = (carry % BASE) >>> 0
        carry = (carry / BASE) >>> 0
      }
      if (carry !== 0) { throw new Error('Non-zero carry') }
      length = i
      pbegin++
    }
        // Skip leading zeroes in base58 result.
    var it2 = size - length
    while (it2 !== size && b58[it2] === 0) {
      it2++
    }
        // Translate the result into a string.
    var str = LEADER.repeat(zeroes)
    for (; it2 < size; ++it2) { str += ALPHABET.charAt(b58[it2]) }
    return str
  }
  function decodeUnsafe (source) {
    if (typeof source !== 'string') { throw new TypeError('Expected String') }
    if (source.length === 0) { return _Buffer.alloc(0) }
    var psz = 0
        // Skip leading spaces.
    if (source[psz] === ' ') { return }
        // Skip and count leading '1's.
    var zeroes = 0
    var length = 0
    while (source[psz] === LEADER) {
      zeroes++
      psz++
    }
        // Allocate enough space in big-endian base256 representation.
    var size = (((source.length - psz) * FACTOR) + 1) >>> 0 // log(58) / log(256), rounded up.
    var b256 = new Uint8Array(size)
        // Process the characters.
    while (source[psz]) {
            // Decode character
      var carry = BASE_MAP[source.charCodeAt(psz)]
            // Invalid character
      if (carry === 255) { return }
      var i = 0
      for (var it3 = size - 1; (carry !== 0 || i < length) && (it3 !== -1); it3--, i++) {
        carry += (BASE * b256[it3]) >>> 0
        b256[it3] = (carry % 256) >>> 0
        carry = (carry / 256) >>> 0
      }
      if (carry !== 0) { throw new Error('Non-zero carry') }
      length = i
      psz++
    }
        // Skip trailing spaces.
    if (source[psz] === ' ') { return }
        // Skip leading zeroes in b256.
    var it4 = size - length
    while (it4 !== size && b256[it4] === 0) {
      it4++
    }
    var vch = _Buffer.allocUnsafe(zeroes + (size - it4))
    vch.fill(0x00, 0, zeroes)
    var j = zeroes
    while (it4 !== size) {
      vch[j++] = b256[it4++]
    }
    return vch
  }
  function decode (string) {
    var buffer = decodeUnsafe(string)
    if (buffer) { return buffer }
    throw new Error('Non-base' + BASE + ' character')
  }
  return {
    encode: encode,
    decodeUnsafe: decodeUnsafe,
    decode: decode
  }
}
module.exports = base

},{"safe-buffer":"../node_modules/safe-buffer/index.js"}],"../node_modules/bs58/index.js":[function(require,module,exports) {
var basex = require('base-x')
var ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'

module.exports = basex(ALPHABET)

},{"base-x":"../node_modules/base-x/src/index.js"}],"../node_modules/text-encoding-utf-8/lib/encoding.lib.js":[function(require,module,exports) {
'use strict';

// This is free and unencumbered software released into the public domain.
// See LICENSE.md for more information.

//
// Utilities
//

/**
 * @param {number} a The number to test.
 * @param {number} min The minimum value in the range, inclusive.
 * @param {number} max The maximum value in the range, inclusive.
 * @return {boolean} True if a >= min and a <= max.
 */
function inRange(a, min, max) {
  return min <= a && a <= max;
}

/**
 * @param {*} o
 * @return {Object}
 */
function ToDictionary(o) {
  if (o === undefined) return {};
  if (o === Object(o)) return o;
  throw TypeError('Could not convert argument to dictionary');
}

/**
 * @param {string} string Input string of UTF-16 code units.
 * @return {!Array.<number>} Code points.
 */
function stringToCodePoints(string) {
  // https://heycam.github.io/webidl/#dfn-obtain-unicode

  // 1. Let S be the DOMString value.
  var s = String(string);

  // 2. Let n be the length of S.
  var n = s.length;

  // 3. Initialize i to 0.
  var i = 0;

  // 4. Initialize U to be an empty sequence of Unicode characters.
  var u = [];

  // 5. While i < n:
  while (i < n) {

    // 1. Let c be the code unit in S at index i.
    var c = s.charCodeAt(i);

    // 2. Depending on the value of c:

    // c < 0xD800 or c > 0xDFFF
    if (c < 0xD800 || c > 0xDFFF) {
      // Append to U the Unicode character with code point c.
      u.push(c);
    }

    // 0xDC00 ≤ c ≤ 0xDFFF
    else if (0xDC00 <= c && c <= 0xDFFF) {
      // Append to U a U+FFFD REPLACEMENT CHARACTER.
      u.push(0xFFFD);
    }

    // 0xD800 ≤ c ≤ 0xDBFF
    else if (0xD800 <= c && c <= 0xDBFF) {
      // 1. If i = n−1, then append to U a U+FFFD REPLACEMENT
      // CHARACTER.
      if (i === n - 1) {
        u.push(0xFFFD);
      }
      // 2. Otherwise, i < n−1:
      else {
        // 1. Let d be the code unit in S at index i+1.
        var d = string.charCodeAt(i + 1);

        // 2. If 0xDC00 ≤ d ≤ 0xDFFF, then:
        if (0xDC00 <= d && d <= 0xDFFF) {
          // 1. Let a be c & 0x3FF.
          var a = c & 0x3FF;

          // 2. Let b be d & 0x3FF.
          var b = d & 0x3FF;

          // 3. Append to U the Unicode character with code point
          // 2^16+2^10*a+b.
          u.push(0x10000 + (a << 10) + b);

          // 4. Set i to i+1.
          i += 1;
        }

        // 3. Otherwise, d < 0xDC00 or d > 0xDFFF. Append to U a
        // U+FFFD REPLACEMENT CHARACTER.
        else  {
          u.push(0xFFFD);
        }
      }
    }

    // 3. Set i to i+1.
    i += 1;
  }

  // 6. Return U.
  return u;
}

/**
 * @param {!Array.<number>} code_points Array of code points.
 * @return {string} string String of UTF-16 code units.
 */
function codePointsToString(code_points) {
  var s = '';
  for (var i = 0; i < code_points.length; ++i) {
    var cp = code_points[i];
    if (cp <= 0xFFFF) {
      s += String.fromCharCode(cp);
    } else {
      cp -= 0x10000;
      s += String.fromCharCode((cp >> 10) + 0xD800,
                               (cp & 0x3FF) + 0xDC00);
    }
  }
  return s;
}


//
// Implementation of Encoding specification
// https://encoding.spec.whatwg.org/
//

//
// 3. Terminology
//

/**
 * End-of-stream is a special token that signifies no more tokens
 * are in the stream.
 * @const
 */ var end_of_stream = -1;

/**
 * A stream represents an ordered sequence of tokens.
 *
 * @constructor
 * @param {!(Array.<number>|Uint8Array)} tokens Array of tokens that provide the
 * stream.
 */
function Stream(tokens) {
  /** @type {!Array.<number>} */
  this.tokens = [].slice.call(tokens);
}

Stream.prototype = {
  /**
   * @return {boolean} True if end-of-stream has been hit.
   */
  endOfStream: function() {
    return !this.tokens.length;
  },

  /**
   * When a token is read from a stream, the first token in the
   * stream must be returned and subsequently removed, and
   * end-of-stream must be returned otherwise.
   *
   * @return {number} Get the next token from the stream, or
   * end_of_stream.
   */
   read: function() {
    if (!this.tokens.length)
      return end_of_stream;
     return this.tokens.shift();
   },

  /**
   * When one or more tokens are prepended to a stream, those tokens
   * must be inserted, in given order, before the first token in the
   * stream.
   *
   * @param {(number|!Array.<number>)} token The token(s) to prepend to the stream.
   */
  prepend: function(token) {
    if (Array.isArray(token)) {
      var tokens = /**@type {!Array.<number>}*/(token);
      while (tokens.length)
        this.tokens.unshift(tokens.pop());
    } else {
      this.tokens.unshift(token);
    }
  },

  /**
   * When one or more tokens are pushed to a stream, those tokens
   * must be inserted, in given order, after the last token in the
   * stream.
   *
   * @param {(number|!Array.<number>)} token The tokens(s) to prepend to the stream.
   */
  push: function(token) {
    if (Array.isArray(token)) {
      var tokens = /**@type {!Array.<number>}*/(token);
      while (tokens.length)
        this.tokens.push(tokens.shift());
    } else {
      this.tokens.push(token);
    }
  }
};

//
// 4. Encodings
//

// 4.1 Encoders and decoders

/** @const */
var finished = -1;

/**
 * @param {boolean} fatal If true, decoding errors raise an exception.
 * @param {number=} opt_code_point Override the standard fallback code point.
 * @return {number} The code point to insert on a decoding error.
 */
function decoderError(fatal, opt_code_point) {
  if (fatal)
    throw TypeError('Decoder error');
  return opt_code_point || 0xFFFD;
}

//
// 7. API
//

/** @const */ var DEFAULT_ENCODING = 'utf-8';

// 7.1 Interface TextDecoder

/**
 * @constructor
 * @param {string=} encoding The label of the encoding;
 *     defaults to 'utf-8'.
 * @param {Object=} options
 */
function TextDecoder(encoding, options) {
  if (!(this instanceof TextDecoder)) {
    return new TextDecoder(encoding, options);
  }
  encoding = encoding !== undefined ? String(encoding).toLowerCase() : DEFAULT_ENCODING;
  if (encoding !== DEFAULT_ENCODING) {
    throw new Error('Encoding not supported. Only utf-8 is supported');
  }
  options = ToDictionary(options);

  /** @private @type {boolean} */
  this._streaming = false;
  /** @private @type {boolean} */
  this._BOMseen = false;
  /** @private @type {?Decoder} */
  this._decoder = null;
  /** @private @type {boolean} */
  this._fatal = Boolean(options['fatal']);
  /** @private @type {boolean} */
  this._ignoreBOM = Boolean(options['ignoreBOM']);

  Object.defineProperty(this, 'encoding', {value: 'utf-8'});
  Object.defineProperty(this, 'fatal', {value: this._fatal});
  Object.defineProperty(this, 'ignoreBOM', {value: this._ignoreBOM});
}

TextDecoder.prototype = {
  /**
   * @param {ArrayBufferView=} input The buffer of bytes to decode.
   * @param {Object=} options
   * @return {string} The decoded string.
   */
  decode: function decode(input, options) {
    var bytes;
    if (typeof input === 'object' && input instanceof ArrayBuffer) {
      bytes = new Uint8Array(input);
    } else if (typeof input === 'object' && 'buffer' in input &&
               input.buffer instanceof ArrayBuffer) {
      bytes = new Uint8Array(input.buffer,
                             input.byteOffset,
                             input.byteLength);
    } else {
      bytes = new Uint8Array(0);
    }

    options = ToDictionary(options);

    if (!this._streaming) {
      this._decoder = new UTF8Decoder({fatal: this._fatal});
      this._BOMseen = false;
    }
    this._streaming = Boolean(options['stream']);

    var input_stream = new Stream(bytes);

    var code_points = [];

    /** @type {?(number|!Array.<number>)} */
    var result;

    while (!input_stream.endOfStream()) {
      result = this._decoder.handler(input_stream, input_stream.read());
      if (result === finished)
        break;
      if (result === null)
        continue;
      if (Array.isArray(result))
        code_points.push.apply(code_points, /**@type {!Array.<number>}*/(result));
      else
        code_points.push(result);
    }
    if (!this._streaming) {
      do {
        result = this._decoder.handler(input_stream, input_stream.read());
        if (result === finished)
          break;
        if (result === null)
          continue;
        if (Array.isArray(result))
          code_points.push.apply(code_points, /**@type {!Array.<number>}*/(result));
        else
          code_points.push(result);
      } while (!input_stream.endOfStream());
      this._decoder = null;
    }

    if (code_points.length) {
      // If encoding is one of utf-8, utf-16be, and utf-16le, and
      // ignore BOM flag and BOM seen flag are unset, run these
      // subsubsteps:
      if (['utf-8'].indexOf(this.encoding) !== -1 &&
          !this._ignoreBOM && !this._BOMseen) {
        // If token is U+FEFF, set BOM seen flag.
        if (code_points[0] === 0xFEFF) {
          this._BOMseen = true;
          code_points.shift();
        } else {
          // Otherwise, if token is not end-of-stream, set BOM seen
          // flag and append token to output.
          this._BOMseen = true;
        }
      }
    }

    return codePointsToString(code_points);
  }
};

// 7.2 Interface TextEncoder

/**
 * @constructor
 * @param {string=} encoding The label of the encoding;
 *     defaults to 'utf-8'.
 * @param {Object=} options
 */
function TextEncoder(encoding, options) {
  if (!(this instanceof TextEncoder))
    return new TextEncoder(encoding, options);
  encoding = encoding !== undefined ? String(encoding).toLowerCase() : DEFAULT_ENCODING;
  if (encoding !== DEFAULT_ENCODING) {
    throw new Error('Encoding not supported. Only utf-8 is supported');
  }
  options = ToDictionary(options);

  /** @private @type {boolean} */
  this._streaming = false;
  /** @private @type {?Encoder} */
  this._encoder = null;
  /** @private @type {{fatal: boolean}} */
  this._options = {fatal: Boolean(options['fatal'])};

  Object.defineProperty(this, 'encoding', {value: 'utf-8'});
}

TextEncoder.prototype = {
  /**
   * @param {string=} opt_string The string to encode.
   * @param {Object=} options
   * @return {Uint8Array} Encoded bytes, as a Uint8Array.
   */
  encode: function encode(opt_string, options) {
    opt_string = opt_string ? String(opt_string) : '';
    options = ToDictionary(options);

    // NOTE: This option is nonstandard. None of the encodings
    // permitted for encoding (i.e. UTF-8, UTF-16) are stateful,
    // so streaming is not necessary.
    if (!this._streaming)
      this._encoder = new UTF8Encoder(this._options);
    this._streaming = Boolean(options['stream']);

    var bytes = [];
    var input_stream = new Stream(stringToCodePoints(opt_string));
    /** @type {?(number|!Array.<number>)} */
    var result;
    while (!input_stream.endOfStream()) {
      result = this._encoder.handler(input_stream, input_stream.read());
      if (result === finished)
        break;
      if (Array.isArray(result))
        bytes.push.apply(bytes, /**@type {!Array.<number>}*/(result));
      else
        bytes.push(result);
    }
    if (!this._streaming) {
      while (true) {
        result = this._encoder.handler(input_stream, input_stream.read());
        if (result === finished)
          break;
        if (Array.isArray(result))
          bytes.push.apply(bytes, /**@type {!Array.<number>}*/(result));
        else
          bytes.push(result);
      }
      this._encoder = null;
    }
    return new Uint8Array(bytes);
  }
};

//
// 8. The encoding
//

// 8.1 utf-8

/**
 * @constructor
 * @implements {Decoder}
 * @param {{fatal: boolean}} options
 */
function UTF8Decoder(options) {
  var fatal = options.fatal;

  // utf-8's decoder's has an associated utf-8 code point, utf-8
  // bytes seen, and utf-8 bytes needed (all initially 0), a utf-8
  // lower boundary (initially 0x80), and a utf-8 upper boundary
  // (initially 0xBF).
  var /** @type {number} */ utf8_code_point = 0,
      /** @type {number} */ utf8_bytes_seen = 0,
      /** @type {number} */ utf8_bytes_needed = 0,
      /** @type {number} */ utf8_lower_boundary = 0x80,
      /** @type {number} */ utf8_upper_boundary = 0xBF;

  /**
   * @param {Stream} stream The stream of bytes being decoded.
   * @param {number} bite The next byte read from the stream.
   * @return {?(number|!Array.<number>)} The next code point(s)
   *     decoded, or null if not enough data exists in the input
   *     stream to decode a complete code point.
   */
  this.handler = function(stream, bite) {
    // 1. If byte is end-of-stream and utf-8 bytes needed is not 0,
    // set utf-8 bytes needed to 0 and return error.
    if (bite === end_of_stream && utf8_bytes_needed !== 0) {
      utf8_bytes_needed = 0;
      return decoderError(fatal);
    }

    // 2. If byte is end-of-stream, return finished.
    if (bite === end_of_stream)
      return finished;

    // 3. If utf-8 bytes needed is 0, based on byte:
    if (utf8_bytes_needed === 0) {

      // 0x00 to 0x7F
      if (inRange(bite, 0x00, 0x7F)) {
        // Return a code point whose value is byte.
        return bite;
      }

      // 0xC2 to 0xDF
      if (inRange(bite, 0xC2, 0xDF)) {
        // Set utf-8 bytes needed to 1 and utf-8 code point to byte
        // − 0xC0.
        utf8_bytes_needed = 1;
        utf8_code_point = bite - 0xC0;
      }

      // 0xE0 to 0xEF
      else if (inRange(bite, 0xE0, 0xEF)) {
        // 1. If byte is 0xE0, set utf-8 lower boundary to 0xA0.
        if (bite === 0xE0)
          utf8_lower_boundary = 0xA0;
        // 2. If byte is 0xED, set utf-8 upper boundary to 0x9F.
        if (bite === 0xED)
          utf8_upper_boundary = 0x9F;
        // 3. Set utf-8 bytes needed to 2 and utf-8 code point to
        // byte − 0xE0.
        utf8_bytes_needed = 2;
        utf8_code_point = bite - 0xE0;
      }

      // 0xF0 to 0xF4
      else if (inRange(bite, 0xF0, 0xF4)) {
        // 1. If byte is 0xF0, set utf-8 lower boundary to 0x90.
        if (bite === 0xF0)
          utf8_lower_boundary = 0x90;
        // 2. If byte is 0xF4, set utf-8 upper boundary to 0x8F.
        if (bite === 0xF4)
          utf8_upper_boundary = 0x8F;
        // 3. Set utf-8 bytes needed to 3 and utf-8 code point to
        // byte − 0xF0.
        utf8_bytes_needed = 3;
        utf8_code_point = bite - 0xF0;
      }

      // Otherwise
      else {
        // Return error.
        return decoderError(fatal);
      }

      // Then (byte is in the range 0xC2 to 0xF4) set utf-8 code
      // point to utf-8 code point << (6 × utf-8 bytes needed) and
      // return continue.
      utf8_code_point = utf8_code_point << (6 * utf8_bytes_needed);
      return null;
    }

    // 4. If byte is not in the range utf-8 lower boundary to utf-8
    // upper boundary, run these substeps:
    if (!inRange(bite, utf8_lower_boundary, utf8_upper_boundary)) {

      // 1. Set utf-8 code point, utf-8 bytes needed, and utf-8
      // bytes seen to 0, set utf-8 lower boundary to 0x80, and set
      // utf-8 upper boundary to 0xBF.
      utf8_code_point = utf8_bytes_needed = utf8_bytes_seen = 0;
      utf8_lower_boundary = 0x80;
      utf8_upper_boundary = 0xBF;

      // 2. Prepend byte to stream.
      stream.prepend(bite);

      // 3. Return error.
      return decoderError(fatal);
    }

    // 5. Set utf-8 lower boundary to 0x80 and utf-8 upper boundary
    // to 0xBF.
    utf8_lower_boundary = 0x80;
    utf8_upper_boundary = 0xBF;

    // 6. Increase utf-8 bytes seen by one and set utf-8 code point
    // to utf-8 code point + (byte − 0x80) << (6 × (utf-8 bytes
    // needed − utf-8 bytes seen)).
    utf8_bytes_seen += 1;
    utf8_code_point += (bite - 0x80) << (6 * (utf8_bytes_needed - utf8_bytes_seen));

    // 7. If utf-8 bytes seen is not equal to utf-8 bytes needed,
    // continue.
    if (utf8_bytes_seen !== utf8_bytes_needed)
      return null;

    // 8. Let code point be utf-8 code point.
    var code_point = utf8_code_point;

    // 9. Set utf-8 code point, utf-8 bytes needed, and utf-8 bytes
    // seen to 0.
    utf8_code_point = utf8_bytes_needed = utf8_bytes_seen = 0;

    // 10. Return a code point whose value is code point.
    return code_point;
  };
}

/**
 * @constructor
 * @implements {Encoder}
 * @param {{fatal: boolean}} options
 */
function UTF8Encoder(options) {
  var fatal = options.fatal;
  /**
   * @param {Stream} stream Input stream.
   * @param {number} code_point Next code point read from the stream.
   * @return {(number|!Array.<number>)} Byte(s) to emit.
   */
  this.handler = function(stream, code_point) {
    // 1. If code point is end-of-stream, return finished.
    if (code_point === end_of_stream)
      return finished;

    // 2. If code point is in the range U+0000 to U+007F, return a
    // byte whose value is code point.
    if (inRange(code_point, 0x0000, 0x007f))
      return code_point;

    // 3. Set count and offset based on the range code point is in:
    var count, offset;
    // U+0080 to U+07FF:    1 and 0xC0
    if (inRange(code_point, 0x0080, 0x07FF)) {
      count = 1;
      offset = 0xC0;
    }
    // U+0800 to U+FFFF:    2 and 0xE0
    else if (inRange(code_point, 0x0800, 0xFFFF)) {
      count = 2;
      offset = 0xE0;
    }
    // U+10000 to U+10FFFF: 3 and 0xF0
    else if (inRange(code_point, 0x10000, 0x10FFFF)) {
      count = 3;
      offset = 0xF0;
    }

    // 4.Let bytes be a byte sequence whose first byte is (code
    // point >> (6 × count)) + offset.
    var bytes = [(code_point >> (6 * count)) + offset];

    // 5. Run these substeps while count is greater than 0:
    while (count > 0) {

      // 1. Set temp to code point >> (6 × (count − 1)).
      var temp = code_point >> (6 * (count - 1));

      // 2. Append to bytes 0x80 | (temp & 0x3F).
      bytes.push(0x80 | (temp & 0x3F));

      // 3. Decrease count by one.
      count -= 1;
    }

    // 6. Return bytes bytes, in order.
    return bytes;
  };
}

exports.TextEncoder = TextEncoder;
exports.TextDecoder = TextDecoder;
},{}],"../node_modules/near-api-js/node_modules/borsh/lib/index.js":[function(require,module,exports) {
var global = arguments[3];
var Buffer = require("buffer").Buffer;
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserializeUnchecked = exports.deserialize = exports.serialize = exports.BinaryReader = exports.BinaryWriter = exports.BorshError = exports.baseDecode = exports.baseEncode = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
const bs58_1 = __importDefault(require("bs58"));
// TODO: Make sure this polyfill not included when not required
const encoding = __importStar(require("text-encoding-utf-8"));
const TextDecoder = (typeof global.TextDecoder !== 'function') ? encoding.TextDecoder : global.TextDecoder;
const textDecoder = new TextDecoder('utf-8', { fatal: true });
function baseEncode(value) {
    if (typeof (value) === 'string') {
        value = Buffer.from(value, 'utf8');
    }
    return bs58_1.default.encode(Buffer.from(value));
}
exports.baseEncode = baseEncode;
function baseDecode(value) {
    return Buffer.from(bs58_1.default.decode(value));
}
exports.baseDecode = baseDecode;
const INITIAL_LENGTH = 1024;
class BorshError extends Error {
    constructor(message) {
        super(message);
        this.fieldPath = [];
        this.originalMessage = message;
    }
    addToFieldPath(fieldName) {
        this.fieldPath.splice(0, 0, fieldName);
        // NOTE: Modifying message directly as jest doesn't use .toString()
        this.message = this.originalMessage + ': ' + this.fieldPath.join('.');
    }
}
exports.BorshError = BorshError;
/// Binary encoder.
class BinaryWriter {
    constructor() {
        this.buf = Buffer.alloc(INITIAL_LENGTH);
        this.length = 0;
    }
    maybeResize() {
        if (this.buf.length < 16 + this.length) {
            this.buf = Buffer.concat([this.buf, Buffer.alloc(INITIAL_LENGTH)]);
        }
    }
    writeU8(value) {
        this.maybeResize();
        this.buf.writeUInt8(value, this.length);
        this.length += 1;
    }
    writeU16(value) {
        this.maybeResize();
        this.buf.writeUInt16LE(value, this.length);
        this.length += 2;
    }
    writeU32(value) {
        this.maybeResize();
        this.buf.writeUInt32LE(value, this.length);
        this.length += 4;
    }
    writeU64(value) {
        this.maybeResize();
        this.writeBuffer(Buffer.from(new bn_js_1.default(value).toArray('le', 8)));
    }
    writeU128(value) {
        this.maybeResize();
        this.writeBuffer(Buffer.from(new bn_js_1.default(value).toArray('le', 16)));
    }
    writeU256(value) {
        this.maybeResize();
        this.writeBuffer(Buffer.from(new bn_js_1.default(value).toArray('le', 32)));
    }
    writeU512(value) {
        this.maybeResize();
        this.writeBuffer(Buffer.from(new bn_js_1.default(value).toArray('le', 64)));
    }
    writeBuffer(buffer) {
        // Buffer.from is needed as this.buf.subarray can return plain Uint8Array in browser
        this.buf = Buffer.concat([Buffer.from(this.buf.subarray(0, this.length)), buffer, Buffer.alloc(INITIAL_LENGTH)]);
        this.length += buffer.length;
    }
    writeString(str) {
        this.maybeResize();
        const b = Buffer.from(str, 'utf8');
        this.writeU32(b.length);
        this.writeBuffer(b);
    }
    writeFixedArray(array) {
        this.writeBuffer(Buffer.from(array));
    }
    writeArray(array, fn) {
        this.maybeResize();
        this.writeU32(array.length);
        for (const elem of array) {
            this.maybeResize();
            fn(elem);
        }
    }
    toArray() {
        return this.buf.subarray(0, this.length);
    }
}
exports.BinaryWriter = BinaryWriter;
function handlingRangeError(target, propertyKey, propertyDescriptor) {
    const originalMethod = propertyDescriptor.value;
    propertyDescriptor.value = function (...args) {
        try {
            return originalMethod.apply(this, args);
        }
        catch (e) {
            if (e instanceof RangeError) {
                const code = e.code;
                if (['ERR_BUFFER_OUT_OF_BOUNDS', 'ERR_OUT_OF_RANGE'].indexOf(code) >= 0) {
                    throw new BorshError('Reached the end of buffer when deserializing');
                }
            }
            throw e;
        }
    };
}
class BinaryReader {
    constructor(buf) {
        this.buf = buf;
        this.offset = 0;
    }
    readU8() {
        const value = this.buf.readUInt8(this.offset);
        this.offset += 1;
        return value;
    }
    readU16() {
        const value = this.buf.readUInt16LE(this.offset);
        this.offset += 2;
        return value;
    }
    readU32() {
        const value = this.buf.readUInt32LE(this.offset);
        this.offset += 4;
        return value;
    }
    readU64() {
        const buf = this.readBuffer(8);
        return new bn_js_1.default(buf, 'le');
    }
    readU128() {
        const buf = this.readBuffer(16);
        return new bn_js_1.default(buf, 'le');
    }
    readU256() {
        const buf = this.readBuffer(32);
        return new bn_js_1.default(buf, 'le');
    }
    readU512() {
        const buf = this.readBuffer(64);
        return new bn_js_1.default(buf, 'le');
    }
    readBuffer(len) {
        if ((this.offset + len) > this.buf.length) {
            throw new BorshError(`Expected buffer length ${len} isn't within bounds`);
        }
        const result = this.buf.slice(this.offset, this.offset + len);
        this.offset += len;
        return result;
    }
    readString() {
        const len = this.readU32();
        const buf = this.readBuffer(len);
        try {
            // NOTE: Using TextDecoder to fail on invalid UTF-8
            return textDecoder.decode(buf);
        }
        catch (e) {
            throw new BorshError(`Error decoding UTF-8 string: ${e}`);
        }
    }
    readFixedArray(len) {
        return new Uint8Array(this.readBuffer(len));
    }
    readArray(fn) {
        const len = this.readU32();
        const result = Array();
        for (let i = 0; i < len; ++i) {
            result.push(fn());
        }
        return result;
    }
}
__decorate([
    handlingRangeError
], BinaryReader.prototype, "readU8", null);
__decorate([
    handlingRangeError
], BinaryReader.prototype, "readU16", null);
__decorate([
    handlingRangeError
], BinaryReader.prototype, "readU32", null);
__decorate([
    handlingRangeError
], BinaryReader.prototype, "readU64", null);
__decorate([
    handlingRangeError
], BinaryReader.prototype, "readU128", null);
__decorate([
    handlingRangeError
], BinaryReader.prototype, "readU256", null);
__decorate([
    handlingRangeError
], BinaryReader.prototype, "readU512", null);
__decorate([
    handlingRangeError
], BinaryReader.prototype, "readString", null);
__decorate([
    handlingRangeError
], BinaryReader.prototype, "readFixedArray", null);
__decorate([
    handlingRangeError
], BinaryReader.prototype, "readArray", null);
exports.BinaryReader = BinaryReader;
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function serializeField(schema, fieldName, value, fieldType, writer) {
    try {
        // TODO: Handle missing values properly (make sure they never result in just skipped write)
        if (typeof fieldType === 'string') {
            writer[`write${capitalizeFirstLetter(fieldType)}`](value);
        }
        else if (fieldType instanceof Array) {
            if (typeof fieldType[0] === 'number') {
                if (value.length !== fieldType[0]) {
                    throw new BorshError(`Expecting byte array of length ${fieldType[0]}, but got ${value.length} bytes`);
                }
                writer.writeFixedArray(value);
            }
            else {
                writer.writeArray(value, (item) => { serializeField(schema, fieldName, item, fieldType[0], writer); });
            }
        }
        else if (fieldType.kind !== undefined) {
            switch (fieldType.kind) {
                case 'option': {
                    if (value === null || value === undefined) {
                        writer.writeU8(0);
                    }
                    else {
                        writer.writeU8(1);
                        serializeField(schema, fieldName, value, fieldType.type, writer);
                    }
                    break;
                }
                default: throw new BorshError(`FieldType ${fieldType} unrecognized`);
            }
        }
        else {
            serializeStruct(schema, value, writer);
        }
    }
    catch (error) {
        if (error instanceof BorshError) {
            error.addToFieldPath(fieldName);
        }
        throw error;
    }
}
function serializeStruct(schema, obj, writer) {
    const structSchema = schema.get(obj.constructor);
    if (!structSchema) {
        throw new BorshError(`Class ${obj.constructor.name} is missing in schema`);
    }
    if (structSchema.kind === 'struct') {
        structSchema.fields.map(([fieldName, fieldType]) => {
            serializeField(schema, fieldName, obj[fieldName], fieldType, writer);
        });
    }
    else if (structSchema.kind === 'enum') {
        const name = obj[structSchema.field];
        for (let idx = 0; idx < structSchema.values.length; ++idx) {
            const [fieldName, fieldType] = structSchema.values[idx];
            if (fieldName === name) {
                writer.writeU8(idx);
                serializeField(schema, fieldName, obj[fieldName], fieldType, writer);
                break;
            }
        }
    }
    else {
        throw new BorshError(`Unexpected schema kind: ${structSchema.kind} for ${obj.constructor.name}`);
    }
}
/// Serialize given object using schema of the form:
/// { class_name -> [ [field_name, field_type], .. ], .. }
function serialize(schema, obj) {
    const writer = new BinaryWriter();
    serializeStruct(schema, obj, writer);
    return writer.toArray();
}
exports.serialize = serialize;
function deserializeField(schema, fieldName, fieldType, reader) {
    try {
        if (typeof fieldType === 'string') {
            return reader[`read${capitalizeFirstLetter(fieldType)}`]();
        }
        if (fieldType instanceof Array) {
            if (typeof fieldType[0] === 'number') {
                return reader.readFixedArray(fieldType[0]);
            }
            return reader.readArray(() => deserializeField(schema, fieldName, fieldType[0], reader));
        }
        if (fieldType.kind === 'option') {
            const option = reader.readU8();
            if (option) {
                return deserializeField(schema, fieldName, fieldType.type, reader);
            }
            return undefined;
        }
        return deserializeStruct(schema, fieldType, reader);
    }
    catch (error) {
        if (error instanceof BorshError) {
            error.addToFieldPath(fieldName);
        }
        throw error;
    }
}
function deserializeStruct(schema, classType, reader) {
    const structSchema = schema.get(classType);
    if (!structSchema) {
        throw new BorshError(`Class ${classType.name} is missing in schema`);
    }
    if (structSchema.kind === 'struct') {
        const result = {};
        for (const [fieldName, fieldType] of schema.get(classType).fields) {
            result[fieldName] = deserializeField(schema, fieldName, fieldType, reader);
        }
        return new classType(result);
    }
    if (structSchema.kind === 'enum') {
        const idx = reader.readU8();
        if (idx >= structSchema.values.length) {
            throw new BorshError(`Enum index: ${idx} is out of range`);
        }
        const [fieldName, fieldType] = structSchema.values[idx];
        const fieldValue = deserializeField(schema, fieldName, fieldType, reader);
        return new classType({ [fieldName]: fieldValue });
    }
    throw new BorshError(`Unexpected schema kind: ${structSchema.kind} for ${classType.constructor.name}`);
}
/// Deserializes object from bytes using schema.
function deserialize(schema, classType, buffer) {
    const reader = new BinaryReader(buffer);
    const result = deserializeStruct(schema, classType, reader);
    if (reader.offset < buffer.length) {
        throw new BorshError(`Unexpected ${buffer.length - reader.offset} bytes after deserialized data`);
    }
    return result;
}
exports.deserialize = deserialize;
/// Deserializes object from bytes using schema, without checking the length read
function deserializeUnchecked(schema, classType, buffer) {
    const reader = new BinaryReader(buffer);
    return deserializeStruct(schema, classType, reader);
}
exports.deserializeUnchecked = deserializeUnchecked;

},{"bn.js":"../node_modules/near-api-js/node_modules/bn.js/lib/bn.js","bs58":"../node_modules/bs58/index.js","text-encoding-utf-8":"../node_modules/text-encoding-utf-8/lib/encoding.lib.js","buffer":"../node_modules/node-libs-browser/node_modules/buffer/index.js"}],"../node_modules/near-api-js/lib/utils/serialize.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var borsh_1 = require("borsh");
Object.defineProperty(exports, "base_encode", { enumerable: true, get: function () { return borsh_1.baseEncode; } });
Object.defineProperty(exports, "base_decode", { enumerable: true, get: function () { return borsh_1.baseDecode; } });
Object.defineProperty(exports, "serialize", { enumerable: true, get: function () { return borsh_1.serialize; } });
Object.defineProperty(exports, "deserialize", { enumerable: true, get: function () { return borsh_1.deserialize; } });
Object.defineProperty(exports, "BorshError", { enumerable: true, get: function () { return borsh_1.BorshError; } });
Object.defineProperty(exports, "BinaryWriter", { enumerable: true, get: function () { return borsh_1.BinaryWriter; } });
Object.defineProperty(exports, "BinaryReader", { enumerable: true, get: function () { return borsh_1.BinaryReader; } });

},{"borsh":"../node_modules/near-api-js/node_modules/borsh/lib/index.js"}],"../node_modules/near-api-js/lib/utils/enums.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Assignable = exports.Enum = void 0;
/** @hidden @module */
class Enum {
    constructor(properties) {
        if (Object.keys(properties).length !== 1) {
            throw new Error('Enum can only take single value');
        }
        Object.keys(properties).map((key) => {
            this[key] = properties[key];
            this.enum = key;
        });
    }
}
exports.Enum = Enum;
class Assignable {
    constructor(properties) {
        Object.keys(properties).map((key) => {
            this[key] = properties[key];
        });
    }
}
exports.Assignable = Assignable;

},{}],"../node_modules/near-api-js/lib/utils/key_pair.js":[function(require,module,exports) {
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyPairEd25519 = exports.KeyPair = exports.PublicKey = exports.KeyType = void 0;
const tweetnacl_1 = __importDefault(require("tweetnacl"));
const serialize_1 = require("./serialize");
const enums_1 = require("./enums");
/** All supported key types */
var KeyType;
(function (KeyType) {
    KeyType[KeyType["ED25519"] = 0] = "ED25519";
})(KeyType = exports.KeyType || (exports.KeyType = {}));
function key_type_to_str(keyType) {
    switch (keyType) {
        case KeyType.ED25519: return 'ed25519';
        default: throw new Error(`Unknown key type ${keyType}`);
    }
}
function str_to_key_type(keyType) {
    switch (keyType.toLowerCase()) {
        case 'ed25519': return KeyType.ED25519;
        default: throw new Error(`Unknown key type ${keyType}`);
    }
}
/**
 * PublicKey representation that has type and bytes of the key.
 */
class PublicKey extends enums_1.Assignable {
    static from(value) {
        if (typeof value === 'string') {
            return PublicKey.fromString(value);
        }
        return value;
    }
    static fromString(encodedKey) {
        const parts = encodedKey.split(':');
        if (parts.length === 1) {
            return new PublicKey({ keyType: KeyType.ED25519, data: serialize_1.base_decode(parts[0]) });
        }
        else if (parts.length === 2) {
            return new PublicKey({ keyType: str_to_key_type(parts[0]), data: serialize_1.base_decode(parts[1]) });
        }
        else {
            throw new Error('Invalid encoded key format, must be <curve>:<encoded key>');
        }
    }
    toString() {
        return `${key_type_to_str(this.keyType)}:${serialize_1.base_encode(this.data)}`;
    }
}
exports.PublicKey = PublicKey;
class KeyPair {
    /**
     * @param curve Name of elliptical curve, case-insensitive
     * @returns Random KeyPair based on the curve
     */
    static fromRandom(curve) {
        switch (curve.toUpperCase()) {
            case 'ED25519': return KeyPairEd25519.fromRandom();
            default: throw new Error(`Unknown curve ${curve}`);
        }
    }
    static fromString(encodedKey) {
        const parts = encodedKey.split(':');
        if (parts.length === 1) {
            return new KeyPairEd25519(parts[0]);
        }
        else if (parts.length === 2) {
            switch (parts[0].toUpperCase()) {
                case 'ED25519': return new KeyPairEd25519(parts[1]);
                default: throw new Error(`Unknown curve: ${parts[0]}`);
            }
        }
        else {
            throw new Error('Invalid encoded key format, must be <curve>:<encoded key>');
        }
    }
}
exports.KeyPair = KeyPair;
/**
 * This class provides key pair functionality for Ed25519 curve:
 * generating key pairs, encoding key pairs, signing and verifying.
 */
class KeyPairEd25519 extends KeyPair {
    /**
     * Construct an instance of key pair given a secret key.
     * It's generally assumed that these are encoded in base58.
     * @param {string} secretKey
     */
    constructor(secretKey) {
        super();
        const keyPair = tweetnacl_1.default.sign.keyPair.fromSecretKey(serialize_1.base_decode(secretKey));
        this.publicKey = new PublicKey({ keyType: KeyType.ED25519, data: keyPair.publicKey });
        this.secretKey = secretKey;
    }
    /**
     * Generate a new random keypair.
     * @example
     * const keyRandom = KeyPair.fromRandom();
     * keyRandom.publicKey
     * // returns [PUBLIC_KEY]
     *
     * keyRandom.secretKey
     * // returns [SECRET_KEY]
     */
    static fromRandom() {
        const newKeyPair = tweetnacl_1.default.sign.keyPair();
        return new KeyPairEd25519(serialize_1.base_encode(newKeyPair.secretKey));
    }
    sign(message) {
        const signature = tweetnacl_1.default.sign.detached(message, serialize_1.base_decode(this.secretKey));
        return { signature, publicKey: this.publicKey };
    }
    verify(message, signature) {
        return tweetnacl_1.default.sign.detached.verify(message, signature, this.publicKey.data);
    }
    toString() {
        return `ed25519:${this.secretKey}`;
    }
    getPublicKey() {
        return this.publicKey;
    }
}
exports.KeyPairEd25519 = KeyPairEd25519;

},{"tweetnacl":"../node_modules/tweetnacl/nacl-fast.js","./serialize":"../node_modules/near-api-js/lib/utils/serialize.js","./enums":"../node_modules/near-api-js/lib/utils/enums.js"}],"../node_modules/near-api-js/lib/key_stores/in_memory_key_store.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryKeyStore = void 0;
const keystore_1 = require("./keystore");
const key_pair_1 = require("../utils/key_pair");
/**
 * Simple in-memory keystore for mainly for testing purposes.
 *
 * @example {@link https://docs.near.org/docs/develop/front-end/naj-quick-reference#key-store}
 * @example
 * ```js
 * import { connect, keyStores, utils } from 'near-api-js';
 *
 * const privateKey = '.......';
 * const keyPair = utils.KeyPair.fromString(privateKey);
 *
 * const keyStore = new keyStores.InMemoryKeyStore();
 * keyStore.setKey('testnet', 'example-account.testnet', keyPair);
 *
 * const config = {
 *   keyStore, // instance of InMemoryKeyStore
 *   networkId: 'testnet',
 *   nodeUrl: 'https://rpc.testnet.near.org',
 *   walletUrl: 'https://wallet.testnet.near.org',
 *   helperUrl: 'https://helper.testnet.near.org',
 *   explorerUrl: 'https://explorer.testnet.near.org'
 * };
 *
 * // inside an async function
 * const near = await connect(config)
 * ```
 */
class InMemoryKeyStore extends keystore_1.KeyStore {
    constructor() {
        super();
        this.keys = {};
    }
    /**
     * Stores a {@KeyPair} in in-memory storage item
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @param accountId The NEAR account tied to the key pair
     * @param keyPair The key pair to store in local storage
     */
    async setKey(networkId, accountId, keyPair) {
        this.keys[`${accountId}:${networkId}`] = keyPair.toString();
    }
    /**
     * Gets a {@link KeyPair} from in-memory storage
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @param accountId The NEAR account tied to the key pair
     * @returns {Promise<KeyPair>}
     */
    async getKey(networkId, accountId) {
        const value = this.keys[`${accountId}:${networkId}`];
        if (!value) {
            return null;
        }
        return key_pair_1.KeyPair.fromString(value);
    }
    /**
     * Removes a {@link KeyPair} from in-memory storage
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @param accountId The NEAR account tied to the key pair
     */
    async removeKey(networkId, accountId) {
        delete this.keys[`${accountId}:${networkId}`];
    }
    /**
     * Removes all {@link KeyPairs} from in-memory storage
     */
    async clear() {
        this.keys = {};
    }
    /**
     * Get the network(s) from in-memory storage
     * @returns {Promise<string[]>}
     */
    async getNetworks() {
        const result = new Set();
        Object.keys(this.keys).forEach((key) => {
            const parts = key.split(':');
            result.add(parts[1]);
        });
        return Array.from(result.values());
    }
    /**
     * Gets the account(s) from in-memory storage
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @returns{Promise<string[]>}
     */
    async getAccounts(networkId) {
        const result = new Array();
        Object.keys(this.keys).forEach((key) => {
            const parts = key.split(':');
            if (parts[parts.length - 1] === networkId) {
                result.push(parts.slice(0, parts.length - 1).join(':'));
            }
        });
        return result;
    }
    /** @hidden */
    toString() {
        return 'InMemoryKeyStore';
    }
}
exports.InMemoryKeyStore = InMemoryKeyStore;

},{"./keystore":"../node_modules/near-api-js/lib/key_stores/keystore.js","../utils/key_pair":"../node_modules/near-api-js/lib/utils/key_pair.js"}],"../node_modules/near-api-js/lib/key_stores/browser_local_storage_key_store.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserLocalStorageKeyStore = void 0;
const keystore_1 = require("./keystore");
const key_pair_1 = require("../utils/key_pair");
const LOCAL_STORAGE_KEY_PREFIX = 'near-api-js:keystore:';
/**
 * This class is used to store keys in the browsers local storage.
 *
 * @example {@link https://docs.near.org/docs/develop/front-end/naj-quick-reference#key-store}
 * @example
 * ```js
 * import { connect, keyStores } from 'near-api-js';
 *
 * const keyStore = new keyStores.BrowserLocalStorageKeyStore();
 * const config = {
 *   keyStore, // instance of BrowserLocalStorageKeyStore
 *   networkId: 'testnet',
 *   nodeUrl: 'https://rpc.testnet.near.org',
 *   walletUrl: 'https://wallet.testnet.near.org',
 *   helperUrl: 'https://helper.testnet.near.org',
 *   explorerUrl: 'https://explorer.testnet.near.org'
 * };
 *
 * // inside an async function
 * const near = await connect(config)
 * ```
 */
class BrowserLocalStorageKeyStore extends keystore_1.KeyStore {
    /**
     * @param localStorage defaults to window.localStorage
     * @param prefix defaults to `near-api-js:keystore:`
     */
    constructor(localStorage = window.localStorage, prefix = LOCAL_STORAGE_KEY_PREFIX) {
        super();
        this.localStorage = localStorage;
        this.prefix = prefix;
    }
    /**
     * Stores a {@link KeyPair} in local storage.
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @param accountId The NEAR account tied to the key pair
     * @param keyPair The key pair to store in local storage
     */
    async setKey(networkId, accountId, keyPair) {
        this.localStorage.setItem(this.storageKeyForSecretKey(networkId, accountId), keyPair.toString());
    }
    /**
     * Gets a {@link KeyPair} from local storage
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @param accountId The NEAR account tied to the key pair
     * @returns {Promise<KeyPair>}
     */
    async getKey(networkId, accountId) {
        const value = this.localStorage.getItem(this.storageKeyForSecretKey(networkId, accountId));
        if (!value) {
            return null;
        }
        return key_pair_1.KeyPair.fromString(value);
    }
    /**
     * Removes a {@link KeyPair} from local storage
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @param accountId The NEAR account tied to the key pair
     */
    async removeKey(networkId, accountId) {
        this.localStorage.removeItem(this.storageKeyForSecretKey(networkId, accountId));
    }
    /**
     * Removes all items that start with `prefix` from local storage
     */
    async clear() {
        for (const key of this.storageKeys()) {
            if (key.startsWith(this.prefix)) {
                this.localStorage.removeItem(key);
            }
        }
    }
    /**
     * Get the network(s) from local storage
     * @returns {Promise<string[]>}
     */
    async getNetworks() {
        const result = new Set();
        for (const key of this.storageKeys()) {
            if (key.startsWith(this.prefix)) {
                const parts = key.substring(this.prefix.length).split(':');
                result.add(parts[1]);
            }
        }
        return Array.from(result.values());
    }
    /**
     * Gets the account(s) from local storage
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @returns{Promise<string[]>}
     */
    async getAccounts(networkId) {
        const result = new Array();
        for (const key of this.storageKeys()) {
            if (key.startsWith(this.prefix)) {
                const parts = key.substring(this.prefix.length).split(':');
                if (parts[1] === networkId) {
                    result.push(parts[0]);
                }
            }
        }
        return result;
    }
    /**
     * @hidden
     * Helper function to retrieve a local storage key
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @param accountId The NEAR account tied to the storage keythat's sought
     * @returns {string} An example might be: `near-api-js:keystore:near-friend:default`
     */
    storageKeyForSecretKey(networkId, accountId) {
        return `${this.prefix}${accountId}:${networkId}`;
    }
    /** @hidden */
    *storageKeys() {
        for (let i = 0; i < this.localStorage.length; i++) {
            yield this.localStorage.key(i);
        }
    }
}
exports.BrowserLocalStorageKeyStore = BrowserLocalStorageKeyStore;

},{"./keystore":"../node_modules/near-api-js/lib/key_stores/keystore.js","../utils/key_pair":"../node_modules/near-api-js/lib/utils/key_pair.js"}],"../node_modules/near-api-js/lib/key_stores/merge_key_store.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MergeKeyStore = void 0;
const keystore_1 = require("./keystore");
class MergeKeyStore extends keystore_1.KeyStore {
    /**
     * @param keyStores read calls are attempted from start to end of array
     * @param options.writeKeyStoreIndex the keystore index that will receive all write calls
     */
    constructor(keyStores, options = { writeKeyStoreIndex: 0 }) {
        super();
        this.options = options;
        this.keyStores = keyStores;
    }
    /**
     * Store a {@link KeyPain} to the first index of a key store array
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @param accountId The NEAR account tied to the key pair
     * @param keyPair The key pair to store in local storage
     */
    async setKey(networkId, accountId, keyPair) {
        await this.keyStores[this.options.writeKeyStoreIndex].setKey(networkId, accountId, keyPair);
    }
    /**
     * Gets a {@link KeyPair} from the array of key stores
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @param accountId The NEAR account tied to the key pair
     * @returns {Promise<KeyPair>}
     */
    async getKey(networkId, accountId) {
        for (const keyStore of this.keyStores) {
            const keyPair = await keyStore.getKey(networkId, accountId);
            if (keyPair) {
                return keyPair;
            }
        }
        return null;
    }
    /**
     * Removes a {@link KeyPair} from the array of key stores
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @param accountId The NEAR account tied to the key pair
     */
    async removeKey(networkId, accountId) {
        for (const keyStore of this.keyStores) {
            await keyStore.removeKey(networkId, accountId);
        }
    }
    /**
     * Removes all items from each key store
     */
    async clear() {
        for (const keyStore of this.keyStores) {
            await keyStore.clear();
        }
    }
    /**
     * Get the network(s) from the array of key stores
     * @returns {Promise<string[]>}
     */
    async getNetworks() {
        const result = new Set();
        for (const keyStore of this.keyStores) {
            for (const network of await keyStore.getNetworks()) {
                result.add(network);
            }
        }
        return Array.from(result);
    }
    /**
     * Gets the account(s) from the array of key stores
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @returns{Promise<string[]>}
     */
    async getAccounts(networkId) {
        const result = new Set();
        for (const keyStore of this.keyStores) {
            for (const account of await keyStore.getAccounts(networkId)) {
                result.add(account);
            }
        }
        return Array.from(result);
    }
    /** @hidden */
    toString() {
        return `MergeKeyStore(${this.keyStores.join(', ')})`;
    }
}
exports.MergeKeyStore = MergeKeyStore;

},{"./keystore":"../node_modules/near-api-js/lib/key_stores/keystore.js"}],"../node_modules/near-api-js/lib/key_stores/browser-index.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MergeKeyStore = exports.BrowserLocalStorageKeyStore = exports.InMemoryKeyStore = exports.KeyStore = void 0;
/** @hidden @module */
const keystore_1 = require("./keystore");
Object.defineProperty(exports, "KeyStore", { enumerable: true, get: function () { return keystore_1.KeyStore; } });
const in_memory_key_store_1 = require("./in_memory_key_store");
Object.defineProperty(exports, "InMemoryKeyStore", { enumerable: true, get: function () { return in_memory_key_store_1.InMemoryKeyStore; } });
const browser_local_storage_key_store_1 = require("./browser_local_storage_key_store");
Object.defineProperty(exports, "BrowserLocalStorageKeyStore", { enumerable: true, get: function () { return browser_local_storage_key_store_1.BrowserLocalStorageKeyStore; } });
const merge_key_store_1 = require("./merge_key_store");
Object.defineProperty(exports, "MergeKeyStore", { enumerable: true, get: function () { return merge_key_store_1.MergeKeyStore; } });

},{"./keystore":"../node_modules/near-api-js/lib/key_stores/keystore.js","./in_memory_key_store":"../node_modules/near-api-js/lib/key_stores/in_memory_key_store.js","./browser_local_storage_key_store":"../node_modules/near-api-js/lib/key_stores/browser_local_storage_key_store.js","./merge_key_store":"../node_modules/near-api-js/lib/key_stores/merge_key_store.js"}],"../node_modules/near-api-js/lib/providers/provider.js":[function(require,module,exports) {
var Buffer = require("buffer").Buffer;
"use strict";
/**
 * NEAR RPC API request types and responses
 * @module
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionLastResult = exports.Provider = exports.IdType = exports.FinalExecutionStatusBasic = exports.ExecutionStatusBasic = void 0;
var ExecutionStatusBasic;
(function (ExecutionStatusBasic) {
    ExecutionStatusBasic["Unknown"] = "Unknown";
    ExecutionStatusBasic["Pending"] = "Pending";
    ExecutionStatusBasic["Failure"] = "Failure";
})(ExecutionStatusBasic = exports.ExecutionStatusBasic || (exports.ExecutionStatusBasic = {}));
var FinalExecutionStatusBasic;
(function (FinalExecutionStatusBasic) {
    FinalExecutionStatusBasic["NotStarted"] = "NotStarted";
    FinalExecutionStatusBasic["Started"] = "Started";
    FinalExecutionStatusBasic["Failure"] = "Failure";
})(FinalExecutionStatusBasic = exports.FinalExecutionStatusBasic || (exports.FinalExecutionStatusBasic = {}));
var IdType;
(function (IdType) {
    IdType["Transaction"] = "transaction";
    IdType["Receipt"] = "receipt";
})(IdType = exports.IdType || (exports.IdType = {}));
/** @hidden */
class Provider {
}
exports.Provider = Provider;
/** @hidden */
function getTransactionLastResult(txResult) {
    if (typeof txResult.status === 'object' && typeof txResult.status.SuccessValue === 'string') {
        const value = Buffer.from(txResult.status.SuccessValue, 'base64').toString();
        try {
            return JSON.parse(value);
        }
        catch (e) {
            return value;
        }
    }
    return null;
}
exports.getTransactionLastResult = getTransactionLastResult;

},{"buffer":"../node_modules/node-libs-browser/node_modules/buffer/index.js"}],"../node_modules/near-api-js/node_modules/depd/lib/browser/index.js":[function(require,module,exports) {
/*!
 * depd
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */
'use strict';
/**
 * Module exports.
 * @public
 */

module.exports = depd;
/**
 * Create deprecate for namespace in caller.
 */

function depd(namespace) {
  if (!namespace) {
    throw new TypeError('argument namespace is required');
  }

  function deprecate(message) {// no-op in browser
  }

  deprecate._file = undefined;
  deprecate._ignored = true;
  deprecate._namespace = namespace;
  deprecate._traced = false;
  deprecate._warned = Object.create(null);
  deprecate.function = wrapfunction;
  deprecate.property = wrapproperty;
  return deprecate;
}
/**
 * Return a wrapped function in a deprecation message.
 *
 * This is a no-op version of the wrapper, which does nothing but call
 * validation.
 */


function wrapfunction(fn, message) {
  if (typeof fn !== 'function') {
    throw new TypeError('argument fn must be a function');
  }

  return fn;
}
/**
 * Wrap property in a deprecation message.
 *
 * This is a no-op version of the wrapper, which does nothing but call
 * validation.
 */


function wrapproperty(obj, prop, message) {
  if (!obj || typeof obj !== 'object' && typeof obj !== 'function') {
    throw new TypeError('argument obj must be object');
  }

  var descriptor = Object.getOwnPropertyDescriptor(obj, prop);

  if (!descriptor) {
    throw new TypeError('must call property on owner object');
  }

  if (!descriptor.configurable) {
    throw new TypeError('property must be configurable');
  }
}
},{}],"../node_modules/depd/lib/browser/index.js":[function(require,module,exports) {
/*!
 * depd
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */
'use strict';
/**
 * Module exports.
 * @public
 */

module.exports = depd;
/**
 * Create deprecate for namespace in caller.
 */

function depd(namespace) {
  if (!namespace) {
    throw new TypeError('argument namespace is required');
  }

  function deprecate(message) {// no-op in browser
  }

  deprecate._file = undefined;
  deprecate._ignored = true;
  deprecate._namespace = namespace;
  deprecate._traced = false;
  deprecate._warned = Object.create(null);
  deprecate.function = wrapfunction;
  deprecate.property = wrapproperty;
  return deprecate;
}
/**
 * Return a wrapped function in a deprecation message.
 *
 * This is a no-op version of the wrapper, which does nothing but call
 * validation.
 */


function wrapfunction(fn, message) {
  if (typeof fn !== 'function') {
    throw new TypeError('argument fn must be a function');
  }

  return fn;
}
/**
 * Wrap property in a deprecation message.
 *
 * This is a no-op version of the wrapper, which does nothing but call
 * validation.
 */


function wrapproperty(obj, prop, message) {
  if (!obj || typeof obj !== 'object' && typeof obj !== 'function') {
    throw new TypeError('argument obj must be object');
  }

  var descriptor = Object.getOwnPropertyDescriptor(obj, prop);

  if (!descriptor) {
    throw new TypeError('must call property on owner object');
  }

  if (!descriptor.configurable) {
    throw new TypeError('property must be configurable');
  }
}
},{}],"../node_modules/http-errors/node_modules/setprototypeof/index.js":[function(require,module,exports) {
'use strict'
/* eslint no-proto: 0 */
module.exports = Object.setPrototypeOf || ({ __proto__: [] } instanceof Array ? setProtoOf : mixinProperties)

function setProtoOf (obj, proto) {
  obj.__proto__ = proto
  return obj
}

function mixinProperties (obj, proto) {
  for (var prop in proto) {
    if (!Object.prototype.hasOwnProperty.call(obj, prop)) {
      obj[prop] = proto[prop]
    }
  }
  return obj
}

},{}],"../node_modules/statuses/codes.json":[function(require,module,exports) {
module.exports = {
  "100": "Continue",
  "101": "Switching Protocols",
  "102": "Processing",
  "103": "Early Hints",
  "200": "OK",
  "201": "Created",
  "202": "Accepted",
  "203": "Non-Authoritative Information",
  "204": "No Content",
  "205": "Reset Content",
  "206": "Partial Content",
  "207": "Multi-Status",
  "208": "Already Reported",
  "226": "IM Used",
  "300": "Multiple Choices",
  "301": "Moved Permanently",
  "302": "Found",
  "303": "See Other",
  "304": "Not Modified",
  "305": "Use Proxy",
  "306": "(Unused)",
  "307": "Temporary Redirect",
  "308": "Permanent Redirect",
  "400": "Bad Request",
  "401": "Unauthorized",
  "402": "Payment Required",
  "403": "Forbidden",
  "404": "Not Found",
  "405": "Method Not Allowed",
  "406": "Not Acceptable",
  "407": "Proxy Authentication Required",
  "408": "Request Timeout",
  "409": "Conflict",
  "410": "Gone",
  "411": "Length Required",
  "412": "Precondition Failed",
  "413": "Payload Too Large",
  "414": "URI Too Long",
  "415": "Unsupported Media Type",
  "416": "Range Not Satisfiable",
  "417": "Expectation Failed",
  "418": "I'm a teapot",
  "421": "Misdirected Request",
  "422": "Unprocessable Entity",
  "423": "Locked",
  "424": "Failed Dependency",
  "425": "Unordered Collection",
  "426": "Upgrade Required",
  "428": "Precondition Required",
  "429": "Too Many Requests",
  "431": "Request Header Fields Too Large",
  "451": "Unavailable For Legal Reasons",
  "500": "Internal Server Error",
  "501": "Not Implemented",
  "502": "Bad Gateway",
  "503": "Service Unavailable",
  "504": "Gateway Timeout",
  "505": "HTTP Version Not Supported",
  "506": "Variant Also Negotiates",
  "507": "Insufficient Storage",
  "508": "Loop Detected",
  "509": "Bandwidth Limit Exceeded",
  "510": "Not Extended",
  "511": "Network Authentication Required"
};
},{}],"../node_modules/statuses/index.js":[function(require,module,exports) {
/*!
 * statuses
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2016 Douglas Christopher Wilson
 * MIT Licensed
 */
'use strict';
/**
 * Module dependencies.
 * @private
 */

var codes = require('./codes.json');
/**
 * Module exports.
 * @public
 */


module.exports = status; // status code to message map

status.STATUS_CODES = codes; // array of status codes

status.codes = populateStatusesMap(status, codes); // status codes for redirects

status.redirect = {
  300: true,
  301: true,
  302: true,
  303: true,
  305: true,
  307: true,
  308: true
}; // status codes for empty bodies

status.empty = {
  204: true,
  205: true,
  304: true
}; // status codes for when you should retry the request

status.retry = {
  502: true,
  503: true,
  504: true
};
/**
 * Populate the statuses map for given codes.
 * @private
 */

function populateStatusesMap(statuses, codes) {
  var arr = [];
  Object.keys(codes).forEach(function forEachCode(code) {
    var message = codes[code];
    var status = Number(code); // Populate properties

    statuses[status] = message;
    statuses[message] = status;
    statuses[message.toLowerCase()] = status; // Add to array

    arr.push(status);
  });
  return arr;
}
/**
 * Get the status code.
 *
 * Given a number, this will throw if it is not a known status
 * code, otherwise the code will be returned. Given a string,
 * the string will be parsed for a number and return the code
 * if valid, otherwise will lookup the code assuming this is
 * the status message.
 *
 * @param {string|number} code
 * @returns {number}
 * @public
 */


function status(code) {
  if (typeof code === 'number') {
    if (!status[code]) throw new Error('invalid status code: ' + code);
    return code;
  }

  if (typeof code !== 'string') {
    throw new TypeError('code must be a number or string');
  } // '403'


  var n = parseInt(code, 10);

  if (!isNaN(n)) {
    if (!status[n]) throw new Error('invalid status code: ' + n);
    return n;
  }

  n = status[code.toLowerCase()];
  if (!n) throw new Error('invalid status message: "' + code + '"');
  return n;
}
},{"./codes.json":"../node_modules/statuses/codes.json"}],"../node_modules/inherits/inherits_browser.js":[function(require,module,exports) {
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      })
    }
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      var TempCtor = function () {}
      TempCtor.prototype = superCtor.prototype
      ctor.prototype = new TempCtor()
      ctor.prototype.constructor = ctor
    }
  }
}

},{}],"../node_modules/toidentifier/index.js":[function(require,module,exports) {
/*!
 * toidentifier
 * Copyright(c) 2016 Douglas Christopher Wilson
 * MIT Licensed
 */

/**
 * Module exports.
 * @public
 */
module.exports = toIdentifier;
/**
 * Trasform the given string into a JavaScript identifier
 *
 * @param {string} str
 * @returns {string}
 * @public
 */

function toIdentifier(str) {
  return str.split(' ').map(function (token) {
    return token.slice(0, 1).toUpperCase() + token.slice(1);
  }).join('').replace(/[^ _0-9a-z]/gi, '');
}
},{}],"../node_modules/http-errors/index.js":[function(require,module,exports) {
/*!
 * http-errors
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2016 Douglas Christopher Wilson
 * MIT Licensed
 */
'use strict';
/**
 * Module dependencies.
 * @private
 */

var deprecate = require('depd')('http-errors');

var setPrototypeOf = require('setprototypeof');

var statuses = require('statuses');

var inherits = require('inherits');

var toIdentifier = require('toidentifier');
/**
 * Module exports.
 * @public
 */


module.exports = createError;
module.exports.HttpError = createHttpErrorConstructor();
module.exports.isHttpError = createIsHttpErrorFunction(module.exports.HttpError); // Populate exports for all constructors

populateConstructorExports(module.exports, statuses.codes, module.exports.HttpError);
/**
 * Get the code class of a status code.
 * @private
 */

function codeClass(status) {
  return Number(String(status).charAt(0) + '00');
}
/**
 * Create a new HTTP Error.
 *
 * @returns {Error}
 * @public
 */


function createError() {
  // so much arity going on ~_~
  var err;
  var msg;
  var status = 500;
  var props = {};

  for (var i = 0; i < arguments.length; i++) {
    var arg = arguments[i];

    if (arg instanceof Error) {
      err = arg;
      status = err.status || err.statusCode || status;
      continue;
    }

    switch (typeof arg) {
      case 'string':
        msg = arg;
        break;

      case 'number':
        status = arg;

        if (i !== 0) {
          deprecate('non-first-argument status code; replace with createError(' + arg + ', ...)');
        }

        break;

      case 'object':
        props = arg;
        break;
    }
  }

  if (typeof status === 'number' && (status < 400 || status >= 600)) {
    deprecate('non-error status code; use only 4xx or 5xx status codes');
  }

  if (typeof status !== 'number' || !statuses[status] && (status < 400 || status >= 600)) {
    status = 500;
  } // constructor


  var HttpError = createError[status] || createError[codeClass(status)];

  if (!err) {
    // create error
    err = HttpError ? new HttpError(msg) : new Error(msg || statuses[status]);
    Error.captureStackTrace(err, createError);
  }

  if (!HttpError || !(err instanceof HttpError) || err.status !== status) {
    // add properties to generic error
    err.expose = status < 500;
    err.status = err.statusCode = status;
  }

  for (var key in props) {
    if (key !== 'status' && key !== 'statusCode') {
      err[key] = props[key];
    }
  }

  return err;
}
/**
 * Create HTTP error abstract base class.
 * @private
 */


function createHttpErrorConstructor() {
  function HttpError() {
    throw new TypeError('cannot construct abstract class');
  }

  inherits(HttpError, Error);
  return HttpError;
}
/**
 * Create a constructor for a client error.
 * @private
 */


function createClientErrorConstructor(HttpError, name, code) {
  var className = toClassName(name);

  function ClientError(message) {
    // create the error object
    var msg = message != null ? message : statuses[code];
    var err = new Error(msg); // capture a stack trace to the construction point

    Error.captureStackTrace(err, ClientError); // adjust the [[Prototype]]

    setPrototypeOf(err, ClientError.prototype); // redefine the error message

    Object.defineProperty(err, 'message', {
      enumerable: true,
      configurable: true,
      value: msg,
      writable: true
    }); // redefine the error name

    Object.defineProperty(err, 'name', {
      enumerable: false,
      configurable: true,
      value: className,
      writable: true
    });
    return err;
  }

  inherits(ClientError, HttpError);
  nameFunc(ClientError, className);
  ClientError.prototype.status = code;
  ClientError.prototype.statusCode = code;
  ClientError.prototype.expose = true;
  return ClientError;
}
/**
 * Create function to test is a value is a HttpError.
 * @private
 */


function createIsHttpErrorFunction(HttpError) {
  return function isHttpError(val) {
    if (!val || typeof val !== 'object') {
      return false;
    }

    if (val instanceof HttpError) {
      return true;
    }

    return val instanceof Error && typeof val.expose === 'boolean' && typeof val.statusCode === 'number' && val.status === val.statusCode;
  };
}
/**
 * Create a constructor for a server error.
 * @private
 */


function createServerErrorConstructor(HttpError, name, code) {
  var className = toClassName(name);

  function ServerError(message) {
    // create the error object
    var msg = message != null ? message : statuses[code];
    var err = new Error(msg); // capture a stack trace to the construction point

    Error.captureStackTrace(err, ServerError); // adjust the [[Prototype]]

    setPrototypeOf(err, ServerError.prototype); // redefine the error message

    Object.defineProperty(err, 'message', {
      enumerable: true,
      configurable: true,
      value: msg,
      writable: true
    }); // redefine the error name

    Object.defineProperty(err, 'name', {
      enumerable: false,
      configurable: true,
      value: className,
      writable: true
    });
    return err;
  }

  inherits(ServerError, HttpError);
  nameFunc(ServerError, className);
  ServerError.prototype.status = code;
  ServerError.prototype.statusCode = code;
  ServerError.prototype.expose = false;
  return ServerError;
}
/**
 * Set the name of a function, if possible.
 * @private
 */


function nameFunc(func, name) {
  var desc = Object.getOwnPropertyDescriptor(func, 'name');

  if (desc && desc.configurable) {
    desc.value = name;
    Object.defineProperty(func, 'name', desc);
  }
}
/**
 * Populate the exports object with constructors for every error class.
 * @private
 */


function populateConstructorExports(exports, codes, HttpError) {
  codes.forEach(function forEachCode(code) {
    var CodeError;
    var name = toIdentifier(statuses[code]);

    switch (codeClass(code)) {
      case 400:
        CodeError = createClientErrorConstructor(HttpError, name, code);
        break;

      case 500:
        CodeError = createServerErrorConstructor(HttpError, name, code);
        break;
    }

    if (CodeError) {
      // export the constructor
      exports[code] = CodeError;
      exports[name] = CodeError;
    }
  }); // backwards-compatibility

  exports["I'mateapot"] = deprecate.function(exports.ImATeapot, '"I\'mateapot"; use "ImATeapot" instead');
}
/**
 * Get a class name from a name identifier.
 * @private
 */


function toClassName(name) {
  return name.substr(-5) !== 'Error' ? name + 'Error' : name;
}
},{"depd":"../node_modules/depd/lib/browser/index.js","setprototypeof":"../node_modules/http-errors/node_modules/setprototypeof/index.js","statuses":"../node_modules/statuses/index.js","inherits":"../node_modules/inherits/inherits_browser.js","toidentifier":"../node_modules/toidentifier/index.js"}],"../node_modules/near-api-js/lib/utils/exponential-backoff.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function exponentialBackoff(startWaitTime, retryNumber, waitBackoff, getResult) {
    // TODO: jitter?
    let waitTime = startWaitTime;
    for (let i = 0; i < retryNumber; i++) {
        const result = await getResult();
        if (result) {
            return result;
        }
        await sleep(waitTime);
        waitTime *= waitBackoff;
    }
    return null;
}
exports.default = exponentialBackoff;
// Sleep given number of millis.
function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}

},{}],"../node_modules/near-api-js/lib/utils/web.js":[function(require,module,exports) {
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchJson = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const exponential_backoff_1 = __importDefault(require("./exponential-backoff"));
const providers_1 = require("../providers");
const START_WAIT_TIME_MS = 1000;
const BACKOFF_MULTIPLIER = 1.5;
const RETRY_NUMBER = 10;
async function fetchJson(connection, json) {
    let url = null;
    if (typeof (connection) === 'string') {
        url = connection;
    }
    else {
        url = connection.url;
    }
    const response = await exponential_backoff_1.default(START_WAIT_TIME_MS, RETRY_NUMBER, BACKOFF_MULTIPLIER, async () => {
        try {
            const response = await fetch(url, {
                method: json ? 'POST' : 'GET',
                body: json ? json : undefined,
                headers: { 'Content-Type': 'application/json; charset=utf-8' }
            });
            if (!response.ok) {
                if (response.status === 503) {
                    console.warn(`Retrying HTTP request for ${url} as it's not available now`);
                    return null;
                }
                throw http_errors_1.default(response.status, await response.text());
            }
            return response;
        }
        catch (error) {
            if (error.toString().includes('FetchError') || error.toString().includes('Failed to fetch')) {
                console.warn(`Retrying HTTP request for ${url} because of error: ${error}`);
                return null;
            }
            throw error;
        }
    });
    if (!response) {
        throw new providers_1.TypedError(`Exceeded ${RETRY_NUMBER} attempts for ${url}.`, 'RetriesExceeded');
    }
    return await response.json();
}
exports.fetchJson = fetchJson;

},{"http-errors":"../node_modules/http-errors/index.js","./exponential-backoff":"../node_modules/near-api-js/lib/utils/exponential-backoff.js","../providers":"../node_modules/near-api-js/lib/providers/index.js"}],"../node_modules/near-api-js/lib/utils/errors.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorContext = exports.TypedError = exports.ArgumentTypeError = exports.PositionalArgsError = void 0;
class PositionalArgsError extends Error {
    constructor() {
        super('Contract method calls expect named arguments wrapped in object, e.g. { argName1: argValue1, argName2: argValue2 }');
    }
}
exports.PositionalArgsError = PositionalArgsError;
class ArgumentTypeError extends Error {
    constructor(argName, argType, argValue) {
        super(`Expected ${argType} for '${argName}' argument, but got '${JSON.stringify(argValue)}'`);
    }
}
exports.ArgumentTypeError = ArgumentTypeError;
class TypedError extends Error {
    constructor(message, type, context) {
        super(message);
        this.type = type || 'UntypedError';
        this.context = context;
    }
}
exports.TypedError = TypedError;
class ErrorContext {
    constructor(transactionHash) {
        this.transactionHash = transactionHash;
    }
}
exports.ErrorContext = ErrorContext;

},{}],"../node_modules/mustache/mustache.js":[function(require,module,exports) {
var define;
var global = arguments[3];
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Mustache = factory());
}(this, (function () { 'use strict';

  /*!
   * mustache.js - Logic-less {{mustache}} templates with JavaScript
   * http://github.com/janl/mustache.js
   */

  var objectToString = Object.prototype.toString;
  var isArray = Array.isArray || function isArrayPolyfill (object) {
    return objectToString.call(object) === '[object Array]';
  };

  function isFunction (object) {
    return typeof object === 'function';
  }

  /**
   * More correct typeof string handling array
   * which normally returns typeof 'object'
   */
  function typeStr (obj) {
    return isArray(obj) ? 'array' : typeof obj;
  }

  function escapeRegExp (string) {
    return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
  }

  /**
   * Null safe way of checking whether or not an object,
   * including its prototype, has a given property
   */
  function hasProperty (obj, propName) {
    return obj != null && typeof obj === 'object' && (propName in obj);
  }

  /**
   * Safe way of detecting whether or not the given thing is a primitive and
   * whether it has the given property
   */
  function primitiveHasOwnProperty (primitive, propName) {
    return (
      primitive != null
      && typeof primitive !== 'object'
      && primitive.hasOwnProperty
      && primitive.hasOwnProperty(propName)
    );
  }

  // Workaround for https://issues.apache.org/jira/browse/COUCHDB-577
  // See https://github.com/janl/mustache.js/issues/189
  var regExpTest = RegExp.prototype.test;
  function testRegExp (re, string) {
    return regExpTest.call(re, string);
  }

  var nonSpaceRe = /\S/;
  function isWhitespace (string) {
    return !testRegExp(nonSpaceRe, string);
  }

  var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };

  function escapeHtml (string) {
    return String(string).replace(/[&<>"'`=\/]/g, function fromEntityMap (s) {
      return entityMap[s];
    });
  }

  var whiteRe = /\s*/;
  var spaceRe = /\s+/;
  var equalsRe = /\s*=/;
  var curlyRe = /\s*\}/;
  var tagRe = /#|\^|\/|>|\{|&|=|!/;

  /**
   * Breaks up the given `template` string into a tree of tokens. If the `tags`
   * argument is given here it must be an array with two string values: the
   * opening and closing tags used in the template (e.g. [ "<%", "%>" ]). Of
   * course, the default is to use mustaches (i.e. mustache.tags).
   *
   * A token is an array with at least 4 elements. The first element is the
   * mustache symbol that was used inside the tag, e.g. "#" or "&". If the tag
   * did not contain a symbol (i.e. {{myValue}}) this element is "name". For
   * all text that appears outside a symbol this element is "text".
   *
   * The second element of a token is its "value". For mustache tags this is
   * whatever else was inside the tag besides the opening symbol. For text tokens
   * this is the text itself.
   *
   * The third and fourth elements of the token are the start and end indices,
   * respectively, of the token in the original template.
   *
   * Tokens that are the root node of a subtree contain two more elements: 1) an
   * array of tokens in the subtree and 2) the index in the original template at
   * which the closing tag for that section begins.
   *
   * Tokens for partials also contain two more elements: 1) a string value of
   * indendation prior to that tag and 2) the index of that tag on that line -
   * eg a value of 2 indicates the partial is the third tag on this line.
   */
  function parseTemplate (template, tags) {
    if (!template)
      return [];
    var lineHasNonSpace = false;
    var sections = [];     // Stack to hold section tokens
    var tokens = [];       // Buffer to hold the tokens
    var spaces = [];       // Indices of whitespace tokens on the current line
    var hasTag = false;    // Is there a {{tag}} on the current line?
    var nonSpace = false;  // Is there a non-space char on the current line?
    var indentation = '';  // Tracks indentation for tags that use it
    var tagIndex = 0;      // Stores a count of number of tags encountered on a line

    // Strips all whitespace tokens array for the current line
    // if there was a {{#tag}} on it and otherwise only space.
    function stripSpace () {
      if (hasTag && !nonSpace) {
        while (spaces.length)
          delete tokens[spaces.pop()];
      } else {
        spaces = [];
      }

      hasTag = false;
      nonSpace = false;
    }

    var openingTagRe, closingTagRe, closingCurlyRe;
    function compileTags (tagsToCompile) {
      if (typeof tagsToCompile === 'string')
        tagsToCompile = tagsToCompile.split(spaceRe, 2);

      if (!isArray(tagsToCompile) || tagsToCompile.length !== 2)
        throw new Error('Invalid tags: ' + tagsToCompile);

      openingTagRe = new RegExp(escapeRegExp(tagsToCompile[0]) + '\\s*');
      closingTagRe = new RegExp('\\s*' + escapeRegExp(tagsToCompile[1]));
      closingCurlyRe = new RegExp('\\s*' + escapeRegExp('}' + tagsToCompile[1]));
    }

    compileTags(tags || mustache.tags);

    var scanner = new Scanner(template);

    var start, type, value, chr, token, openSection;
    while (!scanner.eos()) {
      start = scanner.pos;

      // Match any text between tags.
      value = scanner.scanUntil(openingTagRe);

      if (value) {
        for (var i = 0, valueLength = value.length; i < valueLength; ++i) {
          chr = value.charAt(i);

          if (isWhitespace(chr)) {
            spaces.push(tokens.length);
            indentation += chr;
          } else {
            nonSpace = true;
            lineHasNonSpace = true;
            indentation += ' ';
          }

          tokens.push([ 'text', chr, start, start + 1 ]);
          start += 1;

          // Check for whitespace on the current line.
          if (chr === '\n') {
            stripSpace();
            indentation = '';
            tagIndex = 0;
            lineHasNonSpace = false;
          }
        }
      }

      // Match the opening tag.
      if (!scanner.scan(openingTagRe))
        break;

      hasTag = true;

      // Get the tag type.
      type = scanner.scan(tagRe) || 'name';
      scanner.scan(whiteRe);

      // Get the tag value.
      if (type === '=') {
        value = scanner.scanUntil(equalsRe);
        scanner.scan(equalsRe);
        scanner.scanUntil(closingTagRe);
      } else if (type === '{') {
        value = scanner.scanUntil(closingCurlyRe);
        scanner.scan(curlyRe);
        scanner.scanUntil(closingTagRe);
        type = '&';
      } else {
        value = scanner.scanUntil(closingTagRe);
      }

      // Match the closing tag.
      if (!scanner.scan(closingTagRe))
        throw new Error('Unclosed tag at ' + scanner.pos);

      if (type == '>') {
        token = [ type, value, start, scanner.pos, indentation, tagIndex, lineHasNonSpace ];
      } else {
        token = [ type, value, start, scanner.pos ];
      }
      tagIndex++;
      tokens.push(token);

      if (type === '#' || type === '^') {
        sections.push(token);
      } else if (type === '/') {
        // Check section nesting.
        openSection = sections.pop();

        if (!openSection)
          throw new Error('Unopened section "' + value + '" at ' + start);

        if (openSection[1] !== value)
          throw new Error('Unclosed section "' + openSection[1] + '" at ' + start);
      } else if (type === 'name' || type === '{' || type === '&') {
        nonSpace = true;
      } else if (type === '=') {
        // Set the tags for the next time around.
        compileTags(value);
      }
    }

    stripSpace();

    // Make sure there are no open sections when we're done.
    openSection = sections.pop();

    if (openSection)
      throw new Error('Unclosed section "' + openSection[1] + '" at ' + scanner.pos);

    return nestTokens(squashTokens(tokens));
  }

  /**
   * Combines the values of consecutive text tokens in the given `tokens` array
   * to a single token.
   */
  function squashTokens (tokens) {
    var squashedTokens = [];

    var token, lastToken;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      token = tokens[i];

      if (token) {
        if (token[0] === 'text' && lastToken && lastToken[0] === 'text') {
          lastToken[1] += token[1];
          lastToken[3] = token[3];
        } else {
          squashedTokens.push(token);
          lastToken = token;
        }
      }
    }

    return squashedTokens;
  }

  /**
   * Forms the given array of `tokens` into a nested tree structure where
   * tokens that represent a section have two additional items: 1) an array of
   * all tokens that appear in that section and 2) the index in the original
   * template that represents the end of that section.
   */
  function nestTokens (tokens) {
    var nestedTokens = [];
    var collector = nestedTokens;
    var sections = [];

    var token, section;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      token = tokens[i];

      switch (token[0]) {
        case '#':
        case '^':
          collector.push(token);
          sections.push(token);
          collector = token[4] = [];
          break;
        case '/':
          section = sections.pop();
          section[5] = token[2];
          collector = sections.length > 0 ? sections[sections.length - 1][4] : nestedTokens;
          break;
        default:
          collector.push(token);
      }
    }

    return nestedTokens;
  }

  /**
   * A simple string scanner that is used by the template parser to find
   * tokens in template strings.
   */
  function Scanner (string) {
    this.string = string;
    this.tail = string;
    this.pos = 0;
  }

  /**
   * Returns `true` if the tail is empty (end of string).
   */
  Scanner.prototype.eos = function eos () {
    return this.tail === '';
  };

  /**
   * Tries to match the given regular expression at the current position.
   * Returns the matched text if it can match, the empty string otherwise.
   */
  Scanner.prototype.scan = function scan (re) {
    var match = this.tail.match(re);

    if (!match || match.index !== 0)
      return '';

    var string = match[0];

    this.tail = this.tail.substring(string.length);
    this.pos += string.length;

    return string;
  };

  /**
   * Skips all text until the given regular expression can be matched. Returns
   * the skipped string, which is the entire tail if no match can be made.
   */
  Scanner.prototype.scanUntil = function scanUntil (re) {
    var index = this.tail.search(re), match;

    switch (index) {
      case -1:
        match = this.tail;
        this.tail = '';
        break;
      case 0:
        match = '';
        break;
      default:
        match = this.tail.substring(0, index);
        this.tail = this.tail.substring(index);
    }

    this.pos += match.length;

    return match;
  };

  /**
   * Represents a rendering context by wrapping a view object and
   * maintaining a reference to the parent context.
   */
  function Context (view, parentContext) {
    this.view = view;
    this.cache = { '.': this.view };
    this.parent = parentContext;
  }

  /**
   * Creates a new context using the given view with this context
   * as the parent.
   */
  Context.prototype.push = function push (view) {
    return new Context(view, this);
  };

  /**
   * Returns the value of the given name in this context, traversing
   * up the context hierarchy if the value is absent in this context's view.
   */
  Context.prototype.lookup = function lookup (name) {
    var cache = this.cache;

    var value;
    if (cache.hasOwnProperty(name)) {
      value = cache[name];
    } else {
      var context = this, intermediateValue, names, index, lookupHit = false;

      while (context) {
        if (name.indexOf('.') > 0) {
          intermediateValue = context.view;
          names = name.split('.');
          index = 0;

          /**
           * Using the dot notion path in `name`, we descend through the
           * nested objects.
           *
           * To be certain that the lookup has been successful, we have to
           * check if the last object in the path actually has the property
           * we are looking for. We store the result in `lookupHit`.
           *
           * This is specially necessary for when the value has been set to
           * `undefined` and we want to avoid looking up parent contexts.
           *
           * In the case where dot notation is used, we consider the lookup
           * to be successful even if the last "object" in the path is
           * not actually an object but a primitive (e.g., a string, or an
           * integer), because it is sometimes useful to access a property
           * of an autoboxed primitive, such as the length of a string.
           **/
          while (intermediateValue != null && index < names.length) {
            if (index === names.length - 1)
              lookupHit = (
                hasProperty(intermediateValue, names[index])
                || primitiveHasOwnProperty(intermediateValue, names[index])
              );

            intermediateValue = intermediateValue[names[index++]];
          }
        } else {
          intermediateValue = context.view[name];

          /**
           * Only checking against `hasProperty`, which always returns `false` if
           * `context.view` is not an object. Deliberately omitting the check
           * against `primitiveHasOwnProperty` if dot notation is not used.
           *
           * Consider this example:
           * ```
           * Mustache.render("The length of a football field is {{#length}}{{length}}{{/length}}.", {length: "100 yards"})
           * ```
           *
           * If we were to check also against `primitiveHasOwnProperty`, as we do
           * in the dot notation case, then render call would return:
           *
           * "The length of a football field is 9."
           *
           * rather than the expected:
           *
           * "The length of a football field is 100 yards."
           **/
          lookupHit = hasProperty(context.view, name);
        }

        if (lookupHit) {
          value = intermediateValue;
          break;
        }

        context = context.parent;
      }

      cache[name] = value;
    }

    if (isFunction(value))
      value = value.call(this.view);

    return value;
  };

  /**
   * A Writer knows how to take a stream of tokens and render them to a
   * string, given a context. It also maintains a cache of templates to
   * avoid the need to parse the same template twice.
   */
  function Writer () {
    this.templateCache = {
      _cache: {},
      set: function set (key, value) {
        this._cache[key] = value;
      },
      get: function get (key) {
        return this._cache[key];
      },
      clear: function clear () {
        this._cache = {};
      }
    };
  }

  /**
   * Clears all cached templates in this writer.
   */
  Writer.prototype.clearCache = function clearCache () {
    if (typeof this.templateCache !== 'undefined') {
      this.templateCache.clear();
    }
  };

  /**
   * Parses and caches the given `template` according to the given `tags` or
   * `mustache.tags` if `tags` is omitted,  and returns the array of tokens
   * that is generated from the parse.
   */
  Writer.prototype.parse = function parse (template, tags) {
    var cache = this.templateCache;
    var cacheKey = template + ':' + (tags || mustache.tags).join(':');
    var isCacheEnabled = typeof cache !== 'undefined';
    var tokens = isCacheEnabled ? cache.get(cacheKey) : undefined;

    if (tokens == undefined) {
      tokens = parseTemplate(template, tags);
      isCacheEnabled && cache.set(cacheKey, tokens);
    }
    return tokens;
  };

  /**
   * High-level method that is used to render the given `template` with
   * the given `view`.
   *
   * The optional `partials` argument may be an object that contains the
   * names and templates of partials that are used in the template. It may
   * also be a function that is used to load partial templates on the fly
   * that takes a single argument: the name of the partial.
   *
   * If the optional `config` argument is given here, then it should be an
   * object with a `tags` attribute or an `escape` attribute or both.
   * If an array is passed, then it will be interpreted the same way as
   * a `tags` attribute on a `config` object.
   *
   * The `tags` attribute of a `config` object must be an array with two
   * string values: the opening and closing tags used in the template (e.g.
   * [ "<%", "%>" ]). The default is to mustache.tags.
   *
   * The `escape` attribute of a `config` object must be a function which
   * accepts a string as input and outputs a safely escaped string.
   * If an `escape` function is not provided, then an HTML-safe string
   * escaping function is used as the default.
   */
  Writer.prototype.render = function render (template, view, partials, config) {
    var tags = this.getConfigTags(config);
    var tokens = this.parse(template, tags);
    var context = (view instanceof Context) ? view : new Context(view, undefined);
    return this.renderTokens(tokens, context, partials, template, config);
  };

  /**
   * Low-level method that renders the given array of `tokens` using
   * the given `context` and `partials`.
   *
   * Note: The `originalTemplate` is only ever used to extract the portion
   * of the original template that was contained in a higher-order section.
   * If the template doesn't use higher-order sections, this argument may
   * be omitted.
   */
  Writer.prototype.renderTokens = function renderTokens (tokens, context, partials, originalTemplate, config) {
    var buffer = '';

    var token, symbol, value;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      value = undefined;
      token = tokens[i];
      symbol = token[0];

      if (symbol === '#') value = this.renderSection(token, context, partials, originalTemplate, config);
      else if (symbol === '^') value = this.renderInverted(token, context, partials, originalTemplate, config);
      else if (symbol === '>') value = this.renderPartial(token, context, partials, config);
      else if (symbol === '&') value = this.unescapedValue(token, context);
      else if (symbol === 'name') value = this.escapedValue(token, context, config);
      else if (symbol === 'text') value = this.rawValue(token);

      if (value !== undefined)
        buffer += value;
    }

    return buffer;
  };

  Writer.prototype.renderSection = function renderSection (token, context, partials, originalTemplate, config) {
    var self = this;
    var buffer = '';
    var value = context.lookup(token[1]);

    // This function is used to render an arbitrary template
    // in the current context by higher-order sections.
    function subRender (template) {
      return self.render(template, context, partials, config);
    }

    if (!value) return;

    if (isArray(value)) {
      for (var j = 0, valueLength = value.length; j < valueLength; ++j) {
        buffer += this.renderTokens(token[4], context.push(value[j]), partials, originalTemplate, config);
      }
    } else if (typeof value === 'object' || typeof value === 'string' || typeof value === 'number') {
      buffer += this.renderTokens(token[4], context.push(value), partials, originalTemplate, config);
    } else if (isFunction(value)) {
      if (typeof originalTemplate !== 'string')
        throw new Error('Cannot use higher-order sections without the original template');

      // Extract the portion of the original template that the section contains.
      value = value.call(context.view, originalTemplate.slice(token[3], token[5]), subRender);

      if (value != null)
        buffer += value;
    } else {
      buffer += this.renderTokens(token[4], context, partials, originalTemplate, config);
    }
    return buffer;
  };

  Writer.prototype.renderInverted = function renderInverted (token, context, partials, originalTemplate, config) {
    var value = context.lookup(token[1]);

    // Use JavaScript's definition of falsy. Include empty arrays.
    // See https://github.com/janl/mustache.js/issues/186
    if (!value || (isArray(value) && value.length === 0))
      return this.renderTokens(token[4], context, partials, originalTemplate, config);
  };

  Writer.prototype.indentPartial = function indentPartial (partial, indentation, lineHasNonSpace) {
    var filteredIndentation = indentation.replace(/[^ \t]/g, '');
    var partialByNl = partial.split('\n');
    for (var i = 0; i < partialByNl.length; i++) {
      if (partialByNl[i].length && (i > 0 || !lineHasNonSpace)) {
        partialByNl[i] = filteredIndentation + partialByNl[i];
      }
    }
    return partialByNl.join('\n');
  };

  Writer.prototype.renderPartial = function renderPartial (token, context, partials, config) {
    if (!partials) return;
    var tags = this.getConfigTags(config);

    var value = isFunction(partials) ? partials(token[1]) : partials[token[1]];
    if (value != null) {
      var lineHasNonSpace = token[6];
      var tagIndex = token[5];
      var indentation = token[4];
      var indentedValue = value;
      if (tagIndex == 0 && indentation) {
        indentedValue = this.indentPartial(value, indentation, lineHasNonSpace);
      }
      var tokens = this.parse(indentedValue, tags);
      return this.renderTokens(tokens, context, partials, indentedValue, config);
    }
  };

  Writer.prototype.unescapedValue = function unescapedValue (token, context) {
    var value = context.lookup(token[1]);
    if (value != null)
      return value;
  };

  Writer.prototype.escapedValue = function escapedValue (token, context, config) {
    var escape = this.getConfigEscape(config) || mustache.escape;
    var value = context.lookup(token[1]);
    if (value != null)
      return (typeof value === 'number' && escape === mustache.escape) ? String(value) : escape(value);
  };

  Writer.prototype.rawValue = function rawValue (token) {
    return token[1];
  };

  Writer.prototype.getConfigTags = function getConfigTags (config) {
    if (isArray(config)) {
      return config;
    }
    else if (config && typeof config === 'object') {
      return config.tags;
    }
    else {
      return undefined;
    }
  };

  Writer.prototype.getConfigEscape = function getConfigEscape (config) {
    if (config && typeof config === 'object' && !isArray(config)) {
      return config.escape;
    }
    else {
      return undefined;
    }
  };

  var mustache = {
    name: 'mustache.js',
    version: '4.2.0',
    tags: [ '{{', '}}' ],
    clearCache: undefined,
    escape: undefined,
    parse: undefined,
    render: undefined,
    Scanner: undefined,
    Context: undefined,
    Writer: undefined,
    /**
     * Allows a user to override the default caching strategy, by providing an
     * object with set, get and clear methods. This can also be used to disable
     * the cache by setting it to the literal `undefined`.
     */
    set templateCache (cache) {
      defaultWriter.templateCache = cache;
    },
    /**
     * Gets the default or overridden caching object from the default writer.
     */
    get templateCache () {
      return defaultWriter.templateCache;
    }
  };

  // All high-level mustache.* functions use this writer.
  var defaultWriter = new Writer();

  /**
   * Clears all cached templates in the default writer.
   */
  mustache.clearCache = function clearCache () {
    return defaultWriter.clearCache();
  };

  /**
   * Parses and caches the given template in the default writer and returns the
   * array of tokens it contains. Doing this ahead of time avoids the need to
   * parse templates on the fly as they are rendered.
   */
  mustache.parse = function parse (template, tags) {
    return defaultWriter.parse(template, tags);
  };

  /**
   * Renders the `template` with the given `view`, `partials`, and `config`
   * using the default writer.
   */
  mustache.render = function render (template, view, partials, config) {
    if (typeof template !== 'string') {
      throw new TypeError('Invalid template! Template should be a "string" ' +
                          'but "' + typeStr(template) + '" was given as the first ' +
                          'argument for mustache#render(template, view, partials)');
    }

    return defaultWriter.render(template, view, partials, config);
  };

  // Export the escaping function so that the user may override it.
  // See https://github.com/janl/mustache.js/issues/244
  mustache.escape = escapeHtml;

  // Export these mainly for testing, but also for advanced usage.
  mustache.Scanner = Scanner;
  mustache.Context = Context;
  mustache.Writer = Writer;

  return mustache;

})));

},{}],"../node_modules/near-api-js/lib/generated/rpc_error_schema.json":[function(require,module,exports) {
module.exports = {
    "schema": {
        "BadUTF16": {
            "name": "BadUTF16",
            "subtypes": [],
            "props": {}
        },
        "BadUTF8": {
            "name": "BadUTF8",
            "subtypes": [],
            "props": {}
        },
        "BalanceExceeded": {
            "name": "BalanceExceeded",
            "subtypes": [],
            "props": {}
        },
        "BreakpointTrap": {
            "name": "BreakpointTrap",
            "subtypes": [],
            "props": {}
        },
        "CacheError": {
            "name": "CacheError",
            "subtypes": [
                "ReadError",
                "WriteError",
                "DeserializationError",
                "SerializationError"
            ],
            "props": {}
        },
        "CallIndirectOOB": {
            "name": "CallIndirectOOB",
            "subtypes": [],
            "props": {}
        },
        "CannotAppendActionToJointPromise": {
            "name": "CannotAppendActionToJointPromise",
            "subtypes": [],
            "props": {}
        },
        "CannotReturnJointPromise": {
            "name": "CannotReturnJointPromise",
            "subtypes": [],
            "props": {}
        },
        "CodeDoesNotExist": {
            "name": "CodeDoesNotExist",
            "subtypes": [],
            "props": {
                "account_id": ""
            }
        },
        "CompilationError": {
            "name": "CompilationError",
            "subtypes": [
                "CodeDoesNotExist",
                "PrepareError",
                "WasmerCompileError"
            ],
            "props": {}
        },
        "ContractSizeExceeded": {
            "name": "ContractSizeExceeded",
            "subtypes": [],
            "props": {
                "limit": "",
                "size": ""
            }
        },
        "Deprecated": {
            "name": "Deprecated",
            "subtypes": [],
            "props": {
                "method_name": ""
            }
        },
        "Deserialization": {
            "name": "Deserialization",
            "subtypes": [],
            "props": {}
        },
        "DeserializationError": {
            "name": "DeserializationError",
            "subtypes": [],
            "props": {}
        },
        "EmptyMethodName": {
            "name": "EmptyMethodName",
            "subtypes": [],
            "props": {}
        },
        "FunctionCallError": {
            "name": "FunctionCallError",
            "subtypes": [
                "CompilationError",
                "LinkError",
                "MethodResolveError",
                "WasmTrap",
                "WasmUnknownError",
                "HostError",
                "EvmError"
            ],
            "props": {}
        },
        "GasExceeded": {
            "name": "GasExceeded",
            "subtypes": [],
            "props": {}
        },
        "GasInstrumentation": {
            "name": "GasInstrumentation",
            "subtypes": [],
            "props": {}
        },
        "GasLimitExceeded": {
            "name": "GasLimitExceeded",
            "subtypes": [],
            "props": {}
        },
        "GenericTrap": {
            "name": "GenericTrap",
            "subtypes": [],
            "props": {}
        },
        "GuestPanic": {
            "name": "GuestPanic",
            "subtypes": [],
            "props": {
                "panic_msg": ""
            }
        },
        "HostError": {
            "name": "HostError",
            "subtypes": [
                "BadUTF16",
                "BadUTF8",
                "GasExceeded",
                "GasLimitExceeded",
                "BalanceExceeded",
                "EmptyMethodName",
                "GuestPanic",
                "IntegerOverflow",
                "InvalidPromiseIndex",
                "CannotAppendActionToJointPromise",
                "CannotReturnJointPromise",
                "InvalidPromiseResultIndex",
                "InvalidRegisterId",
                "IteratorWasInvalidated",
                "MemoryAccessViolation",
                "InvalidReceiptIndex",
                "InvalidIteratorIndex",
                "InvalidAccountId",
                "InvalidMethodName",
                "InvalidPublicKey",
                "ProhibitedInView",
                "NumberOfLogsExceeded",
                "KeyLengthExceeded",
                "ValueLengthExceeded",
                "TotalLogLengthExceeded",
                "NumberPromisesExceeded",
                "NumberInputDataDependenciesExceeded",
                "ReturnedValueLengthExceeded",
                "ContractSizeExceeded",
                "Deprecated"
            ],
            "props": {}
        },
        "IllegalArithmetic": {
            "name": "IllegalArithmetic",
            "subtypes": [],
            "props": {}
        },
        "IncorrectCallIndirectSignature": {
            "name": "IncorrectCallIndirectSignature",
            "subtypes": [],
            "props": {}
        },
        "Instantiate": {
            "name": "Instantiate",
            "subtypes": [],
            "props": {}
        },
        "IntegerOverflow": {
            "name": "IntegerOverflow",
            "subtypes": [],
            "props": {}
        },
        "InternalMemoryDeclared": {
            "name": "InternalMemoryDeclared",
            "subtypes": [],
            "props": {}
        },
        "InvalidAccountId": {
            "name": "InvalidAccountId",
            "subtypes": [],
            "props": {
                "account_id": ""
            }
        },
        "InvalidIteratorIndex": {
            "name": "InvalidIteratorIndex",
            "subtypes": [],
            "props": {
                "iterator_index": ""
            }
        },
        "InvalidMethodName": {
            "name": "InvalidMethodName",
            "subtypes": [],
            "props": {}
        },
        "InvalidPromiseIndex": {
            "name": "InvalidPromiseIndex",
            "subtypes": [],
            "props": {
                "promise_idx": ""
            }
        },
        "InvalidPromiseResultIndex": {
            "name": "InvalidPromiseResultIndex",
            "subtypes": [],
            "props": {
                "result_idx": ""
            }
        },
        "InvalidPublicKey": {
            "name": "InvalidPublicKey",
            "subtypes": [],
            "props": {}
        },
        "InvalidReceiptIndex": {
            "name": "InvalidReceiptIndex",
            "subtypes": [],
            "props": {
                "receipt_index": ""
            }
        },
        "InvalidRegisterId": {
            "name": "InvalidRegisterId",
            "subtypes": [],
            "props": {
                "register_id": ""
            }
        },
        "IteratorWasInvalidated": {
            "name": "IteratorWasInvalidated",
            "subtypes": [],
            "props": {
                "iterator_index": ""
            }
        },
        "KeyLengthExceeded": {
            "name": "KeyLengthExceeded",
            "subtypes": [],
            "props": {
                "length": "",
                "limit": ""
            }
        },
        "LinkError": {
            "name": "LinkError",
            "subtypes": [],
            "props": {
                "msg": ""
            }
        },
        "Memory": {
            "name": "Memory",
            "subtypes": [],
            "props": {}
        },
        "MemoryAccessViolation": {
            "name": "MemoryAccessViolation",
            "subtypes": [],
            "props": {}
        },
        "MemoryOutOfBounds": {
            "name": "MemoryOutOfBounds",
            "subtypes": [],
            "props": {}
        },
        "MethodEmptyName": {
            "name": "MethodEmptyName",
            "subtypes": [],
            "props": {}
        },
        "MethodInvalidSignature": {
            "name": "MethodInvalidSignature",
            "subtypes": [],
            "props": {}
        },
        "MethodNotFound": {
            "name": "MethodNotFound",
            "subtypes": [],
            "props": {}
        },
        "MethodResolveError": {
            "name": "MethodResolveError",
            "subtypes": [
                "MethodEmptyName",
                "MethodUTF8Error",
                "MethodNotFound",
                "MethodInvalidSignature"
            ],
            "props": {}
        },
        "MethodUTF8Error": {
            "name": "MethodUTF8Error",
            "subtypes": [],
            "props": {}
        },
        "MisalignedAtomicAccess": {
            "name": "MisalignedAtomicAccess",
            "subtypes": [],
            "props": {}
        },
        "NumberInputDataDependenciesExceeded": {
            "name": "NumberInputDataDependenciesExceeded",
            "subtypes": [],
            "props": {
                "limit": "",
                "number_of_input_data_dependencies": ""
            }
        },
        "NumberOfLogsExceeded": {
            "name": "NumberOfLogsExceeded",
            "subtypes": [],
            "props": {
                "limit": ""
            }
        },
        "NumberPromisesExceeded": {
            "name": "NumberPromisesExceeded",
            "subtypes": [],
            "props": {
                "limit": "",
                "number_of_promises": ""
            }
        },
        "PrepareError": {
            "name": "PrepareError",
            "subtypes": [
                "Serialization",
                "Deserialization",
                "InternalMemoryDeclared",
                "GasInstrumentation",
                "StackHeightInstrumentation",
                "Instantiate",
                "Memory"
            ],
            "props": {}
        },
        "ProhibitedInView": {
            "name": "ProhibitedInView",
            "subtypes": [],
            "props": {
                "method_name": ""
            }
        },
        "ReadError": {
            "name": "ReadError",
            "subtypes": [],
            "props": {}
        },
        "ReturnedValueLengthExceeded": {
            "name": "ReturnedValueLengthExceeded",
            "subtypes": [],
            "props": {
                "length": "",
                "limit": ""
            }
        },
        "Serialization": {
            "name": "Serialization",
            "subtypes": [],
            "props": {}
        },
        "SerializationError": {
            "name": "SerializationError",
            "subtypes": [],
            "props": {
                "hash": ""
            }
        },
        "StackHeightInstrumentation": {
            "name": "StackHeightInstrumentation",
            "subtypes": [],
            "props": {}
        },
        "StackOverflow": {
            "name": "StackOverflow",
            "subtypes": [],
            "props": {}
        },
        "TotalLogLengthExceeded": {
            "name": "TotalLogLengthExceeded",
            "subtypes": [],
            "props": {
                "length": "",
                "limit": ""
            }
        },
        "Unreachable": {
            "name": "Unreachable",
            "subtypes": [],
            "props": {}
        },
        "ValueLengthExceeded": {
            "name": "ValueLengthExceeded",
            "subtypes": [],
            "props": {
                "length": "",
                "limit": ""
            }
        },
        "WasmTrap": {
            "name": "WasmTrap",
            "subtypes": [
                "Unreachable",
                "IncorrectCallIndirectSignature",
                "MemoryOutOfBounds",
                "CallIndirectOOB",
                "IllegalArithmetic",
                "MisalignedAtomicAccess",
                "BreakpointTrap",
                "StackOverflow",
                "GenericTrap"
            ],
            "props": {}
        },
        "WasmUnknownError": {
            "name": "WasmUnknownError",
            "subtypes": [],
            "props": {}
        },
        "WasmerCompileError": {
            "name": "WasmerCompileError",
            "subtypes": [],
            "props": {
                "msg": ""
            }
        },
        "WriteError": {
            "name": "WriteError",
            "subtypes": [],
            "props": {}
        },
        "AccessKeyNotFound": {
            "name": "AccessKeyNotFound",
            "subtypes": [],
            "props": {
                "account_id": "",
                "public_key": ""
            }
        },
        "AccountAlreadyExists": {
            "name": "AccountAlreadyExists",
            "subtypes": [],
            "props": {
                "account_id": ""
            }
        },
        "AccountDoesNotExist": {
            "name": "AccountDoesNotExist",
            "subtypes": [],
            "props": {
                "account_id": ""
            }
        },
        "ActionError": {
            "name": "ActionError",
            "subtypes": [
                "AccountAlreadyExists",
                "AccountDoesNotExist",
                "CreateAccountOnlyByRegistrar",
                "CreateAccountNotAllowed",
                "ActorNoPermission",
                "DeleteKeyDoesNotExist",
                "AddKeyAlreadyExists",
                "DeleteAccountStaking",
                "LackBalanceForState",
                "TriesToUnstake",
                "TriesToStake",
                "InsufficientStake",
                "FunctionCallError",
                "NewReceiptValidationError",
                "OnlyImplicitAccountCreationAllowed"
            ],
            "props": {
                "index": ""
            }
        },
        "ActionsValidationError": {
            "name": "ActionsValidationError",
            "subtypes": [
                "DeleteActionMustBeFinal",
                "TotalPrepaidGasExceeded",
                "TotalNumberOfActionsExceeded",
                "AddKeyMethodNamesNumberOfBytesExceeded",
                "AddKeyMethodNameLengthExceeded",
                "IntegerOverflow",
                "InvalidAccountId",
                "ContractSizeExceeded",
                "FunctionCallMethodNameLengthExceeded",
                "FunctionCallArgumentsLengthExceeded",
                "UnsuitableStakingKey",
                "FunctionCallZeroAttachedGas"
            ],
            "props": {}
        },
        "ActorNoPermission": {
            "name": "ActorNoPermission",
            "subtypes": [],
            "props": {
                "account_id": "",
                "actor_id": ""
            }
        },
        "AddKeyAlreadyExists": {
            "name": "AddKeyAlreadyExists",
            "subtypes": [],
            "props": {
                "account_id": "",
                "public_key": ""
            }
        },
        "AddKeyMethodNameLengthExceeded": {
            "name": "AddKeyMethodNameLengthExceeded",
            "subtypes": [],
            "props": {
                "length": "",
                "limit": ""
            }
        },
        "AddKeyMethodNamesNumberOfBytesExceeded": {
            "name": "AddKeyMethodNamesNumberOfBytesExceeded",
            "subtypes": [],
            "props": {
                "limit": "",
                "total_number_of_bytes": ""
            }
        },
        "BalanceMismatchError": {
            "name": "BalanceMismatchError",
            "subtypes": [],
            "props": {
                "final_accounts_balance": "",
                "final_postponed_receipts_balance": "",
                "incoming_receipts_balance": "",
                "incoming_validator_rewards": "",
                "initial_accounts_balance": "",
                "initial_postponed_receipts_balance": "",
                "new_delayed_receipts_balance": "",
                "other_burnt_amount": "",
                "outgoing_receipts_balance": "",
                "processed_delayed_receipts_balance": "",
                "slashed_burnt_amount": "",
                "tx_burnt_amount": ""
            }
        },
        "CostOverflow": {
            "name": "CostOverflow",
            "subtypes": [],
            "props": {}
        },
        "CreateAccountNotAllowed": {
            "name": "CreateAccountNotAllowed",
            "subtypes": [],
            "props": {
                "account_id": "",
                "predecessor_id": ""
            }
        },
        "CreateAccountOnlyByRegistrar": {
            "name": "CreateAccountOnlyByRegistrar",
            "subtypes": [],
            "props": {
                "account_id": "",
                "predecessor_id": "",
                "registrar_account_id": ""
            }
        },
        "DeleteAccountStaking": {
            "name": "DeleteAccountStaking",
            "subtypes": [],
            "props": {
                "account_id": ""
            }
        },
        "DeleteActionMustBeFinal": {
            "name": "DeleteActionMustBeFinal",
            "subtypes": [],
            "props": {}
        },
        "DeleteKeyDoesNotExist": {
            "name": "DeleteKeyDoesNotExist",
            "subtypes": [],
            "props": {
                "account_id": "",
                "public_key": ""
            }
        },
        "DepositWithFunctionCall": {
            "name": "DepositWithFunctionCall",
            "subtypes": [],
            "props": {}
        },
        "Expired": {
            "name": "Expired",
            "subtypes": [],
            "props": {}
        },
        "FunctionCallArgumentsLengthExceeded": {
            "name": "FunctionCallArgumentsLengthExceeded",
            "subtypes": [],
            "props": {
                "length": "",
                "limit": ""
            }
        },
        "FunctionCallMethodNameLengthExceeded": {
            "name": "FunctionCallMethodNameLengthExceeded",
            "subtypes": [],
            "props": {
                "length": "",
                "limit": ""
            }
        },
        "FunctionCallZeroAttachedGas": {
            "name": "FunctionCallZeroAttachedGas",
            "subtypes": [],
            "props": {}
        },
        "InsufficientStake": {
            "name": "InsufficientStake",
            "subtypes": [],
            "props": {
                "account_id": "",
                "minimum_stake": "",
                "stake": ""
            }
        },
        "InvalidAccessKeyError": {
            "name": "InvalidAccessKeyError",
            "subtypes": [
                "AccessKeyNotFound",
                "ReceiverMismatch",
                "MethodNameMismatch",
                "RequiresFullAccess",
                "NotEnoughAllowance",
                "DepositWithFunctionCall"
            ],
            "props": {}
        },
        "InvalidChain": {
            "name": "InvalidChain",
            "subtypes": [],
            "props": {}
        },
        "InvalidDataReceiverId": {
            "name": "InvalidDataReceiverId",
            "subtypes": [],
            "props": {
                "account_id": ""
            }
        },
        "InvalidNonce": {
            "name": "InvalidNonce",
            "subtypes": [],
            "props": {
                "ak_nonce": "",
                "tx_nonce": ""
            }
        },
        "InvalidPredecessorId": {
            "name": "InvalidPredecessorId",
            "subtypes": [],
            "props": {
                "account_id": ""
            }
        },
        "InvalidReceiverId": {
            "name": "InvalidReceiverId",
            "subtypes": [],
            "props": {
                "account_id": ""
            }
        },
        "InvalidSignature": {
            "name": "InvalidSignature",
            "subtypes": [],
            "props": {}
        },
        "InvalidSignerId": {
            "name": "InvalidSignerId",
            "subtypes": [],
            "props": {
                "account_id": ""
            }
        },
        "InvalidTxError": {
            "name": "InvalidTxError",
            "subtypes": [
                "InvalidAccessKeyError",
                "InvalidSignerId",
                "SignerDoesNotExist",
                "InvalidNonce",
                "InvalidReceiverId",
                "InvalidSignature",
                "NotEnoughBalance",
                "LackBalanceForState",
                "CostOverflow",
                "InvalidChain",
                "Expired",
                "ActionsValidation"
            ],
            "props": {}
        },
        "LackBalanceForState": {
            "name": "LackBalanceForState",
            "subtypes": [],
            "props": {
                "account_id": "",
                "amount": ""
            }
        },
        "MethodNameMismatch": {
            "name": "MethodNameMismatch",
            "subtypes": [],
            "props": {
                "method_name": ""
            }
        },
        "NotEnoughAllowance": {
            "name": "NotEnoughAllowance",
            "subtypes": [],
            "props": {
                "account_id": "",
                "allowance": "",
                "cost": "",
                "public_key": ""
            }
        },
        "NotEnoughBalance": {
            "name": "NotEnoughBalance",
            "subtypes": [],
            "props": {
                "balance": "",
                "cost": "",
                "signer_id": ""
            }
        },
        "OnlyImplicitAccountCreationAllowed": {
            "name": "OnlyImplicitAccountCreationAllowed",
            "subtypes": [],
            "props": {
                "account_id": ""
            }
        },
        "ReceiptValidationError": {
            "name": "ReceiptValidationError",
            "subtypes": [
                "InvalidPredecessorId",
                "InvalidReceiverId",
                "InvalidSignerId",
                "InvalidDataReceiverId",
                "ReturnedValueLengthExceeded",
                "NumberInputDataDependenciesExceeded",
                "ActionsValidation"
            ],
            "props": {}
        },
        "ReceiverMismatch": {
            "name": "ReceiverMismatch",
            "subtypes": [],
            "props": {
                "ak_receiver": "",
                "tx_receiver": ""
            }
        },
        "RequiresFullAccess": {
            "name": "RequiresFullAccess",
            "subtypes": [],
            "props": {}
        },
        "SignerDoesNotExist": {
            "name": "SignerDoesNotExist",
            "subtypes": [],
            "props": {
                "signer_id": ""
            }
        },
        "TotalNumberOfActionsExceeded": {
            "name": "TotalNumberOfActionsExceeded",
            "subtypes": [],
            "props": {
                "limit": "",
                "total_number_of_actions": ""
            }
        },
        "TotalPrepaidGasExceeded": {
            "name": "TotalPrepaidGasExceeded",
            "subtypes": [],
            "props": {
                "limit": "",
                "total_prepaid_gas": ""
            }
        },
        "TriesToStake": {
            "name": "TriesToStake",
            "subtypes": [],
            "props": {
                "account_id": "",
                "balance": "",
                "locked": "",
                "stake": ""
            }
        },
        "TriesToUnstake": {
            "name": "TriesToUnstake",
            "subtypes": [],
            "props": {
                "account_id": ""
            }
        },
        "TxExecutionError": {
            "name": "TxExecutionError",
            "subtypes": [
                "ActionError",
                "InvalidTxError"
            ],
            "props": {}
        },
        "UnsuitableStakingKey": {
            "name": "UnsuitableStakingKey",
            "subtypes": [],
            "props": {
                "public_key": ""
            }
        },
        "Closed": {
            "name": "Closed",
            "subtypes": [],
            "props": {}
        },
        "InternalError": {
            "name": "InternalError",
            "subtypes": [],
            "props": {}
        },
        "ServerError": {
            "name": "ServerError",
            "subtypes": [
                "TxExecutionError",
                "Timeout",
                "Closed",
                "InternalError"
            ],
            "props": {}
        },
        "Timeout": {
            "name": "Timeout",
            "subtypes": [],
            "props": {}
        }
    }
}
;
},{}],"../node_modules/near-api-js/lib/res/error_messages.json":[function(require,module,exports) {
module.exports = {
    "GasLimitExceeded": "Exceeded the maximum amount of gas allowed to burn per contract",
    "MethodEmptyName": "Method name is empty",
    "WasmerCompileError": "Wasmer compilation error: {{msg}}",
    "GuestPanic": "Smart contract panicked: {{panic_msg}}",
    "Memory": "Error creating Wasm memory",
    "GasExceeded": "Exceeded the prepaid gas",
    "MethodUTF8Error": "Method name is not valid UTF8 string",
    "BadUTF16": "String encoding is bad UTF-16 sequence",
    "WasmTrap": "WebAssembly trap: {{msg}}",
    "GasInstrumentation": "Gas instrumentation failed or contract has denied instructions.",
    "InvalidPromiseIndex": "{{promise_idx}} does not correspond to existing promises",
    "InvalidPromiseResultIndex": "Accessed invalid promise result index: {{result_idx}}",
    "Deserialization": "Error happened while deserializing the module",
    "MethodNotFound": "Contract method is not found",
    "InvalidRegisterId": "Accessed invalid register id: {{register_id}}",
    "InvalidReceiptIndex": "VM Logic returned an invalid receipt index: {{receipt_index}}",
    "EmptyMethodName": "Method name is empty in contract call",
    "CannotReturnJointPromise": "Returning joint promise is currently prohibited",
    "StackHeightInstrumentation": "Stack instrumentation failed",
    "CodeDoesNotExist": "Cannot find contract code for account {{account_id}}",
    "MethodInvalidSignature": "Invalid method signature",
    "IntegerOverflow": "Integer overflow happened during contract execution",
    "MemoryAccessViolation": "MemoryAccessViolation",
    "InvalidIteratorIndex": "Iterator index {{iterator_index}} does not exist",
    "IteratorWasInvalidated": "Iterator {{iterator_index}} was invalidated after its creation by performing a mutable operation on trie",
    "InvalidAccountId": "VM Logic returned an invalid account id",
    "Serialization": "Error happened while serializing the module",
    "CannotAppendActionToJointPromise": "Actions can only be appended to non-joint promise.",
    "InternalMemoryDeclared": "Internal memory declaration has been found in the module",
    "Instantiate": "Error happened during instantiation",
    "ProhibitedInView": "{{method_name}} is not allowed in view calls",
    "InvalidMethodName": "VM Logic returned an invalid method name",
    "BadUTF8": "String encoding is bad UTF-8 sequence",
    "BalanceExceeded": "Exceeded the account balance",
    "LinkError": "Wasm contract link error: {{msg}}",
    "InvalidPublicKey": "VM Logic provided an invalid public key",
    "ActorNoPermission": "Actor {{actor_id}} doesn't have permission to account {{account_id}} to complete the action",
    "LackBalanceForState": "The account {{account_id}} wouldn't have enough balance to cover storage, required to have {{amount}} yoctoNEAR more",
    "ReceiverMismatch": "Wrong AccessKey used for transaction: transaction is sent to receiver_id={{tx_receiver}}, but is signed with function call access key that restricted to only use with receiver_id={{ak_receiver}}. Either change receiver_id in your transaction or switch to use a FullAccessKey.",
    "CostOverflow": "Transaction gas or balance cost is too high",
    "InvalidSignature": "Transaction is not signed with the given public key",
    "AccessKeyNotFound": "Signer \"{{account_id}}\" doesn't have access key with the given public_key {{public_key}}",
    "NotEnoughBalance": "Sender {{signer_id}} does not have enough balance {{#formatNear}}{{balance}}{{/formatNear}} for operation costing {{#formatNear}}{{cost}}{{/formatNear}}",
    "NotEnoughAllowance": "Access Key {account_id}:{public_key} does not have enough balance {{#formatNear}}{{allowance}}{{/formatNear}} for transaction costing {{#formatNear}}{{cost}}{{/formatNear}}",
    "Expired": "Transaction has expired",
    "DeleteAccountStaking": "Account {{account_id}} is staking and can not be deleted",
    "SignerDoesNotExist": "Signer {{signer_id}} does not exist",
    "TriesToStake": "Account {{account_id}} tried to stake {{#formatNear}}{{stake}}{{/formatNear}}, but has staked {{#formatNear}}{{locked}}{{/formatNear}} and only has {{#formatNear}}{{balance}}{{/formatNear}}",
    "AddKeyAlreadyExists": "The public key {{public_key}} is already used for an existing access key",
    "InvalidSigner": "Invalid signer account ID {{signer_id}} according to requirements",
    "CreateAccountNotAllowed": "The new account_id {{account_id}} can't be created by {{predecessor_id}}",
    "RequiresFullAccess": "The transaction contains more then one action, but it was signed with an access key which allows transaction to apply only one specific action. To apply more then one actions TX must be signed with a full access key",
    "TriesToUnstake": "Account {{account_id}} is not yet staked, but tried to unstake",
    "InvalidNonce": "Transaction nonce {{tx_nonce}} must be larger than nonce of the used access key {{ak_nonce}}",
    "AccountAlreadyExists": "Can't create a new account {{account_id}}, because it already exists",
    "InvalidChain": "Transaction parent block hash doesn't belong to the current chain",
    "AccountDoesNotExist": "Can't complete the action because account {{account_id}} doesn't exist",
    "MethodNameMismatch": "Transaction method name {{method_name}} isn't allowed by the access key",
    "DeleteAccountHasRent": "Account {{account_id}} can't be deleted. It has {{#formatNear}}{{balance}}{{/formatNear}}, which is enough to cover the rent",
    "DeleteAccountHasEnoughBalance": "Account {{account_id}} can't be deleted. It has {{#formatNear}}{{balance}}{{/formatNear}}, which is enough to cover it's storage",
    "InvalidReceiver": "Invalid receiver account ID {{receiver_id}} according to requirements",
    "DeleteKeyDoesNotExist": "Account {{account_id}} tries to remove an access key that doesn't exist",
    "Timeout": "Timeout exceeded",
    "Closed": "Connection closed"
}
;
},{}],"../node_modules/near-api-js/lib/utils/rpc_errors.js":[function(require,module,exports) {
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getErrorTypeFromErrorMessage = exports.formatError = exports.parseResultError = exports.parseRpcError = exports.ServerError = void 0;
const mustache_1 = __importDefault(require("mustache"));
const rpc_error_schema_json_1 = __importDefault(require("../generated/rpc_error_schema.json"));
const error_messages_json_1 = __importDefault(require("../res/error_messages.json"));
const common_index_1 = require("../common-index");
const errors_1 = require("../utils/errors");
const mustacheHelpers = {
    formatNear: () => (n, render) => common_index_1.utils.format.formatNearAmount(render(n))
};
class ServerError extends errors_1.TypedError {
}
exports.ServerError = ServerError;
class ServerTransactionError extends ServerError {
}
function parseRpcError(errorObj) {
    const result = {};
    const errorClassName = walkSubtype(errorObj, rpc_error_schema_json_1.default.schema, result, '');
    // NOTE: This assumes that all errors extend TypedError
    const error = new ServerError(formatError(errorClassName, result), errorClassName);
    Object.assign(error, result);
    return error;
}
exports.parseRpcError = parseRpcError;
function parseResultError(result) {
    const server_error = parseRpcError(result.status.Failure);
    const server_tx_error = new ServerTransactionError();
    Object.assign(server_tx_error, server_error);
    server_tx_error.type = server_error.type;
    server_tx_error.message = server_error.message;
    server_tx_error.transaction_outcome = result.transaction_outcome;
    return server_tx_error;
}
exports.parseResultError = parseResultError;
function formatError(errorClassName, errorData) {
    if (typeof error_messages_json_1.default[errorClassName] === 'string') {
        return mustache_1.default.render(error_messages_json_1.default[errorClassName], {
            ...errorData,
            ...mustacheHelpers
        });
    }
    return JSON.stringify(errorData);
}
exports.formatError = formatError;
/**
 * Walks through defined schema returning error(s) recursively
 * @param errorObj The error to be parsed
 * @param schema A defined schema in JSON mapping to the RPC errors
 * @param result An object used in recursion or called directly
 * @param typeName The human-readable error type name as defined in the JSON mapping
 */
function walkSubtype(errorObj, schema, result, typeName) {
    let error;
    let type;
    let errorTypeName;
    for (const errorName in schema) {
        if (isString(errorObj[errorName])) {
            // Return early if error type is in a schema
            return errorObj[errorName];
        }
        if (isObject(errorObj[errorName])) {
            error = errorObj[errorName];
            type = schema[errorName];
            errorTypeName = errorName;
        }
        else if (isObject(errorObj.kind) && isObject(errorObj.kind[errorName])) {
            error = errorObj.kind[errorName];
            type = schema[errorName];
            errorTypeName = errorName;
        }
        else {
            continue;
        }
    }
    if (error && type) {
        for (const prop of Object.keys(type.props)) {
            result[prop] = error[prop];
        }
        return walkSubtype(error, schema, result, errorTypeName);
    }
    else {
        // TODO: is this the right thing to do?
        result.kind = errorObj;
        return typeName;
    }
}
function getErrorTypeFromErrorMessage(errorMessage) {
    // This function should be removed when JSON RPC starts returning typed errors.
    switch (true) {
        case /^account .*? does not exist while viewing$/.test(errorMessage):
            return 'AccountDoesNotExist';
        case /^Account .*? doesn't exist$/.test(errorMessage):
            return 'AccountDoesNotExist';
        case /^access key .*? does not exist while viewing$/.test(errorMessage):
            return 'AccessKeyDoesNotExist';
        case /wasm execution failed with error: FunctionCallError\(CompilationError\(CodeDoesNotExist/.test(errorMessage):
            return 'CodeDoesNotExist';
        case /Transaction nonce \d+ must be larger than nonce of the used access key \d+/.test(errorMessage):
            return 'InvalidNonce';
        default:
            return 'UntypedError';
    }
}
exports.getErrorTypeFromErrorMessage = getErrorTypeFromErrorMessage;
/**
 * Helper function determining if the argument is an object
 * @param n Value to check
 */
function isObject(n) {
    return Object.prototype.toString.call(n) === '[object Object]';
}
/**
 * Helper function determining if the argument is a string
 * @param n Value to check
 */
function isString(n) {
    return Object.prototype.toString.call(n) === '[object String]';
}

},{"mustache":"../node_modules/mustache/mustache.js","../generated/rpc_error_schema.json":"../node_modules/near-api-js/lib/generated/rpc_error_schema.json","../res/error_messages.json":"../node_modules/near-api-js/lib/res/error_messages.json","../common-index":"../node_modules/near-api-js/lib/common-index.js","../utils/errors":"../node_modules/near-api-js/lib/utils/errors.js"}],"../node_modules/near-api-js/lib/providers/json-rpc-provider.js":[function(require,module,exports) {
var Buffer = require("buffer").Buffer;
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonRpcProvider = exports.ErrorContext = exports.TypedError = void 0;
/**
 * This module contains the {@link JsonRpcProvider} client class
 * which can be used to interact with the NEAR RPC API.
 * @see {@link providers/provider} for a list of request and response types
 */
const depd_1 = __importDefault(require("depd"));
const provider_1 = require("./provider");
const web_1 = require("../utils/web");
const errors_1 = require("../utils/errors");
Object.defineProperty(exports, "TypedError", { enumerable: true, get: function () { return errors_1.TypedError; } });
Object.defineProperty(exports, "ErrorContext", { enumerable: true, get: function () { return errors_1.ErrorContext; } });
const borsh_1 = require("borsh");
const exponential_backoff_1 = __importDefault(require("../utils/exponential-backoff"));
const rpc_errors_1 = require("../utils/rpc_errors");
// Default number of retries before giving up on a request.
const REQUEST_RETRY_NUMBER = 12;
// Default wait until next retry in millis.
const REQUEST_RETRY_WAIT = 500;
// Exponential back off for waiting to retry.
const REQUEST_RETRY_WAIT_BACKOFF = 1.5;
/// Keep ids unique across all connections.
let _nextId = 123;
/**
 * Client class to interact with the NEAR RPC API.
 * @see {@link https://github.com/near/nearcore/tree/master/chain/jsonrpc}
 */
class JsonRpcProvider extends provider_1.Provider {
    /**
     * @param url RPC API endpoint URL
     */
    constructor(url) {
        super();
        this.connection = { url };
    }
    /**
     * Gets the RPC's status
     * @see {@link https://docs.near.org/docs/develop/front-end/rpc#general-validator-status}
     */
    async status() {
        return this.sendJsonRpc('status', []);
    }
    /**
     * Sends a signed transaction to the RPC and waits until transaction is fully complete
     * @see {@link https://docs.near.org/docs/develop/front-end/rpc#send-transaction-await}
     *
     * @param signedTransaction The signed transaction being sent
     */
    async sendTransaction(signedTransaction) {
        const bytes = signedTransaction.encode();
        return this.sendJsonRpc('broadcast_tx_commit', [Buffer.from(bytes).toString('base64')]);
    }
    /**
     * Sends a signed transaction to the RPC and immediately returns transaction hash
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#send-transaction-async)
     * @param signedTransaction The signed transaction being sent
     * @returns {Promise<FinalExecutionOutcome>}
     */
    async sendTransactionAsync(signedTransaction) {
        const bytes = signedTransaction.encode();
        return this.sendJsonRpc('broadcast_tx_async', [Buffer.from(bytes).toString('base64')]);
    }
    /**
     * Gets a transaction's status from the RPC
     * @see {@link https://docs.near.org/docs/develop/front-end/rpc#transaction-status}
     *
     * @param txHash A transaction hash as either a Uint8Array or a base58 encoded string
     * @param accountId The NEAR account that signed the transaction
     */
    async txStatus(txHash, accountId) {
        if (typeof txHash === 'string') {
            return this.txStatusString(txHash, accountId);
        }
        else {
            return this.txStatusUint8Array(txHash, accountId);
        }
    }
    async txStatusUint8Array(txHash, accountId) {
        return this.sendJsonRpc('tx', [borsh_1.baseEncode(txHash), accountId]);
    }
    async txStatusString(txHash, accountId) {
        return this.sendJsonRpc('tx', [txHash, accountId]);
    }
    /**
     * Gets a transaction's status from the RPC with receipts
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#transaction-status-with-receipts)
     * @param txHash The hash of the transaction
     * @param accountId The NEAR account that signed the transaction
     * @returns {Promise<FinalExecutionOutcome>}
     */
    async txStatusReceipts(txHash, accountId) {
        return this.sendJsonRpc('EXPERIMENTAL_tx_status', [borsh_1.baseEncode(txHash), accountId]);
    }
    /**
     * Query the RPC as [shown in the docs](https://docs.near.org/docs/develop/front-end/rpc#accounts--contracts)
     * Query the RPC by passing an {@link RpcQueryRequest}
     * @see {@link https://docs.near.org/docs/develop/front-end/rpc#accounts--contracts}
     *
     * @typeParam T the shape of the returned query response
     */
    async query(...args) {
        let result;
        if (args.length === 1) {
            result = await this.sendJsonRpc('query', args[0]);
        }
        else {
            const [path, data] = args;
            result = await this.sendJsonRpc('query', [path, data]);
        }
        if (result && result.error) {
            throw new errors_1.TypedError(`Querying ${args} failed: ${result.error}.\n${JSON.stringify(result, null, 2)}`, rpc_errors_1.getErrorTypeFromErrorMessage(result.error));
        }
        return result;
    }
    /**
     * Query for block info from the RPC
     * pass block_id OR finality as blockQuery, not both
     * @see {@link https://docs.near.org/docs/interaction/rpc#block}
     *
     * @param blockQuery {@link BlockReference} (passing a {@link BlockId} is deprecated)
     */
    async block(blockQuery) {
        const { finality } = blockQuery;
        let { blockId } = blockQuery;
        if (typeof blockQuery !== 'object') {
            const deprecate = depd_1.default('JsonRpcProvider.block(blockId)');
            deprecate('use `block({ blockId })` or `block({ finality })` instead');
            blockId = blockQuery;
        }
        return this.sendJsonRpc('block', { block_id: blockId, finality });
    }
    /**
     * Query changes in block from the RPC
     * pass block_id OR finality as blockQuery, not both
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#block-details)
     */
    async blockChanges(blockQuery) {
        const { finality } = blockQuery;
        const { blockId } = blockQuery;
        return this.sendJsonRpc('EXPERIMENTAL_changes_in_block', { block_id: blockId, finality });
    }
    /**
     * Queries for details about a specific chunk appending details of receipts and transactions to the same chunk data provided by a block
     * @see {@link https://docs.near.org/docs/interaction/rpc#chunk}
     *
     * @param chunkId Hash of a chunk ID or shard ID
     */
    async chunk(chunkId) {
        return this.sendJsonRpc('chunk', [chunkId]);
    }
    /**
     * Query validators of the epoch defined by the given block id.
     * @see {@link https://docs.near.org/docs/develop/front-end/rpc#detailed-validator-status}
     *
     * @param blockId Block hash or height, or null for latest.
     */
    async validators(blockId) {
        return this.sendJsonRpc('validators', [blockId]);
    }
    /**
     * @deprecated
     * Gets the genesis config from RPC
     * @see {@link https://docs.near.org/docs/develop/front-end/rpc#genesis-config}
     */
    async experimental_genesisConfig() {
        const deprecate = depd_1.default('JsonRpcProvider.experimental_protocolConfig({ sync_checkpoint: \'genesis\' })');
        deprecate('use `experimental_protocolConfig` to fetch the up-to-date or genesis protocol config explicitly');
        return await this.sendJsonRpc('EXPERIMENTAL_protocol_config', { sync_checkpoint: 'genesis' });
    }
    /**
     * Gets the protocol config at a block from RPC
     * @see {@link }
     *
     * @param blockReference specifies the block to get the protocol config for
     */
    async experimental_protocolConfig(blockReference) {
        return await this.sendJsonRpc('EXPERIMENTAL_protocol_config', blockReference);
    }
    /**
     * @deprecated Use {@link lightClientProof} instead
     */
    async experimental_lightClientProof(request) {
        const deprecate = depd_1.default('JsonRpcProvider.experimental_lightClientProof(request)');
        deprecate('use `lightClientProof` instead');
        return await this.lightClientProof(request);
    }
    /**
     * Gets a light client execution proof for verifying execution outcomes
     * @see {@link https://github.com/nearprotocol/NEPs/blob/master/specs/ChainSpec/LightClient.md#light-client-proof}
     */
    async lightClientProof(request) {
        return await this.sendJsonRpc('EXPERIMENTAL_light_client_proof', request);
    }
    /**
     * Gets access key changes for a given array of accountIds
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#view-access-key-changes-all)
     * @returns {Promise<ChangeResult>}
     */
    async accessKeyChanges(accountIdArray, blockQuery) {
        const { finality } = blockQuery;
        const { blockId } = blockQuery;
        return this.sendJsonRpc('EXPERIMENTAL_changes', {
            changes_type: 'all_access_key_changes',
            account_ids: accountIdArray,
            block_id: blockId,
            finality
        });
    }
    /**
     * Gets single access key changes for a given array of access keys
     * pass block_id OR finality as blockQuery, not both
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#view-access-key-changes-single)
     * @returns {Promise<ChangeResult>}
     */
    async singleAccessKeyChanges(accessKeyArray, blockQuery) {
        const { finality } = blockQuery;
        const { blockId } = blockQuery;
        return this.sendJsonRpc('EXPERIMENTAL_changes', {
            changes_type: 'single_access_key_changes',
            keys: accessKeyArray,
            block_id: blockId,
            finality
        });
    }
    /**
     * Gets account changes for a given array of accountIds
     * pass block_id OR finality as blockQuery, not both
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#view-account-changes)
     * @returns {Promise<ChangeResult>}
     */
    async accountChanges(accountIdArray, blockQuery) {
        const { finality } = blockQuery;
        const { blockId } = blockQuery;
        return this.sendJsonRpc('EXPERIMENTAL_changes', {
            changes_type: 'account_changes',
            account_ids: accountIdArray,
            block_id: blockId,
            finality
        });
    }
    /**
     * Gets contract state changes for a given array of accountIds
     * pass block_id OR finality as blockQuery, not both
     * Note: If you pass a keyPrefix it must be base64 encoded
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#view-contract-state-changes)
     * @returns {Promise<ChangeResult>}
     */
    async contractStateChanges(accountIdArray, blockQuery, keyPrefix = '') {
        const { finality } = blockQuery;
        const { blockId } = blockQuery;
        return this.sendJsonRpc('EXPERIMENTAL_changes', {
            changes_type: 'data_changes',
            account_ids: accountIdArray,
            key_prefix_base64: keyPrefix,
            block_id: blockId,
            finality
        });
    }
    /**
     * Gets contract code changes for a given array of accountIds
     * pass block_id OR finality as blockQuery, not both
     * Note: Change is returned in a base64 encoded WASM file
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#view-contract-code-changes)
     * @returns {Promise<ChangeResult>}
     */
    async contractCodeChanges(accountIdArray, blockQuery) {
        const { finality } = blockQuery;
        const { blockId } = blockQuery;
        return this.sendJsonRpc('EXPERIMENTAL_changes', {
            changes_type: 'contract_code_changes',
            account_ids: accountIdArray,
            block_id: blockId,
            finality
        });
    }
    /**
     * Returns gas price for a specific block_height or block_hash.
     * @see {@link https://docs.near.org/docs/develop/front-end/rpc#gas-price}
     *
     * @param blockId Block hash or height, or null for latest.
     */
    async gasPrice(blockId) {
        return await this.sendJsonRpc('gas_price', [blockId]);
    }
    /**
     * Directly call the RPC specifying the method and params
     *
     * @param method RPC method
     * @param params Parameters to the method
     */
    async sendJsonRpc(method, params) {
        const result = await exponential_backoff_1.default(REQUEST_RETRY_WAIT, REQUEST_RETRY_NUMBER, REQUEST_RETRY_WAIT_BACKOFF, async () => {
            try {
                const request = {
                    method,
                    params,
                    id: (_nextId++),
                    jsonrpc: '2.0'
                };
                const response = await web_1.fetchJson(this.connection, JSON.stringify(request));
                if (response.error) {
                    if (typeof response.error.data === 'object') {
                        if (typeof response.error.data.error_message === 'string' && typeof response.error.data.error_type === 'string') {
                            // if error data has error_message and error_type properties, we consider that node returned an error in the old format
                            throw new errors_1.TypedError(response.error.data.error_message, response.error.data.error_type);
                        }
                        throw rpc_errors_1.parseRpcError(response.error.data);
                    }
                    else {
                        const errorMessage = `[${response.error.code}] ${response.error.message}: ${response.error.data}`;
                        // NOTE: All this hackery is happening because structured errors not implemented
                        // TODO: Fix when https://github.com/nearprotocol/nearcore/issues/1839 gets resolved
                        if (response.error.data === 'Timeout' || errorMessage.includes('Timeout error')
                            || errorMessage.includes('query has timed out')) {
                            throw new errors_1.TypedError(errorMessage, 'TimeoutError');
                        }
                        throw new errors_1.TypedError(errorMessage, rpc_errors_1.getErrorTypeFromErrorMessage(response.error.data));
                    }
                }
                return response.result;
            }
            catch (error) {
                if (error.type === 'TimeoutError') {
                    console.warn(`Retrying request to ${method} as it has timed out`, params);
                    return null;
                }
                throw error;
            }
        });
        if (!result) {
            throw new errors_1.TypedError(`Exceeded ${REQUEST_RETRY_NUMBER} attempts for request to ${method}.`, 'RetriesExceeded');
        }
        return result;
    }
}
exports.JsonRpcProvider = JsonRpcProvider;

},{"depd":"../node_modules/near-api-js/node_modules/depd/lib/browser/index.js","./provider":"../node_modules/near-api-js/lib/providers/provider.js","../utils/web":"../node_modules/near-api-js/lib/utils/web.js","../utils/errors":"../node_modules/near-api-js/lib/utils/errors.js","borsh":"../node_modules/near-api-js/node_modules/borsh/lib/index.js","../utils/exponential-backoff":"../node_modules/near-api-js/lib/utils/exponential-backoff.js","../utils/rpc_errors":"../node_modules/near-api-js/lib/utils/rpc_errors.js","buffer":"../node_modules/node-libs-browser/node_modules/buffer/index.js"}],"../node_modules/near-api-js/lib/providers/index.js":[function(require,module,exports) {
"use strict";
/** @hidden @module */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorContext = exports.TypedError = exports.getTransactionLastResult = exports.FinalExecutionStatusBasic = exports.JsonRpcProvider = exports.Provider = void 0;
const provider_1 = require("./provider");
Object.defineProperty(exports, "Provider", { enumerable: true, get: function () { return provider_1.Provider; } });
Object.defineProperty(exports, "getTransactionLastResult", { enumerable: true, get: function () { return provider_1.getTransactionLastResult; } });
Object.defineProperty(exports, "FinalExecutionStatusBasic", { enumerable: true, get: function () { return provider_1.FinalExecutionStatusBasic; } });
const json_rpc_provider_1 = require("./json-rpc-provider");
Object.defineProperty(exports, "JsonRpcProvider", { enumerable: true, get: function () { return json_rpc_provider_1.JsonRpcProvider; } });
Object.defineProperty(exports, "TypedError", { enumerable: true, get: function () { return json_rpc_provider_1.TypedError; } });
Object.defineProperty(exports, "ErrorContext", { enumerable: true, get: function () { return json_rpc_provider_1.ErrorContext; } });

},{"./provider":"../node_modules/near-api-js/lib/providers/provider.js","./json-rpc-provider":"../node_modules/near-api-js/lib/providers/json-rpc-provider.js"}],"../node_modules/near-api-js/lib/utils/format.js":[function(require,module,exports) {
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseNearAmount = exports.formatNearAmount = exports.NEAR_NOMINATION = exports.NEAR_NOMINATION_EXP = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
/**
 * Exponent for calculating how many indivisible units are there in one NEAR. See {@link NEAR_NOMINATION}.
 */
exports.NEAR_NOMINATION_EXP = 24;
/**
 * Number of indivisible units in one NEAR. Derived from {@link NEAR_NOMINATION_EXP}.
 */
exports.NEAR_NOMINATION = new bn_js_1.default('10', 10).pow(new bn_js_1.default(exports.NEAR_NOMINATION_EXP, 10));
// Pre-calculate offests used for rounding to different number of digits
const ROUNDING_OFFSETS = [];
const BN10 = new bn_js_1.default(10);
for (let i = 0, offset = new bn_js_1.default(5); i < exports.NEAR_NOMINATION_EXP; i++, offset = offset.mul(BN10)) {
    ROUNDING_OFFSETS[i] = offset;
}
/**
 * Convert account balance value from internal indivisible units to NEAR. 1 NEAR is defined by {@link NEAR_NOMINATION}.
 * Effectively this divides given amount by {@link NEAR_NOMINATION}.
 *
 * @param balance decimal string representing balance in smallest non-divisible NEAR units (as specified by {@link NEAR_NOMINATION})
 * @param fracDigits number of fractional digits to preserve in formatted string. Balance is rounded to match given number of digits.
 * @returns Value in Ⓝ
 */
function formatNearAmount(balance, fracDigits = exports.NEAR_NOMINATION_EXP) {
    const balanceBN = new bn_js_1.default(balance, 10);
    if (fracDigits !== exports.NEAR_NOMINATION_EXP) {
        // Adjust balance for rounding at given number of digits
        const roundingExp = exports.NEAR_NOMINATION_EXP - fracDigits - 1;
        if (roundingExp > 0) {
            balanceBN.iadd(ROUNDING_OFFSETS[roundingExp]);
        }
    }
    balance = balanceBN.toString();
    const wholeStr = balance.substring(0, balance.length - exports.NEAR_NOMINATION_EXP) || '0';
    const fractionStr = balance.substring(balance.length - exports.NEAR_NOMINATION_EXP)
        .padStart(exports.NEAR_NOMINATION_EXP, '0').substring(0, fracDigits);
    return trimTrailingZeroes(`${formatWithCommas(wholeStr)}.${fractionStr}`);
}
exports.formatNearAmount = formatNearAmount;
/**
 * Convert human readable NEAR amount to internal indivisible units.
 * Effectively this multiplies given amount by {@link NEAR_NOMINATION}.
 *
 * @param amt decimal string (potentially fractional) denominated in NEAR.
 * @returns The parsed yoctoⓃ amount or null if no amount was passed in
 */
function parseNearAmount(amt) {
    if (!amt) {
        return null;
    }
    amt = cleanupAmount(amt);
    const split = amt.split('.');
    const wholePart = split[0];
    const fracPart = split[1] || '';
    if (split.length > 2 || fracPart.length > exports.NEAR_NOMINATION_EXP) {
        throw new Error(`Cannot parse '${amt}' as NEAR amount`);
    }
    return trimLeadingZeroes(wholePart + fracPart.padEnd(exports.NEAR_NOMINATION_EXP, '0'));
}
exports.parseNearAmount = parseNearAmount;
/**
 * Removes commas from the input
 * @param amount A value or amount that may contain commas
 * @returns string The cleaned value
 */
function cleanupAmount(amount) {
    return amount.replace(/,/g, '').trim();
}
/**
 * Removes .000… from an input
 * @param value A value that may contain trailing zeroes in the decimals place
 * @returns string The value without the trailing zeros
 */
function trimTrailingZeroes(value) {
    return value.replace(/\.?0*$/, '');
}
/**
 * Removes leading zeroes from an input
 * @param value A value that may contain leading zeroes
 * @returns string The value without the leading zeroes
 */
function trimLeadingZeroes(value) {
    value = value.replace(/^0+/, '');
    if (value === '') {
        return '0';
    }
    return value;
}
/**
 * Returns a human-readable value with commas
 * @param value A value that may not contain commas
 * @returns string A value with commas
 */
function formatWithCommas(value) {
    const pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(value)) {
        value = value.replace(pattern, '$1,$2');
    }
    return value;
}

},{"bn.js":"../node_modules/near-api-js/node_modules/bn.js/lib/bn.js"}],"../node_modules/near-api-js/lib/utils/index.js":[function(require,module,exports) {
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rpc_errors = exports.KeyPairEd25519 = exports.KeyPair = exports.PublicKey = exports.format = exports.enums = exports.web = exports.serialize = exports.key_pair = void 0;
const key_pair = __importStar(require("./key_pair"));
exports.key_pair = key_pair;
const serialize = __importStar(require("./serialize"));
exports.serialize = serialize;
const web = __importStar(require("./web"));
exports.web = web;
const enums = __importStar(require("./enums"));
exports.enums = enums;
const format = __importStar(require("./format"));
exports.format = format;
const rpc_errors = __importStar(require("./rpc_errors"));
exports.rpc_errors = rpc_errors;
const key_pair_1 = require("./key_pair");
Object.defineProperty(exports, "PublicKey", { enumerable: true, get: function () { return key_pair_1.PublicKey; } });
Object.defineProperty(exports, "KeyPair", { enumerable: true, get: function () { return key_pair_1.KeyPair; } });
Object.defineProperty(exports, "KeyPairEd25519", { enumerable: true, get: function () { return key_pair_1.KeyPairEd25519; } });

},{"./key_pair":"../node_modules/near-api-js/lib/utils/key_pair.js","./serialize":"../node_modules/near-api-js/lib/utils/serialize.js","./web":"../node_modules/near-api-js/lib/utils/web.js","./enums":"../node_modules/near-api-js/lib/utils/enums.js","./format":"../node_modules/near-api-js/lib/utils/format.js","./rpc_errors":"../node_modules/near-api-js/lib/utils/rpc_errors.js"}],"../node_modules/process/browser.js":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"../node_modules/js-sha256/src/sha256.js":[function(require,module,exports) {
var process = require("process");
var global = arguments[3];
var define;
var Buffer = require("buffer").Buffer;
/**
 * [js-sha256]{@link https://github.com/emn178/js-sha256}
 *
 * @version 0.9.0
 * @author Chen, Yi-Cyuan [emn178@gmail.com]
 * @copyright Chen, Yi-Cyuan 2014-2017
 * @license MIT
 */
/*jslint bitwise: true */
(function () {
  'use strict';

  var ERROR = 'input is invalid type';
  var WINDOW = typeof window === 'object';
  var root = WINDOW ? window : {};
  if (root.JS_SHA256_NO_WINDOW) {
    WINDOW = false;
  }
  var WEB_WORKER = !WINDOW && typeof self === 'object';
  var NODE_JS = !root.JS_SHA256_NO_NODE_JS && typeof process === 'object' && process.versions && process.versions.node;
  if (NODE_JS) {
    root = global;
  } else if (WEB_WORKER) {
    root = self;
  }
  var COMMON_JS = !root.JS_SHA256_NO_COMMON_JS && typeof module === 'object' && module.exports;
  var AMD = typeof define === 'function' && define.amd;
  var ARRAY_BUFFER = !root.JS_SHA256_NO_ARRAY_BUFFER && typeof ArrayBuffer !== 'undefined';
  var HEX_CHARS = '0123456789abcdef'.split('');
  var EXTRA = [-2147483648, 8388608, 32768, 128];
  var SHIFT = [24, 16, 8, 0];
  var K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];
  var OUTPUT_TYPES = ['hex', 'array', 'digest', 'arrayBuffer'];

  var blocks = [];

  if (root.JS_SHA256_NO_NODE_JS || !Array.isArray) {
    Array.isArray = function (obj) {
      return Object.prototype.toString.call(obj) === '[object Array]';
    };
  }

  if (ARRAY_BUFFER && (root.JS_SHA256_NO_ARRAY_BUFFER_IS_VIEW || !ArrayBuffer.isView)) {
    ArrayBuffer.isView = function (obj) {
      return typeof obj === 'object' && obj.buffer && obj.buffer.constructor === ArrayBuffer;
    };
  }

  var createOutputMethod = function (outputType, is224) {
    return function (message) {
      return new Sha256(is224, true).update(message)[outputType]();
    };
  };

  var createMethod = function (is224) {
    var method = createOutputMethod('hex', is224);
    if (NODE_JS) {
      method = nodeWrap(method, is224);
    }
    method.create = function () {
      return new Sha256(is224);
    };
    method.update = function (message) {
      return method.create().update(message);
    };
    for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
      var type = OUTPUT_TYPES[i];
      method[type] = createOutputMethod(type, is224);
    }
    return method;
  };

  var nodeWrap = function (method, is224) {
    var crypto = eval("require('crypto')");
    var Buffer = eval("require('buffer').Buffer");
    var algorithm = is224 ? 'sha224' : 'sha256';
    var nodeMethod = function (message) {
      if (typeof message === 'string') {
        return crypto.createHash(algorithm).update(message, 'utf8').digest('hex');
      } else {
        if (message === null || message === undefined) {
          throw new Error(ERROR);
        } else if (message.constructor === ArrayBuffer) {
          message = new Uint8Array(message);
        }
      }
      if (Array.isArray(message) || ArrayBuffer.isView(message) ||
        message.constructor === Buffer) {
        return crypto.createHash(algorithm).update(new Buffer(message)).digest('hex');
      } else {
        return method(message);
      }
    };
    return nodeMethod;
  };

  var createHmacOutputMethod = function (outputType, is224) {
    return function (key, message) {
      return new HmacSha256(key, is224, true).update(message)[outputType]();
    };
  };

  var createHmacMethod = function (is224) {
    var method = createHmacOutputMethod('hex', is224);
    method.create = function (key) {
      return new HmacSha256(key, is224);
    };
    method.update = function (key, message) {
      return method.create(key).update(message);
    };
    for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
      var type = OUTPUT_TYPES[i];
      method[type] = createHmacOutputMethod(type, is224);
    }
    return method;
  };

  function Sha256(is224, sharedMemory) {
    if (sharedMemory) {
      blocks[0] = blocks[16] = blocks[1] = blocks[2] = blocks[3] =
        blocks[4] = blocks[5] = blocks[6] = blocks[7] =
        blocks[8] = blocks[9] = blocks[10] = blocks[11] =
        blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
      this.blocks = blocks;
    } else {
      this.blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }

    if (is224) {
      this.h0 = 0xc1059ed8;
      this.h1 = 0x367cd507;
      this.h2 = 0x3070dd17;
      this.h3 = 0xf70e5939;
      this.h4 = 0xffc00b31;
      this.h5 = 0x68581511;
      this.h6 = 0x64f98fa7;
      this.h7 = 0xbefa4fa4;
    } else { // 256
      this.h0 = 0x6a09e667;
      this.h1 = 0xbb67ae85;
      this.h2 = 0x3c6ef372;
      this.h3 = 0xa54ff53a;
      this.h4 = 0x510e527f;
      this.h5 = 0x9b05688c;
      this.h6 = 0x1f83d9ab;
      this.h7 = 0x5be0cd19;
    }

    this.block = this.start = this.bytes = this.hBytes = 0;
    this.finalized = this.hashed = false;
    this.first = true;
    this.is224 = is224;
  }

  Sha256.prototype.update = function (message) {
    if (this.finalized) {
      return;
    }
    var notString, type = typeof message;
    if (type !== 'string') {
      if (type === 'object') {
        if (message === null) {
          throw new Error(ERROR);
        } else if (ARRAY_BUFFER && message.constructor === ArrayBuffer) {
          message = new Uint8Array(message);
        } else if (!Array.isArray(message)) {
          if (!ARRAY_BUFFER || !ArrayBuffer.isView(message)) {
            throw new Error(ERROR);
          }
        }
      } else {
        throw new Error(ERROR);
      }
      notString = true;
    }
    var code, index = 0, i, length = message.length, blocks = this.blocks;

    while (index < length) {
      if (this.hashed) {
        this.hashed = false;
        blocks[0] = this.block;
        blocks[16] = blocks[1] = blocks[2] = blocks[3] =
          blocks[4] = blocks[5] = blocks[6] = blocks[7] =
          blocks[8] = blocks[9] = blocks[10] = blocks[11] =
          blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
      }

      if (notString) {
        for (i = this.start; index < length && i < 64; ++index) {
          blocks[i >> 2] |= message[index] << SHIFT[i++ & 3];
        }
      } else {
        for (i = this.start; index < length && i < 64; ++index) {
          code = message.charCodeAt(index);
          if (code < 0x80) {
            blocks[i >> 2] |= code << SHIFT[i++ & 3];
          } else if (code < 0x800) {
            blocks[i >> 2] |= (0xc0 | (code >> 6)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
          } else if (code < 0xd800 || code >= 0xe000) {
            blocks[i >> 2] |= (0xe0 | (code >> 12)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
          } else {
            code = 0x10000 + (((code & 0x3ff) << 10) | (message.charCodeAt(++index) & 0x3ff));
            blocks[i >> 2] |= (0xf0 | (code >> 18)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | ((code >> 12) & 0x3f)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
          }
        }
      }

      this.lastByteIndex = i;
      this.bytes += i - this.start;
      if (i >= 64) {
        this.block = blocks[16];
        this.start = i - 64;
        this.hash();
        this.hashed = true;
      } else {
        this.start = i;
      }
    }
    if (this.bytes > 4294967295) {
      this.hBytes += this.bytes / 4294967296 << 0;
      this.bytes = this.bytes % 4294967296;
    }
    return this;
  };

  Sha256.prototype.finalize = function () {
    if (this.finalized) {
      return;
    }
    this.finalized = true;
    var blocks = this.blocks, i = this.lastByteIndex;
    blocks[16] = this.block;
    blocks[i >> 2] |= EXTRA[i & 3];
    this.block = blocks[16];
    if (i >= 56) {
      if (!this.hashed) {
        this.hash();
      }
      blocks[0] = this.block;
      blocks[16] = blocks[1] = blocks[2] = blocks[3] =
        blocks[4] = blocks[5] = blocks[6] = blocks[7] =
        blocks[8] = blocks[9] = blocks[10] = blocks[11] =
        blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
    }
    blocks[14] = this.hBytes << 3 | this.bytes >>> 29;
    blocks[15] = this.bytes << 3;
    this.hash();
  };

  Sha256.prototype.hash = function () {
    var a = this.h0, b = this.h1, c = this.h2, d = this.h3, e = this.h4, f = this.h5, g = this.h6,
      h = this.h7, blocks = this.blocks, j, s0, s1, maj, t1, t2, ch, ab, da, cd, bc;

    for (j = 16; j < 64; ++j) {
      // rightrotate
      t1 = blocks[j - 15];
      s0 = ((t1 >>> 7) | (t1 << 25)) ^ ((t1 >>> 18) | (t1 << 14)) ^ (t1 >>> 3);
      t1 = blocks[j - 2];
      s1 = ((t1 >>> 17) | (t1 << 15)) ^ ((t1 >>> 19) | (t1 << 13)) ^ (t1 >>> 10);
      blocks[j] = blocks[j - 16] + s0 + blocks[j - 7] + s1 << 0;
    }

    bc = b & c;
    for (j = 0; j < 64; j += 4) {
      if (this.first) {
        if (this.is224) {
          ab = 300032;
          t1 = blocks[0] - 1413257819;
          h = t1 - 150054599 << 0;
          d = t1 + 24177077 << 0;
        } else {
          ab = 704751109;
          t1 = blocks[0] - 210244248;
          h = t1 - 1521486534 << 0;
          d = t1 + 143694565 << 0;
        }
        this.first = false;
      } else {
        s0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
        s1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
        ab = a & b;
        maj = ab ^ (a & c) ^ bc;
        ch = (e & f) ^ (~e & g);
        t1 = h + s1 + ch + K[j] + blocks[j];
        t2 = s0 + maj;
        h = d + t1 << 0;
        d = t1 + t2 << 0;
      }
      s0 = ((d >>> 2) | (d << 30)) ^ ((d >>> 13) | (d << 19)) ^ ((d >>> 22) | (d << 10));
      s1 = ((h >>> 6) | (h << 26)) ^ ((h >>> 11) | (h << 21)) ^ ((h >>> 25) | (h << 7));
      da = d & a;
      maj = da ^ (d & b) ^ ab;
      ch = (h & e) ^ (~h & f);
      t1 = g + s1 + ch + K[j + 1] + blocks[j + 1];
      t2 = s0 + maj;
      g = c + t1 << 0;
      c = t1 + t2 << 0;
      s0 = ((c >>> 2) | (c << 30)) ^ ((c >>> 13) | (c << 19)) ^ ((c >>> 22) | (c << 10));
      s1 = ((g >>> 6) | (g << 26)) ^ ((g >>> 11) | (g << 21)) ^ ((g >>> 25) | (g << 7));
      cd = c & d;
      maj = cd ^ (c & a) ^ da;
      ch = (g & h) ^ (~g & e);
      t1 = f + s1 + ch + K[j + 2] + blocks[j + 2];
      t2 = s0 + maj;
      f = b + t1 << 0;
      b = t1 + t2 << 0;
      s0 = ((b >>> 2) | (b << 30)) ^ ((b >>> 13) | (b << 19)) ^ ((b >>> 22) | (b << 10));
      s1 = ((f >>> 6) | (f << 26)) ^ ((f >>> 11) | (f << 21)) ^ ((f >>> 25) | (f << 7));
      bc = b & c;
      maj = bc ^ (b & d) ^ cd;
      ch = (f & g) ^ (~f & h);
      t1 = e + s1 + ch + K[j + 3] + blocks[j + 3];
      t2 = s0 + maj;
      e = a + t1 << 0;
      a = t1 + t2 << 0;
    }

    this.h0 = this.h0 + a << 0;
    this.h1 = this.h1 + b << 0;
    this.h2 = this.h2 + c << 0;
    this.h3 = this.h3 + d << 0;
    this.h4 = this.h4 + e << 0;
    this.h5 = this.h5 + f << 0;
    this.h6 = this.h6 + g << 0;
    this.h7 = this.h7 + h << 0;
  };

  Sha256.prototype.hex = function () {
    this.finalize();

    var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3, h4 = this.h4, h5 = this.h5,
      h6 = this.h6, h7 = this.h7;

    var hex = HEX_CHARS[(h0 >> 28) & 0x0F] + HEX_CHARS[(h0 >> 24) & 0x0F] +
      HEX_CHARS[(h0 >> 20) & 0x0F] + HEX_CHARS[(h0 >> 16) & 0x0F] +
      HEX_CHARS[(h0 >> 12) & 0x0F] + HEX_CHARS[(h0 >> 8) & 0x0F] +
      HEX_CHARS[(h0 >> 4) & 0x0F] + HEX_CHARS[h0 & 0x0F] +
      HEX_CHARS[(h1 >> 28) & 0x0F] + HEX_CHARS[(h1 >> 24) & 0x0F] +
      HEX_CHARS[(h1 >> 20) & 0x0F] + HEX_CHARS[(h1 >> 16) & 0x0F] +
      HEX_CHARS[(h1 >> 12) & 0x0F] + HEX_CHARS[(h1 >> 8) & 0x0F] +
      HEX_CHARS[(h1 >> 4) & 0x0F] + HEX_CHARS[h1 & 0x0F] +
      HEX_CHARS[(h2 >> 28) & 0x0F] + HEX_CHARS[(h2 >> 24) & 0x0F] +
      HEX_CHARS[(h2 >> 20) & 0x0F] + HEX_CHARS[(h2 >> 16) & 0x0F] +
      HEX_CHARS[(h2 >> 12) & 0x0F] + HEX_CHARS[(h2 >> 8) & 0x0F] +
      HEX_CHARS[(h2 >> 4) & 0x0F] + HEX_CHARS[h2 & 0x0F] +
      HEX_CHARS[(h3 >> 28) & 0x0F] + HEX_CHARS[(h3 >> 24) & 0x0F] +
      HEX_CHARS[(h3 >> 20) & 0x0F] + HEX_CHARS[(h3 >> 16) & 0x0F] +
      HEX_CHARS[(h3 >> 12) & 0x0F] + HEX_CHARS[(h3 >> 8) & 0x0F] +
      HEX_CHARS[(h3 >> 4) & 0x0F] + HEX_CHARS[h3 & 0x0F] +
      HEX_CHARS[(h4 >> 28) & 0x0F] + HEX_CHARS[(h4 >> 24) & 0x0F] +
      HEX_CHARS[(h4 >> 20) & 0x0F] + HEX_CHARS[(h4 >> 16) & 0x0F] +
      HEX_CHARS[(h4 >> 12) & 0x0F] + HEX_CHARS[(h4 >> 8) & 0x0F] +
      HEX_CHARS[(h4 >> 4) & 0x0F] + HEX_CHARS[h4 & 0x0F] +
      HEX_CHARS[(h5 >> 28) & 0x0F] + HEX_CHARS[(h5 >> 24) & 0x0F] +
      HEX_CHARS[(h5 >> 20) & 0x0F] + HEX_CHARS[(h5 >> 16) & 0x0F] +
      HEX_CHARS[(h5 >> 12) & 0x0F] + HEX_CHARS[(h5 >> 8) & 0x0F] +
      HEX_CHARS[(h5 >> 4) & 0x0F] + HEX_CHARS[h5 & 0x0F] +
      HEX_CHARS[(h6 >> 28) & 0x0F] + HEX_CHARS[(h6 >> 24) & 0x0F] +
      HEX_CHARS[(h6 >> 20) & 0x0F] + HEX_CHARS[(h6 >> 16) & 0x0F] +
      HEX_CHARS[(h6 >> 12) & 0x0F] + HEX_CHARS[(h6 >> 8) & 0x0F] +
      HEX_CHARS[(h6 >> 4) & 0x0F] + HEX_CHARS[h6 & 0x0F];
    if (!this.is224) {
      hex += HEX_CHARS[(h7 >> 28) & 0x0F] + HEX_CHARS[(h7 >> 24) & 0x0F] +
        HEX_CHARS[(h7 >> 20) & 0x0F] + HEX_CHARS[(h7 >> 16) & 0x0F] +
        HEX_CHARS[(h7 >> 12) & 0x0F] + HEX_CHARS[(h7 >> 8) & 0x0F] +
        HEX_CHARS[(h7 >> 4) & 0x0F] + HEX_CHARS[h7 & 0x0F];
    }
    return hex;
  };

  Sha256.prototype.toString = Sha256.prototype.hex;

  Sha256.prototype.digest = function () {
    this.finalize();

    var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3, h4 = this.h4, h5 = this.h5,
      h6 = this.h6, h7 = this.h7;

    var arr = [
      (h0 >> 24) & 0xFF, (h0 >> 16) & 0xFF, (h0 >> 8) & 0xFF, h0 & 0xFF,
      (h1 >> 24) & 0xFF, (h1 >> 16) & 0xFF, (h1 >> 8) & 0xFF, h1 & 0xFF,
      (h2 >> 24) & 0xFF, (h2 >> 16) & 0xFF, (h2 >> 8) & 0xFF, h2 & 0xFF,
      (h3 >> 24) & 0xFF, (h3 >> 16) & 0xFF, (h3 >> 8) & 0xFF, h3 & 0xFF,
      (h4 >> 24) & 0xFF, (h4 >> 16) & 0xFF, (h4 >> 8) & 0xFF, h4 & 0xFF,
      (h5 >> 24) & 0xFF, (h5 >> 16) & 0xFF, (h5 >> 8) & 0xFF, h5 & 0xFF,
      (h6 >> 24) & 0xFF, (h6 >> 16) & 0xFF, (h6 >> 8) & 0xFF, h6 & 0xFF
    ];
    if (!this.is224) {
      arr.push((h7 >> 24) & 0xFF, (h7 >> 16) & 0xFF, (h7 >> 8) & 0xFF, h7 & 0xFF);
    }
    return arr;
  };

  Sha256.prototype.array = Sha256.prototype.digest;

  Sha256.prototype.arrayBuffer = function () {
    this.finalize();

    var buffer = new ArrayBuffer(this.is224 ? 28 : 32);
    var dataView = new DataView(buffer);
    dataView.setUint32(0, this.h0);
    dataView.setUint32(4, this.h1);
    dataView.setUint32(8, this.h2);
    dataView.setUint32(12, this.h3);
    dataView.setUint32(16, this.h4);
    dataView.setUint32(20, this.h5);
    dataView.setUint32(24, this.h6);
    if (!this.is224) {
      dataView.setUint32(28, this.h7);
    }
    return buffer;
  };

  function HmacSha256(key, is224, sharedMemory) {
    var i, type = typeof key;
    if (type === 'string') {
      var bytes = [], length = key.length, index = 0, code;
      for (i = 0; i < length; ++i) {
        code = key.charCodeAt(i);
        if (code < 0x80) {
          bytes[index++] = code;
        } else if (code < 0x800) {
          bytes[index++] = (0xc0 | (code >> 6));
          bytes[index++] = (0x80 | (code & 0x3f));
        } else if (code < 0xd800 || code >= 0xe000) {
          bytes[index++] = (0xe0 | (code >> 12));
          bytes[index++] = (0x80 | ((code >> 6) & 0x3f));
          bytes[index++] = (0x80 | (code & 0x3f));
        } else {
          code = 0x10000 + (((code & 0x3ff) << 10) | (key.charCodeAt(++i) & 0x3ff));
          bytes[index++] = (0xf0 | (code >> 18));
          bytes[index++] = (0x80 | ((code >> 12) & 0x3f));
          bytes[index++] = (0x80 | ((code >> 6) & 0x3f));
          bytes[index++] = (0x80 | (code & 0x3f));
        }
      }
      key = bytes;
    } else {
      if (type === 'object') {
        if (key === null) {
          throw new Error(ERROR);
        } else if (ARRAY_BUFFER && key.constructor === ArrayBuffer) {
          key = new Uint8Array(key);
        } else if (!Array.isArray(key)) {
          if (!ARRAY_BUFFER || !ArrayBuffer.isView(key)) {
            throw new Error(ERROR);
          }
        }
      } else {
        throw new Error(ERROR);
      }
    }

    if (key.length > 64) {
      key = (new Sha256(is224, true)).update(key).array();
    }

    var oKeyPad = [], iKeyPad = [];
    for (i = 0; i < 64; ++i) {
      var b = key[i] || 0;
      oKeyPad[i] = 0x5c ^ b;
      iKeyPad[i] = 0x36 ^ b;
    }

    Sha256.call(this, is224, sharedMemory);

    this.update(iKeyPad);
    this.oKeyPad = oKeyPad;
    this.inner = true;
    this.sharedMemory = sharedMemory;
  }
  HmacSha256.prototype = new Sha256();

  HmacSha256.prototype.finalize = function () {
    Sha256.prototype.finalize.call(this);
    if (this.inner) {
      this.inner = false;
      var innerHash = this.array();
      Sha256.call(this, this.is224, this.sharedMemory);
      this.update(this.oKeyPad);
      this.update(innerHash);
      Sha256.prototype.finalize.call(this);
    }
  };

  var exports = createMethod();
  exports.sha256 = exports;
  exports.sha224 = createMethod(true);
  exports.sha256.hmac = createHmacMethod();
  exports.sha224.hmac = createHmacMethod(true);

  if (COMMON_JS) {
    module.exports = exports;
  } else {
    root.sha256 = exports.sha256;
    root.sha224 = exports.sha224;
    if (AMD) {
      define(function () {
        return exports;
      });
    }
  }
})();

},{"process":"../node_modules/process/browser.js","buffer":"../node_modules/node-libs-browser/node_modules/buffer/index.js"}],"../node_modules/near-api-js/lib/transaction.js":[function(require,module,exports) {
var Buffer = require("buffer").Buffer;
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signTransaction = exports.createTransaction = exports.SCHEMA = exports.Action = exports.SignedTransaction = exports.Transaction = exports.Signature = exports.deleteAccount = exports.deleteKey = exports.addKey = exports.stake = exports.transfer = exports.functionCall = exports.deployContract = exports.createAccount = exports.DeleteAccount = exports.DeleteKey = exports.AddKey = exports.Stake = exports.Transfer = exports.FunctionCall = exports.DeployContract = exports.CreateAccount = exports.IAction = exports.functionCallAccessKey = exports.fullAccessKey = exports.AccessKey = exports.AccessKeyPermission = exports.FullAccessPermission = exports.FunctionCallPermission = void 0;
const js_sha256_1 = __importDefault(require("js-sha256"));
const enums_1 = require("./utils/enums");
const borsh_1 = require("borsh");
const key_pair_1 = require("./utils/key_pair");
class FunctionCallPermission extends enums_1.Assignable {
}
exports.FunctionCallPermission = FunctionCallPermission;
class FullAccessPermission extends enums_1.Assignable {
}
exports.FullAccessPermission = FullAccessPermission;
class AccessKeyPermission extends enums_1.Enum {
}
exports.AccessKeyPermission = AccessKeyPermission;
class AccessKey extends enums_1.Assignable {
}
exports.AccessKey = AccessKey;
function fullAccessKey() {
    return new AccessKey({ nonce: 0, permission: new AccessKeyPermission({ fullAccess: new FullAccessPermission({}) }) });
}
exports.fullAccessKey = fullAccessKey;
function functionCallAccessKey(receiverId, methodNames, allowance) {
    return new AccessKey({ nonce: 0, permission: new AccessKeyPermission({ functionCall: new FunctionCallPermission({ receiverId, allowance, methodNames }) }) });
}
exports.functionCallAccessKey = functionCallAccessKey;
class IAction extends enums_1.Assignable {
}
exports.IAction = IAction;
class CreateAccount extends IAction {
}
exports.CreateAccount = CreateAccount;
class DeployContract extends IAction {
}
exports.DeployContract = DeployContract;
class FunctionCall extends IAction {
}
exports.FunctionCall = FunctionCall;
class Transfer extends IAction {
}
exports.Transfer = Transfer;
class Stake extends IAction {
}
exports.Stake = Stake;
class AddKey extends IAction {
}
exports.AddKey = AddKey;
class DeleteKey extends IAction {
}
exports.DeleteKey = DeleteKey;
class DeleteAccount extends IAction {
}
exports.DeleteAccount = DeleteAccount;
function createAccount() {
    return new Action({ createAccount: new CreateAccount({}) });
}
exports.createAccount = createAccount;
function deployContract(code) {
    return new Action({ deployContract: new DeployContract({ code }) });
}
exports.deployContract = deployContract;
/**
 * Constructs {@link Action} instance representing contract method call.
 *
 * @param methodName the name of the method to call
 * @param args arguments to pass to method. Can be either plain JS object which gets serialized as JSON automatically
 *  or `Uint8Array` instance which represents bytes passed as is.
 * @param gas max amount of gas that method call can use
 * @param deposit amount of NEAR (in yoctoNEAR) to send together with the call
 */
function functionCall(methodName, args, gas, deposit) {
    const anyArgs = args;
    const isUint8Array = anyArgs.byteLength !== undefined && anyArgs.byteLength === anyArgs.length;
    const serializedArgs = isUint8Array ? args : Buffer.from(JSON.stringify(args));
    return new Action({ functionCall: new FunctionCall({ methodName, args: serializedArgs, gas, deposit }) });
}
exports.functionCall = functionCall;
function transfer(deposit) {
    return new Action({ transfer: new Transfer({ deposit }) });
}
exports.transfer = transfer;
function stake(stake, publicKey) {
    return new Action({ stake: new Stake({ stake, publicKey }) });
}
exports.stake = stake;
function addKey(publicKey, accessKey) {
    return new Action({ addKey: new AddKey({ publicKey, accessKey }) });
}
exports.addKey = addKey;
function deleteKey(publicKey) {
    return new Action({ deleteKey: new DeleteKey({ publicKey }) });
}
exports.deleteKey = deleteKey;
function deleteAccount(beneficiaryId) {
    return new Action({ deleteAccount: new DeleteAccount({ beneficiaryId }) });
}
exports.deleteAccount = deleteAccount;
class Signature extends enums_1.Assignable {
}
exports.Signature = Signature;
class Transaction extends enums_1.Assignable {
    encode() {
        return borsh_1.serialize(exports.SCHEMA, this);
    }
    static decode(bytes) {
        return borsh_1.deserialize(exports.SCHEMA, Transaction, bytes);
    }
}
exports.Transaction = Transaction;
class SignedTransaction extends enums_1.Assignable {
    encode() {
        return borsh_1.serialize(exports.SCHEMA, this);
    }
    static decode(bytes) {
        return borsh_1.deserialize(exports.SCHEMA, SignedTransaction, bytes);
    }
}
exports.SignedTransaction = SignedTransaction;
/**
 * Contains a list of the valid transaction Actions available with this API
 * @see {@link https://nomicon.io/RuntimeSpec/Actions.html | Actions Spec}
 */
class Action extends enums_1.Enum {
}
exports.Action = Action;
exports.SCHEMA = new Map([
    [Signature, { kind: 'struct', fields: [
                ['keyType', 'u8'],
                ['data', [64]]
            ] }],
    [SignedTransaction, { kind: 'struct', fields: [
                ['transaction', Transaction],
                ['signature', Signature]
            ] }],
    [Transaction, { kind: 'struct', fields: [
                ['signerId', 'string'],
                ['publicKey', key_pair_1.PublicKey],
                ['nonce', 'u64'],
                ['receiverId', 'string'],
                ['blockHash', [32]],
                ['actions', [Action]]
            ] }],
    [key_pair_1.PublicKey, { kind: 'struct', fields: [
                ['keyType', 'u8'],
                ['data', [32]]
            ] }],
    [AccessKey, { kind: 'struct', fields: [
                ['nonce', 'u64'],
                ['permission', AccessKeyPermission],
            ] }],
    [AccessKeyPermission, { kind: 'enum', field: 'enum', values: [
                ['functionCall', FunctionCallPermission],
                ['fullAccess', FullAccessPermission],
            ] }],
    [FunctionCallPermission, { kind: 'struct', fields: [
                ['allowance', { kind: 'option', type: 'u128' }],
                ['receiverId', 'string'],
                ['methodNames', ['string']],
            ] }],
    [FullAccessPermission, { kind: 'struct', fields: [] }],
    [Action, { kind: 'enum', field: 'enum', values: [
                ['createAccount', CreateAccount],
                ['deployContract', DeployContract],
                ['functionCall', FunctionCall],
                ['transfer', Transfer],
                ['stake', Stake],
                ['addKey', AddKey],
                ['deleteKey', DeleteKey],
                ['deleteAccount', DeleteAccount],
            ] }],
    [CreateAccount, { kind: 'struct', fields: [] }],
    [DeployContract, { kind: 'struct', fields: [
                ['code', ['u8']]
            ] }],
    [FunctionCall, { kind: 'struct', fields: [
                ['methodName', 'string'],
                ['args', ['u8']],
                ['gas', 'u64'],
                ['deposit', 'u128']
            ] }],
    [Transfer, { kind: 'struct', fields: [
                ['deposit', 'u128']
            ] }],
    [Stake, { kind: 'struct', fields: [
                ['stake', 'u128'],
                ['publicKey', key_pair_1.PublicKey]
            ] }],
    [AddKey, { kind: 'struct', fields: [
                ['publicKey', key_pair_1.PublicKey],
                ['accessKey', AccessKey]
            ] }],
    [DeleteKey, { kind: 'struct', fields: [
                ['publicKey', key_pair_1.PublicKey]
            ] }],
    [DeleteAccount, { kind: 'struct', fields: [
                ['beneficiaryId', 'string']
            ] }],
]);
function createTransaction(signerId, publicKey, receiverId, nonce, actions, blockHash) {
    return new Transaction({ signerId, publicKey, nonce, receiverId, actions, blockHash });
}
exports.createTransaction = createTransaction;
/**
 * Signs a given transaction from an account with given keys, applied to the given network
 * @param transaction The Transaction object to sign
 * @param signer The {Signer} object that assists with signing keys
 * @param accountId The human-readable NEAR account name
 * @param networkId The targeted network. (ex. default, betanet, etc…)
 */
async function signTransactionObject(transaction, signer, accountId, networkId) {
    const message = borsh_1.serialize(exports.SCHEMA, transaction);
    const hash = new Uint8Array(js_sha256_1.default.sha256.array(message));
    const signature = await signer.signMessage(message, accountId, networkId);
    const signedTx = new SignedTransaction({
        transaction,
        signature: new Signature({ keyType: transaction.publicKey.keyType, data: signature.signature })
    });
    return [hash, signedTx];
}
async function signTransaction(...args) {
    if (args[0].constructor === Transaction) {
        const [transaction, signer, accountId, networkId] = args;
        return signTransactionObject(transaction, signer, accountId, networkId);
    }
    else {
        const [receiverId, nonce, actions, blockHash, signer, accountId, networkId] = args;
        const publicKey = await signer.getPublicKey(accountId, networkId);
        const transaction = createTransaction(accountId, publicKey, receiverId, nonce, actions, blockHash);
        return signTransactionObject(transaction, signer, accountId, networkId);
    }
}
exports.signTransaction = signTransaction;

},{"js-sha256":"../node_modules/js-sha256/src/sha256.js","./utils/enums":"../node_modules/near-api-js/lib/utils/enums.js","borsh":"../node_modules/near-api-js/node_modules/borsh/lib/index.js","./utils/key_pair":"../node_modules/near-api-js/lib/utils/key_pair.js","buffer":"../node_modules/node-libs-browser/node_modules/buffer/index.js"}],"../node_modules/near-api-js/lib/validators.js":[function(require,module,exports) {
'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.diffEpochValidators = exports.findSeatPrice = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
/** Finds seat price given validators stakes and number of seats.
 *  Calculation follow the spec: https://nomicon.io/Economics/README.html#validator-selection
 * @params validators: current or next epoch validators.
 * @params numSeats: number of seats.
 */
function findSeatPrice(validators, numSeats) {
    const stakes = validators.map(v => new bn_js_1.default(v.stake, 10)).sort((a, b) => a.cmp(b));
    const num = new bn_js_1.default(numSeats);
    const stakesSum = stakes.reduce((a, b) => a.add(b));
    if (stakesSum.lt(num)) {
        throw new Error('Stakes are below seats');
    }
    // assert stakesSum >= numSeats
    let left = new bn_js_1.default(1), right = stakesSum.add(new bn_js_1.default(1));
    while (!left.eq(right.sub(new bn_js_1.default(1)))) {
        const mid = left.add(right).div(new bn_js_1.default(2));
        let found = false;
        let currentSum = new bn_js_1.default(0);
        for (let i = 0; i < stakes.length; ++i) {
            currentSum = currentSum.add(stakes[i].div(mid));
            if (currentSum.gte(num)) {
                left = mid;
                found = true;
                break;
            }
        }
        if (!found) {
            right = mid;
        }
    }
    return left;
}
exports.findSeatPrice = findSeatPrice;
/** Diff validators between current and next epoch.
 * Returns additions, subtractions and changes to validator set.
 * @params currentValidators: list of current validators.
 * @params nextValidators: list of next validators.
 */
function diffEpochValidators(currentValidators, nextValidators) {
    const validatorsMap = new Map();
    currentValidators.forEach(v => validatorsMap.set(v.account_id, v));
    const nextValidatorsSet = new Set(nextValidators.map(v => v.account_id));
    return {
        newValidators: nextValidators.filter(v => !validatorsMap.has(v.account_id)),
        removedValidators: currentValidators.filter(v => !nextValidatorsSet.has(v.account_id)),
        changedValidators: nextValidators.filter(v => (validatorsMap.has(v.account_id) && validatorsMap.get(v.account_id).stake != v.stake))
            .map(v => ({ current: validatorsMap.get(v.account_id), next: v }))
    };
}
exports.diffEpochValidators = diffEpochValidators;

},{"bn.js":"../node_modules/near-api-js/node_modules/bn.js/lib/bn.js"}],"../node_modules/near-api-js/lib/account.js":[function(require,module,exports) {
var Buffer = require("buffer").Buffer;
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
const depd_1 = __importDefault(require("depd"));
const transaction_1 = require("./transaction");
const providers_1 = require("./providers");
const borsh_1 = require("borsh");
const key_pair_1 = require("./utils/key_pair");
const errors_1 = require("./utils/errors");
const rpc_errors_1 = require("./utils/rpc_errors");
const exponential_backoff_1 = __importDefault(require("./utils/exponential-backoff"));
// Default amount of gas to be sent with the function calls. Used to pay for the fees
// incurred while running the contract execution. The unused amount will be refunded back to
// the originator.
// Due to protocol changes that charge upfront for the maximum possible gas price inflation due to
// full blocks, the price of max_prepaid_gas is decreased to `300 * 10**12`.
// For discussion see https://github.com/nearprotocol/NEPs/issues/67
const DEFAULT_FUNC_CALL_GAS = new bn_js_1.default('30000000000000');
// Default number of retries with different nonce before giving up on a transaction.
const TX_NONCE_RETRY_NUMBER = 12;
// Default wait until next retry in millis.
const TX_NONCE_RETRY_WAIT = 500;
// Exponential back off for waiting to retry.
const TX_NONCE_RETRY_WAIT_BACKOFF = 1.5;
function parseJsonFromRawResponse(response) {
    return JSON.parse(Buffer.from(response).toString());
}
/**
 * This class provides common account related RPC calls including signing transactions with a {@link KeyPair}.
 *
 * @example {@link https://docs.near.org/docs/develop/front-end/naj-quick-reference#account}
 * @hint Use {@link WalletConnection} in the browser to redirect to {@link https://docs.near.org/docs/tools/near-wallet | NEAR Wallet} for Account/key management using the {@link BrowserLocalStorageKeyStore}.
 * @see {@link https://nomicon.io/DataStructures/Account.html | Account Spec}
 */
class Account {
    constructor(connection, accountId) {
        /** @hidden */
        this.accessKeyByPublicKeyCache = {};
        this.connection = connection;
        this.accountId = accountId;
    }
    /** @hidden */
    get ready() {
        const deprecate = depd_1.default('Account.ready()');
        deprecate('not needed anymore, always ready');
        return Promise.resolve();
    }
    async fetchState() {
        const deprecate = depd_1.default('Account.fetchState()');
        deprecate('use `Account.state()` instead');
    }
    /**
     * Returns basic NEAR account information via the `view_account` RPC query method
     * @see {@link https://docs.near.org/docs/develop/front-end/rpc#view-account}
     */
    async state() {
        return this.connection.provider.query({
            request_type: 'view_account',
            account_id: this.accountId,
            finality: 'optimistic'
        });
    }
    /** @hidden */
    printLogsAndFailures(contractId, results) {
        for (const result of results) {
            console.log(`Receipt${result.receiptIds.length > 1 ? 's' : ''}: ${result.receiptIds.join(', ')}`);
            this.printLogs(contractId, result.logs, '\t');
            if (result.failure) {
                console.warn(`\tFailure [${contractId}]: ${result.failure}`);
            }
        }
    }
    /** @hidden */
    printLogs(contractId, logs, prefix = '') {
        for (const log of logs) {
            console.log(`${prefix}Log [${contractId}]: ${log}`);
        }
    }
    /**
     * Create a signed transaction which can be broadcast to the network
     * @param receiverId NEAR account receiving the transaction
     * @param actions list of actions to perform as part of the transaction
     * @see {@link JsonRpcProvider.sendTransaction}
     */
    async signTransaction(receiverId, actions) {
        const accessKeyInfo = await this.findAccessKey(receiverId, actions);
        if (!accessKeyInfo) {
            throw new providers_1.TypedError(`Can not sign transactions for account ${this.accountId} on network ${this.connection.networkId}, no matching key pair found in ${this.connection.signer}.`, 'KeyNotFound');
        }
        const { accessKey } = accessKeyInfo;
        const block = await this.connection.provider.block({ finality: 'final' });
        const blockHash = block.header.hash;
        const nonce = ++accessKey.nonce;
        return await transaction_1.signTransaction(receiverId, nonce, actions, borsh_1.baseDecode(blockHash), this.connection.signer, this.accountId, this.connection.networkId);
    }
    signAndSendTransaction(...args) {
        if (typeof args[0] === 'string') {
            return this.signAndSendTransactionV1(args[0], args[1]);
        }
        else {
            return this.signAndSendTransactionV2(args[0]);
        }
    }
    signAndSendTransactionV1(receiverId, actions) {
        const deprecate = depd_1.default('Account.signAndSendTransaction(receiverId, actions');
        deprecate('use `Account.signAndSendTransaction(SignAndSendTransactionOptions)` instead');
        return this.signAndSendTransactionV2({ receiverId, actions });
    }
    async signAndSendTransactionV2({ receiverId, actions }) {
        let txHash, signedTx;
        // TODO: TX_NONCE (different constants for different uses of exponentialBackoff?)
        const result = await exponential_backoff_1.default(TX_NONCE_RETRY_WAIT, TX_NONCE_RETRY_NUMBER, TX_NONCE_RETRY_WAIT_BACKOFF, async () => {
            [txHash, signedTx] = await this.signTransaction(receiverId, actions);
            const publicKey = signedTx.transaction.publicKey;
            try {
                return await this.connection.provider.sendTransaction(signedTx);
            }
            catch (error) {
                if (error.type === 'InvalidNonce') {
                    console.warn(`Retrying transaction ${receiverId}:${borsh_1.baseEncode(txHash)} with new nonce.`);
                    delete this.accessKeyByPublicKeyCache[publicKey.toString()];
                    return null;
                }
                error.context = new providers_1.ErrorContext(borsh_1.baseEncode(txHash));
                throw error;
            }
        });
        if (!result) {
            // TODO: This should have different code actually, as means "transaction not submitted for sure"
            throw new providers_1.TypedError('nonce retries exceeded for transaction. This usually means there are too many parallel requests with the same access key.', 'RetriesExceeded');
        }
        const flatLogs = [result.transaction_outcome, ...result.receipts_outcome].reduce((acc, it) => {
            if (it.outcome.logs.length ||
                (typeof it.outcome.status === 'object' && typeof it.outcome.status.Failure === 'object')) {
                return acc.concat({
                    'receiptIds': it.outcome.receipt_ids,
                    'logs': it.outcome.logs,
                    'failure': typeof it.outcome.status.Failure != 'undefined' ? rpc_errors_1.parseRpcError(it.outcome.status.Failure) : null
                });
            }
            else
                return acc;
        }, []);
        this.printLogsAndFailures(signedTx.transaction.receiverId, flatLogs);
        if (typeof result.status === 'object' && typeof result.status.Failure === 'object') {
            // if error data has error_message and error_type properties, we consider that node returned an error in the old format
            if (result.status.Failure.error_message && result.status.Failure.error_type) {
                throw new providers_1.TypedError(`Transaction ${result.transaction_outcome.id} failed. ${result.status.Failure.error_message}`, result.status.Failure.error_type);
            }
            else {
                throw rpc_errors_1.parseResultError(result);
            }
        }
        // TODO: if Tx is Unknown or Started.
        return result;
    }
    /**
     * Finds the {@link AccessKeyView} associated with the accounts {@link PublicKey} stored in the {@link KeyStore}.
     *
     * @todo Find matching access key based on transaction (i.e. receiverId and actions)
     *
     * @param receiverId currently unused (see todo)
     * @param actions currently unused (see todo)
     * @returns `{ publicKey PublicKey; accessKey: AccessKeyView }`
     */
    async findAccessKey(receiverId, actions) {
        // TODO: Find matching access key based on transaction (i.e. receiverId and actions)
        const publicKey = await this.connection.signer.getPublicKey(this.accountId, this.connection.networkId);
        if (!publicKey) {
            return null;
        }
        const cachedAccessKey = this.accessKeyByPublicKeyCache[publicKey.toString()];
        if (cachedAccessKey !== undefined) {
            return { publicKey, accessKey: cachedAccessKey };
        }
        try {
            const accessKey = await this.connection.provider.query({
                request_type: 'view_access_key',
                account_id: this.accountId,
                public_key: publicKey.toString(),
                finality: 'optimistic'
            });
            // this function can be called multiple times and retrieve the same access key
            // this checks to see if the access key was already retrieved and cached while
            // the above network call was in flight. To keep nonce values in line, we return
            // the cached access key.
            if (this.accessKeyByPublicKeyCache[publicKey.toString()]) {
                return { publicKey, accessKey: this.accessKeyByPublicKeyCache[publicKey.toString()] };
            }
            this.accessKeyByPublicKeyCache[publicKey.toString()] = accessKey;
            return { publicKey, accessKey };
        }
        catch (e) {
            if (e.type == 'AccessKeyDoesNotExist') {
                return null;
            }
            throw e;
        }
    }
    /**
     * Create a new account and deploy a contract to it
     *
     * @param contractId NEAR account where the contract is deployed
     * @param publicKey The public key to add to the created contract account
     * @param data The compiled contract code
     */
    async createAndDeployContract(contractId, publicKey, data, amount) {
        const accessKey = transaction_1.fullAccessKey();
        await this.signAndSendTransaction({
            receiverId: contractId,
            actions: [transaction_1.createAccount(), transaction_1.transfer(amount), transaction_1.addKey(key_pair_1.PublicKey.from(publicKey), accessKey), transaction_1.deployContract(data)]
        });
        const contractAccount = new Account(this.connection, contractId);
        return contractAccount;
    }
    /**
     * @param receiverId NEAR account receiving Ⓝ
     * @param amount Amount to send in yoctoⓃ
     */
    async sendMoney(receiverId, amount) {
        return this.signAndSendTransaction({
            receiverId,
            actions: [transaction_1.transfer(amount)]
        });
    }
    /**
     * @param newAccountId NEAR account name to be created
     * @param publicKey A public key created from the masterAccount
     */
    async createAccount(newAccountId, publicKey, amount) {
        const accessKey = transaction_1.fullAccessKey();
        return this.signAndSendTransaction({
            receiverId: newAccountId,
            actions: [transaction_1.createAccount(), transaction_1.transfer(amount), transaction_1.addKey(key_pair_1.PublicKey.from(publicKey), accessKey)]
        });
    }
    /**
     * @param beneficiaryId The NEAR account that will receive the remaining Ⓝ balance from the account being deleted
     */
    async deleteAccount(beneficiaryId) {
        return this.signAndSendTransaction({
            receiverId: this.accountId,
            actions: [transaction_1.deleteAccount(beneficiaryId)]
        });
    }
    /**
     * @param data The compiled contract code
     */
    async deployContract(data) {
        return this.signAndSendTransaction({
            receiverId: this.accountId,
            actions: [transaction_1.deployContract(data)]
        });
    }
    async functionCall(...args) {
        if (typeof args[0] === 'string') {
            return this.functionCallV1(args[0], args[1], args[2], args[3], args[4]);
        }
        else {
            return this.functionCallV2(args[0]);
        }
    }
    functionCallV1(contractId, methodName, args, gas, amount) {
        const deprecate = depd_1.default('Account.functionCall(contractId, methodName, args, gas, amount)');
        deprecate('use `Account.functionCall(FunctionCallOptions)` instead');
        args = args || {};
        this.validateArgs(args);
        return this.signAndSendTransaction({
            receiverId: contractId,
            actions: [transaction_1.functionCall(methodName, args, gas || DEFAULT_FUNC_CALL_GAS, amount)]
        });
    }
    functionCallV2({ contractId, methodName, args = {}, gas = DEFAULT_FUNC_CALL_GAS, attachedDeposit, walletMeta, walletCallbackUrl }) {
        this.validateArgs(args);
        return this.signAndSendTransaction({
            receiverId: contractId,
            actions: [transaction_1.functionCall(methodName, args, gas, attachedDeposit)],
            walletMeta,
            walletCallbackUrl
        });
    }
    /**
     * @see {@link https://docs.near.org/docs/concepts/account#access-keys}
     * @todo expand this API to support more options.
     * @param publicKey A public key to be associated with the contract
     * @param contractId NEAR account where the contract is deployed
     * @param methodNames The method names on the contract that should be allowed to be called. Pass null for no method names and '' or [] for any method names.
     * @param amount Payment in yoctoⓃ that is sent to the contract during this function call
     */
    async addKey(publicKey, contractId, methodNames, amount) {
        if (!methodNames) {
            methodNames = [];
        }
        if (!Array.isArray(methodNames)) {
            methodNames = [methodNames];
        }
        let accessKey;
        if (!contractId) {
            accessKey = transaction_1.fullAccessKey();
        }
        else {
            accessKey = transaction_1.functionCallAccessKey(contractId, methodNames, amount);
        }
        return this.signAndSendTransaction({
            receiverId: this.accountId,
            actions: [transaction_1.addKey(key_pair_1.PublicKey.from(publicKey), accessKey)]
        });
    }
    /**
     * @param publicKey The public key to be deleted
     * @returns {Promise<FinalExecutionOutcome>}
     */
    async deleteKey(publicKey) {
        return this.signAndSendTransaction({
            receiverId: this.accountId,
            actions: [transaction_1.deleteKey(key_pair_1.PublicKey.from(publicKey))]
        });
    }
    /**
     * @see {@link https://docs.near.org/docs/validator/staking-overview}
     *
     * @param publicKey The public key for the account that's staking
     * @param amount The account to stake in yoctoⓃ
     */
    async stake(publicKey, amount) {
        return this.signAndSendTransaction({
            receiverId: this.accountId,
            actions: [transaction_1.stake(amount, key_pair_1.PublicKey.from(publicKey))]
        });
    }
    /** @hidden */
    validateArgs(args) {
        const isUint8Array = args.byteLength !== undefined && args.byteLength === args.length;
        if (isUint8Array) {
            return;
        }
        if (Array.isArray(args) || typeof args !== 'object') {
            throw new errors_1.PositionalArgsError();
        }
    }
    /**
     * Invoke a contract view function using the RPC API.
     * @see {@link https://docs.near.org/docs/develop/front-end/rpc#call-a-contract-function}
     *
     * @param contractId NEAR account where the contract is deployed
     * @param methodName The view-only method (no state mutations) name on the contract as it is written in the contract code
     * @param args Any arguments to the view contract method, wrapped in JSON
     * @returns {Promise<any>}
     */
    async viewFunction(contractId, methodName, args = {}, { parse = parseJsonFromRawResponse } = {}) {
        this.validateArgs(args);
        const result = await this.connection.provider.query({
            request_type: 'call_function',
            account_id: contractId,
            method_name: methodName,
            args_base64: Buffer.from(JSON.stringify(args)).toString('base64'),
            finality: 'optimistic'
        });
        if (result.logs) {
            this.printLogs(contractId, result.logs);
        }
        return result.result && result.result.length > 0 && parse(Buffer.from(result.result));
    }
    /**
     * Returns the state (key value pairs) of this account's contract based on the key prefix.
     * Pass an empty string for prefix if you would like to return the entire state.
     * @see {@link https://docs.near.org/docs/develop/front-end/rpc#view-contract-state}
     *
     * @param prefix allows to filter which keys should be returned. Empty prefix means all keys. String prefix is utf-8 encoded.
     * @param blockQuery specifies which block to query state at. By default returns last "optimistic" block (i.e. not necessarily finalized).
     */
    async viewState(prefix, blockQuery = { finality: 'optimistic' }) {
        const { values } = await this.connection.provider.query({
            request_type: 'view_state',
            ...blockQuery,
            account_id: this.accountId,
            prefix_base64: Buffer.from(prefix).toString('base64')
        });
        return values.map(({ key, value }) => ({
            key: Buffer.from(key, 'base64'),
            value: Buffer.from(value, 'base64')
        }));
    }
    /**
     * Get all access keys for the account
     * @see {@link https://docs.near.org/docs/develop/front-end/rpc#view-access-key-list}
     */
    async getAccessKeys() {
        const response = await this.connection.provider.query({
            request_type: 'view_access_key_list',
            account_id: this.accountId,
            finality: 'optimistic'
        });
        // A breaking API change introduced extra information into the
        // response, so it now returns an object with a `keys` field instead
        // of an array: https://github.com/nearprotocol/nearcore/pull/1789
        if (Array.isArray(response)) {
            return response;
        }
        return response.keys;
    }
    /**
     * Returns a list of authorized apps
     * @todo update the response value to return all the different keys, not just app keys.
     */
    async getAccountDetails() {
        // TODO: update the response value to return all the different keys, not just app keys.
        // Also if we need this function, or getAccessKeys is good enough.
        const accessKeys = await this.getAccessKeys();
        const authorizedApps = accessKeys
            .filter(item => item.access_key.permission !== 'FullAccess')
            .map(item => {
            const perm = item.access_key.permission;
            return {
                contractId: perm.FunctionCall.receiver_id,
                amount: perm.FunctionCall.allowance,
                publicKey: item.public_key,
            };
        });
        return { authorizedApps };
    }
    /**
     * Returns calculated account balance
     */
    async getAccountBalance() {
        const protocolConfig = await this.connection.provider.experimental_protocolConfig({ finality: 'final' });
        const state = await this.state();
        const costPerByte = new bn_js_1.default(protocolConfig.runtime_config.storage_amount_per_byte);
        const stateStaked = new bn_js_1.default(state.storage_usage).mul(costPerByte);
        const staked = new bn_js_1.default(state.locked);
        const totalBalance = new bn_js_1.default(state.amount).add(staked);
        const availableBalance = totalBalance.sub(bn_js_1.default.max(staked, stateStaked));
        return {
            total: totalBalance.toString(),
            stateStaked: stateStaked.toString(),
            staked: staked.toString(),
            available: availableBalance.toString()
        };
    }
}
exports.Account = Account;

},{"bn.js":"../node_modules/near-api-js/node_modules/bn.js/lib/bn.js","depd":"../node_modules/near-api-js/node_modules/depd/lib/browser/index.js","./transaction":"../node_modules/near-api-js/lib/transaction.js","./providers":"../node_modules/near-api-js/lib/providers/index.js","borsh":"../node_modules/near-api-js/node_modules/borsh/lib/index.js","./utils/key_pair":"../node_modules/near-api-js/lib/utils/key_pair.js","./utils/errors":"../node_modules/near-api-js/lib/utils/errors.js","./utils/rpc_errors":"../node_modules/near-api-js/lib/utils/rpc_errors.js","./utils/exponential-backoff":"../node_modules/near-api-js/lib/utils/exponential-backoff.js","buffer":"../node_modules/node-libs-browser/node_modules/buffer/index.js"}],"../node_modules/near-api-js/lib/account_multisig.js":[function(require,module,exports) {
var Buffer = require("buffer").Buffer;
'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account2FA = exports.AccountMultisig = exports.MULTISIG_CONFIRM_METHODS = exports.MULTISIG_CHANGE_METHODS = exports.MULTISIG_DEPOSIT = exports.MULTISIG_GAS = exports.MULTISIG_ALLOWANCE = exports.MULTISIG_STORAGE_KEY = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
const account_1 = require("./account");
const format_1 = require("./utils/format");
const key_pair_1 = require("./utils/key_pair");
const transaction_1 = require("./transaction");
const web_1 = require("./utils/web");
exports.MULTISIG_STORAGE_KEY = '__multisigRequest';
exports.MULTISIG_ALLOWANCE = new bn_js_1.default(format_1.parseNearAmount('1'));
// TODO: Different gas value for different requests (can reduce gas usage dramatically)
exports.MULTISIG_GAS = new bn_js_1.default('100000000000000');
exports.MULTISIG_DEPOSIT = new bn_js_1.default('0');
exports.MULTISIG_CHANGE_METHODS = ['add_request', 'add_request_and_confirm', 'delete_request', 'confirm'];
exports.MULTISIG_CONFIRM_METHODS = ['confirm'];
// in memory request cache for node w/o localStorage
const storageFallback = {
    [exports.MULTISIG_STORAGE_KEY]: null
};
class AccountMultisig extends account_1.Account {
    constructor(connection, accountId, options) {
        super(connection, accountId);
        this.storage = options.storage;
        this.onAddRequestResult = options.onAddRequestResult;
    }
    async signAndSendTransactionWithAccount(receiverId, actions) {
        return super.signAndSendTransaction(receiverId, actions);
    }
    signAndSendTransaction(...args) {
        if (typeof args[0] === 'string') {
            return this._signAndSendTransaction({ receiverId: args[0], actions: args[1] });
        }
        return this._signAndSendTransaction(args[0]);
    }
    async _signAndSendTransaction({ receiverId, actions }) {
        const { accountId } = this;
        const args = Buffer.from(JSON.stringify({
            request: {
                receiver_id: receiverId,
                actions: convertActions(actions, accountId, receiverId)
            }
        }));
        let result;
        try {
            result = await super.signAndSendTransaction(accountId, [
                transaction_1.functionCall('add_request_and_confirm', args, exports.MULTISIG_GAS, exports.MULTISIG_DEPOSIT)
            ]);
        }
        catch (e) {
            if (e.toString().includes('Account has too many active requests. Confirm or delete some')) {
                await this.deleteUnconfirmedRequests();
                return await this.signAndSendTransaction(receiverId, actions);
            }
            throw e;
        }
        // TODO: Are following even needed? Seems like it throws on error already
        if (!result.status) {
            throw new Error('Request failed');
        }
        const status = { ...result.status };
        if (!status.SuccessValue || typeof status.SuccessValue !== 'string') {
            throw new Error('Request failed');
        }
        this.setRequest({
            accountId,
            actions,
            requestId: parseInt(Buffer.from(status.SuccessValue, 'base64').toString('ascii'), 10)
        });
        if (this.onAddRequestResult) {
            await this.onAddRequestResult(result);
        }
        // NOTE there is no await on purpose to avoid blocking for 2fa
        this.deleteUnconfirmedRequests();
        return result;
    }
    async deleteUnconfirmedRequests() {
        // TODO: Delete in batch, don't delete unexpired
        // TODO: Delete in batch, don't delete unexpired (can reduce gas usage dramatically)
        const request_ids = await this.getRequestIds();
        const { requestId } = this.getRequest();
        for (const requestIdToDelete of request_ids) {
            if (requestIdToDelete == requestId) {
                continue;
            }
            try {
                await super.signAndSendTransaction(this.accountId, [transaction_1.functionCall('delete_request', { request_id: requestIdToDelete }, exports.MULTISIG_GAS, exports.MULTISIG_DEPOSIT)]);
            }
            catch (e) {
                console.warn('Attempt to delete an earlier request before 15 minutes failed. Will try again.');
            }
        }
    }
    // helpers
    async getRequestIds() {
        // TODO: Read requests from state to allow filtering by expiration time
        // TODO: https://github.com/near/core-contracts/blob/305d1db4f4f2cf5ce4c1ef3479f7544957381f11/multisig/src/lib.rs#L84
        return this.viewFunction(this.accountId, 'list_request_ids');
    }
    getRequest() {
        if (this.storage) {
            return JSON.parse(this.storage.getItem(exports.MULTISIG_STORAGE_KEY) || '{}');
        }
        return storageFallback[exports.MULTISIG_STORAGE_KEY];
    }
    setRequest(data) {
        if (this.storage) {
            return this.storage.setItem(exports.MULTISIG_STORAGE_KEY, JSON.stringify(data));
        }
        storageFallback[exports.MULTISIG_STORAGE_KEY] = data;
    }
}
exports.AccountMultisig = AccountMultisig;
class Account2FA extends AccountMultisig {
    constructor(connection, accountId, options) {
        super(connection, accountId, options);
        this.helperUrl = 'https://helper.testnet.near.org';
        this.helperUrl = options.helperUrl || this.helperUrl;
        this.storage = options.storage;
        this.sendCode = options.sendCode || this.sendCodeDefault;
        this.getCode = options.getCode || this.getCodeDefault;
        this.verifyCode = options.verifyCode || this.verifyCodeDefault;
        this.onConfirmResult = options.onConfirmResult;
    }
    async signAndSendTransaction(receiverId, actions) {
        await super.signAndSendTransaction(receiverId, actions);
        // TODO: Should following override onRequestResult in superclass instead of doing custom signAndSendTransaction?
        await this.sendCode();
        const result = await this.promptAndVerify();
        if (this.onConfirmResult) {
            await this.onConfirmResult(result);
        }
        return result;
    }
    // default helpers for CH deployments of multisig
    async deployMultisig(contractBytes) {
        const { accountId } = this;
        const seedOrLedgerKey = (await this.getRecoveryMethods()).data
            .filter(({ kind, publicKey }) => (kind === 'phrase' || kind === 'ledger') && publicKey !== null)
            .map((rm) => rm.publicKey);
        const fak2lak = (await this.getAccessKeys())
            .filter(({ public_key, access_key: { permission } }) => permission === 'FullAccess' && !seedOrLedgerKey.includes(public_key))
            .map((ak) => ak.public_key)
            .map(toPK);
        const confirmOnlyKey = toPK((await this.postSignedJson('/2fa/getAccessKey', { accountId })).publicKey);
        const newArgs = Buffer.from(JSON.stringify({ 'num_confirmations': 2 }));
        const actions = [
            ...fak2lak.map((pk) => transaction_1.deleteKey(pk)),
            ...fak2lak.map((pk) => transaction_1.addKey(pk, transaction_1.functionCallAccessKey(accountId, exports.MULTISIG_CHANGE_METHODS, null))),
            transaction_1.addKey(confirmOnlyKey, transaction_1.functionCallAccessKey(accountId, exports.MULTISIG_CONFIRM_METHODS, null)),
            transaction_1.deployContract(contractBytes),
        ];
        if ((await this.state()).code_hash === '11111111111111111111111111111111') {
            actions.push(transaction_1.functionCall('new', newArgs, exports.MULTISIG_GAS, exports.MULTISIG_DEPOSIT));
        }
        console.log('deploying multisig contract for', accountId);
        return await super.signAndSendTransactionWithAccount(accountId, actions);
    }
    async disable(contractBytes) {
        const { accountId } = this;
        const accessKeys = await this.getAccessKeys();
        const lak2fak = accessKeys
            .filter(({ access_key }) => access_key.permission !== 'FullAccess')
            .filter(({ access_key }) => {
            const perm = access_key.permission.FunctionCall;
            return perm.receiver_id === accountId &&
                perm.method_names.length === 4 &&
                perm.method_names.includes('add_request_and_confirm');
        });
        const confirmOnlyKey = key_pair_1.PublicKey.from((await this.postSignedJson('/2fa/getAccessKey', { accountId })).publicKey);
        const actions = [
            transaction_1.deleteKey(confirmOnlyKey),
            ...lak2fak.map(({ public_key }) => transaction_1.deleteKey(public_key)),
            ...lak2fak.map(({ public_key }) => transaction_1.addKey(public_key, null)),
            transaction_1.deployContract(contractBytes),
        ];
        console.log('disabling 2fa for', accountId);
        return await this.signAndSendTransaction(accountId, actions);
    }
    async sendCodeDefault() {
        const { accountId } = this;
        const { requestId } = this.getRequest();
        const method = await this.get2faMethod();
        await this.postSignedJson('/2fa/send', {
            accountId,
            method,
            requestId,
        });
        return requestId;
    }
    async getCodeDefault(method) {
        throw new Error('There is no getCode callback provided. Please provide your own in AccountMultisig constructor options. It has a parameter method where method.kind is "email" or "phone".');
    }
    async promptAndVerify() {
        const method = await this.get2faMethod();
        const securityCode = await this.getCode(method);
        try {
            const result = await this.verifyCode(securityCode);
            // TODO: Parse error from result for real (like in normal account.signAndSendTransaction)
            return result;
        }
        catch (e) {
            console.warn('Error validating security code:', e);
            if (e.toString().includes('invalid 2fa code provided') || e.toString().includes('2fa code not valid')) {
                return await this.promptAndVerify();
            }
            throw e;
        }
    }
    async verifyCodeDefault(securityCode) {
        const { accountId } = this;
        const request = this.getRequest();
        if (!request) {
            throw new Error('no request pending');
        }
        const { requestId } = request;
        return await this.postSignedJson('/2fa/verify', {
            accountId,
            securityCode,
            requestId
        });
    }
    async getRecoveryMethods() {
        const { accountId } = this;
        return {
            accountId,
            data: await this.postSignedJson('/account/recoveryMethods', { accountId })
        };
    }
    async get2faMethod() {
        let { data } = await this.getRecoveryMethods();
        if (data && data.length) {
            data = data.find((m) => m.kind.indexOf('2fa-') === 0);
        }
        if (!data)
            return null;
        const { kind, detail } = data;
        return { kind, detail };
    }
    async signatureFor() {
        const { accountId } = this;
        const block = await this.connection.provider.block({ finality: 'final' });
        const blockNumber = block.header.height.toString();
        const signed = await this.connection.signer.signMessage(Buffer.from(blockNumber), accountId, this.connection.networkId);
        const blockNumberSignature = Buffer.from(signed.signature).toString('base64');
        return { blockNumber, blockNumberSignature };
    }
    async postSignedJson(path, body) {
        return await web_1.fetchJson(this.helperUrl + path, JSON.stringify({
            ...body,
            ...(await this.signatureFor())
        }));
    }
}
exports.Account2FA = Account2FA;
// helpers
const toPK = (pk) => key_pair_1.PublicKey.from(pk);
const convertPKForContract = (pk) => pk.toString().replace('ed25519:', '');
const convertActions = (actions, accountId, receiverId) => actions.map((a) => {
    const type = a.enum;
    const { gas, publicKey, methodName, args, deposit, accessKey, code } = a[type];
    const action = {
        type: type[0].toUpperCase() + type.substr(1),
        gas: (gas && gas.toString()) || undefined,
        public_key: (publicKey && convertPKForContract(publicKey)) || undefined,
        method_name: methodName,
        args: (args && Buffer.from(args).toString('base64')) || undefined,
        code: (code && Buffer.from(code).toString('base64')) || undefined,
        amount: (deposit && deposit.toString()) || undefined,
        deposit: (deposit && deposit.toString()) || '0',
        permission: undefined,
    };
    if (accessKey) {
        if (receiverId === accountId && accessKey.permission.enum !== 'fullAccess') {
            action.permission = {
                receiver_id: accountId,
                allowance: exports.MULTISIG_ALLOWANCE.toString(),
                method_names: exports.MULTISIG_CHANGE_METHODS,
            };
        }
        if (accessKey.permission.enum === 'functionCall') {
            const { receiverId: receiver_id, methodNames: method_names, allowance } = accessKey.permission.functionCall;
            action.permission = {
                receiver_id,
                allowance: (allowance && allowance.toString()) || undefined,
                method_names
            };
        }
    }
    return action;
});

},{"bn.js":"../node_modules/near-api-js/node_modules/bn.js/lib/bn.js","./account":"../node_modules/near-api-js/lib/account.js","./utils/format":"../node_modules/near-api-js/lib/utils/format.js","./utils/key_pair":"../node_modules/near-api-js/lib/utils/key_pair.js","./transaction":"../node_modules/near-api-js/lib/transaction.js","./utils/web":"../node_modules/near-api-js/lib/utils/web.js","buffer":"../node_modules/node-libs-browser/node_modules/buffer/index.js"}],"../node_modules/near-api-js/lib/account_creator.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlAccountCreator = exports.LocalAccountCreator = exports.AccountCreator = void 0;
const web_1 = require("./utils/web");
/**
 * Account creator provides an interface for implementations to actually create accounts
 */
class AccountCreator {
}
exports.AccountCreator = AccountCreator;
class LocalAccountCreator extends AccountCreator {
    constructor(masterAccount, initialBalance) {
        super();
        this.masterAccount = masterAccount;
        this.initialBalance = initialBalance;
    }
    /**
     * Creates an account using a masterAccount, meaning the new account is created from an existing account
     * @param newAccountId The name of the NEAR account to be created
     * @param publicKey The public key from the masterAccount used to create this account
     * @returns {Promise<void>}
     */
    async createAccount(newAccountId, publicKey) {
        await this.masterAccount.createAccount(newAccountId, publicKey, this.initialBalance);
    }
}
exports.LocalAccountCreator = LocalAccountCreator;
class UrlAccountCreator extends AccountCreator {
    constructor(connection, helperUrl) {
        super();
        this.connection = connection;
        this.helperUrl = helperUrl;
    }
    /**
     * Creates an account using a helperUrl
     * This is [hosted here](https://helper.nearprotocol.com) or set up locally with the [near-contract-helper](https://github.com/nearprotocol/near-contract-helper) repository
     * @param newAccountId The name of the NEAR account to be created
     * @param publicKey The public key from the masterAccount used to create this account
     * @returns {Promise<void>}
     */
    async createAccount(newAccountId, publicKey) {
        await web_1.fetchJson(`${this.helperUrl}/account`, JSON.stringify({ newAccountId, newAccountPublicKey: publicKey.toString() }));
    }
}
exports.UrlAccountCreator = UrlAccountCreator;

},{"./utils/web":"../node_modules/near-api-js/lib/utils/web.js"}],"../node_modules/near-api-js/lib/signer.js":[function(require,module,exports) {
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemorySigner = exports.Signer = void 0;
const js_sha256_1 = __importDefault(require("js-sha256"));
const key_pair_1 = require("./utils/key_pair");
const in_memory_key_store_1 = require("./key_stores/in_memory_key_store");
/**
 * General signing interface, can be used for in memory signing, RPC singing, external wallet, HSM, etc.
 */
class Signer {
}
exports.Signer = Signer;
/**
 * Signs using in memory key store.
 */
class InMemorySigner extends Signer {
    constructor(keyStore) {
        super();
        this.keyStore = keyStore;
    }
    /**
     * Creates a single account Signer instance with account, network and keyPair provided.
     *
     * Intended to be useful for temporary keys (e.g. claiming a Linkdrop).
     *
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @param accountId The NEAR account to assign the key pair to
     * @param keyPair The keyPair to use for signing
     */
    static async fromKeyPair(networkId, accountId, keyPair) {
        const keyStore = new in_memory_key_store_1.InMemoryKeyStore();
        await keyStore.setKey(networkId, accountId, keyPair);
        return new InMemorySigner(keyStore);
    }
    /**
     * Creates a public key for the account given
     * @param accountId The NEAR account to assign a public key to
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @returns {Promise<PublicKey>}
     */
    async createKey(accountId, networkId) {
        const keyPair = key_pair_1.KeyPair.fromRandom('ed25519');
        await this.keyStore.setKey(networkId, accountId, keyPair);
        return keyPair.getPublicKey();
    }
    /**
     * Gets the existing public key for a given account
     * @param accountId The NEAR account to assign a public key to
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @returns {Promise<PublicKey>} Returns the public key or null if not found
     */
    async getPublicKey(accountId, networkId) {
        const keyPair = await this.keyStore.getKey(networkId, accountId);
        if (keyPair === null) {
            return null;
        }
        return keyPair.getPublicKey();
    }
    /**
     * @param message A message to be signed, typically a serialized transaction
     * @param accountId the NEAR account signing the message
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @returns {Promise<Signature>}
     */
    async signMessage(message, accountId, networkId) {
        const hash = new Uint8Array(js_sha256_1.default.sha256.array(message));
        if (!accountId) {
            throw new Error('InMemorySigner requires provided account id');
        }
        const keyPair = await this.keyStore.getKey(networkId, accountId);
        if (keyPair === null) {
            throw new Error(`Key for ${accountId} not found in ${networkId}`);
        }
        return keyPair.sign(hash);
    }
    toString() {
        return `InMemorySigner(${this.keyStore})`;
    }
}
exports.InMemorySigner = InMemorySigner;

},{"js-sha256":"../node_modules/js-sha256/src/sha256.js","./utils/key_pair":"../node_modules/near-api-js/lib/utils/key_pair.js","./key_stores/in_memory_key_store":"../node_modules/near-api-js/lib/key_stores/in_memory_key_store.js"}],"../node_modules/near-api-js/lib/connection.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Connection = void 0;
const providers_1 = require("./providers");
const signer_1 = require("./signer");
/**
 * @param config Contains connection info details
 * @returns {Provider}
 */
function getProvider(config) {
    switch (config.type) {
        case undefined:
            return config;
        case 'JsonRpcProvider': return new providers_1.JsonRpcProvider(config.args.url);
        default: throw new Error(`Unknown provider type ${config.type}`);
    }
}
/**
 * @param config Contains connection info details
 * @returns {Signer}
 */
function getSigner(config) {
    switch (config.type) {
        case undefined:
            return config;
        case 'InMemorySigner': {
            return new signer_1.InMemorySigner(config.keyStore);
        }
        default: throw new Error(`Unknown signer type ${config.type}`);
    }
}
/**
 * Connects an account to a given network via a given provider
 */
class Connection {
    constructor(networkId, provider, signer) {
        this.networkId = networkId;
        this.provider = provider;
        this.signer = signer;
    }
    /**
     * @param config Contains connection info details
     */
    static fromConfig(config) {
        const provider = getProvider(config.provider);
        const signer = getSigner(config.signer);
        return new Connection(config.networkId, provider, signer);
    }
}
exports.Connection = Connection;

},{"./providers":"../node_modules/near-api-js/lib/providers/index.js","./signer":"../node_modules/near-api-js/lib/signer.js"}],"../node_modules/near-api-js/lib/contract.js":[function(require,module,exports) {
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contract = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
const depd_1 = __importDefault(require("depd"));
const providers_1 = require("./providers");
const errors_1 = require("./utils/errors");
// Makes `function.name` return given name
function nameFunction(name, body) {
    return {
        [name](...args) {
            return body(...args);
        }
    }[name];
}
const isUint8Array = (x) => x && x.byteLength !== undefined && x.byteLength === x.length;
const isObject = (x) => Object.prototype.toString.call(x) === '[object Object]';
/**
 * Defines a smart contract on NEAR including the change (mutable) and view (non-mutable) methods
 *
 * @example {@link https://docs.near.org/docs/develop/front-end/naj-quick-reference#contract}
 * @example
 * ```js
 * import { Contract } from 'near-api-js';
 *
 * async function contractExample() {
 *   const methodOptions = {
 *     viewMethods: ['getMessageByAccountId'],
 *     changeMethods: ['addMessage']
 *   };
 *   const contract = new Contract(
 *     wallet.account(),
 *     'contract-id.testnet',
 *     methodOptions
 *   );
 *
 *   // use a contract view method
 *   const messages = await contract.getMessages({
 *     accountId: 'example-account.testnet'
 *   });
 *
 *   // use a contract change method
 *   await contract.addMessage({
 *      meta: 'some info',
 *      callbackUrl: 'https://example.com/callback',
 *      args: { text: 'my message' },
 *      amount: 1
 *   })
 * }
 * ```
 */
class Contract {
    /**
     * @param account NEAR account to sign change method transactions
     * @param contractId NEAR account id where the contract is deployed
     * @param options NEAR smart contract methods that your application will use. These will be available as `contract.methodName`
     */
    constructor(account, contractId, options) {
        this.account = account;
        this.contractId = contractId;
        const { viewMethods = [], changeMethods = [] } = options;
        viewMethods.forEach((methodName) => {
            Object.defineProperty(this, methodName, {
                writable: false,
                enumerable: true,
                value: nameFunction(methodName, async (args = {}, options = {}, ...ignored) => {
                    if (ignored.length || !(isObject(args) || isUint8Array(args)) || !isObject(options)) {
                        throw new errors_1.PositionalArgsError();
                    }
                    return this.account.viewFunction(this.contractId, methodName, args, options);
                })
            });
        });
        changeMethods.forEach((methodName) => {
            Object.defineProperty(this, methodName, {
                writable: false,
                enumerable: true,
                value: nameFunction(methodName, async (...args) => {
                    if (args.length && (args.length > 3 || !(isObject(args[0]) || isUint8Array(args[0])))) {
                        throw new errors_1.PositionalArgsError();
                    }
                    if (args.length > 1 || !(args[0] && args[0].args)) {
                        const deprecate = depd_1.default('contract.methodName(args, gas, amount)');
                        deprecate('use `contract.methodName({ args, gas?, amount?, callbackUrl?, meta? })` instead');
                        return this._changeMethod({
                            methodName,
                            args: args[0],
                            gas: args[1],
                            amount: args[2]
                        });
                    }
                    return this._changeMethod({ methodName, ...args[0] });
                })
            });
        });
    }
    async _changeMethod({ args, methodName, gas, amount, meta, callbackUrl }) {
        validateBNLike({ gas, amount });
        const rawResult = await this.account.functionCall({
            contractId: this.contractId,
            methodName,
            args,
            gas,
            attachedDeposit: amount,
            walletMeta: meta,
            walletCallbackUrl: callbackUrl
        });
        return providers_1.getTransactionLastResult(rawResult);
    }
}
exports.Contract = Contract;
/**
 * Validation on arguments being a big number from bn.js
 * Throws if an argument is not in BN format or otherwise invalid
 * @param argMap
 */
function validateBNLike(argMap) {
    const bnLike = 'number, decimal string or BN';
    for (const argName of Object.keys(argMap)) {
        const argValue = argMap[argName];
        if (argValue && !bn_js_1.default.isBN(argValue) && isNaN(argValue)) {
            throw new errors_1.ArgumentTypeError(argName, bnLike, argValue);
        }
    }
}

},{"bn.js":"../node_modules/near-api-js/node_modules/bn.js/lib/bn.js","depd":"../node_modules/near-api-js/node_modules/depd/lib/browser/index.js","./providers":"../node_modules/near-api-js/lib/providers/index.js","./utils/errors":"../node_modules/near-api-js/lib/utils/errors.js"}],"../node_modules/near-api-js/lib/near.js":[function(require,module,exports) {
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Near = void 0;
/**
 * This module contains the main class developers will use to interact with NEAR.
 * The {@link Near} class is used to interact with {@link Account | Accounts} through the {@link JsonRpcProvider.JsonRpcProvider | JsonRpcProvider}.
 * It is configured via the {@link NearConfig}.
 *
 * @example {@link https://docs.near.org/docs/develop/front-end/naj-quick-reference#account}
 *
 * @module near
 */
const bn_js_1 = __importDefault(require("bn.js"));
const account_1 = require("./account");
const connection_1 = require("./connection");
const contract_1 = require("./contract");
const account_creator_1 = require("./account_creator");
/**
 * This is the main class developers should use to interact with NEAR.
 * @example
 * ```js
 * const near = new Near(config);
 * ```
 */
class Near {
    constructor(config) {
        this.config = config;
        this.connection = connection_1.Connection.fromConfig({
            networkId: config.networkId,
            provider: { type: 'JsonRpcProvider', args: { url: config.nodeUrl } },
            signer: config.signer || { type: 'InMemorySigner', keyStore: config.keyStore || config.deps.keyStore }
        });
        if (config.masterAccount) {
            // TODO: figure out better way of specifiying initial balance.
            // Hardcoded number below must be enough to pay the gas cost to dev-deploy with near-shell for multiple times
            const initialBalance = config.initialBalance ? new bn_js_1.default(config.initialBalance) : new bn_js_1.default('500000000000000000000000000');
            this.accountCreator = new account_creator_1.LocalAccountCreator(new account_1.Account(this.connection, config.masterAccount), initialBalance);
        }
        else if (config.helperUrl) {
            this.accountCreator = new account_creator_1.UrlAccountCreator(this.connection, config.helperUrl);
        }
        else {
            this.accountCreator = null;
        }
    }
    /**
     * @param accountId near accountId used to interact with the network.
     */
    async account(accountId) {
        const account = new account_1.Account(this.connection, accountId);
        return account;
    }
    /**
     * Create an account using the {@link AccountCreator}. Either:
     * * using a masterAccount with {@link LocalAccountCreator}
     * * using the helperUrl with {@link UrlAccountCreator}
     * @see {@link NearConfig.masterAccount} and {@link NearConfig.helperUrl}-
     *
     * @param accountId
     * @param publicKey
     */
    async createAccount(accountId, publicKey) {
        if (!this.accountCreator) {
            throw new Error('Must specify account creator, either via masterAccount or helperUrl configuration settings.');
        }
        await this.accountCreator.createAccount(accountId, publicKey);
        return new account_1.Account(this.connection, accountId);
    }
    /**
     * @deprecated Use {@link Contract} instead.
     * @param contractId
     * @param options
     */
    async loadContract(contractId, options) {
        const account = new account_1.Account(this.connection, options.sender);
        return new contract_1.Contract(account, contractId, options);
    }
    /**
     * @deprecated Use {@link Account.sendMoney} instead.
     * @param amount
     * @param originator
     * @param receiver
     */
    async sendTokens(amount, originator, receiver) {
        console.warn('near.sendTokens is deprecated. Use `yourAccount.sendMoney` instead.');
        const account = new account_1.Account(this.connection, originator);
        const result = await account.sendMoney(receiver, amount);
        return result.transaction_outcome.id;
    }
}
exports.Near = Near;

},{"bn.js":"../node_modules/near-api-js/node_modules/bn.js/lib/bn.js","./account":"../node_modules/near-api-js/lib/account.js","./connection":"../node_modules/near-api-js/lib/connection.js","./contract":"../node_modules/near-api-js/lib/contract.js","./account_creator":"../node_modules/near-api-js/lib/account_creator.js"}],"../node_modules/near-api-js/lib/wallet-account.js":[function(require,module,exports) {
var Buffer = require("buffer").Buffer;
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectedWalletAccount = exports.WalletAccount = exports.WalletConnection = void 0;
/**
 * The classes in this module are used in conjunction with the {@link BrowserLocalStorageKeyStore}. This module exposes two classes:
 * * {@link WalletConnection} which redirects users to {@link https://docs.near.org/docs/tools/near-wallet | NEAR Wallet} for key management.
 * * {@link ConnectedWalletAccount} is an {@link Account} implementation that uses {@link WalletConnection} to get keys
 *
 * @module walletAccount
 */
const depd_1 = __importDefault(require("depd"));
const account_1 = require("./account");
const transaction_1 = require("./transaction");
const utils_1 = require("./utils");
const borsh_1 = require("borsh");
const borsh_2 = require("borsh");
const LOGIN_WALLET_URL_SUFFIX = '/login/';
const MULTISIG_HAS_METHOD = 'add_request_and_confirm';
const LOCAL_STORAGE_KEY_SUFFIX = '_wallet_auth_key';
const PENDING_ACCESS_KEY_PREFIX = 'pending_key'; // browser storage key for a pending access key (i.e. key has been generated but we are not sure it was added yet)
/**
 * This class is used in conjunction with the {@link BrowserLocalStorageKeyStore}.
 * It redirects users to {@link https://docs.near.org/docs/tools/near-wallet | NEAR Wallet} for key management.
 *
 * @example {@link https://docs.near.org/docs/develop/front-end/naj-quick-reference#wallet}
 * @example
 * ```js
 * // create new WalletConnection instance
 * const wallet = new WalletConnection(near, 'my-app');
 *
 * // If not signed in redirect to the NEAR wallet to sign in
 * // keys will be stored in the BrowserLocalStorageKeyStore
 * if(!wallet.isSingnedIn()) return wallet.requestSignIn()
 * ```
 */
class WalletConnection {
    constructor(near, appKeyPrefix) {
        this._near = near;
        const authDataKey = appKeyPrefix + LOCAL_STORAGE_KEY_SUFFIX;
        const authData = JSON.parse(window.localStorage.getItem(authDataKey));
        this._networkId = near.config.networkId;
        this._walletBaseUrl = near.config.walletUrl;
        appKeyPrefix = appKeyPrefix || near.config.contractName || 'default';
        this._keyStore = near.connection.signer.keyStore;
        this._authData = authData || { allKeys: [] };
        this._authDataKey = authDataKey;
        if (!this.isSignedIn()) {
            this._completeSignInWithAccessKey();
        }
    }
    /**
     * Returns true, if this WalletAccount is authorized with the wallet.
     * @example
     * ```js
     * const wallet = new WalletConnection(near, 'my-app');
     * wallet.isSignedIn();
     * ```
     */
    isSignedIn() {
        return !!this._authData.accountId;
    }
    /**
     * Returns authorized Account ID.
     * @example
     * ```js
     * const wallet = new WalletConnection(near, 'my-app');
     * wallet.getAccountId();
     * ```
     */
    getAccountId() {
        return this._authData.accountId || '';
    }
    /**
     * Redirects current page to the wallet authentication page.
     * @param options An optional options object
     * @param options.contractId The NEAR account where the contract is deployed
     * @param options.successUrl URL to redirect upon success. Default: current url
     * @param options.failureUrl URL to redirect upon failure. Default: current url
     *
     * @example
     * ```js
     * const wallet = new WalletConnection(near, 'my-app');
     * // redirects to the NEAR Wallet
     * wallet.requestSignIn('account-with-deploy-contract.near');
     * ```
     */
    async requestSignIn(contractIdOrOptions = {}, title, successUrl, failureUrl) {
        let options;
        if (typeof contractIdOrOptions === 'string') {
            const deprecate = depd_1.default('requestSignIn(contractId, title)');
            deprecate('`title` ignored; use `requestSignIn({ contractId, successUrl, failureUrl })` instead');
            options = { contractId: contractIdOrOptions, successUrl, failureUrl };
        }
        else {
            options = contractIdOrOptions;
        }
        /* Throws exception if account does not exist */
        const contractAccount = await this._near.account(options.contractId);
        await contractAccount.state();
        const currentUrl = new URL(window.location.href);
        const newUrl = new URL(this._walletBaseUrl + LOGIN_WALLET_URL_SUFFIX);
        newUrl.searchParams.set('success_url', options.successUrl || currentUrl.href);
        newUrl.searchParams.set('failure_url', options.failureUrl || currentUrl.href);
        if (options.contractId) {
            newUrl.searchParams.set('contract_id', options.contractId);
            const accessKey = utils_1.KeyPair.fromRandom('ed25519');
            newUrl.searchParams.set('public_key', accessKey.getPublicKey().toString());
            await this._keyStore.setKey(this._networkId, PENDING_ACCESS_KEY_PREFIX + accessKey.getPublicKey(), accessKey);
        }
        if (options.methodNames) {
            options.methodNames.forEach(methodName => {
                newUrl.searchParams.append('methodNames', methodName);
            });
        }
        window.location.assign(newUrl.toString());
    }
    async requestSignTransactions(...args) {
        if (Array.isArray(args[0])) {
            const deprecate = depd_1.default('WalletConnection.requestSignTransactions(transactions, callbackUrl, meta)');
            deprecate('use `WalletConnection.requestSignTransactions(RequestSignTransactionsOptions)` instead');
            return this._requestSignTransactions({
                transactions: args[0],
                callbackUrl: args[1],
                meta: args[2]
            });
        }
        return this._requestSignTransactions(args[0]);
    }
    async _requestSignTransactions({ transactions, meta, callbackUrl }) {
        const currentUrl = new URL(window.location.href);
        const newUrl = new URL('sign', this._walletBaseUrl);
        newUrl.searchParams.set('transactions', transactions
            .map(transaction => borsh_2.serialize(transaction_1.SCHEMA, transaction))
            .map(serialized => Buffer.from(serialized).toString('base64'))
            .join(','));
        newUrl.searchParams.set('callbackUrl', callbackUrl || currentUrl.href);
        if (meta)
            newUrl.searchParams.set('meta', meta);
        window.location.assign(newUrl.toString());
    }
    /**
     * @hidden
     * Complete sign in for a given account id and public key. To be invoked by the app when getting a callback from the wallet.
     */
    async _completeSignInWithAccessKey() {
        const currentUrl = new URL(window.location.href);
        const publicKey = currentUrl.searchParams.get('public_key') || '';
        const allKeys = (currentUrl.searchParams.get('all_keys') || '').split(',');
        const accountId = currentUrl.searchParams.get('account_id') || '';
        // TODO: Handle errors during login
        if (accountId) {
            this._authData = {
                accountId,
                allKeys
            };
            window.localStorage.setItem(this._authDataKey, JSON.stringify(this._authData));
            if (publicKey) {
                await this._moveKeyFromTempToPermanent(accountId, publicKey);
            }
        }
        currentUrl.searchParams.delete('public_key');
        currentUrl.searchParams.delete('all_keys');
        currentUrl.searchParams.delete('account_id');
        window.history.replaceState({}, document.title, currentUrl.toString());
    }
    /**
     * @hidden
     * @param accountId The NEAR account owning the given public key
     * @param publicKey The public key being set to the key store
     */
    async _moveKeyFromTempToPermanent(accountId, publicKey) {
        const keyPair = await this._keyStore.getKey(this._networkId, PENDING_ACCESS_KEY_PREFIX + publicKey);
        await this._keyStore.setKey(this._networkId, accountId, keyPair);
        await this._keyStore.removeKey(this._networkId, PENDING_ACCESS_KEY_PREFIX + publicKey);
    }
    /**
     * Sign out from the current account
     * @example
     * walletAccount.signOut();
     */
    signOut() {
        this._authData = {};
        window.localStorage.removeItem(this._authDataKey);
    }
    /**
     * Returns the current connected wallet account
     */
    account() {
        if (!this._connectedAccount) {
            this._connectedAccount = new ConnectedWalletAccount(this, this._near.connection, this._authData.accountId);
        }
        return this._connectedAccount;
    }
}
exports.WalletConnection = WalletConnection;
exports.WalletAccount = WalletConnection;
/**
 * {@link Account} implementation which redirects to wallet using {@link WalletConnection} when no local key is available.
 */
class ConnectedWalletAccount extends account_1.Account {
    constructor(walletConnection, connection, accountId) {
        super(connection, accountId);
        this.walletConnection = walletConnection;
    }
    // Overriding Account methods
    /**
     * Sign a transaction by redirecting to the NEAR Wallet
     * @see {@link WalletConnection.requestSignTransactions}
     */
    signAndSendTransaction(...args) {
        if (typeof args[0] === 'string') {
            return this._signAndSendTransaction({ receiverId: args[0], actions: args[1] });
        }
        return this._signAndSendTransaction(args[0]);
    }
    async _signAndSendTransaction({ receiverId, actions, walletMeta, walletCallbackUrl = window.location.href }) {
        const localKey = await this.connection.signer.getPublicKey(this.accountId, this.connection.networkId);
        let accessKey = await this.accessKeyForTransaction(receiverId, actions, localKey);
        if (!accessKey) {
            throw new Error(`Cannot find matching key for transaction sent to ${receiverId}`);
        }
        if (localKey && localKey.toString() === accessKey.public_key) {
            try {
                return await super.signAndSendTransaction({ receiverId, actions });
            }
            catch (e) {
                if (e.type === 'NotEnoughBalance') {
                    accessKey = await this.accessKeyForTransaction(receiverId, actions);
                }
                else {
                    throw e;
                }
            }
        }
        const block = await this.connection.provider.block({ finality: 'final' });
        const blockHash = borsh_1.baseDecode(block.header.hash);
        const publicKey = utils_1.PublicKey.from(accessKey.public_key);
        // TODO: Cache & listen for nonce updates for given access key
        const nonce = accessKey.access_key.nonce + 1;
        const transaction = transaction_1.createTransaction(this.accountId, publicKey, receiverId, nonce, actions, blockHash);
        await this.walletConnection.requestSignTransactions({
            transactions: [transaction],
            meta: walletMeta,
            callbackUrl: walletCallbackUrl
        });
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(new Error('Failed to redirect to sign transaction'));
            }, 1000);
        });
        // TODO: Aggregate multiple transaction request with "debounce".
        // TODO: Introduce TrasactionQueue which also can be used to watch for status?
    }
    /**
     * Check if given access key allows the function call or method attempted in transaction
     * @param accessKey Array of {access_key: AccessKey, public_key: PublicKey} items
     * @param receiverId The NEAR account attempting to have access
     * @param actions The action(s) needed to be checked for access
     */
    async accessKeyMatchesTransaction(accessKey, receiverId, actions) {
        const { access_key: { permission } } = accessKey;
        if (permission === 'FullAccess') {
            return true;
        }
        if (permission.FunctionCall) {
            const { receiver_id: allowedReceiverId, method_names: allowedMethods } = permission.FunctionCall;
            /********************************
            Accept multisig access keys and let wallets attempt to signAndSendTransaction
            If an access key has itself as receiverId and method permission add_request_and_confirm, then it is being used in a wallet with multisig contract: https://github.com/near/core-contracts/blob/671c05f09abecabe7a7e58efe942550a35fc3292/multisig/src/lib.rs#L149-L153
            ********************************/
            if (allowedReceiverId === this.accountId && allowedMethods.includes(MULTISIG_HAS_METHOD)) {
                return true;
            }
            if (allowedReceiverId === receiverId) {
                if (actions.length !== 1) {
                    return false;
                }
                const [{ functionCall }] = actions;
                return functionCall &&
                    (!functionCall.deposit || functionCall.deposit.toString() === '0') && // TODO: Should support charging amount smaller than allowance?
                    (allowedMethods.length === 0 || allowedMethods.includes(functionCall.methodName));
                // TODO: Handle cases when allowance doesn't have enough to pay for gas
            }
        }
        // TODO: Support other permissions than FunctionCall
        return false;
    }
    /**
     * Helper function returning the access key (if it exists) to the receiver that grants the designated permission
     * @param receiverId The NEAR account seeking the access key for a transaction
     * @param actions The action(s) sought to gain access to
     * @param localKey A local public key provided to check for access
     * @returns Promise<any>
     */
    async accessKeyForTransaction(receiverId, actions, localKey) {
        const accessKeys = await this.getAccessKeys();
        if (localKey) {
            const accessKey = accessKeys.find(key => key.public_key.toString() === localKey.toString());
            if (accessKey && await this.accessKeyMatchesTransaction(accessKey, receiverId, actions)) {
                return accessKey;
            }
        }
        const walletKeys = this.walletConnection._authData.allKeys;
        for (const accessKey of accessKeys) {
            if (walletKeys.indexOf(accessKey.public_key) !== -1 && await this.accessKeyMatchesTransaction(accessKey, receiverId, actions)) {
                return accessKey;
            }
        }
        return null;
    }
}
exports.ConnectedWalletAccount = ConnectedWalletAccount;

},{"depd":"../node_modules/near-api-js/node_modules/depd/lib/browser/index.js","./account":"../node_modules/near-api-js/lib/account.js","./transaction":"../node_modules/near-api-js/lib/transaction.js","./utils":"../node_modules/near-api-js/lib/utils/index.js","borsh":"../node_modules/near-api-js/node_modules/borsh/lib/index.js","buffer":"../node_modules/node-libs-browser/node_modules/buffer/index.js"}],"../node_modules/near-api-js/lib/common-index.js":[function(require,module,exports) {
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletConnection = exports.WalletAccount = exports.ConnectedWalletAccount = exports.Near = exports.KeyPair = exports.Signer = exports.InMemorySigner = exports.Contract = exports.Connection = exports.Account = exports.multisig = exports.validators = exports.transactions = exports.utils = exports.providers = exports.accountCreator = void 0;
/** @hidden @module */
const providers = __importStar(require("./providers"));
exports.providers = providers;
const utils = __importStar(require("./utils"));
exports.utils = utils;
const transactions = __importStar(require("./transaction"));
exports.transactions = transactions;
const validators = __importStar(require("./validators"));
exports.validators = validators;
const account_1 = require("./account");
Object.defineProperty(exports, "Account", { enumerable: true, get: function () { return account_1.Account; } });
const multisig = __importStar(require("./account_multisig"));
exports.multisig = multisig;
const accountCreator = __importStar(require("./account_creator"));
exports.accountCreator = accountCreator;
const connection_1 = require("./connection");
Object.defineProperty(exports, "Connection", { enumerable: true, get: function () { return connection_1.Connection; } });
const signer_1 = require("./signer");
Object.defineProperty(exports, "Signer", { enumerable: true, get: function () { return signer_1.Signer; } });
Object.defineProperty(exports, "InMemorySigner", { enumerable: true, get: function () { return signer_1.InMemorySigner; } });
const contract_1 = require("./contract");
Object.defineProperty(exports, "Contract", { enumerable: true, get: function () { return contract_1.Contract; } });
const key_pair_1 = require("./utils/key_pair");
Object.defineProperty(exports, "KeyPair", { enumerable: true, get: function () { return key_pair_1.KeyPair; } });
const near_1 = require("./near");
Object.defineProperty(exports, "Near", { enumerable: true, get: function () { return near_1.Near; } });
// TODO: Deprecate and remove WalletAccount
const wallet_account_1 = require("./wallet-account");
Object.defineProperty(exports, "ConnectedWalletAccount", { enumerable: true, get: function () { return wallet_account_1.ConnectedWalletAccount; } });
Object.defineProperty(exports, "WalletAccount", { enumerable: true, get: function () { return wallet_account_1.WalletAccount; } });
Object.defineProperty(exports, "WalletConnection", { enumerable: true, get: function () { return wallet_account_1.WalletConnection; } });

},{"./providers":"../node_modules/near-api-js/lib/providers/index.js","./utils":"../node_modules/near-api-js/lib/utils/index.js","./transaction":"../node_modules/near-api-js/lib/transaction.js","./validators":"../node_modules/near-api-js/lib/validators.js","./account":"../node_modules/near-api-js/lib/account.js","./account_multisig":"../node_modules/near-api-js/lib/account_multisig.js","./account_creator":"../node_modules/near-api-js/lib/account_creator.js","./connection":"../node_modules/near-api-js/lib/connection.js","./signer":"../node_modules/near-api-js/lib/signer.js","./contract":"../node_modules/near-api-js/lib/contract.js","./utils/key_pair":"../node_modules/near-api-js/lib/utils/key_pair.js","./near":"../node_modules/near-api-js/lib/near.js","./wallet-account":"../node_modules/near-api-js/lib/wallet-account.js"}],"../node_modules/near-api-js/lib/browser-connect.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = void 0;
/**
 * Connect to NEAR using the provided configuration.
 *
 * {@link ConnectConfig.networkId} and {@link ConnectConfig.nodeUrl} are required.
 *
 * To sign transactions you can also pass: {@link ConnectConfig.keyStore}
 *
 * Both are passed they are prioritize in that order.
 *
 * @see {@link ConnectConfig}
 * @example
 * ```js
 * async function initNear() {
 *   const near = await connect({
 *      networkId: 'testnet',
 *      nodeUrl: 'https://rpc.testnet.near.org'
 *   })
 * }
 * ```
 *
 * @module browserConnect
 */
const near_1 = require("./near");
/**
 * Initialize connection to Near network.
 */
async function connect(config) {
    return new near_1.Near(config);
}
exports.connect = connect;

},{"./near":"../node_modules/near-api-js/lib/near.js"}],"../node_modules/capability/lib/CapabilityDetector.js":[function(require,module,exports) {
var CapabilityDetector = function () {
    this.tests = {};
    this.cache = {};
};
CapabilityDetector.prototype = {
    constructor: CapabilityDetector,
    define: function (name, test) {
        if (typeof (name) != "string" || !(test instanceof Function))
            throw new Error("Invalid capability definition.");
        if (this.tests[name])
            throw new Error('Duplicated capability definition by "' + name + '".');
        this.tests[name] = test;
    },
    check: function (name) {
        if (!this.test(name))
            throw new Error('The current environment does not support "' + name + '", therefore we cannot continue.');
    },
    test: function (name) {
        if (this.cache[name] !== undefined)
            return this.cache[name];
        if (!this.tests[name])
            throw new Error('Unknown capability with name "' + name + '".');
        var test = this.tests[name];
        this.cache[name] = !!test();
        return this.cache[name];
    }
};

module.exports = CapabilityDetector;
},{}],"../node_modules/capability/lib/index.js":[function(require,module,exports) {
var CapabilityDetector = require("./CapabilityDetector");

var detector = new CapabilityDetector();

var capability = function (name) {
    return detector.test(name);
};
capability.define = function (name, test) {
    detector.define(name, test);
};
capability.check = function (name) {
    detector.check(name);
};
capability.test = capability;

module.exports = capability;
},{"./CapabilityDetector":"../node_modules/capability/lib/CapabilityDetector.js"}],"../node_modules/capability/lib/definitions.js":[function(require,module,exports) {

var capability = require("."),
    define = capability.define,
    test = capability.test;

define("strict mode", function () {
    return (this === undefined);
});

define("arguments.callee.caller", function () {
    try {
        return (function () {
                return arguments.callee.caller;
            })() === arguments.callee;
    } catch (strictModeIsEnforced) {
        return false;
    }
});

define("es5", function () {
    return test("Array.prototype.forEach") &&
        test("Array.prototype.map") &&
        test("Function.prototype.bind") &&
        test("Object.create") &&
        test("Object.defineProperties") &&
        test("Object.defineProperty") &&
        test("Object.prototype.hasOwnProperty");
});

define("Array.prototype.forEach", function () {
    return Array.prototype.forEach;
});

define("Array.prototype.map", function () {
    return Array.prototype.map;
});

define("Function.prototype.bind", function () {
    return Function.prototype.bind;
});

define("Object.create", function () {
    return Object.create;
});

define("Object.defineProperties", function () {
    return Object.defineProperties;
});

define("Object.defineProperty", function () {
    return Object.defineProperty;
});

define("Object.prototype.hasOwnProperty", function () {
    return Object.prototype.hasOwnProperty;
});

define("Error.captureStackTrace", function () {
    return Error.captureStackTrace;
});

define("Error.prototype.stack", function () {
    try {
        throw new Error();
    }
    catch (e) {
        return e.stack || e.stacktrace;
    }
});
},{".":"../node_modules/capability/lib/index.js"}],"../node_modules/capability/index.js":[function(require,module,exports) {
require("./lib/definitions");
module.exports = require("./lib");

},{"./lib/definitions":"../node_modules/capability/lib/definitions.js","./lib":"../node_modules/capability/lib/index.js"}],"../node_modules/capability/es5.js":[function(require,module,exports) {
require(".").check("es5");
},{".":"../node_modules/capability/index.js"}],"../node_modules/error-polyfill/lib/prepareStackTrace.js":[function(require,module,exports) {
var prepareStackTrace = function (throwable, frames, warnings) {
    var string = "";
    string += throwable.name || "Error";
    string += ": " + (throwable.message || "");
    if (warnings instanceof Array)
        for (var warningIndex in warnings) {
            var warning = warnings[warningIndex];
            string += "\n   # " + warning;
        }
    for (var frameIndex in frames) {
        var frame = frames[frameIndex];
        string += "\n   at " + frame.toString();
    }
    return string;
};

module.exports = prepareStackTrace;
},{}],"../node_modules/error-polyfill/lib/v8.js":[function(require,module,exports) {
var prepareStackTrace = require("./prepareStackTrace");

module.exports = function () {
    Error.getStackTrace = function (throwable) {
        return throwable.stack;
    };

    return {
        prepareStackTrace: prepareStackTrace
    };
};
},{"./prepareStackTrace":"../node_modules/error-polyfill/lib/prepareStackTrace.js"}],"../node_modules/o3/lib/Class.js":[function(require,module,exports) {
var Class = function () {
    var options = Object.create({
        Source: Object,
        config: {},
        buildArgs: []
    });

    function checkOption(option) {
        var key = "config";
        if (option instanceof Function)
            key = "Source";
        else if (option instanceof Array)
            key = "buildArgs";
        else if (option instanceof Object)
            key = "config";
        else
            throw new Error("Invalid configuration option.");
        if (options.hasOwnProperty(key))
            throw new Error("Duplicated configuration option: " + key + ".");
        options[key] = option;
    }

    for (var index = 0, length = arguments.length; index < length; ++index)
        checkOption(arguments[index]);

    var Source = options.Source,
        config = options.config,
        buildArgs = options.buildArgs;

    return (Source.extend || Class.extend).call(Source, config, buildArgs);
};

Class.factory = function () {
    var Source = this;
    return function () {
        var instance = this;
        if (instance.build instanceof Function)
            instance.build.apply(instance, arguments);
        if (instance.init instanceof Function)
            instance.init.apply(instance, arguments);
    };
};

Class.extend = function (config, buildArgs) {
    var Source = this;
    if (!config)
        config = {};
    var Subject;
    if ((config.prototype instanceof Object) && config.prototype.constructor !== Object)
        Subject = config.prototype.constructor;
    else if (config.factory instanceof Function)
        Subject = config.factory.call(Source);
    Subject = (Source.clone || Class.clone).call(Source, Subject, buildArgs);
    (Subject.merge || Class.merge).call(Subject, config);
    return Subject;
};

Class.prototype.extend = function (config, buildArgs) {
    var subject = this;
    var instance = (subject.clone || Class.prototype.clone).apply(subject, buildArgs);
    (instance.merge || Class.prototype.merge).call(instance, config);
    return instance;
};

Class.clone = function (Subject, buildArgs) {
    var Source = this;
    if (!(Subject instanceof Function))
        Subject = (Source.factory || Class.factory).call(Source);
    Subject.prototype = (Source.prototype.clone || Class.prototype.clone).apply(Source.prototype, buildArgs || []);
    Subject.prototype.constructor = Subject;
    for (var staticProperty in Source)
        if (staticProperty !== "prototype")
            Subject[staticProperty] = Source[staticProperty];
    return Subject;
};

Class.prototype.clone = function () {
    var subject = this;
    var instance = Object.create(subject);
    if (instance.build instanceof Function)
        instance.build.apply(instance, arguments);
    return instance;
};

Class.merge = function (config) {
    var Subject = this;
    for (var staticProperty in config)
        if (staticProperty !== "prototype")
            Subject[staticProperty] = config[staticProperty];
    if (config.prototype instanceof Object)
        (Subject.prototype.merge || Class.prototype.merge).call(Subject.prototype, config.prototype);
    return Subject;
};

Class.prototype.merge = function (config) {
    var subject = this;
    for (var property in config)
        if (property !== "constructor")
            subject[property] = config[property];
    return subject;
};

Class.absorb = function (config) {
    var Subject = this;
    for (var staticProperty in config)
        if (staticProperty !== "prototype" && (Subject[staticProperty] === undefined || Subject[staticProperty] === Function.prototype[staticProperty]))
            Subject[staticProperty] = config[staticProperty];
    if (config.prototype instanceof Object)
        (Subject.prototype.absorb || Class.prototype.absorb).call(Subject.prototype, config.prototype);
    return Subject;
};

Class.prototype.absorb = function (config) {
    var subject = this;
    for (var property in config)
        if (property !== "constructor" && (subject[property] === undefined || subject[property] === Object.prototype[property]))
            subject[property] = config[property];
    return subject;
};

Class.getAncestor = function () {
    var Source = this;
    if (Source !== Source.prototype.constructor)
        return Source.prototype.constructor;
};

Class.newInstance = function () {
    var Subject = this;
    var instance = Object.create(this.prototype);
    Subject.apply(instance, arguments);
    return instance;
};

module.exports = Class;
},{}],"../node_modules/o3/lib/abstractMethod.js":[function(require,module,exports) {
module.exports = function () {
    throw new Error("Not implemented.");
};
},{}],"../node_modules/o3/lib/index.js":[function(require,module,exports) {
module.exports = {
    Class: require("./Class"),
    abstractMethod: require("./abstractMethod")
};
},{"./Class":"../node_modules/o3/lib/Class.js","./abstractMethod":"../node_modules/o3/lib/abstractMethod.js"}],"../node_modules/o3/index.js":[function(require,module,exports) {
require("capability/es5");

module.exports = require("./lib");
},{"capability/es5":"../node_modules/capability/es5.js","./lib":"../node_modules/o3/lib/index.js"}],"../node_modules/u3/lib/cache.js":[function(require,module,exports) {
var cache = function (fn) {
    var called = false,
        store;

    if (!(fn instanceof Function)) {
        called = true;
        store = fn;
        delete(fn);
    }

    return function () {
        if (!called) {
            called = true;
            store = fn.apply(this, arguments);
            delete(fn);
        }
        return store;
    };
};

module.exports = cache;
},{}],"../node_modules/u3/lib/eachCombination.js":[function(require,module,exports) {
module.exports = function eachCombination(alternativesByDimension, callback, combination) {
    if (!combination)
        combination = [];
    if (combination.length < alternativesByDimension.length) {
        var alternatives = alternativesByDimension[combination.length];
        for (var index in alternatives) {
            combination[combination.length] = alternatives[index];
            eachCombination(alternativesByDimension, callback, combination);
            --combination.length;
        }
    }
    else
        callback.apply(null, combination);
};
},{}],"../node_modules/u3/lib/index.js":[function(require,module,exports) {
module.exports = {
    cache: require("./cache"),
    eachCombination: require("./eachCombination")
};
},{"./cache":"../node_modules/u3/lib/cache.js","./eachCombination":"../node_modules/u3/lib/eachCombination.js"}],"../node_modules/u3/index.js":[function(require,module,exports) {
module.exports = require("./lib");
},{"./lib":"../node_modules/u3/lib/index.js"}],"../node_modules/error-polyfill/lib/non-v8/FrameStringSource.js":[function(require,module,exports) {
var Class = require("o3").Class,
    abstractMethod = require("o3").abstractMethod,
    eachCombination = require("u3").eachCombination,
    cache = require("u3").cache,
    capability = require("capability");

var AbstractFrameStringSource = Class(Object, {
    prototype: {
        captureFrameStrings: function (frameShifts) {
            var error = this.createError();
            frameShifts.unshift(this.captureFrameStrings);
            frameShifts.unshift(this.createError);
            var capturedFrameStrings = this.getFrameStrings(error);

            var frameStrings = capturedFrameStrings.slice(frameShifts.length),
                functionValues = [];

            if (capability("arguments.callee.caller")) {
                var capturedFunctionValues = [
                    this.createError,
                    this.captureFrameStrings
                ];
                try {
                    var aCaller = arguments.callee;
                    while (aCaller = aCaller.caller)
                        capturedFunctionValues.push(aCaller);
                }
                catch (useStrictError) {
                }
                functionValues = capturedFunctionValues.slice(frameShifts.length);
            }
            return {
                frameStrings: frameStrings,
                functionValues: functionValues
            };
        },
        getFrameStrings: function (error) {
            var message = error.message || "";
            var name = error.name || "";
            var stackString = this.getStackString(error);
            if (stackString === undefined)
                return;
            var stackStringChunks = stackString.split("\n");
            var fromPosition = 0;
            var toPosition = stackStringChunks.length;
            if (this.hasHeader)
                fromPosition += name.split("\n").length + message.split("\n").length - 1;
            if (this.hasFooter)
                toPosition -= 1;
            return stackStringChunks.slice(fromPosition, toPosition);
        },
        createError: abstractMethod,
        getStackString: abstractMethod,
        hasHeader: undefined,
        hasFooter: undefined
    }
});

var FrameStringSourceCalibrator = Class(Object, {
    prototype: {
        calibrateClass: function (FrameStringSource) {
            return this.calibrateMethods(FrameStringSource) && this.calibrateEnvelope(FrameStringSource);
        },
        calibrateMethods: function (FrameStringSource) {
            try {
                eachCombination([[
                    function (message) {
                        return new Error(message);
                    },
                    function (message) {
                        try {
                            throw new Error(message);
                        }
                        catch (error) {
                            return error;
                        }
                    }
                ], [
                    function (error) {
                        return error.stack;
                    },
                    function (error) {
                        return error.stacktrace;
                    }
                ]], function (createError, getStackString) {
                    if (getStackString(createError()))
                        throw {
                            getStackString: getStackString,
                            createError: createError
                        };
                });
            } catch (workingImplementation) {
                Class.merge.call(FrameStringSource, {
                    prototype: workingImplementation
                });
                return true;
            }
            return false;
        },
        calibrateEnvelope: function (FrameStringSource) {
            var getStackString = FrameStringSource.prototype.getStackString;
            var createError = FrameStringSource.prototype.createError;
            var calibratorStackString = getStackString(createError("marker"));
            var calibratorFrameStrings = calibratorStackString.split("\n");
            Class.merge.call(FrameStringSource, {
                prototype: {
                    hasHeader: /marker/.test(calibratorFrameStrings[0]),
                    hasFooter: calibratorFrameStrings[calibratorFrameStrings.length - 1] === ""
                }
            });
            return true;
        }
    }
});


module.exports = {
    getClass: cache(function () {
        var FrameStringSource;
        if (FrameStringSource)
            return FrameStringSource;
        FrameStringSource = Class(AbstractFrameStringSource, {});
        var calibrator = new FrameStringSourceCalibrator();
        if (!calibrator.calibrateClass(FrameStringSource))
            throw new Error("Cannot read Error.prototype.stack in this environment.");
        return FrameStringSource;
    }),
    getInstance: cache(function () {
        var FrameStringSource = this.getClass();
        var instance = new FrameStringSource();
        return instance;
    })
};
},{"o3":"../node_modules/o3/index.js","u3":"../node_modules/u3/index.js","capability":"../node_modules/capability/index.js"}],"../node_modules/error-polyfill/lib/non-v8/Frame.js":[function(require,module,exports) {
var Class = require("o3").Class,
    abstractMethod = require("o3").abstractMethod;

var Frame = Class(Object, {
    prototype: {
        init: Class.prototype.merge,
        frameString: undefined,
        toString: function () {
            return this.frameString;
        },
        functionValue: undefined,
        getThis: abstractMethod,
        getTypeName: abstractMethod,
        getFunction: function () {
            return this.functionValue;
        },
        getFunctionName: abstractMethod,
        getMethodName: abstractMethod,
        getFileName: abstractMethod,
        getLineNumber: abstractMethod,
        getColumnNumber: abstractMethod,
        getEvalOrigin: abstractMethod,
        isTopLevel: abstractMethod,
        isEval: abstractMethod,
        isNative: abstractMethod,
        isConstructor: abstractMethod
    }
});

module.exports = Frame;
},{"o3":"../node_modules/o3/index.js"}],"../node_modules/error-polyfill/lib/non-v8/FrameStringParser.js":[function(require,module,exports) {
var Class = require("o3").Class,
    Frame = require("./Frame"),
    cache = require("u3").cache;

var FrameStringParser = Class(Object, {
    prototype: {
        stackParser: null,
        frameParser: null,
        locationParsers: null,
        constructor: function (options) {
            Class.prototype.merge.call(this, options);
        },
        getFrames: function (frameStrings, functionValues) {
            var frames = [];
            for (var index = 0, length = frameStrings.length; index < length; ++index)
                frames[index] = this.getFrame(frameStrings[index], functionValues[index]);
            return frames;
        },
        getFrame: function (frameString, functionValue) {
            var config = {
                frameString: frameString,
                functionValue: functionValue
            };
            return new Frame(config);
        }
    }
});

module.exports = {
    getClass: cache(function () {
        return FrameStringParser;
    }),
    getInstance: cache(function () {
        var FrameStringParser = this.getClass();
        var instance = new FrameStringParser();
        return instance;
    })
};
},{"o3":"../node_modules/o3/index.js","./Frame":"../node_modules/error-polyfill/lib/non-v8/Frame.js","u3":"../node_modules/u3/index.js"}],"../node_modules/error-polyfill/lib/non-v8/index.js":[function(require,module,exports) {
var FrameStringSource = require("./FrameStringSource"),
    FrameStringParser = require("./FrameStringParser"),
    cache = require("u3").cache,
    prepareStackTrace = require("../prepareStackTrace");

module.exports = function () {

    Error.captureStackTrace = function captureStackTrace(throwable, terminator) {
        var warnings;
        var frameShifts = [
            captureStackTrace
        ];
        if (terminator) {
            // additional frames can come here if arguments.callee.caller is supported
            // otherwise it is hard to identify the terminator
            frameShifts.push(terminator);
        }
        var captured = FrameStringSource.getInstance().captureFrameStrings(frameShifts);
        Object.defineProperties(throwable, {
            stack: {
                configurable: true,
                get: cache(function () {
                    var frames = FrameStringParser.getInstance().getFrames(captured.frameStrings, captured.functionValues);
                    return (Error.prepareStackTrace || prepareStackTrace)(throwable, frames, warnings);
                })
            },
            cachedStack: {
                configurable: true,
                writable: true,
                enumerable: false,
                value: true
            }
        });
    };

    Error.getStackTrace = function (throwable) {
        if (throwable.cachedStack)
            return throwable.stack;
        var frameStrings = FrameStringSource.getInstance().getFrameStrings(throwable),
            frames = [],
            warnings;
        if (frameStrings)
            frames = FrameStringParser.getInstance().getFrames(frameStrings, []);
        else
            warnings = [
                "The stack is not readable by unthrown errors in this environment."
            ];
        var stack = (Error.prepareStackTrace || prepareStackTrace)(throwable, frames, warnings);
        if (frameStrings)
            try {
                Object.defineProperties(throwable, {
                    stack: {
                        configurable: true,
                        writable: true,
                        enumerable: false,
                        value: stack
                    },
                    cachedStack: {
                        configurable: true,
                        writable: true,
                        enumerable: false,
                        value: true
                    }
                });
            } catch (nonConfigurableError) {
            }
        return stack;
    };

    return {
        prepareStackTrace: prepareStackTrace
    };
};
},{"./FrameStringSource":"../node_modules/error-polyfill/lib/non-v8/FrameStringSource.js","./FrameStringParser":"../node_modules/error-polyfill/lib/non-v8/FrameStringParser.js","u3":"../node_modules/u3/index.js","../prepareStackTrace":"../node_modules/error-polyfill/lib/prepareStackTrace.js"}],"../node_modules/error-polyfill/lib/unsupported.js":[function(require,module,exports) {
var cache = require("u3").cache,
    prepareStackTrace = require("./prepareStackTrace");

module.exports = function () {

    Error.captureStackTrace = function (throwable, terminator) {
        Object.defineProperties(throwable, {
            stack: {
                configurable: true,
                get: cache(function () {
                    return (Error.prepareStackTrace || prepareStackTrace)(throwable, []);
                })
            },
            cachedStack: {
                configurable: true,
                writable: true,
                enumerable: false,
                value: true
            }
        });
    };

    Error.getStackTrace = function (throwable) {
        if (throwable.cachedStack)
            return throwable.stack;
        var stack = (Error.prepareStackTrace || prepareStackTrace)(throwable, []);
        try {
            Object.defineProperties(throwable, {
                stack: {
                    configurable: true,
                    writable: true,
                    enumerable: false,
                    value: stack
                },
                cachedStack: {
                    configurable: true,
                    writable: true,
                    enumerable: false,
                    value: true
                }
            });
        } catch (nonConfigurableError) {
        }
        return stack;
    };

    return {
        prepareStackTrace: prepareStackTrace
    };
};
},{"u3":"../node_modules/u3/index.js","./prepareStackTrace":"../node_modules/error-polyfill/lib/prepareStackTrace.js"}],"../node_modules/error-polyfill/lib/index.js":[function(require,module,exports) {
require("capability/es5");

var capability = require("capability");

var polyfill;
if (capability("Error.captureStackTrace"))
    polyfill = require("./v8");
else if (capability("Error.prototype.stack"))
    polyfill = require("./non-v8/index");
else
    polyfill = require("./unsupported");

module.exports = polyfill();
},{"capability/es5":"../node_modules/capability/es5.js","capability":"../node_modules/capability/index.js","./v8":"../node_modules/error-polyfill/lib/v8.js","./non-v8/index":"../node_modules/error-polyfill/lib/non-v8/index.js","./unsupported":"../node_modules/error-polyfill/lib/unsupported.js"}],"../node_modules/error-polyfill/index.js":[function(require,module,exports) {
module.exports = require("./lib");
},{"./lib":"../node_modules/error-polyfill/lib/index.js"}],"../node_modules/near-api-js/lib/browser-index.js":[function(require,module,exports) {
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
/** @hidden @module */
exports.keyStores = __importStar(require("./key_stores/browser-index"));
__exportStar(require("./common-index"), exports);
__exportStar(require("./browser-connect"), exports);
require("error-polyfill");

},{"./key_stores/browser-index":"../node_modules/near-api-js/lib/key_stores/browser-index.js","./common-index":"../node_modules/near-api-js/lib/common-index.js","./browser-connect":"../node_modules/near-api-js/lib/browser-connect.js","error-polyfill":"../node_modules/error-polyfill/index.js"}],"config.js":[function(require,module,exports) {
var CONTRACT_NAME = 'kolserdav.testnet';

function getConfig(env) {
  switch (env) {
    case 'production':
    case 'mainnet':
      return {
        networkId: 'mainnet',
        nodeUrl: 'https://rpc.mainnet.near.org',
        contractName: CONTRACT_NAME,
        walletUrl: 'https://wallet.near.org',
        helperUrl: 'https://helper.mainnet.near.org',
        explorerUrl: 'https://explorer.mainnet.near.org'
      };

    case 'development':
    case 'testnet':
      return {
        networkId: 'testnet',
        nodeUrl: 'https://rpc.testnet.near.org',
        contractName: CONTRACT_NAME,
        walletUrl: 'https://wallet.testnet.near.org',
        helperUrl: 'https://helper.testnet.near.org',
        explorerUrl: 'https://explorer.testnet.near.org'
      };

    case 'betanet':
      return {
        networkId: 'betanet',
        nodeUrl: 'https://rpc.betanet.near.org',
        contractName: CONTRACT_NAME,
        walletUrl: 'https://wallet.betanet.near.org',
        helperUrl: 'https://helper.betanet.near.org',
        explorerUrl: 'https://explorer.betanet.near.org'
      };

    case 'local':
      return {
        networkId: 'local',
        nodeUrl: 'http://localhost:3030',
        keyPath: "".concat("/home/kol", "/.near/validator_key.json"),
        walletUrl: 'http://localhost:4000/wallet',
        contractName: CONTRACT_NAME
      };

    case 'test':
    case 'ci':
      return {
        networkId: 'shared-test',
        nodeUrl: 'https://rpc.ci-testnet.near.org',
        contractName: CONTRACT_NAME,
        masterAccount: 'test.near'
      };

    case 'ci-betanet':
      return {
        networkId: 'shared-test-staging',
        nodeUrl: 'https://rpc.ci-betanet.near.org',
        contractName: CONTRACT_NAME,
        masterAccount: 'test.near'
      };

    case 'firebase':
      return {
        FIREBASE_PROJECT_ID: 'database-e4a34',
        FIRESTORE_COLLECTION_NAME: 'metadata'
      };

    default:
      throw Error("Unconfigured environment '".concat(env, "'. Can be configured in src/config.js."));
  }
}

module.exports = getConfig;
},{}],"utils.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initContract = initContract;
exports.logout = logout;
exports.login = login;

var _nearApiJs = require("near-api-js");

var _config = _interopRequireDefault(require("./config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var nearConfig = (0, _config.default)("development" || 'development'); // Initialize contract & set global variables

function initContract() {
  return _initContract.apply(this, arguments);
}

function _initContract() {
  _initContract = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var near;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _nearApiJs.connect)(Object.assign({
              deps: {
                keyStore: new _nearApiJs.keyStores.BrowserLocalStorageKeyStore()
              }
            }, nearConfig));

          case 2:
            near = _context.sent;
            // Initializing Wallet based Account. It can work with NEAR testnet wallet that
            // is hosted at https://wallet.testnet.near.org
            window.walletConnection = new _nearApiJs.WalletConnection(near); // Getting the Account ID. If still unauthorized, it's just empty string

            window.accountId = window.walletConnection.getAccountId(); // Initializing our contract APIs by contract name and configuration

            _context.next = 7;
            return new _nearApiJs.Contract(window.walletConnection.account(), nearConfig.contractName, {
              // View methods are read only. They don't modify the state, but usually return some value.
              viewMethods: ['get_greeting'],
              // Change methods can modify the state. But you don't receive the returned value when called.
              changeMethods: ['set_greeting']
            });

          case 7:
            window.contract = _context.sent;

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _initContract.apply(this, arguments);
}

function logout() {
  window.walletConnection.signOut(); // reload page

  window.location.replace(window.location.origin + window.location.pathname);
}

function login() {
  // Allow the current app to make calls to the specified contract on the
  // user's behalf.
  // This works by creating a new access key for the user's account and storing
  // the private key in localStorage.
  window.walletConnection.requestSignIn(nearConfig.contractName);
}
},{"near-api-js":"../node_modules/near-api-js/lib/browser-index.js","./config":"config.js"}],"../../node_modules/tslib/tslib.es6.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__extends = __extends;
exports.__rest = __rest;
exports.__decorate = __decorate;
exports.__param = __param;
exports.__metadata = __metadata;
exports.__awaiter = __awaiter;
exports.__generator = __generator;
exports.__exportStar = __exportStar;
exports.__values = __values;
exports.__read = __read;
exports.__spread = __spread;
exports.__spreadArrays = __spreadArrays;
exports.__spreadArray = __spreadArray;
exports.__await = __await;
exports.__asyncGenerator = __asyncGenerator;
exports.__asyncDelegator = __asyncDelegator;
exports.__asyncValues = __asyncValues;
exports.__makeTemplateObject = __makeTemplateObject;
exports.__importStar = __importStar;
exports.__importDefault = __importDefault;
exports.__classPrivateFieldGet = __classPrivateFieldGet;
exports.__classPrivateFieldSet = __classPrivateFieldSet;
exports.__createBinding = exports.__assign = void 0;

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

/* global Reflect, Promise */
var extendStatics = function (d, b) {
  extendStatics = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function (d, b) {
    d.__proto__ = b;
  } || function (d, b) {
    for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
  };

  return extendStatics(d, b);
};

function __extends(d, b) {
  if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
  extendStatics(d, b);

  function __() {
    this.constructor = d;
  }

  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function () {
  exports.__assign = __assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

exports.__assign = __assign;

function __rest(s, e) {
  var t = {};

  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
}

function __decorate(decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
  return function (target, key) {
    decorator(target, key, paramIndex);
  };
}

function __metadata(metadataKey, metadataValue) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}

function __generator(thisArg, body) {
  var _ = {
    label: 0,
    sent: function () {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];

      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;

        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };

        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;

        case 7:
          op = _.ops.pop();

          _.trys.pop();

          continue;

        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }

          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }

          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }

          if (t && _.label < t[2]) {
            _.label = t[2];

            _.ops.push(op);

            break;
          }

          if (t[2]) _.ops.pop();

          _.trys.pop();

          continue;
      }

      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
}

var __createBinding = Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function () {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
};

exports.__createBinding = __createBinding;

function __exportStar(m, o) {
  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
}

function __values(o) {
  var s = typeof Symbol === "function" && Symbol.iterator,
      m = s && o[s],
      i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
    next: function () {
      if (o && i >= o.length) o = void 0;
      return {
        value: o && o[i++],
        done: !o
      };
    }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o),
      r,
      ar = [],
      e;

  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = {
      error: error
    };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }

  return ar;
}
/** @deprecated */


function __spread() {
  for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));

  return ar;
}
/** @deprecated */


function __spreadArrays() {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;

  for (var r = Array(s), k = 0, i = 0; i < il; i++) for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j];

  return r;
}

function __spreadArray(to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
}

function __await(v) {
  return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var g = generator.apply(thisArg, _arguments || []),
      i,
      q = [];
  return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () {
    return this;
  }, i;

  function verb(n) {
    if (g[n]) i[n] = function (v) {
      return new Promise(function (a, b) {
        q.push([n, v, a, b]) > 1 || resume(n, v);
      });
    };
  }

  function resume(n, v) {
    try {
      step(g[n](v));
    } catch (e) {
      settle(q[0][3], e);
    }
  }

  function step(r) {
    r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
  }

  function fulfill(value) {
    resume("next", value);
  }

  function reject(value) {
    resume("throw", value);
  }

  function settle(f, v) {
    if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
  }
}

function __asyncDelegator(o) {
  var i, p;
  return i = {}, verb("next"), verb("throw", function (e) {
    throw e;
  }), verb("return"), i[Symbol.iterator] = function () {
    return this;
  }, i;

  function verb(n, f) {
    i[n] = o[n] ? function (v) {
      return (p = !p) ? {
        value: __await(o[n](v)),
        done: n === "return"
      } : f ? f(v) : v;
    } : f;
  }
}

function __asyncValues(o) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator],
      i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () {
    return this;
  }, i);

  function verb(n) {
    i[n] = o[n] && function (v) {
      return new Promise(function (resolve, reject) {
        v = o[n](v), settle(resolve, reject, v.done, v.value);
      });
    };
  }

  function settle(resolve, reject, d, v) {
    Promise.resolve(v).then(function (v) {
      resolve({
        value: v,
        done: d
      });
    }, reject);
  }
}

function __makeTemplateObject(cooked, raw) {
  if (Object.defineProperty) {
    Object.defineProperty(cooked, "raw", {
      value: raw
    });
  } else {
    cooked.raw = raw;
  }

  return cooked;
}

;

var __setModuleDefault = Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
};

function __importStar(mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);

  __setModuleDefault(result, mod);

  return result;
}

function __importDefault(mod) {
  return mod && mod.__esModule ? mod : {
    default: mod
  };
}

function __classPrivateFieldGet(receiver, state, kind, f) {
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
  if (kind === "m") throw new TypeError("Private method is not writable");
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
}
},{}],"../../node_modules/@firebase/util/dist/index.esm.js":[function(require,module,exports) {
var global = arguments[3];
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.areCookiesEnabled = areCookiesEnabled;
exports.async = async;
exports.calculateBackoffMillis = calculateBackoffMillis;
exports.contains = contains;
exports.createMockUserToken = createMockUserToken;
exports.createSubscribe = createSubscribe;
exports.deepCopy = deepCopy;
exports.deepEqual = deepEqual;
exports.deepExtend = deepExtend;
exports.errorPrefix = errorPrefix;
exports.extractQuerystring = extractQuerystring;
exports.getGlobal = getGlobal;
exports.getModularInstance = getModularInstance;
exports.getUA = getUA;
exports.isBrowser = isBrowser;
exports.isBrowserExtension = isBrowserExtension;
exports.isElectron = isElectron;
exports.isEmpty = isEmpty;
exports.isIE = isIE;
exports.isIndexedDBAvailable = isIndexedDBAvailable;
exports.isMobileCordova = isMobileCordova;
exports.isNode = isNode;
exports.isNodeSdk = isNodeSdk;
exports.isReactNative = isReactNative;
exports.isSafari = isSafari;
exports.isUWP = isUWP;
exports.jsonEval = jsonEval;
exports.map = map;
exports.ordinal = ordinal;
exports.querystring = querystring;
exports.querystringDecode = querystringDecode;
exports.safeGet = safeGet;
exports.stringify = stringify;
exports.validateCallback = validateCallback;
exports.validateContextObject = validateContextObject;
exports.validateIndexedDBOpenable = validateIndexedDBOpenable;
exports.validateNamespace = validateNamespace;
exports.validateArgCount = exports.stringToByteArray = exports.stringLength = exports.issuedAtTime = exports.isValidTimestamp = exports.isValidFormat = exports.isAdmin = exports.decode = exports.base64urlEncodeWithoutPadding = exports.base64Encode = exports.base64Decode = exports.base64 = exports.assertionError = exports.assert = exports.Sha1 = exports.RANDOM_FACTOR = exports.MAX_VALUE_MILLIS = exports.FirebaseError = exports.ErrorFactory = exports.Deferred = exports.CONSTANTS = void 0;

var _tslib = require("tslib");

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Firebase constants.  Some of these (@defines) can be overridden at compile-time.
 */
var CONSTANTS = {
  /**
   * @define {boolean} Whether this is the client Node.js SDK.
   */
  NODE_CLIENT: false,

  /**
   * @define {boolean} Whether this is the Admin Node.js SDK.
   */
  NODE_ADMIN: false,

  /**
   * Firebase SDK Version
   */
  SDK_VERSION: '${JSCORE_VERSION}'
};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Throws an error if the provided assertion is falsy
 */

exports.CONSTANTS = CONSTANTS;

var assert = function (assertion, message) {
  if (!assertion) {
    throw assertionError(message);
  }
};
/**
 * Returns an Error object suitable for throwing.
 */


exports.assert = assert;

var assertionError = function (message) {
  return new Error('Firebase Database (' + CONSTANTS.SDK_VERSION + ') INTERNAL ASSERT FAILED: ' + message);
};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


exports.assertionError = assertionError;

var stringToByteArray$1 = function (str) {
  // TODO(user): Use native implementations if/when available
  var out = [];
  var p = 0;

  for (var i = 0; i < str.length; i++) {
    var c = str.charCodeAt(i);

    if (c < 128) {
      out[p++] = c;
    } else if (c < 2048) {
      out[p++] = c >> 6 | 192;
      out[p++] = c & 63 | 128;
    } else if ((c & 0xfc00) === 0xd800 && i + 1 < str.length && (str.charCodeAt(i + 1) & 0xfc00) === 0xdc00) {
      // Surrogate Pair
      c = 0x10000 + ((c & 0x03ff) << 10) + (str.charCodeAt(++i) & 0x03ff);
      out[p++] = c >> 18 | 240;
      out[p++] = c >> 12 & 63 | 128;
      out[p++] = c >> 6 & 63 | 128;
      out[p++] = c & 63 | 128;
    } else {
      out[p++] = c >> 12 | 224;
      out[p++] = c >> 6 & 63 | 128;
      out[p++] = c & 63 | 128;
    }
  }

  return out;
};
/**
 * Turns an array of numbers into the string given by the concatenation of the
 * characters to which the numbers correspond.
 * @param bytes Array of numbers representing characters.
 * @return Stringification of the array.
 */


var byteArrayToString = function (bytes) {
  // TODO(user): Use native implementations if/when available
  var out = [];
  var pos = 0,
      c = 0;

  while (pos < bytes.length) {
    var c1 = bytes[pos++];

    if (c1 < 128) {
      out[c++] = String.fromCharCode(c1);
    } else if (c1 > 191 && c1 < 224) {
      var c2 = bytes[pos++];
      out[c++] = String.fromCharCode((c1 & 31) << 6 | c2 & 63);
    } else if (c1 > 239 && c1 < 365) {
      // Surrogate Pair
      var c2 = bytes[pos++];
      var c3 = bytes[pos++];
      var c4 = bytes[pos++];
      var u = ((c1 & 7) << 18 | (c2 & 63) << 12 | (c3 & 63) << 6 | c4 & 63) - 0x10000;
      out[c++] = String.fromCharCode(0xd800 + (u >> 10));
      out[c++] = String.fromCharCode(0xdc00 + (u & 1023));
    } else {
      var c2 = bytes[pos++];
      var c3 = bytes[pos++];
      out[c++] = String.fromCharCode((c1 & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
    }
  }

  return out.join('');
}; // We define it as an object literal instead of a class because a class compiled down to es5 can't
// be treeshaked. https://github.com/rollup/rollup/issues/1691
// Static lookup maps, lazily populated by init_()


var base64 = {
  /**
   * Maps bytes to characters.
   */
  byteToCharMap_: null,

  /**
   * Maps characters to bytes.
   */
  charToByteMap_: null,

  /**
   * Maps bytes to websafe characters.
   * @private
   */
  byteToCharMapWebSafe_: null,

  /**
   * Maps websafe characters to bytes.
   * @private
   */
  charToByteMapWebSafe_: null,

  /**
   * Our default alphabet, shared between
   * ENCODED_VALS and ENCODED_VALS_WEBSAFE
   */
  ENCODED_VALS_BASE: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + 'abcdefghijklmnopqrstuvwxyz' + '0123456789',

  /**
   * Our default alphabet. Value 64 (=) is special; it means "nothing."
   */
  get ENCODED_VALS() {
    return this.ENCODED_VALS_BASE + '+/=';
  },

  /**
   * Our websafe alphabet.
   */
  get ENCODED_VALS_WEBSAFE() {
    return this.ENCODED_VALS_BASE + '-_.';
  },

  /**
   * Whether this browser supports the atob and btoa functions. This extension
   * started at Mozilla but is now implemented by many browsers. We use the
   * ASSUME_* variables to avoid pulling in the full useragent detection library
   * but still allowing the standard per-browser compilations.
   *
   */
  HAS_NATIVE_SUPPORT: typeof atob === 'function',

  /**
   * Base64-encode an array of bytes.
   *
   * @param input An array of bytes (numbers with
   *     value in [0, 255]) to encode.
   * @param webSafe Boolean indicating we should use the
   *     alternative alphabet.
   * @return The base64 encoded string.
   */
  encodeByteArray: function (input, webSafe) {
    if (!Array.isArray(input)) {
      throw Error('encodeByteArray takes an array as a parameter');
    }

    this.init_();
    var byteToCharMap = webSafe ? this.byteToCharMapWebSafe_ : this.byteToCharMap_;
    var output = [];

    for (var i = 0; i < input.length; i += 3) {
      var byte1 = input[i];
      var haveByte2 = i + 1 < input.length;
      var byte2 = haveByte2 ? input[i + 1] : 0;
      var haveByte3 = i + 2 < input.length;
      var byte3 = haveByte3 ? input[i + 2] : 0;
      var outByte1 = byte1 >> 2;
      var outByte2 = (byte1 & 0x03) << 4 | byte2 >> 4;
      var outByte3 = (byte2 & 0x0f) << 2 | byte3 >> 6;
      var outByte4 = byte3 & 0x3f;

      if (!haveByte3) {
        outByte4 = 64;

        if (!haveByte2) {
          outByte3 = 64;
        }
      }

      output.push(byteToCharMap[outByte1], byteToCharMap[outByte2], byteToCharMap[outByte3], byteToCharMap[outByte4]);
    }

    return output.join('');
  },

  /**
   * Base64-encode a string.
   *
   * @param input A string to encode.
   * @param webSafe If true, we should use the
   *     alternative alphabet.
   * @return The base64 encoded string.
   */
  encodeString: function (input, webSafe) {
    // Shortcut for Mozilla browsers that implement
    // a native base64 encoder in the form of "btoa/atob"
    if (this.HAS_NATIVE_SUPPORT && !webSafe) {
      return btoa(input);
    }

    return this.encodeByteArray(stringToByteArray$1(input), webSafe);
  },

  /**
   * Base64-decode a string.
   *
   * @param input to decode.
   * @param webSafe True if we should use the
   *     alternative alphabet.
   * @return string representing the decoded value.
   */
  decodeString: function (input, webSafe) {
    // Shortcut for Mozilla browsers that implement
    // a native base64 encoder in the form of "btoa/atob"
    if (this.HAS_NATIVE_SUPPORT && !webSafe) {
      return atob(input);
    }

    return byteArrayToString(this.decodeStringToByteArray(input, webSafe));
  },

  /**
   * Base64-decode a string.
   *
   * In base-64 decoding, groups of four characters are converted into three
   * bytes.  If the encoder did not apply padding, the input length may not
   * be a multiple of 4.
   *
   * In this case, the last group will have fewer than 4 characters, and
   * padding will be inferred.  If the group has one or two characters, it decodes
   * to one byte.  If the group has three characters, it decodes to two bytes.
   *
   * @param input Input to decode.
   * @param webSafe True if we should use the web-safe alphabet.
   * @return bytes representing the decoded value.
   */
  decodeStringToByteArray: function (input, webSafe) {
    this.init_();
    var charToByteMap = webSafe ? this.charToByteMapWebSafe_ : this.charToByteMap_;
    var output = [];

    for (var i = 0; i < input.length;) {
      var byte1 = charToByteMap[input.charAt(i++)];
      var haveByte2 = i < input.length;
      var byte2 = haveByte2 ? charToByteMap[input.charAt(i)] : 0;
      ++i;
      var haveByte3 = i < input.length;
      var byte3 = haveByte3 ? charToByteMap[input.charAt(i)] : 64;
      ++i;
      var haveByte4 = i < input.length;
      var byte4 = haveByte4 ? charToByteMap[input.charAt(i)] : 64;
      ++i;

      if (byte1 == null || byte2 == null || byte3 == null || byte4 == null) {
        throw Error();
      }

      var outByte1 = byte1 << 2 | byte2 >> 4;
      output.push(outByte1);

      if (byte3 !== 64) {
        var outByte2 = byte2 << 4 & 0xf0 | byte3 >> 2;
        output.push(outByte2);

        if (byte4 !== 64) {
          var outByte3 = byte3 << 6 & 0xc0 | byte4;
          output.push(outByte3);
        }
      }
    }

    return output;
  },

  /**
   * Lazy static initialization function. Called before
   * accessing any of the static map variables.
   * @private
   */
  init_: function () {
    if (!this.byteToCharMap_) {
      this.byteToCharMap_ = {};
      this.charToByteMap_ = {};
      this.byteToCharMapWebSafe_ = {};
      this.charToByteMapWebSafe_ = {}; // We want quick mappings back and forth, so we precompute two maps.

      for (var i = 0; i < this.ENCODED_VALS.length; i++) {
        this.byteToCharMap_[i] = this.ENCODED_VALS.charAt(i);
        this.charToByteMap_[this.byteToCharMap_[i]] = i;
        this.byteToCharMapWebSafe_[i] = this.ENCODED_VALS_WEBSAFE.charAt(i);
        this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[i]] = i; // Be forgiving when decoding and correctly decode both encodings.

        if (i >= this.ENCODED_VALS_BASE.length) {
          this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(i)] = i;
          this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(i)] = i;
        }
      }
    }
  }
};
/**
 * URL-safe base64 encoding
 */

exports.base64 = base64;

var base64Encode = function (str) {
  var utf8Bytes = stringToByteArray$1(str);
  return base64.encodeByteArray(utf8Bytes, true);
};
/**
 * URL-safe base64 encoding (without "." padding in the end).
 * e.g. Used in JSON Web Token (JWT) parts.
 */


exports.base64Encode = base64Encode;

var base64urlEncodeWithoutPadding = function (str) {
  // Use base64url encoding and remove padding in the end (dot characters).
  return base64Encode(str).replace(/\./g, '');
};
/**
 * URL-safe base64 decoding
 *
 * NOTE: DO NOT use the global atob() function - it does NOT support the
 * base64Url variant encoding.
 *
 * @param str To be decoded
 * @return Decoded result, if possible
 */


exports.base64urlEncodeWithoutPadding = base64urlEncodeWithoutPadding;

var base64Decode = function (str) {
  try {
    return base64.decodeString(str, true);
  } catch (e) {
    console.error('base64Decode failed: ', e);
  }

  return null;
};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Do a deep-copy of basic JavaScript Objects or Arrays.
 */


exports.base64Decode = base64Decode;

function deepCopy(value) {
  return deepExtend(undefined, value);
}
/**
 * Copy properties from source to target (recursively allows extension
 * of Objects and Arrays).  Scalar values in the target are over-written.
 * If target is undefined, an object of the appropriate type will be created
 * (and returned).
 *
 * We recursively copy all child properties of plain Objects in the source- so
 * that namespace- like dictionaries are merged.
 *
 * Note that the target can be a function, in which case the properties in
 * the source Object are copied onto it as static properties of the Function.
 *
 * Note: we don't merge __proto__ to prevent prototype pollution
 */


function deepExtend(target, source) {
  if (!(source instanceof Object)) {
    return source;
  }

  switch (source.constructor) {
    case Date:
      // Treat Dates like scalars; if the target date object had any child
      // properties - they will be lost!
      var dateValue = source;
      return new Date(dateValue.getTime());

    case Object:
      if (target === undefined) {
        target = {};
      }

      break;

    case Array:
      // Always copy the array source and overwrite the target.
      target = [];
      break;

    default:
      // Not a plain Object - treat it as a scalar.
      return source;
  }

  for (var prop in source) {
    // use isValidKey to guard against prototype pollution. See https://snyk.io/vuln/SNYK-JS-LODASH-450202
    if (!source.hasOwnProperty(prop) || !isValidKey(prop)) {
      continue;
    }

    target[prop] = deepExtend(target[prop], source[prop]);
  }

  return target;
}

function isValidKey(key) {
  return key !== '__proto__';
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


var Deferred = function () {
  function Deferred() {
    var _this = this;

    this.reject = function () {};

    this.resolve = function () {};

    this.promise = new Promise(function (resolve, reject) {
      _this.resolve = resolve;
      _this.reject = reject;
    });
  }
  /**
   * Our API internals are not promiseified and cannot because our callback APIs have subtle expectations around
   * invoking promises inline, which Promises are forbidden to do. This method accepts an optional node-style callback
   * and returns a node-style callback which will resolve or reject the Deferred's promise.
   */


  Deferred.prototype.wrapCallback = function (callback) {
    var _this = this;

    return function (error, value) {
      if (error) {
        _this.reject(error);
      } else {
        _this.resolve(value);
      }

      if (typeof callback === 'function') {
        // Attaching noop handler just in case developer wasn't expecting
        // promises
        _this.promise.catch(function () {}); // Some of our callbacks don't expect a value and our own tests
        // assert that the parameter length is 1


        if (callback.length === 1) {
          callback(error);
        } else {
          callback(error, value);
        }
      }
    };
  };

  return Deferred;
}();
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


exports.Deferred = Deferred;

function createMockUserToken(token, projectId) {
  if (token.uid) {
    throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');
  } // Unsecured JWTs use "none" as the algorithm.


  var header = {
    alg: 'none',
    type: 'JWT'
  };
  var project = projectId || 'demo-project';
  var iat = token.iat || 0;
  var sub = token.sub || token.user_id;

  if (!sub) {
    throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");
  }

  var payload = (0, _tslib.__assign)({
    // Set all required fields to decent defaults
    iss: "https://securetoken.google.com/" + project,
    aud: project,
    iat: iat,
    exp: iat + 3600,
    auth_time: iat,
    sub: sub,
    user_id: sub,
    firebase: {
      sign_in_provider: 'custom',
      identities: {}
    }
  }, token); // Unsecured JWTs use the empty string as a signature.

  var signature = '';
  return [base64urlEncodeWithoutPadding(JSON.stringify(header)), base64urlEncodeWithoutPadding(JSON.stringify(payload)), signature].join('.');
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Returns navigator.userAgent string or '' if it's not defined.
 * @return user agent string
 */


function getUA() {
  if (typeof navigator !== 'undefined' && typeof navigator['userAgent'] === 'string') {
    return navigator['userAgent'];
  } else {
    return '';
  }
}
/**
 * Detect Cordova / PhoneGap / Ionic frameworks on a mobile device.
 *
 * Deliberately does not rely on checking `file://` URLs (as this fails PhoneGap
 * in the Ripple emulator) nor Cordova `onDeviceReady`, which would normally
 * wait for a callback.
 */


function isMobileCordova() {
  return typeof window !== 'undefined' && // @ts-ignore Setting up an broadly applicable index signature for Window
  // just to deal with this case would probably be a bad idea.
  !!(window['cordova'] || window['phonegap'] || window['PhoneGap']) && /ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(getUA());
}
/**
 * Detect Node.js.
 *
 * @return true if Node.js environment is detected.
 */
// Node detection logic from: https://github.com/iliakan/detect-node/


function isNode() {
  try {
    return Object.prototype.toString.call(global.process) === '[object process]';
  } catch (e) {
    return false;
  }
}
/**
 * Detect Browser Environment
 */


function isBrowser() {
  return typeof self === 'object' && self.self === self;
}

function isBrowserExtension() {
  var runtime = typeof chrome === 'object' ? chrome.runtime : typeof browser === 'object' ? browser.runtime : undefined;
  return typeof runtime === 'object' && runtime.id !== undefined;
}
/**
 * Detect React Native.
 *
 * @return true if ReactNative environment is detected.
 */


function isReactNative() {
  return typeof navigator === 'object' && navigator['product'] === 'ReactNative';
}
/** Detects Electron apps. */


function isElectron() {
  return getUA().indexOf('Electron/') >= 0;
}
/** Detects Internet Explorer. */


function isIE() {
  var ua = getUA();
  return ua.indexOf('MSIE ') >= 0 || ua.indexOf('Trident/') >= 0;
}
/** Detects Universal Windows Platform apps. */


function isUWP() {
  return getUA().indexOf('MSAppHost/') >= 0;
}
/**
 * Detect whether the current SDK build is the Node version.
 *
 * @return true if it's the Node SDK build.
 */


function isNodeSdk() {
  return CONSTANTS.NODE_CLIENT === true || CONSTANTS.NODE_ADMIN === true;
}
/** Returns true if we are running in Safari. */


function isSafari() {
  return !isNode() && navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome');
}
/**
 * This method checks if indexedDB is supported by current browser/service worker context
 * @return true if indexedDB is supported by current browser/service worker context
 */


function isIndexedDBAvailable() {
  return 'indexedDB' in self && indexedDB != null;
}
/**
 * This method validates browser/sw context for indexedDB by opening a dummy indexedDB database and reject
 * if errors occur during the database open operation.
 *
 * @throws exception if current browser/sw context can't run idb.open (ex: Safari iframe, Firefox
 * private browsing)
 */


function validateIndexedDBOpenable() {
  return new Promise(function (resolve, reject) {
    try {
      var preExist_1 = true;
      var DB_CHECK_NAME_1 = 'validate-browser-context-for-indexeddb-analytics-module';
      var request_1 = self.indexedDB.open(DB_CHECK_NAME_1);

      request_1.onsuccess = function () {
        request_1.result.close(); // delete database only when it doesn't pre-exist

        if (!preExist_1) {
          self.indexedDB.deleteDatabase(DB_CHECK_NAME_1);
        }

        resolve(true);
      };

      request_1.onupgradeneeded = function () {
        preExist_1 = false;
      };

      request_1.onerror = function () {
        var _a;

        reject(((_a = request_1.error) === null || _a === void 0 ? void 0 : _a.message) || '');
      };
    } catch (error) {
      reject(error);
    }
  });
}
/**
 *
 * This method checks whether cookie is enabled within current browser
 * @return true if cookie is enabled within current browser
 */


function areCookiesEnabled() {
  if (!navigator || !navigator.cookieEnabled) {
    return false;
  }

  return true;
}
/**
 * Polyfill for `globalThis` object.
 * @returns the `globalThis` object for the given environment.
 */


function getGlobal() {
  if (typeof self !== 'undefined') {
    return self;
  }

  if (typeof window !== 'undefined') {
    return window;
  }

  if (typeof global !== 'undefined') {
    return global;
  }

  throw new Error('Unable to locate global object.');
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


var ERROR_NAME = 'FirebaseError'; // Based on code from:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#Custom_Error_Types

var FirebaseError = function (_super) {
  (0, _tslib.__extends)(FirebaseError, _super);

  function FirebaseError(code, message, customData) {
    var _this = _super.call(this, message) || this;

    _this.code = code;
    _this.customData = customData;
    _this.name = ERROR_NAME; // Fix For ES5
    // https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work

    Object.setPrototypeOf(_this, FirebaseError.prototype); // Maintains proper stack trace for where our error was thrown.
    // Only available on V8.

    if (Error.captureStackTrace) {
      Error.captureStackTrace(_this, ErrorFactory.prototype.create);
    }

    return _this;
  }

  return FirebaseError;
}(Error);

exports.FirebaseError = FirebaseError;

var ErrorFactory = function () {
  function ErrorFactory(service, serviceName, errors) {
    this.service = service;
    this.serviceName = serviceName;
    this.errors = errors;
  }

  ErrorFactory.prototype.create = function (code) {
    var data = [];

    for (var _i = 1; _i < arguments.length; _i++) {
      data[_i - 1] = arguments[_i];
    }

    var customData = data[0] || {};
    var fullCode = this.service + "/" + code;
    var template = this.errors[code];
    var message = template ? replaceTemplate(template, customData) : 'Error'; // Service Name: Error message (service/code).

    var fullMessage = this.serviceName + ": " + message + " (" + fullCode + ").";
    var error = new FirebaseError(fullCode, fullMessage, customData);
    return error;
  };

  return ErrorFactory;
}();

exports.ErrorFactory = ErrorFactory;

function replaceTemplate(template, data) {
  return template.replace(PATTERN, function (_, key) {
    var value = data[key];
    return value != null ? String(value) : "<" + key + "?>";
  });
}

var PATTERN = /\{\$([^}]+)}/g;
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Evaluates a JSON string into a javascript object.
 *
 * @param {string} str A string containing JSON.
 * @return {*} The javascript object representing the specified JSON.
 */

function jsonEval(str) {
  return JSON.parse(str);
}
/**
 * Returns JSON representing a javascript object.
 * @param {*} data Javascript object to be stringified.
 * @return {string} The JSON contents of the object.
 */


function stringify(data) {
  return JSON.stringify(data);
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Decodes a Firebase auth. token into constituent parts.
 *
 * Notes:
 * - May return with invalid / incomplete claims if there's no native base64 decoding support.
 * - Doesn't check if the token is actually valid.
 */


var decode = function (token) {
  var header = {},
      claims = {},
      data = {},
      signature = '';

  try {
    var parts = token.split('.');
    header = jsonEval(base64Decode(parts[0]) || '');
    claims = jsonEval(base64Decode(parts[1]) || '');
    signature = parts[2];
    data = claims['d'] || {};
    delete claims['d'];
  } catch (e) {}

  return {
    header: header,
    claims: claims,
    data: data,
    signature: signature
  };
};
/**
 * Decodes a Firebase auth. token and checks the validity of its time-based claims. Will return true if the
 * token is within the time window authorized by the 'nbf' (not-before) and 'iat' (issued-at) claims.
 *
 * Notes:
 * - May return a false negative if there's no native base64 decoding support.
 * - Doesn't check if the token is actually valid.
 */


exports.decode = decode;

var isValidTimestamp = function (token) {
  var claims = decode(token).claims;
  var now = Math.floor(new Date().getTime() / 1000);
  var validSince = 0,
      validUntil = 0;

  if (typeof claims === 'object') {
    if (claims.hasOwnProperty('nbf')) {
      validSince = claims['nbf'];
    } else if (claims.hasOwnProperty('iat')) {
      validSince = claims['iat'];
    }

    if (claims.hasOwnProperty('exp')) {
      validUntil = claims['exp'];
    } else {
      // token will expire after 24h by default
      validUntil = validSince + 86400;
    }
  }

  return !!now && !!validSince && !!validUntil && now >= validSince && now <= validUntil;
};
/**
 * Decodes a Firebase auth. token and returns its issued at time if valid, null otherwise.
 *
 * Notes:
 * - May return null if there's no native base64 decoding support.
 * - Doesn't check if the token is actually valid.
 */


exports.isValidTimestamp = isValidTimestamp;

var issuedAtTime = function (token) {
  var claims = decode(token).claims;

  if (typeof claims === 'object' && claims.hasOwnProperty('iat')) {
    return claims['iat'];
  }

  return null;
};
/**
 * Decodes a Firebase auth. token and checks the validity of its format. Expects a valid issued-at time.
 *
 * Notes:
 * - May return a false negative if there's no native base64 decoding support.
 * - Doesn't check if the token is actually valid.
 */


exports.issuedAtTime = issuedAtTime;

var isValidFormat = function (token) {
  var decoded = decode(token),
      claims = decoded.claims;
  return !!claims && typeof claims === 'object' && claims.hasOwnProperty('iat');
};
/**
 * Attempts to peer into an auth token and determine if it's an admin auth token by looking at the claims portion.
 *
 * Notes:
 * - May return a false negative if there's no native base64 decoding support.
 * - Doesn't check if the token is actually valid.
 */


exports.isValidFormat = isValidFormat;

var isAdmin = function (token) {
  var claims = decode(token).claims;
  return typeof claims === 'object' && claims['admin'] === true;
};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


exports.isAdmin = isAdmin;

function contains(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

function safeGet(obj, key) {
  if (Object.prototype.hasOwnProperty.call(obj, key)) {
    return obj[key];
  } else {
    return undefined;
  }
}

function isEmpty(obj) {
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return false;
    }
  }

  return true;
}

function map(obj, fn, contextObj) {
  var res = {};

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      res[key] = fn.call(contextObj, obj[key], key, obj);
    }
  }

  return res;
}
/**
 * Deep equal two objects. Support Arrays and Objects.
 */


function deepEqual(a, b) {
  if (a === b) {
    return true;
  }

  var aKeys = Object.keys(a);
  var bKeys = Object.keys(b);

  for (var _i = 0, aKeys_1 = aKeys; _i < aKeys_1.length; _i++) {
    var k = aKeys_1[_i];

    if (!bKeys.includes(k)) {
      return false;
    }

    var aProp = a[k];
    var bProp = b[k];

    if (isObject(aProp) && isObject(bProp)) {
      if (!deepEqual(aProp, bProp)) {
        return false;
      }
    } else if (aProp !== bProp) {
      return false;
    }
  }

  for (var _a = 0, bKeys_1 = bKeys; _a < bKeys_1.length; _a++) {
    var k = bKeys_1[_a];

    if (!aKeys.includes(k)) {
      return false;
    }
  }

  return true;
}

function isObject(thing) {
  return thing !== null && typeof thing === 'object';
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Returns a querystring-formatted string (e.g. &arg=val&arg2=val2) from a
 * params object (e.g. {arg: 'val', arg2: 'val2'})
 * Note: You must prepend it with ? when adding it to a URL.
 */


function querystring(querystringParams) {
  var params = [];

  var _loop_1 = function (key, value) {
    if (Array.isArray(value)) {
      value.forEach(function (arrayVal) {
        params.push(encodeURIComponent(key) + '=' + encodeURIComponent(arrayVal));
      });
    } else {
      params.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
    }
  };

  for (var _i = 0, _a = Object.entries(querystringParams); _i < _a.length; _i++) {
    var _b = _a[_i],
        key = _b[0],
        value = _b[1];

    _loop_1(key, value);
  }

  return params.length ? '&' + params.join('&') : '';
}
/**
 * Decodes a querystring (e.g. ?arg=val&arg2=val2) into a params object
 * (e.g. {arg: 'val', arg2: 'val2'})
 */


function querystringDecode(querystring) {
  var obj = {};
  var tokens = querystring.replace(/^\?/, '').split('&');
  tokens.forEach(function (token) {
    if (token) {
      var _a = token.split('='),
          key = _a[0],
          value = _a[1];

      obj[decodeURIComponent(key)] = decodeURIComponent(value);
    }
  });
  return obj;
}
/**
 * Extract the query string part of a URL, including the leading question mark (if present).
 */


function extractQuerystring(url) {
  var queryStart = url.indexOf('?');

  if (!queryStart) {
    return '';
  }

  var fragmentStart = url.indexOf('#', queryStart);
  return url.substring(queryStart, fragmentStart > 0 ? fragmentStart : undefined);
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview SHA-1 cryptographic hash.
 * Variable names follow the notation in FIPS PUB 180-3:
 * http://csrc.nist.gov/publications/fips/fips180-3/fips180-3_final.pdf.
 *
 * Usage:
 *   var sha1 = new sha1();
 *   sha1.update(bytes);
 *   var hash = sha1.digest();
 *
 * Performance:
 *   Chrome 23:   ~400 Mbit/s
 *   Firefox 16:  ~250 Mbit/s
 *
 */

/**
 * SHA-1 cryptographic hash constructor.
 *
 * The properties declared here are discussed in the above algorithm document.
 * @constructor
 * @final
 * @struct
 */


var Sha1 = function () {
  function Sha1() {
    /**
     * Holds the previous values of accumulated variables a-e in the compress_
     * function.
     * @private
     */
    this.chain_ = [];
    /**
     * A buffer holding the partially computed hash result.
     * @private
     */

    this.buf_ = [];
    /**
     * An array of 80 bytes, each a part of the message to be hashed.  Referred to
     * as the message schedule in the docs.
     * @private
     */

    this.W_ = [];
    /**
     * Contains data needed to pad messages less than 64 bytes.
     * @private
     */

    this.pad_ = [];
    /**
     * @private {number}
     */

    this.inbuf_ = 0;
    /**
     * @private {number}
     */

    this.total_ = 0;
    this.blockSize = 512 / 8;
    this.pad_[0] = 128;

    for (var i = 1; i < this.blockSize; ++i) {
      this.pad_[i] = 0;
    }

    this.reset();
  }

  Sha1.prototype.reset = function () {
    this.chain_[0] = 0x67452301;
    this.chain_[1] = 0xefcdab89;
    this.chain_[2] = 0x98badcfe;
    this.chain_[3] = 0x10325476;
    this.chain_[4] = 0xc3d2e1f0;
    this.inbuf_ = 0;
    this.total_ = 0;
  };
  /**
   * Internal compress helper function.
   * @param buf Block to compress.
   * @param offset Offset of the block in the buffer.
   * @private
   */


  Sha1.prototype.compress_ = function (buf, offset) {
    if (!offset) {
      offset = 0;
    }

    var W = this.W_; // get 16 big endian words

    if (typeof buf === 'string') {
      for (var i = 0; i < 16; i++) {
        // TODO(user): [bug 8140122] Recent versions of Safari for Mac OS and iOS
        // have a bug that turns the post-increment ++ operator into pre-increment
        // during JIT compilation.  We have code that depends heavily on SHA-1 for
        // correctness and which is affected by this bug, so I've removed all uses
        // of post-increment ++ in which the result value is used.  We can revert
        // this change once the Safari bug
        // (https://bugs.webkit.org/show_bug.cgi?id=109036) has been fixed and
        // most clients have been updated.
        W[i] = buf.charCodeAt(offset) << 24 | buf.charCodeAt(offset + 1) << 16 | buf.charCodeAt(offset + 2) << 8 | buf.charCodeAt(offset + 3);
        offset += 4;
      }
    } else {
      for (var i = 0; i < 16; i++) {
        W[i] = buf[offset] << 24 | buf[offset + 1] << 16 | buf[offset + 2] << 8 | buf[offset + 3];
        offset += 4;
      }
    } // expand to 80 words


    for (var i = 16; i < 80; i++) {
      var t = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16];
      W[i] = (t << 1 | t >>> 31) & 0xffffffff;
    }

    var a = this.chain_[0];
    var b = this.chain_[1];
    var c = this.chain_[2];
    var d = this.chain_[3];
    var e = this.chain_[4];
    var f, k; // TODO(user): Try to unroll this loop to speed up the computation.

    for (var i = 0; i < 80; i++) {
      if (i < 40) {
        if (i < 20) {
          f = d ^ b & (c ^ d);
          k = 0x5a827999;
        } else {
          f = b ^ c ^ d;
          k = 0x6ed9eba1;
        }
      } else {
        if (i < 60) {
          f = b & c | d & (b | c);
          k = 0x8f1bbcdc;
        } else {
          f = b ^ c ^ d;
          k = 0xca62c1d6;
        }
      }

      var t = (a << 5 | a >>> 27) + f + e + k + W[i] & 0xffffffff;
      e = d;
      d = c;
      c = (b << 30 | b >>> 2) & 0xffffffff;
      b = a;
      a = t;
    }

    this.chain_[0] = this.chain_[0] + a & 0xffffffff;
    this.chain_[1] = this.chain_[1] + b & 0xffffffff;
    this.chain_[2] = this.chain_[2] + c & 0xffffffff;
    this.chain_[3] = this.chain_[3] + d & 0xffffffff;
    this.chain_[4] = this.chain_[4] + e & 0xffffffff;
  };

  Sha1.prototype.update = function (bytes, length) {
    // TODO(johnlenz): tighten the function signature and remove this check
    if (bytes == null) {
      return;
    }

    if (length === undefined) {
      length = bytes.length;
    }

    var lengthMinusBlock = length - this.blockSize;
    var n = 0; // Using local instead of member variables gives ~5% speedup on Firefox 16.

    var buf = this.buf_;
    var inbuf = this.inbuf_; // The outer while loop should execute at most twice.

    while (n < length) {
      // When we have no data in the block to top up, we can directly process the
      // input buffer (assuming it contains sufficient data). This gives ~25%
      // speedup on Chrome 23 and ~15% speedup on Firefox 16, but requires that
      // the data is provided in large chunks (or in multiples of 64 bytes).
      if (inbuf === 0) {
        while (n <= lengthMinusBlock) {
          this.compress_(bytes, n);
          n += this.blockSize;
        }
      }

      if (typeof bytes === 'string') {
        while (n < length) {
          buf[inbuf] = bytes.charCodeAt(n);
          ++inbuf;
          ++n;

          if (inbuf === this.blockSize) {
            this.compress_(buf);
            inbuf = 0; // Jump to the outer loop so we use the full-block optimization.

            break;
          }
        }
      } else {
        while (n < length) {
          buf[inbuf] = bytes[n];
          ++inbuf;
          ++n;

          if (inbuf === this.blockSize) {
            this.compress_(buf);
            inbuf = 0; // Jump to the outer loop so we use the full-block optimization.

            break;
          }
        }
      }
    }

    this.inbuf_ = inbuf;
    this.total_ += length;
  };
  /** @override */


  Sha1.prototype.digest = function () {
    var digest = [];
    var totalBits = this.total_ * 8; // Add pad 0x80 0x00*.

    if (this.inbuf_ < 56) {
      this.update(this.pad_, 56 - this.inbuf_);
    } else {
      this.update(this.pad_, this.blockSize - (this.inbuf_ - 56));
    } // Add # bits.


    for (var i = this.blockSize - 1; i >= 56; i--) {
      this.buf_[i] = totalBits & 255;
      totalBits /= 256; // Don't use bit-shifting here!
    }

    this.compress_(this.buf_);
    var n = 0;

    for (var i = 0; i < 5; i++) {
      for (var j = 24; j >= 0; j -= 8) {
        digest[n] = this.chain_[i] >> j & 255;
        ++n;
      }
    }

    return digest;
  };

  return Sha1;
}();
/**
 * Helper to make a Subscribe function (just like Promise helps make a
 * Thenable).
 *
 * @param executor Function which can make calls to a single Observer
 *     as a proxy.
 * @param onNoObservers Callback when count of Observers goes to zero.
 */


exports.Sha1 = Sha1;

function createSubscribe(executor, onNoObservers) {
  var proxy = new ObserverProxy(executor, onNoObservers);
  return proxy.subscribe.bind(proxy);
}
/**
 * Implement fan-out for any number of Observers attached via a subscribe
 * function.
 */


var ObserverProxy = function () {
  /**
   * @param executor Function which can make calls to a single Observer
   *     as a proxy.
   * @param onNoObservers Callback when count of Observers goes to zero.
   */
  function ObserverProxy(executor, onNoObservers) {
    var _this = this;

    this.observers = [];
    this.unsubscribes = [];
    this.observerCount = 0; // Micro-task scheduling by calling task.then().

    this.task = Promise.resolve();
    this.finalized = false;
    this.onNoObservers = onNoObservers; // Call the executor asynchronously so subscribers that are called
    // synchronously after the creation of the subscribe function
    // can still receive the very first value generated in the executor.

    this.task.then(function () {
      executor(_this);
    }).catch(function (e) {
      _this.error(e);
    });
  }

  ObserverProxy.prototype.next = function (value) {
    this.forEachObserver(function (observer) {
      observer.next(value);
    });
  };

  ObserverProxy.prototype.error = function (error) {
    this.forEachObserver(function (observer) {
      observer.error(error);
    });
    this.close(error);
  };

  ObserverProxy.prototype.complete = function () {
    this.forEachObserver(function (observer) {
      observer.complete();
    });
    this.close();
  };
  /**
   * Subscribe function that can be used to add an Observer to the fan-out list.
   *
   * - We require that no event is sent to a subscriber sychronously to their
   *   call to subscribe().
   */


  ObserverProxy.prototype.subscribe = function (nextOrObserver, error, complete) {
    var _this = this;

    var observer;

    if (nextOrObserver === undefined && error === undefined && complete === undefined) {
      throw new Error('Missing Observer.');
    } // Assemble an Observer object when passed as callback functions.


    if (implementsAnyMethods(nextOrObserver, ['next', 'error', 'complete'])) {
      observer = nextOrObserver;
    } else {
      observer = {
        next: nextOrObserver,
        error: error,
        complete: complete
      };
    }

    if (observer.next === undefined) {
      observer.next = noop;
    }

    if (observer.error === undefined) {
      observer.error = noop;
    }

    if (observer.complete === undefined) {
      observer.complete = noop;
    }

    var unsub = this.unsubscribeOne.bind(this, this.observers.length); // Attempt to subscribe to a terminated Observable - we
    // just respond to the Observer with the final error or complete
    // event.

    if (this.finalized) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.task.then(function () {
        try {
          if (_this.finalError) {
            observer.error(_this.finalError);
          } else {
            observer.complete();
          }
        } catch (e) {// nothing
        }

        return;
      });
    }

    this.observers.push(observer);
    return unsub;
  }; // Unsubscribe is synchronous - we guarantee that no events are sent to
  // any unsubscribed Observer.


  ObserverProxy.prototype.unsubscribeOne = function (i) {
    if (this.observers === undefined || this.observers[i] === undefined) {
      return;
    }

    delete this.observers[i];
    this.observerCount -= 1;

    if (this.observerCount === 0 && this.onNoObservers !== undefined) {
      this.onNoObservers(this);
    }
  };

  ObserverProxy.prototype.forEachObserver = function (fn) {
    if (this.finalized) {
      // Already closed by previous event....just eat the additional values.
      return;
    } // Since sendOne calls asynchronously - there is no chance that
    // this.observers will become undefined.


    for (var i = 0; i < this.observers.length; i++) {
      this.sendOne(i, fn);
    }
  }; // Call the Observer via one of it's callback function. We are careful to
  // confirm that the observe has not been unsubscribed since this asynchronous
  // function had been queued.


  ObserverProxy.prototype.sendOne = function (i, fn) {
    var _this = this; // Execute the callback asynchronously
    // eslint-disable-next-line @typescript-eslint/no-floating-promises


    this.task.then(function () {
      if (_this.observers !== undefined && _this.observers[i] !== undefined) {
        try {
          fn(_this.observers[i]);
        } catch (e) {
          // Ignore exceptions raised in Observers or missing methods of an
          // Observer.
          // Log error to console. b/31404806
          if (typeof console !== 'undefined' && console.error) {
            console.error(e);
          }
        }
      }
    });
  };

  ObserverProxy.prototype.close = function (err) {
    var _this = this;

    if (this.finalized) {
      return;
    }

    this.finalized = true;

    if (err !== undefined) {
      this.finalError = err;
    } // Proxy is no longer needed - garbage collect references
    // eslint-disable-next-line @typescript-eslint/no-floating-promises


    this.task.then(function () {
      _this.observers = undefined;
      _this.onNoObservers = undefined;
    });
  };

  return ObserverProxy;
}();
/** Turn synchronous function into one called asynchronously. */
// eslint-disable-next-line @typescript-eslint/ban-types


function async(fn, onError) {
  return function () {
    var args = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }

    Promise.resolve(true).then(function () {
      fn.apply(void 0, args);
    }).catch(function (error) {
      if (onError) {
        onError(error);
      }
    });
  };
}
/**
 * Return true if the object passed in implements any of the named methods.
 */


function implementsAnyMethods(obj, methods) {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  for (var _i = 0, methods_1 = methods; _i < methods_1.length; _i++) {
    var method = methods_1[_i];

    if (method in obj && typeof obj[method] === 'function') {
      return true;
    }
  }

  return false;
}

function noop() {// do nothing
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Check to make sure the appropriate number of arguments are provided for a public function.
 * Throws an error if it fails.
 *
 * @param fnName The function name
 * @param minCount The minimum number of arguments to allow for the function call
 * @param maxCount The maximum number of argument to allow for the function call
 * @param argCount The actual number of arguments provided.
 */


var validateArgCount = function (fnName, minCount, maxCount, argCount) {
  var argError;

  if (argCount < minCount) {
    argError = 'at least ' + minCount;
  } else if (argCount > maxCount) {
    argError = maxCount === 0 ? 'none' : 'no more than ' + maxCount;
  }

  if (argError) {
    var error = fnName + ' failed: Was called with ' + argCount + (argCount === 1 ? ' argument.' : ' arguments.') + ' Expects ' + argError + '.';
    throw new Error(error);
  }
};
/**
 * Generates a string to prefix an error message about failed argument validation
 *
 * @param fnName The function name
 * @param argName The name of the argument
 * @return The prefix to add to the error thrown for validation.
 */


exports.validateArgCount = validateArgCount;

function errorPrefix(fnName, argName) {
  return fnName + " failed: " + argName + " argument ";
}
/**
 * @param fnName
 * @param argumentNumber
 * @param namespace
 * @param optional
 */


function validateNamespace(fnName, namespace, optional) {
  if (optional && !namespace) {
    return;
  }

  if (typeof namespace !== 'string') {
    //TODO: I should do more validation here. We only allow certain chars in namespaces.
    throw new Error(errorPrefix(fnName, 'namespace') + 'must be a valid firebase namespace.');
  }
}

function validateCallback(fnName, argumentName, // eslint-disable-next-line @typescript-eslint/ban-types
callback, optional) {
  if (optional && !callback) {
    return;
  }

  if (typeof callback !== 'function') {
    throw new Error(errorPrefix(fnName, argumentName) + 'must be a valid function.');
  }
}

function validateContextObject(fnName, argumentName, context, optional) {
  if (optional && !context) {
    return;
  }

  if (typeof context !== 'object' || context === null) {
    throw new Error(errorPrefix(fnName, argumentName) + 'must be a valid context object.');
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// Code originally came from goog.crypt.stringToUtf8ByteArray, but for some reason they
// automatically replaced '\r\n' with '\n', and they didn't handle surrogate pairs,
// so it's been modified.
// Note that not all Unicode characters appear as single characters in JavaScript strings.
// fromCharCode returns the UTF-16 encoding of a character - so some Unicode characters
// use 2 characters in Javascript.  All 4-byte UTF-8 characters begin with a first
// character in the range 0xD800 - 0xDBFF (the first character of a so-called surrogate
// pair).
// See http://www.ecma-international.org/ecma-262/5.1/#sec-15.1.3

/**
 * @param {string} str
 * @return {Array}
 */


var stringToByteArray = function (str) {
  var out = [];
  var p = 0;

  for (var i = 0; i < str.length; i++) {
    var c = str.charCodeAt(i); // Is this the lead surrogate in a surrogate pair?

    if (c >= 0xd800 && c <= 0xdbff) {
      var high = c - 0xd800; // the high 10 bits.

      i++;
      assert(i < str.length, 'Surrogate pair missing trail surrogate.');
      var low = str.charCodeAt(i) - 0xdc00; // the low 10 bits.

      c = 0x10000 + (high << 10) + low;
    }

    if (c < 128) {
      out[p++] = c;
    } else if (c < 2048) {
      out[p++] = c >> 6 | 192;
      out[p++] = c & 63 | 128;
    } else if (c < 65536) {
      out[p++] = c >> 12 | 224;
      out[p++] = c >> 6 & 63 | 128;
      out[p++] = c & 63 | 128;
    } else {
      out[p++] = c >> 18 | 240;
      out[p++] = c >> 12 & 63 | 128;
      out[p++] = c >> 6 & 63 | 128;
      out[p++] = c & 63 | 128;
    }
  }

  return out;
};
/**
 * Calculate length without actually converting; useful for doing cheaper validation.
 * @param {string} str
 * @return {number}
 */


exports.stringToByteArray = stringToByteArray;

var stringLength = function (str) {
  var p = 0;

  for (var i = 0; i < str.length; i++) {
    var c = str.charCodeAt(i);

    if (c < 128) {
      p++;
    } else if (c < 2048) {
      p += 2;
    } else if (c >= 0xd800 && c <= 0xdbff) {
      // Lead surrogate of a surrogate pair.  The pair together will take 4 bytes to represent.
      p += 4;
      i++; // skip trail surrogate.
    } else {
      p += 3;
    }
  }

  return p;
};
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * The amount of milliseconds to exponentially increase.
 */


exports.stringLength = stringLength;
var DEFAULT_INTERVAL_MILLIS = 1000;
/**
 * The factor to backoff by.
 * Should be a number greater than 1.
 */

var DEFAULT_BACKOFF_FACTOR = 2;
/**
 * The maximum milliseconds to increase to.
 *
 * <p>Visible for testing
 */

var MAX_VALUE_MILLIS = 4 * 60 * 60 * 1000; // Four hours, like iOS and Android.

/**
 * The percentage of backoff time to randomize by.
 * See
 * http://go/safe-client-behavior#step-1-determine-the-appropriate-retry-interval-to-handle-spike-traffic
 * for context.
 *
 * <p>Visible for testing
 */

exports.MAX_VALUE_MILLIS = MAX_VALUE_MILLIS;
var RANDOM_FACTOR = 0.5;
/**
 * Based on the backoff method from
 * https://github.com/google/closure-library/blob/master/closure/goog/math/exponentialbackoff.js.
 * Extracted here so we don't need to pass metadata and a stateful ExponentialBackoff object around.
 */

exports.RANDOM_FACTOR = RANDOM_FACTOR;

function calculateBackoffMillis(backoffCount, intervalMillis, backoffFactor) {
  if (intervalMillis === void 0) {
    intervalMillis = DEFAULT_INTERVAL_MILLIS;
  }

  if (backoffFactor === void 0) {
    backoffFactor = DEFAULT_BACKOFF_FACTOR;
  } // Calculates an exponentially increasing value.
  // Deviation: calculates value from count and a constant interval, so we only need to save value
  // and count to restore state.


  var currBaseValue = intervalMillis * Math.pow(backoffFactor, backoffCount); // A random "fuzz" to avoid waves of retries.
  // Deviation: randomFactor is required.

  var randomWait = Math.round( // A fraction of the backoff value to add/subtract.
  // Deviation: changes multiplication order to improve readability.
  RANDOM_FACTOR * currBaseValue * (Math.random() - 0.5) * 2); // Limits backoff to max to avoid effectively permanent backoff.

  return Math.min(MAX_VALUE_MILLIS, currBaseValue + randomWait);
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Provide English ordinal letters after a number
 */


function ordinal(i) {
  if (!Number.isFinite(i)) {
    return "" + i;
  }

  return i + indicator(i);
}

function indicator(i) {
  i = Math.abs(i);
  var cent = i % 100;

  if (cent >= 10 && cent <= 20) {
    return 'th';
  }

  var dec = i % 10;

  if (dec === 1) {
    return 'st';
  }

  if (dec === 2) {
    return 'nd';
  }

  if (dec === 3) {
    return 'rd';
  }

  return 'th';
}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


function getModularInstance(service) {
  if (service && service._delegate) {
    return service._delegate;
  } else {
    return service;
  }
}
},{"tslib":"../../node_modules/tslib/tslib.es6.js"}],"../../node_modules/@firebase/component/dist/index.esm.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Provider = exports.ComponentContainer = exports.Component = void 0;

var _tslib = require("tslib");

var _util = require("@firebase/util");

/**
 * Component for service name T, e.g. `auth`, `auth-internal`
 */
var Component = function () {
  /**
   *
   * @param name The public service name, e.g. app, auth, firestore, database
   * @param instanceFactory Service factory responsible for creating the public interface
   * @param type whether the service provided by the component is public or private
   */
  function Component(name, instanceFactory, type) {
    this.name = name;
    this.instanceFactory = instanceFactory;
    this.type = type;
    this.multipleInstances = false;
    /**
     * Properties to be added to the service namespace
     */

    this.serviceProps = {};
    this.instantiationMode = "LAZY"
    /* LAZY */
    ;
    this.onInstanceCreated = null;
  }

  Component.prototype.setInstantiationMode = function (mode) {
    this.instantiationMode = mode;
    return this;
  };

  Component.prototype.setMultipleInstances = function (multipleInstances) {
    this.multipleInstances = multipleInstances;
    return this;
  };

  Component.prototype.setServiceProps = function (props) {
    this.serviceProps = props;
    return this;
  };

  Component.prototype.setInstanceCreatedCallback = function (callback) {
    this.onInstanceCreated = callback;
    return this;
  };

  return Component;
}();
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


exports.Component = Component;
var DEFAULT_ENTRY_NAME = '[DEFAULT]';
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Provider for instance for service name T, e.g. 'auth', 'auth-internal'
 * NameServiceMapping[T] is an alias for the type of the instance
 */

var Provider = function () {
  function Provider(name, container) {
    this.name = name;
    this.container = container;
    this.component = null;
    this.instances = new Map();
    this.instancesDeferred = new Map();
    this.instancesOptions = new Map();
    this.onInitCallbacks = new Map();
  }
  /**
   * @param identifier A provider can provide mulitple instances of a service
   * if this.component.multipleInstances is true.
   */


  Provider.prototype.get = function (identifier) {
    // if multipleInstances is not supported, use the default name
    var normalizedIdentifier = this.normalizeInstanceIdentifier(identifier);

    if (!this.instancesDeferred.has(normalizedIdentifier)) {
      var deferred = new _util.Deferred();
      this.instancesDeferred.set(normalizedIdentifier, deferred);

      if (this.isInitialized(normalizedIdentifier) || this.shouldAutoInitialize()) {
        // initialize the service if it can be auto-initialized
        try {
          var instance = this.getOrInitializeService({
            instanceIdentifier: normalizedIdentifier
          });

          if (instance) {
            deferred.resolve(instance);
          }
        } catch (e) {// when the instance factory throws an exception during get(), it should not cause
          // a fatal error. We just return the unresolved promise in this case.
        }
      }
    }

    return this.instancesDeferred.get(normalizedIdentifier).promise;
  };

  Provider.prototype.getImmediate = function (options) {
    var _a; // if multipleInstances is not supported, use the default name


    var normalizedIdentifier = this.normalizeInstanceIdentifier(options === null || options === void 0 ? void 0 : options.identifier);
    var optional = (_a = options === null || options === void 0 ? void 0 : options.optional) !== null && _a !== void 0 ? _a : false;

    if (this.isInitialized(normalizedIdentifier) || this.shouldAutoInitialize()) {
      try {
        return this.getOrInitializeService({
          instanceIdentifier: normalizedIdentifier
        });
      } catch (e) {
        if (optional) {
          return null;
        } else {
          throw e;
        }
      }
    } else {
      // In case a component is not initialized and should/can not be auto-initialized at the moment, return null if the optional flag is set, or throw
      if (optional) {
        return null;
      } else {
        throw Error("Service " + this.name + " is not available");
      }
    }
  };

  Provider.prototype.getComponent = function () {
    return this.component;
  };

  Provider.prototype.setComponent = function (component) {
    var e_1, _a;

    if (component.name !== this.name) {
      throw Error("Mismatching Component " + component.name + " for Provider " + this.name + ".");
    }

    if (this.component) {
      throw Error("Component for " + this.name + " has already been provided");
    }

    this.component = component; // return early without attempting to initialize the component if the component requires explicit initialization (calling `Provider.initialize()`)

    if (!this.shouldAutoInitialize()) {
      return;
    } // if the service is eager, initialize the default instance


    if (isComponentEager(component)) {
      try {
        this.getOrInitializeService({
          instanceIdentifier: DEFAULT_ENTRY_NAME
        });
      } catch (e) {// when the instance factory for an eager Component throws an exception during the eager
        // initialization, it should not cause a fatal error.
        // TODO: Investigate if we need to make it configurable, because some component may want to cause
        // a fatal error in this case?
      }
    }

    try {
      // Create service instances for the pending promises and resolve them
      // NOTE: if this.multipleInstances is false, only the default instance will be created
      // and all promises with resolve with it regardless of the identifier.
      for (var _b = (0, _tslib.__values)(this.instancesDeferred.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
        var _d = (0, _tslib.__read)(_c.value, 2),
            instanceIdentifier = _d[0],
            instanceDeferred = _d[1];

        var normalizedIdentifier = this.normalizeInstanceIdentifier(instanceIdentifier);

        try {
          // `getOrInitializeService()` should always return a valid instance since a component is guaranteed. use ! to make typescript happy.
          var instance = this.getOrInitializeService({
            instanceIdentifier: normalizedIdentifier
          });
          instanceDeferred.resolve(instance);
        } catch (e) {// when the instance factory throws an exception, it should not cause
          // a fatal error. We just leave the promise unresolved.
        }
      }
    } catch (e_1_1) {
      e_1 = {
        error: e_1_1
      };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
      } finally {
        if (e_1) throw e_1.error;
      }
    }
  };

  Provider.prototype.clearInstance = function (identifier) {
    if (identifier === void 0) {
      identifier = DEFAULT_ENTRY_NAME;
    }

    this.instancesDeferred.delete(identifier);
    this.instancesOptions.delete(identifier);
    this.instances.delete(identifier);
  }; // app.delete() will call this method on every provider to delete the services
  // TODO: should we mark the provider as deleted?


  Provider.prototype.delete = function () {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var services;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            services = Array.from(this.instances.values());
            return [4
            /*yield*/
            , Promise.all((0, _tslib.__spreadArray)((0, _tslib.__spreadArray)([], (0, _tslib.__read)(services.filter(function (service) {
              return 'INTERNAL' in service;
            }) // legacy services
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map(function (service) {
              return service.INTERNAL.delete();
            }))), (0, _tslib.__read)(services.filter(function (service) {
              return '_delete' in service;
            }) // modularized services
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map(function (service) {
              return service._delete();
            }))))];

          case 1:
            _a.sent();

            return [2
            /*return*/
            ];
        }
      });
    });
  };

  Provider.prototype.isComponentSet = function () {
    return this.component != null;
  };

  Provider.prototype.isInitialized = function (identifier) {
    if (identifier === void 0) {
      identifier = DEFAULT_ENTRY_NAME;
    }

    return this.instances.has(identifier);
  };

  Provider.prototype.getOptions = function (identifier) {
    if (identifier === void 0) {
      identifier = DEFAULT_ENTRY_NAME;
    }

    return this.instancesOptions.get(identifier) || {};
  };

  Provider.prototype.initialize = function (opts) {
    var e_2, _a;

    if (opts === void 0) {
      opts = {};
    }

    var _b = opts.options,
        options = _b === void 0 ? {} : _b;
    var normalizedIdentifier = this.normalizeInstanceIdentifier(opts.instanceIdentifier);

    if (this.isInitialized(normalizedIdentifier)) {
      throw Error(this.name + "(" + normalizedIdentifier + ") has already been initialized");
    }

    if (!this.isComponentSet()) {
      throw Error("Component " + this.name + " has not been registered yet");
    }

    var instance = this.getOrInitializeService({
      instanceIdentifier: normalizedIdentifier,
      options: options
    });

    try {
      // resolve any pending promise waiting for the service instance
      for (var _c = (0, _tslib.__values)(this.instancesDeferred.entries()), _d = _c.next(); !_d.done; _d = _c.next()) {
        var _e = (0, _tslib.__read)(_d.value, 2),
            instanceIdentifier = _e[0],
            instanceDeferred = _e[1];

        var normalizedDeferredIdentifier = this.normalizeInstanceIdentifier(instanceIdentifier);

        if (normalizedIdentifier === normalizedDeferredIdentifier) {
          instanceDeferred.resolve(instance);
        }
      }
    } catch (e_2_1) {
      e_2 = {
        error: e_2_1
      };
    } finally {
      try {
        if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
      } finally {
        if (e_2) throw e_2.error;
      }
    }

    return instance;
  };
  /**
   *
   * @param callback - a function that will be invoked  after the provider has been initialized by calling provider.initialize().
   * The function is invoked SYNCHRONOUSLY, so it should not execute any longrunning tasks in order to not block the program.
   *
   * @param identifier An optional instance identifier
   * @returns a function to unregister the callback
   */


  Provider.prototype.onInit = function (callback, identifier) {
    var _a;

    var normalizedIdentifier = this.normalizeInstanceIdentifier(identifier);
    var existingCallbacks = (_a = this.onInitCallbacks.get(normalizedIdentifier)) !== null && _a !== void 0 ? _a : new Set();
    existingCallbacks.add(callback);
    this.onInitCallbacks.set(normalizedIdentifier, existingCallbacks);
    var existingInstance = this.instances.get(normalizedIdentifier);

    if (existingInstance) {
      callback(existingInstance, normalizedIdentifier);
    }

    return function () {
      existingCallbacks.delete(callback);
    };
  };
  /**
   * Invoke onInit callbacks synchronously
   * @param instance the service instance`
   */


  Provider.prototype.invokeOnInitCallbacks = function (instance, identifier) {
    var e_3, _a;

    var callbacks = this.onInitCallbacks.get(identifier);

    if (!callbacks) {
      return;
    }

    try {
      for (var callbacks_1 = (0, _tslib.__values)(callbacks), callbacks_1_1 = callbacks_1.next(); !callbacks_1_1.done; callbacks_1_1 = callbacks_1.next()) {
        var callback = callbacks_1_1.value;

        try {
          callback(instance, identifier);
        } catch (_b) {// ignore errors in the onInit callback
        }
      }
    } catch (e_3_1) {
      e_3 = {
        error: e_3_1
      };
    } finally {
      try {
        if (callbacks_1_1 && !callbacks_1_1.done && (_a = callbacks_1.return)) _a.call(callbacks_1);
      } finally {
        if (e_3) throw e_3.error;
      }
    }
  };

  Provider.prototype.getOrInitializeService = function (_a) {
    var instanceIdentifier = _a.instanceIdentifier,
        _b = _a.options,
        options = _b === void 0 ? {} : _b;
    var instance = this.instances.get(instanceIdentifier);

    if (!instance && this.component) {
      instance = this.component.instanceFactory(this.container, {
        instanceIdentifier: normalizeIdentifierForFactory(instanceIdentifier),
        options: options
      });
      this.instances.set(instanceIdentifier, instance);
      this.instancesOptions.set(instanceIdentifier, options);
      /**
       * Invoke onInit listeners.
       * Note this.component.onInstanceCreated is different, which is used by the component creator,
       * while onInit listeners are registered by consumers of the provider.
       */

      this.invokeOnInitCallbacks(instance, instanceIdentifier);
      /**
       * Order is important
       * onInstanceCreated() should be called after this.instances.set(instanceIdentifier, instance); which
       * makes `isInitialized()` return true.
       */

      if (this.component.onInstanceCreated) {
        try {
          this.component.onInstanceCreated(this.container, instanceIdentifier, instance);
        } catch (_c) {// ignore errors in the onInstanceCreatedCallback
        }
      }
    }

    return instance || null;
  };

  Provider.prototype.normalizeInstanceIdentifier = function (identifier) {
    if (identifier === void 0) {
      identifier = DEFAULT_ENTRY_NAME;
    }

    if (this.component) {
      return this.component.multipleInstances ? identifier : DEFAULT_ENTRY_NAME;
    } else {
      return identifier; // assume multiple instances are supported before the component is provided.
    }
  };

  Provider.prototype.shouldAutoInitialize = function () {
    return !!this.component && this.component.instantiationMode !== "EXPLICIT"
    /* EXPLICIT */
    ;
  };

  return Provider;
}(); // undefined should be passed to the service factory for the default instance


exports.Provider = Provider;

function normalizeIdentifierForFactory(identifier) {
  return identifier === DEFAULT_ENTRY_NAME ? undefined : identifier;
}

function isComponentEager(component) {
  return component.instantiationMode === "EAGER"
  /* EAGER */
  ;
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * ComponentContainer that provides Providers for service name T, e.g. `auth`, `auth-internal`
 */


var ComponentContainer = function () {
  function ComponentContainer(name) {
    this.name = name;
    this.providers = new Map();
  }
  /**
   *
   * @param component Component being added
   * @param overwrite When a component with the same name has already been registered,
   * if overwrite is true: overwrite the existing component with the new component and create a new
   * provider with the new component. It can be useful in tests where you want to use different mocks
   * for different tests.
   * if overwrite is false: throw an exception
   */


  ComponentContainer.prototype.addComponent = function (component) {
    var provider = this.getProvider(component.name);

    if (provider.isComponentSet()) {
      throw new Error("Component " + component.name + " has already been registered with " + this.name);
    }

    provider.setComponent(component);
  };

  ComponentContainer.prototype.addOrOverwriteComponent = function (component) {
    var provider = this.getProvider(component.name);

    if (provider.isComponentSet()) {
      // delete the existing provider from the container, so we can register the new component
      this.providers.delete(component.name);
    }

    this.addComponent(component);
  };
  /**
   * getProvider provides a type safe interface where it can only be called with a field name
   * present in NameServiceMapping interface.
   *
   * Firebase SDKs providing services should extend NameServiceMapping interface to register
   * themselves.
   */


  ComponentContainer.prototype.getProvider = function (name) {
    if (this.providers.has(name)) {
      return this.providers.get(name);
    } // create a Provider for a service that hasn't registered with Firebase


    var provider = new Provider(name, this);
    this.providers.set(name, provider);
    return provider;
  };

  ComponentContainer.prototype.getProviders = function () {
    return Array.from(this.providers.values());
  };

  return ComponentContainer;
}();

exports.ComponentContainer = ComponentContainer;
},{"tslib":"../../node_modules/tslib/tslib.es6.js","@firebase/util":"../../node_modules/@firebase/util/dist/index.esm.js"}],"../../node_modules/@firebase/logger/dist/index.esm.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setLogLevel = setLogLevel;
exports.setUserLogHandler = setUserLogHandler;
exports.Logger = exports.LogLevel = void 0;

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
function __spreadArrays() {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;

  for (var r = Array(s), k = 0, i = 0; i < il; i++) for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j];

  return r;
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


var _a;
/**
 * A container for all of the Logger instances
 */


var instances = [];
/**
 * The JS SDK supports 5 log levels and also allows a user the ability to
 * silence the logs altogether.
 *
 * The order is a follows:
 * DEBUG < VERBOSE < INFO < WARN < ERROR
 *
 * All of the log types above the current log level will be captured (i.e. if
 * you set the log level to `INFO`, errors will still be logged, but `DEBUG` and
 * `VERBOSE` logs will not)
 */

var LogLevel;
exports.LogLevel = LogLevel;

(function (LogLevel) {
  LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
  LogLevel[LogLevel["VERBOSE"] = 1] = "VERBOSE";
  LogLevel[LogLevel["INFO"] = 2] = "INFO";
  LogLevel[LogLevel["WARN"] = 3] = "WARN";
  LogLevel[LogLevel["ERROR"] = 4] = "ERROR";
  LogLevel[LogLevel["SILENT"] = 5] = "SILENT";
})(LogLevel || (exports.LogLevel = LogLevel = {}));

var levelStringToEnum = {
  'debug': LogLevel.DEBUG,
  'verbose': LogLevel.VERBOSE,
  'info': LogLevel.INFO,
  'warn': LogLevel.WARN,
  'error': LogLevel.ERROR,
  'silent': LogLevel.SILENT
};
/**
 * The default log level
 */

var defaultLogLevel = LogLevel.INFO;
/**
 * By default, `console.debug` is not displayed in the developer console (in
 * chrome). To avoid forcing users to have to opt-in to these logs twice
 * (i.e. once for firebase, and once in the console), we are sending `DEBUG`
 * logs to the `console.log` function.
 */

var ConsoleMethod = (_a = {}, _a[LogLevel.DEBUG] = 'log', _a[LogLevel.VERBOSE] = 'log', _a[LogLevel.INFO] = 'info', _a[LogLevel.WARN] = 'warn', _a[LogLevel.ERROR] = 'error', _a);
/**
 * The default log handler will forward DEBUG, VERBOSE, INFO, WARN, and ERROR
 * messages on to their corresponding console counterparts (if the log method
 * is supported by the current log level)
 */

var defaultLogHandler = function (instance, logType) {
  var args = [];

  for (var _i = 2; _i < arguments.length; _i++) {
    args[_i - 2] = arguments[_i];
  }

  if (logType < instance.logLevel) {
    return;
  }

  var now = new Date().toISOString();
  var method = ConsoleMethod[logType];

  if (method) {
    console[method].apply(console, __spreadArrays(["[" + now + "]  " + instance.name + ":"], args));
  } else {
    throw new Error("Attempted to log a message with an invalid logType (value: " + logType + ")");
  }
};

var Logger = function () {
  /**
   * Gives you an instance of a Logger to capture messages according to
   * Firebase's logging scheme.
   *
   * @param name The name that the logs will be associated with
   */
  function Logger(name) {
    this.name = name;
    /**
     * The log level of the given Logger instance.
     */

    this._logLevel = defaultLogLevel;
    /**
     * The main (internal) log handler for the Logger instance.
     * Can be set to a new function in internal package code but not by user.
     */

    this._logHandler = defaultLogHandler;
    /**
     * The optional, additional, user-defined log handler for the Logger instance.
     */

    this._userLogHandler = null;
    /**
     * Capture the current instance for later use
     */

    instances.push(this);
  }

  Object.defineProperty(Logger.prototype, "logLevel", {
    get: function () {
      return this._logLevel;
    },
    set: function (val) {
      if (!(val in LogLevel)) {
        throw new TypeError("Invalid value \"" + val + "\" assigned to `logLevel`");
      }

      this._logLevel = val;
    },
    enumerable: false,
    configurable: true
  }); // Workaround for setter/getter having to be the same type.

  Logger.prototype.setLogLevel = function (val) {
    this._logLevel = typeof val === 'string' ? levelStringToEnum[val] : val;
  };

  Object.defineProperty(Logger.prototype, "logHandler", {
    get: function () {
      return this._logHandler;
    },
    set: function (val) {
      if (typeof val !== 'function') {
        throw new TypeError('Value assigned to `logHandler` must be a function');
      }

      this._logHandler = val;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Logger.prototype, "userLogHandler", {
    get: function () {
      return this._userLogHandler;
    },
    set: function (val) {
      this._userLogHandler = val;
    },
    enumerable: false,
    configurable: true
  });
  /**
   * The functions below are all based on the `console` interface
   */

  Logger.prototype.debug = function () {
    var args = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }

    this._userLogHandler && this._userLogHandler.apply(this, __spreadArrays([this, LogLevel.DEBUG], args));

    this._logHandler.apply(this, __spreadArrays([this, LogLevel.DEBUG], args));
  };

  Logger.prototype.log = function () {
    var args = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }

    this._userLogHandler && this._userLogHandler.apply(this, __spreadArrays([this, LogLevel.VERBOSE], args));

    this._logHandler.apply(this, __spreadArrays([this, LogLevel.VERBOSE], args));
  };

  Logger.prototype.info = function () {
    var args = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }

    this._userLogHandler && this._userLogHandler.apply(this, __spreadArrays([this, LogLevel.INFO], args));

    this._logHandler.apply(this, __spreadArrays([this, LogLevel.INFO], args));
  };

  Logger.prototype.warn = function () {
    var args = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }

    this._userLogHandler && this._userLogHandler.apply(this, __spreadArrays([this, LogLevel.WARN], args));

    this._logHandler.apply(this, __spreadArrays([this, LogLevel.WARN], args));
  };

  Logger.prototype.error = function () {
    var args = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }

    this._userLogHandler && this._userLogHandler.apply(this, __spreadArrays([this, LogLevel.ERROR], args));

    this._logHandler.apply(this, __spreadArrays([this, LogLevel.ERROR], args));
  };

  return Logger;
}();

exports.Logger = Logger;

function setLogLevel(level) {
  instances.forEach(function (inst) {
    inst.setLogLevel(level);
  });
}

function setUserLogHandler(logCallback, options) {
  var _loop_1 = function (instance) {
    var customLogLevel = null;

    if (options && options.level) {
      customLogLevel = levelStringToEnum[options.level];
    }

    if (logCallback === null) {
      instance.userLogHandler = null;
    } else {
      instance.userLogHandler = function (instance, level) {
        var args = [];

        for (var _i = 2; _i < arguments.length; _i++) {
          args[_i - 2] = arguments[_i];
        }

        var message = args.map(function (arg) {
          if (arg == null) {
            return null;
          } else if (typeof arg === 'string') {
            return arg;
          } else if (typeof arg === 'number' || typeof arg === 'boolean') {
            return arg.toString();
          } else if (arg instanceof Error) {
            return arg.message;
          } else {
            try {
              return JSON.stringify(arg);
            } catch (ignored) {
              return null;
            }
          }
        }).filter(function (arg) {
          return arg;
        }).join(' ');

        if (level >= (customLogLevel !== null && customLogLevel !== void 0 ? customLogLevel : instance.logLevel)) {
          logCallback({
            level: LogLevel[level].toLowerCase(),
            message: message,
            args: args,
            type: instance.name
          });
        }
      };
    }
  };

  for (var _i = 0, instances_1 = instances; _i < instances_1.length; _i++) {
    var instance = instances_1[_i];

    _loop_1(instance);
  }
}
},{}],"../../node_modules/@firebase/app/dist/index.esm2017.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._addComponent = _addComponent;
exports._addOrOverwriteComponent = _addOrOverwriteComponent;
exports._clearComponents = _clearComponents;
exports._getProvider = _getProvider;
exports._registerComponent = _registerComponent;
exports._removeServiceInstance = _removeServiceInstance;
exports.deleteApp = deleteApp;
exports.getApp = getApp;
exports.getApps = getApps;
exports.initializeApp = initializeApp;
exports.onLog = onLog;
exports.registerVersion = registerVersion;
exports.setLogLevel = setLogLevel;
Object.defineProperty(exports, "FirebaseError", {
  enumerable: true,
  get: function () {
    return _util.FirebaseError;
  }
});
exports._components = exports._apps = exports._DEFAULT_ENTRY_NAME = exports.SDK_VERSION = void 0;

var _component = require("@firebase/component");

var _logger = require("@firebase/logger");

var _util = require("@firebase/util");

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class PlatformLoggerServiceImpl {
  constructor(container) {
    this.container = container;
  } // In initial implementation, this will be called by installations on
  // auth token refresh, and installations will send this string.


  getPlatformInfoString() {
    const providers = this.container.getProviders(); // Loop through providers and get library/version pairs from any that are
    // version components.

    return providers.map(provider => {
      if (isVersionServiceProvider(provider)) {
        const service = provider.getImmediate();
        return `${service.library}/${service.version}`;
      } else {
        return null;
      }
    }).filter(logString => logString).join(' ');
  }

}
/**
 *
 * @param provider check if this provider provides a VersionService
 *
 * NOTE: Using Provider<'app-version'> is a hack to indicate that the provider
 * provides VersionService. The provider is not necessarily a 'app-version'
 * provider.
 */


function isVersionServiceProvider(provider) {
  const component = provider.getComponent();
  return (component === null || component === void 0 ? void 0 : component.type) === "VERSION"
  /* VERSION */
  ;
}

const name$o = "@firebase/app";
const version$1 = "0.7.0";
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const logger = new _logger.Logger('@firebase/app');
const name$n = "@firebase/app-compat";
const name$m = "@firebase/analytics-compat";
const name$l = "@firebase/analytics";
const name$k = "@firebase/app-check-compat";
const name$j = "@firebase/app-check";
const name$i = "@firebase/auth";
const name$h = "@firebase/auth-compat";
const name$g = "@firebase/database";
const name$f = "@firebase/database-compat";
const name$e = "@firebase/functions";
const name$d = "@firebase/functions-compat";
const name$c = "@firebase/installations";
const name$b = "@firebase/installations-compat";
const name$a = "@firebase/messaging";
const name$9 = "@firebase/messaging-compat";
const name$8 = "@firebase/performance";
const name$7 = "@firebase/performance-compat";
const name$6 = "@firebase/remote-config";
const name$5 = "@firebase/remote-config-compat";
const name$4 = "@firebase/storage";
const name$3 = "@firebase/storage-compat";
const name$2 = "@firebase/firestore";
const name$1 = "@firebase/firestore-compat";
const name = "firebase";
const version = "9.0.0";
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * The default app name
 *
 * @internal
 */

const DEFAULT_ENTRY_NAME = '[DEFAULT]';
exports._DEFAULT_ENTRY_NAME = DEFAULT_ENTRY_NAME;
const PLATFORM_LOG_STRING = {
  [name$o]: 'fire-core',
  [name$n]: 'fire-core-compat',
  [name$l]: 'fire-analytics',
  [name$m]: 'fire-analytics-compat',
  [name$j]: 'fire-app-check',
  [name$k]: 'fire-app-check-compat',
  [name$i]: 'fire-auth',
  [name$h]: 'fire-auth-compat',
  [name$g]: 'fire-rtdb',
  [name$f]: 'fire-rtdb-compat',
  [name$e]: 'fire-fn',
  [name$d]: 'fire-fn-compat',
  [name$c]: 'fire-iid',
  [name$b]: 'fire-iid-compat',
  [name$a]: 'fire-fcm',
  [name$9]: 'fire-fcm-compat',
  [name$8]: 'fire-perf',
  [name$7]: 'fire-perf-compat',
  [name$6]: 'fire-rc',
  [name$5]: 'fire-rc-compat',
  [name$4]: 'fire-gcs',
  [name$3]: 'fire-gcs-compat',
  [name$2]: 'fire-fst',
  [name$1]: 'fire-fst-compat',
  'fire-js': 'fire-js',
  [name]: 'fire-js-all'
};
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @internal
 */

const _apps = new Map();
/**
 * Registered components.
 *
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any


exports._apps = _apps;

const _components = new Map();
/**
 * @param component - the component being added to this app's container
 *
 * @internal
 */


exports._components = _components;

function _addComponent(app, component) {
  try {
    app.container.addComponent(component);
  } catch (e) {
    logger.debug(`Component ${component.name} failed to register with FirebaseApp ${app.name}`, e);
  }
}
/**
 *
 * @internal
 */


function _addOrOverwriteComponent(app, component) {
  app.container.addOrOverwriteComponent(component);
}
/**
 *
 * @param component - the component to register
 * @returns whether or not the component is registered successfully
 *
 * @internal
 */


function _registerComponent(component) {
  const componentName = component.name;

  if (_components.has(componentName)) {
    logger.debug(`There were multiple attempts to register component ${componentName}.`);
    return false;
  }

  _components.set(componentName, component); // add the component to existing app instances


  for (const app of _apps.values()) {
    _addComponent(app, component);
  }

  return true;
}
/**
 *
 * @param app - FirebaseApp instance
 * @param name - service name
 *
 * @returns the provider for the service with the matching name
 *
 * @internal
 */


function _getProvider(app, name) {
  return app.container.getProvider(name);
}
/**
 *
 * @param app - FirebaseApp instance
 * @param name - service name
 * @param instanceIdentifier - service instance identifier in case the service supports multiple instances
 *
 * @internal
 */


function _removeServiceInstance(app, name, instanceIdentifier = DEFAULT_ENTRY_NAME) {
  _getProvider(app, name).clearInstance(instanceIdentifier);
}
/**
 * Test only
 *
 * @internal
 */


function _clearComponents() {
  _components.clear();
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


const ERRORS = {
  ["no-app"
  /* NO_APP */
  ]: "No Firebase App '{$appName}' has been created - " + 'call Firebase App.initializeApp()',
  ["bad-app-name"
  /* BAD_APP_NAME */
  ]: "Illegal App name: '{$appName}",
  ["duplicate-app"
  /* DUPLICATE_APP */
  ]: "Firebase App named '{$appName}' already exists with different options or config",
  ["app-deleted"
  /* APP_DELETED */
  ]: "Firebase App named '{$appName}' already deleted",
  ["invalid-app-argument"
  /* INVALID_APP_ARGUMENT */
  ]: 'firebase.{$appName}() takes either no argument or a ' + 'Firebase App instance.',
  ["invalid-log-argument"
  /* INVALID_LOG_ARGUMENT */
  ]: 'First argument to `onLog` must be null or a function.'
};
const ERROR_FACTORY = new _util.ErrorFactory('app', 'Firebase', ERRORS);
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

class FirebaseAppImpl {
  constructor(options, config, container) {
    this._isDeleted = false;
    this._options = Object.assign({}, options);
    this._config = Object.assign({}, config);
    this._name = config.name;
    this._automaticDataCollectionEnabled = config.automaticDataCollectionEnabled;
    this._container = container;
    this.container.addComponent(new _component.Component('app', () => this, "PUBLIC"
    /* PUBLIC */
    ));
  }

  get automaticDataCollectionEnabled() {
    this.checkDestroyed();
    return this._automaticDataCollectionEnabled;
  }

  set automaticDataCollectionEnabled(val) {
    this.checkDestroyed();
    this._automaticDataCollectionEnabled = val;
  }

  get name() {
    this.checkDestroyed();
    return this._name;
  }

  get options() {
    this.checkDestroyed();
    return this._options;
  }

  get config() {
    this.checkDestroyed();
    return this._config;
  }

  get container() {
    return this._container;
  }

  get isDeleted() {
    return this._isDeleted;
  }

  set isDeleted(val) {
    this._isDeleted = val;
  }
  /**
   * This function will throw an Error if the App has already been deleted -
   * use before performing API actions on the App.
   */


  checkDestroyed() {
    if (this.isDeleted) {
      throw ERROR_FACTORY.create("app-deleted"
      /* APP_DELETED */
      , {
        appName: this._name
      });
    }
  }

}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * The current SDK version.
 *
 * @public
 */


const SDK_VERSION = version;
exports.SDK_VERSION = SDK_VERSION;

function initializeApp(options, rawConfig = {}) {
  if (typeof rawConfig !== 'object') {
    const name = rawConfig;
    rawConfig = {
      name
    };
  }

  const config = Object.assign({
    name: DEFAULT_ENTRY_NAME,
    automaticDataCollectionEnabled: false
  }, rawConfig);
  const name = config.name;

  if (typeof name !== 'string' || !name) {
    throw ERROR_FACTORY.create("bad-app-name"
    /* BAD_APP_NAME */
    , {
      appName: String(name)
    });
  }

  const existingApp = _apps.get(name);

  if (existingApp) {
    // return the existing app if options and config deep equal the ones in the existing app.
    if ((0, _util.deepEqual)(options, existingApp.options) && (0, _util.deepEqual)(config, existingApp.config)) {
      return existingApp;
    } else {
      throw ERROR_FACTORY.create("duplicate-app"
      /* DUPLICATE_APP */
      , {
        appName: name
      });
    }
  }

  const container = new _component.ComponentContainer(name);

  for (const component of _components.values()) {
    container.addComponent(component);
  }

  const newApp = new FirebaseAppImpl(options, config, container);

  _apps.set(name, newApp);

  return newApp;
}
/**
 * Retrieves a {@link @firebase/app#FirebaseApp} instance.
 *
 * When called with no arguments, the default app is returned. When an app name
 * is provided, the app corresponding to that name is returned.
 *
 * An exception is thrown if the app being retrieved has not yet been
 * initialized.
 *
 * @example
 * ```javascript
 * // Return the default app
 * const app = getApp();
 * ```
 *
 * @example
 * ```javascript
 * // Return a named app
 * const otherApp = getApp("otherApp");
 * ```
 *
 * @param name - Optional name of the app to return. If no name is
 *   provided, the default is `"[DEFAULT]"`.
 *
 * @returns The app corresponding to the provided app name.
 *   If no app name is provided, the default app is returned.
 *
 * @public
 */


function getApp(name = DEFAULT_ENTRY_NAME) {
  const app = _apps.get(name);

  if (!app) {
    throw ERROR_FACTORY.create("no-app"
    /* NO_APP */
    , {
      appName: name
    });
  }

  return app;
}
/**
 * A (read-only) array of all initialized apps.
 * @public
 */


function getApps() {
  return Array.from(_apps.values());
}
/**
 * Renders this app unusable and frees the resources of all associated
 * services.
 *
 * @example
 * ```javascript
 * deleteApp(app)
 *   .then(function() {
 *     console.log("App deleted successfully");
 *   })
 *   .catch(function(error) {
 *     console.log("Error deleting app:", error);
 *   });
 * ```
 *
 * @public
 */


async function deleteApp(app) {
  const name = app.name;

  if (_apps.has(name)) {
    _apps.delete(name);

    await Promise.all(app.container.getProviders().map(provider => provider.delete()));
    app.isDeleted = true;
  }
}
/**
 * Registers a library's name and version for platform logging purposes.
 * @param library - Name of 1p or 3p library (e.g. firestore, angularfire)
 * @param version - Current version of that library.
 * @param variant - Bundle variant, e.g., node, rn, etc.
 *
 * @public
 */


function registerVersion(libraryKeyOrName, version, variant) {
  var _a; // TODO: We can use this check to whitelist strings when/if we set up
  // a good whitelist system.


  let library = (_a = PLATFORM_LOG_STRING[libraryKeyOrName]) !== null && _a !== void 0 ? _a : libraryKeyOrName;

  if (variant) {
    library += `-${variant}`;
  }

  const libraryMismatch = library.match(/\s|\//);
  const versionMismatch = version.match(/\s|\//);

  if (libraryMismatch || versionMismatch) {
    const warning = [`Unable to register library "${library}" with version "${version}":`];

    if (libraryMismatch) {
      warning.push(`library name "${library}" contains illegal characters (whitespace or "/")`);
    }

    if (libraryMismatch && versionMismatch) {
      warning.push('and');
    }

    if (versionMismatch) {
      warning.push(`version name "${version}" contains illegal characters (whitespace or "/")`);
    }

    logger.warn(warning.join(' '));
    return;
  }

  _registerComponent(new _component.Component(`${library}-version`, () => ({
    library,
    version
  }), "VERSION"
  /* VERSION */
  ));
}
/**
 * Sets log handler for all Firebase SDKs.
 * @param logCallback - An optional custom log handler that executes user code whenever
 * the Firebase SDK makes a logging call.
 *
 * @public
 */


function onLog(logCallback, options) {
  if (logCallback !== null && typeof logCallback !== 'function') {
    throw ERROR_FACTORY.create("invalid-log-argument"
    /* INVALID_LOG_ARGUMENT */
    );
  }

  (0, _logger.setUserLogHandler)(logCallback, options);
}
/**
 * Sets log level for all Firebase SDKs.
 *
 * All of the log types above the current log level are captured (i.e. if
 * you set the log level to `info`, errors are logged, but `debug` and
 * `verbose` logs are not).
 *
 * @public
 */


function setLogLevel(logLevel) {
  (0, _logger.setLogLevel)(logLevel);
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


function registerCoreComponents(variant) {
  _registerComponent(new _component.Component('platform-logger', container => new PlatformLoggerServiceImpl(container), "PRIVATE"
  /* PRIVATE */
  )); // Register `app` package.


  registerVersion(name$o, version$1, variant); // Register platform SDK identifier (no version).

  registerVersion('fire-js', '');
}
/**
 * Firebase App
 *
 * @remarks This package coordinates the communication between the different Firebase components
 * @packageDocumentation
 */


registerCoreComponents();
},{"@firebase/component":"../../node_modules/@firebase/component/dist/index.esm.js","@firebase/logger":"../../node_modules/@firebase/logger/dist/index.esm.js","@firebase/util":"../../node_modules/@firebase/util/dist/index.esm.js"}],"../../node_modules/firebase/app/dist/index.esm.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _app = require("@firebase/app");

Object.keys(_app).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _app[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _app[key];
    }
  });
});
var name = "firebase";
var version = "9.0.2";
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(0, _app.registerVersion)(name, version, 'app');
},{"@firebase/app":"../../node_modules/@firebase/app/dist/index.esm2017.js"}],"../../node_modules/@firebase/firestore/dist/lite/index.browser.esm2017.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addDoc = Ir;
exports.arrayRemove = Rr;
exports.arrayUnion = Pr;
exports.collection = he;
exports.collectionGroup = le;
exports.connectFirestoreEmulator = ie;
exports.deleteDoc = Er;
exports.deleteField = Tr;
exports.doc = fe;
exports.documentId = pe;
exports.endAt = lr;
exports.endBefore = hr;
exports.getDoc = _r;
exports.getDocs = gr;
exports.getFirestore = se;
exports.increment = Vr;
exports.initializeFirestore = re;
exports.limit = sr;
exports.limitToLast = ir;
exports.orderBy = er;
exports.query = Ze;
exports.queryEqual = we;
exports.refEqual = de;
exports.runTransaction = Lr;
exports.serverTimestamp = Ar;
exports.setDoc = br;
exports.setLogLevel = d;
exports.snapshotEqual = Ye;
exports.startAfter = cr;
exports.startAt = ur;
exports.terminate = oe;
exports.updateDoc = vr;
exports.where = tr;
exports.writeBatch = $r;
exports.WriteBatch = exports.Transaction = exports.Timestamp = exports.QuerySnapshot = exports.QueryDocumentSnapshot = exports.QueryConstraint = exports.Query = exports.GeoPoint = exports.FirestoreError = exports.Firestore = exports.FieldValue = exports.FieldPath = exports.DocumentSnapshot = exports.DocumentReference = exports.CollectionReference = exports.Bytes = void 0;

var _app = require("@firebase/app");

var _component = require("@firebase/component");

var _logger = require("@firebase/logger");

var _util = require("@firebase/util");

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e43) { throw _e43; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e44) { didErr = true; err = _e44; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Simple wrapper around a nullable UID. Mostly exists to make code more
 * readable.
 */
var h = /*#__PURE__*/function () {
  function h(t) {
    _classCallCheck(this, h);

    this.uid = t;
  }

  _createClass(h, [{
    key: "isAuthenticated",
    value: function isAuthenticated() {
      return null != this.uid;
    }
    /**
     * Returns a key representing this user, suitable for inclusion in a
     * dictionary.
     */

  }, {
    key: "toKey",
    value: function toKey() {
      return this.isAuthenticated() ? "uid:" + this.uid : "anonymous-user";
    }
  }, {
    key: "isEqual",
    value: function isEqual(t) {
      return t.uid === this.uid;
    }
  }]);

  return h;
}();
/** A user with a null UID. */


h.UNAUTHENTICATED = new h(null), // TODO(mikelehen): Look into getting a proper uid-equivalent for
// non-FirebaseAuth providers.
h.GOOGLE_CREDENTIALS = new h("google-credentials-uid"), h.FIRST_PARTY = new h("first-party-uid"), h.MOCK_USER = new h("mock-user");
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var l = "9.0.2";
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var f = new _logger.Logger("@firebase/firestore");
/**
 * Sets the verbosity of Cloud Firestore logs (debug, error, or silent).
 *
 * @param logLevel - The verbosity you set for activity and error logging. Can
 *   be any of the following values:
 *
 *   <ul>
 *     <li>`debug` for the most verbose logging level, primarily for
 *     debugging.</li>
 *     <li>`error` to log errors only.</li>
 *     <li><code>`silent` to turn off logging.</li>
 *   </ul>
 */

function d(t) {
  f.setLogLevel(t);
}

function w(t) {
  if (f.logLevel <= _logger.LogLevel.DEBUG) {
    for (var _len = arguments.length, n = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      n[_key - 1] = arguments[_key];
    }

    var _e2 = n.map(y);

    f.debug.apply(f, ["Firestore (".concat(l, "): ").concat(t)].concat(_toConsumableArray(_e2)));
  }
}

function m(t) {
  if (f.logLevel <= _logger.LogLevel.ERROR) {
    for (var _len2 = arguments.length, n = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      n[_key2 - 1] = arguments[_key2];
    }

    var _e3 = n.map(y);

    f.error.apply(f, ["Firestore (".concat(l, "): ").concat(t)].concat(_toConsumableArray(_e3)));
  }
}
/**
 * @internal
 */


function p(t) {
  if (f.logLevel <= _logger.LogLevel.WARN) {
    for (var _len3 = arguments.length, n = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      n[_key3 - 1] = arguments[_key3];
    }

    var _e4 = n.map(y);

    f.warn.apply(f, ["Firestore (".concat(l, "): ").concat(t)].concat(_toConsumableArray(_e4)));
  }
}
/**
 * Converts an additional log parameter to a string representation.
 */


function y(t) {
  if ("string" == typeof t) return t;

  try {
    return n = t, JSON.stringify(n);
  } catch (n) {
    // Converting to JSON failed, just log the object directly
    return t;
  }
  /**
  * @license
  * Copyright 2020 Google LLC
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *   http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */

  /** Formats an object as a JSON string, suitable for logging. */


  var n;
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Unconditionally fails, throwing an Error with the given message.
 * Messages are stripped in production builds.
 *
 * Returns `never` and can be used in expressions:
 * @example
 * let futureVar = fail('not implemented yet');
 */


function _() {
  var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "Unexpected state";
  // Log the failure in addition to throw an exception, just in case the
  // exception is swallowed.
  var n = "FIRESTORE (".concat(l, ") INTERNAL ASSERTION FAILED: ") + t; // NOTE: We don't use FirestoreError here because these are internal failures
  // that cannot be handled by the user. (Also it would create a circular
  // dependency between the error and assert modules which doesn't work.)

  throw m(n), new Error(n);
}
/**
 * Fails if the given assertion condition is false, throwing an Error with the
 * given message if it did.
 *
 * Messages are stripped in production builds.
 */


function g(t, n) {
  t || _();
}
/**
 * Casts `obj` to `T`. In non-production builds, verifies that `obj` is an
 * instance of `T` before casting.
 */


function b(t, // eslint-disable-next-line @typescript-eslint/no-explicit-any
n) {
  return t;
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


var v = "ok",
    E = "cancelled",
    I = "unknown",
    T = "invalid-argument",
    A = "deadline-exceeded",
    P = "not-found",
    R = "already-exists",
    V = "permission-denied",
    N = "unauthenticated",
    D = "resource-exhausted",
    $ = "failed-precondition",
    F = "aborted",
    S = "out-of-range",
    q = "unimplemented",
    x = "internal",
    O = "unavailable",
    C = "data-loss";
/** An error returned by a Firestore operation. */

var L = /*#__PURE__*/function (_Error) {
  _inherits(L, _Error);

  var _super = _createSuper(L);

  /** @hideconstructor */
  function L(
  /**
   * The backend error code associated with this error.
   */
  t,
  /**
   * A custom error description.
   */
  n) {
    var _this;

    _classCallCheck(this, L);

    _this = _super.call(this, n), _this.code = t, _this.message = n,
    /** The custom name for all FirestoreErrors. */
    _this.name = "FirebaseError", // HACK: We write a toString property directly because Error is not a real
    // class and so inheritance does not work correctly. We could alternatively
    // do the same "back-door inheritance" trick that FirebaseError does.
    _this.toString = function () {
      return "".concat(_this.name, ": [code=").concat(_this.code, "]: ").concat(_this.message);
    };
    return _this;
  }

  return L;
}( /*#__PURE__*/_wrapNativeSuper(Error));
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


exports.FirestoreError = L;

var U = function U() {
  var _this2 = this;

  _classCallCheck(this, U);

  this.promise = new Promise(function (t, n) {
    _this2.resolve = t, _this2.reject = n;
  });
};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


var j = function j(t, n) {
  _classCallCheck(this, j);

  this.user = n, this.type = "OAuth", this.authHeaders = {}, // Set the headers using Object Literal notation to avoid minification
  this.authHeaders.Authorization = "Bearer ".concat(t);
};
/**
 * A CredentialsProvider that always yields an empty token.
 * @internal
 */


var k = /*#__PURE__*/function () {
  function k() {
    _classCallCheck(this, k);
  }

  _createClass(k, [{
    key: "getToken",
    value: function getToken() {
      return Promise.resolve(null);
    }
  }, {
    key: "invalidateToken",
    value: function invalidateToken() {}
  }, {
    key: "start",
    value: function start(t, n) {
      // Fire with initial user.
      t.enqueueRetryable(function () {
        return n(h.UNAUTHENTICATED);
      });
    }
  }, {
    key: "shutdown",
    value: function shutdown() {}
  }]);

  return k;
}();
/**
 * A CredentialsProvider that always returns a constant token. Used for
 * emulator token mocking.
 */


var M = /*#__PURE__*/function () {
  function M(t) {
    _classCallCheck(this, M);

    this.token = t,
    /**
     * Stores the listener registered with setChangeListener()
     * This isn't actually necessary since the UID never changes, but we use this
     * to verify the listen contract is adhered to in tests.
     */
    this.changeListener = null;
  }

  _createClass(M, [{
    key: "getToken",
    value: function getToken() {
      return Promise.resolve(this.token);
    }
  }, {
    key: "invalidateToken",
    value: function invalidateToken() {}
  }, {
    key: "start",
    value: function start(t, n) {
      var _this3 = this;

      this.changeListener = n, // Fire with initial user.
      t.enqueueRetryable(function () {
        return n(_this3.token.user);
      });
    }
  }, {
    key: "shutdown",
    value: function shutdown() {
      this.changeListener = null;
    }
  }]);

  return M;
}();
/** Credential provider for the Lite SDK. */


var B = /*#__PURE__*/function () {
  function B(t) {
    var _this4 = this;

    _classCallCheck(this, B);

    this.auth = null, t.onInit(function (t) {
      _this4.auth = t;
    });
  }

  _createClass(B, [{
    key: "getToken",
    value: function getToken() {
      var _this5 = this;

      return this.auth ? this.auth.getToken().then(function (t) {
        return t ? (g("string" == typeof t.accessToken), new j(t.accessToken, new h(_this5.auth.getUid()))) : null;
      }) : Promise.resolve(null);
    }
  }, {
    key: "invalidateToken",
    value: function invalidateToken() {}
  }, {
    key: "start",
    value: function start(t, n) {}
  }, {
    key: "shutdown",
    value: function shutdown() {}
  }]);

  return B;
}();
/*
 * FirstPartyToken provides a fresh token each time its value
 * is requested, because if the token is too old, requests will be rejected.
 * Technically this may no longer be necessary since the SDK should gracefully
 * recover from unauthenticated errors (see b/33147818 for context), but it's
 * safer to keep the implementation as-is.
 */


var Q = /*#__PURE__*/function () {
  function Q(t, n, e) {
    _classCallCheck(this, Q);

    this.t = t, this.i = n, this.o = e, this.type = "FirstParty", this.user = h.FIRST_PARTY;
  }

  _createClass(Q, [{
    key: "authHeaders",
    get: function get() {
      var t = {
        "X-Goog-AuthUser": this.i
      },
          n = this.t.auth.getAuthHeaderValueForFirstParty([]); // Use array notation to prevent minification

      return n && (t.Authorization = n), this.o && (t["X-Goog-Iam-Authorization-Token"] = this.o), t;
    }
  }]);

  return Q;
}();
/*
 * Provides user credentials required for the Firestore JavaScript SDK
 * to authenticate the user, using technique that is only available
 * to applications hosted by Google.
 */


var z = /*#__PURE__*/function () {
  function z(t, n, e) {
    _classCallCheck(this, z);

    this.t = t, this.i = n, this.o = e;
  }

  _createClass(z, [{
    key: "getToken",
    value: function getToken() {
      return Promise.resolve(new Q(this.t, this.i, this.o));
    }
  }, {
    key: "start",
    value: function start(t, n) {
      // Fire with initial uid.
      t.enqueueRetryable(function () {
        return n(h.FIRST_PARTY);
      });
    }
  }, {
    key: "shutdown",
    value: function shutdown() {}
  }, {
    key: "invalidateToken",
    value: function invalidateToken() {}
  }]);

  return z;
}();
/**
 * Builds a CredentialsProvider depending on the type of
 * the credentials passed in.
 */

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


var W =
/**
 * Constructs a DatabaseInfo using the provided host, databaseId and
 * persistenceKey.
 *
 * @param databaseId - The database to use.
 * @param appId - The Firebase App Id.
 * @param persistenceKey - A unique identifier for this Firestore's local
 * storage (used in conjunction with the databaseId).
 * @param host - The Firestore backend host to connect to.
 * @param ssl - Whether to use SSL when connecting.
 * @param forceLongPolling - Whether to use the forceLongPolling option
 * when using WebChannel as the network transport.
 * @param autoDetectLongPolling - Whether to use the detectBufferingProxy
 * option when using WebChannel as the network transport.
 * @param useFetchStreams Whether to use the Fetch API instead of
 * XMLHTTPRequest
 */
function W(t, n, e, r, s, i, o, u) {
  _classCallCheck(this, W);

  this.databaseId = t, this.appId = n, this.persistenceKey = e, this.host = r, this.ssl = s, this.forceLongPolling = i, this.autoDetectLongPolling = o, this.useFetchStreams = u;
};
/** The default database name for a project. */

/**
 * Represents the database ID a Firestore client is associated with.
 * @internal
 */


var G = /*#__PURE__*/function () {
  function G(t, n) {
    _classCallCheck(this, G);

    this.projectId = t, this.database = n || "(default)";
  }

  _createClass(G, [{
    key: "isDefaultDatabase",
    get: function get() {
      return "(default)" === this.database;
    }
  }, {
    key: "isEqual",
    value: function isEqual(t) {
      return t instanceof G && t.projectId === this.projectId && t.database === this.database;
    }
  }]);

  return G;
}();
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Path represents an ordered sequence of string segments.
 */


var H = /*#__PURE__*/function () {
  function H(t, n, e) {
    _classCallCheck(this, H);

    void 0 === n ? n = 0 : n > t.length && _(), void 0 === e ? e = t.length - n : e > t.length - n && _(), this.segments = t, this.offset = n, this.len = e;
  }

  _createClass(H, [{
    key: "length",
    get: function get() {
      return this.len;
    }
  }, {
    key: "isEqual",
    value: function isEqual(t) {
      return 0 === H.comparator(this, t);
    }
  }, {
    key: "child",
    value: function child(t) {
      var n = this.segments.slice(this.offset, this.limit());
      return t instanceof H ? t.forEach(function (t) {
        n.push(t);
      }) : n.push(t), this.construct(n);
    }
    /** The index of one past the last segment of the path. */

  }, {
    key: "limit",
    value: function limit() {
      return this.offset + this.length;
    }
  }, {
    key: "popFirst",
    value: function popFirst(t) {
      return t = void 0 === t ? 1 : t, this.construct(this.segments, this.offset + t, this.length - t);
    }
  }, {
    key: "popLast",
    value: function popLast() {
      return this.construct(this.segments, this.offset, this.length - 1);
    }
  }, {
    key: "firstSegment",
    value: function firstSegment() {
      return this.segments[this.offset];
    }
  }, {
    key: "lastSegment",
    value: function lastSegment() {
      return this.get(this.length - 1);
    }
  }, {
    key: "get",
    value: function get(t) {
      return this.segments[this.offset + t];
    }
  }, {
    key: "isEmpty",
    value: function isEmpty() {
      return 0 === this.length;
    }
  }, {
    key: "isPrefixOf",
    value: function isPrefixOf(t) {
      if (t.length < this.length) return !1;

      for (var _n2 = 0; _n2 < this.length; _n2++) {
        if (this.get(_n2) !== t.get(_n2)) return !1;
      }

      return !0;
    }
  }, {
    key: "isImmediateParentOf",
    value: function isImmediateParentOf(t) {
      if (this.length + 1 !== t.length) return !1;

      for (var _n3 = 0; _n3 < this.length; _n3++) {
        if (this.get(_n3) !== t.get(_n3)) return !1;
      }

      return !0;
    }
  }, {
    key: "forEach",
    value: function forEach(t) {
      for (var _n4 = this.offset, _e5 = this.limit(); _n4 < _e5; _n4++) {
        t(this.segments[_n4]);
      }
    }
  }, {
    key: "toArray",
    value: function toArray() {
      return this.segments.slice(this.offset, this.limit());
    }
  }], [{
    key: "comparator",
    value: function comparator(t, n) {
      var e = Math.min(t.length, n.length);

      for (var _r2 = 0; _r2 < e; _r2++) {
        var _e6 = t.get(_r2),
            _s = n.get(_r2);

        if (_e6 < _s) return -1;
        if (_e6 > _s) return 1;
      }

      return t.length < n.length ? -1 : t.length > n.length ? 1 : 0;
    }
  }]);

  return H;
}();
/**
 * A slash-separated path for navigating resources (documents and collections)
 * within Firestore.
 *
 * @internal
 */


var Y = /*#__PURE__*/function (_H) {
  _inherits(Y, _H);

  var _super2 = _createSuper(Y);

  function Y() {
    _classCallCheck(this, Y);

    return _super2.apply(this, arguments);
  }

  _createClass(Y, [{
    key: "construct",
    value: function construct(t, n, e) {
      return new Y(t, n, e);
    }
  }, {
    key: "canonicalString",
    value: function canonicalString() {
      // NOTE: The client is ignorant of any path segments containing escape
      // sequences (e.g. __id123__) and just passes them through raw (they exist
      // for legacy reasons and should not be used frequently).
      return this.toArray().join("/");
    }
  }, {
    key: "toString",
    value: function toString() {
      return this.canonicalString();
    }
    /**
     * Creates a resource path from the given slash-delimited string. If multiple
     * arguments are provided, all components are combined. Leading and trailing
     * slashes from all components are ignored.
     */

  }], [{
    key: "fromString",
    value: function fromString() {
      // NOTE: The client is ignorant of any path segments containing escape
      // sequences (e.g. __id123__) and just passes them through raw (they exist
      // for legacy reasons and should not be used frequently).
      var n = [];

      for (var _len4 = arguments.length, t = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        t[_key4] = arguments[_key4];
      }

      for (var _i = 0, _t2 = t; _i < _t2.length; _i++) {
        var _e7 = _t2[_i];
        if (_e7.indexOf("//") >= 0) throw new L(T, "Invalid segment (".concat(_e7, "). Paths must not contain // in them.")); // Strip leading and traling slashed.

        n.push.apply(n, _toConsumableArray(_e7.split("/").filter(function (t) {
          return t.length > 0;
        })));
      }

      return new Y(n);
    }
  }, {
    key: "emptyPath",
    value: function emptyPath() {
      return new Y([]);
    }
  }]);

  return Y;
}(H);

var K = /^[_a-zA-Z][_a-zA-Z0-9]*$/;
/**
 * A dot-separated path for navigating sub-objects within a document.
 * @internal
 */

var J = /*#__PURE__*/function (_H2) {
  _inherits(J, _H2);

  var _super3 = _createSuper(J);

  function J() {
    _classCallCheck(this, J);

    return _super3.apply(this, arguments);
  }

  _createClass(J, [{
    key: "construct",
    value: function construct(t, n, e) {
      return new J(t, n, e);
    }
    /**
     * Returns true if the string could be used as a segment in a field path
     * without escaping.
     */

  }, {
    key: "canonicalString",
    value: function canonicalString() {
      return this.toArray().map(function (t) {
        return t = t.replace(/\\/g, "\\\\").replace(/`/g, "\\`"), J.isValidIdentifier(t) || (t = "`" + t + "`"), t;
      }).join(".");
    }
  }, {
    key: "toString",
    value: function toString() {
      return this.canonicalString();
    }
    /**
     * Returns true if this field references the key of a document.
     */

  }, {
    key: "isKeyField",
    value: function isKeyField() {
      return 1 === this.length && "__name__" === this.get(0);
    }
    /**
     * The field designating the key of a document.
     */

  }], [{
    key: "isValidIdentifier",
    value: function isValidIdentifier(t) {
      return K.test(t);
    }
  }, {
    key: "keyField",
    value: function keyField() {
      return new J(["__name__"]);
    }
    /**
     * Parses a field string from the given server-formatted string.
     *
     * - Splitting the empty string is not allowed (for now at least).
     * - Empty segments within the string (e.g. if there are two consecutive
     *   separators) are not allowed.
     *
     * TODO(b/37244157): we should make this more strict. Right now, it allows
     * non-identifier path components, even if they aren't escaped.
     */

  }, {
    key: "fromServerFormat",
    value: function fromServerFormat(t) {
      var n = [];
      var e = "",
          r = 0;

      var s = function s() {
        if (0 === e.length) throw new L(T, "Invalid field path (".concat(t, "). Paths must not be empty, begin with '.', end with '.', or contain '..'"));
        n.push(e), e = "";
      };

      var i = !1;

      for (; r < t.length;) {
        var _n5 = t[r];

        if ("\\" === _n5) {
          if (r + 1 === t.length) throw new L(T, "Path has trailing escape character: " + t);
          var _n6 = t[r + 1];
          if ("\\" !== _n6 && "." !== _n6 && "`" !== _n6) throw new L(T, "Path has invalid escape sequence: " + t);
          e += _n6, r += 2;
        } else "`" === _n5 ? (i = !i, r++) : "." !== _n5 || i ? (e += _n5, r++) : (s(), r++);
      }

      if (s(), i) throw new L(T, "Unterminated ` in path: " + t);
      return new J(n);
    }
  }, {
    key: "emptyPath",
    value: function emptyPath() {
      return new J([]);
    }
  }]);

  return J;
}(H);
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @internal
 */


var Z = /*#__PURE__*/function () {
  function Z(t) {
    _classCallCheck(this, Z);

    this.path = t;
  }

  _createClass(Z, [{
    key: "hasCollectionId",
    value:
    /** Returns true if the document is in the specified collectionId. */
    function hasCollectionId(t) {
      return this.path.length >= 2 && this.path.get(this.path.length - 2) === t;
    }
  }, {
    key: "isEqual",
    value: function isEqual(t) {
      return null !== t && 0 === Y.comparator(this.path, t.path);
    }
  }, {
    key: "toString",
    value: function toString() {
      return this.path.toString();
    }
  }], [{
    key: "fromPath",
    value: function fromPath(t) {
      return new Z(Y.fromString(t));
    }
  }, {
    key: "fromName",
    value: function fromName(t) {
      return new Z(Y.fromString(t).popFirst(5));
    }
  }, {
    key: "comparator",
    value: function comparator(t, n) {
      return Y.comparator(t.path, n.path);
    }
  }, {
    key: "isDocumentKey",
    value: function isDocumentKey(t) {
      return t.length % 2 == 0;
    }
    /**
     * Creates and returns a new document key with the given segments.
     *
     * @param segments - The segments of the path to the document
     * @returns A new instance of DocumentKey
     */

  }, {
    key: "fromSegments",
    value: function fromSegments(t) {
      return new Z(new Y(t.slice()));
    }
  }]);

  return Z;
}();
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


function X(t, n, e) {
  if (!e) throw new L(T, "Function ".concat(t, "() cannot be called with an empty ").concat(n, "."));
}
/**
 * Validates that two boolean options are not set at the same time.
 * @internal
 */

/**
 * Validates that `path` refers to a document (indicated by the fact it contains
 * an even numbers of segments).
 */


function tt(t) {
  if (!Z.isDocumentKey(t)) throw new L(T, "Invalid document reference. Document references must have an even number of segments, but ".concat(t, " has ").concat(t.length, "."));
}
/**
 * Validates that `path` refers to a collection (indicated by the fact it
 * contains an odd numbers of segments).
 */


function nt(t) {
  if (Z.isDocumentKey(t)) throw new L(T, "Invalid collection reference. Collection references must have an odd number of segments, but ".concat(t, " has ").concat(t.length, "."));
}
/**
 * Returns true if it's a non-null object without a custom prototype
 * (i.e. excludes Array, Date, etc.).
 */

/** Returns a string describing the type / value of the provided input. */


function et(t) {
  if (void 0 === t) return "undefined";
  if (null === t) return "null";
  if ("string" == typeof t) return t.length > 20 && (t = "".concat(t.substring(0, 20), "...")), JSON.stringify(t);
  if ("number" == typeof t || "boolean" == typeof t) return "" + t;

  if ("object" == _typeof(t)) {
    if (t instanceof Array) return "an array";
    {
      var _n7 =
      /** Hacky method to try to get the constructor name for an object. */
      function (t) {
        if (t.constructor) {
          var _n8 = /function\s+([^\s(]+)\s*\(/.exec(t.constructor.toString());

          if (_n8 && _n8.length > 1) return _n8[1];
        }

        return null;
      }
      /**
      * Casts `obj` to `T`, optionally unwrapping Compat types to expose the
      * underlying instance. Throws if  `obj` is not an instance of `T`.
      *
      * This cast is used in the Lite and Full SDK to verify instance types for
      * arguments passed to the public API.
      * @internal
      */
      (t);

      return _n7 ? "a custom ".concat(_n7, " object") : "an object";
    }
  }

  return "function" == typeof t ? "a function" : _();
}

function rt(t, // eslint-disable-next-line @typescript-eslint/no-explicit-any
n) {
  if ("_delegate" in t && ( // Unwrap Compat types
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t = t._delegate), !(t instanceof n)) {
    if (n.name === t.constructor.name) throw new L(T, "Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");
    {
      var _e8 = et(t);

      throw new L(T, "Expected type '".concat(n.name, "', but it was: ").concat(_e8));
    }
  }

  return t;
}

function st(t, n) {
  if (n <= 0) throw new L(T, "Function ".concat(t, "() requires a positive number, but it was: ").concat(n, "."));
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Returns whether a variable is either undefined or null.
 */


function it(t) {
  return null == t;
}
/** Returns whether the value represents -0. */


function ot(t) {
  // Detect if the value is -0.0. Based on polyfill from
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
  return 0 === t && 1 / t == -1 / 0;
}
/**
 * Returns whether a value is an integer and in the safe integer range
 * @param value - The value to test for being an integer and in the safe range
 */

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


var ut = {
  BatchGetDocuments: "batchGet",
  Commit: "commit",
  RunQuery: "runQuery"
};
/**
 * Maps RPC names to the corresponding REST endpoint name.
 *
 * We use array notation to avoid mangling.
 */

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Error Codes describing the different ways GRPC can fail. These are copied
 * directly from GRPC's sources here:
 *
 * https://github.com/grpc/grpc/blob/bceec94ea4fc5f0085d81235d8e1c06798dc341a/include/grpc%2B%2B/impl/codegen/status_code_enum.h
 *
 * Important! The names of these identifiers matter because the string forms
 * are used for reverse lookups from the webchannel stream. Do NOT change the
 * names of these identifiers or change this into a const enum.
 */

var ct, at;
/**
 * Converts an HTTP Status Code to the equivalent error code.
 *
 * @param status - An HTTP Status Code, like 200, 404, 503, etc.
 * @returns The equivalent Code. Unknown status codes are mapped to
 *     Code.UNKNOWN.
 */

function ht(t) {
  if (void 0 === t) return m("RPC_ERROR", "HTTP error has no status"), I; // The canonical error codes for Google APIs [1] specify mapping onto HTTP
  // status codes but the mapping is not bijective. In each case of ambiguity
  // this function chooses a primary error.
  // [1]
  // https://github.com/googleapis/googleapis/blob/master/google/rpc/code.proto

  switch (t) {
    case 200:
      // OK
      return v;

    case 400:
      // Bad Request
      return $;
    // Other possibilities based on the forward mapping
    // return Code.INVALID_ARGUMENT;
    // return Code.OUT_OF_RANGE;

    case 401:
      // Unauthorized
      return N;

    case 403:
      // Forbidden
      return V;

    case 404:
      // Not Found
      return P;

    case 409:
      // Conflict
      return F;
    // Other possibilities:
    // return Code.ALREADY_EXISTS;

    case 416:
      // Range Not Satisfiable
      return S;

    case 429:
      // Too Many Requests
      return D;

    case 499:
      // Client Closed Request
      return E;

    case 500:
      // Internal Server Error
      return I;
    // Other possibilities:
    // return Code.INTERNAL;
    // return Code.DATA_LOSS;

    case 501:
      // Unimplemented
      return q;

    case 503:
      // Service Unavailable
      return O;

    case 504:
      // Gateway Timeout
      return A;

    default:
      return t >= 200 && t < 300 ? v : t >= 400 && t < 500 ? $ : t >= 500 && t < 600 ? x : I;
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * A Rest-based connection that relies on the native HTTP stack
 * (e.g. `fetch` or a polyfill).
 */


(at = ct || (ct = {}))[at.OK = 0] = "OK", at[at.CANCELLED = 1] = "CANCELLED", at[at.UNKNOWN = 2] = "UNKNOWN", at[at.INVALID_ARGUMENT = 3] = "INVALID_ARGUMENT", at[at.DEADLINE_EXCEEDED = 4] = "DEADLINE_EXCEEDED", at[at.NOT_FOUND = 5] = "NOT_FOUND", at[at.ALREADY_EXISTS = 6] = "ALREADY_EXISTS", at[at.PERMISSION_DENIED = 7] = "PERMISSION_DENIED", at[at.UNAUTHENTICATED = 16] = "UNAUTHENTICATED", at[at.RESOURCE_EXHAUSTED = 8] = "RESOURCE_EXHAUSTED", at[at.FAILED_PRECONDITION = 9] = "FAILED_PRECONDITION", at[at.ABORTED = 10] = "ABORTED", at[at.OUT_OF_RANGE = 11] = "OUT_OF_RANGE", at[at.UNIMPLEMENTED = 12] = "UNIMPLEMENTED", at[at.INTERNAL = 13] = "INTERNAL", at[at.UNAVAILABLE = 14] = "UNAVAILABLE", at[at.DATA_LOSS = 15] = "DATA_LOSS";

var lt = /*#__PURE__*/function (_ref) {
  _inherits(lt, _ref);

  var _super4 = _createSuper(lt);

  /**
   * @param databaseInfo - The connection info.
   * @param fetchImpl - `fetch` or a Polyfill that implements the fetch API.
   */
  function lt(t, n) {
    var _this6;

    _classCallCheck(this, lt);

    _this6 = _super4.call(this, t), _this6.I = n;
    return _this6;
  }

  _createClass(lt, [{
    key: "T",
    value: function T(t, n) {
      throw new Error("Not supported by FetchConnection");
    }
  }, {
    key: "g",
    value: function () {
      var _g = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(t, n, e, r) {
        var s, i;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                s = JSON.stringify(r);
                _context.prev = 1;
                _context.next = 4;
                return this.I(n, {
                  method: "POST",
                  headers: e,
                  body: s
                });

              case 4:
                i = _context.sent;
                _context.next = 10;
                break;

              case 7:
                _context.prev = 7;
                _context.t0 = _context["catch"](1);
                throw new L(ht(_context.t0.status), "Request failed with error: " + _context.t0.statusText);

              case 10:
                if (i.ok) {
                  _context.next = 12;
                  break;
                }

                throw new L(ht(i.status), "Request failed with error: " + i.statusText);

              case 12:
                return _context.abrupt("return", i.json());

              case 13:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[1, 7]]);
      }));

      function g(_x, _x2, _x3, _x4) {
        return _g.apply(this, arguments);
      }

      return g;
    }()
  }]);

  return lt;
}(
/*#__PURE__*/

/**
 * Base class for all Rest-based connections to the backend (WebChannel and
 * HTTP).
 */
function () {
  function _class(t) {
    _classCallCheck(this, _class);

    this.databaseInfo = t, this.databaseId = t.databaseId;
    var n = t.ssl ? "https" : "http";
    this.u = n + "://" + t.host, this.h = "projects/" + this.databaseId.projectId + "/databases/" + this.databaseId.database + "/documents";
  }

  _createClass(_class, [{
    key: "l",
    value: function l(t, n, e, r) {
      var s = this.m(t, n);
      w("RestConnection", "Sending: ", s, e);
      var i = {};
      return this.p(i, r), this.g(t, s, i, e).then(function (t) {
        return w("RestConnection", "Received: ", t), t;
      }, function (n) {
        throw p("RestConnection", "".concat(t, " failed with error: "), n, "url: ", s, "request:", e), n;
      });
    }
  }, {
    key: "v",
    value: function v(t, n, e, r) {
      // The REST API automatically aggregates all of the streamed results, so we
      // can just use the normal invoke() method.
      return this.l(t, n, e, r);
    }
    /**
     * Modifies the headers for a request, adding any authorization token if
     * present and any additional headers for the request.
     */

  }, {
    key: "p",
    value:
    /**
     * Modifies the headers for a request, adding any authorization token if
     * present and any additional headers for the request.
     */
    function p(t, n) {
      if (t["X-Goog-Api-Client"] = "gl-js/ fire/" + l, // Content-Type: text/plain will avoid preflight requests which might
      // mess with CORS and redirects by proxies. If we add custom headers
      // we will need to change this code to potentially use the $httpOverwrite
      // parameter supported by ESF to avoid triggering preflight requests.
      t["Content-Type"] = "text/plain", this.databaseInfo.appId && (t["X-Firebase-GMPID"] = this.databaseInfo.appId), n) for (var _e9 in n.authHeaders) {
        n.authHeaders.hasOwnProperty(_e9) && (t[_e9] = n.authHeaders[_e9]);
      }
    }
  }, {
    key: "m",
    value: function m(t, n) {
      var e = ut[t];
      return "".concat(this.u, "/v1/").concat(n, ":").concat(e);
    }
  }]);

  return _class;
}());
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/** Initializes the HTTP connection for the REST API. */

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Generates `nBytes` of random bytes.
 *
 * If `nBytes < 0` , an error will be thrown.
 */


function ft(t) {
  // Polyfills for IE and WebWorker by using `self` and `msCrypto` when `crypto` is not available.
  var n = // eslint-disable-next-line @typescript-eslint/no-explicit-any
  "undefined" != typeof self && (self.crypto || self.msCrypto),
      e = new Uint8Array(t);
  if (n && "function" == typeof n.getRandomValues) n.getRandomValues(e);else // Falls back to Math.random
    for (var _n9 = 0; _n9 < t; _n9++) {
      e[_n9] = Math.floor(256 * Math.random());
    }
  return e;
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


var dt = /*#__PURE__*/function () {
  function dt() {
    _classCallCheck(this, dt);
  }

  _createClass(dt, null, [{
    key: "A",
    value: function A() {
      // Alphanumeric characters
      var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
          n = Math.floor(256 / t.length) * t.length; // The largest byte value that is a multiple of `char.length`.

      var e = "";

      for (; e.length < 20;) {
        var _r3 = ft(40);

        for (var _s2 = 0; _s2 < _r3.length; ++_s2) {
          // Only accept values that are [0, maxMultiple), this ensures they can
          // be evenly mapped to indices of `chars` via a modulo operation.
          e.length < 20 && _r3[_s2] < n && (e += t.charAt(_r3[_s2] % t.length));
        }
      }

      return e;
    }
  }]);

  return dt;
}();

function wt(t, n) {
  return t < n ? -1 : t > n ? 1 : 0;
}
/** Helper to compare arrays using isEqual(). */


function mt(t, n, e) {
  return t.length === n.length && t.every(function (t, r) {
    return e(t, n[r]);
  });
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// The earliest date supported by Firestore timestamps (0001-01-01T00:00:00Z).

/**
 * A `Timestamp` represents a point in time independent of any time zone or
 * calendar, represented as seconds and fractions of seconds at nanosecond
 * resolution in UTC Epoch time.
 *
 * It is encoded using the Proleptic Gregorian Calendar which extends the
 * Gregorian calendar backwards to year one. It is encoded assuming all minutes
 * are 60 seconds long, i.e. leap seconds are "smeared" so that no leap second
 * table is needed for interpretation. Range is from 0001-01-01T00:00:00Z to
 * 9999-12-31T23:59:59.999999999Z.
 *
 * For examples and further specifications, refer to the
 * {@link https://github.com/google/protobuf/blob/master/src/google/protobuf/timestamp.proto | Timestamp definition}.
 */


var pt = /*#__PURE__*/function () {
  /**
   * Creates a new timestamp.
   *
   * @param seconds - The number of seconds of UTC time since Unix epoch
   *     1970-01-01T00:00:00Z. Must be from 0001-01-01T00:00:00Z to
   *     9999-12-31T23:59:59Z inclusive.
   * @param nanoseconds - The non-negative fractions of a second at nanosecond
   *     resolution. Negative second values with fractions must still have
   *     non-negative nanoseconds values that count forward in time. Must be
   *     from 0 to 999,999,999 inclusive.
   */
  function pt(
  /**
   * The number of seconds of UTC time since Unix epoch 1970-01-01T00:00:00Z.
   */
  t,
  /**
   * The fractions of a second at nanosecond resolution.*
   */
  n) {
    _classCallCheck(this, pt);

    if (this.seconds = t, this.nanoseconds = n, n < 0) throw new L(T, "Timestamp nanoseconds out of range: " + n);
    if (n >= 1e9) throw new L(T, "Timestamp nanoseconds out of range: " + n);
    if (t < -62135596800) throw new L(T, "Timestamp seconds out of range: " + t); // This will break in the year 10,000.

    if (t >= 253402300800) throw new L(T, "Timestamp seconds out of range: " + t);
  }
  /**
   * Creates a new timestamp with the current date, with millisecond precision.
   *
   * @returns a new timestamp representing the current date.
   */


  _createClass(pt, [{
    key: "toDate",
    value:
    /**
     * Converts a `Timestamp` to a JavaScript `Date` object. This conversion
     * causes a loss of precision since `Date` objects only support millisecond
     * precision.
     *
     * @returns JavaScript `Date` object representing the same point in time as
     *     this `Timestamp`, with millisecond precision.
     */
    function toDate() {
      return new Date(this.toMillis());
    }
    /**
     * Converts a `Timestamp` to a numeric timestamp (in milliseconds since
     * epoch). This operation causes a loss of precision.
     *
     * @returns The point in time corresponding to this timestamp, represented as
     *     the number of milliseconds since Unix epoch 1970-01-01T00:00:00Z.
     */

  }, {
    key: "toMillis",
    value: function toMillis() {
      return 1e3 * this.seconds + this.nanoseconds / 1e6;
    }
  }, {
    key: "_compareTo",
    value: function _compareTo(t) {
      return this.seconds === t.seconds ? wt(this.nanoseconds, t.nanoseconds) : wt(this.seconds, t.seconds);
    }
    /**
     * Returns true if this `Timestamp` is equal to the provided one.
     *
     * @param other - The `Timestamp` to compare against.
     * @returns true if this `Timestamp` is equal to the provided one.
     */

  }, {
    key: "isEqual",
    value: function isEqual(t) {
      return t.seconds === this.seconds && t.nanoseconds === this.nanoseconds;
    }
    /** Returns a textual representation of this `Timestamp`. */

  }, {
    key: "toString",
    value: function toString() {
      return "Timestamp(seconds=" + this.seconds + ", nanoseconds=" + this.nanoseconds + ")";
    }
    /** Returns a JSON-serializable representation of this `Timestamp`. */

  }, {
    key: "toJSON",
    value: function toJSON() {
      return {
        seconds: this.seconds,
        nanoseconds: this.nanoseconds
      };
    }
    /**
     * Converts this object to a primitive string, which allows `Timestamp` objects
     * to be compared using the `>`, `<=`, `>=` and `>` operators.
     */

  }, {
    key: "valueOf",
    value: function valueOf() {
      // This method returns a string of the form <seconds>.<nanoseconds> where
      // <seconds> is translated to have a non-negative value and both <seconds>
      // and <nanoseconds> are left-padded with zeroes to be a consistent length.
      // Strings with this format then have a lexiographical ordering that matches
      // the expected ordering. The <seconds> translation is done to avoid having
      // a leading negative sign (i.e. a leading '-' character) in its string
      // representation, which would affect its lexiographical ordering.
      var t = this.seconds - -62135596800; // Note: Up to 12 decimal digits are required to represent all valid
      // 'seconds' values.

      return String(t).padStart(12, "0") + "." + String(this.nanoseconds).padStart(9, "0");
    }
  }], [{
    key: "now",
    value: function now() {
      return pt.fromMillis(Date.now());
    }
    /**
     * Creates a new timestamp from the given date.
     *
     * @param date - The date to initialize the `Timestamp` from.
     * @returns A new `Timestamp` representing the same point in time as the given
     *     date.
     */

  }, {
    key: "fromDate",
    value: function fromDate(t) {
      return pt.fromMillis(t.getTime());
    }
    /**
     * Creates a new timestamp from the given number of milliseconds.
     *
     * @param milliseconds - Number of milliseconds since Unix epoch
     *     1970-01-01T00:00:00Z.
     * @returns A new `Timestamp` representing the same point in time as the given
     *     number of milliseconds.
     */

  }, {
    key: "fromMillis",
    value: function fromMillis(t) {
      var n = Math.floor(t / 1e3),
          e = Math.floor(1e6 * (t - 1e3 * n));
      return new pt(n, e);
    }
  }]);

  return pt;
}();
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * A version of a document in Firestore. This corresponds to the version
 * timestamp, such as update_time or read_time.
 */


exports.Timestamp = pt;

var yt = /*#__PURE__*/function () {
  function yt(t) {
    _classCallCheck(this, yt);

    this.timestamp = t;
  }

  _createClass(yt, [{
    key: "compareTo",
    value: function compareTo(t) {
      return this.timestamp._compareTo(t.timestamp);
    }
  }, {
    key: "isEqual",
    value: function isEqual(t) {
      return this.timestamp.isEqual(t.timestamp);
    }
    /** Returns a number representation of the version for use in spec tests. */

  }, {
    key: "toMicroseconds",
    value: function toMicroseconds() {
      // Convert to microseconds.
      return 1e6 * this.timestamp.seconds + this.timestamp.nanoseconds / 1e3;
    }
  }, {
    key: "toString",
    value: function toString() {
      return "SnapshotVersion(" + this.timestamp.toString() + ")";
    }
  }, {
    key: "toTimestamp",
    value: function toTimestamp() {
      return this.timestamp;
    }
  }], [{
    key: "fromTimestamp",
    value: function fromTimestamp(t) {
      return new yt(t);
    }
  }, {
    key: "min",
    value: function min() {
      return new yt(new pt(0, 0));
    }
  }]);

  return yt;
}();
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


function _t(t) {
  var n = 0;

  for (var _e10 in t) {
    Object.prototype.hasOwnProperty.call(t, _e10) && n++;
  }

  return n;
}

function gt(t, n) {
  for (var _e11 in t) {
    Object.prototype.hasOwnProperty.call(t, _e11) && n(_e11, t[_e11]);
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Provides a set of fields that can be used to partially patch a document.
 * FieldMask is used in conjunction with ObjectValue.
 * Examples:
 *   foo - Overwrites foo entirely with the provided value. If foo is not
 *         present in the companion ObjectValue, the field is deleted.
 *   foo.bar - Overwrites only the field bar of the object foo.
 *             If foo is not an object, foo is replaced with an object
 *             containing foo
 */


var bt = /*#__PURE__*/function () {
  function bt(t) {
    _classCallCheck(this, bt);

    this.fields = t, // TODO(dimond): validation of FieldMask
    // Sort the field mask to support `FieldMask.isEqual()` and assert below.
    t.sort(J.comparator);
  }
  /**
   * Verifies that `fieldPath` is included by at least one field in this field
   * mask.
   *
   * This is an O(n) operation, where `n` is the size of the field mask.
   */


  _createClass(bt, [{
    key: "covers",
    value: function covers(t) {
      var _iterator = _createForOfIteratorHelper(this.fields),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _n10 = _step.value;
          if (_n10.isPrefixOf(t)) return !0;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return !1;
    }
  }, {
    key: "isEqual",
    value: function isEqual(t) {
      return mt(this.fields, t.fields, function (t, n) {
        return t.isEqual(n);
      });
    }
  }]);

  return bt;
}();
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/** Converts a Base64 encoded string to a binary string. */

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Immutable class that represents a "proto" byte string.
 *
 * Proto byte strings can either be Base64-encoded strings or Uint8Arrays when
 * sent on the wire. This class abstracts away this differentiation by holding
 * the proto byte string in a common class that must be converted into a string
 * before being sent as a proto.
 * @internal
 */


var vt = /*#__PURE__*/function () {
  function vt(t) {
    _classCallCheck(this, vt);

    this.binaryString = t;
  }

  _createClass(vt, [{
    key: "toBase64",
    value: function toBase64() {
      return t = this.binaryString, btoa(t);
      /** Converts a binary string to a Base64 encoded string. */

      var t;
    }
  }, {
    key: "toUint8Array",
    value: function toUint8Array() {
      return function (t) {
        var n = new Uint8Array(t.length);

        for (var _e12 = 0; _e12 < t.length; _e12++) {
          n[_e12] = t.charCodeAt(_e12);
        }

        return n;
      }
      /**
      * @license
      * Copyright 2020 Google LLC
      *
      * Licensed under the Apache License, Version 2.0 (the "License");
      * you may not use this file except in compliance with the License.
      * You may obtain a copy of the License at
      *
      *   http://www.apache.org/licenses/LICENSE-2.0
      *
      * Unless required by applicable law or agreed to in writing, software
      * distributed under the License is distributed on an "AS IS" BASIS,
      * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
      * See the License for the specific language governing permissions and
      * limitations under the License.
      */
      // A RegExp matching ISO 8601 UTC timestamps with optional fraction.
      (this.binaryString);
    }
  }, {
    key: "approximateByteSize",
    value: function approximateByteSize() {
      return 2 * this.binaryString.length;
    }
  }, {
    key: "compareTo",
    value: function compareTo(t) {
      return wt(this.binaryString, t.binaryString);
    }
  }, {
    key: "isEqual",
    value: function isEqual(t) {
      return this.binaryString === t.binaryString;
    }
  }], [{
    key: "fromBase64String",
    value: function fromBase64String(t) {
      var n = atob(t);
      return new vt(n);
    }
  }, {
    key: "fromUint8Array",
    value: function fromUint8Array(t) {
      var n =
      /**
      * Helper function to convert an Uint8array to a binary string.
      */
      function (t) {
        var n = "";

        for (var _e13 = 0; _e13 < t.length; ++_e13) {
          n += String.fromCharCode(t[_e13]);
        }

        return n;
      }
      /**
      * Helper function to convert a binary string to an Uint8Array.
      */
      (t);

      return new vt(n);
    }
  }]);

  return vt;
}();

vt.EMPTY_BYTE_STRING = new vt("");
var Et = new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);
/**
 * Converts the possible Proto values for a timestamp value into a "seconds and
 * nanos" representation.
 */

function It(t) {
  // The json interface (for the browser) will return an iso timestamp string,
  // while the proto js library (for node) will return a
  // google.protobuf.Timestamp instance.
  if (g(!!t), "string" == typeof t) {
    // The date string can have higher precision (nanos) than the Date class
    // (millis), so we do some custom parsing here.
    // Parse the nanos right out of the string.
    var _n11 = 0;

    var _e14 = Et.exec(t);

    if (g(!!_e14), _e14[1]) {
      // Pad the fraction out to 9 digits (nanos).
      var _t3 = _e14[1];
      _t3 = (_t3 + "000000000").substr(0, 9), _n11 = Number(_t3);
    } // Parse the date to get the seconds.


    var _r4 = new Date(t);

    return {
      seconds: Math.floor(_r4.getTime() / 1e3),
      nanos: _n11
    };
  }

  return {
    seconds: Tt(t.seconds),
    nanos: Tt(t.nanos)
  };
}
/**
 * Converts the possible Proto types for numbers into a JavaScript number.
 * Returns 0 if the value is not numeric.
 */


function Tt(t) {
  // TODO(bjornick): Handle int64 greater than 53 bits.
  return "number" == typeof t ? t : "string" == typeof t ? Number(t) : 0;
}
/** Converts the possible Proto types for Blobs into a ByteString. */


function At(t) {
  return "string" == typeof t ? vt.fromBase64String(t) : vt.fromUint8Array(t);
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Represents a locally-applied ServerTimestamp.
 *
 * Server Timestamps are backed by MapValues that contain an internal field
 * `__type__` with a value of `server_timestamp`. The previous value and local
 * write time are stored in its `__previous_value__` and `__local_write_time__`
 * fields respectively.
 *
 * Notes:
 * - ServerTimestampValue instances are created as the result of applying a
 *   transform. They can only exist in the local view of a document. Therefore
 *   they do not need to be parsed or serialized.
 * - When evaluated locally (e.g. for snapshot.data()), they by default
 *   evaluate to `null`. This behavior can be configured by passing custom
 *   FieldValueOptions to value().
 * - With respect to other ServerTimestampValues, they sort by their
 *   localWriteTime.
 */


function Pt(t) {
  var n, e;
  return "server_timestamp" === (null === (e = ((null === (n = null == t ? void 0 : t.mapValue) || void 0 === n ? void 0 : n.fields) || {}).__type__) || void 0 === e ? void 0 : e.stringValue);
}
/**
 * Returns the value of the field before this ServerTimestamp was set.
 *
 * Preserving the previous values allows the user to display the last resoled
 * value until the backend responds with the timestamp.
 */


function Rt(t) {
  var n = t.mapValue.fields.__previous_value__;
  return Pt(n) ? Rt(n) : n;
}
/**
 * Returns the local time at which this timestamp was first set.
 */


function Vt(t) {
  var n = It(t.mapValue.fields.__local_write_time__.timestampValue);
  return new pt(n.seconds, n.nanos);
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/** Extracts the backend's type order for the provided value. */


function Nt(t) {
  return "nullValue" in t ? 0
  /* NullValue */
  : "booleanValue" in t ? 1
  /* BooleanValue */
  : "integerValue" in t || "doubleValue" in t ? 2
  /* NumberValue */
  : "timestampValue" in t ? 3
  /* TimestampValue */
  : "stringValue" in t ? 5
  /* StringValue */
  : "bytesValue" in t ? 6
  /* BlobValue */
  : "referenceValue" in t ? 7
  /* RefValue */
  : "geoPointValue" in t ? 8
  /* GeoPointValue */
  : "arrayValue" in t ? 9
  /* ArrayValue */
  : "mapValue" in t ? Pt(t) ? 4
  /* ServerTimestampValue */
  : 10
  /* ObjectValue */
  : _();
}
/** Tests `left` and `right` for equality based on the backend semantics. */


function Dt(t, n) {
  var e = Nt(t);
  if (e !== Nt(n)) return !1;

  switch (e) {
    case 0
    /* NullValue */
    :
      return !0;

    case 1
    /* BooleanValue */
    :
      return t.booleanValue === n.booleanValue;

    case 4
    /* ServerTimestampValue */
    :
      return Vt(t).isEqual(Vt(n));

    case 3
    /* TimestampValue */
    :
      return function (t, n) {
        if ("string" == typeof t.timestampValue && "string" == typeof n.timestampValue && t.timestampValue.length === n.timestampValue.length) // Use string equality for ISO 8601 timestamps
          return t.timestampValue === n.timestampValue;
        var e = It(t.timestampValue),
            r = It(n.timestampValue);
        return e.seconds === r.seconds && e.nanos === r.nanos;
      }(t, n);

    case 5
    /* StringValue */
    :
      return t.stringValue === n.stringValue;

    case 6
    /* BlobValue */
    :
      return function (t, n) {
        return At(t.bytesValue).isEqual(At(n.bytesValue));
      }(t, n);

    case 7
    /* RefValue */
    :
      return t.referenceValue === n.referenceValue;

    case 8
    /* GeoPointValue */
    :
      return function (t, n) {
        return Tt(t.geoPointValue.latitude) === Tt(n.geoPointValue.latitude) && Tt(t.geoPointValue.longitude) === Tt(n.geoPointValue.longitude);
      }(t, n);

    case 2
    /* NumberValue */
    :
      return function (t, n) {
        if ("integerValue" in t && "integerValue" in n) return Tt(t.integerValue) === Tt(n.integerValue);

        if ("doubleValue" in t && "doubleValue" in n) {
          var _e15 = Tt(t.doubleValue),
              _r5 = Tt(n.doubleValue);

          return _e15 === _r5 ? ot(_e15) === ot(_r5) : isNaN(_e15) && isNaN(_r5);
        }

        return !1;
      }(t, n);

    case 9
    /* ArrayValue */
    :
      return mt(t.arrayValue.values || [], n.arrayValue.values || [], Dt);

    case 10
    /* ObjectValue */
    :
      return function (t, n) {
        var e = t.mapValue.fields || {},
            r = n.mapValue.fields || {};
        if (_t(e) !== _t(r)) return !1;

        for (var _t4 in e) {
          if (e.hasOwnProperty(_t4) && (void 0 === r[_t4] || !Dt(e[_t4], r[_t4]))) return !1;
        }

        return !0;
      }
      /** Returns true if the ArrayValue contains the specified element. */
      (t, n);

    default:
      return _();
  }
}

function $t(t, n) {
  return void 0 !== (t.values || []).find(function (t) {
    return Dt(t, n);
  });
}

function Ft(t, n) {
  var e = Nt(t),
      r = Nt(n);
  if (e !== r) return wt(e, r);

  switch (e) {
    case 0
    /* NullValue */
    :
      return 0;

    case 1
    /* BooleanValue */
    :
      return wt(t.booleanValue, n.booleanValue);

    case 2
    /* NumberValue */
    :
      return function (t, n) {
        var e = Tt(t.integerValue || t.doubleValue),
            r = Tt(n.integerValue || n.doubleValue);
        return e < r ? -1 : e > r ? 1 : e === r ? 0 : // one or both are NaN.
        isNaN(e) ? isNaN(r) ? 0 : -1 : 1;
      }(t, n);

    case 3
    /* TimestampValue */
    :
      return St(t.timestampValue, n.timestampValue);

    case 4
    /* ServerTimestampValue */
    :
      return St(Vt(t), Vt(n));

    case 5
    /* StringValue */
    :
      return wt(t.stringValue, n.stringValue);

    case 6
    /* BlobValue */
    :
      return function (t, n) {
        var e = At(t),
            r = At(n);
        return e.compareTo(r);
      }(t.bytesValue, n.bytesValue);

    case 7
    /* RefValue */
    :
      return function (t, n) {
        var e = t.split("/"),
            r = n.split("/");

        for (var _t5 = 0; _t5 < e.length && _t5 < r.length; _t5++) {
          var _n12 = wt(e[_t5], r[_t5]);

          if (0 !== _n12) return _n12;
        }

        return wt(e.length, r.length);
      }(t.referenceValue, n.referenceValue);

    case 8
    /* GeoPointValue */
    :
      return function (t, n) {
        var e = wt(Tt(t.latitude), Tt(n.latitude));
        if (0 !== e) return e;
        return wt(Tt(t.longitude), Tt(n.longitude));
      }(t.geoPointValue, n.geoPointValue);

    case 9
    /* ArrayValue */
    :
      return function (t, n) {
        var e = t.values || [],
            r = n.values || [];

        for (var _t6 = 0; _t6 < e.length && _t6 < r.length; ++_t6) {
          var _n13 = Ft(e[_t6], r[_t6]);

          if (_n13) return _n13;
        }

        return wt(e.length, r.length);
      }(t.arrayValue, n.arrayValue);

    case 10
    /* ObjectValue */
    :
      return function (t, n) {
        var e = t.fields || {},
            r = Object.keys(e),
            s = n.fields || {},
            i = Object.keys(s); // Even though MapValues are likely sorted correctly based on their insertion
        // order (e.g. when received from the backend), local modifications can bring
        // elements out of order. We need to re-sort the elements to ensure that
        // canonical IDs are independent of insertion order.

        r.sort(), i.sort();

        for (var _t7 = 0; _t7 < r.length && _t7 < i.length; ++_t7) {
          var _n14 = wt(r[_t7], i[_t7]);

          if (0 !== _n14) return _n14;

          var _o = Ft(e[r[_t7]], s[i[_t7]]);

          if (0 !== _o) return _o;
        }

        return wt(r.length, i.length);
      }
      /** Returns a reference value for the provided database and key. */
      (t.mapValue, n.mapValue);

    default:
      throw _();
  }
}

function St(t, n) {
  if ("string" == typeof t && "string" == typeof n && t.length === n.length) return wt(t, n);
  var e = It(t),
      r = It(n),
      s = wt(e.seconds, r.seconds);
  return 0 !== s ? s : wt(e.nanos, r.nanos);
}

function qt(t, n) {
  return {
    referenceValue: "projects/".concat(t.projectId, "/databases/").concat(t.database, "/documents/").concat(n.path.canonicalString())
  };
}
/** Returns true if `value` is an ArrayValue. */


function xt(t) {
  return !!t && "arrayValue" in t;
}
/** Returns true if `value` is a NullValue. */


function Ot(t) {
  return !!t && "nullValue" in t;
}
/** Returns true if `value` is NaN. */


function Ct(t) {
  return !!t && "doubleValue" in t && isNaN(Number(t.doubleValue));
}
/** Returns true if `value` is a MapValue. */


function Lt(t) {
  return !!t && "mapValue" in t;
}
/** Creates a deep copy of `source`. */


function Ut(t) {
  if (t.geoPointValue) return {
    geoPointValue: Object.assign({}, t.geoPointValue)
  };
  if (t.timestampValue && "object" == _typeof(t.timestampValue)) return {
    timestampValue: Object.assign({}, t.timestampValue)
  };

  if (t.mapValue) {
    var _n15 = {
      mapValue: {
        fields: {}
      }
    };
    return gt(t.mapValue.fields, function (t, e) {
      return _n15.mapValue.fields[t] = Ut(e);
    }), _n15;
  }

  if (t.arrayValue) {
    var _n16 = {
      arrayValue: {
        values: []
      }
    };

    for (var _e16 = 0; _e16 < (t.arrayValue.values || []).length; ++_e16) {
      _n16.arrayValue.values[_e16] = Ut(t.arrayValue.values[_e16]);
    }

    return _n16;
  }

  return Object.assign({}, t);
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * An ObjectValue represents a MapValue in the Firestore Proto and offers the
 * ability to add and remove fields (via the ObjectValueBuilder).
 */


var jt = /*#__PURE__*/function () {
  function jt(t) {
    _classCallCheck(this, jt);

    this.value = t;
  }

  _createClass(jt, [{
    key: "field",
    value:
    /**
     * Returns the value at the given path or null.
     *
     * @param path - the path to search
     * @returns The value at the path or null if the path is not set.
     */
    function field(t) {
      if (t.isEmpty()) return this.value;
      {
        var _n17 = this.value;

        for (var _e17 = 0; _e17 < t.length - 1; ++_e17) {
          if (_n17 = (_n17.mapValue.fields || {})[t.get(_e17)], !Lt(_n17)) return null;
        }

        return _n17 = (_n17.mapValue.fields || {})[t.lastSegment()], _n17 || null;
      }
    }
    /**
     * Sets the field to the provided value.
     *
     * @param path - The field path to set.
     * @param value - The value to set.
     */

  }, {
    key: "set",
    value: function set(t, n) {
      this.getFieldsMap(t.popLast())[t.lastSegment()] = Ut(n);
    }
    /**
     * Sets the provided fields to the provided values.
     *
     * @param data - A map of fields to values (or null for deletes).
     */

  }, {
    key: "setAll",
    value: function setAll(t) {
      var _this7 = this;

      var n = J.emptyPath(),
          e = {},
          r = [];
      t.forEach(function (t, s) {
        if (!n.isImmediateParentOf(s)) {
          // Insert the accumulated changes at this parent location
          var _t8 = _this7.getFieldsMap(n);

          _this7.applyChanges(_t8, e, r), e = {}, r = [], n = s.popLast();
        }

        t ? e[s.lastSegment()] = Ut(t) : r.push(s.lastSegment());
      });
      var s = this.getFieldsMap(n);
      this.applyChanges(s, e, r);
    }
    /**
     * Removes the field at the specified path. If there is no field at the
     * specified path, nothing is changed.
     *
     * @param path - The field path to remove.
     */

  }, {
    key: "delete",
    value: function _delete(t) {
      var n = this.field(t.popLast());
      Lt(n) && n.mapValue.fields && delete n.mapValue.fields[t.lastSegment()];
    }
  }, {
    key: "isEqual",
    value: function isEqual(t) {
      return Dt(this.value, t.value);
    }
    /**
     * Returns the map that contains the leaf element of `path`. If the parent
     * entry does not yet exist, or if it is not a map, a new map will be created.
     */

  }, {
    key: "getFieldsMap",
    value: function getFieldsMap(t) {
      var n = this.value;
      n.mapValue.fields || (n.mapValue = {
        fields: {}
      });

      for (var _e18 = 0; _e18 < t.length; ++_e18) {
        var _r6 = n.mapValue.fields[t.get(_e18)];
        Lt(_r6) && _r6.mapValue.fields || (_r6 = {
          mapValue: {
            fields: {}
          }
        }, n.mapValue.fields[t.get(_e18)] = _r6), n = _r6;
      }

      return n.mapValue.fields;
    }
    /**
     * Modifies `fieldsMap` by adding, replacing or deleting the specified
     * entries.
     */

  }, {
    key: "applyChanges",
    value: function applyChanges(t, n, e) {
      gt(n, function (n, e) {
        return t[n] = e;
      });

      var _iterator2 = _createForOfIteratorHelper(e),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _n18 = _step2.value;
          delete t[_n18];
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  }, {
    key: "clone",
    value: function clone() {
      return new jt(Ut(this.value));
    }
  }], [{
    key: "empty",
    value: function empty() {
      return new jt({
        mapValue: {}
      });
    }
  }]);

  return jt;
}();
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Represents a document in Firestore with a key, version, data and whether it
 * has local mutations applied to it.
 *
 * Documents can transition between states via `convertToFoundDocument()`,
 * `convertToNoDocument()` and `convertToUnknownDocument()`. If a document does
 * not transition to one of these states even after all mutations have been
 * applied, `isValidDocument()` returns false and the document should be removed
 * from all views.
 */


var kt = /*#__PURE__*/function () {
  function kt(t, n, e, r, s) {
    _classCallCheck(this, kt);

    this.key = t, this.documentType = n, this.version = e, this.data = r, this.documentState = s;
  }
  /**
   * Creates a document with no known version or data, but which can serve as
   * base document for mutations.
   */


  _createClass(kt, [{
    key: "convertToFoundDocument",
    value:
    /**
     * Changes the document type to indicate that it exists and that its version
     * and data are known.
     */
    function convertToFoundDocument(t, n) {
      return this.version = t, this.documentType = 1
      /* FOUND_DOCUMENT */
      , this.data = n, this.documentState = 0
      /* SYNCED */
      , this;
    }
    /**
     * Changes the document type to indicate that it doesn't exist at the given
     * version.
     */

  }, {
    key: "convertToNoDocument",
    value: function convertToNoDocument(t) {
      return this.version = t, this.documentType = 2
      /* NO_DOCUMENT */
      , this.data = jt.empty(), this.documentState = 0
      /* SYNCED */
      , this;
    }
    /**
     * Changes the document type to indicate that it exists at a given version but
     * that its data is not known (e.g. a document that was updated without a known
     * base document).
     */

  }, {
    key: "convertToUnknownDocument",
    value: function convertToUnknownDocument(t) {
      return this.version = t, this.documentType = 3
      /* UNKNOWN_DOCUMENT */
      , this.data = jt.empty(), this.documentState = 2
      /* HAS_COMMITTED_MUTATIONS */
      , this;
    }
  }, {
    key: "setHasCommittedMutations",
    value: function setHasCommittedMutations() {
      return this.documentState = 2
      /* HAS_COMMITTED_MUTATIONS */
      , this;
    }
  }, {
    key: "setHasLocalMutations",
    value: function setHasLocalMutations() {
      return this.documentState = 1
      /* HAS_LOCAL_MUTATIONS */
      , this;
    }
  }, {
    key: "hasLocalMutations",
    get: function get() {
      return 1
      /* HAS_LOCAL_MUTATIONS */
      === this.documentState;
    }
  }, {
    key: "hasCommittedMutations",
    get: function get() {
      return 2
      /* HAS_COMMITTED_MUTATIONS */
      === this.documentState;
    }
  }, {
    key: "hasPendingWrites",
    get: function get() {
      return this.hasLocalMutations || this.hasCommittedMutations;
    }
  }, {
    key: "isValidDocument",
    value: function isValidDocument() {
      return 0
      /* INVALID */
      !== this.documentType;
    }
  }, {
    key: "isFoundDocument",
    value: function isFoundDocument() {
      return 1
      /* FOUND_DOCUMENT */
      === this.documentType;
    }
  }, {
    key: "isNoDocument",
    value: function isNoDocument() {
      return 2
      /* NO_DOCUMENT */
      === this.documentType;
    }
  }, {
    key: "isUnknownDocument",
    value: function isUnknownDocument() {
      return 3
      /* UNKNOWN_DOCUMENT */
      === this.documentType;
    }
  }, {
    key: "isEqual",
    value: function isEqual(t) {
      return t instanceof kt && this.key.isEqual(t.key) && this.version.isEqual(t.version) && this.documentType === t.documentType && this.documentState === t.documentState && this.data.isEqual(t.data);
    }
  }, {
    key: "clone",
    value: function clone() {
      return new kt(this.key, this.documentType, this.version, this.data.clone(), this.documentState);
    }
  }, {
    key: "toString",
    value: function toString() {
      return "Document(".concat(this.key, ", ").concat(this.version, ", ").concat(JSON.stringify(this.data.value), ", {documentType: ").concat(this.documentType, "}), {documentState: ").concat(this.documentState, "})");
    }
  }], [{
    key: "newInvalidDocument",
    value: function newInvalidDocument(t) {
      return new kt(t, 0
      /* INVALID */
      , yt.min(), jt.empty(), 0
      /* SYNCED */
      );
    }
    /**
     * Creates a new document that is known to exist with the given data at the
     * given version.
     */

  }, {
    key: "newFoundDocument",
    value: function newFoundDocument(t, n, e) {
      return new kt(t, 1
      /* FOUND_DOCUMENT */
      , n, e, 0
      /* SYNCED */
      );
    }
    /** Creates a new document that is known to not exist at the given version. */

  }, {
    key: "newNoDocument",
    value: function newNoDocument(t, n) {
      return new kt(t, 2
      /* NO_DOCUMENT */
      , n, jt.empty(), 0
      /* SYNCED */
      );
    }
    /**
     * Creates a new document that is known to exist at the given version but
     * whose data is not known (e.g. a document that was updated without a known
     * base document).
     */

  }, {
    key: "newUnknownDocument",
    value: function newUnknownDocument(t, n) {
      return new kt(t, 3
      /* UNKNOWN_DOCUMENT */
      , n, jt.empty(), 2
      /* HAS_COMMITTED_MUTATIONS */
      );
    }
  }]);

  return kt;
}();
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// Visible for testing


var Mt = function Mt(t) {
  var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var e = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var r = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
  var s = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
  var i = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
  var o = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : null;

  _classCallCheck(this, Mt);

  this.path = t, this.collectionGroup = n, this.orderBy = e, this.filters = r, this.limit = s, this.startAt = i, this.endAt = o, this.P = null;
};
/**
 * Initializes a Target with a path and optional additional query constraints.
 * Path must currently be empty if this is a collection group query.
 *
 * NOTE: you should always construct `Target` from `Query.toTarget` instead of
 * using this factory method, because `Query` provides an implicit `orderBy`
 * property.
 */


function Bt(t) {
  var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var e = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var r = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
  var s = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
  var i = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
  var o = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : null;
  return new Mt(t, n, e, r, s, i, o);
}

var Qt = /*#__PURE__*/function (_ref2) {
  _inherits(Qt, _ref2);

  var _super5 = _createSuper(Qt);

  function Qt(t, n, e) {
    var _this8;

    _classCallCheck(this, Qt);

    _this8 = _super5.call(this), _this8.field = t, _this8.op = n, _this8.value = e;
    return _this8;
  }
  /**
   * Creates a filter based on the provided arguments.
   */


  _createClass(Qt, [{
    key: "matches",
    value: function matches(t) {
      var n = t.data.field(this.field); // Types do not have to match in NOT_EQUAL filters.

      return "!="
      /* NOT_EQUAL */
      === this.op ? null !== n && this.V(Ft(n, this.value)) : null !== n && Nt(this.value) === Nt(n) && this.V(Ft(n, this.value)); // Only compare types with matching backend order (such as double and int).
    }
  }, {
    key: "V",
    value: function V(t) {
      switch (this.op) {
        case "<"
        /* LESS_THAN */
        :
          return t < 0;

        case "<="
        /* LESS_THAN_OR_EQUAL */
        :
          return t <= 0;

        case "=="
        /* EQUAL */
        :
          return 0 === t;

        case "!="
        /* NOT_EQUAL */
        :
          return 0 !== t;

        case ">"
        /* GREATER_THAN */
        :
          return t > 0;

        case ">="
        /* GREATER_THAN_OR_EQUAL */
        :
          return t >= 0;

        default:
          return _();
      }
    }
  }, {
    key: "N",
    value: function N() {
      return ["<"
      /* LESS_THAN */
      , "<="
      /* LESS_THAN_OR_EQUAL */
      , ">"
      /* GREATER_THAN */
      , ">="
      /* GREATER_THAN_OR_EQUAL */
      , "!="
      /* NOT_EQUAL */
      , "not-in"
      /* NOT_IN */
      ].indexOf(this.op) >= 0;
    }
  }], [{
    key: "create",
    value: function create(t, n, e) {
      return t.isKeyField() ? "in"
      /* IN */
      === n || "not-in"
      /* NOT_IN */
      === n ? this.R(t, n, e) : new zt(t, n, e) : "array-contains"
      /* ARRAY_CONTAINS */
      === n ? new Yt(t, e) : "in"
      /* IN */
      === n ? new Kt(t, e) : "not-in"
      /* NOT_IN */
      === n ? new Jt(t, e) : "array-contains-any"
      /* ARRAY_CONTAINS_ANY */
      === n ? new Zt(t, e) : new Qt(t, n, e);
    }
  }, {
    key: "R",
    value: function R(t, n, e) {
      return "in"
      /* IN */
      === n ? new Wt(t, e) : new Gt(t, e);
    }
  }]);

  return Qt;
}( /*#__PURE__*/function () {
  function _class2() {
    _classCallCheck(this, _class2);
  }

  return _class2;
}());
/** Filter that matches on key fields (i.e. '__name__'). */


var zt = /*#__PURE__*/function (_Qt) {
  _inherits(zt, _Qt);

  var _super6 = _createSuper(zt);

  function zt(t, n, e) {
    var _this9;

    _classCallCheck(this, zt);

    _this9 = _super6.call(this, t, n, e), _this9.key = Z.fromName(e.referenceValue);
    return _this9;
  }

  _createClass(zt, [{
    key: "matches",
    value: function matches(t) {
      var n = Z.comparator(t.key, this.key);
      return this.V(n);
    }
  }]);

  return zt;
}(Qt);
/** Filter that matches on key fields within an array. */


var Wt = /*#__PURE__*/function (_Qt2) {
  _inherits(Wt, _Qt2);

  var _super7 = _createSuper(Wt);

  function Wt(t, n) {
    var _this10;

    _classCallCheck(this, Wt);

    _this10 = _super7.call(this, t, "in"
    /* IN */
    , n), _this10.keys = Ht("in"
    /* IN */
    , n);
    return _this10;
  }

  _createClass(Wt, [{
    key: "matches",
    value: function matches(t) {
      return this.keys.some(function (n) {
        return n.isEqual(t.key);
      });
    }
  }]);

  return Wt;
}(Qt);
/** Filter that matches on key fields not present within an array. */


var Gt = /*#__PURE__*/function (_Qt3) {
  _inherits(Gt, _Qt3);

  var _super8 = _createSuper(Gt);

  function Gt(t, n) {
    var _this11;

    _classCallCheck(this, Gt);

    _this11 = _super8.call(this, t, "not-in"
    /* NOT_IN */
    , n), _this11.keys = Ht("not-in"
    /* NOT_IN */
    , n);
    return _this11;
  }

  _createClass(Gt, [{
    key: "matches",
    value: function matches(t) {
      return !this.keys.some(function (n) {
        return n.isEqual(t.key);
      });
    }
  }]);

  return Gt;
}(Qt);

function Ht(t, n) {
  var e;
  return ((null === (e = n.arrayValue) || void 0 === e ? void 0 : e.values) || []).map(function (t) {
    return Z.fromName(t.referenceValue);
  });
}
/** A Filter that implements the array-contains operator. */


var Yt = /*#__PURE__*/function (_Qt4) {
  _inherits(Yt, _Qt4);

  var _super9 = _createSuper(Yt);

  function Yt(t, n) {
    _classCallCheck(this, Yt);

    return _super9.call(this, t, "array-contains"
    /* ARRAY_CONTAINS */
    , n);
  }

  _createClass(Yt, [{
    key: "matches",
    value: function matches(t) {
      var n = t.data.field(this.field);
      return xt(n) && $t(n.arrayValue, this.value);
    }
  }]);

  return Yt;
}(Qt);
/** A Filter that implements the IN operator. */


var Kt = /*#__PURE__*/function (_Qt5) {
  _inherits(Kt, _Qt5);

  var _super10 = _createSuper(Kt);

  function Kt(t, n) {
    _classCallCheck(this, Kt);

    return _super10.call(this, t, "in"
    /* IN */
    , n);
  }

  _createClass(Kt, [{
    key: "matches",
    value: function matches(t) {
      var n = t.data.field(this.field);
      return null !== n && $t(this.value.arrayValue, n);
    }
  }]);

  return Kt;
}(Qt);
/** A Filter that implements the not-in operator. */


var Jt = /*#__PURE__*/function (_Qt6) {
  _inherits(Jt, _Qt6);

  var _super11 = _createSuper(Jt);

  function Jt(t, n) {
    _classCallCheck(this, Jt);

    return _super11.call(this, t, "not-in"
    /* NOT_IN */
    , n);
  }

  _createClass(Jt, [{
    key: "matches",
    value: function matches(t) {
      if ($t(this.value.arrayValue, {
        nullValue: "NULL_VALUE"
      })) return !1;
      var n = t.data.field(this.field);
      return null !== n && !$t(this.value.arrayValue, n);
    }
  }]);

  return Jt;
}(Qt);
/** A Filter that implements the array-contains-any operator. */


var Zt = /*#__PURE__*/function (_Qt7) {
  _inherits(Zt, _Qt7);

  var _super12 = _createSuper(Zt);

  function Zt(t, n) {
    _classCallCheck(this, Zt);

    return _super12.call(this, t, "array-contains-any"
    /* ARRAY_CONTAINS_ANY */
    , n);
  }

  _createClass(Zt, [{
    key: "matches",
    value: function matches(t) {
      var _this12 = this;

      var n = t.data.field(this.field);
      return !(!xt(n) || !n.arrayValue.values) && n.arrayValue.values.some(function (t) {
        return $t(_this12.value.arrayValue, t);
      });
    }
  }]);

  return Zt;
}(Qt);
/**
 * Represents a bound of a query.
 *
 * The bound is specified with the given components representing a position and
 * whether it's just before or just after the position (relative to whatever the
 * query order is).
 *
 * The position represents a logical index position for a query. It's a prefix
 * of values for the (potentially implicit) order by clauses of a query.
 *
 * Bound provides a function to determine whether a document comes before or
 * after a bound. This is influenced by whether the position is just before or
 * just after the provided values.
 */


var Xt = function Xt(t, n) {
  _classCallCheck(this, Xt);

  this.position = t, this.before = n;
};
/**
 * An ordering on a field, in some Direction. Direction defaults to ASCENDING.
 */


var tn = function tn(t) {
  var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "asc";

  _classCallCheck(this, tn);

  this.field = t, this.dir = n;
};

function nn(t, n) {
  return t.dir === n.dir && t.field.isEqual(n.field);
}

function en(t, n) {
  if (null === t) return null === n;
  if (null === n) return !1;
  if (t.before !== n.before || t.position.length !== n.position.length) return !1;

  for (var _e19 = 0; _e19 < t.position.length; _e19++) {
    if (!Dt(t.position[_e19], n.position[_e19])) return !1;
  }

  return !0;
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Query encapsulates all the query attributes we support in the SDK. It can
 * be run against the LocalStore, as well as be converted to a `Target` to
 * query the RemoteStore results.
 *
 * Visible for testing.
 */


var rn =
/**
 * Initializes a Query with a path and optional additional query constraints.
 * Path must currently be empty if this is a collection group query.
 */
function rn(t) {
  var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var e = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var r = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
  var s = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
  var i = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "F";
  var o = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : null;
  var u = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : null;

  _classCallCheck(this, rn);

  this.path = t, this.collectionGroup = n, this.explicitOrderBy = e, this.filters = r, this.limit = s, this.limitType = i, this.startAt = o, this.endAt = u, this.D = null, // The corresponding `Target` of this `Query` instance.
  this.$ = null, this.startAt, this.endAt;
};
/** Creates a new Query for a query that matches all documents at `path` */


function sn(t) {
  return !it(t.limit) && "L"
  /* Last */
  === t.limitType;
}

function on(t) {
  return t.explicitOrderBy.length > 0 ? t.explicitOrderBy[0].field : null;
}

function un(t) {
  var _iterator3 = _createForOfIteratorHelper(t.filters),
      _step3;

  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var _n19 = _step3.value;
      if (_n19.N()) return _n19.field;
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }

  return null;
}
/**
 * Checks if any of the provided Operators are included in the query and
 * returns the first one that is, or null if none are.
 */

/**
 * Returns whether the query matches a collection group rather than a specific
 * collection.
 */


function cn(t) {
  return null !== t.collectionGroup;
}
/**
 * Returns the implicit order by constraint that is used to execute the Query,
 * which can be different from the order by constraints the user provided (e.g.
 * the SDK and backend always orders by `__name__`).
 */


function an(t) {
  var n = b(t);

  if (null === n.D) {
    n.D = [];

    var _t9 = un(n),
        _e20 = on(n);

    if (null !== _t9 && null === _e20) // In order to implicitly add key ordering, we must also add the
      // inequality filter field for it to be a valid query.
      // Note that the default inequality field and key ordering is ascending.
      _t9.isKeyField() || n.D.push(new tn(_t9)), n.D.push(new tn(J.keyField(), "asc"
      /* ASCENDING */
      ));else {
      var _t10 = !1;

      var _iterator4 = _createForOfIteratorHelper(n.explicitOrderBy),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var _e21 = _step4.value;
          n.D.push(_e21), _e21.field.isKeyField() && (_t10 = !0);
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }

      if (!_t10) {
        // The order of the implicit key ordering always matches the last
        // explicit order by
        var _t11 = n.explicitOrderBy.length > 0 ? n.explicitOrderBy[n.explicitOrderBy.length - 1].dir : "asc"
        /* ASCENDING */
        ;

        n.D.push(new tn(J.keyField(), _t11));
      }
    }
  }

  return n.D;
}
/**
 * Converts this `Query` instance to it's corresponding `Target` representation.
 */


function hn(t) {
  var n = b(t);
  if (!n.$) if ("F"
  /* First */
  === n.limitType) n.$ = Bt(n.path, n.collectionGroup, an(n), n.filters, n.limit, n.startAt, n.endAt);else {
    // Flip the orderBy directions since we want the last results
    var _t12 = [];

    var _iterator5 = _createForOfIteratorHelper(an(n)),
        _step5;

    try {
      for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
        var _e23 = _step5.value;

        var _n20 = "desc"
        /* DESCENDING */
        === _e23.dir ? "asc"
        /* ASCENDING */
        : "desc"
        /* DESCENDING */
        ;

        _t12.push(new tn(_e23.field, _n20));
      } // We need to swap the cursors to match the now-flipped query ordering.

    } catch (err) {
      _iterator5.e(err);
    } finally {
      _iterator5.f();
    }

    var _e22 = n.endAt ? new Xt(n.endAt.position, !n.endAt.before) : null,
        _r7 = n.startAt ? new Xt(n.startAt.position, !n.startAt.before) : null; // Now return as a LimitType.First query.


    n.$ = Bt(n.path, n.collectionGroup, _t12, n.filters, n.limit, _e22, _r7);
  }
  return n.$;
}

function ln(t, n) {
  return function (t, n) {
    if (t.limit !== n.limit) return !1;
    if (t.orderBy.length !== n.orderBy.length) return !1;

    for (var _e24 = 0; _e24 < t.orderBy.length; _e24++) {
      if (!nn(t.orderBy[_e24], n.orderBy[_e24])) return !1;
    }

    if (t.filters.length !== n.filters.length) return !1;

    for (var _s3 = 0; _s3 < t.filters.length; _s3++) {
      if (e = t.filters[_s3], r = n.filters[_s3], e.op !== r.op || !e.field.isEqual(r.field) || !Dt(e.value, r.value)) return !1;
    }

    var e, r;
    return t.collectionGroup === n.collectionGroup && !!t.path.isEqual(n.path) && !!en(t.startAt, n.startAt) && en(t.endAt, n.endAt);
  }(hn(t), hn(n)) && t.limitType === n.limitType;
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Returns an DoubleValue for `value` that is encoded based the serializer's
 * `useProto3Json` setting.
 */

/**
 * Returns a value for a number that's appropriate to put into a proto.
 * The return value is an IntegerValue if it can safely represent the value,
 * otherwise a DoubleValue is returned.
 */


function fn(t, n) {
  return function (t) {
    return "number" == typeof t && Number.isInteger(t) && !ot(t) && t <= Number.MAX_SAFE_INTEGER && t >= Number.MIN_SAFE_INTEGER;
  }(n) ?
  /**
  * Returns an IntegerValue for `value`.
  */
  function (t) {
    return {
      integerValue: "" + t
    };
  }(n) : function (t, n) {
    if (t.F) {
      if (isNaN(n)) return {
        doubleValue: "NaN"
      };
      if (n === 1 / 0) return {
        doubleValue: "Infinity"
      };
      if (n === -1 / 0) return {
        doubleValue: "-Infinity"
      };
    }

    return {
      doubleValue: ot(n) ? "-0" : n
    };
  }(t, n);
}
/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/** Used to represent a field transform on a mutation. */


var dn = function dn() {
  _classCallCheck(this, dn);

  // Make sure that the structural type of `TransformOperation` is unique.
  // See https://github.com/microsoft/TypeScript/issues/5451
  this._ = void 0;
};
/** Transforms a value into a server-generated timestamp. */


var wn = /*#__PURE__*/function (_dn) {
  _inherits(wn, _dn);

  var _super13 = _createSuper(wn);

  function wn() {
    _classCallCheck(this, wn);

    return _super13.apply(this, arguments);
  }

  return wn;
}(dn);
/** Transforms an array value via a union operation. */


var mn = /*#__PURE__*/function (_dn2) {
  _inherits(mn, _dn2);

  var _super14 = _createSuper(mn);

  function mn(t) {
    var _this13;

    _classCallCheck(this, mn);

    _this13 = _super14.call(this), _this13.elements = t;
    return _this13;
  }

  return mn;
}(dn);
/** Transforms an array value via a remove operation. */


var pn = /*#__PURE__*/function (_dn3) {
  _inherits(pn, _dn3);

  var _super15 = _createSuper(pn);

  function pn(t) {
    var _this14;

    _classCallCheck(this, pn);

    _this14 = _super15.call(this), _this14.elements = t;
    return _this14;
  }

  return pn;
}(dn);
/**
 * Implements the backend semantics for locally computed NUMERIC_ADD (increment)
 * transforms. Converts all field values to integers or doubles, but unlike the
 * backend does not cap integer values at 2^63. Instead, JavaScript number
 * arithmetic is used and precision loss can occur for values greater than 2^53.
 */


var yn = /*#__PURE__*/function (_dn4) {
  _inherits(yn, _dn4);

  var _super16 = _createSuper(yn);

  function yn(t, n) {
    var _this15;

    _classCallCheck(this, yn);

    _this15 = _super16.call(this), _this15.S = t, _this15.q = n;
    return _this15;
  }

  return yn;
}(dn);
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/** A field path and the TransformOperation to perform upon it. */


var _n = function _n(t, n) {
  _classCallCheck(this, _n);

  this.field = t, this.transform = n;
};
/**
 * Encodes a precondition for a mutation. This follows the model that the
 * backend accepts with the special case of an explicit "empty" precondition
 * (meaning no precondition).
 */


var gn = /*#__PURE__*/function () {
  function gn(t, n) {
    _classCallCheck(this, gn);

    this.updateTime = t, this.exists = n;
  }
  /** Creates a new empty Precondition. */


  _createClass(gn, [{
    key: "isNone",
    get:
    /** Returns whether this Precondition is empty. */
    function get() {
      return void 0 === this.updateTime && void 0 === this.exists;
    }
  }, {
    key: "isEqual",
    value: function isEqual(t) {
      return this.exists === t.exists && (this.updateTime ? !!t.updateTime && this.updateTime.isEqual(t.updateTime) : !t.updateTime);
    }
  }], [{
    key: "none",
    value: function none() {
      return new gn();
    }
    /** Creates a new Precondition with an exists flag. */

  }, {
    key: "exists",
    value: function exists(t) {
      return new gn(void 0, t);
    }
    /** Creates a new Precondition based on a version a document exists at. */

  }, {
    key: "updateTime",
    value: function updateTime(t) {
      return new gn(t);
    }
  }]);

  return gn;
}();
/**
 * A mutation describes a self-contained change to a document. Mutations can
 * create, replace, delete, and update subsets of documents.
 *
 * Mutations not only act on the value of the document but also its version.
 *
 * For local mutations (mutations that haven't been committed yet), we preserve
 * the existing version for Set and Patch mutations. For Delete mutations, we
 * reset the version to 0.
 *
 * Here's the expected transition table.
 *
 * MUTATION           APPLIED TO            RESULTS IN
 *
 * SetMutation        Document(v3)          Document(v3)
 * SetMutation        NoDocument(v3)        Document(v0)
 * SetMutation        InvalidDocument(v0)   Document(v0)
 * PatchMutation      Document(v3)          Document(v3)
 * PatchMutation      NoDocument(v3)        NoDocument(v3)
 * PatchMutation      InvalidDocument(v0)   UnknownDocument(v3)
 * DeleteMutation     Document(v3)          NoDocument(v0)
 * DeleteMutation     NoDocument(v3)        NoDocument(v0)
 * DeleteMutation     InvalidDocument(v0)   NoDocument(v0)
 *
 * For acknowledged mutations, we use the updateTime of the WriteResponse as
 * the resulting version for Set and Patch mutations. As deletes have no
 * explicit update time, we use the commitTime of the WriteResponse for
 * Delete mutations.
 *
 * If a mutation is acknowledged by the backend but fails the precondition check
 * locally, we transition to an `UnknownDocument` and rely on Watch to send us
 * the updated version.
 *
 * Field transforms are used only with Patch and Set Mutations. We use the
 * `updateTransforms` message to store transforms, rather than the `transforms`s
 * messages.
 *
 * ## Subclassing Notes
 *
 * Every type of mutation needs to implement its own applyToRemoteDocument() and
 * applyToLocalView() to implement the actual behavior of applying the mutation
 * to some source document (see `setMutationApplyToRemoteDocument()` for an
 * example).
 */


var bn = function bn() {
  _classCallCheck(this, bn);
};
/**
 * A mutation that creates or replaces the document at the given key with the
 * object value contents.
 */


var vn = /*#__PURE__*/function (_bn) {
  _inherits(vn, _bn);

  var _super17 = _createSuper(vn);

  function vn(t, n, e) {
    var _this16;

    var r = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

    _classCallCheck(this, vn);

    _this16 = _super17.call(this), _this16.key = t, _this16.value = n, _this16.precondition = e, _this16.fieldTransforms = r, _this16.type = 0
    /* Set */
    ;
    return _this16;
  }

  return vn;
}(bn);
/**
 * A mutation that modifies fields of the document at the given key with the
 * given values. The values are applied through a field mask:
 *
 *  * When a field is in both the mask and the values, the corresponding field
 *    is updated.
 *  * When a field is in neither the mask nor the values, the corresponding
 *    field is unmodified.
 *  * When a field is in the mask but not in the values, the corresponding field
 *    is deleted.
 *  * When a field is not in the mask but is in the values, the values map is
 *    ignored.
 */


var En = /*#__PURE__*/function (_bn2) {
  _inherits(En, _bn2);

  var _super18 = _createSuper(En);

  function En(t, n, e, r) {
    var _this17;

    var s = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];

    _classCallCheck(this, En);

    _this17 = _super18.call(this), _this17.key = t, _this17.data = n, _this17.fieldMask = e, _this17.precondition = r, _this17.fieldTransforms = s, _this17.type = 1
    /* Patch */
    ;
    return _this17;
  }

  return En;
}(bn);
/** A mutation that deletes the document at the given key. */


var In = /*#__PURE__*/function (_bn3) {
  _inherits(In, _bn3);

  var _super19 = _createSuper(In);

  function In(t, n) {
    var _this18;

    _classCallCheck(this, In);

    _this18 = _super19.call(this), _this18.key = t, _this18.precondition = n, _this18.type = 2
    /* Delete */
    , _this18.fieldTransforms = [];
    return _this18;
  }

  return In;
}(bn);
/**
 * A mutation that verifies the existence of the document at the given key with
 * the provided precondition.
 *
 * The `verify` operation is only used in Transactions, and this class serves
 * primarily to facilitate serialization into protos.
 */


var Tn = /*#__PURE__*/function (_bn4) {
  _inherits(Tn, _bn4);

  var _super20 = _createSuper(Tn);

  function Tn(t, n) {
    var _this19;

    _classCallCheck(this, Tn);

    _this19 = _super20.call(this), _this19.key = t, _this19.precondition = n, _this19.type = 3
    /* Verify */
    , _this19.fieldTransforms = [];
    return _this19;
  }

  return Tn;
}(bn);
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


var An = function () {
  var t = {
    asc: "ASCENDING",
    desc: "DESCENDING"
  };
  return t;
}(),
    Pn = function () {
  var t = {
    "<": "LESS_THAN",
    "<=": "LESS_THAN_OR_EQUAL",
    ">": "GREATER_THAN",
    ">=": "GREATER_THAN_OR_EQUAL",
    "==": "EQUAL",
    "!=": "NOT_EQUAL",
    "array-contains": "ARRAY_CONTAINS",
    in: "IN",
    "not-in": "NOT_IN",
    "array-contains-any": "ARRAY_CONTAINS_ANY"
  };
  return t;
}();
/**
 * This class generates JsonObject values for the Datastore API suitable for
 * sending to either GRPC stub methods or via the JSON/HTTP REST API.
 *
 * The serializer supports both Protobuf.js and Proto3 JSON formats. By
 * setting `useProto3Json` to true, the serializer will use the Proto3 JSON
 * format.
 *
 * For a description of the Proto3 JSON format check
 * https://developers.google.com/protocol-buffers/docs/proto3#json
 *
 * TODO(klimt): We can remove the databaseId argument if we keep the full
 * resource name in documents.
 */


var Rn = function Rn(t, n) {
  _classCallCheck(this, Rn);

  this.databaseId = t, this.F = n;
};
/**
 * Returns a value for a number (or null) that's appropriate to put into
 * a google.protobuf.Int32Value proto.
 * DO NOT USE THIS FOR ANYTHING ELSE.
 * This method cheats. It's typed as returning "number" because that's what
 * our generated proto interfaces say Int32Value must be. But GRPC actually
 * expects a { value: <number> } struct.
 */

/**
 * Returns a value for a Date that's appropriate to put into a proto.
 */


function Vn(t, n) {
  if (t.F) {
    return "".concat(new Date(1e3 * n.seconds).toISOString().replace(/\.\d*/, "").replace("Z", ""), ".").concat(("000000000" + n.nanoseconds).slice(-9), "Z");
  }

  return {
    seconds: "" + n.seconds,
    nanos: n.nanoseconds
  };
}
/**
 * Returns a value for bytes that's appropriate to put in a proto.
 *
 * Visible for testing.
 */


function Nn(t, n) {
  return t.F ? n.toBase64() : n.toUint8Array();
}

function Dn(t, n) {
  return Vn(t, n.toTimestamp());
}

function $n(t) {
  return g(!!t), yt.fromTimestamp(function (t) {
    var n = It(t);
    return new pt(n.seconds, n.nanos);
  }(t));
}

function Fn(t, n) {
  return function (t) {
    return new Y(["projects", t.projectId, "databases", t.database]);
  }(t).child("documents").child(n).canonicalString();
}

function Sn(t, n) {
  return Fn(t.databaseId, n.path);
}

function qn(t, n) {
  var e = function (t) {
    var n = Y.fromString(t);
    return g(Wn(n)), n;
  }(n);

  if (e.get(1) !== t.databaseId.projectId) throw new L(T, "Tried to deserialize key from different project: " + e.get(1) + " vs " + t.databaseId.projectId);
  if (e.get(3) !== t.databaseId.database) throw new L(T, "Tried to deserialize key from different database: " + e.get(3) + " vs " + t.databaseId.database);
  return new Z((g((r = e).length > 4 && "documents" === r.get(4)), r.popFirst(5)));
  var r;
  /** Creates a Document proto from key and fields (but no create/update time) */
}

function xn(t, n) {
  return Fn(t.databaseId, n);
}

function On(t) {
  return new Y(["projects", t.databaseId.projectId, "databases", t.databaseId.database]).canonicalString();
}

function Cn(t, n, e) {
  return {
    name: Sn(t, n),
    fields: e.value.mapValue.fields
  };
}

function Ln(t, n) {
  return "found" in n ? function (t, n) {
    g(!!n.found), n.found.name, n.found.updateTime;
    var e = qn(t, n.found.name),
        r = $n(n.found.updateTime),
        s = new jt({
      mapValue: {
        fields: n.found.fields
      }
    });
    return kt.newFoundDocument(e, r, s);
  }(t, n) : "missing" in n ? function (t, n) {
    g(!!n.missing), g(!!n.readTime);
    var e = qn(t, n.missing),
        r = $n(n.readTime);
    return kt.newNoDocument(e, r);
  }(t, n) : _();
}

function Un(t, n) {
  var e;
  if (n instanceof vn) e = {
    update: Cn(t, n.key, n.value)
  };else if (n instanceof In) e = {
    delete: Sn(t, n.key)
  };else if (n instanceof En) e = {
    update: Cn(t, n.key, n.data),
    updateMask: zn(n.fieldMask)
  };else {
    if (!(n instanceof Tn)) return _();
    e = {
      verify: Sn(t, n.key)
    };
  }
  return n.fieldTransforms.length > 0 && (e.updateTransforms = n.fieldTransforms.map(function (t) {
    return function (t, n) {
      var e = n.transform;
      if (e instanceof wn) return {
        fieldPath: n.field.canonicalString(),
        setToServerValue: "REQUEST_TIME"
      };
      if (e instanceof mn) return {
        fieldPath: n.field.canonicalString(),
        appendMissingElements: {
          values: e.elements
        }
      };
      if (e instanceof pn) return {
        fieldPath: n.field.canonicalString(),
        removeAllFromArray: {
          values: e.elements
        }
      };
      if (e instanceof yn) return {
        fieldPath: n.field.canonicalString(),
        increment: e.q
      };
      throw _();
    }(0, t);
  })), n.precondition.isNone || (e.currentDocument = function (t, n) {
    return void 0 !== n.updateTime ? {
      updateTime: Dn(t, n.updateTime)
    } : void 0 !== n.exists ? {
      exists: n.exists
    } : _();
  }(t, n.precondition)), e;
}

function jn(t, n) {
  // Dissect the path into parent, collectionId, and optional key filter.
  var e = {
    structuredQuery: {}
  },
      r = n.path;
  null !== n.collectionGroup ? (e.parent = xn(t, r), e.structuredQuery.from = [{
    collectionId: n.collectionGroup,
    allDescendants: !0
  }]) : (e.parent = xn(t, r.popLast()), e.structuredQuery.from = [{
    collectionId: r.lastSegment()
  }]);

  var s = function (t) {
    if (0 === t.length) return;
    var n = t.map(function (t) {
      return (// visible for testing
        function (t) {
          if ("=="
          /* EQUAL */
          === t.op) {
            if (Ct(t.value)) return {
              unaryFilter: {
                field: Qn(t.field),
                op: "IS_NAN"
              }
            };
            if (Ot(t.value)) return {
              unaryFilter: {
                field: Qn(t.field),
                op: "IS_NULL"
              }
            };
          } else if ("!="
          /* NOT_EQUAL */
          === t.op) {
            if (Ct(t.value)) return {
              unaryFilter: {
                field: Qn(t.field),
                op: "IS_NOT_NAN"
              }
            };
            if (Ot(t.value)) return {
              unaryFilter: {
                field: Qn(t.field),
                op: "IS_NOT_NULL"
              }
            };
          }

          return {
            fieldFilter: {
              field: Qn(t.field),
              op: Bn(t.op),
              value: t.value
            }
          };
        }(t)
      );
    });
    if (1 === n.length) return n[0];
    return {
      compositeFilter: {
        op: "AND",
        filters: n
      }
    };
  }(n.filters);

  s && (e.structuredQuery.where = s);

  var i = function (t) {
    if (0 === t.length) return;
    return t.map(function (t) {
      return (// visible for testing
        function (t) {
          return {
            field: Qn(t.field),
            direction: Mn(t.dir)
          };
        }(t)
      );
    });
  }(n.orderBy);

  i && (e.structuredQuery.orderBy = i);

  var o = function (t, n) {
    return t.F || it(n) ? n : {
      value: n
    };
  }(t, n.limit);

  return null !== o && (e.structuredQuery.limit = o), n.startAt && (e.structuredQuery.startAt = kn(n.startAt)), n.endAt && (e.structuredQuery.endAt = kn(n.endAt)), e;
}

function kn(t) {
  return {
    before: t.before,
    values: t.position
  };
} // visible for testing


function Mn(t) {
  return An[t];
} // visible for testing


function Bn(t) {
  return Pn[t];
}

function Qn(t) {
  return {
    fieldPath: t.canonicalString()
  };
}

function zn(t) {
  var n = [];
  return t.fields.forEach(function (t) {
    return n.push(t.canonicalString());
  }), {
    fieldPaths: n
  };
}

function Wn(t) {
  // Resource names have at least 4 components (project ID, database ID)
  return t.length >= 4 && "projects" === t.get(0) && "databases" === t.get(2);
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


function Gn(t) {
  return new Rn(t,
  /* useProto3Json= */
  !0);
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * A helper for running delayed tasks following an exponential backoff curve
 * between attempts.
 *
 * Each delay is made up of a "base" delay which follows the exponential
 * backoff curve, and a +/- 50% "jitter" that is calculated and added to the
 * base delay. This prevents clients from accidentally synchronizing their
 * delays causing spikes of load to the backend.
 */


var Hn = /*#__PURE__*/function () {
  function Hn(
  /**
   * The AsyncQueue to run backoff operations on.
   */
  t,
  /**
   * The ID to use when scheduling backoff operations on the AsyncQueue.
   */
  n) {
    var e = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1e3;
    var r = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1.5;
    var s = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 6e4;

    _classCallCheck(this, Hn);

    this.O = t, this.timerId = n, this.C = e, this.L = r, this.U = s, this.j = 0, this.k = null,
    /** The last backoff attempt, as epoch milliseconds. */
    this.M = Date.now(), this.reset();
  }
  /**
   * Resets the backoff delay.
   *
   * The very next backoffAndWait() will have no delay. If it is called again
   * (i.e. due to an error), initialDelayMs (plus jitter) will be used, and
   * subsequent ones will increase according to the backoffFactor.
   */


  _createClass(Hn, [{
    key: "reset",
    value: function reset() {
      this.j = 0;
    }
    /**
     * Resets the backoff delay to the maximum delay (e.g. for use after a
     * RESOURCE_EXHAUSTED error).
     */

  }, {
    key: "B",
    value: function B() {
      this.j = this.U;
    }
    /**
     * Returns a promise that resolves after currentDelayMs, and increases the
     * delay for any subsequent attempts. If there was a pending backoff operation
     * already, it will be canceled.
     */

  }, {
    key: "W",
    value: function W(t) {
      var _this20 = this;

      // Cancel any pending backoff operation.
      this.cancel(); // First schedule using the current base (which may be 0 and should be
      // honored as such).

      var n = Math.floor(this.j + this.G()),
          e = Math.max(0, Date.now() - this.M),
          r = Math.max(0, n - e); // Guard against lastAttemptTime being in the future due to a clock change.

      r > 0 && w("ExponentialBackoff", "Backing off for ".concat(r, " ms (base delay: ").concat(this.j, " ms, delay with jitter: ").concat(n, " ms, last attempt: ").concat(e, " ms ago)")), this.k = this.O.enqueueAfterDelay(this.timerId, r, function () {
        return _this20.M = Date.now(), t();
      }), // Apply backoff factor to determine next delay and ensure it is within
      // bounds.
      this.j *= this.L, this.j < this.C && (this.j = this.C), this.j > this.U && (this.j = this.U);
    }
  }, {
    key: "H",
    value: function H() {
      null !== this.k && (this.k.skipDelay(), this.k = null);
    }
  }, {
    key: "cancel",
    value: function cancel() {
      null !== this.k && (this.k.cancel(), this.k = null);
    }
    /** Returns a random value in the range [-currentBaseMs/2, currentBaseMs/2] */

  }, {
    key: "G",
    value: function G() {
      return (Math.random() - .5) * this.j;
    }
  }]);

  return Hn;
}();
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Datastore and its related methods are a wrapper around the external Google
 * Cloud Datastore grpc API, which provides an interface that is more convenient
 * for the rest of the client SDK architecture to consume.
 */

/**
 * An implementation of Datastore that exposes additional state for internal
 * consumption.
 */


var Yn = /*#__PURE__*/function (_ref3) {
  _inherits(Yn, _ref3);

  var _super21 = _createSuper(Yn);

  function Yn(t, n, e) {
    var _this21;

    _classCallCheck(this, Yn);

    _this21 = _super21.call(this), _this21.credentials = t, _this21.Y = n, _this21.S = e, _this21.K = !1;
    return _this21;
  }

  _createClass(Yn, [{
    key: "J",
    value: function J() {
      if (this.K) throw new L($, "The client has already been terminated.");
    }
    /** Gets an auth token and invokes the provided RPC. */

  }, {
    key: "l",
    value: function l(t, n, e) {
      var _this22 = this;

      return this.J(), this.credentials.getToken().then(function (r) {
        return _this22.Y.l(t, n, e, r);
      }).catch(function (t) {
        throw "FirebaseError" === t.name ? (t.code === N && _this22.credentials.invalidateToken(), t) : new L(I, t.toString());
      });
    }
    /** Gets an auth token and invokes the provided RPC with streamed results. */

  }, {
    key: "v",
    value: function v(t, n, e) {
      var _this23 = this;

      return this.J(), this.credentials.getToken().then(function (r) {
        return _this23.Y.v(t, n, e, r);
      }).catch(function (t) {
        throw "FirebaseError" === t.name ? (t.code === N && _this23.credentials.invalidateToken(), t) : new L(I, t.toString());
      });
    }
  }, {
    key: "terminate",
    value: function terminate() {
      this.K = !0;
    }
  }]);

  return Yn;
}( /*#__PURE__*/function () {
  function _class3() {
    _classCallCheck(this, _class3);
  }

  return _class3;
}()); // TODO(firestorexp): Make sure there is only one Datastore instance per
// firestore-exp client.


function Kn(_x5, _x6) {
  return _Kn.apply(this, arguments);
}

function _Kn() {
  _Kn = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(t, n) {
    var e, r, s;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            e = b(t), r = On(e.S) + "/documents", s = {
              writes: n.map(function (t) {
                return Un(e.S, t);
              })
            };
            _context7.next = 3;
            return e.l("Commit", r, s);

          case 3:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));
  return _Kn.apply(this, arguments);
}

function Jn(_x7, _x8) {
  return _Jn.apply(this, arguments);
}

function _Jn() {
  _Jn = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(t, n) {
    var e, r, s, i, o, u;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            e = b(t);
            r = On(e.S) + "/documents";
            s = {
              documents: n.map(function (t) {
                return Sn(e.S, t);
              })
            };
            _context8.next = 5;
            return e.v("BatchGetDocuments", r, s);

          case 5:
            i = _context8.sent;
            o = new Map();
            i.forEach(function (t) {
              var n = Ln(e.S, t);
              o.set(n.key.toString(), n);
            });
            u = [];
            return _context8.abrupt("return", (n.forEach(function (t) {
              var n = o.get(t.toString());
              g(!!n), u.push(n);
            }), u));

          case 10:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));
  return _Jn.apply(this, arguments);
}

function Zn(_x9, _x10) {
  return _Zn.apply(this, arguments);
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


function _Zn() {
  _Zn = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(t, n) {
    var e, r;
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            e = b(t), r = jn(e.S, hn(n));
            _context9.next = 3;
            return e.v("RunQuery", r.parent, {
              structuredQuery: r.structuredQuery
            });

          case 3:
            return _context9.abrupt("return", _context9.sent.filter(function (t) {
              return !!t.document;
            }).map(function (t) {
              return function (t, n, e) {
                var r = qn(t, n.name),
                    s = $n(n.updateTime),
                    i = new jt({
                  mapValue: {
                    fields: n.fields
                  }
                }),
                    o = kt.newFoundDocument(r, s, i);
                return e && o.setHasCommittedMutations(), e ? o.setHasCommittedMutations() : o;
              }(e.S, t.document, void 0);
            }));

          case 4:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));
  return _Zn.apply(this, arguments);
}

var Xn = new Map();
/**
 * An instance map that ensures only one Datastore exists per Firestore
 * instance.
 */

/**
 * Returns an initialized and started Datastore for the given Firestore
 * instance. Callers must invoke removeComponents() when the Firestore
 * instance is terminated.
 */

function te(t) {
  if (t._terminated) throw new L($, "The client has already been terminated.");

  if (!Xn.has(t)) {
    w("ComponentProvider", "Initializing Datastore");

    var i = function (t) {
      return new lt(t, fetch.bind(null));
    }((n = t._databaseId, e = t.app.options.appId || "", r = t._persistenceKey, s = t._freezeSettings(), new W(n, e, r, s.host, s.ssl, s.experimentalForceLongPolling, s.experimentalAutoDetectLongPolling, s.useFetchStreams))),
        _o2 = Gn(t._databaseId),
        _u = function (t, n, e) {
      return new Yn(t, n, e);
    }(t._credentials, i, _o2);

    Xn.set(t, _u);
  }

  var n, e, r, s;
  /**
  * @license
  * Copyright 2018 Google LLC
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *   http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */

  return Xn.get(t);
}
/**
 * Removes all components associated with the provided instance. Must be called
 * when the `Firestore` instance is terminated.
 */

/**
 * A concrete type describing all the values that can be applied via a
 * user-supplied `FirestoreSettings` object. This is a separate type so that
 * defaults can be supplied and the value can be checked for equality.
 */


var ne = /*#__PURE__*/function () {
  function ne(t) {
    _classCallCheck(this, ne);

    var n;

    if (void 0 === t.host) {
      if (void 0 !== t.ssl) throw new L(T, "Can't provide ssl option if host option is not set");
      this.host = "firestore.googleapis.com", this.ssl = true;
    } else this.host = t.host, this.ssl = null === (n = t.ssl) || void 0 === n || n;

    if (this.credentials = t.credentials, this.ignoreUndefinedProperties = !!t.ignoreUndefinedProperties, void 0 === t.cacheSizeBytes) this.cacheSizeBytes = 41943040;else {
      if (-1 !== t.cacheSizeBytes && t.cacheSizeBytes < 1048576) throw new L(T, "cacheSizeBytes must be at least 1048576");
      this.cacheSizeBytes = t.cacheSizeBytes;
    }
    this.experimentalForceLongPolling = !!t.experimentalForceLongPolling, this.experimentalAutoDetectLongPolling = !!t.experimentalAutoDetectLongPolling, this.useFetchStreams = !!t.useFetchStreams, function (t, n, e, r) {
      if (!0 === n && !0 === r) throw new L(T, "".concat(t, " and ").concat(e, " cannot be used together."));
    }("experimentalForceLongPolling", t.experimentalForceLongPolling, "experimentalAutoDetectLongPolling", t.experimentalAutoDetectLongPolling);
  }

  _createClass(ne, [{
    key: "isEqual",
    value: function isEqual(t) {
      return this.host === t.host && this.ssl === t.ssl && this.credentials === t.credentials && this.cacheSizeBytes === t.cacheSizeBytes && this.experimentalForceLongPolling === t.experimentalForceLongPolling && this.experimentalAutoDetectLongPolling === t.experimentalAutoDetectLongPolling && this.ignoreUndefinedProperties === t.ignoreUndefinedProperties && this.useFetchStreams === t.useFetchStreams;
    }
  }]);

  return ne;
}();
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * The Cloud Firestore service interface.
 *
 * Do not call this constructor directly. Instead, use {@link getFirestore}.
 */


var ee = /*#__PURE__*/function () {
  /** @hideconstructor */
  function ee(t, n) {
    _classCallCheck(this, ee);

    this._credentials = n,
    /**
     * Whether it's a Firestore or Firestore Lite instance.
     */
    this.type = "firestore-lite", this._persistenceKey = "(lite)", this._settings = new ne({}), this._settingsFrozen = !1, t instanceof G ? this._databaseId = t : (this._app = t, this._databaseId = function (t) {
      if (!Object.prototype.hasOwnProperty.apply(t.options, ["projectId"])) throw new L(T, '"projectId" not provided in firebase.initializeApp.');
      return new G(t.options.projectId);
    }
    /**
    * Initializes a new instance of Cloud Firestore with the provided settings.
    * Can only be called before any other functions, including
    * {@link getFirestore}. If the custom settings are empty, this function is
    * equivalent to calling {@link getFirestore}.
    *
    * @param app - The {@link @firebase/app#FirebaseApp} with which the `Firestore` instance will
    * be associated.
    * @param settings - A settings object to configure the `Firestore` instance.
    * @returns A newly initialized `Firestore` instance.
    */
    (t));
  }
  /**
   * The {@link @firebase/app#FirebaseApp} associated with this `Firestore` service
   * instance.
   */


  _createClass(ee, [{
    key: "app",
    get: function get() {
      if (!this._app) throw new L($, "Firestore was not initialized using the Firebase SDK. 'app' is not available");
      return this._app;
    }
  }, {
    key: "_initialized",
    get: function get() {
      return this._settingsFrozen;
    }
  }, {
    key: "_terminated",
    get: function get() {
      return void 0 !== this._terminateTask;
    }
  }, {
    key: "_setSettings",
    value: function _setSettings(t) {
      if (this._settingsFrozen) throw new L($, "Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");
      this._settings = new ne(t), void 0 !== t.credentials && (this._credentials = function (t) {
        if (!t) return new k();

        switch (t.type) {
          case "gapi":
            var _n21 = t.client; // Make sure this really is a Gapi client.

            return g(!("object" != _typeof(_n21) || null === _n21 || !_n21.auth || !_n21.auth.getAuthHeaderValueForFirstParty)), new z(_n21, t.sessionIndex || "0", t.iamToken || null);

          case "provider":
            return t.client;

          default:
            throw new L(T, "makeCredentialsProvider failed due to invalid credential type");
        }
      }(t.credentials));
    }
  }, {
    key: "_getSettings",
    value: function _getSettings() {
      return this._settings;
    }
  }, {
    key: "_freezeSettings",
    value: function _freezeSettings() {
      return this._settingsFrozen = !0, this._settings;
    }
  }, {
    key: "_delete",
    value: function _delete() {
      return this._terminateTask || (this._terminateTask = this._terminate()), this._terminateTask;
    }
    /** Returns a JSON-serializable representation of this `Firestore` instance. */

  }, {
    key: "toJSON",
    value: function toJSON() {
      return {
        app: this._app,
        databaseId: this._databaseId,
        settings: this._settings
      };
    }
    /**
     * Terminates all components used by this client. Subclasses can override
     * this method to clean up their own dependencies, but must also call this
     * method.
     *
     * Only ever called once.
     */

  }, {
    key: "_terminate",
    value: function _terminate() {
      return function (t) {
        var n = Xn.get(t);
        n && (w("ComponentProvider", "Removing Datastore"), Xn.delete(t), n.terminate());
      }(this), Promise.resolve();
    }
  }]);

  return ee;
}();

exports.Firestore = ee;

function re(t, n) {
  var e = (0, _app._getProvider)(t, "firestore/lite");
  if (e.isInitialized()) throw new L($, "Firestore can only be initialized once per app.");
  return e.initialize({
    options: n
  });
}
/**
 * Returns the existing `Firestore` instance that is associated with the
 * provided {@link @firebase/app#FirebaseApp}. If no instance exists, initializes a new
 * instance with default settings.
 *
 * @param app - The {@link @firebase/app#FirebaseApp} instance that the returned `Firestore`
 * instance is associated with.
 * @returns The `Firestore` instance of the provided app.
 */


function se() {
  var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _app.getApp)();
  return (0, _app._getProvider)(n, "firestore/lite").getImmediate();
}
/**
 * Modify this instance to communicate with the Cloud Firestore emulator.
 *
 * Note: This must be called before this instance has been used to do any
 * operations.
 *
 * @param firestore - The `Firestore` instance to configure to connect to the
 * emulator.
 * @param host - the emulator host (ex: localhost).
 * @param port - the emulator port (ex: 9000).
 * @param options.mockUserToken - the mock auth token to use for unit testing
 * Security Rules.
 */


function ie(t, n, e) {
  var r = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var s;

  var i = (t = rt(t, ee))._getSettings();

  if ("firestore.googleapis.com" !== i.host && i.host !== n && p("Host has been set in both settings() and useEmulator(), emulator host will be used"), t._setSettings(Object.assign(Object.assign({}, i), {
    host: "".concat(n, ":").concat(e),
    ssl: !1
  })), r.mockUserToken) {
    var _n22, _e25;

    if ("string" == typeof r.mockUserToken) _n22 = r.mockUserToken, _e25 = h.MOCK_USER;else {
      // Let createMockUserToken validate first (catches common mistakes like
      // invalid field "uid" and missing field "sub" / "user_id".)
      _n22 = (0, _util.createMockUserToken)(r.mockUserToken, null === (s = t._app) || void 0 === s ? void 0 : s.options.projectId);

      var _i2 = r.mockUserToken.sub || r.mockUserToken.user_id;

      if (!_i2) throw new L(T, "mockUserToken must contain 'sub' or 'user_id' field!");
      _e25 = new h(_i2);
    }
    t._credentials = new M(new j(_n22, _e25));
  }
}
/**
 * Terminates the provided `Firestore` instance.
 *
 * After calling `terminate()` only the `clearIndexedDbPersistence()` functions
 * may be used. Any other function will throw a `FirestoreError`. Termination
 * does not cancel any pending writes, and any promises that are awaiting a
 * response from the server will not be resolved.
 *
 * To restart after termination, create a new instance of `Firestore` with
 * {@link getFirestore}.
 *
 * Note: Under normal circumstances, calling `terminate()` is not required. This
 * function is useful only when you want to force this instance to release all of
 * its resources or in combination with {@link clearIndexedDbPersistence} to
 * ensure that all local state is destroyed between test runs.
 *
 * @param firestore - The `Firestore` instance to terminate.
 * @returns A `Promise` that is resolved when the instance has been successfully
 * terminated.
 */


function oe(t) {
  return t = rt(t, ee), (0, _app._removeServiceInstance)(t.app, "firestore/lite"), t._delete();
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * A `DocumentReference` refers to a document location in a Firestore database
 * and can be used to write, read, or listen to the location. The document at
 * the referenced location may or may not exist.
 */


var ue = /*#__PURE__*/function () {
  /** @hideconstructor */
  function ue(t,
  /**
   * If provided, the `FirestoreDataConverter` associated with this instance.
   */
  n, e) {
    _classCallCheck(this, ue);

    this.converter = n, this._key = e,
    /** The type of this Firestore reference. */
    this.type = "document", this.firestore = t;
  }

  _createClass(ue, [{
    key: "_path",
    get: function get() {
      return this._key.path;
    }
    /**
     * The document's identifier within its collection.
     */

  }, {
    key: "id",
    get: function get() {
      return this._key.path.lastSegment();
    }
    /**
     * A string representing the path of the referenced document (relative
     * to the root of the database).
     */

  }, {
    key: "path",
    get: function get() {
      return this._key.path.canonicalString();
    }
    /**
     * The collection this `DocumentReference` belongs to.
     */

  }, {
    key: "parent",
    get: function get() {
      return new ae(this.firestore, this.converter, this._key.path.popLast());
    }
  }, {
    key: "withConverter",
    value: function withConverter(t) {
      return new ue(this.firestore, t, this._key);
    }
  }]);

  return ue;
}();
/**
 * A `Query` refers to a query which you can read or listen to. You can also
 * construct refined `Query` objects by adding filters and ordering.
 */


exports.DocumentReference = ue;

var ce = /*#__PURE__*/function () {
  // This is the lite version of the Query class in the main SDK.

  /** @hideconstructor protected */
  function ce(t,
  /**
   * If provided, the `FirestoreDataConverter` associated with this instance.
   */
  n, e) {
    _classCallCheck(this, ce);

    this.converter = n, this._query = e,
    /** The type of this Firestore reference. */
    this.type = "query", this.firestore = t;
  }

  _createClass(ce, [{
    key: "withConverter",
    value: function withConverter(t) {
      return new ce(this.firestore, t, this._query);
    }
  }]);

  return ce;
}();
/**
 * A `CollectionReference` object can be used for adding documents, getting
 * document references, and querying for documents (using {@link query}).
 */


exports.Query = ce;

var ae = /*#__PURE__*/function (_ce) {
  _inherits(ae, _ce);

  var _super22 = _createSuper(ae);

  /** @hideconstructor */
  function ae(t, n, e) {
    var _this24;

    _classCallCheck(this, ae);

    _this24 = _super22.call(this, t, n, new rn(e)), _this24._path = e,
    /** The type of this Firestore reference. */
    _this24.type = "collection";
    return _this24;
  }
  /** The collection's identifier. */


  _createClass(ae, [{
    key: "id",
    get: function get() {
      return this._query.path.lastSegment();
    }
    /**
     * A string representing the path of the referenced collection (relative
     * to the root of the database).
     */

  }, {
    key: "path",
    get: function get() {
      return this._query.path.canonicalString();
    }
    /**
     * A reference to the containing `DocumentReference` if this is a
     * subcollection. If this isn't a subcollection, the reference is null.
     */

  }, {
    key: "parent",
    get: function get() {
      var t = this._path.popLast();

      return t.isEmpty() ? null : new ue(this.firestore,
      /* converter= */
      null, new Z(t));
    }
  }, {
    key: "withConverter",
    value: function withConverter(t) {
      return new ae(this.firestore, t, this._path);
    }
  }]);

  return ae;
}(ce);

exports.CollectionReference = ae;

function he(t, n) {
  for (var _len5 = arguments.length, e = new Array(_len5 > 2 ? _len5 - 2 : 0), _key5 = 2; _key5 < _len5; _key5++) {
    e[_key5 - 2] = arguments[_key5];
  }

  if (t = (0, _util.getModularInstance)(t), X("collection", "path", n), t instanceof ee) {
    var _r8 = Y.fromString.apply(Y, [n].concat(e));

    return nt(_r8), new ae(t,
    /* converter= */
    null, _r8);
  }

  {
    if (!(t instanceof ue || t instanceof ae)) throw new L(T, "Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");

    var _r9 = t._path.child(Y.fromString.apply(Y, [n].concat(e)));

    return nt(_r9), new ae(t.firestore,
    /* converter= */
    null, _r9);
  }
} // TODO(firestorelite): Consider using ErrorFactory -
// https://github.com/firebase/firebase-js-sdk/blob/0131e1f/packages/util/src/errors.ts#L106

/**
 * Creates and returns a new `Query` instance that includes all documents in the
 * database that are contained in a collection or subcollection with the
 * given `collectionId`.
 *
 * @param firestore - A reference to the root `Firestore` instance.
 * @param collectionId - Identifies the collections to query over. Every
 * collection or subcollection with this ID as the last segment of its path
 * will be included. Cannot contain a slash.
 * @returns The created `Query`.
 */


function le(t, n) {
  if (t = rt(t, ee), X("collectionGroup", "collection id", n), n.indexOf("/") >= 0) throw new L(T, "Invalid collection ID '".concat(n, "' passed to function collectionGroup(). Collection IDs must not contain '/'."));
  return new ce(t,
  /* converter= */
  null,
  /**
  * Creates a new Query for a collection group query that matches all documents
  * within the provided collection group.
  */
  function (t) {
    return new rn(Y.emptyPath(), t);
  }(n));
}

function fe(t, n) {
  for (var _len6 = arguments.length, e = new Array(_len6 > 2 ? _len6 - 2 : 0), _key6 = 2; _key6 < _len6; _key6++) {
    e[_key6 - 2] = arguments[_key6];
  }

  if (t = (0, _util.getModularInstance)(t), // We allow omission of 'pathString' but explicitly prohibit passing in both
  // 'undefined' and 'null'.
  1 === arguments.length && (n = dt.A()), X("doc", "path", n), t instanceof ee) {
    var _r10 = Y.fromString.apply(Y, [n].concat(e));

    return tt(_r10), new ue(t,
    /* converter= */
    null, new Z(_r10));
  }

  {
    if (!(t instanceof ue || t instanceof ae)) throw new L(T, "Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");

    var _r11 = t._path.child(Y.fromString.apply(Y, [n].concat(e)));

    return tt(_r11), new ue(t.firestore, t instanceof ae ? t.converter : null, new Z(_r11));
  }
}
/**
 * Returns true if the provided references are equal.
 *
 * @param left - A reference to compare.
 * @param right - A reference to compare.
 * @returns true if the references point to the same location in the same
 * Firestore database.
 */


function de(t, n) {
  return t = (0, _util.getModularInstance)(t), n = (0, _util.getModularInstance)(n), (t instanceof ue || t instanceof ae) && (n instanceof ue || n instanceof ae) && t.firestore === n.firestore && t.path === n.path && t.converter === n.converter;
}
/**
 * Returns true if the provided queries point to the same collection and apply
 * the same constraints.
 *
 * @param left - A `Query` to compare.
 * @param right - A `Query` to compare.
 * @returns true if the references point to the same location in the same
 * Firestore database.
 */


function we(t, n) {
  return t = (0, _util.getModularInstance)(t), n = (0, _util.getModularInstance)(n), t instanceof ce && n instanceof ce && t.firestore === n.firestore && ln(t._query, n._query) && t.converter === n.converter;
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * A `FieldPath` refers to a field in a document. The path may consist of a
 * single field name (referring to a top-level field in the document), or a
 * list of field names (referring to a nested field in the document).
 *
 * Create a `FieldPath` by providing field names. If more than one field
 * name is provided, the path will point to a nested field in a document.
 */


var me = /*#__PURE__*/function () {
  /**
   * Creates a `FieldPath` from the provided field names. If more than one field
   * name is provided, the path will point to a nested field in a document.
   *
   * @param fieldNames - A list of field names.
   */
  function me() {
    _classCallCheck(this, me);

    for (var _len7 = arguments.length, t = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
      t[_key7] = arguments[_key7];
    }

    for (var _n23 = 0; _n23 < t.length; ++_n23) {
      if (0 === t[_n23].length) throw new L(T, "Invalid field name at argument $(i + 1). Field names must not be empty.");
    }

    this._internalPath = new J(t);
  }
  /**
   * Returns true if this `FieldPath` is equal to the provided one.
   *
   * @param other - The `FieldPath` to compare against.
   * @returns true if this `FieldPath` is equal to the provided one.
   */


  _createClass(me, [{
    key: "isEqual",
    value: function isEqual(t) {
      return this._internalPath.isEqual(t._internalPath);
    }
  }]);

  return me;
}();
/**
 * Returns a special sentinel `FieldPath` to refer to the ID of a document.
 * It can be used in queries to sort or filter by the document ID.
 */


exports.FieldPath = me;

function pe() {
  return new me("__name__");
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * An immutable object representing an array of bytes.
 */


var ye = /*#__PURE__*/function () {
  /** @hideconstructor */
  function ye(t) {
    _classCallCheck(this, ye);

    this._byteString = t;
  }
  /**
   * Creates a new `Bytes` object from the given Base64 string, converting it to
   * bytes.
   *
   * @param base64 - The Base64 string used to create the `Bytes` object.
   */


  _createClass(ye, [{
    key: "toBase64",
    value:
    /**
     * Returns the underlying bytes as a Base64-encoded string.
     *
     * @returns The Base64-encoded string created from the `Bytes` object.
     */
    function toBase64() {
      return this._byteString.toBase64();
    }
    /**
     * Returns the underlying bytes in a new `Uint8Array`.
     *
     * @returns The Uint8Array created from the `Bytes` object.
     */

  }, {
    key: "toUint8Array",
    value: function toUint8Array() {
      return this._byteString.toUint8Array();
    }
    /**
     * Returns a string representation of the `Bytes` object.
     *
     * @returns A string representation of the `Bytes` object.
     */

  }, {
    key: "toString",
    value: function toString() {
      return "Bytes(base64: " + this.toBase64() + ")";
    }
    /**
     * Returns true if this `Bytes` object is equal to the provided one.
     *
     * @param other - The `Bytes` object to compare against.
     * @returns true if this `Bytes` object is equal to the provided one.
     */

  }, {
    key: "isEqual",
    value: function isEqual(t) {
      return this._byteString.isEqual(t._byteString);
    }
  }], [{
    key: "fromBase64String",
    value: function fromBase64String(t) {
      try {
        return new ye(vt.fromBase64String(t));
      } catch (t) {
        throw new L(T, "Failed to construct data from Base64 string: " + t);
      }
    }
    /**
     * Creates a new `Bytes` object from the given Uint8Array.
     *
     * @param array - The Uint8Array used to create the `Bytes` object.
     */

  }, {
    key: "fromUint8Array",
    value: function fromUint8Array(t) {
      return new ye(vt.fromUint8Array(t));
    }
  }]);

  return ye;
}();
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Sentinel values that can be used when writing document fields with `set()`
 * or `update()`.
 */


exports.Bytes = ye;

var _e =
/**
 * @param _methodName - The public API endpoint that returns this class.
 * @hideconstructor
 */
function _e(t) {
  _classCallCheck(this, _e);

  this._methodName = t;
};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * An immutable object representing a geographic location in Firestore. The
 * location is represented as latitude/longitude pair.
 *
 * Latitude values are in the range of [-90, 90].
 * Longitude values are in the range of [-180, 180].
 */


exports.FieldValue = _e;

var ge = /*#__PURE__*/function () {
  /**
   * Creates a new immutable `GeoPoint` object with the provided latitude and
   * longitude values.
   * @param latitude - The latitude as number between -90 and 90.
   * @param longitude - The longitude as number between -180 and 180.
   */
  function ge(t, n) {
    _classCallCheck(this, ge);

    if (!isFinite(t) || t < -90 || t > 90) throw new L(T, "Latitude must be a number between -90 and 90, but was: " + t);
    if (!isFinite(n) || n < -180 || n > 180) throw new L(T, "Longitude must be a number between -180 and 180, but was: " + n);
    this._lat = t, this._long = n;
  }
  /**
   * The latitude of this `GeoPoint` instance.
   */


  _createClass(ge, [{
    key: "latitude",
    get: function get() {
      return this._lat;
    }
    /**
     * The longitude of this `GeoPoint` instance.
     */

  }, {
    key: "longitude",
    get: function get() {
      return this._long;
    }
    /**
     * Returns true if this `GeoPoint` is equal to the provided one.
     *
     * @param other - The `GeoPoint` to compare against.
     * @returns true if this `GeoPoint` is equal to the provided one.
     */

  }, {
    key: "isEqual",
    value: function isEqual(t) {
      return this._lat === t._lat && this._long === t._long;
    }
    /** Returns a JSON-serializable representation of this GeoPoint. */

  }, {
    key: "toJSON",
    value: function toJSON() {
      return {
        latitude: this._lat,
        longitude: this._long
      };
    }
    /**
     * Actually private to JS consumers of our API, so this function is prefixed
     * with an underscore.
     */

  }, {
    key: "_compareTo",
    value: function _compareTo(t) {
      return wt(this._lat, t._lat) || wt(this._long, t._long);
    }
  }]);

  return ge;
}();
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


exports.GeoPoint = ge;
var be = /^__.*__$/;
/** The result of parsing document data (e.g. for a setData call). */

var ve = /*#__PURE__*/function () {
  function ve(t, n, e) {
    _classCallCheck(this, ve);

    this.data = t, this.fieldMask = n, this.fieldTransforms = e;
  }

  _createClass(ve, [{
    key: "toMutation",
    value: function toMutation(t, n) {
      return null !== this.fieldMask ? new En(t, this.data, this.fieldMask, n, this.fieldTransforms) : new vn(t, this.data, n, this.fieldTransforms);
    }
  }]);

  return ve;
}();
/** The result of parsing "update" data (i.e. for an updateData call). */


var Ee = /*#__PURE__*/function () {
  function Ee(t, // The fieldMask does not include document transforms.
  n, e) {
    _classCallCheck(this, Ee);

    this.data = t, this.fieldMask = n, this.fieldTransforms = e;
  }

  _createClass(Ee, [{
    key: "toMutation",
    value: function toMutation(t, n) {
      return new En(t, this.data, this.fieldMask, n, this.fieldTransforms);
    }
  }]);

  return Ee;
}();

function Ie(t) {
  switch (t) {
    case 0
    /* Set */
    : // fall through

    case 2
    /* MergeSet */
    : // fall through

    case 1
    /* Update */
    :
      return !0;

    case 3
    /* Argument */
    :
    case 4
    /* ArrayArgument */
    :
      return !1;

    default:
      throw _();
  }
}
/** A "context" object passed around while parsing user data. */


var Te = /*#__PURE__*/function () {
  /**
   * Initializes a ParseContext with the given source and path.
   *
   * @param settings - The settings for the parser.
   * @param databaseId - The database ID of the Firestore instance.
   * @param serializer - The serializer to use to generate the Value proto.
   * @param ignoreUndefinedProperties - Whether to ignore undefined properties
   * rather than throw.
   * @param fieldTransforms - A mutable list of field transforms encountered
   * while parsing the data.
   * @param fieldMask - A mutable list of field paths encountered while parsing
   * the data.
   *
   * TODO(b/34871131): We don't support array paths right now, so path can be
   * null to indicate the context represents any location within an array (in
   * which case certain features will not work and errors will be somewhat
   * compromised).
   */
  function Te(t, n, e, r, s, i) {
    _classCallCheck(this, Te);

    this.settings = t, this.databaseId = n, this.S = e, this.ignoreUndefinedProperties = r, // Minor hack: If fieldTransforms is undefined, we assume this is an
    // external call and we need to validate the entire path.
    void 0 === s && this.Z(), this.fieldTransforms = s || [], this.fieldMask = i || [];
  }

  _createClass(Te, [{
    key: "path",
    get: function get() {
      return this.settings.path;
    }
  }, {
    key: "X",
    get: function get() {
      return this.settings.X;
    }
    /** Returns a new context with the specified settings overwritten. */

  }, {
    key: "tt",
    value: function tt(t) {
      return new Te(Object.assign(Object.assign({}, this.settings), t), this.databaseId, this.S, this.ignoreUndefinedProperties, this.fieldTransforms, this.fieldMask);
    }
  }, {
    key: "nt",
    value: function nt(t) {
      var n;
      var e = null === (n = this.path) || void 0 === n ? void 0 : n.child(t),
          r = this.tt({
        path: e,
        et: !1
      });
      return r.rt(t), r;
    }
  }, {
    key: "st",
    value: function st(t) {
      var n;
      var e = null === (n = this.path) || void 0 === n ? void 0 : n.child(t),
          r = this.tt({
        path: e,
        et: !1
      });
      return r.Z(), r;
    }
  }, {
    key: "it",
    value: function it(t) {
      // TODO(b/34871131): We don't support array paths right now; so make path
      // undefined.
      return this.tt({
        path: void 0,
        et: !0
      });
    }
  }, {
    key: "ot",
    value: function ot(t) {
      return Qe(t, this.settings.methodName, this.settings.ut || !1, this.path, this.settings.ct);
    }
    /** Returns 'true' if 'fieldPath' was traversed when creating this context. */

  }, {
    key: "contains",
    value: function contains(t) {
      return void 0 !== this.fieldMask.find(function (n) {
        return t.isPrefixOf(n);
      }) || void 0 !== this.fieldTransforms.find(function (n) {
        return t.isPrefixOf(n.field);
      });
    }
  }, {
    key: "Z",
    value: function Z() {
      // TODO(b/34871131): Remove null check once we have proper paths for fields
      // within arrays.
      if (this.path) for (var _t13 = 0; _t13 < this.path.length; _t13++) {
        this.rt(this.path.get(_t13));
      }
    }
  }, {
    key: "rt",
    value: function rt(t) {
      if (0 === t.length) throw this.ot("Document fields must not be empty");
      if (Ie(this.X) && be.test(t)) throw this.ot('Document fields cannot begin and end with "__"');
    }
  }]);

  return Te;
}();
/**
 * Helper for parsing raw user input (provided via the API) into internal model
 * classes.
 */


var Ae = /*#__PURE__*/function () {
  function Ae(t, n, e) {
    _classCallCheck(this, Ae);

    this.databaseId = t, this.ignoreUndefinedProperties = n, this.S = e || Gn(t);
  }
  /** Creates a new top-level parse context. */


  _createClass(Ae, [{
    key: "at",
    value: function at(t, n, e) {
      var r = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : !1;
      return new Te({
        X: t,
        methodName: n,
        ct: e,
        path: J.emptyPath(),
        et: !1,
        ut: r
      }, this.databaseId, this.S, this.ignoreUndefinedProperties);
    }
  }]);

  return Ae;
}();

function Pe(t) {
  var n = t._freezeSettings(),
      e = Gn(t._databaseId);

  return new Ae(t._databaseId, !!n.ignoreUndefinedProperties, e);
}
/** Parse document data from a set() call. */


function Re(t, n, e, r, s) {
  var i = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
  var o = t.at(i.merge || i.mergeFields ? 2
  /* MergeSet */
  : 0
  /* Set */
  , n, e, s);
  je("Data must be an object, but it was:", o, r);
  var u = Le(r, o);
  var c, a;
  if (i.merge) c = new bt(o.fieldMask), a = o.fieldTransforms;else if (i.mergeFields) {
    var _t14 = [];

    var _iterator6 = _createForOfIteratorHelper(i.mergeFields),
        _step6;

    try {
      for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
        var _r12 = _step6.value;

        var _s4 = ke(n, _r12, e);

        if (!o.contains(_s4)) throw new L(T, "Field '".concat(_s4, "' is specified in your field mask but missing from your input data."));
        ze(_t14, _s4) || _t14.push(_s4);
      }
    } catch (err) {
      _iterator6.e(err);
    } finally {
      _iterator6.f();
    }

    c = new bt(_t14), a = o.fieldTransforms.filter(function (t) {
      return c.covers(t.field);
    });
  } else c = null, a = o.fieldTransforms;
  return new ve(new jt(u), c, a);
}

var Ve = /*#__PURE__*/function (_e26) {
  _inherits(Ve, _e26);

  var _super23 = _createSuper(Ve);

  function Ve() {
    _classCallCheck(this, Ve);

    return _super23.apply(this, arguments);
  }

  _createClass(Ve, [{
    key: "_toFieldTransform",
    value: function _toFieldTransform(t) {
      if (2
      /* MergeSet */
      !== t.X) throw 1
      /* Update */
      === t.X ? t.ot("".concat(this._methodName, "() can only appear at the top level of your update data")) : t.ot("".concat(this._methodName, "() cannot be used with set() unless you pass {merge:true}")); // No transform to add for a delete, but we need to add it to our
      // fieldMask so it gets deleted.

      return t.fieldMask.push(t.path), null;
    }
  }, {
    key: "isEqual",
    value: function isEqual(t) {
      return t instanceof Ve;
    }
  }]);

  return Ve;
}(_e);
/**
 * Creates a child context for parsing SerializableFieldValues.
 *
 * This is different than calling `ParseContext.contextWith` because it keeps
 * the fieldTransforms and fieldMask separate.
 *
 * The created context has its `dataSource` set to `UserDataSource.Argument`.
 * Although these values are used with writes, any elements in these FieldValues
 * are not considered writes since they cannot contain any FieldValue sentinels,
 * etc.
 *
 * @param fieldValue - The sentinel FieldValue for which to create a child
 *     context.
 * @param context - The parent context.
 * @param arrayElement - Whether or not the FieldValue has an array.
 */


function Ne(t, n, e) {
  return new Te({
    X: 3
    /* Argument */
    ,
    ct: n.settings.ct,
    methodName: t._methodName,
    et: e
  }, n.databaseId, n.S, n.ignoreUndefinedProperties);
}

var De = /*#__PURE__*/function (_e27) {
  _inherits(De, _e27);

  var _super24 = _createSuper(De);

  function De() {
    _classCallCheck(this, De);

    return _super24.apply(this, arguments);
  }

  _createClass(De, [{
    key: "_toFieldTransform",
    value: function _toFieldTransform(t) {
      return new _n(t.path, new wn());
    }
  }, {
    key: "isEqual",
    value: function isEqual(t) {
      return t instanceof De;
    }
  }]);

  return De;
}(_e);

var $e = /*#__PURE__*/function (_e28) {
  _inherits($e, _e28);

  var _super25 = _createSuper($e);

  function $e(t, n) {
    var _this25;

    _classCallCheck(this, $e);

    _this25 = _super25.call(this, t), _this25.ht = n;
    return _this25;
  }

  _createClass($e, [{
    key: "_toFieldTransform",
    value: function _toFieldTransform(t) {
      var n = Ne(this, t,
      /*array=*/
      !0),
          e = this.ht.map(function (t) {
        return Ce(t, n);
      }),
          r = new mn(e);
      return new _n(t.path, r);
    }
  }, {
    key: "isEqual",
    value: function isEqual(t) {
      // TODO(mrschmidt): Implement isEquals
      return this === t;
    }
  }]);

  return $e;
}(_e);

var Fe = /*#__PURE__*/function (_e29) {
  _inherits(Fe, _e29);

  var _super26 = _createSuper(Fe);

  function Fe(t, n) {
    var _this26;

    _classCallCheck(this, Fe);

    _this26 = _super26.call(this, t), _this26.ht = n;
    return _this26;
  }

  _createClass(Fe, [{
    key: "_toFieldTransform",
    value: function _toFieldTransform(t) {
      var n = Ne(this, t,
      /*array=*/
      !0),
          e = this.ht.map(function (t) {
        return Ce(t, n);
      }),
          r = new pn(e);
      return new _n(t.path, r);
    }
  }, {
    key: "isEqual",
    value: function isEqual(t) {
      // TODO(mrschmidt): Implement isEquals
      return this === t;
    }
  }]);

  return Fe;
}(_e);

var Se = /*#__PURE__*/function (_e30) {
  _inherits(Se, _e30);

  var _super27 = _createSuper(Se);

  function Se(t, n) {
    var _this27;

    _classCallCheck(this, Se);

    _this27 = _super27.call(this, t), _this27.lt = n;
    return _this27;
  }

  _createClass(Se, [{
    key: "_toFieldTransform",
    value: function _toFieldTransform(t) {
      var n = new yn(t.S, fn(t.S, this.lt));
      return new _n(t.path, n);
    }
  }, {
    key: "isEqual",
    value: function isEqual(t) {
      // TODO(mrschmidt): Implement isEquals
      return this === t;
    }
  }]);

  return Se;
}(_e);
/** Parse update data from an update() call. */


function qe(t, n, e, r) {
  var s = t.at(1
  /* Update */
  , n, e);
  je("Data must be an object, but it was:", s, r);
  var i = [],
      o = jt.empty();
  gt(r, function (t, r) {
    var u = Be(n, t, e); // For Compat types, we have to "extract" the underlying types before
    // performing validation.

    r = (0, _util.getModularInstance)(r);
    var c = s.st(u);
    if (r instanceof Ve) // Add it to the field mask, but don't add anything to updateData.
      i.push(u);else {
      var _t15 = Ce(r, c);

      null != _t15 && (i.push(u), o.set(u, _t15));
    }
  });
  var u = new bt(i);
  return new Ee(o, u, s.fieldTransforms);
}
/** Parse update data from a list of field/value arguments. */


function xe(t, n, e, r, s, i) {
  var o = t.at(1
  /* Update */
  , n, e),
      u = [ke(n, r, e)],
      c = [s];
  if (i.length % 2 != 0) throw new L(T, "Function ".concat(n, "() needs to be called with an even number of arguments that alternate between field names and values."));

  for (var _t16 = 0; _t16 < i.length; _t16 += 2) {
    u.push(ke(n, i[_t16])), c.push(i[_t16 + 1]);
  }

  var h = [],
      l = jt.empty(); // We iterate in reverse order to pick the last value for a field if the
  // user specified the field multiple times.

  for (var _t17 = u.length - 1; _t17 >= 0; --_t17) {
    if (!ze(h, u[_t17])) {
      var _n24 = u[_t17];
      var _e31 = c[_t17]; // For Compat types, we have to "extract" the underlying types before
      // performing validation.

      _e31 = (0, _util.getModularInstance)(_e31);

      var _r13 = o.st(_n24);

      if (_e31 instanceof Ve) // Add it to the field mask, but don't add anything to updateData.
        h.push(_n24);else {
        var _t18 = Ce(_e31, _r13);

        null != _t18 && (h.push(_n24), l.set(_n24, _t18));
      }
    }
  }

  var f = new bt(h);
  return new Ee(l, f, o.fieldTransforms);
}
/**
 * Parse a "query value" (e.g. value in a where filter or a value in a cursor
 * bound).
 *
 * @param allowArrays - Whether the query value is an array that may directly
 * contain additional arrays (e.g. the operand of an `in` query).
 */


function Oe(t, n, e) {
  var r = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : !1;
  return Ce(e, t.at(r ? 4
  /* ArrayArgument */
  : 3
  /* Argument */
  , n));
}
/**
 * Parses user data to Protobuf Values.
 *
 * @param input - Data to be parsed.
 * @param context - A context object representing the current path being parsed,
 * the source of the data being parsed, etc.
 * @returns The parsed value, or null if the value was a FieldValue sentinel
 * that should not be included in the resulting parsed data.
 */


function Ce(t, n) {
  if (Ue( // Unwrap the API type from the Compat SDK. This will return the API type
  // from firestore-exp.
  t = (0, _util.getModularInstance)(t))) return je("Unsupported field value:", n, t), Le(t, n);
  if (t instanceof _e) // FieldValues usually parse into transforms (except FieldValue.delete())
    // in which case we do not want to include this field in our parsed data
    // (as doing so will overwrite the field directly prior to the transform
    // trying to transform it). So we don't add this location to
    // context.fieldMask and we return null as our parsing result.

    /**
    * "Parses" the provided FieldValueImpl, adding any necessary transforms to
    * context.fieldTransforms.
    */
    return function (t, n) {
      // Sentinels are only supported with writes, and not within arrays.
      if (!Ie(n.X)) throw n.ot("".concat(t._methodName, "() can only be used with update() and set()"));
      if (!n.path) throw n.ot("".concat(t._methodName, "() is not currently supported inside arrays"));

      var e = t._toFieldTransform(n);

      e && n.fieldTransforms.push(e);
    }
    /**
    * Helper to parse a scalar value (i.e. not an Object, Array, or FieldValue)
    *
    * @returns The parsed value
    */
    (t, n), null;
  if (void 0 === t && n.ignoreUndefinedProperties) // If the input is undefined it can never participate in the fieldMask, so
    // don't handle this below. If `ignoreUndefinedProperties` is false,
    // `parseScalarValue` will reject an undefined value.
    return null;

  if ( // If context.path is null we are inside an array and we don't support
  // field mask paths more granular than the top-level array.
  n.path && n.fieldMask.push(n.path), t instanceof Array) {
    // TODO(b/34871131): Include the path containing the array in the error
    // message.
    // In the case of IN queries, the parsed data is an array (representing
    // the set of values to be included for the IN query) that may directly
    // contain additional arrays (each representing an individual field
    // value), so we disable this validation.
    if (n.settings.et && 4
    /* ArrayArgument */
    !== n.X) throw n.ot("Nested arrays are not supported");
    return function (t, n) {
      var e = [];
      var r = 0;

      var _iterator7 = _createForOfIteratorHelper(t),
          _step7;

      try {
        for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
          var _s5 = _step7.value;

          var _t19 = Ce(_s5, n.it(r));

          null == _t19 && ( // Just include nulls in the array for fields being replaced with a
          // sentinel.
          _t19 = {
            nullValue: "NULL_VALUE"
          }), e.push(_t19), r++;
        }
      } catch (err) {
        _iterator7.e(err);
      } finally {
        _iterator7.f();
      }

      return {
        arrayValue: {
          values: e
        }
      };
    }(t, n);
  }

  return function (t, n) {
    if (null === (t = (0, _util.getModularInstance)(t))) return {
      nullValue: "NULL_VALUE"
    };
    if ("number" == typeof t) return fn(n.S, t);
    if ("boolean" == typeof t) return {
      booleanValue: t
    };
    if ("string" == typeof t) return {
      stringValue: t
    };

    if (t instanceof Date) {
      var _e32 = pt.fromDate(t);

      return {
        timestampValue: Vn(n.S, _e32)
      };
    }

    if (t instanceof pt) {
      // Firestore backend truncates precision down to microseconds. To ensure
      // offline mode works the same with regards to truncation, perform the
      // truncation immediately without waiting for the backend to do that.
      var _e33 = new pt(t.seconds, 1e3 * Math.floor(t.nanoseconds / 1e3));

      return {
        timestampValue: Vn(n.S, _e33)
      };
    }

    if (t instanceof ge) return {
      geoPointValue: {
        latitude: t.latitude,
        longitude: t.longitude
      }
    };
    if (t instanceof ye) return {
      bytesValue: Nn(n.S, t._byteString)
    };

    if (t instanceof ue) {
      var _e34 = n.databaseId,
          _r14 = t.firestore._databaseId;
      if (!_r14.isEqual(_e34)) throw n.ot("Document reference is for database ".concat(_r14.projectId, "/").concat(_r14.database, " but should be for database ").concat(_e34.projectId, "/").concat(_e34.database));
      return {
        referenceValue: Fn(t.firestore._databaseId || n.databaseId, t._key.path)
      };
    }

    throw n.ot("Unsupported field value: ".concat(et(t)));
  }
  /**
  * Checks whether an object looks like a JSON object that should be converted
  * into a struct. Normal class/prototype instances are considered to look like
  * JSON objects since they should be converted to a struct value. Arrays, Dates,
  * GeoPoints, etc. are not considered to look like JSON objects since they map
  * to specific FieldValue types other than ObjectValue.
  */
  (t, n);
}

function Le(t, n) {
  var e = {};
  return !function (t) {
    for (var _n25 in t) {
      if (Object.prototype.hasOwnProperty.call(t, _n25)) return !1;
    }

    return !0;
  }(t) ? gt(t, function (t, r) {
    var s = Ce(r, n.nt(t));
    null != s && (e[t] = s);
  }) : // If we encounter an empty object, we explicitly add it to the update
  // mask to ensure that the server creates a map entry.
  n.path && n.path.length > 0 && n.fieldMask.push(n.path), {
    mapValue: {
      fields: e
    }
  };
}

function Ue(t) {
  return !("object" != _typeof(t) || null === t || t instanceof Array || t instanceof Date || t instanceof pt || t instanceof ge || t instanceof ye || t instanceof ue || t instanceof _e);
}

function je(t, n, e) {
  if (!Ue(e) || !function (t) {
    return "object" == _typeof(t) && null !== t && (Object.getPrototypeOf(t) === Object.prototype || null === Object.getPrototypeOf(t));
  }(e)) {
    var _r15 = et(e);

    throw "an object" === _r15 ? n.ot(t + " a custom object") : n.ot(t + " " + _r15);
  }
}
/**
 * Helper that calls fromDotSeparatedString() but wraps any error thrown.
 */


function ke(t, n, e) {
  if (( // If required, replace the FieldPath Compat class with with the firestore-exp
  // FieldPath.
  n = (0, _util.getModularInstance)(n)) instanceof me) return n._internalPath;
  if ("string" == typeof n) return Be(t, n);
  throw Qe("Field path arguments must be of type string or FieldPath.", t,
  /* hasConverter= */
  !1,
  /* path= */
  void 0, e);
}
/**
 * Matches any characters in a field path string that are reserved.
 */


var Me = new RegExp("[~\\*/\\[\\]]");
/**
 * Wraps fromDotSeparatedString with an error message about the method that
 * was thrown.
 * @param methodName - The publicly visible method name
 * @param path - The dot-separated string form of a field path which will be
 * split on dots.
 * @param targetDoc - The document against which the field path will be
 * evaluated.
 */

function Be(t, n, e) {
  if (n.search(Me) >= 0) throw Qe("Invalid field path (".concat(n, "). Paths must not contain '~', '*', '/', '[', or ']'"), t,
  /* hasConverter= */
  !1,
  /* path= */
  void 0, e);

  try {
    return _construct(me, _toConsumableArray(n.split(".")))._internalPath;
  } catch (r) {
    throw Qe("Invalid field path (".concat(n, "). Paths must not be empty, begin with '.', end with '.', or contain '..'"), t,
    /* hasConverter= */
    !1,
    /* path= */
    void 0, e);
  }
}

function Qe(t, n, e, r, s) {
  var i = r && !r.isEmpty(),
      o = void 0 !== s;
  var u = "Function ".concat(n, "() called with invalid data");
  e && (u += " (via `toFirestore()`)"), u += ". ";
  var c = "";
  return (i || o) && (c += " (found", i && (c += " in field ".concat(r)), o && (c += " in document ".concat(s)), c += ")"), new L(T, u + t + c);
}
/** Checks `haystack` if FieldPath `needle` is present. Runs in O(n). */


function ze(t, n) {
  return t.some(function (t) {
    return t.isEqual(n);
  });
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * A `DocumentSnapshot` contains data read from a document in your Firestore
 * database. The data can be extracted with `.data()` or `.get(<field>)` to
 * get a specific field.
 *
 * For a `DocumentSnapshot` that points to a non-existing document, any data
 * access will return 'undefined'. You can use the `exists()` method to
 * explicitly verify a document's existence.
 */


var We = /*#__PURE__*/function () {
  // Note: This class is stripped down version of the DocumentSnapshot in
  // the legacy SDK. The changes are:
  // - No support for SnapshotMetadata.
  // - No support for SnapshotOptions.

  /** @hideconstructor protected */
  function We(t, n, e, r, s) {
    _classCallCheck(this, We);

    this._firestore = t, this._userDataWriter = n, this._key = e, this._document = r, this._converter = s;
  }
  /** Property of the `DocumentSnapshot` that provides the document's ID. */


  _createClass(We, [{
    key: "id",
    get: function get() {
      return this._key.path.lastSegment();
    }
    /**
     * The `DocumentReference` for the document included in the `DocumentSnapshot`.
     */

  }, {
    key: "ref",
    get: function get() {
      return new ue(this._firestore, this._converter, this._key);
    }
    /**
     * Signals whether or not the document at the snapshot's location exists.
     *
     * @returns true if the document exists.
     */

  }, {
    key: "exists",
    value: function exists() {
      return null !== this._document;
    }
    /**
     * Retrieves all fields in the document as an `Object`. Returns `undefined` if
     * the document doesn't exist.
     *
     * @returns An `Object` containing all fields in the document or `undefined`
     * if the document doesn't exist.
     */

  }, {
    key: "data",
    value: function data() {
      if (this._document) {
        if (this._converter) {
          // We only want to use the converter and create a new DocumentSnapshot
          // if a converter has been provided.
          var _t20 = new Ge(this._firestore, this._userDataWriter, this._key, this._document,
          /* converter= */
          null);

          return this._converter.fromFirestore(_t20);
        }

        return this._userDataWriter.convertValue(this._document.data.value);
      }
    }
    /**
     * Retrieves the field specified by `fieldPath`. Returns `undefined` if the
     * document or field doesn't exist.
     *
     * @param fieldPath - The path (for example 'foo' or 'foo.bar') to a specific
     * field.
     * @returns The data at the specified field location or undefined if no such
     * field exists in the document.
     */
    // We are using `any` here to avoid an explicit cast by our users.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any

  }, {
    key: "get",
    value: function get(t) {
      if (this._document) {
        var _n26 = this._document.data.field(Ke("DocumentSnapshot.get", t));

        if (null !== _n26) return this._userDataWriter.convertValue(_n26);
      }
    }
  }]);

  return We;
}();
/**
 * A `QueryDocumentSnapshot` contains data read from a document in your
 * Firestore database as part of a query. The document is guaranteed to exist
 * and its data can be extracted with `.data()` or `.get(<field>)` to get a
 * specific field.
 *
 * A `QueryDocumentSnapshot` offers the same API surface as a
 * `DocumentSnapshot`. Since query results contain only existing documents, the
 * `exists` property will always be true and `data()` will never return
 * 'undefined'.
 */


exports.DocumentSnapshot = We;

var Ge = /*#__PURE__*/function (_We) {
  _inherits(Ge, _We);

  var _super28 = _createSuper(Ge);

  function Ge() {
    _classCallCheck(this, Ge);

    return _super28.apply(this, arguments);
  }

  _createClass(Ge, [{
    key: "data",
    value:
    /**
     * Retrieves all fields in the document as an `Object`.
     *
     * @override
     * @returns An `Object` containing all fields in the document.
     */
    function data() {
      return _get(_getPrototypeOf(Ge.prototype), "data", this).call(this);
    }
  }]);

  return Ge;
}(We);
/**
 * A `QuerySnapshot` contains zero or more `DocumentSnapshot` objects
 * representing the results of a query. The documents can be accessed as an
 * array via the `docs` property or enumerated using the `forEach` method. The
 * number of documents can be determined via the `empty` and `size`
 * properties.
 */


exports.QueryDocumentSnapshot = Ge;

var He = /*#__PURE__*/function () {
  /** @hideconstructor */
  function He(t, n) {
    _classCallCheck(this, He);

    this._docs = n, this.query = t;
  }
  /** An array of all the documents in the `QuerySnapshot`. */


  _createClass(He, [{
    key: "docs",
    get: function get() {
      return _toConsumableArray(this._docs);
    }
    /** The number of documents in the `QuerySnapshot`. */

  }, {
    key: "size",
    get: function get() {
      return this.docs.length;
    }
    /** True if there are no documents in the `QuerySnapshot`. */

  }, {
    key: "empty",
    get: function get() {
      return 0 === this.docs.length;
    }
    /**
     * Enumerates all of the documents in the `QuerySnapshot`.
     *
     * @param callback - A callback to be called with a `QueryDocumentSnapshot` for
     * each document in the snapshot.
     * @param thisArg - The `this` binding for the callback.
     */

  }, {
    key: "forEach",
    value: function forEach(t, n) {
      this._docs.forEach(t, n);
    }
  }]);

  return He;
}();
/**
 * Returns true if the provided snapshots are equal.
 *
 * @param left - A snapshot to compare.
 * @param right - A snapshot to compare.
 * @returns true if the snapshots are equal.
 */


exports.QuerySnapshot = He;

function Ye(t, n) {
  return t = (0, _util.getModularInstance)(t), n = (0, _util.getModularInstance)(n), t instanceof We && n instanceof We ? t._firestore === n._firestore && t._key.isEqual(n._key) && (null === t._document ? null === n._document : t._document.isEqual(n._document)) && t._converter === n._converter : t instanceof He && n instanceof He && we(t.query, n.query) && mt(t.docs, n.docs, Ye);
}
/**
 * Helper that calls `fromDotSeparatedString()` but wraps any error thrown.
 */


function Ke(t, n) {
  return "string" == typeof n ? Be(t, n) : n instanceof me ? n._internalPath : n._delegate._internalPath;
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * A `QueryConstraint` is used to narrow the set of documents returned by a
 * Firestore query. `QueryConstraint`s are created by invoking {@link where},
 * {@link orderBy}, {@link (startAt:1)}, {@link (startAfter:1)}, {@link
 * endBefore:1}, {@link (endAt:1)}, {@link limit} or {@link limitToLast} and
 * can then be passed to {@link query} to create a new query instance that
 * also contains this `QueryConstraint`.
 */


var Je = function Je() {
  _classCallCheck(this, Je);
};
/**
 * Creates a new immutable instance of {@link Query} that is extended to also include
 * additional query constraints.
 *
 * @param query - The {@link Query} instance to use as a base for the new constraints.
 * @param queryConstraints - The list of {@link QueryConstraint}s to apply.
 * @throws if any of the provided query constraints cannot be combined with the
 * existing or new constraints.
 */


exports.QueryConstraint = Je;

function Ze(t) {
  for (var _len8 = arguments.length, n = new Array(_len8 > 1 ? _len8 - 1 : 0), _key8 = 1; _key8 < _len8; _key8++) {
    n[_key8 - 1] = arguments[_key8];
  }

  for (var _i3 = 0, _n27 = n; _i3 < _n27.length; _i3++) {
    var _e35 = _n27[_i3];
    t = _e35._apply(t);
  }

  return t;
}

var Xe = /*#__PURE__*/function (_Je) {
  _inherits(Xe, _Je);

  var _super29 = _createSuper(Xe);

  function Xe(t, n, e) {
    var _this28;

    _classCallCheck(this, Xe);

    _this28 = _super29.call(this), _this28.ft = t, _this28.dt = n, _this28.wt = e, _this28.type = "where";
    return _this28;
  }

  _createClass(Xe, [{
    key: "_apply",
    value: function _apply(t) {
      var n = Pe(t.firestore),
          e = function (t, n, e, r, s, i, o) {
        var u;

        if (s.isKeyField()) {
          if ("array-contains"
          /* ARRAY_CONTAINS */
          === i || "array-contains-any"
          /* ARRAY_CONTAINS_ANY */
          === i) throw new L(T, "Invalid Query. You can't perform '".concat(i, "' queries on FieldPath.documentId()."));

          if ("in"
          /* IN */
          === i || "not-in"
          /* NOT_IN */
          === i) {
            wr(o, i);
            var _n28 = [];

            var _iterator8 = _createForOfIteratorHelper(o),
                _step8;

            try {
              for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
                var _e36 = _step8.value;

                _n28.push(dr(r, t, _e36));
              }
            } catch (err) {
              _iterator8.e(err);
            } finally {
              _iterator8.f();
            }

            u = {
              arrayValue: {
                values: _n28
              }
            };
          } else u = dr(r, t, o);
        } else "in"
        /* IN */
        !== i && "not-in"
        /* NOT_IN */
        !== i && "array-contains-any"
        /* ARRAY_CONTAINS_ANY */
        !== i || wr(o, i), u = Oe(e, n, o,
        /* allowArrays= */
        "in"
        /* IN */
        === i || "not-in"
        /* NOT_IN */
        === i);

        var c = Qt.create(s, i, u);
        return function (t, n) {
          if (n.N()) {
            var _e37 = un(t);

            if (null !== _e37 && !_e37.isEqual(n.field)) throw new L(T, "Invalid query. All where filters with an inequality (<, <=, !=, not-in, >, or >=) must be on the same field. But you have inequality filters on '".concat(_e37.toString(), "' and '").concat(n.field.toString(), "'"));

            var _r16 = on(t);

            null !== _r16 && mr(t, n.field, _r16);
          }

          var e = function (t, n) {
            var _iterator9 = _createForOfIteratorHelper(t.filters),
                _step9;

            try {
              for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
                var _e38 = _step9.value;
                if (n.indexOf(_e38.op) >= 0) return _e38.op;
              }
            } catch (err) {
              _iterator9.e(err);
            } finally {
              _iterator9.f();
            }

            return null;
          }(t,
          /**
          * Given an operator, returns the set of operators that cannot be used with it.
          *
          * Operators in a query must adhere to the following set of rules:
          * 1. Only one array operator is allowed.
          * 2. Only one disjunctive operator is allowed.
          * 3. `NOT_EQUAL` cannot be used with another `NOT_EQUAL` operator.
          * 4. `NOT_IN` cannot be used with array, disjunctive, or `NOT_EQUAL` operators.
          *
          * Array operators: `ARRAY_CONTAINS`, `ARRAY_CONTAINS_ANY`
          * Disjunctive operators: `IN`, `ARRAY_CONTAINS_ANY`, `NOT_IN`
          */
          function (t) {
            switch (t) {
              case "!="
              /* NOT_EQUAL */
              :
                return ["!="
                /* NOT_EQUAL */
                , "not-in"
                /* NOT_IN */
                ];

              case "array-contains"
              /* ARRAY_CONTAINS */
              :
                return ["array-contains"
                /* ARRAY_CONTAINS */
                , "array-contains-any"
                /* ARRAY_CONTAINS_ANY */
                , "not-in"
                /* NOT_IN */
                ];

              case "in"
              /* IN */
              :
                return ["array-contains-any"
                /* ARRAY_CONTAINS_ANY */
                , "in"
                /* IN */
                , "not-in"
                /* NOT_IN */
                ];

              case "array-contains-any"
              /* ARRAY_CONTAINS_ANY */
              :
                return ["array-contains"
                /* ARRAY_CONTAINS */
                , "array-contains-any"
                /* ARRAY_CONTAINS_ANY */
                , "in"
                /* IN */
                , "not-in"
                /* NOT_IN */
                ];

              case "not-in"
              /* NOT_IN */
              :
                return ["array-contains"
                /* ARRAY_CONTAINS */
                , "array-contains-any"
                /* ARRAY_CONTAINS_ANY */
                , "in"
                /* IN */
                , "not-in"
                /* NOT_IN */
                , "!="
                /* NOT_EQUAL */
                ];

              default:
                return [];
            }
          }(n.op));

          if (null !== e) // Special case when it's a duplicate op to give a slightly clearer error message.
            throw e === n.op ? new L(T, "Invalid query. You cannot use more than one '".concat(n.op.toString(), "' filter.")) : new L(T, "Invalid query. You cannot use '".concat(n.op.toString(), "' filters with '").concat(e.toString(), "' filters."));
        }(t, c), c;
      }(t._query, "where", n, t.firestore._databaseId, this.ft, this.dt, this.wt);

      return new ce(t.firestore, t.converter, function (t, n) {
        var e = t.filters.concat([n]);
        return new rn(t.path, t.collectionGroup, t.explicitOrderBy.slice(), e, t.limit, t.limitType, t.startAt, t.endAt);
      }(t._query, e));
    }
  }]);

  return Xe;
}(Je);
/**
 * Creates a {@link QueryConstraint} that enforces that documents must contain the
 * specified field and that the value should satisfy the relation constraint
 * provided.
 *
 * @param fieldPath - The path to compare
 * @param opStr - The operation string (e.g "&lt;", "&lt;=", "==", "&lt;",
 *   "&lt;=", "!=").
 * @param value - The value for comparison
 * @returns The created {@link Query}.
 */


function tr(t, n, e) {
  var r = n,
      s = Ke("where", t);
  return new Xe(s, r, e);
}

var nr = /*#__PURE__*/function (_Je2) {
  _inherits(nr, _Je2);

  var _super30 = _createSuper(nr);

  function nr(t, n) {
    var _this29;

    _classCallCheck(this, nr);

    _this29 = _super30.call(this), _this29.ft = t, _this29.yt = n, _this29.type = "orderBy";
    return _this29;
  }

  _createClass(nr, [{
    key: "_apply",
    value: function _apply(t) {
      var n = function (t, n, e) {
        if (null !== t.startAt) throw new L(T, "Invalid query. You must not call startAt() or startAfter() before calling orderBy().");
        if (null !== t.endAt) throw new L(T, "Invalid query. You must not call endAt() or endBefore() before calling orderBy().");
        var r = new tn(n, e);
        return function (t, n) {
          if (null === on(t)) {
            // This is the first order by. It must match any inequality.
            var _e39 = un(t);

            null !== _e39 && mr(t, _e39, n.field);
          }
        }(t, r), r;
      }
      /**
      * Create a `Bound` from a query and a document.
      *
      * Note that the `Bound` will always include the key of the document
      * and so only the provided document will compare equal to the returned
      * position.
      *
      * Will throw if the document does not contain all fields of the order by
      * of the query or if any of the fields in the order by are an uncommitted
      * server timestamp.
      */
      (t._query, this.ft, this.yt);

      return new ce(t.firestore, t.converter, function (t, n) {
        // TODO(dimond): validate that orderBy does not list the same key twice.
        var e = t.explicitOrderBy.concat([n]);
        return new rn(t.path, t.collectionGroup, e, t.filters.slice(), t.limit, t.limitType, t.startAt, t.endAt);
      }(t._query, n));
    }
  }]);

  return nr;
}(Je);
/**
 * Creates a {@link QueryConstraint} that sorts the query result by the
 * specified field, optionally in descending order instead of ascending.
 *
 * @param fieldPath - The field to sort by.
 * @param directionStr - Optional direction to sort by ('asc' or 'desc'). If
 * not specified, order will be ascending.
 * @returns The created {@link Query}.
 */


function er(t) {
  var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "asc";
  var e = n,
      r = Ke("orderBy", t);
  return new nr(r, e);
}

var rr = /*#__PURE__*/function (_Je3) {
  _inherits(rr, _Je3);

  var _super31 = _createSuper(rr);

  function rr(t, n, e) {
    var _this30;

    _classCallCheck(this, rr);

    _this30 = _super31.call(this), _this30.type = t, _this30._t = n, _this30.gt = e;
    return _this30;
  }

  _createClass(rr, [{
    key: "_apply",
    value: function _apply(t) {
      return new ce(t.firestore, t.converter, function (t, n, e) {
        return new rn(t.path, t.collectionGroup, t.explicitOrderBy.slice(), t.filters.slice(), n, e, t.startAt, t.endAt);
      }(t._query, this._t, this.gt));
    }
  }]);

  return rr;
}(Je);
/**
 * Creates a {@link QueryConstraint} that only returns the first matching documents.
 *
 * @param limit - The maximum number of items to return.
 * @returns The created {@link Query}.
 */


function sr(t) {
  return st("limit", t), new rr("limit", t, "F"
  /* First */
  );
}
/**
 * Creates a {@link QueryConstraint} that only returns the last matching documents.
 *
 * You must specify at least one `orderBy` clause for `limitToLast` queries,
 * otherwise an exception will be thrown during execution.
 *
 * @param limit - The maximum number of items to return.
 * @returns The created {@link Query}.
 */


function ir(t) {
  return st("limitToLast", t), new rr("limitToLast", t, "L"
  /* Last */
  );
}

var or = /*#__PURE__*/function (_Je4) {
  _inherits(or, _Je4);

  var _super32 = _createSuper(or);

  function or(t, n, e) {
    var _this31;

    _classCallCheck(this, or);

    _this31 = _super32.call(this), _this31.type = t, _this31.bt = n, _this31.vt = e;
    return _this31;
  }

  _createClass(or, [{
    key: "_apply",
    value: function _apply(t) {
      var n = fr(t, this.type, this.bt, this.vt);
      return new ce(t.firestore, t.converter, function (t, n) {
        return new rn(t.path, t.collectionGroup, t.explicitOrderBy.slice(), t.filters.slice(), t.limit, t.limitType, n, t.endAt);
      }(t._query, n));
    }
  }]);

  return or;
}(Je);

function ur() {
  for (var _len9 = arguments.length, t = new Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
    t[_key9] = arguments[_key9];
  }

  return new or("startAt", t,
  /*before=*/
  !0);
}

function cr() {
  for (var _len10 = arguments.length, t = new Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
    t[_key10] = arguments[_key10];
  }

  return new or("startAfter", t,
  /*before=*/
  !1);
}

var ar = /*#__PURE__*/function (_Je5) {
  _inherits(ar, _Je5);

  var _super33 = _createSuper(ar);

  function ar(t, n, e) {
    var _this32;

    _classCallCheck(this, ar);

    _this32 = _super33.call(this), _this32.type = t, _this32.bt = n, _this32.vt = e;
    return _this32;
  }

  _createClass(ar, [{
    key: "_apply",
    value: function _apply(t) {
      var n = fr(t, this.type, this.bt, this.vt);
      return new ce(t.firestore, t.converter, function (t, n) {
        return new rn(t.path, t.collectionGroup, t.explicitOrderBy.slice(), t.filters.slice(), t.limit, t.limitType, t.startAt, n);
      }(t._query, n));
    }
  }]);

  return ar;
}(Je);

function hr() {
  for (var _len11 = arguments.length, t = new Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
    t[_key11] = arguments[_key11];
  }

  return new ar("endBefore", t,
  /*before=*/
  !0);
}

function lr() {
  for (var _len12 = arguments.length, t = new Array(_len12), _key12 = 0; _key12 < _len12; _key12++) {
    t[_key12] = arguments[_key12];
  }

  return new ar("endAt", t,
  /*before=*/
  !1);
}
/** Helper function to create a bound from a document or fields */


function fr(t, n, e, r) {
  if (e[0] = (0, _util.getModularInstance)(e[0]), e[0] instanceof We) return function (t, n, e, r, s) {
    if (!r) throw new L(P, "Can't use a DocumentSnapshot that doesn't exist for ".concat(e, "()."));
    var i = []; // Because people expect to continue/end a query at the exact document
    // provided, we need to use the implicit sort order rather than the explicit
    // sort order, because it's guaranteed to contain the document key. That way
    // the position becomes unambiguous and the query continues/ends exactly at
    // the provided document. Without the key (by using the explicit sort
    // orders), multiple documents could match the position, yielding duplicate
    // results.

    var _iterator10 = _createForOfIteratorHelper(an(t)),
        _step10;

    try {
      for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
        var _e40 = _step10.value;
        if (_e40.field.isKeyField()) i.push(qt(n, r.key));else {
          var _t21 = r.data.field(_e40.field);

          if (Pt(_t21)) throw new L(T, 'Invalid query. You are trying to start or end a query using a document for which the field "' + _e40.field + '" is an uncommitted server timestamp. (Since the value of this field is unknown, you cannot start/end a query with it.)');

          if (null === _t21) {
            var _t22 = _e40.field.canonicalString();

            throw new L(T, "Invalid query. You are trying to start or end a query using a document for which the field '".concat(_t22, "' (used as the orderBy) does not exist."));
          }

          i.push(_t21);
        }
      }
    } catch (err) {
      _iterator10.e(err);
    } finally {
      _iterator10.f();
    }

    return new Xt(i, s);
  }
  /**
  * Converts a list of field values to a `Bound` for the given query.
  */
  (t._query, t.firestore._databaseId, n, e[0]._document, r);
  {
    var _s6 = Pe(t.firestore);

    return function (t, n, e, r, s, i) {
      // Use explicit order by's because it has to match the query the user made
      var o = t.explicitOrderBy;
      if (s.length > o.length) throw new L(T, "Too many arguments provided to ".concat(r, "(). The number of arguments must be less than or equal to the number of orderBy() clauses"));
      var u = [];

      for (var _i4 = 0; _i4 < s.length; _i4++) {
        var _c = s[_i4];

        if (o[_i4].field.isKeyField()) {
          if ("string" != typeof _c) throw new L(T, "Invalid query. Expected a string for document ID in ".concat(r, "(), but got a ").concat(_typeof(_c)));
          if (!cn(t) && -1 !== _c.indexOf("/")) throw new L(T, "Invalid query. When querying a collection and ordering by FieldPath.documentId(), the value passed to ".concat(r, "() must be a plain document ID, but '").concat(_c, "' contains a slash."));

          var _e41 = t.path.child(Y.fromString(_c));

          if (!Z.isDocumentKey(_e41)) throw new L(T, "Invalid query. When querying a collection group and ordering by FieldPath.documentId(), the value passed to ".concat(r, "() must result in a valid document path, but '").concat(_e41, "' is not because it contains an odd number of segments."));

          var _s7 = new Z(_e41);

          u.push(qt(n, _s7));
        } else {
          var _t23 = Oe(e, r, _c);

          u.push(_t23);
        }
      }

      return new Xt(u, i);
    }
    /**
    * Parses the given `documentIdValue` into a `ReferenceValue`, throwing
    * appropriate errors if the value is anything other than a `DocumentReference`
    * or `string`, or if the string is malformed.
    */
    (t._query, t.firestore._databaseId, _s6, n, e, r);
  }
}

function dr(t, n, e) {
  if ("string" == typeof (e = (0, _util.getModularInstance)(e))) {
    if ("" === e) throw new L(T, "Invalid query. When querying with FieldPath.documentId(), you must provide a valid document ID, but it was an empty string.");
    if (!cn(n) && -1 !== e.indexOf("/")) throw new L(T, "Invalid query. When querying a collection by FieldPath.documentId(), you must provide a plain document ID, but '".concat(e, "' contains a '/' character."));

    var _r17 = n.path.child(Y.fromString(e));

    if (!Z.isDocumentKey(_r17)) throw new L(T, "Invalid query. When querying a collection group by FieldPath.documentId(), the value provided must result in a valid document path, but '".concat(_r17, "' is not because it has an odd number of segments (").concat(_r17.length, ")."));
    return qt(t, new Z(_r17));
  }

  if (e instanceof ue) return qt(t, e._key);
  throw new L(T, "Invalid query. When querying with FieldPath.documentId(), you must provide a valid string or a DocumentReference, but it was: ".concat(et(e), "."));
}
/**
 * Validates that the value passed into a disjunctive filter satisfies all
 * array requirements.
 */


function wr(t, n) {
  if (!Array.isArray(t) || 0 === t.length) throw new L(T, "Invalid Query. A non-empty array is required for '".concat(n.toString(), "' filters."));
  if (t.length > 10) throw new L(T, "Invalid Query. '".concat(n.toString(), "' filters support a maximum of 10 elements in the value array."));
}

function mr(t, n, e) {
  if (!e.isEqual(n)) throw new L(T, "Invalid query. You have a where filter with an inequality (<, <=, !=, not-in, >, or >=) on field '".concat(n.toString(), "' and so you must also use '").concat(n.toString(), "' as your first argument to orderBy(), but your first orderBy() is on field '").concat(e.toString(), "' instead."));
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Converts Firestore's internal types to the JavaScript types that we expose
 * to the user.
 *
 * @internal
 */

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Converts custom model object of type T into `DocumentData` by applying the
 * converter if it exists.
 *
 * This function is used when converting user objects to `DocumentData`
 * because we want to provide the user with a more specific error message if
 * their `set()` or fails due to invalid data originating from a `toFirestore()`
 * call.
 */


function pr(t, n, e) {
  var r; // Cast to `any` in order to satisfy the union type constraint on
  // toFirestore().
  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  return r = t ? e && (e.merge || e.mergeFields) ? t.toFirestore(n, e) : t.toFirestore(n) : n, r;
}

var yr = /*#__PURE__*/function (_ref4) {
  _inherits(yr, _ref4);

  var _super34 = _createSuper(yr);

  function yr(t) {
    var _this33;

    _classCallCheck(this, yr);

    _this33 = _super34.call(this), _this33.firestore = t;
    return _this33;
  }

  _createClass(yr, [{
    key: "convertBytes",
    value: function convertBytes(t) {
      return new ye(t);
    }
  }, {
    key: "convertReference",
    value: function convertReference(t) {
      var n = this.convertDocumentKey(t, this.firestore._databaseId);
      return new ue(this.firestore,
      /* converter= */
      null, n);
    }
  }]);

  return yr;
}( /*#__PURE__*/function () {
  function _class4() {
    _classCallCheck(this, _class4);
  }

  _createClass(_class4, [{
    key: "convertValue",
    value: function convertValue(t) {
      var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "none";

      switch (Nt(t)) {
        case 0
        /* NullValue */
        :
          return null;

        case 1
        /* BooleanValue */
        :
          return t.booleanValue;

        case 2
        /* NumberValue */
        :
          return Tt(t.integerValue || t.doubleValue);

        case 3
        /* TimestampValue */
        :
          return this.convertTimestamp(t.timestampValue);

        case 4
        /* ServerTimestampValue */
        :
          return this.convertServerTimestamp(t, n);

        case 5
        /* StringValue */
        :
          return t.stringValue;

        case 6
        /* BlobValue */
        :
          return this.convertBytes(At(t.bytesValue));

        case 7
        /* RefValue */
        :
          return this.convertReference(t.referenceValue);

        case 8
        /* GeoPointValue */
        :
          return this.convertGeoPoint(t.geoPointValue);

        case 9
        /* ArrayValue */
        :
          return this.convertArray(t.arrayValue, n);

        case 10
        /* ObjectValue */
        :
          return this.convertObject(t.mapValue, n);

        default:
          throw _();
      }
    }
  }, {
    key: "convertObject",
    value: function convertObject(t, n) {
      var _this34 = this;

      var e = {};
      return gt(t.fields, function (t, r) {
        e[t] = _this34.convertValue(r, n);
      }), e;
    }
  }, {
    key: "convertGeoPoint",
    value: function convertGeoPoint(t) {
      return new ge(Tt(t.latitude), Tt(t.longitude));
    }
  }, {
    key: "convertArray",
    value: function convertArray(t, n) {
      var _this35 = this;

      return (t.values || []).map(function (t) {
        return _this35.convertValue(t, n);
      });
    }
  }, {
    key: "convertServerTimestamp",
    value: function convertServerTimestamp(t, n) {
      switch (n) {
        case "previous":
          var _e42 = Rt(t);

          return null == _e42 ? null : this.convertValue(_e42, n);

        case "estimate":
          return this.convertTimestamp(Vt(t));

        default:
          return null;
      }
    }
  }, {
    key: "convertTimestamp",
    value: function convertTimestamp(t) {
      var n = It(t);
      return new pt(n.seconds, n.nanos);
    }
  }, {
    key: "convertDocumentKey",
    value: function convertDocumentKey(t, n) {
      var e = Y.fromString(t);
      g(Wn(e));
      var r = new G(e.get(1), e.get(3)),
          s = new Z(e.popFirst(5));
      return r.isEqual(n) || // TODO(b/64130202): Somehow support foreign references.
      m("Document ".concat(s, " contains a document reference within a different database (").concat(r.projectId, "/").concat(r.database, ") which is not supported. It will be treated as a reference in the current database (").concat(n.projectId, "/").concat(n.database, ") instead.")), s;
    }
  }]);

  return _class4;
}());
/**
 * Reads the document referred to by the specified document reference.
 *
 * All documents are directly fetched from the server, even if the document was
 * previously read or modified. Recent modifications are only reflected in the
 * retrieved `DocumentSnapshot` if they have already been applied by the
 * backend. If the client is offline, the read fails. If you like to use
 * caching or see local modifications, please use the full Firestore SDK.
 *
 * @param reference - The reference of the document to fetch.
 * @returns A Promise resolved with a `DocumentSnapshot` containing the current
 * document contents.
 */


function _r(t) {
  var n = te((t = rt(t, ue)).firestore),
      e = new yr(t.firestore);
  return Jn(n, [t._key]).then(function (n) {
    g(1 === n.length);
    var r = n[0];
    return new We(t.firestore, e, t._key, r.isFoundDocument() ? r : null, t.converter);
  });
}
/**
 * Executes the query and returns the results as a {@link QuerySnapshot}.
 *
 * All queries are executed directly by the server, even if the the query was
 * previously executed. Recent modifications are only reflected in the retrieved
 * results if they have already been applied by the backend. If the client is
 * offline, the operation fails. To see previously cached result and local
 * modifications, use the full Firestore SDK.
 *
 * @param query - The `Query` to execute.
 * @returns A Promise that will be resolved with the results of the query.
 */


function gr(t) {
  !function (t) {
    if (sn(t) && 0 === t.explicitOrderBy.length) throw new L(q, "limitToLast() queries require specifying at least one orderBy() clause");
  }((t = rt(t, ce))._query);
  var n = te(t.firestore),
      e = new yr(t.firestore);
  return Zn(n, t._query).then(function (n) {
    var r = n.map(function (n) {
      return new Ge(t.firestore, e, n.key, n, t.converter);
    });
    return sn(t._query) && // Limit to last queries reverse the orderBy constraint that was
    // specified by the user. As such, we need to reverse the order of the
    // results to return the documents in the expected order.
    r.reverse(), new He(t, r);
  });
}

function br(t, n, e) {
  var r = pr((t = rt(t, ue)).converter, n, e),
      s = Re(Pe(t.firestore), "setDoc", t._key, r, null !== t.converter, e);
  return Kn(te(t.firestore), [s.toMutation(t._key, gn.none())]);
}

function vr(t, n, e) {
  var s = Pe((t = rt(t, ue)).firestore); // For Compat types, we have to "extract" the underlying types before
  // performing validation.

  var i;

  for (var _len13 = arguments.length, r = new Array(_len13 > 3 ? _len13 - 3 : 0), _key13 = 3; _key13 < _len13; _key13++) {
    r[_key13 - 3] = arguments[_key13];
  }

  i = "string" == typeof (n = (0, _util.getModularInstance)(n)) || n instanceof me ? xe(s, "updateDoc", t._key, n, e, r) : qe(s, "updateDoc", t._key, n);
  return Kn(te(t.firestore), [i.toMutation(t._key, gn.exists(!0))]);
}
/**
 * Deletes the document referred to by the specified `DocumentReference`.
 *
 * The deletion will only be reflected in document reads that occur after the
 * returned promise resolves. If the client is offline, the
 * delete fails. If you would like to see local modifications or buffer writes
 * until the client is online, use the full Firestore SDK.
 *
 * @param reference - A reference to the document to delete.
 * @returns A `Promise` resolved once the document has been successfully
 * deleted from the backend.
 */


function Er(t) {
  return Kn(te((t = rt(t, ue)).firestore), [new In(t._key, gn.none())]);
}
/**
 * Add a new document to specified `CollectionReference` with the given data,
 * assigning it a document ID automatically.
 *
 * The result of this write will only be reflected in document reads that occur
 * after the returned promise resolves. If the client is offline, the
 * write fails. If you would like to see local modifications or buffer writes
 * until the client is online, use the full Firestore SDK.
 *
 * @param reference - A reference to the collection to add this document to.
 * @param data - An Object containing the data for the new document.
 * @returns A `Promise` resolved with a `DocumentReference` pointing to the
 * newly created document after it has been written to the backend.
 */


function Ir(t, n) {
  var e = fe(t = rt(t, ae)),
      r = pr(t.converter, n),
      s = Re(Pe(t.firestore), "addDoc", e._key, r, null !== e.converter, {});
  return Kn(te(t.firestore), [s.toMutation(e._key, gn.exists(!1))]).then(function () {
    return e;
  });
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Returns a sentinel for use with {@link @firebase/firestore/lite#(updateDoc:1)} or
 * {@link @firebase/firestore/lite#(setDoc:1)} with `{merge: true}` to mark a field for deletion.
 */


function Tr() {
  return new Ve("deleteField");
}
/**
 * Returns a sentinel used with {@link @firebase/firestore/lite#(setDoc:1)} or {@link @firebase/firestore/lite#(updateDoc:1)} to
 * include a server-generated timestamp in the written data.
 */


function Ar() {
  return new De("serverTimestamp");
}
/**
 * Returns a special value that can be used with {@link @firebase/firestore/lite#(setDoc:1)} or {@link
 * @firebase/firestore/lite#(updateDoc:1)} that tells the server to union the given elements with any array
 * value that already exists on the server. Each specified element that doesn't
 * already exist in the array will be added to the end. If the field being
 * modified is not already an array it will be overwritten with an array
 * containing exactly the specified elements.
 *
 * @param elements - The elements to union into the array.
 * @returns The `FieldValue` sentinel for use in a call to `setDoc()` or
 * `updateDoc()`.
 */


function Pr() {
  for (var _len14 = arguments.length, t = new Array(_len14), _key14 = 0; _key14 < _len14; _key14++) {
    t[_key14] = arguments[_key14];
  }

  // NOTE: We don't actually parse the data until it's used in set() or
  // update() since we'd need the Firestore instance to do this.
  return new $e("arrayUnion", t);
}
/**
 * Returns a special value that can be used with {@link (setDoc:1)} or {@link
 * updateDoc:1} that tells the server to remove the given elements from any
 * array value that already exists on the server. All instances of each element
 * specified will be removed from the array. If the field being modified is not
 * already an array it will be overwritten with an empty array.
 *
 * @param elements - The elements to remove from the array.
 * @returns The `FieldValue` sentinel for use in a call to `setDoc()` or
 * `updateDoc()`
 */


function Rr() {
  for (var _len15 = arguments.length, t = new Array(_len15), _key15 = 0; _key15 < _len15; _key15++) {
    t[_key15] = arguments[_key15];
  }

  // NOTE: We don't actually parse the data until it's used in set() or
  // update() since we'd need the Firestore instance to do this.
  return new Fe("arrayRemove", t);
}
/**
 * Returns a special value that can be used with {@link @firebase/firestore/lite#(setDoc:1)} or {@link
 * @firebase/firestore/lite#(updateDoc:1)} that tells the server to increment the field's current value by
 * the given value.
 *
 * If either the operand or the current field value uses floating point
 * precision, all arithmetic follows IEEE 754 semantics. If both values are
 * integers, values outside of JavaScript's safe number range
 * (`Number.MIN_SAFE_INTEGER` to `Number.MAX_SAFE_INTEGER`) are also subject to
 * precision loss. Furthermore, once processed by the Firestore backend, all
 * integer operations are capped between -2^63 and 2^63-1.
 *
 * If the current field value is not of type `number`, or if the field does not
 * yet exist, the transformation sets the field to the given value.
 *
 * @param n - The value to increment by.
 * @returns The `FieldValue` sentinel for use in a call to `setDoc()` or
 * `updateDoc()`
 */


function Vr(t) {
  return new Se("increment", t);
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * A write batch, used to perform multiple writes as a single atomic unit.
 *
 * A `WriteBatch` object can be acquired by calling {@link writeBatch}. It
 * provides methods for adding writes to the write batch. None of the writes
 * will be committed (or visible locally) until {@link WriteBatch.commit} is
 * called.
 */


var Nr = /*#__PURE__*/function () {
  /** @hideconstructor */
  function Nr(t, n) {
    _classCallCheck(this, Nr);

    this._firestore = t, this._commitHandler = n, this._mutations = [], this._committed = !1, this._dataReader = Pe(t);
  }

  _createClass(Nr, [{
    key: "set",
    value: function set(t, n, e) {
      this._verifyNotCommitted();

      var r = Dr(t, this._firestore),
          s = pr(r.converter, n, e),
          i = Re(this._dataReader, "WriteBatch.set", r._key, s, null !== r.converter, e);
      return this._mutations.push(i.toMutation(r._key, gn.none())), this;
    }
  }, {
    key: "update",
    value: function update(t, n, e) {
      this._verifyNotCommitted();

      var s = Dr(t, this._firestore); // For Compat types, we have to "extract" the underlying types before
      // performing validation.

      var i;

      for (var _len16 = arguments.length, r = new Array(_len16 > 3 ? _len16 - 3 : 0), _key16 = 3; _key16 < _len16; _key16++) {
        r[_key16 - 3] = arguments[_key16];
      }

      return i = "string" == typeof (n = (0, _util.getModularInstance)(n)) || n instanceof me ? xe(this._dataReader, "WriteBatch.update", s._key, n, e, r) : qe(this._dataReader, "WriteBatch.update", s._key, n), this._mutations.push(i.toMutation(s._key, gn.exists(!0))), this;
    }
    /**
     * Deletes the document referred to by the provided {@link DocumentReference}.
     *
     * @param documentRef - A reference to the document to be deleted.
     * @returns This `WriteBatch` instance. Used for chaining method calls.
     */

  }, {
    key: "delete",
    value: function _delete(t) {
      this._verifyNotCommitted();

      var n = Dr(t, this._firestore);
      return this._mutations = this._mutations.concat(new In(n._key, gn.none())), this;
    }
    /**
     * Commits all of the writes in this write batch as a single atomic unit.
     *
     * The result of these writes will only be reflected in document reads that
     * occur after the returned promise resolves. If the client is offline, the
     * write fails. If you would like to see local modifications or buffer writes
     * until the client is online, use the full Firestore SDK.
     *
     * @returns A `Promise` resolved once all of the writes in the batch have been
     * successfully written to the backend as an atomic unit (note that it won't
     * resolve while you're offline).
     */

  }, {
    key: "commit",
    value: function commit() {
      return this._verifyNotCommitted(), this._committed = !0, this._mutations.length > 0 ? this._commitHandler(this._mutations) : Promise.resolve();
    }
  }, {
    key: "_verifyNotCommitted",
    value: function _verifyNotCommitted() {
      if (this._committed) throw new L($, "A write batch can no longer be used after commit() has been called.");
    }
  }]);

  return Nr;
}();

exports.WriteBatch = Nr;

function Dr(t, n) {
  if ((t = (0, _util.getModularInstance)(t)).firestore !== n) throw new L(T, "Provided document reference is from a different Firestore instance.");
  return t;
}
/**
 * Creates a write batch, used for performing multiple writes as a single
 * atomic operation. The maximum number of writes allowed in a single WriteBatch
 * is 500.
 *
 * The result of these writes will only be reflected in document reads that
 * occur after the returned promise resolves. If the client is offline, the
 * write fails. If you would like to see local modifications or buffer writes
 * until the client is online, use the full Firestore SDK.
 *
 * @returns A `WriteBatch` that can be used to atomically execute multiple
 * writes.
 */


function $r(t) {
  var n = te(t = rt(t, ee));
  return new Nr(t, function (t) {
    return Kn(n, t);
  });
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Internal transaction object responsible for accumulating the mutations to
 * perform and the base versions for any documents read.
 */


var Fr = /*#__PURE__*/function () {
  function Fr(t) {
    _classCallCheck(this, Fr);

    this.datastore = t, // The version of each document that was read during this transaction.
    this.readVersions = new Map(), this.mutations = [], this.committed = !1,
    /**
     * A deferred usage error that occurred previously in this transaction that
     * will cause the transaction to fail once it actually commits.
     */
    this.lastWriteError = null,
    /**
     * Set of documents that have been written in the transaction.
     *
     * When there's more than one write to the same key in a transaction, any
     * writes after the first are handled differently.
     */
    this.writtenDocs = new Set();
  }

  _createClass(Fr, [{
    key: "lookup",
    value: function () {
      var _lookup = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(t) {
        var _this36 = this;

        var n;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!(this.ensureCommitNotCalled(), this.mutations.length > 0)) {
                  _context2.next = 2;
                  break;
                }

                throw new L(T, "Firestore transactions require all reads to be executed before all writes.");

              case 2:
                _context2.next = 4;
                return Jn(this.datastore, t);

              case 4:
                n = _context2.sent;
                return _context2.abrupt("return", (n.forEach(function (t) {
                  return _this36.recordVersion(t);
                }), n));

              case 6:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function lookup(_x11) {
        return _lookup.apply(this, arguments);
      }

      return lookup;
    }()
  }, {
    key: "set",
    value: function set(t, n) {
      this.write(n.toMutation(t, this.precondition(t))), this.writtenDocs.add(t.toString());
    }
  }, {
    key: "update",
    value: function update(t, n) {
      try {
        this.write(n.toMutation(t, this.preconditionForUpdate(t)));
      } catch (t) {
        this.lastWriteError = t;
      }

      this.writtenDocs.add(t.toString());
    }
  }, {
    key: "delete",
    value: function _delete(t) {
      this.write(new In(t, this.precondition(t))), this.writtenDocs.add(t.toString());
    }
  }, {
    key: "commit",
    value: function () {
      var _commit = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var _this37 = this;

        var t;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!(this.ensureCommitNotCalled(), this.lastWriteError)) {
                  _context3.next = 2;
                  break;
                }

                throw this.lastWriteError;

              case 2:
                t = this.readVersions; // For each mutation, note that the doc was written.

                this.mutations.forEach(function (n) {
                  t.delete(n.key.toString());
                });
                // For each document that was read but not written to, we want to perform
                // a `verify` operation.
                t.forEach(function (t, n) {
                  var e = Z.fromPath(n);

                  _this37.mutations.push(new Tn(e, _this37.precondition(e)));
                });
                _context3.next = 7;
                return Kn(this.datastore, this.mutations);

              case 7:
                this.committed = !0;

              case 8:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function commit() {
        return _commit.apply(this, arguments);
      }

      return commit;
    }()
  }, {
    key: "recordVersion",
    value: function recordVersion(t) {
      var n;
      if (t.isFoundDocument()) n = t.version;else {
        if (!t.isNoDocument()) throw _(); // For deleted docs, we must use baseVersion 0 when we overwrite them.

        n = yt.min();
      }
      var e = this.readVersions.get(t.key.toString());

      if (e) {
        if (!n.isEqual(e)) // This transaction will fail no matter what.
          throw new L(F, "Document version changed between two reads.");
      } else this.readVersions.set(t.key.toString(), n);
    }
    /**
     * Returns the version of this document when it was read in this transaction,
     * as a precondition, or no precondition if it was not read.
     */

  }, {
    key: "precondition",
    value: function precondition(t) {
      var n = this.readVersions.get(t.toString());
      return !this.writtenDocs.has(t.toString()) && n ? gn.updateTime(n) : gn.none();
    }
    /**
     * Returns the precondition for a document if the operation is an update.
     */

  }, {
    key: "preconditionForUpdate",
    value: function preconditionForUpdate(t) {
      var n = this.readVersions.get(t.toString()); // The first time a document is written, we want to take into account the
      // read time and existence

      if (!this.writtenDocs.has(t.toString()) && n) {
        if (n.isEqual(yt.min())) // The document doesn't exist, so fail the transaction.
          // This has to be validated locally because you can't send a
          // precondition that a document does not exist without changing the
          // semantics of the backend write to be an insert. This is the reverse
          // of what we want, since we want to assert that the document doesn't
          // exist but then send the update and have it fail. Since we can't
          // express that to the backend, we have to validate locally.
          // Note: this can change once we can send separate verify writes in the
          // transaction.
          throw new L(T, "Can't update a document that doesn't exist."); // Document exists, base precondition on document update time.

        return gn.updateTime(n);
      } // Document was not read, so we just use the preconditions for a blind
      // update.


      return gn.exists(!0);
    }
  }, {
    key: "write",
    value: function write(t) {
      this.ensureCommitNotCalled(), this.mutations.push(t);
    }
  }, {
    key: "ensureCommitNotCalled",
    value: function ensureCommitNotCalled() {}
  }]);

  return Fr;
}();
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * TransactionRunner encapsulates the logic needed to run and retry transactions
 * with backoff.
 */


var Sr = /*#__PURE__*/function () {
  function Sr(t, n, e, r) {
    _classCallCheck(this, Sr);

    this.asyncQueue = t, this.datastore = n, this.updateFunction = e, this.deferred = r, this.Et = 5, this.It = new Hn(this.asyncQueue, "transaction_retry"
    /* TransactionRetry */
    );
  }
  /** Runs the transaction and sets the result on deferred. */


  _createClass(Sr, [{
    key: "run",
    value: function run() {
      this.Et -= 1, this.Tt();
    }
  }, {
    key: "Tt",
    value: function Tt() {
      var _this38 = this;

      this.It.W( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        var t, n;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                t = new Fr(_this38.datastore), n = _this38.At(t);
                n && n.then(function (n) {
                  _this38.asyncQueue.enqueueAndForget(function () {
                    return t.commit().then(function () {
                      _this38.deferred.resolve(n);
                    }).catch(function (t) {
                      _this38.Pt(t);
                    });
                  });
                }).catch(function (t) {
                  _this38.Pt(t);
                });

              case 2:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      })));
    }
  }, {
    key: "At",
    value: function At(t) {
      try {
        var _n29 = this.updateFunction(t);

        return !it(_n29) && _n29.catch && _n29.then ? _n29 : (this.deferred.reject(Error("Transaction callback must return a Promise")), null);
      } catch (t) {
        // Do not retry errors thrown by user provided updateFunction.
        return this.deferred.reject(t), null;
      }
    }
  }, {
    key: "Pt",
    value: function Pt(t) {
      var _this39 = this;

      this.Et > 0 && this.Rt(t) ? (this.Et -= 1, this.asyncQueue.enqueueAndForget(function () {
        return _this39.Tt(), Promise.resolve();
      })) : this.deferred.reject(t);
    }
  }, {
    key: "Rt",
    value: function Rt(t) {
      if ("FirebaseError" === t.name) {
        // In transactions, the backend will fail outdated reads with FAILED_PRECONDITION and
        // non-matching document versions with ABORTED. These errors should be retried.
        var _n30 = t.code;
        return "aborted" === _n30 || "failed-precondition" === _n30 || !
        /**
        * Determines whether an error code represents a permanent error when received
        * in response to a non-write operation.
        *
        * See isPermanentWriteError for classifying write errors.
        */
        function (t) {
          switch (t) {
            case v:
              return _();

            case E:
            case I:
            case A:
            case D:
            case x:
            case O: // Unauthenticated means something went wrong with our token and we need
            // to retry with new credentials which will happen automatically.

            case N:
              return !1;

            case T:
            case P:
            case R:
            case V:
            case $: // Aborted might be retried in some scenarios, but that is dependant on
            // the context and should handled individually by the calling code.
            // See https://cloud.google.com/apis/design/errors.

            case F:
            case S:
            case q:
            case C:
              return !0;

            default:
              return _();
          }
        }(_n30);
      }

      return !1;
    }
  }]);

  return Sr;
}();
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/** The Platform's 'document' implementation or null if not available. */


function qr() {
  // `document` is not always available, e.g. in ReactNative and WebWorkers.
  // eslint-disable-next-line no-restricted-globals
  return "undefined" != typeof document ? document : null;
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Represents an operation scheduled to be run in the future on an AsyncQueue.
 *
 * It is created via DelayedOperation.createAndSchedule().
 *
 * Supports cancellation (via cancel()) and early execution (via skipDelay()).
 *
 * Note: We implement `PromiseLike` instead of `Promise`, as the `Promise` type
 * in newer versions of TypeScript defines `finally`, which is not available in
 * IE.
 */


var xr = /*#__PURE__*/function () {
  function xr(t, n, e, r, s) {
    _classCallCheck(this, xr);

    this.asyncQueue = t, this.timerId = n, this.targetTimeMs = e, this.op = r, this.removalCallback = s, this.deferred = new U(), this.then = this.deferred.promise.then.bind(this.deferred.promise), // It's normal for the deferred promise to be canceled (due to cancellation)
    // and so we attach a dummy catch callback to avoid
    // 'UnhandledPromiseRejectionWarning' log spam.
    this.deferred.promise.catch(function (t) {});
  }
  /**
   * Creates and returns a DelayedOperation that has been scheduled to be
   * executed on the provided asyncQueue after the provided delayMs.
   *
   * @param asyncQueue - The queue to schedule the operation on.
   * @param id - A Timer ID identifying the type of operation this is.
   * @param delayMs - The delay (ms) before the operation should be scheduled.
   * @param op - The operation to run.
   * @param removalCallback - A callback to be called synchronously once the
   *   operation is executed or canceled, notifying the AsyncQueue to remove it
   *   from its delayedOperations list.
   *   PORTING NOTE: This exists to prevent making removeDelayedOperation() and
   *   the DelayedOperation class public.
   */


  _createClass(xr, [{
    key: "start",
    value:
    /**
     * Starts the timer. This is called immediately after construction by
     * createAndSchedule().
     */
    function start(t) {
      var _this40 = this;

      this.timerHandle = setTimeout(function () {
        return _this40.handleDelayElapsed();
      }, t);
    }
    /**
     * Queues the operation to run immediately (if it hasn't already been run or
     * canceled).
     */

  }, {
    key: "skipDelay",
    value: function skipDelay() {
      return this.handleDelayElapsed();
    }
    /**
     * Cancels the operation if it hasn't already been executed or canceled. The
     * promise will be rejected.
     *
     * As long as the operation has not yet been run, calling cancel() provides a
     * guarantee that the operation will not be run.
     */

  }, {
    key: "cancel",
    value: function cancel(t) {
      null !== this.timerHandle && (this.clearTimeout(), this.deferred.reject(new L(E, "Operation cancelled" + (t ? ": " + t : ""))));
    }
  }, {
    key: "handleDelayElapsed",
    value: function handleDelayElapsed() {
      var _this41 = this;

      this.asyncQueue.enqueueAndForget(function () {
        return null !== _this41.timerHandle ? (_this41.clearTimeout(), _this41.op().then(function (t) {
          return _this41.deferred.resolve(t);
        })) : Promise.resolve();
      });
    }
  }, {
    key: "clearTimeout",
    value: function (_clearTimeout) {
      function clearTimeout() {
        return _clearTimeout.apply(this, arguments);
      }

      clearTimeout.toString = function () {
        return _clearTimeout.toString();
      };

      return clearTimeout;
    }(function () {
      null !== this.timerHandle && (this.removalCallback(this), clearTimeout(this.timerHandle), this.timerHandle = null);
    })
  }], [{
    key: "createAndSchedule",
    value: function createAndSchedule(t, n, e, r, s) {
      var i = Date.now() + e,
          o = new xr(t, n, i, r, s);
      return o.start(e), o;
    }
  }]);

  return xr;
}();
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


var Or = /*#__PURE__*/function () {
  function Or() {
    var _this42 = this;

    _classCallCheck(this, Or);

    // The last promise in the queue.
    this.Vt = Promise.resolve(), // A list of retryable operations. Retryable operations are run in order and
    // retried with backoff.
    this.Nt = [], // Is this AsyncQueue being shut down? Once it is set to true, it will not
    // be changed again.
    this.Dt = !1, // Operations scheduled to be queued in the future. Operations are
    // automatically removed after they are run or canceled.
    this.$t = [], // visible for testing
    this.Ft = null, // Flag set while there's an outstanding AsyncQueue operation, used for
    // assertion sanity-checks.
    this.St = !1, // Enabled during shutdown on Safari to prevent future access to IndexedDB.
    this.qt = !1, // List of TimerIds to fast-forward delays for.
    this.xt = [], // Backoff timer used to schedule retries for retryable operations
    this.It = new Hn(this, "async_queue_retry"
    /* AsyncQueueRetry */
    ), // Visibility handler that triggers an immediate retry of all retryable
    // operations. Meant to speed up recovery when we regain file system access
    // after page comes into foreground.
    this.Ot = function () {
      var t = qr();
      t && w("AsyncQueue", "Visibility state changed to " + t.visibilityState), _this42.It.H();
    };
    var t = qr();
    t && "function" == typeof t.addEventListener && t.addEventListener("visibilitychange", this.Ot);
  }

  _createClass(Or, [{
    key: "isShuttingDown",
    get: function get() {
      return this.Dt;
    }
    /**
     * Adds a new operation to the queue without waiting for it to complete (i.e.
     * we ignore the Promise result).
     */

  }, {
    key: "enqueueAndForget",
    value: function enqueueAndForget(t) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.enqueue(t);
    }
  }, {
    key: "enqueueAndForgetEvenWhileRestricted",
    value: function enqueueAndForgetEvenWhileRestricted(t) {
      this.Ct(), // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.Lt(t);
    }
  }, {
    key: "enterRestrictedMode",
    value: function enterRestrictedMode(t) {
      if (!this.Dt) {
        this.Dt = !0, this.qt = t || !1;

        var _n31 = qr();

        _n31 && "function" == typeof _n31.removeEventListener && _n31.removeEventListener("visibilitychange", this.Ot);
      }
    }
  }, {
    key: "enqueue",
    value: function enqueue(t) {
      var _this43 = this;

      if (this.Ct(), this.Dt) // Return a Promise which never resolves.
        return new Promise(function () {}); // Create a deferred Promise that we can return to the callee. This
      // allows us to return a "hanging Promise" only to the callee and still
      // advance the queue even when the operation is not run.

      var n = new U();
      return this.Lt(function () {
        return _this43.Dt && _this43.qt ? Promise.resolve() : (t().then(n.resolve, n.reject), n.promise);
      }).then(function () {
        return n.promise;
      });
    }
  }, {
    key: "enqueueRetryable",
    value: function enqueueRetryable(t) {
      var _this44 = this;

      this.enqueueAndForget(function () {
        return _this44.Nt.push(t), _this44.Ut();
      });
    }
    /**
     * Runs the next operation from the retryable queue. If the operation fails,
     * reschedules with backoff.
     */

  }, {
    key: "Ut",
    value: function () {
      var _Ut = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
        var _this45 = this;

        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (!(0 !== this.Nt.length)) {
                  _context5.next = 14;
                  break;
                }

                _context5.prev = 1;
                _context5.next = 4;
                return this.Nt[0]();

              case 4:
                this.Nt.shift();
                this.It.reset();
                _context5.next = 13;
                break;

              case 8:
                _context5.prev = 8;
                _context5.t0 = _context5["catch"](1);

                if (
                /**
                * @license
                * Copyright 2017 Google LLC
                *
                * Licensed under the Apache License, Version 2.0 (the "License");
                * you may not use this file except in compliance with the License.
                * You may obtain a copy of the License at
                *
                *   http://www.apache.org/licenses/LICENSE-2.0
                *
                * Unless required by applicable law or agreed to in writing, software
                * distributed under the License is distributed on an "AS IS" BASIS,
                * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                * See the License for the specific language governing permissions and
                * limitations under the License.
                */

                /** Verifies whether `e` is an IndexedDbTransactionError. */
                function (t) {
                  // Use name equality, as instanceof checks on errors don't work with errors
                  // that wrap other errors.
                  return "IndexedDbTransactionError" === t.name;
                }
                /**
                * @license
                * Copyright 2020 Google LLC
                *
                * Licensed under the Apache License, Version 2.0 (the "License");
                * you may not use this file except in compliance with the License.
                * You may obtain a copy of the License at
                *
                *   http://www.apache.org/licenses/LICENSE-2.0
                *
                * Unless required by applicable law or agreed to in writing, software
                * distributed under the License is distributed on an "AS IS" BASIS,
                * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                * See the License for the specific language governing permissions and
                * limitations under the License.
                */
                (_context5.t0)) {
                  _context5.next = 12;
                  break;
                }

                throw _context5.t0;

              case 12:
                // Failure will be handled by AsyncQueue
                w("AsyncQueue", "Operation failed with retryable error: " + _context5.t0);

              case 13:
                this.Nt.length > 0 && // If there are additional operations, we re-schedule `retryNextOp()`.
                // This is necessary to run retryable operations that failed during
                // their initial attempt since we don't know whether they are already
                // enqueued. If, for example, `op1`, `op2`, `op3` are enqueued and `op1`
                // needs to  be re-run, we will run `op1`, `op1`, `op2` using the
                // already enqueued calls to `retryNextOp()`. `op3()` will then run in the
                // call scheduled here.
                // Since `backoffAndRun()` cancels an existing backoff and schedules a
                // new backoff on every call, there is only ever a single additional
                // operation in the queue.
                this.It.W(function () {
                  return _this45.Ut();
                });

              case 14:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this, [[1, 8]]);
      }));

      function Ut() {
        return _Ut.apply(this, arguments);
      }

      return Ut;
    }()
  }, {
    key: "Lt",
    value: function Lt(t) {
      var _this46 = this;

      var n = this.Vt.then(function () {
        return _this46.St = !0, t().catch(function (t) {
          _this46.Ft = t, _this46.St = !1; // Re-throw the error so that this.tail becomes a rejected Promise and
          // all further attempts to chain (via .then) will just short-circuit
          // and return the rejected Promise.

          throw m("INTERNAL UNHANDLED ERROR: ",
          /**
          * Chrome includes Error.message in Error.stack. Other browsers do not.
          * This returns expected output of message + stack when available.
          * @param error - Error or FirestoreError
          */
          function (t) {
            var n = t.message || "";
            t.stack && (n = t.stack.includes(t.message) ? t.stack : t.message + "\n" + t.stack);
            return n;
          }
          /**
          * @license
          * Copyright 2020 Google LLC
          *
          * Licensed under the Apache License, Version 2.0 (the "License");
          * you may not use this file except in compliance with the License.
          * You may obtain a copy of the License at
          *
          *   http://www.apache.org/licenses/LICENSE-2.0
          *
          * Unless required by applicable law or agreed to in writing, software
          * distributed under the License is distributed on an "AS IS" BASIS,
          * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
          * See the License for the specific language governing permissions and
          * limitations under the License.
          */
          // TODO(mrschmidt) Consider using `BaseTransaction` as the base class in the
          // legacy SDK.

          /**
          * A reference to a transaction.
          *
          * The `Transaction` object passed to a transaction's `updateFunction` provides
          * the methods to read and write data within the transaction context. See
          * {@link runTransaction}.
          */
          (t)), t;
        }).then(function (t) {
          return _this46.St = !1, t;
        });
      });
      return this.Vt = n, n;
    }
  }, {
    key: "enqueueAfterDelay",
    value: function enqueueAfterDelay(t, n, e) {
      var _this47 = this;

      this.Ct(), // Fast-forward delays for timerIds that have been overriden.
      this.xt.indexOf(t) > -1 && (n = 0);
      var r = xr.createAndSchedule(this, t, n, e, function (t) {
        return _this47.jt(t);
      });
      return this.$t.push(r), r;
    }
  }, {
    key: "Ct",
    value: function Ct() {
      this.Ft && _();
    }
  }, {
    key: "verifyOperationInProgress",
    value: function verifyOperationInProgress() {}
    /**
     * Waits until all currently queued tasks are finished executing. Delayed
     * operations are not run.
     */

  }, {
    key: "kt",
    value: function () {
      var _kt = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
        var t;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                t = this.Vt;
                _context6.next = 3;
                return t;

              case 3:
                if (t !== this.Vt) {
                  _context6.next = 0;
                  break;
                }

              case 4:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function kt() {
        return _kt.apply(this, arguments);
      }

      return kt;
    }()
    /**
     * For Tests: Determine if a delayed operation with a particular TimerId
     * exists.
     */

  }, {
    key: "Mt",
    value: function Mt(t) {
      var _iterator11 = _createForOfIteratorHelper(this.$t),
          _step11;

      try {
        for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
          var _n32 = _step11.value;
          if (_n32.timerId === t) return !0;
        }
      } catch (err) {
        _iterator11.e(err);
      } finally {
        _iterator11.f();
      }

      return !1;
    }
    /**
     * For Tests: Runs some or all delayed operations early.
     *
     * @param lastTimerId - Delayed operations up to and including this TimerId
     * will be drained. Pass TimerId.All to run all delayed operations.
     * @returns a Promise that resolves once all operations have been run.
     */

  }, {
    key: "Bt",
    value: function Bt(t) {
      var _this48 = this;

      // Note that draining may generate more delayed ops, so we do that first.
      return this.kt().then(function () {
        // Run ops in the same order they'd run if they ran naturally.
        _this48.$t.sort(function (t, n) {
          return t.targetTimeMs - n.targetTimeMs;
        });

        var _iterator12 = _createForOfIteratorHelper(_this48.$t),
            _step12;

        try {
          for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
            var _n33 = _step12.value;
            if (_n33.skipDelay(), "all"
            /* All */
            !== t && _n33.timerId === t) break;
          }
        } catch (err) {
          _iterator12.e(err);
        } finally {
          _iterator12.f();
        }

        return _this48.kt();
      });
    }
    /**
     * For Tests: Skip all subsequent delays for a timer id.
     */

  }, {
    key: "Qt",
    value: function Qt(t) {
      this.xt.push(t);
    }
    /** Called once a DelayedOperation is run or canceled. */

  }, {
    key: "jt",
    value: function jt(t) {
      // NOTE: indexOf / slice are O(n), but delayedOperations is expected to be small.
      var n = this.$t.indexOf(t);
      this.$t.splice(n, 1);
    }
  }]);

  return Or;
}();

var Cr = /*#__PURE__*/function () {
  /** @hideconstructor */
  function Cr(t, n) {
    _classCallCheck(this, Cr);

    this._firestore = t, this._transaction = n, this._dataReader = Pe(t);
  }
  /**
   * Reads the document referenced by the provided {@link DocumentReference}.
   *
   * @param documentRef - A reference to the document to be read.
   * @returns A `DocumentSnapshot` with the read data.
   */


  _createClass(Cr, [{
    key: "get",
    value: function get(t) {
      var _this49 = this;

      var n = Dr(t, this._firestore),
          e = new yr(this._firestore);
      return this._transaction.lookup([n._key]).then(function (t) {
        if (!t || 1 !== t.length) return _();
        var r = t[0];
        if (r.isFoundDocument()) return new We(_this49._firestore, e, r.key, r, n.converter);
        if (r.isNoDocument()) return new We(_this49._firestore, e, n._key, null, n.converter);
        throw _();
      });
    }
  }, {
    key: "set",
    value: function set(t, n, e) {
      var r = Dr(t, this._firestore),
          s = pr(r.converter, n, e),
          i = Re(this._dataReader, "Transaction.set", r._key, s, null !== r.converter, e);
      return this._transaction.set(r._key, i), this;
    }
  }, {
    key: "update",
    value: function update(t, n, e) {
      var s = Dr(t, this._firestore); // For Compat types, we have to "extract" the underlying types before
      // performing validation.

      var i;

      for (var _len17 = arguments.length, r = new Array(_len17 > 3 ? _len17 - 3 : 0), _key17 = 3; _key17 < _len17; _key17++) {
        r[_key17 - 3] = arguments[_key17];
      }

      return i = "string" == typeof (n = (0, _util.getModularInstance)(n)) || n instanceof me ? xe(this._dataReader, "Transaction.update", s._key, n, e, r) : qe(this._dataReader, "Transaction.update", s._key, n), this._transaction.update(s._key, i), this;
    }
    /**
     * Deletes the document referred to by the provided {@link DocumentReference}.
     *
     * @param documentRef - A reference to the document to be deleted.
     * @returns This `Transaction` instance. Used for chaining method calls.
     */

  }, {
    key: "delete",
    value: function _delete(t) {
      var n = Dr(t, this._firestore);
      return this._transaction.delete(n._key), this;
    }
  }]);

  return Cr;
}();
/**
 * Executes the given `updateFunction` and then attempts to commit the changes
 * applied within the transaction. If any document read within the transaction
 * has changed, Cloud Firestore retries the `updateFunction`. If it fails to
 * commit after 5 attempts, the transaction fails.
 *
 * The maximum number of writes allowed in a single transaction is 500.
 *
 * @param firestore - A reference to the Firestore database to run this
 * transaction against.
 * @param updateFunction - The function to execute within the transaction
 * context.
 * @returns If the transaction completed successfully or was explicitly aborted
 * (the `updateFunction` returned a failed promise), the promise returned by the
 * `updateFunction `is returned here. Otherwise, if the transaction failed, a
 * rejected promise with the corresponding failure error is returned.
 */


exports.Transaction = Cr;

function Lr(t, n) {
  var e = te(t = rt(t, ee)),
      r = new U();
  return new Sr(new Or(), e, function (e) {
    return n(new Cr(t, e));
  }, r).run(), r.promise;
}
/**
 * Firestore Lite
 *
 * @remarks Firestore Lite is a small online-only SDK that allows read
 * and write access to your Firestore database. All operations connect
 * directly to the backend, and `onSnapshot()` APIs are not supported.
 * @packageDocumentation
 */


!function (t) {
  l = t;
}("".concat(_app.SDK_VERSION, "_lite")), (0, _app._registerComponent)(new _component.Component("firestore/lite", function (t, _ref6) {
  var n = _ref6.options;
  var e = t.getProvider("app").getImmediate(),
      r = new ee(e, new B(t.getProvider("auth-internal")));
  return n && r._setSettings(n), r;
}, "PUBLIC"
/* PUBLIC */
)), (0, _app.registerVersion)("firestore-lite", "3.0.2", "node");
},{"@firebase/app":"../../node_modules/@firebase/app/dist/index.esm2017.js","@firebase/component":"../../node_modules/@firebase/component/dist/index.esm.js","@firebase/logger":"../../node_modules/@firebase/logger/dist/index.esm.js","@firebase/util":"../../node_modules/@firebase/util/dist/index.esm.js"}],"../../node_modules/firebase/firestore/lite/dist/index.esm.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lite = require("@firebase/firestore/lite");

Object.keys(_lite).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _lite[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _lite[key];
    }
  });
});
},{"@firebase/firestore/lite":"../../node_modules/@firebase/firestore/dist/lite/index.browser.esm2017.js"}],"../../utils.js":[function(require,module,exports) {
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _require = require('firebase/app'),
    initializeApp = _require.initializeApp;

var _require2 = require('firebase/firestore/lite'),
    getFirestore = _require2.getFirestore,
    collection = _require2.collection,
    getDocs = _require2.getDocs,
    addDoc = _require2.addDoc,
    deleteDoc = _require2.deleteDoc,
    getDoc = _require2.getDoc,
    refEqual = _require2.refEqual;
/**
 * @param {void}
 * @returns {
 *  getFromDb: async function (count: number ): MetadataObjectType[]
 *  addToDb: async function (doc: MetadataObjectType[] | MetadataObjectType): DocumentReference
 * }
 */


function database(_x, _x2) {
  return _database.apply(this, arguments);
}

function _database() {
  _database = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(projectId, collectionName) {
    var databaseConfig, app, db, colDb, getFromDb, _getFromDb, addToDb, _addToDb;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _addToDb = function _addToDb3() {
              _addToDb = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(doc) {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.next = 2;
                        return addDoc(colDb, doc);

                      case 2:
                        return _context2.abrupt("return", _context2.sent);

                      case 3:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              }));
              return _addToDb.apply(this, arguments);
            };

            addToDb = function _addToDb2(_x4) {
              return _addToDb.apply(this, arguments);
            };

            _getFromDb = function _getFromDb3() {
              _getFromDb = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(count) {
                var newCol, snapShot, list;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        console.log(count); // TODOO

                        newCol = collection(db, collectionName);
                        _context.next = 4;
                        return getDocs(newCol);

                      case 4:
                        snapShot = _context.sent;
                        list = snapShot.docs.map(function (doc) {
                          return doc.data();
                        });
                        return _context.abrupt("return", list);

                      case 7:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));
              return _getFromDb.apply(this, arguments);
            };

            getFromDb = function _getFromDb2(_x3) {
              return _getFromDb.apply(this, arguments);
            };

            databaseConfig = {
              projectId: projectId,
              databaseURL: "https://".concat(projectId, ".firebaseio.com")
            };
            /**
             * Инициализирует админ сессию приложения
             */

            app = initializeApp(databaseConfig);
            db = getFirestore(app);
            colDb = collection(db, collectionName);
            /**
             * Получение списка из базы данных
             * @param {number} count
             * @returns {MetadataObjectType[]}
             */

            return _context3.abrupt("return", {
              getFromDb: getFromDb,
              addToDb: addToDb
            });

          case 9:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _database.apply(this, arguments);
}

module.exports = {
  database: database
};
},{"firebase/app":"../../node_modules/firebase/app/dist/index.esm.js","firebase/firestore/lite":"../../node_modules/firebase/firestore/lite/dist/index.esm.js"}],"index.js":[function(require,module,exports) {
"use strict";

require("regenerator-runtime/runtime");

var _utils = require("./utils");

var _utils2 = require("../../utils");

var _config = _interopRequireDefault(require("./config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var firebaseConfig = (0, _config.default)('firebase');
var FIREBASE_PROJECT_ID = firebaseConfig.FIREBASE_PROJECT_ID,
    FIRESTORE_COLLECTION_NAME = firebaseConfig.FIRESTORE_COLLECTION_NAME;

var _getConfig = (0, _config.default)("development" || 'development'),
    networkId = _getConfig.networkId;
/**
 * Обработка нажания на кнопу Получить
 */


var button = document.querySelector('#send');
var input = document.querySelector('#count');
button.addEventListener('click', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
  var db, d;
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return (0, _utils2.database)(FIREBASE_PROJECT_ID, FIRESTORE_COLLECTION_NAME);

        case 2:
          db = _context.sent;
          _context.next = 5;
          return db.getFromDb(3);

        case 5:
          d = _context.sent;
          console.log(d);

        case 7:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
}))); // global variable used throughout

var currentGreeting;
var submitButton = document.querySelector('form button');

document.querySelector('form').onsubmit = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(event) {
    var _event$target$element, fieldset, greeting;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            event.preventDefault(); // get elements from the form using their id attribute

            _event$target$element = event.target.elements, fieldset = _event$target$element.fieldset, greeting = _event$target$element.greeting; // disable the form while the value gets updated on-chain

            fieldset.disabled = true;
            _context2.prev = 3;
            _context2.next = 6;
            return window.contract.set_greeting({
              // pass the value that the user entered in the greeting field
              message: greeting.value
            });

          case 6:
            _context2.next = 12;
            break;

          case 8:
            _context2.prev = 8;
            _context2.t0 = _context2["catch"](3);
            alert('Something went wrong! ' + 'Maybe you need to sign out and back in? ' + 'Check your browser console for more info.');
            throw _context2.t0;

          case 12:
            _context2.prev = 12;
            // re-enable the form, whether the call succeeded or failed
            fieldset.disabled = false;
            return _context2.finish(12);

          case 15:
            // disable the save button, since it now matches the persisted value
            submitButton.disabled = true; // update the greeting in the UI

            _context2.next = 18;
            return fetchGreeting();

          case 18:
            // show notification
            document.querySelector('[data-behavior=notification]').style.display = 'block'; // remove notification again after css animation completes
            // this allows it to be shown again next time the form is submitted

            setTimeout(function () {
              document.querySelector('[data-behavior=notification]').style.display = 'none';
            }, 11000);

          case 20:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[3, 8, 12, 15]]);
  }));

  return function (_x) {
    return _ref2.apply(this, arguments);
  };
}();

document.querySelector('input#greeting').oninput = function (event) {
  if (event.target.value !== currentGreeting) {
    submitButton.disabled = false;
  } else {
    submitButton.disabled = true;
  }
};

document.querySelector('#sign-in-button').onclick = _utils.login;
document.querySelector('#sign-out-button').onclick = _utils.logout; // Display the signed-out-flow container

function signedOutFlow() {
  document.querySelector('#signed-out-flow').style.display = 'block';
} // Displaying the signed in flow container and fill in account-specific data


function signedInFlow() {
  document.querySelector('#signed-in-flow').style.display = 'block';
  document.querySelectorAll('[data-behavior=account-id]').forEach(function (el) {
    el.innerText = window.accountId;
  }); // populate links in the notification box

  var accountLink = document.querySelector('[data-behavior=notification] a:nth-of-type(1)');
  accountLink.href = accountLink.href + window.accountId;
  accountLink.innerText = '@' + window.accountId;
  var contractLink = document.querySelector('[data-behavior=notification] a:nth-of-type(2)');
  contractLink.href = contractLink.href + window.contract.contractId;
  contractLink.innerText = '@' + window.contract.contractId; // update with selected networkId

  accountLink.href = accountLink.href.replace('testnet', networkId);
  contractLink.href = contractLink.href.replace('testnet', networkId);
  fetchGreeting();
} // update global currentGreeting variable; update DOM with it


function fetchGreeting() {
  return _fetchGreeting.apply(this, arguments);
} // `nearInitPromise` gets called on page load


function _fetchGreeting() {
  _fetchGreeting = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return contract.get_greeting({
              account_id: window.accountId
            });

          case 2:
            currentGreeting = _context3.sent;
            document.querySelectorAll('[data-behavior=greeting]').forEach(function (el) {
              // set divs, spans, etc
              el.innerText = currentGreeting; // set input elements

              el.value = currentGreeting;
            });

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _fetchGreeting.apply(this, arguments);
}

window.nearInitPromise = (0, _utils.initContract)().then(function () {
  if (window.walletConnection.isSignedIn()) signedInFlow();else signedOutFlow();
}).catch(console.error);
},{"regenerator-runtime/runtime":"../node_modules/regenerator-runtime/runtime.js","./utils":"utils.js","../../utils":"../../utils.js","./config":"config.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "41919" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/src.e31bb0bc.js.map