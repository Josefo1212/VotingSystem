import Votacion from "./Clases/Votacion.js";
import Dispatcher from "./dispatcher.js";
import Skeleton from "./skeleton.js";

// Inyeccion de dependencias en cadena:
// Votacion -> Dispatcher (reflexion) -> Skeleton (transporte HTTP).
const votacion = new Votacion();
const dispatcher = new Dispatcher(votacion);
const skeleton = new Skeleton(dispatcher);

// El servidor queda encendido y expone el servicio remoto en el puerto 5000.
skeleton.listen(5000);
