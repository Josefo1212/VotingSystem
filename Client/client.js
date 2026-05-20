import readline from "node:readline";
import VotingSystemStub from "./VotingSystem-stub.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// El stub oculta el detalle remoto y ofrece una API local y asincrona.
const stub = new VotingSystemStub();

const ask = (question) => new Promise((resolve) => rl.question(question, resolve));

const printMenu = () => {
  console.log("\n=== Sistema de Votacion ===");
  console.log("1. Votar A");
  console.log("2. Votar B");
  console.log("3. Ver Resultados");
  console.log("4. Salir");
};

const main = async () => {
  let running = true;

  while (running) {
    printMenu();
    const option = await ask("Seleccione una opcion: ");

    try {
      switch (option.trim()) {
        case "1":
          await stub.votar("A");
          console.log("Voto registrado para A.");
          break;
        case "2":
          await stub.votar("B");
          console.log("Voto registrado para B.");
          break;
        case "3": {
          const resultados = await stub.obtenerResultados();
          console.log("Resultados:");
          console.log(`A: ${resultados.A}`);
          console.log(`B: ${resultados.B}`);
          console.log(`Total: ${resultados.total}`);
          break;
        }
        case "4":
          running = false;
          break;
        default:
          console.log("Opcion invalida. Intente de nuevo.");
      }
    } catch (error) {
      console.error("Error al invocar el servicio:", error.message);
    }
  }

  rl.close();
};

main();
