export default class Dispatcher {
  constructor(objetoReal) {
    this.objetoReal = objetoReal;
  }

  dispatch(control) {
    return this._invoke(control);
  }

  handle(control) {
    return this._invoke(control);
  }

  ejecutar(control) {
    return this._invoke(control);
  }

  _invoke(control) {
    if (!control || typeof control !== "object") {
      throw new Error("Control invalido.");
    }

    const { metodo, args = [] } = control;

    if (typeof metodo !== "string" || metodo.trim() === "") {
      throw new Error("Metodo invalido.");
    }

    const funcion = this.objetoReal?.[metodo];

    if (typeof funcion !== "function") {
      throw new Error(`Metodo no encontrado: ${metodo}`);
    }

    return funcion.apply(this.objetoReal, Array.isArray(args) ? args : [args]);
  }
}
