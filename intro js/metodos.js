//metodos en arrays

const personas = [
    { nombre: "Juan", edad: 25, aprendiendo: 'javascript' },
    { nombre: "Ana", edad: 30, aprendiendo: 'python' },
    { nombre: "Ana", edad: 28, aprendiendo: 'java' },
    { nombre: "Maria", edad: 35, aprendiendo: 'c#' },
    { nombre: "Luis", edad: 22, aprendiendo: 'javascript' }
]

const personas2 = [
    { nombre: "Joaquin", edad: 25, aprendiendo: 'javascript' },
    { nombre: "Pedro", edad: 30, aprendiendo: 'python' },
    { nombre: "Rosa", edad: 28, aprendiendo: 'java' },
    { nombre: "Luis", edad: 35, aprendiendo: 'c#' },
    { nombre: "Mario", edad: 22, aprendiendo: 'javascript' }
]

// console.log(personas);

// funcion para FILTRAR mayores de 28 entre los dos objetos
const mayores = [...personas, ...personas2].filter(persona => persona.edad > 28);