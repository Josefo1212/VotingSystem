import Votacion from "./Clases/Votacion.js";
import VotingSystemSkeleton from "./VotingSystem-skeleton.js";

const votacion = new Votacion();
const skeleton = new VotingSystemSkeleton(votacion);

// El skeleton expone la logica de negocio sin acoplarla a la red.
skeleton.listen();
