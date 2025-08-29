const traficoRed = {
  "08:00": 1250, // MB transferidos
  "09:00": 1870,
  "10:00": 2100,
  "11:00": 1950,
  "12:00": 1600,
  "13:00": 1300,
  "14:00": 1700,
  "15:00": 2200,
  "16:00": 1800,
  "17:00": 1500
};

// Calcula el total de datos transferidos
const totalTransferido = Object.values(traficoRed).reduce((acum, valor) => acum + valor, 0);

// Encuentra la hora con mayor tráfico
let horaMax = null;
let maxValor = 0;

for (const [hora, valor] of Object.entries(traficoRed)) {
  if (valor > maxValor) {
    maxValor = valor;
    horaMax = hora;
  }
}

console.log(totalTransferido);
console.log(horaMax, maxValor);