// Capa de Aplicacion: logica de negocio pura, sin dependencias de red o middleware.
// Esta separacion habilita transparencia de ubicacion: el cliente invoca un Proxy
// sin conocer donde se ejecuta la logica ni como viaja por la red.
export default class Votacion {
  constructor(candidatosIniciales = ["Candidato A", "Candidato B"]) {
    // Estado en memoria RAM inicializado desde una lista inyectada.
    this.votos = {};

    candidatosIniciales.forEach((candidato) => {
      this.agregarCandidato(candidato);
    });
  }

  agregarCandidato(candidato) {
    const nombreNormalizado = typeof candidato === "string" ? candidato.trim() : "";

    if (nombreNormalizado === "") {
      return "Error: el candidato no puede estar vacio.";
    }

    if (Object.prototype.hasOwnProperty.call(this.votos, nombreNormalizado)) {
      return "Error: el candidato ya existe.";
    }

    this.votos[nombreNormalizado] = 0;
    return `Candidato ${nombreNormalizado} agregado.`;
  }

  // Metodo invocado por reflexion desde el Dispatcher (nombre exacto del IDL).
  votar(candidato) {
    if (!Object.prototype.hasOwnProperty.call(this.votos, candidato)) {
      return "Error: candidato invalido.";
    }

    this.votos[candidato] += 1;
    return `Voto registrado para ${candidato}.`;
  }

  // Metodo invocado por reflexion desde el Dispatcher (nombre exacto del IDL).
  obtenerResultados() {
    // Se retorna una copia para preservar el encapsulamiento del estado.
    return { ...this.votos };
  }

  obtenerCandidatos() {
    return Object.keys(this.votos);
  }
}
