

const carrito = ['Producto 1', 'Producto 2', 'Producto 3'];

carrito.map(producto => {
    return `El producto es: ${producto}`;
})


// spread operator

let lenguajes = ['JavaScript', 'Python', 'Java'];
let frameworks = ['React', 'Angular', 'Vue'];

// Unir los arrays en 1 solo array
let tecnologias = [...lenguajes, ...frameworks];


console.log(tecnologias);

let tecnologias2 = ['C#', 'PHP', 'Ruby'];
// Unir los arrays en 1 solo array
let tecnologiasCompletas = lenguajes.concat(frameworks, tecnologias2);


console.log(tecnologiasCompletas);