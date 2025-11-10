
function groupBy(list, keyOrFn) {
  const fn = typeof keyOrFn === 'function'
    ? keyOrFn
    : (item) => item[keyOrFn];
  
  return list.reduce((acc, item) => {
    const key = fn(item);
    acc[key] = acc[key] || [];
    acc[key].push(item);
    return acc;
  }, {});
}

// Ejemplo
console.log(groupBy([{t:'a'},{t:'b'},{t:'a'}], 't'));
console.log(groupBy([6,7,8,9], n => n%2 ? 'impar':'par'));
