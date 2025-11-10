"use client"; // ¡IMPORTANTE! Para usar hooks de React

import { useState, useEffect } from 'react';

export default function Home() {
  
  // --- ESTADOS ---
  const [events, setEvents] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  
  // 1. Estado para manejar los datos del formulario (AHORA VACÍOS)
  const [formData, setFormData] = useState({
    userId: '',
    currency: '',
    fromAccount: '',
    toAccount: '',
    amount: '', // Se usa string vacío para el input
  });
  
  // 2. Nuevo estado para manejar los errores del formulario
  const [error, setError] = useState(null);

  // --- EFECTO: Conexión WebSocket ---
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => {
      console.log('CONECTADO AL GATEWAY!');
      setIsConnected(true);
      // 3. Nos suscribimos al 'userId' del formulario
      //    (Nota: si el userId está vacío, la suscripción será vacía,
      //    lo cual está bien, pero idealmente se suscribiría tras un "login")
      if (formData.userId) {
         ws.send(JSON.stringify({ type: 'subscribe', userId: formData.userId }));
      }
    };

    ws.onmessage = (event) => {
      const eventData = JSON.parse(event.data);
      if (eventData.type === 'subscribed') return;

      console.log('EVENTO RECIBIDO:', eventData);
      setEvents(prevEvents => [...prevEvents, eventData]);
    };

    ws.onclose = () => {
      console.log('DESCONECTADO DEL GATEWAY');
      setIsConnected(false);
    };
    ws.onerror = (err) => {
      console.error('Error de WS:', err);
      setIsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [formData.userId]); // Se re-suscribe si el UserID cambia

  // --- MANEJADOR: Envío del Formulario (CON VALIDACIÓN) ---
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que la página se recargue
    
    // --- INICIO DE VALIDACIÓN FRONTEND ---
    setError(null); // Limpia errores anteriores
    setEvents([]); // Limpiamos el timeline
    
    const { userId, currency, fromAccount, toAccount, amount } = formData;
    
    // 1. Chequeo de campos vacíos
    if (!userId || !currency || !fromAccount || !toAccount || !amount) {
      setError('Error: Todos los campos son obligatorios.');
      return; // Detiene la ejecución
    }
    
    // 2. Chequeo de monto negativo o cero
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Error: El monto debe ser un número positivo.');
      return; // Detiene la ejecución
    }
    // --- FIN DE VALIDACIÓN FRONTEND ---

    try {
      // 1. Llamamos a nuestra api.js en el puerto 3001
      const response = await fetch('http://localhost:3001/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Enviamos el 'amount' como número
        body: JSON.stringify({ ...formData, amount: numericAmount }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar la transacción');
      }

      console.log('Transacción iniciada:', data);
      
    } catch (error) {
      console.error('Error en el formulario:', error);
      // Mostramos el error en la UI
      setError(error.message);
    }
  };
  
  // --- MANEJADOR: Cambios en el Formulario ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- RENDERIZADO (JSX) ---
  return (
    <main className="flex min-h-screen flex-col items-center p-12 bg-gray-900 text-white">
      
      {/* Encabezado */}
      <header className="w-full max-w-6xl flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl font-bold">Sistema de Eventos Bancarios</h1>
          <p className="text-gray-400">Procesamiento de transacciones en tiempo real con Kafka</p>
        </div>
        
        {/* Indicador de Conexión */}
        <div className="flex items-center space-x-2">
          <span className="relative flex h-3 w-3">
            {isConnected && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            )}
            <span className={`relative inline-flex rounded-full h-3 w-3 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
          </span>
          <span>{isConnected ? 'Conectado' : 'Desconectado'}</span>
        </div>
      </header>

      {/* Contenido principal */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Columna 1: Formulario */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Nueva Transacción</h2>
          <p className="text-gray-400 mb-6">Inicia una nueva transacción bancaria.</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* User ID */}
            <div>
              <label htmlFor="userId" className="block text-sm font-medium text-gray-300">User ID</label>
              <input
                type="text" name="userId" id="userId"
                value={formData.userId} onChange={handleChange}
                className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2"
              />
            </div>

            {/* Currency */}
            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-gray-300">Moneda</label>
              <input
                type="text" name="currency" id="currency"
                value={formData.currency} onChange={handleChange}
                className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2"
                placeholder="Ej: USD, ARS"
              />
            </div>

            {/* From Account */}
            <div>
              <label htmlFor="fromAccount" className="block text-sm font-medium text-gray-300">Cuenta Origen</label>
              <input
                type="text" name="fromAccount" id="fromAccount"
                value={formData.fromAccount} onChange={handleChange}
                className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2"
              />
            </div>

            {/* To Account */}
            <div>
              <label htmlFor="toAccount" className="block text-sm font-medium text-gray-300">Cuenta Destino</label>
              <input
                type="text" name="toAccount" id="toAccount"
                value={formData.toAccount} onChange={handleChange}
                className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2"
              />
            </div>

            {/* Amount */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-300">Monto</label>
              <input
                type="number" name="amount" id="amount"
                value={formData.amount} onChange={handleChange}
                className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2"
                placeholder="Ej: 100.50"
              />
            </div>
            
            {/* Botón */}
            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              Iniciar Transacción
            </button>
          </form>
          
          {/* Bloque para mostrar errores de validación */}
          {error && (
            <div className="mt-4 p-3 bg-red-800 border border-red-600 rounded-lg text-white">
              <p>{error}</p>
            </div>
          )}
          
        </div>

        {/* Columna 2: Timeline */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Timeline de la Transacción</h2>
          <p className="text-gray-400 mb-6">Stream de eventos en tiempo real.</p>
          
          <div className="h-96 overflow-y-auto space-y-4">
            {events.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-500">
                <p>Aún no hay eventos. Crea una transacción para ver el timeline.</p>
              </div>
            ) : (
              // Mapeamos los eventos recibidos
              events.map(event => (
                <div key={event.id} className={`p-3 rounded-lg ${
                  // Cambia el color si es un evento de reversa
                  event.type === 'txn.Reversed' ? 'bg-red-800' : 'bg-gray-700'
                }`}>
                  <p className={`font-semibold ${
                    event.type === 'txn.Reversed' ? 'text-red-300' : 'text-green-400'
                  }`}>{event.type}</p>
                  <pre className="text-xs text-gray-300 mt-1 whitespace-pre-wrap">
                    {JSON.stringify(event.payload, null, 2)}
                  </pre>
                  <p className="text-xs text-gray-500 text-right">{new Date(event.ts).toLocaleTimeString()}</p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </main>
  );
}