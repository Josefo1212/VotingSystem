// Logica de aplicacion pura: no conoce red, sockets ni serializacion.
export default class Votacion {
  constructor() {
    this.candidatos = {
      A: 0,
      B: 0
    };
  }

  votar(candidato) {
    if (candidato !== "A" && candidato !== "B") {
      throw new Error("Candidato invalido. Use 'A' o 'B'.");
    }

    this.candidatos[candidato] += 1;
  }

  obtenerResultados() {
    const total = this.candidatos.A + this.candidatos.B;

    return {
      A: this.candidatos.A,
      B: this.candidatos.B,
      total
    };
  }
}
