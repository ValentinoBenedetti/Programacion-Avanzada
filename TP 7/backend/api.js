const express = require('express');
const cors = require('cors');
const { Kafka } = require('kafkajs');
const { v4: uuidv4 } = require('uuid'); // Usamos v4 para IDs

// 1. Configuración de Kafka
const kafka = new Kafka({
  clientId: 'api-producer',
  brokers: ['localhost:9092']
});
const producer = kafka.producer();

// 2. Configuración de Express
const app = express();
app.use(cors()); // Habilita CORS para todas las rutas
app.use(express.json()); // Permite al servidor entender JSON

const PORT = 3001; // Correremos la API en un puerto diferente (ej. 3001)

// 3. Helper para crear eventos (el mismo que en el orchestrator)
const createEvent = (type, payload, transactionId, userId) => ({
  id: uuidv4(),
  type: type,
  version: 1,
  ts: Date.now(),
  transactionId: transactionId,
  userId: userId,
  payload: payload
});

// 4. Endpoint POST /transactions 
app.post('/transactions', async (req, res) => {
  try {
    // 4.1. Recibimos los datos del frontend (mockup) [cite: 61, 83-94]
    const { userId, fromAccount, toAccount, amount, currency } = req.body;

    if (!userId || !fromAccount || !toAccount || !amount || !currency) {
      return res.status(400).json({ message: "Faltan datos requeridos." });
    }

    // 4.2. Creamos el evento inicial
    const transactionId = uuidv4(); // ID único para toda la saga
    const eventPayload = { userId, fromAccount, toAccount, amount, currency };
    
    const event = createEvent(
      'txn.TransactionInitiated', // [cite: 22, 61]
      eventPayload,
      transactionId,
      userId
    );

    // 4.3. Publicamos el evento en el topic 'txn.commands' 
    await producer.send({
      topic: 'txn.commands', // [cite: 23]
      messages: [{
        key: transactionId, // Clave de partición para garantizar orden [cite: 14]
        value: JSON.stringify(event)
      }]
    });

    console.log(`[API] Transacción iniciada: ${transactionId} para User: ${userId}`);

    // 4.4. Respondemos al frontend
    // Usamos 202 (Accepted) para indicar que la solicitud fue aceptada 
    // pero el procesamiento (la saga) aún no ha terminado.
    res.status(202).json({
      message: "Transacción iniciada. Procesando...",
      transactionId: transactionId,
      status: "PENDING"
    });

  } catch (error) {
    console.error('[API] Error al iniciar transacción:', error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// 5. Función principal para arrancar el servidor
const run = async () => {
  await producer.connect();
  app.listen(PORT, () => {
    console.log(`[API] 🚀 Servicio API escuchando en http://localhost:${PORT}`);
  });
};

run().catch(error => {
  console.error('[API] Error fatal al arrancar:', error);
  process.exit(1);
});