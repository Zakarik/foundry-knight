
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
        divide:new ObjectField(),
        overdrive:new SchemaField({
            base:new NumberField({ initial: 0, integer: true, nullable: false }),
            baseBonus:new ObjectField(),
            baseMalus:new ObjectField(),
            baseOverride:new ObjectField(),
            bonus:new ObjectField(),
            malus:new ObjectField(),
            override:new ObjectField(),
            divide:new ObjectField(),
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

  get baseOverdrive() {
    let base = this.overdrive.base;
    const bonus = Object.values(this.overdrive.baseBonus).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
    const malus = Object.values(this.overdrive.baseMalus).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
    const override = Object.values(this.overdrive.baseOverride).reduce((max, curr) => Math.max(max, Number(curr) || 0), 0);

    if(override > 0) base = override;
    else {
      base += bonus;
      base -= malus;
    }

    return Math.max(base, 0);
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
    const divide = Object.values(this.overdrive.divide).reduce((max, curr) => Math.max(max, Number(curr) || 0), 0);
    const bonusOverdrive = Object.values(this.overdrive.bonus).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
    const malusOverdrive = Object.values(this.overdrive.malus).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
    const mod = divide > 0 ? Math.floor((bonusOverdrive - malusOverdrive) / divide) : (bonusOverdrive - malusOverdrive);
    const base = this.baseOverdrive;

    Object.defineProperty(this.overdrive, 'base', {
      value: base,
    });

    Object.defineProperty(this.overdrive, 'value', {
      value: Math.max(base + mod, 0),
    });
  }

  _overdriveOverride(override) {
    Object.defineProperty(this.overdrive, 'value', {
      value: override,
    });
  }

  _caracteristiqueSum(aspect) {
      const divide = Object.values(this.divide).reduce((max, curr) => Math.max(max, Number(curr) || 0), 0);
      const bonus = Object.values(this.bonus).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
      const malus = Object.values(this.malus).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
      const bonusOpti = Object.values(this.optimisation.bonus).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
      const malusOpti = Object.values(this.optimisation.malus).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
      const base = divide > 0 ? Math.floor(this.base/divide) : this.base;

      Object.defineProperty(this, 'value', {
        value: Math.max(Math.min(aspect, base+bonus-malus)+(bonusOpti-malusOpti), 0),
      });
  }

  _caracteristiqueOverride(override) {
      Object.defineProperty(this, 'value', {
        value: override,
      });
  }
}