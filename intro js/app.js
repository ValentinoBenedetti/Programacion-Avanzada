


// let nombre = "Ernesto";
// let edad = 30;
// let profesion = "Desarrollador Web";

// console.log("Nombre: " + nombre);
// console.log("Edad: " + edad);
// console.log("Profesión: " + profesion);

function pick(obj, keys) {
  const out = {};
  for (const k of keys) {
    if (Object.prototype.hasOwnProperty.call(obj, k)) {
      out[k] = obj[k];
    }
  }
  return out;
}
