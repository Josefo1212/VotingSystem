import Stub from "./stub.js";

export default class ProxyVotacion {
  constructor(stub = new Stub()) {
    this.stub = stub;

    // Retornamos un Proxy nativo de JavaScript para interceptar llamadas dinámicamente
    return new Proxy(this, {
      get(target, prop) {
        // Si se intenta acceder a una propiedad real de la clase (como 'stub' o 'invocar'), la devolvemos normalmente
        if (prop in target) {
          return target[prop];
        }

        // Si se intenta llamar a cualquier otro método (ej. proxy.votar, proxy.loQueSea),
        // lo interceptamos y lo convertimos automáticamente en una invocación remota string-based.
        return (...args) => {
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