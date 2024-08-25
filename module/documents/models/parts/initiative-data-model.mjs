
export class InitiativeDataModel extends foundry.abstract.DataModel {
	static defineSchema() {
      const {NumberField, SchemaField, ObjectField, StringField} = foundry.data.fields;

      return {
        complet:new StringField({initial:'3D6'}),
        base:new NumberField({initial:0, min:0, nullable:false, integer: true}),
        mod:new NumberField({initial:0, min:0, nullable:false, integer: true}),
        value:new NumberField({initial:0, min:0, nullable:false, integer: true}),
        dice:new NumberField({initial:0, min:0, nullable:false, integer: true}),
        diceBase:new NumberField({initial:3, min:0, nullable:false, integer: true}),
        diceMod:new NumberField({initial:0, min:0, nullable:false, integer: true}),
        diceBonus:new ObjectField(),
        diceMalus:new ObjectField(),
        bonus:new ObjectField({
          initial:{
            user:0,
          }
        }),
        malus:new ObjectField({
          initial:{
            user:0,
          }
        }),
        embuscade:new SchemaField({
          bonus:new ObjectField(),
          malus:new ObjectField(),
          diceBonus:new ObjectField(),
          diceMalus:new ObjectField(),
        })
      };
    }

    prepareData() {
      Object.defineProperty(this, 'dice', {
          value: this.diceBase+this.diceMod,
      });

      Object.defineProperty(this, 'value', {
          value: Math.max(this.base+this.mod, 0),
      });

      Object.defineProperty(this, 'complet', {
          value: `${this.dice}D6+${this.value}`,
      });
    }
}