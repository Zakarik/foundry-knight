
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
}