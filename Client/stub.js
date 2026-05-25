export default class Stub {
  constructor({ serverUrl = "http://localhost:3000" } = {}) {
    this.serverUrl = serverUrl;
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