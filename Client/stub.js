export default class Stub {
  constructor() {
    // ---> LUIS: CAMBIA ESTA IP EL DIA DE LA PRESENTACION <---
    // Si pruebas en tu misma PC, usa "localhost".
    // Si pruebas entre dos PCs, pon la IPv4 del servidor (ej. "192.168.1.15").
    const IP_SERVIDOR = "localhost"; 
    const PUERTO = 3000;
    
    this.serverUrl = `http://${IP_SERVIDOR}:${PUERTO}`;
  }

  async invocar(payload) {
    try {
      // Marshalling: Convertir el objeto que nos da el Proxy a un string JSON puro
      const bodyString = JSON.stringify(payload);

      // Enviar por la red usando HTTP POST nativo
      const response = await fetch(this.serverUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: bodyString,
      });

      if (!response.ok) {
        throw new Error(`Error HTTP del servidor: ${response.status}`);
      }

      // Recibir y decodificar la respuesta del servidor
      const data = await response.json();

      // Verificar si el skeleton nos reportó algún error interno
      if (!data.exito) {
        throw new Error(data.error);
      }

      // Retornar la data limpia de vuelta al Proxy
      return data.data;

    } catch (error) {
      // Capturamos errores de red (ej. servidor apagado, cable desconectado, IP erronea)
      throw new Error(`[Transporte Nativo] ${error.message}`);
    }
  }
}