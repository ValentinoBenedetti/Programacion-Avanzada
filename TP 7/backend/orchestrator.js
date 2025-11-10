const { Kafka } = require('kafkajs');
const { v4: uuidv4 } = require('uuid');

// 1. Configuración del Cliente Kafka
const kafka = new Kafka({
  clientId: 'orchestrator',
  brokers: ['localhost:9092']
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'orchestrator-group' });

// 2. Helper para crear eventos
const createEvent = (type, payload, transactionId, userId) => ({
  id: uuidv4(),
  type: type,
  version: 1,
  ts: Date.now(),
  transactionId: transactionId,
  userId: userId,
  payload: payload
});

// 3. Helper para producir eventos
const produceEvent = async (topic, event) => {
  await producer.send({
    topic,
    messages: [{
      key: event.transactionId,
      value: JSON.stringify(event)
    }]
  });
  console.log(`[Orchestrator] Evento emitido: ${event.type} (Tx: ${event.transactionId})`);
};

// 4. Lógica principal de la Saga (Orquestación)
const processTransaction = async (message) => {
  const event = JSON.parse(message.value.toString());
  
  const { transactionId, userId, payload } = event;

  if (event.type !== 'txn.TransactionInitiated') {
     console.warn(`[Orchestrator] Ignorando tipo de evento: ${event.type}`);
     return;
  }
  
  console.log(`[Orchestrator] Procesando transacción: ${transactionId}`);

  try {
    
    // --- INICIO DE VALIDACIÓN DE NEGOCIO (SIMULADA) ---
    const transactionData = payload;
    
    // Regla 1: Solo aceptamos transacciones en USD.
    if (transactionData.currency !== 'USD') {
      console.warn(`[Orchestrator] RECHAZADA: Moneda no válida (${transactionData.currency})`);
      await produceEvent('txn.events', createEvent(
        'txn.Reversed', 
        { reason: `Moneda no válida: ${transactionData.currency}. Solo se acepta USD.` }, 
        transactionId, 
        userId
      ));
      return; // Detenemos la saga
    }
    
    // Regla 2: Simulación de BDD (solo aceptamos este usuario y estas cuentas)
    const VALID_USER_ID = 'user-123';
    const VALID_ACCOUNTS = ['ACC-001', 'ACC-002'];

    if (transactionData.userId !== VALID_USER_ID) {
        console.warn(`[Orchestrator] RECHAZADA: Usuario no existe (${transactionData.userId})`);
        await produceEvent('txn.events', createEvent(
          'txn.Reversed', 
          { reason: `Usuario no encontrado: ${transactionData.userId}` }, 
          transactionId, 
          userId
        ));
        return; // Detenemos la saga
    }

    if (!VALID_ACCOUNTS.includes(transactionData.fromAccount)) {
        console.warn(`[Orchestrator] RECHAZADA: Cuenta Origen no existe (${transactionData.fromAccount})`);
        await produceEvent('txn.events', createEvent(
          'txn.Reversed', 
          { reason: `Cuenta Origen no existe o no es válida: ${transactionData.fromAccount}` }, 
          transactionId, 
          userId
        ));
        return; // Detenemos la saga
    }

    if (!VALID_ACCOUNTS.includes(transactionData.toAccount)) {
        console.warn(`[Orchestrator] RECHAZADA: Cuenta Destino no existe (${transactionData.toAccount})`);
        await produceEvent('txn.events', createEvent(
          'txn.Reversed', 
          { reason: `Cuenta Destino no existe o no es válida: ${transactionData.toAccount}` }, 
          transactionId, 
          userId
        ));
        return; // Detenemos la saga
    }
    
    // --- FIN DE VALIDACIÓN DE NEGOCIO ---


    // PASO 1: Emitir "FundsReserved" (si todas las validaciones pasaron)
    const fundsReservedEvent = createEvent(
      'txn.FundsReserved', 
      { ok: true, holdId: uuidv4(), amount: payload.amount },
      transactionId, 
      userId
    );
    await produceEvent('txn.events', fundsReservedEvent);

    // PASO 2: Chequeo de Fraude (Simulado)
    const risk = Math.random() < 0.8 ? 'LOW' : 'HIGH';
    console.log(`[Orchestrator] Chequeo de fraude: ${risk}`);

    if (risk === 'LOW') {
      // --- FLUJO RIESGO BAJO ---
      await produceEvent('txn.events', createEvent('txn.FraudChecked', { risk: 'LOW' }, transactionId, userId));
      await produceEvent('txn.events', createEvent('txn.Committed', { ledgerTxId: uuidv4() }, transactionId, userId));
      await produceEvent('txn.events', createEvent('txn.Notified', { channels: ['email', 'push'] }, transactionId, userId));
    
    } else {
      // --- FLUJO RIESGO ALTO ---
      await produceEvent('txn.events', createEvent('txn.FraudChecked', { risk: 'HIGH' }, transactionId, userId));
      await produceEvent('txn.events', createEvent('txn.Reversed', { reason: 'High fraud risk detected' }, transactionId, userId));
    }

  } catch (error) {
    // MANEJO DE ERROR INESPERADO (DLQ)
    console.error(`[Orchestrator] ERROR INESPERADO procesando ${transactionId}:`, error);
    
    const dlqPayload = {
      error: error.message,
      timestamp: Date.now(),
      originalEvent: event
    };
    
    await producer.send({
        topic: 'txn.dlq',
        messages: [{
            key: transactionId,
            value: JSON.stringify(dlqPayload)
        }]
    });
  }
};

// 5. Función principal para correr el servicio
const run = async () => {
  await producer.connect();
  await consumer.connect();
  
  await consumer.subscribe({ topic: 'txn.commands', fromBeginning: true });
  console.log('[Orchestrator] Conectado y escuchando en "txn.commands"');

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      await processTransaction(message);
    },
  });
};

run().catch(error => {
  console.error('[Orchestrator] Error fatal:', error);
  process.exit(1);
});