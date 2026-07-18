
const BandeMixinSheet = (superclass) => class extends superclass {
  /** @inheritdoc */
  static DEFAULT_OPTIONS = {
    actions: {
      debordement: this.#onDebordement,
    }
  };

  /* -------------------------------------------- */
  static #onDebordement(event, target) {
    this.actor.system.doDebordement();
  }
}

export default BandeMixinSheet;