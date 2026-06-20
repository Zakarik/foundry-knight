
const NPCMixinSheet = (superclass) => class extends superclass {
  /** @inheritdoc */
  static DEFAULT_OPTIONS = {
    actions: {
      setBtn: this.#onSetBtn,
      addBaseChair: this.#onAddBaseChair,
      capaciteActivation: this.#onCapaciteActivation,
      setResilience: this.#onSetResilience,
      togglePhase2: this.#onTogglePhase2,
      addPF: this.#onAddPF,
      rollSpecifique: this.#onRollSpecifique,
      destruction: this.#onDestruction,
    }
  };

  /** @inheritdoc */
  _prepareActor(context) {
    super._prepareActor(context);
    const data = context;

    const system = data.system;
    const options = system.options;
    const noFirstMenu = !options.resilience && !options.sante && !options.espoir ? true : false;
    const noSecondMenu = !options.armure && !options.energie && !options.bouclier && !options.champDeForce ? true : false;

    options.noFirstMenu = noFirstMenu;
    options.noSecondMenu = noSecondMenu;

    context.system.wear = 'armure';
  }

  // GESTION DES ACTIONS

  /** Bascule un booléen system.<data-type>. */
  static #onSetBtn(event, target) {
    const type = target.dataset.type;
    const value = this.actor.system?.[type] ?? false;

    this.actor.update({[`system.${type}`]: value ? false : true});
  }

  /** Bascule system.degats.addchair de l'arme ciblée (combat NPC). */
  static #onAddBaseChair(event, target) {
    const id = target.dataset.id;
    const value = target.dataset.value === 'true';
    const item = this.actor.items.get(id);

    if(!item) return;

    item.update({['system.degats.addchair']: value ? false : true});
  }

  /** Activation des dégâts d'une capacité (ténébricide / oblitération en option). */
  static #onCapaciteActivation(event, target) {
    const data = target.dataset;
    const type = data.type;
    const capacite = data.capacite;
    const tenebricide = data.tenebricide === 'true';
    const obliteration = data.obliteration === 'true';

    if(type === 'degats') this.actor.system.doCapacityDgt(capacite, {tenebricide, obliteration});
  }

  /** Calcul de la résilience via une boîte de dialogue (colosse / patron × recrue / initié / héros). */
  static async #onSetResilience(event, target) {
    const system = this.actor.system;

    const liste = {
      colosseRecrue: game.i18n.localize("KNIGHT.RESILIENCE.TYPES.COLOSSE.Recrue"),
      colosseInitie: game.i18n.localize("KNIGHT.RESILIENCE.TYPES.COLOSSE.Initie"),
      colosseHeros: game.i18n.localize("KNIGHT.RESILIENCE.TYPES.COLOSSE.Heros"),
      patronRecrue: game.i18n.localize("KNIGHT.RESILIENCE.TYPES.PATRON.Recrue"),
      patronInitie: game.i18n.localize("KNIGHT.RESILIENCE.TYPES.PATRON.Initie"),
      patronHeros: game.i18n.localize("KNIGHT.RESILIENCE.TYPES.PATRON.Heros"),
    };

    let optionsHtml = '';
    for(const [key, label] of Object.entries(liste)) {
      optionsHtml += `<option value="${key}">${label}</option>`;
    }

    const content = `
    <div class="knight askdialog">
      <label class="line">
        <span>${game.i18n.localize("KNIGHT.RESILIENCE.TYPES.Label")} ?</span>
        <select name="whatSelect" class="whatSelect">${optionsHtml}</select>
      </label>
    </div>`;

    await foundry.applications.api.DialogV2.wait({
      window: {
        title: game.i18n.localize('KNIGHT.RESILIENCE.CalculResilience'),
      },
      classes: ["knight", "askdialog"],
      content,
      buttons: [
        {
          action: "calcul",
          label: game.i18n.localize('KNIGHT.RESILIENCE.Calcul'),
          icon: "fas fa-check",
          default: true,
          callback: (event, button) => {
            const selected = button.form.elements.whatSelect.value;
            const dataSante = Number(system?.sante?.max ?? 0);
            const dataArmure = Number(system?.armure?.max ?? 0);
            const hasSante = system?.options?.sante;
            const hasArmure = system?.options?.armure;
            const base = hasSante ? dataSante : (hasArmure ? dataArmure : 0);

            let calcul = 0;

            switch(selected) {
              case 'colosseRecrue': calcul = Math.floor(base / 10); break;
              case 'colosseInitie': calcul = Math.floor(base / 10) * 2; break;
              case 'colosseHeros':  calcul = Math.floor(base / 10) * 3; break;
              case 'patronRecrue':  calcul = Math.floor(base / 30); break;
              case 'patronInitie':  calcul = Math.floor(base / 20); break;
              case 'patronHeros':   calcul = Math.floor(base / 10); break;
            }

            this.actor.update({
              ['system.resilience.max']: calcul,
              ['system.resilience.value']: calcul,
            });
          },
        },
      ],
    });
  }

  /** Active / désactive la phase 2. */
  static #onTogglePhase2(event, target) {
    this.actor.system.togglePhase2();
  }

  /** Ajoute le point faible sélectionné à la liste, séparé par " / ". */
  static #onAddPF(event, target) {
    const select = this.element.querySelector('select.pfselected');
    const value = select?.value ?? "";

    if(value === "") return;

    const previous = this.actor.system?.pointsFaibles ?? "";
    const newText = previous === "" ? value : `${previous} / ${value}`;

    this.actor.update({[`system.pointsFaibles`]: newText});
  }

  /** Jet spécifique (PNJ). */
  static async #onRollSpecifique(event, target) {
    const name = target.dataset.name;
    const dices = target.dataset.roll;

    const roll = new game.knight.RollKnight(this.actor, {
      name,
      dices,
    }, true);

    await roll.doRoll();
  }

  /** Suppression de l'acteur (module à destruction). */
  static async #onDestruction(event, target) {
    await this.actor.delete();
  }
}

export default NPCMixinSheet;
