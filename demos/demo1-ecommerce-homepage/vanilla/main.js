// ==================== 问题1: 使用本地未压缩的大图片 ====================
// 每张图片 5.9MB，20张图片总共约 118MB
const products = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: `商品 ${i + 1}`,
  price: (Math.random() * 1000 + 100).toFixed(2),
  // 问题: 使用本地大图片，未使用懒加载
  image: `images/product_${i + 1}.jpg`
}));

// ==================== 问题4: 冗余代码 - 模拟完整引入 lodash ====================
// 这里模拟 lodash 库的所有方法，但实际上几乎不使用
const LodashHelper = (function() {
  // 完整的 lodash 方法实现（冗余代码）
  function chunk(array, size) { /* ... */ return []; }
  function compact(array) { /* ... */ return []; }
  function concat(array, ...values) { /* ... */ return []; }
  function difference(array, ...others) { /* ... */ return []; }
  function drop(array, n) { /* ... */ return []; }
  function dropRight(array, n) { /* ... */ return []; }
  function fill(array, value, start, end) { /* ... */ return []; }
  function flatten(array) { /* ... */ return []; }
  function flattenDeep(array) { /* ... */ return []; }
  function flattenDepth(array, depth) { /* ... */ return []; }
  function fromPairs(pairs) { /* ... */ return {}; }
  function head(array) { /* ... */ return undefined; }
  function indexOf(array, value, fromIndex) { /* ... */ return -1; }
  function initial(array) { /* ... */ return []; }
  function intersection(...arrays) { /* ... */ return []; }
  function join(array, separator) { /* ... */ return ''; }
  function last(array) { /* ... */ return undefined; }
  function lastIndexOf(array, value, fromIndex) { /* ... */ return -1; }
  function nth(array, n) { /* ... */ return undefined; }
  function pull(array, ...values) { /* ... */ return array; }
  function pullAll(array, values) { /* ... */ return array; }
  function reverse(array) { /* ... */ return array; }
  function slice(array, start, end) { /* ... */ return []; }
  function sortedIndex(array, value) { /* ... */ return 0; }
  function sortedLastIndex(array, value) { /* ... */ return 0; }
  function uniq(array) { /* ... */ return []; }
  function uniqBy(array, iteratee) { /* ... */ return []; }
  function unzip(array) { /* ... */ return []; }
  function zip(...arrays) { /* ... */ return []; }

  // 工具函数
  function add(augend, addend) { return a + b; }
  function ceil(number, precision) { return Math.ceil(number); }
  function divide(dividend, divisor) { return a / b; }
  function floor(number, precision) { return Math.floor(number); }
  function max(array) { return Math.max(...array); }
  function maxBy(array, iteratee) { return Math.max(...array); }
  function mean(array) { return array.reduce((a, b) => a + b, 0) / array.length; }
  function min(array) { return Math.min(...array); }
  function sum(array) { return array.reduce((a, b) => a + b, 0); }

  // 字符串函数
  function camelCase(string) { return string.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : ''); }
  function capitalize(string) { return string.charAt(0).toUpperCase() + string.slice(1); }
  function deburr(string) { return string; }
  function endsWith(string, target, position) { return string.endsWith(target, position); }
  function escape(string) { return string; }
  function kebabCase(string) { return string.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(); }
  function lowerCase(string) { return string.toLowerCase(); }
  function lowerFirst(string) { return string.charAt(0).toLowerCase() + string.slice(1); }
  function pad(string, length, chars) { return string.padStart(length, chars); }
  function padEnd(string, length, chars) { return string.padEnd(length, chars); }
  function repeat(string, n) { return string.repeat(n); }
  function replace(string, pattern, replacement) { return string.replace(pattern, replacement); }
  function snakeCase(string) { return string.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase(); }
  function split(string, separator, limit) { return string.split(separator, limit); }
  function startCase(string) { return string.replace(/[a-z]/g, (m) => m.toUpperCase()); }
  function startsWith(string, target, position) { return string.startsWith(target, position); }
  function toUpper(string) { return string.toUpperCase(); }
  function trim(string, chars) { return string.trim(); }
  function truncate(string, options) { return string.substring(0, options.length); }

  // 对象函数
  function assign(object, ...sources) { return { ...object, ...sources }; }
  function assignIn(object, ...sources) { return { ...object, ...sources }; }
  function cloneDeep(value) { return JSON.parse(JSON.stringify(value)); }
  function defaults(object, ...sources) { return { ...sources.reduce((a, b) => ({ ...a, ...b }), {}), ...object }; }
  function get(object, path, defaultValue) { return path.split('.').reduce((o, k) => o?.[k], object) ?? defaultValue; }
  function has(object, path) { return path.split('.').every(k => object && k in object); }
  function merge(object, ...sources) { return Object.assign(object, ...sources); }
  function omit(object, paths) { const result = { ...object }; paths.forEach(p => delete result[p]); return result; }
  function pick(object, paths) { const result = {}; paths.forEach(p => { if (p in object) result[p] = object[p]; }); return result; }

  // 集合函数
  function countBy(collection, iteratee) { return {}; }
  function every(collection, predicate) { return collection.every(predicate); }
  function filter(collection, predicate) { return collection.filter(predicate); }
  function find(collection, predicate) { return collection.find(predicate); }
  function findLast(collection, predicate) { return collection.reverse().find(predicate); }
  function flatMap(collection, iteratee) { return collection.flatMap(iteratee); }
  function forEach(collection, iteratee) { collection.forEach(iteratee); return collection; }
  function groupBy(collection, iteratee) { return {}; }
  function includes(collection, value, fromIndex) { return collection.includes(value, fromIndex); }
  function map(collection, iteratee) { return collection.map(iteratee); }
  function orderBy(collection, iteratees, orders) { return collection; }
  function partition(collection, predicate) { return collection.reduce((acc, item) => (predicate(item) ? acc[0] : acc[1]).push(item), acc, [[], []]); }
  function reduce(collection, iteratee, accumulator) { return collection.reduce(iteratee, accumulator); }
  function reject(collection, predicate) { return collection.filter(item => !predicate(item)); }
  function sample(collection) { return collection[Math.floor(Math.random() * collection.length)]; }
  function shuffle(collection) { return [...collection].sort(() => Math.random() - 0.5); }
  function size(collection) { return collection.length || Object.keys(collection).length; }
  function some(collection, predicate) { return collection.some(predicate); }
  function sortBy(collection, iteratees) { return [...collection].sort(); }

  // 函数函数
  function after(n, func) { let count = 0; return function(...args) { if (++count >= n) return func.apply(this, args); }; }
  function before(n, func) { let count = 0, result; return function(...args) { if (count < n) result = func.apply(this, args); return result; }; }
  function bind(func, thisArg, ...partials) { return func.bind(thisArg, ...partials); }
  function debounce(func, wait, options) { let timeout; return function(...args) { clearTimeout(timeout); timeout = setTimeout(() => func.apply(this, args), wait); }; }
  function throttle(func, wait, options) { let lastTime = 0; return function(...args) { const now = Date.now(); if (now - lastTime >= wait) { lastTime = now; return func.apply(this, args); } }; }
  function curry(func, arity) { return function curried(...args) { return args.length >= func.length ? func.apply(this, args) : (...next) => curried(...args, ...next); }; }
  function memoize(func, resolver) { const cache = new Map(); return function(...args) { const key = resolver ? resolver(...args) : args[0]; if (cache.has(key)) return cache.get(key); const result = func.apply(this, args); cache.set(key, result); return result; }; }

  // 其他函数
  function now() { return Date.now(); }
  function parseInt(string, radix) { return parseInt(string, radix); }
  function random(min, max, floating) { return floating ? Math.random() * (max - min) + min : Math.floor(Math.random() * (max - min + 1)) + min; }
  function range(start, end, step) { const result = []; if (end === undefined) { end = start; start = 0; } step = step || 1; for (let i = start; i < end; i += step) result.push(i); return result; }
  function rangeRight(start, end, step) { return range(start, end, step).reverse(); }
  function stubArray() { return []; }
  function stubFalse() { return false; }
  function stubTrue() { return true; }
  function times(n, iteratee) { return Array.from({ length: n }, (_, i) => iteratee(i)); }
  function toPath(value) { return value.match(/[^.[\]]+/g) || []; }
  function uniqueId(prefix) { return (prefix || '') + (uniqueId.id++); }
  uniqueId.id = 1;

  return {
    chunk, compact, concat, difference, drop, dropRight, fill, flatten, flattenDeep, flattenDepth,
    fromPairs, head, indexOf, initial, intersection, join, last, lastIndexOf, nth, pull, pullAll,
    reverse, slice, sortedIndex, sortedLastIndex, uniq, uniqBy, unzip, zip,
    add, ceil, divide, floor, max, maxBy, mean, min, sum,
    camelCase, capitalize, deburr, endsWith, escape, kebabCase, lowerCase, lowerFirst,
    pad, padEnd, repeat, replace, snakeCase, split, startCase, startsWith, toUpper, trim, truncate,
    assign, assignIn, cloneDeep, defaults, get, has, merge, omit, pick,
    countBy, every, filter, find, findLast, flatMap, forEach, groupBy, includes, map,
    orderBy, partition, reduce, reject, sample, shuffle, size, some, sortBy,
    after, before, bind, debounce, throttle, curry, memoize,
    now, parseInt, random, range, rangeRight, stubArray, stubFalse, stubTrue, times, toPath, uniqueId
  };
})();

// ==================== 问题2: 未压缩的 JS 和 CSS ====================
// ==================== 问题3: 关键 CSS 未内联 ====================
// styles.css 作为外部文件加载，会阻塞渲染

// 渲染商品列表 - 移除懒加载，一次性加载所有图片
function renderProducts() {
  const productList = document.getElementById('product-list');

  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    // 问题: 移除 loading="lazy"，首屏一次性加载所有大图片
    card.innerHTML = `
      <img class="product-image" src="${product.image}" alt="${product.title}">
      <h4 class="product-title">${product.title}</h4>
      <p class="product-price">¥${product.price}</p>
    `;
    productList.appendChild(card);
  });
}

// 页面加载完成后渲染商品
document.addEventListener('DOMContentLoaded', renderProducts);
