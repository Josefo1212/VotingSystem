import http from "node:http";

export default class Skeleton {
  constructor(dispatcher) {
    this.dispatcher = dispatcher;
  }

  // Al usar "0.0.0.0" por defecto, permitimos que reciba peticiones de otras IPs en la red LAN.
  listen(port, host = "0.0.0.0") {
    const server = http.createServer((req, res) => {
      // Configuramos el header para responder en JSON
      res.setHeader("Content-Type", "application/json");

      // Solo aceptamos peticiones POST para las invocaciones de metodos
      if (req.method !== "POST") {
        res.writeHead(405);
        return res.end(JSON.stringify({ error: "Metodo no permitido. Usa POST." }));
      }

      let body = "";

      // 1. Recibir los fragmentos de bytes crudos de la red
      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      // 2. Cuando se termina de recibir la data
      req.on("end", () => {
        try {
          // Unmarshalling: Reconstruir el objeto JavaScript a partir del string JSON
          const control = JSON.parse(body);

          // 3. Pasar el objeto limpio al Dispatcher (Capa de reflexion de Laura)
          const resultado = this.dispatcher.dispatch(control);

          // 4. Enviar el resultado de vuelta al cliente serializado
          res.writeHead(200);
          res.end(JSON.stringify({ exito: true, data: resultado }));
          
        } catch (error) {
          console.error("[Skeleton] Error procesando la peticion:", error.message);
          res.writeHead(500);
          res.end(JSON.stringify({ exito: false, error: error.message }));
        }
      });
    });

    server.listen(port, host, () => {
      console.log(`[Skeleton] Transporte de red levantado.`);
      console.log(`[Skeleton] Escuchando peticiones en: http://${host}:${port}`);
      console.log(`[Skeleton] ---> IMPORTANTE: Para que el cliente se conecte, usa la IPv4 de esta maquina.`);
    });
  }
}