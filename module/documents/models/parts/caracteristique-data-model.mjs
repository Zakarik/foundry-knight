
export class CaracteristiqueDataModel extends foundry.abstract.DataModel {
	static defineSchema() {
        const {NumberField, SchemaField, ObjectField} = foundry.data.fields;

      return {
        base:new NumberField({ initial: 0, integer: true, nullable: false }),
        bonus:new NumberField({ initial: 0, integer: true, nullable: false }),
        malus:new NumberField({ initial: 0, integer: true, nullable: false }),
        value:new NumberField({ initial: 0, integer: true, nullable: false }),
        overdrive:new SchemaField({
            base:new NumberField({ initial: 0, integer: true, nullable: false }),
            bonus:new ObjectField(),
            malus:new ObjectField(),
            value:new NumberField({ initial: 0, integer: true, nullable: false }),
        }),
      };
    }

    prepareData(aspect) {
      const bonusOverdrive = Object.values(this.overdrive.bonus).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
      const malusOverdrive = Object.values(this.overdrive.malus).reduce((acc, curr) => acc + (Number(curr) || 0), 0);

      Object.defineProperty(this, 'value', {
        value: Math.max(Math.min(aspect, this.base+this.bonus-this.malus), 0),
      });

      Object.defineProperty(this.overdrive, 'value', {
        value: Math.max(this.overdrive.base+bonusOverdrive-malusOverdrive, 0),
      });
    }
}