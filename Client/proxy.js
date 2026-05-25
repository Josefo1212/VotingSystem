import Stub from "./stub.js";
import { getMethodNames, loadIdl } from "../idlParser.js";

export default class ProxyVotacion {
  constructor(stub = null, idlPath) {
    this.idl = loadIdl(idlPath);
    this.methodNames = new Set(getMethodNames(this.idl));
    this.stub = stub ?? new Stub({ serverUrl: `http://localhost:${this.idl.port}` });

    // Retornamos un Proxy nativo de JavaScript para interceptar llamadas dinámicamente
    return new Proxy(this, {
      get(target, prop) {
        if (typeof prop === "symbol") {
          return target[prop];
        }

        // Si se intenta acceder a una propiedad real de la clase (como 'stub' o 'invocar'), la devolvemos normalmente
        if (prop in target) {
          return target[prop];
        }

        // Si se intenta llamar a un metodo remoto, validamos primero contra el IDL.
        return (...args) => {
          if (!target.methodNames.has(prop)) {
            throw new Error(`Metodo no definido en el IDL: ${prop}`);
          }

          return target.invocar(prop, args);
        };
      }
    });
  }

  // Este método genérico se encarga de enviar los datos al stub
  async invocar(metodo, args = []) {
    const payload = { metodo, args };

    if (typeof this.stub?.invocar === "function") return this.stub.invocar(payload);
    if (typeof this.stub?.invoke === "function") return this.stub.invoke(payload);
    if (typeof this.stub?.send === "function") return this.stub.send(payload);
    if (typeof this.stub?.request === "function") return this.stub.request(payload);

    throw new Error("Stub no implementa un metodo de envio conocido.");
  }
}