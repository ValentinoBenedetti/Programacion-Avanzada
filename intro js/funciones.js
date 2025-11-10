// function declaration

function saludar(nombre) {
    console.log("Bienvenido, " + nombre + "!");
}

saludar("Ernesto");


// function expression

const cliente = function(nombreCliente, edadCliente) {
    console.log("Mostrando datos del cliente: " + nombreCliente + ", Edad: " + edadCliente);
}

cliente("Juan", "25");

function actividad(nombre = 'Walter White', nombreActividad = 'Profesor de Química') {
    console.log(`El cliente ${nombre} está realizando la actividad: ${nombreActividad}`);
}

actividad("Ernesto", "programación en JavaScript");
actividad("Juan", "desarrollo web");
actividad(); // Usando valores por defecto