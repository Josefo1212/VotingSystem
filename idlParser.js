import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT_DIR = dirname(fileURLToPath(import.meta.url));
const DEFAULT_IDL_PATH = resolve(ROOT_DIR, "VotingSystem.jll");

function parseArgumentList(argumentList) {
  if (!argumentList.trim()) {
    return [];
  }

  return argumentList.split(",").map((argument) => {
    const [namePart, typePart] = argument.split(":");
    const name = namePart?.trim();
    const type = typePart?.trim() ?? "any";

    if (!name) {
      throw new Error(`Argumento invalido en IDL: ${argument}`);
    }

    return { name, type };
  });
}

export function loadIdl(idlPath = DEFAULT_IDL_PATH) {
  const rawIdl = readFileSync(idlPath, "utf8");
  const lines = rawIdl.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);

  const service = { name: null, port: null, methods: [] };
  let inMethodsSection = false;

  for (const line of lines) {
    if (line.startsWith("@service ")) {
      service.name = line.slice("@service ".length).trim();
      continue;
    }

    if (line.startsWith("@port ")) {
      const port = Number.parseInt(line.slice("@port ".length).trim(), 10);

      if (Number.isNaN(port)) {
        throw new Error(`Puerto invalido en IDL: ${line}`);
      }

      service.port = port;
      continue;
    }

    if (line === "methods") {
      inMethodsSection = true;
      continue;
    }

    if (!inMethodsSection) {
      continue;
    }

    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*\((.*)\)\s*:\s*(.+)$/);

    if (!match) {
      throw new Error(`Firma de metodo invalida en IDL: ${line}`);
    }

    const [, name, argumentList, returnType] = match;

    service.methods.push({
      name,
      args: parseArgumentList(argumentList),
      returnType: returnType.trim()
    });
  }

  if (!service.name) {
    throw new Error("El IDL no define @service.");
  }

  if (service.port === null) {
    throw new Error("El IDL no define @port.");
  }

  return service;
}

export function getMethodNames(idl = loadIdl()) {
  return idl.methods.map((method) => method.name);
}