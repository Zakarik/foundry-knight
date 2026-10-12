export class AspectsNPCDataModel extends foundry.abstract.DataModel {
  static defineSchema() {
    const { NumberField, SchemaField, ObjectField } = foundry.data.fields;
    let data = {};

    for (let a of CONFIG.KNIGHT.LIST.aspects) {
      data[a] = new SchemaField({
        max: new NumberField({ initial: 20, min: 0, integer: true, nullable: false }),
        value: new NumberField({ initial: 0, min: 0, integer: true, nullable: false }),
        bonus: new ObjectField(),
        malus: new ObjectField(),
        override: new ObjectField(),
        overrideMax: new ObjectField(),
        divide: new ObjectField(),
        ae: new SchemaField({
          mineur: new SchemaField({
            value: new NumberField({ initial: 0, min: 0, integer: true, nullable: false }),
            max: new NumberField({ initial: 10, min: 0, integer: true, nullable: false }),
            overrideMax: new ObjectField(),
          }),
          majeur: new SchemaField({
            value: new NumberField({ initial: 0, min: 0, integer: true, nullable: false }),
            max: new NumberField({ initial: 10, min: 0, integer: true, nullable: false }),
            overrideMax: new ObjectField(),
          }),
        }),
      });
    }

    return data;
  }

  prepareData() {
    for (let a in this) {
      this.#overrideMax(this[a]);
      this.#overrideMax(this[a].ae.mineur);
      this.#overrideMax(this[a].ae.majeur);

      if (this[a].value > this[a].max) {
        Object.defineProperty(this[a], "value", {
          value: this[a].max,
        });
      }

      if (this[a].ae.mineur.value > this[a].ae.mineur.max) {
        Object.defineProperty(this[a].ae.mineur, "value", {
          value: this[a].ae.mineur.max,
        });
      }

      if (this[a].ae.majeur.value > this[a].ae.majeur.max) {
        Object.defineProperty(this[a].ae.majeur, "value", {
          value: this[a].ae.majeur.max,
        });
      }
    }
  }

  #overrideMax(path) {
    const override = Object.values(path.overrideMax).reduce(
      (max, curr) => Math.max(max, Number(curr) || 0),
      0,
    );

    if (override) {
      Object.defineProperty(path, "max", {
        value: override,
      });
    }
  }
}
