
export class GrenadesDataModel extends foundry.abstract.DataModel {
	static defineSchema() {
      const {NumberField, SchemaField, ObjectField} = foundry.data.fields;

      return {
        liste:new ObjectField({initial:CONFIG.KNIGHT.LIST.grenades}),
        quantity:new SchemaField({
          max:new NumberField({initial:5, min:0}),
          value:new NumberField({initial:5, min:0}),
        }),
      };
    }
}