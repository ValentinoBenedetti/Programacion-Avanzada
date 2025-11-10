const { Kafka } = require('kafkajs');
const { WebSocketServer } = require('ws'); // Importamos la librería de WebSocket

// 1. Configuración de Kafka
const kafka = new Kafka({
  clientId: 'gateway',
  brokers: ['localhost:9092']
});
const consumer = kafka.consumer({ groupId: 'gateway-group' });

// 2. Configuración del Servidor WebSocket
const wss = new WebSocketServer({ port: 8080 }); // Corremos el WS en el puerto 8080
console.log('[Gateway] 🚀 Servidor WebSocket escuchando en ws://localhost:8080');

// 3. Manejo de Conexiones de Clientes
wss.on('connection', ws => {
  console.log('[Gateway] Cliente WebSocket conectado');

  // 3.1. Lógica de Suscripción 
  //    El frontend deberá enviar un mensaje JSON al conectarse
  //    Ej: { "type": "subscribe", "userId": "user-123" }
  ws.on('message', message => {
    try {
      const data = JSON.parse(message);
      if (data.type === 'subscribe' && (data.userId || data.transactionId)) {
        
        // Guardamos el "interés" de este cliente en el propio objeto de conexión
        if(data.userId) {
          ws.interest = { type: 'userId', value: data.userId };
          console.log(`[Gateway] Cliente suscrito para userId: ${data.userId}`);
        } else if (data.transactionId) {
          ws.interest = { type: 'transactionId', value: data.transactionId };
          console.log(`[Gateway] Cliente suscrito para transactionId: ${data.transactionId}`);
        }
        
        ws.send(JSON.stringify({ type: 'subscribed', status: 'ok' }));
      }
    } catch (e) {
      console.warn('[Gateway] Mensaje no válido recibido:', message.toString());
    }
  });

  ws.on('close', () => {
    console.log('[Gateway] Cliente WebSocket desconectado');
  });
});

// 4. Lógica Principal: Consumir de Kafka y Reenviar
const run = async () => {
  await consumer.connect();
  // Nos suscribimos a 'txn.events'
  await consumer.subscribe({ topic: 'txn.events', fromBeginning: true }); 
  // 'fromBeginning: true' nos permite ver eventos pasados (útil para debug)
  
  console.log('[Gateway] Conectado a Kafka, consumiendo "txn.events"');

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const eventString = message.value.toString();
      const event = JSON.parse(eventString); // [cite: 39]

      console.log(`[Gateway] Evento recibido de Kafka: ${event.type} (Tx: ${event.transactionId})`);

      // 5. Reenviar el evento a los clientes suscritos [cite: 41, 42]
      wss.clients.forEach(client => {
        // Verificamos que el cliente esté abierto y tenga un 'interés'
        if (client.readyState === client.OPEN && client.interest) {
          
          // Comprobar si el interés del cliente (userId o txId) coincide con el evento
          const matchUserId = client.interest.type === 'userId' && client.interest.value === event.userId;
          const matchTxId = client.interest.type === 'transactionId' && client.interest.value === event.transactionId;

          if (matchUserId || matchTxId) {
            console.log(`[Gateway] Reenviando evento a cliente suscrito a ${client.interest.type}: ${client.interest.value}`);
            client.send(eventString); // Enviamos el evento (como string)
          }
        }
      });
    }
  });
};

run().catch(e => console.error('[Gateway] Error fatal:', e));