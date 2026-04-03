
export class CaracteristiqueDataModel extends foundry.abstract.DataModel {
	static defineSchema() {
        const {NumberField, SchemaField, ObjectField} = foundry.data.fields;

      return {
        base:new NumberField({ initial: 1, integer: true, nullable: false }),
        bonus:new ObjectField(),
        malus:new ObjectField(),
        optimisation:new SchemaField({
          bonus:new ObjectField(),
          malus:new ObjectField(),
        }),
        value:new NumberField({ initial: 0, integer: true, nullable: false }),
        override:new ObjectField(),
        overdrive:new SchemaField({
            base:new NumberField({ initial: 0, integer: true, nullable: false }),
            bonus:new ObjectField(),
            malus:new ObjectField(),
            override:new ObjectField(),
            value:new NumberField({ initial: 0, integer: true, nullable: false }),
        }),
      };
  }

  //S'IL Y A UN OVERRIDE POUR LA CARAC
  get hasOverrideC() {
    const override = Object.values(this.override).reduce((max, curr) => Math.max(max, Number(curr) || 0), 0);

    return override;
  }

  //S'IL Y A UN OVERRIDE POUR L'OD
  get hasOverrideO() {
    const override = Object.values(this.overdrive.override).reduce((max, curr) => Math.max(max, Number(curr) || 0), 0);

    return override;
  }

  prepareData(aspect) {
    const overrideC = this.hasOverrideC;
    const overrideO = this.hasOverrideO;

    if(overrideC) this._caracteristiqueOverride(overrideC);
    else this._caracteristiqueSum(aspect);

    if(overrideO) this._overdriveOverride(overrideO);
    else this._overdriveSum();
  }

  _overdriveSum() {
    const bonusOverdrive = Object.values(this.overdrive.bonus).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
    const malusOverdrive = Object.values(this.overdrive.malus).reduce((acc, curr) => acc + (Number(curr) || 0), 0);

    Object.defineProperty(this.overdrive, 'value', {
      value: Math.max(this.overdrive.base+bonusOverdrive-malusOverdrive, 0),
    });
  }

  _overdriveOverride(override) {
    Object.defineProperty(this.overdrive, 'value', {
      value: override,
    });
  }

  _caracteristiqueSum(aspect) {
      const bonus = Object.values(this.bonus).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
      const malus = Object.values(this.malus).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
      const bonusOpti = Object.values(this.optimisation.bonus).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
      const malusOpti = Object.values(this.optimisation.malus).reduce((acc, curr) => acc + (Number(curr) || 0), 0);

      Object.defineProperty(this, 'value', {
        value: Math.max(Math.min(aspect, this.base+bonus-malus)+(bonusOpti-malusOpti), 0),
      });
  }

  _caracteristiqueOverride(override) {
      Object.defineProperty(this, 'value', {
        value: override,
      });
  }
}