const dispositivos = [
  { id: 1, nombre: "PC-Desarrollo", ip: "192.168.1.5", tipo: "Estación de trabajo" },
  { id: 2, nombre: "PC-Marketing", ip: "192.168.1.7", tipo: "Estación de trabajo" },
  { id: 3, nombre: "Servidor-Web", ip: "192.168.1.10", tipo: "Servidor" },
  { id: 4, nombre: "Servidor-BD", ip: "192.168.1.11", tipo: "Servidor" }
];

const conexionesActivas = [
  { origen: "192.168.1.5", destino: "192.168.1.10", protocolo: "HTTP", bytes: 8500 },
  { origen: "192.168.1.7", destino: "192.168.1.11", protocolo: "MySQL", bytes: 12000 },
  { origen: "192.168.1.5", destino: "192.168.1.11", protocolo: "MySQL", bytes: 9200 }
];

const informeActividad = conexionesActivas.map(conexion => {
// Encuentra los dispositivos de origen y destino
  const origen = dispositivos.find(d => d.ip === conexion.origen);
  const destino = dispositivos.find(d => d.ip === conexion.destino);

// Retorna un objeto con la información combinada
  return {
    origen: origen ? origen.nombre : conexion.origen,
    destino: destino ? destino.nombre : conexion.destino,
    protocolo: conexion.protocolo,
    bytes: conexion.bytes
  };
});

console.log(informeActividad);