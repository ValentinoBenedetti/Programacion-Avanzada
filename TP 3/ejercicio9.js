
function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Ejemplo
const debouncedLog = debounce((msg) => console.log(msg), 1000);
debouncedLog("hola");
debouncedLog("chau"); // solo imprime "chau" tras 1s
