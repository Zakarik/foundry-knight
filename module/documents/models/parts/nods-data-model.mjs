
export class NodsDataModel extends foundry.abstract.DataModel {
	static defineSchema() {
      const {NumberField, StringField, SchemaField, ObjectField} = foundry.data.fields;

      return {
        armure:new SchemaField({
          value:new NumberField({initial:0, min:0, nullable:false, integer: true}),
          max:new NumberField({initial:0, min:0, nullable:false, integer: true}),
        }),
        energie:new SchemaField({
          value:new NumberField({initial:0, min:0, nullable:false, integer: true}),
          max:new NumberField({initial:0, min:0, nullable:false, integer: true}),
        }),
        soin:new SchemaField({
          value:new NumberField({initial:0, min:0, nullable:false, integer: true}),
          max:new NumberField({initial:0, min:0, nullable:false, integer: true}),
        }),
      };
    }
}