import readline from "node:readline";
import ProxyVotacion from "./proxy.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// El proxy provee transparencia de ubicacion: el cliente invoca metodos locales.
const proxy = new ProxyVotacion();

const ask = (question) => new Promise((resolve) => rl.question(question, resolve));

const printMenu = (candidatos) => {
  console.log("\n=== Sistema de Votacion ===");
  candidatos.forEach((candidato, index) => {
    console.log(`${index + 1}. Votar por ${candidato}`);
  });
  console.log(`${candidatos.length + 1}. Agregar candidato`);
  console.log(`${candidatos.length + 2}. Ver resultados en el Servidor`);
  console.log(`${candidatos.length + 3}. Salir`);
};

const main = async () => {
  let running = true;

  while (running) {
    let candidatos = [];

    try {
      candidatos = await proxy.obtenerCandidatos();
    } catch (error) {
      console.error("Fallo de comunicacion:", error.message);
      break;
    }

    printMenu(candidatos);
    const option = await ask("Seleccione una opcion: ");
    const opcion = Number.parseInt(option.trim(), 10);

    if (Number.isNaN(opcion)) {
      console.log("Opcion invalida. Intente de nuevo.");
      continue;
    }

    if (opcion >= 1 && opcion <= candidatos.length) {
      const candidato = candidatos[opcion - 1];

      try {
        const respuesta = await proxy.votar(candidato);
        console.log(respuesta ?? `Voto registrado para ${candidato}.`);
      } catch (error) {
        console.error("Fallo de comunicacion:", error.message);
      }
      continue;
    }

    if (opcion === candidatos.length + 1) {
      const nuevoCandidato = await ask("Nombre del nuevo candidato: ");

      try {
        const respuesta = await proxy.agregarCandidato(nuevoCandidato.trim());
        console.log(respuesta ?? `Candidato ${nuevoCandidato.trim()} agregado.`);
      } catch (error) {
        console.error("Fallo de comunicacion:", error.message);
      }
      continue;
    }

    if (opcion === candidatos.length + 2) {
      try {
        const resultados = await proxy.obtenerResultados();
        console.log("Resultados:");
        Object.entries(resultados).forEach(([candidato, votos]) => {
          console.log(`${candidato}: ${votos}`);
        });
      } catch (error) {
        console.error("Fallo de comunicacion:", error.message);
      }
      continue;
    }

    if (opcion === candidatos.length + 3) {
      running = false;
      continue;
    }

    console.log("Opcion invalida. Intente de nuevo.");
  }

  rl.close();
};

main();
