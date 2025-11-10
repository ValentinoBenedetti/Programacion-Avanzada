

// Promises
//Resovle => ejecuta el llamoo al Promise cuando el llamado es correcto
// Reject => cuando hay un error



const aplicarDescuento = new Promise(( resolve, reject) => {

    setTimeout( () => {
        let dedede = true
        if(descuento) {
            resolve("Descuento aplicado");
        } else {
            reject("No se pudo aplicar el descuento");
        }
    }, 3000)

})

aplicarDescuento.then( resultado => {
    console.log(resultado);
}).catch( error => {
    console.log('Hubo un error en la consulta: ' +  error);
});