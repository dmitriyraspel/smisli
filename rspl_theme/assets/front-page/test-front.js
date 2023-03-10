var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.arrayIteratorImpl = function (a) {
    var d = 0;
    return function () {
        return d < a.length ? { done: !1, value: a[d++] } : { done: !0 };
    };
};
$jscomp.arrayIterator = function (a) {
    return { next: $jscomp.arrayIteratorImpl(a) };
};
$jscomp.makeIterator = function (a) {
    var d = "undefined" != typeof Symbol && Symbol.iterator && a[Symbol.iterator];
    return d ? d.call(a) : $jscomp.arrayIterator(a);
};
$jscomp.arrayFromIterator = function (a) {
    for (var d, f = []; !(d = a.next()).done; ) f.push(d.value);
    return f;
};
$jscomp.arrayFromIterable = function (a) {
    return a instanceof Array ? a : $jscomp.arrayFromIterator($jscomp.makeIterator(a));
};
$jscomp.getGlobal = function (a) {
    return "undefined" != typeof window && window === a ? a : "undefined" != typeof global && null != global ? global : a;
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.SIMPLE_FROUND_POLYFILL = !1;
$jscomp.defineProperty =
    $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties
        ? Object.defineProperty
        : function (a, d, f) {
              a != Array.prototype && a != Object.prototype && (a[d] = f.value);
          };
$jscomp.polyfill = function (a, d, f, c) {
    if (d) {
        f = $jscomp.global;
        a = a.split(".");
        for (c = 0; c < a.length - 1; c++) {
            var g = a[c];
            g in f || (f[g] = {});
            f = f[g];
        }
        a = a[a.length - 1];
        c = f[a];
        d = d(c);
        d != c && null != d && $jscomp.defineProperty(f, a, { configurable: !0, writable: !0, value: d });
    }
};
$jscomp.FORCE_POLYFILL_PROMISE = !1;
$jscomp.polyfill(
    "Promise",
    function (a) {
        function d() {
            this.batch_ = null;
        }
        function f(a) {
            return a instanceof g
                ? a
                : new g(function (c, d) {
                      c(a);
                  });
        }
        if (a && !$jscomp.FORCE_POLYFILL_PROMISE) return a;
        d.prototype.asyncExecute = function (a) {
            if (null == this.batch_) {
                this.batch_ = [];
                var c = this;
                this.asyncExecuteFunction(function () {
                    c.executeBatch_();
                });
            }
            this.batch_.push(a);
        };
        var c = $jscomp.global.setTimeout;
        d.prototype.asyncExecuteFunction = function (a) {
            c(a, 0);
        };
        d.prototype.executeBatch_ = function () {
            for (; this.batch_ && this.batch_.length; ) {
                var a = this.batch_;
                this.batch_ = [];
                for (var c = 0; c < a.length; ++c) {
                    var d = a[c];
                    a[c] = null;
                    try {
                        d();
                    } catch (k) {
                        this.asyncThrow_(k);
                    }
                }
            }
            this.batch_ = null;
        };
        d.prototype.asyncThrow_ = function (a) {
            this.asyncExecuteFunction(function () {
                throw a;
            });
        };
        var g = function (a) {
            this.state_ = 0;
            this.result_ = void 0;
            this.onSettledCallbacks_ = [];
            var c = this.createResolveAndReject_();
            try {
                a(c.resolve, c.reject);
            } catch (r) {
                c.reject(r);
            }
        };
        g.prototype.createResolveAndReject_ = function () {
            function a(a) {
                return function (f) {
                    d || ((d = !0), a.call(c, f));
                };
            }
            var c = this,
                d = !1;
            return { resolve: a(this.resolveTo_), reject: a(this.reject_) };
        };
        g.prototype.resolveTo_ = function (a) {
            if (a === this) this.reject_(new TypeError("A Promise cannot resolve to itself"));
            else if (a instanceof g) this.settleSameAsPromise_(a);
            else {
                a: switch (typeof a) {
                    case "object":
                        var c = null != a;
                        break a;
                    case "function":
                        c = !0;
                        break a;
                    default:
                        c = !1;
                }
                c ? this.resolveToNonPromiseObj_(a) : this.fulfill_(a);
            }
        };
        g.prototype.resolveToNonPromiseObj_ = function (a) {
            var c = void 0;
            try {
                c = a.then;
            } catch (r) {
                this.reject_(r);
                return;
            }
            "function" == typeof c ? this.settleSameAsThenable_(c, a) : this.fulfill_(a);
        };
        g.prototype.reject_ = function (a) {
            this.settle_(2, a);
        };
        g.prototype.fulfill_ = function (a) {
            this.settle_(1, a);
        };
        g.prototype.settle_ = function (a, c) {
            if (0 != this.state_) throw Error("Cannot settle(" + a + ", " + c + "): Promise already settled in state" + this.state_);
            this.state_ = a;
            this.result_ = c;
            this.executeOnSettledCallbacks_();
        };
        g.prototype.executeOnSettledCallbacks_ = function () {
            if (null != this.onSettledCallbacks_) {
                for (var a = 0; a < this.onSettledCallbacks_.length; ++a) h.asyncExecute(this.onSettledCallbacks_[a]);
                this.onSettledCallbacks_ = null;
            }
        };
        var h = new d();
        g.prototype.settleSameAsPromise_ = function (a) {
            var c = this.createResolveAndReject_();
            a.callWhenSettled_(c.resolve, c.reject);
        };
        g.prototype.settleSameAsThenable_ = function (a, c) {
            var d = this.createResolveAndReject_();
            try {
                a.call(c, d.resolve, d.reject);
            } catch (k) {
                d.reject(k);
            }
        };
        g.prototype.then = function (a, c) {
            function d(a, c) {
                return "function" == typeof a
                    ? function (c) {
                          try {
                              f(a(c));
                          } catch (p) {
                              h(p);
                          }
                      }
                    : c;
            }
            var f,
                h,
                l = new g(function (a, c) {
                    f = a;
                    h = c;
                });
            this.callWhenSettled_(d(a, f), d(c, h));
            return l;
        };
        g.prototype.catch = function (a) {
            return this.then(void 0, a);
        };
        g.prototype.callWhenSettled_ = function (a, c) {
            function d() {
                switch (f.state_) {
                    case 1:
                        a(f.result_);
                        break;
                    case 2:
                        c(f.result_);
                        break;
                    default:
                        throw Error("Unexpected state: " + f.state_);
                }
            }
            var f = this;
            null == this.onSettledCallbacks_ ? h.asyncExecute(d) : this.onSettledCallbacks_.push(d);
        };
        g.resolve = f;
        g.reject = function (a) {
            return new g(function (c, d) {
                d(a);
            });
        };
        g.race = function (a) {
            return new g(function (c, d) {
                for (var g = $jscomp.makeIterator(a), h = g.next(); !h.done; h = g.next()) f(h.value).callWhenSettled_(c, d);
            });
        };
        g.all = function (a) {
            var c = $jscomp.makeIterator(a),
                d = c.next();
            return d.done
                ? f([])
                : new g(function (a, g) {
                      function h(c) {
                          return function (d) {
                              k[c] = d;
                              l--;
                              0 == l && a(k);
                          };
                      }
                      var k = [],
                          l = 0;
                      do k.push(void 0), l++, f(d.value).callWhenSettled_(h(k.length - 1), g), (d = c.next());
                      while (!d.done);
                  });
        };
        return g;
    },
    "es6",
    "es3"
);
$jscomp.polyfill(
    "Array.from",
    function (a) {
        return a
            ? a
            : function (a, f, c) {
                  f =
                      null != f
                          ? f
                          : function (a) {
                                return a;
                            };
                  var d = [],
                      h = "undefined" != typeof Symbol && Symbol.iterator && a[Symbol.iterator];
                  if ("function" == typeof h) {
                      a = h.call(a);
                      for (var n = 0; !(h = a.next()).done; ) d.push(f.call(c, h.value, n++));
                  } else for (h = a.length, n = 0; n < h; n++) d.push(f.call(c, a[n], n));
                  return d;
              };
    },
    "es6",
    "es3"
);
$jscomp.checkStringArgs = function (a, d, f) {
    if (null == a) throw new TypeError("The 'this' value for String.prototype." + f + " must not be null or undefined");
    if (d instanceof RegExp) throw new TypeError("First argument to String.prototype." + f + " must not be a regular expression");
    return a + "";
};
$jscomp.polyfill(
    "String.prototype.repeat",
    function (a) {
        return a
            ? a
            : function (a) {
                  var d = $jscomp.checkStringArgs(this, null, "repeat");
                  if (0 > a || 1342177279 < a) throw new RangeError("Invalid count value");
                  a |= 0;
                  for (var c = ""; a; ) if ((a & 1 && (c += d), (a >>>= 1))) d += d;
                  return c;
              };
    },
    "es6",
    "es3"
);
$jscomp.SYMBOL_PREFIX = "jscomp_symbol_";
$jscomp.initSymbol = function () {
    $jscomp.initSymbol = function () {};
    $jscomp.global.Symbol || ($jscomp.global.Symbol = $jscomp.Symbol);
};
$jscomp.Symbol = (function () {
    var a = 0;
    return function (d) {
        return $jscomp.SYMBOL_PREFIX + (d || "") + a++;
    };
})();
$jscomp.initSymbolIterator = function () {
    $jscomp.initSymbol();
    var a = $jscomp.global.Symbol.iterator;
    a || (a = $jscomp.global.Symbol.iterator = $jscomp.global.Symbol("iterator"));
    "function" != typeof Array.prototype[a] &&
        $jscomp.defineProperty(Array.prototype, a, {
            configurable: !0,
            writable: !0,
            value: function () {
                return $jscomp.iteratorPrototype($jscomp.arrayIteratorImpl(this));
            },
        });
    $jscomp.initSymbolIterator = function () {};
};
$jscomp.initSymbolAsyncIterator = function () {
    $jscomp.initSymbol();
    var a = $jscomp.global.Symbol.asyncIterator;
    a || (a = $jscomp.global.Symbol.asyncIterator = $jscomp.global.Symbol("asyncIterator"));
    $jscomp.initSymbolAsyncIterator = function () {};
};
$jscomp.iteratorPrototype = function (a) {
    $jscomp.initSymbolIterator();
    a = { next: a };
    a[$jscomp.global.Symbol.iterator] = function () {
        return this;
    };
    return a;
};
$jscomp.iteratorFromArray = function (a, d) {
    $jscomp.initSymbolIterator();
    a instanceof String && (a += "");
    var f = 0,
        c = {
            next: function () {
                if (f < a.length) {
                    var g = f++;
                    return { value: d(g, a[g]), done: !1 };
                }
                c.next = function () {
                    return { done: !0, value: void 0 };
                };
                return c.next();
            },
        };
    c[Symbol.iterator] = function () {
        return c;
    };
    return c;
};
$jscomp.polyfill(
    "Array.prototype.values",
    function (a) {
        return a
            ? a
            : function () {
                  return $jscomp.iteratorFromArray(this, function (a, f) {
                      return f;
                  });
              };
    },
    "es8",
    "es3"
);
$jscomp.stringPadding = function (a, d) {
    a = void 0 !== a ? String(a) : " ";
    return 0 < d && a ? a.repeat(Math.ceil(d / a.length)).substring(0, d) : "";
};
$jscomp.polyfill(
    "String.prototype.padStart",
    function (a) {
        return a
            ? a
            : function (a, f) {
                  var c = $jscomp.checkStringArgs(this, null, "padStart");
                  return $jscomp.stringPadding(f, a - c.length) + c;
              };
    },
    "es8",
    "es3"
);
$jscomp.polyfill(
    "Array.prototype.fill",
    function (a) {
        return a
            ? a
            : function (a, f, c) {
                  var d = this.length || 0;
                  0 > f && (f = Math.max(0, d + f));
                  if (null == c || c > d) c = d;
                  c = Number(c);
                  0 > c && (c = Math.max(0, d + c));
                  for (f = Number(f || 0); f < c; f++) this[f] = a;
                  return this;
              };
    },
    "es6",
    "es3"
);
Array.from ||
    (Array.from = (function () {
        var a = Object.prototype.toString,
            d = function (c) {
                return "function" === typeof c || "[object Function]" === a.call(c);
            },
            f = Math.pow(2, 53) - 1;
        return function (a) {
            var c = Object(a);
            if (null == a) throw new TypeError("Array.from requires an array-like object - not null or undefined");
            var h = 1 < arguments.length ? arguments[1] : void 0,
                n;
            if ("undefined" !== typeof h) {
                if (!d(h)) throw new TypeError("Array.from: when provided, the second argument must be a function");
                2 < arguments.length && (n = arguments[2]);
            }
            var l = Number(c.length);
            l = isNaN(l) ? 0 : 0 !== l && isFinite(l) ? (0 < l ? 1 : -1) * Math.floor(Math.abs(l)) : l;
            l = Math.min(Math.max(l, 0), f);
            for (var r = d(this) ? Object(new this(l)) : Array(l), k = 0, q; k < l; ) (q = c[k]), (r[k] = h ? ("undefined" === typeof n ? h(q, k) : h.call(n, q, k)) : q), (k += 1);
            r.length = l;
            return r;
        };
    })());
Array.prototype.forEach ||
    (Array.prototype.forEach = function (a) {
        var d, f;
        if (null == this) throw new TypeError("this is null or not defined");
        var c = Object(this),
            g = c.length >>> 0;
        if ("function" !== typeof a) throw new TypeError(a + " is not a function");
        1 < arguments.length && (d = arguments[1]);
        for (f = 0; f < g; ) {
            if (f in c) {
                var h = c[f];
                a.call(d, h, f, c);
            }
            f++;
        }
    });
"function" != typeof Object.assign &&
    Object.defineProperty(Object, "assign", {
        value: function (a, d) {
            if (null == a) throw new TypeError("Cannot convert undefined or null to object");
            for (var f = Object(a), c = 1; c < arguments.length; c++) {
                var g = arguments[c];
                if (null != g) for (var h in g) Object.prototype.hasOwnProperty.call(g, h) && (f[h] = g[h]);
            }
            return f;
        },
        writable: !0,
        configurable: !0,
    });
!(function (a) {
    function d() {
        this.reads = [];
        this.writes = [];
        this.raf = h.bind(a);
    }
    function f(a) {
        a.scheduled || ((a.scheduled = !0), a.raf(c.bind(null, a)));
    }
    function c(a) {
        var c = a.writes,
            d = a.reads;
        try {
            for (var g; (g = d.shift()); ) g();
            for (var h; (h = c.shift()); ) h();
        } catch (C) {
            var l = C;
        }
        a.scheduled = !1;
        (d.length || c.length) && f(a);
        if (l)
            if (a.catch) a.catch(l);
            else throw l;
    }
    function g(a, c) {
        c = a.indexOf(c);
        return !!~c && !!a.splice(c, 1);
    }
    var h =
        a.requestAnimationFrame ||
        a.webkitRequestAnimationFrame ||
        a.mozRequestAnimationFrame ||
        a.msRequestAnimationFrame ||
        function (a) {
            return setTimeout(a, 16);
        };
    d.prototype = {
        constructor: d,
        measure: function (a, c) {
            a = c ? a.bind(c) : a;
            this.reads.push(a);
            f(this);
            return a;
        },
        mutate: function (a, c) {
            a = c ? a.bind(c) : a;
            this.writes.push(a);
            f(this);
            return a;
        },
        clear: function (a) {
            return g(this.reads, a) || g(this.writes, a);
        },
        extend: function (a) {
            if ("object" != typeof a) throw Error("expected object");
            var c = Object.create(this),
                d;
            for (d in a) a.hasOwnProperty(d) && (c[d] = a[d]);
            c.fastdom = this;
            c.initialize && c.initialize();
            return c;
        },
        catch: null,
    };
    var n = (a.fastdom = a.fastdom || new d());
    "function" == typeof define
        ? define(function () {
              return n;
          })
        : "object" == typeof module && (module.exports = n);
})("undefined" !== typeof window ? window : this);
function throttle(a, d) {
    var f, c;
    return function () {
        var g = arguments,
            h = this;
        c && (clearTimeout(c), (c = null));
        f
            ? (c = setTimeout(function () {
                  a.apply(h, g);
              }, d))
            : (a.apply(h, g),
              (f = !0),
              setTimeout(function () {
                  f = !1;
              }, d));
    };
}
function debounce(a, d, f) {
    var c;
    return function () {
        var g = this,
            h = arguments,
            n = f && !c;
        clearTimeout(c);
        c = setTimeout(function () {
            c = null;
            f || a.apply(g, h);
        }, d);
        n && a.apply(g, h);
    };
}
!(function (a, d) {
    "object" == typeof exports && "object" == typeof module ? (module.exports = d()) : "function" == typeof define && define.amd ? define("Barba", [], d) : "object" == typeof exports ? (exports.Barba = d()) : (a.Barba = d());
})(this, function () {
    return (function (a) {
        function d(c) {
            if (f[c]) return f[c].exports;
            var g = (f[c] = { exports: {}, id: c, loaded: !1 });
            return a[c].call(g.exports, g, g.exports, d), (g.loaded = !0), g.exports;
        }
        var f = {};
        return (d.m = a), (d.c = f), (d.p = "http://localhost:8080/dist"), d(0);
    })([
        function (a, d, f) {
            "function" != typeof Promise && (window.Promise = f(1));
            d = { version: "1.0.0", BaseTransition: f(4), BaseView: f(6), BaseCache: f(8), Dispatcher: f(7), HistoryManager: f(9), Pjax: f(10), Prefetch: f(13), Utils: f(5) };
            a.exports = d;
        },
        function (a, d, f) {
            (function (c) {
                !(function (d) {
                    function f() {}
                    function g(a, c) {
                        return function () {
                            a.apply(c, arguments);
                        };
                    }
                    function l(a) {
                        if ("object" != typeof this) throw new TypeError("Promises must be constructed via new");
                        if ("function" != typeof a) throw new TypeError("not a function");
                        this._state = 0;
                        this._handled = !1;
                        this._value = void 0;
                        this._deferreds = [];
                        C(a, this);
                    }
                    function r(a, c) {
                        for (; 3 === a._state; ) a = a._value;
                        return 0 === a._state
                            ? void a._deferreds.push(c)
                            : ((a._handled = !0),
                              void p(function () {
                                  var d = 1 === a._state ? c.onFulfilled : c.onRejected;
                                  if (null === d) return void (1 === a._state ? k : q)(c.promise, a._value);
                                  try {
                                      var f = d(a._value);
                                  } catch (B) {
                                      return void q(c.promise, B);
                                  }
                                  k(c.promise, f);
                              }));
                    }
                    function k(a, c) {
                        try {
                            if (c === a) throw new TypeError("A promise cannot be resolved with itself.");
                            if (c && ("object" == typeof c || "function" == typeof c)) {
                                var d = c.then;
                                if (c instanceof l) return (a._state = 3), (a._value = c), void v(a);
                                if ("function" == typeof d) return void C(g(d, c), a);
                            }
                            a._state = 1;
                            a._value = c;
                            v(a);
                        } catch (L) {
                            q(a, L);
                        }
                    }
                    function q(a, c) {
                        a._state = 2;
                        a._value = c;
                        v(a);
                    }
                    function v(a) {
                        2 === a._state &&
                            0 === a._deferreds.length &&
                            p(function () {
                                a._handled || u(a._value);
                            });
                        for (var c = 0, d = a._deferreds.length; c < d; c++) r(a, a._deferreds[c]);
                        a._deferreds = null;
                    }
                    function y(a, c, d) {
                        this.onFulfilled = "function" == typeof a ? a : null;
                        this.onRejected = "function" == typeof c ? c : null;
                        this.promise = d;
                    }
                    function C(a, c) {
                        var d = !1;
                        try {
                            a(
                                function (a) {
                                    d || ((d = !0), k(c, a));
                                },
                                function (a) {
                                    d || ((d = !0), q(c, a));
                                }
                            );
                        } catch (L) {
                            d || ((d = !0), q(c, L));
                        }
                    }
                    var z = setTimeout,
                        p =
                            ("function" == typeof c && c) ||
                            function (a) {
                                z(a, 0);
                            },
                        u = function (a) {
                            "undefined" != typeof console && console && console.warn("Possible Unhandled Promise Rejection:", a);
                        };
                    l.prototype.catch = function (a) {
                        return this.then(null, a);
                    };
                    l.prototype.then = function (a, c) {
                        var d = new this.constructor(f);
                        return r(this, new y(a, c, d)), d;
                    };
                    l.all = function (a) {
                        var c = Array.prototype.slice.call(a);
                        return new l(function (a, d) {
                            function f(p, h) {
                                try {
                                    if (h && ("object" == typeof h || "function" == typeof h)) {
                                        var u = h.then;
                                        if ("function" == typeof u)
                                            return void u.call(
                                                h,
                                                function (a) {
                                                    f(p, a);
                                                },
                                                d
                                            );
                                    }
                                    c[p] = h;
                                    0 === --g && a(c);
                                } catch (K) {
                                    d(K);
                                }
                            }
                            if (0 === c.length) return a([]);
                            for (var g = c.length, p = 0; p < c.length; p++) f(p, c[p]);
                        });
                    };
                    l.resolve = function (a) {
                        return a && "object" == typeof a && a.constructor === l
                            ? a
                            : new l(function (c) {
                                  c(a);
                              });
                    };
                    l.reject = function (a) {
                        return new l(function (c, d) {
                            d(a);
                        });
                    };
                    l.race = function (a) {
                        return new l(function (c, d) {
                            for (var f = 0, g = a.length; f < g; f++) a[f].then(c, d);
                        });
                    };
                    l._setImmediateFn = function (a) {
                        p = a;
                    };
                    l._setUnhandledRejectionFn = function (a) {
                        u = a;
                    };
                    "undefined" != typeof a && a.exports ? (a.exports = l) : d.Promise || (d.Promise = l);
                })(this);
            }.call(d, f(2).setImmediate));
        },
        function (a, d, f) {
            (function (a, g) {
                function c(a, c) {
                    this._id = a;
                    this._clearFn = c;
                }
                var n = f(3).nextTick,
                    l = Function.prototype.apply,
                    r = Array.prototype.slice,
                    k = {},
                    q = 0;
                d.setTimeout = function () {
                    return new c(l.call(setTimeout, window, arguments), clearTimeout);
                };
                d.setInterval = function () {
                    return new c(l.call(setInterval, window, arguments), clearInterval);
                };
                d.clearTimeout = d.clearInterval = function (a) {
                    a.close();
                };
                c.prototype.unref = c.prototype.ref = function () {};
                c.prototype.close = function () {
                    this._clearFn.call(window, this._id);
                };
                d.enroll = function (a, c) {
                    clearTimeout(a._idleTimeoutId);
                    a._idleTimeout = c;
                };
                d.unenroll = function (a) {
                    clearTimeout(a._idleTimeoutId);
                    a._idleTimeout = -1;
                };
                d._unrefActive = d.active = function (a) {
                    clearTimeout(a._idleTimeoutId);
                    var c = a._idleTimeout;
                    0 <= c &&
                        (a._idleTimeoutId = setTimeout(function () {
                            a._onTimeout && a._onTimeout();
                        }, c));
                };
                d.setImmediate =
                    "function" == typeof a
                        ? a
                        : function (a) {
                              var c = q++,
                                  f = !(2 > arguments.length) && r.call(arguments, 1);
                              return (
                                  (k[c] = !0),
                                  n(function () {
                                      k[c] && (f ? a.apply(null, f) : a.call(null), d.clearImmediate(c));
                                  }),
                                  c
                              );
                          };
                d.clearImmediate =
                    "function" == typeof g
                        ? g
                        : function (a) {
                              delete k[a];
                          };
            }.call(d, f(2).setImmediate, f(2).clearImmediate));
        },
        function (a, d) {
            function f() {
                q && r && ((q = !1), r.length ? (k = r.concat(k)) : (v = -1), k.length && c());
            }
            function c() {
                if (!q) {
                    var a = n(f);
                    q = !0;
                    for (var c = k.length; c; ) {
                        r = k;
                        for (k = []; ++v < c; ) r && r[v].run();
                        v = -1;
                        c = k.length;
                    }
                    r = null;
                    q = !1;
                    l(a);
                }
            }
            function g(a, c) {
                this.fun = a;
                this.array = c;
            }
            function h() {}
            var n, l;
            a = a.exports = {};
            !(function () {
                try {
                    n = setTimeout;
                } catch (y) {
                    n = function () {
                        throw Error("setTimeout is not defined");
                    };
                }
                try {
                    l = clearTimeout;
                } catch (y) {
                    l = function () {
                        throw Error("clearTimeout is not defined");
                    };
                }
            })();
            var r,
                k = [],
                q = !1,
                v = -1;
            a.nextTick = function (a) {
                var d = Array(arguments.length - 1);
                if (1 < arguments.length) for (var f = 1; f < arguments.length; f++) d[f - 1] = arguments[f];
                k.push(new g(a, d));
                1 !== k.length || q || n(c, 0);
            };
            g.prototype.run = function () {
                this.fun.apply(null, this.array);
            };
            a.title = "browser";
            a.browser = !0;
            a.env = {};
            a.argv = [];
            a.version = "";
            a.versions = {};
            a.on = h;
            a.addListener = h;
            a.once = h;
            a.off = h;
            a.removeListener = h;
            a.removeAllListeners = h;
            a.emit = h;
            a.binding = function (a) {
                throw Error("process.binding is not supported");
            };
            a.cwd = function () {
                return "/";
            };
            a.chdir = function (a) {
                throw Error("process.chdir is not supported");
            };
            a.umask = function () {
                return 0;
            };
        },
        function (a, d, f) {
            var c = f(5);
            a.exports = {
                oldContainer: void 0,
                newContainer: void 0,
                newContainerLoading: void 0,
                extend: function (a) {
                    return c.extend(this, a);
                },
                init: function (a, d) {
                    var f = this;
                    return (
                        (this.oldContainer = a),
                        (this._newContainerPromise = d),
                        (this.deferred = c.deferred()),
                        (this.newContainerReady = c.deferred()),
                        (this.newContainerLoading = this.newContainerReady.promise),
                        this.start(),
                        this._newContainerPromise.then(function (a) {
                            f.newContainer = a;
                            f.newContainerReady.resolve();
                        }),
                        this.deferred.promise
                    );
                },
                done: function () {
                    this.oldContainer.parentNode.removeChild(this.oldContainer);
                    this.newContainer.style.visibility = "visible";
                    this.deferred.resolve();
                },
                start: function () {},
            };
        },
        function (a, d) {
            a.exports = {
                getCurrentUrl: function () {
                    return window.location.protocol + "//" + window.location.host + window.location.pathname + window.location.search;
                },
                cleanLink: function (a) {
                    return a.replace(/#.*/, "");
                },
                xhrTimeout: 5e3,
                xhr: function (a) {
                    var c = this.deferred(),
                        d = new XMLHttpRequest();
                    return (
                        (d.onreadystatechange = function () {
                            if (4 === d.readyState) return 200 === d.status ? c.resolve(d.responseText) : c.reject(Error("xhr: HTTP code is not 200"));
                        }),
                        (d.ontimeout = function () {
                            return c.reject(Error("xhr: Timeout exceeded"));
                        }),
                        d.open("GET", a),
                        (d.timeout = this.xhrTimeout),
                        d.setRequestHeader("x-barba", "yes"),
                        d.send(),
                        c.promise
                    );
                },
                extend: function (a, c) {
                    a = Object.create(a);
                    for (var d in c) c.hasOwnProperty(d) && (a[d] = c[d]);
                    return a;
                },
                deferred: function () {
                    return new (function () {
                        this.reject = this.resolve = null;
                        this.promise = new Promise(
                            function (a, c) {
                                this.resolve = a;
                                this.reject = c;
                            }.bind(this)
                        );
                    })();
                },
                getPort: function (a) {
                    a = "undefined" != typeof a ? a : window.location.port;
                    var c = window.location.protocol;
                    return "" != a ? parseInt(a) : "http:" === c ? 80 : "https:" === c ? 443 : void 0;
                },
            };
        },
        function (a, d, f) {
            var c = f(7),
                g = f(5);
            a.exports = {
                namespace: null,
                extend: function (a) {
                    return g.extend(this, a);
                },
                init: function () {
                    var a = this;
                    c.on("initStateChange", function (c, d) {
                        d && d.namespace === a.namespace && a.onLeave();
                    });
                    c.on("newPageReady", function (c, d, f) {
                        a.container = f;
                        c.namespace === a.namespace && a.onEnter();
                    });
                    c.on("transitionCompleted", function (c, d) {
                        c.namespace === a.namespace && a.onEnterCompleted();
                        d && d.namespace === a.namespace && a.onLeaveCompleted();
                    });
                },
                onEnter: function () {},
                onEnterCompleted: function () {},
                onLeave: function () {},
                onLeaveCompleted: function () {},
            };
        },
        function (a, d) {
            a.exports = {
                events: {},
                on: function (a, c) {
                    this.events[a] = this.events[a] || [];
                    this.events[a].push(c);
                },
                off: function (a, c) {
                    0 != a in this.events && this.events[a].splice(this.events[a].indexOf(c), 1);
                },
                trigger: function (a) {
                    if (0 != a in this.events) for (var c = 0; c < this.events[a].length; c++) this.events[a][c].apply(this, Array.prototype.slice.call(arguments, 1));
                },
            };
        },
        function (a, d, f) {
            var c = f(5);
            a.exports = {
                data: {},
                extend: function (a) {
                    return c.extend(this, a);
                },
                set: function (a, c) {
                    this.data[a] = c;
                },
                get: function (a) {
                    return this.data[a];
                },
                reset: function () {
                    this.data = {};
                },
            };
        },
        function (a, d) {
            a.exports = {
                history: [],
                add: function (a, c) {
                    c || (c = void 0);
                    this.history.push({ url: a, namespace: c });
                },
                currentStatus: function () {
                    return this.history[this.history.length - 1];
                },
                prevStatus: function () {
                    var a = this.history;
                    return 2 > a.length ? null : a[a.length - 2];
                },
            };
        },
        function (a, d, f) {
            var c = f(5),
                g = f(7),
                h = f(11);
            d = f(8);
            var n = f(9);
            f = {
                Dom: f(12),
                History: n,
                Cache: d,
                cacheEnabled: !0,
                transitionProgress: !1,
                ignoreClassLink: "no-barba",
                start: function () {
                    this.init();
                },
                init: function () {
                    var a = this.Dom.getContainer();
                    this.Dom.getWrapper().setAttribute("aria-live", "polite");
                    this.History.add(this.getCurrentUrl(), this.Dom.getNamespace(a));
                    g.trigger("initStateChange", this.History.currentStatus());
                    g.trigger("newPageReady", this.History.currentStatus(), {}, a, this.Dom.currentHTML);
                    g.trigger("transitionCompleted", this.History.currentStatus());
                    this.bindEvents();
                },
                bindEvents: function () {
                    document.addEventListener("click", this.onLinkClick.bind(this));
                    window.addEventListener("popstate", this.onStateChange.bind(this));
                },
                getCurrentUrl: function () {
                    return c.cleanLink(c.getCurrentUrl());
                },
                goTo: function (a) {
                    window.history.pushState(null, null, a);
                    this.onStateChange();
                },
                forceGoTo: function (a) {
                    window.location = a;
                },
                load: function (a) {
                    var d,
                        f = c.deferred(),
                        g = this;
                    return (
                        (d = this.Cache.get(a)),
                        d || ((d = c.xhr(a)), this.Cache.set(a, d)),
                        d.then(
                            function (a) {
                                a = g.Dom.parseResponse(a);
                                g.Dom.putContainer(a);
                                g.cacheEnabled || g.Cache.reset();
                                f.resolve(a);
                            },
                            function () {
                                g.forceGoTo(a);
                                f.reject();
                            }
                        ),
                        f.promise
                    );
                },
                getHref: function (a) {
                    if (a) return a.getAttribute && "string" == typeof a.getAttribute("xlink:href") ? a.getAttribute("xlink:href") : "string" == typeof a.href ? a.href : void 0;
                },
                onLinkClick: function (a) {
                    for (var c = a.target; c && !this.getHref(c); ) c = c.parentNode;
                    this.preventCheck(a, c) && (a.stopPropagation(), a.preventDefault(), g.trigger("linkClicked", c, a), (a = this.getHref(c)), this.goTo(a));
                },
                preventCheck: function (a, d) {
                    if (!window.history.pushState) return !1;
                    var f = this.getHref(d);
                    return (
                        !(!d || !f) &&
                        !(1 < a.which || a.metaKey || a.ctrlKey || a.shiftKey || a.altKey) &&
                        (!d.target || "_blank" !== d.target) &&
                        window.location.protocol === d.protocol &&
                        window.location.hostname === d.hostname &&
                        c.getPort() === c.getPort(d.port) &&
                        !(-1 < f.indexOf("#")) &&
                        (!d.getAttribute || "string" != typeof d.getAttribute("download")) &&
                        c.cleanLink(f) != c.cleanLink(location.href) &&
                        !d.classList.contains(this.ignoreClassLink)
                    );
                },
                getTransition: function () {
                    return h;
                },
                onStateChange: function () {
                    var a = this.getCurrentUrl();
                    if ((this.transitionProgress && this.forceGoTo(a), this.History.currentStatus().url === a)) return !1;
                    this.History.add(a);
                    a = this.load(a);
                    var c = Object.create(this.getTransition());
                    this.transitionProgress = !0;
                    g.trigger("initStateChange", this.History.currentStatus(), this.History.prevStatus());
                    c = c.init(this.Dom.getContainer(), a);
                    a.then(this.onNewContainerLoaded.bind(this));
                    c.then(this.onTransitionEnd.bind(this));
                },
                onNewContainerLoaded: function (a) {
                    this.History.currentStatus().namespace = this.Dom.getNamespace(a);
                    g.trigger("newPageReady", this.History.currentStatus(), this.History.prevStatus(), a, this.Dom.currentHTML);
                },
                onTransitionEnd: function () {
                    this.transitionProgress = !1;
                    g.trigger("transitionCompleted", this.History.currentStatus(), this.History.prevStatus());
                },
            };
            a.exports = f;
        },
        function (a, d, f) {
            d = f(4).extend({
                start: function () {
                    this.newContainerLoading.then(this.finish.bind(this));
                },
                finish: function () {
                    document.body.scrollTop = 0;
                    this.done();
                },
            });
            a.exports = d;
        },
        function (a, d) {
            a.exports = {
                dataNamespace: "namespace",
                wrapperId: "barba-wrapper",
                containerClass: "barba-container",
                currentHTML: document.documentElement.innerHTML,
                parseResponse: function (a) {
                    this.currentHTML = a;
                    var c = document.createElement("div");
                    c.innerHTML = a;
                    a = c.querySelector("title");
                    return a && (document.title = a.textContent), this.getContainer(c);
                },
                getWrapper: function () {
                    var a = document.getElementById(this.wrapperId);
                    if (!a) throw Error("Barba.js: wrapper not found!");
                    return a;
                },
                getContainer: function (a) {
                    if ((a || (a = document.body), !a)) throw Error("Barba.js: DOM not ready!");
                    a = this.parseContainer(a);
                    if ((a && a.jquery && (a = a[0]), !a)) throw Error("Barba.js: no container found");
                    return a;
                },
                getNamespace: function (a) {
                    return a && a.dataset ? a.dataset[this.dataNamespace] : a ? a.getAttribute("data-" + this.dataNamespace) : null;
                },
                putContainer: function (a) {
                    a.style.visibility = "hidden";
                    this.getWrapper().appendChild(a);
                },
                parseContainer: function (a) {
                    return a.querySelector("." + this.containerClass);
                },
            };
        },
        function (a, d, f) {
            var c = f(5),
                g = f(10);
            a.exports = {
                ignoreClassLink: "no-barba-prefetch",
                init: function () {
                    return !!window.history.pushState && (document.body.addEventListener("mouseover", this.onLinkEnter.bind(this)), void document.body.addEventListener("touchstart", this.onLinkEnter.bind(this)));
                },
                onLinkEnter: function (a) {
                    for (var d = a.target; d && !g.getHref(d); ) d = d.parentNode;
                    if (d && !d.classList.contains(this.ignoreClassLink)) {
                        var f = g.getHref(d);
                        g.preventCheck(a, d) && !g.Cache.get(f) && ((a = c.xhr(f)), g.Cache.set(f, a));
                    }
                },
            };
        },
    ]);
});
(function () {
    ("undefined" != typeof exports && null !== exports ? exports : this).Lethargy = (function () {
        function a(a, f, c, g) {
            this.stability = null != a ? Math.abs(a) : 8;
            this.sensitivity = null != f ? 1 + Math.abs(f) : 100;
            this.tolerance = null != c ? 1 + Math.abs(c) : 1.1;
            this.delay = null != g ? g : 150;
            this.lastUpDeltas = function () {
                var a;
                var c = [];
                var d = 1;
                for (a = 2 * this.stability; 1 <= a ? a >= d : d >= a; 1 <= a ? d++ : d--) c.push(null);
                return c;
            }.call(this);
            this.lastDownDeltas = function () {
                var a;
                var c = [];
                var d = 1;
                for (a = 2 * this.stability; 1 <= a ? a >= d : d >= a; 1 <= a ? d++ : d--) c.push(null);
                return c;
            }.call(this);
            this.deltasTimestamp = function () {
                var a;
                var c = [];
                var d = 1;
                for (a = 2 * this.stability; 1 <= a ? a >= d : d >= a; 1 <= a ? d++ : d--) c.push(null);
                return c;
            }.call(this);
        }
        return (
            (a.prototype.check = function (a) {
                var d;
                return (
                    (a = a.originalEvent || a),
                    null != a.wheelDelta ? (d = a.wheelDelta) : null != a.deltaY ? (d = -40 * a.deltaY) : (null != a.detail || 0 === a.detail) && (d = -40 * a.detail),
                    this.deltasTimestamp.push(Date.now()),
                    this.deltasTimestamp.shift(),
                    0 < d ? (this.lastUpDeltas.push(d), this.lastUpDeltas.shift(), this.isInertia(1)) : (this.lastDownDeltas.push(d), this.lastDownDeltas.shift(), this.isInertia(-1))
                );
            }),
            (a.prototype.isInertia = function (a) {
                var d, c, g, h, n, l, r;
                return (
                    (d = -1 === a ? this.lastDownDeltas : this.lastUpDeltas),
                    null === d[0]
                        ? a
                        : this.deltasTimestamp[2 * this.stability - 2] + this.delay > Date.now() && d[0] === d[2 * this.stability - 1]
                        ? !1
                        : ((g = d.slice(0, this.stability)),
                          (c = d.slice(this.stability, 2 * this.stability)),
                          (r = g.reduce(function (a, c) {
                              return a + c;
                          })),
                          (n = c.reduce(function (a, c) {
                              return a + c;
                          })),
                          (l = r / g.length),
                          (h = n / c.length),
                          Math.abs(l) < Math.abs(h * this.tolerance) && this.sensitivity < Math.abs(h) ? a : !1)
                );
            }),
            (a.prototype.showLastUpDeltas = function () {
                return this.lastUpDeltas;
            }),
            (a.prototype.showLastDownDeltas = function () {
                return this.lastDownDeltas;
            }),
            a
        );
    })();
}.call(this)); /*
 npm.im/scroll-restoration-polyfill  npm.im/one-event */
!(function () {
    function a(a, d, f, n) {
        a.addEventListener(d, f, n);
        a.addEventListener(
            d,
            function r() {
                a.removeEventListener(d, f, n);
                a.removeEventListener(d, r, n);
            },
            n
        );
    }
    function d() {
        a(window, "scroll", scrollTo.bind(window, window.pageXOffset || document.body.scrollLeft, window.pageYOffset || document.body.scrollTop));
    }
    a.promise = function (c, d, f) {
        return new Promise(function (g) {
            return a(c, d, g, f);
        });
    };
    var f = "auto";
    "scrollRestoration" in history ||
        Object.defineProperty(history, "scrollRestoration", {
            enumerable: !0,
            get: function () {
                return f;
            },
            set: function (a) {
                a !== f && ("auto" === a ? (window.removeEventListener("popstate", d), (f = a)) : "manual" === a && (window.addEventListener("popstate", d), (f = a)));
            },
        });
})();
!(function (a, d) {
    if ("function" == typeof define && define.amd) define(["exports"], d);
    else if ("undefined" != typeof exports) d(exports);
    else {
        var f = {};
        d(f);
        a.bodyScrollLock = f;
    }
})(this, function (a) {
    function d(a) {
        if (Array.isArray(a)) {
            for (var c = 0, d = Array(a.length); c < a.length; c++) d[c] = a[c];
            return d;
        }
        return Array.from(a);
    }
    Object.defineProperty(a, "__esModule", { value: !0 });
    var f = !1;
    if ("undefined" != typeof window) {
        var c = {
            get passive() {
                f = !0;
            },
        };
        window.addEventListener("testPassive", null, c);
        window.removeEventListener("testPassive", null, c);
    }
    var g = "undefined" != typeof window && window.navigator && window.navigator.platform && /iP(ad|hone|od)/.test(window.navigator.platform),
        h = [],
        n = !1,
        l = -1,
        r = void 0,
        k = void 0,
        q = function (a) {
            return h.some(function (c) {
                return !(!c.options.allowTouchMove || !c.options.allowTouchMove(a));
            });
        },
        v = function (a) {
            a = a || window.event;
            return !!q(a.target) || 1 < a.touches.length || (a.preventDefault && a.preventDefault(), !1);
        },
        y = function () {
            setTimeout(function () {
                void 0 !== k && ((document.body.style.paddingRight = k), (k = void 0));
                void 0 !== r && ((document.body.style.overflow = r), (r = void 0));
            });
        };
    a.disableBodyScroll = function (a, c) {
        if (g) {
            if (!a) return void console.error("disableBodyScroll unsuccessful - targetElement must be provided when calling disableBodyScroll on IOS devices.");
            a &&
                !h.some(function (c) {
                    return c.targetElement === a;
                }) &&
                ((c = { targetElement: a, options: c || {} }),
                (h = [].concat(d(h), [c])),
                (a.ontouchstart = function (a) {
                    1 === a.targetTouches.length && (l = a.targetTouches[0].clientY);
                }),
                (a.ontouchmove = function (c) {
                    var d;
                    1 === c.targetTouches.length &&
                        ((d = c.targetTouches[0].clientY - l), !q(c.target) && (a && 0 === a.scrollTop && 0 < d ? v(c) : a && a.scrollHeight - a.scrollTop <= a.clientHeight && 0 > d ? v(c) : c.stopPropagation()));
                }),
                n || (document.addEventListener("touchmove", v, f ? { passive: !1 } : void 0), (n = !0)));
        } else {
            var p = c;
            setTimeout(function () {
                if (void 0 === k) {
                    var a = window.innerWidth - document.documentElement.clientWidth;
                    p && !0 === p.reserveScrollBarGap && 0 < a && ((k = document.body.style.paddingRight), (document.body.style.paddingRight = a + "px"));
                }
                void 0 === r && ((r = document.body.style.overflow), (document.body.style.overflow = "hidden"));
            });
            c = { targetElement: a, options: c || {} };
            h = [].concat(d(h), [c]);
        }
    };
    a.clearAllBodyScrollLocks = function () {
        g
            ? (h.forEach(function (a) {
                  a.targetElement.ontouchstart = null;
                  a.targetElement.ontouchmove = null;
              }),
              n && (document.removeEventListener("touchmove", v, f ? { passive: !1 } : void 0), (n = !1)),
              (h = []),
              (l = -1))
            : (y(), (h = []));
    };
    a.enableBodyScroll = function (a) {
        if (g) {
            if (!a) return void console.error("enableBodyScroll unsuccessful - targetElement must be provided when calling enableBodyScroll on IOS devices.");
            a.ontouchstart = null;
            a.ontouchmove = null;
            h = h.filter(function (c) {
                return c.targetElement !== a;
            });
            n && 0 === h.length && (document.removeEventListener("touchmove", v, f ? { passive: !1 } : void 0), (n = !1));
        } else
            1 === h.length && h[0].targetElement === a
                ? (y(), (h = []))
                : (h = h.filter(function (c) {
                      return c.targetElement !== a;
                  }));
    };
}); /*
 VERSION: 0.5.6
 DATE: 2017-01-17
 UPDATES AND DOCS AT: http://greensock.com

 @license Copyright (c) 2008-2017, GreenSock. All rights reserved.
 SplitText is a Club GreenSock membership benefit; You must have a valid membership to use
 this code without violating the terms of use. Visit http://greensock.com/club/ to sign up or get more details.
 This work is subject to the software agreement that was issued with your membership.

 @author: Jack Doyle, jack@greensock.com
*/
var _gsScope = "undefined" != typeof module && module.exports && "undefined" != typeof global ? global : this || window;
!(function (a) {
    var d = a.GreenSockGlobals || a,
        f = (function (a) {
            var c = a.split("."),
                f = d;
            for (a = 0; a < c.length; a++) f[c[a]] = f = f[c[a]] || {};
            return f;
        })("com.greensock.utils"),
        c = function (a) {
            var d = a.nodeType,
                f = "";
            if (1 === d || 9 === d || 11 === d) {
                if ("string" == typeof a.textContent) return a.textContent;
                for (a = a.firstChild; a; a = a.nextSibling) f += c(a);
            } else if (3 === d || 4 === d) return a.nodeValue;
            return f;
        },
        g = document,
        h = g.defaultView ? g.defaultView.getComputedStyle : function () {},
        n = /([A-Z])/g,
        l = function (a, c, d, f) {
            var p;
            return (d = d || h(a, null)) ? ((a = d.getPropertyValue(c.replace(n, "-$1").toLowerCase())), (p = a || d.length ? a : d[c])) : a.currentStyle && ((d = a.currentStyle), (p = d[c])), f ? p : parseInt(p, 10) || 0;
        },
        r = function (a) {
            return a.length && a[0] && ((a[0].nodeType && a[0].style && !a.nodeType) || (a[0].length && a[0][0])) ? !0 : !1;
        },
        k = /(?:\r|\n|\t\t)/g,
        q = /(?:\s\s+)/g,
        v = function (a) {
            return ((a.charCodeAt(0) - 55296) << 10) + (a.charCodeAt(1) - 56320) + 65536;
        },
        y = " style='position:relative;display:inline-block;" + (g.all && !g.addEventListener ? "*display:inline;*zoom:1;'" : "'"),
        C = function (a, c) {
            a = a || "";
            var d = -1 !== a.indexOf("++"),
                f = 1;
            return (
                d && (a = a.split("++").join("")),
                function () {
                    return "<" + c + y + (a ? " class='" + a + (d ? f++ : "") + "'>" : ">");
                }
            );
        },
        z = (f.SplitText = d.SplitText = function (a, c) {
            if (("string" == typeof a && (a = z.selector(a)), !a)) throw "cannot split a null element.";
            var d;
            if (r(a)) {
                var f,
                    p,
                    g = [],
                    u = a.length;
                for (f = 0; u > f; f++)
                    if (((d = a[f]), r(d))) for (p = 0; p < d.length; p++) g.push(d[p]);
                    else g.push(d);
                d = g;
            } else d = [a];
            this.elements = d;
            this.chars = [];
            this.words = [];
            this.lines = [];
            this._originals = [];
            this.vars = c || {};
            this.split(c);
        }),
        p = function (a, c, d) {
            var f = a.nodeType;
            if (1 === f || 9 === f || 11 === f) for (a = a.firstChild; a; a = a.nextSibling) p(a, c, d);
            else (3 !== f && 4 !== f) || (a.nodeValue = a.nodeValue.split(c).join(d));
        },
        u = function (a, c) {
            for (var d = c.length; -1 < --d; ) a.push(c[d]);
        },
        E = function (a) {
            var c,
                d = [],
                f = a.length;
            for (c = 0; c !== f; d.push(a[c++]));
            return d;
        },
        M = function (a, c, d) {
            for (var f; a && a !== c; ) {
                if ((f = a._next || a.nextSibling)) return f.textContent.charAt(0) === d;
                a = a.parentNode || a._parent;
            }
            return !1;
        },
        w = function (a) {
            var c,
                d = E(a.childNodes),
                f = d.length;
            for (c = 0; f > c; c++) {
                var p = d[c];
                p._isSplit ? w(p) : (c && 3 === p.previousSibling.nodeType ? (p.previousSibling.nodeValue += 3 === p.nodeType ? p.nodeValue : p.firstChild.nodeValue) : 3 !== p.nodeType && a.insertBefore(p.firstChild, p), a.removeChild(p));
            }
        },
        L = function (a, d, f, u) {
            var h,
                z = E(a.childNodes),
                n = z.length,
                y = "absolute" === d.position || !0 === d.absolute;
            if (3 !== a.nodeType || 1 < n) {
                d.absolute = !1;
                for (h = 0; n > h; h++) {
                    var M = z[h];
                    (3 !== M.nodeType || /\S+/.test(M.nodeValue)) &&
                        (y && 3 !== M.nodeType && "inline" === l(M, "display", null, !0) && ((M.style.display = "inline-block"), (M.style.position = "relative")), (M._isSplit = !0), L(M, d, f, u));
                }
                return (d.absolute = y), void (a._isSplit = !0);
            }
            var r, w, C;
            z = d.span ? "span" : "div";
            n = d.type || d.split || "chars,words,lines";
            n = (-1 !== n.indexOf("words"), -1 !== n.indexOf("chars"));
            var B = "absolute" === d.position || !0 === d.absolute;
            y = d.wordDelimiter || " ";
            B = " " !== y ? "" : B ? "&#173; " : " ";
            var O = d.span ? "</span>" : "</div>",
                P = !0;
            var D = g.createElement("div");
            var ca = a.parentNode;
            ca.insertBefore(D, a);
            D.textContent = a.nodeValue;
            ca.removeChild(a);
            a = D;
            D = c(a);
            var Z = -1 !== D.indexOf("<");
            !1 !== d.reduceWhiteSpace && (D = D.replace(q, " ").replace(k, ""));
            Z && (D = D.split("<").join("{{LT}}"));
            var da = D.length;
            d = (" " === D.charAt(0) ? B : "") + f();
            for (r = 0; da > r; r++)
                if (((M = D.charAt(r)), M === y && D.charAt(r - 1) !== y && r)) {
                    d += P ? O : "";
                    for (P = !1; D.charAt(r + 1) === y; ) (d += B), r++;
                    r === da - 1 ? (d += B) : ")" !== D.charAt(r + 1) && ((d += B + f()), (P = !0));
                } else
                    "{" === M && "{{LT}}" === D.substr(r, 6)
                        ? ((d += n ? u() + "{{LT}}</" + z + ">" : "{{LT}}"), (r += 5))
                        : (55296 <= M.charCodeAt(0) && 56319 >= M.charCodeAt(0)) || (65024 <= D.charCodeAt(r + 1) && 65039 >= D.charCodeAt(r + 1))
                        ? ((w = v(D.substr(r, 2))),
                          (C = v(D.substr(r + 2, 2))),
                          (h = (127462 <= w && 127487 >= w && 127462 <= C && 127487 >= C) || (127995 <= C && 127999 >= C) ? 4 : 2),
                          (d += n && " " !== M ? u() + D.substr(r, h) + "</" + z + ">" : D.substr(r, h)),
                          (r += h - 1))
                        : (d += n && " " !== M ? u() + M + "</" + z + ">" : M);
            a.outerHTML = d + (P ? O : "");
            Z && p(ca, "{{LT}}", "<");
        };
    f = z.prototype;
    f.split = function (a) {
        this.isSplit && this.revert();
        this.vars = a = a || this.vars;
        this._originals.length = this.chars.length = this.words.length = this.lines.length = 0;
        var c = this.elements.length,
            d = a.span ? "span" : "div",
            f = ("absolute" === a.position || !0 === a.absolute, C(a.wordsClass, d));
        for (d = C(a.charsClass, d); -1 < --c; ) {
            var k = this.elements[c];
            this._originals[c] = k.innerHTML;
            var z = k.clientHeight;
            var E = k.clientWidth;
            L(k, a, f, d);
            var n = void 0,
                v = void 0,
                q = void 0,
                y = void 0,
                r = void 0,
                B = void 0,
                S;
            var ea = a;
            var ba = this.chars,
                ca = this.words,
                Z = this.lines,
                da = h(k),
                pa = l(k, "paddingLeft", da),
                ya = -999,
                ja = l(k, "borderBottomWidth", da) + l(k, "borderTopWidth", da),
                va = l(k, "borderLeftWidth", da) + l(k, "borderRightWidth", da),
                sa = l(k, "paddingTop", da) + l(k, "paddingBottom", da),
                ka = l(k, "paddingLeft", da) + l(k, "paddingRight", da),
                ua = 0.2 * l(k, "fontSize");
            da = l(k, "textAlign", da, !0);
            var za = [],
                Aa = [],
                Ba = [],
                la = ea.wordDelimiter || " ",
                ia = ea.span ? "span" : "div";
            var A = ea.type || ea.split || "chars,words,lines";
            var G = Z && -1 !== A.indexOf("lines") ? [] : null,
                H = -1 !== A.indexOf("words"),
                Q = -1 !== A.indexOf("chars"),
                T = "absolute" === ea.position || !0 === ea.absolute,
                fa = ea.linesClass,
                La = -1 !== (fa || "").indexOf("++"),
                U = [];
            G && 1 === k.children.length && k.children[0]._isSplit && (k = k.children[0]);
            La && (fa = fa.split("++").join(""));
            var V = k.getElementsByTagName("*");
            A = V.length;
            var ma = [];
            for (S = 0; A > S; S++) ma[S] = V[S];
            if (G || T)
                for (S = 0; A > S; S++)
                    (B = ma[S]),
                        ((V = B.parentNode === k) || T || (Q && !H)) &&
                            ((n = B.offsetTop),
                            G && V && Math.abs(n - ya) > ua && "BR" !== B.nodeName && ((r = []), G.push(r), (ya = n)),
                            T && ((B._x = B.offsetLeft), (B._y = n), (B._w = B.offsetWidth), (B._h = B.offsetHeight)),
                            G &&
                                (((B._isSplit && V) || (!Q && V) || (H && V) || (!H && B.parentNode.parentNode === k && !B.parentNode._isSplit)) && (r.push(B), (B._x -= pa), M(B, k, la) && (B._wordEnd = !0)),
                                "BR" === B.nodeName && B.nextSibling && "BR" === B.nextSibling.nodeName && G.push([])));
            for (S = 0; A > S; S++)
                (B = ma[S]),
                    (V = B.parentNode === k),
                    "BR" !== B.nodeName
                        ? (T &&
                              ((y = B.style),
                              H || V || ((B._x += B.parentNode._x), (B._y += B.parentNode._y)),
                              (y.left = B._x + "px"),
                              (y.top = B._y + "px"),
                              (y.position = "absolute"),
                              (y.display = "block"),
                              (y.width = B._w + 1 + "px"),
                              (y.height = B._h + "px")),
                          !H && Q
                              ? B._isSplit
                                  ? ((B._next = B.nextSibling), B.parentNode.appendChild(B))
                                  : B.parentNode._isSplit
                                  ? ((B._parent = B.parentNode),
                                    !B.previousSibling && B.firstChild && (B.firstChild._isFirst = !0),
                                    B.nextSibling && " " === B.nextSibling.textContent && !B.nextSibling.nextSibling && U.push(B.nextSibling),
                                    (B._next = B.nextSibling && B.nextSibling._isFirst ? null : B.nextSibling),
                                    B.parentNode.removeChild(B),
                                    ma.splice(S--, 1),
                                    A--)
                                  : V ||
                                    ((n = !B.nextSibling && M(B.parentNode, k, la)),
                                    B.parentNode._parent && B.parentNode._parent.appendChild(B),
                                    n && B.parentNode.appendChild(g.createTextNode(" ")),
                                    ea.span && (B.style.display = "inline"),
                                    za.push(B))
                              : B.parentNode._isSplit && !B._isSplit && "" !== B.innerHTML
                              ? Aa.push(B)
                              : Q && !B._isSplit && (ea.span && (B.style.display = "inline"), za.push(B)))
                        : G || T
                        ? (B.parentNode && B.parentNode.removeChild(B), ma.splice(S--, 1), A--)
                        : H || k.appendChild(B);
            for (S = U.length; -1 < --S; ) U[S].parentNode.removeChild(U[S]);
            if (G) {
                T && ((q = g.createElement(ia)), k.appendChild(q), (v = q.offsetWidth + "px"), (n = q.offsetParent === k ? 0 : k.offsetLeft), k.removeChild(q));
                y = k.style.cssText;
                for (k.style.cssText = "display:none;"; k.firstChild; ) k.removeChild(k.firstChild);
                ea = " " === la && (!T || (!H && !Q));
                for (S = 0; S < G.length; S++) {
                    r = G[S];
                    q = g.createElement(ia);
                    q.style.cssText = "display:block;text-align:" + da + ";position:" + (T ? "absolute;" : "relative;");
                    fa && (q.className = fa + (La ? S + 1 : ""));
                    Ba.push(q);
                    A = r.length;
                    for (V = 0; A > V; V++)
                        "BR" !== r[V].nodeName &&
                            ((B = r[V]),
                            q.appendChild(B),
                            ea && B._wordEnd && q.appendChild(g.createTextNode(" ")),
                            T && (0 === V && ((q.style.top = B._y + "px"), (q.style.left = pa + n + "px")), (B.style.top = "0px"), n && (B.style.left = B._x - n + "px")));
                    0 === A ? (q.innerHTML = "&nbsp;") : H || Q || (w(q), p(q, String.fromCharCode(160), " "));
                    T && ((q.style.width = v), (q.style.height = B._h + "px"));
                    k.appendChild(q);
                }
                k.style.cssText = y;
            }
            T &&
                (z > k.clientHeight && ((k.style.height = z - sa + "px"), k.clientHeight < z && (k.style.height = z + ja + "px")),
                E > k.clientWidth && ((k.style.width = E - ka + "px"), k.clientWidth < E && (k.style.width = E + va + "px")));
            u(ba, za);
            u(ca, Aa);
            u(Z, Ba);
        }
        return this.chars.reverse(), this.words.reverse(), this.lines.reverse(), (this.isSplit = !0), this;
    };
    f.revert = function () {
        if (!this._originals) throw "revert() call wasn't scoped properly.";
        for (var a = this._originals.length; -1 < --a; ) this.elements[a].innerHTML = this._originals[a];
        return (this.chars = []), (this.words = []), (this.lines = []), (this.isSplit = !1), this;
    };
    z.selector =
        a.$ ||
        a.jQuery ||
        function (c) {
            var d = a.$ || a.jQuery;
            return d ? ((z.selector = d), d(c)) : "undefined" == typeof document ? c : document.querySelectorAll ? document.querySelectorAll(c) : document.getElementById("#" === c.charAt(0) ? c.substr(1) : c);
        };
    z.version = "0.5.6";
})(_gsScope);
(function (a) {
    var d = function () {
        return (_gsScope.GreenSockGlobals || _gsScope)[a];
    };
    "function" == typeof define && define.amd ? define([], d) : "undefined" != typeof module && module.exports && (module.exports = d());
})(
    "SplitText"
); /*
 VERSION: 1.19.1
 DATE: 2017-01-17
 UPDATES AND DOCS AT: http://greensock.com

 Includes all of the following: TweenLite, TweenMax, TimelineLite, TimelineMax, EasePack, CSSPlugin, RoundPropsPlugin, BezierPlugin, AttrPlugin, DirectionalRotationPlugin

 @license Copyright (c) 2008-2017, GreenSock. All rights reserved.
 This work is subject to the terms at http://greensock.com/standard-license or for
 Club GreenSock members, the software agreement that was issued with your membership.

 @author: Jack Doyle, jack@greensock.com
*/
_gsScope = "undefined" != typeof module && module.exports && "undefined" != typeof global ? global : this || window;
(_gsScope._gsQueue || (_gsScope._gsQueue = [])).push(function () {
    _gsScope._gsDefine(
        "TweenMax",
        ["core.Animation", "core.SimpleTimeline", "TweenLite"],
        function (a, d, f) {
            var c = function (a) {
                    var c,
                        d = [],
                        f = a.length;
                    for (c = 0; c !== f; d.push(a[c++]));
                    return d;
                },
                g = function (a, c, d) {
                    var f,
                        p = a.cycle;
                    for (f in p) {
                        var g = p[f];
                        a[f] = "function" == typeof g ? g(d, c[d]) : g[d % g.length];
                    }
                    delete a.cycle;
                },
                h = function (a, c, d) {
                    f.call(this, a, c, d);
                    this._cycle = 0;
                    this._yoyo = !0 === this.vars.yoyo;
                    this._repeat = this.vars.repeat || 0;
                    this._repeatDelay = this.vars.repeatDelay || 0;
                    this._dirty = !0;
                    this.render = h.prototype.render;
                },
                n = f._internals,
                l = n.isSelector,
                r = n.isArray,
                k = (h.prototype = f.to({}, 0.1, {})),
                q = [];
            h.version = "1.19.1";
            k.constructor = h;
            k.kill()._gc = !1;
            h.killTweensOf = h.killDelayedCallsTo = f.killTweensOf;
            h.getTweensOf = f.getTweensOf;
            h.lagSmoothing = f.lagSmoothing;
            h.ticker = f.ticker;
            h.render = f.render;
            k.invalidate = function () {
                return (this._yoyo = !0 === this.vars.yoyo), (this._repeat = this.vars.repeat || 0), (this._repeatDelay = this.vars.repeatDelay || 0), this._uncache(!0), f.prototype.invalidate.call(this);
            };
            k.updateTo = function (a, c) {
                var d,
                    p = this.ratio,
                    g = this.vars.immediateRender || a.immediateRender;
                c && this._startTime < this._timeline._time && ((this._startTime = this._timeline._time), this._uncache(!1), this._gc ? this._enabled(!0, !1) : this._timeline.insert(this, this._startTime - this._delay));
                for (d in a) this.vars[d] = a[d];
                if (this._initted || g)
                    if (c) (this._initted = !1), g && this.render(0, !0, !0);
                    else if ((this._gc && this._enabled(!0, !1), this._notifyPluginsOfEnabled && this._firstPT && f._onPluginEvent("_onDisable", this), 0.998 < this._time / this._duration))
                        (a = this._totalTime), this.render(0, !0, !1), (this._initted = !1), this.render(a, !0, !1);
                    else if (((this._initted = !1), this._init(), 0 < this._time || g)) for (c = 1 / (1 - p), d = this._firstPT; d; ) (a = d.s + d.c), (d.c *= c), (d.s = a - d.c), (d = d._next);
                return this;
            };
            k.render = function (a, c, d) {
                this._initted || (0 === this._duration && this.vars.repeat && this.invalidate());
                var f,
                    p,
                    g,
                    h,
                    u,
                    k,
                    z,
                    q = this._dirty ? this.totalDuration() : this._totalDuration,
                    v = this._time,
                    l = this._totalTime,
                    y = this._cycle,
                    r = this._duration,
                    C = this._rawPrevTime;
                if (
                    (a >= q - 1e-7 && 0 <= a
                        ? ((this._totalTime = q),
                          (this._cycle = this._repeat),
                          this._yoyo && 0 !== (1 & this._cycle) ? ((this._time = 0), (this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0)) : ((this._time = r), (this.ratio = this._ease._calcEnd ? this._ease.getRatio(1) : 1)),
                          this._reversed || ((f = !0), (p = "onComplete"), (d = d || this._timeline.autoRemoveChildren)),
                          0 === r &&
                              (this._initted || !this.vars.lazy || d) &&
                              (this._startTime === this._timeline._duration && (a = 0),
                              (0 > C || (0 >= a && -1e-7 <= a) || (1e-10 === C && "isPause" !== this.data)) && C !== a && ((d = !0), 1e-10 < C && (p = "onReverseComplete")),
                              (this._rawPrevTime = z = !c || a || C === a ? a : 1e-10)))
                        : 1e-7 > a
                        ? ((this._totalTime = this._time = this._cycle = 0),
                          (this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0),
                          (0 !== l || (0 === r && 0 < C)) && ((p = "onReverseComplete"), (f = this._reversed)),
                          0 > a && ((this._active = !1), 0 === r && (this._initted || !this.vars.lazy || d) && (0 <= C && (d = !0), (this._rawPrevTime = z = !c || a || C === a ? a : 1e-10))),
                          this._initted || (d = !0))
                        : ((this._totalTime = this._time = a),
                          0 !== this._repeat &&
                              ((g = r + this._repeatDelay),
                              (this._cycle = (this._totalTime / g) >> 0),
                              0 !== this._cycle && this._cycle === this._totalTime / g && a >= l && this._cycle--,
                              (this._time = this._totalTime - this._cycle * g),
                              this._yoyo && 0 !== (1 & this._cycle) && (this._time = r - this._time),
                              this._time > r ? (this._time = r) : 0 > this._time && (this._time = 0)),
                          this._easeType
                              ? ((h = this._time / r),
                                (u = this._easeType),
                                (k = this._easePower),
                                (1 === u || (3 === u && 0.5 <= h)) && (h = 1 - h),
                                3 === u && (h *= 2),
                                1 === k ? (h *= h) : 2 === k ? (h *= h * h) : 3 === k ? (h *= h * h * h) : 4 === k && (h *= h * h * h * h),
                                1 === u ? (this.ratio = 1 - h) : 2 === u ? (this.ratio = h) : 0.5 > this._time / r ? (this.ratio = h / 2) : (this.ratio = 1 - h / 2))
                              : (this.ratio = this._ease.getRatio(this._time / r))),
                    v === this._time && !d && y === this._cycle)
                )
                    return void (l !== this._totalTime && this._onUpdate && (c || this._callback("onUpdate")));
                if (!this._initted) {
                    if ((this._init(), !this._initted || this._gc)) return;
                    if (!d && this._firstPT && ((!1 !== this.vars.lazy && this._duration) || (this.vars.lazy && !this._duration)))
                        return (this._time = v), (this._totalTime = l), (this._rawPrevTime = C), (this._cycle = y), n.lazyTweens.push(this), void (this._lazy = [a, c]);
                    this._time && !f ? (this.ratio = this._ease.getRatio(this._time / r)) : f && this._ease._calcEnd && (this.ratio = this._ease.getRatio(0 === this._time ? 0 : 1));
                }
                !1 !== this._lazy && (this._lazy = !1);
                this._active || (!this._paused && this._time !== v && 0 <= a && (this._active = !0));
                0 !== l ||
                    (2 === this._initted && 0 < a && this._init(),
                    this._startAt && (0 <= a ? this._startAt.render(a, c, d) : p || (p = "_dummyGS")),
                    !this.vars.onStart || (0 === this._totalTime && 0 !== r) || (!c && this._callback("onStart")));
                for (g = this._firstPT; g; ) g.f ? g.t[g.p](g.c * this.ratio + g.s) : (g.t[g.p] = g.c * this.ratio + g.s), (g = g._next);
                this._onUpdate && (0 > a && this._startAt && this._startTime && this._startAt.render(a, c, d), c || ((this._totalTime !== l || p) && this._callback("onUpdate")));
                this._cycle !== y && (c || this._gc || (this.vars.onRepeat && this._callback("onRepeat")));
                p &&
                    (!this._gc || d) &&
                    (0 > a && this._startAt && !this._onUpdate && this._startTime && this._startAt.render(a, c, d),
                    f && (this._timeline.autoRemoveChildren && this._enabled(!1, !1), (this._active = !1)),
                    !c && this.vars[p] && this._callback(p),
                    0 === r && 1e-10 === this._rawPrevTime && 1e-10 !== z && (this._rawPrevTime = 0));
            };
            h.to = function (a, c, d) {
                return new h(a, c, d);
            };
            h.from = function (a, c, d) {
                return (d.runBackwards = !0), (d.immediateRender = 0 != d.immediateRender), new h(a, c, d);
            };
            h.fromTo = function (a, c, d, f) {
                return (f.startAt = d), (f.immediateRender = 0 != f.immediateRender && 0 != d.immediateRender), new h(a, c, f);
            };
            h.staggerTo = h.allTo = function (a, d, u, k, n, v, y) {
                k = k || 0;
                var p,
                    z,
                    E = 0,
                    M = [],
                    w = function () {
                        u.onComplete && u.onComplete.apply(u.onCompleteScope || this, arguments);
                        n.apply(y || u.callbackScope || this, v || q);
                    },
                    C = u.cycle,
                    L = u.startAt && u.startAt.cycle;
                r(a) || ("string" == typeof a && (a = f.selector(a) || a), l(a) && (a = c(a)));
                a = a || [];
                0 > k && ((a = c(a)), a.reverse(), (k *= -1));
                var W = a.length - 1;
                for (p = 0; W >= p; p++) {
                    var F = {};
                    for (z in u) F[z] = u[z];
                    if ((C && (g(F, a, p), null != F.duration && ((d = F.duration), delete F.duration)), L)) {
                        L = F.startAt = {};
                        for (z in u.startAt) L[z] = u.startAt[z];
                        g(F.startAt, a, p);
                    }
                    F.delay = E + (F.delay || 0);
                    p === W && n && (F.onComplete = w);
                    M[p] = new h(a[p], d, F);
                    E += k;
                }
                return M;
            };
            h.staggerFrom = h.allFrom = function (a, c, d, f, g, k, n) {
                return (d.runBackwards = !0), (d.immediateRender = 0 != d.immediateRender), h.staggerTo(a, c, d, f, g, k, n);
            };
            h.staggerFromTo = h.allFromTo = function (a, c, d, f, g, k, n, q) {
                return (f.startAt = d), (f.immediateRender = 0 != f.immediateRender && 0 != d.immediateRender), h.staggerTo(a, c, f, g, k, n, q);
            };
            h.delayedCall = function (a, c, d, f, g) {
                return new h(c, 0, { delay: a, onComplete: c, onCompleteParams: d, callbackScope: f, onReverseComplete: c, onReverseCompleteParams: d, immediateRender: !1, useFrames: g, overwrite: 0 });
            };
            h.set = function (a, c) {
                return new h(a, 0, c);
            };
            h.isTweening = function (a) {
                return 0 < f.getTweensOf(a, !0).length;
            };
            var v = function (a, c) {
                    var d = [],
                        g = 0;
                    for (a = a._first; a; ) a instanceof f ? (d[g++] = a) : (c && (d[g++] = a), (d = d.concat(v(a, c))), (g = d.length)), (a = a._next);
                    return d;
                },
                y = (h.getAllTweens = function (c) {
                    return v(a._rootTimeline, c).concat(v(a._rootFramesTimeline, c));
                });
            h.killAll = function (a, c, f, g) {
                null == c && (c = !0);
                null == f && (f = !0);
                var p,
                    h,
                    k = y(0 != g),
                    u = k.length,
                    n = c && f && g;
                for (h = 0; u > h; h++) (g = k[h]), (n || g instanceof d || ((p = g.target === g.vars.onComplete) && f) || (c && !p)) && (a ? g.totalTime(g._reversed ? 0 : g.totalDuration()) : g._enabled(!1, !1));
            };
            h.killChildTweensOf = function (a, d) {
                if (null != a) {
                    var g,
                        p,
                        k = n.tweenLookup;
                    if (("string" == typeof a && (a = f.selector(a) || a), l(a) && (a = c(a)), r(a))) for (g = a.length; -1 < --g; ) h.killChildTweensOf(a[g], d);
                    else {
                        var q = [];
                        for (p in k) for (g = k[p].target.parentNode; g; ) g === a && (q = q.concat(k[p].tweens)), (g = g.parentNode);
                        a = q.length;
                        for (g = 0; a > g; g++) d && q[g].totalTime(q[g].totalDuration()), q[g]._enabled(!1, !1);
                    }
                }
            };
            var C = function (a, c, f, g) {
                c = !1 !== c;
                f = !1 !== f;
                g = !1 !== g;
                for (var p, h = y(g), k = c && f && g, u = h.length; -1 < --u; ) (g = h[u]), (k || g instanceof d || ((p = g.target === g.vars.onComplete) && f) || (c && !p)) && g.paused(a);
            };
            return (
                (h.pauseAll = function (a, c, d) {
                    C(!0, a, c, d);
                }),
                (h.resumeAll = function (a, c, d) {
                    C(!1, a, c, d);
                }),
                (h.globalTimeScale = function (c) {
                    var d = a._rootTimeline,
                        g = f.ticker.time;
                    return arguments.length
                        ? ((c = c || 1e-10),
                          (d._startTime = g - ((g - d._startTime) * d._timeScale) / c),
                          (d = a._rootFramesTimeline),
                          (g = f.ticker.frame),
                          (d._startTime = g - ((g - d._startTime) * d._timeScale) / c),
                          (d._timeScale = a._rootTimeline._timeScale = c),
                          c)
                        : d._timeScale;
                }),
                (k.progress = function (a, c) {
                    return arguments.length ? this.totalTime(this.duration() * (this._yoyo && 0 !== (1 & this._cycle) ? 1 - a : a) + this._cycle * (this._duration + this._repeatDelay), c) : this._time / this.duration();
                }),
                (k.totalProgress = function (a, c) {
                    return arguments.length ? this.totalTime(this.totalDuration() * a, c) : this._totalTime / this.totalDuration();
                }),
                (k.time = function (a, c) {
                    return arguments.length
                        ? (this._dirty && this.totalDuration(),
                          a > this._duration && (a = this._duration),
                          this._yoyo && 0 !== (1 & this._cycle) ? (a = this._duration - a + this._cycle * (this._duration + this._repeatDelay)) : 0 !== this._repeat && (a += this._cycle * (this._duration + this._repeatDelay)),
                          this.totalTime(a, c))
                        : this._time;
                }),
                (k.duration = function (c) {
                    return arguments.length ? a.prototype.duration.call(this, c) : this._duration;
                }),
                (k.totalDuration = function (a) {
                    return arguments.length
                        ? -1 === this._repeat
                            ? this
                            : this.duration((a - this._repeat * this._repeatDelay) / (this._repeat + 1))
                        : (this._dirty && ((this._totalDuration = -1 === this._repeat ? 999999999999 : this._duration * (this._repeat + 1) + this._repeatDelay * this._repeat), (this._dirty = !1)), this._totalDuration);
                }),
                (k.repeat = function (a) {
                    return arguments.length ? ((this._repeat = a), this._uncache(!0)) : this._repeat;
                }),
                (k.repeatDelay = function (a) {
                    return arguments.length ? ((this._repeatDelay = a), this._uncache(!0)) : this._repeatDelay;
                }),
                (k.yoyo = function (a) {
                    return arguments.length ? ((this._yoyo = a), this) : this._yoyo;
                }),
                h
            );
        },
        !0
    );
    _gsScope._gsDefine(
        "TimelineLite",
        ["core.Animation", "core.SimpleTimeline", "TweenLite"],
        function (a, d, f) {
            var c = function (a) {
                    d.call(this, a);
                    this._labels = {};
                    this.autoRemoveChildren = !0 === this.vars.autoRemoveChildren;
                    this.smoothChildTiming = !0 === this.vars.smoothChildTiming;
                    this._sortChildren = !0;
                    this._onUpdate = this.vars.onUpdate;
                    var c,
                        f = this.vars;
                    for (c in f) (a = f[c]), l(a) && -1 !== a.join("").indexOf("{self}") && (f[c] = this._swapSelfInParams(a));
                    l(f.tweens) && this.add(f.tweens, 0, f.align, f.stagger);
                },
                g = f._internals,
                h = (c._internals = {}),
                n = g.isSelector,
                l = g.isArray,
                r = g.lazyTweens,
                k = g.lazyRender,
                q = _gsScope._gsDefine.globals,
                v = function (a) {
                    var c,
                        d = {};
                    for (c in a) d[c] = a[c];
                    return d;
                },
                y = function (a, c, d) {
                    var f,
                        g = a.cycle;
                    for (f in g) {
                        var p = g[f];
                        a[f] = "function" == typeof p ? p(d, c[d]) : p[d % p.length];
                    }
                    delete a.cycle;
                },
                C = (h.pauseCallback = function () {}),
                z = function (a) {
                    var c,
                        d = [],
                        f = a.length;
                    for (c = 0; c !== f; d.push(a[c++]));
                    return d;
                };
            g = c.prototype = new d();
            return (
                (c.version = "1.19.1"),
                (g.constructor = c),
                (g.kill()._gc = g._forcingPlayhead = g._hasPause = !1),
                (g.to = function (a, c, d, g) {
                    var p = (d.repeat && q.TweenMax) || f;
                    return c ? this.add(new p(a, c, d), g) : this.set(a, d, g);
                }),
                (g.from = function (a, c, d, g) {
                    return this.add(((d.repeat && q.TweenMax) || f).from(a, c, d), g);
                }),
                (g.fromTo = function (a, c, d, g, h) {
                    var p = (g.repeat && q.TweenMax) || f;
                    return c ? this.add(p.fromTo(a, c, d, g), h) : this.set(a, g, h);
                }),
                (g.staggerTo = function (a, d, g, h, k, q, l, r) {
                    r = new c({ onComplete: q, onCompleteParams: l, callbackScope: r, smoothChildTiming: this.smoothChildTiming });
                    var p = g.cycle;
                    "string" == typeof a && (a = f.selector(a) || a);
                    a = a || [];
                    n(a) && (a = z(a));
                    h = h || 0;
                    0 > h && ((a = z(a)), a.reverse(), (h *= -1));
                    for (l = 0; l < a.length; l++)
                        (q = v(g)), q.startAt && ((q.startAt = v(q.startAt)), q.startAt.cycle && y(q.startAt, a, l)), p && (y(q, a, l), null != q.duration && ((d = q.duration), delete q.duration)), r.to(a[l], d, q, l * h);
                    return this.add(r, k);
                }),
                (g.staggerFrom = function (a, c, d, f, g, h, k, n) {
                    return (d.immediateRender = 0 != d.immediateRender), (d.runBackwards = !0), this.staggerTo(a, c, d, f, g, h, k, n);
                }),
                (g.staggerFromTo = function (a, c, d, f, g, h, k, n, q) {
                    return (f.startAt = d), (f.immediateRender = 0 != f.immediateRender && 0 != d.immediateRender), this.staggerTo(a, c, f, g, h, k, n, q);
                }),
                (g.call = function (a, c, d, g) {
                    return this.add(f.delayedCall(0, a, c, d), g);
                }),
                (g.set = function (a, c, d) {
                    return (d = this._parseTimeOrLabel(d, 0, !0)), null == c.immediateRender && (c.immediateRender = d === this._time && !this._paused), this.add(new f(a, 0, c), d);
                }),
                (c.exportRoot = function (a, d) {
                    a = a || {};
                    null == a.smoothChildTiming && (a.smoothChildTiming = !0);
                    var g = new c(a),
                        p = g._timeline;
                    null == d && (d = !0);
                    p._remove(g, !0);
                    g._startTime = 0;
                    g._rawPrevTime = g._time = g._totalTime = p._time;
                    for (a = p._first; a; ) {
                        var h = a._next;
                        (d && a instanceof f && a.target === a.vars.onComplete) || g.add(a, a._startTime - a._delay);
                        a = h;
                    }
                    return p.add(g, 0), g;
                }),
                (g.add = function (g, h, k, n) {
                    var p, u;
                    if (("number" != typeof h && (h = this._parseTimeOrLabel(h, 0, !0, g)), !(g instanceof a))) {
                        if (g instanceof Array || (g && g.push && l(g))) {
                            k = k || "normal";
                            n = n || 0;
                            var q = g.length;
                            for (p = 0; q > p; p++)
                                l((u = g[p])) && (u = new c({ tweens: u })),
                                    this.add(u, h),
                                    "string" != typeof u && "function" != typeof u && ("sequence" === k ? (h = u._startTime + u.totalDuration() / u._timeScale) : "start" === k && (u._startTime -= u.delay())),
                                    (h += n);
                            return this._uncache(!0);
                        }
                        if ("string" == typeof g) return this.addLabel(g, h);
                        if ("function" != typeof g) throw "Cannot add " + g + " into the timeline; it is not a tween, timeline, function, or string.";
                        g = f.delayedCall(0, g);
                    }
                    if ((d.prototype.add.call(this, g, h), (this._gc || this._time === this._duration) && !this._paused && this._duration < this.duration()))
                        for (k = this, g = k.rawTime() > g._startTime; k._timeline; ) g && k._timeline.smoothChildTiming ? k.totalTime(k._totalTime, !0) : k._gc && k._enabled(!0, !1), (k = k._timeline);
                    return this;
                }),
                (g.remove = function (c) {
                    if (c instanceof a) {
                        this._remove(c, !1);
                        var d = (c._timeline = c.vars.useFrames ? a._rootFramesTimeline : a._rootTimeline);
                        return (c._startTime = (c._paused ? c._pauseTime : d._time) - (c._reversed ? c.totalDuration() - c._totalTime : c._totalTime) / c._timeScale), this;
                    }
                    if (c instanceof Array || (c && c.push && l(c))) {
                        for (d = c.length; -1 < --d; ) this.remove(c[d]);
                        return this;
                    }
                    return "string" == typeof c ? this.removeLabel(c) : this.kill(null, c);
                }),
                (g._remove = function (a, c) {
                    d.prototype._remove.call(this, a, c);
                    return this._last ? this._time > this.duration() && ((this._time = this._duration), (this._totalTime = this._totalDuration)) : (this._time = this._totalTime = this._duration = this._totalDuration = 0), this;
                }),
                (g.append = function (a, c) {
                    return this.add(a, this._parseTimeOrLabel(null, c, !0, a));
                }),
                (g.insert = g.insertMultiple = function (a, c, d, f) {
                    return this.add(a, c || 0, d, f);
                }),
                (g.appendMultiple = function (a, c, d, f) {
                    return this.add(a, this._parseTimeOrLabel(null, c, !0, a), d, f);
                }),
                (g.addLabel = function (a, c) {
                    return (this._labels[a] = this._parseTimeOrLabel(c)), this;
                }),
                (g.addPause = function (a, c, d, g) {
                    d = f.delayedCall(0, C, d, g || this);
                    return (d.vars.onComplete = d.vars.onReverseComplete = c), (d.data = "isPause"), (this._hasPause = !0), this.add(d, a);
                }),
                (g.removeLabel = function (a) {
                    return delete this._labels[a], this;
                }),
                (g.getLabelTime = function (a) {
                    return null != this._labels[a] ? this._labels[a] : -1;
                }),
                (g._parseTimeOrLabel = function (c, d, f, g) {
                    var h;
                    if (g instanceof a && g.timeline === this) this.remove(g);
                    else if (g && (g instanceof Array || (g.push && l(g)))) for (h = g.length; -1 < --h; ) g[h] instanceof a && g[h].timeline === this && this.remove(g[h]);
                    if ("string" == typeof d) return this._parseTimeOrLabel(d, f && "number" == typeof c && null == this._labels[d] ? c - this.duration() : 0, f);
                    if (((d = d || 0), "string" != typeof c || (!isNaN(c) && null == this._labels[c]))) null == c && (c = this.duration());
                    else {
                        if (((h = c.indexOf("=")), -1 === h)) return null == this._labels[c] ? (f ? (this._labels[c] = this.duration() + d) : d) : this._labels[c] + d;
                        d = parseInt(c.charAt(h - 1) + "1", 10) * Number(c.substr(h + 1));
                        c = 1 < h ? this._parseTimeOrLabel(c.substr(0, h - 1), 0, f) : this.duration();
                    }
                    return Number(c) + d;
                }),
                (g.seek = function (a, c) {
                    return this.totalTime("number" == typeof a ? a : this._parseTimeOrLabel(a), !1 !== c);
                }),
                (g.stop = function () {
                    return this.paused(!0);
                }),
                (g.gotoAndPlay = function (a, c) {
                    return this.play(a, c);
                }),
                (g.gotoAndStop = function (a, c) {
                    return this.pause(a, c);
                }),
                (g.render = function (a, c, d) {
                    this._gc && this._enabled(!0, !1);
                    var f,
                        g,
                        h,
                        p,
                        n,
                        u,
                        q,
                        v = this._dirty ? this.totalDuration() : this._totalDuration,
                        l = this._time,
                        z = this._startTime,
                        y = this._timeScale,
                        E = this._paused;
                    if (a >= v - 1e-7 && 0 <= a)
                        (this._totalTime = this._time = v),
                            this._reversed ||
                                this._hasPausedChild() ||
                                ((g = !0),
                                (p = "onComplete"),
                                (n = !!this._timeline.autoRemoveChildren),
                                0 === this._duration &&
                                    ((0 >= a && -1e-7 <= a) || 0 > this._rawPrevTime || 1e-10 === this._rawPrevTime) &&
                                    this._rawPrevTime !== a &&
                                    this._first &&
                                    ((n = !0), 1e-10 < this._rawPrevTime && (p = "onReverseComplete"))),
                            (this._rawPrevTime = this._duration || !c || a || this._rawPrevTime === a ? a : 1e-10),
                            (a = v + 1e-4);
                    else if (1e-7 > a)
                        if (
                            ((this._totalTime = this._time = 0),
                            (0 !== l || (0 === this._duration && 1e-10 !== this._rawPrevTime && (0 < this._rawPrevTime || (0 > a && 0 <= this._rawPrevTime)))) && ((p = "onReverseComplete"), (g = this._reversed)),
                            0 > a)
                        )
                            (this._active = !1), this._timeline.autoRemoveChildren && this._reversed ? ((n = g = !0), (p = "onReverseComplete")) : 0 <= this._rawPrevTime && this._first && (n = !0), (this._rawPrevTime = a);
                        else {
                            if (((this._rawPrevTime = this._duration || !c || a || this._rawPrevTime === a ? a : 1e-10), 0 === a && g)) for (f = this._first; f && 0 === f._startTime; ) f._duration || (g = !1), (f = f._next);
                            a = 0;
                            this._initted || (n = !0);
                        }
                    else {
                        if (this._hasPause && !this._forcingPlayhead && !c) {
                            if (a >= l) for (f = this._first; f && f._startTime <= a && !u; ) f._duration || "isPause" !== f.data || f.ratio || (0 === f._startTime && 0 === this._rawPrevTime) || (u = f), (f = f._next);
                            else for (f = this._last; f && f._startTime >= a && !u; ) f._duration || ("isPause" === f.data && 0 < f._rawPrevTime && (u = f)), (f = f._prev);
                            u && ((this._time = a = u._startTime), (this._totalTime = a + this._cycle * (this._totalDuration + this._repeatDelay)));
                        }
                        this._totalTime = this._time = this._rawPrevTime = a;
                    }
                    if ((this._time !== l && this._first) || d || n || u) {
                        if (
                            (this._initted || (this._initted = !0),
                            this._active || (!this._paused && this._time !== l && 0 < a && (this._active = !0)),
                            0 === l && this.vars.onStart && ((0 === this._time && this._duration) || c || this._callback("onStart")),
                            (q = this._time),
                            q >= l)
                        )
                            for (f = this._first; f && ((h = f._next), q === this._time && (!this._paused || E)); )
                                (f._active || (f._startTime <= q && !f._paused && !f._gc)) &&
                                    (u === f && this.pause(), f._reversed ? f.render((f._dirty ? f.totalDuration() : f._totalDuration) - (a - f._startTime) * f._timeScale, c, d) : f.render((a - f._startTime) * f._timeScale, c, d)),
                                    (f = h);
                        else
                            for (f = this._last; f && ((h = f._prev), q === this._time && (!this._paused || E)); ) {
                                if (f._active || (f._startTime <= l && !f._paused && !f._gc)) {
                                    if (u === f) {
                                        for (u = f._prev; u && u.endTime() > this._time; ) u.render(u._reversed ? u.totalDuration() - (a - u._startTime) * u._timeScale : (a - u._startTime) * u._timeScale, c, d), (u = u._prev);
                                        u = null;
                                        this.pause();
                                    }
                                    f._reversed ? f.render((f._dirty ? f.totalDuration() : f._totalDuration) - (a - f._startTime) * f._timeScale, c, d) : f.render((a - f._startTime) * f._timeScale, c, d);
                                }
                                f = h;
                            }
                        this._onUpdate && (c || (r.length && k(), this._callback("onUpdate")));
                        p &&
                            (this._gc ||
                                ((z === this._startTime || y !== this._timeScale) &&
                                    (0 === this._time || v >= this.totalDuration()) &&
                                    (g && (r.length && k(), this._timeline.autoRemoveChildren && this._enabled(!1, !1), (this._active = !1)), !c && this.vars[p] && this._callback(p))));
                    }
                }),
                (g._hasPausedChild = function () {
                    for (var a = this._first; a; ) {
                        if (a._paused || (a instanceof c && a._hasPausedChild())) return !0;
                        a = a._next;
                    }
                    return !1;
                }),
                (g.getChildren = function (a, c, d, g) {
                    g = g || -9999999999;
                    for (var h = [], k = this._first, p = 0; k; )
                        k._startTime < g || (k instanceof f ? !1 !== c && (h[p++] = k) : (!1 !== d && (h[p++] = k), !1 !== a && ((h = h.concat(k.getChildren(!0, c, d))), (p = h.length)))), (k = k._next);
                    return h;
                }),
                (g.getTweensOf = function (a, c) {
                    var d,
                        g = this._gc,
                        h = [],
                        k = 0;
                    g && this._enabled(!0, !0);
                    a = f.getTweensOf(a);
                    for (d = a.length; -1 < --d; ) (a[d].timeline === this || (c && this._contains(a[d]))) && (h[k++] = a[d]);
                    return g && this._enabled(!1, !0), h;
                }),
                (g.recent = function () {
                    return this._recent;
                }),
                (g._contains = function (a) {
                    for (a = a.timeline; a; ) {
                        if (a === this) return !0;
                        a = a.timeline;
                    }
                    return !1;
                }),
                (g.shiftChildren = function (a, c, d) {
                    d = d || 0;
                    for (var f, g = this._first, h = this._labels; g; ) g._startTime >= d && (g._startTime += a), (g = g._next);
                    if (c) for (f in h) h[f] >= d && (h[f] += a);
                    return this._uncache(!0);
                }),
                (g._kill = function (a, c) {
                    if (!a && !c) return this._enabled(!1, !1);
                    for (var d = c ? this.getTweensOf(c) : this.getChildren(!0, !0, !1), f = d.length, g = !1; -1 < --f; ) d[f]._kill(a, c) && (g = !0);
                    return g;
                }),
                (g.clear = function (a) {
                    var c = this.getChildren(!1, !0, !0),
                        d = c.length;
                    for (this._time = this._totalTime = 0; -1 < --d; ) c[d]._enabled(!1, !1);
                    return !1 !== a && (this._labels = {}), this._uncache(!0);
                }),
                (g.invalidate = function () {
                    for (var c = this._first; c; ) c.invalidate(), (c = c._next);
                    return a.prototype.invalidate.call(this);
                }),
                (g._enabled = function (a, c) {
                    if (a === this._gc) for (var f = this._first; f; ) f._enabled(a, !0), (f = f._next);
                    return d.prototype._enabled.call(this, a, c);
                }),
                (g.totalTime = function (c, d, f) {
                    this._forcingPlayhead = !0;
                    var g = a.prototype.totalTime.apply(this, arguments);
                    return (this._forcingPlayhead = !1), g;
                }),
                (g.duration = function (a) {
                    return arguments.length ? (0 !== this.duration() && 0 !== a && this.timeScale(this._duration / a), this) : (this._dirty && this.totalDuration(), this._duration);
                }),
                (g.totalDuration = function (a) {
                    if (!arguments.length) {
                        if (this._dirty) {
                            var c = 0;
                            var d = this._last;
                            for (var f = 999999999999; d; ) {
                                var g = d._prev;
                                d._dirty && d.totalDuration();
                                d._startTime > f && this._sortChildren && !d._paused ? this.add(d, d._startTime - d._delay) : (f = d._startTime);
                                0 > d._startTime && !d._paused && ((c -= d._startTime), this._timeline.smoothChildTiming && (this._startTime += d._startTime / this._timeScale), this.shiftChildren(-d._startTime, !1, -9999999999), (f = 0));
                                d = d._startTime + d._totalDuration / d._timeScale;
                                d > c && (c = d);
                                d = g;
                            }
                            this._duration = this._totalDuration = c;
                            this._dirty = !1;
                        }
                        return this._totalDuration;
                    }
                    return a && this.totalDuration() ? this.timeScale(this._totalDuration / a) : this;
                }),
                (g.paused = function (c) {
                    if (!c) for (var d = this._first, f = this._time; d; ) d._startTime === f && "isPause" === d.data && (d._rawPrevTime = 0), (d = d._next);
                    return a.prototype.paused.apply(this, arguments);
                }),
                (g.usesFrames = function () {
                    for (var c = this._timeline; c._timeline; ) c = c._timeline;
                    return c === a._rootFramesTimeline;
                }),
                (g.rawTime = function (a) {
                    return a && (this._paused || (this._repeat && 0 < this.time() && 1 > this.totalProgress()))
                        ? this._totalTime % (this._duration + this._repeatDelay)
                        : this._paused
                        ? this._totalTime
                        : (this._timeline.rawTime(a) - this._startTime) * this._timeScale;
                }),
                c
            );
        },
        !0
    );
    _gsScope._gsDefine(
        "TimelineMax",
        ["TimelineLite", "TweenLite", "easing.Ease"],
        function (a, d, f) {
            var c = function (c) {
                    a.call(this, c);
                    this._repeat = this.vars.repeat || 0;
                    this._repeatDelay = this.vars.repeatDelay || 0;
                    this._cycle = 0;
                    this._yoyo = !0 === this.vars.yoyo;
                    this._dirty = !0;
                },
                g = d._internals,
                h = g.lazyTweens,
                n = g.lazyRender,
                l = _gsScope._gsDefine.globals,
                r = new f(null, null, 1, 0);
            f = c.prototype = new a();
            return (
                (f.constructor = c),
                (f.kill()._gc = !1),
                (c.version = "1.19.1"),
                (f.invalidate = function () {
                    return (this._yoyo = !0 === this.vars.yoyo), (this._repeat = this.vars.repeat || 0), (this._repeatDelay = this.vars.repeatDelay || 0), this._uncache(!0), a.prototype.invalidate.call(this);
                }),
                (f.addCallback = function (a, c, f, g) {
                    return this.add(d.delayedCall(0, a, f, g), c);
                }),
                (f.removeCallback = function (a, c) {
                    if (a)
                        if (null == c) this._kill(null, a);
                        else {
                            a = this.getTweensOf(a, !1);
                            var d = a.length;
                            for (c = this._parseTimeOrLabel(c); -1 < --d; ) a[d]._startTime === c && a[d]._enabled(!1, !1);
                        }
                    return this;
                }),
                (f.removePause = function (c) {
                    return this.removeCallback(a._internals.pauseCallback, c);
                }),
                (f.tweenTo = function (a, c) {
                    c = c || {};
                    var f,
                        g,
                        h,
                        k = { ease: r, useFrames: this.usesFrames(), immediateRender: !1 },
                        p = (c.repeat && l.TweenMax) || d;
                    for (g in c) k[g] = c[g];
                    return (
                        (k.time = this._parseTimeOrLabel(a)),
                        (f = Math.abs(Number(k.time) - this._time) / this._timeScale || 0.001),
                        (h = new p(this, f, k)),
                        (k.onStart = function () {
                            h.target.paused(!0);
                            h.vars.time !== h.target.time() && f === h.duration() && h.duration(Math.abs(h.vars.time - h.target.time()) / h.target._timeScale);
                            c.onStart && c.onStart.apply(c.onStartScope || c.callbackScope || h, c.onStartParams || []);
                        }),
                        h
                    );
                }),
                (f.tweenFromTo = function (a, c, d) {
                    d = d || {};
                    a = this._parseTimeOrLabel(a);
                    d.startAt = { onComplete: this.seek, onCompleteParams: [a], callbackScope: this };
                    d.immediateRender = !1 !== d.immediateRender;
                    c = this.tweenTo(c, d);
                    return c.duration(Math.abs(c.vars.time - a) / this._timeScale || 0.001);
                }),
                (f.render = function (a, c, d) {
                    this._gc && this._enabled(!0, !1);
                    var f,
                        g,
                        k,
                        p,
                        u,
                        q,
                        l,
                        v = this._dirty ? this.totalDuration() : this._totalDuration,
                        r = this._duration,
                        B = this._time,
                        O = this._totalTime,
                        P = this._startTime,
                        D = this._timeScale,
                        J = this._rawPrevTime,
                        R = this._paused,
                        K = this._cycle;
                    if (a >= v - 1e-7 && 0 <= a)
                        this._locked || ((this._totalTime = v), (this._cycle = this._repeat)),
                            this._reversed ||
                                this._hasPausedChild() ||
                                ((g = !0),
                                (p = "onComplete"),
                                (u = !!this._timeline.autoRemoveChildren),
                                0 === this._duration && ((0 >= a && -1e-7 <= a) || 0 > J || 1e-10 === J) && J !== a && this._first && ((u = !0), 1e-10 < J && (p = "onReverseComplete"))),
                            (this._rawPrevTime = this._duration || !c || a || this._rawPrevTime === a ? a : 1e-10),
                            this._yoyo && 0 !== (1 & this._cycle) ? (this._time = a = 0) : ((this._time = r), (a = r + 1e-4));
                    else if (1e-7 > a)
                        if (
                            (this._locked || (this._totalTime = this._cycle = 0),
                            (this._time = 0),
                            (0 !== B || (0 === r && 1e-10 !== J && (0 < J || (0 > a && 0 <= J)) && !this._locked)) && ((p = "onReverseComplete"), (g = this._reversed)),
                            0 > a)
                        )
                            (this._active = !1), this._timeline.autoRemoveChildren && this._reversed ? ((u = g = !0), (p = "onReverseComplete")) : 0 <= J && this._first && (u = !0), (this._rawPrevTime = a);
                        else {
                            if (((this._rawPrevTime = r || !c || a || this._rawPrevTime === a ? a : 1e-10), 0 === a && g)) for (f = this._first; f && 0 === f._startTime; ) f._duration || (g = !1), (f = f._next);
                            a = 0;
                            this._initted || (u = !0);
                        }
                    else if (
                        (0 === r && 0 > J && (u = !0),
                        (this._time = this._rawPrevTime = a),
                        this._locked ||
                            ((this._totalTime = a),
                            0 !== this._repeat &&
                                ((f = r + this._repeatDelay),
                                (this._cycle = (this._totalTime / f) >> 0),
                                0 !== this._cycle && this._cycle === this._totalTime / f && a >= O && this._cycle--,
                                (this._time = this._totalTime - this._cycle * f),
                                this._yoyo && 0 !== (1 & this._cycle) && (this._time = r - this._time),
                                this._time > r ? ((this._time = r), (a = r + 1e-4)) : 0 > this._time ? (this._time = a = 0) : (a = this._time))),
                        this._hasPause && !this._forcingPlayhead && !c && r > a)
                    ) {
                        if (((a = this._time), a >= B || (this._repeat && K !== this._cycle)))
                            for (f = this._first; f && f._startTime <= a && !q; ) f._duration || "isPause" !== f.data || f.ratio || (0 === f._startTime && 0 === this._rawPrevTime) || (q = f), (f = f._next);
                        else for (f = this._last; f && f._startTime >= a && !q; ) f._duration || ("isPause" === f.data && 0 < f._rawPrevTime && (q = f)), (f = f._prev);
                        q && ((this._time = a = q._startTime), (this._totalTime = a + this._cycle * (this._totalDuration + this._repeatDelay)));
                    }
                    if (this._cycle !== K && !this._locked) {
                        f = this._yoyo && 0 !== (1 & K);
                        var W = f === (this._yoyo && 0 !== (1 & this._cycle)),
                            F = this._totalTime,
                            X = this._cycle,
                            Y = this._rawPrevTime,
                            oa = this._time;
                        if (
                            ((this._totalTime = K * r),
                            this._cycle < K ? (f = !f) : (this._totalTime += r),
                            (this._time = B),
                            (this._rawPrevTime = 0 === r ? J - 1e-4 : J),
                            (this._cycle = K),
                            (this._locked = !0),
                            (B = f ? 0 : r),
                            this.render(B, c, 0 === r),
                            c || this._gc || (this.vars.onRepeat && ((this._cycle = X), (this._locked = !1), this._callback("onRepeat"))),
                            B !== this._time) ||
                            (W && ((this._cycle = K), (this._locked = !0), (B = f ? r + 1e-4 : -1e-4), this.render(B, !0, !1)), (this._locked = !1), this._paused && !R)
                        )
                            return;
                        this._time = oa;
                        this._totalTime = F;
                        this._cycle = X;
                        this._rawPrevTime = Y;
                    }
                    if (!((this._time !== B && this._first) || d || u || q)) return void (O !== this._totalTime && this._onUpdate && (c || this._callback("onUpdate")));
                    if (
                        (this._initted || (this._initted = !0),
                        this._active || (!this._paused && this._totalTime !== O && 0 < a && (this._active = !0)),
                        0 === O && this.vars.onStart && ((0 === this._totalTime && this._totalDuration) || c || this._callback("onStart")),
                        (l = this._time),
                        l >= B)
                    )
                        for (f = this._first; f && ((k = f._next), l === this._time && (!this._paused || R)); )
                            (f._active || (f._startTime <= this._time && !f._paused && !f._gc)) &&
                                (q === f && this.pause(), f._reversed ? f.render((f._dirty ? f.totalDuration() : f._totalDuration) - (a - f._startTime) * f._timeScale, c, d) : f.render((a - f._startTime) * f._timeScale, c, d)),
                                (f = k);
                    else
                        for (f = this._last; f && ((k = f._prev), l === this._time && (!this._paused || R)); ) {
                            if (f._active || (f._startTime <= B && !f._paused && !f._gc)) {
                                if (q === f) {
                                    for (q = f._prev; q && q.endTime() > this._time; ) q.render(q._reversed ? q.totalDuration() - (a - q._startTime) * q._timeScale : (a - q._startTime) * q._timeScale, c, d), (q = q._prev);
                                    q = null;
                                    this.pause();
                                }
                                f._reversed ? f.render((f._dirty ? f.totalDuration() : f._totalDuration) - (a - f._startTime) * f._timeScale, c, d) : f.render((a - f._startTime) * f._timeScale, c, d);
                            }
                            f = k;
                        }
                    this._onUpdate && (c || (h.length && n(), this._callback("onUpdate")));
                    p &&
                        (this._locked ||
                            this._gc ||
                            ((P === this._startTime || D !== this._timeScale) &&
                                (0 === this._time || v >= this.totalDuration()) &&
                                (g && (h.length && n(), this._timeline.autoRemoveChildren && this._enabled(!1, !1), (this._active = !1)), !c && this.vars[p] && this._callback(p))));
                }),
                (f.getActive = function (a, c, d) {
                    null == a && (a = !0);
                    null == c && (c = !0);
                    null == d && (d = !1);
                    var f = [];
                    d = this.getChildren(a, c, d);
                    var g = 0,
                        h = d.length;
                    for (a = 0; h > a; a++) (c = d[a]), c.isActive() && (f[g++] = c);
                    return f;
                }),
                (f.getLabelAfter = function (a) {
                    a || (0 !== a && (a = this._time));
                    var c,
                        d = this.getLabelsArray(),
                        f = d.length;
                    for (c = 0; f > c; c++) if (d[c].time > a) return d[c].name;
                    return null;
                }),
                (f.getLabelBefore = function (a) {
                    null == a && (a = this._time);
                    for (var c = this.getLabelsArray(), d = c.length; -1 < --d; ) if (c[d].time < a) return c[d].name;
                    return null;
                }),
                (f.getLabelsArray = function () {
                    var a,
                        c = [],
                        d = 0;
                    for (a in this._labels) c[d++] = { time: this._labels[a], name: a };
                    return (
                        c.sort(function (a, c) {
                            return a.time - c.time;
                        }),
                        c
                    );
                }),
                (f.invalidate = function () {
                    return (this._locked = !1), a.prototype.invalidate.call(this);
                }),
                (f.progress = function (a, c) {
                    return arguments.length ? this.totalTime(this.duration() * (this._yoyo && 0 !== (1 & this._cycle) ? 1 - a : a) + this._cycle * (this._duration + this._repeatDelay), c) : this._time / this.duration();
                }),
                (f.totalProgress = function (a, c) {
                    return arguments.length ? this.totalTime(this.totalDuration() * a, c) : this._totalTime / this.totalDuration();
                }),
                (f.totalDuration = function (c) {
                    return arguments.length
                        ? -1 !== this._repeat && c
                            ? this.timeScale(this.totalDuration() / c)
                            : this
                        : (this._dirty && (a.prototype.totalDuration.call(this), (this._totalDuration = -1 === this._repeat ? 999999999999 : this._duration * (this._repeat + 1) + this._repeatDelay * this._repeat)), this._totalDuration);
                }),
                (f.time = function (a, c) {
                    return arguments.length
                        ? (this._dirty && this.totalDuration(),
                          a > this._duration && (a = this._duration),
                          this._yoyo && 0 !== (1 & this._cycle) ? (a = this._duration - a + this._cycle * (this._duration + this._repeatDelay)) : 0 !== this._repeat && (a += this._cycle * (this._duration + this._repeatDelay)),
                          this.totalTime(a, c))
                        : this._time;
                }),
                (f.repeat = function (a) {
                    return arguments.length ? ((this._repeat = a), this._uncache(!0)) : this._repeat;
                }),
                (f.repeatDelay = function (a) {
                    return arguments.length ? ((this._repeatDelay = a), this._uncache(!0)) : this._repeatDelay;
                }),
                (f.yoyo = function (a) {
                    return arguments.length ? ((this._yoyo = a), this) : this._yoyo;
                }),
                (f.currentLabel = function (a) {
                    return arguments.length ? this.seek(a, !0) : this.getLabelBefore(this._time + 1e-8);
                }),
                c
            );
        },
        !0
    );
    (function () {
        var a = 180 / Math.PI,
            d = [],
            f = [],
            c = [],
            g = {},
            h = _gsScope._gsDefine.globals,
            n = function (a, c, d, f) {
                d === f && (d = f - (f - c) / 1e6);
                a === c && (c = a + (d - a) / 1e6);
                this.a = a;
                this.b = c;
                this.c = d;
                this.d = f;
                this.da = f - a;
                this.ca = d - a;
                this.ba = c - a;
            },
            l = function (a, c, d, f) {
                var g = { a: a },
                    h = {},
                    k = {},
                    n = { c: f },
                    l = (a + c) / 2,
                    q = (c + d) / 2;
                d = (d + f) / 2;
                c = (l + q) / 2;
                q = (q + d) / 2;
                var r = (q - c) / 8;
                return (g.b = l + (a - l) / 4), (h.b = c + r), (g.c = h.a = (g.b + h.b) / 2), (h.c = k.a = (c + q) / 2), (k.b = q - r), (n.b = d + (f - d) / 4), (k.c = n.a = (k.b + n.b) / 2), [g, h, k, n];
            },
            r = function (a, h, k, q, p, u) {
                var r,
                    v,
                    z = {},
                    y = [],
                    C = u || a[0];
                p = "string" == typeof p ? "," + p + "," : ",x,y,z,left,top,right,bottom,marginTop,marginLeft,marginRight,marginBottom,paddingLeft,paddingTop,paddingRight,paddingBottom,backgroundPosition,backgroundPosition_y,";
                null == h && (h = 1);
                for (v in a[0]) y.push(v);
                if (1 < a.length) {
                    var O = a[a.length - 1];
                    var P = !0;
                    for (r = y.length; -1 < --r; )
                        if (((v = y[r]), 0.05 < Math.abs(C[v] - O[v]))) {
                            P = !1;
                            break;
                        }
                    P && ((a = a.concat()), u && a.unshift(u), a.push(a[1]), (u = a[a.length - 3]));
                }
                d.length = f.length = c.length = 0;
                for (r = y.length; -1 < --r; ) {
                    v = y[r];
                    g[v] = -1 !== p.indexOf("," + v + ",");
                    O = v;
                    var D = void 0;
                    C = void 0;
                    var J,
                        R = void 0,
                        K = a,
                        W = v,
                        F = g[v];
                    var X = u;
                    var Y = [];
                    if (X) for (K = [X].concat(K), J = K.length; -1 < --J; ) "string" == typeof (D = K[J][W]) && "=" === D.charAt(1) && (K[J][W] = X[W] + Number(D.charAt(0) + D.substr(2)));
                    if (((R = K.length - 2), 0 > R)) C = ((Y[0] = new n(K[0][W], 0, 0, K[-1 > R ? 0 : 1][W])), Y);
                    else {
                        for (J = 0; R > J; J++) (X = K[J][W]), (D = K[J + 1][W]), (Y[J] = new n(X, 0, 0, D)), F && ((C = K[J + 2][W]), (d[J] = (d[J] || 0) + (D - X) * (D - X)), (f[J] = (f[J] || 0) + (C - D) * (C - D)));
                        C = ((Y[J] = new n(K[J][W], 0, 0, K[J + 1][W])), Y);
                    }
                    z[O] = C;
                }
                for (r = d.length; -1 < --r; ) (d[r] = Math.sqrt(d[r])), (f[r] = Math.sqrt(f[r]));
                if (!q) {
                    for (r = y.length; -1 < --r; ) if (g[v]) for (a = z[y[r]], O = a.length - 1, p = 0; O > p; p++) (u = a[p + 1].da / f[p] + a[p].da / d[p] || 0), (c[p] = (c[p] || 0) + u * u);
                    for (r = c.length; -1 < --r; ) c[r] = Math.sqrt(c[r]);
                }
                r = y.length;
                for (p = k ? 4 : 1; -1 < --r; ) {
                    v = y[r];
                    a = z[v];
                    J = C = O = u = void 0;
                    W = K = R = void 0;
                    var oa;
                    F = a;
                    Y = h;
                    D = k;
                    X = q;
                    var ta = g[v],
                        S = F.length - 1,
                        ea = 0,
                        ba = F[0].a;
                    for (oa = 0; S > oa; oa++) {
                        v = F[ea];
                        var ca = v.a;
                        var Z = v.d;
                        var da = F[ea + 1].d;
                        ta
                            ? ((C = d[oa]),
                              (O = f[oa]),
                              (u = ((O + C) * Y * 0.25) / (X ? 0.5 : c[oa] || 0.5)),
                              (W = Z - (Z - ca) * (X ? 0.5 * Y : 0 !== C ? u / C : 0)),
                              (K = Z + (da - Z) * (X ? 0.5 * Y : 0 !== O ? u / O : 0)),
                              (R = Z - (W + (((K - W) * ((3 * C) / (C + O) + 0.5)) / 4 || 0))))
                            : ((W = Z - (Z - ca) * Y * 0.5), (K = Z + (da - Z) * Y * 0.5), (R = Z - (W + K) / 2));
                        W += R;
                        K += R;
                        v.c = da = W;
                        0 !== oa ? (v.b = ba) : (v.b = ba = v.a + 0.6 * (v.c - v.a));
                        v.da = Z - ca;
                        v.ca = da - ca;
                        v.ba = ba - ca;
                        D ? ((J = l(ca, ba, da, Z)), F.splice(ea, 1, J[0], J[1], J[2], J[3]), (ea += 4)) : ea++;
                        ba = K;
                    }
                    v = F[ea];
                    v.b = ba;
                    v.c = ba + 0.4 * (v.d - ba);
                    v.da = v.d - v.a;
                    v.ca = v.c - v.a;
                    v.ba = ba - v.a;
                    D && ((J = l(v.a, ba, v.c, v.d)), F.splice(ea, 1, J[0], J[1], J[2], J[3]));
                    P && (a.splice(0, p), a.splice(a.length - p, p));
                }
                return z;
            },
            k = _gsScope._gsDefine.plugin({
                propName: "bezier",
                priority: -1,
                version: "1.3.7",
                API: 2,
                global: !0,
                init: function (a, c, d) {
                    this._target = a;
                    c instanceof Array && (c = { values: c });
                    this._func = {};
                    this._mod = {};
                    this._props = [];
                    this._timeRes = null == c.timeResolution ? 6 : parseInt(c.timeResolution, 10);
                    var f,
                        g,
                        h,
                        k = c.values || [],
                        q = {};
                    var l = k[0];
                    this._autoRotate = (f = c.autoRotate || d.vars.orientToBezier) ? (f instanceof Array ? f : [["x", "y", "rotation", !0 === f ? 0 : Number(f) || 0]]) : null;
                    for (v in l) this._props.push(v);
                    for (l = this._props.length; -1 < --l; ) {
                        var v = this._props[l];
                        this._overwriteProps.push(v);
                        f = this._func[v] = "function" == typeof a[v];
                        q[v] = f ? a[v.indexOf("set") || "function" != typeof a["get" + v.substr(3)] ? v : "get" + v.substr(3)]() : parseFloat(a[v]);
                        h || (q[v] !== k[0][v] && (h = q));
                    }
                    if ("cubic" !== c.type && "quadratic" !== c.type && "soft" !== c.type) q = r(k, isNaN(c.curviness) ? 1 : c.curviness, !1, "thruBasic" === c.type, c.correlate, h);
                    else {
                        l = k;
                        k = (k = c.type) || "soft";
                        var y, C, P;
                        c = {};
                        h = "cubic" === k ? 3 : 2;
                        var D = "soft" === k,
                            J = [];
                        if ((D && q && (l = [q].concat(l)), null == l || l.length < h + 1)) throw "invalid Bezier data";
                        for (R in l[0]) J.push(R);
                        for (C = J.length; -1 < --C; ) {
                            var R = J[C];
                            c[R] = f = [];
                            var K = 0;
                            var W = l.length;
                            for (P = 0; W > P; P++)
                                (k = null == q ? l[P][R] : "string" == typeof (y = l[P][R]) && "=" === y.charAt(1) ? q[R] + Number(y.charAt(0) + y.substr(2)) : Number(y)),
                                    D && 1 < P && W - 1 > P && (f[K++] = (k + f[K - 2]) / 2),
                                    (f[K++] = k);
                            W = K - h + 1;
                            for (P = K = 0; W > P; P += h) {
                                k = f[P];
                                R = f[P + 1];
                                y = f[P + 2];
                                var F = 2 === h ? 0 : f[P + 3];
                                f[K++] = y = 3 === h ? new n(k, R, y, F) : new n(k, (2 * R + k) / 3, (2 * R + y) / 3, y);
                            }
                            f.length = K;
                        }
                        q = c;
                    }
                    if (((this._beziers = q), (this._segCount = this._beziers[v].length), this._timeRes)) {
                        f = this._beziers;
                        v = this._timeRes;
                        v = v >> 0 || 6;
                        q = [];
                        R = [];
                        l = y = 0;
                        c = v - 1;
                        h = [];
                        k = [];
                        for (g in f)
                            for (W = f[g], K = q, D = v, J = 1 / D, F = W.length; -1 < --F; ) {
                                var X = W[F];
                                var Y = X.a;
                                P = X.d - Y;
                                C = X.c - Y;
                                Y = X.b - Y;
                                var oa = 0;
                                for (X = 1; D >= X; X++) {
                                    var ta = J * X;
                                    var S = 1 - ta;
                                    ta = oa - (oa = (ta * ta * P + 3 * S * (ta * C + S * Y)) * ta);
                                    S = F * D + X - 1;
                                    K[S] = (K[S] || 0) + ta * ta;
                                }
                            }
                        f = q.length;
                        for (g = 0; f > g; g++) (y += Math.sqrt(q[g])), (C = g % v), (k[C] = y), C === c && ((l += y), (C = (g / v) >> 0), (h[C] = k), (R[C] = l), (y = 0), (k = []));
                        this._length = l;
                        this._lengths = R;
                        this._segments = h;
                        this._l1 = this._li = this._s1 = this._si = 0;
                        this._l2 = this._lengths[0];
                        this._curSeg = this._segments[0];
                        this._s2 = this._curSeg[0];
                        this._prec = 1 / this._curSeg.length;
                    }
                    if ((f = this._autoRotate))
                        for (this._initialRotations = [], f[0] instanceof Array || (this._autoRotate = f = [f]), l = f.length; -1 < --l; ) {
                            for (g = 0; 3 > g; g++) (v = f[l][g]), (this._func[v] = "function" == typeof a[v] ? a[v.indexOf("set") || "function" != typeof a["get" + v.substr(3)] ? v : "get" + v.substr(3)] : !1);
                            v = f[l][2];
                            this._initialRotations[l] = (this._func[v] ? this._func[v].call(this._target) : this._target[v]) || 0;
                            this._overwriteProps.push(v);
                        }
                    return (this._startRatio = d.vars.runBackwards ? 1 : 0), !0;
                },
                set: function (c) {
                    var d, f, g;
                    var h = this._segCount;
                    var k = this._func,
                        n = this._target,
                        l = c !== this._startRatio;
                    if (this._timeRes) {
                        if (((d = this._lengths), (g = this._curSeg), (c *= this._length), (f = this._li), c > this._l2 && h - 1 > f)) {
                            for (--h; h > f && (this._l2 = d[++f]) <= c; );
                            this._l1 = d[f - 1];
                            this._li = f;
                            this._curSeg = g = this._segments[f];
                            this._s2 = g[(this._s1 = this._si = 0)];
                        } else if (c < this._l1 && 0 < f) {
                            for (; 0 < f && (this._l1 = d[--f]) >= c; );
                            0 === f && c < this._l1 ? (this._l1 = 0) : f++;
                            this._l2 = d[f];
                            this._li = f;
                            this._curSeg = g = this._segments[f];
                            this._s1 = g[(this._si = g.length - 1) - 1] || 0;
                            this._s2 = g[this._si];
                        }
                        if (((d = f), (c -= this._l1), (f = this._si), c > this._s2 && f < g.length - 1)) {
                            for (h = g.length - 1; h > f && (this._s2 = g[++f]) <= c; );
                            this._s1 = g[f - 1];
                            this._si = f;
                        } else if (c < this._s1 && 0 < f) {
                            for (; 0 < f && (this._s1 = g[--f]) >= c; );
                            0 === f && c < this._s1 ? (this._s1 = 0) : f++;
                            this._s2 = g[f];
                            this._si = f;
                        }
                        h = (f + (c - this._s1) / (this._s2 - this._s1)) * this._prec || 0;
                    } else (d = 0 > c ? 0 : 1 <= c ? h - 1 : (h * c) >> 0), (h *= c - (1 / h) * d);
                    var q = 1 - h;
                    for (f = this._props.length; -1 < --f; ) {
                        c = this._props[f];
                        g = this._beziers[c][d];
                        var r = (h * h * g.da + 3 * q * (h * g.ca + q * g.ba)) * h + g.a;
                        this._mod[c] && (r = this._mod[c](r, n));
                        k[c] ? n[c](r) : (n[c] = r);
                    }
                    if (this._autoRotate) {
                        var v,
                            O,
                            P,
                            D,
                            J = this._autoRotate;
                        for (f = J.length; -1 < --f; ) {
                            c = J[f][2];
                            var R = J[f][3] || 0;
                            var K = !0 === J[f][4] ? 1 : a;
                            g = this._beziers[J[f][0]];
                            q = this._beziers[J[f][1]];
                            g &&
                                q &&
                                ((g = g[d]),
                                (q = q[d]),
                                (v = g.a + (g.b - g.a) * h),
                                (P = g.b + (g.c - g.b) * h),
                                (v += (P - v) * h),
                                (P += (g.c + (g.d - g.c) * h - P) * h),
                                (O = q.a + (q.b - q.a) * h),
                                (D = q.b + (q.c - q.b) * h),
                                (O += (D - O) * h),
                                (D += (q.c + (q.d - q.c) * h - D) * h),
                                (r = l ? Math.atan2(D - O, P - v) * K + R : this._initialRotations[f]),
                                this._mod[c] && (r = this._mod[c](r, n)),
                                k[c] ? n[c](r) : (n[c] = r));
                        }
                    }
                },
            }),
            q = k.prototype;
        k.bezierThrough = r;
        k.cubicToQuadratic = l;
        k._autoCSS = !0;
        k.quadraticToCubic = function (a, c, d) {
            return new n(a, (2 * c + a) / 3, (2 * c + d) / 3, d);
        };
        k._cssRegister = function () {
            var a = h.CSSPlugin;
            if (a) {
                a = a._internals;
                var c = a._parseToProxy,
                    d = a._setPluginRatio,
                    f = a.CSSPropTween;
                a._registerComplexSpecialProp("bezier", {
                    parser: function (a, g, h, n, q, l) {
                        g instanceof Array && (g = { values: g });
                        l = new k();
                        var p,
                            u = g.values,
                            r = u.length - 1,
                            v = [],
                            z = {};
                        if (0 > r) return q;
                        for (h = 0; r >= h; h++) {
                            var y = c(a, u[h], n, q, l, r !== h);
                            v[h] = y.end;
                        }
                        for (p in g) z[p] = g[p];
                        return (
                            (z.values = v),
                            (q = new f(a, "bezier", 0, 0, y.pt, 2)),
                            (q.data = y),
                            (q.plugin = l),
                            (q.setRatio = d),
                            0 === z.autoRotate && (z.autoRotate = !0),
                            !z.autoRotate ||
                                z.autoRotate instanceof Array ||
                                ((h = !0 === z.autoRotate ? 0 : Number(z.autoRotate)), (z.autoRotate = null != y.end.left ? [["left", "top", "rotation", h, !1]] : null != y.end.x ? [["x", "y", "rotation", h, !1]] : !1)),
                            z.autoRotate && (n._transform || n._enableTransforms(!1), (y.autoRotate = n._target._gsTransform), (y.proxy.rotation = y.autoRotate.rotation || 0), n._overwriteProps.push("rotation")),
                            l._onInitTween(y.proxy, z, n._tween),
                            q
                        );
                    },
                });
            }
        };
        q._mod = function (a) {
            for (var c, d = this._overwriteProps, f = d.length; -1 < --f; ) (c = a[d[f]]) && "function" == typeof c && (this._mod[d[f]] = c);
        };
        q._kill = function (a) {
            var c,
                d,
                f = this._props;
            for (c in this._beziers) if (c in a) for (delete this._beziers[c], delete this._func[c], d = f.length; -1 < --d; ) f[d] === c && f.splice(d, 1);
            if ((f = this._autoRotate)) for (d = f.length; -1 < --d; ) a[f[d][2]] && f.splice(d, 1);
            return this._super._kill.call(this, a);
        };
    })();
    _gsScope._gsDefine(
        "plugins.CSSPlugin",
        ["plugins.TweenPlugin", "TweenLite"],
        function (a, d) {
            var f,
                c,
                g,
                h,
                n = function () {
                    a.call(this, "css");
                    this._overwriteProps.length = 0;
                    this.setRatio = n.prototype.setRatio;
                },
                l = _gsScope._gsDefine.globals,
                r = {},
                k = (n.prototype = new a("css"));
            k.constructor = n;
            n.version = "1.19.1";
            n.API = 2;
            n.defaultTransformPerspective = 0;
            n.defaultSkewType = "compensated";
            n.defaultSmoothOrigin = !0;
            k = "px";
            n.suffixMap = { top: k, right: k, bottom: k, left: k, width: k, height: k, fontSize: k, padding: k, margin: k, perspective: k, lineHeight: "" };
            var q,
                v,
                y,
                C,
                z,
                p,
                u,
                E,
                M = /(?:\-|\.|\b)(\d|\.|e\-)+/g,
                w = /(?:\d|\-\d|\.\d|\-\.\d|\+=\d|\-=\d|\+=.\d|\-=\.\d)+/g,
                L = /(?:\+=|\-=|\-|\b)[\d\-\.]+[a-zA-Z0-9]*(?:%|\b)/gi,
                B = /(?![+-]?\d*\.?\d+|[+-]|e[+-]\d+)[^0-9]/g,
                O = /(?:\d|\-|\+|=|#|\.)*/g,
                P = /opacity *= *([^)]*)/i,
                D = /opacity:([^;]*)/i,
                J = /alpha\(opacity *=.+?\)/i,
                R = /^(rgb|hsl)/,
                K = /([A-Z])/g,
                W = /-([a-z])/gi,
                F = /(^(?:url\("|url\())|(?:("\))$|\)$)/gi,
                X = function (a, c) {
                    return c.toUpperCase();
                },
                Y = /(?:Left|Right|Width)/i,
                oa = /(M11|M12|M21|M22)=[\d\-\.e]+/gi,
                ta = /progid:DXImageTransform\.Microsoft\.Matrix\(.+?\)/i,
                S = /,(?=[^\)]*(?:\(|$))/gi,
                ea = /[\s,\(]/i,
                ba = Math.PI / 180,
                ca = 180 / Math.PI,
                Z = {},
                da = { style: {} },
                pa = _gsScope.document || {
                    createElement: function () {
                        return da;
                    },
                },
                ya = function (a, c) {
                    return pa.createElementNS ? pa.createElementNS(c || "http://www.w3.org/1999/xhtml", a) : pa.createElement(a);
                },
                ja = ya("div"),
                va = ya("img"),
                sa = (n._internals = { _specialProps: r }),
                ka = (_gsScope.navigator || {}).userAgent || "",
                ua = (function () {
                    var a = ka.indexOf("Android"),
                        c = ya("a");
                    return (
                        (y = -1 !== ka.indexOf("Safari") && -1 === ka.indexOf("Chrome") && (-1 === a || 3 < parseFloat(ka.substr(a + 8, 2)))),
                        (z = y && 6 > parseFloat(ka.substr(ka.indexOf("Version/") + 8, 2))),
                        (C = -1 !== ka.indexOf("Firefox")),
                        (/MSIE ([0-9]{1,}[\.0-9]{0,})/.exec(ka) || /Trident\/.*rv:([0-9]{1,}[\.0-9]{0,})/.exec(ka)) && (p = parseFloat(RegExp.$1)),
                        c ? ((c.style.cssText = "top:1px;opacity:.55;"), /^0.55/.test(c.style.opacity)) : !1
                    );
                })(),
                za = function (a) {
                    return P.test("string" == typeof a ? a : (a.currentStyle ? a.currentStyle.filter : a.style.filter) || "") ? parseFloat(RegExp.$1) / 100 : 1;
                },
                Aa = "",
                Ba = "",
                la = function (a, c) {
                    c = c || ja;
                    var d,
                        f = c.style;
                    if (void 0 !== f[a]) return a;
                    a = a.charAt(0).toUpperCase() + a.substr(1);
                    c = ["O", "Moz", "ms", "Ms", "Webkit"];
                    for (d = 5; -1 < --d && void 0 === f[c[d] + a]; );
                    return 0 <= d ? ((Ba = 3 === d ? "ms" : c[d]), (Aa = "-" + Ba.toLowerCase() + "-"), Ba + a) : null;
                },
                ia = pa.defaultView ? pa.defaultView.getComputedStyle : function () {},
                A = (n.getStyle = function (a, c, d, f, g) {
                    var h;
                    return ua || "opacity" !== c
                        ? (!f && a.style[c] ? (h = a.style[c]) : (d = d || ia(a)) ? (h = d[c] || d.getPropertyValue(c) || d.getPropertyValue(c.replace(K, "-$1").toLowerCase())) : a.currentStyle && (h = a.currentStyle[c]),
                          null == g || (h && "none" !== h && "auto" !== h && "auto auto" !== h) ? h : g)
                        : za(a);
                }),
                G = (sa.convertToPixels = function (a, c, f, g, h) {
                    if ("px" === g || !g) return f;
                    if ("auto" === g || !f) return 0;
                    var k,
                        p,
                        q = Y.test(c),
                        l = a;
                    var u = ja.style;
                    var r = 0 > f,
                        N = 1 === f;
                    if ((r && (f = -f), N && (f *= 100), "%" === g && -1 !== c.indexOf("border"))) u = (f / 100) * (q ? a.clientWidth : a.clientHeight);
                    else {
                        if (((u.cssText = "border:0 solid red;position:" + A(a, "position") + ";line-height:0;"), "%" !== g && l.appendChild && "v" !== g.charAt(0) && "rem" !== g)) u[q ? "borderLeftWidth" : "borderTopWidth"] = f + g;
                        else {
                            if (((l = a.parentNode || pa.body), (k = l._gsCache), (p = d.ticker.frame), k && q && k.time === p)) return (k.width * f) / 100;
                            u[q ? "width" : "height"] = f + g;
                        }
                        l.appendChild(ja);
                        u = parseFloat(ja[q ? "offsetWidth" : "offsetHeight"]);
                        l.removeChild(ja);
                        q && "%" === g && !1 !== n.cacheWidths && ((k = l._gsCache = l._gsCache || {}), (k.time = p), (k.width = (u / f) * 100));
                        0 !== u || h || (u = G(a, c, f, g, !0));
                    }
                    return N && (u /= 100), r ? -u : u;
                }),
                H = (sa.calculateOffset = function (a, c, d) {
                    if ("absolute" !== A(a, "position", d)) return 0;
                    var f = "left" === c ? "Left" : "Top";
                    d = A(a, "margin" + f, d);
                    return a["offset" + f] - (G(a, c, parseFloat(d), d.replace(O, "")) || 0);
                }),
                Q = function (a, c) {
                    var d,
                        f,
                        g = {};
                    if ((c = c || ia(a, null)))
                        if ((d = c.length))
                            for (; -1 < --d; ) {
                                var h = c[d];
                                (-1 !== h.indexOf("-transform") && Qa !== h) || (g[h.replace(W, X)] = c.getPropertyValue(h));
                            }
                        else for (d in c) (-1 !== d.indexOf("Transform") && qa !== d) || (g[d] = c[d]);
                    else if ((c = a.currentStyle || a.style)) for (d in c) "string" == typeof d && void 0 === g[d] && (g[d.replace(W, X)] = c[d]);
                    return (
                        ua || (g.opacity = za(a)),
                        (f = Fa(a, c, !1)),
                        (g.rotation = f.rotation),
                        (g.skewX = f.skewX),
                        (g.scaleX = f.scaleX),
                        (g.scaleY = f.scaleY),
                        (g.x = f.x),
                        (g.y = f.y),
                        xa && ((g.z = f.z), (g.rotationX = f.rotationX), (g.rotationY = f.rotationY), (g.scaleZ = f.scaleZ)),
                        g.filters && delete g.filters,
                        g
                    );
                },
                T = function (a, c, d, f, g) {
                    var h,
                        k,
                        n,
                        p = {},
                        q = a.style;
                    for (k in d)
                        "cssText" !== k &&
                            "length" !== k &&
                            isNaN(k) &&
                            (c[k] !== (h = d[k]) || (g && g[k])) &&
                            -1 === k.indexOf("Origin") &&
                            ("number" == typeof h || "string" == typeof h) &&
                            ((p[k] = "auto" !== h || ("left" !== k && "top" !== k) ? (("" !== h && "auto" !== h && "none" !== h) || "string" != typeof c[k] || "" === c[k].replace(B, "") ? h : 0) : H(a, k)),
                            void 0 !== q[k] && (n = new Ra(q, k, q[k], n)));
                    if (f) for (k in f) "className" !== k && (p[k] = f[k]);
                    return { difs: p, firstMPT: n };
                },
                fa = { width: ["Left", "Right"], height: ["Top", "Bottom"] },
                La = ["marginLeft", "marginRight", "marginTop", "marginBottom"],
                U = function (a, c) {
                    if ("contain" === a || "auto" === a || "auto auto" === a) return a + " ";
                    (null != a && "" !== a) || (a = "0 0");
                    var d = a.split(" "),
                        f = -1 !== a.indexOf("left") ? "0%" : -1 !== a.indexOf("right") ? "100%" : d[0],
                        g = -1 !== a.indexOf("top") ? "0%" : -1 !== a.indexOf("bottom") ? "100%" : d[1];
                    if (3 < d.length && !c) {
                        d = a.split(", ").join(",").split(",");
                        a = [];
                        for (c = 0; c < d.length; c++) a.push(U(d[c]));
                        return a.join(",");
                    }
                    return (
                        null == g ? (g = "center" === f ? "50%" : "0") : "center" === g && (g = "50%"),
                        ("center" === f || (isNaN(parseFloat(f)) && -1 === (f + "").indexOf("="))) && (f = "50%"),
                        (a = f + " " + g + (2 < d.length ? " " + d[2] : "")),
                        c &&
                            ((c.oxp = -1 !== f.indexOf("%")),
                            (c.oyp = -1 !== g.indexOf("%")),
                            (c.oxr = "=" === f.charAt(1)),
                            (c.oyr = "=" === g.charAt(1)),
                            (c.ox = parseFloat(f.replace(B, ""))),
                            (c.oy = parseFloat(g.replace(B, ""))),
                            (c.v = a)),
                        c || a
                    );
                },
                V = function (a, c) {
                    return "function" == typeof a && (a = a(E, u)), "string" == typeof a && "=" === a.charAt(1) ? parseInt(a.charAt(0) + "1", 10) * parseFloat(a.substr(2)) : parseFloat(a) - parseFloat(c) || 0;
                },
                ma = function (a, c) {
                    return "function" == typeof a && (a = a(E, u)), null == a ? c : "string" == typeof a && "=" === a.charAt(1) ? parseInt(a.charAt(0) + "1", 10) * parseFloat(a.substr(2)) + c : parseFloat(a) || 0;
                },
                Ga = function (a, c, d, f) {
                    var g, h, k, n;
                    return (
                        "function" == typeof a && (a = a(E, u)),
                        null == a
                            ? (k = c)
                            : "number" == typeof a
                            ? (k = a)
                            : ((g = a.split("_")),
                              (n = "=" === a.charAt(1)),
                              (h = (n ? parseInt(a.charAt(0) + "1", 10) * parseFloat(g[0].substr(2)) : parseFloat(g[0])) * (-1 === a.indexOf("rad") ? 1 : ca) - (n ? 0 : c)),
                              g.length &&
                                  (f && (f[d] = c + h),
                                  -1 !== a.indexOf("short") && ((h %= 360), h !== h % 180 && (h = 0 > h ? h + 360 : h - 360)),
                                  -1 !== a.indexOf("_cw") && 0 > h ? (h = ((h + 3599999999640) % 360) - 360 * ((h / 360) | 0)) : -1 !== a.indexOf("ccw") && 0 < h && (h = ((h - 3599999999640) % 360) - 360 * ((h / 360) | 0))),
                              (k = c + h)),
                        1e-6 > k && -1e-6 < k && (k = 0),
                        k
                    );
                },
                Ha = {
                    aqua: [0, 255, 255],
                    lime: [0, 255, 0],
                    silver: [192, 192, 192],
                    black: [0, 0, 0],
                    maroon: [128, 0, 0],
                    teal: [0, 128, 128],
                    blue: [0, 0, 255],
                    navy: [0, 0, 128],
                    white: [255, 255, 255],
                    fuchsia: [255, 0, 255],
                    olive: [128, 128, 0],
                    yellow: [255, 255, 0],
                    orange: [255, 165, 0],
                    gray: [128, 128, 128],
                    purple: [128, 0, 128],
                    green: [0, 128, 0],
                    red: [255, 0, 0],
                    pink: [255, 192, 203],
                    cyan: [0, 255, 255],
                    transparent: [255, 255, 255, 0],
                },
                Sa = function (a, c, d) {
                    return (a = 0 > a ? a + 1 : 1 < a ? a - 1 : a), (255 * (1 > 6 * a ? c + (d - c) * a * 6 : 0.5 > a ? d : 2 > 3 * a ? c + (d - c) * (2 / 3 - a) * 6 : c) + 0.5) | 0;
                },
                Ma = (n.parseColor = function (a, c) {
                    var d, f, g, h, k, n, p;
                    if (a)
                        if ("number" == typeof a) var q = [a >> 16, (a >> 8) & 255, 255 & a];
                        else {
                            if (("," === a.charAt(a.length - 1) && (a = a.substr(0, a.length - 1)), Ha[a])) q = Ha[a];
                            else if ("#" === a.charAt(0))
                                4 === a.length && ((d = a.charAt(1)), (f = a.charAt(2)), (g = a.charAt(3)), (a = "#" + d + d + f + f + g + g)), (a = parseInt(a.substr(1), 16)), (q = [a >> 16, (a >> 8) & 255, 255 & a]);
                            else if ("hsl" === a.substr(0, 3))
                                if (((q = p = a.match(M)), c)) {
                                    if (-1 !== a.indexOf("=")) return a.match(w);
                                } else {
                                    var A = (Number(q[0]) % 360) / 360;
                                    var l = Number(q[1]) / 100;
                                    var u = Number(q[2]) / 100;
                                    f = 0.5 >= u ? u * (l + 1) : u + l - u * l;
                                    d = 2 * u - f;
                                    3 < q.length && (q[3] = Number(a[3]));
                                    q[0] = Sa(A + 1 / 3, d, f);
                                    q[1] = Sa(A, d, f);
                                    q[2] = Sa(A - 1 / 3, d, f);
                                }
                            else q = a.match(M) || Ha.transparent;
                            q[0] = Number(q[0]);
                            q[1] = Number(q[1]);
                            q[2] = Number(q[2]);
                            3 < q.length && (q[3] = Number(q[3]));
                        }
                    else q = Ha.black;
                    return (
                        c &&
                            !p &&
                            ((d = q[0] / 255),
                            (f = q[1] / 255),
                            (g = q[2] / 255),
                            (h = Math.max(d, f, g)),
                            (k = Math.min(d, f, g)),
                            (u = (h + k) / 2),
                            h === k ? (A = l = 0) : ((n = h - k), (l = 0.5 < u ? n / (2 - h - k) : n / (h + k)), (A = h === d ? (f - g) / n + (g > f ? 6 : 0) : h === f ? (g - d) / n + 2 : (d - f) / n + 4), (A *= 60)),
                            (q[0] = (A + 0.5) | 0),
                            (q[1] = (100 * l + 0.5) | 0),
                            (q[2] = (100 * u + 0.5) | 0)),
                        q
                    );
                }),
                Za = function (a, c) {
                    var d,
                        f = a.match(wa) || [],
                        g = 0,
                        h = f.length ? "" : a;
                    for (d = 0; d < f.length; d++) {
                        var k = f[d];
                        var n = a.substr(g, a.indexOf(k, g) - g);
                        g += n.length + k.length;
                        k = Ma(k, c);
                        3 === k.length && k.push(1);
                        h += n + (c ? "hsla(" + k[0] + "," + k[1] + "%," + k[2] + "%," + k[3] : "rgba(" + k.join(",")) + ")";
                    }
                    return h + a.substr(g);
                },
                wa = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3}){1,2}\\b";
            for (k in Ha) wa += "|" + k + "\\b";
            wa = new RegExp(wa + ")", "gi");
            n.colorStringFilter = function (a) {
                var c,
                    d = a[0] + a[1];
                wa.test(d) && ((c = -1 !== d.indexOf("hsl(") || -1 !== d.indexOf("hsla(")), (a[0] = Za(a[0], c)), (a[1] = Za(a[1], c)));
                wa.lastIndex = 0;
            };
            d.defaultStringFilter || (d.defaultStringFilter = n.colorStringFilter);
            var Ta = function (a, c, d, f) {
                    if (null == a)
                        return function (a) {
                            return a;
                        };
                    var g,
                        h = c ? (a.match(wa) || [""])[0] : "",
                        k = a.split(h).join("").match(L) || [],
                        n = a.substr(0, a.indexOf(k[0])),
                        q = ")" === a.charAt(a.length - 1) ? ")" : "",
                        p = -1 !== a.indexOf(" ") ? " " : ",",
                        A = k.length,
                        l = 0 < A ? k[0].replace(M, "") : "";
                    return A
                        ? (g = c
                              ? function (a) {
                                    var c, u, r;
                                    if ("number" == typeof a) a += l;
                                    else if (f && S.test(a)) {
                                        a = a.replace(S, "|").split("|");
                                        for (r = 0; r < a.length; r++) a[r] = g(a[r]);
                                        return a.join(",");
                                    }
                                    if (((c = (a.match(wa) || [h])[0]), (u = a.split(c).join("").match(L) || []), (r = u.length), A > r--)) for (; ++r < A; ) u[r] = d ? u[((r - 1) / 2) | 0] : k[r];
                                    return n + u.join(p) + p + c + q + (-1 !== a.indexOf("inset") ? " inset" : "");
                                }
                              : function (a) {
                                    var c, h;
                                    if ("number" == typeof a) a += l;
                                    else if (f && S.test(a)) {
                                        a = a.replace(S, "|").split("|");
                                        for (h = 0; h < a.length; h++) a[h] = g(a[h]);
                                        return a.join(",");
                                    }
                                    if (((c = a.match(L) || []), (h = c.length), A > h--)) for (; ++h < A; ) c[h] = d ? c[((h - 1) / 2) | 0] : k[h];
                                    return n + c.join(p) + q;
                                })
                        : function (a) {
                              return a;
                          };
                },
                Ua = function (a) {
                    return (
                        (a = a.split(",")),
                        function (c, d, f, g, h, k, n) {
                            f = (d + "").split(" ");
                            n = {};
                            for (d = 0; 4 > d; d++) n[a[d]] = f[d] = f[d] || f[((d - 1) / 2) >> 0];
                            return g.parse(c, n, h, k);
                        }
                    );
                },
                Ra =
                    ((sa._setPluginRatio = function (a) {
                        this.plugin.setRatio(a);
                        var c;
                        var d = this.data;
                        for (var f = d.proxy, g = d.firstMPT; g; ) {
                            var h = f[g.v];
                            g.r ? (h = Math.round(h)) : 1e-6 > h && -1e-6 < h && (h = 0);
                            g.t[g.p] = h;
                            g = g._next;
                        }
                        if ((d.autoRotate && (d.autoRotate.rotation = d.mod ? d.mod(f.rotation, this.t) : f.rotation), 1 === a || 0 === a))
                            for (g = d.firstMPT, d = 1 === a ? "e" : "b"; g; ) {
                                if (((c = g.t), c.type)) {
                                    if (1 === c.type) {
                                        h = c.xs0 + c.s + c.xs1;
                                        for (a = 1; a < c.l; a++) h += c["xn" + a] + c["xs" + (a + 1)];
                                        c[d] = h;
                                    }
                                } else c[d] = c.s + c.xs0;
                                g = g._next;
                            }
                    }),
                    function (a, c, d, f, g) {
                        this.t = a;
                        this.p = c;
                        this.v = d;
                        this.r = g;
                        f && ((f._prev = this), (this._next = f));
                    }),
                na =
                    ((sa._parseToProxy = function (a, c, d, f, g, h) {
                        var k,
                            n,
                            q = f,
                            p = {},
                            A = {};
                        var u = d._transform;
                        var l = Z;
                        d._transform = null;
                        Z = c;
                        f = a = d.parse(a, c, f, g);
                        Z = l;
                        for (h && ((d._transform = u), q && ((q._prev = null), q._prev && (q._prev._next = null))); f && f !== q; ) {
                            if (1 >= f.type && ((k = f.p), (A[k] = f.s + f.c), (p[k] = f.s), h || ((n = new Ra(f, "s", k, n, f.r)), (f.c = 0)), 1 === f.type))
                                for (d = f.l; 0 < --d; ) (u = "xn" + d), (k = f.p + "_" + u), (A[k] = f.data[u]), (p[k] = f[u]), h || (n = new Ra(f, u, k, n, f.rxp[u]));
                            f = f._next;
                        }
                        return { proxy: p, end: A, firstMPT: n, pt: a };
                    }),
                    (sa.CSSPropTween = function (a, c, d, g, k, n, q, p, A, u, l) {
                        this.t = a;
                        this.p = c;
                        this.s = d;
                        this.c = g;
                        this.n = q || c;
                        a instanceof na || h.push(this.n);
                        this.r = p;
                        this.type = n || 0;
                        A && ((this.pr = A), (f = !0));
                        this.b = void 0 === u ? d : u;
                        this.e = void 0 === l ? d + g : l;
                        k && ((this._next = k), (k._prev = this));
                    })),
                Na = function (a, c, d, f, g, h) {
                    a = new na(a, c, d, f - d, g, -1, h);
                    return (a.b = d), (a.e = a.xs0 = f), a;
                },
                Ia = (n.parseComplex = function (a, c, d, f, g, h, k, p, A, l) {
                    d = d || h || "";
                    "function" == typeof f && (f = f(E, u));
                    k = new na(a, c, 0, 0, k, l ? 2 : 1, null, !1, p, d, f);
                    f += "";
                    g && wa.test(f + d) && ((f = [d, f]), n.colorStringFilter(f), (d = f[0]), (f = f[1]));
                    var r, v, z;
                    a = d.split(", ").join(",").split(" ");
                    c = f.split(", ").join(",").split(" ");
                    p = a.length;
                    var I = !1 !== q;
                    (-1 !== f.indexOf(",") || -1 !== d.indexOf(",")) && ((a = a.join(" ").replace(S, ", ").split(" ")), (c = c.join(" ").replace(S, ", ").split(" ")), (p = a.length));
                    p !== c.length && ((a = (h || "").split(" ")), (p = a.length));
                    k.plugin = A;
                    k.setRatio = l;
                    for (d = wa.lastIndex = 0; p > d; d++)
                        if (((r = a[d]), (A = c[d]), (z = parseFloat(r)), z || 0 === z)) k.appendXtra("", z, V(A, z), A.replace(w, ""), I && -1 !== A.indexOf("px"), !0);
                        else if (g && wa.test(r)) {
                            l = A.indexOf(")") + 1;
                            l = ")" + (l ? A.substr(l) : "");
                            var G = -1 !== A.indexOf("hsl") && ua;
                            r = Ma(r, G);
                            A = Ma(A, G);
                            (h = 6 < r.length + A.length) && !ua && 0 === A[3]
                                ? ((k["xs" + k.l] += k.l ? " transparent" : "transparent"), (k.e = k.e.split(c[d]).join("transparent")))
                                : (ua || (h = !1),
                                  G
                                      ? k
                                            .appendXtra(h ? "hsla(" : "hsl(", r[0], V(A[0], r[0]), ",", !1, !0)
                                            .appendXtra("", r[1], V(A[1], r[1]), "%,", !1)
                                            .appendXtra("", r[2], V(A[2], r[2]), h ? "%," : "%" + l, !1)
                                      : k
                                            .appendXtra(h ? "rgba(" : "rgb(", r[0], A[0] - r[0], ",", !0, !0)
                                            .appendXtra("", r[1], A[1] - r[1], ",", !0)
                                            .appendXtra("", r[2], A[2] - r[2], h ? "," : l, !0),
                                  h && ((r = 4 > r.length ? 1 : r[3]), k.appendXtra("", r, (4 > A.length ? 1 : A[3]) - r, l, !1)));
                            wa.lastIndex = 0;
                        } else if ((h = r.match(M))) {
                            if (((v = A.match(w)), !v || v.length !== h.length)) return k;
                            for (A = l = 0; A < h.length; A++) {
                                var N = h[A];
                                G = r.indexOf(N, l);
                                k.appendXtra(r.substr(l, G - l), Number(N), V(v[A], N), "", I && "px" === r.substr(G + N.length, 2), 0 === A);
                                l = G + N.length;
                            }
                            k["xs" + k.l] += r.substr(l);
                        } else k["xs" + k.l] += k.l || k["xs" + k.l] ? " " + A : A;
                    if (-1 !== f.indexOf("=") && k.data) {
                        l = k.xs0 + k.data.s;
                        for (d = 1; d < k.l; d++) l += k["xs" + d] + k.data["xn" + d];
                        k.e = l + k["xs" + d];
                    }
                    return k.l || ((k.type = -1), (k.xs0 = k.e)), k.xfirst || k;
                }),
                ra = 9;
            k = na.prototype;
            for (k.l = k.pr = 0; 0 < --ra; ) (k["xn" + ra] = 0), (k["xs" + ra] = "");
            k.xs0 = "";
            k._next = k._prev = k.xfirst = k.data = k.plugin = k.setRatio = k.rxp = null;
            k.appendXtra = function (a, c, d, f, g, h) {
                var k = this.l;
                return (
                    (this["xs" + k] += h && (k || this["xs" + k]) ? " " + a : a || ""),
                    d || 0 === k || this.plugin
                        ? (this.l++,
                          (this.type = this.setRatio ? 2 : 1),
                          (this["xs" + this.l] = f || ""),
                          0 < k
                              ? ((this.data["xn" + k] = c + d),
                                (this.rxp["xn" + k] = g),
                                (this["xn" + k] = c),
                                this.plugin || ((this.xfirst = new na(this, "xn" + k, c, d, this.xfirst || this, 0, this.n, g, this.pr)), (this.xfirst.xs0 = 0)),
                                this)
                              : ((this.data = { s: c + d }), (this.rxp = {}), (this.s = c), (this.c = d), (this.r = g), this))
                        : ((this["xs" + k] += c + (f || "")), this)
                );
            };
            var $a = function (a, c) {
                    c = c || {};
                    this.p = c.prefix ? la(a) || a : a;
                    r[a] = r[this.p] = this;
                    this.format = c.formatter || Ta(c.defaultValue, c.color, c.collapsible, c.multi);
                    c.parser && (this.parse = c.parser);
                    this.clrs = c.color;
                    this.multi = c.multi;
                    this.keyword = c.keyword;
                    this.dflt = c.defaultValue;
                    this.pr = c.priority || 0;
                },
                ha = (sa._registerComplexSpecialProp = function (a, c, d) {
                    "object" != typeof c && (c = { parser: d });
                    var f = a.split(","),
                        g = c.defaultValue;
                    d = d || [g];
                    for (a = 0; a < f.length; a++) (c.prefix = 0 === a && c.prefix), (c.defaultValue = d[a] || g), new $a(f[a], c);
                }),
                db = (sa._registerPluginProp = function (a) {
                    if (!r[a]) {
                        var c = a.charAt(0).toUpperCase() + a.substr(1) + "Plugin";
                        ha(a, {
                            parser: function (a, d, f, g, h, k, n) {
                                var A = l.com.greensock.plugins[c];
                                A ? (a = (A._cssRegister(), r[f].parse(a, d, f, g, h, k, n))) : (_gsScope.console && console.log("Error: " + c + " js file not loaded."), (a = h));
                                return a;
                            },
                        });
                    }
                });
            k = $a.prototype;
            k.parseComplex = function (a, c, d, f, g, h) {
                var k,
                    n,
                    A,
                    q,
                    p,
                    l = this.keyword;
                if ((this.multi && (S.test(d) || S.test(c) ? ((n = c.replace(S, "|").split("|")), (A = d.replace(S, "|").split("|"))) : l && ((n = [c]), (A = [d]))), A)) {
                    var u = A.length > n.length ? A.length : n.length;
                    for (k = 0; u > k; k++)
                        (c = n[k] = n[k] || this.dflt), (d = A[k] = A[k] || this.dflt), l && ((q = c.indexOf(l)), (p = d.indexOf(l)), q !== p && (-1 === p ? (n[k] = n[k].split(l).join("")) : -1 === q && (n[k] += " " + l)));
                    c = n.join(", ");
                    d = A.join(", ");
                }
                return Ia(a, this.p, c, d, this.clrs, this.dflt, f, this.pr, g, h);
            };
            k.parse = function (a, c, d, f, h, k, n) {
                return this.parseComplex(a.style, this.format(A(a, this.p, g, !1, this.dflt)), this.format(c), h, k);
            };
            n.registerSpecialProp = function (a, c, d) {
                ha(a, {
                    parser: function (a, f, g, h, k, n, A) {
                        k = new na(a, g, 0, 0, k, 2, g, !1, d);
                        return (k.plugin = n), (k.setRatio = c(a, f, h._tween, g)), k;
                    },
                    priority: d,
                });
            };
            n.useSVGTransformAttr = !0;
            var Da,
                ab = "scaleX scaleY scaleZ x y z skewX skewY rotation rotationX rotationY perspective xPercent yPercent".split(" "),
                qa = la("transform"),
                Qa = Aa + "transform",
                Ja = la("transformOrigin"),
                xa = null !== la("perspective"),
                Oa = (sa.Transform = function () {
                    this.perspective = parseFloat(n.defaultTransformPerspective) || 0;
                    this.force3D = !1 !== n.defaultForce3D && xa ? n.defaultForce3D || "auto" : !1;
                }),
                eb = _gsScope.SVGElement,
                bb = function (a, c, d) {
                    var f;
                    a = pa.createElementNS("http://www.w3.org/2000/svg", a);
                    var g = /([a-z])([A-Z])/g;
                    for (f in d) a.setAttributeNS(null, f.replace(g, "$1-$2").toLowerCase(), d[f]);
                    return c.appendChild(a), a;
                },
                Ea = pa.documentElement || {},
                fb = (function () {
                    var a,
                        c,
                        d,
                        f = p || (/Android/i.test(ka) && !_gsScope.chrome);
                    return (
                        pa.createElementNS &&
                            !f &&
                            ((a = bb("svg", Ea)),
                            (c = bb("rect", a, { width: 100, height: 50, x: 100 })),
                            (d = c.getBoundingClientRect().width),
                            (c.style[Ja] = "50% 50%"),
                            (c.style[qa] = "scaleX(0.5)"),
                            (f = d === c.getBoundingClientRect().width && !(C && xa)),
                            Ea.removeChild(a)),
                        f
                    );
                })(),
                Xa = function (a, c, d, f, g, h) {
                    var k,
                        A,
                        q,
                        p,
                        l,
                        u,
                        r,
                        v,
                        z,
                        G,
                        y,
                        H,
                        N,
                        I = a._gsTransform,
                        aa = Va(a, !0);
                    I && ((H = I.xOrigin), (N = I.yOrigin));
                    (!f || 2 > (k = f.split(" ")).length) &&
                        ((u = a.getBBox()),
                        0 === u.x &&
                            0 === u.y &&
                            0 === u.width + u.height &&
                            (u = {
                                x: parseFloat(a.hasAttribute("x") ? a.getAttribute("x") : a.hasAttribute("cx") ? a.getAttribute("cx") : 0) || 0,
                                y: parseFloat(a.hasAttribute("y") ? a.getAttribute("y") : a.hasAttribute("cy") ? a.getAttribute("cy") : 0) || 0,
                                width: 0,
                                height: 0,
                            }),
                        (c = U(c).split(" ")),
                        (k = [(-1 !== c[0].indexOf("%") ? (parseFloat(c[0]) / 100) * u.width : parseFloat(c[0])) + u.x, (-1 !== c[1].indexOf("%") ? (parseFloat(c[1]) / 100) * u.height : parseFloat(c[1])) + u.y]));
                    d.xOrigin = c = parseFloat(k[0]);
                    d.yOrigin = p = parseFloat(k[1]);
                    f &&
                        aa !== Wa &&
                        ((l = aa[0]),
                        (u = aa[1]),
                        (r = aa[2]),
                        (v = aa[3]),
                        (z = aa[4]),
                        (G = aa[5]),
                        (y = l * v - u * r),
                        y && ((A = (v / y) * c + (-r / y) * p + (r * G - v * z) / y), (q = (-u / y) * c + (l / y) * p - (l * G - u * z) / y), (c = d.xOrigin = k[0] = A), (p = d.yOrigin = k[1] = q)));
                    I &&
                        (h && ((d.xOffset = I.xOffset), (d.yOffset = I.yOffset), (I = d)),
                        g || (!1 !== g && !1 !== n.defaultSmoothOrigin) ? ((A = c - H), (q = p - N), (I.xOffset += A * aa[0] + q * aa[2] - A), (I.yOffset += A * aa[1] + q * aa[3] - q)) : (I.xOffset = I.yOffset = 0));
                    h || a.setAttribute("data-svg-origin", k.join(" "));
                },
                cb = function (a) {
                    var c = ya("svg", this.ownerSVGElement.getAttribute("xmlns") || "http://www.w3.org/2000/svg"),
                        d = this.parentNode,
                        f = this.nextSibling,
                        g = this.style.cssText;
                    if ((Ea.appendChild(c), c.appendChild(this), (this.style.display = "block"), a))
                        try {
                            var h = this.getBBox();
                            this._originalGetBBox = this.getBBox;
                            this.getBBox = cb;
                        } catch (mb) {}
                    else this._originalGetBBox && (h = this._originalGetBBox());
                    return f ? d.insertBefore(this, f) : d.appendChild(this), Ea.removeChild(c), (this.style.cssText = g), h;
                },
                Ya = function (a) {
                    var c;
                    if ((c = eb && a.getCTM))
                        try {
                            c = a.getBBox();
                        } catch (Ca) {
                            c = cb.call(a, !0);
                        }
                    return !(!c || (a.parentNode && !a.ownerSVGElement));
                },
                Wa = [1, 0, 0, 1, 0, 0],
                Va = function (a, c) {
                    var d,
                        f,
                        g,
                        h,
                        k,
                        n,
                        q = a._gsTransform || new Oa(),
                        p = a.style;
                    if (
                        (qa
                            ? (f = A(a, Qa, null, !0))
                            : a.currentStyle && ((f = a.currentStyle.filter.match(oa)), (f = f && 4 === f.length ? [f[0].substr(4), Number(f[2].substr(4)), Number(f[1].substr(4)), f[3].substr(4), q.x || 0, q.y || 0].join() : "")),
                        (d = !f || "none" === f || "matrix(1, 0, 0, 1, 0, 0)" === f),
                        d &&
                            qa &&
                            ((n = "none" === ia(a).display) || !a.parentNode) &&
                            (n && ((h = p.display), (p.display = "block")),
                            a.parentNode || ((k = 1), Ea.appendChild(a)),
                            (f = A(a, Qa, null, !0)),
                            (d = !f || "none" === f || "matrix(1, 0, 0, 1, 0, 0)" === f),
                            h ? (p.display = h) : n && Ka(p, "display"),
                            k && Ea.removeChild(a)),
                        (q.svg || (a.getCTM && Ya(a))) &&
                            (d && -1 !== (p[qa] + "").indexOf("matrix") && ((f = p[qa]), (d = 0)),
                            (g = a.getAttribute("transform")),
                            d && g && (-1 !== g.indexOf("matrix") ? ((f = g), (d = 0)) : -1 !== g.indexOf("translate") && ((f = "matrix(1,0,0,1," + g.match(/(?:\-|\b)[\d\-\.e]+\b/gi).join(",") + ")"), (d = 0)))),
                        d)
                    )
                        return Wa;
                    g = (f || "").match(M) || [];
                    for (ra = g.length; -1 < --ra; ) (h = Number(g[ra])), (g[ra] = (k = h - (h |= 0)) ? ((1e5 * k + (0 > k ? -0.5 : 0.5)) | 0) / 1e5 + h : h);
                    return c && 6 < g.length ? [g[0], g[1], g[4], g[5], g[12], g[13]] : g;
                },
                Fa = (sa.getTransform = function (a, c, f, g) {
                    if (a._gsTransform && f && !g) return a._gsTransform;
                    var h,
                        k,
                        q,
                        p = f ? a._gsTransform || new Oa() : new Oa(),
                        l = 0 > p.scaleX,
                        u = xa ? parseFloat(A(a, Ja, c, !1, "0 0 0").split(" ")[2]) || p.zOrigin || 0 : 0,
                        r = parseFloat(n.defaultTransformPerspective) || 0;
                    if (((p.svg = !(!a.getCTM || !Ya(a))), p.svg && (Xa(a, A(a, Ja, c, !1, "50% 50%") + "", p, a.getAttribute("data-svg-origin")), (Da = n.useSVGTransformAttr || fb)), (h = Va(a)), h !== Wa)) {
                        if (16 === h.length) {
                            var v, z, G, y;
                            r = h[0];
                            c = h[1];
                            g = h[2];
                            var H = h[3],
                                Q = h[4],
                                I = h[5],
                                aa = h[6],
                                N = h[7],
                                C = h[8],
                                E = h[9],
                                w = h[10],
                                B = h[12],
                                M = h[13],
                                U = h[14],
                                Ca = h[11],
                                T = Math.atan2(aa, w);
                            p.zOrigin && ((U = -p.zOrigin), (B = C * U - h[12]), (M = E * U - h[13]), (U = w * U + p.zOrigin - h[14]));
                            p.rotationX = T * ca;
                            T &&
                                ((y = Math.cos(-T)),
                                (q = Math.sin(-T)),
                                (v = Q * y + C * q),
                                (z = I * y + E * q),
                                (G = aa * y + w * q),
                                (C = Q * -q + C * y),
                                (E = I * -q + E * y),
                                (w = aa * -q + w * y),
                                (Ca = N * -q + Ca * y),
                                (Q = v),
                                (I = z),
                                (aa = G));
                            T = Math.atan2(-g, w);
                            p.rotationY = T * ca;
                            T && ((y = Math.cos(-T)), (q = Math.sin(-T)), (v = r * y - C * q), (z = c * y - E * q), (G = g * y - w * q), (E = c * q + E * y), (w = g * q + w * y), (Ca = H * q + Ca * y), (r = v), (c = z), (g = G));
                            T = Math.atan2(c, r);
                            p.rotation = T * ca;
                            T && ((y = Math.cos(-T)), (q = Math.sin(-T)), (r = r * y + Q * q), (z = c * y + I * q), (I = c * -q + I * y), (aa = g * -q + aa * y), (c = z));
                            p.rotationX && 359.9 < Math.abs(p.rotationX) + Math.abs(p.rotation) && ((p.rotationX = p.rotation = 0), (p.rotationY = 180 - p.rotationY));
                            p.scaleX = ((1e5 * Math.sqrt(r * r + c * c) + 0.5) | 0) / 1e5;
                            p.scaleY = ((1e5 * Math.sqrt(I * I + E * E) + 0.5) | 0) / 1e5;
                            p.scaleZ = ((1e5 * Math.sqrt(aa * aa + w * w) + 0.5) | 0) / 1e5;
                            p.rotationX || p.rotationY
                                ? (p.skewX = 0)
                                : ((p.skewX = Q || I ? Math.atan2(Q, I) * ca + p.rotation : p.skewX || 0),
                                  90 < Math.abs(p.skewX) &&
                                      270 > Math.abs(p.skewX) &&
                                      (l ? ((p.scaleX *= -1), (p.skewX += 0 >= p.rotation ? 180 : -180), (p.rotation += 0 >= p.rotation ? 180 : -180)) : ((p.scaleY *= -1), (p.skewX += 0 >= p.skewX ? 180 : -180))));
                            p.perspective = Ca ? 1 / (0 > Ca ? -Ca : Ca) : 0;
                            p.x = B;
                            p.y = M;
                            p.z = U;
                            p.svg && ((p.x -= p.xOrigin - (p.xOrigin * r - p.yOrigin * Q)), (p.y -= p.yOrigin - (p.yOrigin * c - p.xOrigin * I)));
                        } else
                            (xa && !g && h.length && p.x === h[4] && p.y === h[5] && (p.rotationX || p.rotationY)) ||
                                ((v = (y = 6 <= h.length) ? h[0] : 1),
                                (z = h[1] || 0),
                                (G = h[2] || 0),
                                (y = y ? h[3] : 1),
                                (p.x = h[4] || 0),
                                (p.y = h[5] || 0),
                                (h = Math.sqrt(v * v + z * z)),
                                (q = Math.sqrt(y * y + G * G)),
                                (c = v || z ? Math.atan2(z, v) * ca : p.rotation || 0),
                                (g = G || y ? Math.atan2(G, y) * ca + c : p.skewX || 0),
                                90 < Math.abs(g) && 270 > Math.abs(g) && (l ? ((h *= -1), (g += 0 >= c ? 180 : -180), (c += 0 >= c ? 180 : -180)) : ((q *= -1), (g += 0 >= g ? 180 : -180))),
                                (p.scaleX = h),
                                (p.scaleY = q),
                                (p.rotation = c),
                                (p.skewX = g),
                                xa && ((p.rotationX = p.rotationY = p.z = 0), (p.perspective = r), (p.scaleZ = 1)),
                                p.svg && ((p.x -= p.xOrigin - (p.xOrigin * v + p.yOrigin * G)), (p.y -= p.yOrigin - (p.xOrigin * z + p.yOrigin * y))));
                        p.zOrigin = u;
                        for (k in p) 2e-5 > p[k] && -2e-5 < p[k] && (p[k] = 0);
                    }
                    return (
                        f &&
                            ((a._gsTransform = p),
                            p.svg &&
                                (Da && a.style[qa]
                                    ? d.delayedCall(0.001, function () {
                                          Ka(a.style, qa);
                                      })
                                    : !Da &&
                                      a.getAttribute("transform") &&
                                      d.delayedCall(0.001, function () {
                                          a.removeAttribute("transform");
                                      }))),
                        p
                    );
                }),
                gb = function (a) {
                    var c = this.data,
                        d = -c.rotation * ba,
                        f = d + c.skewX * ba,
                        g = ((Math.cos(d) * c.scaleX * 1e5) | 0) / 1e5,
                        h = ((Math.sin(d) * c.scaleX * 1e5) | 0) / 1e5,
                        k = ((Math.sin(f) * -c.scaleY * 1e5) | 0) / 1e5,
                        n = ((Math.cos(f) * c.scaleY * 1e5) | 0) / 1e5;
                    f = this.t.style;
                    if ((d = this.t.currentStyle)) {
                        var q = h;
                        h = -k;
                        k = -q;
                        var A = d.filter;
                        f.filter = "";
                        var l, u;
                        q = this.t.offsetWidth;
                        var r = this.t.offsetHeight,
                            v = "absolute" !== d.position,
                            z = "progid:DXImageTransform.Microsoft.Matrix(M11=" + g + ", M12=" + h + ", M21=" + k + ", M22=" + n,
                            y = c.x + (q * c.xPercent) / 100,
                            H = c.y + (r * c.yPercent) / 100;
                        if (
                            (null != c.ox && ((l = (c.oxp ? q * c.ox * 0.01 : c.ox) - q / 2), (u = (c.oyp ? r * c.oy * 0.01 : c.oy) - r / 2), (y += l - (l * g + u * h)), (H += u - (l * k + u * n))),
                            v ? ((l = q / 2), (u = r / 2), (z += ", Dx=" + (l - (l * g + u * h) + y) + ", Dy=" + (u - (l * k + u * n) + H) + ")")) : (z += ", sizingMethod='auto expand')"),
                            -1 !== A.indexOf("DXImageTransform.Microsoft.Matrix(") ? (f.filter = A.replace(ta, z)) : (f.filter = z + " " + A),
                            (0 === a || 1 === a) &&
                                1 === g &&
                                0 === h &&
                                0 === k &&
                                1 === n &&
                                ((v && -1 === z.indexOf("Dx=0, Dy=0")) || (P.test(A) && 100 !== parseFloat(RegExp.$1)) || (-1 === A.indexOf(A.indexOf("Alpha")) && f.removeAttribute("filter"))),
                            !v)
                        )
                            for (
                                a = 8 > p ? 1 : -1,
                                    l = c.ieOffsetX || 0,
                                    u = c.ieOffsetY || 0,
                                    c.ieOffsetX = Math.round((q - ((0 > g ? -g : g) * q + (0 > h ? -h : h) * r)) / 2 + y),
                                    c.ieOffsetY = Math.round((r - ((0 > n ? -n : n) * r + (0 > k ? -k : k) * q)) / 2 + H),
                                    ra = 0;
                                4 > ra;
                                ra++
                            )
                                (g = La[ra]),
                                    (h = d[g]),
                                    (q = -1 !== h.indexOf("px") ? parseFloat(h) : G(this.t, g, parseFloat(h), h.replace(O, "")) || 0),
                                    (h = q !== c[g] ? (2 > ra ? -c.ieOffsetX : -c.ieOffsetY) : 2 > ra ? l - c.ieOffsetX : u - c.ieOffsetY),
                                    (f[g] = (c[g] = Math.round(q - h * (0 === ra || 2 === ra ? 1 : a))) + "px");
                    }
                },
                hb = (sa.set3DTransformRatio = sa.setTransformRatio = function (a) {
                    var c,
                        d,
                        f,
                        g,
                        h,
                        k,
                        p,
                        q,
                        n,
                        A,
                        l,
                        u = this.data,
                        r = this.t.style,
                        v = u.rotation,
                        z = u.rotationX,
                        G = u.rotationY,
                        y = u.scaleX,
                        H = u.scaleY,
                        Q = u.scaleZ,
                        E = u.x,
                        w = u.y,
                        N = u.z,
                        B = u.svg,
                        T = u.perspective;
                    var M = u.force3D;
                    var U = u.skewY;
                    var fa = u.skewX;
                    if ((U && ((fa += U), (v += U)), (!((((1 !== a && 0 !== a) || "auto" !== M || (this.tween._totalTime !== this.tween._totalDuration && this.tween._totalTime)) && M) || N || T || G || z) && 1 === Q) || (Da && B) || !xa))
                        return void (v || fa || B
                            ? ((v *= ba),
                              (k = fa * ba),
                              (d = Math.cos(v) * y),
                              (g = Math.sin(v) * y),
                              (f = Math.sin(v - k) * -H),
                              (h = Math.cos(v - k) * H),
                              k && "simple" === u.skewType && ((c = Math.tan(k - U * ba)), (c = Math.sqrt(1 + c * c)), (f *= c), (h *= c), U && ((c = Math.tan(U * ba)), (c = Math.sqrt(1 + c * c)), (d *= c), (g *= c))),
                              B &&
                                  ((E += u.xOrigin - (u.xOrigin * d + u.yOrigin * f) + u.xOffset),
                                  (w += u.yOrigin - (u.xOrigin * g + u.yOrigin * h) + u.yOffset),
                                  Da && (u.xPercent || u.yPercent) && ((A = this.t.getBBox()), (E += 0.01 * u.xPercent * A.width), (w += 0.01 * u.yPercent * A.height)),
                                  (A = 1e-6),
                                  A > E && E > -A && (E = 0),
                                  A > w && w > -A && (w = 0)),
                              (n = ((1e5 * d) | 0) / 1e5 + "," + ((1e5 * g) | 0) / 1e5 + "," + ((1e5 * f) | 0) / 1e5 + "," + ((1e5 * h) | 0) / 1e5 + "," + E + "," + w + ")"),
                              B && Da ? this.t.setAttribute("transform", "matrix(" + n) : (r[qa] = (u.xPercent || u.yPercent ? "translate(" + u.xPercent + "%," + u.yPercent + "%) matrix(" : "matrix(") + n))
                            : (r[qa] = (u.xPercent || u.yPercent ? "translate(" + u.xPercent + "%," + u.yPercent + "%) matrix(" : "matrix(") + y + ",0,0," + H + "," + E + "," + w + ")"));
                    if ((C && ((A = 1e-4), A > y && y > -A && (y = Q = 2e-5), A > H && H > -A && (H = Q = 2e-5), !T || u.z || u.rotationX || u.rotationY || (T = 0)), v || fa)) {
                        v *= ba;
                        var L = (d = Math.cos(v));
                        var V = (g = Math.sin(v));
                        fa &&
                            ((v -= fa * ba),
                            (L = Math.cos(v)),
                            (V = Math.sin(v)),
                            "simple" === u.skewType && ((c = Math.tan((fa - U) * ba)), (c = Math.sqrt(1 + c * c)), (L *= c), (V *= c), u.skewY && ((c = Math.tan(U * ba)), (c = Math.sqrt(1 + c * c)), (d *= c), (g *= c))));
                        f = -V;
                        h = L;
                    } else {
                        if (!(G || z || 1 !== Q || T || B))
                            return void (r[qa] =
                                (u.xPercent || u.yPercent ? "translate(" + u.xPercent + "%," + u.yPercent + "%) translate3d(" : "translate3d(") +
                                E +
                                "px," +
                                w +
                                "px," +
                                N +
                                "px)" +
                                (1 !== y || 1 !== H ? " scale(" + y + "," + H + ")" : ""));
                        d = h = 1;
                        f = g = 0;
                    }
                    fa = 1;
                    a = k = M = U = p = q = 0;
                    var D = T ? -1 / T : 0;
                    n = u.zOrigin;
                    A = 1e-6;
                    (v = G * ba) && ((L = Math.cos(v)), (V = Math.sin(v)), (M = -V), (p = D * -V), (a = d * V), (k = g * V), (fa = L), (D *= L), (d *= L), (g *= L));
                    (v = z * ba) && ((L = Math.cos(v)), (V = Math.sin(v)), (c = f * L + a * V), (l = h * L + k * V), (U = fa * V), (q = D * V), (a = f * -V + a * L), (k = h * -V + k * L), (fa *= L), (D *= L), (f = c), (h = l));
                    1 !== Q && ((a *= Q), (k *= Q), (fa *= Q), (D *= Q));
                    1 !== H && ((f *= H), (h *= H), (U *= H), (q *= H));
                    1 !== y && ((d *= y), (g *= y), (M *= y), (p *= y));
                    (n || B) &&
                        (n && ((E += a * -n), (w += k * -n), (N += fa * -n + n)),
                        B && ((E += u.xOrigin - (u.xOrigin * d + u.yOrigin * f) + u.xOffset), (w += u.yOrigin - (u.xOrigin * g + u.yOrigin * h) + u.yOffset)),
                        A > E && E > -A && (E = "0"),
                        A > w && w > -A && (w = "0"),
                        A > N && N > -A && (N = 0));
                    n = u.xPercent || u.yPercent ? "translate(" + u.xPercent + "%," + u.yPercent + "%) matrix3d(" : "matrix3d(";
                    n = n + ((A > d && d > -A ? "0" : d) + "," + (A > g && g > -A ? "0" : g) + "," + (A > M && M > -A ? "0" : M)) + ("," + (A > p && p > -A ? "0" : p) + "," + (A > f && f > -A ? "0" : f) + "," + (A > h && h > -A ? "0" : h));
                    z || G || 1 !== Q
                        ? ((n += "," + (A > U && U > -A ? "0" : U) + "," + (A > q && q > -A ? "0" : q) + "," + (A > a && a > -A ? "0" : a)),
                          (n += "," + (A > k && k > -A ? "0" : k) + "," + (A > fa && fa > -A ? "0" : fa) + "," + (A > D && D > -A ? "0" : D) + ","))
                        : (n += ",0,0,0,0,1,0,");
                    n += E + "," + w + "," + N + "," + (T ? 1 + -N / T : 1) + ")";
                    r[qa] = n;
                });
            k = Oa.prototype;
            k.x = k.y = k.z = k.skewX = k.skewY = k.rotation = k.rotationX = k.rotationY = k.zOrigin = k.xPercent = k.yPercent = k.xOffset = k.yOffset = 0;
            k.scaleX = k.scaleY = k.scaleZ = 1;
            ha(
                "transform,scale,scaleX,scaleY,scaleZ,x,y,z,rotation,rotationX,rotationY,rotationZ,skewX,skewY,shortRotation,shortRotationX,shortRotationY,shortRotationZ,transformOrigin,svgOrigin,transformPerspective,directionalRotation,parseTransform,force3D,skewType,xPercent,yPercent,smoothOrigin",
                {
                    parser: function (a, c, d, f, h, k, p) {
                        if (f._lastParsedTransform === p) return h;
                        f._lastParsedTransform = p;
                        var q,
                            l = p.scale && "function" == typeof p.scale ? p.scale : 0;
                        "function" == typeof p[d] && ((q = p[d]), (p[d] = c));
                        l && (p.scale = l(E, a));
                        var r, v, z, y, G;
                        c = a._gsTransform;
                        var H = a.style,
                            Q = ab.length,
                            C = {},
                            w = Fa(a, g, !0, p.parseTransform),
                            N = p.transform && ("function" == typeof p.transform ? p.transform(E, u) : p.transform);
                        if (((f._transform = w), N && "string" == typeof N && qa)) {
                            var aa = ja.style;
                            aa[qa] = N;
                            aa.display = "block";
                            aa.position = "absolute";
                            pa.body.appendChild(ja);
                            var I = Fa(ja, null, !1);
                            w.svg &&
                                ((z = w.xOrigin),
                                (y = w.yOrigin),
                                (I.x -= w.xOffset),
                                (I.y -= w.yOffset),
                                (p.transformOrigin || p.svgOrigin) &&
                                    ((N = {}), Xa(a, U(p.transformOrigin), N, p.svgOrigin, p.smoothOrigin, !0), (z = N.xOrigin), (y = N.yOrigin), (I.x -= N.xOffset - w.xOffset), (I.y -= N.yOffset - w.yOffset)),
                                (z || y) && ((G = Va(ja, !0)), (I.x -= z - (z * G[0] + y * G[2])), (I.y -= y - (z * G[1] + y * G[3]))));
                            pa.body.removeChild(ja);
                            I.perspective || (I.perspective = w.perspective);
                            null != p.xPercent && (I.xPercent = ma(p.xPercent, w.xPercent));
                            null != p.yPercent && (I.yPercent = ma(p.yPercent, w.yPercent));
                        } else if ("object" == typeof p) {
                            if (
                                ((I = {
                                    scaleX: ma(null != p.scaleX ? p.scaleX : p.scale, w.scaleX),
                                    scaleY: ma(null != p.scaleY ? p.scaleY : p.scale, w.scaleY),
                                    scaleZ: ma(p.scaleZ, w.scaleZ),
                                    x: ma(p.x, w.x),
                                    y: ma(p.y, w.y),
                                    z: ma(p.z, w.z),
                                    xPercent: ma(p.xPercent, w.xPercent),
                                    yPercent: ma(p.yPercent, w.yPercent),
                                    perspective: ma(p.transformPerspective, w.perspective),
                                }),
                                (r = p.directionalRotation),
                                null != r)
                            )
                                if ("object" == typeof r) for (aa in r) p[aa] = r[aa];
                                else p.rotation = r;
                            "string" == typeof p.x && -1 !== p.x.indexOf("%") && ((I.x = 0), (I.xPercent = ma(p.x, w.xPercent)));
                            "string" == typeof p.y && -1 !== p.y.indexOf("%") && ((I.y = 0), (I.yPercent = ma(p.y, w.yPercent)));
                            I.rotation = Ga("rotation" in p ? p.rotation : "shortRotation" in p ? p.shortRotation + "_short" : "rotationZ" in p ? p.rotationZ : w.rotation, w.rotation, "rotation", C);
                            xa &&
                                ((I.rotationX = Ga("rotationX" in p ? p.rotationX : "shortRotationX" in p ? p.shortRotationX + "_short" : w.rotationX || 0, w.rotationX, "rotationX", C)),
                                (I.rotationY = Ga("rotationY" in p ? p.rotationY : "shortRotationY" in p ? p.shortRotationY + "_short" : w.rotationY || 0, w.rotationY, "rotationY", C)));
                            I.skewX = Ga(p.skewX, w.skewX);
                            I.skewY = Ga(p.skewY, w.skewY);
                        }
                        xa && null != p.force3D && ((w.force3D = p.force3D), (v = !0));
                        w.skewType = p.skewType || w.skewType || n.defaultSkewType;
                        for ((r = w.force3D || w.z || w.rotationX || w.rotationY || I.z || I.rotationX || I.rotationY || I.perspective) || null == p.scale || (I.scaleZ = 1); -1 < --Q; ) {
                            var B = ab[Q];
                            N = I[B] - w[B];
                            (1e-6 < N || -1e-6 > N || null != p[B] || null != Z[B]) && ((v = !0), (h = new na(w, B, w[B], N, h)), B in C && (h.e = C[B]), (h.xs0 = 0), (h.plugin = k), f._overwriteProps.push(h.n));
                        }
                        return (
                            (N = p.transformOrigin),
                            w.svg &&
                                (N || p.svgOrigin) &&
                                ((z = w.xOffset),
                                (y = w.yOffset),
                                Xa(a, U(N), I, p.svgOrigin, p.smoothOrigin),
                                (h = Na(w, "xOrigin", (c ? w : I).xOrigin, I.xOrigin, h, "transformOrigin")),
                                (h = Na(w, "yOrigin", (c ? w : I).yOrigin, I.yOrigin, h, "transformOrigin")),
                                (z !== w.xOffset || y !== w.yOffset) && ((h = Na(w, "xOffset", c ? z : w.xOffset, w.xOffset, h, "transformOrigin")), (h = Na(w, "yOffset", c ? y : w.yOffset, w.yOffset, h, "transformOrigin"))),
                                (N = "0px 0px")),
                            (N || (xa && r && w.zOrigin)) &&
                                (qa
                                    ? ((v = !0),
                                      (B = Ja),
                                      (N = (N || A(a, B, g, !1, "50% 50%")) + ""),
                                      (h = new na(H, B, 0, 0, h, -1, "transformOrigin")),
                                      (h.b = H[B]),
                                      (h.plugin = k),
                                      xa
                                          ? ((aa = w.zOrigin),
                                            (N = N.split(" ")),
                                            (w.zOrigin = (2 < N.length && (0 === aa || "0px" !== N[2]) ? parseFloat(N[2]) : aa) || 0),
                                            (h.xs0 = h.e = N[0] + " " + (N[1] || "50%") + " 0px"),
                                            (h = new na(w, "zOrigin", 0, 0, h, -1, h.n)),
                                            (h.b = aa),
                                            (h.xs0 = h.e = w.zOrigin))
                                          : (h.xs0 = h.e = N))
                                    : U(N + "", w)),
                            v && (f._transformType = (w.svg && Da) || (!r && 3 !== this._transformType) ? 2 : 3),
                            q && (p[d] = q),
                            l && (p.scale = l),
                            h
                        );
                    },
                    prefix: !0,
                }
            );
            ha("boxShadow", { defaultValue: "0px 0px 0px 0px #999", prefix: !0, color: !0, multi: !0, keyword: "inset" });
            ha("borderRadius", {
                defaultValue: "0px",
                parser: function (a, d, f, h, k, p) {
                    d = this.format(d);
                    var n,
                        q,
                        u,
                        l,
                        r,
                        v,
                        z,
                        y,
                        H,
                        w = ["borderTopLeftRadius", "borderTopRightRadius", "borderBottomRightRadius", "borderBottomLeftRadius"],
                        Q = a.style;
                    h = parseFloat(a.offsetWidth);
                    p = parseFloat(a.offsetHeight);
                    d = d.split(" ");
                    for (n = 0; n < w.length; n++) {
                        this.p.indexOf("border") && (w[n] = la(w[n]));
                        var E = (u = A(a, w[n], g, !1, "0px"));
                        -1 !== E.indexOf(" ") && ((u = E.split(" ")), (E = u[0]), (u = u[1]));
                        var C = (q = d[n]);
                        var N = parseFloat(E);
                        var I = E.substr((N + "").length);
                        (v = "=" === C.charAt(1))
                            ? ((l = parseInt(C.charAt(0) + "1", 10)), (C = C.substr(2)), (l *= parseFloat(C)), (r = C.substr((l + "").length - (0 > l ? 1 : 0)) || ""))
                            : ((l = parseFloat(C)), (r = C.substr((l + "").length)));
                        "" === r && (r = c[f] || I);
                        r !== I &&
                            ((z = G(a, "borderLeft", N, I)),
                            (y = G(a, "borderTop", N, I)),
                            "%" === r ? ((E = (z / h) * 100 + "%"), (u = (y / p) * 100 + "%")) : "em" === r ? ((H = G(a, "borderLeft", 1, "em")), (E = z / H + "em"), (u = y / H + "em")) : ((E = z + "px"), (u = y + "px")),
                            v && ((C = parseFloat(E) + l + r), (q = parseFloat(u) + l + r)));
                        k = Ia(Q, w[n], E + " " + u, C + " " + q, !1, "0px", k);
                    }
                    return k;
                },
                prefix: !0,
                formatter: Ta("0px 0px 0px 0px", !1, !0),
            });
            ha("borderBottomLeftRadius,borderBottomRightRadius,borderTopLeftRadius,borderTopRightRadius", {
                defaultValue: "0px",
                parser: function (a, c, d, f, h, k) {
                    return Ia(a.style, d, this.format(A(a, d, g, !1, "0px 0px")), this.format(c), !1, "0px", h);
                },
                prefix: !0,
                formatter: Ta("0px 0px", !1, !0),
            });
            ha("backgroundPosition", {
                defaultValue: "0 0",
                parser: function (a, c, d, f, h, k) {
                    var n, q;
                    d = g || ia(a, null);
                    d = this.format(
                        (d
                            ? p
                                ? d.getPropertyValue("background-position-x") + " " + d.getPropertyValue("background-position-y")
                                : d.getPropertyValue("background-position")
                            : a.currentStyle.backgroundPositionX + " " + a.currentStyle.backgroundPositionY) || "0 0"
                    );
                    var u = this.format(c);
                    if ((-1 !== d.indexOf("%")) != (-1 !== u.indexOf("%")) && 2 > u.split(",").length && ((n = A(a, "backgroundImage").replace(F, "")), n && "none" !== n)) {
                        c = d.split(" ");
                        f = u.split(" ");
                        va.setAttribute("src", n);
                        for (n = 2; -1 < --n; ) {
                            d = c[n];
                            var l = -1 !== d.indexOf("%");
                            l !== (-1 !== f[n].indexOf("%")) && ((q = 0 === n ? a.offsetWidth - va.width : a.offsetHeight - va.height), (c[n] = l ? (parseFloat(d) / 100) * q + "px" : (parseFloat(d) / q) * 100 + "%"));
                        }
                        d = c.join(" ");
                    }
                    return this.parseComplex(a.style, d, u, h, k);
                },
                formatter: U,
            });
            ha("backgroundSize", {
                defaultValue: "0 0",
                formatter: function (a) {
                    return (a += ""), U(-1 === a.indexOf(" ") ? a + " " + a : a);
                },
            });
            ha("perspective", { defaultValue: "0px", prefix: !0 });
            ha("perspectiveOrigin", { defaultValue: "50% 50%", prefix: !0 });
            ha("transformStyle", { prefix: !0 });
            ha("backfaceVisibility", { prefix: !0 });
            ha("userSelect", { prefix: !0 });
            ha("margin", { parser: Ua("marginTop,marginRight,marginBottom,marginLeft") });
            ha("padding", { parser: Ua("paddingTop,paddingRight,paddingBottom,paddingLeft") });
            ha("clip", {
                defaultValue: "rect(0px,0px,0px,0px)",
                parser: function (a, c, d, f, h, k) {
                    var n, q, u;
                    return (
                        9 > p
                            ? ((q = a.currentStyle), (u = 8 > p ? " " : ","), (n = "rect(" + q.clipTop + u + q.clipRight + u + q.clipBottom + u + q.clipLeft + ")"), (c = this.format(c).split(",").join(u)))
                            : ((n = this.format(A(a, this.p, g, !1, this.dflt))), (c = this.format(c))),
                        this.parseComplex(a.style, n, c, h, k)
                    );
                },
            });
            ha("textShadow", { defaultValue: "0px 0px 0px #999", color: !0, multi: !0 });
            ha("autoRound,strictUnits", {
                parser: function (a, c, d, f, g) {
                    return g;
                },
            });
            ha("border", {
                defaultValue: "0px solid #000",
                parser: function (a, c, d, f, h, k) {
                    d = A(a, "borderTopWidth", g, !1, "0px");
                    c = this.format(c).split(" ");
                    f = c[0].replace(O, "");
                    return (
                        "px" !== f && (d = parseFloat(d) / G(a, "borderTopWidth", 1, f) + f),
                        this.parseComplex(a.style, this.format(d + " " + A(a, "borderTopStyle", g, !1, "solid") + " " + A(a, "borderTopColor", g, !1, "#000")), c.join(" "), h, k)
                    );
                },
                color: !0,
                formatter: function (a) {
                    var c = a.split(" ");
                    return c[0] + " " + (c[1] || "solid") + " " + (a.match(wa) || ["#000"])[0];
                },
            });
            ha("borderWidth", { parser: Ua("borderTopWidth,borderRightWidth,borderBottomWidth,borderLeftWidth") });
            ha("float,cssFloat,styleFloat", {
                parser: function (a, c, d, f, g, h) {
                    a = a.style;
                    f = "cssFloat" in a ? "cssFloat" : "styleFloat";
                    return new na(a, f, 0, 0, g, -1, d, !1, 0, a[f], c);
                },
            });
            var ib = function (a) {
                var c,
                    d = this.t,
                    f = d.filter || A(this.data, "filter") || "";
                a = (this.s + this.c * a) | 0;
                100 === a && (-1 === f.indexOf("atrix(") && -1 === f.indexOf("radient(") && -1 === f.indexOf("oader(") ? (d.removeAttribute("filter"), (c = !A(this.data, "filter"))) : ((d.filter = f.replace(J, "")), (c = !0)));
                c || (this.xn1 && (d.filter = f = f || "alpha(opacity=" + a + ")"), -1 === f.indexOf("pacity") ? (0 === a && this.xn1) || (d.filter = f + " alpha(opacity=" + a + ")") : (d.filter = f.replace(P, "opacity=" + a)));
            };
            ha("opacity,alpha,autoAlpha", {
                defaultValue: "1",
                parser: function (a, c, d, f, h, k) {
                    var p = parseFloat(A(a, "opacity", g, !1, "1")),
                        n = a.style,
                        q = "autoAlpha" === d;
                    return (
                        "string" == typeof c && "=" === c.charAt(1) && (c = ("-" === c.charAt(0) ? -1 : 1) * parseFloat(c.substr(2)) + p),
                        q && 1 === p && "hidden" === A(a, "visibility", g) && 0 !== c && (p = 0),
                        ua
                            ? (h = new na(n, "opacity", p, c - p, h))
                            : ((h = new na(n, "opacity", 100 * p, 100 * (c - p), h)),
                              (h.xn1 = q ? 1 : 0),
                              (n.zoom = 1),
                              (h.type = 2),
                              (h.b = "alpha(opacity=" + h.s + ")"),
                              (h.e = "alpha(opacity=" + (h.s + h.c) + ")"),
                              (h.data = a),
                              (h.plugin = k),
                              (h.setRatio = ib)),
                        q && ((h = new na(n, "visibility", 0, 0, h, -1, null, !1, 0, 0 !== p ? "inherit" : "hidden", 0 === c ? "hidden" : "inherit")), (h.xs0 = "inherit"), f._overwriteProps.push(h.n), f._overwriteProps.push(d)),
                        h
                    );
                },
            });
            var Ka = function (a, c) {
                    c && (a.removeProperty ? (("ms" === c.substr(0, 2) || "webkit" === c.substr(0, 6)) && (c = "-" + c), a.removeProperty(c.replace(K, "-$1").toLowerCase())) : a.removeAttribute(c));
                },
                jb = function (a) {
                    if (((this.t._gsClassPT = this), 1 === a || 0 === a)) {
                        this.t.setAttribute("class", 0 === a ? this.b : this.e);
                        for (var c = this.data, d = this.t.style; c; ) c.v ? (d[c.p] = c.v) : Ka(d, c.p), (c = c._next);
                        1 === a && this.t._gsClassPT === this && (this.t._gsClassPT = null);
                    } else this.t.getAttribute("class") !== this.e && this.t.setAttribute("class", this.e);
                };
            ha("className", {
                parser: function (a, c, d, h, k, p, n) {
                    var q,
                        A,
                        u,
                        l = a.getAttribute("class") || "",
                        r = a.style.cssText;
                    if (((k = h._classNamePT = new na(a, d, 0, 0, k, 2)), (k.setRatio = jb), (k.pr = -11), (f = !0), (k.b = l), (d = Q(a, g)), (A = a._gsClassPT))) {
                        var v = {};
                        for (u = A.data; u; ) (v[u.p] = 1), (u = u._next);
                        A.setRatio(1);
                    }
                    return (
                        (a._gsClassPT = k),
                        (k.e = "=" !== c.charAt(1) ? c : l.replace(new RegExp("(?:\\s|^)" + c.substr(2) + "(?![\\w-])"), "") + ("+" === c.charAt(0) ? " " + c.substr(2) : "")),
                        a.setAttribute("class", k.e),
                        (q = T(a, d, Q(a), n, v)),
                        a.setAttribute("class", l),
                        (k.data = q.firstMPT),
                        (a.style.cssText = r),
                        (k.xfirst = h.parse(a, q.difs, k, p))
                    );
                },
            });
            var kb = function (a) {
                if ((1 === a || 0 === a) && this.data._totalTime === this.data._totalDuration && "isFromStart" !== this.data.data) {
                    var c,
                        d,
                        f = this.t.style,
                        g = r.transform.parse;
                    if ("all" === this.e) {
                        f.cssText = "";
                        var h = !0;
                    } else
                        for (a = this.e.split(" ").join("").split(","), c = a.length; -1 < --c; ) {
                            var k = a[c];
                            r[k] && (r[k].parse === g ? (h = !0) : (k = "transformOrigin" === k ? Ja : r[k].p));
                            Ka(f, k);
                        }
                    h && (Ka(f, qa), (d = this.t._gsTransform), d && (d.svg && (this.t.removeAttribute("data-svg-origin"), this.t.removeAttribute("transform")), delete this.t._gsTransform));
                }
            };
            ha("clearProps", {
                parser: function (a, c, d, g, h) {
                    return (h = new na(a, d, 0, 0, h, 2)), (h.setRatio = kb), (h.e = c), (h.pr = -10), (h.data = g._tween), (f = !0), h;
                },
            });
            k = ["bezier", "throwProps", "physicsProps", "physics2D"];
            for (ra = k.length; ra--; ) db(k[ra]);
            k = n.prototype;
            k._firstPT = k._lastParsedTransform = k._transform = null;
            k._onInitTween = function (a, d, k, p) {
                if (!a.nodeType) return !1;
                this._target = u = a;
                this._tween = k;
                this._vars = d;
                E = p;
                q = d.autoRound;
                f = !1;
                c = d.suffixMap || n.suffixMap;
                g = ia(a, "");
                h = this._overwriteProps;
                var l, G, H, w, C;
                p = a.style;
                if (
                    (v && "" === p.zIndex && ((l = A(a, "zIndex", g)), ("auto" === l || "" === l) && this._addLazySet(p, "zIndex", 0)),
                    "string" == typeof d && ((w = p.cssText), (l = Q(a, g)), (p.cssText = w + ";" + d), (l = T(a, l, Q(a)).difs), !ua && D.test(d) && (l.opacity = parseFloat(RegExp.$1)), (d = l), (p.cssText = w)),
                    d.className ? (this._firstPT = G = r.className.parse(a, d.className, "className", this, null, null, d)) : (this._firstPT = G = this.parse(a, d, null)),
                    this._transformType)
                ) {
                    d = 3 === this._transformType;
                    qa
                        ? y &&
                          ((v = !0),
                          "" === p.zIndex && ((H = A(a, "zIndex", g)), ("auto" === H || "" === H) && this._addLazySet(p, "zIndex", 0)),
                          z && this._addLazySet(p, "WebkitBackfaceVisibility", this._vars.WebkitBackfaceVisibility || (d ? "visible" : "hidden")))
                        : (p.zoom = 1);
                    for (H = G; H && H._next; ) H = H._next;
                    d = new na(a, "transform", 0, 0, null, 2);
                    this._linkCSSP(d, null, H);
                    d.setRatio = qa ? hb : gb;
                    d.data = this._transform || Fa(a, g, !0);
                    d.tween = k;
                    d.pr = -1;
                    h.pop();
                }
                if (f) {
                    for (; G; ) {
                        a = G._next;
                        for (H = w; H && H.pr > G.pr; ) H = H._next;
                        (G._prev = H ? H._prev : C) ? (G._prev._next = G) : (w = G);
                        (G._next = H) ? (H._prev = G) : (C = G);
                        G = a;
                    }
                    this._firstPT = w;
                }
                return !0;
            };
            k.parse = function (a, d, f, h) {
                var k,
                    p,
                    n,
                    l,
                    v,
                    z = a.style;
                for (k in d) {
                    var y = d[k];
                    "function" == typeof y && (y = y(E, u));
                    if ((p = r[k])) f = p.parse(a, y, k, this, f, h, d);
                    else {
                        p = A(a, k, g) + "";
                        var w = "string" == typeof y;
                        if ("color" === k || "fill" === k || "stroke" === k || -1 !== k.indexOf("Color") || (w && R.test(y)))
                            w || ((y = Ma(y)), (y = (3 < y.length ? "rgba(" : "rgb(") + y.join(",") + ")")), (f = Ia(z, k, p, y, !0, "transparent", f, 0, h));
                        else if (w && ea.test(y)) f = Ia(z, k, p, y, !0, null, f, 0, h);
                        else {
                            var Q = (n = parseFloat(p)) || 0 === n ? p.substr((n + "").length) : "";
                            if ("" === p || "auto" === p)
                                if ("width" === k || "height" === k) {
                                    n = a;
                                    var C = k;
                                    Q = g;
                                    if ("svg" === (n.nodeName + "").toLowerCase()) n = (Q || ia(n))[C] || 0;
                                    else if (n.getCTM && Ya(n)) n = n.getBBox()[C] || 0;
                                    else {
                                        var B = parseFloat("width" === C ? n.offsetWidth : n.offsetHeight);
                                        C = fa[C];
                                        var U = C.length;
                                        for (Q = Q || ia(n, null); -1 < --U; ) (B -= parseFloat(A(n, "padding" + C[U], Q, !0)) || 0), (B -= parseFloat(A(n, "border" + C[U] + "Width", Q, !0)) || 0);
                                        n = B;
                                    }
                                    Q = "px";
                                } else "left" === k || "top" === k ? ((n = H(a, k, g)), (Q = "px")) : ((n = "opacity" !== k ? 0 : 1), (Q = ""));
                            (B = w && "=" === y.charAt(1)) ? ((l = parseInt(y.charAt(0) + "1", 10)), (y = y.substr(2)), (l *= parseFloat(y)), (v = y.replace(O, ""))) : ((l = parseFloat(y)), (v = w ? y.replace(O, "") : ""));
                            "" === v && (v = k in c ? c[k] : Q);
                            y = l || 0 === l ? (B ? l + n : l) + v : d[k];
                            Q !== v &&
                                "" !== v &&
                                (l || 0 === l) &&
                                n &&
                                ((n = G(a, k, n, Q)),
                                "%" === v
                                    ? ((n /= G(a, k, 100, "%") / 100), !0 !== d.strictUnits && (p = n + "%"))
                                    : "em" === v || "rem" === v || "vw" === v || "vh" === v
                                    ? (n /= G(a, k, 1, v))
                                    : "px" !== v && ((l = G(a, k, l, v)), (v = "px")),
                                B && (l || 0 === l) && (y = l + n + v));
                            B && (l += n);
                            (!n && 0 !== n) || (!l && 0 !== l)
                                ? void 0 !== z[k] && (y || ("NaN" != y + "" && null != y))
                                    ? ((f = new na(z, k, l || n || 0, 0, f, -1, k, !1, 0, p, y)), (f.xs0 = "none" !== y || ("display" !== k && -1 === k.indexOf("Style")) ? y : p))
                                    : _gsScope.console && console.log("invalid " + k + " tween value: " + d[k])
                                : ((f = new na(z, k, n, l - n, f, 0, k, !1 !== q && ("px" === v || "zIndex" === k), 0, p, y)), (f.xs0 = v));
                        }
                    }
                    h && f && !f.plugin && (f.plugin = h);
                }
                return f;
            };
            k.setRatio = function (a) {
                var c,
                    d,
                    f = this._firstPT;
                if (1 !== a || (this._tween._time !== this._tween._duration && 0 !== this._tween._time))
                    if (a || (this._tween._time !== this._tween._duration && 0 !== this._tween._time) || -1e-6 === this._tween._rawPrevTime)
                        for (; f; ) {
                            if (((c = f.c * a + f.s), f.r ? (c = Math.round(c)) : 1e-6 > c && -1e-6 < c && (c = 0), f.type))
                                if (1 === f.type)
                                    if (((d = f.l), 2 === d)) f.t[f.p] = f.xs0 + c + f.xs1 + f.xn1 + f.xs2;
                                    else if (3 === d) f.t[f.p] = f.xs0 + c + f.xs1 + f.xn1 + f.xs2 + f.xn2 + f.xs3;
                                    else if (4 === d) f.t[f.p] = f.xs0 + c + f.xs1 + f.xn1 + f.xs2 + f.xn2 + f.xs3 + f.xn3 + f.xs4;
                                    else if (5 === d) f.t[f.p] = f.xs0 + c + f.xs1 + f.xn1 + f.xs2 + f.xn2 + f.xs3 + f.xn3 + f.xs4 + f.xn4 + f.xs5;
                                    else {
                                        var g = f.xs0 + c + f.xs1;
                                        for (d = 1; d < f.l; d++) g += f["xn" + d] + f["xs" + (d + 1)];
                                        f.t[f.p] = g;
                                    }
                                else -1 === f.type ? (f.t[f.p] = f.xs0) : f.setRatio && f.setRatio(a);
                            else f.t[f.p] = c + f.xs0;
                            f = f._next;
                        }
                    else for (; f; ) 2 !== f.type ? (f.t[f.p] = f.b) : f.setRatio(a), (f = f._next);
                else
                    for (; f; ) {
                        if (2 !== f.type)
                            if (f.r && -1 !== f.type)
                                if (((c = Math.round(f.s + f.c)), f.type)) {
                                    if (1 === f.type) {
                                        g = f.xs0 + c + f.xs1;
                                        for (d = 1; d < f.l; d++) g += f["xn" + d] + f["xs" + (d + 1)];
                                        f.t[f.p] = g;
                                    }
                                } else f.t[f.p] = c + f.xs0;
                            else f.t[f.p] = f.e;
                        else f.setRatio(a);
                        f = f._next;
                    }
            };
            k._enableTransforms = function (a) {
                this._transform = this._transform || Fa(this._target, g, !0);
                this._transformType = (this._transform.svg && Da) || (!a && 3 !== this._transformType) ? 2 : 3;
            };
            var lb = function (a) {
                this.t[this.p] = this.e;
                this.data._linkCSSP(this, this._next, null, !0);
            };
            k._addLazySet = function (a, c, d) {
                a = this._firstPT = new na(a, c, 0, 0, this._firstPT, 2);
                a.e = d;
                a.setRatio = lb;
                a.data = this;
            };
            k._linkCSSP = function (a, c, d, f) {
                return (
                    a &&
                        (c && (c._prev = a),
                        a._next && (a._next._prev = a._prev),
                        a._prev ? (a._prev._next = a._next) : this._firstPT === a && ((this._firstPT = a._next), (f = !0)),
                        d ? (d._next = a) : f || null !== this._firstPT || (this._firstPT = a),
                        (a._next = c),
                        (a._prev = d)),
                    a
                );
            };
            k._mod = function (a) {
                for (var c = this._firstPT; c; ) "function" == typeof a[c.p] && a[c.p] === Math.round && (c.r = 1), (c = c._next);
            };
            k._kill = function (c) {
                var d,
                    f,
                    g,
                    h = c;
                if (c.autoAlpha || c.alpha) {
                    h = {};
                    for (f in c) h[f] = c[f];
                    h.opacity = 1;
                    h.autoAlpha && (h.visibility = 1);
                }
                c.className &&
                    (d = this._classNamePT) &&
                    ((g = d.xfirst), g && g._prev ? this._linkCSSP(g._prev, d._next, g._prev._prev) : g === this._firstPT && (this._firstPT = d._next), d._next && this._linkCSSP(d._next, d._next._next, g._prev), (this._classNamePT = null));
                for (d = this._firstPT; d; ) d.plugin && d.plugin !== f && d.plugin._kill && (d.plugin._kill(c), (f = d.plugin)), (d = d._next);
                return a.prototype._kill.call(this, h);
            };
            var Pa = function (a, c, d) {
                var f;
                if (a.slice) for (f = a.length; -1 < --f; ) Pa(a[f], c, d);
                else
                    for (a = a.childNodes, f = a.length; -1 < --f; ) {
                        var g = a[f];
                        var h = g.type;
                        g.style && (c.push(Q(g)), d && d.push(g));
                        (1 !== h && 9 !== h && 11 !== h) || !g.childNodes.length || Pa(g, c, d);
                    }
            };
            return (
                (n.cascadeTo = function (a, c, f) {
                    var g, h;
                    var k = d.to(a, c, f);
                    var p = [k],
                        n = [],
                        q = [],
                        u = [],
                        A = d._internals.reservedProps;
                    a = k._targets || k.target;
                    Pa(a, n, u);
                    k.render(c, !0, !0);
                    Pa(a, q);
                    k.render(0, !0, !0);
                    k._enabled(!0);
                    for (a = u.length; -1 < --a; )
                        if (((g = T(u[a], n[a], q[a])), g.firstMPT)) {
                            g = g.difs;
                            for (h in f) A[h] && (g[h] = f[h]);
                            k = {};
                            for (h in g) k[h] = n[a][h];
                            p.push(d.fromTo(u[a], c, k, g));
                        }
                    return p;
                }),
                a.activate([n]),
                n
            );
        },
        !0
    );
    (function () {
        var a = _gsScope._gsDefine.plugin({
            propName: "roundProps",
            version: "1.6.0",
            priority: -1,
            API: 2,
            init: function (a, f, c) {
                return (this._tween = c), !0;
            },
        }).prototype;
        a._onInitAllProps = function () {
            for (var a, f, c, g = this._tween, h = g.vars.roundProps.join ? g.vars.roundProps : g.vars.roundProps.split(","), n = h.length, l = {}, r = g._propLookup.roundProps; -1 < --n; ) l[h[n]] = Math.round;
            for (n = h.length; -1 < --n; )
                for (a = h[n], f = g._firstPT; f; ) {
                    c = f._next;
                    if (f.pg) f.t._mod(l);
                    else if (f.n === a)
                        if (2 === f.f && f.t) for (f = f.t._firstPT; f; ) f.f || f.blob || (f.m = Math.round), (f = f._next);
                        else this._add(f.t, a, f.s, f.c), c && (c._prev = f._prev), f._prev ? (f._prev._next = c) : g._firstPT === f && (g._firstPT = c), (f._next = f._prev = null), (g._propLookup[a] = r);
                    f = c;
                }
            return !1;
        };
        a._add = function (a, f, c, g) {
            this._addTween(a, f, c, c + g, f, Math.round);
            this._overwriteProps.push(f);
        };
    })();
    (function () {
        _gsScope._gsDefine.plugin({
            propName: "attr",
            API: 2,
            version: "0.6.0",
            init: function (a, d, f, c) {
                var g;
                if ("function" != typeof a.setAttribute) return !1;
                for (g in d) (f = d[g]), "function" == typeof f && (f = f(c, a)), this._addTween(a, "setAttribute", a.getAttribute(g) + "", f + "", g, !1, g), this._overwriteProps.push(g);
                return !0;
            },
        });
    })();
    _gsScope._gsDefine.plugin({
        propName: "directionalRotation",
        version: "0.3.0",
        API: 2,
        init: function (a, d, f, c) {
            "object" != typeof d && (d = { rotation: d });
            this.finals = {};
            var g, h, n, l, r, k;
            f = !0 === d.useRadians ? 2 * Math.PI : 360;
            for (g in d)
                "useRadians" !== g &&
                    ((l = d[g]),
                    "function" == typeof l && (l = l(c, a)),
                    (k = (l + "").split("_")),
                    (h = k[0]),
                    (n = parseFloat("function" != typeof a[g] ? a[g] : a[g.indexOf("set") || "function" != typeof a["get" + g.substr(3)] ? g : "get" + g.substr(3)]())),
                    (l = this.finals[g] = "string" == typeof h && "=" === h.charAt(1) ? n + parseInt(h.charAt(0) + "1", 10) * Number(h.substr(2)) : Number(h) || 0),
                    (r = l - n),
                    k.length &&
                        ((h = k.join("_")),
                        -1 !== h.indexOf("short") && ((r %= f), r !== r % (f / 2) && (r = 0 > r ? r + f : r - f)),
                        -1 !== h.indexOf("_cw") && 0 > r ? (r = ((r + 9999999999 * f) % f) - ((r / f) | 0) * f) : -1 !== h.indexOf("ccw") && 0 < r && (r = ((r - 9999999999 * f) % f) - ((r / f) | 0) * f)),
                    (1e-6 < r || -1e-6 > r) && (this._addTween(a, g, n, n + r, g), this._overwriteProps.push(g)));
            return !0;
        },
        set: function (a) {
            if (1 !== a) this._super.setRatio.call(this, a);
            else for (a = this._firstPT; a; ) a.f ? a.t[a.p](this.finals[a.p]) : (a.t[a.p] = this.finals[a.p]), (a = a._next);
        },
    })._autoCSS = !0;
    _gsScope._gsDefine(
        "easing.Back",
        ["easing.Ease"],
        function (a) {
            var d,
                f,
                c,
                g = _gsScope.GreenSockGlobals || _gsScope,
                h = 2 * Math.PI,
                n = Math.PI / 2,
                l = g.com.greensock._class,
                r = function (c, d) {
                    c = l("easing." + c, function () {}, !0);
                    var f = (c.prototype = new a());
                    return (f.constructor = c), (f.getRatio = d), c;
                },
                k = a.register || function () {},
                q = function (a, c, d, f, g) {
                    c = l("easing." + a, { easeOut: new c(), easeIn: new d(), easeInOut: new f() }, !0);
                    return k(c, a), c;
                },
                v = function (a, c, d) {
                    this.t = a;
                    this.v = c;
                    d && ((this.next = d), (d.prev = this), (this.c = d.v - c), (this.gap = d.t - a));
                },
                y = function (c, d) {
                    var f = l(
                        "easing." + c,
                        function (a) {
                            this._p1 = a || 0 === a ? a : 1.70158;
                            this._p2 = 1.525 * this._p1;
                        },
                        !0
                    );
                    c = f.prototype = new a();
                    return (
                        (c.constructor = f),
                        (c.getRatio = d),
                        (c.config = function (a) {
                            return new f(a);
                        }),
                        f
                    );
                };
            y = q(
                "Back",
                y("BackOut", function (a) {
                    return --a * a * ((this._p1 + 1) * a + this._p1) + 1;
                }),
                y("BackIn", function (a) {
                    return a * a * ((this._p1 + 1) * a - this._p1);
                }),
                y("BackInOut", function (a) {
                    return 1 > (a *= 2) ? 0.5 * a * a * ((this._p2 + 1) * a - this._p2) : 0.5 * ((a -= 2) * a * ((this._p2 + 1) * a + this._p2) + 2);
                })
            );
            var C = l(
                    "easing.SlowMo",
                    function (a, c, d) {
                        null == a ? (a = 0.7) : 1 < a && (a = 1);
                        this._p = 1 !== a ? (c || 0 === c ? c : 0.7) : 0;
                        this._p1 = (1 - a) / 2;
                        this._p2 = a;
                        this._p3 = this._p1 + this._p2;
                        this._calcEnd = !0 === d;
                    },
                    !0
                ),
                z = (C.prototype = new a());
            return (
                (z.constructor = C),
                (z.getRatio = function (a) {
                    var c = a + (0.5 - a) * this._p;
                    return a < this._p1
                        ? this._calcEnd
                            ? 1 - (a = 1 - a / this._p1) * a
                            : c - (a = 1 - a / this._p1) * a * a * a * c
                        : a > this._p3
                        ? this._calcEnd
                            ? 1 - (a = (a - this._p3) / this._p1) * a
                            : c + (a - c) * (a = (a - this._p3) / this._p1) * a * a * a
                        : this._calcEnd
                        ? 1
                        : c;
                }),
                (C.ease = new C(0.7, 0.7)),
                (z.config = C.config = function (a, c, d) {
                    return new C(a, c, d);
                }),
                (d = l(
                    "easing.SteppedEase",
                    function (a) {
                        a = a || 1;
                        this._p1 = 1 / a;
                        this._p2 = a + 1;
                    },
                    !0
                )),
                (z = d.prototype = new a()),
                (z.constructor = d),
                (z.getRatio = function (a) {
                    return 0 > a ? (a = 0) : 1 <= a && (a = 0.999999999), ((this._p2 * a) >> 0) * this._p1;
                }),
                (z.config = d.config = function (a) {
                    return new d(a);
                }),
                (f = l(
                    "easing.RoughEase",
                    function (c) {
                        c = c || {};
                        for (
                            var d,
                                f,
                                g,
                                h,
                                k = c.taper || "none",
                                n = [],
                                p = 0,
                                q = (h = 0 | (c.points || 20)),
                                l = !1 !== c.randomize,
                                r = !0 === c.clamp,
                                y = c.template instanceof a ? c.template : null,
                                z = "number" == typeof c.strength ? 0.4 * c.strength : 0.4;
                            -1 < --q;

                        )
                            (c = l ? Math.random() : (1 / h) * q),
                                (d = y ? y.getRatio(c) : c),
                                "none" === k ? (f = z) : "out" === k ? ((g = 1 - c), (f = g * g * z)) : "in" === k ? (f = c * c * z) : 0.5 > c ? ((g = 2 * c), (f = g * g * 0.5 * z)) : ((g = 2 * (1 - c)), (f = g * g * 0.5 * z)),
                                l ? (d += Math.random() * f - 0.5 * f) : q % 2 ? (d += 0.5 * f) : (d -= 0.5 * f),
                                r && (1 < d ? (d = 1) : 0 > d && (d = 0)),
                                (n[p++] = { x: c, y: d });
                        n.sort(function (a, c) {
                            return a.x - c.x;
                        });
                        f = new v(1, 1, null);
                        for (q = h; -1 < --q; ) (h = n[q]), (f = new v(h.x, h.y, f));
                        this._prev = new v(0, 0, 0 !== f.t ? f : f.next);
                    },
                    !0
                )),
                (z = f.prototype = new a()),
                (z.constructor = f),
                (z.getRatio = function (a) {
                    var c = this._prev;
                    if (a > c.t) {
                        for (; c.next && a >= c.t; ) c = c.next;
                        c = c.prev;
                    } else for (; c.prev && a <= c.t; ) c = c.prev;
                    return (this._prev = c), c.v + ((a - c.t) / c.gap) * c.c;
                }),
                (z.config = function (a) {
                    return new f(a);
                }),
                (f.ease = new f()),
                q(
                    "Bounce",
                    r("BounceOut", function (a) {
                        return 1 / 2.75 > a ? 7.5625 * a * a : 2 / 2.75 > a ? 7.5625 * (a -= 1.5 / 2.75) * a + 0.75 : 2.5 / 2.75 > a ? 7.5625 * (a -= 2.25 / 2.75) * a + 0.9375 : 7.5625 * (a -= 2.625 / 2.75) * a + 0.984375;
                    }),
                    r("BounceIn", function (a) {
                        return (a = 1 - a) < 1 / 2.75
                            ? 1 - 7.5625 * a * a
                            : 2 / 2.75 > a
                            ? 1 - (7.5625 * (a -= 1.5 / 2.75) * a + 0.75)
                            : 2.5 / 2.75 > a
                            ? 1 - (7.5625 * (a -= 2.25 / 2.75) * a + 0.9375)
                            : 1 - (7.5625 * (a -= 2.625 / 2.75) * a + 0.984375);
                    }),
                    r("BounceInOut", function (a) {
                        var c = 0.5 > a;
                        return (
                            (a = c ? 1 - 2 * a : 2 * a - 1),
                            (a = 1 / 2.75 > a ? 7.5625 * a * a : 2 / 2.75 > a ? 7.5625 * (a -= 1.5 / 2.75) * a + 0.75 : 2.5 / 2.75 > a ? 7.5625 * (a -= 2.25 / 2.75) * a + 0.9375 : 7.5625 * (a -= 2.625 / 2.75) * a + 0.984375),
                            c ? 0.5 * (1 - a) : 0.5 * a + 0.5
                        );
                    })
                ),
                q(
                    "Circ",
                    r("CircOut", function (a) {
                        return Math.sqrt(1 - --a * a);
                    }),
                    r("CircIn", function (a) {
                        return -(Math.sqrt(1 - a * a) - 1);
                    }),
                    r("CircInOut", function (a) {
                        return 1 > (a *= 2) ? -0.5 * (Math.sqrt(1 - a * a) - 1) : 0.5 * (Math.sqrt(1 - (a -= 2) * a) + 1);
                    })
                ),
                (c = function (c, d, f) {
                    var g = l(
                        "easing." + c,
                        function (a, c) {
                            this._p1 = 1 <= a ? a : 1;
                            this._p2 = (c || f) / (1 > a ? a : 1);
                            this._p3 = (this._p2 / h) * (Math.asin(1 / this._p1) || 0);
                            this._p2 = h / this._p2;
                        },
                        !0
                    );
                    c = g.prototype = new a();
                    return (
                        (c.constructor = g),
                        (c.getRatio = d),
                        (c.config = function (a, c) {
                            return new g(a, c);
                        }),
                        g
                    );
                }),
                q(
                    "Elastic",
                    c(
                        "ElasticOut",
                        function (a) {
                            return this._p1 * Math.pow(2, -10 * a) * Math.sin((a - this._p3) * this._p2) + 1;
                        },
                        0.3
                    ),
                    c(
                        "ElasticIn",
                        function (a) {
                            return -(this._p1 * Math.pow(2, 10 * --a) * Math.sin((a - this._p3) * this._p2));
                        },
                        0.3
                    ),
                    c(
                        "ElasticInOut",
                        function (a) {
                            return 1 > (a *= 2) ? -0.5 * this._p1 * Math.pow(2, 10 * --a) * Math.sin((a - this._p3) * this._p2) : this._p1 * Math.pow(2, -10 * --a) * Math.sin((a - this._p3) * this._p2) * 0.5 + 1;
                        },
                        0.45
                    )
                ),
                q(
                    "Expo",
                    r("ExpoOut", function (a) {
                        return 1 - Math.pow(2, -10 * a);
                    }),
                    r("ExpoIn", function (a) {
                        return Math.pow(2, 10 * (a - 1)) - 0.001;
                    }),
                    r("ExpoInOut", function (a) {
                        return 1 > (a *= 2) ? 0.5 * Math.pow(2, 10 * (a - 1)) : 0.5 * (2 - Math.pow(2, -10 * (a - 1)));
                    })
                ),
                q(
                    "Sine",
                    r("SineOut", function (a) {
                        return Math.sin(a * n);
                    }),
                    r("SineIn", function (a) {
                        return -Math.cos(a * n) + 1;
                    }),
                    r("SineInOut", function (a) {
                        return -0.5 * (Math.cos(Math.PI * a) - 1);
                    })
                ),
                l(
                    "easing.EaseLookup",
                    {
                        find: function (c) {
                            return a.map[c];
                        },
                    },
                    !0
                ),
                k(g.SlowMo, "SlowMo", "ease,"),
                k(f, "RoughEase", "ease,"),
                k(d, "SteppedEase", "ease,"),
                y
            );
        },
        !0
    );
});
_gsScope._gsDefine && _gsScope._gsQueue.pop()();
(function (a, d) {
    var f = {},
        c = a.document,
        g = (a.GreenSockGlobals = a.GreenSockGlobals || a);
    if (!g.TweenLite) {
        var h,
            n = function (a) {
                var c = a.split("."),
                    d = g;
                for (a = 0; a < c.length; a++) d[c[a]] = d = d[c[a]] || {};
                return d;
            },
            l = n("com.greensock"),
            r = function (a) {
                var c,
                    d = [],
                    f = a.length;
                for (c = 0; c !== f; d.push(a[c++]));
                return d;
            },
            k = function () {},
            q = (function () {
                var a = Object.prototype.toString,
                    c = a.call([]);
                return function (d) {
                    return null != d && (d instanceof Array || ("object" == typeof d && !!d.push && a.call(d) === c));
                };
            })(),
            v = {},
            y = function (c, h, k, q) {
                this.sc = v[c] ? v[c].sc : [];
                v[c] = this;
                this.gsClass = null;
                this.func = k;
                var A = [];
                this.check = function (l) {
                    for (var u, p, r, z, G, H = h.length, w = H; -1 < --H; ) (u = v[h[H]] || new y(h[H], [])).gsClass ? ((A[H] = u.gsClass), w--) : l && u.sc.push(this);
                    if (0 === w && k) {
                        if (((p = ("com.greensock." + c).split(".")), (r = p.pop()), (z = n(p.join("."))[r] = this.gsClass = k.apply(k, A)), q))
                            if (((g[r] = f[r] = z), (G = "undefined" != typeof module && module.exports), !G && "function" == typeof define && define.amd))
                                define((a.GreenSockAMDPath ? a.GreenSockAMDPath + "/" : "") + c.split(".").pop(), [], function () {
                                    return z;
                                });
                            else if (G)
                                if (c === d) for (H in ((module.exports = f[d] = z), f)) z[H] = f[H];
                                else f[d] && (f[d][r] = z);
                        for (H = 0; H < this.sc.length; H++) this.sc[H].check();
                    }
                };
                this.check(!0);
            },
            C = (a._gsDefine = function (a, c, d, f) {
                return new y(a, c, d, f);
            }),
            z = (l._class = function (a, c, d) {
                return (
                    (c = c || function () {}),
                    C(
                        a,
                        [],
                        function () {
                            return c;
                        },
                        d
                    ),
                    c
                );
            });
        C.globals = g;
        var p = [0, 0, 1, 1],
            u = z(
                "easing.Ease",
                function (a, c, d, f) {
                    this._func = a;
                    this._type = d || 0;
                    this._power = f || 0;
                    this._params = c ? p.concat(c) : p;
                },
                !0
            ),
            E = (u.map = {}),
            M = (u.register = function (a, c, d, f) {
                var g;
                c = c.split(",");
                for (var h = c.length, k = (d || "easeIn,easeOut,easeInOut").split(","); -1 < --h; ) {
                    var n = c[h];
                    d = f ? z("easing." + n, null, !0) : l.easing[n] || {};
                    for (g = k.length; -1 < --g; ) {
                        var q = k[g];
                        E[n + "." + q] = E[q + n] = d[q] = a.getRatio ? a : a[q] || new a();
                    }
                }
            });
        var w = u.prototype;
        w._calcEnd = !1;
        w.getRatio = function (a) {
            if (this._func) return (this._params[0] = a), this._func.apply(null, this._params);
            var c = this._type,
                d = this._power,
                f = 1 === c ? 1 - a : 2 === c ? a : 0.5 > a ? 2 * a : 2 * (1 - a);
            return 1 === d ? (f *= f) : 2 === d ? (f *= f * f) : 3 === d ? (f *= f * f * f) : 4 === d && (f *= f * f * f * f), 1 === c ? 1 - f : 2 === c ? f : 0.5 > a ? f / 2 : 1 - f / 2;
        };
        var L = ["Linear", "Quad", "Cubic", "Quart", "Quint,Strong"];
        for (h = L.length; -1 < --h; ) (w = L[h] + ",Power" + h), M(new u(null, null, 1, h), w, "easeOut", !0), M(new u(null, null, 2, h), w, "easeIn" + (0 === h ? ",easeNone" : "")), M(new u(null, null, 3, h), w, "easeInOut");
        E.linear = l.easing.Linear.easeIn;
        E.swing = l.easing.Quad.easeInOut;
        var B = z("events.EventDispatcher", function (a) {
            this._listeners = {};
            this._eventTarget = a || this;
        });
        w = B.prototype;
        w.addEventListener = function (a, c, d, f, g) {
            g = g || 0;
            var h,
                k = this._listeners[a],
                n = 0;
            this !== K || ia || K.wake();
            null == k && (this._listeners[a] = k = []);
            for (h = k.length; -1 < --h; ) (a = k[h]), a.c === c && a.s === d ? k.splice(h, 1) : 0 === n && a.pr < g && (n = h + 1);
            k.splice(n, 0, { c: c, s: d, up: f, pr: g });
        };
        w.removeEventListener = function (a, c) {
            var d = this._listeners[a];
            if (d) for (a = d.length; -1 < --a; ) if (d[a].c === c) return void d.splice(a, 1);
        };
        w.dispatchEvent = function (a) {
            var c,
                d,
                f = this._listeners[a];
            if (f) {
                var g = f.length;
                1 < g && (f = f.slice(0));
                for (c = this._eventTarget; -1 < --g; ) (d = f[g]) && (d.up ? d.c.call(d.s || c, { type: a, target: c }) : d.c.call(d.s || c));
            }
        };
        var O = a.requestAnimationFrame,
            P = a.cancelAnimationFrame,
            D =
                Date.now ||
                function () {
                    return new Date().getTime();
                },
            J = D();
        L = ["ms", "moz", "webkit", "o"];
        for (h = L.length; -1 < --h && !O; ) (O = a[L[h] + "RequestAnimationFrame"]), (P = a[L[h] + "CancelAnimationFrame"] || a[L[h] + "CancelRequestAnimationFrame"]);
        z("Ticker", function (a, d) {
            var f,
                g,
                h,
                n,
                q,
                l = this,
                u = D(),
                p = !1 !== d && O ? "auto" : !1,
                A = 500,
                r = 33,
                v = function (a) {
                    var c;
                    var d = D() - J;
                    d > A && (u += d - r);
                    J += d;
                    l.time = (J - u) / 1e3;
                    d = l.time - q;
                    (!f || 0 < d || !0 === a) && (l.frame++, (q += d + (d >= n ? 0.004 : n - d)), (c = !0));
                    !0 !== a && (h = g(v));
                    c && l.dispatchEvent("tick");
                };
            B.call(l);
            l.time = l.frame = 0;
            l.tick = function () {
                v(!0);
            };
            l.lagSmoothing = function (a, c) {
                A = a || 1e10;
                r = Math.min(c, A, 0);
            };
            l.sleep = function () {
                null != h && (p && P ? P(h) : clearTimeout(h), (g = k), (h = null), l === K && (ia = !1));
            };
            l.wake = function (a) {
                null !== h ? l.sleep() : a ? (u += -J + (J = D())) : 10 < l.frame && (J = D() - A + 5);
                g =
                    0 === f
                        ? k
                        : p && O
                        ? O
                        : function (a) {
                              return setTimeout(a, (1e3 * (q - l.time) + 1) | 0);
                          };
                l === K && (ia = !0);
                v(2);
            };
            l.fps = function (a) {
                return arguments.length ? ((f = a), (n = 1 / (f || 60)), (q = this.time + n), void l.wake()) : f;
            };
            l.useRAF = function (a) {
                return arguments.length ? (l.sleep(), (p = a), void l.fps(f)) : p;
            };
            l.fps(a);
            setTimeout(function () {
                "auto" === p && 5 > l.frame && "hidden" !== c.visibilityState && l.useRAF(!1);
            }, 1500);
        });
        w = l.Ticker.prototype = new l.events.EventDispatcher();
        w.constructor = l.Ticker;
        var R = z("core.Animation", function (a, c) {
            if (
                ((this.vars = c = c || {}),
                (this._duration = this._totalDuration = a || 0),
                (this._delay = Number(c.delay) || 0),
                (this._timeScale = 1),
                (this._active = !0 === c.immediateRender),
                (this.data = c.data),
                (this._reversed = !0 === c.reversed),
                va)
            )
                ia || K.wake(), (a = this.vars.useFrames ? ja : va), a.add(this, a._time), this.vars.paused && this.paused(!0);
        });
        var K = (R.ticker = new l.Ticker());
        w = R.prototype;
        w._dirty = w._gc = w._initted = w._paused = !1;
        w._totalTime = w._time = 0;
        w._rawPrevTime = -1;
        w._next = w._last = w._onUpdate = w._timeline = w.timeline = null;
        w._paused = !1;
        var W = function () {
            ia && 2e3 < D() - J && K.wake();
            setTimeout(W, 2e3);
        };
        W();
        w.play = function (a, c) {
            return null != a && this.seek(a, c), this.reversed(!1).paused(!1);
        };
        w.pause = function (a, c) {
            return null != a && this.seek(a, c), this.paused(!0);
        };
        w.resume = function (a, c) {
            return null != a && this.seek(a, c), this.paused(!1);
        };
        w.seek = function (a, c) {
            return this.totalTime(Number(a), !1 !== c);
        };
        w.restart = function (a, c) {
            return this.reversed(!1)
                .paused(!1)
                .totalTime(a ? -this._delay : 0, !1 !== c, !0);
        };
        w.reverse = function (a, c) {
            return null != a && this.seek(a || this.totalDuration(), c), this.reversed(!0).paused(!1);
        };
        w.render = function (a, c, d) {};
        w.invalidate = function () {
            return (this._time = this._totalTime = 0), (this._initted = this._gc = !1), (this._rawPrevTime = -1), (this._gc || !this.timeline) && this._enabled(!0), this;
        };
        w.isActive = function () {
            var a,
                c = this._timeline,
                d = this._startTime;
            return !c || (!this._gc && !this._paused && c.isActive() && (a = c.rawTime(!0)) >= d && a < d + this.totalDuration() / this._timeScale);
        };
        w._enabled = function (a, c) {
            return ia || K.wake(), (this._gc = !a), (this._active = this.isActive()), !0 !== c && (a && !this.timeline ? this._timeline.add(this, this._startTime - this._delay) : !a && this.timeline && this._timeline._remove(this, !0)), !1;
        };
        w._kill = function (a, c) {
            return this._enabled(!1, !1);
        };
        w.kill = function (a, c) {
            return this._kill(a, c), this;
        };
        w._uncache = function (a) {
            for (a = a ? this : this.timeline; a; ) (a._dirty = !0), (a = a.timeline);
            return this;
        };
        w._swapSelfInParams = function (a) {
            for (var c = a.length, d = a.concat(); -1 < --c; ) "{self}" === a[c] && (d[c] = this);
            return d;
        };
        w._callback = function (a) {
            var c = this.vars,
                d = c[a],
                f = c[a + "Params"];
            a = c[a + "Scope"] || c.callbackScope || this;
            switch (f ? f.length : 0) {
                case 0:
                    d.call(a);
                    break;
                case 1:
                    d.call(a, f[0]);
                    break;
                case 2:
                    d.call(a, f[0], f[1]);
                    break;
                default:
                    d.apply(a, f);
            }
        };
        w.eventCallback = function (a, c, d, f) {
            if ("on" === (a || "").substr(0, 2)) {
                var g = this.vars;
                if (1 === arguments.length) return g[a];
                null == c ? delete g[a] : ((g[a] = c), (g[a + "Params"] = q(d) && -1 !== d.join("").indexOf("{self}") ? this._swapSelfInParams(d) : d), (g[a + "Scope"] = f));
                "onUpdate" === a && (this._onUpdate = c);
            }
            return this;
        };
        w.delay = function (a) {
            return arguments.length ? (this._timeline.smoothChildTiming && this.startTime(this._startTime + a - this._delay), (this._delay = a), this) : this._delay;
        };
        w.duration = function (a) {
            return arguments.length
                ? ((this._duration = this._totalDuration = a),
                  this._uncache(!0),
                  this._timeline.smoothChildTiming && 0 < this._time && this._time < this._duration && 0 !== a && this.totalTime((a / this._duration) * this._totalTime, !0),
                  this)
                : ((this._dirty = !1), this._duration);
        };
        w.totalDuration = function (a) {
            return (this._dirty = !1), arguments.length ? this.duration(a) : this._totalDuration;
        };
        w.time = function (a, c) {
            return arguments.length ? (this._dirty && this.totalDuration(), this.totalTime(a > this._duration ? this._duration : a, c)) : this._time;
        };
        w.totalTime = function (a, c, d) {
            if ((ia || K.wake(), !arguments.length)) return this._totalTime;
            if (this._timeline) {
                if ((0 > a && !d && (a += this.totalDuration()), this._timeline.smoothChildTiming)) {
                    this._dirty && this.totalDuration();
                    var f = this._totalDuration,
                        g = this._timeline;
                    if ((a > f && !d && (a = f), (this._startTime = (this._paused ? this._pauseTime : g._time) - (this._reversed ? f - a : a) / this._timeScale), g._dirty || this._uncache(!1), g._timeline))
                        for (; g._timeline; ) g._timeline._time !== (g._startTime + g._totalTime) / g._timeScale && g.totalTime(g._totalTime, !0), (g = g._timeline);
                }
                this._gc && this._enabled(!0, !1);
                (this._totalTime !== a || 0 === this._duration) && (Y.length && ka(), this.render(a, c, !1), Y.length && ka());
            }
            return this;
        };
        w.progress = w.totalProgress = function (a, c) {
            var d = this.duration();
            return arguments.length ? this.totalTime(d * a, c) : d ? this._time / d : this.ratio;
        };
        w.startTime = function (a) {
            return arguments.length ? (a !== this._startTime && ((this._startTime = a), this.timeline && this.timeline._sortChildren && this.timeline.add(this, a - this._delay)), this) : this._startTime;
        };
        w.endTime = function (a) {
            return this._startTime + (0 != a ? this.totalDuration() : this.duration()) / this._timeScale;
        };
        w.timeScale = function (a) {
            if (!arguments.length) return this._timeScale;
            if (((a = a || 1e-10), this._timeline && this._timeline.smoothChildTiming)) {
                var c = this._pauseTime;
                c = c || 0 === c ? c : this._timeline.totalTime();
                this._startTime = c - ((c - this._startTime) * this._timeScale) / a;
            }
            return (this._timeScale = a), this._uncache(!1);
        };
        w.reversed = function (a) {
            return arguments.length
                ? (a != this._reversed && ((this._reversed = a), this.totalTime(this._timeline && !this._timeline.smoothChildTiming ? this.totalDuration() - this._totalTime : this._totalTime, !0)), this)
                : this._reversed;
        };
        w.paused = function (a) {
            if (!arguments.length) return this._paused;
            var c,
                d,
                f = this._timeline;
            return (
                a != this._paused &&
                    f &&
                    (ia || a || K.wake(),
                    (c = f.rawTime()),
                    (d = c - this._pauseTime),
                    !a && f.smoothChildTiming && ((this._startTime += d), this._uncache(!1)),
                    (this._pauseTime = a ? c : null),
                    (this._paused = a),
                    (this._active = this.isActive()),
                    !a && 0 !== d && this._initted && this.duration() && ((c = f.smoothChildTiming ? this._totalTime : (c - this._startTime) / this._timeScale), this.render(c, c === this._totalTime, !0))),
                this._gc && !a && this._enabled(!0, !1),
                this
            );
        };
        L = z("core.SimpleTimeline", function (a) {
            R.call(this, 0, a);
            this.autoRemoveChildren = this.smoothChildTiming = !0;
        });
        w = L.prototype = new R();
        w.constructor = L;
        w.kill()._gc = !1;
        w._first = w._last = w._recent = null;
        w._sortChildren = !1;
        w.add = w.insert = function (a, c, d, f) {
            if (
                ((a._startTime = Number(c || 0) + a._delay),
                a._paused && this !== a._timeline && (a._pauseTime = a._startTime + (this.rawTime() - a._startTime) / a._timeScale),
                a.timeline && a.timeline._remove(a, !0),
                (a.timeline = a._timeline = this),
                a._gc && a._enabled(!0, !0),
                (c = this._last),
                this._sortChildren)
            )
                for (d = a._startTime; c && c._startTime > d; ) c = c._prev;
            return c ? ((a._next = c._next), (c._next = a)) : ((a._next = this._first), (this._first = a)), a._next ? (a._next._prev = a) : (this._last = a), (a._prev = c), (this._recent = a), this._timeline && this._uncache(!0), this;
        };
        w._remove = function (a, c) {
            return (
                a.timeline === this &&
                    (c || a._enabled(!1, !0),
                    a._prev ? (a._prev._next = a._next) : this._first === a && (this._first = a._next),
                    a._next ? (a._next._prev = a._prev) : this._last === a && (this._last = a._prev),
                    (a._next = a._prev = a.timeline = null),
                    a === this._recent && (this._recent = this._last),
                    this._timeline && this._uncache(!0)),
                this
            );
        };
        w.render = function (a, c, d) {
            var f = this._first;
            for (this._totalTime = this._time = this._rawPrevTime = a; f; ) {
                var g = f._next;
                (f._active || (a >= f._startTime && !f._paused)) && (f._reversed ? f.render((f._dirty ? f.totalDuration() : f._totalDuration) - (a - f._startTime) * f._timeScale, c, d) : f.render((a - f._startTime) * f._timeScale, c, d));
                f = g;
            }
        };
        w.rawTime = function () {
            return ia || K.wake(), this._totalTime;
        };
        var F = z(
                "TweenLite",
                function (c, d, f) {
                    if ((R.call(this, d, f), (this.render = F.prototype.render), null == c)) throw "Cannot tween a null target.";
                    this.target = c = "string" != typeof c ? c : F.selector(c) || c;
                    var g;
                    var h = c.jquery || (c.length && c !== a && c[0] && (c[0] === a || (c[0].nodeType && c[0].style && !c.nodeType)));
                    f = this.vars.overwrite;
                    if (((this._overwrite = f = null == f ? ya[F.defaultOverwrite] : "number" == typeof f ? f >> 0 : ya[f]), (h || c instanceof Array || (c.push && q(c))) && "number" != typeof c[0]))
                        for (this._targets = g = r(c), this._propLookup = [], this._siblings = [], c = 0; c < g.length; c++)
                            (h = g[c])
                                ? "string" != typeof h
                                    ? h.length && h !== a && h[0] && (h[0] === a || (h[0].nodeType && h[0].style && !h.nodeType))
                                        ? (g.splice(c--, 1), (this._targets = g = g.concat(r(h))))
                                        : ((this._siblings[c] = ua(h, this, !1)), 1 === f && 1 < this._siblings[c].length && Aa(h, this, null, 1, this._siblings[c]))
                                    : ((h = g[c--] = F.selector(h)), "string" == typeof h && g.splice(c + 1, 1))
                                : g.splice(c--, 1);
                    else (this._propLookup = {}), (this._siblings = ua(c, this, !1)), 1 === f && 1 < this._siblings.length && Aa(c, this, null, 1, this._siblings);
                    (this.vars.immediateRender || (0 === d && 0 === this._delay && !1 !== this.vars.immediateRender)) && ((this._time = -1e-10), this.render(Math.min(0, -this._delay)));
                },
                !0
            ),
            X = function (c) {
                return c && c.length && c !== a && c[0] && (c[0] === a || (c[0].nodeType && c[0].style && !c.nodeType));
            };
        w = F.prototype = new R();
        w.constructor = F;
        w.kill()._gc = !1;
        w.ratio = 0;
        w._firstPT = w._targets = w._overwrittenProps = w._startAt = null;
        w._notifyPluginsOfEnabled = w._lazy = !1;
        F.version = "1.19.1";
        F.defaultEase = w._ease = new u(null, null, 1, 1);
        F.defaultOverwrite = "auto";
        F.ticker = K;
        F.autoSleep = 120;
        F.lagSmoothing = function (a, c) {
            K.lagSmoothing(a, c);
        };
        F.selector =
            a.$ ||
            a.jQuery ||
            function (d) {
                var f = a.$ || a.jQuery;
                return f ? ((F.selector = f), f(d)) : "undefined" == typeof c ? d : c.querySelectorAll ? c.querySelectorAll(d) : c.getElementById("#" === d.charAt(0) ? d.substr(1) : d);
            };
        var Y = [],
            oa = {},
            ta = /(?:(-|-=|\+=)?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/gi,
            S = function (a) {
                for (var c, d = this._firstPT; d; )
                    (c = d.blob ? (1 === a ? this.end : a ? this.join("") : this.start) : d.c * a + d.s),
                        d.m ? (c = d.m(c, this._target || d.t)) : 1e-6 > c && -1e-6 < c && !d.blob && (c = 0),
                        d.f ? (d.fp ? d.t[d.p](d.fp, c) : d.t[d.p](c)) : (d.t[d.p] = c),
                        (d = d._next);
            },
            ea = function (a, c, d, f) {
                var g,
                    h = [],
                    k = 0,
                    n = "",
                    q = 0;
                h.start = a;
                h.end = c;
                a = h[0] = a + "";
                c = h[1] = c + "";
                d && (d(h), (a = h[0]), (c = h[1]));
                h.length = 0;
                a = a.match(ta) || [];
                d = c.match(ta) || [];
                f && ((f._next = null), (f.blob = 1), (h._firstPT = h._applyPT = f));
                var l = d.length;
                for (f = 0; l > f; f++) {
                    var p = d[f];
                    var u = c.substr(k, c.indexOf(p, k) - k);
                    n += u || !f ? u : ",";
                    k += u.length;
                    q ? (q = (q + 1) % 5) : "rgba(" === u.substr(-5) && (q = 1);
                    p === a[f] || a.length <= f
                        ? (n += p)
                        : (n && (h.push(n), (n = "")),
                          (g = parseFloat(a[f])),
                          h.push(g),
                          (h._firstPT = {
                              _next: h._firstPT,
                              t: h,
                              p: h.length - 1,
                              s: g,
                              c: ("=" === p.charAt(1) ? parseInt(p.charAt(0) + "1", 10) * parseFloat(p.substr(2)) : parseFloat(p) - g) || 0,
                              f: 0,
                              m: q && 4 > q ? Math.round : 0,
                          }));
                    k += p.length;
                }
                return (n += c.substr(k)), n && h.push(n), (h.setRatio = S), h;
            },
            ba = function (a, c, d, f, g, h, k, n, q) {
                "function" == typeof f && (f = f(q || 0, a));
                var l;
                q = typeof a[c];
                var p = "function" !== q ? "" : c.indexOf("set") || "function" != typeof a["get" + c.substr(3)] ? c : "get" + c.substr(3);
                d = "get" !== d ? d : p ? (k ? a[p](k) : a[p]()) : a[c];
                p = "string" == typeof f && "=" === f.charAt(1);
                a = { t: a, p: c, s: d, f: "function" === q, pg: 0, n: g || c, m: h ? ("function" == typeof h ? h : Math.round) : 0, pr: 0, c: p ? parseInt(f.charAt(0) + "1", 10) * parseFloat(f.substr(2)) : parseFloat(f) - d || 0 };
                return (
                    ("number" != typeof d || ("number" != typeof f && !p)) &&
                        (k || isNaN(d) || (!p && isNaN(f)) || "boolean" == typeof d || "boolean" == typeof f
                            ? ((a.fp = k), (l = ea(d, p ? a.s + a.c : f, n || F.defaultStringFilter, a)), (a = { t: l, p: "setRatio", s: 0, c: 1, f: 2, pg: 0, n: g || c, pr: 0, m: 0 }))
                            : ((a.s = parseFloat(d)), p || (a.c = parseFloat(f) - a.s || 0))),
                    a.c ? ((a._next = this._firstPT) && (a._next._prev = a), (this._firstPT = a), a) : void 0
                );
            };
        h = F._internals = { isArray: q, isSelector: X, lazyTweens: Y, blobDif: ea };
        var ca = (F._plugins = {}),
            Z = (h.tweenLookup = {}),
            da = 0,
            pa = (h.reservedProps = {
                ease: 1,
                delay: 1,
                overwrite: 1,
                onComplete: 1,
                onCompleteParams: 1,
                onCompleteScope: 1,
                useFrames: 1,
                runBackwards: 1,
                startAt: 1,
                onUpdate: 1,
                onUpdateParams: 1,
                onUpdateScope: 1,
                onStart: 1,
                onStartParams: 1,
                onStartScope: 1,
                onReverseComplete: 1,
                onReverseCompleteParams: 1,
                onReverseCompleteScope: 1,
                onRepeat: 1,
                onRepeatParams: 1,
                onRepeatScope: 1,
                easeParams: 1,
                yoyo: 1,
                immediateRender: 1,
                repeat: 1,
                repeatDelay: 1,
                data: 1,
                paused: 1,
                reversed: 1,
                autoCSS: 1,
                lazy: 1,
                onOverwrite: 1,
                callbackScope: 1,
                stringFilter: 1,
                id: 1,
            }),
            ya = { none: 0, all: 1, auto: 2, concurrent: 3, allOnStart: 4, preexisting: 5, true: 1, false: 0 },
            ja = (R._rootFramesTimeline = new L()),
            va = (R._rootTimeline = new L()),
            sa = 30,
            ka = (h.lazyRender = function () {
                var a,
                    c = Y.length;
                for (oa = {}; -1 < --c; ) (a = Y[c]) && !1 !== a._lazy && (a.render(a._lazy[0], a._lazy[1], !0), (a._lazy = !1));
                Y.length = 0;
            });
        va._startTime = K.time;
        ja._startTime = K.frame;
        va._active = ja._active = !0;
        setTimeout(ka, 1);
        R._updateRoot = F.render = function () {
            var a, c;
            if ((Y.length && ka(), va.render((K.time - va._startTime) * va._timeScale, !1, !1), ja.render((K.frame - ja._startTime) * ja._timeScale, !1, !1), Y.length && ka(), K.frame >= sa)) {
                sa = K.frame + (parseInt(F.autoSleep, 10) || 120);
                for (c in Z) {
                    var d = Z[c].tweens;
                    for (a = d.length; -1 < --a; ) d[a]._gc && d.splice(a, 1);
                    0 === d.length && delete Z[c];
                }
                if (((c = va._first), (!c || c._paused) && F.autoSleep && !ja._first && 1 === K._listeners.tick.length)) {
                    for (; c && c._paused; ) c = c._next;
                    c || K.sleep();
                }
            }
        };
        K.addEventListener("tick", R._updateRoot);
        var ua = function (a, c, d) {
                var f,
                    g,
                    h = a._gsTweenID;
                if ((Z[h || (a._gsTweenID = h = "t" + da++)] || (Z[h] = { target: a, tweens: [] }), c && ((f = Z[h].tweens), (f[(g = f.length)] = c), d))) for (; -1 < --g; ) f[g] === c && f.splice(g, 1);
                return Z[h].tweens;
            },
            za = function (a, c, d, f) {
                var g,
                    h,
                    k = a.vars.onOverwrite;
                return k && (g = k(a, c, d, f)), (k = F.onOverwrite), k && (h = k(a, c, d, f)), !1 !== g && !1 !== h;
            },
            Aa = function (a, c, d, f, g) {
                var h, k, n;
                if (1 === f || 4 <= f) {
                    d = g.length;
                    for (h = 0; d > h; h++)
                        if ((n = g[h]) !== c) n._gc || (n._kill(null, a, c) && (k = !0));
                        else if (5 === f) break;
                    return k;
                }
                var q,
                    l = c._startTime + 1e-10,
                    p = [],
                    u = 0,
                    r = 0 === c._duration;
                for (h = g.length; -1 < --h; )
                    (n = g[h]) === c ||
                        n._gc ||
                        n._paused ||
                        (n._timeline !== c._timeline
                            ? ((q = q || Ba(c, 0, r)), 0 === Ba(n, q, r) && (p[u++] = n))
                            : n._startTime <= l && n._startTime + n.totalDuration() / n._timeScale > l && (((r || !n._initted) && 2e-10 >= l - n._startTime) || (p[u++] = n)));
                for (h = u; -1 < --h; ) ((n = p[h]), 2 === f && n._kill(d, a, c) && (k = !0), 2 !== f || (!n._firstPT && n._initted)) && (2 === f || za(n, c)) && n._enabled(!1, !1) && (k = !0);
                return k;
            },
            Ba = function (a, c, d) {
                for (var f = a._timeline, g = f._timeScale, h = a._startTime; f._timeline; ) {
                    if (((h += f._startTime), (g *= f._timeScale), f._paused)) return -100;
                    f = f._timeline;
                }
                return (h /= g), h > c ? h - c : (d && h === c) || (!a._initted && 2e-10 > h - c) ? 1e-10 : (h += a.totalDuration() / a._timeScale / g) > c + 1e-10 ? 0 : h - c - 1e-10;
            };
        w._init = function () {
            var a,
                c,
                d = this.vars,
                f = this._overwrittenProps,
                g = this._duration;
            var h = !!d.immediateRender;
            var k = d.ease;
            if (d.startAt) {
                this._startAt && (this._startAt.render(-1, !0), this._startAt.kill());
                var n = {};
                for (a in d.startAt) n[a] = d.startAt[a];
                if (((n.overwrite = !1), (n.immediateRender = !0), (n.lazy = h && !1 !== d.lazy), (n.startAt = n.delay = null), (this._startAt = F.to(this.target, 0, n)), h))
                    if (0 < this._time) this._startAt = null;
                    else if (0 !== g) return;
            } else if (d.runBackwards && 0 !== g)
                if (this._startAt) this._startAt.render(-1, !0), this._startAt.kill(), (this._startAt = null);
                else {
                    0 !== this._time && (h = !1);
                    n = {};
                    for (a in d) (pa[a] && "autoCSS" !== a) || (n[a] = d[a]);
                    if (((n.overwrite = 0), (n.data = "isFromStart"), (n.lazy = h && !1 !== d.lazy), (n.immediateRender = h), (this._startAt = F.to(this.target, 0, n)), h)) {
                        if (0 === this._time) return;
                    } else this._startAt._init(), this._startAt._enabled(!1), this.vars.immediateRender && (this._startAt = null);
                }
            if (
                ((this._ease = k = k ? (k instanceof u ? k : "function" == typeof k ? new u(k, d.easeParams) : E[k] || F.defaultEase) : F.defaultEase),
                d.easeParams instanceof Array && k.config && (this._ease = k.config.apply(k, d.easeParams)),
                (this._easeType = this._ease._type),
                (this._easePower = this._ease._power),
                (this._firstPT = null),
                this._targets)
            )
                for (h = this._targets.length, a = 0; h > a; a++) this._initProps(this._targets[a], (this._propLookup[a] = {}), this._siblings[a], f ? f[a] : null, a) && (c = !0);
            else c = this._initProps(this.target, this._propLookup, this._siblings, f, 0);
            if ((c && F._onPluginEvent("_onInitAllProps", this), f && (this._firstPT || ("function" != typeof this.target && this._enabled(!1, !1))), d.runBackwards)) for (n = this._firstPT; n; ) (n.s += n.c), (n.c = -n.c), (n = n._next);
            this._onUpdate = d.onUpdate;
            this._initted = !0;
        };
        w._initProps = function (c, d, f, g, h) {
            var k, n, l, p;
            if (null == c) return !1;
            oa[c._gsTweenID] && ka();
            if (!this.vars.css && c.style && c !== a && c.nodeType && ca.css && !1 !== this.vars.autoCSS) {
                var u = this.vars;
                var r = {};
                for (p in u)
                    pa[p] || (p in c && "transform" !== p && "x" !== p && "y" !== p && "width" !== p && "height" !== p && "className" !== p && "border" !== p) || !(!ca[p] || (ca[p] && ca[p]._autoCSS)) || ((r[p] = u[p]), delete u[p]);
                u.css = r;
            }
            for (k in this.vars)
                if (((u = this.vars[k]), pa[k])) u && (u instanceof Array || (u.push && q(u))) && -1 !== u.join("").indexOf("{self}") && (this.vars[k] = this._swapSelfInParams(u, this));
                else if (ca[k] && (l = new ca[k]())._onInitTween(c, this.vars[k], this, h)) {
                    this._firstPT = p = { _next: this._firstPT, t: l, p: "setRatio", s: 0, c: 1, f: 1, n: k, pg: 1, pr: l._priority, m: 0 };
                    for (u = l._overwriteProps.length; -1 < --u; ) d[l._overwriteProps[u]] = this._firstPT;
                    (l._priority || l._onInitAllProps) && (n = !0);
                    (l._onDisable || l._onEnable) && (this._notifyPluginsOfEnabled = !0);
                    p._next && (p._next._prev = p);
                } else d[k] = ba.call(this, c, k, "get", u, k, 0, null, this.vars.stringFilter, h);
            return g && this._kill(g, c)
                ? this._initProps(c, d, f, g, h)
                : 1 < this._overwrite && this._firstPT && 1 < f.length && Aa(c, this, d, this._overwrite, f)
                ? (this._kill(d, c), this._initProps(c, d, f, g, h))
                : (this._firstPT && ((!1 !== this.vars.lazy && this._duration) || (this.vars.lazy && !this._duration)) && (oa[c._gsTweenID] = !0), n);
        };
        w.render = function (a, c, d) {
            var f,
                g,
                h,
                k = this._time,
                n = this._duration;
            var q = this._rawPrevTime;
            if (a >= n - 1e-7 && 0 <= a)
                (this._totalTime = this._time = n),
                    (this.ratio = this._ease._calcEnd ? this._ease.getRatio(1) : 1),
                    this._reversed || ((f = !0), (g = "onComplete"), (d = d || this._timeline.autoRemoveChildren)),
                    0 === n &&
                        (this._initted || !this.vars.lazy || d) &&
                        (this._startTime === this._timeline._duration && (a = 0),
                        (0 > q || (0 >= a && -1e-7 <= a) || (1e-10 === q && "isPause" !== this.data)) && q !== a && ((d = !0), 1e-10 < q && (g = "onReverseComplete")),
                        (this._rawPrevTime = h = !c || a || q === a ? a : 1e-10));
            else if (1e-7 > a)
                (this._totalTime = this._time = 0),
                    (this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0),
                    (0 !== k || (0 === n && 0 < q)) && ((g = "onReverseComplete"), (f = this._reversed)),
                    0 > a && ((this._active = !1), 0 === n && (this._initted || !this.vars.lazy || d) && (0 <= q && (1e-10 !== q || "isPause" !== this.data) && (d = !0), (this._rawPrevTime = h = !c || a || q === a ? a : 1e-10))),
                    this._initted || (d = !0);
            else if (((this._totalTime = this._time = a), this._easeType)) {
                var l = a / n,
                    p = this._easeType,
                    u = this._easePower;
                (1 === p || (3 === p && 0.5 <= l)) && (l = 1 - l);
                3 === p && (l *= 2);
                1 === u ? (l *= l) : 2 === u ? (l *= l * l) : 3 === u ? (l *= l * l * l) : 4 === u && (l *= l * l * l * l);
                1 === p ? (this.ratio = 1 - l) : 2 === p ? (this.ratio = l) : 0.5 > a / n ? (this.ratio = l / 2) : (this.ratio = 1 - l / 2);
            } else this.ratio = this._ease.getRatio(a / n);
            if (this._time !== k || d) {
                if (!this._initted) {
                    if ((this._init(), !this._initted || this._gc)) return;
                    if (!d && this._firstPT && ((!1 !== this.vars.lazy && this._duration) || (this.vars.lazy && !this._duration))) return (this._time = this._totalTime = k), (this._rawPrevTime = q), Y.push(this), void (this._lazy = [a, c]);
                    this._time && !f ? (this.ratio = this._ease.getRatio(this._time / n)) : f && this._ease._calcEnd && (this.ratio = this._ease.getRatio(0 === this._time ? 0 : 1));
                }
                !1 !== this._lazy && (this._lazy = !1);
                this._active || (!this._paused && this._time !== k && 0 <= a && (this._active = !0));
                0 !== k || (this._startAt && (0 <= a ? this._startAt.render(a, c, d) : g || (g = "_dummyGS")), !this.vars.onStart || (0 === this._time && 0 !== n) || (!c && this._callback("onStart")));
                for (q = this._firstPT; q; ) q.f ? q.t[q.p](q.c * this.ratio + q.s) : (q.t[q.p] = q.c * this.ratio + q.s), (q = q._next);
                this._onUpdate && (0 > a && this._startAt && -1e-4 !== a && this._startAt.render(a, c, d), c || ((this._time !== k || f || d) && this._callback("onUpdate")));
                g &&
                    (!this._gc || d) &&
                    (0 > a && this._startAt && !this._onUpdate && -1e-4 !== a && this._startAt.render(a, c, d),
                    f && (this._timeline.autoRemoveChildren && this._enabled(!1, !1), (this._active = !1)),
                    !c && this.vars[g] && this._callback(g),
                    0 === n && 1e-10 === this._rawPrevTime && 1e-10 !== h && (this._rawPrevTime = 0));
            }
        };
        w._kill = function (a, c, d) {
            if (("all" === a && (a = null), null == a && (null == c || c === this.target))) return (this._lazy = !1), this._enabled(!1, !1);
            c = "string" != typeof c ? c || this._targets || this.target : F.selector(c) || c;
            var f,
                g,
                h,
                k,
                n,
                l,
                p = d && this._time && d._startTime === this._startTime && this._timeline === d._timeline;
            if ((q(c) || X(c)) && "number" != typeof c[0]) for (f = c.length; -1 < --f; ) this._kill(a, c[f], d) && (k = !0);
            else {
                if (this._targets)
                    for (f = this._targets.length; -1 < --f; ) {
                        if (c === this._targets[f]) {
                            var u = this._propLookup[f] || {};
                            this._overwrittenProps = this._overwrittenProps || [];
                            var r = (this._overwrittenProps[f] = a ? this._overwrittenProps[f] || {} : "all");
                            break;
                        }
                    }
                else {
                    if (c !== this.target) return !1;
                    u = this._propLookup;
                    r = this._overwrittenProps = a ? this._overwrittenProps || {} : "all";
                }
                if (u) {
                    if (((f = a || u), (n = a !== r && "all" !== r && a !== u && ("object" != typeof a || !a._tempKill)), d && (F.onOverwrite || this.vars.onOverwrite))) {
                        for (g in f) u[g] && (l || (l = []), l.push(g));
                        if ((l || !a) && !za(this, d, c, l)) return !1;
                    }
                    for (g in f)
                        (h = u[g]) &&
                            (p && (h.f ? h.t[h.p](h.s) : (h.t[h.p] = h.s), (k = !0)),
                            h.pg && h.t._kill(f) && (k = !0),
                            (h.pg && 0 !== h.t._overwriteProps.length) || (h._prev ? (h._prev._next = h._next) : h === this._firstPT && (this._firstPT = h._next), h._next && (h._next._prev = h._prev), (h._next = h._prev = null)),
                            delete u[g]),
                            n && (r[g] = 1);
                    !this._firstPT && this._initted && this._enabled(!1, !1);
                }
            }
            return k;
        };
        w.invalidate = function () {
            return (
                this._notifyPluginsOfEnabled && F._onPluginEvent("_onDisable", this),
                (this._firstPT = this._overwrittenProps = this._startAt = this._onUpdate = null),
                (this._notifyPluginsOfEnabled = this._active = this._lazy = !1),
                (this._propLookup = this._targets ? {} : []),
                R.prototype.invalidate.call(this),
                this.vars.immediateRender && ((this._time = -1e-10), this.render(Math.min(0, -this._delay))),
                this
            );
        };
        w._enabled = function (a, c) {
            if ((ia || K.wake(), a && this._gc)) {
                var d,
                    f = this._targets;
                if (f) for (d = f.length; -1 < --d; ) this._siblings[d] = ua(f[d], this, !0);
                else this._siblings = ua(this.target, this, !0);
            }
            return R.prototype._enabled.call(this, a, c), this._notifyPluginsOfEnabled && this._firstPT ? F._onPluginEvent(a ? "_onEnable" : "_onDisable", this) : !1;
        };
        F.to = function (a, c, d) {
            return new F(a, c, d);
        };
        F.from = function (a, c, d) {
            return (d.runBackwards = !0), (d.immediateRender = 0 != d.immediateRender), new F(a, c, d);
        };
        F.fromTo = function (a, c, d, f) {
            return (f.startAt = d), (f.immediateRender = 0 != f.immediateRender && 0 != d.immediateRender), new F(a, c, f);
        };
        F.delayedCall = function (a, c, d, f, g) {
            return new F(c, 0, { delay: a, onComplete: c, onCompleteParams: d, callbackScope: f, onReverseComplete: c, onReverseCompleteParams: d, immediateRender: !1, lazy: !1, useFrames: g, overwrite: 0 });
        };
        F.set = function (a, c) {
            return new F(a, 0, c);
        };
        F.getTweensOf = function (a, c) {
            if (null == a) return [];
            a = "string" != typeof a ? a : F.selector(a) || a;
            var d;
            if ((q(a) || X(a)) && "number" != typeof a[0]) {
                var f = a.length;
                for (d = []; -1 < --f; ) d = d.concat(F.getTweensOf(a[f], c));
                for (f = d.length; -1 < --f; ) for (c = d[f], a = f; -1 < --a; ) c === d[a] && d.splice(f, 1);
            } else for (d = ua(a).concat(), f = d.length; -1 < --f; ) (d[f]._gc || (c && !d[f].isActive())) && d.splice(f, 1);
            return d;
        };
        F.killTweensOf = F.killDelayedCallsTo = function (a, c, d) {
            "object" == typeof c && ((d = c), (c = !1));
            c = F.getTweensOf(a, c);
            for (var f = c.length; -1 < --f; ) c[f]._kill(d, a);
        };
        var la = z(
            "plugins.TweenPlugin",
            function (a, c) {
                this._overwriteProps = (a || "").split(",");
                this._propName = this._overwriteProps[0];
                this._priority = c || 0;
                this._super = la.prototype;
            },
            !0
        );
        if (
            ((w = la.prototype),
            (la.version = "1.19.0"),
            (la.API = 2),
            (w._firstPT = null),
            (w._addTween = ba),
            (w.setRatio = S),
            (w._kill = function (a) {
                var c,
                    d = this._overwriteProps,
                    f = this._firstPT;
                if (null != a[this._propName]) this._overwriteProps = [];
                else for (c = d.length; -1 < --c; ) null != a[d[c]] && d.splice(c, 1);
                for (; f; ) null != a[f.n] && (f._next && (f._next._prev = f._prev), f._prev ? ((f._prev._next = f._next), (f._prev = null)) : this._firstPT === f && (this._firstPT = f._next)), (f = f._next);
                return !1;
            }),
            (w._mod = w._roundProps = function (a) {
                for (var c, d = this._firstPT; d; ) (c = a[this._propName] || (null != d.n && a[d.n.split(this._propName + "_").join("")])) && "function" == typeof c && (2 === d.f ? (d.t._applyPT.m = c) : (d.m = c)), (d = d._next);
            }),
            (F._onPluginEvent = function (a, c) {
                var d,
                    f,
                    g,
                    h,
                    k = c._firstPT;
                if ("_onInitAllProps" === a) {
                    for (; k; ) {
                        var n = k._next;
                        for (f = g; f && f.pr > k.pr; ) f = f._next;
                        (k._prev = f ? f._prev : h) ? (k._prev._next = k) : (g = k);
                        (k._next = f) ? (f._prev = k) : (h = k);
                        k = n;
                    }
                    k = c._firstPT = g;
                }
                for (; k; ) k.pg && "function" == typeof k.t[a] && k.t[a]() && (d = !0), (k = k._next);
                return d;
            }),
            (la.activate = function (a) {
                for (var c = a.length; -1 < --c; ) a[c].API === la.API && (ca[new a[c]()._propName] = a[c]);
                return !0;
            }),
            (C.plugin = function (a) {
                if (!(a && a.propName && a.init && a.API)) throw "illegal plugin definition.";
                var c,
                    d = a.propName,
                    f = a.priority || 0,
                    g = a.overwriteProps,
                    h = { init: "_onInitTween", set: "setRatio", kill: "_kill", round: "_mod", mod: "_mod", initAll: "_onInitAllProps" },
                    k = z(
                        "plugins." + d.charAt(0).toUpperCase() + d.substr(1) + "Plugin",
                        function () {
                            la.call(this, d, f);
                            this._overwriteProps = g || [];
                        },
                        !0 === a.global
                    ),
                    n = (k.prototype = new la(d));
                n.constructor = k;
                k.API = a.API;
                for (c in h) "function" == typeof a[c] && (n[h[c]] = a[c]);
                return (k.version = a.version), la.activate([k]), k;
            }),
            (L = a._gsQueue))
        ) {
            for (h = 0; h < L.length; h++) L[h]();
            for (w in v) v[w].func || a.console.log("GSAP encountered missing dependency: " + w);
        }
        var ia = !1;
    }
})(
    "undefined" != typeof module && module.exports && "undefined" != typeof global ? global : this || window,
    "TweenMax"
); /*
 Flickity PACKAGED v2.2.1
 Touch, responsive, flickable carousels

 Licensed GPLv3 for open source use
 or Flickity Commercial License for commercial use

 https://flickity.metafizzy.co
 Copyright 2015-2019 Metafizzy
*/
!(function (a, d) {
    "function" == typeof define && define.amd
        ? define("jquery-bridget/jquery-bridget", ["jquery"], function (f) {
              return d(a, f);
          })
        : "object" == typeof module && module.exports
        ? (module.exports = d(a, require("jquery")))
        : (a.jQueryBridget = d(a, a.jQuery));
})(window, function (a, d) {
    function f(f, h, k) {
        (k = k || d || a.jQuery) &&
            (h.prototype.option ||
                (h.prototype.option = function (a) {
                    k.isPlainObject(a) && (this.options = k.extend(!0, this.options, a));
                }),
            (k.fn[f] = function (a) {
                return "string" == typeof a
                    ? (function (a, c, d) {
                          var g,
                              h = "$()." + f + '("' + c + '")';
                          return (
                              a.each(function (a, q) {
                                  (a = k.data(q, f)) ? ((q = a[c]) && "_" != c.charAt(0) ? ((a = q.apply(a, d)), (g = void 0 === g ? a : g)) : n(h + " is not a valid method")) : n(f + " not initialized. Cannot call methods, i.e. " + h);
                              }),
                              void 0 !== g ? g : a
                          );
                      })(this, a, g.call(arguments, 1))
                    : ((function (a, c) {
                          a.each(function (a, d) {
                              (a = k.data(d, f)) ? (a.option(c), a._init()) : ((a = new h(d, c)), k.data(d, f, a));
                          });
                      })(this, a),
                      this);
            }),
            c(k));
    }
    function c(a) {
        !a || (a && a.bridget) || (a.bridget = f);
    }
    var g = Array.prototype.slice,
        h = a.console,
        n =
            void 0 === h
                ? function () {}
                : function (a) {
                      h.error(a);
                  };
    return c(d || a.jQuery), f;
});
(function (a, d) {
    "function" == typeof define && define.amd ? define("ev-emitter/ev-emitter", d) : "object" == typeof module && module.exports ? (module.exports = d()) : (a.EvEmitter = d());
})("undefined" != typeof window ? window : this, function () {
    function a() {}
    var d = a.prototype;
    return (
        (d.on = function (a, c) {
            if (a && c) {
                var d = (this._events = this._events || {});
                a = d[a] = d[a] || [];
                return -1 == a.indexOf(c) && a.push(c), this;
            }
        }),
        (d.once = function (a, c) {
            if (a && c) {
                this.on(a, c);
                var d = (this._onceEvents = this._onceEvents || {});
                return ((d[a] = d[a] || {})[c] = !0), this;
            }
        }),
        (d.off = function (a, c) {
            if ((a = this._events && this._events[a]) && a.length) return (c = a.indexOf(c)), -1 != c && a.splice(c, 1), this;
        }),
        (d.emitEvent = function (a, c) {
            var d = this._events && this._events[a];
            if (d && d.length) {
                d = d.slice(0);
                c = c || [];
                for (var f = this._onceEvents && this._onceEvents[a], n = 0; n < d.length; n++) {
                    var l = d[n];
                    f && f[l] && (this.off(a, l), delete f[l]);
                    l.apply(this, c);
                }
                return this;
            }
        }),
        (d.allOff = function () {
            delete this._events;
            delete this._onceEvents;
        }),
        a
    );
});
(function (a, d) {
    "function" == typeof define && define.amd ? define("get-size/get-size", d) : "object" == typeof module && module.exports ? (module.exports = d()) : (a.getSize = d());
})(window, function () {
    function a(a) {
        var c = parseFloat(a);
        return -1 == a.indexOf("%") && !isNaN(c) && c;
    }
    function d(a) {
        a = getComputedStyle(a);
        return a || c("Style returned " + a + ". Are you running this code in a hidden iframe on Firefox? See https://bit.ly/getsizebug1"), a;
    }
    function f(c) {
        if (
            ((function () {
                if (!l) {
                    l = !0;
                    var c = document.createElement("div");
                    c.style.width = "200px";
                    c.style.padding = "1px 2px 3px 4px";
                    c.style.borderStyle = "solid";
                    c.style.borderWidth = "1px 2px 3px 4px";
                    c.style.boxSizing = "border-box";
                    var g = document.body || document.documentElement;
                    g.appendChild(c);
                    var h = d(c);
                    n = 200 == Math.round(a(h.width));
                    f.isBoxSizeOuter = n;
                    g.removeChild(c);
                }
            })(),
            "string" == typeof c && (c = document.querySelector(c)),
            c && "object" == typeof c && c.nodeType)
        ) {
            var k = d(c);
            if ("none" == k.display)
                return (function () {
                    for (var a = { width: 0, height: 0, innerWidth: 0, innerHeight: 0, outerWidth: 0, outerHeight: 0 }, c = 0; c < h; c++) a[g[c]] = 0;
                    return a;
                })();
            var q = {};
            q.width = c.offsetWidth;
            q.height = c.offsetHeight;
            c = q.isBorderBox = "border-box" == k.boxSizing;
            for (var r = 0; r < h; r++) {
                var y = g[r],
                    C = parseFloat(k[y]);
                q[y] = isNaN(C) ? 0 : C;
            }
            r = q.paddingLeft + q.paddingRight;
            y = q.paddingTop + q.paddingBottom;
            C = q.marginLeft + q.marginRight;
            var z = q.marginTop + q.marginBottom,
                p = q.borderLeftWidth + q.borderRightWidth,
                u = q.borderTopWidth + q.borderBottomWidth;
            c = c && n;
            var E = a(k.width);
            !1 !== E && (q.width = E + (c ? 0 : r + p));
            k = a(k.height);
            return !1 !== k && (q.height = k + (c ? 0 : y + u)), (q.innerWidth = q.width - (r + p)), (q.innerHeight = q.height - (y + u)), (q.outerWidth = q.width + C), (q.outerHeight = q.height + z), q;
        }
    }
    var c =
            "undefined" == typeof console
                ? function () {}
                : function (a) {
                      console.error(a);
                  },
        g = "paddingLeft paddingRight paddingTop paddingBottom marginLeft marginRight marginTop marginBottom borderLeftWidth borderRightWidth borderTopWidth borderBottomWidth".split(" "),
        h = g.length,
        n,
        l = !1;
    return f;
});
(function (a, d) {
    "function" == typeof define && define.amd ? define("desandro-matches-selector/matches-selector", d) : "object" == typeof module && module.exports ? (module.exports = d()) : (a.matchesSelector = d());
})(window, function () {
    var a = (function () {
        var a = window.Element.prototype;
        if (a.matches) return "matches";
        if (a.matchesSelector) return "matchesSelector";
        for (var f = ["webkit", "moz", "ms", "o"], c = 0; c < f.length; c++) {
            var g = f[c] + "MatchesSelector";
            if (a[g]) return g;
        }
    })();
    return function (d, f) {
        return d[a](f);
    };
});
(function (a, d) {
    "function" == typeof define && define.amd
        ? define("fizzy-ui-utils/utils", ["desandro-matches-selector/matches-selector"], function (f) {
              return d(a, f);
          })
        : "object" == typeof module && module.exports
        ? (module.exports = d(a, require("desandro-matches-selector")))
        : (a.fizzyUIUtils = d(a, a.matchesSelector));
})(window, function (a, d) {
    var f = {
            extend: function (a, c) {
                for (var d in c) a[d] = c[d];
                return a;
            },
            modulo: function (a, c) {
                return ((a % c) + c) % c;
            },
        },
        c = Array.prototype.slice;
    f.makeArray = function (a) {
        return Array.isArray(a) ? a : null == a ? [] : "object" == typeof a && "number" == typeof a.length ? c.call(a) : [a];
    };
    f.removeFrom = function (a, c) {
        c = a.indexOf(c);
        -1 != c && a.splice(c, 1);
    };
    f.getParent = function (a, c) {
        for (; a.parentNode && a != document.body; ) if (((a = a.parentNode), d(a, c))) return a;
    };
    f.getQueryElement = function (a) {
        return "string" == typeof a ? document.querySelector(a) : a;
    };
    f.handleEvent = function (a) {
        var c = "on" + a.type;
        this[c] && this[c](a);
    };
    f.filterFindElements = function (a, c) {
        a = f.makeArray(a);
        var g = [];
        return (
            a.forEach(function (a) {
                if (a instanceof HTMLElement)
                    if (c) {
                        d(a, c) && g.push(a);
                        a = a.querySelectorAll(c);
                        for (var f = 0; f < a.length; f++) g.push(a[f]);
                    } else g.push(a);
            }),
            g
        );
    };
    f.debounceMethod = function (a, c, d) {
        d = d || 100;
        var f = a.prototype[c],
            g = c + "Timeout";
        a.prototype[c] = function () {
            clearTimeout(this[g]);
            var a = arguments,
                c = this;
            this[g] = setTimeout(function () {
                f.apply(c, a);
                delete c[g];
            }, d);
        };
    };
    f.docReady = function (a) {
        var c = document.readyState;
        "complete" == c || "interactive" == c ? setTimeout(a) : document.addEventListener("DOMContentLoaded", a);
    };
    f.toDashed = function (a) {
        return a
            .replace(/(.)([A-Z])/g, function (a, c, d) {
                return c + "-" + d;
            })
            .toLowerCase();
    };
    var g = a.console;
    return (
        (f.htmlInit = function (c, d) {
            f.docReady(function () {
                var h = f.toDashed(d),
                    n = "data-" + h,
                    k = document.querySelectorAll("[" + n + "]");
                h = document.querySelectorAll(".js-" + h);
                k = f.makeArray(k).concat(f.makeArray(h));
                var q = n + "-options",
                    v = a.jQuery;
                k.forEach(function (a) {
                    var f = a.getAttribute(n) || a.getAttribute(q);
                    try {
                        var h = f && JSON.parse(f);
                    } catch (p) {
                        return void (g && g.error("Error parsing " + n + " on " + a.className + ": " + p));
                    }
                    h = new c(a, h);
                    v && v.data(a, d, h);
                });
            });
        }),
        f
    );
});
(function (a, d) {
    "function" == typeof define && define.amd
        ? define("flickity/js/cell", ["get-size/get-size"], function (f) {
              return d(a, f);
          })
        : "object" == typeof module && module.exports
        ? (module.exports = d(a, require("get-size")))
        : ((a.Flickity = a.Flickity || {}), (a.Flickity.Cell = d(a, a.getSize)));
})(window, function (a, d) {
    function f(a, d) {
        this.element = a;
        this.parent = d;
        this.create();
    }
    a = f.prototype;
    return (
        (a.create = function () {
            this.element.style.position = "absolute";
            this.element.setAttribute("aria-hidden", "true");
            this.shift = this.x = 0;
        }),
        (a.destroy = function () {
            this.unselect();
            this.element.style.position = "";
            this.element.style[this.parent.originSide] = "";
        }),
        (a.getSize = function () {
            this.size = d(this.element);
        }),
        (a.setPosition = function (a) {
            this.x = a;
            this.updateTarget();
            this.renderPosition(a);
        }),
        (a.updateTarget = a.setDefaultTarget = function () {
            this.target = this.x + this.size["left" == this.parent.originSide ? "marginLeft" : "marginRight"] + this.size.width * this.parent.cellAlign;
        }),
        (a.renderPosition = function (a) {
            this.element.style[this.parent.originSide] = this.parent.getPositionValue(a);
        }),
        (a.select = function () {
            this.element.classList.add("is-selected");
            this.element.removeAttribute("aria-hidden");
        }),
        (a.unselect = function () {
            this.element.classList.remove("is-selected");
            this.element.setAttribute("aria-hidden", "true");
        }),
        (a.wrapShift = function (a) {
            this.shift = a;
            this.renderPosition(this.x + this.parent.slideableWidth * a);
        }),
        (a.remove = function () {
            this.element.parentNode.removeChild(this.element);
        }),
        f
    );
});
(function (a, d) {
    "function" == typeof define && define.amd ? define("flickity/js/slide", d) : "object" == typeof module && module.exports ? (module.exports = d()) : ((a.Flickity = a.Flickity || {}), (a.Flickity.Slide = d()));
})(window, function () {
    function a(a) {
        this.parent = a;
        this.isOriginLeft = "left" == a.originSide;
        this.cells = [];
        this.height = this.outerWidth = 0;
    }
    var d = a.prototype;
    return (
        (d.addCell = function (a) {
            if ((this.cells.push(a), (this.outerWidth += a.size.outerWidth), (this.height = Math.max(a.size.outerHeight, this.height)), 1 == this.cells.length))
                (this.x = a.x), (this.firstMargin = a.size[this.isOriginLeft ? "marginLeft" : "marginRight"]);
        }),
        (d.updateTarget = function () {
            var a = this.isOriginLeft ? "marginRight" : "marginLeft",
                c = this.getLastCell();
            this.target = this.x + this.firstMargin + (this.outerWidth - (this.firstMargin + (c ? c.size[a] : 0))) * this.parent.cellAlign;
        }),
        (d.getLastCell = function () {
            return this.cells[this.cells.length - 1];
        }),
        (d.select = function () {
            this.cells.forEach(function (a) {
                a.select();
            });
        }),
        (d.unselect = function () {
            this.cells.forEach(function (a) {
                a.unselect();
            });
        }),
        (d.getCellElements = function () {
            return this.cells.map(function (a) {
                return a.element;
            });
        }),
        a
    );
});
(function (a, d) {
    "function" == typeof define && define.amd
        ? define("flickity/js/animate", ["fizzy-ui-utils/utils"], function (f) {
              return d(a, f);
          })
        : "object" == typeof module && module.exports
        ? (module.exports = d(a, require("fizzy-ui-utils")))
        : ((a.Flickity = a.Flickity || {}), (a.Flickity.animatePrototype = d(a, a.fizzyUIUtils)));
})(window, function (a, d) {
    return {
        startAnimation: function () {
            this.isAnimating || ((this.isAnimating = !0), (this.restingFrames = 0), this.animate());
        },
        animate: function () {
            this.applyDragForce();
            this.applySelectedAttraction();
            var a = this.x;
            if ((this.integratePhysics(), this.positionSlider(), this.settle(a), this.isAnimating)) {
                var c = this;
                requestAnimationFrame(function () {
                    c.animate();
                });
            }
        },
        positionSlider: function () {
            var a = this.x;
            this.options.wrapAround && 1 < this.cells.length && ((a = d.modulo(a, this.slideableWidth)), (a -= this.slideableWidth), this.shiftWrapCells(a));
            this.setTranslateX(a, this.isAnimating);
            this.dispatchScrollEvent();
        },
        setTranslateX: function (a, c) {
            a += this.cursorPosition;
            a = this.options.rightToLeft ? -a : a;
            a = this.getPositionValue(a);
            this.slider.style.transform = c ? "translate3d(" + a + ",0,0)" : "translateX(" + a + ")";
        },
        dispatchScrollEvent: function () {
            var a = this.slides[0];
            a && ((a = -this.x - a.target), this.dispatchEvent("scroll", null, [a / this.slidesWidth, a]));
        },
        positionSliderAtSelected: function () {
            this.cells.length && ((this.x = -this.selectedSlide.target), (this.velocity = 0), this.positionSlider());
        },
        getPositionValue: function (a) {
            return this.options.percentPosition ? 0.01 * Math.round((a / this.size.innerWidth) * 1e4) + "%" : Math.round(a) + "px";
        },
        settle: function (a) {
            this.isPointerDown || Math.round(100 * this.x) != Math.round(100 * a) || this.restingFrames++;
            2 < this.restingFrames && ((this.isAnimating = !1), delete this.isFreeScrolling, this.positionSlider(), this.dispatchEvent("settle", null, [this.selectedIndex]));
        },
        shiftWrapCells: function (a) {
            this._shiftCells(this.beforeShiftCells, this.cursorPosition + a, -1);
            this._shiftCells(this.afterShiftCells, this.size.innerWidth - (a + this.slideableWidth + this.cursorPosition), 1);
        },
        _shiftCells: function (a, c, d) {
            for (var f = 0; f < a.length; f++) {
                var g = a[f];
                g.wrapShift(0 < c ? d : 0);
                c -= g.size.outerWidth;
            }
        },
        _unshiftCells: function (a) {
            if (a && a.length) for (var c = 0; c < a.length; c++) a[c].wrapShift(0);
        },
        integratePhysics: function () {
            this.x += this.velocity;
            this.velocity *= this.getFrictionFactor();
        },
        applyForce: function (a) {
            this.velocity += a;
        },
        getFrictionFactor: function () {
            return 1 - this.options[this.isFreeScrolling ? "freeScrollFriction" : "friction"];
        },
        getRestingPosition: function () {
            return this.x + this.velocity / (1 - this.getFrictionFactor());
        },
        applyDragForce: function () {
            this.isDraggable && this.isPointerDown && this.applyForce(this.dragX - this.x - this.velocity);
        },
        applySelectedAttraction: function () {
            (this.isDraggable && this.isPointerDown) || this.isFreeScrolling || !this.slides.length || this.applyForce((-1 * this.selectedSlide.target - this.x) * this.options.selectedAttraction);
        },
    };
});
(function (a, d) {
    if ("function" == typeof define && define.amd)
        define("flickity/js/flickity", "ev-emitter/ev-emitter get-size/get-size fizzy-ui-utils/utils ./cell ./slide ./animate".split(" "), function (c, f, h, n, l, r) {
            return d(a, c, f, h, n, l, r);
        });
    else if ("object" == typeof module && module.exports) module.exports = d(a, require("ev-emitter"), require("get-size"), require("fizzy-ui-utils"), require("./cell"), require("./slide"), require("./animate"));
    else {
        var f = a.Flickity;
        a.Flickity = d(a, a.EvEmitter, a.getSize, a.fizzyUIUtils, f.Cell, f.Slide, f.animatePrototype);
    }
})(window, function (a, d, f, c, g, h, n) {
    function l(a, d) {
        for (a = c.makeArray(a); a.length; ) d.appendChild(a.shift());
    }
    function r(a, d) {
        var f = c.getQueryElement(a);
        if (f) {
            if (((this.element = f), this.element.flickityGUID)) return (a = C[this.element.flickityGUID]), a.option(d), a;
            k && (this.$element = k(this.element));
            this.options = c.extend({}, this.constructor.defaults);
            this.option(d);
            this._create();
        } else v && v.error("Bad element for Flickity: " + (f || a));
    }
    var k = a.jQuery,
        q = a.getComputedStyle,
        v = a.console,
        y = 0,
        C = {};
    r.defaults = { accessibility: !0, cellAlign: "center", freeScrollFriction: 0.075, friction: 0.28, namespaceJQueryEvents: !0, percentPosition: !0, resize: !0, selectedAttraction: 0.025, setGallerySize: !0 };
    r.createMethods = [];
    var z = r.prototype;
    c.extend(z, d.prototype);
    z._create = function () {
        var c = (this.guid = ++y),
            d;
        for (d in ((this.element.flickityGUID = c),
        ((C[c] = this).selectedIndex = 0),
        (this.restingFrames = 0),
        (this.x = 0),
        (this.velocity = 0),
        (this.originSide = this.options.rightToLeft ? "right" : "left"),
        (this.viewport = document.createElement("div")),
        (this.viewport.className = "flickity-viewport"),
        this._createSlider(),
        (this.options.resize || this.options.watchCSS) && a.addEventListener("resize", this),
        this.options.on))
            this.on(d, this.options.on[d]);
        r.createMethods.forEach(function (a) {
            this[a]();
        }, this);
        this.options.watchCSS ? this.watchCSS() : this.activate();
    };
    z.option = function (a) {
        c.extend(this.options, a);
    };
    z.activate = function () {
        this.isActive ||
            ((this.isActive = !0),
            this.element.classList.add("flickity-enabled"),
            this.options.rightToLeft && this.element.classList.add("flickity-rtl"),
            this.getSize(),
            l(this._filterFindCellElements(this.element.children), this.slider),
            this.viewport.appendChild(this.slider),
            this.element.appendChild(this.viewport),
            this.reloadCells(),
            this.options.accessibility && ((this.element.tabIndex = 0), this.element.addEventListener("keydown", this)),
            this.emitEvent("activate"),
            this.selectInitialIndex(),
            (this.isInitActivated = !0),
            this.dispatchEvent("ready"));
    };
    z._createSlider = function () {
        var a = document.createElement("div");
        a.className = "flickity-slider";
        a.style[this.originSide] = 0;
        this.slider = a;
    };
    z._filterFindCellElements = function (a) {
        return c.filterFindElements(a, this.options.cellSelector);
    };
    z.reloadCells = function () {
        this.cells = this._makeCells(this.slider.children);
        this.positionCells();
        this._getWrapShiftCells();
        this.setGallerySize();
    };
    z._makeCells = function (a) {
        return this._filterFindCellElements(a).map(function (a) {
            return new g(a, this);
        }, this);
    };
    z.getLastCell = function () {
        return this.cells[this.cells.length - 1];
    };
    z.getLastSlide = function () {
        return this.slides[this.slides.length - 1];
    };
    z.positionCells = function () {
        this._sizeCells(this.cells);
        this._positionCells(0);
    };
    z._positionCells = function (a) {
        this.maxCellHeight = ((a = a || 0) && this.maxCellHeight) || 0;
        var c = 0;
        0 < a && ((c = this.cells[a - 1]), (c = c.x + c.size.outerWidth));
        for (var d = this.cells.length; a < d; a++) {
            var f = this.cells[a];
            f.setPosition(c);
            c += f.size.outerWidth;
            this.maxCellHeight = Math.max(f.size.outerHeight, this.maxCellHeight);
        }
        this.slideableWidth = c;
        this.updateSlides();
        this._containSlides();
        this.slidesWidth = d ? this.getLastSlide().target - this.slides[0].target : 0;
    };
    z._sizeCells = function (a) {
        a.forEach(function (a) {
            a.getSize();
        });
    };
    z.updateSlides = function () {
        if (((this.slides = []), this.cells.length)) {
            var a = new h(this);
            this.slides.push(a);
            var c = "left" == this.originSide ? "marginRight" : "marginLeft",
                d = this._getCanCellFit();
            this.cells.forEach(function (f, g) {
                a.cells.length && (d.call(this, g, a.outerWidth - a.firstMargin + (f.size.outerWidth - f.size[c])) || (a.updateTarget(), (a = new h(this)), this.slides.push(a)));
                a.addCell(f);
            }, this);
            a.updateTarget();
            this.updateSelectedSlide();
        }
    };
    z._getCanCellFit = function () {
        var a = this.options.groupCells;
        if (!a)
            return function () {
                return !1;
            };
        if ("number" == typeof a) {
            var c = parseInt(a, 10);
            return function (a) {
                return 0 != a % c;
            };
        }
        var d = (a = "string" == typeof a && a.match(/^(\d+)%$/)) ? parseInt(a[1], 10) / 100 : 1;
        return function (a, c) {
            return c <= (this.size.innerWidth + 1) * d;
        };
    };
    z._init = z.reposition = function () {
        this.positionCells();
        this.positionSliderAtSelected();
    };
    z.getSize = function () {
        this.size = f(this.element);
        this.setCellAlign();
        this.cursorPosition = this.size.innerWidth * this.cellAlign;
    };
    var p = { center: { left: 0.5, right: 0.5 }, left: { left: 0, right: 1 }, right: { right: 0, left: 1 } };
    return (
        (z.setCellAlign = function () {
            var a = p[this.options.cellAlign];
            this.cellAlign = a ? a[this.originSide] : this.options.cellAlign;
        }),
        (z.setGallerySize = function () {
            this.options.setGallerySize && (this.viewport.style.height = (this.options.adaptiveHeight && this.selectedSlide ? this.selectedSlide.height : this.maxCellHeight) + "px");
        }),
        (z._getWrapShiftCells = function () {
            if (this.options.wrapAround) {
                this._unshiftCells(this.beforeShiftCells);
                this._unshiftCells(this.afterShiftCells);
                var a = this.cursorPosition;
                this.beforeShiftCells = this._getGapCells(a, this.cells.length - 1, -1);
                a = this.size.innerWidth - this.cursorPosition;
                this.afterShiftCells = this._getGapCells(a, 0, 1);
            }
        }),
        (z._getGapCells = function (a, c, d) {
            for (var f = []; 0 < a; ) {
                var g = this.cells[c];
                if (!g) break;
                f.push(g);
                c += d;
                a -= g.size.outerWidth;
            }
            return f;
        }),
        (z._containSlides = function () {
            if (this.options.contain && !this.options.wrapAround && this.cells.length) {
                var a = this.options.rightToLeft,
                    c = a ? "marginRight" : "marginLeft";
                a = a ? "marginLeft" : "marginRight";
                var d = this.slideableWidth - this.getLastCell().size[a],
                    f = d < this.size.innerWidth,
                    g = this.cursorPosition + this.cells[0].size[c],
                    h = d - this.size.innerWidth * (1 - this.cellAlign);
                this.slides.forEach(function (a) {
                    f ? (a.target = d * this.cellAlign) : ((a.target = Math.max(a.target, g)), (a.target = Math.min(a.target, h)));
                }, this);
            }
        }),
        (z.dispatchEvent = function (a, c, d) {
            var f = c ? [c].concat(d) : d;
            if ((this.emitEvent(a, f), k && this.$element)) (f = a += this.options.namespaceJQueryEvents ? ".flickity" : ""), c && ((c = k.Event(c)), (c.type = a), (f = c)), this.$element.trigger(f, d);
        }),
        (z.select = function (a, d, f) {
            this.isActive &&
                ((a = parseInt(a, 10)), this._wrapSelect(a), (this.options.wrapAround || d) && (a = c.modulo(a, this.slides.length)), this.slides[a]) &&
                ((d = this.selectedIndex),
                (this.selectedIndex = a),
                this.updateSelectedSlide(),
                f ? this.positionSliderAtSelected() : this.startAnimation(),
                this.options.adaptiveHeight && this.setGallerySize(),
                this.dispatchEvent("select", null, [a]),
                a != d && this.dispatchEvent("change", null, [a]),
                this.dispatchEvent("cellSelect"));
        }),
        (z._wrapSelect = function (a) {
            var d = this.slides.length;
            if (!(this.options.wrapAround && 1 < d)) return a;
            var f = c.modulo(a, d),
                g = Math.abs(f - this.selectedIndex),
                h = Math.abs(f + d - this.selectedIndex);
            f = Math.abs(f - d - this.selectedIndex);
            !this.isDragSelect && h < g ? (a += d) : !this.isDragSelect && f < g && (a -= d);
            0 > a ? (this.x -= this.slideableWidth) : d <= a && (this.x += this.slideableWidth);
        }),
        (z.previous = function (a, c) {
            this.select(this.selectedIndex - 1, a, c);
        }),
        (z.next = function (a, c) {
            this.select(this.selectedIndex + 1, a, c);
        }),
        (z.updateSelectedSlide = function () {
            var a = this.slides[this.selectedIndex];
            a &&
                (this.unselectSelectedSlide(),
                (this.selectedSlide = a).select(),
                (this.selectedCells = a.cells),
                (this.selectedElements = a.getCellElements()),
                (this.selectedCell = a.cells[0]),
                (this.selectedElement = this.selectedElements[0]));
        }),
        (z.unselectSelectedSlide = function () {
            this.selectedSlide && this.selectedSlide.unselect();
        }),
        (z.selectInitialIndex = function () {
            var a = this.options.initialIndex;
            if (this.isInitActivated) this.select(this.selectedIndex, !1, !0);
            else {
                if (a && "string" == typeof a && this.queryCell(a)) return void this.selectCell(a, !1, !0);
                var c = 0;
                a && this.slides[a] && (c = a);
                this.select(c, !1, !0);
            }
        }),
        (z.selectCell = function (a, c, d) {
            if ((a = this.queryCell(a))) (a = this.getCellSlideIndex(a)), this.select(a, c, d);
        }),
        (z.getCellSlideIndex = function (a) {
            for (var c = 0; c < this.slides.length; c++) if (-1 != this.slides[c].cells.indexOf(a)) return c;
        }),
        (z.getCell = function (a) {
            for (var c = 0; c < this.cells.length; c++) {
                var d = this.cells[c];
                if (d.element == a) return d;
            }
        }),
        (z.getCells = function (a) {
            a = c.makeArray(a);
            var d = [];
            return (
                a.forEach(function (a) {
                    (a = this.getCell(a)) && d.push(a);
                }, this),
                d
            );
        }),
        (z.getCellElements = function () {
            return this.cells.map(function (a) {
                return a.element;
            });
        }),
        (z.getParentCell = function (a) {
            return this.getCell(a) || ((a = c.getParent(a, ".flickity-slider > *")), this.getCell(a));
        }),
        (z.getAdjacentCellElements = function (a, d) {
            if (!a) return this.selectedSlide.getCellElements();
            d = void 0 === d ? this.selectedIndex : d;
            var f = this.slides.length;
            if (f <= 1 + 2 * a) return this.getCellElements();
            for (var g = [], h = d - a; h <= d + a; h++) {
                var k = this.options.wrapAround ? c.modulo(h, f) : h;
                (k = this.slides[k]) && (g = g.concat(k.getCellElements()));
            }
            return g;
        }),
        (z.queryCell = function (a) {
            if ("number" == typeof a) return this.cells[a];
            if ("string" == typeof a) {
                if (a.match(/^[#\.]?[\d\/]/)) return;
                a = this.element.querySelector(a);
            }
            return this.getCell(a);
        }),
        (z.uiChange = function () {
            this.emitEvent("uiChange");
        }),
        (z.childUIPointerDown = function (a) {
            "touchstart" != a.type && a.preventDefault();
            this.focus();
        }),
        (z.onresize = function () {
            this.watchCSS();
            this.resize();
        }),
        c.debounceMethod(r, "onresize", 150),
        (z.resize = function () {
            this.isActive &&
                (this.getSize(),
                this.options.wrapAround && (this.x = c.modulo(this.x, this.slideableWidth)),
                this.positionCells(),
                this._getWrapShiftCells(),
                this.setGallerySize(),
                this.emitEvent("resize"),
                this.selectCell(this.selectedElements && this.selectedElements[0], !1, !0));
        }),
        (z.watchCSS = function () {
            this.options.watchCSS && (-1 != q(this.element, ":after").content.indexOf("flickity") ? this.activate() : this.deactivate());
        }),
        (z.onkeydown = function (a) {
            var c = document.activeElement && document.activeElement != this.element;
            this.options.accessibility && !c && (a = r.keyboardHandlers[a.keyCode]) && a.call(this);
        }),
        (r.keyboardHandlers = {
            37: function () {
                var a = this.options.rightToLeft ? "next" : "previous";
                this.uiChange();
                this[a]();
            },
            39: function () {
                var a = this.options.rightToLeft ? "previous" : "next";
                this.uiChange();
                this[a]();
            },
        }),
        (z.focus = function () {
            var c = a.pageYOffset;
            this.element.focus({ preventScroll: !0 });
            a.pageYOffset != c && a.scrollTo(a.pageXOffset, c);
        }),
        (z.deactivate = function () {
            this.isActive &&
                (this.element.classList.remove("flickity-enabled"),
                this.element.classList.remove("flickity-rtl"),
                this.unselectSelectedSlide(),
                this.cells.forEach(function (a) {
                    a.destroy();
                }),
                this.element.removeChild(this.viewport),
                l(this.slider.children, this.element),
                this.options.accessibility && (this.element.removeAttribute("tabIndex"), this.element.removeEventListener("keydown", this)),
                (this.isActive = !1),
                this.emitEvent("deactivate"));
        }),
        (z.destroy = function () {
            this.deactivate();
            a.removeEventListener("resize", this);
            this.allOff();
            this.emitEvent("destroy");
            k && this.$element && k.removeData(this.element, "flickity");
            delete this.element.flickityGUID;
            delete C[this.guid];
        }),
        c.extend(z, n),
        (r.data = function (a) {
            var d = (a = c.getQueryElement(a)) && a.flickityGUID;
            return d && C[d];
        }),
        c.htmlInit(r, "flickity"),
        k && k.bridget && k.bridget("flickity", r),
        (r.setJQuery = function (a) {
            k = a;
        }),
        (r.Cell = g),
        (r.Slide = h),
        r
    );
});
(function (a, d) {
    "function" == typeof define && define.amd
        ? define("unipointer/unipointer", ["ev-emitter/ev-emitter"], function (f) {
              return d(a, f);
          })
        : "object" == typeof module && module.exports
        ? (module.exports = d(a, require("ev-emitter")))
        : (a.Unipointer = d(a, a.EvEmitter));
})(window, function (a, d) {
    function f() {}
    d = f.prototype = Object.create(d.prototype);
    d.bindStartEvent = function (a) {
        this._bindStartEvent(a, !0);
    };
    d.unbindStartEvent = function (a) {
        this._bindStartEvent(a, !1);
    };
    d._bindStartEvent = function (c, d) {
        var f = "mousedown";
        a.PointerEvent ? (f = "pointerdown") : "ontouchstart" in a && (f = "touchstart");
        c[void 0 === d || d ? "addEventListener" : "removeEventListener"](f, this);
    };
    d.handleEvent = function (a) {
        var c = "on" + a.type;
        this[c] && this[c](a);
    };
    d.getTouch = function (a) {
        for (var c = 0; c < a.length; c++) {
            var d = a[c];
            if (d.identifier == this.pointerIdentifier) return d;
        }
    };
    d.onmousedown = function (a) {
        var c = a.button;
        (c && 0 !== c && 1 !== c) || this._pointerDown(a, a);
    };
    d.ontouchstart = function (a) {
        this._pointerDown(a, a.changedTouches[0]);
    };
    d.onpointerdown = function (a) {
        this._pointerDown(a, a);
    };
    d._pointerDown = function (a, c) {
        a.button || this.isPointerDown || ((this.isPointerDown = !0), (this.pointerIdentifier = void 0 !== c.pointerId ? c.pointerId : c.identifier), this.pointerDown(a, c));
    };
    d.pointerDown = function (a, c) {
        this._bindPostStartEvents(a);
        this.emitEvent("pointerDown", [a, c]);
    };
    var c = { mousedown: ["mousemove", "mouseup"], touchstart: ["touchmove", "touchend", "touchcancel"], pointerdown: ["pointermove", "pointerup", "pointercancel"] };
    return (
        (d._bindPostStartEvents = function (d) {
            d &&
                ((d = c[d.type]),
                d.forEach(function (c) {
                    a.addEventListener(c, this);
                }, this),
                (this._boundPointerEvents = d));
        }),
        (d._unbindPostStartEvents = function () {
            this._boundPointerEvents &&
                (this._boundPointerEvents.forEach(function (c) {
                    a.removeEventListener(c, this);
                }, this),
                delete this._boundPointerEvents);
        }),
        (d.onmousemove = function (a) {
            this._pointerMove(a, a);
        }),
        (d.onpointermove = function (a) {
            a.pointerId == this.pointerIdentifier && this._pointerMove(a, a);
        }),
        (d.ontouchmove = function (a) {
            var c = this.getTouch(a.changedTouches);
            c && this._pointerMove(a, c);
        }),
        (d._pointerMove = function (a, c) {
            this.pointerMove(a, c);
        }),
        (d.pointerMove = function (a, c) {
            this.emitEvent("pointerMove", [a, c]);
        }),
        (d.onmouseup = function (a) {
            this._pointerUp(a, a);
        }),
        (d.onpointerup = function (a) {
            a.pointerId == this.pointerIdentifier && this._pointerUp(a, a);
        }),
        (d.ontouchend = function (a) {
            var c = this.getTouch(a.changedTouches);
            c && this._pointerUp(a, c);
        }),
        (d._pointerUp = function (a, c) {
            this._pointerDone();
            this.pointerUp(a, c);
        }),
        (d.pointerUp = function (a, c) {
            this.emitEvent("pointerUp", [a, c]);
        }),
        (d._pointerDone = function () {
            this._pointerReset();
            this._unbindPostStartEvents();
            this.pointerDone();
        }),
        (d._pointerReset = function () {
            this.isPointerDown = !1;
            delete this.pointerIdentifier;
        }),
        (d.pointerDone = function () {}),
        (d.onpointercancel = function (a) {
            a.pointerId == this.pointerIdentifier && this._pointerCancel(a, a);
        }),
        (d.ontouchcancel = function (a) {
            var c = this.getTouch(a.changedTouches);
            c && this._pointerCancel(a, c);
        }),
        (d._pointerCancel = function (a, c) {
            this._pointerDone();
            this.pointerCancel(a, c);
        }),
        (d.pointerCancel = function (a, c) {
            this.emitEvent("pointerCancel", [a, c]);
        }),
        (f.getPointerPoint = function (a) {
            return { x: a.pageX, y: a.pageY };
        }),
        f
    );
});
(function (a, d) {
    "function" == typeof define && define.amd
        ? define("unidragger/unidragger", ["unipointer/unipointer"], function (f) {
              return d(a, f);
          })
        : "object" == typeof module && module.exports
        ? (module.exports = d(a, require("unipointer")))
        : (a.Unidragger = d(a, a.Unipointer));
})(window, function (a, d) {
    function f() {}
    var c = (f.prototype = Object.create(d.prototype));
    c.bindHandles = function () {
        this._bindHandles(!0);
    };
    c.unbindHandles = function () {
        this._bindHandles(!1);
    };
    c._bindHandles = function (c) {
        for (var d = (c = void 0 === c || c) ? "addEventListener" : "removeEventListener", f = c ? this._touchActionValue : "", g = 0; g < this.handles.length; g++) {
            var h = this.handles[g];
            this._bindStartEvent(h, c);
            h[d]("click", this);
            a.PointerEvent && (h.style.touchAction = f);
        }
    };
    c._touchActionValue = "none";
    c.pointerDown = function (a, c) {
        this.okayPointerDown(a) && ((this.pointerDownPointer = c), a.preventDefault(), this.pointerDownBlur(), this._bindPostStartEvents(a), this.emitEvent("pointerDown", [a, c]));
    };
    var g = { TEXTAREA: !0, INPUT: !0, SELECT: !0, OPTION: !0 },
        h = { radio: !0, checkbox: !0, button: !0, submit: !0, image: !0, file: !0 };
    return (
        (c.okayPointerDown = function (a) {
            var c = h[a.target.type];
            a = !g[a.target.nodeName] || c;
            return a || this._pointerReset(), a;
        }),
        (c.pointerDownBlur = function () {
            var a = document.activeElement;
            a && a.blur && a != document.body && a.blur();
        }),
        (c.pointerMove = function (a, c) {
            var d = this._dragPointerMove(a, c);
            this.emitEvent("pointerMove", [a, c, d]);
            this._dragMove(a, c, d);
        }),
        (c._dragPointerMove = function (a, c) {
            var d = { x: c.pageX - this.pointerDownPointer.pageX, y: c.pageY - this.pointerDownPointer.pageY };
            return !this.isDragging && this.hasDragStarted(d) && this._dragStart(a, c), d;
        }),
        (c.hasDragStarted = function (a) {
            return 3 < Math.abs(a.x) || 3 < Math.abs(a.y);
        }),
        (c.pointerUp = function (a, c) {
            this.emitEvent("pointerUp", [a, c]);
            this._dragPointerUp(a, c);
        }),
        (c._dragPointerUp = function (a, c) {
            this.isDragging ? this._dragEnd(a, c) : this._staticClick(a, c);
        }),
        (c._dragStart = function (a, c) {
            this.isPreventingClicks = this.isDragging = !0;
            this.dragStart(a, c);
        }),
        (c.dragStart = function (a, c) {
            this.emitEvent("dragStart", [a, c]);
        }),
        (c._dragMove = function (a, c, d) {
            this.isDragging && this.dragMove(a, c, d);
        }),
        (c.dragMove = function (a, c, d) {
            a.preventDefault();
            this.emitEvent("dragMove", [a, c, d]);
        }),
        (c._dragEnd = function (a, c) {
            this.isDragging = !1;
            setTimeout(
                function () {
                    delete this.isPreventingClicks;
                }.bind(this)
            );
            this.dragEnd(a, c);
        }),
        (c.dragEnd = function (a, c) {
            this.emitEvent("dragEnd", [a, c]);
        }),
        (c.onclick = function (a) {
            this.isPreventingClicks && a.preventDefault();
        }),
        (c._staticClick = function (a, c) {
            (this.isIgnoringMouseUp && "mouseup" == a.type) ||
                (this.staticClick(a, c),
                "mouseup" != a.type &&
                    ((this.isIgnoringMouseUp = !0),
                    setTimeout(
                        function () {
                            delete this.isIgnoringMouseUp;
                        }.bind(this),
                        400
                    )));
        }),
        (c.staticClick = function (a, c) {
            this.emitEvent("staticClick", [a, c]);
        }),
        (f.getPointerPoint = d.getPointerPoint),
        f
    );
});
(function (a, d) {
    "function" == typeof define && define.amd
        ? define("flickity/js/drag", ["./flickity", "unidragger/unidragger", "fizzy-ui-utils/utils"], function (f, c, g) {
              return d(a, f, c, g);
          })
        : "object" == typeof module && module.exports
        ? (module.exports = d(a, require("./flickity"), require("unidragger"), require("fizzy-ui-utils")))
        : (a.Flickity = d(a, a.Flickity, a.Unidragger, a.fizzyUIUtils));
})(window, function (a, d, f, c) {
    c.extend(d.defaults, { draggable: ">1", dragThreshold: 3 });
    d.createMethods.push("_createDrag");
    var g = d.prototype;
    c.extend(g, f.prototype);
    g._touchActionValue = "pan-y";
    var h = "createTouch" in document,
        n = !1;
    g._createDrag = function () {
        this.on("activate", this.onActivateDrag);
        this.on("uiChange", this._uiChangeDrag);
        this.on("deactivate", this.onDeactivateDrag);
        this.on("cellChange", this.updateDraggable);
        h && !n && (a.addEventListener("touchmove", function () {}), (n = !0));
    };
    g.onActivateDrag = function () {
        this.handles = [this.viewport];
        this.bindHandles();
        this.updateDraggable();
    };
    g.onDeactivateDrag = function () {
        this.unbindHandles();
        this.element.classList.remove("is-draggable");
    };
    g.updateDraggable = function () {
        ">1" == this.options.draggable ? (this.isDraggable = 1 < this.slides.length) : (this.isDraggable = this.options.draggable);
        this.isDraggable ? this.element.classList.add("is-draggable") : this.element.classList.remove("is-draggable");
    };
    g.bindDrag = function () {
        this.options.draggable = !0;
        this.updateDraggable();
    };
    g.unbindDrag = function () {
        this.options.draggable = !1;
        this.updateDraggable();
    };
    g._uiChangeDrag = function () {
        delete this.isFreeScrolling;
    };
    g.pointerDown = function (c, d) {
        this.isDraggable
            ? this.okayPointerDown(c) &&
              (this._pointerDownPreventDefault(c),
              this.pointerDownFocus(c),
              document.activeElement != this.element && this.pointerDownBlur(),
              (this.dragX = this.x),
              this.viewport.classList.add("is-pointer-down"),
              (this.pointerDownScroll = { x: a.pageXOffset, y: a.pageYOffset }),
              a.addEventListener("scroll", this),
              this._pointerDownDefault(c, d))
            : this._pointerDownDefault(c, d);
    };
    g._pointerDownDefault = function (a, c) {
        this.pointerDownPointer = { pageX: c.pageX, pageY: c.pageY };
        this._bindPostStartEvents(a);
        this.dispatchEvent("pointerDown", a, [c]);
    };
    var l = { INPUT: !0, TEXTAREA: !0, SELECT: !0 };
    return (
        (g.pointerDownFocus = function (a) {
            l[a.target.nodeName] || this.focus();
        }),
        (g._pointerDownPreventDefault = function (a) {
            var c = "touch" == a.pointerType,
                d = l[a.target.nodeName];
            "touchstart" == a.type || c || d || a.preventDefault();
        }),
        (g.hasDragStarted = function (a) {
            return Math.abs(a.x) > this.options.dragThreshold;
        }),
        (g.pointerUp = function (a, c) {
            delete this.isTouchScrolling;
            this.viewport.classList.remove("is-pointer-down");
            this.dispatchEvent("pointerUp", a, [c]);
            this._dragPointerUp(a, c);
        }),
        (g.pointerDone = function () {
            a.removeEventListener("scroll", this);
            delete this.pointerDownScroll;
        }),
        (g.dragStart = function (c, d) {
            this.isDraggable && ((this.dragStartPosition = this.x), this.startAnimation(), a.removeEventListener("scroll", this), this.dispatchEvent("dragStart", c, [d]));
        }),
        (g.pointerMove = function (a, c) {
            var d = this._dragPointerMove(a, c);
            this.dispatchEvent("pointerMove", a, [c, d]);
            this._dragMove(a, c, d);
        }),
        (g.dragMove = function (a, c, d) {
            if (this.isDraggable) {
                a.preventDefault();
                this.previousDragX = this.dragX;
                var f = this.options.rightToLeft ? -1 : 1;
                this.options.wrapAround && (d.x %= this.slideableWidth);
                f = this.dragStartPosition + d.x * f;
                if (!this.options.wrapAround && this.slides.length) {
                    var g = Math.max(-this.slides[0].target, this.dragStartPosition);
                    f = g < f ? 0.5 * (f + g) : f;
                    g = Math.min(-this.getLastSlide().target, this.dragStartPosition);
                    f = f < g ? 0.5 * (f + g) : f;
                }
                this.dragX = f;
                this.dragMoveTime = new Date();
                this.dispatchEvent("dragMove", a, [c, d]);
            }
        }),
        (g.dragEnd = function (a, c) {
            if (this.isDraggable) {
                this.options.freeScroll && (this.isFreeScrolling = !0);
                var d = this.dragEndRestingSelect();
                if (this.options.freeScroll && !this.options.wrapAround) {
                    var f = this.getRestingPosition();
                    this.isFreeScrolling = -f > this.slides[0].target && -f < this.getLastSlide().target;
                } else this.options.freeScroll || d != this.selectedIndex || (d += this.dragEndBoostSelect());
                delete this.previousDragX;
                this.isDragSelect = this.options.wrapAround;
                this.select(d);
                delete this.isDragSelect;
                this.dispatchEvent("dragEnd", a, [c]);
            }
        }),
        (g.dragEndRestingSelect = function () {
            var a = this.getRestingPosition(),
                c = Math.abs(this.getSlideDistance(-a, this.selectedIndex)),
                d = this._getClosestResting(a, c, 1);
            a = this._getClosestResting(a, c, -1);
            return d.distance < a.distance ? d.index : a.index;
        }),
        (g._getClosestResting = function (a, c, d) {
            for (
                var f = this.selectedIndex,
                    g = 1 / 0,
                    h =
                        this.options.contain && !this.options.wrapAround
                            ? function (a, c) {
                                  return a <= c;
                              }
                            : function (a, c) {
                                  return a < c;
                              };
                h(c, g) && ((f += d), (g = c), null !== (c = this.getSlideDistance(-a, f)));

            )
                c = Math.abs(c);
            return { distance: g, index: f - d };
        }),
        (g.getSlideDistance = function (a, d) {
            var f = this.slides.length,
                g = this.options.wrapAround && 1 < f,
                h = g ? c.modulo(d, f) : d;
            return (h = this.slides[h]) ? a - (h.target + (g ? this.slideableWidth * Math.floor(d / f) : 0)) : null;
        }),
        (g.dragEndBoostSelect = function () {
            if (void 0 === this.previousDragX || !this.dragMoveTime || 100 < new Date() - this.dragMoveTime) return 0;
            var a = this.getSlideDistance(-this.dragX, this.selectedIndex),
                c = this.previousDragX - this.dragX;
            return 0 < a && 0 < c ? 1 : 0 > a && 0 > c ? -1 : 0;
        }),
        (g.staticClick = function (a, c) {
            var d = this.getParentCell(a.target),
                f = d && d.element;
            d = d && this.cells.indexOf(d);
            this.dispatchEvent("staticClick", a, [c, f, d]);
        }),
        (g.onscroll = function () {
            var c = this.pointerDownScroll.y - a.pageYOffset;
            (3 < Math.abs(this.pointerDownScroll.x - a.pageXOffset) || 3 < Math.abs(c)) && this._pointerDone();
        }),
        d
    );
});
(function (a, d) {
    "function" == typeof define && define.amd
        ? define("flickity/js/prev-next-button", ["./flickity", "unipointer/unipointer", "fizzy-ui-utils/utils"], function (f, c, g) {
              return d(a, f, c, g);
          })
        : "object" == typeof module && module.exports
        ? (module.exports = d(a, require("./flickity"), require("unipointer"), require("fizzy-ui-utils")))
        : d(a, a.Flickity, a.Unipointer, a.fizzyUIUtils);
})(window, function (a, d, f, c) {
    function g(a, c) {
        this.direction = a;
        this.parent = c;
        this._create();
    }
    (g.prototype = Object.create(f.prototype))._create = function () {
        this.isEnabled = !0;
        this.isPrevious = -1 == this.direction;
        this.isLeft = this.direction == (this.parent.options.rightToLeft ? 1 : -1);
        var a = (this.element = document.createElement("button"));
        a.className = "flickity-button flickity-prev-next-button";
        a.className += this.isPrevious ? " previous" : " next";
        a.setAttribute("type", "button");
        this.disable();
        a.setAttribute("aria-label", this.isPrevious ? "Previous" : "Next");
        var c = this.createSVG();
        a.appendChild(c);
        this.parent.on("select", this.update.bind(this));
        this.on("pointerDown", this.parent.childUIPointerDown.bind(this.parent));
    };
    g.prototype.activate = function () {
        this.bindStartEvent(this.element);
        this.element.addEventListener("click", this);
        this.parent.element.appendChild(this.element);
    };
    g.prototype.deactivate = function () {
        this.parent.element.removeChild(this.element);
        this.unbindStartEvent(this.element);
        this.element.removeEventListener("click", this);
    };
    g.prototype.createSVG = function () {
        var a = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        a.setAttribute("class", "flickity-button-icon");
        a.setAttribute("viewBox", "0 0 100 100");
        var c = document.createElementNS("http://www.w3.org/2000/svg", "path"),
            d = this.parent.options.arrowShape;
        return (
            c.setAttribute(
                "d",
                "string" != typeof d ? "M " + d.x0 + ",50 L " + d.x1 + "," + (d.y1 + 50) + " L " + d.x2 + "," + (d.y2 + 50) + " L " + d.x3 + ",50  L " + d.x2 + "," + (50 - d.y2) + " L " + d.x1 + "," + (50 - d.y1) + " Z" : d
            ),
            c.setAttribute("class", "arrow"),
            this.isLeft || c.setAttribute("transform", "translate(100, 100) rotate(180) "),
            a.appendChild(c),
            a
        );
    };
    g.prototype.handleEvent = c.handleEvent;
    g.prototype.onclick = function () {
        this.isEnabled && (this.parent.uiChange(), this.parent[this.isPrevious ? "previous" : "next"]());
    };
    g.prototype.enable = function () {
        this.isEnabled || ((this.element.disabled = !1), (this.isEnabled = !0));
    };
    g.prototype.disable = function () {
        this.isEnabled && ((this.element.disabled = !0), (this.isEnabled = !1));
    };
    g.prototype.update = function () {
        var a = this.parent.slides;
        this.parent.options.wrapAround && 1 < a.length ? this.enable() : ((a = a.length ? a.length - 1 : 0), this[this.parent.selectedIndex == (this.isPrevious ? 0 : a) ? "disable" : "enable"]());
    };
    g.prototype.destroy = function () {
        this.deactivate();
        this.allOff();
    };
    c.extend(d.defaults, { prevNextButtons: !0, arrowShape: { x0: 10, x1: 60, y1: 50, x2: 70, y2: 40, x3: 30 } });
    d.createMethods.push("_createPrevNextButtons");
    a = d.prototype;
    return (
        (a._createPrevNextButtons = function () {
            this.options.prevNextButtons && ((this.prevButton = new g(-1, this)), (this.nextButton = new g(1, this)), this.on("activate", this.activatePrevNextButtons));
        }),
        (a.activatePrevNextButtons = function () {
            this.prevButton.activate();
            this.nextButton.activate();
            this.on("deactivate", this.deactivatePrevNextButtons);
        }),
        (a.deactivatePrevNextButtons = function () {
            this.prevButton.deactivate();
            this.nextButton.deactivate();
            this.off("deactivate", this.deactivatePrevNextButtons);
        }),
        (d.PrevNextButton = g),
        d
    );
});
(function (a, d) {
    "function" == typeof define && define.amd
        ? define("flickity/js/page-dots", ["./flickity", "unipointer/unipointer", "fizzy-ui-utils/utils"], function (f, c, g) {
              return d(a, f, c, g);
          })
        : "object" == typeof module && module.exports
        ? (module.exports = d(a, require("./flickity"), require("unipointer"), require("fizzy-ui-utils")))
        : d(a, a.Flickity, a.Unipointer, a.fizzyUIUtils);
})(window, function (a, d, f, c) {
    function g(a) {
        this.parent = a;
        this._create();
    }
    (g.prototype = Object.create(f.prototype))._create = function () {
        this.holder = document.createElement("ol");
        this.holder.className = "flickity-page-dots";
        this.dots = [];
        this.handleClick = this.onClick.bind(this);
        this.on("pointerDown", this.parent.childUIPointerDown.bind(this.parent));
    };
    g.prototype.activate = function () {
        this.setDots();
        this.holder.addEventListener("click", this.handleClick);
        this.bindStartEvent(this.holder);
        this.parent.element.appendChild(this.holder);
    };
    g.prototype.deactivate = function () {
        this.holder.removeEventListener("click", this.handleClick);
        this.unbindStartEvent(this.holder);
        this.parent.element.removeChild(this.holder);
    };
    g.prototype.setDots = function () {
        var a = this.parent.slides.length - this.dots.length;
        0 < a ? this.addDots(a) : 0 > a && this.removeDots(-a);
    };
    g.prototype.addDots = function (a) {
        var c = document.createDocumentFragment(),
            d = [],
            f = this.dots.length;
        for (a = f + a; f < a; f++) {
            var g = document.createElement("li");
            g.className = "dot";
            g.setAttribute("aria-label", "Page dot " + (f + 1));
            c.appendChild(g);
            d.push(g);
        }
        this.holder.appendChild(c);
        this.dots = this.dots.concat(d);
    };
    g.prototype.removeDots = function (a) {
        this.dots.splice(this.dots.length - a, a).forEach(function (a) {
            this.holder.removeChild(a);
        }, this);
    };
    g.prototype.updateSelected = function () {
        this.selectedDot && ((this.selectedDot.className = "dot"), this.selectedDot.removeAttribute("aria-current"));
        this.dots.length && ((this.selectedDot = this.dots[this.parent.selectedIndex]), (this.selectedDot.className = "dot is-selected"), this.selectedDot.setAttribute("aria-current", "step"));
    };
    g.prototype.onTap = g.prototype.onClick = function (a) {
        a = a.target;
        "LI" == a.nodeName && (this.parent.uiChange(), (a = this.dots.indexOf(a)), this.parent.select(a));
    };
    g.prototype.destroy = function () {
        this.deactivate();
        this.allOff();
    };
    d.PageDots = g;
    c.extend(d.defaults, { pageDots: !0 });
    d.createMethods.push("_createPageDots");
    a = d.prototype;
    return (
        (a._createPageDots = function () {
            this.options.pageDots &&
                ((this.pageDots = new g(this)),
                this.on("activate", this.activatePageDots),
                this.on("select", this.updateSelectedPageDots),
                this.on("cellChange", this.updatePageDots),
                this.on("resize", this.updatePageDots),
                this.on("deactivate", this.deactivatePageDots));
        }),
        (a.activatePageDots = function () {
            this.pageDots.activate();
        }),
        (a.updateSelectedPageDots = function () {
            this.pageDots.updateSelected();
        }),
        (a.updatePageDots = function () {
            this.pageDots.setDots();
        }),
        (a.deactivatePageDots = function () {
            this.pageDots.deactivate();
        }),
        (d.PageDots = g),
        d
    );
});
(function (a, d) {
    "function" == typeof define && define.amd
        ? define("flickity/js/player", ["ev-emitter/ev-emitter", "fizzy-ui-utils/utils", "./flickity"], function (a, c, g) {
              return d(a, c, g);
          })
        : "object" == typeof module && module.exports
        ? (module.exports = d(require("ev-emitter"), require("fizzy-ui-utils"), require("./flickity")))
        : d(a.EvEmitter, a.fizzyUIUtils, a.Flickity);
})(window, function (a, d, f) {
    function c(a) {
        this.parent = a;
        this.state = "stopped";
        this.onVisibilityChange = this.visibilityChange.bind(this);
        this.onVisibilityPlay = this.visibilityPlay.bind(this);
    }
    (c.prototype = Object.create(a.prototype)).play = function () {
        "playing" != this.state && (document.hidden ? document.addEventListener("visibilitychange", this.onVisibilityPlay) : ((this.state = "playing"), document.addEventListener("visibilitychange", this.onVisibilityChange), this.tick()));
    };
    c.prototype.tick = function () {
        if ("playing" == this.state) {
            var a = this.parent.options.autoPlay;
            a = "number" == typeof a ? a : 3e3;
            var c = this;
            this.clear();
            this.timeout = setTimeout(function () {
                c.parent.next(!0);
                c.tick();
            }, a);
        }
    };
    c.prototype.stop = function () {
        this.state = "stopped";
        this.clear();
        document.removeEventListener("visibilitychange", this.onVisibilityChange);
    };
    c.prototype.clear = function () {
        clearTimeout(this.timeout);
    };
    c.prototype.pause = function () {
        "playing" == this.state && ((this.state = "paused"), this.clear());
    };
    c.prototype.unpause = function () {
        "paused" == this.state && this.play();
    };
    c.prototype.visibilityChange = function () {
        this[document.hidden ? "pause" : "unpause"]();
    };
    c.prototype.visibilityPlay = function () {
        this.play();
        document.removeEventListener("visibilitychange", this.onVisibilityPlay);
    };
    d.extend(f.defaults, { pauseAutoPlayOnHover: !0 });
    f.createMethods.push("_createPlayer");
    a = f.prototype;
    return (
        (a._createPlayer = function () {
            this.player = new c(this);
            this.on("activate", this.activatePlayer);
            this.on("uiChange", this.stopPlayer);
            this.on("pointerDown", this.stopPlayer);
            this.on("deactivate", this.deactivatePlayer);
        }),
        (a.activatePlayer = function () {
            this.options.autoPlay && (this.player.play(), this.element.addEventListener("mouseenter", this));
        }),
        (a.playPlayer = function () {
            this.player.play();
        }),
        (a.stopPlayer = function () {
            this.player.stop();
        }),
        (a.pausePlayer = function () {
            this.player.pause();
        }),
        (a.unpausePlayer = function () {
            this.player.unpause();
        }),
        (a.deactivatePlayer = function () {
            this.player.stop();
            this.element.removeEventListener("mouseenter", this);
        }),
        (a.onmouseenter = function () {
            this.options.pauseAutoPlayOnHover && (this.player.pause(), this.element.addEventListener("mouseleave", this));
        }),
        (a.onmouseleave = function () {
            this.player.unpause();
            this.element.removeEventListener("mouseleave", this);
        }),
        (f.Player = c),
        f
    );
});
(function (a, d) {
    "function" == typeof define && define.amd
        ? define("flickity/js/add-remove-cell", ["./flickity", "fizzy-ui-utils/utils"], function (f, c) {
              return d(a, f, c);
          })
        : "object" == typeof module && module.exports
        ? (module.exports = d(a, require("./flickity"), require("fizzy-ui-utils")))
        : d(a, a.Flickity, a.fizzyUIUtils);
})(window, function (a, d, f) {
    a = d.prototype;
    return (
        (a.insert = function (a, d) {
            if ((a = this._makeCells(a)) && a.length) {
                var c = this.cells.length;
                d = void 0 === d ? c : d;
                var f = (function (a) {
                        var c = document.createDocumentFragment();
                        return (
                            a.forEach(function (a) {
                                c.appendChild(a.element);
                            }),
                            c
                        );
                    })(a),
                    g = d == c;
                g ? this.slider.appendChild(f) : this.slider.insertBefore(f, this.cells[d].element);
                0 === d ? (this.cells = a.concat(this.cells)) : g ? (this.cells = this.cells.concat(a)) : ((c = this.cells.splice(d, c - d)), (this.cells = this.cells.concat(a).concat(c)));
                this._sizeCells(a);
                this.cellChange(d, !0);
            }
        }),
        (a.append = function (a) {
            this.insert(a, this.cells.length);
        }),
        (a.prepend = function (a) {
            this.insert(a, 0);
        }),
        (a.remove = function (a) {
            if ((a = this.getCells(a)) && a.length) {
                var c = this.cells.length - 1;
                a.forEach(function (a) {
                    a.remove();
                    var d = this.cells.indexOf(a);
                    c = Math.min(d, c);
                    f.removeFrom(this.cells, a);
                }, this);
                this.cellChange(c, !0);
            }
        }),
        (a.cellSizeChange = function (a) {
            if ((a = this.getCell(a))) a.getSize(), (a = this.cells.indexOf(a)), this.cellChange(a);
        }),
        (a.cellChange = function (a, d) {
            var c = this.selectedElement;
            this._positionCells(a);
            this._getWrapShiftCells();
            this.setGallerySize();
            (c = this.getCell(c)) && (this.selectedIndex = this.getCellSlideIndex(c));
            this.selectedIndex = Math.min(this.slides.length - 1, this.selectedIndex);
            this.emitEvent("cellChange", [a]);
            this.select(this.selectedIndex);
            d && this.positionSliderAtSelected();
        }),
        d
    );
});
(function (a, d) {
    "function" == typeof define && define.amd
        ? define("flickity/js/lazyload", ["./flickity", "fizzy-ui-utils/utils"], function (f, c) {
              return d(a, f, c);
          })
        : "object" == typeof module && module.exports
        ? (module.exports = d(a, require("./flickity"), require("fizzy-ui-utils")))
        : d(a, a.Flickity, a.fizzyUIUtils);
})(window, function (a, d, f) {
    function c(a, c) {
        this.img = a;
        this.flickity = c;
        this.load();
    }
    d.createMethods.push("_createLazyload");
    a = d.prototype;
    return (
        (a._createLazyload = function () {
            this.on("select", this.lazyLoad);
        }),
        (a.lazyLoad = function () {
            var a = this.options.lazyLoad;
            if (a) {
                var d = [];
                this.getAdjacentCellElements("number" == typeof a ? a : 0).forEach(function (a) {
                    a: {
                        if ("IMG" == a.nodeName) {
                            var c = a.getAttribute("data-flickity-lazyload"),
                                g = a.getAttribute("data-flickity-lazyload-src"),
                                h = a.getAttribute("data-flickity-lazyload-srcset");
                            if (c || g || h) {
                                a = [a];
                                break a;
                            }
                        }
                        a = a.querySelectorAll("img[data-flickity-lazyload], img[data-flickity-lazyload-src], img[data-flickity-lazyload-srcset]");
                        a = f.makeArray(a);
                    }
                    d = d.concat(a);
                });
                d.forEach(function (a) {
                    new c(a, this);
                }, this);
            }
        }),
        (c.prototype.handleEvent = f.handleEvent),
        (c.prototype.load = function () {
            this.img.addEventListener("load", this);
            this.img.addEventListener("error", this);
            var a = this.img.getAttribute("data-flickity-lazyload") || this.img.getAttribute("data-flickity-lazyload-src"),
                c = this.img.getAttribute("data-flickity-lazyload-srcset");
            this.img.src = a;
            c && this.img.setAttribute("srcset", c);
            this.img.removeAttribute("data-flickity-lazyload");
            this.img.removeAttribute("data-flickity-lazyload-src");
            this.img.removeAttribute("data-flickity-lazyload-srcset");
        }),
        (c.prototype.onload = function (a) {
            this.complete(a, "flickity-lazyloaded");
        }),
        (c.prototype.onerror = function (a) {
            this.complete(a, "flickity-lazyerror");
        }),
        (c.prototype.complete = function (a, c) {
            this.img.removeEventListener("load", this);
            this.img.removeEventListener("error", this);
            var d = this.flickity.getParentCell(this.img);
            d = d && d.element;
            this.flickity.cellSizeChange(d);
            this.img.classList.add(c);
            this.flickity.dispatchEvent("lazyLoad", a, d);
        }),
        (d.LazyLoader = c),
        d
    );
});
(function (a, d) {
    "function" == typeof define && define.amd
        ? define("flickity/js/index", "./flickity ./drag ./prev-next-button ./page-dots ./player ./add-remove-cell ./lazyload".split(" "), d)
        : "object" == typeof module &&
          module.exports &&
          (module.exports = d(require("./flickity"), require("./drag"), require("./prev-next-button"), require("./page-dots"), require("./player"), require("./add-remove-cell"), require("./lazyload")));
})(window, function (a) {
    return a;
});
(function (a, d) {
    "function" == typeof define && define.amd
        ? define("flickity-as-nav-for/as-nav-for", ["flickity/js/index", "fizzy-ui-utils/utils"], d)
        : "object" == typeof module && module.exports
        ? (module.exports = d(require("flickity"), require("fizzy-ui-utils")))
        : (a.Flickity = d(a.Flickity, a.fizzyUIUtils));
})(window, function (a, d) {
    a.createMethods.push("_createAsNavFor");
    var f = a.prototype;
    return (
        (f._createAsNavFor = function () {
            this.on("activate", this.activateAsNavFor);
            this.on("deactivate", this.deactivateAsNavFor);
            this.on("destroy", this.destroyAsNavFor);
            var a = this.options.asNavFor;
            if (a) {
                var d = this;
                setTimeout(function () {
                    d.setNavCompanion(a);
                });
            }
        }),
        (f.setNavCompanion = function (c) {
            c = d.getQueryElement(c);
            if ((c = a.data(c)) && c != this) {
                this.navCompanion = c;
                var f = this;
                this.onNavCompanionSelect = function () {
                    f.navCompanionSelect();
                };
                c.on("select", this.onNavCompanionSelect);
                this.on("staticClick", this.onNavStaticClick);
                this.navCompanionSelect(!0);
            }
        }),
        (f.navCompanionSelect = function (a) {
            var c = this.navCompanion && this.navCompanion.selectedCells;
            if (c) {
                var d = this.navCompanion.cells.indexOf(c[0]);
                c = d + c.length - 1;
                var f = Math.floor((c - d) * this.navCompanion.cellAlign + d);
                (this.selectCell(f, !1, a), this.removeNavSelectedElements(), f >= this.cells.length) ||
                    ((this.navSelectedElements = this.cells.slice(d, 1 + c).map(function (a) {
                        return a.element;
                    })),
                    this.changeNavSelectedClass("add"));
            }
        }),
        (f.changeNavSelectedClass = function (a) {
            this.navSelectedElements.forEach(function (c) {
                c.classList[a]("is-nav-selected");
            });
        }),
        (f.activateAsNavFor = function () {
            this.navCompanionSelect(!0);
        }),
        (f.removeNavSelectedElements = function () {
            this.navSelectedElements && (this.changeNavSelectedClass("remove"), delete this.navSelectedElements);
        }),
        (f.onNavStaticClick = function (a, d, f, n) {
            "number" == typeof n && this.navCompanion.selectCell(n);
        }),
        (f.deactivateAsNavFor = function () {
            this.removeNavSelectedElements();
        }),
        (f.destroyAsNavFor = function () {
            this.navCompanion && (this.navCompanion.off("select", this.onNavCompanionSelect), this.off("staticClick", this.onNavStaticClick), delete this.navCompanion);
        }),
        a
    );
});
(function (a, d) {
    "function" == typeof define && define.amd
        ? define("imagesloaded/imagesloaded", ["ev-emitter/ev-emitter"], function (f) {
              return d(a, f);
          })
        : "object" == typeof module && module.exports
        ? (module.exports = d(a, require("ev-emitter")))
        : (a.imagesLoaded = d(a, a.EvEmitter));
})("undefined" != typeof window ? window : this, function (a, d) {
    function f(a, c) {
        for (var d in c) a[d] = c[d];
        return a;
    }
    function c(a, d, g) {
        if (!(this instanceof c)) return new c(a, d, g);
        var h = a;
        "string" == typeof a && (h = document.querySelectorAll(a));
        h
            ? ((a = h),
              (this.elements = Array.isArray(a) ? a : "object" == typeof a && "number" == typeof a.length ? r.call(a) : [a]),
              (this.options = f({}, this.options)),
              "function" == typeof d ? (g = d) : f(this.options, d),
              g && this.on("always", g),
              this.getImages(),
              n && (this.jqDeferred = new n.Deferred()),
              setTimeout(this.check.bind(this)))
            : l.error("Bad element for imagesLoaded " + (h || a));
    }
    function g(a) {
        this.img = a;
    }
    function h(a, c) {
        this.url = a;
        this.element = c;
        this.img = new Image();
    }
    var n = a.jQuery,
        l = a.console,
        r = Array.prototype.slice;
    (c.prototype = Object.create(d.prototype)).options = {};
    c.prototype.getImages = function () {
        this.images = [];
        this.elements.forEach(this.addElementImages, this);
    };
    c.prototype.addElementImages = function (a) {
        "IMG" == a.nodeName && this.addImage(a);
        !0 === this.options.background && this.addElementBackgroundImages(a);
        var c = a.nodeType;
        if (c && k[c]) {
            var d = a.querySelectorAll("img");
            for (c = 0; c < d.length; c++) this.addImage(d[c]);
            if ("string" == typeof this.options.background) for (a = a.querySelectorAll(this.options.background), c = 0; c < a.length; c++) this.addElementBackgroundImages(a[c]);
        }
    };
    var k = { 1: !0, 9: !0, 11: !0 };
    return (
        (c.prototype.addElementBackgroundImages = function (a) {
            var c = getComputedStyle(a);
            if (c) for (var d = /url\((['"])?(.*?)\1\)/gi, f = d.exec(c.backgroundImage); null !== f; ) (f = f && f[2]) && this.addBackground(f, a), (f = d.exec(c.backgroundImage));
        }),
        (c.prototype.addImage = function (a) {
            a = new g(a);
            this.images.push(a);
        }),
        (c.prototype.addBackground = function (a, c) {
            a = new h(a, c);
            this.images.push(a);
        }),
        (c.prototype.check = function () {
            function a(a, d, f) {
                setTimeout(function () {
                    c.progress(a, d, f);
                });
            }
            var c = this;
            this.progressedCount = 0;
            this.hasAnyBroken = !1;
            this.images.length
                ? this.images.forEach(function (c) {
                      c.once("progress", a);
                      c.check();
                  })
                : this.complete();
        }),
        (c.prototype.progress = function (a, c, d) {
            this.progressedCount++;
            this.hasAnyBroken = this.hasAnyBroken || !a.isLoaded;
            this.emitEvent("progress", [this, a, c]);
            this.jqDeferred && this.jqDeferred.notify && this.jqDeferred.notify(this, a);
            this.progressedCount == this.images.length && this.complete();
            this.options.debug && l && l.log("progress: " + d, a, c);
        }),
        (c.prototype.complete = function () {
            var a = this.hasAnyBroken ? "fail" : "done";
            if (((this.isComplete = !0), this.emitEvent(a, [this]), this.emitEvent("always", [this]), this.jqDeferred)) this.jqDeferred[this.hasAnyBroken ? "reject" : "resolve"](this);
        }),
        ((g.prototype = Object.create(d.prototype)).check = function () {
            this.getIsImageComplete()
                ? this.confirm(0 !== this.img.naturalWidth, "naturalWidth")
                : ((this.proxyImage = new Image()),
                  this.proxyImage.addEventListener("load", this),
                  this.proxyImage.addEventListener("error", this),
                  this.img.addEventListener("load", this),
                  this.img.addEventListener("error", this),
                  (this.proxyImage.src = this.img.src));
        }),
        (g.prototype.getIsImageComplete = function () {
            return this.img.complete && this.img.naturalWidth;
        }),
        (g.prototype.confirm = function (a, c) {
            this.isLoaded = a;
            this.emitEvent("progress", [this, this.img, c]);
        }),
        (g.prototype.handleEvent = function (a) {
            var c = "on" + a.type;
            this[c] && this[c](a);
        }),
        (g.prototype.onload = function () {
            this.confirm(!0, "onload");
            this.unbindEvents();
        }),
        (g.prototype.onerror = function () {
            this.confirm(!1, "onerror");
            this.unbindEvents();
        }),
        (g.prototype.unbindEvents = function () {
            this.proxyImage.removeEventListener("load", this);
            this.proxyImage.removeEventListener("error", this);
            this.img.removeEventListener("load", this);
            this.img.removeEventListener("error", this);
        }),
        ((h.prototype = Object.create(g.prototype)).check = function () {
            this.img.addEventListener("load", this);
            this.img.addEventListener("error", this);
            this.img.src = this.url;
            this.getIsImageComplete() && (this.confirm(0 !== this.img.naturalWidth, "naturalWidth"), this.unbindEvents());
        }),
        (h.prototype.unbindEvents = function () {
            this.img.removeEventListener("load", this);
            this.img.removeEventListener("error", this);
        }),
        (h.prototype.confirm = function (a, c) {
            this.isLoaded = a;
            this.emitEvent("progress", [this, this.element, c]);
        }),
        (c.makeJQueryPlugin = function (d) {
            (d = d || a.jQuery) &&
                ((n = d).fn.imagesLoaded = function (a, d) {
                    return new c(this, a, d).jqDeferred.promise(n(this));
                });
        }),
        c.makeJQueryPlugin(),
        c
    );
});
(function (a, d) {
    "function" == typeof define && define.amd
        ? define(["flickity/js/index", "imagesloaded/imagesloaded"], function (f, c) {
              return d(a, f, c);
          })
        : "object" == typeof module && module.exports
        ? (module.exports = d(a, require("flickity"), require("imagesloaded")))
        : (a.Flickity = d(a, a.Flickity, a.imagesLoaded));
})(window, function (a, d, f) {
    d.createMethods.push("_createImagesLoaded");
    a = d.prototype;
    return (
        (a._createImagesLoaded = function () {
            this.on("activate", this.imagesLoaded);
        }),
        (a.imagesLoaded = function () {
            if (this.options.imagesLoaded) {
                var a = this;
                f(this.slider).on("progress", function (c, d) {
                    c = a.getParentCell(d.img);
                    a.cellSizeChange(c && c.element);
                    a.options.freeScroll || a.positionSliderAtSelected();
                });
            }
        }),
        d
    );
});
var Color = Color || {};
Color = {
    areEqual: function (a, d) {
        for (var f in a) if (!d.hasOwnProperty(f) || a[f] != d[f]) return !1;
        return !0;
    },
    stringToRgb: function (a) {
        return 0 == a.indexOf("#") ? Color.hexToRgb(a) : 0 == a.indexOf("rgb(") ? Color.rgbStringToRgb(a) : null;
    },
    hexToRgb: function (a) {
        a = a.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, function (a, d, f, n) {
            return d + d + f + f + n + n;
        });
        var d = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(a);
        a = parseInt(d[1], 16);
        var f = parseInt(d[2], 16);
        d = parseInt(d[3], 16);
        return { r: a, g: f, b: d };
    },
    rgbToHex: function (a) {
        for (a = ((Math.round(a.r) << 16) + (Math.round(a.g) << 8) + Math.round(a.b)).toString(16); 6 > a.length; ) a = "0" + a;
        return "#" + a;
    },
    rgbToRgbString: function (a) {
        return "rgb(" + Math.round(a.r) + ", " + Math.round(a.g) + ", " + Math.round(a.b) + ")";
    },
    rgbStringToRgb: function (a) {
        a = a.split("rgb(")[1];
        a = a.split(")")[0];
        a = a.split(", ");
        return { r: parseFloat(a[0]), g: parseFloat(a[1]), b: parseFloat(a[2]) };
    },
    rgbToHsv: function (a) {
        var d = a.r,
            f = a.g;
        a = a.b;
        var c = Math.max(d, f, a),
            g = c - Math.min(d, f, a),
            h = c,
            n = c;
        0 != c && ((n = (g / c) * 100), (h = 60 * (d == c ? (f - a) / g : f == c ? 2 + (a - d) / g : 4 + (d - f) / g)), 0 > h && (h += 360));
        return { h: h, s: n, v: (c / 255) * 100 };
    },
    hsvToRgb: function (a) {
        var d = a.h,
            f = a.s;
        a = a.v;
        f /= 100;
        a /= 100;
        if (0 == f) var c = (f = a);
        else {
            d /= 60;
            c = Math.floor(d);
            var g = d - c;
            d = a * (1 - f);
            var h = a * (1 - f * g);
            g = a * (1 - f * (1 - g));
            switch (c) {
                case 0:
                    c = a;
                    f = g;
                    a = d;
                    break;
                case 1:
                    c = h;
                    f = a;
                    a = d;
                    break;
                case 2:
                    c = d;
                    f = a;
                    a = g;
                    break;
                case 3:
                    c = d;
                    f = h;
                    break;
                case 4:
                    c = g;
                    f = d;
                    break;
                default:
                    (c = a), (f = d), (a = h);
            }
        }
        d = Color.bound(255 * c, 0, 255);
        h = Color.bound(255 * f, 0, 255);
        a = Color.bound(255 * a, 0, 255);
        return { r: d, g: h, b: a };
    },
    rgbToXyz: function (a) {
        var d = a.r / 255,
            f = a.g / 255;
        a = a.b / 255;
        d = 0.04045 < d ? Math.pow((d + 0.055) / 1.055, 2.4) : d / 12.92;
        f = 0.04045 < f ? Math.pow((f + 0.055) / 1.055, 2.4) : f / 12.92;
        a = 0.04045 < a ? Math.pow((a + 0.055) / 1.055, 2.4) : a / 12.92;
        d *= 100;
        f *= 100;
        a *= 100;
        return { x: 0.4124 * d + 0.3576 * f + 0.1805 * a, y: 0.2126 * d + 0.7152 * f + 0.0722 * a, z: 0.0193 * d + 0.1192 * f + 0.9505 * a };
    },
    xyzToRgb: function (a) {
        var d = a.x / 100,
            f = a.y / 100,
            c = a.z / 100,
            g = 3.2406 * d + -1.5372 * f + -0.4986 * c;
        a = -0.9689 * d + 1.8758 * f + 0.0415 * c;
        d = 0.0557 * d + -0.204 * f + 1.057 * c;
        g = 0.0031308 < g ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : 12.92 * g;
        a = 0.0031308 < a ? 1.055 * Math.pow(a, 1 / 2.4) - 0.055 : 12.92 * a;
        d = 0.0031308 < d ? 1.055 * Math.pow(d, 1 / 2.4) - 0.055 : 12.92 * d;
        f = Color.bound(255 * g, 0, 255);
        a = Color.bound(255 * a, 0, 255);
        d = Color.bound(255 * d, 0, 255);
        return { r: f, g: a, b: d };
    },
    xyzToCIELab: function (a) {
        var d = a.x / 95.047,
            f = a.y / 100;
        a = a.z / 108.883;
        d = 0.008856 < d ? Math.pow(d, 1 / 3) : 7.787 * d + 16 / 116;
        f = 0.008856 < f ? Math.pow(f, 1 / 3) : 7.787 * f + 16 / 116;
        a = 0.008856 < a ? Math.pow(a, 1 / 3) : 7.787 * a + 16 / 116;
        return { l: 0.008856 < f ? 116 * f - 16 : 903.3 * f, a: 500 * (d - f), b: 200 * (f - a) };
    },
    cieLabToXyz: function (a) {
        var d = (a.l + 16) / 116,
            f = a.a / 500 + d;
        a = d - a.b / 200;
        d = 0.008856 < Math.pow(d, 3) ? Math.pow(d, 3) : (d - 16 / 116) / 7.787;
        f = 0.008856 < Math.pow(f, 3) ? Math.pow(f, 3) : (f - 16 / 116) / 7.787;
        a = 0.008856 < Math.pow(a, 3) ? Math.pow(a, 3) : (a - 16 / 116) / 7.787;
        return { x: 95.047 * f, y: 100 * d, z: 108.883 * a };
    },
    cieLabToCIELCh: function (a) {
        var d = Math.atan2(a.b, a.a);
        d = 0 < d ? (d / Math.PI) * 180 : 360 - (Math.abs(d) / Math.PI) * 180;
        return { l: a.l, c: Math.sqrt(Math.pow(a.a, 2) + Math.pow(a.b, 2)), h: 360 > d ? d : d - 360 };
    },
    cieLChToCIELab: function (a) {
        var d = (Math.PI / 180) * a.h;
        return { l: a.l, a: Math.cos(d) * a.c, b: Math.sin(d) * a.c };
    },
    rgbToCIELCh: function (a) {
        return Color.cieLabToCIELCh(Color.xyzToCIELab(Color.rgbToXyz(a)));
    },
    cieLChToRgb: function (a) {
        return Color.xyzToRgb(Color.cieLabToXyz(Color.cieLChToCIELab(a)));
    },
    rgbToCIELab: function (a) {
        return Color.xyzToCIELab(Color.rgbToXyz(a));
    },
    cieLabToRgb: function (a) {
        return Color.xyzToRgb(Color.cieLabToXyz(a));
    },
    bound: function (a, d, f) {
        return Math.min(f, Math.max(d, a));
    },
};
var Tween = function (a, d, f) {
    this.ease = function (a) {
        return a;
    };
    this.onComplete = function () {};
    this.onUpdate = function () {};
    this.running = null;
    this.prefix = this.units = "";
    this.delay = 0;
    this.begin = {};
    var c = this;
    this.__construct__ = function () {
        this.time = d;
        this.obj = a;
        this.id = Tween.getId();
        Tween.tweens[this.id] = this;
        f.onComplete && ((this.onComplete = f.onComplete), delete f.onComplete);
        f.onUpdate && ((this.onUpdate = f.onUpdate), delete f.onUpdate);
        f.ease && ((this.ease = f.ease), delete f.ease);
        f.delay && ((this.delay = f.delay), delete f.delay);
        for (prop in f) this.begin[prop] = a[prop];
        this.playTimeout = setTimeout(function () {
            c.play();
        }, this.delay);
    };
    this.play = function () {
        Tween.tweens[a] || (Tween.tweens[a] = []);
        Tween.tweens[a].push(this);
        this.endAt = new Date().getTime() + this.time;
        GlobalEvents.addListener(GlobalEvent.RENDER_FRAME, this.mechanism);
    };
    this.stop = function () {
        clearTimeout(c.playTimeout);
        GlobalEvents.removeListener(GlobalEvent.RENDER_FRAME, c.mechanism);
        c.stopped = !0;
    };
    this.mechanism = function () {
        if (c.stopped) return !1;
        var a = c.endAt - new Date().getTime();
        0 >= a ? (c.stop(), c.advanceFrame(1, 1), c.onUpdate(), c.onComplete()) : (c.advanceFrame(c.time - a, c.time), c.onUpdate());
    };
    this.advanceFrame = function (c, d) {
        t = 0 != d ? c / d : 1;
        t = this.ease(t);
        for (prop in f) (b = this.begin[prop]), (e = f[prop]), (m = e - b), (a[prop] = b + m * t);
    };
    this.__construct__();
};
Tween.id = 0;
Tween.tweens = {};
Tween.killTweensOf = function (a) {
    for (var d in Tween.tweens) {
        var f = Tween.tweens[d];
        f.obj == a && f.stop();
    }
};
Tween.getId = function () {
    return ++Tween.id;
};
Ease = {
    linear: function (a) {
        return a;
    },
    easeOut: {
        quad: function (a) {
            return -a * (a - 2);
        },
        cubic: function (a) {
            x = a - 1;
            return x * x * x + 1;
        },
        quart: function (a) {
            --a;
            return 1 - a * a * a * a;
        },
        quint: function (a) {
            x = a - 1;
            return x * x * x * x * x + 1;
        },
        sine: function (a) {
            return Math.sin((Math.PI / 2) * a);
        },
        expo: function (a) {
            return 1 == a ? 1 : 1 - Math.pow(2, -10 * a);
        },
        circ: function (a) {
            return 1 * Math.sqrt(1 - (a = a / 1 - 1) * a);
        },
        bounce: function (a) {
            return (a /= 1) < 1 / 2.75 ? 7.5625 * a * a : a < 2 / 2.75 ? 7.5625 * (a -= 1.5 / 2.75) * a + 0.75 : a < 2.5 / 2.75 ? 7.5625 * (a -= 2.25 / 2.75) * a + 0.9375 : 7.5625 * (a -= 2.625 / 2.75) * a + 0.984375;
        },
        back: function (a, d) {
            void 0 == d && (d = 1.70158);
            return (a = a / 1 - 1) * a * ((d + 1) * a + d) + 1;
        },
        elastic: function (a) {
            return Math.sin((Math.PI / 2) * -13 * (a + 1)) * Math.pow(2, -10 * a) + 1;
        },
    },
    easeIn: {
        quad: function (a) {
            return a * a;
        },
        cubic: function (a) {
            return a * a * a;
        },
        quart: function (a) {
            return a * a * a * a;
        },
        quint: function (a) {
            return a * a * a * a * a;
        },
        sine: function (a) {
            return 1 - Math.cos((Math.PI / 2) * a);
        },
        expo: function (a) {
            return 0 == a ? 0 : Math.pow(2, 10 * (a - 1));
        },
        circ: function (a) {
            return 1 - Math.sqrt(1 - (a /= 1) * a);
        },
        bounce: function (a) {
            a = 1 - a;
            return (a /= 1) < 1 / 2.75 ? 1 - 7.5625 * a * a : a < 2 / 2.75 ? 1 - (7.5625 * (a -= 1.5 / 2.75) * a + 0.75) : a < 2.5 / 2.75 ? 1 - (7.5625 * (a -= 2.25 / 2.75) * a + 0.9375) : 1 - (7.5625 * (a -= 2.625 / 2.75) * a + 0.984375);
        },
        back: function (a, d) {
            void 0 == d && (d = 1.70158);
            return (a /= 1) * a * ((d + 1) * a - d);
        },
        elastic: function (a) {
            return Math.sin((Math.PI / 2) * 13 * a) * Math.pow(2, 10 * (a - 1));
        },
    },
    easeInOut: {
        quad: function (a) {
            return 0.5 > a ? a * a * 2 : 4 * a - 2 * a * a - 1;
        },
        cubic: function (a) {
            a *= 2;
            if (1 > a) return 0.5 * a * a * a;
            a -= 2;
            return 0.5 * a * a * a + 1;
        },
        quart: function (a) {
            a *= 2;
            if (1 > a) return 0.5 * a * a * a * a;
            a -= 2;
            return 1 - 0.5 * a * a * a * a;
        },
        quint: function (a) {
            a *= 2;
            if (1 > a) return 0.5 * a * a * a * a * a;
            a -= 2;
            return 0.5 * a * a * a * a * a + 1;
        },
        sine: function (a) {
            return -0.5 * (Math.cos(Math.PI * a) - 1);
        },
        expo: function (a) {
            return 0 == a || 1 == a ? a : 0.5 > a ? 0.5 * Math.pow(2, 10 * (2 * a - 1)) : 0.5 * (-Math.pow(2, -10 * (a / 0.5 - 1)) + 2);
        },
        circ: function (a) {
            return 1 > (a /= 0.5) ? 0.5 * (1 - Math.sqrt(1 - a * a)) : 0.5 * (Math.sqrt(1 - (a -= 2) * a) + 1);
        },
        bounce: function (a) {
            return 0.5 > a ? 0.5 * Ease.easeIn.bounce(2 * a) : 0.5 * Ease.easeOut.bounce(2 * a - 1) + 0.5;
        },
        back: function (a, d) {
            void 0 == d && (d = 1.70158);
            return 1 > (a /= 0.5) ? 0.5 * a * a * (((d *= 1.525) + 1) * a - d) : 0.5 * ((a -= 2) * a * (((d *= 1.525) + 1) * a + d) + 2);
        },
    },
};
CubicBezier = {
    make: function (a, d, f, c) {
        cx = 3 * a;
        bx = 3 * (f - a) - cx;
        ax = 1 - cx - bx;
        cy = 3 * d;
        by = 3 * (c - d) - cy;
        ay = 1 - cy - by;
        sampleCurveX = function (a) {
            return ((ax * a + bx) * a + cx) * a;
        };
        sampleCurveY = function (a) {
            return ((ay * a + by) * a + cy) * a;
        };
        sampleCurveDerivativeX = function (a) {
            return (3 * ax * a + 2 * bx) * a + cx;
        };
        solveCurveX = function (a, c) {
            var d;
            var f = a;
            for (d = 0; 8 > d; d++) {
                var g = sampleCurveX(f) - a;
                if (Math.abs(g) < c) return f;
                var h = sampleCurveDerivativeX(f);
                if (1e-6 > Math.abs(h)) break;
                f -= g / h;
            }
            h = 0;
            d = 1;
            f = a;
            if (f < h) return h;
            if (f > d) return d;
            for (; h < d; ) {
                g = sampleCurveX(f);
                if (Math.abs(g - a) < c) break;
                a > g ? (h = f) : (d = f);
                f = 0.5 * (d - h) + h;
            }
            return f;
        };
        return function (a) {
            return sampleCurveY(solveCurveX(a, 1e-9));
        };
    },
};
var SimplexNoise = function (a) {
    void 0 == a && (a = Math);
    this.grad3 = [
        [1, 1, 0],
        [-1, 1, 0],
        [1, -1, 0],
        [-1, -1, 0],
        [1, 0, 1],
        [-1, 0, 1],
        [1, 0, -1],
        [-1, 0, -1],
        [0, 1, 1],
        [0, -1, 1],
        [0, 1, -1],
        [0, -1, -1],
    ];
    this.p = [];
    for (var d = 0; 256 > d; d++) this.p[d] = Math.floor(256 * a.random());
    this.perm = [];
    for (d = 0; 512 > d; d++) this.perm[d] = this.p[d & 255];
    this.simplex = [
        [0, 1, 2, 3],
        [0, 1, 3, 2],
        [0, 0, 0, 0],
        [0, 2, 3, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 2, 3, 0],
        [0, 2, 1, 3],
        [0, 0, 0, 0],
        [0, 3, 1, 2],
        [0, 3, 2, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 3, 2, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 2, 0, 3],
        [0, 0, 0, 0],
        [1, 3, 0, 2],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [2, 3, 0, 1],
        [2, 3, 1, 0],
        [1, 0, 2, 3],
        [1, 0, 3, 2],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [2, 0, 3, 1],
        [0, 0, 0, 0],
        [2, 1, 3, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [2, 0, 1, 3],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [3, 0, 1, 2],
        [3, 0, 2, 1],
        [0, 0, 0, 0],
        [3, 1, 2, 0],
        [2, 1, 0, 3],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [3, 1, 0, 2],
        [0, 0, 0, 0],
        [3, 2, 0, 1],
        [3, 2, 1, 0],
    ];
};
SimplexNoise.prototype.dot = function (a, d, f) {
    return a[0] * d + a[1] * f;
};
SimplexNoise.prototype.noise = function (a, d) {
    var f = 0.5 * (a + d) * (Math.sqrt(3) - 1),
        c = Math.floor(a + f),
        g = Math.floor(d + f);
    f = (3 - Math.sqrt(3)) / 6;
    var h = (c + g) * f;
    a -= c - h;
    var n = d - (g - h);
    if (a > n) {
        var l = 1;
        var r = 0;
    } else (l = 0), (r = 1);
    h = a - l + f;
    var k = n - r + f;
    d = a - 1 + 2 * f;
    f = n - 1 + 2 * f;
    var q = c & 255,
        v = g & 255;
    c = this.perm[q + this.perm[v]] % 12;
    g = this.perm[q + l + this.perm[v + r]] % 12;
    l = this.perm[q + 1 + this.perm[v + 1]] % 12;
    r = 0.5 - a * a - n * n;
    0 > r ? (a = 0) : ((r *= r), (a = r * r * this.dot(this.grad3[c], a, n)));
    n = 0.5 - h * h - k * k;
    0 > n ? (h = 0) : ((n *= n), (h = n * n * this.dot(this.grad3[g], h, k)));
    k = 0.5 - d * d - f * f;
    0 > k ? (d = 0) : ((k *= k), (d = k * k * this.dot(this.grad3[l], d, f)));
    return 70 * (a + h + d);
};
SimplexNoise.prototype.noise3d = function (a, d, f) {
    var c = (1 / 3) * (a + d + f),
        g = Math.floor(a + c),
        h = Math.floor(d + c),
        n = Math.floor(f + c);
    c = 1 / 6;
    var l = (g + h + n) * c;
    var r = a - (g - l);
    var k = d - (h - l);
    var q = f - (n - l),
        v,
        y;
    if (r >= k)
        if (k >= q) {
            var C = 1;
            var z = (v = 0);
            var p = (y = 1);
            var u = 0;
        } else r >= q ? ((C = 1), (z = v = 0)) : ((v = C = 0), (z = 1)), (y = 1), (p = 0), (u = 1);
    else k < q ? ((v = C = 0), (z = 1), (y = 0), (u = p = 1)) : r < q ? ((C = 0), (v = 1), (y = z = 0), (u = p = 1)) : ((C = 0), (v = 1), (z = 0), (p = y = 1), (u = 0));
    var E = r - C + c,
        M = k - v + c,
        w = q - z + c;
    l = r - y + 2 * c;
    a = k - p + 2 * c;
    var L = q - u + 2 * c;
    f = r - 1 + 3 * c;
    d = k - 1 + 3 * c;
    c = q - 1 + 3 * c;
    g &= 255;
    var B = h & 255,
        O = n & 255;
    h = this.perm[g + this.perm[B + this.perm[O]]] % 12;
    n = this.perm[g + C + this.perm[B + v + this.perm[O + z]]] % 12;
    y = this.perm[g + y + this.perm[B + p + this.perm[O + u]]] % 12;
    g = this.perm[g + 1 + this.perm[B + 1 + this.perm[O + 1]]] % 12;
    p = 0.6 - r * r - k * k - q * q;
    0 > p ? (r = 0) : ((p *= p), (r = p * p * this.dot(this.grad3[h], r, k, q)));
    k = 0.6 - E * E - M * M - w * w;
    0 > k ? (k = 0) : ((k *= k), (k = k * k * this.dot(this.grad3[n], E, M, w)));
    E = 0.6 - l * l - a * a - L * L;
    0 > E ? (l = 0) : ((E *= E), (l = E * E * this.dot(this.grad3[y], l, a, L)));
    a = 0.6 - f * f - d * d - c * c;
    0 > a ? (f = 0) : ((a *= a), (f = a * a * this.dot(this.grad3[g], f, d, c)));
    return 32 * (r + k + l + f);
};
var SimplexStepper = function (a) {
    new SimplexNoise();
    var d = new SimplexNoise(),
        f = 0,
        c = 0,
        g = 1,
        h,
        n = !1;
    this.__construct__ = function (a) {
        a && (g = a);
    };
    this.advance = function () {
        f++;
        c += 0.5 * g * (d.noise(0, f / 100) + 1);
        n = !1;
    };
    this.getValue = function () {
        n || ((h = 0.5 * (d.noise(1, c / 500) + 1)), (n = !0));
        return h;
    };
    this.__construct__(a);
};
GlobalEvent = function (a, d) {
    this.name = a;
    this.data = d;
};
GlobalEvent.RENDER_FRAME = "global_event_render_frame";
GlobalEvent.WINDOW_RESIZE = "global_event_window_resize";
GlobalEvent.WINDOW_SCROLL = "global_event_window_scroll";
GlobalEvent.WINDOW_LOAD = "global_event_window_load";
GlobalEvents = {
    registry: {},
    dispatch: function (a) {
        this.register(a.name);
        for (var d = this.registry[a.name], f = 0; f < d.length; f++) d[f](a);
    },
    addListener: function (a, d) {
        this.register(a);
        this.registry[a].push(d);
    },
    removeListener: function (a, d) {
        a = this.registry[a];
        if (!a) return !1;
        for (var f = 0; f < a.length; f++) d == a[f] && a.splice(f, 1);
    },
    register: function (a) {
        this.registry[a] || (this.registry[a] = []);
    },
    destroy: function (a) {
        this.registry[a] = !1;
    },
};
var FontCssLoader = FontCssLoader || {};
FontCssLoader = {
    timeoutLength: 1500,
    filesRequested: 0,
    filesLoaded: 0,
    onComplete: void 0,
    init: function (a, d) {
        FontCssLoader.onComplete = d;
        FontCssLoader.filesRequested++;
        a.forEach(function (a) {
            FontCssLoader.filesRequested++;
            var c = document.createElement("link");
            c.type = "text/css";
            c.rel = "stylesheet";
            c.onload = FontCssLoader.handleLoad;
            c.href = a;
            document.body.appendChild(c);
        });
        FontCssLoader.filesRequested--;
        FontCssLoader.checkComplete();
        setTimeout(function () {
            FontCssLoader.showPage();
        }, FontCssLoader.timeoutLength);
    },
    handleLoad: function () {
        FontCssLoader.filesLoaded++;
        FontCssLoader.checkComplete();
    },
    checkComplete: function () {
        FontCssLoader.filesRequested == FontCssLoader.filesLoaded && requestAnimationFrame(FontCssLoader.showPage);
    },
    showPage: function () {
        document.body.style.visibility = "visible";
        FontCssLoader.onComplete && (FontCssLoader.onComplete(), (FontCssLoader.onComplete = void 0));
    },
};
var Site = Site || {};
Site = {
    PageType: { HOME: 0, CASE_DETAIL: 1, STUDIO: 2, CONTACT: 3, JOB_LISTING: 4 },
    init: function () {
        UserAgent.init();
        fastdom.mutate(function () {
            document.body.classList.remove("no-js");
        });
        Site.sizingDiv = document.createElement("div");
        Site.sizingDiv.style.width = "100%";
        Site.sizingDiv.style.height = "100vh";
        Site.sizingDiv.style.position = "absolute";
        var a = document.getElementById("ribbon");
        a.parentElement.insertBefore(Site.sizingDiv, a);
        Site.width = Site.sizingDiv.clientWidth;
        Site.height = Site.sizingDiv.clientHeight;
        addEventListener("resize", function (a) {
            Site.width = Site.sizingDiv.clientWidth;
            Site.height = Site.sizingDiv.clientHeight;
        });
        Site.smoothScroll = new SmoothScroll(document, 90, 9);
        UserAgent.edge ||
            UserAgent.internetExplorer ||
            ((history.scrollRestoration = "manual"),
            (Barba.Pjax.Dom.containerClass = "page-content"),
            (Barba.Pjax.Dom.wrapperId = "wrapper"),
            fastdom.mutate(function () {
                Barba.Pjax.start();
            }),
            (Barba.Pjax.getTransition = function () {
                return Transition;
            }));
    },
    renderEvent: new GlobalEvent(GlobalEvent.RENDER_FRAME),
    windowRender: function () {
        Site.rendering && (requestAnimationFrame(Site.windowRender), GlobalEvents.dispatch(Site.renderEvent));
    },
    startRendering: function (a) {
        Site.rendering || (requestAnimationFrame(Site.windowRender), (Site.rendering = !0));
    },
    stopRendering: function () {
        Site.rendering = !1;
    },
    
    playIntro: function () {
        Menu.logo.style.transition = "opacity 0.5s linear";
        Menu.button.style.transition = "opacity 0.5s linear";
        Ribbon.canvas.style.transition = "opacity 1s linear";
        Menu.logo.style.removeProperty("opacity");
        Menu.button.style.removeProperty("opacity");
        Ribbon.canvas.style.removeProperty("opacity");
        Site.currentPage.playIntro && Site.currentPage.playIntro();
        setTimeout(function () {
            Menu.logo.style.removeProperty("transition");
            Menu.button.style.removeProperty("transition");
            Ribbon.canvas.style.removeProperty("transition");
        }, 1010);
    },
    toggleGrid: function () {
        if (!document.getElementById("responsive-grid")) {
            var a = document.createElement("div");
            a.id = "responsive-grid";
            document.body.appendChild(a);
            for (var d = 0; 12 > d; d++) {
                var f = document.createElement("div");
                f.id = "grid-" + String(d).padStart(2, "0");
                f.className = "grid-column";
                a.appendChild(f);
            }
        }
        a = document.getElementById("responsive-grid");
        if ("visible" == a.style.visibility) return (a.style.visibility = "hidden"), !1;
        a.style.visibility = "visible";
        return !0;
    },
    toggleStats: function () {
        var a = document.createElement("script");
        a.onload = function () {
            var a = new Stats();
            document.body.appendChild(a.dom);
            requestAnimationFrame(function c() {
                a.update();
                requestAnimationFrame(c);
            });
        };
        a.src = "//mrdoob.github.io/stats.js/build/stats.min.js";
        document.head.appendChild(a);
    },
};
var Menu = Menu || {};
Menu = {
    isOpen: !1,
    button: null,
    menu: null,
    modal: null,
    logo: null,
    hireCta: null,
    pageContent: null,
    animation: null,
    menuItems: null,
    init: function () {
        Menu.menu = document.getElementById("menu");
        Menu.menuItems = Array.from(document.getElementById("menu-items").getElementsByTagName("li"));
        Menu.button = document.getElementById("menu-button");
        Menu.modal = document.getElementById("menu-modal");
        Menu.logo = document.getElementById("logo");
        Menu.hireCta = document.getElementById("hire-us");
        Menu.pageContent = document.getElementById("wrapper");
        Menu.selectCurrentSection(Site.currentPage.sectionName);
        fastdom.mutate(function () {
            Menu.setBackground(Color.rgbToRgbString(Ribbon.primaryColor), Color.rgbToRgbString(Ribbon.secondaryColor));
        });
        Menu.button.isArrow = !1;
        Menu.button.onclick = function (a) {
            a.preventDefault();
            Menu.button.isArrow ? Site.smoothScroll.scrollToY(0, !0) : Menu.isOpen ? Menu.close() : Menu.open();
        };
        Menu.button.addEventListener("transitionend", function (a) {
            "transform" == a.propertyName && Menu.button.classList.remove("closing");
        });
        Menu.menu.addEventListener("transitionend", function (a) {
            Menu.menu.classList.contains("closing") && Ribbon.unstraighten();
            Menu.menu.classList.remove("opening");
            Menu.menu.classList.remove("closing");
        });
        Menu.modal.addEventListener("transitionend", function (a) {
            Menu.modal.classList.remove("closing");
        });
        Menu.modal.onclick = function (a) {
            Menu.close();
        };
        Menu.logo.firstElementChild.onclick = Site.logoClicked;
        Menu.menuItems.forEach(function (a) {
            a.classList.contains("dropdown")
                ? (a.firstElementChild.onclick = function (d) {
                      
                        // d.preventDefault();

                      a.classList.toggle("opened");
                      if (a.classList.contains("opened")) {
                          d = a.getElementsByTagName("li");
                          var f = d[0];
                          d = d[d.length - 1].getBoundingClientRect().bottom - f.getBoundingClientRect().top;
                          a.getElementsByTagName("ul")[0].style.height = d + "px";
                      } else a.getElementsByTagName("ul")[0].style.height = "0";
                  })
                : (a.firstElementChild.onclick = function (a) {

                    //   a.preventDefault();
                      
                      Menu.selectCurrentSection(this.parentElement.dataset.section);
                      a.target.href == location.href ? Menu.close() : UserAgent.edge || UserAgent.internetExplorer ? (location.href = a.target.href) : Barba.Pjax.goTo(a.target.href);
                  });
        });
    },
    selectCurrentSection: function (a) {
        Menu.menuItems.forEach(function (d) {
            d.dataset.section == a ? d.classList.add("current") : d.classList.remove("current");
        });
    },
    setBackground: function (a, d) {
        Menu.menu.style.background = a;
        Menu.menu.dataset.midcolor = d;
        Menu.menu.style.setProperty("--selection-color", d);
    },
    open: function () {
        Menu.isOpen = !0;
        Menu.hireCta.classList.add("menu-hidden");
        Menu.pageContent = document.getElementsByClassName("page-content")[0];
        Site.currentPage.menuWillAppear && Site.currentPage.menuWillAppear();
        var a = Color.stringToRgb(Menu.menu.style.background);
        a &&
            fastdom.measure(function () {
                79 < Color.rgbToCIELab(a).l
                    ? fastdom.mutate(function () {
                          Menu.menu.classList.add("reversed");
                          Menu.button.classList.add("reversed");
                      })
                    : fastdom.mutate(function () {
                          Menu.menu.classList.remove("reversed");
                          Menu.button.classList.remove("reversed");
                      });
            });
        fastdom.mutate(function () {
            Menu.pageContent.style.transformOrigin = "center " + (pageYOffset + Site.height / 2) + "px";
            Menu.button.classList.add("opened");
            Menu.button.classList.remove("closing");
        });
        Site.smoothScroll.disableScrolling();
        Menu.animateMenu(0, 1);
        Menu.logo.firstElementChild.onclick = function (a) {
            a.preventDefault();
            Menu.close();
        };
    },
    close: function (a) {
        Menu.isOpen = !1;
        Menu.hireCta.classList.remove("menu-hidden");
        Menu.animateMenu(
            1,
            0,
            function () {
                Site.smoothScroll.enableScrolling();
                Site.currentPage.menuDidDisappear && Site.currentPage.menuDidDisappear();
            },
            a
        );
        Menu.button.classList.remove("opened");
        Menu.button.classList.add("closing");
        Menu.logo.firstElementChild.onclick = Site.logoClicked;
    },
    showArrow: function () {
        Menu.button.isArrow ||
            ((Menu.button.isArrow = !0),
            Menu.button.classList.add("arrow-transition-in"),
            Menu.button.classList.remove("arrow-transition-out"),
            Menu.arrowHidingTimeout && (clearTimeout(Menu.arrowHidingTimeout), (Menu.arrowHidingTimeout = null)));
    },
    arrowHidingTimeout: void 0,
    hideArrow: function () {
        Menu.button.isArrow &&
            ((Menu.button.isArrow = !1),
            Menu.button.classList.remove("arrow-transition-in"),
            Menu.button.classList.add("arrow-transition-out"),
            (Menu.arrowHidingTimeout = setTimeout(function () {
                Menu.button.classList.remove("arrow-transition-out");
                Menu.arrowHidingTimeout = void 0;
            }, 500)));
    },
    showDarkButtonStyle: function () {
        Menu.button.classList.remove("light");
    },
    showLightButtonStyle: function () {
        Menu.button.classList.add("light");
    },
    animateMenu: function (a, d, f, c) {
        var g = RibbonHomeMode.widthForBreakpoint(Ribbon.breakpoint) * RibbonHomeMode.activeScaleForBreakpoint(Ribbon.breakpoint) * 0.75,
            h = Menu.widthForBreakpoint(Ribbon.breakpoint),
            n = a,
            l = CubicBezier.make(0.25, 0, 0.35, 1),
            r = CubicBezier.make(0.65, 0, 0.65, 1);
        CubicBezier.make(0.43, 0, 0.05, 1);
        var k = Color.stringToRgb(Menu.menu.dataset.midcolor),
            q = 0.625 > a,
            v = !q && c;
        Menu.button.classList.add("animating");
        Menu.animation && ((n = Menu.animation.obj.value), Menu.animation.stop());
        var y = { value: n };
        Menu.animation = new Tween(y, 1e3 * Math.abs(d - n), {
            value: d,
            ease: Ease.linear,
            onUpdate: function (a) {
                if (0.625 > y.value)
                    c && !q && (c(), (c = null)),
                        (Ribbon.canvas.style.visibility = "visible"),
                        (Menu.menu.style.display = "none"),
                        (Menu.modal.style.display = "none"),
                        v || ((a = l(y.value / 0.625)), Ribbon.straighten(a)),
                        Menu.pageContent.style.removeProperty("transform"),
                        Menu.logo.style.removeProperty("transform");
                else {
                    Ribbon.canvas.style.visibility = "hidden";
                    Menu.menu.style.display = "block";
                    Menu.modal.style.display = "block";
                    a = (y.value - 0.625) / 0.375;
                    var d = r(a);
                    Menu.menu.style.transform = "translate(" + (h - (g + (h - g) * d)) + "px, 0)";
                    Menu.modal.style.backgroundColor = "rgba(255, 255, 255, " + 0.8 * a + ")";
                    a = 1 - 0.05 * Ease.easeInOut.cubic(a);
                    Menu.pageContent.style.transform = "scale(" + a + ", " + a + ")";
                    Menu.logo.style.transform = "scale(" + a + ", " + a + ")";
                }
                Menu.button.classList.contains("reversed")
                    ? Menu.button.style.removeProperty("--button-color")
                    : ((a = Math.min(Math.max((y.value - 0.25) / 0.5, 0), 1)),
                      0.35 > a
                          ? ((a /= 0.35), Menu.button.style.setProperty("--button-color", "rgb(" + (27 + Math.round((k.r - 27) * a)) + ", " + (27 + Math.round((k.g - 27) * a)) + ", " + (27 + Math.round((k.b - 27) * a)) + ")"))
                          : ((a = (a - 0.35) / 0.65),
                            Menu.button.style.setProperty("--button-color", "rgb(" + (k.r + Math.round((255 - k.r) * a)) + ", " + (k.g + Math.round((255 - k.g) * a)) + ", " + (k.b + Math.round((255 - k.b) * a)) + ")")));
            },
            onComplete: function (a) {
                Menu.animation = null;
                Menu.menu.style.transform = "";
                Menu.button.classList.remove("animating");
                f && f();
            },
        });
    },
    widthForBreakpoint: function (a) {
        switch (a) {
            case BreakPoints.MajorBreakPoints.A:
                return 0.88 * Site.width;
            case BreakPoints.MajorBreakPoints.B:
                return 0.64 * Site.width;
            case BreakPoints.MajorBreakPoints.C:
                return 0.54 * Site.width;
            default:
                return 800;
        }
    },
};
var BreakPoints = BreakPoints || {};
BreakPoints = {
    MajorBreakPoints: { A: 0, B: 1, C: 2, D: 3 },
    currentMajorBreakPoint: function () {
        return 580 >= innerWidth ? BreakPoints.MajorBreakPoints.A : 768 >= innerWidth ? BreakPoints.MajorBreakPoints.B : 1280 >= innerWidth ? BreakPoints.MajorBreakPoints.C : BreakPoints.MajorBreakPoints.D;
    },
};
UserAgent = {
    internetExplorer: !1,
    edge: !1,
    iOS: !1,
    android: !1,
    string: "",
    init: function () {
        UserAgent.string = window.navigator.userAgent;
        var a = UserAgent.string;
        UserAgent.iOS = a.match(/iPhone|iPad|iPod/i);
        UserAgent.iOS || ((UserAgent.android = a.match(/Android/i)), UserAgent.android || ((UserAgent.edge = 0 < a.indexOf("Edge/")), UserAgent.edge || (UserAgent.internetExplorer = 0 < a.indexOf("Trident/") || 0 < a.indexOf("MSIE "))));
    },
};
var SmoothScroll = function (a, d, f) {
    function c(c) {
        c.preventDefault();
        if (!p) {
            if (h.paginate && (q || (q = new Lethargy()), !q.check(c))) {
                v && clearTimeout(v);
                v = setTimeout(function () {
                    q = null;
                }, 100);
                return;
            }
            c = c.detail ? (c.wheelDelta ? (-c.wheelDelta / c.detail / 40) * (0 < c.detail ? 1 : -1) : c.detail / 3) : -c.wheelDelta / 120;
            r += (c * d) / (h.paginate ? 3 : 1);
            r = Math.max(0, Math.min(r, a.scrollHeight - a.clientHeight));
            c = Site.height * h.paginateModifier;
            k = 0 < r - pageYOffset ? Math.ceil(r / c) * c : Math.floor(r / c) * c;
            l || g();
        }
    }
    function g(a) {
        a || (l = !0);
        if (l) {
            a = n;
            var c = (r - a) / f;
            h.paginate && ((c = (k - a) / f), (r = 1 < Math.abs(c) ? a + 1.01 * c : k));
            n = c = a + c;
            scrollTo(0, c);
            Math.abs(c - a) > 0.25 / f
                ? w(g)
                : (h.paginate && (r = k),
                  (n = r),
                  scrollTo(0, r),
                  (l = !1),
                  v && clearTimeout(v),
                  (v = setTimeout(function () {
                      q = null;
                  }, 100)));
        }
    }
    var h = this;
    h.paginate = !1;
    h.paginateModifier = 1;
    a == document && (a = document.documentElement || document.body.parentNode || document.body);
    var n = 0,
        l = !1,
        r = pageYOffset,
        k = 0,
        q,
        v,
        y,
        C = 0,
        z = 0,
        p,
        u;
    h.scrollToY = function (a, c) {
        var d = Site.height * h.paginateModifier;
        c ? ((r = a), (k = Math.round(a / d) * d), l || g()) : ((r = n = a), (k = Math.round(a / d) * d), scrollTo(0, a));
    };
    h.reset = function () {
        k = r = n = pageYOffset;
    };
    var E = function (a) {
        if ({ 37: 1, 38: 1, 39: 1, 40: 1, 32: 1, 33: 1, 34: 1, 35: 1, 36: 1 }[a.keyCode]) return (a = a || window.event), a.preventDefault && a.preventDefault(), (a.returnValue = !1);
    };
    h.enableScrolling = function () {
        p && ((document.onkeydown = null), bodyScrollLock.enableBodyScroll(Menu.menu), (p = !1));
    };
    h.disableScrolling = function () {
        p || (bodyScrollLock.disableBodyScroll(Menu.menu), (document.onkeydown = E), (p = !0));
    };
    var M = debounce(function () {
            if (h.paginate && !u) {
                var a = Site.height * h.paginateModifier;
                n = pageYOffset;
                k = Math.round(pageYOffset / a) * a;
                l || g();
            }
        }, 250),
        w = (function () {
            return (
                window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function (a) {
                    window.setTimeout(a, 20);
                }
            );
        })();
    a.addEventListener("mousewheel", c, { capture: !1, passive: !1 });
    a.addEventListener("DOMMouseScroll", c, { capture: !1, passive: !1 });
    a.addEventListener(
        "touchstart",
        function (a) {
            1 == a.changedTouches.length && (h.reset(), (C = a.changedTouches[0].screenY), (z = 0));
            u = !0;
        },
        !1
    );
    a.addEventListener(
        "touchmove",
        function (a) {
            if (1 == a.changedTouches.length) {
                var c = C;
                C = a.changedTouches[0].screenY;
                z += C - c;
            }
        },
        !1
    );
    a.addEventListener(
        "touchend",
        function (c) {
            if (h.paginate) {
                var d = Site.height * h.paginateModifier;
                n = pageYOffset;
                k = 0 < z ? Math.max(Math.floor(pageYOffset / d), 0) * d : Math.min(Math.ceil(pageYOffset / d) * d, a.scrollHeight - d);
                0 < pageYOffset && pageYOffset < a.scrollHeight - d && UserAgent.iOS && (l || g());
            }
            u = c.touches.length;
        },
        !1
    );
    addEventListener("scroll", function (a) {
        y && (clearTimeout(y), (y = null));
        h.paginate &&
            (u ||
                (y = setTimeout(function () {
                    var a = Site.height * h.paginateModifier;
                    n = pageYOffset;
                    k = Math.round(pageYOffset / a) * a;
                    l || g();
                }, 500)));
    });
    addEventListener("resize", M);
};
var Ribbon = Ribbon || {};
Ribbon = {
    Mode: { UNINITIALIZED: 0, HOME: 1, CASE_DETAIL: 2, NEXT_CASE: 3, TRANSITIONING: 4 },
    DrawStyle: { LINE: 0, RIBBON2D: 1, RIBBON3D: 2 },
    AmbientDirection: { UP: -1, DOWN: 1, NONE: 0 },
    mode: 0,
    drawStyle: 1,
    canvas: null,
    context: null,
    canvasSize: { width: 0, height: 0 },
    breakpoint: null,
    drawArea: { top: 0, height: 0 },
    firstSegment: null,
    lastSegment: null,
    drawContinuously: !1,
    animation: null,
    ambientDirection: 1,
    yCenter: 0.5,
    yOffset: 1e3 * Math.random(),
    xCenter: 0.5,
    xOffset: 0,
    activeStraighten: 0,
    ambientStraighten: 0,
    ambientStepper: new SimplexStepper(0.375),
    ambientStrength: 1,
    deformation: 0,
    width: 175,
    activeScale: 1,
    primaryColor: { r: 255, g: 0, b: 0 },
    secondaryColor: { r: 200, g: 0, b: 0 },
    init: function (a) {
        a &&
            ((Ribbon.canvas = a),
            (Ribbon.canvasSize.width = a.clientWidth),
            (Ribbon.canvasSize.height = a.clientHeight),
            (Ribbon.screenScale = window.devicePixelRatio || 1),
            (a.width = Ribbon.canvasSize.width * Ribbon.screenScale),
            (a.height = Ribbon.canvasSize.height * Ribbon.screenScale),
            (Ribbon.yCenter = (Site.height / Ribbon.canvasSize.height) * 0.5),
            a.getContext && (Ribbon.context = a.getContext("2d")));
        Ribbon.breakpoint = BreakPoints.currentMajorBreakPoint();
        addEventListener("resize", Ribbon.resize);
        Ribbon.setMode(Ribbon.Mode.UNINITIALIZED);
    },
    configForMode: function (a) {
        switch (a) {
            case Ribbon.Mode.HOME:
                return RibbonHomeMode;
            case Ribbon.Mode.CASE_DETAIL:
                return RibbonCaseDetailMode;
            case Ribbon.Mode.NEXT_CASE:
                return RibbonNextCaseMode;
            case Ribbon.Mode.TRANSITIONING:
                return RibbonTransitioningMode;
            default:
                return RibbonUninitializedMode;
        }
    },
    setMode: function (a, d) {
        if (Ribbon.canvas) {
            Ribbon.mode = a;
            removeEventListener("resize", Ribbon.resize);
            a = Ribbon.configForMode(a);
            Ribbon.canvas.className = a.className;
            Ribbon.drawContinuously = a.drawContinuously;
            Ribbon.resize = a.resize;
            Ribbon.createFirstSegment = a.createFirstSegment;
            Ribbon.createSegments = a.createSegments;
            Ribbon.destroySegments = a.destroySegments;
            Ribbon.widthForBreakpoint = a.widthForBreakpoint;
            Ribbon.activeScaleForBreakpoint = a.activeScaleForBreakpoint;
            Ribbon.setDeformationTargets = a.setDeformationTargets || function () {};
            Ribbon.deformationCenter =
                a.deformationCenter ||
                function () {
                    return null;
                };
            d || ((Ribbon.width = Ribbon.widthForBreakpoint(Ribbon.breakpoint)), (Ribbon.activeScale = Ribbon.activeScaleForBreakpoint(Ribbon.breakpoint)));
            Ribbon.canvasSize.width = Ribbon.canvas.clientWidth;
            Ribbon.canvasSize.height = Ribbon.canvas.clientHeight;
            Ribbon.canvas.width = Ribbon.canvasSize.width * Ribbon.screenScale;
            Ribbon.canvas.height = Ribbon.canvasSize.height * Ribbon.screenScale;
            Ribbon.yCenter = (Site.height / Ribbon.canvasSize.height) * 0.5;
            if (a.ambientStrength || 0 == a.ambientStrength) Ribbon.ambientStrength = a.ambientStrength;
            if (a.deformation || 0 == a.deformation) Ribbon.deformation = a.deformation;
            addEventListener("resize", Ribbon.resize);
            Ribbon.setDeformationTargets(Ribbon.deformationCenter(null, !0));
            Ribbon.draw();
        }
    },
    transitionToMode: function (a, d) {
        RibbonTransitioningMode.toMode = a;
        Ribbon.setMode(Ribbon.Mode.TRANSITIONING, !0);
        var f = Ribbon.configForMode(a),
            c = Object.assign({}, Ribbon.drawArea),
            g = Site.currentPage.ribbonDrawArea(),
            h = Ribbon.deformation,
            n = f.deformation,
            l = Ribbon.width,
            r = f.widthForBreakpoint(Ribbon.breakpoint),
            k = Ribbon.activeScale,
            q = f.activeScaleForBreakpoint(Ribbon.breakpoint),
            v = Ribbon.activeStraighten,
            y = Ribbon.ambientStrength,
            C = Ribbon.ambientStrength;
        if (f.ambientStrength || 0 == f.ambientStrength) C = f.ambientStrength;
        Ribbon.ambientDirection = Ribbon.AmbientDirection.NONE;
        var z = CubicBezier.make(0.19, 1, 0.22, 1);
        f = CubicBezier.make(0.18, 0.725, 0.45, 1);
        var p = { value: 0 };
        new Tween(p, 700, {
            value: 1,
            ease: f,
            delay: 5,
            onUpdate: function (a) {
                a = z(p.value);
                Ribbon.drawArea = { top: c.top + (g.top - c.top) * a, height: c.height + (g.height - c.height) * a };
                Ribbon.deformation = h + (n - h) * p.value;
                Ribbon.ambientStrength = y + (C - y) * p.value;
                Ribbon.width = l + (r - l) * p.value;
                Ribbon.activeScale = k + (q - k) * p.value;
                0 != v && Ribbon.straighten(v + (0 - v) * p.value);
            },
            onComplete: function (c) {
                d && d();
                requestAnimationFrame(function () {
                    Ribbon.setMode(a);
                    Ribbon.drawContinuously && (Ribbon.ambientDirection = 0.5 > Math.random() ? Ribbon.AmbientDirection.UP : Ribbon.AmbientDirection.DOWN);
                });
            },
        });
    },
    resize: function () {},
    draw: function () {
        Ribbon.yOffset += 0.1 * Ribbon.ambientDirection * Ribbon.ambientStrength;
        Ribbon.createSegments();
        Ribbon.destroySegments();
        if (Ribbon.firstSegment) {
            0 < Ribbon.ambientStrength && (Ribbon.ambientStepper.advance(), (Ribbon.ambientStraighten = -0.075 + 0.15 * Ribbon.ambientStepper.getValue()));
            var a = Ribbon.getCenter();
            (Ribbon.deformationCenter(a) || a.segment).deform(Ribbon.deformation);
            a.segment.straighten(Ribbon.ambientStrength * (1 - Ribbon.activeStraighten) * Ribbon.ambientStraighten + Ribbon.activeStraighten);
            switch (Ribbon.drawStyle) {
                case Ribbon.DrawStyle.LINE:
                    Ribbon.drawLine(!0);
                    break;
                case Ribbon.DrawStyle.RIBBON2D:
                    Ribbon.draw2dRibbon(!0);
            }
            Ribbon.drawContinuously &&
                requestAnimationFrame(function () {
                    Ribbon.draw();
                });
        }
    },
    getSegmentCount: function () {
        for (var a = 0, d = Ribbon.firstSegment; d; ) a++, (d = d.nextSegment);
        return a;
    },
    sineWidthForBreakpoint: function (a) {
        var d = RibbonHomeMode.activeScaleForBreakpoint(a);
        switch (a) {
            case BreakPoints.MajorBreakPoints.A:
                return 1.4 / d;
            case BreakPoints.MajorBreakPoints.B:
                return 1 / d;
            case BreakPoints.MajorBreakPoints.C:
                return 0.925 / d;
            default:
                return 0.85 / d;
        }
    },
    colorMidpoint: function (a, d) {
        var f = { r: (a.r + d.r) / 2, g: (a.g + d.g) / 2, b: (a.b + d.b) / 2 };
        if ((a.r == a.g && a.g == a.b) || (d.r == d.g && d.g == d.b)) return f;
        var c = Color.rgbToHsv(a),
            g = Color.rgbToHsv(d);
        f = Color.rgbToHsv(f);
        f.s = (c.s + g.s) / 2;
        f = Color.hsvToRgb(f);
        a = Color.rgbToCIELab(a);
        d = Color.rgbToCIELab(d);
        f = Color.rgbToCIELab(f);
        f.l = (a.l + d.l) / 2;
        return (f = Color.cieLabToRgb(f));
    },
    animateColor: function (a, d) {
        Menu.setBackground(Color.rgbToRgbString(a), Color.rgbToRgbString(d));
        if (Ribbon.colorTween || !Color.areEqual(a, Ribbon.primaryColor) || !Color.areEqual(d, Ribbon.secondaryColor)) {
            Ribbon.colorTween && Ribbon.colorTween.stop();
            var f = Ribbon.primaryColor,
                c = Ribbon.secondaryColor,
                g = Ribbon.colorMidpoint(f, a),
                h = Ribbon.colorMidpoint(c, d),
                n = { value: 0 };
            Ribbon.colorTween = new Tween(n, 500, {
                value: 1,
                ease: Ease.easeInOut.quad,
                onUpdate: function (l) {
                    0.5 > n.value
                        ? ((l = 2 * n.value),
                          (Ribbon.primaryColor = { r: f.r + (g.r - f.r) * l, g: f.g + (g.g - f.g) * l, b: f.b + (g.b - f.b) * l }),
                          (Ribbon.secondaryColor = { r: c.r + (h.r - c.r) * l, g: c.g + (h.g - c.g) * l, b: c.b + (h.b - c.b) * l }))
                        : ((l = 2 * n.value - 1),
                          (Ribbon.primaryColor = { r: g.r + (a.r - g.r) * l, g: g.g + (a.g - g.g) * l, b: g.b + (a.b - g.b) * l }),
                          (Ribbon.secondaryColor = { r: h.r + (d.r - h.r) * l, g: h.g + (d.g - h.g) * l, b: h.b + (d.b - h.b) * l }));
                },
                onComplete: function (c) {
                    Ribbon.primaryColor = a;
                    Ribbon.secondaryColor = d;
                    Ribbon.colorTween = null;
                },
            });
        }
    },
    straighten: function (a) {
        var d = Ribbon.activeScale,
            f = Ribbon.getCenter(),
            c = Ribbon.configForMode(Ribbon.mode),
            g = c.widthForBreakpoint(Ribbon.breakpoint),
            h = RibbonHomeMode.widthForBreakpoint(Ribbon.breakpoint);
        c = c.activeScaleForBreakpoint(Ribbon.breakpoint);
        var n = RibbonHomeMode.activeScaleForBreakpoint(Ribbon.breakpoint),
            l = 1 - (h * n * 0.25) / innerWidth;
        Ribbon.width = g + a * (h - g);
        Ribbon.activeScale = c + a * (n - c);
        Ribbon.activeStraighten = a;
        Ribbon.xOffset = a * -(f.segment.deformedStartPoint.x + (f.segment.deformedEndPoint.x - f.segment.deformedStartPoint.x) * f.pivot);
        Ribbon.xCenter = 0.5 + ((l - 0.5) / d) * a;
        Ribbon.drawContinuously || ((Ribbon.drawContinuously = !0), Ribbon.draw());
        Ribbon.ambientDirection = Ribbon.AmbientDirection.NONE;
        0 == a && ((Ribbon.drawContinuously = Ribbon.configForMode(Ribbon.mode).drawContinuously), Ribbon.drawContinuously && (Ribbon.ambientDirection = 0.5 > Math.random() ? Ribbon.AmbientDirection.UP : Ribbon.AmbientDirection.DOWN));
    },
    getCenter: function () {
        for (var a = Ribbon.firstSegment; a.initialEndPoint.y - Ribbon.yOffset < Site.height / 2; ) a = a.nextSegment;
        for (var d = (Site.height / 2 - (a.initialStartPoint.y - Ribbon.yOffset)) / (a.initialEndPoint.y - a.initialStartPoint.y), f = Ribbon.lastSegment; f.initialStartPoint.y - Ribbon.yOffset > Site.height / 2; ) f = f.previousSegment;
        if (a == f) return { segment: a, pivot: d };
        var c = (Site.height / 2 - (f.initialStartPoint.y - Ribbon.yOffset)) / (f.initialEndPoint.y - f.initialStartPoint.y);
        if (a.initialStartPoint.y > f.initialStartPoint.y) return { segment: f, pivot: c };
        for (var g = a.length * (1 - d), h = f.length * c, n = Ease.easeInOut.quad(h / (g + h)), l = g + h, r = a.nextSegment; r != f; ) (l += r.length), (r = r.nextSegment);
        n *= l;
        if (n <= g) return { segment: a, pivot: d + (n / g) * (1 - d) };
        if (l - n <= h) return { segment: f, pivot: ((n - (l - h)) / h) * c };
        d = g;
        for (a = a.nextSegment; a.length < n - d; ) (d += a.length), (a = a.nextSegment);
        return { segment: a, pivot: (n - d) / a.length };
    },
    destroyAllSegments: function () {
        for (; Ribbon.firstSegment; ) {
            var a = Ribbon.firstSegment.nextSegment;
            Ribbon.firstSegment.previousSegment = null;
            Ribbon.firstSegment.nextSegment = null;
            Ribbon.firstSegment.destroy();
            Ribbon.firstSegment = a;
        }
        Ribbon.lastSegment = null;
    },
    drawLine: function (a) {
        var d = Ribbon.context,
            f = Ribbon.canvasSize,
            c = Ribbon.firstSegment,
            g = Ribbon.screenScale,
            h = Ribbon.activeScale,
            n = (f.width / 2 - (f.width / 2) * h) * g,
            l = (f.height * Ribbon.yCenter - f.height * Ribbon.yCenter * h) * g;
        a && d.clearRect(0, 0, f.width * g, f.height * g);
        d.strokeStyle = "rgba(255, 0, 0, 0.25)";
        d.beginPath();
        a = c;
        for (d.moveTo((a.algoStartPoint.x + f.width * Ribbon.xCenter + Ribbon.xOffset) * g * h + n, (a.algoStartPoint.y - Ribbon.yOffset) * g * h + l); a; )
            d.lineTo((a.algoEndPoint.x + f.width * Ribbon.xCenter + Ribbon.xOffset) * g * h + n, (a.algoEndPoint.y - Ribbon.yOffset) * g * h + l), (a = a.nextSegment);
        d.stroke();
        d.closePath();
        d.strokeStyle = "#000000";
        d.beginPath();
        a = c;
        for (d.moveTo((a.currentStartPoint.x + f.width * Ribbon.xCenter + Ribbon.xOffset) * g * h + n, (a.currentStartPoint.y - Ribbon.yOffset) * g * h + l); a; )
            d.lineTo((a.currentEndPoint.x + f.width * Ribbon.xCenter + Ribbon.xOffset) * g * h + n, (a.currentEndPoint.y - Ribbon.yOffset) * g * h + l), (a = a.nextSegment);
        d.stroke();
        d.closePath();
        for (a = c; a; ) {
            c = ((a.currentStartPoint.x + a.currentEndPoint.x) / 2 + f.width * Ribbon.xCenter + Ribbon.xOffset) * g * h + n;
            var r = ((a.currentStartPoint.y + a.currentEndPoint.y) / 2 - Ribbon.yOffset) * g * h + l,
                k = (a.currentEndPoint.x + f.width * Ribbon.xCenter + Ribbon.xOffset) * g * h + n,
                q = (a.currentEndPoint.y - Ribbon.yOffset) * g * h + l;
            d.fillStyle = "#FF0000";
            d.beginPath();
            d.arc(k, q, 5 * g, 0, 2 * Math.PI);
            d.fill();
            d.closePath();
            d.fillStyle = "#000";
            d.font = 12 * g + "px Helvetica";
            d.textAlign = "right";
            d.fillText("initialAngle: " + (a.initialAngle / Math.PI).toFixed(2) + "\u03c0", c - 10 * g, r);
            d.fillText("currentAngle: " + (a.currentAngle / Math.PI).toFixed(2) + "\u03c0", c - 10 * g, r + 16 * g);
            d.fillText(a.debugID, c - 10 * g, r + 32 * g);
            a.nextSegment &&
                (d.fillText("initialAngle DIFF: " + ((a.nextSegment.initialAngle - a.initialAngle) / Math.PI).toFixed(2) + "\u03c0", k - 10 * g, q),
                d.fillText("currentAngle DIFF: " + ((a.nextSegment.currentAngle - a.currentAngle) / Math.PI).toFixed(2) + "\u03c0", k - 10 * g, q + 16 * g));
            a = a.nextSegment;
        }
        for (c = Ribbon.lastSegment; c.initialStartPoint.y - Ribbon.yOffset > Ribbon.canvasSize.height * Ribbon.yCenter; ) c = c.previousSegment;
        r = (Ribbon.canvasSize.height * Ribbon.yCenter - (c.initialStartPoint.y - Ribbon.yOffset)) / (c.initialEndPoint.y - c.initialStartPoint.y);
        a = (c.currentStartPoint.x + (c.currentEndPoint.x - c.currentStartPoint.x) * r + f.width * Ribbon.xCenter + Ribbon.xOffset) * g * h + n;
        c = (c.currentStartPoint.y + (c.currentEndPoint.y - c.currentStartPoint.y) * r - Ribbon.yOffset) * g * h + l;
        d.fillStyle = "#00FF00";
        d.beginPath();
        d.arc(a, c, 4 * g, 0, 2 * Math.PI);
        d.fill();
        d.closePath();
        for (c = Ribbon.firstSegment; c.initialEndPoint.y - Ribbon.yOffset < Ribbon.canvasSize.height * Ribbon.yCenter; ) c = c.nextSegment;
        r = (Ribbon.canvasSize.height * Ribbon.yCenter - (c.initialStartPoint.y - Ribbon.yOffset)) / (c.initialEndPoint.y - c.initialStartPoint.y);
        a = (c.currentStartPoint.x + (c.currentEndPoint.x - c.currentStartPoint.x) * r + f.width * Ribbon.xCenter + Ribbon.xOffset) * g * h + n;
        c = (c.currentStartPoint.y + (c.currentEndPoint.y - c.currentStartPoint.y) * r - Ribbon.yOffset) * g * h + l;
        d.fillStyle = "#0000FF";
        d.beginPath();
        d.arc(a, c, 3 * g, 0, 2 * Math.PI);
        d.fill();
        d.closePath();
        c = Ribbon.getCenter();
        a = (c.segment.currentStartPoint.x + (c.segment.currentEndPoint.x - c.segment.currentStartPoint.x) * c.pivot + f.width * Ribbon.xCenter + Ribbon.xOffset) * g * h + n;
        c = (c.segment.currentStartPoint.y + (c.segment.currentEndPoint.y - c.segment.currentStartPoint.y) * c.pivot - Ribbon.yOffset) * g * h + l;
        d.fillStyle = "#FF00FF";
        d.beginPath();
        d.arc(a, c, 2 * g, 0, 2 * Math.PI);
        d.fill();
        d.closePath();
        f = (1 - Ribbon.activeStraighten) * Ribbon.ambientStraighten + Ribbon.activeStraighten;
        d.fillStyle = "#000";
        d.textAlign = "left";
        d.fillText("straighten: " + f.toFixed(3), a + 10 * g, c);
    },
    draw2dRibbon: function (a) {
        var d = Ribbon.context,
            f = Ribbon.canvasSize,
            c = Ribbon.firstSegment,
            g = Ribbon.drawArea,
            h = Ribbon.screenScale;
        a && d.clearRect(0, 0, f.width * h, f.height * h);
        if (!(g.top > f.height)) {
            for (a = c; a; ) a.calculateVerticesAndColor(a.previousSegment, (1 - Math.min(4 * Ribbon.activeStraighten, 1)) * Ribbon.deformation), (a = a.nextSegment);
            var n = function (a) {
                d.fillStyle = "rgb(" + Math.round(a.color.r) + ", " + Math.round(a.color.g) + ", " + Math.round(a.color.b) + ")";
                d.beginPath();
                for (var c = 0, f = 0, g = 0, n = 0; n < a.vertices.length; n += 3) {
                    var l = (a.vertices[n] + Ribbon.canvasSize.width / 2) * h,
                        C = (a.vertices[n + 1] + Ribbon.canvasSize.height * Ribbon.yCenter) * h,
                        z = a.vertices[n + 2];
                    0 == n ? d.moveTo(l, C) : (l != c || C != f || z != g) && d.lineTo(l, C);
                    c = l;
                    f = C;
                    g = z;
                }
                d.fill();
                d.closePath();
            };
            for (a = c; a; ) a.backface && n(a), (a = a.nextSegment);
            for (a = c; a; ) a.backface || n(a), (a = a.nextSegment);
            0 < g.top && d.clearRect(0, 0, f.width * h, g.top * h);
            c = g.top + g.height;
            c < f.height && d.clearRect(0, c * h, f.width * h, (f.height - c) * h);
        }
    },
};
var RibbonSegment = function (a, d, f) {
    var c = this;
    c.debugID = (function (a) {
        for (var c = ""; 0 < a; --a) c += "0123456789abcdefghijklmnopqrstuvwxyz"[Math.round(35 * Math.random())];
        return c;
    })(32);
    c.previousSegment = null;
    c.nextSegment = null;
    c.backface = !1;
    c.deformationTarget = null;
    c.algoStartPoint = { x: 0, y: 0, z: 0 };
    c.algoEndPoint = { x: 0, y: 0, z: 0 };
    c.initialStartPoint = { x: 0, y: 0, z: 0 };
    c.initialEndPoint = { x: 0, y: 0, z: 0 };
    c.initialAngle = 0;
    c.length = 0;
    c.deformedLength = 0;
    c.deformedStartPoint = { x: 0, y: 0, z: 0 };
    c.deformedEndPoint = { x: 0, y: 0, z: 0 };
    c.deformedAngle = 0;
    c.currentStartPoint = { x: 0, y: 0, z: 0 };
    c.currentEndPoint = { x: 0, y: 0, z: 0 };
    c.currentAngle = 0;
    c.vertices = [];
    c.tailOrderSwapped = !1;
    c.colorBlend = 0;
    c.color = { r: 0, g: 0, b: 0 };
    var g = 0;
    c.homeConstructor = function (a) {
        if (a)
            if ((!a.previousSegment && !a.nextSegment) || (a.previousSegment && !a.nextSegment))
                (c.previousSegment = a), (c.previousSegment.nextSegment = c), (c.algoStartPoint = Object.assign({}, c.previousSegment.algoEndPoint)), (c.initialStartPoint = Object.assign({}, c.previousSegment.initialEndPoint)), h();
            else {
                c.nextSegment = a;
                c.nextSegment.previousSegment = c;
                c.algoEndPoint = Object.assign({}, c.nextSegment.algoStartPoint);
                c.initialEndPoint = Object.assign({}, c.nextSegment.initialStartPoint);
                var d = Math.sqrt(Ribbon.width / 175);
                c.algoStartPoint = n(Math.min(c.algoEndPoint.y - 350 * d, c.initialEndPoint.y - 400 * d));
                c.initialStartPoint = Object.assign({}, c.algoStartPoint);
                c.initialAngle = l(c.initialStartPoint, c.initialEndPoint);
                if (c.nextSegment) {
                    var f = (55 * Math.PI) / 180,
                        g = c.nextSegment.initialAngle - c.initialAngle;
                    if (Math.abs(g) < f) {
                        d = r(c.initialStartPoint, c.initialEndPoint);
                        f = c.nextSegment.initialAngle - (g / Math.abs(g)) * f;
                        g = Math.cos(f) * d;
                        var k = Math.sin(f) * d;
                        c.initialAngle = f;
                        c.initialStartPoint.x = c.initialEndPoint.x - g;
                        c.initialStartPoint.y = c.initialEndPoint.y - k;
                        c.length = d;
                    }
                }
            }
        else (c.algoStartPoint = n(Ribbon.yOffset)), (c.initialStartPoint = Object.assign({}, c.algoStartPoint)), h();
        c.length || (c.length = r(c.initialStartPoint, c.initialEndPoint));
        c.deformedLength = c.length;
        c.deformedStartPoint = Object.assign({}, c.initialStartPoint);
        c.deformedEndPoint = Object.assign({}, c.initialEndPoint);
        c.deformedAngle = c.initialAngle;
        c.currentStartPoint = Object.assign({}, c.deformedStartPoint);
        c.currentEndPoint = Object.assign({}, c.deformedEndPoint);
        c.currentAngle = c.deformedAngle;
        c.backface = !(a && a.backface);
    };
    c.destroy = function () {
        c = null;
    };
    c.deform = function (a, d) {
        if (g != a)
            if (((g = a), c.deformationTarget))
                if (
                    (c.deformationTarget.length && (c.deformedLength = c.length + (c.deformationTarget.length - c.length) * a),
                    c.deformationTarget.angle && (c.deformedAngle = c.initialAngle + (c.deformationTarget.angle - c.initialAngle) * a),
                    d)
                )
                    if (d == c.previousSegment) {
                        var f = Math.cos(c.deformedAngle) * c.deformedLength,
                            h = Math.sin(c.deformedAngle) * c.deformedLength;
                        c.deformedStartPoint = Object.assign({}, d.deformedEndPoint);
                        c.deformedEndPoint = { x: c.deformedStartPoint.x + f, y: c.deformedStartPoint.y + h, z: c.initialEndPoint.z };
                        c.nextSegment && c.nextSegment.deform(a, c);
                    } else
                        (f = Math.cos(c.deformedAngle) * c.deformedLength),
                            (h = Math.sin(c.deformedAngle) * c.deformedLength),
                            (c.deformedEndPoint = Object.assign({}, d.deformedStartPoint)),
                            (c.deformedStartPoint = { x: c.deformedEndPoint.x - f, y: c.deformedEndPoint.y - h, z: c.initialStartPoint.z }),
                            c.previousSegment && c.previousSegment.deform(a, c);
                else
                    (c.deformedStartPoint.x = c.initialStartPoint.x + (c.deformationTarget.startX - c.initialStartPoint.x) * a),
                        (c.deformedEndPoint.x = c.initialEndPoint.x + (c.deformationTarget.endX - c.initialEndPoint.x) * a),
                        (d = RibbonCaseDetailMode.activeScaleForBreakpoint(Ribbon.breakpoint)),
                        (c.deformedStartPoint.y =
                            c.initialStartPoint.y + (Ribbon.yOffset + c.deformationTarget.startY - (Ribbon.canvasSize.height * Ribbon.yCenter - Ribbon.canvasSize.height * Ribbon.yCenter * d) / d - c.initialStartPoint.y) * a),
                        (c.deformedEndPoint = { x: c.deformedStartPoint.x + Math.cos(c.deformedAngle) * c.deformedLength, y: c.deformedStartPoint.y + Math.sin(c.deformedAngle) * c.deformedLength, z: c.initialEndPoint.z }),
                        c.nextSegment && c.nextSegment.deform(a, c),
                        c.previousSegment && c.previousSegment.deform(a, c);
            else
                (c.deformedLength = c.length),
                    d
                        ? d == c.previousSegment
                            ? ((f = Math.cos(c.initialAngle) * c.deformedLength),
                              (h = Math.sin(c.initialAngle) * c.deformedLength),
                              (c.deformedStartPoint = Object.assign({}, d.deformedEndPoint)),
                              (c.deformedEndPoint = { x: c.deformedStartPoint.x + f, y: c.deformedStartPoint.y + h, z: c.initialEndPoint.z }),
                              c.nextSegment && c.nextSegment.deform(a, c))
                            : ((f = Math.cos(c.initialAngle) * c.deformedLength),
                              (h = Math.sin(c.initialAngle) * c.deformedLength),
                              (c.deformedEndPoint = Object.assign({}, d.deformedStartPoint)),
                              (c.deformedStartPoint = { x: c.deformedEndPoint.x - f, y: c.deformedEndPoint.y - h, z: c.initialStartPoint.z }),
                              c.previousSegment && c.previousSegment.deform(a, c))
                        : ((c.deformedStartPoint = Object.assign({}, c.initialStartPoint)),
                          (c.deformedEndPoint = Object.assign({}, c.initialEndPoint)),
                          (c.deformedAngle = c.initialAngle),
                          c.nextSegment && c.nextSegment.deform(a, c),
                          c.previousSegment && c.previousSegment.deform(a, c));
    };
    c.straighten = function (a, d) {
        var f = c.deformedAngle;
        f < -0.5 * Math.PI && (f += 2 * Math.PI);
        c.currentAngle = f + (0.5 * Math.PI - f) * a;
        if (d)
            if (d == c.previousSegment) {
                f = Math.cos(c.currentAngle) * c.deformedLength;
                var g = Math.sin(c.currentAngle) * c.deformedLength;
                c.currentStartPoint = Object.assign({}, d.currentEndPoint);
                c.currentEndPoint = { x: c.currentStartPoint.x + f, y: c.currentStartPoint.y + g, z: c.deformedEndPoint.z - a * c.deformedEndPoint.z };
                c.nextSegment && c.nextSegment.straighten(a, c);
            } else
                (f = Math.cos(c.currentAngle) * c.deformedLength),
                    (g = Math.sin(c.currentAngle) * c.deformedLength),
                    (c.currentEndPoint = Object.assign({}, d.currentStartPoint)),
                    (c.currentStartPoint = { x: c.currentEndPoint.x - f, y: c.currentEndPoint.y - g, z: c.deformedStartPoint.z - a * c.deformedStartPoint.z }),
                    c.previousSegment && c.previousSegment.straighten(a, c);
        else {
            d = Ribbon.getCenter().pivot;
            f = c.deformedStartPoint.x + (c.deformedEndPoint.x - c.deformedStartPoint.x) * d;
            g = c.deformedStartPoint.y + (c.deformedEndPoint.y - c.deformedStartPoint.y) * d;
            var h = Math.cos(c.currentAngle) * c.deformedLength,
                k = Math.sin(c.currentAngle) * c.deformedLength;
            c.currentEndPoint = { x: f + h * (1 - d), y: g + k * (1 - d), z: c.deformedEndPoint.z - a * c.deformedEndPoint.z };
            c.currentStartPoint = { x: f - h * d, y: g - k * d, z: c.deformedStartPoint.z - a * c.deformedStartPoint.z };
            c.previousSegment && c.previousSegment.straighten(a, c);
            c.nextSegment && c.nextSegment.straighten(a, c);
        }
    };
    var h = function () {
            var a = Math.sqrt(Ribbon.width / 175);
            c.algoEndPoint = n(Math.max(c.algoStartPoint.y + 350 * a, c.initialStartPoint.y + 400 * a));
            c.initialEndPoint = Object.assign({}, c.algoEndPoint);
            c.initialAngle = l(c.initialStartPoint, c.initialEndPoint);
            if (c.previousSegment) {
                var d = (55 * Math.PI) / 180,
                    f = c.initialAngle - c.previousSegment.initialAngle;
                if (Math.abs(f) < d) {
                    a = r(c.initialStartPoint, c.initialEndPoint);
                    d = (f / Math.abs(f)) * d + c.previousSegment.initialAngle;
                    f = Math.cos(d) * a;
                    var g = Math.sin(d) * a;
                    c.initialAngle = d;
                    c.initialEndPoint.x = c.initialStartPoint.x + f;
                    c.initialEndPoint.y = c.initialStartPoint.y + g;
                    c.length = a;
                }
            }
        },
        n = function (a) {
            return { x: Math.sin((a / 235) * 1.5708) * Math.min(Ribbon.canvasSize.width, 1600) * (Ribbon.sineWidthForBreakpoint(Ribbon.breakpoint) / 2), y: a, z: 0 };
        },
        l = function (a, c) {
            var d = c.x - a.x;
            a = c.y - a.y;
            return 0 == a ? (0 > d ? Math.pi : 0) : 0 == d ? (Math.PI / 2) * (a / Math.abs(a)) : 0 < d ? Math.atan(a / d) : 0 < a ? Math.PI + Math.atan(a / d) : -Math.PI + Math.atan(a / d);
        },
        r = function (a, c) {
            var d = c.x - a.x;
            a = c.y - a.y;
            return Math.sqrt(d * d + a * a);
        };
    c.calculateVerticesAndColor = function (a, d) {
        c.vertices = [];
        c.colorBlend = 0;
        var f = 1;
        d && (f = 1 - d);
        var g = (52 * Math.PI) / 180,
            h = (38 * Math.PI) / 180;
        d = Ribbon.activeScale;
        var k = -Ribbon.yOffset - Ribbon.canvasSize.height * Ribbon.yCenter,
            n = Ribbon.xOffset - Ribbon.canvasSize.width / 2 + Ribbon.canvasSize.width * Ribbon.xCenter;
        if (a) {
            var l = a.vertices;
            a.tailOrderSwapped
                ? (c.vertices.push(l[15], l[16] - 0.5, l[17]), c.vertices.push(l[12], l[13] - 0.5, l[14]), c.vertices.push(l[9], l[10] - 0.5, l[11]))
                : (c.vertices.push(l[9], l[10], l[11]), c.vertices.push(l[12], l[13], l[14]), c.vertices.push(l[15], l[16], l[17]));
        } else {
            l = c.currentAngle + 0.5 * Math.PI;
            var q = (Ribbon.width / 2) * Math.cos(l),
                r = (Ribbon.width / 2) * Math.sin(l);
            l = c.currentStartPoint.x + q + n;
            var w = c.currentStartPoint.y + r + k,
                L = c.currentStartPoint.z;
            q = c.currentStartPoint.x - q + n;
            r = c.currentStartPoint.y - r + k;
            var B = c.currentStartPoint.z;
            c.vertices.push(l * d, w * d, L);
            c.vertices.push(l * d, w * d, L);
            c.vertices.push(q * d, r * d, B);
        }
        if (c.nextSegment) {
            var O = c.nextSegment.currentAngle - c.currentAngle,
                P = Math.abs(O);
            if (P > g) {
                l = (c.currentAngle + c.nextSegment.currentAngle) / 2;
                var D = c.currentAngle + Math.PI / 2 - l;
                D = Ribbon.width / 2 / Math.cos(D);
                w = D * Math.cos(l);
                l = D * Math.sin(l);
                f = c.currentEndPoint.x - w + n;
                g = c.currentEndPoint.y - l + k;
                h = c.currentEndPoint.z;
                n = c.currentEndPoint.x + w + n;
                k = c.currentEndPoint.y + l + k;
                l = c.currentEndPoint.z;
                c.vertices.push(f * d, g * d, h);
                c.vertices.push(f * d, g * d, h);
                c.vertices.push(n * d, k * d, l);
                c.tailOrderSwapped = !1;
            } else if (P > h) {
                l = (c.currentAngle + c.nextSegment.currentAngle) / 2;
                D = c.currentAngle + Math.PI / 2 - l;
                D = Ribbon.width / 2 / Math.cos(D);
                var J = D * Math.cos(l);
                l = D * Math.sin(l);
                w = c.currentEndPoint.x - J + n;
                L = c.currentEndPoint.y - l + k;
                q = c.currentEndPoint.z;
                r = c.currentEndPoint.x + J + n;
                B = c.currentEndPoint.y + l + k;
                var R = c.currentEndPoint.z;
                g = 1 - (P - h) / (g - h);
                c.colorBlend = g * f;
                l = (c.currentAngle + c.nextSegment.currentAngle) / 2 + Math.PI / 2;
                l > Math.PI && (l -= 2 * Math.PI);
                D = l - (c.currentAngle + Math.PI / 2);
                D = (Ribbon.width / 2 / Math.cos(D)) * g;
                J = D * Math.cos(l);
                l = D * Math.sin(l);
                n = 0 < O ? c.currentEndPoint.x - J + n : c.currentEndPoint.x + J + n;
                k = 0 < O ? c.currentEndPoint.y - l + k : c.currentEndPoint.y + l + k;
                f = c.currentEndPoint.z;
                c.vertices.push(w * d, L * d, q);
                c.vertices.push(n * d, k * d, f);
                c.vertices.push(r * d, B * d, R);
                c.tailOrderSwapped = !1;
            } else
                (c.colorBlend = 1 * f),
                    (l = (c.currentAngle + c.nextSegment.currentAngle) / 2 - Math.PI / 2),
                    l > Math.PI && (l -= 2 * Math.PI),
                    (D = l - (c.currentAngle + Math.PI / 2)),
                    (D = Ribbon.width / 2 / Math.cos(D)),
                    (n = c.currentEndPoint.x + 0.5 * Math.cos(c.currentAngle) + n),
                    (f = c.currentEndPoint.y + 0.5 * Math.sin(c.currentAngle) + k),
                    (k = c.currentEndPoint.z),
                    (g = D * Math.cos(l)),
                    (w = D * Math.sin(l)),
                    (h = n + g),
                    (l = f + w),
                    (n -= g),
                    (f -= w),
                    c.vertices.push(n * d, f * d, k),
                    c.vertices.push(n * d, f * d, k),
                    c.vertices.push(h * d, l * d, k),
                    (c.tailOrderSwapped = !0);
        } else
            (f = c.currentAngle + 0.5 * Math.PI),
                (l = (Ribbon.width / 2) * Math.cos(f)),
                (w = (Ribbon.width / 2) * Math.sin(f)),
                (f = c.currentEndPoint.x - l + n),
                (g = c.currentEndPoint.y - w + k),
                (h = c.currentEndPoint.z),
                (n = c.currentEndPoint.x + l + n),
                (k = c.currentEndPoint.y + w + k),
                (l = c.currentEndPoint.z),
                c.vertices.push(f * d, g * d, h),
                c.vertices.push(f * d, g * d, h),
                c.vertices.push(n * d, k * d, l);
        d = c.colorBlend;
        a && (d = Math.max(d, a.colorBlend));
        c.color = c.backface
            ? {
                  r: Ribbon.secondaryColor.r + (Ribbon.primaryColor.r - Ribbon.secondaryColor.r) * d,
                  g: Ribbon.secondaryColor.g + (Ribbon.primaryColor.g - Ribbon.secondaryColor.g) * d,
                  b: Ribbon.secondaryColor.b + (Ribbon.primaryColor.b - Ribbon.secondaryColor.b) * d,
              }
            : Ribbon.primaryColor;
    };
    c.homeConstructor(a);
};
var RibbonUninitializedMode = {
    className: "",
    drawContinuously: !1,
    ambientStrength: 0,
    resize: function () {},
    createFirstSegment: function () {},
    createSegments: function () {},
    destroySegments: function () {},
    widthForBreakpoint: function (a) {
        return 100;
    },
    activeScaleForBreakpoint: function (a) {
        return 1;
    },
};
var RibbonHomeMode = {
    className: "home-mode",
    drawContinuously: !0,
    ambientStrength: 1,
    deformation: 0,
    resize: function () {
        var a = Ribbon.canvas;
        Ribbon.canvasSize.width = a.clientWidth;
        Ribbon.canvasSize.height = a.clientHeight;
        Ribbon.screenScale = window.devicePixelRatio || 1;
        a.width = Ribbon.canvasSize.width * Ribbon.screenScale;
        a.height = Ribbon.canvasSize.height * Ribbon.screenScale;
        Ribbon.yCenter = (Site.height / Ribbon.canvasSize.height) * 0.5;
        a = BreakPoints.currentMajorBreakPoint();
        Ribbon.width = Ribbon.widthForBreakpoint(a);
        Ribbon.activeScale = Ribbon.activeScaleForBreakpoint(Ribbon.breakpoint);
        Ribbon.breakpoint != a && ((Ribbon.breakpoint = a), Ribbon.destroyAllSegments(), Ribbon.createSegments());
        Ribbon.drawContinuously || Ribbon.draw();
    },
    createFirstSegment: function () {
        Ribbon.firstSegment = new RibbonSegment();
        Ribbon.lastSegment = Ribbon.firstSegment;
    },
    createSegments: function () {
        Ribbon.firstSegment || Ribbon.createFirstSegment();
        var a = Ribbon.activeScale,
            d = 300 / a,
            f = -(Ribbon.canvasSize.height / 2 - (Ribbon.canvasSize.height / 2) * a) / a;
        for (a = Ribbon.canvasSize.height / a; Ribbon.lastSegment.initialEndPoint.y - Ribbon.yOffset < a + d; ) Ribbon.lastSegment = new RibbonSegment(Ribbon.lastSegment);
        for (; Ribbon.firstSegment.initialStartPoint.y - Ribbon.yOffset > f - d; ) Ribbon.firstSegment = new RibbonSegment(Ribbon.firstSegment);
    },
    destroySegments: function () {
        var a = Ribbon.activeScale,
            d = 300 / a,
            f = -(Ribbon.canvasSize.height / 2 - (Ribbon.canvasSize.height / 2) * a) / a;
        for (a = Ribbon.canvasSize.height / a; Ribbon.firstSegment.initialEndPoint.y - Ribbon.yOffset < f - d && Ribbon.firstSegment != Ribbon.lastSegment; )
            (Ribbon.firstSegment = Ribbon.firstSegment.nextSegment), Ribbon.firstSegment.previousSegment.destroy(), (Ribbon.firstSegment.previousSegment = null);
        for (; Ribbon.lastSegment.initialStartPoint.y - Ribbon.yOffset > a + d && Ribbon.firstSegment != Ribbon.lastSegment; )
            (Ribbon.lastSegment = Ribbon.lastSegment.previousSegment), Ribbon.lastSegment.nextSegment.destroy(), (Ribbon.lastSegment.nextSegment = null);
    },
    widthForBreakpoint: function (a) {
        return 175;
    },
    activeScaleForBreakpoint: function (a) {
        switch (a) {
            case BreakPoints.MajorBreakPoints.A:
                return 120 / 175;
            case BreakPoints.MajorBreakPoints.B:
                return 0.8;
            case BreakPoints.MajorBreakPoints.C:
                return 160 / 175;
            default:
                return 1;
        }
    },
};
var RibbonCaseDetailMode = {
    className: "case-detail-mode",
    drawContinuously: !1,
    ambientStrength: 0,
    deformation: 1,
    resize: function () {
        var a = Ribbon.canvasSize.width,
            d = Ribbon.canvas;
        Ribbon.canvasSize.width = d.clientWidth;
        Ribbon.canvasSize.height = d.clientHeight;
        Ribbon.screenScale = window.devicePixelRatio || 1;
        d.width = Ribbon.canvasSize.width * Ribbon.screenScale;
        d.height = Ribbon.canvasSize.height * Ribbon.screenScale;
        Ribbon.yCenter = (Site.height / Ribbon.canvasSize.height) * 0.5;
        Ribbon.canvasSize.width != a &&
            ((a = BreakPoints.currentMajorBreakPoint()),
            (Ribbon.width = Ribbon.widthForBreakpoint(a)),
            (Ribbon.activeScale = Ribbon.activeScaleForBreakpoint(Ribbon.breakpoint)),
            (Ribbon.breakpoint = a),
            Ribbon.destroyAllSegments(),
            Ribbon.createSegments(),
            Ribbon.setDeformationTargets(Ribbon.deformationCenter(null, !0)));
        Ribbon.drawContinuously || Ribbon.draw();
    },
    createFirstSegment: function () {
        Ribbon.firstSegment = new RibbonSegment();
        Ribbon.lastSegment = Ribbon.firstSegment;
    },
    createSegments: function () {
        for (Ribbon.firstSegment || Ribbon.createFirstSegment(); 3 > Ribbon.getSegmentCount(); ) Ribbon.lastSegment = new RibbonSegment(Ribbon.lastSegment);
        for (var a = !1; !a; ) {
            for (var d = Ribbon.lastSegment.previousSegment; d.previousSegment && !a; ) 0 < d.initialAngle - d.previousSegment.initialAngle ? (a = !0) : (d = d.previousSegment);
            a || (Ribbon.lastSegment = new RibbonSegment(Ribbon.lastSegment));
        }
    },
    destroySegments: function () {},
    widthForBreakpoint: function (a) {
        return 175;
    },
    activeScaleForBreakpoint: function (a) {
        switch (a) {
            case BreakPoints.MajorBreakPoints.A:
                return 300 / 175;
            case BreakPoints.MajorBreakPoints.B:
                return 375 / 175;
            case BreakPoints.MajorBreakPoints.C:
                return 450 / 175;
            default:
                return 520 / 175;
        }
    },
    deformationCenter: function (a, d) {
        Ribbon.createSegments();
        a || (a = Ribbon.getCenter());
        for (var f = (d = a.segment); d || f; )
            if (0.5 < a.pivot) {
                if (d && d.nextSegment) {
                    if (0 < d.nextSegment.initialAngle - d.initialAngle) return d.nextSegment;
                    d = d.nextSegment;
                }
                if (f && f.previousSegment) {
                    if (0 < f.initialAngle - f.previousSegment.initialAngle) return f;
                    f = f.previousSegment;
                }
            } else {
                if (f && f.previousSegment) {
                    if (0 < f.initialAngle - f.previousSegment.initialAngle) return f;
                    f = f.previousSegment;
                }
                if (d && d.nextSegment) {
                    if (0 < d.nextSegment.initialAngle - d.initialAngle) return d.nextSegment;
                    d = d.nextSegment;
                }
            }
    },
    setDeformationTargets: function (a) {
        var d = RibbonCaseDetailMode.activeScaleForBreakpoint(Ribbon.breakpoint),
            f = Math.min(Ribbon.canvasSize.width, 1600) / 2 / d,
            c = (0.69 * Ribbon.widthForBreakpoint(Ribbon.breakpoint) * d) / d;
        a.deformationTarget = { angle: (147.3 * Math.PI) / 180, startX: f, startY: c, length: -(-(Ribbon.canvasSize.width / 2) / d - Ribbon.width * d - f) / Math.sin(((147.3 - 90) * Math.PI) / 180) };
        a.previousSegment || (Ribbon.firstSegment = new RibbonSegment(Ribbon.firstSegment));
        a.previousSegment.deformationTarget = { angle: (32.7 * Math.PI) / 180, length: Site.height };
        a.nextSegment || (Ribbon.lastSegment = new RibbonSegment(Ribbon.lastSegment));
        a.nextSegment.deformationTarget = 0 > a.nextSegment.initialAngle - a.initialAngle ? { angle: 0.5 * Math.PI, length: Site.height } : { angle: Math.PI, length: Site.height };
    },
};
var RibbonNextCaseMode = Object.assign({}, RibbonHomeMode, { className: "next-case-mode" });
var RibbonTransitioningMode = Object.assign({}, RibbonHomeMode, {
    toMode: void 0,
    className: "transitioning-mode",
    ambientStrength: void 0,
    deformation: void 0,
    deformationCenter: RibbonCaseDetailMode.deformationCenter,
    setDeformationTargets: RibbonCaseDetailMode.setDeformationTargets,
    widthForBreakpoint: RibbonCaseDetailMode.widthForBreakpoint,
    activeScaleForBreakpoint: function (a) {
        return Ribbon.configForMode(RibbonTransitioningMode.toMode).activeScaleForBreakpoint(a);
    },
    destroySegments: function () {},
});
var Home = function (a) {
    var d = this;
    d.pageName = "home";
    d.sectionName = "work";
    d.pageType = Site.PageType.HOME;
    d.ribbonMode = Ribbon.Mode.HOME;
    d.ribbonColor = null;
    d.paginate = !0;
    d.currentIndex = 0;
    d.element = null;
    d.pages = [];
    d.bullets = [];
    d.wheelTimeout = null;
    d.wheelLocked = !1;
    d.addListeners = function () {
        window.addEventListener("scroll", f);
        window.addEventListener("resize", c);
    };
    d.removeListeners = function () {
        window.removeEventListener("scroll", f);
        window.removeEventListener("resize", c);
    };
    d.willBeginTransition = function (a, c) {
        a || ((a = d.pages[d.currentIndex].getElementsByClassName("spine")[0]), (a.style.left = a.offsetLeft.toFixed(2) + "px"));
    };
    d.didFinishTransition = function (a, c) {
        a && Menu.hideArrow();
    };
    d.destroy = function () {
        d = null;
    };
    d.playIntro = function () {
        var a = d.getTransitionableElements(),
            c;
        for (c in a) a.hasOwnProperty(c) && (a[c].classList.add("transitioning"), a[c].classList.remove("transition-in"));
        setTimeout(function () {
            for (var c in a) a.hasOwnProperty(c) && a[c].classList.remove("transitioning");
        }, 760);
        Ribbon.transitionToMode(Ribbon.Mode.HOME);
    };
    d.menuWillAppear = function () {
        Site.smoothScroll.scrollToY(d.currentIndex * Site.height);
        fastdom.mutate(function () {
            document.getElementById("bullets").classList.add("absolute");
            g(d.currentIndex * Site.height, !0);
        });
    };
    d.menuDidDisappear = function () {
        fastdom.mutate(function () {
            g(d.currentIndex * Site.height);
            document.getElementById("bullets").classList.remove("absolute");
        });
    };
    d.ribbonDrawArea = function () {
        return { top: 0, height: innerHeight };
    };
    d.keepLogoFixed = !0;
    d.shouldScrollToTopForTransitionTo = function (a) {
        return !1;
    };
    d.scrollPositionForTransitionFrom = function (a) {
        return location.hash && 0 < location.hash.length ? ((a = location.hash.slice(1)), document.getElementById(a).offsetTop) : 0;
    };
    d.getIncomingTransitionType = function (a) {
        return Transition.TransitionType.LIST_DETAIL;
    };
    d.getTransitionableElements = function (a, c) {
        a ||
            ((d.currentIndex = Math.round((pageYOffset - d.element.offsetTop) / Site.height)),
            (c = d.pages[d.currentIndex]),
            (d.ribbonColor = { primary: Color.hexToRgb(c.dataset.primarycolor), secondary: Color.hexToRgb(c.dataset.secondarycolor) }));
        c = d.pages[d.currentIndex];
        var f = c.dataset.slug,
            g = {};
        g[f + "-project-name"] = c.getElementsByTagName("h2")[0];
        var h = c.getElementsByTagName("h3");
        0 < h.length && (g[f + "-client-name"] = h[0]);
        h = c.getElementsByClassName("arrow")[0];
        a && (h.style.width = h.getBoundingClientRect().width + "px");
        g[f + "-stroke"] = h.getElementsByClassName("spine")[0];
        g[f + "-arrow-circle"] = h.getElementsByClassName("circle")[0];
        g[f + "-arrow-head"] = h.getElementsByTagName("img")[0];
        g[f + "-intro"] = c.getElementsByTagName("p")[0];
        g.bullets = document.getElementById("bullets");
        return g;
    };
    d.logoClicked = function (a) {
        a = d.pages[0].dataset;
        d.ribbonColor = { primary: Color.hexToRgb(a.primarycolor), secondary: Color.hexToRgb(a.secondarycolor) };
        r();
        Site.smoothScroll.scrollToY(0, !0);
    };
    var f = function (a) {
            fastdom.measure(function () {
                var c = pageYOffset - d.element.offsetTop;
                d.savedPageYOffset = d.savedPageYOffset || c;
                var f = c - d.savedPageYOffset;
                d.savedPageYOffset = c;
                Ribbon.yOffset += 0.375 * f;
                Ribbon.ambientDirection = 0 < f ? Ribbon.AmbientDirection.DOWN : Ribbon.AmbientDirection.UP;
                g(c, document.getElementById("bullets").classList.contains("absolute"));
                c = Math.floor(c / Site.height + 0.5);
                c = Math.min(Math.max(c, 0), d.bullets.length - 1);
                if (d.currentIndex != c) {
                    a && history.replaceState({}, "", "#" + d.pages[c].id);
                    d.currentIndex = c;
                    var h = d.pages[d.currentIndex].dataset;
                    fastdom.mutate(function () {
                        Menu.setBackground(h.primarycolor, h.secondarycolor);
                    });
                    document.getElementById("bullets").style.setProperty("--selection-color", h.selectionColor);
                    d.ribbonColor = { primary: Color.hexToRgb(h.primarycolor), secondary: Color.hexToRgb(h.secondarycolor) };
                    r();
                }
            });
        },
        c = function (a) {
            fastdom.measure(function () {
                Ribbon.drawArea = d.ribbonDrawArea();
                g(pageYOffset - d.element.offsetTop, document.getElementById("bullets").classList.contains("absolute"));
            });
        },
        g = function (a, c) {
            var f = Site.height || innerHeight,
                g = { fontSize: 16, lineHeight: 16, margin: 48, zIndex: 1, fontWeight: 600 },
                k = n(),
                q = a / f,
                p = Math.min(Math.max(q, 0), d.bullets.length - 1),
                r = d.bullets[Math.floor(p)],
                E = d.bullets[Math.ceil(p)],
                M = q % 1,
                w = 1 - M,
                L = l(),
                B = L.b,
                O = -B - q * L.m,
                P = Math.round(p) - Math.round((f / 2 - B - g.margin) / (g.lineHeight + g.margin));
            fastdom.mutate(function () {
                r == E ? h(E, 1, k, g) : (h(E, Ease.easeInOut.quad(M), k, g), h(r, Ease.easeInOut.quad(w), k, g));
                d.bullets.forEach(function (a, c) {
                    c < P ? a.classList.add("above") : a.classList.remove("above");
                    a.classList.contains("focused") &&
                        a != E &&
                        a != r &&
                        (a.style.removeProperty("font-size"), a.style.removeProperty("line-height"), a.style.removeProperty("margin"), a.style.removeProperty("z-index"), a.style.removeProperty("font-weight"), a.classList.remove("focused"));
                });
                c ? (document.getElementById("bullets").style.transform = "translateY(" + (O + a) + "px)") : (document.getElementById("bullets").style.transform = "translateY(" + O + "px)");
            });
        },
        h = function (a, c, d, f) {
            a.style.fontSize = f.fontSize + (d.fontSize - f.fontSize) * c + "px";
            a.style.lineHeight = f.lineHeight + (d.lineHeight - f.lineHeight) * c + "px";
            a.style.margin = f.margin + (d.margin - f.margin) * c + "px 0";
            a.style.zIndex = "" + (0.5 > c ? f.zIndex : d.zIndex);
            a.style.fontWeight = "" + (0.025 > c ? f.fontWeight : d.fontWeight);
            0.025 < c && a.classList.add("focused");
        },
        n = function () {
            switch (BreakPoints.currentMajorBreakPoint()) {
                case BreakPoints.MajorBreakPoints.A:
                    return { fontSize: 130, lineHeight: 65, margin: 58, zIndex: 0, fontWeight: 400 };
                case BreakPoints.MajorBreakPoints.B:
                    return { fontSize: 194, lineHeight: 100, margin: 61, zIndex: 0, fontWeight: 400 };
                case BreakPoints.MajorBreakPoints.C:
                    return { fontSize: 257, lineHeight: 129, margin: 65, zIndex: 0, fontWeight: 400 };
                default:
                    return { fontSize: 320, lineHeight: 227, margin: 34, zIndex: 0, fontWeight: 400 };
            }
        },
        l = function () {
            switch (BreakPoints.currentMajorBreakPoint()) {
                case BreakPoints.MajorBreakPoints.A:
                    return { b: 91, m: 64 };
                case BreakPoints.MajorBreakPoints.B:
                    return { b: 111, m: 64 };
                case BreakPoints.MajorBreakPoints.C:
                    return { b: 129, m: 64 };
                default:
                    return { b: 148, m: 65.1666667 };
            }
        },
        r = throttle(function () {
            Ribbon.animateColor(d.ribbonColor.primary, d.ribbonColor.secondary);
        }, 300);
    (function (a) {
        d.element = document.getElementById("pages").parentElement;
        d.pages = Array.from(document.getElementById("pages").getElementsByTagName("li"));
        d.bullets = Array.from(document.getElementById("bullets").getElementsByTagName("li"));
        location.hash &&
            0 < location.hash.length &&
            ((a = location.hash.slice(1)), (a = document.getElementById(a)), (d.currentIndex = Math.round(a.offsetTop / (Site.height || innerHeight))), (d.currentIndex = Math.min(d.currentIndex, d.pages.length - 1)));
        d.bullets.forEach(function (a) {
            a.onclick = function (a) {
                a.preventDefault();
                a = this.getElementsByTagName("a")[0].href.split("#")[1];
                var c = document.getElementById(a);
                a = c.getBoundingClientRect().y + pageYOffset;
                c = c.dataset;
                d.ribbonColor = { primary: Color.hexToRgb(c.primarycolor), secondary: Color.hexToRgb(c.secondarycolor) };
                r();
                Site.smoothScroll.scrollToY(a, !0);
            };
        });
        Site.startRendering();
        g(d.currentIndex * (Site.height || innerHeight));
        a = d.pages[d.currentIndex];
        document.getElementById("bullets").style.setProperty("--selection-color", a.dataset.selectionColor);
        d.ribbonColor = { primary: Color.hexToRgb(a.dataset.primarycolor), secondary: Color.hexToRgb(a.dataset.secondarycolor) };
    })(a);
};
var LazyContent = function (a, d) {
    var f = this;
    f.element = null;
    f.placeholder = null;
    f.wrapper = null;
    f.src = null;
    var c = !1,
        g = !1,
        h = !0,
        n = !1;
    f.activate = function () {
        n = !0;
        addEventListener("scroll", r);
        r();
    };
    f.check = function () {
        r();
    };
    f.destroy = function () {
        n &&
            (c || removeEventListener("scroll", r),
            c && k && (h ? f.element.removeEventListener("load", k) : (f.element.removeEventListener("canplaythrough", k), f.element.removeEventListener("error", v))),
            g && q && f.placeholder.removeEventListener("load", q));
        f = null;
    };
    var l = function (a) {
            var c = f.wrapper.getBoundingClientRect(),
                d = c.top < Site.height && 0 < c.bottom;
            return a && d ? c.right < Site.width && 0 < c.left : d;
        },
        r = debounce(function () {
            if (l())
                if (((c = !0), removeEventListener("scroll", r), f.wrapper.classList.add("loading"), h)) f.element.addEventListener("load", k), (f.element.src = f.src);
                else {
                    var a = f.element.getElementsByTagName("IMG");
                    a.length && ((f.placeholder = a[0]), f.placeholder.addEventListener("load", q), (f.placeholder.src = f.placeholder.dataset.src), (g = !0));
                    f.element.addEventListener("canplaythrough", k);
                    f.element.addEventListener("error", v);
                    a = document.createElement("source");
                    a.setAttribute("src", f.src);
                    f.element.appendChild(a);
                    f.element.load();
                }
        }, 50),
        k = function (a) {
            f.wrapper.classList.remove("loading");
            f.wrapper.classList.add("loaded");
            h
                ? f.element.removeEventListener("load", k)
                : (f.element.removeEventListener("canplaythrough", k),
                  f.element.removeEventListener("error", v),
                  (f.element.dataset.canplay = !0),
                  l(!0) &&
                      setTimeout(function () {
                          f.placeholder && (f.placeholder.remove(), (f.placeholder = null));
                          var a = f.element.play();
                          a &&
                              a.catch(function (a) {
                                  console.log(a);
                              });
                      }, 50));
            v = k = null;
        },
        q = function (a) {
            f.element.poster = f.placeholder.dataset.src;
            requestAnimationFrame(function () {
                f.wrapper.classList.add("placeholder-loaded");
            });
            f.placeholder.removeEventListener("load", q);
            q = null;
        },
        v = function (a) {
            console.log(a);
        };
    (function (a, c) {
        f.element = a;
        f.wrapper = a.parentElement;
        f.src = a.dataset.src;
        h = "VIDEO" != f.element.tagName;
        c || f.activate();
    })(a, d);
};
var Case = function (a) {
    var d = this;
    d.pageName = null;
    d.sectionName = "work";
    d.pageType = Site.PageType.CASE_DETAIL;
    d.ribbonMode = Ribbon.Mode.CASE_DETAIL;
    d.paginate = !1;
    d.element = null;
    d.lazyContent = [];
    d.videos = [];
    d.flickityDotPagination = null;
    d.flickityNavParent = null;
    d.slideNavElement = null;
    d.primaryColor = null;
    d.secondaryColor = null;
    d.nextPrimaryColor = null;
    d.nextSecondaryColor = null;
    d.heroshotsLayout = null;
    d.introParagraphs = null;
    d.heroshotSlider = null;
    d.slideshows = [];
    var f = (d.footer = null),
        c = !1;
    d.addListeners = function () {
        addEventListener("scroll", g);
        addEventListener("resize", r);
    };
    d.removeListeners = function () {
        removeEventListener("scroll", g);
        removeEventListener("resize", r);
    };
    d.willBeginTransition = function (a, c) {
        a && (c.pageName == d.footer.dataset.slug ? h(d.element.scrollHeight) : h(0));
        d.isActive = !1;
        n();
    };
    d.didFinishTransition = function (a, c) {
        (d.isActive = a) &&
            d.lazyContent.forEach(function (a) {
                a.activate();
            });
        0 < pageYOffset ? Menu.showArrow() : Menu.hideArrow();
    };
    d.destroy = function () {
        -1 <
            document
                .getElementById("logo")
                .getElementsByTagName("a")[0]
                .href.indexOf("/#" + d.pageName) && (document.getElementById("logo").getElementsByTagName("a")[0].href = location.origin);
        d.slideshows.forEach(function (a) {
            a.destroy();
        });
        d.slideshows = [];
        d.lazyContent.forEach(function (a) {
            a.destroy();
        });
        d.lazyContent = [];
        d = null;
    };
    d.prepareForIntro = function () {
        var a = d.getTransitionableElements(),
            c;
        for (c in a) a.hasOwnProperty(c) && a[c].classList.add("transition-in");
        Ribbon.setMode(Ribbon.Mode.HOME);
    };
    d.playIntro = function () {
        var a = d.getTransitionableElements(),
            c;
        for (c in a) a.hasOwnProperty(c) && (a[c].classList.add("transitioning"), a[c].classList.remove("transition-in"));
        setTimeout(function () {
            for (var c in a) a.hasOwnProperty(c) && a[c].classList.remove("transitioning");
            d.didFinishTransition(!0);
        }, 1e3);
        Ribbon.transitionToMode(Ribbon.Mode.CASE_DETAIL);
    };
    d.ribbonDrawArea = function () {
        var a = pageYOffset - d.element.offsetTop,
            c = innerHeight;
        return 0.67 < a / (d.element.scrollHeight - c) ? { top: Math.max(d.footer.offsetTop - a, 0), height: c } : { top: 0, height: Math.max(1.125 * innerWidth, 1600) };
    };
    d.keepLogoFixed = !1;
    d.shouldScrollToTopForTransitionTo = function (a) {
        return a && a.pageName == d.footer.dataset.slug ? !1 : !0;
    };
    d.scrollPositionForTransitionFrom = function (a) {
        return a.pageName == d.footer.dataset.slug ? d.footer.getBoundingClientRect().bottom - d.footer.parentElement.getBoundingClientRect().top - innerHeight : 0;
    };
    d.getIncomingTransitionType = function (a) {
        switch (a.pageType) {
            case Site.PageType.HOME:
                return Transition.TransitionType.LIST_DETAIL;
            case Site.PageType.CASE_DETAIL:
                return Transition.TransitionType.DETAIL_DETAIL;
            case Site.PageType.CONTACT:
                return Transition.TransitionType.VERTICAL;
            default:
                return Transition.TransitionType.VERTICAL;
        }
    };
    d.getTransitionableElements = function (a, c) {
        if (c && c.pageName == d.footer.dataset.slug && (!a || d.footer.getBoundingClientRect().top < innerHeight)) {
            a = d.footer.dataset.slug;
            c = {};
            c[a + "-project-name"] = d.footer.getElementsByTagName("h1")[0];
            var f = d.footer.getElementsByTagName("h2");
            0 < f.length && (c[a + "-client-name"] = f[0]);
            c[a + "-stroke"] = d.footer.getElementsByClassName("color-bar")[0];
            c[a + "-vitals"] = d.footer.getElementsByTagName("h6")[0];
            c[a + "-next"] = d.footer.getElementsByClassName("next-label")[0];
            c[a + "-screenshot-container"] = d.element.getElementsByClassName("screenshot-container")[0];
            c[a + "-screenshot-container-desktop"] = d.element.getElementsByClassName("screenshot-container-desktop")[0];
            c[a + "-rally-tree"] = d.element.getElementsByClassName("rally-tree")[0];
            c[a + "-footer-arrow"] = d.element.getElementsByClassName("footer-arrow")[0];
            return c;
        }
        if ((a && c && "contact" === c.pageName) || (!a && c && "contact" === c.pageName))
            return (a = d.pageName), (c = {}), (c[a + "-casestudy"] = d.element.getElementsByClassName("case")[0].firstElementChild), (c[a + "-hero-shots"] = d.element.getElementsByClassName("heroshots")[0]), c;
        a = d.pageName;
        c = {};
        f = d.element.getElementsByClassName("case-title")[0];
        c[a + "-project-name"] = f.getElementsByTagName("h1")[0];
        var g = f.getElementsByTagName("h2");
        0 < g.length && (c[a + "-client-name"] = g[0]);
        c[a + "-stroke"] = f.getElementsByClassName("stroke")[0];
        c[a + "-vitals"] = f.getElementsByTagName("h3")[0];
        c[a + "-hero-shots"] = d.element.getElementsByClassName("heroshots")[0];
        c[a + "-hero-slideshow"] = d.element.getElementsByClassName("heroshot-slider-container")[0];
        return c;
    };
    var g = function (a) {
            n();
            a = pageYOffset;
            d.savedPageYOffset = d.savedPageYOffset || pageYOffset;
            var c = a - d.savedPageYOffset;
            d.savedPageYOffset = a;
            h(a) && ((Ribbon.primaryColor = d.ribbonColor.primary), (Ribbon.secondaryColor = d.ribbonColor.secondary), Ribbon.destroyAllSegments(), (Ribbon.drawArea = d.ribbonDrawArea()), Ribbon.setMode(d.ribbonMode));
            Ribbon.mode == Ribbon.Mode.NEXT_CASE && ((Ribbon.yOffset += 0.5 * c), (Ribbon.drawArea = d.ribbonDrawArea()));
            0 < a ? Menu.showArrow() : Menu.hideArrow();
        },
        h = function (a) {
            var c = !1;
            d.nextPrimaryColor &&
                (0.67 < a / (d.element.scrollHeight - innerHeight)
                    ? (Ribbon.canvas.style.setProperty("--footer-height", d.footer.offsetHeight + "px"),
                      (d.ribbonColor = { primary: d.nextPrimaryColor, secondary: d.nextSecondaryColor }),
                      (d.ribbonMode = Ribbon.Mode.NEXT_CASE),
                      (c = Ribbon.mode == Ribbon.Mode.CASE_DETAIL))
                    : ((d.ribbonColor = { primary: d.primaryColor, secondary: d.secondaryColor }), (d.ribbonMode = Ribbon.Mode.CASE_DETAIL), (c = Ribbon.mode == Ribbon.Mode.NEXT_CASE)));
            return c;
        },
        n = function () {
            f && clearTimeout(f);
            f = setTimeout(l, 100);
            c ||
                (d.videos.forEach(function (a) {
                    a.pause();
                }),
                (c = !0));
        },
        l = function () {
            c &&
                ((c = !1),
                d.isActive &&
                    d.videos.forEach(function (a) {
                        if (a.clientWidth && (a.dataset.canplay || a.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA)) {
                            var c = a.getBoundingClientRect(),
                                d = 0 <= c.left && c.right <= Site.width;
                            d || (0 > c.left && (d = Math.abs(c.left) < c.width / 2), c.right > Site.width && (d = c.right - Site.width < c.width / 2));
                            c.top < Site.height &&
                                0 < c.bottom &&
                                d &&
                                (c = a.play()) &&
                                c.catch(function (c) {
                                    console.log(c);
                                    a.playsInline = !0;
                                    f && clearTimeout(f);
                                    f = setTimeout(l, 50);
                                });
                        }
                    }));
        },
        r = function (a) {
            n();
            Ribbon.canvas.style.setProperty("--footer-height", d.footer.offsetHeight + "px");
        },
        k = function () {
            var a = d.element.getElementsByClassName("screenshot-slider-desktop")[0];
            a &&
                ((a = new Slideshow(
                    a,
                    function (a, c) {
                        n();
                    },
                    { prevNextButtons: !0, arrowShape: { x0: 10, x1: 60, y1: 50, x2: 65, y2: 45, x3: 20 } }
                )),
                d.slideshows.push(a));
        },
        q = function () {
            var a = new Slideshow(d.element.getElementsByClassName("heroshot-slider")[0], function (a, c) {
                n();
                var d = a * (c.length - 1);
                a = Math.floor(d);
                var f = Math.ceil(d);
                d -= a;
                for (var g = 1 - d, h = 1 - 0.85, k = 0; k < c.length; k++)
                    if (k == a || k == f) {
                        var l = k == a ? g : d,
                            p = k == a ? -1 : 1;
                        if (0.5 > l) {
                            var q = 2 * l;
                            var r = 0;
                            var u = 15 * p;
                            var v = 0;
                            var z = 3;
                        } else (q = 2 * (l - 0.5)), (r = 15 * p), (u = 0 - r), (v = 3), (z = -3);
                        p = 0.85 + h * l;
                        var y = Ease.easeOut.sine;
                        r += u * y(q);
                        q = v + z * y(q);
                        c[k].element.style.transform = "scale3d(" + p + "," + p + ",1.0) perspective(750px) rotateY(" + r + "deg) rotateX(" + q + "deg) translateY(" + (5 + -5 * l) + "%)";
                    } else c[k].element.style.transform = "scale(0.85) translateY(5%)";
            });
            d.slideshows.push(a);
        },
        v = function () {
            var a = d.element.getElementsByClassName("colorswatch-slider");
            0 < a.length &&
                ((a = a[0]),
                (a = new Slideshow(
                    a,
                    function (a, c) {
                        n();
                    },
                    { groupCells: 2 }
                )),
                d.slideshows.push(a));
        },
        y = function () {
            var a = d.element.getElementsByClassName("screenshot-slider");
            0 < a.length &&
                ((a = a[0]),
                (a = new Slideshow(a, function (a, c) {
                    n();
                })),
                d.slideshows.push(a));
        },
        C = function () {
            for (var a = 0; a < d.flickityDotPagination.length; a++) {
                var c = d.flickityDotPagination[a],
                    f = document.createElement("span");
                f.classList.add("nav-item");
                c.appendChild(f);
            }
        };
    (function (a) {
        d.element = a.parentElement;
        d.pageName = a.dataset.slug;
        document.getElementById("logo").getElementsByTagName("a")[0].href = "/#" + d.pageName;
        d.primaryColor = Color.hexToRgb(a.dataset.primarycolor);
        d.secondaryColor = Color.hexToRgb(a.dataset.secondarycolor);
        d.ribbonColor = { primary: d.primaryColor, secondary: d.secondaryColor };
        d.flickityDotPagination = d.element.getElementsByClassName("dot");
        d.flickityNavParent = d.element.getElementsByClassName("flickity-page-dots");
        d.slideNavElement = d.element.getElementsByClassName("slider-bar");
        d.heroshotsLayout = d.element.getElementsByClassName("heroshots");
        d.introParagraphs = d.element.getElementsByClassName("intro-paragraphs");
        d.heroshotSlider = d.element.getElementsByClassName("heroshot-slider-container");
        k();
        q();
        y();
        v();
        C();
        d.heroshotsLayout[0].classList.contains("desktop-layout") || d.heroshotsLayout[0].classList.contains("ipad-layout") ? d.introParagraphs[0].classList.add("layout4") : d.introParagraphs[0].classList.remove("layout4");
        if (
            d.heroshotsLayout[0].classList.contains("iphone-ipad-layout") ||
            d.heroshotsLayout[0].classList.contains("ipad-iphone-layout") ||
            d.heroshotsLayout[0].classList.contains("desktop-layout") ||
            d.heroshotsLayout[0].classList.contains("ipad-layout")
        )
            d.heroshotSlider[0].style.display = "none";
        a = d.element.getElementsByClassName("launch-square")[0];
        75 < Color.rgbToCIELab(d.primaryColor).l ? a.classList.add("reversed") : a.classList.remove("reversed");
        d.videos = Array.from(d.element.getElementsByTagName("video"));
        d.lazyContent = Array.from(d.element.getElementsByClassName("lazy")).map(function (a) {
            return new LazyContent(a, !0);
        });
        d.footer = d.element.getElementsByClassName("footer")[0];
        Site.startRendering();
    })(a);
};
var Slideshow = function (a, d, f) {
    var c = this;
    c.element = null;
    c.flickitySlideshow = null;
    c.slideBar = null;
    c.scrollingCallback = null;
    var g = function (a) {
        if (Site.smoothScroll) {
            var d = (a * (this.cells.length - 1)) % 1;
            0.01 < d && 0.99 > d ? c.element.classList.add("is-scrolling") : c.element.classList.remove("is-scrolling");
        }
        d = (120 - parseInt(c.slideBar.style.width, 10)) / 2;
        var f = Math.max(0, Math.min(1, a));
        c.slideBar && (c.slideBar.style.left = 2 * d * f + "px");
        c.scrollingCallback && c.scrollingCallback(a, this.cells);
    };
    c.destroy = function () {
        c.element.ontouchstart = null;
        c.element.ontouchmove = null;
        c.flickitySlideshow.off("scroll", g);
        c.flickitySlideshow.destroy();
        c = c.scrollingCallback = null;
    };
    (function (a, d, f) {
        c.element = a;
        c.scrollingCallback = d;
        a = Object.assign({}, { imagesLoaded: !0, prevNextButtons: !1 }, f);
        c.flickitySlideshow = new Flickity(c.element, a);
        d = c.element.getElementsByClassName("flickity-page-dots")[0];
        a = c.flickitySlideshow.slides.length;
        for (f = 0; f < d.children.length; f++) d.children[f].style.width = 120 / a + "px";
        f = document.createElement("div");
        f.className = "slider-bar";
        d.appendChild(f);
        d = document.createElement("span");
        f.appendChild(d);
        c.slideBar = f;
        c.slideBar.style.width = 120 / a + "px";
        c.flickitySlideshow.on("scroll", g);
        c.scrollingCallback && c.scrollingCallback(0, c.flickitySlideshow.cells);
        var h = 0;
        c.element.ontouchstart = function (a) {
            h = a.touches[0].clientX;
        };
        c.element.ontouchmove = function (a) {
            10 < Math.abs(a.touches[0].clientX - h) && a.cancelable && a.preventDefault();
        };
    })(a, d, f);
};
var Transition = Barba.BaseTransition.extend({
    TransitionType: { LIST_DETAIL: 0, DETAIL_DETAIL: 1, VERTICAL: 2 },
    start: function () {
        document.body.classList.add("transitioning");
        this.startingYOffset = pageYOffset;
        Site.smoothScroll.reset();
        this.newContainerLoading.then(this.prepareForTransition.bind(this));
    },
    prepareForTransition: function () {
        for (var a = this.newContainer.getElementsByTagName("script"), d = 0; d < a.length; d++) eval(a[d].innerHTML);
        Menu.selectCurrentSection(Site.currentPage.sectionName);
        Menu.isOpen &&
            ((this.deferRibbonTransition = !0),
            (a = function () {
                this.transitionRibbon();
            }.bind(this)),
            Menu.close(a));
        Site.previousPage.willBeginTransition && Site.previousPage.willBeginTransition(!1, Site.currentPage);
        Site.currentPage.willBeginTransition && Site.currentPage.willBeginTransition(!0, Site.previousPage);
        Site.smoothScroll.disableScrolling();
        if (Site.previousPage.shouldScrollToTopForTransitionTo(Site.currentPage) && 0 != pageYOffset) {
            var f = this;
            this.startingYOffset = 0;
            var c = function (a) {
                0 == pageYOffset && (removeEventListener("scroll", c), Site.smoothScroll.reset(), f.beginTransition.bind(f)());
            };
            addEventListener("scroll", c);
            Site.smoothScroll.scrollToY(0, !0);
        } else this.beginTransition();
    },
    deferRibbonTransition: !1,
    transitionRibbon: function () {
        Ribbon.transitionToMode(Site.currentPage.ribbonMode);
        Site.currentPage.ribbonColor.primary && Ribbon.animateColor(Site.currentPage.ribbonColor.primary, Site.currentPage.ribbonColor.secondary);
    },
    beginTransition: function () {
        Site.previousPage.removeListeners();
        this.endingYOffset = 0;
        Site.currentPage.scrollPositionForTransitionFrom && (this.endingYOffset = Site.currentPage.scrollPositionForTransitionFrom(Site.previousPage));
        Site.smoothScroll.scrollToY(this.endingYOffset);
        (0 != this.endingYOffset && Site.currentPage.shouldScrollToTopForTransitionTo()) || Menu.hideArrow();
        this.oldContainer.style.position = "absolute";
        this.oldContainer.style.top = pageYOffset - this.startingYOffset + "px";
        this.oldContainer.style.left = (Site.width - this.oldContainer.clientWidth) / 2 + "px";
        var a = {};
        Site.previousPage.getTransitionableElements && (a = Site.previousPage.getTransitionableElements(!0, Site.currentPage));
        !Site.previousPage.keepLogoFixed &&
            54 < this.startingYOffset &&
            ((Menu.logo.style.opacity = "0"),
            (Menu.hireCta.style.opacity = "0"),
            requestAnimationFrame(function () {
                Menu.logo.classList.add("transitioning");
                Menu.hireCta.classList.add("transitioning");
                setTimeout(function () {
                    Menu.logo.style.removeProperty("opacity");
                    Menu.hireCta.style.removeProperty("opacity");
                }, 10);
            }));
        !Site.currentPage.keepLogoFixed &&
            54 < this.endingYOffset &&
            (Menu.logo.classList.add("transitioning"),
            Menu.hireCta.classList.add("transitioning"),
            requestAnimationFrame(function () {
                setTimeout(function () {
                    Menu.logo.style.opacity = "0";
                    Menu.hireCta.style.opacity = "0";
                }, 10);
            }));
        Menu.logo.style.top = pageYOffset + 14 + "px";
        Menu.logo.style.position = "absolute";
        Menu.logo.classList.remove("fixed");
        Menu.hireCta.style.top = pageYOffset + 14 + "px";
        Menu.hireCta.style.position = "absolute";
        Menu.hireCta.classList.remove("fixed");
        Menu.button.style.top = pageYOffset + 14 + "px";
        Menu.button.style.position = "absolute";
        var d = this.finish.bind(this);
        requestAnimationFrame(
            function () {
                this.deferRibbonTransition || this.transitionRibbon();
                var f = Site.currentPage.getIncomingTransitionType(Site.previousPage),
                    c = {};
                Site.currentPage.getTransitionableElements && (c = Site.currentPage.getTransitionableElements(!1, Site.previousPage));
                var g = function (a) {
                        return "0px" != a ? Number(a.replace("px", "")) : 0;
                    },
                    h = function (a, c) {
                        var d = g(c.paddingTop),
                            f = g(c.paddingRight),
                            h = g(c.paddingBottom);
                        c = g(c.paddingLeft);
                        var k = {};
                        k.x = a.x + c;
                        k.y = a.y + d;
                        k.width = a.width - c - f;
                        k.height = a.height - d - h;
                        k.paddingTop = d;
                        k.paddingRight = f;
                        k.paddingBottom = h;
                        k.paddingLeft = c;
                        return k;
                    },
                    n = null,
                    l = {},
                    r;
                for (r in a) {
                    if (c.hasOwnProperty(r)) {
                        l.$jscomp$loop$prop$oldElement$73 = a[r];
                        var k = c[r];
                        l.$jscomp$loop$prop$oldStyle$76 = getComputedStyle(l.$jscomp$loop$prop$oldElement$73);
                        l.$jscomp$loop$prop$newStyle$74 = getComputedStyle(k);
                        l.$jscomp$loop$prop$oldRect$78 = h(l.$jscomp$loop$prop$oldElement$73.getBoundingClientRect(), l.$jscomp$loop$prop$oldStyle$76);
                        l.$jscomp$loop$prop$newRect$77 = h(k.getBoundingClientRect(), l.$jscomp$loop$prop$newStyle$74);
                        k.style.visibility = "hidden";
                        n || (n = l.$jscomp$loop$prop$oldElement$73);
                        l.$jscomp$loop$prop$textScaling$75 = l.$jscomp$loop$prop$oldStyle$76.fontSize != l.$jscomp$loop$prop$newStyle$74.fontSize;
                        l.$jscomp$loop$prop$textNonScaling$79 = !l.$jscomp$loop$prop$textScaling$75 && "0px" != l.$jscomp$loop$prop$oldStyle$76.fontSize;
                        k = l.$jscomp$loop$prop$oldRect$78.paddingLeft + l.$jscomp$loop$prop$oldRect$78.width + l.$jscomp$loop$prop$oldRect$78.paddingRight;
                        var q = l.$jscomp$loop$prop$oldRect$78.paddingTop + l.$jscomp$loop$prop$oldRect$78.height + l.$jscomp$loop$prop$oldRect$78.paddingBottom;
                        l.$jscomp$loop$prop$textScaling$75 || l.$jscomp$loop$prop$textNonScaling$79 || ((l.$jscomp$loop$prop$oldElement$73.style.width = k + "px"), (l.$jscomp$loop$prop$oldElement$73.style.height = q + "px"));
                        l.$jscomp$loop$prop$oldElement$73.style.transformOrigin = (l.$jscomp$loop$prop$oldRect$78.paddingLeft / k) * 100 + "% " + (l.$jscomp$loop$prop$oldRect$78.paddingTop / q) * 100 + "%";
                        l.$jscomp$loop$prop$oldElement$73.style.transition = "transform 0.75s cubic-bezier(0.190, 1.000, 0.220, 1.000), background-color 0.75s linear";
                        setTimeout(
                            (function (a) {
                                return function () {
                                    if (a.$jscomp$loop$prop$oldElement$73 == n) {
                                        var c = function (f) {
                                            "transform" == f.propertyName && (a.$jscomp$loop$prop$oldElement$73.removeEventListener("transitionend", c), d());
                                        };
                                        a.$jscomp$loop$prop$oldElement$73.addEventListener("transitionend", c);
                                    }
                                    a.$jscomp$loop$prop$oldElement$73.style.fontWeight = a.$jscomp$loop$prop$newStyle$74.fontWeight;
                                    if (a.$jscomp$loop$prop$textScaling$75) {
                                        var f = g(a.$jscomp$loop$prop$newStyle$74.fontSize) / g(a.$jscomp$loop$prop$oldStyle$76.fontSize);
                                        a.$jscomp$loop$prop$oldElement$73.style.transform =
                                            "translate(" +
                                            (a.$jscomp$loop$prop$newRect$77.x - a.$jscomp$loop$prop$oldRect$78.x) +
                                            "px, " +
                                            (a.$jscomp$loop$prop$newRect$77.y - a.$jscomp$loop$prop$oldRect$78.y) +
                                            "px) scale(" +
                                            f +
                                            ", " +
                                            f +
                                            ")";
                                    } else
                                        a.$jscomp$loop$prop$textNonScaling$79
                                            ? (a.$jscomp$loop$prop$oldElement$73.style.transform =
                                                  "translate(" + (a.$jscomp$loop$prop$newRect$77.x - a.$jscomp$loop$prop$oldRect$78.x) + "px, " + (a.$jscomp$loop$prop$newRect$77.y - a.$jscomp$loop$prop$oldRect$78.y) + "px)")
                                            : (a.$jscomp$loop$prop$oldElement$73.classList.add("transitioning"),
                                              (a.$jscomp$loop$prop$oldElement$73.style.transform =
                                                  "translate(" +
                                                  (a.$jscomp$loop$prop$newRect$77.x - a.$jscomp$loop$prop$oldRect$78.x) +
                                                  "px, " +
                                                  (a.$jscomp$loop$prop$newRect$77.y - a.$jscomp$loop$prop$oldRect$78.y) +
                                                  "px) scale(" +
                                                  a.$jscomp$loop$prop$newRect$77.width / a.$jscomp$loop$prop$oldRect$78.width +
                                                  ", " +
                                                  a.$jscomp$loop$prop$newRect$77.height / a.$jscomp$loop$prop$oldRect$78.height +
                                                  ")"),
                                              (a.$jscomp$loop$prop$oldElement$73.style.backgroundColor = a.$jscomp$loop$prop$newStyle$74.backgroundColor));
                                };
                            })(l),
                            10
                        );
                    } else
                        a.hasOwnProperty(r) &&
                            ((l.$jscomp$loop$prop$oldElement$69$80 = a[r]),
                            l.$jscomp$loop$prop$oldElement$69$80 &&
                                (l.$jscomp$loop$prop$oldElement$69$80.classList.add("transitioning"),
                                setTimeout(
                                    (function (a) {
                                        return function () {
                                            a.$jscomp$loop$prop$oldElement$69$80.classList.add("transition-out");
                                        };
                                    })(l),
                                    10
                                )));
                    l = {
                        $jscomp$loop$prop$oldElement$73: l.$jscomp$loop$prop$oldElement$73,
                        $jscomp$loop$prop$newStyle$74: l.$jscomp$loop$prop$newStyle$74,
                        $jscomp$loop$prop$textScaling$75: l.$jscomp$loop$prop$textScaling$75,
                        $jscomp$loop$prop$oldStyle$76: l.$jscomp$loop$prop$oldStyle$76,
                        $jscomp$loop$prop$newRect$77: l.$jscomp$loop$prop$newRect$77,
                        $jscomp$loop$prop$oldRect$78: l.$jscomp$loop$prop$oldRect$78,
                        $jscomp$loop$prop$textNonScaling$79: l.$jscomp$loop$prop$textNonScaling$79,
                        $jscomp$loop$prop$oldElement$69$80: l.$jscomp$loop$prop$oldElement$69$80,
                    };
                }
                h = {};
                for (r in c)
                    c.hasOwnProperty(r) &&
                        !a.hasOwnProperty(r) &&
                        ((h.$jscomp$loop$prop$newElement$70$83 = c[r]),
                        h.$jscomp$loop$prop$newElement$70$83 &&
                            ((h.$jscomp$loop$prop$newElement$70$83.style.transition = "none"),
                            h.$jscomp$loop$prop$newElement$70$83.classList.add("transition-in"),
                            f === Transition.TransitionType.VERTICAL
                                ? setTimeout(
                                      (function (a) {
                                          return function () {
                                              a.$jscomp$loop$prop$newElement$70$83.style.removeProperty("transition");
                                              a.$jscomp$loop$prop$newElement$70$83.classList.add("transitioning");
                                              a.$jscomp$loop$prop$newElement$70$83.classList.remove("transition-in");
                                          };
                                      })(h),
                                      450
                                  )
                                : setTimeout(
                                      (function (a) {
                                          return function () {
                                              a.$jscomp$loop$prop$newElement$70$83.style.removeProperty("transition");
                                              a.$jscomp$loop$prop$newElement$70$83.classList.add("transitioning");
                                              a.$jscomp$loop$prop$newElement$70$83.classList.remove("transition-in");
                                          };
                                      })(h),
                                      10
                                  ))),
                        (h = { $jscomp$loop$prop$newElement$70$83: h.$jscomp$loop$prop$newElement$70$83 });
                this.newTransitionableElements = c;
                f === Transition.TransitionType.VERTICAL
                    ? n ||
                      setTimeout(function () {
                          d();
                      }, 1200)
                    : n ||
                      setTimeout(function () {
                          d();
                      }, 760);
                this.newContainer.style.visibility = "visible";
            }.bind(this)
        );
    },
    finish: function () {
        Site.previousPage.didFinishTransition && Site.previousPage.didFinishTransition(!1, Site.currentPage);
        var a = Site.previousPage;
        Site.previousPage && Site.previousPage.destroy && (Site.previousPage.destroy(), (Site.previousPage = null));
        for (var d in this.newTransitionableElements)
            if (this.newTransitionableElements.hasOwnProperty(d)) {
                var f = this.newTransitionableElements[d];
                f && (f.classList.remove("transitioning"), f.style.removeProperty("visibility"));
            }
        Ribbon.canvas.style.removeProperty("top");
        this.newContainer.style.removeProperty("top");
        this.newContainer.style.removeProperty("left");
        this.newContainer.style.removeProperty("position");
        Menu.logo.classList.remove("transitioning");
        Menu.logo.style.removeProperty("opacity");
        Menu.logo.style.removeProperty("top");
        Menu.logo.style.removeProperty("position");
        Menu.hireCta.classList.remove("transitioning");
        Menu.hireCta.style.removeProperty("opacity");
        Menu.hireCta.style.removeProperty("top");
        Menu.hireCta.style.removeProperty("position");
        Menu.button.style.removeProperty("top");
        Menu.button.style.removeProperty("position");
        Site.currentPage.keepLogoFixed && (Menu.logo.classList.add("fixed"), Menu.hireCta.classList.add("fixed"));
        Site.smoothScroll.paginate = Site.currentPage.paginate;
        Site.smoothScroll.paginateModifier = Site.currentPage.paginateModifier || 1;
        Site.smoothScroll.enableScrolling();
        window.scrollTo(0, this.endingYOffset);
        Site.smoothScroll.reset();
        Ribbon.drawArea = Site.currentPage.ribbonDrawArea();
        Site.currentPage.addListeners();
        Site.currentPage.didFinishTransition && Site.currentPage.didFinishTransition(!0, a);
        document.body.classList.remove("transitioning");
        this.done();
        (a = window.gtag || !1) && a("config", "UA-154318312-1", { page_path: location.pathname, page_title: document.title });
    },
});
var Studio = function () {
    var a = this;
    a.pageName = "studio";
    a.sectionName = "studio";
    a.pageType = Site.PageType.STUDIO;
    a.ribbonMode = Ribbon.Mode.CASE_DETAIL;
    a.ribbonColor = null;
    a.paginate = !1;
    a.initialYOffset = null;
    a.docElemStyle = null;
    a.transitionProp = null;
    a.logo = null;
    a.follow = null;
    a.followIcons = null;
    a.theStudio = null;
    a.splitText = null;
    a.introParagraphs = null;
    a.intro = null;
    a.teamVision = null;
    a.visionSplitText = null;
    a.visionCopy = null;
    a.logoMark = null;
    a.descriptionParagraphs = null;
    a.studioDescription = null;
    a.partnersHeader = null;
    a.partners = null;
    a.partnersSplitText = null;
    a.pastPresent = null;
    a.pastPresentSplitText = null;
    a.listElement = null;
    a.listItemElements = null;
    a.projectsLogo = null;
    a.projectsHeader = null;
    a.projectsSplitText = null;
    a.projectsDash = null;
    a.projectsIntro = null;
    a.teamLogo = null;
    a.teamHeader = null;
    a.teamSplitText = null;
    a.teamDash = null;
    a.teamIntro = null;
    a.nowHiringLink = null;
    a.gridItems = null;
    a.rallyCampTitle = null;
    a.rallyCampTitleCA = null;
    a.rallyCampTitleMP = null;
    a.rallyCampTitleDash = null;
    a.caParagraphs = null;
    a.dateElements = null;
    a.monthSplitTexts = null;
    a.campPhotos = null;
    a.treeLogos = null;
    a.viewTop = null;
    a.viewBot = null;
    a.addListeners = function () {
        window.addEventListener("load", d);
        window.addEventListener("scroll", f);
        window.addEventListener("resize", c);
    };
    a.removeListeners = function () {
        window.removeEventListener("load", d);
        window.removeEventListener("scroll", f);
        window.removeEventListener("resize", c);
    };
    a.willBeginTransition = function (c) {
        c &&
            setTimeout(function () {
                a.animateHeader();
                f();
            }, 650);
    };
    a.didFinishTransition = function (a) {};
    a.destroy = function () {
        a = null;
    };
    a.prepareForIntro = function () {
        var c = a.getTransitionableElements(),
            d;
        for (d in c) c.hasOwnProperty(d) && c[d].classList.add("transition-in");
        Ribbon.setMode(Ribbon.Mode.HOME);
    };
    a.playIntro = function () {
        var c = a.getTransitionableElements(),
            d;
        for (d in c) c.hasOwnProperty(d) && (c[d].classList.add("transitioning"), c[d].classList.remove("transition-in"));
        setTimeout(function () {
            for (var d in c) c.hasOwnProperty(d) && c[d].classList.remove("transitioning");
            a.animateHeader();
            f();
        }, 760);
        Ribbon.transitionToMode(Ribbon.Mode.CASE_DETAIL);
    };
    a.ribbonDrawArea = function () {
        return { top: 0, height: Math.max(1.125 * innerWidth, 1600) };
    };
    a.keepLogoFixed = !1;
    a.shouldScrollToTopForTransitionTo = function (a) {
        return !0;
    };
    a.scrollPositionForTransitionFrom = function (a) {
        return 0;
    };
    a.getIncomingTransitionType = function (a) {
        return Transition.TransitionType.VERTICAL;
    };
    a.getTransitionableElements = function (a, c) {
        a = {};
        a["studio-page"] = document.getElementsByClassName("studio-page")[0].firstElementChild;
        return a;
    };
    var d = function () {},
        f = function () {
            a.animateOnscreenContent();
            0 < pageYOffset ? Menu.showArrow() : Menu.hideArrow();
            for (var c = a.darkSections.length, d = 0; d < c; d++) {
                var f = a.darkSections[d];
                if (pageYOffset > f.top - 52 && pageYOffset < f.bottom - 52) {
                    Menu.showLightButtonStyle();
                    return;
                }
            }
            Menu.showDarkButtonStyle();
        },
        c = function () {
            a.animateOnscreenContent();
            a.calculateDarkSections();
        };
    a.calculateDarkSections = function () {
        a.darkSections = [];
        Array.from(a.element.getElementsByClassName("section")).forEach(function (c) {
            if (c.classList.contains("dark")) {
                var d = c.getBoundingClientRect();
                c = c.parentNode.getBoundingClientRect();
                a.darkSections.push({ top: d.top - c.top, bottom: d.bottom - c.top });
            }
        });
    };
    a.animateHeader = function () {
        a.theStudio.style.visibility = "";
        new TimelineLite().staggerFrom(a.splitText.chars, 1, { opacity: 0, y: 300, rotationX: -100, rotationZ: 20, delay: 0.2, transformOrigin: "0% 50% -60", ease: Expo.easeOut }, 0.02, "+=0");
        a.theStudio.classList.add("animate");
    };
    a.animateOnscreenContent = function (c) {
        var d = window.pageYOffset + window.innerHeight - 25,
            f = a.getCoords(a.intro).top - a.initialYOffset,
            g = a.getCoords(a.middleHeader).top;
        a.getCoords(a.visionCopy);
        var r = a.getCoords(a.partnersHeader).top;
        a.getCoords(a.listElement);
        var k = a.getCoords(a.projectsLogo).top - a.initialYOffset,
            q = a.getCoords(a.projectsHeader).top;
        a.getCoords(a.projectsIntro);
        var v = a.getCoords(a.teamLogo).top - a.initialYOffset,
            y = a.getCoords(a.teamHeader).top;
        a.getCoords(a.teamIntro);
        a.getCoords(a.nowHiringLink);
        for (var C = a.getCoords(a.rallyCampTitle).top - a.initialYOffset, z = a.getCoords(a.rallyCampTitleCA).top - a.initialYOffset, p = 0; p < a.followIcons.length; p++) {
            var u = a.followIcons[p];
            a.getCoords(u).top - a.initialYOffset < d && !u.classList.contains("animate") && ((u.style[a.transitionProp + "Delay"] = 70 * p + 400 + "ms"), u.classList.add("animate"));
        }
        for (p = 0; p < a.introParagraphs.length; p++) (u = a.introParagraphs[p]), a.getCoords(u).top - a.initialYOffset < d && !u.classList.contains("animate") && a.animateBasicElement(u, 100 * p, c);
        f < d && !a.intro.classList.contains("animate") && a.intro.classList.add("animate");
        g < d &&
            !a.middleHeader.classList.contains("animate") &&
            !a.logoMark.classList.contains("animate") &&
            (a.animateBasicElement(a.visionCopy, 0, c),
            a.animateBasicElement(a.middleHeader, 40, c),
            a.animateBasicElement(a.logoMark, 80, c),
            a.animateSplitText(a.teamVision, a.visionSplitText, 100, 0, c),
            (f = c ? a.initialDelay(a.treeLogos[0].element, 0.6) + 80 : 80),
            a.treeLogos[0].animate(f));
        for (f = 0; f < a.descriptionParagraphs.length; f++) (g = a.descriptionParagraphs[f]), a.getCoords(g).top - a.initialYOffset < d && !g.classList.contains("animate") && a.animateBasicElement(g, (f % 2) * 70, c);
        if (r < d && !a.partnersHeader.classList.contains("animate")) {
            a.animateBasicElement(a.partnersHeader, 0, c);
            a.animateSplitText(a.partners, a.partnersSplitText, 100, 0, c);
            a.animateSplitText(a.pastPresent, a.pastPresentSplitText, 100, 0.18, c);
            r = c ? a.initialDelay(a.listItemElements[0], 0.6, 0) : 0;
            for (f = 0; f < a.listItemElements.length; f++) (g = a.listItemElements[f]), (g.style[a.transitionProp + "Delay"] = r + 55 * Math.floor(f / 2) + 45 * Math.max(Math.floor((f + 1) / 2), 0) + "ms"), g.classList.add("is-moved");
            r = document.getElementById("partners-dash");
            a.animateBasicElement(r, 800, c);
        }
        k < d && !a.projectsLogo.classList.contains("animate") && (a.animateBasicElement(a.projectsLogo, 0, c), (f = c ? a.initialDelay(a.treeLogos[1].element, 0.6) : 0), a.treeLogos[1].animate(f));
        q < d &&
            !a.projectsHeader.classList.contains("animate") &&
            (a.projectsHeader.classList.add("animate"), a.animateSplitText(a.projectsHeader, a.projectsSplitText, 200, 0, c), a.animateBasicElement(a.projectsDash, 40, c), a.animateBasicElement(a.projectsIntro, 80, c));
        for (k = 0; k < a.gridItems.length; k++)
            (q = a.gridItems[k]),
                a.getCoords(q).top - a.initialYOffset < d && !q.classList.contains("animate") && ((r = c ? a.initialDelay(q, 0.6) : 0), (q.style[a.transitionProp + "Delay"] = (k % 2) * 150 + r + "ms"), q.classList.add("animate"));
        v < d && !a.teamLogo.classList.contains("animate") && (a.animateBasicElement(a.teamLogo, 0, c), (f = c ? a.initialDelay(a.treeLogos[2].element, 0.6) : 0), a.treeLogos[2].animate(f));
        y < d &&
            !a.teamHeader.classList.contains("animate") &&
            (a.animateBasicElement(a.teamHeader, 0, c),
            a.animateSplitText(a.teamHeader, a.teamSplitText, 200, 0, c),
            a.animateBasicElement(a.teamDash, 500, c),
            a.animateBasicElement(a.teamIntro, 600, c),
            a.animateBasicElement(a.nowHiringLink, 800, c));
        C < d && !a.rallyCampTitle.classList.contains("animate") && a.animateBasicElement(a.rallyCampTitle, 0, c);
        z < d && !a.rallyCampTitleCA.classList.contains("animate") && (a.animateBasicElement(a.rallyCampTitleCA, 0, c), a.animateBasicElement(a.rallyCampTitleMP, 0, c), a.animateBasicElement(a.rallyCampTitleDash, 0, c));
        for (f = 0; f < a.caParagraphs.length; f++) (v = a.caParagraphs[f]), a.getCoords(v).top - a.initialYOffset < d && !v.classList.contains("animate") && a.animateBasicElement(v, 50 * f, c);
        Array.from(a.dateElements).forEach(function (f) {
            if (a.getCoords(f).top < d && !f.classList.contains("animate")) {
                a.animateBasicElement(f, 0, c);
                a.animateSplitText(f.getElementsByTagName("h1")[0], a.monthSplitTexts[f.id], 100, 0, c);
                var g = f.getElementsByTagName("h5");
                f = f.getElementsByTagName("a")[0];
                a.animateBasicElement(g[0], 200, c);
                1 < g.length && a.animateBasicElement(g[1], 300, c);
                f && a.animateBasicElement(f, 400, c);
            }
        });
        a.campPhotos.forEach(function (f) {
            for (var g = 0; g < f.length; g++) {
                var h = f[g];
                if (a.getCoords(h.element).top - a.initialYOffset < d && !h.element.classList.contains("animate")) {
                    a.animateBasicElement(h.element, (g % 2) * 80, c);
                    var k = c ? a.initialDelay(h.element, 0.6) : 0;
                    h.load(400 + (g % 2) * 80 + k);
                }
            }
        });
    };
    a.getCoords = function (a) {
        a = a.getBoundingClientRect();
        var c = document.body,
            d = document.documentElement;
        return { top: Math.round(a.top + (window.pageYOffset || d.scrollTop || c.scrollTop) - (d.clientTop || c.clientTop || 0)) };
    };
    a.animateSplitText = function (c, d, f, l, r) {
        r = r ? a.initialDelay(c, 0.56 / 1e3, 0) : 0;
        f = f ? f : 100;
        c.style.visibility = "";
        0 <= r && new TimelineLite().staggerFrom(d.chars, 1, { opacity: 0, y: f, rotationX: -100, rotationZ: 20, delay: Math.max(0.2 + r + l, 0.2), transformOrigin: "0% 50% -60", ease: Expo.easeOut }, 0.02, "+=0");
    };
    a.animateBasicElement = function (c, d, f) {
        c.classList.contains("animate") ||
            ((d = d ? d : 0),
            (f = f ? a.initialDelay(c, 0.6) : 0),
            (c.style[a.transitionProp + "Delay"] = d + f + "ms"),
            requestAnimationFrame(function () {
                c.classList.add("animate");
            }));
    };
    a.initialDelay = function (c, d, f) {
        void 0 === f && (f = a.initialYOffset);
        var g = window.pageYOffset;
        c = a.getCoords(c).top - f;
        return d * (c - g);
    };
    (function () {
        a.element = document.getElementsByClassName("studio-page")[0];
        a.ribbonColor = { primary: { r: 255, g: 110, b: 99 }, secondary: { r: 204, g: 88, b: 80 } };
        a.initialYOffset = 300;
        a.viewTop = window.pageYOffset;
        a.viewBot = a.viewTop + window.innerHeight - 25;
        a.docElemStyle = document.documentElement.style;
        a.transitionProp = "string" == typeof a.docElemStyle.transition ? "transition" : "WebkitTransition";
        a.logo = document.getElementById("logo");
        a.follow = document.getElementById("follow-title");
        a.followIcons = document.getElementsByClassName("follow-icon");
        a.theStudio = document.getElementById("studio");
        a.theStudio.style.visibility = "hidden";
        a.splitText = new SplitText(a.theStudio, { type: "chars,words", wordsClass: "word" });
        a.splitText.split({ type: "chars,words", wordsClass: "word" });
        a.introParagraphs = document.getElementsByClassName("intro-paragraph");
        a.intro = document.getElementById("intro");
        var c = Array.from(document.getElementsByClassName("tree-logo"));
        a.treeLogos = c.map(function (a) {
            return new TreeLogo(a);
        });
        a.middleHeader = document.getElementById("vision-header");
        a.visionCopy = a.middleHeader.getElementsByTagName("p")[0];
        a.teamVision = document.getElementById("vision");
        a.teamVision.style.visibility = "hidden";
        a.visionSplitText = new SplitText(a.teamVision, { type: "chars,words" });
        a.visionSplitText.split({ type: "chars,words", wordsClass: "word" });
        a.logoMark = document.getElementById("logo-mark");
        a.descriptionParagraphs = document.getElementById("description-wrapper").getElementsByClassName("content");
        a.studioDescription = document.getElementById("studio-description");
        a.partnersHeader = document.getElementById("studio-past-present");
        a.partners = document.getElementById("partners");
        a.partners.style.visibility = "hidden";
        a.partnersSplitText = new SplitText(a.partners, { type: "chars,words" });
        a.partnersSplitText.split({ type: "chars,words", wordsClass: "word" });
        a.pastPresent = document.getElementById("past-present");
        a.pastPresent.style.visibility = "hidden";
        a.pastPresentSplitText = new SplitText(a.pastPresent, { type: "chars,words" });
        a.pastPresentSplitText.split({ type: "chars,words", wordsClass: "word" });
        a.listElement = document.getElementById("partner-list");
        a.listItemElements = document.getElementsByClassName("list-item");
        a.projectsLogo = document.getElementById("projects-logo");
        a.projectsHeader = document.getElementById("projects-header");
        a.projectsSplitText = new SplitText(a.projectsHeader, { type: "chars,words" });
        a.projectsSplitText.split({ type: "chars,words", wordsClass: "word" });
        a.projectsHeader.style.visibility = "hidden";
        a.projectsDash = document.getElementById("projects-dash");
        a.projectsIntro = document.getElementById("projects-intro");
        a.teamLogo = document.getElementById("team-logo");
        a.teamHeader = document.getElementById("team-header");
        a.teamHeader.style.visibility = "hidden";
        a.teamSplitText = new SplitText(a.teamHeader, { type: "chars,words" });
        a.teamSplitText.split({ type: "chars,words", wordsClass: "word" });
        a.teamDash = document.getElementById("team-dash");
        a.teamIntro = document.getElementById("team-intro");
        a.nowHiringLink = document.getElementById("now-hiring");
        a.gridItems = document.getElementsByClassName("grid-item");
        a.rallyCampTitle = document.getElementById("rally-camp-title");
        a.rallyCampTitleCA = document.getElementById("ca");
        a.rallyCampTitleMP = document.getElementById("mp");
        a.rallyCampTitleDash = document.getElementById("camp-dash");
        a.caParagraphs = document.getElementsByClassName("ca-paragraph");
        a.dateElements = document.getElementsByClassName("date");
        a.monthSplitTexts = {};
        Array.from(a.dateElements).forEach(function (c) {
            var d = c.getElementsByTagName("h1")[0];
            d.style.visibility = "hidden";
            d = new SplitText(d, { type: "chars" });
            d.split({ type: "chars" });
            a.monthSplitTexts[c.id] = d;
        });
        c = Array.from(document.getElementsByClassName("camp"));
        a.campPhotos = c.map(function (a) {
            return Array.from(a.getElementsByClassName("photo-card")).map(function (a) {
                return new CampPhoto(a);
            });
        });
        a.logo.classList.add("animate");
        a.animateOnscreenContent(!0);
        a.calculateDarkSections();
        Site.startRendering();
    })();
};
var CampPhoto = function (a) {
    this.element = a;
    "DIV" == a.tagName && ((this.wrapper = a.getElementsByClassName("photo-wrapper")[0]), (this.img = this.wrapper.getElementsByTagName("img")[0]));
    var d = this;
    this.load = function (a) {
        this.wrapper &&
            setTimeout(
                function () {
                    d.img.onload = d.onload;
                    d.img.src = d.img.dataset.src;
                },
                a ? a : 0
            );
    };
    this.onload = function () {
        d.wrapper.classList.add("loaded");
    };
};
var TreeLogo = function (a) {
    var d = this;
    d.element = null;
    d.trees = [];
    d.lines = [];
    d.transitionProp = "string" == typeof document.documentElement.style.transition ? "transition" : "WebkitTransition";
    this.animate = function (a) {
        a = a ? a : 0;
        d.trees.forEach(function (c, f) {
            c.style[d.transitionProp + "Delay"] = a + 700 * f + "ms";
            c.setAttribute("class", "tree-form animate");
        });
        d.lines.forEach(function (c) {
            c.style[d.transitionProp + "Delay"] = a + "ms";
            c.setAttribute("class", "logo-lines animate");
        });
    };
    this.destroy = function () {
        d = null;
    };
    (function (a) {
        d.element = a;
        a.getElementsByClassName && ((d.trees = Array.from(a.getElementsByClassName("tree-form"))), (d.lines = Array.from(a.getElementsByClassName("logo-lines"))));
    })(a);
};
var Form = function () {
    var a = this;
    a.pageName = "contact";
    a.sectionName = "contact";
    a.pageType = Site.PageType.CONTACT;
    a.ribbonMode = Ribbon.Mode.CASE_DETAIL;
    a.ribbonColor = null;
    a.paginate = !1;
    a.sayHello = null;
    a.splitText = null;
    a.formSection = null;
    a.form = null;
    a.submit = null;
    a.name = null;
    a.company = null;
    a.timeframe = null;
    a.description = null;
    a.email = null;
    a.ps = null;
    a.budget = null;
    a.inputs = null;
    a.successSection = null;
    a.inputBlocks = null;
    a.animatedInputs = null;
    a.thankYou = null;
    a.thanksSplit = null;
    a.addListeners = function () {
        window.addEventListener("scroll", f);
        for (var c = 0; c < a.inputs.length; c++) a.inputs[c].addEventListener("input", d);
        submit.onclick = function (c) {
            c.preventDefault();
            a.formSubmit();
        };
        for (c = 0; c < a.animatedInputs.length; c++) a.addFocusListener(a.animatedInputs[c], "border");
    };
    a.removeListeners = function () {
        window.removeEventListener("scroll", f);
        for (var c = 0; c < a.inputs.length; c++) a.inputs[c].removeEventListener("input", d);
    };
    a.willBeginTransition = function (c) {
        c
            ? (Menu.hireCta.classList.add("hidden"),
              setTimeout(function () {
                  a.animateHeader();
                  f();
              }, 650))
            : Menu.hireCta.classList.remove("hidden");
    };
    a.didFinishTransition = function (a) {};
    a.destroy = function () {
        a = null;
    };
    a.prepareForIntro = function () {
        Menu.hireCta.classList.add("hidden");
        Menu.hireCta.style.visibility = "hidden";
        setTimeout(function () {
            Menu.hireCta.style.visibility = "visible";
        }, 1e3);
        var c = a.getTransitionableElements(),
            d;
        for (d in c) c.hasOwnProperty(d) && c[d].classList.add("transition-in");
        Ribbon.setMode(Ribbon.Mode.HOME);
    };
    a.playIntro = function () {
        var c = a.getTransitionableElements(),
            d;
        for (d in c) c.hasOwnProperty(d) && (c[d].classList.add("transitioning"), c[d].classList.remove("transition-in"));
        setTimeout(function () {
            for (var d in c) c.hasOwnProperty(d) && c[d].classList.remove("transitioning");
            a.animateHeader();
            f();
        }, 760);
        Ribbon.transitionToMode(Ribbon.Mode.CASE_DETAIL);
    };
    a.ribbonDrawArea = function () {
        return { top: 0, height: Math.max(1.125 * innerWidth, 1600) };
    };
    a.keepLogoFixed = !0;
    a.shouldScrollToTopForTransitionTo = function (a) {
        return !0;
    };
    a.scrollPositionForTransitionFrom = function (a) {
        return 0;
    };
    a.getIncomingTransitionType = function (a) {
        return Transition.TransitionType.VERTICAL;
    };
    a.getTransitionableElements = function (a, d) {
        a = {};
        a["form-page"] = document.getElementsByClassName("form-page")[0];
        return a;
    };
    a.getTargetParent = function (a, d) {
        for (; a && !a.classList.contains(d); ) a = a.parentNode;
        return a;
    };
    a.addFocusListener = function (c, d) {
        var f = a.getTargetParent(c, d);
        f &&
            (c.addEventListener("focus", function () {
                f.classList.add("animate");
            }),
            c.addEventListener("blur", function () {
                f.classList.remove("animate");
            }));
    };
    a.animateHeader = function () {
        a.sayHello.style.visibility = "";
        new TimelineLite().staggerFrom(a.splitText.chars, 1, { opacity: 0, y: 900, rotationX: -100, rotationZ: 20, delay: 0.2, transformOrigin: "0% 50% -60", ease: Expo.easeOut }, 0.02, "+=0");
        a.sayHello.classList.add("animate");
    };
    a.formSubmit = function () {
        var c =
            "https://docs.google.com/forms/u/1/d/e/1FAIpQLSfJ0LkUxTBr8XEh3q-I90py_970_Za5FvPm10lGou4qArkaCQ/formResponse?entry.619495946=" +
            a.name.value +
            "&entry.1568692445=" +
            a.company.value +
            "&entry.1981817418=" +
            a.description.value +
            "&entry.325422432=" +
            a.budget.value +
            "&entry.2093728774=" +
            a.timeframe.value +
            "&entry.870994939=" +
            String(a.email.value) +
            "&entry.683772607=" +
            a.ps.value +
            "&submit=4298901126894771775";
        a.inputsRemoveClass("error");
        a.errorCheck();
        "" != a.name.value &&
            null != a.name.value &&
            "" != a.company.value &&
            null != a.company.value &&
            "" != a.description.value &&
            null != a.description.value &&
            "" != a.budget.value &&
            null != a.budget.value &&
            "" != a.timeframe.value &&
            null != a.timeframe.value &&
            "" != String(a.email.value) &&
            null != String(a.email.value) &&
            ((a.form.action = c),
            a.formSection.classList.add("hidden"),
            (a.formSection.style.visibility = "hidden"),
            a.animateSuccessMessage(),
            setTimeout(function () {
                a.form.reset();
                a.form.submit();
            }, 1e3));
    };
    a.animateSuccessMessage = function () {
        Site.smoothScroll.scrollToY(0, !0);
        a.successSection.classList.add("visible");
        a.thankYou.style.visibility = "";
        new TimelineLite().staggerFrom(a.thanksSplit.chars, 1, { opacity: 0, y: 900, rotationX: -100, rotationZ: 20, delay: 0.2, transformOrigin: "0% 50% -60", ease: Expo.easeOut }, 0.02, "+=0");
    };
    a.errorCheck = function () {
        for (var c = 0; c < a.inputs.length; c++) ("" != String(a.inputs[c].value) && null != String(a.inputs[c].value)) || a.inputs[c].classList.add("error");
    };
    var d = function () {
        "" != a.name.value &&
        null != a.name.value &&
        "" != a.company.value &&
        null != a.company.value &&
        "" != a.description.value &&
        null != a.description.value &&
        "" != a.budget.value &&
        null != a.budget.value &&
        "" != a.timeframe.value &&
        null != a.timeframe.value &&
        "" != String(a.email.value) &&
        null != String(a.email.value)
            ? (a.submit.classList.add("active"), a.submit.classList.remove("disabled"))
            : a.submit.classList.contains("active") && (a.submit.classList.remove("active"), a.submit.classList.add("disabled"));
    };
    a.inputsRemoveClass = function (c) {
        for (var d = 0; d < a.inputs.length; d++) a.inputs[d].classList.remove(c);
    };
    var f = function () {
        for (var c = window.pageYOffset, d = c + window.innerHeight - 25, f = 0; f < a.inputBlocks.length; f++)
            a.getCoords(a.inputBlocks[f]).top - 1200 < d && !a.inputBlocks[f].classList.contains("animate") && a.inputBlocks[f].classList.add("animate");
        0 < c ? Menu.showArrow() : Menu.hideArrow();
    };
    a.getCoords = function (a) {
        a = a.getBoundingClientRect();
        var c = document.body,
            d = document.documentElement;
        return { top: Math.round(a.top + (window.pageYOffset || d.scrollTop || c.scrollTop) - (d.clientTop || c.clientTop || 0)) };
    };
    a.formSection = document.getElementById("form-section");
    a.successSection = document.getElementById("success");
    a.sayHello = document.getElementById("hello");
    a.thankYou = document.getElementById("thanks");
    a.form = document.getElementById("form");
    a.submit = document.getElementById("submit");
    a.budget = document.getElementById("budget-input");
    a.name = document.getElementById("name-input");
    a.company = document.getElementById("company-input");
    a.timeframe = document.getElementById("timeframe-input");
    a.description = document.getElementById("description-input");
    a.email = document.getElementById("email-input");
    a.ps = document.getElementById("ps-input");
    a.inputs = [];
    a.inputs.push(a.name, a.budget, a.company, a.timeframe, a.description, a.email);
    a.inputBlocks = document.getElementsByClassName("input-block");
    a.animatedInputs = [];
    a.animatedInputs.push(a.name, a.ps, a.company, a.timeframe, a.description, a.email);
    a.ribbonColor = { primary: { r: 255, g: 110, b: 99 }, secondary: { r: 204, g: 88, b: 80 } };
    a.sayHello.style.visibility = "hidden";
    a.splitText = new SplitText(a.sayHello, { type: "chars" });
    a.splitText.split({ type: "chars" });
    a.thankYou.style.visibility = "hidden";
    a.thanksSplit = new SplitText(a.thankYou, { type: "chars,words" });
    a.thanksSplit.split({ type: "chars,words", wordClass: "word" });
};
var JobListing = function (a) {
    var d = this;
    d.pageName = null;
    d.pageType = Site.PageType.JOB_LISTING;
    d.ribbonMode = Ribbon.Mode.CASE_DETAIL;
    d.paginate = !1;
    d.workingPhotos = [];
    d.darkSections = [];
    d.prepareForIntro = function () {
        var a = d.getTransitionableElements(),
            c;
        for (c in a) a.hasOwnProperty(c) && a[c].classList.add("transition-in");
        Ribbon.setMode(Ribbon.Mode.HOME);
    };
    d.willBeginTransition = function (a) {
        a &&
            setTimeout(function () {
                f();
            }, 650);
    };
    d.didFinishTransition = function (a) {};
    d.playIntro = function () {
        d.willBeginTransition(!0);
        var a = d.getTransitionableElements(),
            c;
        for (c in a) a.hasOwnProperty(c) && (a[c].classList.add("transitioning"), a[c].classList.remove("transition-in"));
        setTimeout(function () {
            for (var c in a) a.hasOwnProperty(c) && a[c].classList.remove("transitioning");
            f();
        }, 760);
        Ribbon.transitionToMode(Ribbon.Mode.CASE_DETAIL);
    };
    d.getIncomingTransitionType = function (a) {
        console.log("Hi from Job Listing", a.pageType);
        return Transition.TransitionType.VERTICAL;
    };
    d.getTransitionableElements = function (a, c) {
        a = {};
        a[d.pageName] = d.element;
        return a;
    };
    d.willBeginTransition = function (a, c) {
        a && ((d.title.style.visibility = ""), new TimelineLite().staggerFrom(d.titleSplit.chars, 1, { opacity: 0, y: 300, rotationX: -100, rotationZ: 20, delay: 0.2, transformOrigin: "0% 50% -60", ease: Expo.easeOut }, 0.02, "+=0"));
    };
    d.destroy = function () {
        d.mobileSlideshow.destroy();
        d = null;
    };
    d.addListeners = function () {
        addEventListener("scroll", f);
        addEventListener("resize", c);
    };
    d.removeListeners = function () {
        removeEventListener("scroll", f);
        removeEventListener("resize", c);
    };
    d.shouldScrollToTopForTransitionTo = function (a) {
        return !0;
    };
    d.ribbonDrawArea = function () {
        return { top: 0, height: Math.max(1.125 * innerWidth, 1600) };
    };
    d.keepLogoFixed = !1;
    var f = function (a) {
            0 < pageYOffset ? Menu.showArrow() : Menu.hideArrow();
            g(pageYOffset);
            var c = window.pageYOffset + window.innerHeight - 25;
            d.workingPhotos.forEach(function (a, f) {
                d.getCoords(a.element).top < c && !a.element.classList.contains("animate") && (a.element.classList.add("animate"), a.load(400 + 80 * f));
            });
        },
        c = throttle(function (a, f) {
            d.calculateDarkSections();
            d.layoutWorkingPhotos();
            f ||
                setTimeout(function () {
                    c(a, !0);
                }, 500);
        }, 250);
    d.calculateDarkSections = function () {
        d.darkSections = [];
        Array.from(d.element.getElementsByClassName("section")).forEach(function (a) {
            if (a.classList.contains("dark")) {
                var c = a.getBoundingClientRect();
                a = a.parentNode.getBoundingClientRect();
                d.darkSections.push({ top: c.top - a.top, bottom: c.bottom - a.top });
            }
        });
    };
    d.layoutWorkingPhotos = function () {
        var a = d.workingP0.getBoundingClientRect(),
            c = d.workingP1.getBoundingClientRect(),
            f = d.workingAtRally.getBoundingClientRect(),
            g = d.workingPhotos[0].element,
            k = d.workingPhotos[1].element,
            q = d.workingPhotos[2].element,
            v = d.workingPhotos[3].element,
            y = k.getBoundingClientRect(),
            C = q.getBoundingClientRect(),
            z = a.bottom - f.top;
        a = c.top - f.top;
        c = c.bottom - f.top;
        switch (BreakPoints.currentMajorBreakPoint()) {
            case BreakPoints.MajorBreakPoints.D:
            case BreakPoints.MajorBreakPoints.C:
                f = z + 140;
                g.style.top = f + "px";
                k.style.top = f - (268 / 352) * y.height + "px";
                q.style.top = a - C.height - 132 + "px";
                v.style.top = c + 124 + "px";
                break;
            case BreakPoints.MajorBreakPoints.B:
                (g.style.top = z + 140 + "px"), (k.style.top = a - y.height - 145 + "px");
        }
    };
    d.getCoords = function (a) {
        a = a.getBoundingClientRect();
        var c = document.body,
            d = document.documentElement;
        return { top: Math.round(a.top + (window.pageYOffset || d.scrollTop || c.scrollTop) - (d.clientTop || c.clientTop || 0)) };
    };
    var g = function (a) {
        for (var c = d.darkSections.length, f = 0; f < c; f++) {
            var g = d.darkSections[f];
            if (a > g.top - 52 && a < g.bottom - 52) {
                Menu.showLightButtonStyle();
                return;
            }
        }
        Menu.showDarkButtonStyle();
    };
    (function (a) {
        d.element = a;
        d.pageName = a.dataset.slug;
        d.sectionName = a.dataset.slug;
        d.primaryColor = Color.hexToRgb(a.dataset.primarycolor);
        d.secondaryColor = Color.hexToRgb(a.dataset.secondarycolor);
        d.ribbonColor = { primary: d.primaryColor, secondary: d.secondaryColor };
        var c = Array.from(d.element.getElementsByClassName("photo-card"));
        d.workingPhotos = c.map(function (a) {
            return new CampPhoto(a);
        });
        d.workingAtRally = a.getElementsByClassName("working-at-rally")[0];
        d.workingP0 = d.workingAtRally.getElementsByTagName("p")[0];
        d.workingP1 = d.workingAtRally.getElementsByTagName("p")[1];
        Site.startRendering();
        d.calculateDarkSections();
        d.layoutWorkingPhotos();
        d.title = a.getElementsByTagName("h1")[0];
        d.titleSplit = new SplitText(d.title, { type: "chars,words", wordsClass: "word" });
        d.title.style.visibility = "hidden";
        d.mobileSlideshow = new Slideshow(a.getElementsByClassName("polaroids-wrapper")[0], function (a, c) {
            a *= c.length - 1;
            for (var d = Math.floor(a), f = Math.ceil(a), g = a - d, h = 1 - g, l = 1 - 0.85, n = 0; n < c.length; n++)
                if (n == d || n == f) {
                    var p = n == d ? h : g,
                        r = n == d ? -1 : 1;
                    if (0.5 > p) {
                        var E = 2 * p;
                        var M = 0;
                        var w = 15 * r;
                        var L = 0;
                        var B = 3;
                    } else (E = 2 * (p - 0.5)), (M = 15 * r), (w = 0 - M), (L = 3), (B = -3);
                    var O = 0.85 + l * p,
                        P = Ease.easeOut.sine;
                    M += w * P(E);
                    L += B * P(E);
                    c[n].element.style.transform = "scale3d(" + O + "," + O + ",1.0) perspective(750px) rotateY(" + M + "deg) rotateX(" + L + "deg) translateY(" + (5 + -5 * p) + "%) translateX(" + -1 * r * (1 - p) + "%)";
                } else c[n].element.style.transform = "scale(0.85) translateY(5%) translateX(" + -1 * (n < a ? -1 : 1) + "%)";
        });
    })(a);
};




function frontPageReviewsSlider() {
    console.log( "????????????, function frontPageReviewsSlider" );
    // front_page_reviews Slider
var front_page_reviews = document.getElementById("front-page-reviews");
var flkty = new Flickity( front_page_reviews, {
  // options
  wrapAround: true,
    pageDots: true
//   cellAlign: 'left',
//   contain: true
});
};


function frontPageFeedbackForm() {
    console.log( "????????????, function frontPageFeedbackForm" );
    
    var FrontPageFeedbackForm = document.getElementById( 'front-page-feedback-form' );
    
  // Return early if the navigation don't exist.
  if ( ! FrontPageFeedbackForm ) {
    return;
  }
  
  var FrontPageFeedbackFormInputs = FrontPageFeedbackForm.querySelectorAll( '.border-input' );
  
  // Return early if the button don't exist.
  if ( 'undefined' === typeof FrontPageFeedbackFormInputs ) {
    return;
  };
  
  // Toggle focus each time a menu link is focused or blurred.
  for ( const FrontPageFeedbackFormInput of FrontPageFeedbackFormInputs ) {
    FrontPageFeedbackFormInput.addEventListener( 'focus', inputFocus, true );
    FrontPageFeedbackFormInput.addEventListener( 'blur', inputFocus, true );
  };
  
  };
  
  function inputFocus() {
    var borderWrap = this.parentNode;
    borderWrap.classList.toggle( 'animate' );    
  };

  console.log( "test-front.js" );