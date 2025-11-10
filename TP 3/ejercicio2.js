
function pick(obj, keys) {
  return keys.reduce((acc, key) => {
    if (obj.hasOwnProperty(key)) {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
}

// Ejemplo
console.log(pick({a:1,b:2,c:3}, ['a','c','z'])); // { a:1, c:3 }
