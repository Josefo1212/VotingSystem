import Stub from "./stub.js";

export default class ProxyVotacion {
  constructor(stub = new Stub()) {
    this.stub = stub;
  }

  async invocar(metodo, args = []) {
    const payload = { metodo, args };

    if (typeof this.stub?.invocar === "function") {
      return this.stub.invocar(payload);
    }

    if (typeof this.stub?.invoke === "function") {
      return this.stub.invoke(payload);
    }

    if (typeof this.stub?.send === "function") {
      return this.stub.send(payload);
    }

    if (typeof this.stub?.request === "function") {
      return this.stub.request(payload);
    }

    throw new Error("Stub no implementa un metodo de envio conocido.");
  }

  votar(candidato) {
    return this.invocar("votar", [candidato]);
  }

  agregarCandidato(nombre) {
    return this.invocar("agregarCandidato", [nombre]);
  }

  obtenerResultados() {
    return this.invocar("obtenerResultados");
  }

  obtenerCandidatos() {
    return this.invocar("obtenerCandidatos");
  }
}
