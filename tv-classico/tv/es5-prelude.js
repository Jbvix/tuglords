/* Polyfills mínimos para navegadores ES5 (Samsung Orsay/Maple, TVs antigas). */
if (!Array.prototype.find) { Array.prototype.find = function (f, t) { for (var i = 0; i < this.length; i++) if (f.call(t, this[i], i, this)) return this[i]; }; }
if (!Array.prototype.findIndex) { Array.prototype.findIndex = function (f, t) { for (var i = 0; i < this.length; i++) if (f.call(t, this[i], i, this)) return i; return -1; }; }
if (!Array.prototype.includes) { Array.prototype.includes = function (v) { for (var i = 0; i < this.length; i++) if (this[i] === v || (v !== v && this[i] !== this[i])) return true; return false; }; }
if (!Array.prototype.fill) { Array.prototype.fill = function (v) { for (var i = 0; i < this.length; i++) this[i] = v; return this; }; }
if (!Array.from) { Array.from = function (a, m) { var r = []; for (var i = 0; i < a.length; i++) r.push(m ? m(a[i], i) : a[i]); return r; }; }
if (!String.prototype.includes) { String.prototype.includes = function (s, p) { return this.indexOf(s, p || 0) !== -1; }; }
if (!String.prototype.startsWith) { String.prototype.startsWith = function (s, p) { p = p || 0; return this.substr(p, s.length) === s; }; }
if (!String.prototype.repeat) { String.prototype.repeat = function (n) { var r = ''; for (var i = 0; i < n; i++) r += this; return r; }; }
if (!String.prototype.padStart) { String.prototype.padStart = function (n, c) { var s = String(this); c = c || ' '; while (s.length < n) s = c + s; return s; }; }
if (!Object.assign) { Object.assign = function (t) { for (var i = 1; i < arguments.length; i++) { var s = arguments[i]; if (s) for (var k in s) if (Object.prototype.hasOwnProperty.call(s, k)) t[k] = s[k]; } return t; }; }
if (!Object.values) { Object.values = function (o) { var r = []; for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) r.push(o[k]); return r; }; }
if (!Object.entries) { Object.entries = function (o) { var r = []; for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) r.push([k, o[k]]); return r; }; }
if (!Number.isNaN) { Number.isNaN = function (v) { return v !== v; }; }
if (typeof Symbol === 'undefined') { window.Symbol = function (d) { return '@@' + d; }; window.Symbol.iterator = '@@iterator'; }
